'use strict';

const path = require('node:path');
const fs = require('node:fs');
const express = require('express');

const {
  ValidationError,
  validateVideoUrl,
  sanitizeFilename
} = require('./lib/validate');
const { summarizeInfo, resolveOption } = require('./lib/formats');
const { getPages, findPage, renderPage, escapeHtml } = require('./lib/seo');
const {
  getVideoInfo,
  startDownload,
  canStartDownload,
  acquireDownloadSlot,
  releaseDownloadSlot,
  MAX_CONCURRENT_DOWNLOADS
} = require('./lib/downloader');

const app = express();
const PORT = Number(process.env.PORT) || 3000;

const RATE_WINDOW_MS = 60_000;
const RATE_LIMIT = 25;
const hits = new Map();

// Evita consultar o yt-dlp de novo quando a mesma pessoa cola o mesmo link.
// 10 minutos é tempo suficiente para acelerar a navegação sem deixar a lista
// de formatos desatualizada por muito tempo.
const INFO_CACHE_TTL = 10 * 60 * 1000;
const INFO_CACHE_MAX = 200;
const infoCache = new Map();

app.disable('x-powered-by');
app.use((req, res, next) => {
  res.set('X-Content-Type-Options', 'nosniff');
  res.set('X-Frame-Options', 'SAMEORIGIN');
  // Não há links externos na interface: não exportar nada sobre quem está usando.
  res.set('Referrer-Policy', 'no-referrer');
  res.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=(), usb=()');
  res.set('Cross-Origin-Opener-Policy', 'same-origin');
  const protocol = String(req.get('x-forwarded-proto') || req.protocol || '')
    .split(',')[0]
    .trim();
  if (protocol === 'https') {
    res.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  next();
});

// Páginas públicas podem ficar em cache na CDN (Cloudflare) sem alterar o HTML:
// o navegador renova em 1h e a borda renova em 24h, reduzindo o despertar do Render.
function setPublicCache(res) {
  res.set('Cache-Control', 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400');
  res.set('CDN-Cache-Control', 'public, max-age=86400');
}
app.use(express.json({ limit: '16kb' }));

// O Render Free não oferece "Request logs". Registramos apenas as visitas às
// páginas HTML para que seja possível acompanhar os acessos em Application logs.
app.use((req, res, next) => {
  const isPageView =
    req.method === 'GET' &&
    !req.path.startsWith('/api/') &&
    !path.extname(req.path) &&
    !req.path.startsWith('/google');
  if (!isPageView) return next();
  res.on('finish', () => {
    console.log(`[acesso] ${new Date().toISOString()} ${req.path} ${res.statusCode}`);
  });
  return next();
});

function rateLimit(req, res, next) {
  const ip = req.ip || 'desconhecido';
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((time) => now - time < RATE_WINDOW_MS);

  if (recent.length >= RATE_LIMIT) {
    return res.status(429).json({
      error: 'Muitas requisições. Aguarde um minuto e tente novamente.'
    });
  }

  recent.push(now);
  hits.set(ip, recent);
  return next();
}

setInterval(() => {
  const now = Date.now();
  for (const [ip, times] of hits) {
    const recent = times.filter((time) => now - time < RATE_WINDOW_MS);
    if (recent.length) hits.set(ip, recent);
    else hits.delete(ip);
  }
}, 5 * 60_000).unref();

app.get('/api/health', (_req, res) => {
  res.set('Cache-Control', 'no-store');
  res.json({
    ok: true,
    service: 'PegaLink',
    platforms: ['youtube', 'tiktok', 'instagram'],
    maxConcurrentDownloads: MAX_CONCURRENT_DOWNLOADS
  });
});

function siteBase(req) {
  const protocol = String(req.get('x-forwarded-proto') || req.protocol || 'http')
    .split(',')[0]
    .trim();
  const host = String(req.get('host') || 'localhost:3000').replace(/[^a-zA-Z0-9.\-:]/g, '');
  return `${protocol}://${host}`;
}

app.get('/robots.txt', (req, res) => {
  const base = siteBase(req);
  setPublicCache(res);
  res.type('text/plain');
  res.send(
    'User-agent: *\n' +
    'Allow: /\n' +
    'Disallow: /api/\n' +
    '\n' +
    `Sitemap: ${base}/sitemap.xml\n`
  );
});

app.get('/sitemap.xml', (req, res) => {
  const base = siteBase(req);
  const lastmod = '2026-11-24';

  function entry(pathname, priority, changefreq) {
    const loc = `${base}${pathname}`;
    const safe = escapeHtml(loc);
    return (
      `<url><loc>${safe}</loc>` +
      `<xhtml:link rel="alternate" hreflang="pt-BR" href="${safe}"/>` +
      `<xhtml:link rel="alternate" hreflang="x-default" href="${safe}"/>` +
      `<lastmod>${lastmod}</lastmod><changefreq>${changefreq}</changefreq><priority>${priority}</priority></url>`
    );
  }

  const entries = [
    entry('/', '1.0', 'daily'),
    ...getPages().map((page, index) => {
      const priority = index < 3 ? '0.9' : '0.8';
      return entry(`/${page.slug}`, priority, 'weekly');
    })
  ].join('');

  setPublicCache(res);
  res.type('application/xml');
  res.send(
    '<?xml version="1.0" encoding="UTF-8"?>' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">' +
    entries +
    '</urlset>'
  );
});

for (const page of getPages()) {
  app.get(`/${page.slug}`, (req, res) => {
    setPublicCache(res);
    res.send(renderPage(page, siteBase(req)));
  });
}

// A homepage é um arquivo estático, mas seus metadados precisam sair do servidor
// já com a URL pública correta. O Google não deve ver `localhost` como canônico.
const homepagePath = path.join(__dirname, 'public', 'index.html');
app.get('/', (req, res) => {
  const base = siteBase(req);
  fs.readFile(homepagePath, 'utf8', (error, html) => {
    if (error) {
      return res.status(500).send('Não foi possível carregar a página inicial.');
    }
    setPublicCache(res);
    res.type('html').send(html.split('http://localhost:3000').join(base));
  });
});

app.post('/api/info', rateLimit, async (req, res) => {
  const { url, platform } = validateVideoUrl(req.body?.url);
  const key = `${platform}:${url}`;
  const cached = infoCache.get(key);

  if (cached && Date.now() - cached.at < INFO_CACHE_TTL) {
    res.set('X-Cache', 'HIT');
    res.set('Cache-Control', 'private, max-age=60');
    return res.json(cached.data);
  }

  const info = await getVideoInfo(url, platform);
  const data = summarizeInfo(info, platform);

  infoCache.set(key, { at: Date.now(), data });
  if (infoCache.size > INFO_CACHE_MAX) {
    const oldestKey = infoCache.keys().next().value;
    infoCache.delete(oldestKey);
  }

  res.set('X-Cache', 'MISS');
  res.set('Cache-Control', 'private, max-age=60');
  res.json(data);
});

app.post('/api/download', rateLimit, async (req, res) => {
  const body = req.body || {};
  const { url, platform } = validateVideoUrl(body.url);

  const option = resolveOption(body.quality);
  if (!option) {
    throw new ValidationError('Escolha um formato de download válido.');
  }

  if (!canStartDownload()) {
    return res.status(429).json({
      error: 'O servidor está ocupado com outros downloads. Tente novamente em instantes.'
    });
  }

  acquireDownloadSlot();

  const controller = new AbortController();
  let result = null;

  const cleanup = () => {
    if (result) result.cleanup().catch(() => {});
    result = null;
  };

  res.on('close', () => {
    if (!res.writableEnded) controller.abort();
    cleanup();
  });

  try {
    result = await startDownload({
      url,
      platform,
      option,
      signal: controller.signal
    });

    if (res.destroyed || res.writableEnded) {
      cleanup();
      return;
    }

    const baseName = sanitizeFilename(body.name, `${platform}_video`);
    const fileName = `${baseName}.${option.ext}`;
    const asciiName = fileName.replace(/[^\x20-\x7E]/g, '_');

    res.set('Content-Type', result.mimeType);
    res.set('Content-Length', String(result.size));
    res.set(
      'Content-Disposition',
      `attachment; filename="${asciiName}"; filename*=UTF-8''${encodeURIComponent(fileName)}`
    );
    res.set('Cache-Control', 'no-store');
    res.set('X-Content-Type-Options', 'nosniff');

    const stream = fs.createReadStream(result.filePath);
    stream.on('error', () => {
      if (!res.headersSent) res.status(500).json({ error: 'Falha ao enviar o arquivo.' });
      else res.destroy();
      cleanup();
    });
    stream.on('end', cleanup);
    stream.pipe(res);
  } catch (error) {
    cleanup();
    if (!res.headersSent) {
      res.status(error.status || 500).json({
        error: error.message || 'Erro interno no servidor.',
        detail: error.detail || undefined
      });
    }
  } finally {
    releaseDownloadSlot();
  }
});

app.use(express.static(path.join(__dirname, 'public'), {
  index: 'index.html',
  setHeaders(res, filePath) {
    // CSS, JS, SVG e imagens podem ficar na Cloudflare por 24h sem risco:
    // são arquivos públicos e imutáveis até o próximo deploy.
    if (/\.(?:css|js|svg|png|jpe?g|webp|ico|woff2?)$/i.test(filePath)) {
      res.set('Cache-Control', 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400');
      res.set('CDN-Cache-Control', 'public, max-age=86400');
    }
  }
}));

app.use((error, _req, res, _next) => {
  if (error instanceof SyntaxError && error.status === 400) {
    return res.status(400).json({ error: 'JSON inválido na requisição.' });
  }

  if (!error.status || error.status >= 500) {
    console.error('[erro]', error);
  }

  return res.status(error.status || 500).json({
    error: error.message || 'Erro interno no servidor.',
    detail: error.detail || undefined
  });
});

app.listen(PORT, () => {
  console.log(`PegaLink rodando em http://localhost:${PORT}`);
});
