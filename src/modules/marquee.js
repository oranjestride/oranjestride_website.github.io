/**
 * marquee.js — seamless client-logo marquee.
 * Clones the tile set so the track is exactly 2x wide, then loops xPercent -50.
 * Tiles use a uniform right margin (not flex-gap) so the period is exact.
 */
import gsap from 'gsap';

export function initMarquee(reduced) {
  const marquee = document.querySelector('[data-marquee]');
  if (!marquee) return;
  const track = marquee.querySelector('.marquee__track');
  if (!track || reduced) return; // reduced motion keeps the static wrapped grid

  const tiles = [...track.children];
  tiles.forEach((t) => {
    const clone = t.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    track.appendChild(clone);
  });
  marquee.classList.add('is-animated');

  const tween = gsap.to(track, { xPercent: -50, duration: 36, ease: 'none', repeat: -1 });
  marquee.addEventListener('pointerenter', () => tween.timeScale(0.2));
  marquee.addEventListener('pointerleave', () => tween.timeScale(1));
}
