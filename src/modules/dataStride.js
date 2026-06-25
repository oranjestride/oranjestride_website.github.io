/**
 * dataStride.js — first-visit promo popup for the DataStride product.
 * Auto-shows once (localStorage-gated), openable via [data-ds-open],
 * closeable via backdrop / Esc / [data-ds-close]. Focus-trapped.
 */
import { lockScroll, unlockScroll } from './motion.js';

const SEEN_KEY = 'ds_popup_seen';

export function initDataStride() {
  const popup = document.querySelector('[data-ds-popup]');
  if (!popup) return;
  const card = popup.querySelector('.ds-popup__card');
  const openers = document.querySelectorAll('[data-ds-open]');
  let lastFocus = null;

  const focusables = () => [...card.querySelectorAll('a[href], button:not([disabled])')];

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
    if (popup.classList.contains('is-open')) return;
    popup.hidden = false;
    requestAnimationFrame(() => popup.classList.add('is-open'));
    lastFocus = document.activeElement;
    lockScroll();
    document.addEventListener('keydown', onKey);
    const f = focusables();
    if (f.length) f[0].focus();
  }
  function close() {
    if (!popup.classList.contains('is-open')) return;
    popup.classList.remove('is-open');
    unlockScroll();
    document.removeEventListener('keydown', onKey);
    try { localStorage.setItem(SEEN_KEY, '1'); } catch {}
    const onEnd = () => {
      if (!popup.classList.contains('is-open')) popup.hidden = true;
      card.removeEventListener('transitionend', onEnd);
    };
    card.addEventListener('transitionend', onEnd);
    if (lastFocus) lastFocus.focus();
  }

  popup.querySelectorAll('[data-ds-close]').forEach((c) => c.addEventListener('click', close));
  popup.querySelector('[data-ds-backdrop]')?.addEventListener('click', close);
  openers.forEach((o) => o.addEventListener('click', (e) => { e.preventDefault(); open(); }));

  // Auto-show once, a few seconds after load (skip if already seen).
  let seen = false;
  try { seen = !!localStorage.getItem(SEEN_KEY); } catch {}
  if (!seen) setTimeout(open, 6000);
}
