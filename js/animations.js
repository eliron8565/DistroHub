/* OSPulse cinematic assembly — real homepage elements dragged into position by designer cursors. */
(() => {
  'use strict';
  const root=document.documentElement;
  const releasePrebuild=()=>root.classList.remove('osp-prebuild');
  const reduced=window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduced || (location.hash && location.hash!=='#home') || !Element.prototype.animate){
    releasePrebuild();return;
  }
  const definitions=[
    ['.site-header',0.10,'NAVIGATION'],
    ['#home .hero-copy .eyebrow',0.40,'STATUS'],
    ['#home .hero-copy h1',0.70,'HEADLINE'],
    ['#home .hero-copy>p',1.00,'DESCRIPTION'],
    ['#home .hero-copy .hero-actions',1.30,'ACTIONS'],
    ['#home .hero-orbit',1.60,'DISCOVERY CORE'],
    ['#home .hero-copy .hero-metrics',1.90,'LIVE METRICS'],
    ['#home .family-card:nth-child(1)',3.50,'LINUX'],
    ['#home .family-card:nth-child(2)',3.74,'GAMING'],
    ['#home .family-card:nth-child(3)',3.98,'BSD'],
    ['#home .family-card:nth-child(4)',4.22,'MOBILE'],
    ['#home .family-card:nth-child(5)',4.46,'ALTERNATIVE'],
    ['#home .family-card:nth-child(6)',4.70,'MEDIA'],
    ['#home .feature-strip>div:nth-child(1)',5.98,'TRUST'],
    ['#home .feature-strip>div:nth-child(2)',6.25,'SPEED'],
    ['#home .feature-strip>div:nth-child(3)',6.52,'PRIVACY']
  ];
  const items=definitions.map(([selector,time,label])=>({el:document.querySelector(selector),time,label})).filter(v=>v.el);
  if(items.length<6){releasePrebuild();return;}
  const colors=['#62e9ff','#b793ff','#70f4c2'];
  const style=document.createElement('style');style.id='osp-construction-style';
  style.textContent=[
    'body.osp-constructing{overflow:hidden}',
    'body.osp-constructing .site-header:not(.osp-built),body.osp-constructing #home .hero-copy>*:not(.osp-built),body.osp-constructing #home .hero-orbit:not(.osp-built),body.osp-constructing #home .family-card:not(.osp-built),body.osp-constructing #home .feature-strip>div:not(.osp-built){opacity:0!important}',
    'body.osp-constructing #home .osp-built{opacity:1}',
    '#osp-construction{position:fixed;inset:0;z-index:2147483000;pointer-events:auto;overflow:hidden;isolation:isolate;transition:opacity .65s ease}',
    '#osp-construction.finished{opacity:0;pointer-events:none}',
    '#osp-construction .osp-mesh{position:absolute;inset:0;pointer-events:none;background:linear-gradient(rgba(67,214,255,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(67,214,255,.04) 1px,transparent 1px);background-size:48px 48px;mask-image:linear-gradient(to bottom,rgba(0,0,0,.5),transparent 90%)}',
    '#osp-construction .osp-shade{position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse at 50% 25%,transparent 30%,rgba(3,10,28,.13) 100%)}',
    '#osp-construction .osp-cursor{position:absolute;top:0;left:0;z-index:12;opacity:0;will-change:transform,opacity;transition:opacity .12s ease-in-out;filter:drop-shadow(0 0 10px var(--color))}',
    '#osp-construction .osp-cursor:before{content:"";position:absolute;left:0;top:0;width:23px;height:29px;background:linear-gradient(130deg,#fff,var(--color) 58%);clip-path:polygon(0 0,0 100%,7px 20px,13px 30px,19px 27px,14px 17px,23px 16px);filter:drop-shadow(0 0 5px var(--color))}',
    '#osp-construction .osp-grip{position:absolute;left:9px;top:12px;width:10px;height:10px;border:1px solid #fff;background:var(--color);border-radius:50%;box-shadow:0 0 0 5px color-mix(in srgb,var(--color) 15%,transparent),0 0 20px var(--color);animation:ospGrip .48s ease-in-out infinite alternate}',
    '#osp-construction .osp-tag{position:absolute;top:28px;left:17px;white-space:nowrap;border:1px solid var(--color);border-radius:6px;background:rgba(5,15,32,.93);box-shadow:0 0 18px color-mix(in srgb,var(--color) 28%,transparent);padding:5px 9px;color:#f0feff;font:700 10px monospace;letter-spacing:.08em}',
    '#osp-construction .osp-beam{position:absolute;left:8px;top:13px;width:75px;height:2px;transform-origin:0 50%;transform:rotate(var(--beam));background:linear-gradient(90deg,var(--color),transparent);box-shadow:0 0 12px var(--color);opacity:.8}',
    '#osp-construction .osp-dock{position:absolute;box-sizing:border-box;border:1px dashed var(--color);border-radius:10px;opacity:.3;pointer-events:none;box-shadow:inset 0 0 20px color-mix(in srgb,var(--color) 10%,transparent);animation:ospDockPulse .95s ease-in-out infinite alternate}',
    '#osp-construction .osp-cargo{position:absolute;box-sizing:border-box;border:1px solid var(--color);border-radius:10px;box-shadow:0 0 13px color-mix(in srgb,var(--color) 30%,transparent),inset 0 0 10px color-mix(in srgb,var(--color) 12%,transparent);pointer-events:none;will-change:transform,opacity}',
    '#osp-construction .osp-cargo:before,#osp-construction .osp-cargo:after{content:"";position:absolute;width:8px;height:8px;background:#0b1934;border:1px solid var(--color);box-shadow:0 0 10px var(--color)}',
    '#osp-construction .osp-cargo:before{top:-5px;left:-5px}#osp-construction .osp-cargo:after{bottom:-5px;right:-5px}',
    '#osp-construction .osp-cargo-label{position:absolute;right:5px;top:-19px;color:var(--color);font:700 9px monospace;letter-spacing:.09em;text-shadow:0 0 8px var(--color)}',
    '#osp-construction .osp-snap{position:absolute;left:var(--x);top:var(--y);height:65px;width:65px;border-radius:50%;border:1px solid var(--color);box-shadow:0 0 30px var(--color);animation:ospSnap .6s ease-out both;pointer-events:none}',
    '#osp-construction .osp-spark{position:absolute;left:var(--x);top:var(--y);height:3px;width:3px;border-radius:50%;background:var(--color);box-shadow:0 0 12px var(--color);animation:ospSpark .65s ease-out both;pointer-events:none}',
    '#osp-construction .osp-caption{position:absolute;left:0;right:0;bottom:59px;text-align:center;color:#9defff;font:700 10px monospace;letter-spacing:.18em;text-shadow:0 0 15px #22e4ff;pointer-events:none}',
    '#osp-construction .osp-phase{position:absolute;top:22px;left:22px;z-index:7;pointer-events:none;padding:8px 12px;border:1px solid rgba(98,233,255,.24);border-radius:9px;background:rgba(6,19,38,.72);color:#a8f5ff;font:700 10px monospace;letter-spacing:.12em;backdrop-filter:blur(8px)}',
    '#osp-construction .osp-progress{position:absolute;left:50%;bottom:44px;transform:translateX(-50%);width:min(340px,62vw);height:3px;border-radius:9px;overflow:hidden;background:rgba(86,179,238,.22);pointer-events:none}',
    '#osp-construction .osp-progress>i{display:block;width:100%;height:100%;transform-origin:left;transform:scaleX(0);background:linear-gradient(90deg,#8f6dff,#5eeaff,#a4ffe1);box-shadow:0 0 16px #5eeaff;transition:transform .6s cubic-bezier(.23,.7,.2,1)}',
    '#osp-construction .osp-status{position:absolute;left:22px;bottom:22px;color:#86dbea;font:700 10px monospace;letter-spacing:.11em;pointer-events:none}',
    '#osp-construction .osp-percentage{position:absolute;right:23px;bottom:22px;color:#aef8ff;font:700 11px monospace;text-shadow:0 0 12px #3eeaff;pointer-events:none}',
    '#osp-construction .osp-skip{position:absolute;right:20px;top:20px;border:1px solid #67dff4;border-radius:99px;background:rgba(5,20,40,.9);color:#eefbff;padding:10px 16px;font:600 12px Inter,system-ui,sans-serif;cursor:pointer;z-index:20;transition:background .2s,box-shadow .2s}',
    '#osp-construction .osp-skip:hover,#osp-construction .osp-skip:focus-visible{background:#16425c;box-shadow:0 0 24px rgba(70,226,255,.35)}',
    '@keyframes ospGrip{to{transform:scale(1.25);box-shadow:0 0 0 8px color-mix(in srgb,var(--color) 12%,transparent),0 0 25px var(--color)}}',
    '@keyframes ospDockPulse{to{opacity:.55}}',
    '@keyframes ospSnap{from{opacity:.95;transform:translate(-50%,-50%) scale(.2)}to{opacity:0;transform:translate(-50%,-50%) scale(1.8)}}',
    '@keyframes ospSpark{from{opacity:1;transform:translate(0,0) scale(.5)}to{opacity:0;transform:translate(var(--dx),var(--dy)) scale(1.4)}}',
    '@media(max-width:650px){#osp-construction .osp-caption{bottom:68px;font-size:8px;letter-spacing:.08em}#osp-construction .osp-progress{bottom:51px;width:68vw}#osp-construction .osp-status{left:10px;bottom:20px;font-size:8px}#osp-construction .osp-percentage{right:10px;bottom:20px}#osp-construction .osp-tag{font-size:8px;padding:4px 6px}}'
  ].join('\n');
  document.head.appendChild(style);
  const overlay=document.createElement('div');
  overlay.id='osp-construction';
  overlay.innerHTML='<div class="osp-shade"></div><div class="osp-mesh"></div><div class="osp-phase">01 / 03 · HERO</div><div class="osp-caption">OSPulse // BUILDING YOUR INTERFACE</div><div class="osp-progress"><i></i></div><div class="osp-status">INITIALIZING · CURSOR ASSEMBLY</div><div class="osp-percentage">00%</div><button class="osp-skip" type="button" aria-label="Skip introduction">Skip intro →</button>';
  document.body.appendChild(overlay);
  const cursorData=colors.map((color,i)=>{
    const el=document.createElement('div');el.className='osp-cursor';
    el.style.setProperty('--color',color);
    el.innerHTML='<span class="osp-beam"></span><span class="osp-grip"></span><span class="osp-tag"></span>';
    overlay.appendChild(el);
    return {el,ticket:0,animation:null};
  });
  let stopped=false,completed=0,catalogReady=Boolean(window.app && window.app.systems && window.app.systems.length),minimumDone=false;
  const timers=[],active=[];
  const initialScroll=window.scrollY||0;
  let cameraMoved=false,cameraRestored=false;
  const focusSection=(selector,ratio)=>{
    if(stopped || typeof window.scrollTo!=='function')return;
    const section=document.querySelector(selector);if(!section)return;
    const rect=section.getBoundingClientRect();
    const current=window.scrollY||0;
    const wanted=Math.max(0,current+rect.top-innerHeight*ratio);
    if(Math.abs(wanted-current)<95)return;
    cameraMoved=true;window.scrollTo({top:wanted,behavior:'smooth'});
  };
  const restoreCamera=(behavior)=>{
    if(cameraMoved && !cameraRestored && typeof window.scrollTo==='function'){
      cameraRestored=true;window.scrollTo({top:initialScroll,behavior});
    }
  };
  const later=(fn,ms)=>{const id=setTimeout(()=>{if(!stopped)fn();},ms);timers.push(id);};
  const clamp=(n,min,max)=>Math.min(max,Math.max(min,n));
  const addAt=(className,x,y,color)=>{
    const e=document.createElement('i');e.className=className;
    e.style.setProperty('--x',x+'px');e.style.setProperty('--y',y+'px');e.style.setProperty('--color',color);
    overlay.appendChild(e);e.addEventListener('animationend',()=>e.remove(),{once:true});return e;
  };
  const burst=(x,y,color)=>{
    addAt('osp-snap',x,y,color);
    for(let j=0;j<10;j++){
      const s=addAt('osp-spark',x,y,color),angle=(j/10)*Math.PI*2;
      const distance=25+Math.random()*50;
      s.style.setProperty('--dx',Math.cos(angle)*distance+'px');
      s.style.setProperty('--dy',Math.sin(angle)*distance+'px');
    }
  };
  const updateProgress=()=>{
    const percentage=Math.round(100*completed/items.length);
    overlay.querySelector('.osp-progress i').style.transform='scaleX('+(completed/items.length)+')';
    overlay.querySelector('.osp-percentage').textContent=String(percentage).padStart(2,'0')+'%';
    overlay.querySelector('.osp-status').textContent=completed===items.length?'ALL COMPONENTS DOCKED':'DRAGGING COMPONENTS · '+completed+'/'+items.length;
    if(completed===items.length){later(()=>restoreCamera('smooth'),200);if(minimumDone && catalogReady)later(finish,1170);}
  };
  const completedItem=()=>{
    completed++;updateProgress();
  };
  let currentPhase=-1;
  const build=(item,index)=>{
    const phase=index<7?0:index<13?1:2;
    if(phase!==currentPhase){
      currentPhase=phase;
      const phaseNode=overlay.querySelector('.osp-phase');
      phaseNode.textContent=['01 / 03 · HERO','02 / 03 · CATEGORIES','03 / 03 · FINISHING'][phase];
      const fade=phaseNode.animate([{opacity:.4,transform:'translateY(4px)'},{opacity:1,transform:'translateY(0)'}],{duration:280,easing:'ease-out'});active.push(fade);
    }
    const el=item.el,rect=el.getBoundingClientRect();
    if(rect.width<3 || rect.height<3 || rect.top>innerHeight+25 || rect.bottom<0){
      el.classList.add('osp-built');completedItem();return;
    }
    const color=colors[index%3],operator=cursorData[index%3];
    const vw=window.innerWidth,side=index%3===0?-1:1;
    const fromX=side*Math.min(Math.max(125,vw*.17),215);
    const fromY=index%3===1?-Math.min(80,innerHeight*.09):Math.min(75,innerHeight*.08);
    const gripX=rect.left+Math.min(29,rect.width*.15),gripY=rect.top+Math.min(24,rect.height*.20);
    // One shared, continuously eased motion curve keeps the cursor, its
    // holographic frame and the real DOM component perfectly synchronized.
    const startRotation=side*1.25;
    const paths=[
      {dx:fromX,dy:fromY,factor:.955,rot:startRotation,offset:0},
      {dx:0,dy:0,factor:1,rot:0,offset:1}
    ];
    const duration=index>=13?640:(index>=7?610:760);
    const timing={duration,easing:'cubic-bezier(.44,0,.20,1)',fill:'both'};
    const operatorReady=operator.readyAt||0;
    if(Date.now()<operatorReady){later(()=>build(item,index),Math.max(35,operatorReady-Date.now()));return;}
    operator.readyAt=Date.now()+duration+75;
    const ticket=++operator.ticket;
    if(operator.animation){try{operator.animation.cancel();}catch(e){}}
    const cursor=operator.el;
    cursor.style.left=gripX+'px';cursor.style.top=gripY+'px';cursor.style.opacity='1';
    cursor.style.setProperty('--beam',Math.atan2(fromY,fromX)+'rad');
    cursor.querySelector('.osp-tag').textContent='DRAGGING · '+item.label;
    const pointerFrames=paths.map(p=>({offset:p.offset,transform:'translate('+p.dx+'px,'+p.dy+'px)'}));
    operator.animation=cursor.animate(pointerFrames,timing);active.push(operator.animation);
    const dock=document.createElement('div');dock.className='osp-dock';
    Object.assign(dock.style,{left:rect.left+'px',top:rect.top+'px',width:rect.width+'px',height:rect.height+'px'});
    dock.style.setProperty('--color',color);overlay.appendChild(dock);
    const dockFade=dock.animate([{opacity:0},{opacity:.38,offset:.3},{opacity:.22,offset:.8},{opacity:0}],{duration:duration+200,easing:'ease-in-out',fill:'both'});active.push(dockFade);
    const frame=document.createElement('div');frame.className='osp-cargo';
    Object.assign(frame.style,{left:rect.left+'px',top:rect.top+'px',width:rect.width+'px',height:rect.height+'px'});
    frame.style.setProperty('--color',color);
    const label=document.createElement('span');label.className='osp-cargo-label';label.textContent='[ '+item.label+' ]';frame.appendChild(label);
    overlay.appendChild(frame);
    const movingFrames=paths.map(p=>({offset:p.offset,transform:'translate('+p.dx+'px,'+p.dy+'px) scale('+p.factor+') rotate('+p.rot+'deg)',transformOrigin:'0 0'}));
    const outlineAnimation=frame.animate(movingFrames,timing);active.push(outlineAnimation);
    el.classList.add('osp-built');
    const elementFrames=paths.map((p,j)=>({
      offset:p.offset,
      opacity:j===0?.93:1,
      transform:'translate('+p.dx+'px,'+p.dy+'px) scale('+p.factor+') rotate('+p.rot+'deg)',
      transformOrigin:'0 0'
    }));
    const movement=el.animate(elementFrames,timing);active.push(movement);
    movement.onfinish=()=>{
      if(stopped)return;
      try{movement.cancel();outlineAnimation.cancel();}catch(e){}
      frame.remove();dock.remove();
      const px=clamp(gripX,12,innerWidth-12),py=clamp(gripY,12,innerHeight-12);
      burst(px,py,color);
      if(operator.ticket===ticket){cursor.style.opacity='0';}
      completedItem();
    };
  };
  const finish=()=>{
    if(stopped)return;stopped=true;
    timers.forEach(clearTimeout);
    window.removeEventListener('ospulse:catalog-ready',onCatalog);
    window.removeEventListener('hashchange',finish);
    window.removeEventListener('resize',finish);
    document.removeEventListener('keydown',onKey);
    document.removeEventListener('visibilitychange',onHidden);
    restoreCamera('instant');
    active.forEach(a=>{try{a.cancel();}catch(e){}});
    document.body.classList.remove('osp-constructing');releasePrebuild();
    items.forEach(item=>item.el.classList.remove('osp-built'));
    overlay.classList.add('finished');
    setTimeout(()=>{overlay.remove();style.remove();},670);
  };
  const onCatalog=()=>{catalogReady=true;if(completed===items.length && minimumDone)later(finish,1170);};
  const onKey=e=>{if(e.key==='Escape')finish();};
  const onHidden=()=>{if(document.visibilityState==='hidden')finish();};
  overlay.querySelector('.osp-skip').addEventListener('click',finish);
  document.body.classList.add('osp-constructing');releasePrebuild();
  window.addEventListener('ospulse:catalog-ready',onCatalog);
  window.addEventListener('hashchange',finish);
  window.addEventListener('resize',finish);
  document.addEventListener('keydown',onKey);
  document.addEventListener('visibilitychange',onHidden);
  items.forEach((item,index)=>later(()=>build(item,index),item.time*1000));
  later(()=>focusSection('#home .family-grid',.20),2820);
  later(()=>focusSection('#home .feature-strip',.21),5400);
  later(()=>{minimumDone=true;if(completed===items.length && catalogReady)later(finish,1170);},7400);
  later(finish,10200);
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
