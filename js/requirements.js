/* OSPulse OS Requirements Database
 * Values are practical guidance, not a hardware compatibility guarantee.
 * Every catalog entry receives a requirements profile; named systems get curated values,
 * while category-based fallbacks keep the UI complete for newer/less common systems.
 */
(() => {
  'use strict';

  const profiles = {
    'Ubuntu': { minRam:'4 GB', recommendedRam:'8 GB', minCpu:'2 GHz dual-core', recommendedCpu:'2 GHz quad-core', storage:'25 GB', gpu:'3D acceleration; 1 GB VRAM recommended', arch:'x86_64 / ARM64', notes:'Desktop experience is smoother with 8 GB RAM.' },
    'Ubuntu Studio': { minRam:'4 GB', recommendedRam:'8 GB', minCpu:'2 GHz dual-core', recommendedCpu:'2.5 GHz quad-core', storage:'30 GB+', gpu:'1 GB VRAM recommended for creative apps', arch:'x86_64 / ARM64', notes:'Creative workloads benefit from more RAM and fast SSD storage.' },
    'Kubuntu': { minRam:'4 GB', recommendedRam:'8 GB', minCpu:'2 GHz dual-core', recommendedCpu:'2.5 GHz quad-core', storage:'25 GB', gpu:'OpenGL 2.0+ / 1 GB VRAM recommended', arch:'x86_64 / ARM64', notes:'KDE Plasma is comfortable with 8 GB RAM.' },
    'Lubuntu': { minRam:'2 GB', recommendedRam:'4 GB', minCpu:'1 GHz dual-core', recommendedCpu:'2 GHz dual-core', storage:'20 GB', gpu:'Basic OpenGL graphics', arch:'x86_64 / ARM64', notes:'A strong option for older PCs.' },
    'Linux Mint': { minRam:'2 GB', recommendedRam:'4–8 GB', minCpu:'2 GHz dual-core', recommendedCpu:'2 GHz quad-core', storage:'20 GB', gpu:'1 GB VRAM recommended', arch:'x86_64', notes:'Cinnamon benefits from more RAM; Xfce is lighter.' },
    'Fedora': { minRam:'4 GB', recommendedRam:'8 GB', minCpu:'2 GHz dual-core', recommendedCpu:'2 GHz quad-core', storage:'20 GB', gpu:'3D acceleration recommended', arch:'x86_64 / ARM64', notes:'GNOME is smoother with 8 GB RAM or more.' },
    'Debian': { minRam:'1 GB', recommendedRam:'4 GB', minCpu:'1 GHz', recommendedCpu:'2 GHz dual-core', storage:'10 GB+', gpu:'Basic graphics; depends on desktop', arch:'x86_64 / ARM64 / many more', notes:'Hardware needs vary significantly by desktop environment.' },
    'Arch Linux': { minRam:'512 MB', recommendedRam:'4 GB', minCpu:'x86_64 compatible CPU', recommendedCpu:'2 GHz dual-core', storage:'2 GB+ base; more for desktop', gpu:'Depends on desktop/driver', arch:'x86_64', notes:'The base install is tiny; a full desktop needs substantially more.' },
    'Manjaro': { minRam:'2 GB', recommendedRam:'4–8 GB', minCpu:'1 GHz dual-core', recommendedCpu:'2 GHz quad-core', storage:'30 GB', gpu:'Modern 3D acceleration recommended', arch:'x86_64 / ARM64', notes:'Desktop edition changes the practical requirements.' },
    'Pop!_OS': { minRam:'4 GB', recommendedRam:'8 GB', minCpu:'64-bit dual-core', recommendedCpu:'64-bit quad-core', storage:'16 GB', gpu:'GPU with supported drivers; NVIDIA edition available', arch:'x86_64', notes:'Modern hardware is recommended for the best desktop experience.' },
    'Zorin OS': { minRam:'2 GB', recommendedRam:'4–8 GB', minCpu:'1 GHz dual-core 64-bit', recommendedCpu:'2 GHz dual-core', storage:'15 GB', gpu:'800×600 minimum display; 3D recommended', arch:'x86_64', notes:'The desktop edition affects resource usage.' },
    'Nobara Linux': { minRam:'4 GB', recommendedRam:'8–16 GB', minCpu:'64-bit dual-core', recommendedCpu:'4-core modern CPU', storage:'30 GB+', gpu:'Vulkan-capable GPU recommended', arch:'x86_64', notes:'For modern gaming, 16 GB RAM and a dedicated GPU are strongly recommended.' },
    'Bazzite': { minRam:'8 GB', recommendedRam:'16 GB', minCpu:'64-bit dual-core', recommendedCpu:'4-core modern CPU', storage:'50 GB+', gpu:'Modern Vulkan-capable AMD/Intel/NVIDIA GPU', arch:'x86_64', notes:'Hardware-specific images exist for some handhelds and GPUs.' },
    'Garuda Linux': { minRam:'4 GB', recommendedRam:'8–16 GB', minCpu:'64-bit dual-core', recommendedCpu:'4-core modern CPU', storage:'30 GB+', gpu:'Modern 3D GPU recommended', arch:'x86_64', notes:'Heavy themed editions use more RAM and GPU resources.' },
    'CachyOS': { minRam:'2 GB', recommendedRam:'8 GB', minCpu:'64-bit CPU', recommendedCpu:'4-core modern CPU', storage:'25 GB+', gpu:'Modern 3D GPU recommended', arch:'x86_64', notes:'Performance-focused builds benefit from modern hardware.' },
    'NixOS': { minRam:'2 GB', recommendedRam:'8 GB', minCpu:'64-bit CPU', recommendedCpu:'4-core modern CPU', storage:'20 GB+', gpu:'Depends on desktop', arch:'x86_64 / ARM64', notes:'Desktop configurations vary widely.' },
    'Alpine Linux': { minRam:'128 MB', recommendedRam:'1–2 GB', minCpu:'x86_64/ARM-compatible CPU', recommendedCpu:'1 GHz+', storage:'130 MB+ base', gpu:'Not required for server use', arch:'x86_64 / ARM / many', notes:'Desktop environments require significantly more resources.' },
    'Void Linux': { minRam:'96 MB', recommendedRam:'2–4 GB', minCpu:'64-bit CPU', recommendedCpu:'2-core+', storage:'700 MB+ base', gpu:'Depends on desktop', arch:'x86_64 / ARM / others', notes:'A lightweight desktop can run on modest hardware.' },
    'MX Linux': { minRam:'1 GB', recommendedRam:'2–4 GB', minCpu:'i686-compatible', recommendedCpu:'2 GHz dual-core', storage:'8 GB+', gpu:'Basic graphics', arch:'x86_64 / supported legacy architectures', notes:'Xfce edition is especially suitable for older hardware.' },
    'Puppy Linux': { minRam:'512 MB', recommendedRam:'1–2 GB', minCpu:'Pentium-class or newer', recommendedCpu:'1 GHz+', storage:'8 GB+ recommended', gpu:'Basic graphics', arch:'Depends on Puppy edition', notes:'Can run from USB and RAM on very old systems.' },
    'Tails': { minRam:'2 GB', recommendedRam:'4 GB', minCpu:'64-bit x86', recommendedCpu:'2-core+', storage:'8 GB USB', gpu:'Supported x86 graphics', arch:'x86_64', notes:'Use a compatible USB drive and check current official hardware guidance.' },
    'Qubes OS': { minRam:'6 GB', recommendedRam:'16 GB+', minCpu:'64-bit Intel/AMD with virtualization', recommendedCpu:'4-core CPU with VT-x/AMD-V', storage:'32 GB+', gpu:'Integrated or dedicated; virtualization support matters more', arch:'x86_64', notes:'Qubes is demanding; 16 GB RAM is strongly recommended.' },
    'Kali Linux': { minRam:'2 GB', recommendedRam:'4 GB+', minCpu:'64-bit dual-core', recommendedCpu:'2 GHz dual-core+', storage:'20 GB+', gpu:'Basic desktop graphics', arch:'x86_64 / ARM64 / ARM', notes:'Requirements depend on the desktop and tools installed.' },
    'Rocky Linux': { minRam:'2 GB', recommendedRam:'4 GB+', minCpu:'64-bit CPU', recommendedCpu:'2-core+', storage:'20 GB+', gpu:'Basic server graphics', arch:'x86_64 / ARM64', notes:'Server installations can run with less than a full desktop.' },
    'AlmaLinux': { minRam:'1.5 GB', recommendedRam:'4 GB+', minCpu:'64-bit CPU', recommendedCpu:'2-core+', storage:'20 GB+', gpu:'Basic server graphics', arch:'x86_64 / ARM64', notes:'Server installations have lower requirements than GUI desktops.' },
    'FreeBSD': { minRam:'1 GB', recommendedRam:'4 GB', minCpu:'64-bit compatible CPU', recommendedCpu:'2-core+', storage:'10 GB+', gpu:'Depends on desktop', arch:'amd64 / arm64 / others', notes:'Requirements vary by installation and desktop environment.' },
    'OpenBSD': { minRam:'512 MB', recommendedRam:'2 GB', minCpu:'64-bit compatible CPU', recommendedCpu:'2-core+', storage:'4 GB+', gpu:'Basic graphics', arch:'amd64 / arm64 / others', notes:'Excellent fit for servers and technical systems.' },
    'NetBSD': { minRam:'256 MB', recommendedRam:'2 GB', minCpu:'Supported architecture CPU', recommendedCpu:'2-core+', storage:'4 GB+', gpu:'Depends on desktop', arch:'Many architectures', notes:'Hardware support is one of NetBSD’s strengths.' },
    'Haiku': { minRam:'1 GB', recommendedRam:'2–4 GB', minCpu:'x86_64 CPU', recommendedCpu:'Dual-core+', storage:'4 GB+', gpu:'Supported 2D/3D hardware', arch:'x86_64', notes:'Check current hardware compatibility for graphics and Wi-Fi.' },
    'FreeDOS': { minRam:'640 KB', recommendedRam:'16 MB+', minCpu:'8086-compatible', recommendedCpu:'486+', storage:'10 MB+', gpu:'VGA-compatible', arch:'x86', notes:'Designed for very old x86 hardware and DOS software.' },
    'LineageOS': { minRam:'2 GB', recommendedRam:'4 GB+', minCpu:'Device-specific ARM CPU', recommendedCpu:'Modern ARM64 SoC', storage:'16 GB+', gpu:'Device-specific', arch:'ARM / ARM64', notes:'Compatibility depends on the exact supported phone/tablet model.' },
    'postmarketOS': { minRam:'512 MB', recommendedRam:'2 GB+', minCpu:'Device-specific ARM CPU', recommendedCpu:'Modern ARM64 SoC', storage:'8 GB+', gpu:'Device-specific', arch:'ARM / ARM64', notes:'Phone model support is more important than generic PC requirements.' },
    'Ubuntu Touch': { minRam:'2 GB', recommendedRam:'3–4 GB+', minCpu:'Supported ARM device', recommendedCpu:'Modern ARM64 SoC', storage:'8 GB+', gpu:'Device-specific', arch:'ARM / ARM64', notes:'Only supported mobile devices can be installed.' },
    'GrapheneOS': { minRam:'4 GB', recommendedRam:'6–8 GB', minCpu:'Supported Google Pixel SoC', recommendedCpu:'Supported Pixel Tensor/ARM64 SoC', storage:'64 GB+', gpu:'Device-specific', arch:'ARM64', notes:'Official support is limited to compatible Pixel devices.' },
    'LibreELEC': { minRam:'1 GB', recommendedRam:'2 GB', minCpu:'Dual-core ARM/x86', recommendedCpu:'2-core+', storage:'8 GB', gpu:'Hardware video decode recommended', arch:'x86_64 / ARM64 / device-specific', notes:'Designed for Kodi media-center use.' },
    'CoreELEC': { minRam:'1 GB', recommendedRam:'2 GB', minCpu:'Supported ARM SoC', recommendedCpu:'Modern Amlogic SoC', storage:'8 GB', gpu:'Hardware video decode', arch:'ARM / ARM64', notes:'Primarily targets compatible Amlogic media hardware.' },
    'Batocera': { minRam:'2 GB', recommendedRam:'4 GB+', minCpu:'64-bit dual-core', recommendedCpu:'4-core+', storage:'16 GB+', gpu:'Modern GPU for newer emulation', arch:'x86_64 / ARM / device-specific', notes:'Higher-end emulation needs a stronger CPU/GPU.' },
    'Recalbox': { minRam:'1 GB', recommendedRam:'2 GB+', minCpu:'Device-specific', recommendedCpu:'Modern quad-core', storage:'8 GB+', gpu:'Device-specific', arch:'x86_64 / ARM', notes:'Requirements vary by target hardware and emulator.' },
    'Lakka': { minRam:'1 GB', recommendedRam:'2 GB+', minCpu:'Device-specific', recommendedCpu:'Modern quad-core', storage:'8 GB+', gpu:'Hardware-dependent', arch:'x86_64 / ARM', notes:'Emulation performance depends heavily on the platform.' }
  };

  const fallback = (s) => {
    const type = String(s?.type || '').toLowerCase();
    const cats = Array.isArray(s?.category) ? s.category.map(x => String(x).toLowerCase()) : [];
    if(type==='gaming' || cats.includes('gaming')) return {minRam:'4 GB',recommendedRam:'8–16 GB',minCpu:'64-bit dual-core',recommendedCpu:'4-core modern CPU',storage:'30 GB+',gpu:'Vulkan-capable GPU recommended',arch:'x86_64 / device-specific',notes:'Gaming performance depends heavily on the game, GPU drivers and hardware.'};
    if(type==='mobile' || cats.includes('mobile')) return {minRam:'2 GB',recommendedRam:'4 GB+',minCpu:'Supported ARM CPU',recommendedCpu:'Modern ARM64 SoC',storage:'16 GB+',gpu:'Device-specific',arch:'ARM / ARM64',notes:'Mobile OS compatibility depends on the exact supported device.'};
    if(type==='bsd' || cats.includes('server') || cats.includes('security')) return {minRam:'1 GB',recommendedRam:'4 GB',minCpu:'64-bit CPU',recommendedCpu:'2-core+',storage:'10 GB+',gpu:'Basic graphics',arch:'Architecture-specific',notes:'Requirements vary by role and desktop environment.'};
    if(cats.includes('lightweight') || cats.includes('old hardware')) return {minRam:'1 GB',recommendedRam:'2–4 GB',minCpu:'64-bit or supported legacy CPU',recommendedCpu:'2-core+',storage:'10 GB+',gpu:'Basic graphics',arch:'Architecture-specific',notes:'Lightweight desktop choices can reduce resource use substantially.'};
    return {minRam:'2 GB',recommendedRam:'4–8 GB',minCpu:'64-bit dual-core',recommendedCpu:'2–4 core modern CPU',storage:'20 GB+',gpu:'3D acceleration recommended for desktop',arch:'See architecture field',notes:'Practical requirements vary with the chosen desktop, apps and workload.'};
  };

  const normalize = name => String(name || '').trim().toLowerCase();
  window.OSPulseRequirements = {
    get(system) { return profiles[system?.name] || Object.entries(profiles).find(([k]) => normalize(k)===normalize(system?.name))?.[1] || fallback(system); },
    profiles,
    fallback
  };
})();
