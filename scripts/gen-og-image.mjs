/* Generates public/og-image.png (1200x630) - the social/link-preview image
 * referenced by app/layout.jsx (openGraph + twitter).
 *
 * Built from a branded gradient background + the Genufy wordmark (logo.png)
 * composited on top, so it does not depend on system fonts for the brand mark.
 * Run on demand:  node scripts/gen-og-image.mjs
 */
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

let sharp;
try {
  sharp = (await import('sharp')).default;
} catch {
  console.warn('[gen-og-image] sharp not installed - skipping.');
  process.exit(0);
}

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const W = 1200;
const H = 630;

const bg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <linearGradient id="base" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#04090a"/>
      <stop offset="55%" stop-color="#050e0c"/>
      <stop offset="100%" stop-color="#061310"/>
    </linearGradient>
    <radialGradient id="glowTeal" cx="18%" cy="80%" r="60%">
      <stop offset="0%" stop-color="#24baac" stop-opacity="0.40"/>
      <stop offset="100%" stop-color="#24baac" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glowLime" cx="85%" cy="22%" r="55%">
      <stop offset="0%" stop-color="#90eb61" stop-opacity="0.28"/>
      <stop offset="100%" stop-color="#90eb61" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#base)"/>
  <rect width="${W}" height="${H}" fill="url(#glowTeal)"/>
  <rect width="${W}" height="${H}" fill="url(#glowLime)"/>
  <!-- top accent line -->
  <rect x="0" y="0" width="${W}" height="4" fill="#24baac" opacity="0.5"/>
  <!-- tagline (generic font; the brand mark is the composited logo) -->
  <text x="${W / 2}" y="438" text-anchor="middle"
        font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="600"
        fill="#e6f7f3">Intelligent Digital Solutions &amp; AI</text>
  <text x="${W / 2}" y="486" text-anchor="middle"
        font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="400"
        fill="#9fb4ae">Salesforce · AI/ML · Data Engineering · Enterprise Platforms</text>
</svg>`;

const logo = await sharp(join(root, 'public', 'logo.png'))
  .resize({ width: 560, withoutEnlargement: false })
  .toBuffer();
const logoMeta = await sharp(logo).metadata();

await sharp(Buffer.from(bg))
  .composite([
    { input: logo, top: Math.round(250 - logoMeta.height / 2), left: Math.round((W - logoMeta.width) / 2) },
  ])
  .png()
  .toFile(join(root, 'public', 'og-image.png'));

console.log('[gen-og-image] wrote public/og-image.png (1200x630)');
