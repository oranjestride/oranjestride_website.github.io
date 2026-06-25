/**
 * testimonials.js — crossfade slider with dots + arrows and auto-rotate.
 * Auto-rotation pauses on hover/focus and when the tab is hidden; it is
 * disabled entirely under reduced motion (manual controls still work).
 */
export function initTestimonials(reduced) {
  const slider = document.querySelector('[data-slider]');
  if (!slider) return;
  const slides = [...slider.querySelectorAll('.quote-card')];
  const dots = [...slider.querySelectorAll('[data-dot]')];
  if (slides.length <= 1) return;

  const AUTO = 6000;
  let idx = 0;
  let timer = null;

  function go(n) {
    idx = (n + slides.length) % slides.length;
    slides.forEach((s, i) => {
      const on = i === idx;
      s.classList.toggle('is-active', on);
      if (on) s.removeAttribute('aria-hidden');
      else s.setAttribute('aria-hidden', 'true');
    });
    dots.forEach((d, i) => {
      const on = i === idx;
      d.classList.toggle('is-active', on);
      if (on) d.setAttribute('aria-current', 'true');
      else d.removeAttribute('aria-current');
    });
  }
  const next = () => go(idx + 1);
  const prev = () => go(idx - 1);

  function start() {
    if (reduced) return;
    stop();
    timer = setInterval(next, AUTO);
  }
  function stop() {
    if (timer) { clearInterval(timer); timer = null; }
  }

  slider.querySelector('[data-slide-next]')?.addEventListener('click', () => { next(); start(); });
  slider.querySelector('[data-slide-prev]')?.addEventListener('click', () => { prev(); start(); });
  dots.forEach((d, i) => d.addEventListener('click', () => { go(i); start(); }));

  slider.addEventListener('pointerenter', stop);
  slider.addEventListener('pointerleave', start);
  slider.addEventListener('focusin', stop);
  slider.addEventListener('focusout', start);
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));

  go(0);
  start();
}
