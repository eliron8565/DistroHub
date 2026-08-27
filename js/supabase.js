/* OSPulse Supabase integration. Browser-safe publishable key only. */
(() => {
  const SUPABASE_URL = 'https://ucwqjkokqfrbhlhpqmqa.supabase.co';
  const SUPABASE_PUBLISHABLE_KEY = window.DISTROHUB_SUPABASE_PUBLISHABLE_KEY || '';
  const REMEMBER_KEY = 'ospulse:remember-device';
  let client = null;
  let authListenerAttached = false;

  const rememberDevice = () => localStorage.getItem(REMEMBER_KEY) !== 'false';
  const authStorage = {
    getItem(key) {
      try {
        const primary = rememberDevice() ? localStorage : sessionStorage;
        return primary.getItem(key);
      } catch { return null; }
    },
    setItem(key, value) {
      try {
        const primary = rememberDevice() ? localStorage : sessionStorage;
        const secondary = rememberDevice() ? sessionStorage : localStorage;
        primary.setItem(key, value);
        secondary.removeItem(key);
      } catch {}
    },
    removeItem(key) {
      try { localStorage.removeItem(key); sessionStorage.removeItem(key); } catch {}
    }
  };

  function emitAuth(event, session) {
    const user = session?.user || null;
    window.dispatchEvent(new CustomEvent('osPulseAuthChanged', { detail: { event, user } }));
  }

  async function loadClient() {
    if (!SUPABASE_PUBLISHABLE_KEY || !window.supabase?.createClient) return null;
    if (!client) {
      client = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          storage: authStorage
        }
      });
      if (!authListenerAttached) {
        authListenerAttached = true;
        client.auth.onAuthStateChange((event, session) => emitAuth(event, session));
      }
    }
    return client;
  }

  function setRememberDevice(value) {
    const remember = Boolean(value);
    localStorage.setItem(REMEMBER_KEY, remember ? 'true' : 'false');
    if (remember) {
      // Move an existing session token to persistent storage if one exists.
      try {
        const key = Object.keys(sessionStorage).find(k => k.startsWith('sb-') && k.endsWith('-auth-token'));
        if (key) localStorage.setItem(key, sessionStorage.getItem(key));
      } catch {}
    } else {
      // Never leave a persistent auth token behind when the user chose this session only.
      try {
        Object.keys(localStorage).filter(k => k.startsWith('sb-') && k.endsWith('-auth-token')).forEach(k => localStorage.removeItem(k));
      } catch {}
    }
    return remember;
  }

  async function currentUser() {
    const sb = await loadClient();
    if (!sb) return null;
    const { data } = await sb.auth.getUser();
    return data?.user || null;
  }

  async function saveFavorite(systemId, name, type) {
    const sb = await loadClient(); const user = await currentUser();
    if (!sb || !user) return { ok:false, reason:'auth' };
    const { error } = await sb.from('user_favorites').upsert({ user_id:user.id, system_id:systemId, name, type }, { onConflict:'user_id,system_id' });
    return { ok:!error, error };
  }

  async function removeFavorite(systemId) {
    const sb = await loadClient(); const user = await currentUser();
    if (!sb || !user) return { ok:false, reason:'auth' };
    const { error } = await sb.from('user_favorites').delete().eq('user_id', user.id).eq('system_id', systemId);
    return { ok:!error, error };
  }

  async function recordHistory(systemId, name, type) {
    const sb = await loadClient(); const user = await currentUser();
    if (!sb || !user) return { ok:false, reason:'auth' };
    const { error } = await sb.from('user_history').insert({ user_id:user.id, system_id:systemId, name, type });
    return { ok:!error, error };
  }

  window.DistroHubSupabase = { loadClient, currentUser, saveFavorite, removeFavorite, recordHistory, setRememberDevice, rememberDevice };
})();
