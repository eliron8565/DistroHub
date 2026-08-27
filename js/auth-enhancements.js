/* OSPulse auth enhancements: remember-device preference + server-side sign-in event tracking. */
(() => {
  const api = () => window.DistroHubSupabase;
  const REMEMBER_KEY = 'ospulse:remember-device';

  function ensureRememberField() {
    const form = document.getElementById('authForm');
    if (!form || document.getElementById('rememberDeviceRow')) return;
    const row = document.createElement('label');
    row.id = 'rememberDeviceRow';
    row.className = 'remember-row';
    row.innerHTML = '<input id="rememberDevice" type="checkbox" autocomplete="off"><span><b>Remember me</b><small>Keep me signed in on this device</small></span>';
    const submit = document.getElementById('authSubmit');
    form.insertBefore(row, submit);
    const stored = localStorage.getItem(REMEMBER_KEY);
    document.getElementById('rememberDevice').checked = stored !== 'false';
    document.getElementById('rememberDevice').addEventListener('change', e => {
      api()?.setRememberDevice?.(e.target.checked);
    });
  }

  async function trackSignIn(event, session) {
    if (event !== 'SIGNED_IN' || !session?.access_token) return;
    try {
      const base = await api()?.loadClient();
      if (!base) return;
      await base.functions.invoke('record-signin', {
        headers: { Authorization: `Bearer ${session.access_token}` },
        body: { source: 'web' }
      });
    } catch (err) {
      console.warn('[OSPulse] Sign-in tracking unavailable:', err?.message || err);
    }
  }

  function install() {
    ensureRememberField();
    window.addEventListener('osPulseAuthChanged', e => trackSignIn(e.detail?.event, e.detail?.session));
    // Supabase event detail is intentionally session-free in the public event; subscribe directly as well.
    api()?.loadClient?.().then(client => {
      if (!client) return;
      client.auth.onAuthStateChange((event, session) => trackSignIn(event, session));
    }).catch(() => {});
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install); else install();
})();
