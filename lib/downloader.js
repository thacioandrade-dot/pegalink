'use strict';

const fs = require('node:fs');
const fsp = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const { execFile } = require('node:child_process');
const { promisify } = require('node:util');
const { randomUUID } = require('node:crypto');
const youtubedl = require('youtube-dl-exec');

const execFileAsync = promisify(execFile);

let ffmpegPath = null;
try {
  ffmpegPath = require('ffmpeg-static');
} catch {
  ffmpegPath = null;
}

const INFO_TIMEOUT_MS = 45_000;
const DOWNLOAD_TIMEOUT_MS = 15 * 60_000;
const MAX_CONCURRENT_DOWNLOADS = 2;
const YOUTUBE_PROXY = process.env.YOUTUBE_PROXY || '';

const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

const REFERERS = {
  youtube: 'https://www.youtube.com/',
  tiktok: 'https://www.tiktok.com/',
  instagram: 'https://www.instagram.com/'
};

class DownloadError extends Error {
  constructor(message, detail = '') {
    super(message);
    this.name = 'DownloadError';
    this.status = 502;
    this.detail = detail;
  }
}

let activeDownloads = 0;

function canStartDownload() {
  return activeDownloads < MAX_CONCURRENT_DOWNLOADS;
}

function releaseDownloadSlot() {
  activeDownloads = Math.max(0, activeDownloads - 1);
}

function acquireDownloadSlot() {
  activeDownloads += 1;
}

function baseFlags(platform) {
  const headers = [`user-agent:${USER_AGENT}`];
  if (REFERERS[platform]) headers.push(`referer:${REFERERS[platform]}`);

  const flags = {
    noWarnings: true,
    noPlaylist: true,
    noCheckCertificates: true,
    socketTimeout: 30,
    retries: 2,
    addHeader: headers
  };

  // O cliente tv_embedded evita o aviso "Sign in to confirm you're not a bot"
  // em IPs de datacenter e, ao contrário de android/web, devolve os formatos
  // DASH completos (720p, 1080p etc.). Os outros clientes só oferecem 360p.
  if (platform === 'youtube') {
    flags.extractorArgs = ['youtube:player_client=tv_embedded'];
    flags.forceIpv4 = true;
  }

  // A API mobile do TikTok costuma devolver mais variações de taxa de bits do
  // que a página web. Se falhar, o yt-dlp tenta a página automaticamente.
  if (platform === 'tiktok') {
    flags.extractorArgs = ['tiktok:app_info=7352498712345678901'];
  }

  return flags;
}

function isProxyFailure(error) {
  const raw = String(error?.stderr || error?.message || error || '').toLowerCase();
  return /proxy|socks|connection refused|could not connect|network is unreachable|tunnel/.test(raw);
}

function isClientFailure(error) {
  const raw = String(error?.stderr || error?.message || error || '').toLowerCase();
  return /not a bot|confirm you.re|sign in|please sign in|video unavailable|page needs to be reloaded|requested format|no video formats/.test(raw);
}

async function runWithProxyFallback(url, flags, timeoutMs, signal) {
  if (!YOUTUBE_PROXY) {
    return runYtDlp(url, flags, timeoutMs, signal);
  }

  try {
    return await runYtDlp(url, { ...flags, proxy: YOUTUBE_PROXY }, timeoutMs, signal);
  } catch (error) {
    if (!isProxyFailure(error)) throw error;
    // Se o túnel WARP cair, ainda tenta a conexão direta.
    return runYtDlp(url, flags, timeoutMs, signal);
  }
}

async function runForPlatform(url, flags, platform, timeoutMs, signal) {
  if (platform !== 'youtube') {
    return runYtDlp(url, flags, timeoutMs, signal);
  }

  try {
    return await runWithProxyFallback(url, flags, timeoutMs, signal);
  } catch (error) {
    if (!isClientFailure(error)) throw error;
    // Último recurso: clientes mais antigos, que só entregam 360p, mas
    // funcionam quando o YouTube muda a resposta do tv_embedded.
    const degradedFlags = {
      ...flags,
      extractorArgs: ['youtube:player_client=tv_embedded,android,android_vr,web']
    };
    return runWithProxyFallback(url, degradedFlags, timeoutMs, signal);
  }
}

