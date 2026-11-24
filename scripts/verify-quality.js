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
    { format_id: 'h264_540p_1', vcodec: 'h264', width: 608, height: 1080 },
    { format_id: 'h264_360p_1', vcodec: 'h264', width: 405, height: 720 }
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

const tt = checkPlatform('tiktok', tiktok, ['Melhor qualidade', 'Qualidade leve (SD 405p)']);
const ttBest = tt.find((option) => option.label === 'Melhor qualidade');
const ttLight = tt.find((option) => option.label.startsWith('Qualidade leve'));
assert.equal(ttBest.selector, 'h264_540p_1');
assert.equal(ttLight.selector, 'h264_360p_1');
assert.notEqual(ttBest.id, ttLight.id);

checkPlatform('instagram', instagram, ['Melhor qualidade', 'Full HD 1080p', 'HD 720p']);

for (const id of ['best', '1080p', '720p', '480p', '360p', 'light', 'audio', 'fmt-h264_360p_1']) {
  assert.ok(resolveOption(id), `resolveOption(${id}) retornou nulo`);
}
assert.ok(resolveOption('1080p').selector.includes('[height<=1080]'));
assert.ok(resolveOption('1080p').selector.includes('[width<=1080]'));
assert.equal(resolveOption('fmt-h264_360p_1').selector, 'h264_360p_1');

console.log('\nOK: todas as plataformas oferecem melhor qualidade, qualidade inferior e MP3.');
