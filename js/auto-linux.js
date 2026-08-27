/* Loads the catalog produced by the weekly GitHub Action. */
(() => {
  const load = async () => {
    const app = window.app;
    if (!app) return setTimeout(load, 250);
    try {
      const r = await fetch('data/auto-linux.json', { cache: 'no-store' });
      if (!r.ok) return;
      const data = await r.json();
      if (!Array.isArray(data) || !data.length) return;
      const known = new Set(app.systems.map(s => s.name.toLowerCase()));
      const added = data.filter(s => s?.name && !known.has(String(s.name).toLowerCase())).map(s => app.normalize(s, 'Linux')).filter(Boolean);
      if (!added.length) return;
      app.systems.push(...added);
      app.filtered = [...app.systems];
      app.setText('statTotal', `${app.systems.length}+`);
      app.renderAll();
      console.info(`[OSPulse] Added ${added.length} weekly discovered Linux systems.`);
    } catch (err) {
      console.warn('[OSPulse] Weekly Linux catalog unavailable:', err?.message || err);
    }
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', load); else load();
})();
