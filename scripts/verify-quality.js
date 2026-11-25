'use strict';

// Verificação rápida das opções oferecidas para cada plataforma, sem rede.
// Executar com: node scripts/verify-quality.js

const assert = require('node:assert/strict');
const { buildFormatOptions, resolveOption } = require('../lib/formats');

const youtubeHorizontal = {
  id: 'yt-h',
  title: 'Teste horizontal',
  formats: [
    { format_id: '18', vcodec: 'avc1', acodec: 'aac', width: 640, height: 360 },
    { format_id: '135', vcodec: 'avc1', acodec: 'none', width: 854, height: 480 },
    { format_id: '136', vcodec: 'avc1', acodec: 'none', width: 1280, height: 720 },
    { format_id: '137', vcodec: 'avc1', acodec: 'none', width: 1920, height: 1080 }
  ]
};

const youtubeShort = {
  id: 'yt-v',
  title: 'Teste vertical',
  formats: [
    { format_id: '18', vcodec: 'avc1', acodec: 'aac', width: 360, height: 640 },
    { format_id: '135', vcodec: 'avc1', acodec: 'none', width: 480, height: 854 },
    { format_id: '136', vcodec: 'avc1', acodec: 'none', width: 720, height: 1278 }
  ]
};

const tiktok = {
  id: 'tt-1',
  title: 'Teste TikTok',
  formats: [
    { format_id: 'play', vcodec: 'h264', acodec: 'aac', width: 1080, height: 1920, tbr: 2500, url: 'https://cdn/play', format_note: 'Direct video' },
    { format_id: 'download', vcodec: 'h264', acodec: 'aac', width: 1080, height: 1920, tbr: 3000, url: 'https://cdn/wm', format_note: 'watermarked' },
    { format_id: 'h264_720p_1', vcodec: 'h264', acodec: 'aac', width: 720, height: 1280, tbr: 900, url: 'https://cdn/720', format_note: 'Playback video' },
    { format_id: 'h264_480p_1', vcodec: 'h264', acodec: 'aac', width: 480, height: 854, tbr: 600, url: 'https://cdn/480', format_note: 'Playback video' },
    { format_id: 'h264_360p_1', vcodec: 'h264', acodec: 'aac', width: 360, height: 640, tbr: 350, url: 'https://cdn/360', format_note: 'Playback video' }
  ]
};

const tiktokSingle = {
  id: 'tt-2',
  title: 'Teste TikTok com um só arquivo',
  formats: [
    { format_id: 'play', vcodec: 'h264', acodec: 'aac', width: 1080, height: 1920, tbr: 2500, url: 'https://cdn/play' }
  ]
};

// O yt-dlp cria IDs terminados em -0, -1 para os espelhos de um mesmo formato.
const tiktokMirrors = {
  id: 'tt-3',
  title: 'Teste TikTok com espelhos do mesmo arquivo',
  formats: [
    { format_id: 'bytevc1_1080p_808907-0', vcodec: 'h265', acodec: 'aac', width: 1080, height: 1920, tbr: 2500, url: 'https://cdn/a' },
    { format_id: 'bytevc1_1080p_808907-1', vcodec: 'h265', acodec: 'aac', width: 1080, height: 1920, tbr: 2500, url: 'https://cdn/b' },
    { format_id: 'h264_720p_504085-0', vcodec: 'h264', acodec: 'aac', width: 720, height: 1280, tbr: 900, url: 'https://cdn/c' }
  ]
};

const instagram = {
  id: 'ig-1',
  title: 'Teste Instagram',
  formats: [
    { format_id: 'video_360p', vcodec: 'h264', width: 360, height: 640 },
    { format_id: 'video_480p', vcodec: 'h264', width: 480, height: 854 },
    { format_id: 'video_720p', vcodec: 'h264', width: 720, height: 1280 },
    { format_id: 'video_1080p', vcodec: 'h264', width: 1080, height: 1920 }
  ]
};

function labels(options) {
  return options.map((option) => option.label);
}

