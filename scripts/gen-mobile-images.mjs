/* Generates small mobile variants of the service background images used in the
 * services carousel (HorizontalCapabilities). The carousel shows them at card
 * size, but the source files are ~1600px - decoding 8 of them at once is ~48 MB
 * of RAM, a primary cause of the iOS Safari memory crash on scroll.
 *
 * For each public/<name>_bg.webp we emit public/<name>_bg-sm.webp at MAX_W wide.
 * Touch devices load the -sm variant via <picture media="(pointer: coarse)">;
 * desktop and the full-screen detail page keep the full image.
 *
 * Runs in prebuild. Skips gracefully if sharp is unavailable.
 */
import { readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

let sharp;
try {
  sharp = (await import('sharp')).default;
} catch {
  console.warn('[gen-mobile-images] sharp not installed - skipping.');
  process.exit(0);
}

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = join(root, 'public');
const MAX_W = 800;
const QUALITY = 72;

const bgFiles = readdirSync(publicDir).filter((f) => /_bg\.webp$/.test(f));
let n = 0;
for (const f of bgFiles) {
  const src = join(publicDir, f);
  const out = join(publicDir, f.replace(/\.webp$/, '-sm.webp'));
  const meta = await sharp(src).metadata();
  await sharp(src)
    .resize({ width: Math.min(MAX_W, meta.width || MAX_W), withoutEnlargement: true })
    .webp({ quality: QUALITY, effort: 5 })
    .toFile(out);
  n += 1;
  console.log(
    `[gen-mobile-images] ${f} -> ${f.replace(/\.webp$/, '-sm.webp')} ` +
      `(${(statSync(out).size / 1024).toFixed(0)}KB)`
  );
}
console.log(`[gen-mobile-images] wrote ${n} mobile variant(s)`);
