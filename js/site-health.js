/* Catalog guard: validate once when data changes, not on every DOM mutation. */
(() => {
  'use strict';
  const bad = s => {
    if(!s || String(s.type||'').toLowerCase()!=='linux')return false;
    const text=JSON.stringify(s).toLowerCase();
    return text.includes('github.com')||text.includes('github.io')||
      text.includes('githubusercontent')||text.includes('discovery candidate')||
      String(s.id||'').startsWith('auto-');
  };
  const cleanCard=card=>{
    if(!card || !card.matches?.('.system-card'))return;
    const text=(card.textContent||'').toLowerCase();
    const hrefs=[...card.querySelectorAll('a[href]')].map(a=>a.href.toLowerCase()).join(' ');
    const imgs=[...card.querySelectorAll('img[src]')].map(i=>i.src.toLowerCase()).join(' ');
    if(text.includes('discovery candidate')||/github\.com|github\.io|githubusercontent/.test(hrefs+' '+imgs))card.remove();
  };
  const scanAdded=node=>{
    if(node.nodeType!==1)return;
    cleanCard(node);
    node.querySelectorAll?.('.system-card').forEach(cleanCard);
  };
  const scrub=()=>{
    const app=window.app;
    if(app && Array.isArray(app.systems)){
      const filtered=app.systems.filter(s=>!bad(s));
      if(filtered.length!==app.systems.length){
        app.systems=filtered;
        if(Array.isArray(app.filtered))app.filtered=app.filtered.filter(s=>!bad(s));
        app.applyFilters?.();
        app.populateCompare?.();
        app.updateStats?.();
      }
    }
    document.querySelectorAll('.system-card').forEach(cleanCard);
  };
  const start=()=>{
    scrub();
    const gridObserver=new MutationObserver(records=>{
      for(const record of records)for(const node of record.addedNodes)scanAdded(node);
    });
    for(const id of ['systemGrid','favoritesGrid']){
      const grid=document.getElementById(id);
      if(grid)gridObserver.observe(grid,{childList:true});
    }
    window.addEventListener('ospulse:catalog-ready',scrub);
    // Fallback for a catalog that finishes without emitting its event.
    window.setTimeout(scrub,1200);
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();

/* OSPulse runtime health checks and small UI hardening. */
(() => {
  'use strict';

  if (!document.getElementById('ospulse-health-style')) {
    const style = document.createElement('style');
    style.id = 'ospulse-health-style';
    style.textContent = '.is-disabled-link{opacity:.55;cursor:not-allowed!important;pointer-events:none}';
    document.head.appendChild(style);
  }

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
      link.removeAttribute('target');
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

    const closeSystem = () => {
      window.app?.closeModal?.();
      systemModal?.setAttribute('aria-hidden', 'true');
    };
    const closeAuth = () => {
      window.app?.closeAuth?.();
      authModal?.setAttribute('aria-hidden', 'true');
    };

    systemModal?.querySelector('.modal-backdrop')?.addEventListener('click', closeSystem, { passive: true });
    authModal?.querySelector('.modal-backdrop')?.addEventListener('click', closeAuth, { passive: true });
    document.getElementById('modalClose')?.addEventListener('click', () => systemModal?.setAttribute('aria-hidden', 'true'));
    document.getElementById('authClose')?.addEventListener('click', () => authModal?.setAttribute('aria-hidden', 'true'));

    document.addEventListener('keydown', event => {
      if (event.key !== 'Escape') return;
      if (systemModal?.classList.contains('show')) closeSystem();
      if (authModal?.classList.contains('show')) closeAuth();
    });
  };

  const buildReport = () => {
    const app = window.app;
    const typeSelect = document.getElementById('typeFilter');
    const seenIds = new Set(), duplicateIdSet = new Set();
    document.querySelectorAll('[id]').forEach(el => {
      if(seenIds.has(el.id))duplicateIdSet.add(el.id);
      else seenIds.add(el.id);
    });
    const duplicateIds = [...duplicateIdSet];
    const duplicateTypeOptions = typeSelect ? [...typeSelect.options]
      .map(o => `${o.value}|${o.textContent}`.toLowerCase())
      .filter((v, i, arr) => arr.indexOf(v) !== i) : [];
    const brokenVisibleImages = [...document.images]
      .filter(img => img.offsetParent !== null && img.complete && img.naturalWidth === 0).length;
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
    // Run a finite audit on genuine navigation and data events, not every
    // animation particle, button change, image load or DOM insertion.
    window.addEventListener('ospulse:catalog-ready', () => window.setTimeout(repair, 120));
    window.addEventListener('hashchange', () => window.setTimeout(repair, 120));
    window.setTimeout(repair, 1300);
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
