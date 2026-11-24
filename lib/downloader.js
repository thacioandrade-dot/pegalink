'use strict';

const fs = require('node:fs');
const fsp = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const { randomUUID } = require('node:crypto');
const youtubedl = require('youtube-dl-exec');

let ffmpegPath = null;
try {
  ffmpegPath = require('ffmpeg-static');
} catch {
  ffmpegPath = null;
}

const INFO_TIMEOUT_MS = 45_000;
const DOWNLOAD_TIMEOUT_MS = 15 * 60_000;
const MAX_CONCURRENT_DOWNLOADS = 2;

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

  return {
    noWarnings: true,
    noPlaylist: true,
    noCheckCertificates: true,
    socketTimeout: 30,
    retries: 2,
    addHeader: headers
  };
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

  if (/private|privado/.test(raw)) {
    return new DownloadError('Este vídeo é privado ou não está disponível publicamente.', detail);
  }
  if (/sign in|log in|login|authentication|cookies/.test(raw)) {
    return new DownloadError('Este vídeo parece exigir login. Vídeos públicos funcionam melhor.', detail);
  }
  if (/unavailable|removed|not available|deleted|gone/.test(raw)) {
    return new DownloadError('O vídeo não está mais disponível.', detail);
  }
  if (/unsupported url|no video formats|unable to extract/.test(raw)) {
    return new DownloadError('Não foi possível reconhecer este link. Confira se ele aponta para um vídeo.', detail);
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

  return new DownloadError('Não foi possível processar este vídeo.', detail);
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
    const info = await runYtDlp(
      url,
      {
        ...baseFlags(platform),
        dumpSingleJson: true,
        skipDownload: true
      },
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

async function startDownload({ url, platform, option, signal }) {
  const directory = await fsp.mkdtemp(path.join(os.tmpdir(), 'pegalink-'));
  const base = randomUUID();

  try {
    const outputTemplate = path.join(directory, base);
    const flags = {
      ...baseFlags(platform),
      output: outputTemplate,
      format: option.selector
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

    await runYtDlp(url, flags, DOWNLOAD_TIMEOUT_MS, signal);

    const filePath = await findOutputFile(directory, base);
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
