'use strict';

// Seletor único para "melhor qualidade": mantém o arquivo original de maior
// resolução e taxa de bits, sem recompressão. Vale para YouTube e Instagram.
const BEST_VIDEO_SELECTOR =
  'bestvideo+bestaudio/bestvideo[ext=mp4][vcodec^=avc]+bestaudio[ext=m4a]/best';

// Caminho rápido: um único arquivo MP4 com vídeo e áudio já juntos, sem precisar
// juntar faixas com ffmpeg. É a opção mais rápida, não necessariamente a maior
// resolução (no YouTube o progressivo costuma parar em 720p).
const FAST_SELECTOR =
  'best[ext=mp4][acodec!=none][height>=360]/best[acodec!=none]/best';

// No TikTok o arquivo com marca d'água e os formatos UNPLAYABLE nunca devem ser
// escolhidos. A ordem começa no arquivo progressivo (vídeo + áudio no mesmo
// arquivo), que é o caso normal do TikTok, e só depois tenta DASH.
const TIKTOK_BEST_SELECTOR =
  "best[format_note!*='watermark'][format_note!*='UNPLAYABLE']/" +
  "best[vcodec~='^(avc|h264)'][format_note!*='watermark'][format_note!*='UNPLAYABLE']/" +
  "bestvideo[format_note!*='watermark'][format_note!*='UNPLAYABLE']+bestaudio/" +
  "bestvideo+bestaudio";

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

function rateOf(format) {
  return Number(format && (format.tbr || format.filesize || format.filesize_approx)) || 0;
}

function isBlockedFormat(format) {
  const note = String((format && format.format_note) || '');
  return /watermark|unplayable/i.test(note);
}

// O yt-dlp disambigua formatos repetidos com sufixos -0, -1 etc. Eles ainda
// são o mesmo arquivo (só mudou o espelho CDN), então não contam como outra
// qualidade. Os espelhos servem apenas como fallback da MESMA qualidade.
function baseFormatId(id) {
  return String(id || '').replace(/-\d+$/, '');
}

