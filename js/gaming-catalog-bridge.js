(function(){
  const EXTRA='data/gaming-os-extra.json';
  const sleep=(ms)=>new Promise(r=>setTimeout(r,ms));
  async function load(){
    for(let i=0;i<120;i++){
      if(window.app && Array.isArray(window.app.gaming) && Array.isArray(window.app.systems)) break;
      await sleep(100);
    }
    if(!window.app || !Array.isArray(window.app.gaming) || !Array.isArray(window.app.systems)) return;
    try{
      const r=await fetch(EXTRA,{cache:'no-store'});
      if(r.ok){
        const extra=await r.json();
        const byId=new Map(window.app.gaming.map(x=>[x.id,x]));
        extra.forEach(x=>{if(x&&x.id&&!byId.has(x.id)) byId.set(x.id,x)});
        window.app.gaming=[...byId.values()];
      }
    }catch(e){console.warn('[OSPulse] Extra gaming catalog unavailable',e)}

    // Gaming systems are also discoverable from Explore. Keep the dedicated
    // Gaming page and the global discovery database in sync without duplicating entries.
    const byId=new Map(window.app.systems.map(x=>[x.id,x]));
    window.app.gaming.forEach(x=>{
      if(!x || !x.id) return;
      const normalized={...x,type:'Gaming',category:Array.isArray(x.gamingTags)?x.gamingTags:['Gaming'],architecture:Array.isArray(x.architecture)?x.architecture:[],useCases:Array.isArray(x.gamingTags)?x.gamingTags:[],description:String(x.description||''),license:String(x.license||'Open source'),openSource:x.openSource!==false};
      if(!byId.has(normalized.id)) byId.set(normalized.id,normalized);
    });
    window.app.systems=[...byId.values()];
    window.app.filtered=[...window.app.systems];
    if(typeof window.app.setText==='function') window.app.setText('statTotal',`${window.app.systems.length}+`);
    if(typeof window.app.setText==='function') window.app.setText('gamingCount',window.app.gaming.length);
    if(typeof window.app.renderAll==='function') window.app.renderAll();
    else if(typeof window.app.applyFilters==='function') window.app.applyFilters();
    console.info(`[OSPulse] Gaming bridge loaded ${window.app.gaming.length} gaming systems into discovery.`);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',load,{once:true}); else load();
})();
