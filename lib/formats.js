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
    detail: 'Vídeo + áudio no máximo disponível, sem queda automática para uma versão menor',
    ext: 'mp4',
    kind: 'video',
    selector: 'bestvideo+bestaudio'
  });

  // O limite HD do site é 720p; resoluções maiores ficam só na opção acima.
  if (sorted.includes(720)) {
    add({
      id: '720p',
      label: '720p',
      detail: 'Vídeo + áudio em alta definição, arquivo moderado',
      ext: 'mp4',
      kind: 'video',
      selector: 'bestvideo[height<=720]+bestaudio/best[height<=720]',
      fallbacks: ['best[height<=720]', 'best']
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
        selector: `bestvideo[height<=${height}]+bestaudio/best[height<=${height}]`,
        fallbacks: [`best[height<=${height}]`, 'best']
      });
    }
  }

  add({
    id: 'light',
    label: 'Qualidade leve',
    detail: 'Menor arquivo, ideal para celular ou dados móveis',
    ext: 'mp4',
    kind: 'video',
    selector: 'worstvideo+bestaudio',
    fallbacks: ['worstvideo[height>=240]+bestaudio/best[height<=360]', 'best[height<=360]', 'best']
  });

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
  best: {
    selector: 'bestvideo+bestaudio',
    fallbacks: ['bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]', 'best'],
    ext: 'mp4',
    kind: 'video'
  },
  light: {
    selector: 'worstvideo+bestaudio',
    fallbacks: ['worstvideo[height>=240]+bestaudio/best[height<=360]', 'best[height<=360]', 'best'],
    ext: 'mp4',
    kind: 'video'
  },
  audio: { selector: 'bestaudio/best', ext: 'mp3', kind: 'audio' }
};

function resolveOption(id) {
  if (Object.prototype.hasOwnProperty.call(FIXED_SELECTORS, id)) {
    return { id, ...FIXED_SELECTORS[id] };
  }

  const match = /^(\d{3,4})p$/.exec(String(id || ''));
  if (match) {
    const requested = Number(match[1]);
    if (requested >= 240 && requested <= 4320) {
      // Nenhuma opção numérica passa de 720p: acima disso, use "Melhor qualidade".
      const height = Math.min(requested, 720);
      return {
        id,
        selector: `bestvideo[height<=${height}]+bestaudio/best[height<=${height}]`,
        fallbacks: [`best[height<=${height}]`, 'best'],
        ext: 'mp4',
        kind: 'video'
      };
    }
  }

  return null;
}

module.exports = { buildFormatOptions, summarizeInfo, resolveOption };