function mirrorFallbacks(id) {
  const match = /^(.+)-(\d+)$/.exec(String(id || ''));
  if (!match) return [];
  return [0, 1, 2]
    .map((number) => `${match[1]}-${number}`)
    .filter((candidate) => candidate !== String(id));
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

  // TikTok: exatamente três botões, na ordem pedida:
  // 1) Qualidade superior — ID exato do arquivo real, sem recompressão;
  // 2) Full HD 1080p — melhor arquivo em 1080p;
  // 3) HD 720p — arquivo menor real.
  // Sem MP3 e sem espelhos CDN (-0/-1) virando botão separado.
  if (platform === 'tiktok') {
    const usable = formats.filter((format) =>
      format.vcodec && format.vcodec !== 'none' && format.format_id && !isBlockedFormat(format)
    );
    const progressive = usable.filter((format) => format.acodec && format.acodec !== 'none');
    const videos = (progressive.length ? progressive : usable)
      .map((format) => ({ format, side: shortSide(format) }))
      .filter((item) => item.side !== null && item.side >= 240)
      .sort((a, b) => b.side - a.side || rateOf(b.format) - rateOf(a.format));

    if (videos.length) {
      const options = [];
      const usedIds = new Set();
      const usedBases = new Set();
      const best = videos[0];
      const bestId = String(best.format.format_id);
      const bestBase = baseFormatId(bestId);
      const bestUrl = best.format.url;
      const bestRate = rateOf(best.format);
      const sizeText = (format, side) =>
        format.width && format.height ? `${format.width}×${format.height}` : `${side}p`;

      usedBases.add(bestBase);

      // Botão superior: arquivo original de maior resolução/taxa de bits.
      pushUnique(options, usedIds, {
        id: `orig-${bestId}`,
        label: 'Qualidade superior',
        detail: `${sizeText(best.format, best.side)} (${qualityLabel(best.side)}) · arquivo real sem recompressão`,
        ext: 'mp4',
        kind: 'video',
        selector: bestId,
        fallbacks: mirrorFallbacks(bestId)
      });

      // Se houver um segundo arquivo 1080p distinto (por exemplo H.264 em vez
      // de HEVC), ele vira o botão Full HD. Se não houver, o próprio original
      // atende ao pedido — sem inventar recompressão.
      const fullHd = videos.find((item) => {
        const id = String(item.format.format_id);
        return item.side === 1080 && baseFormatId(id) !== bestBase && (!bestUrl || item.format.url !== bestUrl);
      }) || best;
      const fullHdId = String(fullHd.format.format_id);
      usedBases.add(baseFormatId(fullHdId));
      pushUnique(options, usedIds, {
        id: `fullhd-${fullHdId}`,
        label: fullHd.side >= 1080 ? 'Full HD 1080p' : qualityLabel(fullHd.side),
        detail: `${sizeText(fullHd.format, fullHd.side)} · melhor arquivo em 1080p, sem recompressão`,
        ext: 'mp4',
        kind: 'video',
        selector: fullHdId,
        fallbacks: mirrorFallbacks(fullHdId)
      });

      const real720 = videos.find((item) => {
        const id = String(item.format.format_id);
        const side = item.side;
        if (usedBases.has(baseFormatId(id))) return false;
        if (bestUrl && item.format.url === bestUrl) return false;
        if (side < 680 || side > 800) return false;
        if (side >= best.side) return false;
        const rate = rateOf(item.format);
        if (bestRate && rate && rate >= bestRate * 0.9) return false;
        return true;
      });

      if (real720) {
        const id = String(real720.format.format_id);
        pushUnique(options, usedIds, {
          id: `fmt-${id}`,
          label: 'HD 720p',
          detail: `${sizeText(real720.format, real720.side)} · arquivo menor real, sem recompressão`,
          ext: 'mp4',
          kind: 'video',
          selector: id,
          fallbacks: mirrorFallbacks(id)
        });
      }

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

  pushUnique(options, usedIds, {
    id: 'fast',
    label: 'Download rápido',
    detail: 'Arquivo MP4 pronto, com áudio junto e sem conversão — ideal para celular',
    ext: 'mp4',
    kind: 'video',
    selector: FAST_SELECTOR
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
  fast: { selector: FAST_SELECTOR, ext: 'mp4', kind: 'video' },
  light: {
    selector: 'worstvideo[width>=360][height>=360]+bestaudio/worstvideo+bestaudio',
    fallbacks: ['worstvideo[width>=360][height>=360]+bestaudio/best[width>=360]', 'best[height<=360]', 'best'],
    ext: 'mp4',
    kind: 'video'
  },
  audio: { selector: 'bestaudio/best', ext: 'mp3', kind: 'audio' }
};

function exactVideoOption(id, rawFormatId) {
  return {
    id,
    selector: rawFormatId,
    fallbacks: mirrorFallbacks(rawFormatId),
    ext: 'mp4',
    kind: 'video'
  };
}

function resolveOption(id, platform) {
  if (Object.prototype.hasOwnProperty.call(FIXED_SELECTORS, id)) {
    const fixed = FIXED_SELECTORS[id];
    if (id === 'best') {
      // TikTok mantém o ID antigo funcionando, mas sem o fallback genérico que
      // podia entregar um arquivo menor sem avisar.
      if (platform === 'tiktok') {
        return { id, selector: TIKTOK_BEST_SELECTOR, fallbacks: [], ext: 'mp4', kind: 'video' };
      }
      return { id, ...fixed, selector: BEST_VIDEO_SELECTOR };
    }
    return { id, ...fixed };
  }

  const originalMatch = /^orig-([A-Za-z0-9_.-]+)$/.exec(String(id || ''));
  if (originalMatch) {
    return exactVideoOption(id, originalMatch[1]);
  }

  const fullHdMatch = /^fullhd-([A-Za-z0-9_.-]+)$/.exec(String(id || ''));
  if (fullHdMatch) {
    return exactVideoOption(id, fullHdMatch[1]);
  }

  const formatMatch = /^fmt-([A-Za-z0-9_.-]+)$/.exec(String(id || ''));
  if (formatMatch) {
    return exactVideoOption(id, formatMatch[1]);
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

module.exports = {
  buildFormatOptions,
  summarizeInfo,
  resolveOption,
  qualitySelector,
  qualityLabel
};
