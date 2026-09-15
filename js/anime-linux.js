/* Anime Linux catalog for OSPulse. Verified downloadable projects only. */
(() => {
  'use strict';

  const entries = [
    {
      id: 'nyarch-linux', name: 'Nyarch Linux', type: 'Linux',
      category: ['Anime Linux', 'Desktop', 'Arch-based', 'Dual Boot'],
      base: 'Arch Linux', release: 'Semi-Rolling', packageManager: 'pacman / AUR',
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
      id: 'uwuntu', name: 'UwUntu', type: 'Linux',
      category: ['Anime Linux', 'Desktop', 'Ubuntu-based', 'Beginner Friendly'],
      base: 'Ubuntu / Ubuntu Budgie', release: 'Point Release', packageManager: 'APT / Flatpak',
      desktopEnvironment: 'Budgie', architecture: ['x86_64'], difficulty: 'Beginner',
      description: 'Ubuntu-based community Linux distribution with anime/weeb customization, a friendly desktop and pre-installed applications.',
      useCases: ['Anime', 'Desktop', 'Customization', 'Beginners', 'Multimedia'],
      license: 'Free / Open', openSource: true,
      website: 'https://uwuntuos.com/', download: 'https://uwuntuos.com/en/downloads', downloadUrl: 'https://uwuntuos.com/en/downloads',
      source: 'https://github.com/Duxi4/UwUntu',
      logo: 'https://www.google.com/s2/favicons?domain=uwuntuos.com&sz=128',
      tags: ['anime', 'weeb', 'otaku', 'uwuntu', 'ubuntu', 'budgie', 'beginner']
    }
  ];

  const removedIds = new Set(['lainos']);
  const key = v => String(v || '').toLowerCase().replace(/[^a-z0-9]+/g, '');

  function ensureEntries(app) {
    // Remove entries the site owner explicitly does not want in Anime Linux.
    app.systems = app.systems.filter(s => !removedIds.has(key(s.id)) && key(s.name) !== 'lainos');
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
    app.populateCompare?.();
  }

  function install() {
    const app = window.app;
    if (!app || !Array.isArray(app.systems) || !app.systems.length) return setTimeout(install, 120);

    if (!app.__animeTypesPatched && typeof app.renderTypes === 'function') {
      const originalRenderTypes = app.renderTypes.bind(app);
      app.renderTypes = function() { originalRenderTypes(); ensureUI(app); };
      app.__animeTypesPatched = true;
    }

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
    setTimeout(() => refresh(app), 700);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install, {once:true});
  else install();
})();
