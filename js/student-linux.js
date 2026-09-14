/* OSPulse catalog polish: stable filters, Student Linux, Dual Boot and duplicate cleanup. */
(() => {
  'use strict';

  const STUDENT_NAMES = new Set([
    'Ubuntu','Linux Mint','Fedora','Debian','Zorin OS','Pop!_OS','KDE neon',
    'Ubuntu MATE','Ubuntu Budgie','Xubuntu','Ubuntu Cinnamon','Edubuntu',
    'elementary OS','Manjaro','openSUSE','MX Linux','Kubuntu','Lubuntu',
    'Ubuntu Studio','EndeavourOS','Deepin OS','Deepin','Pardus','Linux Lite',
    'Q4OS','Peppermint OS','Solus','Nobara Linux','Nobara','Bazzite','NixOS'
  ]);

  const DUAL_BOOT_NAMES = new Set([
    'Ubuntu','Linux Mint','Fedora','Debian','Zorin OS','Pop!_OS','KDE neon',
    'Ubuntu MATE','Ubuntu Budgie','Xubuntu','Ubuntu Cinnamon','Kubuntu','Lubuntu',
    'elementary OS','Manjaro','openSUSE','MX Linux','EndeavourOS','Deepin OS','Deepin',
    'Pardus','Linux Lite','Q4OS','Peppermint OS','Solus','Nobara Linux','Nobara',
    'Arch Linux','Garuda Linux','CachyOS','Bodhi Linux','antiX','SparkyLinux','Archcraft',
    'Bazzite'
  ]);

  const BASE_TYPES = ['Linux','Gaming','BSD','Mobile','Alternative','Retro','Media'];
  const SPECIAL_TYPES = ['Student Linux','Dual Boot','Network Boot'];
  const norm = value => String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '');
  const studentNorm = new Set([...STUDENT_NAMES].map(norm));
  const dualNorm = new Set([...DUAL_BOOT_NAMES].map(norm));

  const isLinuxLike = system => {
    const type = String(system?.type || '').toLowerCase();
    return type === 'linux' || type === 'gaming';
  };

  function isStudentSystem(system) {
    if (!system || !isLinuxLike(system)) return false;
    if (studentNorm.has(norm(system.name))) return true;
    const hay = [system.name, system.description, ...(system.useCases || []), ...(system.category || [])].join(' ').toLowerCase();
    return /student|education|school|study|office|programming|development|learning/.test(hay)
      && !/penetration|forensic|security research|server-only/.test(hay);
  }

  function isDualBootSystem(system) {
    if (!system) return false;
    if (norm(system.name) === 'netbootxyz') return true;
    return isLinuxLike(system) && dualNorm.has(norm(system.name));
  }

  function dedupeSystems(app) {
    const seen = new Map();
    for (const system of app.systems || []) {
      if (!system) continue;
      const key = norm(system.id || system.name);
      if (!key) continue;
      if (!seen.has(key)) seen.set(key, system);
      else {
        const current = seen.get(key);
        seen.set(key, { ...current, ...system,
          category: [...new Set([...(current.category || []), ...(system.category || [])])],
          useCases: [...new Set([...(current.useCases || []), ...(system.useCases || [])])]
        });
      }
    }
    app.systems = [...seen.values()];
  }

  function tagSystems(app) {
    dedupeSystems(app);
    app.systems.forEach(system => {
      system.category = Array.isArray(system.category) ? system.category.filter(Boolean) : [];
      system.useCases = Array.isArray(system.useCases) ? system.useCases.filter(Boolean) : [];
      system.architecture = Array.isArray(system.architecture) ? system.architecture.filter(Boolean) : [];

      if (isStudentSystem(system)) {
        system.category = [...new Set([...system.category, 'Student Linux'])];
        system.useCases = [...new Set([...system.useCases, 'Students'])];
      }

      if (isDualBootSystem(system)) {
        system.category = [...new Set([...system.category, 'Dual Boot'])];
        system.useCases = [...new Set([...system.useCases, 'Dual Boot'])];
        system.dualBoot = true;
      }
    });
  }

  function rebuildTypeOptions() {
    const select = document.getElementById('typeFilter');
    if (!select) return;
    const selected = select.value;
    const wanted = ['', ...BASE_TYPES, ...SPECIAL_TYPES];
    select.replaceChildren(...wanted.map(value => {
      const option = document.createElement('option');
      option.value = value;
      option.textContent = value || 'All types';
      return option;
    }));
    if (wanted.includes(selected)) select.value = selected;
  }

  function rebuildTypeChips(app) {
    const host = document.getElementById('typeFilters');
    if (!host) return;
    host.replaceChildren(...[...BASE_TYPES, ...SPECIAL_TYPES].map(type => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'chip';
      button.textContent = type;
      button.dataset.catalogFilter = type;
      button.addEventListener('click', () => {
        const select = document.getElementById('typeFilter');
        if (select) select.value = type;
        app.applyFilters?.();
      });
      return button;
    }));
  }

  function patchRenderTypes(app) {
    app.renderTypes = function() {
      rebuildTypeOptions();
      rebuildTypeChips(app);
    };
  }

  function patchRenderAll(app) {
    if (app.__catalogRenderAllPatched) return;
    const original = app.renderAll.bind(app);
    app.renderAll = function() {
      tagSystems(app);
      const result = original();
      app.renderTypes?.();
      return result;
    };
    app.__catalogRenderAllPatched = true;
  }

  function patchPopulateCompare(app) {
    app.populateCompare = function() {
      const systems = [...app.systems].sort((a, b) => String(a.name).localeCompare(String(b.name)));
      ['compareA','compareB'].forEach(id => {
        const select = document.getElementById(id);
        if (!select) return;
        const selected = select.value;
        select.innerHTML = '<option value="">Choose a system</option>' + systems.map(system =>
          `<option value="${app.esc(system.id)}">${app.esc(system.name)}</option>`
        ).join('');
        if (systems.some(system => system.id === selected)) select.value = selected;
      });
    };
  }

  function restoreHashFilter(app) {
    const query = new URLSearchParams(location.hash.split('?')[1] || '');
    const requested = query.get('type');
    const select = document.getElementById('typeFilter');
    if (requested && select && [...select.options].some(option => option.value === requested)) {
      select.value = requested;
      app.applyFilters?.();
    }
  }

  function refresh(app) {
    tagSystems(app);
    app.renderTypes?.();
    app.populateCompare?.();
    app.setText?.('statTotal', `${app.systems.length}+`);
    app.setText?.('gamingCount', app.gaming?.length || 0);
    restoreHashFilter(app);
    app.applyFilters?.();
  }

  function install() {
    const app = window.app;
    if (!app || !Array.isArray(app.systems) || !app.systems.length) {
      setTimeout(install, 100);
      return;
    }

    patchRenderTypes(app);
    patchRenderAll(app);
    patchPopulateCompare(app);
    refresh(app);

    // Re-apply tags after asynchronously loaded catalog extensions.
    let lastSignature = '';
    const watcher = setInterval(() => {
      if (!window.app) return;
      const signature = `${app.systems.length}:${app.gaming?.length || 0}`;
      if (signature !== lastSignature) {
        lastSignature = signature;
        refresh(app);
      }
    }, 500);
    window.setTimeout(() => clearInterval(watcher), 20000);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install, { once: true });
  else install();
})();
