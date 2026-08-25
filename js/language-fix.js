/* OSPulse language selector hardening. Keeps the menu above animated UI and makes selection reliable. */
(() => {
  'use strict';

  const loadOverlayStyle = () => {
    if (document.querySelector('link[data-language-overlay]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'css/language-overlay.css?v=2';
    link.dataset.languageOverlay = 'true';
    document.head.appendChild(link);
  };

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

  const openMenu = (target) => {
    const button = target?.closest?.('.lang-btn');
    if (!button) return false;
    const switcher = button.closest('.lang-switcher');
    const menu = switcher?.querySelector('.lang-menu');
    if (!menu) return false;
    const open = !menu.classList.contains('open');
    menu.classList.toggle('open', open);
    button.setAttribute('aria-expanded', String(open));
    return true;
  };

  const init = () => {
    loadOverlayStyle();

    document.addEventListener('pointerdown', (event) => {
      if (choose(event.target) || openMenu(event.target)) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    }, true);

    document.addEventListener('click', (event) => {
      if (choose(event.target) || openMenu(event.target)) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    }, true);

    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      if (choose(event.target) || openMenu(event.target)) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    }, true);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
