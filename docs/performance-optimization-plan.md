# Performance, Image (WebP) & UX Optimization — Implementation Plan

> Status: plan only. No app code changed by this document.
> Goals: convert all images to WebP and update references; improve loading
> speed, bundle size, caching, lazy loading, SEO, and overall UX across devices.

---

## 1. Current state (measured)

- **18.7 MB across 54 raster images.** Dominated by `public/certificate_folder/`
  (~16 MB of PNGs that are really photos/screenshots saved as PNG —
  `Certificate_12.png` alone is **4.2 MB**). This is the single biggest win.
- Other notable assets: service backgrounds (`/AI_bg.jpg` … 130–225 KB each),
  client logos (`/clients/*.png`), `logo.png` (129 KB), `cera2.mp4` (617 KB).
- **References are centralized and string-based** (easy to update):
  - Service images → `src/components/services/serviceData.js`
    (`image: '/AI_bg.jpg'`)
  - Certificates → `src/components/services/SalesforceExperience.jsx:912+`
    (`img: '/certificate_folder/Certificate_1.png'`)
  - Client logos → `src/components/clientsManifest.js` — **AUTO-GENERATED** by
    `scripts/gen-clients.mjs` (edit the script, not the output)
  - Products → `src/views/products/productData.js`
  - Logo / favicon → `app/layout.jsx`, `src/components/Header.jsx`
- `next.config.mjs` has `images: { unoptimized: true }` + plain `<img>` →
  **no WebP, no responsive `srcset`, no auto lazy/caching**, and no
  `width/height` → CLS risk.
- ⚠️ **Hosting mismatch:** `public/.htaccess` is set up for an **Apache/cPanel
  static export** (`.html` rewrites, `mod_expires` caching), but `next.config`
  comments describe a **Node host (`next start`)**. These imply different deploy
  targets and change the WebP/caching strategy — resolve this first.

---

## 2. Part 1 — Convert all images to WebP

WebP is supported on **all targets** (iOS Safari 14+, every modern
desktop/Android), so a `<picture>` PNG/JPEG fallback is optional, not required.

### Approach A — Build-time conversion script (recommended for current architecture)
Keeps the plain-`<img>` setup; lowest layout risk.

1. Add `sharp` as a **devDependency**; write `scripts/convert-images.mjs` that
   walks `public/`, writes a `.webp` next to each `.png`/`.jpg` at quality
   ~78–82, and downscales oversized files to sane max dimensions (certificates
   don't need >1600px wide — that's where 4 MB → ~150 KB happens).
2. Update centralized references `.png`/`.jpg` → `.webp`:
   - `serviceData.js`, `productData.js`, the certificate array in
     `SalesforceExperience.jsx`.
   - **`scripts/gen-clients.mjs`** so the regenerated `clientsManifest.js` emits
     `.webp` paths (editing the output gets overwritten on `dev`/`build`).
   - In-page logo in `layout.jsx` / `Header.jsx` (keep **favicon** as PNG/ICO
     for broad favicon support).
3. Decide replace-vs-keep originals. Given universal WebP support, **replacing**
   and swapping extensions is simplest. If you must keep fallbacks, wrap in
   `<picture><source type="image/webp">…</picture>`.
4. Wire conversion + `gen-clients` into the `prebuild` script so new images are
   always converted.

> Expected: ~18.7 MB → roughly **2–4 MB** of images (certificates do most of the
> work). Also **directly mitigates the iOS memory-crash loop** (see the iOS plan).

### Approach B — Re-enable the Next.js image optimizer (higher payoff, larger refactor)
On a Node host, `next/image` + `sharp` auto-serves **AVIF/WebP + responsive
`srcset` + lazy-load + long-cache** with no manual conversion.
- Remove `images.unoptimized`, add `sharp`, replace `<img>` with `next/image`
  (`fill` + `sizes` for `object-cover` layouts; explicit `width/height`
  elsewhere).
- Cost: touches many files (carousel, experiences, footer, hero), needs `sizes`
  tuning, risk of layout regressions in absolute-positioned designs.
- **Not compatible with a static Apache export** — Node/Vercel host only.

**Recommendation:** Approach A now (fast, safe, biggest byte win, helps iOS),
then optionally migrate hot images to Approach B if a Node host is confirmed.

---

