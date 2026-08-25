/* OSPulse catalog entry: Proton OS (protonos.org). */
(() => {
  'use strict';

  const protonOS = {
    id: 'proton-os',
    name: 'Proton OS',
    type: 'Linux',
    category: ['Desktop', 'Privacy', 'Lightweight', 'Development'],
    base: 'Debian 13',
    release: 'Stable',
    support: 'Active',
    packageManager: 'APT',
    desktopEnvironment: 'KDE Plasma',
    difficulty: 'Beginner',
    architecture: ['x86_64'],
    openSource: true,
    license: 'Open Source',
    description: 'Modern, lightweight Debian-based Linux distribution focused on privacy, security, stability and everyday productivity.',
    fullDescription: 'Proton OS is a Debian 13-based Linux distribution designed for everyday users and small businesses, with a focus on privacy, security, low resource usage and a familiar desktop experience.',
    useCases: ['Desktop', 'Work', 'Privacy', 'Development', 'Old Hardware'],
    pros: ['Debian 13 foundation', 'No background telemetry', 'Security defaults', 'Lightweight desktop', 'Ready for productivity'],
    cons: ['Young project', 'Hardware support should be tested before deployment', 'Smaller ecosystem than major distributions'],
    guide: 'Use the official Proton OS download and documentation pages, and test the live/install image on your hardware before replacing an existing system.',
    logo: 'https://www.protonos.org/favicon.ico',
    downloadUrl: 'https://www.protonos.org/download',
    website: 'https://www.protonos.org/',
    wiki: 'https://www.protonos.org/aboutprotonos',
    requirements: {
      minRam: '4 GB',
      recommendedRam: '8 GB',
      minCpu: 'AMD or Intel 64-bit dual-core',
      recommendedCpu: 'Modern 64-bit quad-core',
      storage: '25 GB',
      gpu: 'Basic modern desktop graphics',
      arch: 'x86_64',
      notes: 'Official Proton OS guidance lists 4 GB RAM, 8 GB recommended, a 64-bit dual-core AMD/Intel CPU and 25 GB storage.'
    }
  };

  const add = () => {
    const app = window.app;
    if (!app || !Array.isArray(app.systems)) return false;
    if (app.systems.some(s => String(s.name).toLowerCase() === 'proton os')) return true;
    const normalized = typeof app.normalize === 'function' ? app.normalize(protonOS, 'Linux') : protonOS;
    app.systems.push(normalized);
    app.filtered = [...app.systems];
    if (typeof app.renderAll === 'function') app.renderAll();
    return true;
  };

  const boot = () => {
    if (add()) return;
    setTimeout(boot, 150);
  };

  // Requirements UI can consume this curated profile without changing the main requirements file.
  const registerRequirements = () => {
    if (window.OSPulseRequirements?.profiles) {
      window.OSPulseRequirements.profiles['Proton OS'] = protonOS.requirements;
      return true;
    }
    return false;
  };

  const start = () => { registerRequirements(); boot(); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
