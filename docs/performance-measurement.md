# Performance Measurement & Budget

How to measure performance before/after a change and catch regressions. Covers
item 13 of [performance-optimization-plan.md](./performance-optimization-plan.md).

---

## Tooling installed

| Tool | Command | Purpose |
|------|---------|---------|
| `@next/bundle-analyzer` | `npm run analyze` | Treemap of what's in each JS bundle (opens HTML). |
| `@lhci/cli` | `npm run build` then `npm run lhci` | Lighthouse (mobile) on key routes, asserted against the budget. |
| Lighthouse budget | `budget.json` | Resource-size + timing budgets (used by LHCI and `lighthouse --budget-path`). |
| LHCI config | `lighthouserc.json` | Which URLs to test, how many runs, and the assertions. |

> `npm run analyze` uses `cross-env` so it works on Windows and POSIX shells.
> LHCI requires Chrome to be installed locally / on the CI runner.

---

## Performance budget (the regression guard)

Defined in `budget.json` and asserted in `lighthouserc.json`. Current thresholds
(intentionally a little loose so they flag real regressions, not noise):

- **Script size** ≤ 300 KB · **Total transfer** ≤ 2.5 MB · **Image** ≤ 1.2 MB · **Font** ≤ 200 KB
- **LCP** ≤ 4.0 s · **TBT** ≤ 600 ms · **CLS** ≤ 0.1 · **TTI** ≤ 5.0 s
- Lighthouse category minimums: Performance ≥ 0.80, A11y ≥ 0.90, SEO ≥ 0.90, Best-Practices ≥ 0.90

Assertions are set to `warn` (visible, non-blocking). To make regressions **fail**
CI, change `"warn"` → `"error"` in `lighthouserc.json`. Tighten the numbers as
the site improves so the budget ratchets down over time.

---

## Before/after procedure (run for every perf change)

1. **Bundle:** `npm run build` and note the per-route **First Load JS** table, or
   `npm run analyze` for the treemap. Compare against the baseline below.
2. **Lighthouse (mobile):** `npm run build` then `npm run lhci` (3 runs per URL,
   mobile form factor by default). Read the asserted budget results; the run also
   uploads a temporary public report link.
   - Manual alternative: Chrome DevTools → Lighthouse → **Mobile** → Analyze.
3. **WebPageTest** (real-world, throttled): https://www.webpagetest.org
   - Test the **deployed** URL, Location: a relevant region, Device: a mid-tier
     Android (e.g. Moto G), Connection: 4G, Runs: 3 (use median).
   - Watch: Start Render, LCP, TBT, Total Bytes, and the request waterfall
     (look for render-blocking or oversized resources).
4. Record the new numbers; if anything regresses past the budget, fix before merge.

---

## Baseline (snapshot after the current optimizations)

### First Load JS per route — before vs after the LazyMotion change
| Route | Before | After |
|-------|-------:|------:|
| `/` | 208 kB | **189 kB** |
| `/about` | 130 kB | **99.6 kB** |
| `/about-us`, `/partners`, `/insights`, `/careers` | 140 kB | **109 kB** |
| `/contact` | 133 kB | **103 kB** |
| `/products` | 146 kB | **127 kB** |
| `/services` | 149 kB | **130 kB** |
| `/services/[slug]` | 137 kB | **117 kB** |
| shared chunk | 87.8 kB | 87.8 kB |

### Images
- `public/` raster converted to WebP: **~18.7 MB → ~1.5 MB** (certificate photos
  were the bulk). `favicon.png`, `logo.png`, and `og-image.png` intentionally
  stay PNG.

### Caching
- `public/` media served with `Cache-Control: public, max-age=31536000, immutable`
  (verified via `next start`). `/_next/static` is hashed + immutable by Next.

Update this section whenever a perf change lands so the next "before" is accurate.
