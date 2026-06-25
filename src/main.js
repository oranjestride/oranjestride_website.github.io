/* ============================================================
   OranjeStride — entry point
   Phase 3: render content, init smooth scroll + GSAP, mount modules.
   (3D is lazy-loaded in Phase 4.)
   ============================================================ */
import '@fontsource-variable/space-grotesk';
import '@fontsource-variable/inter';

import './styles/tokens.css';
import './styles/base.css';
import './styles/sections.css';

import { renderAll } from './modules/render.js';
import { initSmoothScroll, prefersReducedMotion } from './modules/motion.js';
import { initNav } from './modules/nav.js';
import { initReveals } from './modules/reveals.js';
import { initCounters } from './modules/counters.js';
import { initTilt } from './modules/tilt.js';
import { initMarquee } from './modules/marquee.js';
import { initTestimonials } from './modules/testimonials.js';
import { initClientGallery } from './modules/clientGallery.js';
import { initContactForm } from './modules/contactForm.js';
import { initProgrammeTabs } from './modules/programmeTabs.js';
import { initDataStride } from './modules/dataStride.js';
import { init3D } from './modules/threeLoader.js';

function boot() {
  document.documentElement.classList.add('booted'); // clears the reveal failsafe

  // Repeating content must exist before modules wire to it.
  renderAll();

  const yearEl = document.querySelector('[data-year]');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  const reduced = prefersReducedMotion();

  try {
    initSmoothScroll();
    initReveals(reduced);
    initCounters(reduced);
    initTilt(reduced);
    initMarquee(reduced);
    initNav();
    initTestimonials(reduced);
    initClientGallery();
    initContactForm();
    initProgrammeTabs();
    initDataStride();
  } catch (err) {
    // Never let a motion glitch hide the page: reveal everything.
    console.error('[OranjeStride] init error:', err);
    document.documentElement.classList.remove('anim-ready');
  }

  // 3D loads after first paint so it never competes with LCP.
  if (!reduced) {
    if (document.readyState === 'complete') init3D(reduced);
    else window.addEventListener('load', () => init3D(reduced), { once: true });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}
