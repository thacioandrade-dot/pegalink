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

  // O HTML inserido com innerHTML não executa <script>. Recriamos cada tag
  // para que o código do anúncio rode no ponto exato do container.
  function activateScripts(container, done) {
    const scripts = Array.from(container.querySelectorAll('script'));
    let pending = scripts.filter((script) => script.src).length;

    if (!pending) {
      scripts.forEach((old) => container.replaceChild(cloneScript(old), old));
      done();
      return;
    }

    scripts.forEach((old) => {
      const fresh = cloneScript(old);
      if (old.src) {
        const settled = () => {
          pending -= 1;
          if (pending === 0) done();
        };
        fresh.addEventListener('load', settled, { once: true });
        fresh.addEventListener('error', settled, { once: true });
      }
      old.replaceWith(fresh);
    });
  }

  function cloneScript(old) {
    const script = document.createElement('script');
    Array.from(old.attributes).forEach((attr) => script.setAttribute(attr.name, attr.value));
    script.textContent = old.textContent;
    return script;
  }

  function renderCustom(container, html) {
    return new Promise((resolve) => {
      container.innerHTML = html;
      container.hidden = false;
      container.dataset.adFilled = 'true';
      activateScripts(container, resolve);
    });
  }

  function renderSlot(container, name) {
    if (container.dataset.adFilled === 'true') return Promise.resolve();

    const custom = config.customHtml && config.customHtml[name];
    if (custom) return renderCustom(container, custom);

    const client = config.client;
    const slot = config.slots && config.slots[name];
    if (!client || !slot || ADSENSE_PLACEHOLDER.test(client) || ADSENSE_PLACEHOLDER.test(slot)) {
      if (config.showPlaceholder) {
        container.textContent = 'Espaço reservado para anúncio';
        container.hidden = false;
        container.dataset.adFilled = 'true';
      }
      return Promise.resolve();
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
    return Promise.resolve();
  }

  function refresh() {
    if (!config.enabled) return;

    // Um bloco por vez: o script da Adsterra usa a variável global atOptions.
    let chain = Promise.resolve();
    document.querySelectorAll('[data-ad-slot]').forEach((container) => {
      chain = chain
        .then(() => renderSlot(container, container.dataset.adSlot))
        .catch(() => {});
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
