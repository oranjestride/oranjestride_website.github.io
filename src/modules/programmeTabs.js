/**
 * programmeTabs.js — switch between training-stream panels.
 */
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function initProgrammeTabs() {
  const tabs = [...document.querySelectorAll('[data-prog-tab]')];
  const panels = [...document.querySelectorAll('[data-prog-panel]')];
  if (!tabs.length || !panels.length) return;

  tabs.forEach((tab) =>
    tab.addEventListener('click', () => {
      const id = tab.dataset.progTab;
      tabs.forEach((t) => {
        const on = t === tab;
        t.classList.toggle('is-active', on);
        t.setAttribute('aria-selected', on ? 'true' : 'false');
      });
      panels.forEach((p) => {
        const on = p.dataset.progPanel === id;
        p.classList.toggle('is-active', on);
        p.hidden = !on;
      });
      // Newly shown content changes page height — keep ScrollTrigger honest.
      if (ScrollTrigger && ScrollTrigger.refresh) ScrollTrigger.refresh();
    })
  );
}
