'use strict';

function buildFormatOptions(info) {
  const formats = Array.isArray(info.formats) ? info.formats : [];

  const heights = new Set();
  for (const format of formats) {
    const hasVideo = format.vcodec && format.vcodec !== 'none';
    const height = Number(format.height);
    if (hasVideo && Number.isFinite(height) && height >= 240) {
      heights.add(height);
    }
  }

  const sorted = [...heights].sort((a, b) => b - a);
  const options = [];
  const usedIds = new Set();

  function add(option) {
    if (usedIds.has(option.id)) return;
    usedIds.add(option.id);
    options.push(option);
  }

  add({
    id: 'best',
    label: 'Melhor qualidade',
    detail: 'Vídeo + áudio no máximo disponível',
    ext: 'mp4',
    kind: 'video',
    selector: 'bestvideo+bestaudio/best'
  });

  const preferredHd = [1080, 720].filter((height) => sorted.includes(height));
  const hdHeights = preferredHd.length
    ? preferredHd
    : sorted.filter((height) => height >= 720).slice(0, 2);
  for (const height of hdHeights) {
    add({
      id: `${height}p`,
      label: `${height}p HD`,
      detail: 'Vídeo + áudio',
      ext: 'mp4',
      kind: 'video',
      selector: `bestvideo[height<=${height}]+bestaudio/best[height<=${height}]/best`
    });
  }

  for (const height of [480, 360]) {
    if (sorted.includes(height)) {
      add({
        id: `${height}p`,
        label: `${height}p`,
        detail: 'Vídeo + áudio, arquivo menor',
        ext: 'mp4',
        kind: 'video',
        selector: `bestvideo[height<=${height}]+bestaudio/best[height<=${height}]/best`
      });
    }
  }

  add({
    id: 'audio',
    label: 'Áudio MP3',
    detail: 'Somente áudio, alta qualidade',
    ext: 'mp3',
    kind: 'audio',
    selector: 'bestaudio/best'
  });

  return options;
}

function summarizeInfo(info, platform) {
  return {
    id: info.id || null,
    platform,
    title: info.title || 'Vídeo sem título',
    uploader: info.uploader || info.channel || info.creator || null,
    duration: Number(info.duration) || null,
    thumbnail: info.thumbnail || null,
    formats: buildFormatOptions(info)
  };
}

// Selectores fixos: o cliente escolhe apenas um ID, nunca um comando livre.
const FIXED_SELECTORS = {
  best: { selector: 'bestvideo+bestaudio/best', ext: 'mp4', kind: 'video' },
  audio: { selector: 'bestaudio/best', ext: 'mp3', kind: 'audio' }
};

function resolveOption(id) {
  if (Object.prototype.hasOwnProperty.call(FIXED_SELECTORS, id)) {
    return { id, ...FIXED_SELECTORS[id] };
  }

  const match = /^(\d{3,4})p$/.exec(String(id || ''));
  if (match) {
    const height = Number(match[1]);
    if (height >= 240 && height <= 4320) {
      return {
        id,
        selector: `bestvideo[height<=${height}]+bestaudio/best[height<=${height}]/best`,
        ext: 'mp4',
        kind: 'video'
      };
    }
  }

  return null;
}

module.exports = { buildFormatOptions, summarizeInfo, resolveOption };
