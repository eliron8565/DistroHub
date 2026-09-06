/* Student Linux: reliable curated category. */
(() => {
  const STUDENT_NAMES = new Set([
    'Ubuntu','Linux Mint','Fedora','Debian','Zorin OS','Pop!_OS','KDE neon',
    'Ubuntu MATE','Ubuntu Budgie','Xubuntu','Ubuntu Cinnamon','Edubuntu',
    'elementary OS','Manjaro','openSUSE','MX Linux','Kubuntu','Lubuntu',
    'Ubuntu Studio','EndeavourOS','Deepin OS','Deepin','Pardus','Linux Lite',
    'Q4OS','Peppermint OS','Solus','Nobara Linux','Nobara','Bazzite','NixOS'
  ]);

  const normalizeName = name => String(name || '').toLowerCase().replace(/[^a-z0-9]+/g,'');
  const normalizedNames = new Set([...STUDENT_NAMES].map(normalizeName));

  function isStudentSystem(system) {
    if (!system || String(system.type).toLowerCase() !== 'linux') return false;
    if (normalizedNames.has(normalizeName(system.name))) return true;
    const hay = [system.name, system.description, ...(system.useCases || []), ...(system.category || [])].join(' ').toLowerCase();
    return /student|education|school|study|office|programming|development|learning/.test(hay) && !/penetration|forensic|security research|server-only/.test(hay);
  }

  function addCategory() {
    const app = window.app;
    if (!app || !Array.isArray(app.systems) || !app.systems.length) return false;
    let count = 0;
    app.systems.forEach(system => {
      if (isStudentSystem(system)) {
        system.category = Array.from(new Set([...(system.category || []), 'Student Linux']));
        system.useCases = Array.from(new Set([...(system.useCases || []), 'Students']));
        count++;
      }
    });
    return count > 0;
  }

  function addUI() {
    const select = document.getElementById('typeFilter');
    if (select && !select.querySelector('option[value="Student Linux"]')) {
      const option = document.createElement('option');
      option.value = 'Student Linux';
      option.textContent = 'Student Linux';
      select.appendChild(option);
    }
    const chips = document.getElementById('typeFilters');
    if (chips && !chips.querySelector('[data-student-filter]')) {
      const button = document.createElement('button');
      button.className = 'chip student-chip';
      button.dataset.studentFilter = 'true';
      button.textContent = 'Student Linux';
      button.addEventListener('click', () => {
        const f = document.getElementById('typeFilter');
        if (f) f.value = 'Student Linux';
        window.app?.applyFilters();
      });
      chips.appendChild(button);
    }
  }

  function patchRenderTypes() {
    const app = window.app;
    if (!app || app.__studentLinuxPatched) return false;
    const original = app.renderTypes.bind(app);
    app.renderTypes = function() {
      original();
      addUI();
    };
    app.__studentLinuxPatched = true;
    return true;
  }

  function start() {
    const app = window.app;
    if (!app || !app.systems?.length) {
      setTimeout(start, 100);
      return;
    }
    addCategory();
    patchRenderTypes();
    addUI();
    app.applyFilters();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
