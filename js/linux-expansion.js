/* OSPulse Linux expansion loader.
 * Loads only curated Linux distributions. Automatic discovery candidates are intentionally blocked.
 */
(() => {
  'use strict';
  const loadJson = url => fetch(url, { cache: 'no-store' }).then(r => {
    if (!r.ok) throw new Error(`${url}: ${r.status}`);
    return r.json();
  });
  const isCurated = item => {
    const cats = Array.isArray(item?.category) ? item.category : [item?.category || ''];
    const text = [item?.id, item?.name, item?.download, item?.downloadUrl, item?.website, item?.wiki, item?.docs, item?.source, item?.sourceRepository, ...cats].join(' ').toLowerCase();
    return !text.includes('discovery candidate') && !text.includes('github.com') && !text.includes('github.io') && !String(item?.id || '').startsWith('auto-');
  };
  const load = async () => {
    try {
      const datasets = await Promise.all([
        loadJson('data/linux-expansion.json'),
        loadJson('data/linux-expansion-2.json')
      ]);
      const data = datasets.flat().filter(isCurated);
      const waitForApp = (tries = 0) => {
        const instance = window.app || (typeof app !== 'undefined' ? app : null);
        if (!instance || !Array.isArray(instance.systems)) {
          if (tries < 100) setTimeout(() => waitForApp(tries + 1), 100);
          return;
        }
        instance.systems = instance.systems.filter(isCurated);
        const normalized = data.map(x => instance.normalize(x, 'Linux')).filter(Boolean);
        const map = new Map(instance.systems.map(x => [String(x.name).toLowerCase(), x]));
        normalized.forEach(x => {
          const key = String(x.name).toLowerCase();
          if (!map.has(key)) map.set(key, x);
        });
        instance.systems = [...map.values()];
        instance.filtered = [...instance.systems];
        if (typeof instance.setText === 'function') instance.setText('statTotal', `${instance.systems.length}+`);
        if (typeof instance.renderAll === 'function') instance.renderAll();
        console.info(`[OSPulse] Curated Linux catalog loaded: +${normalized.length} entries (${instance.systems.length} total).`);
      };
      waitForApp();
    } catch (error) {
      console.warn('[OSPulse] Linux expansion could not load:', error);
    }
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', load, { once: true });
  else load();
})();
