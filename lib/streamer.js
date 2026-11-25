'use strict';

// Download em streaming: o yt-dlp busca o vídeo (ele já lida com proxy,
// cookies e cliente do YouTube) e escreve na saída padrão. O ffmpeg apenas
// remuxa essa saída para MP4 fragmentado e entrega ao navegador byte a byte.
// Assim o arquivo começa a chegar segundos após o clique, sem esperar o
// download inteiro terminar em disco no servidor.

const { spawn } = require('node:child_process');
const youtubedl = require('youtube-dl-exec');
const { baseFlags, YOUTUBE_PROXY } = require('./downloader');

const STREAM_TIMEOUT_MS = 15 * 60_000;
const YT_BINARY = youtubedl.constants.YOUTUBE_DL_PATH;
const DEGRADED_CLIENTS = ['youtube:player_client=tv_embedded,android,android_vr,web'];

let ffmpegPath = null;
try {
  ffmpegPath = require('ffmpeg-static');
} catch {
  ffmpegPath = null;
}

function stopChild(child) {
  try {
    if (child && !child.killed) child.kill();
  } catch {
    /* ignore */
  }
}

function spawnYtDlp({ url, platform, option, selector, degraded, signal }) {
  const flags = {
    ...baseFlags(platform),
    output: '-',
    format: selector
  };
  if (YOUTUBE_PROXY) flags.proxy = YOUTUBE_PROXY;
  if (degraded && platform === 'youtube') flags.extractorArgs = DEGRADED_CLIENTS;

  if (option.kind !== 'audio') flags.mergeOutputFormat = 'mp4';

  const args = [...youtubedl.args(flags), '--', url];
  const child = spawn(YT_BINARY, args, { stdio: ['ignore', 'pipe', 'pipe'] });
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
          Object.assign(new Error(stderr || `yt-dlp encerrou com código ${code}.`), {
            stderr,
            exitCode: code,
            detail: stderr
          })
        );
      }
    });
  });

  return {
    child,
    done,
    cleanup: () => {
      clearTimeout(timer);
      if (signal) signal.removeEventListener('abort', abort);
    }
  };
}

function spawnFfmpeg(signal, audio) {
  if (!ffmpegPath) throw new Error('ffmpeg indisponível no servidor.');

  // A saída do yt-dlp com "-o -" é MPEG-TS (não é seekable). O ffmpeg só
  // remuxa para MP4 fragmentado ou converte o áudio para MP3, sem acessar rede.
  const args = audio
    ? [
        '-hide_banner',
        '-loglevel',
        'error',
        '-i',
        'pipe:0',
        '-vn',
        '-c:a',
        'libmp3lame',
        '-q:a',
        '0',
        '-f',
        'mp3',
        'pipe:1'
      ]
    : [
        '-hide_banner',
        '-loglevel',
        'error',
        '-i',
        'pipe:0',
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

  const child = spawn(ffmpegPath, args, { stdio: ['pipe', 'pipe', 'pipe'] });
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
            exitCode: code,
            detail: stderr
          })
        );
      }
    });
  });

  return {
    child,
    done,
    cleanup: () => {
      clearTimeout(timer);
      if (signal) signal.removeEventListener('abort', abort);
    }
  };
}

function firstChunk(stream, done) {
  return new Promise((resolve, reject) => {
    let settled = false;
    const settle = (callback, value) => {
      if (settled) return;
      settled = true;
      stream.removeListener('data', onData);
      callback(value);
    };
    const onData = (chunk) => {
      stream.pause();
      settle(resolve, chunk);
    };
    stream.on('data', onData);
    done.then(
      () => settle(reject, new Error('O arquivo terminou antes de começar a ser enviado.')),
      (error) => settle(reject, error)
    );
  });
}

async function attempt({ url, platform, option, selector, degraded, signal }) {
  const audio = option.kind === 'audio';
  const yt = spawnYtDlp({ url, platform, option, selector, degraded, signal });
  let ff = null;
  let output = yt.child.stdout;
  let contentType = 'audio/mpeg';
  let done = yt.done;

  try {
    {
      ff = spawnFfmpeg(signal, audio);
      yt.child.stdout.on('error', (error) => ff.child.stdin.destroy(error));
      yt.child.stdout.pipe(ff.child.stdin);
      output = ff.child.stdout;
      contentType = audio ? 'audio/mpeg' : 'video/mp4';
      done = Promise.all([yt.done, ff.done]).then(
        () => undefined,
        (error) => {
          stopChild(yt.child);
          stopChild(ff.child);
          throw error;
        }
      );
    }

    const chunk = await firstChunk(output, done);
    return {
      stdout: output,
      firstChunk: chunk,
      done,
      contentType,
      cleanup: () => {
        yt.cleanup();
        if (ff) ff.cleanup();
      }
    };
  } catch (error) {
    stopChild(yt.child);
    if (ff) stopChild(ff.child);
    yt.cleanup();
    if (ff) ff.cleanup();
    throw error;
  }
}

async function createStream({ url, platform, option, signal }) {
  const selectors = [option.selector, ...(option.fallbacks || [])].filter(Boolean);
  const attempts = [];
  for (const degraded of [false, true]) {
    for (const selector of selectors) {
      attempts.push({ selector, degraded });
    }
  }

  let lastError = null;
  for (const config of attempts) {
    try {
      const stream = await attempt({ url, platform, option, signal, ...config });
      return stream;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error('Não foi possível iniciar o download.');
}

module.exports = { createStream };
