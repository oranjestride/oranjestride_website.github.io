/**
 * nav.js — sticky-nav shrink, mobile drawer (with focus trap), scroll-spy.
 */
import { lockScroll, unlockScroll } from './motion.js';

export function initNav() {
  const nav = document.querySelector('[data-nav]');
  if (nav) {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        nav.classList.toggle('is-scrolled', window.scrollY > 16);
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ---- Mobile drawer ----
  const drawer = document.querySelector('[data-drawer]');
  const openBtn = document.querySelector('[data-drawer-open]');
  if (drawer && openBtn) {
    const panel = drawer.querySelector('.drawer__panel');
    const closers = drawer.querySelectorAll('[data-drawer-close]');
    let lastFocus = null;
    const focusables = () =>
      [...panel.querySelectorAll('a[href], button:not([disabled])')];

    const onKey = (e) => {
      if (e.key === 'Escape') return close();
      if (e.key !== 'Tab') return;
      const f = focusables();
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };

    function open() {
      drawer.hidden = false;
      requestAnimationFrame(() => drawer.classList.add('is-open'));
      openBtn.setAttribute('aria-expanded', 'true');
      lastFocus = document.activeElement;
      lockScroll();
      document.addEventListener('keydown', onKey);
      const f = focusables();
      if (f.length) f[0].focus();
    }
    function close() {
      drawer.classList.remove('is-open');
      openBtn.setAttribute('aria-expanded', 'false');
      unlockScroll();
      document.removeEventListener('keydown', onKey);
      const onEnd = () => {
        if (!drawer.classList.contains('is-open')) drawer.hidden = true;
        panel.removeEventListener('transitionend', onEnd);
      };
      panel.addEventListener('transitionend', onEnd);
      if (lastFocus) lastFocus.focus();
    }

    openBtn.addEventListener('click', open);
    closers.forEach((c) => c.addEventListener('click', close));
  }

  // ---- Scroll-spy: highlight the link for the section in view ----
  const links = [...document.querySelectorAll('.nav__links a[href^="#"]')];
  const map = new Map();
  links.forEach((l) => {
    const sec = document.getElementById(l.getAttribute('href').slice(1));
    if (sec) map.set(sec, l);
  });
  if (map.size) {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          links.forEach((l) => l.classList.remove('is-current'));
          const l = map.get(en.target);
          if (l) l.classList.add('is-current');
        });
      },
      { rootMargin: '-50% 0px -50% 0px' }
    );
    map.forEach((_, sec) => obs.observe(sec));
  }
}
