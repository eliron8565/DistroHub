/* OSNova visual rebrand. The repository remains DistroHub; the product name shown to visitors is OSNova. */
(() => {
  const apply=()=>{
    document.title='OSNova — Discover your next operating system';
    const meta=document.querySelector('meta[name="description"]');
    if(meta)meta.content='OSNova — discover open and alternative operating systems. Linux, Gaming OS, BSD, Mobile, Retro, Media and experimental platforms.';
    const brand=document.querySelector('.brand');
    if(brand){brand.setAttribute('aria-label','OSNova home');const text=[...brand.childNodes].find(n=>n.nodeType===3);if(text)text.textContent='OSNova';}
    document.querySelectorAll('.brand-mark').forEach(el=>el.textContent='O');
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});else apply();
})();
