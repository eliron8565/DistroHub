/* netboot.xyz integration for OSPulse. Adds the network boot installer as a utility entry. */
(() => {
  const NETBOOT = {
    id: 'netboot-xyz',
    name: 'netboot.xyz',
    type: 'Alternative',
    category: ['Network Boot', 'Installer', 'Utility', 'Dual Boot'],
    description: 'Network-based iPXE bootloader for launching operating-system installers, live environments and rescue utilities from one small boot image.',
    website: 'https://netboot.xyz/',
    download: 'https://netboot.xyz/downloads/',
    source: 'https://github.com/netbootxyz/netboot.xyz',
    license: 'Open Source',
    architectures: ['x86_64', 'ARM64'],
    architecture: ['x86_64', 'ARM64'],
    difficulty: 'Intermediate',
    useCases: ['Install Linux', 'Network Boot', 'PXE', 'Rescue', 'Homelab', 'Dual Boot setup'],
    bootModes: ['UEFI', 'Legacy BIOS'],
    tags: ['iPXE', 'PXE', 'USB', 'ISO', 'UEFI', 'BIOS', 'network installer', 'dual boot'],
    logo: 'https://netboot.xyz/img/nbxyz-logo.svg',
    featured: true
  };

  const norm = value => String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '');

  function install() {
    const app = window.app;
    if (!app || !Array.isArray(app.systems)) {
      setTimeout(install, 120);
      return;
    }

    if (!app.systems.some(system => norm(system.name) === 'netbootxyz')) {
      app.systems.push(NETBOOT);
    }

    if (typeof app.renderTypes === 'function') app.renderTypes();
    if (typeof app.populateCompare === 'function') app.populateCompare();
    if (typeof app.applyFilters === 'function') app.applyFilters();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install);
  else install();
})();
