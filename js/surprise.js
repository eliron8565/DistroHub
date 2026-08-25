/* OSPulse shared UI helpers: animated Surprise Me + canonical official links. */
(() => {
  const css = `#randomBtn.surprising,#randomBtnHome.surprising{pointer-events:none;transform:translateY(-1px) scale(.98);opacity:.9}#randomBtn.surprising i,#randomBtnHome.surprising i{margin-right:.35rem}#systemGrid.surprise-pulse{animation:dhSurprisePulse .7s ease both}@keyframes dhSurprisePulse{0%{filter:none;transform:scale(1)}35%{filter:brightness(1.35) saturate(1.2);transform:scale(.995)}70%{filter:brightness(1.08);transform:scale(1.002)}100%{filter:none;transform:scale(1)}}`;
  const style=document.createElement('style');style.id='dh-surprise-style';style.textContent=css;document.head.appendChild(style);
  const NOBARA_DOWNLOAD='https://nobaraproject.org/download.html';
  const isNobara=v=>/nobara/i.test(String(v||''));
  const canonicalize=(value,name='')=>{try{const u=new URL(value,document.baseURI);if(u.hostname==='nobaraproject.org'&&/^\/download(?:-|\/|$)/.test(u.pathname))return NOBARA_DOWNLOAD;if(isNobara(name)&&u.hostname==='nobaraproject.org')return NOBARA_DOWNLOAD;return u.href}catch{return isNobara(name)?NOBARA_DOWNLOAD:value}};
  function repairAppData(){const app=window.app;if(!app)return;for(const collection of [app.systems,app.gaming]){if(!Array.isArray(collection))continue;for(const item of collection){if(isNobara(item?.name)||isNobara(item?.id)){item.download=NOBARA_DOWNLOAD;item.downloadUrl=NOBARA_DOWNLOAD}}}}
  function repairNobaraLinks(){document.querySelectorAll('a[href]').forEach(link=>{const context=link.closest?.('.system-card,.game-card,.modal-card')?.textContent||'';const fixed=canonicalize(link.getAttribute('href'),context);if(fixed&&fixed!==link.href)link.setAttribute('href',fixed);if(isNobara(context)&&/Official|download/i.test(link.textContent||''))link.setAttribute('href',NOBARA_DOWNLOAD)})}
  function repair(){repairAppData();repairNobaraLinks()}repair();
  const repairTimer=setInterval(()=>{repair();if(window.app?.systems?.length)clearInterval(repairTimer)},250);
  new MutationObserver(repair).observe(document.documentElement,{childList:true,subtree:true});
  document.addEventListener('click',event=>{const link=event.target?.closest?.('a[href]');if(!link)return;try{const context=link.closest?.('.system-card,.game-card,.modal-card')?.textContent||'';const fixed=canonicalize(link.getAttribute('href'),context);if(isNobara(context)||fixed===NOBARA_DOWNLOAD){event.preventDefault();event.stopImmediatePropagation();window.open(NOBARA_DOWNLOAD,'_blank','noopener,noreferrer')}}catch(_){}},true);
  function pickRandom(app,btn){
    const pool=(app?.systems||[]).filter(s=>s&&s.id);
    if(!pool.length){app?.toast?.('The OS catalog is still loading. Please try again.');return false}
    const previous=app.lastSurpriseId;const choices=pool.length>1&&previous?pool.filter(s=>s.id!==previous):pool;const picked=choices[Math.floor(Math.random()*choices.length)];app.lastSurpriseId=picked.id;
    if(btn){btn.disabled=true;btn.classList.add('surprising');btn.innerHTML='<i class="fa-solid fa-dice-d20 fa-spin"></i> Rolling...'}
    document.getElementById('systemGrid')?.classList.add('surprise-pulse');setTimeout(()=>document.getElementById('systemGrid')?.classList.remove('surprise-pulse'),700);
    setTimeout(()=>{if(btn){btn.disabled=false;btn.classList.remove('surprising');btn.innerHTML='<i class="fa-solid fa-shuffle"></i> Surprise me'}if(typeof app.open==='function')app.open(picked);else if(typeof app.openById==='function')app.openById(picked.id)},650);return true;
  }
  function installButton(btn){if(!btn||btn.dataset.surpriseInstalled)return;btn.dataset.surpriseInstalled='1';btn.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();pickRandom(window.app,btn)},true)}
  function install(){installButton(document.getElementById('randomBtn'));installButton(document.getElementById('randomBtnHome'));repair()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
  // Capture-phase fallback survives button replacement and any competing click handlers.
  document.addEventListener('click',event=>{const btn=event.target?.closest?.('#randomBtn,#randomBtnHome');if(!btn||btn.dataset.surpriseHandled==='1')return;btn.dataset.surpriseHandled='1';event.preventDefault();event.stopImmediatePropagation();pickRandom(window.app,btn);setTimeout(()=>{if(btn.isConnected)btn.dataset.surpriseHandled='0'},900)},true);
})();

(() => {const load=src=>{if(document.querySelector(`script[data-dh-extra="${src}"]`))return;const s=document.createElement('script');s.src=src;s.dataset.dhExtra=src;s.defer=true;document.body.appendChild(s)};const boot=()=>{load('js/rebrand.js');load('js/feature-pack.js')};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot()})();
