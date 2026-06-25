/**
 * Image pipeline: read raw assets from /images, emit optimized WebP into
 * /public/images. SVGs are copied verbatim (already tiny + scalable).
 * Filenames are normalized (lowercase, spaces/& -> _) so data files can
 * reference stable, URL-safe names.
 *
 * The logo gets special handling: its baked-in white background is flood-filled
 * to true transparency, and a figure-only "mark" (no wordmark) is cropped out
 * for use as the compact brand icon + hero mascot.
 *
 * Run: npm run optimize:images
 */
import sharp from 'sharp';
import { readdir, mkdir, copyFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const SRC = path.resolve('images');
const OUT = path.resolve('public/images');

const norm = (name) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');

const kb = (bytes) => (bytes / 1024).toFixed(1);

/**
 * Flood-fill near-white background from the borders to alpha 0, then feather
 * the remaining light fringe so JPEG halos don't leave a white outline.
 * Mutates the RGBA buffer in place.
 */
function knockoutBackground(data, w, h) {
  const T = 232; // a pixel this light (all channels) is background-candidate
  const isLight = (i) => data[i] > T && data[i + 1] > T && data[i + 2] > T;
  const visited = new Uint8Array(w * h);
  const stack = [];

  const seed = (x, y) => {
    if (x < 0 || y < 0 || x >= w || y >= h) return;
    const p = y * w + x;
    if (visited[p]) return;
    visited[p] = 1;
    if (isLight(p * 4)) stack.push(p);
  };

  for (let x = 0; x < w; x++) { seed(x, 0); seed(x, h - 1); }
  for (let y = 0; y < h; y++) { seed(0, y); seed(w - 1, y); }

  const bg = new Uint8Array(w * h); // 1 = removed background
  while (stack.length) {
    const p = stack.pop();
    bg[p] = 1;
    data[p * 4 + 3] = 0;
    const x = p % w;
    const y = (p / w) | 0;
    seed(x + 1, y); seed(x - 1, y); seed(x, y + 1); seed(x, y - 1);
  }

  // Feather: any opaque-but-light pixel touching the background gets a
  // proportional alpha so edges blend instead of showing a white halo.
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const p = y * w + x;
      if (bg[p]) continue;
      const i = p * 4;
      const touchesBg =
        (x + 1 < w && bg[p + 1]) || (x - 1 >= 0 && bg[p - 1]) ||
        (y + 1 < h && bg[p + w]) || (y - 1 >= 0 && bg[p - w]);
      if (!touchesBg) continue;
      const lum = (data[i] + data[i + 1] + data[i + 2]) / 3;
      if (lum > 200) data[i + 3] = Math.round(((255 - lum) / 55) * 255);
    }
  }
}

async function processLogo(file) {
  const { data, info } = await sharp(path.join(SRC, file))
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  knockoutBackground(data, info.width, info.height);

  // Encode the transparent full logo once to a lossless PNG buffer, then derive
  // outputs from that (re-decoding lets sharp resolve dimensions for extract).
  const pngBuf = await sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  }).png().toBuffer();

  // Full transparent logo (figure + wordmark)
  await sharp(pngBuf).webp({ quality: 90 }).toFile(path.join(OUT, 'no_background_logo.webp'));

  // Figure-only mark: keep the top ~62% (the runner), drop the wordmark, trim.
  // (extract + trim must be separate pipelines — sharp runs trim first, which
  // would shrink the canvas and invalidate the extract window.)
  const markH = Math.round(info.height * 0.62);
  const region = await sharp(pngBuf)
    .extract({ left: 0, top: 0, width: info.width, height: markH })
    .toBuffer();
  const markBuf = await sharp(region).trim({ threshold: 6 }).png().toBuffer();
  await sharp(markBuf).webp({ quality: 90 }).toFile(path.join(OUT, 'logo_mark.webp'));

  // Apple touch icon: the figure on an opaque navy square (iOS rounds corners).
  const ICON = 180;
  const inner = await sharp(markBuf)
    .resize({ width: 128, height: 128, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  await sharp({
    create: { width: ICON, height: ICON, channels: 4, background: { r: 23, g: 49, b: 74, alpha: 1 } },
  })
    .composite([{ input: inner, gravity: 'center' }])
    .png()
    .toFile(path.join(OUT, 'apple-touch-icon.png'));

  return ['no_background_logo.webp', 'logo_mark.webp', 'apple-touch-icon.png'];
}

async function run() {
  if (!existsSync(SRC)) {
    console.error(`Source folder not found: ${SRC}`);
    process.exit(1);
  }
  await mkdir(OUT, { recursive: true });

  const files = (await readdir(SRC)).filter((f) => !f.startsWith('.'));
  let total = 0;
  const rows = [];

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    const base = norm(path.basename(file, ext));

    // Logo: background knockout + figure crop.
    if (base === 'no_background_logo') {
      const outs = await processLogo(file);
      for (const o of outs) {
        const size = (await stat(path.join(OUT, o))).size;
        total += size;
        rows.push([file, o, `${kb(size)} KB`]);
      }
      continue;
    }

    if (ext === '.svg') {
      const dest = path.join(OUT, `${base}.svg`);
      await copyFile(path.join(SRC, file), dest);
      const size = (await stat(dest)).size;
      total += size;
      rows.push([file, `${base}.svg`, `${kb(size)} KB`]);
      continue;
    }

    if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) continue;

    const isOg = /og.?image/.test(base);
    const srcPath = path.join(SRC, file);
    const meta = await sharp(srcPath).metadata();
    const cap = isOg ? 1200 : 700; // logos/illustrations rarely render larger
    const resize = meta.width && meta.width > cap ? { width: cap } : null;

    const dest = path.join(OUT, `${base}.webp`);
    let pipe = sharp(srcPath);
    if (resize) pipe = pipe.resize(resize);
    await pipe.webp({ quality: isOg ? 80 : 82, effort: 5 }).toFile(dest);
    let size = (await stat(dest)).size;
    total += size;
    rows.push([file, `${base}.webp`, `${kb(size)} KB`]);

    // Open Graph needs a JPEG too (broadest scraper compatibility).
    if (isOg) {
      const jpgDest = path.join(OUT, `${base}.jpg`);
      let jpg = sharp(srcPath);
      if (resize) jpg = jpg.resize(resize);
      await jpg.jpeg({ quality: 82, mozjpeg: true }).toFile(jpgDest);
      size = (await stat(jpgDest)).size;
      total += size;
      rows.push([file, `${base}.jpg`, `${kb(size)} KB`]);
    }
  }

  rows.sort((a, b) => parseFloat(b[2]) - parseFloat(a[2]));
  console.log('\nOptimized assets -> public/images\n');
  for (const [from, to, size] of rows) {
    console.log(`  ${size.padStart(9)}  ${to.padEnd(28)} (from ${from})`);
  }
  console.log(`\n  ${rows.length} files, ${kb(total)} KB total\n`);

  const over = rows.filter((r) => parseFloat(r[2]) > 150);
  if (over.length) {
    console.warn('WARNING: files over 150 KB:', over.map((r) => r[1]).join(', '));
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
