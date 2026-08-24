/* Animated Surprise Me picker shared by Explore and the Home hero. */
(() => {
  const css = `
    #randomBtn.surprising, #randomBtnHome.surprising { pointer-events:none; transform:translateY(-1px) scale(.98); opacity:.9; }
    #randomBtn.surprising i, #randomBtnHome.surprising i { margin-right:.35rem; }
    #systemGrid.surprise-pulse { animation: dhSurprisePulse .7s ease both; }
    @keyframes dhSurprisePulse { 0%{filter:none;transform:scale(1)} 35%{filter:brightness(1.35) saturate(1.2);transform:scale(.995)} 70%{filter:brightness(1.08);transform:scale(1.002)} 100%{filter:none;transform:scale(1)} }
  `;
  const style=document.createElement('style'); style.id='dh-surprise-style'; style.textContent=css; document.head.appendChild(style);

  function fixOfficialLinks(app){
    const nobaraUrl='https://nobaraproject.org/download-nobara/';
    const all=[...(app.systems||[]),...(app.gaming||[])];
    all.filter(s=>/nobara/i.test(s?.name||'')).forEach(s=>{
      s.download=nobaraUrl;
      s.downloadUrl=nobaraUrl;
      s.website='https://nobaraproject.org/';
      s.docs='https://wiki.nobaraproject.org/';
    });
  }

  function installButton(btn, app){
    if(!btn || btn.dataset.surpriseInstalled)return;
    const fresh=btn.cloneNode(true);
    btn.replaceWith(fresh);
    fresh.dataset.surpriseInstalled='true';
    fresh.addEventListener('click',()=>{
      fixOfficialLinks(app);
      const pool=(app.systems||[]).filter(s=>s&&s.id);
      if(!pool.length){app.toast?.('The OS catalog is still loading.');return;}
      const previous=app.lastSurpriseId;
      const choices=pool.length>1&&previous?pool.filter(s=>s.id!==previous):pool;
      const picked=choices[Math.floor(Math.random()*choices.length)];
      app.lastSurpriseId=picked.id;
      fresh.disabled=true;
      fresh.classList.add('surprising');
      fresh.innerHTML='<i class="fa-solid fa-dice-d20 fa-spin"></i> Rolling...';
      const grid=document.getElementById('systemGrid');
      grid?.classList.add('surprise-pulse');
      window.setTimeout(()=>grid?.classList.remove('surprise-pulse'),700);
      window.setTimeout(()=>{
        fresh.disabled=false;
        fresh.classList.remove('surprising');
        fresh.innerHTML='<i class="fa-solid fa-shuffle"></i> Surprise me';
        app.open(picked);
      },650);
    });
  }

  function install(){
    const app=window.app;
    if(!app)return;
    fixOfficialLinks(app);
    const linkFixTimer=window.setInterval(()=>{
      fixOfficialLinks(app);
      if((app.systems||[]).length)window.clearInterval(linkFixTimer);
    },250);
    window.setTimeout(()=>window.clearInterval(linkFixTimer),10000);
    installButton(document.getElementById('randomBtn'),app);
    installButton(document.getElementById('randomBtnHome'),app);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});
  else install();
})();
