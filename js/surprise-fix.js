/* OSPulse Surprise Me hard fallback.
   This is intentionally independent from the main app event wiring so the
   Home and Explore buttons keep working even when other UI modules replace
   or rebind them. */
(() => {
  const state = { lastId: null, busy: false };

  const getPool = () => {
    const app = window.app;
    if (Array.isArray(app?.systems) && app.systems.length) return app.systems.filter(s => s?.id);
    return [];
  };

  const pick = () => {
    const pool = getPool();
    if (!pool.length) return null;
    const choices = pool.length > 1 && state.lastId
      ? pool.filter(s => s.id !== state.lastId)
      : pool;
    const selected = choices[Math.floor(Math.random() * choices.length)];
    state.lastId = selected.id;
    return selected;
  };

  const run = (button) => {
    if (state.busy) return;
    const app = window.app;
    if (!app) {
      console.warn('[OSPulse] Surprise Me: app is not ready yet.');
      return;
    }

    const selected = pick();
    if (!selected) {
      app.toast?.('OS catalog is still loading — try again in a moment.');
      return;
    }

    state.busy = true;
    const original = button.innerHTML;
    button.disabled = true;
    button.classList.add('surprising');
    button.innerHTML = '<i class="fa-solid fa-dice-d20 fa-spin"></i> Rolling...';

    const grid = document.getElementById('systemGrid');
    grid?.classList.add('surprise-pulse');

    window.setTimeout(() => {
      grid?.classList.remove('surprise-pulse');
      try {
        if (typeof app.open === 'function') app.open(selected);
        else window.location.hash = 'explore';
      } finally {
        button.disabled = false;
        button.classList.remove('surprising');
        button.innerHTML = original || '<i class="fa-solid fa-shuffle"></i> Surprise me';
        state.busy = false;
      }
    }, 700);
  };

  window.OSPulseSurprise = run;

  // Capture phase means this wins over old app listeners and other delegated
  // handlers, while still allowing unrelated buttons to behave normally.
  document.addEventListener('click', (event) => {
    const button = event.target?.closest?.('#randomBtnHome, #randomBtn');
    if (!button) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    run(button);
  }, true);

  const wire = () => {
    document.querySelectorAll('#randomBtnHome, #randomBtn').forEach(button => {
      button.type = 'button';
      button.setAttribute('aria-label', 'Surprise me with a random operating system');
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wire, { once: true });
  } else {
    wire();
  }
  new MutationObserver(wire).observe(document.documentElement, { childList: true, subtree: true });
})();
