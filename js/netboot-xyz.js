/* netboot.xyz integration for OSPulse.
   Adds the network boot installer as a polished utility entry and makes it easy to discover. */
(() => {
  const NETBOOT = {
    id: 'netboot-xyz',
    name: 'netboot.xyz',
    type: 'Alternative',
    category: ['Network Boot', 'Installer', 'Utility', 'Dual Boot'],
    description: 'Open-source iPXE network boot environment for launching Linux installers, live systems and rescue tools from one lightweight boot image.',
    website: 'https://netboot.xyz/',
    download: 'https://netboot.xyz/downloads/',
    docs: 'https://netboot.xyz/docs/',
    source: 'https://github.com/netbootxyz/netboot.xyz',
    license: 'Open Source',
    openSource: true,
    architecture: ['x86_64', 'ARM64'],
    difficulty: 'Intermediate',
    useCases: ['Install Linux', 'Network Boot', 'PXE', 'Rescue', 'Homelab', 'Dual Boot setup'],
    bootModes: ['UEFI', 'Legacy BIOS'],
    tags: ['iPXE', 'PXE', 'USB', 'ISO', 'UEFI', 'BIOS', 'network installer', 'dual boot'],
    logo: 'https://netboot.xyz/img/nbxyz-logo.svg',
    base: 'iPXE',
    packageManager: '—',
    featured: true
  };

  const norm = value => String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '');

  function ensureTypeOption() {
    const select = document.getElementById('typeFilter');
    if (!select || select.querySelector('option[value="Network Boot"]')) return;
    const option = document.createElement('option');
    option.value = 'Network Boot';
    option.textContent = 'Network Boot';
    select.appendChild(option);
  }

  function ensureChip() {
    const chips = document.getElementById('typeFilters');
    if (!chips || chips.querySelector('[data-netboot-filter]')) return;
    const button = document.createElement('button');
    button.className = 'chip';
    button.dataset.netbootFilter = 'true';
    button.textContent = 'Network Boot';
    button.addEventListener('click', () => {
      const filter = document.getElementById('typeFilter');
      if (filter) filter.value = 'Network Boot';
      window.app?.applyFilters();
    });
    chips.appendChild(button);
  }

  function patchRenderTypes(app) {
    if (app.__netbootTypesPatched || typeof app.renderTypes !== 'function') return;
    const original = app.renderTypes.bind(app);
    app.renderTypes = function() {
      original();
      ensureTypeOption();
      ensureChip();
    };
    app.__netbootTypesPatched = true;
  }

  function addEntry(app) {
    const existing = app.systems.find(system => norm(system.name) === 'netbootxyz');
    if (existing) Object.assign(existing, NETBOOT);
    else app.systems.push(NETBOOT);
  }

  function install() {
    const app = window.app;
    if (!app || !Array.isArray(app.systems)) {
      setTimeout(install, 120);
      return;
    }

    addEntry(app);
    patchRenderTypes(app);
    ensureTypeOption();
    ensureChip();

    // Keep counters in sync with dynamically added entries.
    if (typeof app.setText === 'function') app.setText('statTotal', `${app.systems.length}+`);
    if (typeof app.applyFilters === 'function') app.applyFilters();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install);
  else install();
})();
