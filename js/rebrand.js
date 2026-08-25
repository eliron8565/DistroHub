/* OSPulse visual rebrand. The repository remains DistroHub; the product name shown to visitors is OSPulse. */
(() => {
  const apply=()=>{
    const name='OSPulse';
    document.title='OSPulse — Discover your next operating system';
    const meta=document.querySelector('meta[name="description"]');
    if(meta) meta.content='OSPulse — discover open and alternative operating systems. Linux, Gaming OS, BSD, Mobile, Retro, Media and experimental platforms.';

    // The original brand is made from nested spans, so replace the visible brand explicitly.
    document.querySelectorAll('.brand').forEach(brand=>{
      brand.setAttribute('aria-label',`${name} home`);
      brand.innerHTML='<span class="brand-mark">O</span><span>OS<span>Pulse</span></span>';
    });

    document.querySelectorAll('.brand-mark').forEach(el=>{
      el.textContent='O';
      el.setAttribute('aria-hidden','true');
    });

    document.querySelectorAll('[data-brand-name]').forEach(el=>{el.textContent=name;});

    // Replace stale visible product-name text without touching repository/internal identifiers.
    document.querySelectorAll('body *').forEach(el=>{
      if(el.children.length===0 && el.textContent.trim()==='OSNova') el.textContent=name;
      if(el.children.length===0 && el.textContent.trim()==='DistroHub') el.textContent=name;
    });
  };

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',apply,{once:true});
  }else{
    apply();
  }
})();
