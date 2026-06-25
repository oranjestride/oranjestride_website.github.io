/**
 * motion.js — smooth scroll + GSAP plumbing.
 * Lenis runs on a SINGLE rAF loop driven by GSAP's ticker (autoRaf:false),
 * so ScrollTrigger and Lenis never fight over their own loops.
 */
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let lenis = null;

export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function getLenis() {
  return lenis;
}

export function initSmoothScroll() {
  gsap.registerPlugin(ScrollTrigger);

  // Reduced motion: no Lenis, native (instant) scrolling, no smoothing.
  if (prefersReducedMotion()) return null;

  lenis = new Lenis({ autoRaf: false, lerp: 0.1, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000)); // ticker time is seconds
  gsap.ticker.lagSmoothing(0);

  // Route in-page anchors through Lenis for a smooth, offset-aware jump.
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    const href = a.getAttribute('href');
    if (!href || href.length < 2) return;
    a.addEventListener('click', (e) => {
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: -80 });
    });
  });

  ScrollTrigger.refresh();
  return lenis;
}

/* Scroll lock for modals / drawer — works with or without Lenis. */
export function lockScroll() {
  if (lenis) lenis.stop();
  const sbw = window.innerWidth - document.documentElement.clientWidth;
  if (sbw > 0) document.body.style.paddingRight = `${sbw}px`;
  document.documentElement.classList.add('scroll-locked');
}

export function unlockScroll() {
  if (lenis) lenis.start();
  document.body.style.paddingRight = '';
  document.documentElement.classList.remove('scroll-locked');
}
