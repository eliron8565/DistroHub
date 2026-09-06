/* Student Linux: a simple curated category built from the existing catalog. */
(() => {
  const STUDENT_NAMES = new Set([
    'Ubuntu','Linux Mint','Fedora','Debian','Zorin OS','Pop!_OS','KDE neon',
    'Ubuntu MATE','Ubuntu Budgie','Xubuntu','Ubuntu Cinnamon','Edubuntu',
    'elementary OS','Manjaro','openSUSE','MX Linux','Kubuntu','Lubuntu',
    'Ubuntu Studio','EndeavourOS','Deepin OS','Pardus','Linux Lite','Q4OS',
    'Peppermint OS','Solus','Nobara','Bazzite','NixOS'
  ]);

  function addStudentCategory() {
    if (!window.app || !Array.isArray(window.app.systems) || !window.app.systems.length) return false;
    window.app.systems.forEach(system => {
      if (!STUDENT_NAMES.has(system.name)) return;
      system.category = Array.from(new Set([...(system.category || []), 'Student Linux']));
      system.useCases = Array.from(new Set([...(system.useCases || []), 'Students']));
    });
    if (typeof window.app.renderTypes === 'function') window.app.renderTypes();
    if (typeof window.app.applyFilters === 'function') window.app.applyFilters();
    return true;
  }

  function addStudentUI() {
    const typeSelect = document.getElementById('typeFilter');
    if (typeSelect && !typeSelect.querySelector('option[value="Student Linux"]')) {
      const option = document.createElement('option');
      option.value = 'Student Linux'; option.textContent = 'Student Linux';
      typeSelect.appendChild(option);
    }
    const chips = document.getElementById('typeFilters');
    if (chips && !chips.querySelector('[data-student-filter]')) {
      const button = document.createElement('button');
      button.className = 'chip student-chip'; button.dataset.studentFilter = 'true';
      button.textContent = 'Student Linux';
      button.addEventListener('click', () => {
        const filter = document.getElementById('typeFilter');
        if (filter) filter.value = 'Student Linux';
        window.app?.applyFilters();
      });
      chips.appendChild(button);
    }
    if (!document.getElementById('student-family-card')) {
      const grid = document.querySelector('.family-grid');
      if (grid) {
        const card = document.createElement('a');
        card.id = 'student-family-card';
        card.href = '#explore?type=Student%20Linux';
        card.className = 'family-card student';
        card.innerHTML = '<span class="family-icon"><i class="fa-solid fa-graduation-cap"></i></span><div><b>Student Linux</b><span>Study, coding & everyday work</span></div><i class="fa-solid fa-arrow-up-right-from-square"></i>';
        card.addEventListener('click', e => { e.preventDefault(); location.hash = 'explore?type=Student%20Linux'; });
        grid.appendChild(card);
      }
    }
  }

  function start() {
    if (addStudentCategory()) { addStudentUI(); return; }
    setTimeout(start, 150);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
