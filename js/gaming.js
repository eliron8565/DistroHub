/* DistroHub Gaming Expansion — curated gaming-first Linux OS collection. */
(() => {
  const gamingPath = 'data/gaming-distros.json';
  const waitForApp = (fn, tries = 80) => {
    if (window.app && window.app.distros) return fn(window.app);
    if (tries <= 0) return;
    setTimeout(() => waitForApp(fn, tries - 1), 100);
  };

  const injectGamingUI = (app) => {
    const page = document.getElementById('distros');
    const header = page?.querySelector('.page-header');
    const bar = document.getElementById('distroExplorerBar');
    if (!bar || bar.querySelector('[data-filter="gaming-only"]')) return;
    const button = document.createElement('button');
    button.className = 'distro-filter';
    button.dataset.filter = 'gaming-only';
    button.textContent = '🎮 Gaming OS';
    button.title = 'Show gaming-focused operating systems';
    button.addEventListener('click', () => {
      bar.querySelectorAll('.distro-filter').forEach(b => b.classList.remove('active'));
      button.classList.add('active');
      app.filteredDistros = app.distros.filter(d =>
        String(d.category || '').toLowerCase().includes('gaming') ||
        (d.useCases || []).some(u => /gaming|retro|steam|handheld|console/i.test(u))
      );
      app.renderDistributions();
    });
    bar.insertBefore(button, bar.querySelector('.distro-count'));
  };

  document.addEventListener('DOMContentLoaded', () => {
    waitForApp(async (app) => {
      try {
        const response = await fetch(gamingPath, { cache: 'no-store' });
        if (!response.ok) throw new Error(`Gaming database HTTP ${response.status}`);
        const gaming = await response.json();
        const existing = new Set(app.distros.map(d => d.name));
        const additions = gaming.filter(d => d?.name && !existing.has(d.name));
        if (additions.length) {
          app.distros.push(...additions);
          app.filteredDistros = [...app.distros];
          app.populateCompareSelects();
          app.renderDistributions();
        }
        injectGamingUI(app);

        const stats = document.querySelector('.hero-stats');
        if (stats) {
          const first = stats.querySelector('.stat-number');
          if (first) first.textContent = `${app.distros.length}+`;
        }
      } catch (error) {
        console.error('DistroHub gaming expansion failed:', error);
      }
    });
  });
})();
