/**
 * counters.js — count-up for [data-count] when scrolled into view.
 * IntersectionObserver (not ScrollTrigger) keeps the trigger budget low.
 */
import gsap from 'gsap';

export function initCounters(reduced) {
  const els = [...document.querySelectorAll('[data-count]')];
  if (!els.length || reduced) return; // static values already in the HTML

  const fmt = (val, dec, suffix) =>
    (dec > 0 ? val.toFixed(dec) : String(Math.round(val))) + suffix;

  const run = (el) => {
    const target = parseFloat(el.dataset.count) || 0;
    const dec = parseInt(el.dataset.decimals || '0', 10);
    const suffix = el.dataset.suffix || '';
    const obj = { v: 0 };
    gsap.to(obj, {
      v: target,
      duration: 1.6,
      ease: 'power2.out',
      onUpdate: () => { el.textContent = fmt(obj.v, dec, suffix); },
    });
  };

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        run(en.target);
        io.unobserve(en.target);
      });
    },
    { threshold: 0.4 }
  );

  els.forEach((el) => {
    const dec = parseInt(el.dataset.decimals || '0', 10);
    el.textContent = fmt(0, dec, el.dataset.suffix || ''); // reset before animating
    io.observe(el);
  });
}