function cleanDetail(error) {
  const raw = typeof error === 'string'
    ? error
    : String(error?.stderr || error?.message || error || 'Erro desconhecido');
  const firstLines = raw
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(-3)
    .join(' ');

  return firstLines
    .replace(/[A-Za-z]:\\[^\s"']+/g, '[caminho]')
    .replace(/\/[\w.\-/]+(?:\s|$)/g, '[caminho] ')
    .slice(0, 350);
}

function friendlyError(error) {
  const raw = String(error?.stderr || error?.message || error || '').toLowerCase();
  const detail = cleanDetail(error);

  // "Requested format is not available" fala do formato, não do vídeo.
  if (/requested format|no video formats|unsupported url|unable to extract/.test(raw)) {
    return new DownloadError('Essa qualidade não está disponível para este vídeo. Tente outra opção da lista.', detail);
  }
  if (/not a bot|confirm you.re|bot check|cookies-from-browser/.test(raw)) {
    return new DownloadError('O YouTube bloqueou este acesso como bot. Tente novamente em instantes ou use outra rede.', detail);
  }
  if (/private|privado/.test(raw)) {
    return new DownloadError('Este vídeo é privado ou não está disponível publicamente.', detail);
  }
  if (/sign in|log in|login|authentication|cookies/.test(raw)) {
    return new DownloadError('Este vídeo parece exigir login. Vídeos públicos funcionam melhor.', detail);
  }
  if (/age|restricted/.test(raw)) {
    return new DownloadError('Este vídeo tem restrição de idade e não pode ser baixado aqui.', detail);
  }
  if (/blocked|bloque/.test(raw)) {
    return new DownloadError('A plataforma bloqueou o acesso a partir deste IP. Tente outra rede (por exemplo, seu celular no 4G/5G).', detail);
  }
  if (/timeout|timed out|tempo limite/.test(raw)) {
    return new DownloadError('O serviço demorou demais para responder. Tente novamente.', detail);
  }
  if (/unavailable|removed|not available|deleted|gone/.test(raw)) {
    return new DownloadError('O vídeo não está mais disponível.', detail);
  }

  return new DownloadError('Não foi possível processar este vídeo.', detail);
}

function isRecoverableFormatError(error) {
  const raw = String(error?.stderr || error?.message || error || '').toLowerCase();
  if (/requested format|no video formats/.test(raw)) {
    return true;
  }
  if (/not a bot|confirm you.re|unavailable|removed|deleted|private|sign in|log in|login|authentication|blocked|age|restricted|timeout|tempo limite/.test(raw)) {
    return false;
  }
  return true;
}

async function runYtDlp(url, flags, timeoutMs, signal) {
  const subprocess = youtubedl.exec(url, flags);
  let timer;

  const stop = () => {
    try {
      subprocess.kill();
    } catch {
      /* ignore */
    }
  };

  const timeoutPromise = new Promise((_, reject) => {
    timer = setTimeout(() => {
      stop();
      reject(new Error('Tempo limite excedido'));
    }, timeoutMs);
  });

  if (signal) signal.addEventListener('abort', stop, { once: true });

  try {
    const child = await Promise.race([subprocess, timeoutPromise]);

    // tinyspawn expõe o stdout já acumulado através do getter `stdout`.
    const stdout = child.stdout;
    if (typeof stdout === 'string' && stdout.trimStart().startsWith('{')) {
      return JSON.parse(stdout);
    }
    return stdout;
  } finally {
    clearTimeout(timer);
    if (signal) signal.removeEventListener('abort', stop);
  }
}

async function getVideoInfo(url, platform) {
  try {
    const info = await runForPlatform(
      url,
      {
        ...baseFlags(platform),
        dumpSingleJson: true,
        skipDownload: true
      },
      platform,
      INFO_TIMEOUT_MS
    );

    if (!info || typeof info !== 'object') {
      throw new Error('Resposta inválida do extrator');
    }
    return info;
  } catch (error) {
    throw friendlyError(error);
  }
}

async function findOutputFile(directory, base) {
  const entries = await fsp.readdir(directory);
  const candidates = entries
    .filter((name) => name.startsWith(base))
    .filter((name) => !/\.(part|ytdl|frag)$/i.test(name))
    .map((name) => path.join(directory, name));

  const stats = await Promise.all(
    candidates.map(async (filePath) => {
      try {
        const stat = await fsp.stat(filePath);
        return { filePath, size: stat.size };
      } catch {
        return null;
      }
    })
  );

  const valid = stats.filter((item) => item && item.size > 0);
  if (!valid.length) throw new DownloadError('O download terminou, mas o arquivo não foi encontrado.');

  const preferred = valid.find((item) => /\.(mp4|mp3|webm|m4a)$/i.test(item.filePath));
  const chosen = preferred || valid.sort((a, b) => b.size - a.size)[0];

  return chosen.filePath;
}

function mimeFromPath(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.mp3') return 'audio/mpeg';
  if (ext === '.m4a') return 'audio/mp4';
  if (ext === '.webm') return 'video/webm';
  return 'video/mp4';
}

// Reduz o lado curto (largura em retrato, altura em paisagem) sem esticar a
// imagem. Usado quando o TikTok não oferece um arquivo menor separado.
async function resizeVideo(inputPath, side, crf) {
  if (!ffmpegPath || !fs.existsSync(ffmpegPath)) return inputPath;

  const extension = path.extname(inputPath) || '.mp4';
  const outputPath = inputPath.slice(0, -extension.length) + `-${side}p${extension}`;
  const isPortrait = `lt(iw\\,ih)`;
  const filter = `scale=if(${isPortrait}\\,${side}\\,-2):if(${isPortrait}\\,-2\\,${side})`;

  await execFileAsync(
    ffmpegPath,
    [
      '-hide_banner',
      '-loglevel',
      'error',
      '-y',
      '-i',
      inputPath,
      '-vf',
      filter,
      '-c:v',
      'libx264',
      '-preset',
      'veryfast',
      '-crf',
      String(crf),
      '-pix_fmt',
      'yuv420p',
      '-c:a',
      'aac',
      '-b:a',
      '128k',
      '-movflags',
      '+faststart',
      outputPath
    ],
    { timeout: DOWNLOAD_TIMEOUT_MS, maxBuffer: 1024 * 1024 }
  );

  return outputPath;
}

async function startDownload({ url, platform, option, signal }) {
  const directory = await fsp.mkdtemp(path.join(os.tmpdir(), 'pegalink-'));
  const base = randomUUID();

  try {
    const outputTemplate = path.join(directory, base);
    const selectors = [option.selector, ...(option.fallbacks || [])];
    let lastError = null;

    for (const selector of selectors) {
      // Remove arquivos de uma tentativa anterior para não escolher o errado.
      const leftovers = await fsp.readdir(directory).catch(() => []);
      await Promise.all(
        leftovers.map((name) => fsp.rm(path.join(directory, name), { recursive: true, force: true }).catch(() => {}))
      );

      const flags = {
        ...baseFlags(platform),
        output: outputTemplate,
        format: selector
      };

      if (ffmpegPath && fs.existsSync(ffmpegPath)) {
        flags.ffmpegLocation = ffmpegPath;
      }

      if (option.kind === 'audio') {
        flags.extractAudio = true;
        flags.audioFormat = 'mp3';
        flags.audioQuality = '0';
      } else {
        flags.mergeOutputFormat = 'mp4';
      }

      try {
        await runForPlatform(url, flags, platform, DOWNLOAD_TIMEOUT_MS, signal);
        const downloaded = await findOutputFile(directory, base);
        const filePath = option.resize
          ? await resizeVideo(downloaded, option.resize, option.crf)
          : downloaded;
        const stat = await fsp.stat(filePath);

        return {
          filePath,
          mimeType: mimeFromPath(filePath),
          size: stat.size,
          cleanup: async () => {
            await fsp.rm(directory, { recursive: true, force: true });
          }
        };
      } catch (error) {
        lastError = error;
        if (!isRecoverableFormatError(error)) break;
      }
    }

    throw lastError || new DownloadError('Não foi possível baixar este vídeo.');
  } catch (error) {
    await fsp.rm(directory, { recursive: true, force: true }).catch(() => {});
    throw error instanceof DownloadError ? error : friendlyError(error);
  }
}

module.exports = {
  DownloadError,
  getVideoInfo,
  startDownload,
  canStartDownload,
  acquireDownloadSlot,
  releaseDownloadSlot,
  MAX_CONCURRENT_DOWNLOADS
};
