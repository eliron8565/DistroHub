/* DistroHub Supabase integration. Only the browser-safe publishable key belongs here. */
(() => {
  const SUPABASE_URL = 'https://ucwqjkokqfrbhlhpqmqa.supabase.co';
  const SUPABASE_PUBLISHABLE_KEY = window.DISTROHUB_SUPABASE_PUBLISHABLE_KEY || '';
  let client = null;

  async function loadClient() {
    if (!SUPABASE_PUBLISHABLE_KEY || !window.supabase?.createClient) return null;
    if (!client) client = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
    });
    return client;
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

  window.DistroHubSupabase = { loadClient, currentUser, saveFavorite, removeFavorite, recordHistory };
})();
