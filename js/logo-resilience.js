/* OSPulse resilient OS imagery: every card gets an image or a polished fallback. */
(() => {
  'use strict';
  const domainOf = url => { try { return new URL(url, location.href).hostname.replace(/^www\./,''); } catch { return ''; } };
  const findSystem = name => { const n=String(name||'').trim().toLowerCase(); return [...(window.app?.systems||[]),...(window.app?.gaming||[])].find(x=>String(x.name||'').trim().toLowerCase()===n); };
  const fallbackSvg = name => {
    const text=String(name||'OS').trim().split(/\s+/).map(x=>x[0]).join('').slice(0,2).toUpperCase()||'OS';
    const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#19d9ff"/><stop offset="1" stop-color="#765cff"/></linearGradient></defs><rect x="4" y="4" width="120" height="120" rx="28" fill="#0b1324" stroke="url(#g)" stroke-width="4"/><circle cx="64" cy="52" r="25" fill="url(#g)" opacity=".18"/><text x="64" y="72" text-anchor="middle" font-family="Arial,sans-serif" font-size="34" font-weight="700" fill="#f5f8ff">${text}</text><text x="64" y="101" text-anchor="middle" font-family="Arial,sans-serif" font-size="9" font-weight="700" letter-spacing="2" fill="#55e8ff">OSPULSE</text></svg>`;
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  };
  const repair = img => {
    if(!img || img.dataset.logoRepair==='1') return;
    const name=img.dataset.osName||img.alt?.replace(/\s+logo$/i,'')||''; if(!name) return;
    img.dataset.logoRepair='1'; const s=findSystem(name); const domain=domainOf(s?.website||s?.homepage||'');
    const list=[]; if(img.src)list.push(img.src); if(domain){list.push(`https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=128`);list.push(`https://icons.duckduckgo.com/ip3/${domain}.ico`);} list.push(fallbackSvg(name));
    let i=0; img.onerror=()=>{i++;img.onerror=null;if(i<list.length){img.src=list[i];img.onerror=()=>{i++;img.src=list[i]||fallbackSvg(name)};}else img.src=fallbackSvg(name);};
    if(!img.complete||img.naturalWidth===0)img.src=list[0]||fallbackSvg(name); img.style.display='';
  };
  const scan=root=>{root.querySelectorAll?.('.system-card').forEach(card=>{const name=card.querySelector('h3')?.textContent?.trim();const img=card.querySelector('.system-logo img');if(img&&name){img.dataset.osName=name;img.alt=`${name} logo`;repair(img);}});root.querySelectorAll?.('.game-card').forEach(card=>{const name=card.querySelector('h3')?.textContent?.trim();const img=card.querySelector('.game-logo img');if(img&&name){img.dataset.osName=name;img.alt=`${name} logo`;repair(img);}});root.querySelectorAll?.('.modal-logo img').forEach(repair);};
  const start=()=>{scan(document);new MutationObserver(ms=>ms.forEach(m=>m.addedNodes.forEach(n=>n.nodeType===1&&scan(n)))).observe(document.body,{childList:true,subtree:true});};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
