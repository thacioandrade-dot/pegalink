'use strict';

(function setSeoUrls() {
  const origin = window.location.origin;
  const url = origin + window.location.pathname;
  const image = origin + '/og-image.png';
  const canonical = document.getElementById('canonical-link');
  const ogUrl = document.getElementById('og-url');
  const ogImage = document.getElementById('og-image');
  const twitterImage = document.getElementById('twitter-image');
  if (canonical) canonical.href = url;
  if (ogUrl) ogUrl.content = url;
  if (ogImage) ogImage.content = image;
  if (twitterImage) twitterImage.content = image;
  for (const id of ['hreflang-pt', 'hreflang-x']) {
    const alternate = document.getElementById(id);
    if (alternate) alternate.href = url;
  }
  const structuredData = document.querySelector('script[type="application/ld+json"]');
  if (structuredData) {
    try {
      const data = structuredData.textContent.replace(/http:\/\/localhost:3000/g, origin);
      structuredData.textContent = data;
    } catch (_) {
      // Mantém os dados estáticos se não for possível atualizar.
    }
  }
})();

const form = document.getElementById('url-form');
const input = document.getElementById('video-url');
const pasteBtn = document.getElementById('paste-btn');
const clearBtn = document.getElementById('clear-btn');
const searchBtn = document.getElementById('search-btn');
const chip = document.getElementById('platform-chip');
const errorBox = document.getElementById('form-error');

const resultSection = document.getElementById('resultado');
const thumb = document.getElementById('result-thumb');
const resultPlatform = document.getElementById('result-platform');
const resultTitle = document.getElementById('result-title');
const resultMeta = document.getElementById('result-meta');
const formatsGrid = document.getElementById('formats');
const newSearchBtn = document.getElementById('new-search');

const panel = document.getElementById('download-panel');
const downloadStatus = document.getElementById('download-status');
const downloadPercent = document.getElementById('download-percent');
const progressBar = document.getElementById('progress-bar');
const downloadDetail = document.getElementById('download-detail');

const PLATFORM_LABELS = {
  youtube: 'YouTube',
  tiktok: 'TikTok',
  instagram: 'Instagram'
};

const HOSTS = {
  youtube: ['youtube.com', 'www.youtube.com', 'm.youtube.com', 'music.youtube.com', 'youtu.be', 'www.youtu.be', 'youtube-nocookie.com', 'www.youtube-nocookie.com'],
  tiktok: ['tiktok.com', 'www.tiktok.com', 'm.tiktok.com', 'vm.tiktok.com', 'vt.tiktok.com'],
  instagram: ['instagram.com', 'www.instagram.com', 'm.instagram.com', 'instagr.am', 'www.instagr.am']
};

let currentVideo = null;
let autoSearchTimer = null;

function detectPlatform(value) {
  try {
    const host = new URL(value).hostname.toLowerCase();
    for (const [key, hosts] of Object.entries(HOSTS)) {
      if (hosts.includes(host)) return key;
    }
  } catch {
    /* URL incompleta enquanto digita */
  }
  return null;
}

function extractUrl(text) {
  const raw = String(text || '').trim();
  const match = raw.match(/https?:\/\/[^\s<>"']+/i);
  if (!match) return raw;
  return match[0].replace(/[.,!?;:)\]}]+$/, '');
}

function isAcceptedLink(value) {
  const text = String(value || '').trim();
  if (!text) return false;
  try {
    new URL(text);
    return detectPlatform(text) !== null;
  } catch {
    return false;
  }
}

function clearAutoSearch() {
  if (autoSearchTimer) {
    clearTimeout(autoSearchTimer);
    autoSearchTimer = null;
  }
}

function scheduleAutoSearch(delay = 150) {
  clearAutoSearch();
  if (!isAcceptedLink(input.value)) return;
  if (searchBtn.disabled) return;
  autoSearchTimer = setTimeout(() => {
    autoSearchTimer = null;
    if (isAcceptedLink(input.value) && !searchBtn.disabled) {
      form.requestSubmit();
    }
  }, delay);
}

