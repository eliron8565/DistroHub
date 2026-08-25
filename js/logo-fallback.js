/* Reliable OS logo fallback. Keeps branded logos visible even when a Simple Icons slug is unavailable. */
(() => {
  'use strict';

  const cache = new Map();
  const clean = value => String(value || '').trim();

  const officialLogo = system => {
    const website = clean(system?.website || system?.download || system?.downloadUrl);
    if (!website) return '';
    try {
      const url = new URL(website);
      return `${url.origin}/favicon.ico`;
    } catch {
      return '';
    }
  };

  const logoCandidates = system => {
    const primary = clean(system?.logo);
    const fallback = officialLogo(system);
    return [...new Set([primary, fallback].filter(Boolean))];
  };

  const patchImage = img => {
    if (!img || img.dataset.logoFallbackBound === '1') return;
    img.dataset.logoFallbackBound = '1';
    const systemId = img.dataset.systemId || '';
    const candidates = cache.get(systemId) || [];
    let index = 0;
    img.addEventListener('error', () => {
      index += 1;
      if (index < candidates.length) {
        img.src = candidates[index];
      } else {
        img.removeAttribute('src');
        img.classList.add('logo-unavailable');
      }
    });
  };

  const patch = () => {
    if (!window.DistroHubApp?.prototype || window.DistroHubApp.prototype.__logoFallbackPatched) return;
    const proto = window.DistroHubApp.prototype;

    const originalNormalize = proto.normalize;
    proto.normalize = function(system, fallbackType = 'Linux') {
      const result = originalNormalize.call(this, system, fallbackType);
      if (result) {
        const candidates = logoCandidates(result);
        cache.set(result.id, candidates);
        if (!result.logo && candidates.length) result.logo = candidates[0];
        result.logoFallback = candidates[1] || '';
      }
      return result;
    };

    const originalCard = proto.card;
    proto.card = function(system) {
      const html = originalCard.call(this, system);
      const candidates = logoCandidates(system);
      cache.set(system.id, candidates);
      if (!candidates.length) return html;
      const fallback = candidates[1] || '';
      return html.replace(
        `loading="lazy" onerror="this.style.display='none'"`,
        `loading="lazy" data-system-id="${this.esc(system.id)}" onerror="this.onerror=null;this.src='${this.esc(fallback)}';"`
      );
    };

    const originalRenderGaming = proto.renderGaming;
    proto.renderGaming = function(filter) {
      const result = originalRenderGaming.call(this, filter);
      document.querySelectorAll('#gamingGrid img[data-system-id]').forEach(patchImage);
      return result;
    };

    proto.__logoFallbackPatched = true;
  };

  const observer = new MutationObserver(() => {
    document.querySelectorAll('.system-card img[data-system-id], #gamingGrid img[data-system-id]').forEach(patchImage);
  });

  const start = () => {
    patch();
    observer.observe(document.body, { childList: true, subtree: true });
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
