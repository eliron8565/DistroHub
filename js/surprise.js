/* OSPulse shared UI helpers: animated Surprise Me + canonical official links. */
(() => {
  const css = `
    #randomBtn.surprising, #randomBtnHome.surprising { pointer-events:none; transform:translateY(-1px) scale(.98); opacity:.9; }
    #randomBtn.surprising i, #randomBtnHome.surprising i { margin-right:.35rem; }
    #systemGrid.surprise-pulse { animation: dhSurprisePulse .7s ease both; }
    @keyframes dhSurprisePulse { 0%{filter:none;transform:scale(1)} 35%{filter:brightness(1.35) saturate(1.2);transform:scale(.995)} 70%{filter:brightness(1.08);transform:scale(1.002)} 100%{filter:none;transform:scale(1)} }
  `;
  const style=document.createElement('style'); style.id='dh-surprise-style'; style.textContent=css; document.head.appendChild(style);
  const NOBARA_DOWNLOAD='https://nobaraproject.org/download.html';
  const isNobara=(value)=>/nobara/i.test(String(value||''));
  const canonicalize=(value,name='')=>{try{const u=new URL(value,document.baseURI);if(u.hostname==='nobaraproject.org'&&/^\/download(?:-|\/|$)/.test(u.pathname))return NOBARA_DOWNLOAD;if(isNobara(name)&&u.hostname==='nobaraproject.org')return NOBARA_DOWNLOAD;return u.href}catch{return isNobara(name)?NOBARA_DOWNLOAD:value}};
  function repairAppData(){const app=window.app;if(!app)return;for(const collection of [app.systems,app.gaming]){if(!Array.isArray(collection))continue;for(const item of collection){if(isNobara(item?.name)||isNobara(item?.id)){item.download=NOBARA_DOWNLOAD;item.downloadUrl=NOBARA_DOWNLOAD}}}}
  function repairNobaraLinks(root=document){root.querySelectorAll?.('a[href]').forEach(link=>{const context=link.closest?.('.system-card,.game-card,.modal-card')?.textContent||'';const fixed=canonicalize(link.getAttribute('href'),context);if(fixed&&fixed!==link.href)link.setAttribute('href',fixed);if(isNobara(context)&&/Official|download/i.test(link.textContent||''))link.setAttribute('href',NOBARA_DOWNLOAD)})}
  function repair(){repairAppData();repairNobaraLinks()} repair();
  const repairTimer=window.setInterval(()=>{repair();if(window.app?.systems?.length)window.clearInterval(repairTimer)},250);
  new MutationObserver(()=>repair()).observe(document.documentElement,{childList:true,subtree:true});
  document.addEventListener('click',(event)=>{const link=event.target?.closest?.('a[href]');if(!link)return;try{const context=link.closest?.('.system-card,.game-card,.modal-card')?.textContent||'';const fixed=canonicalize(link.getAttribute('href'),context);if(isNobara(context)||fixed===NOBARA_DOWNLOAD){if(fixed!==link.href)event.preventDefault();event.stopImmediatePropagation();window.open(NOBARA_DOWNLOAD,'_blank','noopener,noreferrer')}}catch(_){}},true);
  function pickRandom(app,btn){
    const pool=(app?.systems||[]).filter(s=>s&&s.id);
    if(!pool.length){app?.toast?.('The OS catalog is still loading. Please try again.');return;}
    const previous=app.lastSurpriseId;
    const choices=pool.length>1&&previous?pool.filter(s=>s.id!==previous):pool;
    const picked=choices[Math.floor(Math.random()*choices.length)];
    app.lastSurpriseId=picked.id;
    if(btn){btn.disabled=true;btn.classList.add('surprising');btn.innerHTML='<i class="fa-solid fa-dice-d20 fa-spin"></i> Rolling...';}
    document.getElementById('systemGrid')?.classList.add('surprise-pulse');
    window.setTimeout(()=>document.getElementById('systemGrid')?.classList.remove('surprise-pulse'),700);
    window.setTimeout(()=>{
      if(btn){btn.disabled=false;btn.classList.remove('surprising');btn.innerHTML='<i class="fa-solid fa-shuffle"></i> Surprise me';}
      if(typeof app.open==='function') app.open(picked);
      else if(typeof app.openById==='function') app.openById(picked.id);
    },650);
  }
  function installButton(btn,app){if(!btn||btn.dataset.surpriseInstalled)return;const fresh=btn.cloneNode(true);btn.replaceWith(fresh);fresh.dataset.surpriseInstalled='true';fresh.addEventListener('click',(e)=>{e.preventDefault();e.stopPropagation();pickRandom(window.app||app,fresh)})}
  function install(){const app=window.app;if(!app)return;installButton(document.getElementById('randomBtn'),app);installButton(document.getElementById('randomBtnHome'),app);repair()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
  document.addEventListener('click',(event)=>{
    const btn=event.target?.closest?.('#randomBtn,#randomBtnHome');
    if(!btn || btn.dataset.surpriseHandled==='1') return;
    btn.dataset.surpriseHandled='1';
    event.preventDefault();event.stopImmediatePropagation();
    pickRandom(window.app,btn);
    window.setTimeout(()=>{if(btn.isConnected)btn.dataset.surpriseHandled='0'},900);
  },true);
})();

// Load extra OSPulse experience modules without changing the existing HTML script order.
(() => {
  const load=(src)=>{if(document.querySelector(`script[data-dh-extra="${src}"]`))return;const s=document.createElement('script');s.src=src;s.dataset.dhExtra=src;s.defer=true;document.body.appendChild(s)};
  const boot=()=>{load('js/rebrand.js');load('js/feature-pack.js');load('js/surprise-fix.js')};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
