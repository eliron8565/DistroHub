class DistroHubApp {
  constructor(){
    this.systems=[]; this.gaming=[]; this.filtered=[];
    this.favorites=new Set(this.safeJson('dh:favorites',[]));
    this.history=this.safeJson('dh:history',[]); this.comparisons=this.safeJson('dh:comparisons',[]);
    this.authMode='login'; this.user=null; this.init();
  }
  safeJson(key,fallback){try{const v=JSON.parse(localStorage.getItem(key)||'null');return v??fallback}catch{return fallback}}
  async init(){this.bindNavigation();this.bindUI();await this.loadData();this.renderAll();await this.initAuth()}
  async getJson(path){const url=new URL(path,document.baseURI).href;const r=await fetch(url,{cache:'no-store'});if(!r.ok)throw new Error(`${path}: ${r.status}`);const data=await r.json();return Array.isArray(data)?data:(Array.isArray(data?.data)?data.data:(Array.isArray(data?.systems)?data.systems:[]))}
  normalize(s,fallbackType='Linux'){
    if(!s||typeof s!=='object')return null;
    const category=Array.isArray(s.category)?s.category:(s.category?[String(s.category)]:[]);
    const architecture=Array.isArray(s.architecture)?s.architecture:(s.architecture?[String(s.architecture)]:[]);
    return {...s,name:String(s.name||'Unnamed OS'),id:String(s.id||this.slug(s.name||Math.random())),type:String(s.type||fallbackType),category,architecture,useCases:Array.isArray(s.useCases)?s.useCases:[],description:String(s.description||s.fullDescription||''),license:String(s.license||'Open source'),openSource:s.openSource!==false};
  }
  async loadData(){
    try{
      const [linux,extra,gaming,open]=await Promise.all([
        this.getJson('data/distros.json'),this.getJson('data/extra-distros.json'),this.getJson('data/gaming-os.json'),this.getJson('data/operating-systems.json')
      ]);
      const map=new Map();
      [...linux,...extra].map(x=>this.normalize(x,'Linux')).filter(Boolean).forEach(x=>map.set(x.name,x));
      open.map(x=>this.normalize(x)).filter(Boolean).forEach(x=>{if(!map.has(x.name))map.set(x.name,x)});
      this.systems=[...map.values()];
      this.gaming=gaming.map(x=>this.normalize(x,'Gaming')).filter(Boolean);
      this.filtered=[...this.systems];
      this.setText('statTotal',`${this.systems.length}+`);this.setText('gamingCount',this.gaming.length);
      console.info(`[DistroHub] Loaded ${this.systems.length} systems and ${this.gaming.length} gaming systems.`);
    }catch(e){
      console.error('[DistroHub] Catalog load failed:',e);
      this.systems=[];this.gaming=[];this.filtered=[];
      this.toast('Catalog failed to load. Check that the data files are available.');
    }
  }
  slug(s){return String(s).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}
  setText(id,value){const el=document.getElementById(id);if(el)el.textContent=value}
  bindNavigation(){
    document.querySelectorAll('[data-page]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();this.showPage(a.dataset.page)}));
    window.addEventListener('hashchange',()=>this.routeHash());this.routeHash();
  }
  routeHash(){const raw=location.hash.replace(/^#/,'');const p=raw.split('?')[0]||'home';this.showPage(['home','explore','gaming','compare','favorites','recommend'].includes(p)?p:'home',false)}
  showPage(p,scroll=true){
    document.querySelectorAll('.page').forEach(x=>x.classList.toggle('active',x.id===p));
    document.querySelectorAll('.main-nav a').forEach(x=>x.classList.toggle('active',x.dataset.page===p));
    if(scroll)history.replaceState(null,'','#'+p);
    if(p==='favorites')this.renderFavorites();
    if(p==='explore'){
      const q=new URLSearchParams(location.hash.split('?')[1]||'');
      const type=q.get('type'); if(type&&document.getElementById('typeFilter')){document.getElementById('typeFilter').value=type;this.applyFilters()}
    }
    window.scrollTo({top:0,behavior:'smooth'});
  }
  bindUI(){
    this.on('searchInput','input',()=>this.applyFilters());
    ['typeFilter','difficultyFilter','archFilter','licenseFilter','sortFilter'].forEach(id=>this.on(id,'change',()=>this.applyFilters()));
    this.on('clearFilters','click',()=>{['searchInput','typeFilter','difficultyFilter','archFilter','licenseFilter'].forEach(id=>{const el=document.getElementById(id);if(el)el.value=''});this.applyFilters()});
    this.on('randomBtn','click',()=>{if(this.systems.length)this.open(this.systems[Math.floor(Math.random()*this.systems.length)])});
    this.on('themeToggle','click',()=>this.toggleTheme());this.on('compareRun','click',()=>this.compare());this.on('quizRun','click',()=>this.recommend());
    this.on('modalClose','click',()=>this.closeModal());this.on('authClose','click',()=>this.closeAuth());
    this.on('accountBtn','click',()=>{
      if(this.user){
        if(typeof window.OSPulseOpenProfile==='function') window.OSPulseOpenProfile();
        else this.openAuth();
      } else this.openAuth();
    });
    this.on('loginFromFav','click',()=>this.openAuth());this.on('authSwitch','click',()=>this.switchAuth());this.on('authForm','submit',e=>this.authSubmit(e));
    this.on('mobileNav','click',()=>document.querySelector('.main-nav')?.classList.toggle('open'));
    document.querySelectorAll('.game-chip').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('.game-chip').forEach(x=>x.classList.remove('active'));b.classList.add('active');this.renderGaming(b.dataset.gameFilter)}));
    document.querySelectorAll('.family-card').forEach(a=>a.addEventListener('click',e=>{if(a.dataset.family){e.preventDefault();location.hash='explore?type='+encodeURIComponent(a.dataset.family)}}));
  }
  on(id,event,fn){document.getElementById(id)?.addEventListener(event,fn)}
  renderAll(){this.renderTypes();this.applyFilters();this.renderGaming('all');this.populateCompare();this.renderFavorites();this.updateStats()}
  renderTypes(){const el=document.getElementById('typeFilters');if(!el)return;el.innerHTML='';['Linux','Gaming','BSD','Mobile','Alternative','Retro','Media'].forEach(t=>{const b=document.createElement('button');b.className='chip';b.textContent=t;b.onclick=()=>{const f=document.getElementById('typeFilter');if(f)f.value=t;this.applyFilters()};el.appendChild(b)})}
  applyFilters(){
    const q=(document.getElementById('searchInput')?.value||'').toLowerCase().trim();
    const type=document.getElementById('typeFilter')?.value||'';const diff=document.getElementById('difficultyFilter')?.value||'';const arch=document.getElementById('archFilter')?.value||'';const lic=document.getElementById('licenseFilter')?.value||'';
    const matches=this.systems.filter(s=>{
      const hay=[s.name,s.description,s.type,s.base,s.desktop,s.license,...s.category,...s.useCases,...s.architecture].filter(Boolean).join(' ').toLowerCase();
      const typeOK=!type||s.type.toLowerCase()===type.toLowerCase()||s.category.some(x=>String(x).toLowerCase()===type.toLowerCase());
      const diffOK=!diff||String(s.difficulty||'').toLowerCase()===diff.toLowerCase();
      const archOK=!arch||s.architecture.some(a=>String(a).toLowerCase().includes(arch.toLowerCase()));
      const licOK=!lic||(s.openSource===true);
      return (!q||hay.includes(q))&&typeOK&&diffOK&&archOK&&licOK;
    });
    this.filtered=matches;
    const sort=document.getElementById('sortFilter')?.value||'name';
    if(sort==='type')this.filtered.sort((a,b)=>a.type.localeCompare(b.type)||a.name.localeCompare(b.name));
    else if(sort==='open')this.filtered.sort((a,b)=>Number(b.openSource)-Number(a.openSource)||a.name.localeCompare(b.name));
    else this.filtered.sort((a,b)=>a.name.localeCompare(b.name));
    if(this.systems.length>0 && this.filtered.length===0 && !q && !type && !diff && !arch && !lic)this.filtered=[...this.systems];
    this.renderSystems(this.filtered,'systemGrid');
  }
  renderSystems(list,target='systemGrid'){
    const el=document.getElementById(target);if(!el)return;
    if(target==='systemGrid')this.setText('resultsCount',`${list.length} systems`);
    el.innerHTML=list.length?list.map(s=>this.card(s)).join(''):'<div class="empty"><i class="fa-solid fa-satellite-dish"></i><h3>No matching systems</h3><p>Try a different filter or search term.</p></div>';
  }
  card(s){
    const fav=this.favorites.has(s.id);const logo=s.logo||this.logoFor(s);
    return `<article class="system-card ${this.esc(String(s.type).toLowerCase())}" data-id="${this.esc(s.id)}"><div class="card-top"><div class="system-logo">${String(logo).startsWith('http')?`<img src="${this.esc(logo)}" alt="${this.esc(s.name)} logo" loading="lazy" onerror="this.style.display='none'">`:`<i class="${this.esc(logo)}"></i>`}</div><button class="fav-btn ${fav?'active':''}" aria-label="${fav?'Remove':'Add'} ${this.esc(s.name)} favorite" onclick="app.toggleFavorite('${this.esc(s.id)}')"><i class="fa-${fav?'solid':'regular'} fa-heart"></i></button></div><div class="card-kicker">${this.esc(s.type||'Linux')} ${s.openSource===false?'':'• Open Source'}</div><h3>${this.esc(s.name)}</h3><p>${this.esc(s.description)}</p><div class="tags">${s.category.slice(0,3).map(x=>`<span>${this.esc(x)}</span>`).join('')}</div><div class="card-meta"><span><b>Base</b>${this.esc(s.base||'—')}</span><span><b>Arch</b>${this.esc(s.architecture[0]||'x86_64')}</span></div><div class="card-actions"><button class="btn small ghost" onclick="app.openById('${this.esc(s.id)}')">Details</button><a class="btn small primary" href="${this.esc(s.download||s.downloadUrl||s.website||'#')}" target="_blank" rel="noopener noreferrer" onclick="app.historyEvent('${this.esc(s.id)}')"><i class="fa-solid fa-download"></i> Official</a></div></article>`;
  }
  logoFor(s){if(s.type==='Linux')return 'fa-brands fa-linux';if(s.type==='BSD')return 'fa-solid fa-terminal';if(s.type==='Mobile')return 'fa-solid fa-mobile-screen-button';if(s.type==='Media')return 'fa-solid fa-tv';if(s.type==='Gaming')return 'fa-solid fa-gamepad';return 'fa-solid fa-atom'}
  esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
  openById(id){const s=[...this.systems,...this.gaming].find(x=>x.id===id);if(s)this.open(s)}
  open(s){this.historyEvent(s.id);const modal=document.getElementById('systemModal'),body=document.getElementById('modalBody');if(!modal||!body)return;const logo=s.logo?`<img src="${this.esc(s.logo)}" alt="" loading="lazy">`:`<i class="${this.logoFor(s)}"></i>`;body.innerHTML=`<div class="modal-system"><div class="modal-logo">${logo}</div><div><div class="card-kicker">${this.esc(s.type)} ${s.openSource===false?'':'• Open Source'}</div><h2>${this.esc(s.name)}</h2><p>${this.esc(s.description)}</p></div></div><div class="detail-grid">${this.detail('License',s.license)}${this.detail('Base',s.base)}${this.detail('Desktop',s.desktop||s.desktopEnvironment)}${this.detail('Architecture',s.architecture.join(', '))}${this.detail('Package manager',s.packageManager)}${this.detail('Difficulty',s.difficulty)}${this.detail('Gaming',(s.gamingTags||[]).join(' • '))}${this.detail('Performance',s.performance?`${s.performance}/10`:null)}</div><div class="modal-actions"><a class="btn primary" href="${this.esc(s.download||s.downloadUrl||'#')}" target="_blank" rel="noopener noreferrer"><i class="fa-solid fa-download"></i> Official download</a><a class="btn ghost" href="${this.esc(s.website||'#')}" target="_blank" rel="noopener noreferrer">Website</a><a class="btn ghost" href="${this.esc(s.docs||s.wiki||'#')}" target="_blank" rel="noopener noreferrer">Documentation</a></div>`;modal.classList.add('show');modal.setAttribute('aria-hidden','false')}
  detail(k,v){return v?`<div><span>${this.esc(k)}</span><strong>${this.esc(v)}</strong></div>`:''}
  closeModal(){document.getElementById('systemModal')?.classList.remove('show')}
  toggleFavorite(id){if(this.favorites.has(id))this.favorites.delete(id);else this.favorites.add(id);localStorage.setItem('dh:favorites',JSON.stringify([...this.favorites]));const s=this.systems.find(x=>x.id===id)||this.gaming.find(x=>x.id===id);if(s&&window.DistroHubSupabase){(this.favorites.has(id)?DistroHubSupabase.saveFavorite(id,s.name,s.type):DistroHubSupabase.removeFavorite(id,s.id)).then(r=>{if(r?.reason==='auth')this.toast('Favorite saved locally. Sign in to sync it across devices.')}).catch(()=>{})}this.renderAll()}
  historyEvent(id){if(!id)return;this.history=[id,...this.history.filter(x=>x!==id)].slice(0,30);localStorage.setItem('dh:history',JSON.stringify(this.history));const s=this.systems.find(x=>x.id===id)||this.gaming.find(x=>x.id===id);if(s&&window.DistroHubSupabase)DistroHubSupabase.recordHistory(id,s.name,s.type).catch(()=>{})}
  renderFavorites(){const list=this.systems.filter(s=>this.favorites.has(s.id));this.setText('favoriteCount',list.length);this.setText('historyCount',this.history.length);this.setText('comparisonCount',this.comparisons.length);this.renderSystems(list,'favoritesGrid')}
  renderGaming(filter){let list=this.gaming;if(filter&&filter!=='all')list=list.filter(s=>(s.gamingTags||[]).includes(filter));const el=document.getElementById('gamingGrid');if(!el)return;el.innerHTML=list.map(s=>`<article class="game-card" data-id="${this.esc(s.id)}"><div class="game-score"><span>${this.esc(s.performance??'—')}/10</span><small>PERFORMANCE</small></div><div class="game-logo">${s.logo?`<img src="${this.esc(s.logo)}" alt="" loading="lazy">`:'<i class="fa-solid fa-gamepad"></i>'}</div><div class="card-kicker">GAMING OS</div><h3>${this.esc(s.name)}</h3><p>${this.esc(s.description)}</p><div class="game-bars"><span>Steam <b>${this.esc(s.steam||'—')}</b></span><span>Proton <b>${this.esc(s.proton||'—')}</b></span><span>Handheld <b>${this.esc(s.handheld||'—')}</b></span></div><div class="card-actions"><button class="btn small game-btn" onclick="app.openGaming('${this.esc(s.id)}')">Inspect</button><a class="btn small primary" href="${this.esc(s.download||'#')}" target="_blank" rel="noopener noreferrer">Download</a></div></article>`).join('')||'<div class="empty"><h3>No gaming systems found</h3></div>'}
  openGaming(id){const s=this.gaming.find(x=>x.id===id);if(s)this.open(s)}
  populateCompare(){const html=this.systems.map(s=>`<option value="${this.esc(s.id)}">${this.esc(s.name)}</option>`).join('');['compareA','compareB'].forEach(id=>{const el=document.getElementById(id);if(el)el.insertAdjacentHTML('beforeend',html)})}
  compare(){const a=this.systems.find(s=>s.id===document.getElementById('compareA')?.value),b=this.systems.find(s=>s.id===document.getElementById('compareB')?.value);if(!a||!b||a.id===b.id)return this.toast('Choose two different systems.');const rows=[['Type','type'],['Base','base'],['License','license'],['Desktop','desktop'],['Architecture','architecture'],['Difficulty','difficulty'],['Package Manager','packageManager'],['Gaming','gaming'],['Privacy','privacy'],['Security','security'],['Hardware','hardware']];document.getElementById('comparisonResult').innerHTML=`<div class="compare-table"><div class="compare-head"><div>FEATURE</div><strong>${this.esc(a.name)}</strong><strong>${this.esc(b.name)}</strong></div>${rows.map(([l,k])=>`<div class="compare-row"><span>${l}</span><div>${this.esc(Array.isArray(a[k])?a[k].join(', '):a[k]||'—')}</div><div>${this.esc(Array.isArray(b[k])?b[k].join(', '):b[k]||'—')}</div></div>`).join('')}</div>`;this.comparisons=[{a:a.id,b:b.id,date:Date.now()},...this.comparisons].slice(0,20);localStorage.setItem('dh:comparisons',JSON.stringify(this.comparisons));this.renderFavorites()}
  recommend(){const use=(document.getElementById('quizUse')?.value||'').toLowerCase(),arch=(document.getElementById('quizArch')?.value||'').toLowerCase(),diff=document.getElementById('quizDifficulty')?.value||'';const ranked=this.systems.map(s=>{let score=0;const hay=[s.description,s.type,s.base,...s.category,...s.useCases].join(' ').toLowerCase();if(hay.includes(use))score+=6;if(arch&&s.architecture.join(' ').toLowerCase().includes(arch))score+=4;if(s.difficulty===diff)score+=3;if(use==='gaming'&&s.type==='Gaming')score+=8;if(use==='mobile'&&s.type==='Mobile')score+=8;if(use==='old pc'&&s.category.some(x=>/old|lightweight/i.test(x)))score+=6;return {...s,score}}).filter(s=>s.score>0).sort((a,b)=>b.score-a.score).slice(0,5);document.getElementById('quizResults').innerHTML=ranked.map(s=>`<button class="recommend-item" onclick="app.openById('${this.esc(s.id)}')"><span>${this.esc(s.name)}</span><small>${s.score} match points • ${this.esc(s.type)}</small></button>`).join('')||'<p>No strong match found. Try broader answers.</p>'}
  async initAuth(){if(!window.DistroHubSupabase)return;try{const sb=await window.DistroHubSupabase.loadClient();if(!sb)return;const {data}=await sb.auth.getUser();this.setUser(data?.user||null);sb.auth.onAuthStateChange((_e,s)=>this.setUser(s?.user||null))}catch(e){console.warn('[DistroHub] Auth unavailable',e)}}
  setUser(user){this.user=user;this.setText('accountLabel',user?(user.email?.split('@')[0]||'Account'):'Sign in');if(user)this.toast('Signed in — your DistroHub journey can sync across devices.')}
  openAuth(){document.getElementById('authModal')?.classList.add('show')}
  closeAuth(){document.getElementById('authModal')?.classList.remove('show')}
  switchAuth(){this.authMode=this.authMode==='login'?'signup':'login';this.setText('authTitle',this.authMode==='login'?'Welcome back':'Create your DistroHub account');this.setText('authSubtitle',this.authMode==='login'?'Sign in to sync your DistroHub journey.':'Save favorites and history across devices.');this.setText('authSubmit',this.authMode==='login'?'Sign in':'Create account');this.setText('authSwitch',this.authMode==='login'?'Create an account':'Already have an account? Sign in');document.getElementById('usernameField')?.classList.toggle('hidden',this.authMode==='login')}
  async authSubmit(e){e.preventDefault();try{const sb=await DistroHubSupabase.loadClient();if(!sb)return this.toast('Add the Supabase Publishable Key to js/config.js first.');const email=document.getElementById('authEmail').value.trim(),password=document.getElementById('authPassword').value,username=document.getElementById('authUsername')?.value.trim()||'';const result=this.authMode==='login'?await sb.auth.signInWithPassword({email,password}):await sb.auth.signUp({email,password,options:{data:{username},emailRedirectTo:location.origin+location.pathname}});if(result.error)return this.toast(result.error.message);this.closeAuth();this.toast(this.authMode==='login'?'Welcome back!':'Account created. Check your email if verification is required.')}catch(err){this.toast('Authentication is temporarily unavailable.')}}
  async signOut(){try{const sb=await DistroHubSupabase.loadClient();if(sb)await sb.auth.signOut()}catch{}this.setUser(null);this.toast('Signed out.')}
  toggleTheme(){document.body.classList.toggle('light');localStorage.setItem('dh:theme',document.body.classList.contains('light')?'light':'dark')}
  updateStats(){this.setText('favoriteCount',this.favorites.size);this.setText('historyCount',this.history.length);this.setText('comparisonCount',this.comparisons.length)}
  toast(msg){const t=document.getElementById('toast');if(!t)return;t.textContent=msg;t.classList.add('show');clearTimeout(this.toastTimer);this.toastTimer=setTimeout(()=>t.classList.remove('show'),4000)}
}
window.addEventListener('DOMContentLoaded',()=>{window.app=new DistroHubApp();if(localStorage.getItem('dh:theme')==='light')document.body.classList.add('light')});
