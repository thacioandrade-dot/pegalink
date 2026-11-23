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

app.disable('x-powered-by');
app.use(express.json({ limit: '16kb' }));

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
  res.type('text/plain');
  res.send(`User-agent: *\nAllow: /\nSitemap: ${siteBase(req)}/sitemap.xml\n`);
});

app.get('/sitemap.xml', (req, res) => {
  const now = new Date().toISOString();
  res.type('application/xml');
  res.send(
    '<?xml version="1.0" encoding="UTF-8"?>' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
    `<url><loc>${siteBase(req)}/</loc><lastmod>${now}</lastmod>` +
    '<changefreq>weekly</changefreq><priority>1.0</priority></url>' +
    '</urlset>'
  );
});

app.post('/api/info', rateLimit, async (req, res) => {
  const { url, platform } = validateVideoUrl(req.body?.url);
  const info = await getVideoInfo(url, platform);

  res.set('Cache-Control', 'no-store');
  res.json(summarizeInfo(info, platform));
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

app.use(express.static(path.join(__dirname, 'public'), { index: 'index.html' }));

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
