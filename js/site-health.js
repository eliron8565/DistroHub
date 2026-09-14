/* OSPulse runtime health checks and small UI hardening. */
(() => {
  'use strict';

  const state = { runs: 0, last: null };

  const dedupeSelect = select => {
    if (!select) return 0;
    const seen = new Set();
    let removed = 0;
    [...select.options].forEach(option => {
      const key = `${option.value}|${option.textContent}`.trim().toLowerCase();
      if (seen.has(key)) { option.remove(); removed += 1; }
      else seen.add(key);
    });
    return removed;
  };

  const disableEmptyLinks = root => {
    root.querySelectorAll?.('a[href="#"], a[href=""]').forEach(link => {
      link.classList.add('is-disabled-link');
      link.setAttribute('aria-disabled', 'true');
      if (!link.dataset.disabledBound) {
        link.dataset.disabledBound = '1';
        link.addEventListener('click', event => event.preventDefault());
      }
    });
  };

  const syncLanguage = () => {
    const i18n = window.OSPulseI18n;
    if (i18n?.apply && document.querySelector('.main-nav a[data-page="oslab"]')) {
      const code = localStorage.getItem('ospulse-lang') || i18n.current || 'en';
      if (!document.documentElement.dataset.oslabLangSynced) {
        document.documentElement.dataset.oslabLangSynced = '1';
        i18n.apply(code);
      }
    }
  };

  const bindModalUX = () => {
    const systemModal = document.getElementById('systemModal');
    const authModal = document.getElementById('authModal');

    systemModal?.querySelector('.modal-backdrop')?.addEventListener('click', () => {
      window.app?.closeModal?.();
      systemModal.setAttribute('aria-hidden', 'true');
    }, { passive: true });

    authModal?.querySelector('.modal-backdrop')?.addEventListener('click', () => {
      window.app?.closeAuth?.();
      authModal.setAttribute('aria-hidden', 'true');
    }, { passive: true });

    document.addEventListener('keydown', event => {
      if (event.key !== 'Escape') return;
      if (systemModal?.classList.contains('show')) {
        window.app?.closeModal?.();
        systemModal.setAttribute('aria-hidden', 'true');
      }
      if (authModal?.classList.contains('show')) {
        window.app?.closeAuth?.();
        authModal.setAttribute('aria-hidden', 'true');
      }
    });
  };

  const buildReport = () => {
    const app = window.app;
    const typeSelect = document.getElementById('typeFilter');
    const ids = [...document.querySelectorAll('[id]')].map(el => el.id);
    const duplicateIds = [...new Set(ids.filter((id, i) => ids.indexOf(id) !== i))];
    const duplicateTypeOptions = typeSelect ? [...typeSelect.options]
      .map(o => `${o.value}|${o.textContent}`.toLowerCase())
      .filter((v, i, arr) => arr.indexOf(v) !== i) : [];
    const brokenVisibleImages = [...document.images].filter(img => img.offsetParent !== null && img.complete && img.naturalWidth === 0).length;
    const emptyLinks = document.querySelectorAll('a[href="#"],a[href=""]').length;

    const report = {
      systems: app?.systems?.length || 0,
      gaming: app?.gaming?.length || 0,
      duplicateIds,
      duplicateTypeOptions: [...new Set(duplicateTypeOptions)],
      brokenVisibleImages,
      emptyLinks,
      timestamp: new Date().toISOString()
    };
    state.last = report;
    state.runs += 1;
    window.OSPulseHealthReport = report;
    return report;
  };

  const repair = () => {
    dedupeSelect(document.getElementById('typeFilter'));
    dedupeSelect(document.getElementById('compareA'));
    dedupeSelect(document.getElementById('compareB'));
    disableEmptyLinks(document);
    syncLanguage();
    buildReport();
  };

  const start = () => {
    bindModalUX();
    repair();
    let queued = false;
    const observer = new MutationObserver(() => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        repair();
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
    window.setTimeout(repair, 1000);
    window.setTimeout(repair, 4000);
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
