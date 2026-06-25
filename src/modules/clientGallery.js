/**
 * clientGallery.js — clients modal (open/close, focus trap, Esc, backdrop)
 * plus category filter tabs.
 */
import { lockScroll, unlockScroll } from './motion.js';

export function initClientGallery() {
  const modal = document.querySelector('[data-modal="clients"]');
  const openers = document.querySelectorAll('[data-modal-open="clients"]');
  if (!modal || !openers.length) return;

  const panel = modal.querySelector('.modal__panel');
  const closers = modal.querySelectorAll('[data-modal-close]');
  let lastFocus = null;
  const focusables = () => [...panel.querySelectorAll('a[href], button:not([disabled])')];

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
    modal.hidden = false;
    requestAnimationFrame(() => modal.classList.add('is-open'));
    lastFocus = document.activeElement;
    lockScroll();
    document.addEventListener('keydown', onKey);
    const f = focusables();
    if (f.length) f[0].focus();
  }
  function close() {
    modal.classList.remove('is-open');
    unlockScroll();
    document.removeEventListener('keydown', onKey);
    const onEnd = () => {
      if (!modal.classList.contains('is-open')) modal.hidden = true;
      panel.removeEventListener('transitionend', onEnd);
    };
    panel.addEventListener('transitionend', onEnd);
    if (lastFocus) lastFocus.focus();
  }

  openers.forEach((o) => o.addEventListener('click', open));
  closers.forEach((c) => c.addEventListener('click', close));

  // ---- Filter tabs ----
  const tabs = [...modal.querySelectorAll('[data-filter]')];
  const cells = [...modal.querySelectorAll('.client-cell')];
  tabs.forEach((tab) =>
    tab.addEventListener('click', () => {
      const f = tab.dataset.filter;
      tabs.forEach((t) => {
        const on = t === tab;
        t.classList.toggle('is-active', on);
        t.setAttribute('aria-selected', on ? 'true' : 'false');
      });
      cells.forEach((c) => {
        c.hidden = !(f === 'all' || c.dataset.category === f);
      });
    })
  );
}
