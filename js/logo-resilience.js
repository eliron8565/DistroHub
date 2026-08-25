/* OSPulse resilient OS imagery: every card gets a visible logo image, even when a CDN asset fails. */
(() => {
  'use strict';
  const domainOf = url => { try { return new URL(url, location.href).hostname.replace(/^www\./,''); } catch { return ''; } };
  const findSystem = name => { const n=String(name||'').trim().toLowerCase(); return [...(window.app?.systems||[]),...(window.app?.gaming||[])].find(x=>String(x.name||'').trim().toLowerCase()===n); };
  const fallbackSvg = name => {
    const text=String(name||'OS').trim().split(/\s+/).map(x=>x[0]).join('').slice(0,2).toUpperCase()||'OS';
    const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#19d9ff"/><stop offset="1" stop-color="#765cff"/></linearGradient></defs><rect x="4" y="4" width="120" height="120" rx="28" fill="#0b1324" stroke="url(#g)" stroke-width="4"/><circle cx="64" cy="52" r="25" fill="url(#g)" opacity=".18"/><text x="64" y="72" text-anchor="middle" font-family="Arial,sans-serif" font-size="34" font-weight="700" fill="#f5f8ff">${text}</text><text x="64" y="101" text-anchor="middle" font-family="Arial,sans-serif" font-size="9" font-weight="700" letter-spacing="2" fill="#55e8ff">OSPULSE</text></svg>`;
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  };
  const candidates = (name, current) => {
    const s=findSystem(name); const domain=domainOf(s?.website||s?.homepage||'');
    const list=[]; if(current)list.push(current);
    if(domain){list.push(`https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=128`);list.push(`https://icons.duckduckgo.com/ip3/${domain}.ico`);}
    list.push(fallbackSvg(name)); return [...new Set(list.filter(Boolean))];
  };
  const repair = img => {
    if(!img)return; const name=img.dataset.osName||img.alt?.replace(/\s+logo$/i,'')||''; if(!name)return;
    const list=candidates(name,img.getAttribute('src')); let i=0;
    img.dataset.logoRepair='1'; img.alt=`${name} logo`; img.style.display='block';
    const next=()=>{i++; if(i<list.length){img.src=list[i];}else{img.src=fallbackSvg(name);}};
    img.onerror=next;
    if(!img.getAttribute('src')||img.naturalWidth===0)img.src=list[0];
  };
  const ensureImage = (container,name,current) => {
    if(!container||!name)return;
    let img=container.querySelector('img');
    if(!img){img=document.createElement('img');container.replaceChildren(img);}
    img.dataset.osName=name; img.alt=`${name} logo`; img.loading='lazy'; img.decoding='async';
    if(current&&!img.getAttribute('src'))img.src=current;
    repair(img);
  };
  const scan=root=>{
    root.querySelectorAll?.('.system-card').forEach(card=>{const name=card.querySelector('h3')?.textContent?.trim();const box=card.querySelector('.system-logo');const s=findSystem(name);if(box&&name)ensureImage(box,name,s?.logo||'');});
    root.querySelectorAll?.('.game-card').forEach(card=>{const name=card.querySelector('h3')?.textContent?.trim();const box=card.querySelector('.game-logo');const s=findSystem(name);if(box&&name)ensureImage(box,name,s?.logo||'');});
    root.querySelectorAll?.('.modal-logo').forEach(box=>{const s=findSystem(box.closest('.system-modal')?.querySelector('h2')?.textContent?.trim());if(s)ensureImage(box,s.name,s.logo||'');});
  };
  const start=()=>{scan(document);new MutationObserver(ms=>ms.forEach(m=>m.addedNodes.forEach(n=>n.nodeType===1&&scan(n)))).observe(document.body,{childList:true,subtree:true});};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
