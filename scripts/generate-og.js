'use strict';

// Gera public/og-image.png sem dependências externas.
const fs = require('node:fs');
const path = require('node:path');
const zlib = require('node:zlib');

const width = 1200;
const height = 630;
const raw = Buffer.alloc((width * 3 + 1) * height);

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc ^= byte;
    for (let i = 0; i < 8; i += 1) {
      crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body), 0);
  return Buffer.concat([length, body, crc]);
}

function setPixel(x, y, r, g, b) {
  if (x < 0 || y < 0 || x >= width || y >= height) return;
  const offset = y * (width * 3 + 1) + 1 + x * 3;
  raw[offset] = r;
  raw[offset + 1] = g;
  raw[offset + 2] = b;
}

for (let y = 0; y < height; y += 1) {
  for (let x = 0; x < width; x += 1) {
    const t = (x / width + y / height) / 2;
    setPixel(x, y, Math.round(11 + t * 18), Math.round(16 + t * 30), Math.round(32 + t * 70));
  }
}

// Triângulo de "play" estilizado no centro.
const cx = 560;
const cy = 315;
for (let y = cy - 150; y <= cy + 150; y += 1) {
  const distance = Math.abs(y - cy) / 150;
  const right = Math.round(cx + 220 - distance * 300);
  for (let x = cx - 90; x <= right; x += 1) {
    const glow = 1 - Math.min(1, Math.abs(x - cx) / 500);
    setPixel(x, y, Math.round(110 + glow * 35), Math.round(80 + glow * 25), 255);
  }
}

const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(width, 0);
ihdr.writeUInt32BE(height, 4);
ihdr[8] = 8;
ihdr[9] = 2;

const png = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  chunk('IHDR', ihdr),
  chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
  chunk('IEND', Buffer.alloc(0))
]);

fs.mkdirSync(path.join(__dirname, '..', 'public'), { recursive: true });
fs.writeFileSync(path.join(__dirname, '..', 'public', 'og-image.png'), png);
console.log('public/og-image.png gerado');
