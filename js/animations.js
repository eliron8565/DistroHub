/* OSPulse live homepage construction — build the real page, never a separate intro. */
(() => {
  'use strict';
  const root=document.documentElement;
  const normal=()=>root.classList.remove('osp-prebuild');
  const motionOff=window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(motionOff || (location.hash && location.hash!=='#home') || !Element.prototype.animate){
    normal();return;
  }

  const specs=[
    ['.site-header','NAVIGATION'],
    ['#home .hero-copy .eyebrow','STATUS'],
    ['#home .hero-copy h1','HEADLINE'],
    ['#home .hero-copy>p','DESCRIPTION'],
    ['#home .hero-actions','BUTTONS'],
    ['#home .hero-orbit','DISCOVERY'],
    ['#home .hero-metrics','METRICS'],
    ['#home .family-card:nth-child(1)','LINUX'],
    ['#home .family-card:nth-child(2)','GAMING'],
    ['#home .family-card:nth-child(3)','BSD'],
    ['#home .family-card:nth-child(4)','MOBILE'],
    ['#home .family-card:nth-child(5)','ALTERNATIVE'],
    ['#home .family-card:nth-child(6)','MEDIA'],
    ['#home .feature-strip>div:nth-child(1)','SOURCES'],
    ['#home .feature-strip>div:nth-child(2)','SPEED'],
    ['#home .feature-strip>div:nth-child(3)','PRIVACY']
  ];
  const items=specs.map(([selector,label])=>({el:document.querySelector(selector),label})).filter(x=>x.el);
  if(items.length<6){normal();return;}

  const css=document.createElement('style');
  css.id='osp-build-css';
  css.textContent=[
    'html.osp-building .site-header:not(.osp-placed),html.osp-building #home .hero-copy>*:not(.osp-placed),html.osp-building #home .hero-orbit:not(.osp-placed),html.osp-building #home .family-card:not(.osp-placed),html.osp-building #home .feature-strip>div:not(.osp-placed){opacity:0!important}',
    'html.osp-building #home.page.active,html.osp-building #home.page.active>*,html.osp-building #home .hero-copy>*,html.osp-building #home .hero-orbit,html.osp-building #home .family-card,html.osp-building #home .feature-strip>div,html.osp-building .site-header{animation:none!important;transition:none!important}',
    'html.osp-building #home .hero-orbit *,html.osp-building #home .orbit,html.osp-building #home .core{animation-play-state:paused!important}',
    'html.osp-building .ambient{opacity:.07}',
    '#osp-live-build{position:fixed;inset:0;z-index:2147482000;overflow:hidden;pointer-events:none;contain:layout style;transition:opacity .35s ease}',
    '#osp-live-build.osp-finished{opacity:0}',
    '#osp-live-build .osp-worker{position:absolute;left:0;top:0;z-index:4;opacity:0;will-change:transform;transition:opacity .14s ease}',
    '#osp-live-build .osp-worker:before{content:"";position:absolute;left:0;top:0;width:23px;height:28px;background:linear-gradient(140deg,#fff,var(--c));clip-path:polygon(0 0,0 100%,7px 19px,13px 29px,19px 26px,14px 17px,23px 16px);filter:drop-shadow(0 0 6px var(--c))}',
    '#osp-live-build .osp-worker:after{content:"";position:absolute;left:8px;top:10px;width:9px;height:9px;border:1px solid white;border-radius:50%;background:var(--c);box-shadow:0 0 12px var(--c)}',
    '#osp-live-build .osp-tag{position:absolute;left:18px;top:28px;border:1px solid var(--c);border-radius:5px;padding:3px 7px;background:rgba(7,15,32,.88);color:#efffff;font:700 9px monospace;letter-spacing:.07em;white-space:nowrap}',
    '#osp-live-build .osp-tail{position:absolute;left:11px;top:13px;width:var(--tail,75px);height:2px;transform-origin:0 50%;transform:rotate(var(--angle));background:linear-gradient(90deg,var(--c),transparent);opacity:.72}',
    '#osp-live-build .osp-wire{position:absolute;border:1px solid var(--c);border-radius:10px;box-sizing:border-box;box-shadow:0 0 12px rgba(72,206,255,.24),inset 0 0 8px rgba(72,206,255,.1);pointer-events:none;will-change:transform}',
    '#osp-live-build .osp-target{position:absolute;border:1px dashed var(--c);border-radius:10px;box-sizing:border-box;pointer-events:none;opacity:.18}',
    '#osp-live-build .osp-impact{position:absolute;left:var(--x);top:var(--y);width:36px;height:36px;border-radius:50%;border:1px solid var(--c);transform:translate(-50%,-50%);animation:ospImpact .46s ease-out both;pointer-events:none}',
    '#osp-live-build .osp-particle{position:absolute;left:var(--x);top:var(--y);width:3px;height:3px;background:var(--c);border-radius:50%;animation:ospBuildSpark .45s ease-out both;pointer-events:none}',
    '@keyframes ospImpact{0%{opacity:.85;transform:translate(-50%,-50%) scale(.4)}100%{opacity:0;transform:translate(-50%,-50%) scale(2.6)}}',
    '@keyframes ospBuildSpark{0%{opacity:.95;transform:translate3d(0,0,0)}100%{opacity:0;transform:translate3d(var(--dx),var(--dy),0)}}',
    '@media(max-width:680px){#osp-live-build .osp-tag{font-size:8px;padding:3px 5px}#osp-live-build .osp-tail{opacity:.5}}'
  ].join('\n');
  document.head.appendChild(css);
  root.classList.add('osp-building');
  normal();

  const layer=document.createElement('div');
  layer.id='osp-live-build';
  layer.setAttribute('aria-hidden','true');
  document.body.appendChild(layer);
  const palette=['#60eaff','#b58dff','#72f3cc'];
  const cursors=palette.map(color=>{
    const el=document.createElement('div');
    el.className='osp-worker';
    el.style.setProperty('--c',color);
    const tail=document.createElement('span');tail.className='osp-tail';
    const tag=document.createElement('span');tag.className='osp-tag';
    el.append(tail,tag);layer.appendChild(el);
    return el;
  });
  let stopped=false;
  const pendingAnimations=new Set();
  const pendingTimers=new Set();
  const later=(fn,ms)=>{
    const id=setTimeout(()=>{pendingTimers.delete(id);fn();},ms);
    pendingTimers.add(id);return id;
  };
  const wait=ms=>new Promise(resolve=>later(resolve,ms));
  const animate=(el,frames,options)=>{
    const anim=el.animate(frames,options);
    pendingAnimations.add(anim);
    return anim;
  };
  const burst=(x,y,color)=>{
    const ring=document.createElement('i');
    ring.className='osp-impact';
    ring.style.setProperty('--x',x+'px');ring.style.setProperty('--y',y+'px');
    ring.style.setProperty('--c',color);
    layer.appendChild(ring);
    ring.addEventListener('animationend',()=>ring.remove(),{once:true});
    for(let k=0;k<3;k++){
      const p=document.createElement('i');p.className='osp-particle';
      p.style.setProperty('--x',x+'px');p.style.setProperty('--y',y+'px');p.style.setProperty('--c',color);
      const a=(k*2*Math.PI/3)+(Math.random()*.32);
      p.style.setProperty('--dx',(Math.cos(a)*28)+'px');
      p.style.setProperty('--dy',(Math.sin(a)*28)+'px');
      layer.appendChild(p);
      p.addEventListener('animationend',()=>p.remove(),{once:true});
    }
  };

  const deliver=(item,operator,ms,number)=>new Promise(resolve=>{
    const el=item.el;
    const r=el.getBoundingClientRect();
    const visible=r.width>4 && r.height>4 && r.bottom>0 && r.top<innerHeight;
    if(stopped || !visible){el.classList.add('osp-placed');resolve();return;}
    const color=palette[operator],cursor=cursors[operator],isMobile=innerWidth<690;
    const dir=number%2===0?-1:1;
    const dx=dir*Math.min(isMobile?100:185,Math.max(70,innerWidth*.15));
    const dy=(operator===1?-1:1)*(isMobile?29:54);
    const anchorX=r.left+Math.min(24,r.width*.13);
    const anchorY=r.top+Math.min(20,r.height*.18);
    const motion={duration:ms,easing:'cubic-bezier(.42,0,.18,1)',fill:'both'};
    const start='translate3d('+dx+'px,'+dy+'px,0)';
    const end='translate3d(0,0,0)';
    cursor.style.left=anchorX+'px';cursor.style.top=anchorY+'px';
    cursor.style.setProperty('--angle',Math.atan2(dy,dx)+'rad');
    cursor.querySelector('.osp-tag').textContent='DRAG · '+item.label;
    cursor.style.opacity='1';

    const target=document.createElement('div');
    target.className='osp-target';
    const wire=document.createElement('div');
    wire.className='osp-wire';
    for(const node of [target,wire]){
      Object.assign(node.style,{left:r.left+'px',top:r.top+'px',width:r.width+'px',height:r.height+'px'});
      node.style.setProperty('--c',color);
      layer.appendChild(node);
    }
    const a=animate(cursor,[{transform:start},{transform:end}],motion);
    const b=animate(wire,[{transform:start,opacity:.65},{transform:end,opacity:.35}],motion);
    el.classList.add('osp-placed');
    const d=animate(el,[{transform:start,opacity:.84},{transform:end,opacity:1}],motion);
    const c=animate(target,[{opacity:0},{opacity:.2,offset:.55},{opacity:0}],motion);
    const settle=()=>{
      // Removing the final-keyframe animation returns the real element to its
      // natural layout at exactly the position where the cursor dropped it.
      for(const anim of [a,b,c,d]){try{anim.cancel();}catch(e){}pendingAnimations.delete(anim);}
      wire.remove();target.remove();
      cursor.style.opacity='0';
      if(!stopped)burst(Math.max(10,Math.min(innerWidth-10,anchorX)),Math.max(10,Math.min(innerHeight-10,anchorY)),color);
      resolve();
    };
    later(settle,ms+15);
  });

  const run=async()=>{
    // Real page construction, grouped by actual layout. No loading modal,
    // no forced scrolling, and no artificial wait for the OS catalog.
    const groups=[
      {ids:[0],ms:450},
      {ids:[1,2,3],ms:590},
      {ids:[4,5,6],ms:590},
      {ids:[7,8,9],ms:510},
      {ids:[10,11,12],ms:510},
      {ids:[13,14,15],ms:430}
    ];
    const list=specs.map(spec=>items.find(x=>x.label===spec[1])||null);
    for(const group of groups){
      if(stopped)return;
      await Promise.all(group.ids.map((idx,slot)=>{
        const item=list[idx];return item?deliver(item,slot,group.ms,idx):Promise.resolve();
      }));
      if(!stopped)await wait(170);
    }
    finish();
  };
  const finish=()=>{
    if(stopped)return;
    stopped=true;
    for(const anim of pendingAnimations){try{anim.cancel();}catch(e){}}
    pendingAnimations.clear();
    for(const timer of pendingTimers)clearTimeout(timer);
    pendingTimers.clear();
    items.forEach(item=>item.el.classList.add('osp-placed'));
    window.removeEventListener('hashchange',finish);
    window.removeEventListener('pagehide',finish);
    document.removeEventListener('visibilitychange',onVisibility);
    document.removeEventListener('keydown',onKey);
    root.classList.add('osp-built-done');
    root.classList.remove('osp-building');
    css.textContent=[
      'html.osp-built-done #home.page.active,html.osp-built-done #home.page.active>.hero-grid,html.osp-built-done #home.page.active>.family-grid,html.osp-built-done #home.page.active>.feature-strip,html.osp-built-done #home .hero-copy>*,html.osp-built-done #home .hero-orbit,html.osp-built-done #home .family-card{animation:none!important}'
    ].join('');
    layer.classList.add('osp-finished');
    setTimeout(()=>layer.remove(),380);
  };
  const onVisibility=()=>{if(document.visibilityState==='hidden')finish();};
  const onKey=e=>{if(e.key==='Escape')finish();};
  window.addEventListener('hashchange',finish);
  window.addEventListener('pagehide',finish);
  document.addEventListener('visibilitychange',onVisibility);
  document.addEventListener('keydown',onKey);
  // A watchdog guarantees a usable page even on throttled/older browsers.
  later(finish,5300);
  requestAnimationFrame(()=>{run().catch(finish);});
})();

