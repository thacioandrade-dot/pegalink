'use strict';

const MAX_URL_LENGTH = 2048;

const PLATFORMS = {
  youtube: {
    name: 'YouTube',
    hosts: new Set([
      'youtube.com',
      'www.youtube.com',
      'm.youtube.com',
      'music.youtube.com',
      'www.youtube-nocookie.com',
      'youtube-nocookie.com',
      'youtu.be',
      'www.youtu.be'
    ])
  },
  tiktok: {
    name: 'TikTok',
    hosts: new Set([
      'tiktok.com',
      'www.tiktok.com',
      'm.tiktok.com',
      'vm.tiktok.com',
      'vt.tiktok.com'
    ])
  },
  instagram: {
    name: 'Instagram',
    hosts: new Set([
      'instagram.com',
      'www.instagram.com',
      'm.instagram.com',
      'instagr.am',
      'www.instagr.am'
    ])
  }
};

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.status = 400;
  }
}

function detectPlatform(urlString) {
  let parsed;
  try {
    parsed = new URL(urlString);
  } catch {
    return null;
  }

  const host = parsed.hostname.toLowerCase();
  for (const [key, platform] of Object.entries(PLATFORMS)) {
    if (platform.hosts.has(host)) return key;
  }
  return null;
}

function validateVideoUrl(rawUrl) {
  if (typeof rawUrl !== 'string' || !rawUrl.trim()) {
    throw new ValidationError('Cole uma URL válida.');
  }

  const trimmed = rawUrl.trim();
  if (trimmed.length > MAX_URL_LENGTH) {
    throw new ValidationError('Essa URL é longa demais.');
  }

  let parsed;
  try {
    parsed = new URL(trimmed);
  } catch {
    throw new ValidationError('Não consegui ler essa URL. Confira se ela está completa.');
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new ValidationError('Use um link que comece com http:// ou https://.');
  }

  if (parsed.username || parsed.password) {
    throw new ValidationError('Links com usuário ou senha não são aceitos.');
  }

  if (parsed.port && parsed.port !== '80' && parsed.port !== '443') {
    throw new ValidationError('Portas personalizadas não são aceitas.');
  }

  const platform = detectPlatform(parsed.toString());
  if (!platform) {
    throw new ValidationError('Só aceitamos links de YouTube, TikTok e Instagram.');
  }

  return { url: parsed.toString(), platform };
}

function sanitizeFilename(name, fallback = 'video') {
  const cleaned = String(name || '')
    .replace(/[<>:"/\\|?*\u0000-\u001F]/g, '_')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 90);

  return cleaned || fallback;
}

module.exports = {
  ValidationError,
  detectPlatform,
  validateVideoUrl,
  sanitizeFilename,
  PLATFORMS
};
