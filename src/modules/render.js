/**
 * render.js — builds repeating content from /data into the DOM.
 * Keeps index.html free of hand-written, duplicated markup.
 */
import { expertise } from '../data/expertise.js';
import { clients, clientFilters } from '../data/clients.js';
import { programmeStreams } from '../data/programmes.js';
import { testimonials } from '../data/testimonials.js';
import { datastride } from '../data/datastride.js';

/* Host-agnostic asset path (respects Vite base). */
const img = (file) => `${import.meta.env.BASE_URL}images/${file}`;

const escapeHtml = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

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
  database: svg('<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5"/><path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3"/>'),
  bolt: svg('<path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z"/>'),
  book: svg('<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/>'),
  target: svg('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>'),
  arrow: svg('<path d="M5 12h14M13 6l6 6-6 6"/>'),
  close: svg('<path d="M6 6l12 12M18 6 6 18"/>'),
  tick: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 4 4 10-10"/></svg>',
};

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

/* ---------- Programmes (tabbed streams) ---------- */
function courseCard(c) {
  return `
    <article class="course-card">
      ${c.badge ? `<span class="course-badge">${c.badge}</span>` : ''}
      <h4 class="course-card__title">${c.title}</h4>
      ${c.desc ? `<p class="course-card__desc">${c.desc}</p>` : ''}
      ${c.list ? `<ul class="course-card__list" role="list">${c.list.map((i) => `<li><span class="tick" aria-hidden="true">${icons.tick}</span>${i}</li>`).join('')}</ul>` : ''}
      ${c.tags ? `<ul class="chips" role="list">${c.tags.map((t) => `<li class="chip">${t}</li>`).join('')}</ul>` : ''}
      ${c.meta ? `<div class="course-meta">${c.meta.map((m) => `<span><strong>${m.v}</strong>${m.k}</span>`).join('')}</div>` : ''}
      ${c.certificate ? `<p class="course-cert">${c.certificate}</p>` : ''}
    </article>`;
}

function renderProgrammes() {
  const tabs = programmeStreams
    .map(
      (s, i) =>
        `<button class="prog-tab${i === 0 ? ' is-active' : ''}" data-prog-tab="${s.id}" role="tab" aria-selected="${i === 0}">${icons[s.icon] || ''}<span>${s.tab}</span></button>`
    )
    .join('');
  mount('[data-render="prog-tabs"]', tabs);

  const panels = programmeStreams
    .map(
      (s, i) => `
      <div class="prog-panel${i === 0 ? ' is-active' : ''}" data-prog-panel="${s.id}" role="tabpanel"${i === 0 ? '' : ' hidden'}>
        <p class="prog-intro">${s.intro}</p>
        ${s.groups
          .map(
            (g) => `
          ${g.subhead ? `<div class="prog-subhead"><span>${g.subhead}</span></div>` : ''}
          <div class="course-grid course-grid--${g.layout}">${g.cards.map(courseCard).join('')}</div>`
          )
          .join('')}
      </div>`
    )
    .join('');
  mount('[data-render="prog-panels"]', panels);
}

/* ---------- DataStride section + popup ---------- */
function dsFeatures() {
  return datastride.features
    .map(
      (f) => `
      <div class="ds-feature">
        <span class="ds-feature__icon">${icons[f.icon] || ''}</span>
        <h4>${f.title}</h4>
        <p>${f.desc}</p>
      </div>`
    )
    .join('');
}

function renderDataStride() {
  const d = datastride;
  mount('[data-render="ds-features"]', dsFeatures());

  const KW = /\b(SELECT|FROM|WHERE|GROUP\s+BY|ORDER\s+BY|AS|DESC|ASC|ROUND|SUM|AVG|COUNT|JOIN|ON|AND|OR)\b/g;
  const hl = (line) => escapeHtml(line).replace(KW, '<span class="ds-kw">$1</span>');
  const code = d.sample.query.map((line) => `<span class="ds-code__line">${hl(line)}</span>`).join('');
  const thead = `<tr>${d.sample.columns.map((c) => `<th>${c}</th>`).join('')}</tr>`;
  const tbody = d.sample.rows.map((r) => `<tr>${r.map((cell) => `<td>${cell}</td>`).join('')}</tr>`).join('');
  mount(
    '[data-render="ds-mock"]',
    `
    <div class="ds-editor" aria-hidden="true">
      <div class="ds-editor__bar"><i></i><i></i><i></i><em>query.sql</em></div>
      <pre class="ds-code"><code>${code}</code></pre>
    </div>
    <div class="ds-result" aria-hidden="true">
      <div class="ds-result__head">Result · ${d.sample.rows.length} rows</div>
      <table>
        <thead>${thead}</thead>
        <tbody>${tbody}</tbody>
      </table>
    </div>`
  );

  // Popup inner card
  mount(
    '[data-render="ds-popup"]',
    `
    <button class="ds-popup__close" data-ds-close aria-label="Close">${icons.close}</button>
    <div class="ds-popup__top">
      <span class="ds-pill">${d.pill}</span>
      <div class="ds-popup__brand">
        <span class="ds-popup__icon">${icons.database}</span>
        <div><h3 id="ds-popup-title">${d.name}</h3><p>${d.tagline} by OranjeStride</p></div>
      </div>
    </div>
    <div class="ds-popup__body">
      <p class="ds-popup__desc">${d.description}</p>
      <div class="ds-feature-grid">${dsFeatures()}</div>
      <div class="ds-popup__actions">
        <a class="btn btn--primary" href="${d.url}" target="_blank" rel="noopener">Explore DataStride →</a>
        <button class="ds-popup__dismiss" data-ds-close type="button">Maybe Later</button>
      </div>
    </div>`
  );
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
  renderDataStride();
  renderTestimonials();
}
