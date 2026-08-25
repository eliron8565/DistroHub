/* OSPulse language selector hardening. Uses capture-phase delegation so other UI handlers cannot swallow language clicks. */
(() => {
  'use strict';

  const choose = (target) => {
    const option = target?.closest?.('.lang-option');
    if (!option) return false;

    const code = option.dataset.lang;
    if (!code || !window.OSPulseI18n?.apply) return false;

    window.OSPulseI18n.apply(code);

    const switcher = option.closest('.lang-switcher');
    const menu = switcher?.querySelector('.lang-menu');
    const button = switcher?.querySelector('.lang-btn');
    menu?.classList.remove('open');
    button?.setAttribute('aria-expanded', 'false');
    return true;
  };

  document.addEventListener('pointerdown', (event) => {
    if (choose(event.target)) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }, true);

  document.addEventListener('click', (event) => {
    if (event.target?.closest?.('.lang-option')) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }, true);

  // Make the selector keyboard-friendly as well.
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    const option = event.target?.closest?.('.lang-option');
    if (!option) return;
    if (choose(option)) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }, true);
})();
