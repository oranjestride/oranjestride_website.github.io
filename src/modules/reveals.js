/**
 * reveals.js — hero intro timeline, batched scroll reveals, light parallax.
 * Uses ScrollTrigger.batch so dozens of [data-reveal] elements share a tiny
 * number of triggers (and each kills itself after firing via once:true).
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function initReveals(reduced) {
  const all = gsap.utils.toArray('[data-reveal]');

  // Reduced motion (or nothing to animate): just make sure content is visible.
  if (reduced || !all.length) {
    document.documentElement.classList.remove('anim-ready');
    gsap.set(all, { clearProps: 'all' });
    return;
  }

  // Hero is revealed by CSS (keyframes) so the LCP headline paints without
  // waiting for this JS bundle. GSAP only handles below-the-fold reveals.
  const rest = all.filter((el) => !el.closest('.hero'));

  gsap.set(rest, { opacity: 0, y: 22 });

  // Everything else reveals as it scrolls into view.
  ScrollTrigger.batch(rest, {
    start: 'top 86%',
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.08,
        overwrite: true,
      }),
  });

  // Subtle scroll parallax on decorative, non-reveal elements only.
  gsap.utils.toArray('[data-parallax]').forEach((el) => {
    const depth = parseFloat(el.dataset.parallax) || 0.15;
    gsap.to(el, {
      yPercent: depth * 100,
      ease: 'none',
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });

  ScrollTrigger.refresh();
}
