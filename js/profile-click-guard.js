/* Final account-button guard. Runs in capture phase so legacy click handlers cannot sign out. */
(() => {
  function install() {
    const button = document.getElementById('accountBtn');
    if (!button || button.dataset.profileGuardInstalled === '1') return;
    button.dataset.profileGuardInstalled = '1';
    button.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      const openProfile = window.OSPulseOpenProfile;
      if (typeof openProfile === 'function') openProfile();
      else if (window.app?.user) window.app?.openProfile?.();
      else window.app?.openAuth?.();
    }, true);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install);
  else install();
  const observer = new MutationObserver(install);
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
