'use strict';

// Download em streaming: o arquivo começa a ser enviado para o navegador
// assim que o ffmpeg produz os primeiros bytes. Antes, o servidor esperava o
// arquivo inteiro terminar em disco para só então começar a transferência —
// era isso que deixava a etapa "Baixando…" demorada.

const { spawn } = require('node:child_process');
const { getVideoInfo } = require('./downloader');

const STREAM_TIMEOUT_MS = 15 * 60_000;
const RAW_INFO_TTL = 8 * 60_000;
const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

let ffmpegPath = null;
try {
  ffmpegPath = require('ffmpeg-static');
} catch {
  ffmpegPath = null;
}

const rawInfoCache = new Map();

function cacheKey(platform, url) {
  return `${platform}:${url}`;
}

function primeInfo(url, platform, info) {
  if (!info || !Array.isArray(info.formats)) return;
  rawInfoCache.set(cacheKey(platform, url), { at: Date.now(), info });
  if (rawInfoCache.size > 40) {
    const oldest = rawInfoCache.keys().next().value;
    rawInfoCache.delete(oldest);
  }
}

async function loadInfo(url, platform) {
  const key = cacheKey(platform, url);
  const cached = rawInfoCache.get(key);
  if (cached && Date.now() - cached.at < RAW_INFO_TTL) return cached.info;

  const info = await getVideoInfo(url, platform);
  primeInfo(url, platform, info);
  return info;
}

function shortSide(format) {
  const width = Number(format.width) || 0;
  const height = Number(format.height) || 0;
  return Math.min(width, height) || null;
}

function hasVideo(format) {
  return Boolean(format.url && format.vcodec && format.vcodec !== 'none');
}

function hasAudio(format) {
  return Boolean(format.url && format.acodec && format.acodec !== 'none');
}

function isProgressive(format) {
  return hasVideo(format) && hasAudio(format);
}

function byBitrate(a, b) {
  return (Number(b.tbr) || Number(b.abr) || 0) - (Number(a.tbr) || Number(a.abr) || 0);
}

function pickAudio(formats) {
  const candidates = formats.filter(
    (format) => hasAudio(format) && (!format.vcodec || format.vcodec === 'none')
  );
  const m4a = candidates.filter((format) => format.ext === 'm4a' || /mp4a/.test(format.acodec));
  return (m4a.length ? m4a : candidates).sort(byBitrate)[0] || null;
}

function pickVideo(formats, target) {
  const candidates = formats.filter((format) => hasVideo(format) && !hasAudio(format));
  if (!candidates.length) return null;

  // Primeiro define o teto de resolução dentro do limite pedido, e só depois
  // prefere AVC/MP4 entre os formatos daquele mesmo teto. Assim o "Melhor
  // qualidade" não troca um 4K VP9 por um 1080p AVC só por causa do codec.
  let pool = candidates;
  if (target) {
    const fits = candidates.filter((format) => {
      const side = shortSide(format);
      return side !== null && side <= target;
    });
    pool = fits.length ? fits : candidates;
  }

  const maxSide = pool.reduce((max, format) => Math.max(max, shortSide(format) || 0), 0);
  const top = pool.filter((format) => (shortSide(format) || 0) === maxSide);
  const avc = top.filter(
    (format) => format.ext === 'mp4' && /^avc/i.test(format.vcodec || '')
  );
  return (avc.length ? avc : top).sort(byBitrate)[0] || null;
}

function pickProgressive(formats, target) {
  const candidates = formats.filter(isProgressive);
  if (!candidates.length) return null;
  const fits = target
    ? candidates.filter((format) => {
        const side = shortSide(format);
        return side !== null && side <= target;
      })
    : candidates;
  return (fits.length ? fits : candidates).sort(
    (a, b) => (shortSide(b) || 0) - (shortSide(a) || 0) || byBitrate(a, b)
  )[0];
}

