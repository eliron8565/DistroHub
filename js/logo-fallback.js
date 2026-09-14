/* Legacy compatibility shim.
   Logo recovery is handled centrally by logos.js + logo-resilience.js.
   Kept as an empty module because older cached HTML may still request this file. */
(() => {
  'use strict';
  window.OSPulseLogoFallback = true;
})();