function checkPlatform(name, info, expected, expectMp3 = true) {
  const options = buildFormatOptions(info, name);
  const actual = labels(options);
  for (const label of expected) {
    assert.ok(actual.includes(label), `${name}: falta "${label}" (${actual.join(', ')})`);
  }
  if (expectMp3) {
    assert.ok(actual.includes('Áudio MP3'), `${name}: falta MP3`);
  }
  assert.equal(new Set(options.map((option) => option.id)).size, options.length, `${name}: IDs repetidos`);
  console.log(`${name}: ${actual.join(' | ')}`);
  return options;
}

const yt = checkPlatform('youtube', youtubeHorizontal, [
  'Melhor qualidade',
  'HD 720p',
  'SD 480p',
  'Áudio MP3'
]);
assert.deepEqual(labels(yt), ['Melhor qualidade', 'HD 720p', 'SD 480p', 'Áudio MP3'], 'YouTube deve ter exatamente 4 botões');
assert.equal(yt[0].id, 'top-137', 'Melhor qualidade deve apontar para o maior formato real');
assert.equal(yt[0].selector, '137+bestaudio', 'Melhor qualidade deve baixar o formato exato com áudio');
assert.ok(yt[0].fallbacks.some((item) => item.startsWith('bestvideo+bestaudio')), 'Melhor qualidade mantém fallback no teto');
assert.ok(yt[0].detail.includes('superior'), 'Melhor qualidade deve ser descrita como superior');
assert.equal(yt[1].id, 'vid-136', '720p deve apontar para o ID exato do formato');
assert.equal(yt[1].selector, '136+bestaudio', '720p deve juntar o formato exato com o áudio');
assert.equal(yt[2].id, 'vid-135', '480p deve apontar para o ID exato do formato');
assert.equal(yt[2].selector, '135+bestaudio', '480p deve juntar o formato exato com o áudio');
assert.ok(yt[2].fallbacks.some((item) => item.includes('[height<=480]')), '480p mantém fallback horizontal');
assert.ok(yt[2].fallbacks.some((item) => item.includes('[width<=480]')), '480p mantém fallback vertical');

const short = checkPlatform('youtube', youtubeShort, [
  'Melhor qualidade',
  'HD 720p',
  'SD 480p',
  'Áudio MP3'
]);
assert.deepEqual(labels(short), ['Melhor qualidade', 'HD 720p', 'SD 480p', 'Áudio MP3'], 'Short mantém as mesmas opções');
assert.equal(short[0].selector, '136+bestaudio', 'Short usa o maior formato vertical real, não um genérico menor');
assert.equal(short[1].selector, '136+bestaudio', 'Short 720p usa o formato vertical exato');
assert.equal(short[2].selector, '135+bestaudio', 'Short 480p usa o formato vertical exato, não 240p');

const tt = checkPlatform('tiktok', tiktok, ['Full HD 1080p', 'HD 720p', 'Áudio MP3']);
assert.deepEqual(labels(tt), ['Full HD 1080p', 'HD 720p', 'Áudio MP3'], 'TikTok deve ter exatamente Full HD + HD comprimido + MP3');
const ttBest = tt[0];
assert.equal(ttBest.id, 'orig-play', 'O botão Full HD deve apontar para o ID exato do melhor arquivo');
assert.equal(ttBest.selector, 'play', 'O botão Full HD não pode usar seletor genérico');
assert.ok(!ttBest.fallbacks.some((item) => item === 'best'), 'O botão Full HD não pode cair para best');
assert.equal(ttBest.detail.includes('sem recompressão'), true, 'O detalhe deve dizer que o arquivo é original e sem recompressão');
assert.equal(tt[1].id, 'fmt-h264_720p_1', 'HD 720p deve usar o arquivo comprimido real');
assert.equal(tt[1].detail.includes('comprimida'), true, 'HD deve ser descrito como alta qualidade comprimida');
assert.equal(tt[2].id, 'audio', 'MP3 deve estar sempre presente');

const ttSingle = checkPlatform('tiktok', tiktokSingle, ['Full HD 1080p', 'Áudio MP3']);
assert.deepEqual(labels(ttSingle), ['Full HD 1080p', 'Áudio MP3'], 'sem HD comprimido real, não anunciar HD 720p');

