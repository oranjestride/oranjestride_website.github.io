/**
 * tilt.js — cursor 3D tilt on cards, magnetic primary buttons, and a gentle
 * cursor parallax on the hero visual. Pointer-fine + motion-on only.
 */
import gsap from 'gsap';

export function initTilt(reduced) {
  if (reduced) return;
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!fine) return;

  // ---- Card tilt ----
  document.querySelectorAll('[data-tilt]').forEach((card) => {
    const STRENGTH = 7;
    gsap.set(card, { transformPerspective: 900, transformOrigin: 'center' });
    const rx = gsap.quickTo(card, 'rotationX', { duration: 0.4, ease: 'power2.out' });
    const ry = gsap.quickTo(card, 'rotationY', { duration: 0.4, ease: 'power2.out' });
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      ry(px * STRENGTH);
      rx(-py * STRENGTH);
    });
    card.addEventListener('pointerleave', () => { rx(0); ry(0); });
  });

  // ---- Magnetic primary buttons ----
  document.querySelectorAll('.btn--primary').forEach((btn) => {
    // Let GSAP own the transform; keep CSS transitions for colour/shadow only.
    btn.style.transitionProperty = 'box-shadow, background-color, border-color';
    const x = gsap.quickTo(btn, 'x', { duration: 0.4, ease: 'power3.out' });
    const y = gsap.quickTo(btn, 'y', { duration: 0.4, ease: 'power3.out' });
    btn.addEventListener('pointermove', (e) => {
      const r = btn.getBoundingClientRect();
      x((e.clientX - (r.left + r.width / 2)) * 0.3);
      y((e.clientY - (r.top + r.height / 2)) * 0.4);
    });
    btn.addEventListener('pointerleave', () => { x(0); y(0); });
  });

  // ---- Hero cursor parallax (moves the whole fallback group) ----
  const hero = document.querySelector('.hero');
  const fallback = document.querySelector('.hero__fallback');
  if (hero && fallback) {
    const x = gsap.quickTo(fallback, 'x', { duration: 0.7, ease: 'power2.out' });
    const y = gsap.quickTo(fallback, 'y', { duration: 0.7, ease: 'power2.out' });
    hero.addEventListener('pointermove', (e) => {
      const r = hero.getBoundingClientRect();
      x(((e.clientX - r.left) / r.width - 0.5) * 28);
      y(((e.clientY - r.top) / r.height - 0.5) * 22);
    });
    hero.addEventListener('pointerleave', () => { x(0); y(0); });
  }
}
