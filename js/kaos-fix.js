/* Keep the KaOS catalog entry aligned with the official KaOS download page. */
(() => {
  'use strict';
  const KAOS = {
    name: 'KaOS',
    type: 'Linux',
    category: ['Desktop', 'Advanced', 'KDE', 'Rolling Release', 'Dual Boot'],
    base: 'Independent',
    release: 'Rolling',
    packageManager: 'pacman',
    desktopEnvironment: 'KDE Plasma',
    architecture: ['x86_64'],
    difficulty: 'Intermediate',
    description: 'Independent rolling Linux distribution focused on KDE Plasma, Qt and a tightly curated x86_64 desktop experience.',
    useCases: ['Desktop', 'KDE', 'Customization', 'Development', 'Dual Boot'],
    license: 'Open Source',
    openSource: true,
    download: 'https://kaosx.us/download/',
    downloadUrl: 'https://kaosx.us/download/',
    website: 'https://kaosx.us/',
    docs: 'https://kaosx.us/docs/',
    wiki: 'https://kaosx.us/docs/',
    logo: 'https://www.google.com/s2/favicons?domain=kaosx.us&sz=128'
  };

  const norm = value => String(value || '').trim().toLowerCase();

  function apply() {
    const app = window.app;
    if (!app || !Array.isArray(app.systems) || !app.systems.length) {
      setTimeout(apply, 120);
      return;
    }
    const existing = app.systems.find(system => norm(system?.name) === 'kaos');
    if (existing) Object.assign(existing, KAOS);
    else app.systems.push(typeof app.normalize === 'function' ? app.normalize(KAOS, 'Linux') : KAOS);
    if (typeof app.applyFilters === 'function') app.applyFilters();
    if (typeof app.populateCompare === 'function') app.populateCompare();
    if (typeof app.setText === 'function') app.setText('statTotal', `${app.systems.length}+`);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', apply, { once: true });
  else apply();
})();
