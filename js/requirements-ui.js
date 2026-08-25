/* Render hardware requirements into every OS details modal. */
(() => {
  'use strict';
  const render = (system) => {
    const req = window.OSPulseRequirements?.get(system);
    if (!req) return;
    const body = document.getElementById('modalBody');
    const grid = body?.querySelector('.detail-grid');
    if (!body || !grid || body.querySelector('.requirements-panel')) return;

    const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    const item = (icon, label, value) => `<div class="req-item"><i class="fa-solid ${icon}"></i><span><small>${esc(label)}</small><strong>${esc(value)}</strong></span></div>`;
    const panel = document.createElement('section');
    panel.className = 'requirements-panel';
    panel.innerHTML = `<div class="requirements-head"><div><span class="req-kicker">HARDWARE CHECK</span><h3>System requirements</h3></div><span class="req-badge">MIN / RECOMMENDED</span></div><div class="requirements-grid">${item('fa-memory','RAM',`${req.minRam} minimum · ${req.recommendedRam} recommended`)}${item('fa-microchip','CPU',`${req.minCpu} minimum · ${req.recommendedCpu} recommended`)}${item('fa-hard-drive','Storage',req.storage)}${item('fa-display','GPU / Graphics',req.gpu)}${item('fa-microchip','Architecture',req.arch)}</div><p class="requirements-note"><i class="fa-solid fa-circle-info"></i> ${esc(req.notes)}</p></section>`;
    body.insertBefore(panel, grid);
  };

  const patch = () => {
    if (!window.DistroHubApp?.prototype || window.DistroHubApp.prototype.__requirementsPatched) return;
    const proto = window.DistroHubApp.prototype;
    const original = proto.open;
    if (typeof original !== 'function') return;
    proto.open = function(system) {
      const result = original.call(this, system);
      requestAnimationFrame(() => render(system));
      return result;
    };
    proto.__requirementsPatched = true;
  };

  const css = document.createElement('style');
  css.textContent = `
    .requirements-panel{margin:22px 0 18px;padding:18px;border:1px solid rgba(0,229,255,.2);border-radius:18px;background:linear-gradient(135deg,rgba(8,20,35,.96),rgba(12,18,42,.92));box-shadow:0 14px 50px rgba(0,0,0,.18)}
    .requirements-head{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:15px}.req-kicker{display:block;color:#00e5ff;font:700 10px/1.2 Space Grotesk,Inter,sans-serif;letter-spacing:.16em}.requirements-head h3{margin:5px 0 0;font:700 20px/1.2 Inter,sans-serif}.req-badge{font:700 10px Space Grotesk;color:#9defff;border:1px solid rgba(0,229,255,.25);border-radius:999px;padding:7px 9px;white-space:nowrap}
    .requirements-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.req-item{display:flex;align-items:flex-start;gap:11px;padding:12px;border-radius:13px;background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.06)}.req-item>i{color:#63eaff;margin-top:3px;width:16px;text-align:center}.req-item span{min-width:0}.req-item small{display:block;color:#8493ab;font-size:10px;text-transform:uppercase;letter-spacing:.08em;margin-bottom:3px}.req-item strong{display:block;color:#f4f7ff;font-size:12px;line-height:1.45}.requirements-note{margin:13px 0 0;color:#8f9db3;font-size:12px;line-height:1.55}.requirements-note i{color:#63eaff;margin-right:5px}
    @media(max-width:620px){.requirements-grid{grid-template-columns:1fr}.requirements-head{align-items:flex-start;flex-direction:column}.req-badge{align-self:flex-start}}
  `;
  document.head.appendChild(css);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', patch, {once:true}); else patch();
  window.addEventListener('load', patch);
})();
