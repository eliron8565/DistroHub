/* Loading-only animation. Nothing in the real homepage is modified. */
(() => {
  'use strict';
  const reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
  if(reduced)return;
  const style=document.createElement('style');style.id='osp-loading-style';
  style.textContent=`
    #osp-loading{position:fixed;inset:0;z-index:2147483000;overflow:hidden;display:grid;place-items:center;background:radial-gradient(ellipse at center,#132c53 0%,#080f24 48%,#030713 100%);color:#f2fbff;font-family:Inter,system-ui,sans-serif;transition:opacity .7s ease,visibility .7s ease}
    #osp-loading.finished{opacity:0;visibility:hidden;pointer-events:none}
    #osp-loading .osp-grid{position:absolute;inset:-30%;opacity:.28;background:linear-gradient(rgba(65,207,255,.13) 1px,transparent 1px),linear-gradient(90deg,rgba(65,207,255,.13) 1px,transparent 1px);background-size:50px 50px;transform:perspective(600px) rotateX(55deg);animation:ospGridMove 5s linear infinite}
    #osp-loading .osp-stars{position:absolute;inset:0;pointer-events:none}
    #osp-loading .osp-star{position:absolute;left:var(--x);top:var(--y);width:var(--size);height:var(--size);border-radius:50%;background:#8eefff;box-shadow:0 0 14px #39dfff;animation:ospStar var(--speed) ease-in-out infinite alternate}
    #osp-loading .osp-content{position:relative;text-align:center;z-index:1;width:min(90vw,420px)}
    #osp-loading .osp-frame{width:205px;height:205px;margin:0 auto 25px;position:relative;display:grid;place-items:center}
    #osp-loading .osp-ring{position:absolute;inset:0;border:2px solid rgba(65,218,255,.4);border-top-color:#69efff;border-radius:50%;box-shadow:0 0 28px rgba(40,204,255,.15);animation:ospSpin 4s linear infinite}
    #osp-loading .osp-ring.r2{inset:19px;border-style:dashed;border-color:rgba(166,119,255,.65);animation-direction:reverse;animation-duration:6s}
    #osp-loading .osp-ring.r3{inset:41px;border-color:rgba(83,239,225,.4);border-right-color:#9efaff;animation-duration:2.5s}
    #osp-loading .osp-module{position:absolute;width:26px;height:26px;border:1px solid #66eaff;border-radius:5px;background:rgba(30,148,255,.18);box-shadow:0 0 15px rgba(61,227,255,.55);animation:ospModule 2.4s ease-in-out infinite alternate}
    #osp-loading .osp-module.m1{top:0;left:0}#osp-loading .osp-module.m2{right:0;top:12px;animation-delay:.35s}#osp-loading .osp-module.m3{bottom:0;left:14px;animation-delay:.7s}#osp-loading .osp-module.m4{bottom:9px;right:0;animation-delay:1.05s}
    #osp-loading .osp-logo{font:800 66px 'Space Grotesk',system-ui,sans-serif;letter-spacing:-.1em;color:#e9fbff;text-shadow:0 0 25px #46dfff;animation:ospLogo 2s ease-in-out infinite alternate}
    #osp-loading h2{margin:0;font:800 clamp(36px,8vw,56px) 'Space Grotesk',system-ui,sans-serif;letter-spacing:-.06em}
    #osp-loading h2 span{color:#5de9ff}
    #osp-loading p{margin:13px 0 22px;color:#96b7d5;font:600 11px ui-monospace,monospace;letter-spacing:.15em}
    #osp-loading .osp-bar{height:3px;width:min(250px,70vw);margin:auto;background:rgba(118,187,238,.2);overflow:hidden;border-radius:99px}
    #osp-loading .osp-bar i{display:block;height:100%;width:40%;background:linear-gradient(90deg,transparent,#7b68ff,#48eaff,#e3ffff);box-shadow:0 0 14px #48eaff;animation:ospBar 1.2s ease-in-out infinite}
    #osp-loading .osp-skip{position:absolute;bottom:24px;right:24px;z-index:3;border:1px solid rgba(106,220,255,.5);border-radius:99px;background:rgba(8,26,50,.9);color:#d9faff;padding:10px 16px;font:600 12px Inter,system-ui,sans-serif;cursor:pointer}
    @keyframes ospGridMove{to{background-position:0 100px,100px 0}}
    @keyframes ospSpin{to{transform:rotate(360deg)}}
    @keyframes ospStar{to{transform:translate(var(--dx),var(--dy)) scale(1.6);opacity:.25}}
    @keyframes ospModule{to{transform:translateY(-13px) rotate(35deg);box-shadow:0 0 30px #45ddff}}
    @keyframes ospLogo{to{transform:scale(1.08);filter:drop-shadow(0 0 22px #41ddff)}}
    @keyframes ospBar{from{transform:translateX(-110%)}to{transform:translateX(340%)}}
    @media(prefers-reduced-motion:reduce){#osp-loading{display:none!important}}
  `;
  document.head.appendChild(style);
  const layer=document.createElement('div');layer.id='osp-loading';layer.setAttribute('role','status');layer.setAttribute('aria-label','Loading OSPulse');
  layer.innerHTML='<div class="osp-grid"></div><div class="osp-stars" aria-hidden="true"></div><div class="osp-content"><div class="osp-frame"><div class="osp-ring"></div><div class="osp-ring r2"></div><div class="osp-ring r3"></div><i class="osp-module m1"></i><i class="osp-module m2"></i><i class="osp-module m3"></i><i class="osp-module m4"></i><div class="osp-logo">O</div></div><h2>OS<span>Pulse</span></h2><p>BUILDING YOUR DISCOVERY EXPERIENCE</p><div class="osp-bar"><i></i></div></div><button class="osp-skip" type="button">Skip intro →</button>';
  const stars=layer.querySelector('.osp-stars');
  for(let i=0;i<65;i++){const s=document.createElement('i');s.className='osp-star';s.style.setProperty('--x',Math.random()*100+'%');s.style.setProperty('--y',Math.random()*100+'%');s.style.setProperty('--size',1+Math.random()*2+'px');s.style.setProperty('--speed',1+Math.random()*3+'s');s.style.setProperty('--dx',(Math.random()-.5)*100+'px');s.style.setProperty('--dy',(Math.random()-.5)*100+'px');stars.appendChild(s);}
  document.body.appendChild(layer);
  let finished=false,ready=Boolean(window.app && window.app.systems && window.app.systems.length);
  const start=performance.now();let minTimer,maxTimer;
  function finish(){if(finished)return;finished=true;clearTimeout(minTimer);clearTimeout(maxTimer);window.removeEventListener('ospulse:catalog-ready',onReady);layer.classList.add('finished');setTimeout(()=>{layer.remove();style.remove();},750);}
  function onReady(){ready=true;minTimer=setTimeout(finish,Math.max(0,1450-(performance.now()-start)));}
  window.addEventListener('ospulse:catalog-ready',onReady);
  layer.querySelector('.osp-skip').addEventListener('click',finish);
  if(ready)onReady();
  maxTimer=setTimeout(finish,5000);
})();
/* OSPulse Living UI — ambient world, micro-interactions and lightweight motion. */
(() => {
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
  if (reduced) return;
  const root=document.documentElement;
  const style=document.createElement('style');style.id='ospulse-living-style';style.textContent=`
    :root{--mx:50vw;--my:30vh;--motion-ease:cubic-bezier(.22,1,.36,1);--motion-spring:cubic-bezier(.16,1,.3,1)}
    body::before{content:'';position:fixed;left:var(--mx);top:var(--my);width:380px;height:380px;transform:translate(-50%,-50%);border-radius:50%;pointer-events:none;z-index:0;background:radial-gradient(circle,rgba(34,211,238,.12),rgba(124,92,255,.045) 38%,transparent 72%);filter:blur(12px);transition:left .18s ease-out,top .18s ease-out}
    #ospulse-particles{position:fixed;inset:0;z-index:0;pointer-events:none;overflow:hidden;opacity:.65}.ospulse-particle{position:absolute;width:2px;height:2px;border-radius:50%;background:#67e8f9;box-shadow:0 0 9px #22d3ee;animation:particleDrift var(--pd) ease-in-out infinite alternate;opacity:var(--po)}@keyframes particleDrift{from{transform:translate3d(0,0,0) scale(.7)}to{transform:translate3d(var(--px),var(--py),0) scale(1.5)}}
    .site-header,main{position:relative;z-index:1}.site-header{transition:padding .3s ease,box-shadow .3s ease,background .3s ease}.site-header.scrolled{padding-top:9px;padding-bottom:9px;box-shadow:0 12px 45px rgba(0,0,0,.25)}
    .page.active{animation:pageIn .5s var(--motion-ease) both}.page.active>*{animation:sectionIn .65s var(--motion-ease) both}.page.active>*:nth-child(2){animation-delay:.07s}.page.active>*:nth-child(3){animation-delay:.14s}.page.active>*:nth-child(4){animation-delay:.21s}@keyframes pageIn{from{opacity:.01;transform:translateY(10px)}to{opacity:1;transform:none}}@keyframes sectionIn{from{opacity:0;transform:translateY(18px);filter:blur(4px)}to{opacity:1;transform:none;filter:none}}
    .hero-copy>*{animation:heroRise .8s var(--motion-ease) both;animation-delay:calc(var(--i,0)*80ms)}.hero-orbit{animation:orbitIn 1.1s var(--motion-ease) both}@keyframes heroRise{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:none}}@keyframes orbitIn{from{opacity:0;transform:scale(.78) rotate(-12deg)}to{opacity:1;transform:none}}
    .system-card,.game-card,.family-card,.feature-strip>div,.dashboard-card,.oslab-card,.quiz-card,.search-panel,.compare-builder{will-change:transform;transition:transform .38s var(--motion-spring),box-shadow .38s ease,border-color .38s ease}.system-card:hover,.game-card:hover,.family-card:hover,.dashboard-card:hover,.oslab-card:hover,.quiz-card:hover,.compare-builder:hover{transform:translateY(-7px);box-shadow:0 22px 60px rgba(0,0,0,.3);border-color:rgba(100,210,255,.3)}
    .system-card,.game-card,.family-card,.oslab-card{position:relative;overflow:hidden}.system-card::before,.game-card::before,.family-card::before,.oslab-card::before{content:'';position:absolute;inset:0;border-radius:inherit;pointer-events:none;opacity:0;background:radial-gradient(300px circle at var(--card-x,50%) var(--card-y,0%),rgba(88,190,255,.17),transparent 58%);transition:opacity .3s ease}.system-card:hover::before,.game-card:hover::before,.family-card:hover::before,.oslab-card:hover::before{opacity:1}
    .system-grid .system-card,.gaming-grid .game-card{animation:cardIn .55s var(--motion-ease) both;animation-delay:calc(var(--card-index,0)*45ms)}.family-grid .family-card{animation:cardIn .6s var(--motion-ease) both;animation-delay:calc(var(--card-index,0)*70ms)}@keyframes cardIn{from{opacity:0;transform:translateY(24px) scale(.985)}to{opacity:1;transform:none}}
    .btn,.icon-btn,.account-btn,.game-chip,.chip,.oslab-badge,.fav-btn{transition:transform .22s var(--motion-spring),box-shadow .22s ease,filter .22s ease}.btn:hover,.icon-btn:hover,.account-btn:hover,.game-chip:hover,.chip:hover,.oslab-badge:hover{transform:translateY(-2px)}.btn:active,.icon-btn:active,.account-btn:active,.game-chip:active,.chip:active,.oslab-badge:active,.fav-btn:active{transform:scale(.94)}
    .motion-ripple{position:absolute;border-radius:50%;pointer-events:none;transform:scale(0);background:rgba(255,255,255,.3);animation:ripple .55s ease-out forwards}@keyframes ripple{to{transform:scale(4);opacity:0}}
    .brand-mark{transition:transform .55s var(--motion-spring),box-shadow .4s ease}.brand:hover .brand-mark{transform:rotate(-8deg) scale(1.08);box-shadow:0 0 30px rgba(70,210,255,.6)}.main-nav a{position:relative}.main-nav a::after{content:'';position:absolute;left:50%;bottom:-5px;width:0;height:2px;border-radius:99px;background:linear-gradient(90deg,#7c6cff,#22d9ff);transition:width .35s var(--motion-spring),left .35s var(--motion-spring)}.main-nav a:hover::after,.main-nav a.active::after{left:12%;width:76%}
    .system-logo,.game-logo,.dash-icon,.family-icon{transition:transform .45s var(--motion-spring),filter .45s ease}.system-card:hover .system-logo,.game-card:hover .game-logo,.dashboard-card:hover .dash-icon,.family-card:hover .family-icon{transform:rotate(-6deg) scale(1.1);filter:drop-shadow(0 0 13px rgba(80,210,255,.45))}.fav-btn.active{animation:heartPop .45s var(--motion-spring)}@keyframes heartPop{0%{transform:scale(.7)}55%{transform:scale(1.28)}100%{transform:scale(1)}}
    .pulse-dot{animation:dotPulse 1.8s ease-in-out infinite}@keyframes dotPulse{0%,100%{box-shadow:0 0 0 0 rgba(34,217,255,.4)}50%{box-shadow:0 0 0 8px rgba(34,217,255,0)}}.hero-orbit .core{animation:corePulse 3s ease-in-out infinite}.hero-orbit .orbit{animation:spinOrbit 18s linear infinite}.hero-orbit .orbit-2{animation-duration:12s;animation-direction:reverse}.hero-orbit .orbit-node{animation:nodeFloat 3s ease-in-out infinite}.node-2{animation-delay:-1s}.node-3{animation-delay:-2s}@keyframes corePulse{0%,100%{box-shadow:0 0 28px rgba(90,100,255,.18)}50%{box-shadow:0 0 65px rgba(90,100,255,.38),0 0 100px rgba(34,211,238,.1)}}@keyframes spinOrbit{to{transform:rotate(360deg)}}@keyframes nodeFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
    .gaming-hero::after{content:'';position:absolute;inset:-20%;pointer-events:none;background:conic-gradient(from 0deg,transparent,rgba(34,211,238,.09),transparent,rgba(124,92,255,.09),transparent);animation:heroSweep 12s linear infinite}@keyframes heroSweep{to{transform:rotate(360deg)}}.scanline{animation:scan 6s linear infinite}@keyframes scan{from{background-position:0 0}to{background-position:0 120px}}.game-score span{animation:scoreGlow 2.4s ease-in-out infinite}@keyframes scoreGlow{50%{text-shadow:0 0 20px rgba(34,211,238,.55)}}
    .search-box:focus-within{box-shadow:0 0 0 3px rgba(77,196,255,.1),0 0 38px rgba(77,196,255,.12);transform:translateY(-1px);transition:.3s}.modal.show .modal-card,.auth-modal.show .auth-card{animation:modalIn .45s var(--motion-spring)}@keyframes modalIn{from{opacity:0;transform:translateY(24px) scale(.95);filter:blur(7px)}to{opacity:1;transform:none;filter:none}}.toast.show{animation:toastIn .42s var(--motion-spring)}@keyframes toastIn{from{opacity:0;transform:translateY(18px) scale(.96)}to{opacity:1;transform:none}}
    @media(max-width:700px){body::before{width:230px;height:230px}.page.active>*{animation-duration:.45s}.gaming-hero::after{display:none}.system-card:hover,.game-card:hover,.family-card:hover,.dashboard-card:hover,.oslab-card:hover,.quiz-card:hover,.compare-builder:hover{transform:translateY(-3px)}}
  `;document.head.appendChild(style);

  const particleLayer=document.createElement('div');particleLayer.id='ospulse-particles';particleLayer.setAttribute('aria-hidden','true');const count=Math.min(55,Math.max(24,Math.floor(innerWidth/28)));for(let i=0;i<count;i++){const p=document.createElement('span');p.className='ospulse-particle';p.style.left=`${Math.random()*100}%`;p.style.top=`${Math.random()*100}%`;p.style.setProperty('--pd',`${4+Math.random()*8}s`);p.style.setProperty('--px',`${(Math.random()-.5)*80}px`);p.style.setProperty('--py',`${(Math.random()-.5)*100}px`);p.style.setProperty('--po',`${.18+Math.random()*.5}`);particleLayer.appendChild(p)}document.body.prepend(particleLayer);
  window.addEventListener('pointermove',e=>{root.style.setProperty('--mx',`${e.clientX}px`);root.style.setProperty('--my',`${e.clientY}px`);const card=e.target.closest?.('.system-card,.game-card,.family-card,.oslab-card');if(card){const r=card.getBoundingClientRect();card.style.setProperty('--card-x',`${e.clientX-r.left}px`);card.style.setProperty('--card-y',`${e.clientY-r.top}px`)}},{passive:true});
  const header=document.querySelector('.site-header');const onScroll=()=>header?.classList.toggle('scrolled',scrollY>24);addEventListener('scroll',onScroll,{passive:true});onScroll();
  const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.08});
  const stagger=()=>{document.querySelectorAll('.system-grid .system-card,.gaming-grid .game-card,.family-grid .family-card').forEach((el,i)=>el.style.setProperty('--card-index',Math.min(i,14)))};
  const bind=()=>{document.querySelectorAll('.family-card,.feature-strip>div,.system-card,.game-card,.dashboard-card,.oslab-card,.compare-builder,.quiz-card').forEach(el=>{if(!el.classList.contains('reveal')){el.classList.add('reveal');observer.observe(el)}});stagger()};bind();new MutationObserver(bind).observe(document.body,{childList:true,subtree:true});
  document.addEventListener('click',e=>{const b=e.target.closest?.('.btn,.icon-btn,.account-btn,.game-chip,.chip,.oslab-badge');if(!b)return;const r=b.getBoundingClientRect(),size=Math.max(r.width,r.height)*1.4,ring=document.createElement('span');ring.className='motion-ripple';ring.style.width=ring.style.height=`${size}px`;ring.style.left=`${e.clientX-r.left-size/2}px`;ring.style.top=`${e.clientY-r.top-size/2}px`;b.style.position=b.style.position||'relative';b.appendChild(ring);ring.addEventListener('animationend',()=>ring.remove(),{once:true})});
})();
