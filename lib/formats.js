'use strict';

// Seletor único para "melhor qualidade": mantém o arquivo original de maior
// resolução e taxa de bits, sem recompressão. Vale para YouTube, TikTok e Instagram.
const BEST_VIDEO_SELECTOR =
  'bestvideo+bestaudio/bestvideo[ext=mp4][vcodec^=avc]+bestaudio[ext=m4a]/best';

// No TikTok, o arquivo com marca d'água e os formatos bytevc2 não devem ser
// escolhidos como "melhor" mesmo quando aparecem com taxa de bits maior.
const TIKTOK_BEST_SELECTOR =
  "bestvideo[vcodec~='^(avc|h264)'][format_note!*='watermark'][format_note!*='UNPLAYABLE']+bestaudio/" +
  "best[vcodec~='^(avc|h264)'][format_note!*='watermark'][format_note!*='UNPLAYABLE']/" +
  "bestvideo[format_note!*='watermark'][format_note!*='UNPLAYABLE']+bestaudio/" +
  "best[format_note!*='watermark'][format_note!*='UNPLAYABLE']/" +
  BEST_VIDEO_SELECTOR;

// Lado curto da imagem: é ele que define a classe de qualidade em vídeos
// horizontais (altura) e verticais (largura). Ex.: 1920x1080 => 1080;
// 1080x1920 => 1080; 720x1278 => 720.
function shortSide(format) {
  const width = Number(format.width);
  const height = Number(format.height);
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
    return null;
  }
  return Math.min(width, height);
}

// O yt-dlp disambigua formatos repetidos com sufixos -0, -1 etc. Eles ainda
// são o mesmo arquivo (só mudou o espelho CDN), então não contam como outra
// qualidade.
function baseFormatId(id) {
  return String(id || '').replace(/-\d+$/, '');
}

function qualityLabel(side) {
  if (side >= 2160) return `4K ${side}p`;
  if (side >= 1440) return `2K ${side}p`;
  if (side >= 1080) return `Full HD ${side}p`;
  if (side >= 720) return `HD ${side}p`;
  return `SD ${side}p`;
}

// Seletor que funciona nos dois sentidos. Usar apenas `width<=1080` entregava
// 480p em vídeos horizontais 1920x1080, porque 854px também atendia à regra.
function qualitySelector(max) {
  const guard = 4320;
  const landscape =
    `bestvideo[height<=${max}][width<=${guard}][ext=mp4][vcodec^=avc]+bestaudio[ext=m4a]`;
  const portrait =
    `bestvideo[width<=${max}][height<=${guard}][ext=mp4][vcodec^=avc]+bestaudio[ext=m4a]`;
  const any =
    `bestvideo[height<=${max}][width<=${guard}]+bestaudio/` +
    `bestvideo[width<=${max}][height<=${guard}]+bestaudio/` +
    `best[height<=${max}]/best[width<=${max}]`;
  return `${landscape}/${portrait}/${any}`;
}