## 3. Part 2 — Broader optimization opportunities (ranked)

### High impact
1. **Caching headers (host-dependent).**
   - Node host: add a `headers()` block in `next.config` for `public/` media
     (`Cache-Control: public, max-age=31536000, immutable`); `/_next/static` is
     already immutable.
   - Apache: `.htaccess` already does this — only if you actually deploy static.
   - *Align config to one host.*
2. **Shrink the JS bundle with `LazyMotion`.** `framer-motion` is used everywhere
   and is heavy. Switch to `LazyMotion` + the `m` component with `domAnimation`
   to drop a large chunk of the framer-motion runtime from first load. Measure
   with `@next/bundle-analyzer` first.
3. **Image bytes** — Part 1 (the biggest single lever).

### Medium impact
4. **Lazy-load discipline.** Every below-the-fold `<img>`: `loading="lazy"` +
   `decoding="async"`. The **hero/LCP** image: `fetchpriority="high"`, not lazy.
   Certificates (inside the Salesforce experience) should fetch only when that
   experience opens — already code-split via dynamic import; verify they aren't
   eagerly fetched.
5. **Prevent CLS.** Add explicit `width`/`height` or `aspect-ratio` to images now
   that no optimizer infers them.
6. **`cera2.mp4` (617 KB)** — `preload="none"` + a lightweight poster; consider a
   WebM/H.264 pair. (Desktop-only, but still negotiated.)
7. **Preconnect / dns-prefetch** for third parties: `api.emailjs.com` (contact
   submit) and the Spline CDN (3D scene).
8. **Defer non-critical init.** GSAP/Lenis start on mount (`src/hooks/useLenis.js`)
   — fine, but ensure ScrollTrigger and heavy effects respect
   `prefers-reduced-motion` site-wide (currently only the `enhanced` gate does).

### SEO
9. **Sitemap coverage gap.** `app/sitemap.js` lists only `/`, `/about`,
   `/products`, `/contact`. Missing: `/insights`, `/services` + the 8
   `/services/[slug]` pages, and product detail pages. Add them (keep noindex
   placeholders out).
10. **Real OG image.** OG/Twitter point at `/logo.png` (`app/layout.jsx:63`) —
    create a dedicated 1200×630 `og-image` so link previews render properly.
11. **Alt text for meaningful images.** Decorative backgrounds correctly use
    `alt=""`, but **client logos and certificates** should have descriptive
    `alt` (brand / certification names) for a11y + image SEO.
12. **Structured data.** `Organization` JSON-LD exists; add `BreadcrumbList` on
    detail pages and `Service`/`Offer` schema for services.

### Process / measurement
13. Add `@next/bundle-analyzer`; run **Lighthouse (mobile)** + **WebPageTest**
    before/after each change; set a simple performance budget to catch
    regressions.

---

## 4. Suggested rollout (phased)

- **Phase 0 — Confirm hosting** (Node `next start`/Vercel vs Apache static
  export). Picks caching + WebP-optimizer strategy; resolves the
  `.htaccess` ↔ `next.config` mismatch.
- **Phase 1 — WebP conversion (Approach A)** + reference updates +
  `gen-clients.mjs` edit. Biggest, safest win; also helps iOS.
- **Phase 2 — Caching headers + lazy / `fetchpriority` / CLS dimensions +
  video / preconnect.**
- **Phase 3 — `LazyMotion` bundle reduction** (measure with analyzer).
- **Phase 4 — SEO: sitemap, OG image, alt text, structured data.**
- **Phase 5 — Measure (Lighthouse/WebPageTest) and lock in a budget.**

---

## 5. Key decision that drives several items

**What is the production host?**

- **Node host (`next start` / Vercel)** → lean toward re-enabling `next/image`
  (Approach B) for hot images + `headers()` caching; the `.htaccess` is dead and
  can be removed.
- **Apache / cPanel static export** → Approach A only (no optimizer); keep/tune
  `.htaccess` caching; `next.config` needs `output: 'export'`.

---

## 6. Expected outcomes
- Images: ~18.7 MB → ~2–4 MB; faster LCP, lower iOS memory pressure.
- Smaller JS first-load via `LazyMotion`.
- Proper caching → fast repeat visits.
- No layout shift (explicit dimensions).
- Better link previews + crawl coverage + a11y via SEO fixes.
