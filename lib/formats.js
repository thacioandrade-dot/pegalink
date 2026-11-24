'use strict';

function buildFormatOptions(info, platform) {
  const formats = Array.isArray(info.formats) ? info.formats : [];

  // O TikTok costuma expor poucos arquivos completos e com resoluções verticais.
  // Nesse caso, usar os IDs reais garante que "melhor" e "leve" sejam diferentes.
  if (platform === 'tiktok') {
    const videos = formats
      .filter((format) => format.vcodec && format.vcodec !== 'none' && format.format_id)
      .filter((format) => Number(format.height) > 0)
      .sort((a, b) => Number(b.height) - Number(a.height));

    if (videos.length) {
      const options = [];
      const best = videos[0];
      const light = videos[videos.length - 1];

      options.push({
        id: `fmt-${best.format_id}`,
        label: 'Melhor qualidade',
        detail: `Vídeo + áudio em ${best.width || '?'}×${best.height}, o maior disponível`,
        ext: 'mp4',
        kind: 'video',
        selector: String(best.format_id),
        fallbacks: ['best']
      });

      if (light.format_id !== best.format_id) {
        options.push({
          id: `fmt-${light.format_id}`,
          label: 'Qualidade leve',
          detail: `Vídeo + áudio em ${light.width || '?'}×${light.height}, arquivo menor`,
          ext: 'mp4',
          kind: 'video',
          selector: String(light.format_id),
          fallbacks: ['best[height<=1024]', 'best']
        });
      }

      options.push({
        id: 'audio',
        label: 'Áudio MP3',
        detail: 'Somente áudio, alta qualidade',
        ext: 'mp3',
        kind: 'audio',
        selector: 'bestaudio/best'
      });

      return options;
    }
  }

  // YouTube vertical (Shorts) usa largura como "lado curto": 720x1278 é um
  // vídeo 720p. Usar apenas `height` fazia o site oferecer 360p no lugar de 720p.
  const shortSides = new Set();
  for (const format of formats) {
    const hasVideo = format.vcodec && format.vcodec !== 'none';
    const width = Number(format.width);
    const height = Number(format.height);
    if (
      hasVideo &&
      Number.isFinite(width) && width > 0 &&
      Number.isFinite(height) && height > 0
    ) {
      const shortSide = Math.min(width, height);
      if (shortSide >= 240) shortSides.add(shortSide);
    }
  }

  const sorted = [...shortSides].sort((a, b) => b - a);
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
    selector: 'bestvideo[ext=mp4][vcodec^=avc]+bestaudio[ext=m4a]/bestvideo+bestaudio'
  });

  // Funciona para vídeos horizontais (altura = lado curto) e verticais (largura = lado curto).
  function resolutionSelector(max) {
    const byWidth = `bestvideo[width<=${max}][ext=mp4][vcodec^=avc]+bestaudio[ext=m4a]/bestvideo[width<=${max}]+bestaudio`;
    const byHeight = `bestvideo[height<=${max}]+bestaudio/best[height<=${max}]`;
    return `${byWidth}/${byHeight}`;
  }

  // O limite HD do site é 720p; resoluções maiores ficam só na opção acima.
  if (sorted.includes(720)) {
    add({
      id: '720p',
      label: '720p',
      detail: 'Vídeo + áudio em alta definição, arquivo moderado',
      ext: 'mp4',
      kind: 'video',
      selector: resolutionSelector(720),
      fallbacks: ['bestvideo[width<=720]+bestaudio/bestvideo[height<=720]+bestaudio', 'best']
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
        selector: resolutionSelector(height),
        fallbacks: [`bestvideo[width<=${height}]+bestaudio/bestvideo[height<=${height}]+bestaudio`, 'best']
      });
    }
  }

  add({
    id: 'light',
    label: 'Qualidade leve',
    detail: 'Menor arquivo, ideal para celular ou dados móveis',
    ext: 'mp4',
    kind: 'video',
    selector: 'worstvideo[width>=360][height>=360]+bestaudio/worstvideo+bestaudio',
    fallbacks: ['worstvideo[width>=360][height>=360]+bestaudio/best[width>=360]', 'best[height<=360]', 'best']
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
    formats: buildFormatOptions(info, platform)
  };
}

// Selectores fixos: o cliente escolhe apenas um ID, nunca um comando livre.
const FIXED_SELECTORS = {
  best: {
    selector: 'bestvideo[ext=mp4][vcodec^=avc]+bestaudio[ext=m4a]/bestvideo+bestaudio',
    fallbacks: ['bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]', 'best'],
    ext: 'mp4',
    kind: 'video'
  },
  light: {
    selector: 'worstvideo[width>=360][height>=360]+bestaudio/worstvideo+bestaudio',
    fallbacks: ['worstvideo[width>=360][height>=360]+bestaudio/best[width>=360]', 'best[height<=360]', 'best'],
    ext: 'mp4',
    kind: 'video'
  },
  audio: { selector: 'bestaudio/best', ext: 'mp3', kind: 'audio' }
};

function resolveOption(id) {
  if (Object.prototype.hasOwnProperty.call(FIXED_SELECTORS, id)) {
    return { id, ...FIXED_SELECTORS[id] };
  }

  const formatMatch = /^fmt-([A-Za-z0-9_.-]+)$/.exec(String(id || ''));
  if (formatMatch) {
    return {
      id,
      selector: formatMatch[1],
      fallbacks: ['best'],
      ext: 'mp4',
      kind: 'video'
    };
  }

  const match = /^(\d{3,4})p$/.exec(String(id || ''));
  if (match) {
    const requested = Number(match[1]);
    if (requested >= 240 && requested <= 4320) {
      // Nenhuma opção numérica passa de 720p: acima disso, use "Melhor qualidade".
      const height = Math.min(requested, 720);
      return {
        id,
        selector:
          `bestvideo[width<=${height}][ext=mp4][vcodec^=avc]+bestaudio[ext=m4a]/` +
          `bestvideo[width<=${height}]+bestaudio/bestvideo[height<=${height}]+bestaudio`,
        fallbacks: [
          `bestvideo[width<=${height}]+bestaudio/bestvideo[height<=${height}]+bestaudio`,
          'best'
        ],
        ext: 'mp4',
        kind: 'video'
      };
    }
  }

  return null;
}

module.exports = { buildFormatOptions, summarizeInfo, resolveOption };
