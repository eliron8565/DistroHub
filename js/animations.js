/* OSPulse Motion System — expressive micro-interactions across the whole site. */
(() => {
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
  const style = document.createElement('style');
  style.id = 'ospulse-motion-style';
  style.textContent = `
    :root{--motion-ease:cubic-bezier(.22,1,.36,1);--motion-spring:cubic-bezier(.16,1,.3,1)}
    body.motion-ready .site-header{animation:motionHeader .75s var(--motion-ease) both}
    body.motion-ready .hero-copy>*{animation:motionRise .8s var(--motion-ease) both;animation-delay:calc(var(--i,0) * 80ms)}
    body.motion-ready .hero-orbit{animation:motionOrbitIn 1.2s var(--motion-ease) both}
    .page.active{animation:motionPageIn .48s var(--motion-ease) both}
    .page.active .section-head,.page.active .gaming-hero,.page.active .oslab-hero{animation:motionRise .55s var(--motion-ease) both}
    .system-card,.game-card,.family-card,.feature-strip>div,.dashboard-card,.oslab-card,.quiz-card,.search-panel,.compare-builder{transition:transform .38s var(--motion-spring),box-shadow .38s ease,border-color .38s ease,background .38s ease;will-change:transform}
    .system-card:hover,.game-card:hover,.family-card:hover,.dashboard-card:hover,.oslab-card:hover,.quiz-card:hover,.compare-builder:hover{transform:translateY(-7px);box-shadow:0 22px 55px rgba(0,0,0,.28);border-color:rgba(100,210,255,.28)}
    .system-card::before,.game-card::before,.family-card::before,.oslab-card::before{content:"";position:absolute;inset:0;border-radius:inherit;pointer-events:none;opacity:0;background:radial-gradient(circle at var(--mx,50%) var(--my,50%),rgba(88,180,255,.16),transparent 34%);transition:opacity .35s ease}
    .system-card,.game-card,.family-card,.oslab-card{position:relative;overflow:hidden}.system-card:hover::before,.game-card:hover::before,.family-card:hover::before,.oslab-card:hover::before{opacity:1}
    .system-grid .system-card,.gaming-grid .game-card{animation:cardIn .55s var(--motion-ease) both;animation-delay:calc(var(--card-index,0) * 45ms)}
    .family-grid .family-card{animation:cardIn .6s var(--motion-ease) both;animation-delay:calc(var(--card-index,0) * 70ms)}
    .btn,.icon-btn,.account-btn,.game-chip,.chip,.oslab-badge,.fav-btn{transition:transform .22s var(--motion-spring),box-shadow .22s ease,filter .22s ease}
    .btn:hover,.icon-btn:hover,.account-btn:hover,.game-chip:hover,.chip:hover,.oslab-badge:hover{transform:translateY(-2px)}
    .btn:active,.icon-btn:active,.account-btn:active,.game-chip:active,.chip:active,.oslab-badge:active,.fav-btn:active{transform:scale(.94)}
    .btn.ripple-active{overflow:hidden;position:relative}.motion-ripple{position:absolute;border-radius:50%;pointer-events:none;transform:scale(0);background:rgba(255,255,255,.3);animation:ripple .55s ease-out forwards}
    .brand-mark{transition:transform .55s var(--motion-spring),box-shadow .4s ease}.brand:hover .brand-mark{transform:rotate(-8deg) scale(1.08);box-shadow:0 0 28px rgba(70,210,255,.55)}
    .main-nav a{position:relative}.main-nav a::after{content:"";position:absolute;left:50%;bottom:-5px;width:0;height:2px;border-radius:99px;background:linear-gradient(90deg,#7c6cff,#22d9ff);transition:width .35s var(--motion-spring),left .35s var(--motion-spring)}.main-nav a:hover::after,.main-nav a.active::after{left:12%;width:76%}
    .system-logo,.game-logo,.dash-icon,.family-icon{transition:transform .45s var(--motion-spring),filter .45s ease}.system-card:hover .system-logo,.game-card:hover .game-logo,.dashboard-card:hover .dash-icon,.family-card:hover .family-icon{transform:rotate(-6deg) scale(1.1);filter:drop-shadow(0 0 12px rgba(80,210,255,.4))}
    .fav-btn.active{animation:heartPop .45s var(--motion-spring)}
    .modal.show .modal-card,.auth-modal.show .auth-card{animation:modalIn .45s var(--motion-spring)}
    .toast.show{animation:toastIn .42s var(--motion-spring)}
    .search-box:focus-within{box-shadow:0 0 0 3px rgba(77,196,255,.1),0 0 35px rgba(77,196,255,.1);transform:translateY(-1px);transition:.3s ease}
    .hero-orbit .core{animation:corePulse 3s ease-in-out infinite}.hero-orbit .orbit{animation:spinOrbit 18s linear infinite}.hero-orbit .orbit-2{animation-duration:12s;animation-direction:reverse}.hero-orbit .orbit-node{animation:nodeFloat 3s ease-in-out infinite}.hero-orbit .node-2{animation-delay:-1s}.hero-orbit .node-3{animation-delay:-2s}
    .oslab-meter i{animation:meterGrow 1s var(--motion-ease) both}
    .eyebrow .pulse-dot{animation:dotPulse 1.8s ease-in-out infinite}
    @keyframes motionHeader{from{opacity:0;transform:translateY(-16px)}to{opacity:1;transform:none}}
    @keyframes motionRise{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}
    @keyframes motionPageIn{from{opacity:.01;transform:translateY(10px)}to{opacity:1;transform:none}}
    @keyframes motionOrbitIn{from{opacity:0;transform:scale(.75) rotate(-12deg)}to{opacity:1;transform:scale(1) rotate(0)}}
    @keyframes cardIn{from{opacity:0;transform:translateY(22px) scale(.985)}to{opacity:1;transform:none}}
    @keyframes ripple{to{transform:scale(4);opacity:0}}
    @keyframes heartPop{0%{transform:scale(.7)}55%{transform:scale(1.25)}100%{transform:scale(1)}}
    @keyframes modalIn{from{opacity:0;transform:translateY(24px) scale(.96)}to{opacity:1;transform:none}}
    @keyframes toastIn{from{opacity:0;transform:translateY(18px) scale(.96)}to{opacity:1;transform:none}}
    @keyframes corePulse{0%,100%{box-shadow:0 0 0 0 rgba(55,210,255,.05),0 0 28px rgba(90,100,255,.18)}50%{box-shadow:0 0 0 12px rgba(55,210,255,.03),0 0 55px rgba(90,100,255,.35)}}
    @keyframes spinOrbit{to{transform:rotate(360deg)}}
    @keyframes nodeFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
    @keyframes meterGrow{from{width:0!important}}
    @keyframes dotPulse{0%,100%{box-shadow:0 0 0 0 rgba(34,217,255,.35)}50%{box-shadow:0 0 0 7px rgba(34,217,255,0)}}
    @media (max-width:700px){.system-card:hover,.game-card:hover,.family-card:hover,.dashboard-card:hover,.oslab-card:hover,.quiz-card:hover,.compare-builder:hover{transform:translateY(-3px)}}
    @media (prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.01ms!important;animation-iteration-count:1!important;scroll-behavior:auto!important;transition-duration:.01ms!important}.system-card:hover,.game-card:hover,.family-card:hover,.dashboard-card:hover,.oslab-card:hover{transform:none}}
  `;
  document.head.appendChild(style);
  const ready=()=>{
    if(reduce)return;
    document.body.classList.add('motion-ready');
    document.querySelectorAll('.hero-copy>*').forEach((el,i)=>el.style.setProperty('--i',i));
    const stagger=(selector)=>document.querySelectorAll(selector).forEach((el,i)=>el.style.setProperty('--card-index',Math.min(i,14)));
    stagger('.system-grid .system-card');stagger('.gaming-grid .game-card');stagger('.family-grid .family-card');
    document.addEventListener('pointermove',e=>{const card=e.target.closest?.('.system-card,.game-card,.family-card,.oslab-card');if(!card)return;const r=card.getBoundingClientRect();card.style.setProperty('--mx',`${((e.clientX-r.left)/r.width)*100}%`);card.style.setProperty('--my',`${((e.clientY-r.top)/r.height)*100}%`);},{passive:true});
    document.addEventListener('click',e=>{const b=e.target.closest?.('.btn,.icon-btn,.account-btn,.game-chip,.chip,.oslab-badge');if(!b)return;const r=b.getBoundingClientRect(),size=Math.max(r.width,r.height)*1.4,ring=document.createElement('span');ring.className='motion-ripple';ring.style.width=ring.style.height=`${size}px`;ring.style.left=`${e.clientX-r.left-size/2}px`;ring.style.top=`${e.clientY-r.top-size/2}px`;b.appendChild(ring);ring.addEventListener('animationend',()=>ring.remove(),{once:true});},{passive:true});
    const observer=new MutationObserver(()=>{stagger('.system-grid .system-card');stagger('.gaming-grid .game-card');});
    observer.observe(document.body,{childList:true,subtree:true});
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready,{once:true});else ready();
})();