function buildFormatOptions(info, platform) {
  const formats = Array.isArray(info.formats) ? info.formats : [];
  const pushUnique = (options, usedIds, option) => {
    if (usedIds.has(option.id)) return;
    usedIds.add(option.id);
    options.push(option);
  };

  // TikTok: só três botões — Full HD (arquivo original), HD 720p (arquivo
  // menor de verdade) e MP3. "Melhor qualidade" foi removido porque entregava
  // exatamente o mesmo arquivo do Full HD.
  if (platform === 'tiktok') {
    const usable = formats.filter((format) => format.vcodec && format.vcodec !== 'none' && format.format_id);
    const progressive = usable.filter((format) => format.acodec !== 'none');
    const videos = (progressive.length ? progressive : usable)
      .map((format) => ({ format, side: shortSide(format) }))
      .filter((item) => item.side !== null && item.side >= 240)
      .sort((a, b) => {
        const rateA = Number(a.format.tbr) || Number(a.format.filesize) || 0;
        const rateB = Number(b.format.tbr) || Number(b.format.filesize) || 0;
        return b.side - a.side || rateB - rateA;
      });

    if (videos.length) {
      const options = [];
      const usedIds = new Set();
      const best = videos[0];
      const bestId = String(best.format.format_id);
      const bestBase = baseFormatId(bestId);
      const bestUrl = best.format.url;
      const bestRate = Number(best.format.tbr) || Number(best.format.filesize) || 0;
      const sizeText = (format, side) =>
        format.width && format.height ? `${format.width}×${format.height}` : `${side}p`;

      // Espelhos CDN (-0, -1) são o mesmo arquivo. Só entra como opção inferior
      // um formato lógico diferente, de resolução e taxa de bits menores.
      const lower = (min, max) =>
        videos.find((item) => {
          const id = String(item.format.format_id);
          if (baseFormatId(id) === bestBase) return false;
          if (bestUrl && item.format.url === bestUrl) return false;
          if (item.side < min || item.side > max) return false;
          if (item.side >= best.side) return false;
          if (/watermark/i.test(String(item.format.format_note || ''))) return false;
          const rate = Number(item.format.tbr) || Number(item.format.filesize) || 0;
          if (bestRate && rate && rate >= bestRate * 0.9) return false;
          return true;
        });

      pushUnique(options, usedIds, {
        id: 'best',
        label: best.side >= 1080 ? 'Full HD 1080p' : qualityLabel(best.side),
        detail: `${sizeText(best.format, best.side)} (${qualityLabel(best.side)}), arquivo original sem marca d'água`,
        ext: 'mp4',
        kind: 'video',
        selector: TIKTOK_BEST_SELECTOR,
        fallbacks: [bestId, 'best']
      });

      const real720 = lower(680, 800);
      if (real720) {
        pushUnique(options, usedIds, {
          id: `fmt-${real720.format.format_id}`,
          label: 'HD 720p',
          detail: `${sizeText(real720.format, real720.side)}, arquivo menor que o Full HD`,
          ext: 'mp4',
          kind: 'video',
          selector: String(real720.format.format_id),
          fallbacks: ['best']
        });
      }

      pushUnique(options, usedIds, {
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

  // YouTube e Instagram: juntar vídeo + áudio separados preserva o som.
  const shortSides = new Set();
  for (const format of formats) {
    const hasVideo = format.vcodec && format.vcodec !== 'none';
    if (!hasVideo) continue;
    const side = shortSide(format);
    if (side !== null && side >= 240) shortSides.add(side);
  }

  const sorted = [...shortSides].sort((a, b) => b - a);
  const options = [];
  const usedIds = new Set();

  pushUnique(options, usedIds, {
    id: 'best',
    label: 'Melhor qualidade',
    detail: 'Vídeo + áudio no máximo disponível, sem queda automática para uma versão menor',
    ext: 'mp4',
    kind: 'video',
    selector: BEST_VIDEO_SELECTOR
  });

  for (const side of [2160, 1440, 1080, 720, 480, 360]) {
    if (!sorted.includes(side)) continue;
    pushUnique(options, usedIds, {
      id: `${side}p`,
      label: qualityLabel(side),
      detail:
        side >= 1080
          ? 'Alta definição máxima, ideal para TV e telas grandes'
          : side >= 720
            ? 'Alta definição com arquivo moderado'
            : 'Definição padrão, bom equilíbrio entre qualidade e tamanho',
      ext: 'mp4',
      kind: 'video',
      selector: qualitySelector(side),
      fallbacks: [
        `bestvideo[height<=${side}]+bestaudio/bestvideo[width<=${side}]+bestaudio`,
        'worstvideo+bestaudio/worst',
        'best'
      ]
    });
  }

  pushUnique(options, usedIds, {
    id: 'light',
    label: 'Qualidade leve',
    detail: 'Menor arquivo, ideal para celular ou dados móveis',
    ext: 'mp4',
    kind: 'video',
    selector: 'worstvideo[width>=360][height>=360]+bestaudio/worstvideo+bestaudio',
    fallbacks: ['worstvideo[width>=360][height>=360]+bestaudio/best[width>=360]', 'best[height<=360]', 'best']
  });

  pushUnique(options, usedIds, {
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
    selector: BEST_VIDEO_SELECTOR,
    fallbacks: ['bestvideo[ext=mp4][vcodec^=avc]+bestaudio[ext=m4a]/best[ext=mp4]', 'best'],
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

function resolveOption(id, platform) {
  const bestSelector = platform === 'tiktok' ? TIKTOK_BEST_SELECTOR : BEST_VIDEO_SELECTOR;

  if (Object.prototype.hasOwnProperty.call(FIXED_SELECTORS, id)) {
    const fixed = FIXED_SELECTORS[id];
    return id === 'best' ? { id, ...fixed, selector: bestSelector } : { id, ...fixed };
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
      // 1080p e superiores voltam a ser aceitos; "Melhor qualidade" continua
      // sendo o teto real quando o vídeo oferece resolução maior que a lista.
      return {
        id,
        selector: qualitySelector(requested),
        fallbacks: [
          `bestvideo[height<=${requested}]+bestaudio/bestvideo[width<=${requested}]+bestaudio`,
          'worstvideo+bestaudio/worst',
          'best'
        ],
        ext: 'mp4',
        kind: 'video'
      };
    }
  }

  return null;
}

module.exports = { buildFormatOptions, summarizeInfo, resolveOption, qualitySelector, qualityLabel };
