'use strict';

// Verificação rápida das opções oferecidas para cada plataforma, sem rede.
// Executar com: node scripts/verify-quality.js

const assert = require('node:assert/strict');
const { buildFormatOptions, resolveOption } = require('../lib/formats');

const youtubeHorizontal = {
  id: 'yt-h',
  title: 'Teste horizontal',
  formats: [
    { format_id: '18', vcodec: 'avc1', width: 640, height: 360 },
    { format_id: '135', vcodec: 'avc1', width: 854, height: 480 },
    { format_id: '136', vcodec: 'avc1', width: 1280, height: 720 },
    { format_id: '137', vcodec: 'avc1', width: 1920, height: 1080 }
  ]
};

const youtubeShort = {
  id: 'yt-v',
  title: 'Teste vertical',
  formats: [
    { format_id: '18', vcodec: 'avc1', width: 360, height: 640 },
    { format_id: '135', vcodec: 'avc1', width: 480, height: 854 },
    { format_id: '136', vcodec: 'avc1', width: 720, height: 1278 }
  ]
};

const tiktok = {
  id: 'tt-1',
  title: 'Teste TikTok',
  formats: [
    { format_id: 'play', vcodec: 'h264', acodec: 'aac', width: 1080, height: 1920, tbr: 2500, url: 'https://cdn/play', format_note: 'Direct video' },
    { format_id: 'download', vcodec: 'h264', acodec: 'aac', width: 1080, height: 1920, tbr: 1800, url: 'https://cdn/download', format_note: 'watermarked' },
    { format_id: 'h264_720p_1', vcodec: 'h264', acodec: 'aac', width: 720, height: 1280, tbr: 900, url: 'https://cdn/720', format_note: 'Playback video' }
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
  'Full HD 1080p',
  'HD 720p',
  'SD 480p',
  'SD 360p',
  'Qualidade leve'
]);
assert.ok(yt[0].selector.startsWith('bestvideo+bestaudio'), 'Melhor qualidade deve usar a maior resolução real');
const yt1080 = yt.find((option) => option.label === 'Full HD 1080p').selector;
assert.ok(yt1080.includes('[height<=1080]'), '1080p horizontal precisa usar altura');
assert.ok(yt1080.includes('[width<=1080]'), '1080p vertical precisa usar largura');

const short = checkPlatform('youtube', youtubeShort, [
  'Melhor qualidade',
  'HD 720p',
  'SD 480p',
  'SD 360p'
]);
assert.equal(short.some((option) => option.label === 'Full HD 1080p'), false, 'Short 720p não deve anunciar 1080p');

const tt = checkPlatform('tiktok', tiktok, ['Melhor qualidade', 'Full HD 1080p', 'HD 720p']);
assert.deepEqual(labels(tt), ['Melhor qualidade', 'Full HD 1080p', 'HD 720p', 'Áudio MP3']);
const ttBest = tt[0];
const ttFull = tt[1];
const ttHd = tt[2];
assert.ok(ttBest.selector.startsWith('bestvideo'), 'Melhor qualidade do TikTok deve usar o original');
assert.ok(ttBest.selector.includes('watermark'), 'Melhor qualidade do TikTok deve evitar vídeo com marca d\'água');
assert.equal(ttFull.id, 'resize-1080', 'Full HD deve vir do original com compressão maior');
assert.equal(ttFull.resize, 1080);
assert.equal(ttHd.id, 'fmt-h264_720p_1', 'HD 720p deve usar o arquivo 720p real quando existe');
assert.equal(new Set(tt.map((option) => option.id)).size, 4, 'TikTok deve ter só 4 botões distintos');

const ttSingle = checkPlatform('tiktok', tiktokSingle, ['Melhor qualidade', 'Full HD 1080p', 'HD 720p']);
assert.deepEqual(labels(ttSingle), ['Melhor qualidade', 'Full HD 1080p', 'HD 720p', 'Áudio MP3']);
assert.equal(ttSingle[1].id, 'resize-1080');
assert.equal(ttSingle[2].id, 'resize-720');
assert.equal(ttSingle[2].resize, 720);

const ttMirrors = buildFormatOptions(tiktokMirrors, 'tiktok');
assert.equal(ttMirrors[1].id, 'resize-1080', 'espelhos do mesmo arquivo não são Full HD diferente');
assert.equal(ttMirrors[2].id, 'fmt-h264_720p_504085-0');

checkPlatform('instagram', instagram, ['Melhor qualidade', 'Full HD 1080p', 'HD 720p']);

for (const id of ['best', '1080p', '720p', '480p', '360p', 'light', 'audio', 'fmt-h264_720p_1', 'resize-1080', 'resize-720']) {
  assert.ok(resolveOption(id), `resolveOption(${id}) retornou nulo`);
}
assert.ok(resolveOption('1080p').selector.includes('[height<=1080]'));
assert.ok(resolveOption('1080p').selector.includes('[width<=1080]'));
assert.equal(resolveOption('fmt-h264_720p_1').selector, 'h264_720p_1');
assert.equal(resolveOption('resize-1080').resize, 1080);
assert.equal(resolveOption('resize-720').crf, 23);
assert.ok(resolveOption('best', 'tiktok').selector.includes('watermark'), 'resolveOption deve respeitar a plataforma');
assert.ok(resolveOption('resize-1080', 'tiktok').selector.includes('watermark'));

console.log('\nOK: todas as plataformas oferecem melhor qualidade, qualidade inferior e MP3.');
