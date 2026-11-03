/* OSPulse cinematic boot sequence — layered neon motion, canvas particles, and an accessible skip. */
(() => {
  'use strict';
  if (document.getElementById('ospulse-intro') || window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches) return;
  const style = document.createElement('style');
  style.id = 'ospulse-intro-style';
  style.textContent = `
    #ospulse-intro{position:fixed;inset:0;z-index:2147483000;display:grid;place-items:center;overflow:hidden;isolation:isolate;background:#030711;color:#f0faff;font-family:Inter,system-ui,sans-serif;transition:opacity .85s cubic-bezier(.16,1,.3,1),visibility .85s}
    #ospulse-intro.intro-exit{opacity:0;visibility:hidden;pointer-events:none}
    #ospulse-intro canvas{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}
    #ospulse-intro .intro-nebula{position:absolute;inset:-35%;background:radial-gradient(ellipse at 50% 48%,rgba(20,156,237,.25),transparent 28%),radial-gradient(ellipse at 25% 40%,rgba(110,58,255,.18),transparent 40%),radial-gradient(ellipse at 75% 60%,rgba(17,224,234,.15),transparent 38%);filter:blur(25px);animation:osNebula 5s ease-in-out infinite alternate}
    #ospulse-intro .intro-grid{position:absolute;inset:-60%;opacity:.22;background:linear-gradient(rgba(40,192,255,.15) 1px,transparent 1px),linear-gradient(90deg,rgba(40,192,255,.15) 1px,transparent 1px);background-size:65px 65px;transform:perspective(500px) rotateX(64deg) translateY(15%);animation:osGrid 3.7s linear infinite}
    #ospulse-intro .intro-scan{position:absolute;inset:0;pointer-events:none;background:repeating-linear-gradient(0deg,transparent 0 6px,rgba(60,205,255,.025) 7px 8px);animation:osScan 4s linear infinite}
    #ospulse-intro .intro-sweep{position:absolute;left:-20%;top:-20%;width:140%;height:12%;background:linear-gradient(transparent,rgba(45,215,255,.13),transparent);filter:blur(12px);transform:rotate(-15deg);animation:osSweep 3.4s ease-in-out both}
    #ospulse-intro .intro-content{position:relative;z-index:2;text-align:center;padding:36px 18px;width:min(96vw,680px);animation:osContent .8s cubic-bezier(.16,1,.3,1) both}
    #ospulse-intro .intro-orbit{position:relative;width:clamp(170px,34vw,245px);aspect-ratio:1;margin:0 auto 10px;display:grid;place-items:center}
    #ospulse-intro .intro-ring{position:absolute;inset:0;border-radius:50%;border:1px solid rgba(58,223,255,.42);box-shadow:0 0 35px rgba(31,203,255,.15),inset 0 0 28px rgba(60,114,255,.12);animation:osRing 5s linear infinite}
    #ospulse-intro .intro-ring.r2{inset:13%;border:2px dashed rgba(130,103,255,.65);animation-direction:reverse;animation-duration:3.8s}
    #ospulse-intro .intro-ring.r3{inset:26%;border:2px dotted rgba(95,239,255,.75);animation-duration:2.8s}
    #ospulse-intro .intro-ring.r1::before,#ospulse-intro .intro-ring.r1::after{content:"";position:absolute;width:11px;height:11px;border-radius:50%;background:#a2ffff;box-shadow:0 0 15px #27dfff,0 0 40px #27dfff;top:12%;left:12%}
    #ospulse-intro .intro-ring.r1::after{top:auto;left:auto;right:12%;bottom:12%;background:#a38cff;box-shadow:0 0 20px #8c6cff}
    #ospulse-intro .intro-core{position:relative;display:grid;place-items:center;width:80px;height:80px;border-radius:23px;border:1px solid #66eaff;background:linear-gradient(145deg,#142e57,#211044);font:800 48px 'Space Grotesk',system-ui,sans-serif;box-shadow:0 0 20px #23d6ff,0 0 65px rgba(80,81,255,.45),inset 0 0 20px rgba(68,221,255,.2);text-shadow:0 0 25px #50e6ff;animation:osCore 1.5s ease-in-out infinite alternate}
    #ospulse-intro .intro-kicker{font-size:10px;letter-spacing:.38em;color:#79e7ff;font-weight:700;margin-bottom:10px;animation:osBlink 1.1s steps(2) infinite}
    #ospulse-intro .intro-title{font:800 clamp(45px,11vw,88px)/1 'Space Grotesk',system-ui,sans-serif;letter-spacing:-.07em;position:relative;filter:drop-shadow(0 0 20px rgba(49,217,255,.3));animation:osTitle 1.15s cubic-bezier(.16,1,.3,1) both}
    #ospulse-intro .intro-title span{color:#4ee9ff}
    #ospulse-intro .intro-title::after{content:attr(data-title);position:absolute;inset:0;color:#ae83ff;opacity:0;clip-path:inset(28% 0 42% 0);animation:osGlitch 3s steps(1) 1}
    #ospulse-intro .intro-subtitle{margin:15px 0 22px;color:#8faec8;letter-spacing:.25em;font-size:11px;font-weight:600;text-transform:uppercase}
    #ospulse-intro .intro-status{min-height:20px;color:#65eaff;font:600 11px ui-monospace,SFMono-Regular,Consolas,monospace;letter-spacing:.11em}
    #ospulse-intro .intro-status::before{content:"› ";color:#a98dff}
    #ospulse-intro .intro-progress{height:3px;width:min(270px,75vw);margin:14px auto 0;background:rgba(90,165,230,.18);border-radius:20px;overflow:hidden;box-shadow:0 0 15px rgba(36,201,255,.1)}
    #ospulse-intro .intro-progress i{display:block;height:100%;width:100%;transform:scaleX(0);transform-origin:left;background:linear-gradient(90deg,#8055ff,#21d9ff,#d7ffff);box-shadow:0 0 18px #24dcff;animation:osProgress 3.5s ease-in-out forwards}
    #ospulse-intro .intro-corner{position:absolute;z-index:2;color:rgba(129,198,228,.58);font:10px ui-monospace,monospace;letter-spacing:.15em}
    #ospulse-intro .intro-corner.tl{top:24px;left:25px}#ospulse-intro .intro-corner.br{bottom:25px;right:25px}
    #ospulse-intro .intro-skip{position:absolute;z-index:3;bottom:25px;left:25px;background:rgba(10,30,54,.8);border:1px solid rgba(73,203,255,.4);border-radius:999px;padding:11px 17px;color:#d6f5ff;cursor:pointer;font:600 12px Inter,system-ui,sans-serif;transition:background .2s,border-color .2s}
    #ospulse-intro .intro-skip:hover,#ospulse-intro .intro-skip:focus-visible{background:#16365a;border-color:#65eaff;outline-offset:3px}
    #ospulse-intro .intro-flash{position:absolute;inset:0;background:#c4faff;opacity:0;pointer-events:none;z-index:4}
    #ospulse-intro.intro-exit .intro-flash{animation:osFlash .6s ease-out both}
    @keyframes osNebula{to{transform:translateX(-1%);filter:blur(38px) hue-rotate(18deg)}}
    @keyframes osGrid{to{background-position:0 130px,130px 0}}
    @keyframes osScan{to{background-position:0 160px}}
    @keyframes osSweep{from{top:-30%;opacity:0}25%{opacity:1}to{top:120%;opacity:0}}
    @keyframes osRing{to{transform:rotate(360deg)}}
    @keyframes osCore{to{transform:scale(1.09);box-shadow:0 0 40px #23d6ff,0 0 100px rgba(80,81,255,.55),inset 0 0 28px rgba(68,221,255,.35)}}
    @keyframes osBlink{50%{opacity:.35}}
    @keyframes osContent{from{opacity:0;transform:scale(.8) translateY(25px);filter:blur(14px)}to{opacity:1;transform:none;filter:none}}
    @keyframes osTitle{from{opacity:0;transform:translateY(18px);letter-spacing:.08em}to{opacity:1;transform:none;letter-spacing:-.07em}}
    @keyframes osGlitch{0%,13%,17%,46%,50%,100%{opacity:0;transform:none}14%,47%{opacity:.9;transform:translateX(5px)}15%,48%{opacity:.7;transform:translateX(-7px)}}
    @keyframes osProgress{to{transform:scaleX(1)}}
    @keyframes osFlash{0%{opacity:0}18%{opacity:.5}100%{opacity:0}}
    @media(max-width:600px){#ospulse-intro .intro-corner{font-size:8px}#ospulse-intro .intro-subtitle{font-size:9px;letter-spacing:.15em}#ospulse-intro .intro-skip{bottom:18px;left:18px}}
    @media(prefers-reduced-motion:reduce){#ospulse-intro{display:none!important}}
  `;
  document.head.appendChild(style);
  const intro = document.createElement('div');
  intro.id='ospulse-intro';
  intro.setAttribute('role','status');
  intro.setAttribute('aria-label','OSPulse loading');
  intro.innerHTML='<div class="intro-nebula"></div><div class="intro-grid"></div><div class="intro-scan"></div><div class="intro-sweep"></div><canvas aria-hidden="true"></canvas><span class="intro-corner tl">OS//PULSE — SYSTEM BOOT</span><span class="intro-corner br">SECURE CONNECTION · 2026</span><div class="intro-content"><div class="intro-orbit"><div class="intro-ring r1"></div><div class="intro-ring r2"></div><div class="intro-ring r3"></div><div class="intro-core">O</div></div><div class="intro-kicker">INITIALIZING DISCOVERY ENGINE</div><div class="intro-title" data-title="OSPulse">OS<span>Pulse</span></div><div class="intro-subtitle">Explore beyond the ordinary</div><div class="intro-status" aria-live="off">Booting interface...</div><div class="intro-progress"><i></i></div></div><button type="button" class="intro-skip" aria-label="Skip opening animation">Skip intro →</button><div class="intro-flash"></div>';
  document.body.appendChild(intro);
  const canvas=intro.querySelector('canvas');
  const ctx=canvas.getContext('2d',{alpha:true});
  let width=0,height=0,dpr=1,particles=[],frame=0,raf=0,done=false;
  const resize=()=>{
    dpr=Math.min(window.devicePixelRatio||1,2);
    width=window.innerWidth;height=window.innerHeight;
    canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);
    if(ctx)ctx.setTransform(dpr,0,0,dpr,0,0);
    const count=Math.min(125,Math.max(40,Math.round(width*height/8500)));
    particles=Array.from({length:count},()=>({x:Math.random()*width,y:Math.random()*height,r:.6+Math.random()*2,v:.25+Math.random()*1.4,phase:Math.random()*6.28,alpha:.2+Math.random()*.7}));
  };
  const draw=()=>{
    if(done||!ctx)return;
    frame++;
    ctx.clearRect(0,0,width,height);
    for(const p of particles){
      p.y-=p.v;p.x+=Math.sin(frame*.009+p.phase)*.25;
      if(p.y< -10){p.y=height+10;p.x=Math.random()*width;}
      ctx.beginPath();ctx.fillStyle='rgba(99,225,255,'+p.alpha+')';ctx.shadowBlur=12;ctx.shadowColor='#22d8ff';ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();
    }
    ctx.shadowBlur=0;
    const cx=width/2,cy=height/2-45;
    for(let k=0;k<3;k++){
      const radius=130+k*62+Math.sin(frame*.03+k)*9;
      ctx.beginPath();ctx.strokeStyle='rgba('+(k%2?'142,105,255':'48,217,255')+','+(.13-k*.025)+')';
      ctx.lineWidth=1.1;ctx.arc(cx,cy,radius,frame*.006+k,frame*.006+k+Math.PI*1.25);ctx.stroke();
    }
    raf=requestAnimationFrame(draw);
  };
  resize();
  window.addEventListener('resize',resize,{passive:true});
  if(ctx)raf=requestAnimationFrame(draw);
  const statuses=['Booting interface...','Syncing starfield particles...','Calibrating neon core...','Mapping operating systems...','OSPulse ready.'];
  const status=intro.querySelector('.intro-status');
  const timeouts=[];
  statuses.forEach((label,i)=>timeouts.push(setTimeout(()=>{if(!done)status.textContent=label;},i*720)));
  const finish=()=>{
    if(done)return;
    done=true;
    timeouts.forEach(clearTimeout);
    clearTimeout(auto);
    cancelAnimationFrame(raf);
    window.removeEventListener('resize',resize);
    intro.classList.add('intro-exit');
    setTimeout(()=>{intro.remove();style.remove();},900);
  };
  intro.querySelector('.intro-skip').addEventListener('click',finish);
  const key=e=>{if(e.key==='Escape'){finish();document.removeEventListener('keydown',key);}};
  document.addEventListener('keydown',key);
  const auto=setTimeout(()=>{finish();document.removeEventListener('keydown',key);},3650);
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