/* OSPulse Living UI — ambient world, micro-interactions and lightweight motion. */
(() => {
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
  if (reduced) return;
  const root=document.documentElement;
  const style=document.createElement('style');style.id='ospulse-living-style';style.textContent=`
    :root{--mx:50vw;--my:30vh;--motion-ease:cubic-bezier(.22,1,.36,1);--motion-spring:cubic-bezier(.16,1,.3,1)}
    body::before{content:'';position:fixed;left:0;top:0;width:310px;height:310px;transform:translate3d(calc(var(--mx) - 50%),calc(var(--my) - 50%),0);border-radius:50%;pointer-events:none;z-index:0;background:radial-gradient(circle,rgba(34,211,238,.12),rgba(124,92,255,.045) 36%,transparent 70%);transition:transform .18s ease-out;will-change:transform}
    #ospulse-particles{position:fixed;inset:0;z-index:0;pointer-events:none;overflow:hidden;opacity:.65}.ospulse-particle{position:absolute;width:2px;height:2px;border-radius:50%;background:#67e8f9;box-shadow:0 0 9px #22d3ee;animation:particleDrift var(--pd) ease-in-out infinite alternate;opacity:var(--po)}@keyframes particleDrift{from{transform:translate3d(0,0,0) scale(.7)}to{transform:translate3d(var(--px),var(--py),0) scale(1.5)}}
    .site-header,main{position:relative;z-index:1}.site-header{transition:padding .3s ease,box-shadow .3s ease,background .3s ease}.site-header.scrolled{padding-top:9px;padding-bottom:9px;box-shadow:0 12px 45px rgba(0,0,0,.25)}
    .page.active{animation:pageIn .5s var(--motion-ease) both}.page.active>*{animation:sectionIn .65s var(--motion-ease) both}.page.active>*:nth-child(2){animation-delay:.07s}.page.active>*:nth-child(3){animation-delay:.14s}.page.active>*:nth-child(4){animation-delay:.21s}@keyframes pageIn{from{opacity:.01;transform:translateY(10px)}to{opacity:1;transform:none}}@keyframes sectionIn{from{opacity:0;transform:translateY(18px);filter:blur(4px)}to{opacity:1;transform:none;filter:none}}
    .hero-copy>*{animation:heroRise .8s var(--motion-ease) both;animation-delay:calc(var(--i,0)*80ms)}.hero-orbit{animation:orbitIn 1.1s var(--motion-ease) both}@keyframes heroRise{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:none}}@keyframes orbitIn{from{opacity:0;transform:scale(.78) rotate(-12deg)}to{opacity:1;transform:none}}
    .system-card,.game-card,.family-card,.feature-strip>div,.dashboard-card,.oslab-card,.quiz-card,.search-panel,.compare-builder{transition:transform .38s var(--motion-spring),box-shadow .38s ease,border-color .38s ease}.system-card:hover,.game-card:hover,.family-card:hover,.dashboard-card:hover,.oslab-card:hover,.quiz-card:hover,.compare-builder:hover{transform:translateY(-7px);box-shadow:0 22px 60px rgba(0,0,0,.3);border-color:rgba(100,210,255,.3)}
    .system-card,.game-card,.family-card,.oslab-card{position:relative;overflow:hidden}.system-card::before,.game-card::before,.family-card::before,.oslab-card::before{content:'';position:absolute;inset:0;border-radius:inherit;pointer-events:none;opacity:0;background:radial-gradient(300px circle at var(--card-x,50%) var(--card-y,0%),rgba(88,190,255,.17),transparent 58%);transition:opacity .3s ease}.system-card:hover::before,.game-card:hover::before,.family-card:hover::before,.oslab-card:hover::before{opacity:1}
    .system-grid .system-card,.gaming-grid .game-card{animation:cardIn .55s var(--motion-ease) both;animation-delay:calc(var(--card-index,0)*45ms)}.family-grid .family-card{animation:cardIn .6s var(--motion-ease) both;animation-delay:calc(var(--card-index,0)*70ms)}@keyframes cardIn{from{opacity:0;transform:translateY(24px) scale(.985)}to{opacity:1;transform:none}}
    .btn,.icon-btn,.account-btn,.game-chip,.chip,.oslab-badge,.fav-btn{transition:transform .22s var(--motion-spring),box-shadow .22s ease,filter .22s ease}.btn:hover,.icon-btn:hover,.account-btn:hover,.game-chip:hover,.chip:hover,.oslab-badge:hover{transform:translateY(-2px)}.btn:active,.icon-btn:active,.account-btn:active,.game-chip:active,.chip:active,.oslab-badge:active,.fav-btn:active{transform:scale(.94)}
    .motion-ripple{position:absolute;border-radius:50%;pointer-events:none;transform:scale(0);background:rgba(255,255,255,.3);animation:ripple .55s ease-out forwards}@keyframes ripple{to{transform:scale(4);opacity:0}}
    .brand-mark{transition:transform .55s var(--motion-spring),box-shadow .4s ease}.brand:hover .brand-mark{transform:rotate(-8deg) scale(1.08);box-shadow:0 0 30px rgba(70,210,255,.6)}.main-nav a{position:relative}.main-nav a::after{content:'';position:absolute;left:50%;bottom:-5px;width:0;height:2px;border-radius:99px;background:linear-gradient(90deg,#7c6cff,#22d9ff);transition:width .35s var(--motion-spring),left .35s var(--motion-spring)}.main-nav a:hover::after,.main-nav a.active::after{left:12%;width:76%}
    .system-logo,.game-logo,.dash-icon,.family-icon{transition:transform .45s var(--motion-spring),filter .45s ease}.system-card:hover .system-logo,.game-card:hover .game-logo,.dashboard-card:hover .dash-icon,.family-card:hover .family-icon{transform:rotate(-6deg) scale(1.1);filter:drop-shadow(0 0 13px rgba(80,210,255,.45))}.fav-btn.active{animation:heartPop .45s var(--motion-spring)}@keyframes heartPop{0%{transform:scale(.7)}55%{transform:scale(1.28)}100%{transform:scale(1)}}
    .pulse-dot{animation:dotPulse 1.8s ease-in-out infinite}@keyframes dotPulse{0%,100%{box-shadow:0 0 0 0 rgba(34,217,255,.4)}50%{box-shadow:0 0 0 8px rgba(34,217,255,0)}}.hero-orbit .core{animation:none}.hero-orbit .orbit{animation:spinOrbit 18s linear infinite}.hero-orbit .orbit-2{animation-duration:12s;animation-direction:reverse}.hero-orbit .orbit-node{animation:nodeFloat 3s ease-in-out infinite}.node-2{animation-delay:-1s}.node-3{animation-delay:-2s}@keyframes corePulse{0%,100%{box-shadow:0 0 28px rgba(90,100,255,.18)}50%{box-shadow:0 0 65px rgba(90,100,255,.38),0 0 100px rgba(34,211,238,.1)}}@keyframes spinOrbit{to{transform:rotate(360deg)}}@keyframes nodeFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
    .gaming-hero::after{content:'';position:absolute;inset:-20%;pointer-events:none;background:conic-gradient(from 0deg,transparent,rgba(34,211,238,.09),transparent,rgba(124,92,255,.09),transparent);animation:heroSweep 12s linear infinite}@keyframes heroSweep{to{transform:rotate(360deg)}}.scanline{animation:scan 6s linear infinite}@keyframes scan{from{background-position:0 0}to{background-position:0 120px}}.game-score span{animation:scoreGlow 2.4s ease-in-out infinite}@keyframes scoreGlow{50%{text-shadow:0 0 20px rgba(34,211,238,.55)}}
    .search-box:focus-within{box-shadow:0 0 0 3px rgba(77,196,255,.1),0 0 38px rgba(77,196,255,.12);transform:translateY(-1px);transition:.3s}.modal.show .modal-card,.auth-modal.show .auth-card{animation:modalIn .45s var(--motion-spring)}@keyframes modalIn{from{opacity:0;transform:translateY(24px) scale(.95);filter:blur(7px)}to{opacity:1;transform:none;filter:none}}.toast.show{animation:toastIn .42s var(--motion-spring)}@keyframes toastIn{from{opacity:0;transform:translateY(18px) scale(.96)}to{opacity:1;transform:none}}
    @media(max-width:700px){body::before{width:200px;height:200px}.page.active>*{animation-duration:.45s}.gaming-hero::after{display:none}.system-card:hover,.game-card:hover,.family-card:hover,.dashboard-card:hover,.oslab-card:hover,.quiz-card:hover,.compare-builder:hover{transform:translateY(-3px)}}
  `;document.head.appendChild(style);

  const particleLayer=document.createElement('div');particleLayer.id='ospulse-particles';particleLayer.setAttribute('aria-hidden','true');const count=Math.min(12,Math.max(6,Math.floor(innerWidth/110)));for(let i=0;i<count;i++){const p=document.createElement('span');p.className='ospulse-particle';p.style.left=`${Math.random()*100}%`;p.style.top=`${Math.random()*100}%`;p.style.setProperty('--pd',`${4+Math.random()*8}s`);p.style.setProperty('--px',`${(Math.random()-.5)*80}px`);p.style.setProperty('--py',`${(Math.random()-.5)*100}px`);p.style.setProperty('--po',`${.18+Math.random()*.5}`);particleLayer.appendChild(p)}document.body.prepend(particleLayer);
  let latestPointer=null,pointerFrame=0;
  window.addEventListener('pointermove',e=>{
    latestPointer={x:e.clientX,y:e.clientY,target:e.target};
    if(pointerFrame||document.hidden)return;
    pointerFrame=requestAnimationFrame(()=>{
      pointerFrame=0;
      const p=latestPointer;if(!p)return;
      root.style.setProperty('--mx',p.x+'px');
      root.style.setProperty('--my',p.y+'px');
      const card=p.target.closest?.('.system-card,.game-card,.family-card,.oslab-card');
      if(card){
        const rect=card.getBoundingClientRect();
        card.style.setProperty('--card-x',(p.x-rect.left)+'px');
        card.style.setProperty('--card-y',(p.y-rect.top)+'px');
      }
    });
  },{passive:true});
  const header=document.querySelector('.site-header');const onScroll=()=>header?.classList.toggle('scrolled',scrollY>24);addEventListener('scroll',onScroll,{passive:true});onScroll();
  const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.08});
  const revealSelector='.family-card,.feature-strip>div,.system-card,.game-card,.dashboard-card,.oslab-card,.compare-builder,.quiz-card';
  const register=el=>{
    if(!el||el.nodeType!==1)return;
    if(el.matches?.(revealSelector)&&!el.classList.contains('reveal')){
      el.classList.add('reveal');
      observer.observe(el);
    }
    if(el.matches?.('.system-card,.game-card,.family-card')){
      const siblings=el.parentElement?.children;
      if(siblings)el.style.setProperty('--card-index',Math.min(Array.prototype.indexOf.call(siblings,el),14));
    }
    el.querySelectorAll?.(revealSelector).forEach(register);
  };
  document.querySelector('main')?.querySelectorAll(revealSelector).forEach(register);
  // Process only newly inserted nodes. Never rescan the entire catalog on every mutation.
  const main=document.querySelector('main');
  if(main)new MutationObserver(records=>{
    for(const record of records)for(const node of record.addedNodes)register(node);
  }).observe(main,{childList:true,subtree:true});
  document.addEventListener('click',e=>{const b=e.target.closest?.('.btn,.icon-btn,.account-btn,.game-chip,.chip,.oslab-badge');if(!b)return;const r=b.getBoundingClientRect(),size=Math.max(r.width,r.height)*1.4,ring=document.createElement('span');ring.className='motion-ripple';ring.style.width=ring.style.height=`${size}px`;ring.style.left=`${e.clientX-r.left-size/2}px`;ring.style.top=`${e.clientY-r.top-size/2}px`;b.style.position=b.style.position||'relative';b.appendChild(ring);ring.addEventListener('animationend',()=>ring.remove(),{once:true})});
})();