function applyPastedText(text) {
  input.value = extractUrl(text);
  input.dispatchEvent(new Event('input'));
  scheduleAutoSearch();
}

function showError(message, detail) {
  const text = String(message || '').trim();
  const extra = String(detail || '').trim();
  errorBox.textContent = extra && extra.toLowerCase() !== text.toLowerCase() ? `${text} (${extra})` : text;
  errorBox.hidden = false;
}

function clearError() {
  errorBox.textContent = '';
  errorBox.hidden = true;
}

function setLoading(loading) {
  searchBtn.classList.toggle('is-loading', loading);
  searchBtn.disabled = loading;
}

function formatDuration(seconds) {
  if (!seconds || !Number.isFinite(seconds)) return '';
  const pad = (n) => String(n).padStart(2, '0');
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  return hours ? `${hours}:${pad(minutes)}:${pad(secs)}` : `${minutes}:${pad(secs)}`;
}

function formatBytes(bytes) {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / 1024 ** index).toFixed(index ? 1 : 0)} ${units[index]}`;
}

function parseFileName(disposition, fallback) {
  if (!disposition) return fallback;

  const encoded = /filename\*=UTF-8''([^;]+)/i.exec(disposition);
  if (encoded) {
    try {
      return decodeURIComponent(encoded[1].trim().replace(/^"|"$/g, ''));
    } catch {
      /* mantém o fallback */
    }
  }

  const plain = /filename="?([^";]+)"?/i.exec(disposition);
  return plain ? plain[1].trim() : fallback;
}

function renderResult(video) {
  currentVideo = video;

  resultPlatform.textContent = PLATFORM_LABELS[video.platform] || 'Vídeo';
  resultTitle.textContent = video.title;

  const parts = [];
  if (video.uploader) parts.push(video.uploader);
  const duration = formatDuration(video.duration);
  if (duration) parts.push(duration);
  resultMeta.textContent = parts.join(' · ');

  if (video.thumbnail) {
    thumb.src = video.thumbnail;
    thumb.hidden = false;
  } else {
    thumb.hidden = true;
  }

  formatsGrid.replaceChildren();
  for (const option of video.formats) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'format-btn';
    button.dataset.id = option.id;
    button.dataset.kind = option.kind;

    const icon = document.createElement('span');
    icon.className = 'format-icon';
    icon.innerHTML = option.kind === 'audio'
      ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 18V5l10-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="16" cy="16" r="3"/></svg>'
      : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3v12m0 0l-4-4m4 4l4-4"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/></svg>';

    const text = document.createElement('span');
    const name = document.createElement('span');
    name.className = 'format-name';
    name.textContent = option.label;
    const detail = document.createElement('span');
    detail.className = 'format-detail';
    detail.textContent = option.detail;
    text.append(name, detail);

    button.append(icon, text);
    button.addEventListener('click', () => startDownload(option, button));
    formatsGrid.appendChild(button);
  }

  panel.hidden = true;
  resultSection.hidden = false;
}

function resetResult() {
  currentVideo = null;
  resultSection.hidden = true;
  formatsGrid.replaceChildren();
  panel.hidden = true;
}

function setBusy(busy, activeButton) {
  for (const button of formatsGrid.querySelectorAll('.format-btn')) {
    button.disabled = busy && button !== activeButton;
    button.classList.toggle('is-downloading', busy && button === activeButton);
  }
}

async function startDownload(option, button) {
  if (!currentVideo) return;

  setBusy(true, button);
  panel.hidden = false;
  downloadStatus.textContent = 'Preparando o arquivo…';
  downloadPercent.textContent = '';
  downloadDetail.textContent = '';
  progressBar.style.width = '0%';
  progressBar.classList.add('is-indeterminate');

  try {
    const response = await fetch('/api/download', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: currentVideo.url,
        quality: option.id,
        name: currentVideo.title
      })
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      const error = new Error(data.error || 'Não foi possível gerar o download.');
      error.detail = data.detail;
      throw error;
    }

    const total = Number(response.headers.get('Content-Length')) || 0;
    const mimeType = response.headers.get('Content-Type') || 'application/octet-stream';
    const fallbackName = `${currentVideo.title || 'video'}.${option.ext}`;
    const fileName = parseFileName(response.headers.get('Content-Disposition'), fallbackName);

    if (!response.body) {
      const blob = await response.blob();
      saveBlob(blob, fileName);
      finishSuccess(total || blob.size, total > 0);
      return;
    }

    const reader = response.body.getReader();
    const chunks = [];
    let received = 0;
    progressBar.classList.remove('is-indeterminate');
    downloadStatus.textContent = 'Baixando…';

    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
      received += value.length;

      if (total > 0) {
        const percent = Math.min(100, Math.round((received / total) * 100));
        progressBar.style.width = `${percent}%`;
        downloadPercent.textContent = `${percent}%`;
      } else {
        downloadDetail.textContent = formatBytes(received);
      }
    }

    saveBlob(new Blob(chunks, { type: mimeType }), fileName);
    finishSuccess(received, total > 0);
  } catch (error) {
    downloadStatus.textContent = 'Não foi possível baixar';
    const detail = error.detail ? ` Detalhe: ${error.detail}` : '';
    downloadDetail.textContent = `${error.message || 'Tente novamente em instantes.'}${detail}`;
    downloadPercent.textContent = '';
    progressBar.style.width = '100%';
    progressBar.classList.add('is-error');
  } finally {
    setBusy(false);
  }
}

function saveBlob(blob, fileName) {
  const link = document.createElement('a');
  const objectUrl = URL.createObjectURL(blob);
  link.href = objectUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(objectUrl), 60_000);
}

function finishSuccess(received, hadTotal) {
  downloadStatus.textContent = 'Download concluído!';
  downloadDetail.textContent = `Arquivo salvo no seu dispositivo (${formatBytes(received)}).`;
  if (hadTotal) {
    progressBar.style.width = '100%';
    downloadPercent.textContent = '100%';
  } else {
    progressBar.classList.add('is-indeterminate');
  }
}

input.addEventListener('input', () => {
  clearError();
  const platform = detectPlatform(input.value.trim());
  if (platform) {
    chip.textContent = `✓ Link do ${PLATFORM_LABELS[platform]} detectado`;
    chip.hidden = false;
  } else {
    chip.hidden = true;
  }
});

pasteBtn.addEventListener('click', async () => {
  try {
    const text = await navigator.clipboard.readText();
    applyPastedText(text);
    input.focus();
  } catch {
    showError('Não consegui ler a área de transferência. Use Ctrl+V (ou Cmd+V) para colar.');
  }
});

input.addEventListener('paste', (event) => {
  const text = event.clipboardData && event.clipboardData.getData('text');
  if (!text) return;
  event.preventDefault();
  applyPastedText(text);
});

clearBtn.addEventListener('click', () => {
  clearAutoSearch();
  input.value = '';
  chip.hidden = true;
  clearError();
  input.focus();
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  clearAutoSearch();
  clearError();

  const url = input.value.trim();
  if (!url) {
    showError('Cole a URL de um vídeo para continuar.');
    input.focus();
    return;
  }

  setLoading(true);
  resetResult();

  try {
    const response = await fetch('/api/info', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const error = new Error(data.error || 'Não foi possível buscar o vídeo.');
      error.detail = data.detail;
      throw error;
    }

    renderResult({ ...data, url });
    resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } catch (error) {
    showError(error.message || 'Tente novamente em instantes.', error.detail);
  } finally {
    setLoading(false);
  }
});

newSearchBtn.addEventListener('click', () => {
  clearAutoSearch();
  resetResult();
  input.value = '';
  chip.hidden = true;
  clearError();
  window.scrollTo({ top: 0, behavior: 'smooth' });
  input.focus();
});
