'use strict';

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

  // TikTok costuma expor arquivos completos (vídeo + áudio) com IDs próprios.
  // Usar esses IDs mantém "melhor", as classes intermediárias e "leve" diferentes.
  if (platform === 'tiktok') {
    const videos = formats
      .filter((format) => format.vcodec && format.vcodec !== 'none' && format.format_id)
      .map((format) => ({ format, side: shortSide(format) }))
      .filter((item) => item.side !== null && item.side >= 240)
      .sort((a, b) => b.side - a.side);

    if (videos.length) {
      const options = [];
      const usedIds = new Set();
      const best = videos[0];
      const light = videos[videos.length - 1];

      pushUnique(options, usedIds, {
        id: 'best',
        label: 'Melhor qualidade',
        detail: `Vídeo + áudio em ${best.format.width}×${best.format.height} (${qualityLabel(best.side)}), o maior disponível`,
        ext: 'mp4',
        kind: 'video',
        selector: String(best.format.format_id),
        fallbacks: ['best', qualitySelector(best.side)]
      });

      for (const item of videos) {
        const id = String(item.format.format_id);
        if (id === String(best.format.format_id)) continue;
        const isLight = id === String(light.format.format_id);
        pushUnique(options, usedIds, {
          id: `fmt-${id}`,
          label: isLight ? `Qualidade leve (${qualityLabel(item.side)})` : qualityLabel(item.side),
          detail: `Vídeo + áudio em ${item.format.width}×${item.format.height}${isLight ? ', arquivo menor' : ''}`,
          ext: 'mp4',
          kind: 'video',
          selector: id,
          fallbacks: [qualitySelector(item.side), 'best']
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
    selector: 'bestvideo+bestaudio/bestvideo[ext=mp4][vcodec^=avc]+bestaudio[ext=m4a]/best'
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
    selector: 'bestvideo+bestaudio/bestvideo[ext=mp4][vcodec^=avc]+bestaudio[ext=m4a]/best',
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
