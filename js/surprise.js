/* Animated Surprise Me picker. Loaded after app.js so it can safely replace the basic random action. */
(() => {
  const css = `
    #randomBtn.surprising { pointer-events:none; transform:translateY(-1px) scale(.98); opacity:.9; }
    #randomBtn.surprising i { margin-right:.35rem; }
    #systemGrid.surprise-pulse { animation: dhSurprisePulse .7s ease both; }
    @keyframes dhSurprisePulse { 0%{filter:none;transform:scale(1)} 35%{filter:brightness(1.35) saturate(1.2);transform:scale(.995)} 70%{filter:brightness(1.08);transform:scale(1.002)} 100%{filter:none;transform:scale(1)} }
  `;
  const style=document.createElement('style'); style.id='dh-surprise-style'; style.textContent=css; document.head.appendChild(style);

  function install(){
    const app=window.app, oldBtn=document.getElementById('randomBtn');
    if(!app||!oldBtn||oldBtn.dataset.surpriseInstalled)return;
    const btn=oldBtn.cloneNode(true);
    oldBtn.replaceWith(btn);
    btn.dataset.surpriseInstalled='true';
    btn.addEventListener('click',()=>{
      const pool=(app.systems||[]).filter(s=>s&&s.id);
      if(!pool.length){app.toast?.('The OS catalog is still loading.');return;}
      const previous=app.lastSurpriseId;
      const choices=pool.length>1&&previous?pool.filter(s=>s.id!==previous):pool;
      const picked=choices[Math.floor(Math.random()*choices.length)];
      app.lastSurpriseId=picked.id;
      btn.disabled=true;
      btn.classList.add('surprising');
      btn.innerHTML='<i class="fa-solid fa-dice-d20 fa-spin"></i> Rolling...';
      const grid=document.getElementById('systemGrid');
      grid?.classList.add('surprise-pulse');
      window.setTimeout(()=>grid?.classList.remove('surprise-pulse'),700);
      window.setTimeout(()=>{
        btn.disabled=false;
        btn.classList.remove('surprising');
        btn.innerHTML='<i class="fa-solid fa-shuffle"></i> Surprise me';
        app.open(picked);
      },650);
    });
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});
  else install();
})();
