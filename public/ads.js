'use strict';

(function () {
  const config = window.PEGAVIDEO_ADS || {};
  const ADSENSE_PLACEHOLDER = /^ca-pub-0+$|^0+$/;

  function loadAdsense(client) {
    if (document.querySelector('script[data-adsense-loader]')) return;

    const script = document.createElement('script');
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.dataset.adsenseLoader = 'true';
    script.src =
      'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' +
      encodeURIComponent(client);
    document.head.appendChild(script);
  }

  function renderSlot(container, name) {
    if (container.dataset.adFilled === 'true') return;

    const custom = config.customHtml && config.customHtml[name];
    if (custom) {
      container.innerHTML = custom;
      container.hidden = false;
      container.dataset.adFilled = 'true';
      return;
    }

    const client = config.client;
    const slot = config.slots && config.slots[name];
    if (!client || !slot || ADSENSE_PLACEHOLDER.test(client) || ADSENSE_PLACEHOLDER.test(slot)) {
      if (config.showPlaceholder) {
        container.textContent = 'Espaço reservado para anúncio';
        container.hidden = false;
        container.dataset.adFilled = 'true';
      }
      return;
    }

    loadAdsense(client);

    const unit = document.createElement('ins');
    unit.className = 'adsbygoogle';
    unit.style.display = 'block';
    unit.dataset.adClient = client;
    unit.dataset.adSlot = slot;
    unit.dataset.adFormat = 'auto';
    unit.dataset.fullWidthResponsive = 'true';

    container.replaceChildren(unit);
    container.hidden = false;
    container.dataset.adFilled = 'true';

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.warn('Não foi possível iniciar o anúncio:', error);
    }
  }

  function refresh() {
    if (!config.enabled) return;
    document.querySelectorAll('[data-ad-slot]').forEach((container) => {
      renderSlot(container, container.dataset.adSlot);
    });
  }

  window.PEGAVIDEO_ADS = config;
  config.refresh = refresh;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', refresh, { once: true });
  } else {
    refresh();
  }
})();
