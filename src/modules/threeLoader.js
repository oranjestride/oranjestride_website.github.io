/**
 * threeLoader.js — lazy, desktop-only orchestration for the 3D scenes.
 * Each scene is dynamically imported (its own chunk) when its section nears
 * the viewport, and fully disposed when it leaves — freeing the GPU context.
 * Static fallbacks remain for mobile / reduced-motion / no-WebGL.
 */

function webglOK() {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl')));
  } catch {
    return false;
  }
}

function setup({ container, fallback, sectionSel, loader }) {
  if (!container) return;
  const observed = container.closest(sectionSel) || container;
  let instance = null;
  let pending = false;

  const io = new IntersectionObserver(
    async (entries) => {
      const visible = entries.some((e) => e.isIntersecting);
      if (visible && !instance && !pending) {
        pending = true;
        try {
          const mod = await loader();
          instance = mod.create(container);
          container.classList.add('is-active');
          fallback?.classList.add('is-hidden');
        } catch (err) {
          console.error('[3D] failed to mount scene:', err);
        } finally {
          pending = false;
        }
      } else if (!visible && instance) {
        instance.dispose();
        instance = null;
        container.classList.remove('is-active');
        fallback?.classList.remove('is-hidden');
      }
    },
    { rootMargin: '300px 0px' }
  );
  io.observe(observed);
}

export function init3D(reduced) {
  if (reduced) return;
  const desktop = window.matchMedia('(min-width: 900px) and (hover: hover) and (pointer: fine)').matches;
  if (!desktop || !webglOK()) return; // fallbacks stay in place

  // Lazy-on-interaction: Three.js (~470 KB) parses + compiles shaders on a
  // long task. Deferring its load until the first user gesture keeps the
  // initial page load thread-free (the attractive static fallback shows
  // meanwhile); the 3D upgrades the instant the user moves/scrolls.
  let started = false;
  const events = ['pointermove', 'pointerdown', 'wheel', 'scroll', 'keydown', 'touchstart'];
  const remove = () => events.forEach((e) => window.removeEventListener(e, start));
  function start() {
    if (started) return;
    started = true;
    remove();
    [
      { container: document.querySelector('[data-hero-canvas]'), fallback: document.querySelector('[data-hero-fallback]'), sectionSel: '.hero', loader: () => import('../three/heroScene.js') },
      { container: document.querySelector('[data-globe-canvas]'), fallback: document.querySelector('[data-globe-fallback]'), sectionSel: '.india', loader: () => import('../three/globe.js') },
    ].forEach(setup);
  }
  events.forEach((e) => window.addEventListener(e, start, { once: false, passive: true }));
}
