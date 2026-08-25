/* OSNova visual rebrand. The repository remains DistroHub; the product name shown to visitors is OSNova. */
(() => {
  const apply=()=>{
    const name='OSNova';
    document.title='OSNova — Discover your next operating system';
    const meta=document.querySelector('meta[name="description"]');
    if(meta) meta.content='OSNova — discover open and alternative operating systems. Linux, Gaming OS, BSD, Mobile, Retro, Media and experimental platforms.';

    // The original brand is made from nested spans, so changing a direct text node
    // does not work. Replace the visible brand content explicitly.
    document.querySelectorAll('.brand').forEach(brand=>{
      brand.setAttribute('aria-label',`${name} home`);
      brand.innerHTML='<span class="brand-mark">O</span><span>OS<span>Nova</span></span>';
    });

    document.querySelectorAll('.brand-mark').forEach(el=>{
      el.textContent='O';
      el.setAttribute('aria-hidden','true');
    });

    // Keep any visible product-name text in common UI locations consistent.
    document.querySelectorAll('[data-brand-name]').forEach(el=>{el.textContent=name;});
  };

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',apply,{once:true});
  }else{
    apply();
  }
})();
