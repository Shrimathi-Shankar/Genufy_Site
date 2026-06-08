/* Converts raster images under public/ to WebP (Approach A from
 * docs/performance-optimization-plan.md).
 *
 * - Walks public/ recursively, converts every .png/.jpg/.jpeg to .webp.
 * - Downscales oversized images (certificates especially) so a multi-MB photo
 *   saved as PNG becomes a small WebP.
 * - Deletes the original raster after a successful conversion so the deployed
 *   bundle ships WebP only (originals stay in git history if you need them).
 * - Skips EXCLUDE files (favicon + the social/OG logo, where wide raster format
 *   support still matters).
 *
 * Runs automatically before `dev`/`build` via package.json. If `sharp` is not
 * installed (e.g. a production install that omits devDependencies) the script
 * warns and exits 0 so the build never breaks.
 *
 * Flags:
 *   --keep-originals   convert but do NOT delete the source files
 *   --quality=NN       WebP quality (default 80)
 */
import { readdirSync, statSync, existsSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, extname, relative, sep } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const publicDir = join(root, 'public');

// Files (relative to public/, POSIX-style) to leave as their original format.
const EXCLUDE = new Set(['favicon.png', 'logo.png']);

// Per-path max width (longest images don't need full resolution). Anything not
// matched uses DEFAULT_MAX_WIDTH.
const DEFAULT_MAX_WIDTH = 1920;
const PATH_MAX_WIDTH = [
  { test: (p) => p.startsWith('certificate_folder/'), max: 1200 },
  { test: (p) => p.startsWith('clients/') || p.startsWith('logos/'), max: 900 },
];

const args = process.argv.slice(2);
const KEEP_ORIGINALS = args.includes('--keep-originals');
const QUALITY = Number((args.find((a) => a.startsWith('--quality=')) || '').split('=')[1]) || 80;

let sharp;
try {
  sharp = (await import('sharp')).default;
} catch {
  console.warn('[convert-images] sharp not installed - skipping WebP conversion.');
  process.exit(0);
}

const RASTER_RE = /\.(png|jpe?g)$/i;

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

function maxWidthFor(relPosix) {
  for (const rule of PATH_MAX_WIDTH) if (rule.test(relPosix)) return rule.max;
  return DEFAULT_MAX_WIDTH;
}

const files = walk(publicDir).filter((f) => RASTER_RE.test(f));
let converted = 0;
let savedBytes = 0;
const failures = [];

for (const file of files) {
  const relPosix = relative(publicDir, file).split(sep).join('/');
  if (EXCLUDE.has(relPosix)) continue;

  const out = file.slice(0, -extname(file).length) + '.webp';
  try {
    const srcBytes = statSync(file).size;
    let pipeline = sharp(file).rotate(); // respect EXIF orientation
    const meta = await pipeline.metadata();
    const maxW = maxWidthFor(relPosix);
    if (meta.width && meta.width > maxW) {
      pipeline = pipeline.resize({ width: maxW, withoutEnlargement: true });
    }
    await pipeline.webp({ quality: QUALITY, effort: 5 }).toFile(out);

    const outBytes = statSync(out).size;
    savedBytes += srcBytes - outBytes;
    converted += 1;
    console.log(
      `[convert-images] ${relPosix} -> ${relPosix.replace(RASTER_RE, '.webp')}  ` +
        `(${(srcBytes / 1024).toFixed(0)}KB -> ${(outBytes / 1024).toFixed(0)}KB)`
    );

    if (!KEEP_ORIGINALS && existsSync(out)) rmSync(file);
  } catch (err) {
    failures.push(relPosix);
    console.error(`[convert-images] FAILED ${relPosix}: ${err.message}`);
  }
}

console.log(
  `[convert-images] converted ${converted} file(s), ` +
    `saved ~${(savedBytes / 1048576).toFixed(1)} MB` +
    (KEEP_ORIGINALS ? ' (originals kept)' : ' (originals removed)') +
    (failures.length ? `, ${failures.length} failure(s)` : '')
);
