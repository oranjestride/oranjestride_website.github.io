/**
 * render.js — builds repeating content from /data into the DOM.
 * Keeps index.html free of hand-written, duplicated markup.
 */
import { expertise } from '../data/expertise.js';
import { clients, clientFilters } from '../data/clients.js';
import { programmes } from '../data/programmes.js';
import { testimonials } from '../data/testimonials.js';

/* Host-agnostic asset path (respects Vite base). */
const img = (file) => `${import.meta.env.BASE_URL}images/${file}`;

/* Inline SVG icon set (stroke = currentColor). */
const svg = (paths) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${paths}</svg>`;

const icons = {
  spark: svg('<path d="M12 3v4M12 17v4M3 12h4M17 12h4"/><path d="M12 8a4 4 0 0 0 4 4 4 4 0 0 0-4 4 4 4 0 0 0-4-4 4 4 0 0 0 4-4Z"/>'),
  model: svg('<circle cx="6" cy="6" r="2.4"/><circle cx="18" cy="6" r="2.4"/><circle cx="12" cy="18" r="2.4"/><path d="M7.6 7.7 10.6 16M16.4 7.7 13.4 16M8.4 6h7.2"/>'),
  analytics: svg('<path d="M4 19h16"/><path d="M4 19V5"/><path d="m7 14 3-4 3 2 4-6"/><circle cx="7" cy="14" r="1"/><circle cx="10" cy="10" r="1"/><circle cx="13" cy="12" r="1"/><circle cx="17" cy="6" r="1"/>'),
  chart: svg('<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 16v-3M12 16V9M16 16v-5"/>'),
  strategy: svg('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3"/>'),
  neural: svg('<circle cx="5" cy="7" r="1.8"/><circle cx="5" cy="17" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="19" cy="7" r="1.8"/><circle cx="19" cy="17" r="1.8"/><path d="M6.6 7.8 10.4 11M6.6 16.2 10.4 13M13.6 11l3.8-3.2M13.6 13l3.8 3.2"/>'),
  building: svg('<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2M10 21v-3h4v3"/>'),
  campus: svg('<path d="m12 4 9 4-9 4-9-4 9-4Z"/><path d="M6 10v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5"/><path d="M21 8v5"/>'),
  rocket: svg('<path d="M5 15c-1.5 1.5-2 5-2 5s3.5-.5 5-2"/><path d="M14.5 4.5C18 4 20 6 19.5 9.5 19 13 15 17 11 18l-5-5C7 9 11 5 14.5 4.5Z"/><circle cx="14.5" cy="9.5" r="1.6"/>'),
  arrow: svg('<path d="M5 12h14M13 6l6 6-6 6"/>'),
};

export const arrowIcon = icons.arrow;

function mount(selector, html) {
  const node = document.querySelector(selector);
  if (node) node.innerHTML = html;
  return node;
}

/* ---------- Expertise cards ---------- */
function renderExpertise() {
  const html = expertise
    .map(
      (e) => `
      <article class="exp-card" data-tilt data-reveal>
        <div class="exp-card__top">
          <span class="exp-card__icon">${icons[e.icon] || ''}</span>
          <span class="exp-card__num">${e.number}</span>
        </div>
        <h3 class="exp-card__title">${e.title}</h3>
        <p class="exp-card__desc">${e.description}</p>
        <ul class="chips" role="list">
          ${e.tags.map((t) => `<li class="chip">${t}</li>`).join('')}
        </ul>
      </article>`
    )
    .join('');
  mount('[data-render="expertise"]', html);
}

/* ---------- Client marquee + modal gallery ---------- */
function clientTile(c) {
  return `
    <div class="logo-tile" title="${c.name}">
      <img src="${img(c.logo)}" alt="${c.name} logo" width="140" height="46" loading="lazy" decoding="async" />
    </div>`;
}

function renderClients() {
  mount('[data-render="marquee"]', `<div class="marquee__track">${clients.map(clientTile).join('')}</div>`);

  // Modal: filter tabs + grid
  const tabs = clientFilters
    .map(
      (f, i) =>
        `<button class="filter-tab${i === 0 ? ' is-active' : ''}" data-filter="${f.id}" role="tab" aria-selected="${i === 0}">${f.label}</button>`
    )
    .join('');

  const grid = clients
    .map(
      (c) => `
      <figure class="client-cell" data-category="${c.category}">
        <img src="${img(c.logo)}" alt="${c.name} logo" width="120" height="44" loading="lazy" decoding="async" />
        <figcaption>${c.name}</figcaption>
      </figure>`
    )
    .join('');

  mount('[data-render="client-filters"]', tabs);
  mount('[data-render="client-grid"]', grid);
}

/* ---------- Programme panels ---------- */
function renderProgrammes() {
  const html = programmes
    .map(
      (p) => `
      <article class="prog-card" data-reveal>
        <div class="prog-card__head">
          <span class="prog-card__icon">${icons[p.icon] || ''}</span>
          <span class="prog-card__num">${p.number}</span>
        </div>
        <h3 class="prog-card__title">${p.title}</h3>
        <p class="prog-card__desc">${p.description}</p>
        <ul class="prog-card__list" role="list">
          ${p.highlights
            .map(
              (h) =>
                `<li><span class="tick" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 4 4 10-10"/></svg></span>${h}</li>`
            )
            .join('')}
        </ul>
      </article>`
    )
    .join('');
  mount('[data-render="programmes"]', html);
}

/* ---------- Testimonials slider ---------- */
function initials(name) {
  return name
    .replace(/^Dr\.?\s+/i, '')
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function renderTestimonials() {
  const slides = testimonials
    .map(
      (t, i) => `
      <figure class="quote-card${i === 0 ? ' is-active' : ''}" data-slide="${i}"${i === 0 ? '' : ' aria-hidden="true"'}>
        <div class="quote-mark" aria-hidden="true">&ldquo;</div>
        <blockquote>${t.quote}</blockquote>
        <figcaption class="quote-by">
          <span class="avatar" aria-hidden="true">${initials(t.name)}</span>
          <span class="quote-by__meta">
            <span class="quote-by__name">${t.name}</span>
            <span class="quote-by__role">${t.role} · ${t.org}</span>
          </span>
        </figcaption>
      </figure>`
    )
    .join('');

  mount('[data-render="testimonials"]', slides);

  const dots = testimonials
    .map(
      (_, i) =>
        `<button class="dot${i === 0 ? ' is-active' : ''}" data-dot="${i}" aria-label="Show testimonial ${i + 1}"${i === 0 ? ' aria-current="true"' : ''}></button>`
    )
    .join('');
  mount('[data-render="testimonial-dots"]', dots);
}

export function renderAll() {
  renderExpertise();
  renderClients();
  renderProgrammes();
  renderTestimonials();
}
