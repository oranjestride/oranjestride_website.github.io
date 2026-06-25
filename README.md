# OranjeStride — Marketing Website

India's premier Gen AI & Data Science training and consulting practice.
A fast, immersive, single-page marketing site built with **Vite (vanilla JS)**,
**Three.js**, **GSAP + ScrollTrigger**, and **Lenis**.

- Lighthouse: **Performance 98–100 · Accessibility 100 · Best Practices 100 · SEO 100**
- Zero build/runtime errors · WebP assets (<150 KB each) · fully responsive (360px → 1920px+)
- 3D is lazy-loaded, desktop-only, and gated behind `prefers-reduced-motion`

---

## Prerequisites

- **Node.js 18+** (built/tested on Node 20) and npm.

## Install

```bash
npm install
```

## Develop

```bash
npm run dev        # Vite dev server at http://localhost:5173
```

## Build

```bash
npm run build      # → /dist (static, host-agnostic, relative asset paths)
npm run preview    # serve the built /dist at http://localhost:4173
```

## Optimize images (only when source art changes)

Raw assets live in `/images`. This script converts them to optimized WebP in
`/public/images`, knocks the white background out of the logo, and generates the
figure-only mark, the Apple touch icon, and the Open Graph image.

```bash
npm run optimize:images
```

---

## Project structure

```
├─ index.html              # single-page shell + meta/SEO/JSON-LD
├─ vite.config.js          # base:'./' (host-agnostic) + chunk splitting
├─ public/images/          # optimized WebP/SVG assets (served as /images)
├─ images/                 # raw source art (input to optimize:images)
├─ scripts/optimize-images.js
└─ src/
   ├─ main.js              # entry: render content, init motion + lazy 3D
   ├─ styles/              # tokens.css · base.css · sections.css
   ├─ data/                # expertise · clients · programmes · testimonials
   ├─ modules/             # nav · reveals · counters · tilt · marquee ·
   │                       #   testimonials · clientGallery · contactForm ·
   │                       #   motion (Lenis+GSAP) · threeLoader
   └─ three/               # heroScene · mascot · globe (lazy chunks)
```

Repeating content (expertise cards, client logos, programmes, testimonials) is
rendered from the `/src/data` files — edits there flow straight to the DOM.

---

## Deploy

The build output in `/dist` is a static site that works on any host
(Netlify, Vercel, Cloudflare Pages, GitHub Pages). Asset paths are relative, so
it works at a domain root **or** a sub-path.

### GitHub Pages (configured)

`.github/workflows/deploy.yml` builds and deploys on every push to `main`
(Settings → Pages → Source = **GitHub Actions**). Live URL:

```
https://oranjestride.github.io/oranjestride_website.github.io/
```

### Netlify / Vercel / Cloudflare Pages

- Build command: `npm run build`
- Publish directory: `dist`

### Point the Wix domain at the site (DNS)

Wix doesn't allow changing nameservers, so use **DNS records** at your Wix domain
(Domains → Advanced → Edit DNS), pointing at your chosen static host:

- **Netlify** — add a `CNAME` for `www` → `<your-site>.netlify.app`, and set the
  apex `@` via Netlify's provided `A`/`ALIAS` records (or an `ALIAS`/`ANAME` to
  the Netlify load balancer).
- **Vercel** — `CNAME` `www` → `cname.vercel-dns.com`, apex `A` → `76.76.21.21`.
- **Cloudflare Pages** — `CNAME` `www` → `<project>.pages.dev` (and apex via
  Cloudflare).
- **GitHub Pages (custom domain)** — apex `A` records →
  `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`;
  `www` `CNAME` → `oranjestride.github.io`. Then set the custom domain in
  Settings → Pages and add a `CNAME` file (or `public/CNAME`).

> **Before launch:** update the placeholder production domain
> `https://www.oranjestride.com/` in `index.html` (canonical, Open Graph,
> Twitter, JSON-LD) and in `public/robots.txt` / `public/sitemap.xml`.

---

## Tech stack

| Concern | Library |
|---|---|
| Build | Vite (vanilla JS, ES modules) |
| 3D | Three.js (lazy chunk, desktop-only) |
| Motion | GSAP + ScrollTrigger |
| Smooth scroll | Lenis (synced to the GSAP ticker) |
| Fonts | Space Grotesk + Inter (self-hosted via @fontsource) |
| Images | sharp (WebP pipeline) |

All motion respects `prefers-reduced-motion`; 3D falls back to static imagery on
mobile, reduced-motion, and no-WebGL.
