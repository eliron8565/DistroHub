/* OSPulse Owner Console. Authorization is checked by Supabase RPC/RLS, not by frontend-only flags. */
(() => {
  const api = () => window.DistroHubSupabase;
  let modal;
  const setupCode = () => (document.getElementById('ownerSetupCode')?.value || '').trim();
  async function hash(value){const bytes=new TextEncoder().encode(value);const digest=await crypto.subtle.digest('SHA-256',bytes);return [...new Uint8Array(digest)].map(b=>b.toString(16).padStart(2,'0')).join('')}
  function build(){
    if(document.getElementById('ownerModal')) return;
    document.body.insertAdjacentHTML('beforeend',`<div class="owner-modal" id="ownerModal" aria-hidden="true"><div class="owner-backdrop"></div><section class="owner-card" role="dialog" aria-modal="true" aria-labelledby="ownerTitle"><div class="owner-head"><div class="owner-title"><div class="eyebrow">OWNER CONSOLE</div><h2 id="ownerTitle">OSPulse Owner Dashboard</h2><p>Private operational analytics and Linux discovery activity.</p></div><button class="owner-close" id="ownerClose" aria-label="Close"><i class="fa-solid fa-xmark"></i></button></div><div id="ownerContent"><div class="owner-note">Checking owner access…</div></div></section></div>`);
    modal=document.getElementById('ownerModal');
    document.getElementById('ownerClose').onclick=close;
    modal.querySelector('.owner-backdrop').onclick=close;
  }
  function close(){modal?.classList.remove('show');modal?.setAttribute('aria-hidden','true')}
  async function rpc(name,args={}){const client=await api()?.loadClient();if(!client)throw new Error('Supabase is not configured');const {data,error}=await client.rpc(name,args);if(error)throw error;return data}
  async function render(){
    build();modal.classList.add('show');modal.setAttribute('aria-hidden','false');
    const content=document.getElementById('ownerContent');
    try{
      const isOwner=await rpc('owner_is_active',{p_user_id:(await api().currentUser())?.id});
      if(!isOwner){
        content.innerHTML=`<div class="owner-section"><h3>Owner access setup</h3><p class="owner-muted">Use your dedicated Supabase account, then enter the one-time Owner setup code.</p><div class="owner-setup"><input id="ownerSetupCode" type="password" placeholder="Owner setup code" autocomplete="off"><button class="btn primary" id="claimOwner">Activate Owner Access</button></div><div class="owner-note">The setup code is single-use and is never stored in the browser.</div></div>`;
        document.getElementById('claimOwner').onclick=claim;
        return;
      }
      const data=await rpc('owner_dashboard_data');
      renderDashboard(data);
    }catch(e){content.innerHTML=`<div class="owner-note owner-danger">Owner access unavailable. Sign in with the dedicated owner account.</div>`;console.error(e)}
  }
  async function claim(){
    const user=await api()?.currentUser();if(!user)return;
    const code=setupCode();if(!code)return;
    try{const ok=await rpc('consume_owner_setup',{p_user_id:user.id,p_code_hash:await hash(code)});if(!ok)throw new Error('Invalid or already used setup code');await render();}catch(e){document.getElementById('ownerContent').insertAdjacentHTML('beforeend',`<p class="owner-danger">${e.message||'Could not activate owner access.'}</p>`)}
  }
  function renderDashboard(d){
    const t=d?.totals||{};const users=d?.users||[];const activity=d?.recent_activity||[];const signins=d?.recent_signins||[];const favs=d?.favorites||[];
    document.getElementById('ownerContent').innerHTML=`<div class="owner-grid"><div class="owner-stat"><strong>${t.users??0}</strong><span>Users</span></div><div class="owner-stat"><strong>${t.signins??0}</strong><span>Sign-ins</span></div><div class="owner-stat"><strong>${t.unique_ips??0}</strong><span>Unique IP hashes</span></div><div class="owner-stat"><strong>${t.history??0}</strong><span>Tracked activity</span></div></div><div class="owner-section"><h3>Users & activity</h3><table class="owner-table"><thead><tr><th>User</th><th>Username</th><th>Favorites</th><th>Activity</th><th>Last activity</th></tr></thead><tbody>${users.map(u=>`<tr><td>${esc(u.email||u.id)}</td><td>${esc(u.username||'—')}</td><td>${u.favorite_count??0}</td><td>${u.history_count??0}</td><td>${fmt(u.last_activity)}</td></tr>`).join('')||'<tr><td colspan="5">No users yet.</td></tr>'}</tbody></table></div><div class="owner-section"><h3>Recent system activity</h3><table class="owner-table"><thead><tr><th>User</th><th>System ID</th><th>Action</th><th>Time</th></tr></thead><tbody>${activity.map(x=>`<tr><td>${esc(x.user_id)}</td><td><span class="owner-pill">${esc(x.distro_id)}</span></td><td>${esc(x.action||'view')}</td><td>${fmt(x.created_at)}</td></tr>`).join('')||'<tr><td colspan="4">No activity yet.</td></tr>'}</tbody></table></div><div class="owner-section"><h3>Recent sign-ins</h3><table class="owner-table"><thead><tr><th>User</th><th>IP hash</th><th>User agent</th><th>Time</th></tr></thead><tbody>${signins.map(x=>`<tr><td>${esc(x.user_id)}</td><td><span class="owner-pill">${esc(x.ip_hash)}</span></td><td>${esc(x.user_agent||'—')}</td><td>${fmt(x.created_at)}</td></tr>`).join('')||'<tr><td colspan="4">No sign-ins recorded yet.</td></tr>'}</tbody></table><div class="owner-note">IP addresses are represented by hashes rather than exposed raw IPs.</div></div><div class="owner-section"><h3>Recent favorites</h3><table class="owner-table"><thead><tr><th>User</th><th>System</th><th>Time</th></tr></thead><tbody>${favs.map(x=>`<tr><td>${esc(x.user_id)}</td><td>${esc(x.distro_id)}</td><td>${fmt(x.created_at)}</td></tr>`).join('')||'<tr><td colspan="3">No favorites yet.</td></tr>'}</tbody></table></div>`;
  }
  function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
  function fmt(v){if(!v)return '—';try{return new Date(v).toLocaleString()}catch{return String(v)}}
  function injectTrigger(){
    const profile=()=>document.querySelector('#profileModal .profile-signout-wrap');
    const add=()=>{const wrap=profile();if(!wrap||wrap.querySelector('.owner-console-trigger'))return;const b=document.createElement('button');b.className='btn ghost owner-console-trigger';b.type='button';b.innerHTML='<i class="fa-solid fa-gauge-high"></i> Owner Console';b.onclick=render;wrap.appendChild(b);};
    add();new MutationObserver(add).observe(document.body,{childList:true,subtree:true});
  }
  function install(){build();injectTrigger();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install);else install();
})();
