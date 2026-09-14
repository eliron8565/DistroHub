/* OSPulse catalog polish: Student Linux, Dual Boot, stable filters and duplicate cleanup. */
(() => {
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
    'Arch Linux','Garuda Linux','CachyOS','Bodhi Linux','antiX','SparkyLinux','Archcraft'
  ]);

  const BASE_TYPES = ['Linux','Gaming','BSD','Mobile','Alternative','Retro','Media'];
  const SPECIAL_TYPES = ['Student Linux','Dual Boot','Network Boot'];
  const norm = value => String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '');
  const studentNorm = new Set([...STUDENT_NAMES].map(norm));
  const dualNorm = new Set([...DUAL_BOOT_NAMES].map(norm));

  function isLinux(system) {
    return String(system?.type || '').toLowerCase() === 'linux';
  }

  function isStudentSystem(system) {
    if (!system || !isLinux(system)) return false;
    if (studentNorm.has(norm(system.name))) return true;
    const hay = [system.name, system.description, ...(system.useCases || []), ...(system.category || [])].join(' ').toLowerCase();
    return /student|education|school|study|office|programming|development|learning/.test(hay)
      && !/penetration|forensic|security research|server-only/.test(hay);
  }

  function isDualBootSystem(system) {
    if (!system) return false;
    if (norm(system.name) === 'netbootxyz') return true;
    return isLinux(system) && dualNorm.has(norm(system.name));
  }

  function tagSystems(app) {
    app.systems.forEach(system => {
      system.category = Array.isArray(system.category) ? system.category : [];
      system.useCases = Array.isArray(system.useCases) ? system.useCases : [];

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
    select.innerHTML = '';
    wanted.forEach(value => {
      const option = document.createElement('option');
      option.value = value;
      option.textContent = value || 'All types';
      select.appendChild(option);
    });
    if (wanted.includes(selected)) select.value = selected;
  }

  function rebuildTypeChips(app) {
    const host = document.getElementById('typeFilters');
    if (!host) return;
    host.innerHTML = '';
    [...BASE_TYPES, ...SPECIAL_TYPES].forEach(type => {
      const button = document.createElement('button');
      button.className = 'chip';
      button.textContent = type;
      button.dataset.catalogFilter = type;
      button.addEventListener('click', () => {
        const select = document.getElementById('typeFilter');
        if (select) select.value = type;
        app.applyFilters?.();
      });
      host.appendChild(button);
    });
  }

  function patchRenderTypes(app) {
    app.renderTypes = function() {
      rebuildTypeOptions();
      rebuildTypeChips(app);
    };
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

  function updateCounters(app) {
    app.setText?.('statTotal', `${app.systems.length}+`);
    app.setText?.('gamingCount', app.gaming?.length || 0);
  }

  function install() {
    const app = window.app;
    if (!app || !Array.isArray(app.systems) || !app.systems.length) {
      setTimeout(install, 100);
      return;
    }

    tagSystems(app);
    patchRenderTypes(app);
    patchPopulateCompare(app);
    app.renderTypes();
    app.populateCompare();
    updateCounters(app);
    restoreHashFilter(app);
    app.applyFilters?.();

    // Guard against old cached scripts or later DOM mutations creating duplicate options.
    const select = document.getElementById('typeFilter');
    if (select && !select.__ospulseDedupeObserver) {
      let queued = false;
      const observer = new MutationObserver(() => {
        if (queued) return;
        queued = true;
        queueMicrotask(() => {
          queued = false;
          const seen = new Set();
          [...select.options].forEach(option => {
            const key = `${option.value}|${option.textContent}`.toLowerCase();
            if (seen.has(key)) option.remove();
            else seen.add(key);
          });
        });
      });
      observer.observe(select, { childList: true });
      select.__ospulseDedupeObserver = observer;
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install);
  else install();
})();
