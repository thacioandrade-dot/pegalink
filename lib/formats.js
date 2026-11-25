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

// Tamanho estimado em bytes. O botão principal deve entregar o MAIOR arquivo
// disponível, não apenas a maior resolução: um 720p com bitrate alto pode ser
// maior que um 1080p comprimido, e era isso que fazia o 720p parecer "melhor".
function estimatedSize(format, duration) {
  if (!format) return 0;
  const known = Number(format.filesize || format.filesize_approx) || 0;
  if (known > 0) return known;
  const tbr = Number(format.tbr) || 0;
  const seconds = Number(duration) || 0;
  if (tbr <= 0 || seconds <= 0) return 0;
  // A largura de banda anunciada em playlists m3u8 costuma ser bem maior que
  // a média real (5718 kb/s anunciados viraram ~3080 kb/s no teste ao vivo).
  const advertised = /m3u8/i.test(String(format.protocol || '')) ? 0.55 : 1;
  return (tbr * seconds * 1000 * advertised) / 8;
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

// itags do YouTube são globais: 136 é sempre 720p, 135 sempre 480p etc.
// Isso permite limitar o fallback de um botão mesmo quando o cliente está com
// um ID antigo em cache — sem isso, um fallback "best" entregava 1080p no
// botão 720p.
const ITAG_SIDES = {
  160: 144, 269: 144, 602: 144,
  133: 240, 229: 240, 242: 240, 395: 240, 604: 240,
  134: 360, 230: 360, 243: 360, 396: 360, 605: 360,
  135: 480, 231: 480, 779: 480, 780: 480, 787: 480, 788: 480,
  136: 720, 232: 720, 398: 720, 609: 720,
  137: 1080, 270: 1080, 399: 1080, 614: 1080, 616: 1080, 248: 1080
};

function sideFromFormatId(id) {
  const raw = String(id || '');
  if (/^\d+$/.test(raw) && ITAG_SIDES[Number(raw)]) return ITAG_SIDES[Number(raw)];
  const match = /(\d{3,4})p/.exec(raw);
  return match ? Number(match[1]) : null;
}

function cappedFallbacks(raw, audio) {
  const mirror = mirrorFallbacks(raw).map((id) => `${id}${audio}`);
  const side = sideFromFormatId(raw);
  if (!side) {
    return [
      ...mirror,
      BEST_VIDEO_SELECTOR,
      'bestvideo[ext=mp4][vcodec^=avc]+bestaudio[ext=m4a]'
    ];
  }
  return [
    ...mirror,
    qualitySelector(side),
    `bestvideo[height<=${side}]+bestaudio/bestvideo[width<=${side}]+bestaudio`,
    `best[height<=${side}]/best[width<=${side}]`
  ];
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

  // TikTok: exatamente três botões, sem duplicatas:
  // 1) Full HD — sempre o melhor arquivo original, sem recompressão;
  // 2) HD 720p — versão alta qualidade porém comprimida/leve da plataforma;
  // 3) Áudio MP3 — presente em todas as redes sociais.
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

      pushUnique(options, usedIds, {
        id: `orig-${bestId}`,
        label: best.side >= 1080 ? 'Full HD 1080p' : qualityLabel(best.side),
        detail: `${sizeText(best.format, best.side)} (${qualityLabel(best.side)}) · melhor arquivo original, sem recompressão`,
        ext: 'mp4',
        kind: 'video',
        selector: bestId,
        fallbacks: mirrorFallbacks(bestId)
      });

      const compressedHd = videos.find((item) => {
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

      if (compressedHd) {
        const id = String(compressedHd.format.format_id);
        pushUnique(options, usedIds, {
          id: `fmt-${id}`,
          label: 'HD 720p',
          detail: `${sizeText(compressedHd.format, compressedHd.side)} · alta qualidade comprimida, arquivo menor que o Full HD`,
          ext: 'mp4',
          kind: 'video',
          selector: id,
          fallbacks: mirrorFallbacks(id)
        });
      }

      pushUnique(options, usedIds, {
        id: 'audio',
        label: 'Áudio MP3',
        detail: 'Áudio em MP3 de alta qualidade, disponível em todas as redes',
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
  const duration = Number(info.duration) || 0;
  const sizeOf = (format) => estimatedSize(format, duration);
  const codecScore = (format) => {
    const https = /^https/i.test(String(format.protocol || ''));
    const mp4 = String(format.ext || '').toLowerCase() === 'mp4';
    const avc = /^avc/i.test(String(format.vcodec || ''));
    return https && mp4 && avc ? 3 : avc ? 2 : 1;
  };
  const usable = formats
    .filter((format) => {
      const hasVideo = format.vcodec && format.vcodec !== 'none';
      return (
        hasVideo &&
        Number(format.width) > 0 &&
        Number(format.height) > 0 &&
        !isBlockedFormat(format)
      );
    })
    .sort(
      (a, b) =>
        sizeOf(b) - sizeOf(a) ||
        codecScore(b) - codecScore(a) ||
        shortSide(b) - shortSide(a) ||
        rateOf(b) - rateOf(a)
    );
  const sizeText = (format) =>
    format
      ? `${Math.round(Number(format.width))}×${Math.round(Number(format.height))} · ${qualityLabel(shortSide(format))}`
      : null;
  const bestFormat = usable[0] || null;
  const bestSize = sizeText(bestFormat);

  // Selecionar por altura/largura genérica entregava 240x426 no botão 480p de
  // um Short. Aqui escolhemos o ID exato da qualidade pedida no /api/info.
  // O teto de cada botão é o tamanho estimado do botão anterior: assim o
  // principal sempre entrega o MAIOR arquivo, nunca um 1080p comprimido
  // menor que o 720p.
  const poolForSide = (side) => {
    const candidates = usable.filter((format) => shortSide(format) === side);
    // Formatos com tamanho conhecido são previsíveis; playlists m3u8 anunciam
    // uma largura de banda que nem sempre corresponde ao arquivo final.
    const known = candidates.filter(
      (format) => Number(format.filesize || format.filesize_approx) > 0
    );
    return (known.length ? known : candidates).sort(
      (a, b) => sizeOf(a) - sizeOf(b) || codecScore(b) - codecScore(a)
    );
  };
  const pools = { 720: poolForSide(720), 480: poolForSide(480) };
  const min480 = pools[480][0] ? sizeOf(pools[480][0]) : 0;

  // HD 720p e SD 480p são as versões LEVES. Escolher a maior opção dentro da
  // resolução fazia o 720p pesar mais que o principal quando o 1080p vinha
  // comprimido. Agora pegamos a MENOR opção real que ainda fica acima da
  // resolução inferior e abaixo do botão principal.
  const pickForSide = (side, ceiling, floor) => {
    const bySize = pools[side];
    if (!bySize.length) return null;
    const limit = sizeOf(ceiling);
    const above = floor > 0
      ? bySize.filter((format) => sizeOf(format) > floor)
      : bySize;
    const below = limit > 0
      ? above.filter((format) => {
          const size = sizeOf(format);
          return size > 0 && size < limit;
        })
      : above;
    const different = below.filter(
      (format) =>
        !ceiling || String(format.format_id) !== String(ceiling.format_id)
    );
    return (
      (different.length ? different : below)[0] ||
      (above.length ? above[0] : bySize[0])
    );
  };
  const options = [];
  const usedIds = new Set();

  // Painel final a pedido do proprietário: apenas quatro botões — Melhor
  // qualidade (teto superior, sem queda), HD 720p, SD 480p e MP3. O antigo
  // “Download rápido” foi retirado da interface; o ID antigo "fast" continua
  // aceito, mas passa a entregar o teto real para não baixar arquivo pequeno.
  // “Melhor qualidade” também usa o ID exato do maior formato visto no
  // /api/info: um seletor genérico poderia escolher um arquivo menor quando o
  // cliente do YouTube muda a lista entre a busca e o download.
  const bestRawId =
    bestFormat && bestFormat.format_id ? String(bestFormat.format_id) : null;
  const bestHasAudio =
    bestFormat && bestFormat.acodec && bestFormat.acodec !== 'none';
  const bestAudio = bestHasAudio ? '' : '+bestaudio';
  pushUnique(options, usedIds, {
    id: bestRawId ? `${bestHasAudio ? 'topa' : 'top'}-${bestRawId}` : 'best',
    label: 'Melhor qualidade',
    detail: `Máxima qualidade disponível${bestSize ? ` (${bestSize})` : ''} — superior, sem queda para versão menor`,
    ext: 'mp4',
    kind: 'video',
    selector: bestRawId ? `${bestRawId}${bestAudio}` : BEST_VIDEO_SELECTOR,
    fallbacks: bestRawId
      ? cappedFallbacks(bestRawId, bestAudio)
      : [BEST_VIDEO_SELECTOR]
  });

  let ceiling = bestFormat;
  for (const side of [720, 480]) {
    if (!sorted.includes(side)) continue;
    const format = pickForSide(side, ceiling, side === 720 ? min480 : 0);
    if (!format || !format.format_id) continue;
    const rawId = String(format.format_id);
    const hasAudio = format.acodec && format.acodec !== 'none';
    const audio = hasAudio ? '' : '+bestaudio';
    const actualSize = sizeText(format) ? ` (${sizeText(format)})` : '';
    pushUnique(options, usedIds, {
      id: `${hasAudio ? 'vida' : 'vid'}-${rawId}`,
      label: qualityLabel(side),
      detail:
        side >= 720
          ? `Alta definição${actualSize}`
          : `Definição padrão${actualSize}`,
      ext: 'mp4',
      kind: 'video',
      selector: `${rawId}${audio}`,
      fallbacks: cappedFallbacks(rawId, audio)
    });
    ceiling = format;
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
    // Mantém só o fallback AVC/MP4 (ainda é o teto, apenas outro codec).
    // O antigo fallback 'best' progressivo entregava uma versão menor sem avisar.
    fallbacks: ['bestvideo[ext=mp4][vcodec^=avc]+bestaudio[ext=m4a]'],
    ext: 'mp4',
    kind: 'video'
  },
  // Páginas antigas em cache ainda enviam "fast". Para não baixar um arquivo
  // pequeno, esse ID passa a pedir o mesmo teto do "Melhor qualidade".
  fast: {
    selector: BEST_VIDEO_SELECTOR,
    fallbacks: ['bestvideo[ext=mp4][vcodec^=avc]+bestaudio[ext=m4a]'],
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

  // Vídeo exato do YouTube/Instagram: "vid-" precisa juntar áudio, "vida-"
  // já é progressivo e não pode receber uma segunda faixa de áudio.
  const videoWithAudioMatch = /^vid-([A-Za-z0-9_.-]+)$/.exec(String(id || ''));
  if (videoWithAudioMatch) {
    const raw = videoWithAudioMatch[1];
    return {
      id,
      selector: `${raw}+bestaudio`,
      // Nunca cair para "best" genérico: o botão 720p/480p tem teto próprio.
      fallbacks: cappedFallbacks(raw, '+bestaudio'),
      ext: 'mp4',
      kind: 'video'
    };
  }
  const progressiveMatch = /^vida-([A-Za-z0-9_.-]+)$/.exec(String(id || ''));
  if (progressiveMatch) {
    const raw = progressiveMatch[1];
    return {
      id,
      selector: raw,
      fallbacks: cappedFallbacks(raw, ''),
      ext: 'mp4',
      kind: 'video'
    };
  }

  // "Melhor qualidade" com ID exato: o maior formato encontrado na busca.
  const topMatch = /^top-([A-Za-z0-9_.-]+)$/.exec(String(id || ''));
  if (topMatch) {
    const raw = topMatch[1];
    return {
      id,
      selector: `${raw}+bestaudio`,
      fallbacks: cappedFallbacks(raw, '+bestaudio'),
      ext: 'mp4',
      kind: 'video'
    };
  }
  const topProgressiveMatch = /^topa-([A-Za-z0-9_.-]+)$/.exec(String(id || ''));
  if (topProgressiveMatch) {
    const raw = topProgressiveMatch[1];
    return {
      id,
      selector: raw,
      fallbacks: cappedFallbacks(raw, ''),
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
          `best[height<=${requested}]/best[width<=${requested}]`
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
