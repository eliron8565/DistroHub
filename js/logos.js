/* OSPulse OS logo registry. Prefer real brand SVGs, with domain-based fallback handled by logo-resilience.js. */
(() => {
  const slugs = {
    'ubuntu':'ubuntu','deepin os':'deepin','deepin':'deepin','linux mint':'linuxmint','elementary os':'elementary','zorin os':'zorin','pop!_os':'popos','pop os':'popos','fedora':'fedora','manjaro':'manjaro','debian':'debian','opensuse':'opensuse','arch linux':'archlinux','linux lite':'linuxlite','centos':'centos','kali linux':'kalilinux','tails':'tails','qubes os':'qubesos','nixos':'nixos','alpine linux':'alpinelinux','mx linux':'mxlinux','rocky linux':'rockylinux','almalinux':'almalinux','void linux':'voidlinux','puppy linux':'puppylinux','ubuntu studio':'ubuntustudio','kubuntu':'kubuntu','lubuntu':'lubuntu','raspberry pi os':'raspberrypi','parrot os':'parrot','solus':'solus','mageia':'mageia','pclinuxos':'pclinuxos','openmandriva lx':'openmandriva','kaos':'kaos','pardus':'pardus','artix linux':'artixlinux','bodhi linux':'bodhilinux','antix':'antix','q4os':'q4os','sparkylinux':'sparkylinux','peppermint os':'peppermint','endeavouros':'endeavouros','garuda linux':'garudalinux','cachyos':'cachyos','nobara linux':'nobara','bazzite':'bazzite','chimeraos':'chimeraos','pikaos':'pikaos','batocera linux':'batocera','recalbox':'recalbox','lakka':'lakka','retropie':'retropie','winesapos':'winesapOS','freedos':'freedos','haiku':'haiku','reactos':'reactos','serenityos':'serenityos','openindiana':'openindiana','illumos':'illumos','freebsd':'freebsd','openbsd':'openbsd','netbsd':'netbsd','dragonfly bsd':'dragonflybsd','ghostbsd':'ghostbsd','midnightbsd':'midnightbsd','truenas core':'truenas','lineageos':'lineageos','postmarketos':'postmarketos','ubuntu touch':'ubuntutouch','grapheneos':'grapheneos','/e/os':'e','libreelec':'libreelec','coreelec':'coreelec','steamos':'steam','ultramarine linux':'ultramarine','vanilla os':'vanillaos','endless os':'endless','pureos':'pureos','trisquel gnu/linux':'trisquel','trisquel':'trisquel','guix system':'guix','gentoo':'gentoo','crux':'crux','openwrt':'openwrt','easyos':'easyos','tiny core linux':'tinycore','slax':'slax','slitaz':'slitaz','4mlinux':'4mlinux','rhino linux':'rhinolinux','porteux':'porteux','spirallinux':'spirallinux'
  };
  const aliases = {'open suse':'opensuse','opensuse leap':'opensuse','opensuse tumbleweed':'opensuse','kali':'kalilinux','mint':'linuxmint','rocky':'rockylinux','alma linux':'almalinux','arch':'archlinux','endeavour os':'endeavouros','garuda':'garudalinux','cachy os':'cachyos','nobara':'nobara','chimera os':'chimeraos','pika os':'pikaos','batocera':'batocera','retro pie':'retropie','free dos':'freedos','open bsd':'openbsd','net bsd':'netbsd','dragonflybsd':'dragonflybsd','ghost bsd':'ghostbsd','midnight bsd':'midnightbsd','true nas core':'truenas','graphene os':'grapheneos','lineage os':'lineageos','postmarket os':'postmarketos','core elec':'coreelec','libre elec':'libreelec','ultramarine':'ultramarine','vanillaos':'vanillaos'};
  const key = name => String(name || '').trim().toLowerCase().replace(/[®™]/g,'').replace(/\s+/g,' ');
  const logoUrl = name => { const k=key(name); const slug=slugs[k]||aliases[k]; return slug ? `https://cdn.simpleicons.org/${slug}` : ''; };
  const faviconUrl = system => {
    try { const u=new URL(system?.website||system?.homepage||''); return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(u.hostname)}&sz=128`; } catch { return ''; }
  };
  if(typeof DistroHubApp !== 'undefined'){
    const originalNormalize=DistroHubApp.prototype.normalize;
    DistroHubApp.prototype.normalize=function(system,fallbackType='Linux'){
      const result=originalNormalize.call(this,system,fallbackType);
      if(result&&!result.logo)result.logo=logoUrl(result.name)||faviconUrl(result);
      return result;
    };
    DistroHubApp.prototype.logoFor=function(system){return logoUrl(system?.name)||faviconUrl(system)||'fa-solid fa-microchip';};
  }
  const boot=()=>{
    if(document.querySelector('script[data-logo-resilience]'))return;
    const s=document.createElement('script');s.src='js/logo-resilience.js';s.dataset.logoResilience='1';document.head.appendChild(s);
    if(document.querySelector('script[data-linux-expansion]'))return;
    const e=document.createElement('script');e.src='js/linux-expansion.js';e.dataset.linuxExpansion='1';document.head.appendChild(e);
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
