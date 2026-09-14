/* OSPulse resilient OS imagery: every card gets a visible image, even when remote assets fail. */
(() => {
  'use strict';

  const domainOf = url => {
    try { return new URL(url, location.href).hostname.replace(/^www\./, ''); }
    catch { return ''; }
  };

  const findSystem = name => {
    const n = String(name || '').trim().toLowerCase();
    return [...(window.app?.systems || []), ...(window.app?.gaming || [])]
      .find(x => String(x.name || '').trim().toLowerCase() === n);
  };

  const initials = name => String(name || 'OS')
    .trim().split(/\s+/).map(x => x[0]).join('').slice(0, 2).toUpperCase() || 'OS';

  const fallbackSvg = name => {
    const text = initials(name);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#19d9ff"/><stop offset="1" stop-color="#765cff"/></linearGradient></defs><rect x="4" y="4" width="120" height="120" rx="28" fill="#0b1324" stroke="url(#g)" stroke-width="4"/><circle cx="64" cy="52" r="25" fill="url(#g)" opacity=".18"/><text x="64" y="72" text-anchor="middle" font-family="Arial,sans-serif" font-size="34" font-weight="700" fill="#f5f8ff">${text}</text><text x="64" y="101" text-anchor="middle" font-family="Arial,sans-serif" font-size="9" font-weight="700" letter-spacing="2" fill="#55e8ff">OSPULSE</text></svg>`;
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  };

  const candidates = (name, current) => {
    const system = findSystem(name);
    const domain = domainOf(system?.website || system?.homepage || system?.download || system?.downloadUrl || '');
    const list = [];
    if (current && !String(current).startsWith('fa-')) list.push(current);
    if (system?.logo && system.logo !== current && !String(system.logo).startsWith('fa-')) list.push(system.logo);
    if (domain) {
      list.push(`https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=128`);
      list.push(`https://icons.duckduckgo.com/ip3/${domain}.ico`);
    }
    list.push(fallbackSvg(name));
    return [...new Set(list.filter(Boolean))];
  };

  const repair = img => {
    if (!img) return;
    const name = img.dataset.osName || img.alt?.replace(/\s+logo$/i, '') || '';
    if (!name) return;
    const list = candidates(name, img.getAttribute('src'));
    let index = Math.max(0, list.indexOf(img.getAttribute('src')));
    img.dataset.logoRepair = '1';
    img.alt = `${name} logo`;
    img.style.display = 'block';
    img.decoding = 'async';
    img.loading = 'lazy';
    img.onerror = () => {
      index += 1;
      img.src = list[index] || fallbackSvg(name);
    };
    if (!img.getAttribute('src')) img.src = list[0] || fallbackSvg(name);
  };

  const ensureImage = (container, name, current = '') => {
    if (!container || !name) return;
    let img = container.querySelector('img');
    if (!img) {
      img = document.createElement('img');
      container.replaceChildren(img);
    }
    img.dataset.osName = name;
    img.alt = `${name} logo`;
    if (current && !img.getAttribute('src') && !String(current).startsWith('fa-')) img.src = current;
    repair(img);
  };

  const modalSystemName = box => {
    const modal = box.closest('.modal-card');
    return modal?.querySelector('.modal-system h2')?.textContent?.trim()
      || modal?.querySelector('#modalBody h2')?.textContent?.trim()
      || '';
  };

  const scan = root => {
    root.querySelectorAll?.('.system-card').forEach(card => {
      const name = card.querySelector('h3')?.textContent?.trim();
      const box = card.querySelector('.system-logo');
      const system = findSystem(name);
      if (box && name) ensureImage(box, name, system?.logo || '');
    });

    root.querySelectorAll?.('.game-card').forEach(card => {
      const name = card.querySelector('h3')?.textContent?.trim();
      const box = card.querySelector('.game-logo');
      const system = findSystem(name);
      if (box && name) ensureImage(box, name, system?.logo || '');
    });

    root.querySelectorAll?.('.modal-logo').forEach(box => {
      const name = modalSystemName(box);
      const system = findSystem(name);
      if (box && name) ensureImage(box, name, system?.logo || '');
    });
  };

  const start = () => {
    scan(document);
    const observer = new MutationObserver(mutations => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType === 1) {
            scan(node);
            if (node.matches?.('.system-card,.game-card,.modal-logo')) scan(node.parentElement || document);
          }
        }
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
