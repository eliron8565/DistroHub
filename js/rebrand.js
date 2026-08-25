/* OSPulse visual rebrand. The repository remains DistroHub; the product name shown to visitors is OSPulse. */
(()=>{
  const apply=()=>{
    const name='OSPulse';
    document.title='OSPulse — Discover your next operating system';
    const meta=document.querySelector('meta[name="description"]');
    if(meta)meta.content='OSPulse — discover open and alternative operating systems. Linux, Gaming OS, BSD, Mobile, Retro, Media and experimental platforms.';
    document.querySelectorAll('.brand').forEach(brand=>{brand.setAttribute('aria-label',`${name} home`);brand.innerHTML='<span class="brand-mark">O</span><span>OS<span>Pulse</span></span>'});
    document.querySelectorAll('.brand-mark').forEach(el=>{el.textContent='O';el.setAttribute('aria-hidden','true')});
    document.querySelectorAll('[data-brand-name]').forEach(el=>{el.textContent=name});
    document.querySelectorAll('body *').forEach(el=>{if(el.children.length===0&&['OSNova','DistroHub'].includes(el.textContent.trim()))el.textContent=name});
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});else apply();
  const load=()=>{if(document.querySelector('script[data-oslab-random]'))return;const s=document.createElement('script');s.src='js/oslab-random.js';s.dataset.oslabRandom='1';s.defer=true;document.body.appendChild(s)};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',load,{once:true});else load();
})();
