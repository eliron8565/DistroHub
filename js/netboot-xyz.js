/* netboot.xyz integration for OSPulse. */
(() => {
  'use strict';

  const NETBOOT = {
    id: 'netboot-xyz',
    name: 'netboot.xyz',
    type: 'Alternative',
    category: ['Network Boot', 'Installer', 'Utility', 'Dual Boot'],
    description: 'Open-source iPXE network boot environment for launching Linux installers, live systems and rescue tools from one lightweight boot image.',
    website: 'https://netboot.xyz/',
    download: 'https://netboot.xyz/downloads/',
    downloadUrl: 'https://netboot.xyz/downloads/',
    docs: 'https://netboot.xyz/docs/',
    source: 'https://github.com/netbootxyz/netboot.xyz',
    license: 'Open Source',
    openSource: true,
    architecture: ['x86_64', 'ARM64'],
    difficulty: 'Intermediate',
    useCases: ['Install Linux', 'Network Boot', 'PXE', 'Rescue', 'Homelab', 'Dual Boot setup'],
    bootModes: ['UEFI', 'Legacy BIOS'],
    tags: ['netboot', 'netboot.xyz', 'iPXE', 'PXE', 'USB', 'ISO', 'UEFI', 'BIOS', 'network installer', 'dual boot'],
    logo: 'https://netboot.xyz/img/nbxyz-logo.svg',
    base: 'iPXE',
    packageManager: '—',
    featured: true
  };

  const norm = value => String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '');

  function ensureTypeOption() {
    const select = document.getElementById('typeFilter');
    if (!select) return;
    const values = new Set();
    [...select.options].forEach(option => {
      const key = String(option.value || option.textContent).trim().toLowerCase();
      if (values.has(key)) option.remove(); else values.add(key);
    });
    if (!select.querySelector('option[value="Network Boot"]')) {
      const option = document.createElement('option');
      option.value = 'Network Boot';
      option.textContent = 'Network Boot';
      select.appendChild(option);
    }
  }

  function ensureChip() {
    const chips = document.getElementById('typeFilters');
    if (!chips) return;
    const existing = [...chips.querySelectorAll('button')].find(b => b.textContent.trim().toLowerCase() === 'network boot');
    if (existing) return;
    const button = document.createElement('button');
    button.className = 'chip';
    button.dataset.netbootFilter = 'true';
    button.textContent = 'Network Boot';
    button.addEventListener('click', () => {
      const filter = document.getElementById('typeFilter');
      if (filter) filter.value = 'Network Boot';
      window.app?.applyFilters?.();
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
    const existing = app.systems.find(system => norm(system.name) === 'netbootxyz' || system.id === NETBOOT.id);
    if (existing) Object.assign(existing, NETBOOT);
    else app.systems.push(typeof app.normalize === 'function' ? app.normalize(NETBOOT, 'Alternative') : NETBOOT);
  }

  function refresh(app) {
    // app.renderAll() must not be used here: other late-loading catalog scripts may be
    // adding entries at the same time. Refresh only the views that depend on systems.
    app.applyFilters?.();
    app.populateCompare?.();
    app.renderFavorites?.();
    app.updateStats?.();
    app.setText?.('statTotal', `${app.systems.length}+`);
  }

  function install() {
    const app = window.app;
    if (!app || !Array.isArray(app.systems) || !app.systems.length) {
      setTimeout(install, 120);
      return;
    }

    addEntry(app);
    patchRenderTypes(app);
    ensureTypeOption();
    ensureChip();
    refresh(app);

    // A user may already have typed "netboot" while this late-loaded entry was
    // being installed. Re-apply once on the next frame so it appears immediately.
    requestAnimationFrame(() => app.applyFilters?.());
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install, { once: true });
  else install();
})();
