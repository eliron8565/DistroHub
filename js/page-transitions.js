/* OSPulse Six Worlds — distinct, lightweight animations for real app pages. */
(() => {
  'use strict';
  const supported=['home','explore','gaming','compare','favorites','recommend'];
  const reduce=window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
  if(reduce || !Element.prototype.animate)return;

  const css=document.createElement('style');
  css.id='osp-six-worlds-style';
  css.textContent=[
    'html.osp-six-worlds .page:not(#home).active,html.osp-six-worlds .page:not(#home).active>*,html.osp-six-worlds .page:not(#home).active .system-card,html.osp-six-worlds .page:not(#home).active .game-card{animation:none!important}',
    '.osp-world-host{position:relative!important}',
    '.osp-world-layer{position:absolute;inset:0;z-index:4;overflow:hidden;pointer-events:none;border-radius:inherit;isolation:isolate}',
    '.osp-world-label{position:absolute;right:12px;top:8px;z-index:2;font:700 9px/1.4 monospace;letter-spacing:.16em;color:var(--world-color);text-shadow:0 0 10px var(--world-color);opacity:.85}',
    '.osp-world-shimmer{position:absolute;inset:0;width:40%;height:100%;background:linear-gradient(90deg,transparent,rgba(87,229,255,.11),transparent);will-change:transform;pointer-events:none}',
    '.osp-world-gaming .osp-power{position:absolute;inset:auto 0 44% 0;height:3px;background:linear-gradient(90deg,transparent,#a677ff,#50d9ff,transparent);box-shadow:0 0 17px rgba(147,105,255,.7);transform-origin:center;will-change:transform,opacity}',
    '.osp-world-compare .osp-lock{position:absolute;left:50%;top:50%;width:92px;height:92px;border:2px solid rgba(133,225,255,.85);border-radius:50%;box-shadow:0 0 22px rgba(69,221,255,.25),inset 0 0 15px rgba(69,221,255,.14);transform:translate(-50%,-50%);pointer-events:none}',
    '.osp-world-compare .osp-lock:after{content:"VS";position:absolute;inset:0;display:grid;place-items:center;font:900 21px Space Grotesk,Inter,sans-serif;color:#b0efff;text-shadow:0 0 16px #56cfff}',
    '.osp-world-favorites .osp-star{position:absolute;width:9px;height:9px;border-radius:50%;background:#ff96d1;box-shadow:0 0 13px #ec81c5}',
    '.osp-world-favorites .osp-star.s1{left:16%;top:42%}.osp-world-favorites .osp-star.s2{left:50%;top:20%}.osp-world-favorites .osp-star.s3{left:84%;top:42%}',
    '.osp-world-favorites .osp-thread{position:absolute;height:1px;top:35%;width:36%;background:linear-gradient(90deg,transparent,rgba(255,133,204,.8),transparent);transform-origin:left}',
    '.osp-world-favorites .osp-thread.t1{left:16%;transform:rotate(-15deg)}.osp-world-favorites .osp-thread.t2{left:50%;transform:rotate(15deg)}',
    '.osp-world-recommend .osp-radar{position:absolute;left:50%;top:50%;width:min(280px,75%);aspect-ratio:1;max-height:90%;border-radius:50%;border:1px solid rgba(72,238,204,.35);background:conic-gradient(from -90deg,transparent 0deg,rgba(65,245,207,.22) 38deg,transparent 70deg,transparent 360deg);box-shadow:inset 0 0 16px rgba(72,238,204,.08);transform:translate(-50%,-50%);pointer-events:none}',
    '.osp-world-recommend .osp-radar:before,.osp-world-recommend .osp-radar:after{content:"";position:absolute;inset:19%;border-radius:50%;border:1px dashed rgba(78,246,211,.3)}',
    '.osp-world-recommend .osp-radar:after{inset:38%;border-style:solid}',
    '@media(max-width:700px){.osp-world-label{font-size:8px;top:4px;right:7px}.osp-world-compare .osp-lock{width:54px;height:54px}.osp-world-compare .osp-lock:after{font-size:13px}.osp-world-favorites .osp-thread{display:none}}'
  ].join('\n');
  document.head.appendChild(css);
  document.documentElement.classList.add('osp-six-worlds');

  const seen=new Set();
  try{
    const saved=JSON.parse(sessionStorage.getItem('ospulse:six-worlds-seen-v1')||'[]');
    if(Array.isArray(saved))saved.filter(x=>supported.includes(x)).forEach(x=>seen.add(x));
  }catch(e){}
  let current=null,revision=0,active=[],layers=[],doneTimer=0,pendingCardPage=null,pendingCardRevision=0;

  const saveSeen=page=>{
    seen.add(page);
    try{sessionStorage.setItem('ospulse:six-worlds-seen-v1',JSON.stringify([...seen]));}catch(e){}
  };
  const clean=()=>{
    if(doneTimer){clearTimeout(doneTimer);doneTimer=0;}
    for(const anim of active){try{anim.cancel();}catch(e){}}
    active=[];
    for(const entry of layers){
      entry.layer.remove();
      entry.host.classList.remove('osp-world-host');
    }
    layers=[];
  };
  const visible=el=>{
    if(!el||!el.isConnected)return false;
    const r=el.getBoundingClientRect();
    return r.width>2 && r.height>2 && r.bottom>0 && r.top<window.innerHeight+70;
  };
  const play=(el,frames,duration=700,delay=0,easing='cubic-bezier(.19,.72,.23,1)')=>{
    if(!visible(el))return null;
    const a=el.animate(frames,{duration,delay,easing,fill:'none'});
    active.push(a);
    a.onfinish=()=>{const index=active.indexOf(a);if(index>=0)active.splice(index,1);};
    return a;
  };
  const lift=(el,delay=0,axis='y',distance=18,duration=670)=>{
    const xy=axis==='x'?'translate3d('+distance+'px,0,0)':'translate3d(0,'+distance+'px,0)';
    play(el,[{opacity:.08,transform:xy},{opacity:1,transform:'translate3d(0,0,0)'}],duration,delay);
  };
  const group=(root,selector,count=5,spacing=65,axis='y',distance=19,duration=650)=>{
    if(!root)return 0;
    const els=[...root.querySelectorAll(selector)].filter(visible).slice(0,count);
    els.forEach((el,i)=>lift(el,i*spacing,axis,distance,duration));
    return els.length;
  };
  const layer=(host,type,label,color)=>{
    if(!host||!visible(host))return null;
    host.classList.add('osp-world-host');
    const fx=document.createElement('div');
    fx.className='osp-world-layer osp-world-'+type;
    fx.style.setProperty('--world-color',color);
    fx.setAttribute('aria-hidden','true');
    const title=document.createElement('span');
    title.className='osp-world-label';
    title.textContent=label;
    fx.appendChild(title);
    host.appendChild(fx);
    layers.push({host,layer:fx});
    play(title,[{opacity:0,transform:'translateY(8px)'},{opacity:.85,transform:'none',offset:.3},{opacity:0,transform:'translateY(-4px)'}],850);
    return fx;
  };
  const child=(host,cls)=>{
    const node=document.createElement('span');
    node.className=cls;
    host.appendChild(node);
    return node;
  };
  const short=(section)=>{
    const first=section.querySelector('.section-head')||section.querySelector('.gaming-hero')||section.firstElementChild;
    lift(first,0,'y',8,320);
  };
  const cardPreview=(page,first=true)=>{
    const section=document.getElementById(page);
    if(!section||!section.classList.contains('active')||!first)return false;
    const selector=page==='explore'?'#systemGrid>.system-card':page==='gaming'?'#gamingGrid>.game-card':page==='favorites'?'#favoritesGrid>.system-card':null;
    if(!selector)return false;
    return group(section,selector,4,42,'y',14,490)>0;
  };
  const playPage=(page,first)=>{
    const section=document.getElementById(page);if(!section||!section.classList.contains('active'))return;
    if(page==='home'){
      if(first&&current===null)return; // The real magnetic homepage assembly owns initial entry.
      const hero=section.querySelector('.hero-grid');
      play(hero,[{opacity:.74,transform:'translate3d(0,9px,0)'},{opacity:1,transform:'none'}],330);
      return;
    }
    if(!first){short(section);return;}
    const heading=section.querySelector('.section-head');
    if(heading)lift(heading,0,'y',13,550);
    switch(page){
      case 'explore':{
        const panel=section.querySelector('.search-panel');
        const fx=layer(panel,'explore','DISCOVERY / SCANNING','#56e9ff');
        if(fx){
          const scanner=child(fx,'osp-world-shimmer');
          play(scanner,[{transform:'translate3d(-110%,0,0)',opacity:0},{opacity:1,offset:.22},{transform:'translate3d(315%,0,0)',opacity:0}],780,0,'ease-in-out');
        }
        lift(panel,90,'y',12,570);
        lift(section.querySelector('.filter-panel'),175,'x',-15,600);
        lift(section.querySelector('.results-bar'),210,'y',10,510);
        break;
      }
      case 'gaming':{
        const hero=section.querySelector('.gaming-hero');
        const fx=layer(hero,'gaming','ARCADE / POWER ON','#b28aff');
        if(fx){
          const line=child(fx,'osp-power');
          play(line,[{transform:'scaleX(0)',opacity:0},{transform:'scaleX(.96)',opacity:1,offset:.58},{transform:'scaleX(1)',opacity:0}],800);
        }
        play(hero,[{opacity:.58,transform:'translate3d(0,12px,0) scale(.985)'},{opacity:1,transform:'none'}],760);
        group(section,'.gaming-controls .game-chip',7,48,'y',10,520);
        break;
      }
      case 'compare':{
        const builder=section.querySelector('.compare-builder');
        const fx=layer(builder,'compare','VS / SYNC','#66dfff');
        if(fx){
          const ring=child(fx,'osp-lock');
          play(ring,[{opacity:0,transform:'translate(-50%,-50%) scale(.4) rotate(-35deg)'},{opacity:1,transform:'translate(-50%,-50%) scale(1)',offset:.55},{opacity:0,transform:'translate(-50%,-50%) scale(1.2)'}],740,80);
        }
        const labels=[...section.querySelectorAll('.compare-builder>label')];
        lift(labels[0],80,'x',-35,680);
        lift(labels[1],80,'x',35,680);
        lift(section.querySelector('#compareRun'),280,'y',12,500);
        break;
      }
      case 'favorites':{
        const stats=section.querySelector('.dashboard-grid');
        const fx=layer(stats,'favorites','COLLECTION / SYNC','#ffa0d5');
        if(fx){
          const nodes=['osp-star s1','osp-star s2','osp-star s3','osp-thread t1','osp-thread t2'];
          nodes.forEach((cls,i)=>{
            const e=child(fx,cls);
            play(e,[{opacity:0,transform:'scale(.35)'},{opacity:1,transform:'scale(1)',offset:.55},{opacity:0}],700,i*70);
          });
        }
        group(section,'.dashboard-grid .dashboard-card',3,95,'y',22,680);
        break;
      }
      case 'recommend':{
        const card=section.querySelector('.quiz-card');
        const fx=layer(card,'recommend','OS MATCH / RADAR','#6ff3ce');
        if(fx){
          const radar=child(fx,'osp-radar');
          play(radar,[{opacity:0,transform:'translate(-50%,-50%) rotate(-80deg) scale(.7)'},{opacity:.78,transform:'translate(-50%,-50%) rotate(70deg) scale(1)',offset:.6},{opacity:0,transform:'translate(-50%,-50%) rotate(160deg) scale(1.12)'}],850);
        }
        lift(card,70,'y',14,620);
        group(section,'.quiz-grid label',4,75,'y',13,540);
        lift(section.querySelector('#quizRun'),320,'y',12,500);
        break;
      }
    }
  };
  const enter=(page,initial)=>{
    if(!supported.includes(page)||page===current)return;
    clean();
    const previous=current;
    current=page;
    revision++;
    const first=!seen.has(page);
    saveSeen(page);
    if(page==='home'&&initial)return;
    playPage(page,first);
    pendingCardPage=first&&['explore','gaming','favorites'].includes(page)?page:null;
    pendingCardRevision=revision;
    if(pendingCardPage&&cardPreview(page,true))pendingCardPage=null;
    doneTimer=setTimeout(()=>{clean();},first?1120:480);
  };

  window.addEventListener('ospulse:page-changed',e=>{
    enter(e.detail?.page,Boolean(e.detail?.initial));
  });
  window.addEventListener('ospulse:catalog-ready',()=>{
    if(pendingCardPage===current && pendingCardRevision===revision){
      if(cardPreview(current,true))pendingCardPage=null;
    }
  });
  document.addEventListener('visibilitychange',()=>{if(document.hidden)clean();});
  document.getElementById('recommend')?.querySelectorAll('.quiz-grid select').forEach(el=>{
    el.addEventListener('change',()=>{
      if(!document.getElementById('recommend')?.classList.contains('active'))return;
      const label=el.closest('label');
      play(label,[{transform:'scale(1)',opacity:1},{transform:'scale(1.025)',opacity:1,offset:.5},{transform:'scale(1)',opacity:1}],300);
    });
  });
  if(document.readyState!=='loading'){
    const activePage=document.querySelector('.page.active')?.id;
    if(activePage)enter(activePage,activePage==='home');
  }
})();