const ttMirrors = buildFormatOptions(tiktokMirrors, 'tiktok');
assert.deepEqual(labels(ttMirrors), ['Full HD 1080p', 'HD 720p', 'Áudio MP3']);
assert.equal(ttMirrors[0].id, 'orig-bytevc1_1080p_808907-0');
assert.equal(ttMirrors[0].selector, 'bytevc1_1080p_808907-0');
assert.deepEqual(ttMirrors[0].fallbacks, ['bytevc1_1080p_808907-1', 'bytevc1_1080p_808907-2'], 'espelhos só como fallback da mesma qualidade');
assert.equal(ttMirrors[1].id, 'fmt-h264_720p_504085-0');

const ig = checkPlatform('instagram', instagram, ['Melhor qualidade', 'HD 720p', 'SD 480p', 'Áudio MP3']);
assert.deepEqual(labels(ig), ['Melhor qualidade', 'HD 720p', 'SD 480p', 'Áudio MP3'], 'Instagram deve ter exatamente 4 botões');
assert.equal(ig[0].selector, 'video_1080p+bestaudio');
assert.equal(ig[1].selector, 'video_720p+bestaudio');
assert.equal(ig[2].selector, 'video_480p+bestaudio');

for (const id of ['best', 'fast', '1080p', '720p', '480p', '360p', 'light', 'audio', 'fmt-h264_720p_1', 'orig-bytevc1_1080p_808907-0', 'fullhd-bytevc1_1080p_808907-0', 'vid-135', 'vida-135', 'top-137', 'topa-137']) {
  assert.ok(resolveOption(id), `resolveOption(${id}) retornou nulo`);
}
assert.ok(resolveOption('1080p').selector.includes('[height<=1080]'));
assert.ok(resolveOption('1080p').selector.includes('[width<=1080]'));
assert.equal(resolveOption('fmt-h264_720p_1').selector, 'h264_720p_1');
assert.deepEqual(resolveOption('fmt-h264_720p_1').fallbacks, [], 'formato exato não deve cair para best');
assert.equal(resolveOption('orig-bytevc1_1080p_808907-0').selector, 'bytevc1_1080p_808907-0');
assert.equal(resolveOption('fullhd-bytevc1_1080p_808907-0').selector, 'bytevc1_1080p_808907-0');
assert.equal(resolveOption('vid-135').selector, '135+bestaudio');
assert.equal(resolveOption('vida-135').selector, '135');
assert.ok(
  resolveOption('vid-136').fallbacks.some((item) => item.includes('[height<=720]')),
  'fallback do botão 720p não pode subir para 1080p'
);
assert.ok(
  !resolveOption('vid-136').fallbacks.some((item) => item === 'best' || item === 'bestaudio/best'),
  'fallback do botão 720p não pode ser genérico'
);
assert.ok(
  resolveOption('vid-135').fallbacks.some((item) => item.includes('[width<=480]')),
  'fallback do botão 480p respeita retrato'
);
assert.equal(resolveOption('top-137').selector, '137+bestaudio');
assert.equal(resolveOption('topa-137').selector, '137');
assert.ok(resolveOption('fast').selector.startsWith('bestvideo+bestaudio'), 'ID antigo fast não pode baixar versão pequena');
assert.ok(resolveOption('best', 'tiktok').selector.includes('watermark'), 'resolveOption deve respeitar a plataforma');
assert.deepEqual(resolveOption('best', 'tiktok').fallbacks, [], 'TikTok best não pode degradar para best genérico');
assert.equal(resolveOption('best').fallbacks.includes('best'), false, 'YouTube/Instagram best não pode cair para best progressivo');
assert.equal(resolveOption('resize-1080'), null, 'opções de recompressão não devem ser aceitas');

console.log('\nOK: TikTok tem Full HD, HD comprimido e MP3; YouTube/Instagram têm exatamente Melhor qualidade (superior, sem queda), HD 720p, SD 480p e MP3.');
