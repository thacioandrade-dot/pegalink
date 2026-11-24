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
    { format_id: 'video_720p', vcodec: 'h264', width: 720, height: 1280 },
    { format_id: 'video_1080p', vcodec: 'h264', width: 1080, height: 1920 }
  ]
};

function labels(options) {
  return options.map((option) => option.label);
}

function checkPlatform(name, info, expected) {
  const options = buildFormatOptions(info, name);
  const actual = labels(options);
  for (const label of expected) {
    assert.ok(actual.includes(label), `${name}: falta "${label}" (${actual.join(', ')})`);
  }
  assert.ok(actual.includes('Áudio MP3'), `${name}: falta MP3`);
  assert.equal(new Set(options.map((option) => option.id)).size, options.length, `${name}: IDs repetidos`);
  console.log(`${name}: ${actual.join(' | ')}`);
  return options;
}

const yt = checkPlatform('youtube', youtubeHorizontal, [
  'Melhor qualidade',
  'Download rápido',
  'Full HD 1080p',
  'HD 720p',
  'SD 480p',
  'SD 360p',
  'Qualidade leve'
]);
assert.ok(yt[0].selector.startsWith('bestvideo+bestaudio'), 'Melhor qualidade deve usar a maior resolução real');
assert.ok(yt[1].selector.includes('acodec!=none'), 'Download rápido deve usar um arquivo com áudio junto');
const yt1080 = yt.find((option) => option.label === 'Full HD 1080p').selector;
assert.ok(yt1080.includes('[height<=1080]'), '1080p horizontal precisa usar altura');
assert.ok(yt1080.includes('[width<=1080]'), '1080p vertical precisa usar largura');

const short = checkPlatform('youtube', youtubeShort, [
  'Melhor qualidade',
  'Download rápido',
  'HD 720p',
  'SD 480p',
  'SD 360p'
]);
assert.equal(short.some((option) => option.label === 'Full HD 1080p'), false, 'Short 720p não deve anunciar 1080p');

const tt = checkPlatform('tiktok', tiktok, ['Full HD 1080p', 'HD 720p', 'SD 480p', 'SD 360p']);
assert.deepEqual(labels(tt), ['Full HD 1080p', 'HD 720p', 'SD 480p', 'SD 360p', 'Áudio MP3'], 'TikTok deve ter o original + inferiores reais + MP3');
const ttFull = tt[0];
assert.equal(ttFull.id, 'orig-play', 'O botão superior deve apontar para o ID exato do original');
assert.equal(ttFull.selector, 'play', 'O botão superior não pode usar seletor genérico');
assert.ok(!ttFull.fallbacks.some((item) => item === 'best'), 'O botão superior não pode cair para best');
assert.equal(ttFull.detail.includes('sem marca d\'água'), true, 'O detalhe deve dizer que o arquivo é sem marca d\'água');
assert.equal(tt[1].id, 'fmt-h264_720p_1', 'HD 720p deve usar o arquivo 720p real');
assert.equal(tt[2].id, 'fmt-h264_480p_1', 'SD 480p deve usar o arquivo 480p real');
assert.equal(tt[3].id, 'fmt-h264_360p_1', 'SD 360p deve usar o arquivo 360p real');

const ttSingle = checkPlatform('tiktok', tiktokSingle, ['Full HD 1080p']);
assert.deepEqual(labels(ttSingle), ['Full HD 1080p', 'Áudio MP3'], 'sem arquivos inferiores, não anunciar qualidade menor');

const ttMirrors = buildFormatOptions(tiktokMirrors, 'tiktok');
assert.deepEqual(labels(ttMirrors), ['Full HD 1080p', 'HD 720p', 'Áudio MP3']);
assert.equal(ttMirrors[0].id, 'orig-bytevc1_1080p_808907-0');
assert.equal(ttMirrors[0].selector, 'bytevc1_1080p_808907-0');
assert.deepEqual(ttMirrors[0].fallbacks, ['bytevc1_1080p_808907-1', 'bytevc1_1080p_808907-2'], 'espelhos só como fallback da mesma qualidade');
assert.equal(ttMirrors[1].id, 'fmt-h264_720p_504085-0');

checkPlatform('instagram', instagram, ['Melhor qualidade', 'Download rápido', 'Full HD 1080p', 'HD 720p']);

for (const id of ['best', 'fast', '1080p', '720p', '480p', '360p', 'light', 'audio', 'fmt-h264_720p_1', 'orig-bytevc1_1080p_808907-0']) {
  assert.ok(resolveOption(id), `resolveOption(${id}) retornou nulo`);
}
assert.ok(resolveOption('1080p').selector.includes('[height<=1080]'));
assert.ok(resolveOption('1080p').selector.includes('[width<=1080]'));
assert.equal(resolveOption('fmt-h264_720p_1').selector, 'h264_720p_1');
assert.deepEqual(resolveOption('fmt-h264_720p_1').fallbacks, [], 'formato exato não deve cair para best');
assert.equal(resolveOption('orig-bytevc1_1080p_808907-0').selector, 'bytevc1_1080p_808907-0');
assert.ok(resolveOption('best', 'tiktok').selector.includes('watermark'), 'resolveOption deve respeitar a plataforma');
assert.deepEqual(resolveOption('best', 'tiktok').fallbacks, [], 'TikTok best não pode degradar para best genérico');
assert.equal(resolveOption('resize-1080'), null, 'opções de recompressão não devem ser aceitas');

console.log('\nOK: TikTok usa o arquivo original no botão superior, oferece inferiores reais e MP3; YouTube/Instagram mantêm melhor qualidade, rápido e MP3.');
