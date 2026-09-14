/* OSPulse shared UI helpers: Surprise styling, canonical links, and one-time support-module loading. */
(() => {
  'use strict';

  if (!document.getElementById('dh-surprise-style')) {
    const style = document.createElement('style');
    style.id = 'dh-surprise-style';
    style.textContent = `
      #randomBtn.surprising, #randomBtnHome.surprising { pointer-events:none; transform:translateY(-1px) scale(.98); opacity:.9; }
      #randomBtn.surprising i, #randomBtnHome.surprising i { margin-right:.35rem; }
      #systemGrid.surprise-pulse { animation:dhSurprisePulse .7s ease both; }
      @keyframes dhSurprisePulse { 0%{filter:none;transform:scale(1)} 35%{filter:brightness(1.35) saturate(1.2);transform:scale(.995)} 70%{filter:brightness(1.08);transform:scale(1.002)} 100%{filter:none;transform:scale(1)} }
    `;
    document.head.appendChild(style);
  }

  const NOBARA_DOWNLOAD = 'https://nobaraproject.org/download.html';
  const isNobara = value => /nobara/i.test(String(value || ''));

  const canonicalize = (value, name = '') => {
    try {
      const url = new URL(value, document.baseURI);
      if (url.hostname === 'nobaraproject.org' && /^\/download(?:-|\/|$)/.test(url.pathname)) return NOBARA_DOWNLOAD;
      if (isNobara(name) && url.hostname === 'nobaraproject.org') return NOBARA_DOWNLOAD;
      return url.href;
    } catch {
      return isNobara(name) ? NOBARA_DOWNLOAD : value;
    }
  };

  function repairAppData() {
    const app = window.app;
    if (!app) return;
    for (const collection of [app.systems, app.gaming]) {
      if (!Array.isArray(collection)) continue;
      for (const item of collection) {
        if (isNobara(item?.name) || isNobara(item?.id)) {
          item.download = NOBARA_DOWNLOAD;
          item.downloadUrl = NOBARA_DOWNLOAD;
        }
      }
    }
  }

  function repairNobaraLinks(root = document) {
    root.querySelectorAll?.('a[href]').forEach(link => {
      const context = link.closest?.('.system-card,.game-card,.modal-card')?.textContent || '';
      const fixed = canonicalize(link.getAttribute('href'), context);
      if (fixed && fixed !== link.getAttribute('href')) link.setAttribute('href', fixed);
      if (isNobara(context) && /official|download/i.test(link.textContent || '')) link.setAttribute('href', NOBARA_DOWNLOAD);
    });
  }

  function repair() {
    repairAppData();
    repairNobaraLinks();
  }

  const loadOnce = src => {
    if (document.querySelector(`script[src$="${src}"]`)) return;
    const script = document.createElement('script');
    script.src = src;
    script.dataset.ospulseModule = '1';
    document.body.appendChild(script);
  };

  const loadSupportModules = () => {
    ['js/i18n.js','js/rebrand.js','js/feature-pack.js','js/logo-resilience.js','js/linux-expansion.js']
      .forEach(loadOnce);
  };

  const start = () => {
    loadSupportModules();
    repair();
    let tries = 0;
    const timer = window.setInterval(() => {
      repair();
      tries += 1;
      if (window.app?.systems?.length || tries > 40) window.clearInterval(timer);
    }, 250);
    new MutationObserver(() => repairNobaraLinks()).observe(document.body, { childList: true, subtree: true });
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
