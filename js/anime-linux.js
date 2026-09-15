/* Anime Linux catalog for OSPulse. Verified projects only. */
(() => {
  'use strict';

  const entries = [
    {
      id: 'nyarch-linux', name: 'Nyarch Linux', type: 'Linux',
      category: ['Anime Linux', 'Desktop', 'Arch-based', 'Dual Boot'],
      base: 'Arch Linux', release: 'Rolling', packageManager: 'pacman / AUR',
      desktopEnvironment: 'GNOME / KDE Plasma', architecture: ['x86_64'], difficulty: 'Intermediate',
      description: 'Anime-themed Arch-based Linux distribution with GNOME and KDE Plasma editions, custom theming and bundled manga/anime-focused apps.',
      useCases: ['Anime', 'Desktop', 'Customization', 'Manga', 'Multimedia', 'Dual Boot'],
      license: 'Open Source', openSource: true,
      website: 'https://nyarchlinux.moe/', download: 'https://nyarchlinux.moe/', downloadUrl: 'https://nyarchlinux.moe/',
      docs: 'https://wiki.nyarchlinux.moe/', source: 'https://github.com/NyarchLinux/NyarchLinux',
      logo: 'https://www.google.com/s2/favicons?domain=nyarchlinux.moe&sz=128',
      tags: ['anime', 'weeb', 'otaku', 'manga', 'nyarch', 'arch', 'kde', 'gnome']
    },
    {
      id: 'lainos', name: 'lainOS', type: 'Linux',
      category: ['Anime Linux', 'Privacy', 'Development', 'Arch-based'],
      base: 'Arch Linux', release: 'Rolling', packageManager: 'pacman / AUR',
      desktopEnvironment: 'Custom', architecture: ['x86_64'], difficulty: 'Advanced',
      description: 'Community-driven Arch-based Linux distribution inspired by Serial Experiments Lain, focused on privacy, productivity, developers and tinkerers.',
      useCases: ['Anime', 'Privacy', 'Development', 'Customization', 'Learning'],
      license: 'Free / Open', openSource: true,
      website: 'https://lainos.net/landing.html', download: 'https://lainos.net/landing.html', downloadUrl: 'https://lainos.net/landing.html',
      docs: 'https://lainos.net/landing.html',
      logo: 'https://www.google.com/s2/favicons?domain=lainos.net&sz=128',
      tags: ['anime', 'serial experiments lain', 'lain', 'privacy', 'arch', 'cyberpunk']
    }
  ];

  const key = v => String(v || '').toLowerCase().replace(/[^a-z0-9]+/g, '');

  function ensureEntries(app) {
    entries.forEach(raw => {
      const found = app.systems.find(s => key(s.id) === key(raw.id) || key(s.name) === key(raw.name));
      if (found) Object.assign(found, raw);
      else app.systems.push(app.normalize ? app.normalize(raw, 'Linux') : {...raw});
    });
  }

  function ensureUI(app) {
    const select = document.getElementById('typeFilter');
    if (select) {
      const matches = [...select.options].filter(o => String(o.value || o.textContent).trim().toLowerCase() === 'anime linux');
      matches.slice(1).forEach(o => o.remove());
      if (!matches.length) {
        const o = document.createElement('option'); o.value = 'Anime Linux'; o.textContent = 'Anime Linux'; select.appendChild(o);
      }
    }
    const chips = document.getElementById('typeFilters');
    if (chips && ![...chips.querySelectorAll('button')].some(b => b.textContent.trim().toLowerCase() === 'anime linux')) {
      const b = document.createElement('button'); b.className = 'chip'; b.textContent = 'Anime Linux';
      b.addEventListener('click', () => {
        const filter = document.getElementById('typeFilter');
        if (filter) filter.value = 'Anime Linux';
        app.applyFilters?.();
      });
      chips.appendChild(b);
    }
  }

  function refresh(app) {
    ensureEntries(app);
    ensureUI(app);
    app.setText?.('statTotal', `${app.systems.length}+`);
    app.applyFilters?.();
  }

  function install() {
    const app = window.app;
    if (!app || !Array.isArray(app.systems) || !app.systems.length) return setTimeout(install, 120);

    // renderTypes() rebuilds the chip row. Re-add the custom Anime Linux chip afterwards.
    if (!app.__animeTypesPatched && typeof app.renderTypes === 'function') {
      const originalRenderTypes = app.renderTypes.bind(app);
      app.renderTypes = function() { originalRenderTypes(); ensureUI(app); };
      app.__animeTypesPatched = true;
    }

    // Some OSPulse modules call renderAll() after this script loads. That can replace
    // the systems array and make Nyarch/lainOS disappear while leaving the filter visible.
    // Keep the entries installed before every full render.
    if (!app.__animeRenderAllPatched && typeof app.renderAll === 'function') {
      const originalRenderAll = app.renderAll.bind(app);
      app.renderAll = function() {
        ensureEntries(app);
        const result = originalRenderAll();
        ensureUI(app);
        return result;
      };
      app.__animeRenderAllPatched = true;
    }

    refresh(app);
    requestAnimationFrame(() => refresh(app));
    // One delayed pass covers late-loading catalog bridges without polling forever.
    setTimeout(() => refresh(app), 700);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install, {once:true});
  else install();
})();