function selectSources(info, platform, optionId) {
  const formats = Array.isArray(info.formats) ? info.formats : [];

  if (optionId === 'audio') {
    const audio = pickAudio(formats);
    if (!audio) throw new Error('Não há faixa de áudio disponível para este vídeo.');
    return { mode: 'audio', url: audio.url };
  }

  const exact = /^(?:orig|fullhd|fmt)-(.+)$/.exec(optionId);
  if (exact) {
    const format = formats.find(
      (item) => String(item.format_id) === exact[1] && item.url && isProgressive(item)
    );
    if (format) return { mode: 'single', url: format.url };
  }

  const match = /(\d{3,4})p/.exec(optionId);
  const target = optionId === 'best' ? null : match ? Number(match[1]) : null;
  const progressive = pickProgressive(formats, optionId === 'fast' ? 360 : target);
  if (progressive) return { mode: 'single', url: progressive.url };

  const video = pickVideo(formats, target);
  if (!video) throw new Error('Não há vídeo disponível para este vídeo.');
  const audio = pickAudio(formats);
  if (!audio) return { mode: 'single', url: video.url };
  return { mode: 'mux', video: video.url, audio: audio.url };
}

function inputArgs(url, platform) {
  if (platform === 'youtube') return ['-i', url];
  const referer =
    platform === 'tiktok' ? 'https://www.tiktok.com/' : 'https://www.instagram.com/';
  const headers = `User-Agent: ${USER_AGENT}\r\nReferer: ${referer}\r\n`;
  return ['-headers', headers, '-i', url];
}

function buildArgs(source, platform, mode) {
  const common = ['-hide_banner', '-loglevel', 'error'];

  if (mode === 'audio') {
    return [
      ...common,
      ...inputArgs(source.url, platform),
      '-vn',
      '-c:a',
      'libmp3lame',
      '-q:a',
      '0',
      '-f',
      'mp3',
      'pipe:1'
    ];
  }

  if (mode === 'single') {
    return [
      ...common,
      ...inputArgs(source.url, platform),
      '-map',
      '0',
      '-c',
      'copy',
      '-movflags',
      '+frag_keyframe+empty_moov',
      '-f',
      'mp4',
      'pipe:1'
    ];
  }

  return [
    ...common,
    ...inputArgs(source.video, platform),
    ...inputArgs(source.audio, platform),
    '-map',
    '0:v:0',
    '-map',
    '1:a:0',
    '-c',
    'copy',
    '-movflags',
    '+frag_keyframe+empty_moov',
    '-f',
    'mp4',
    'pipe:1'
  ];
}

function runFfmpeg(args, signal) {
  if (!ffmpegPath) {
    return Promise.reject(new Error('ffmpeg indisponível no servidor.'));
  }

  const child = spawn(ffmpegPath, args, { stdio: ['ignore', 'pipe', 'pipe'] });
  let stderr = '';
  child.stderr.on('data', (chunk) => {
    stderr = (stderr + chunk.toString()).slice(-4000);
  });

  const timer = setTimeout(() => child.kill(), STREAM_TIMEOUT_MS);
  const abort = () => child.kill();
  if (signal) signal.addEventListener('abort', abort, { once: true });

  const done = new Promise((resolve, reject) => {
    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) resolve();
      else {
        reject(
          Object.assign(new Error(stderr || `ffmpeg encerrou com código ${code}.`), {
            stderr,
            exitCode: code
          })
        );
      }
    });
  });

  return Promise.resolve({
    stdout: child.stdout,
    done,
    contentType: args.includes('mp3') ? 'audio/mpeg' : 'video/mp4',
    cleanup: () => {
      clearTimeout(timer);
      if (signal) signal.removeEventListener('abort', abort);
    }
  });
}

async function createStream({ url, platform, optionId, signal }) {
  const info = await loadInfo(url, platform);
  const source = selectSources(info, platform, optionId);
  return runFfmpeg(buildArgs(source, platform, source.mode), signal);
}

module.exports = { createStream, primeInfo, selectSources };
