/* DistroHub shared UI helpers: animated Surprise Me + canonical official links. */
(() => {
  const css = `
    #randomBtn.surprising, #randomBtnHome.surprising { pointer-events:none; transform:translateY(-1px) scale(.98); opacity:.9; }
    #randomBtn.surprising i, #randomBtnHome.surprising i { margin-right:.35rem; }
    #systemGrid.surprise-pulse { animation: dhSurprisePulse .7s ease both; }
    @keyframes dhSurprisePulse { 0%{filter:none;transform:scale(1)} 35%{filter:brightness(1.35) saturate(1.2);transform:scale(.995)} 70%{filter:brightness(1.08);transform:scale(1.002)} 100%{filter:none;transform:scale(1)} }
  `;
  const style=document.createElement('style'); style.id='dh-surprise-style'; style.textContent=css; document.head.appendChild(style);

  // Canonical official download URL. This is the URL DistroHub must use
  // everywhere for Nobara, including stale catalog data already in memory.
  const NOBARA_DOWNLOAD='https://nobaraproject.org/download.html';

  const isNobara=(value)=>/nobara/i.test(String(value||''));
  const canonicalize=(value,name='')=>{
    try{
      const u=new URL(value,document.baseURI);
      if(u.hostname==='nobaraproject.org' && /^\/download(?:-|\/|$)/.test(u.pathname)) return NOBARA_DOWNLOAD;
      if(isNobara(name) && u.hostname==='nobaraproject.org') return NOBARA_DOWNLOAD;
      return u.href;
    }catch{
      return isNobara(name)?NOBARA_DOWNLOAD:value;
    }
  };

  // Repair the actual application data, not just the rendered link.
  // This is important because Explore loads Nobara from extra-distros.json,
  // while Gaming loads it from gaming-os.json.
  function repairAppData(){
    const app=window.app;
    if(!app)return;
    for(const collection of [app.systems,app.gaming]){
      if(!Array.isArray(collection))continue;
      for(const item of collection){
        if(isNobara(item?.name)||isNobara(item?.id)){
          item.download=NOBARA_DOWNLOAD;
          item.downloadUrl=NOBARA_DOWNLOAD;
        }
      }
    }
  }

  function repairNobaraLinks(root=document){
    root.querySelectorAll?.('a[href]').forEach(link=>{
      const context=link.closest?.('.system-card,.game-card,.modal-card')?.textContent||'';
      const fixed=canonicalize(link.getAttribute('href'),context);
      if(fixed && fixed!==link.href) link.setAttribute('href',fixed);
      if(isNobara(context) && /Official|download/i.test(link.textContent||'')) link.setAttribute('href',NOBARA_DOWNLOAD);
    });
  }

  function repair(){repairAppData();repairNobaraLinks();}
  repair();
  const repairTimer=window.setInterval(()=>{repair();if(window.app?.systems?.length)window.clearInterval(repairTimer)},250);
  new MutationObserver(()=>repair()).observe(document.documentElement,{childList:true,subtree:true});

  // Final click-time guard. Even if an old cached catalog creates /download/,
  // the browser is explicitly sent to download.html.
  document.addEventListener('click',(event)=>{
    const link=event.target?.closest?.('a[href]');
    if(!link)return;
    try{
      const context=link.closest?.('.system-card,.game-card,.modal-card')?.textContent||'';
      const fixed=canonicalize(link.getAttribute('href'),context);
      if(isNobara(context)||fixed===NOBARA_DOWNLOAD){
        if(fixed!==link.href)event.preventDefault();
        event.stopImmediatePropagation();
        window.open(NOBARA_DOWNLOAD,'_blank','noopener,noreferrer');
      }
    }catch(_){}
  },true);

  function installButton(btn,app){
    if(!btn||btn.dataset.surpriseInstalled)return;
    const fresh=btn.cloneNode(true); btn.replaceWith(fresh); fresh.dataset.surpriseInstalled='true';
    fresh.addEventListener('click',()=>{
      const pool=(app.systems||[]).filter(s=>s&&s.id);
      if(!pool.length){app.toast?.('The OS catalog is still loading.');return;}
      const previous=app.lastSurpriseId;
      const choices=pool.length>1&&previous?pool.filter(s=>s.id!==previous):pool;
      const picked=choices[Math.floor(Math.random()*choices.length)]; app.lastSurpriseId=picked.id;
      fresh.disabled=true; fresh.classList.add('surprising'); fresh.innerHTML='<i class="fa-solid fa-dice-d20 fa-spin"></i> Rolling...';
      document.getElementById('systemGrid')?.classList.add('surprise-pulse');
      window.setTimeout(()=>document.getElementById('systemGrid')?.classList.remove('surprise-pulse'),700);
      window.setTimeout(()=>{fresh.disabled=false;fresh.classList.remove('surprising');fresh.innerHTML='<i class="fa-solid fa-shuffle"></i> Surprise me';app.open(picked)},650);
    });
  }
  function install(){const app=window.app;if(!app)return;installButton(document.getElementById('randomBtn'),app);installButton(document.getElementById('randomBtnHome'),app);repair();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true}); else install();
})();
