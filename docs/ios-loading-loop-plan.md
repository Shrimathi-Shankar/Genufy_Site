# iOS Safari "Infinite Loading Loop" — Diagnosis & Implementation Plan

> Status: investigation + plan. No app code changed by this document.
> Scope: site renders correctly on all devices/browsers **except iOS** (mobile
> Safari especially), where the page appears to load continuously / reload in a
> loop instead of rendering.

---

## 1. What the symptom actually means

The phrase "infinite loading loop" covers two very different failures:

1. **Crash-and-reload loop** — the page paints (fully or partially), iOS Safari
   kills the tab for exceeding its memory budget, then auto-reloads it, forever.
   Tell-tale messages: *"This webpage was reloaded because it was using
   significant memory"* / *"A problem repeatedly occurred."*
   **This is the most likely case here** (see hypotheses below).
2. **Spinner never completes** — a subresource (font / video / redirect) never
   resolves, so Safari's progress bar never finishes.

**First diagnostic action:** on the device, watch whether content *flashes then
reloads* (→ crash loop, H1/H4) or *stays blank with the spinner spinning*
(→ hung resource / redirect / JS, H2/H3).

---

## 2. Ranked root-cause hypotheses (grounded in the code)

### H1 — iOS memory-pressure crash → reload loop (most likely)
iOS Safari has a much tighter per-tab memory ceiling than desktop Chrome. The
hero is GPU/memory-expensive even on phones (the Spline robot is gated off, but
these still run on iPhone):

- `app/globals.css:70` — full-screen `filter: blur(60px)` aurora layer. Large
  blur radii are a known iOS memory/compositor killer.
- `app/globals.css:48-52` — fixed, full-screen `mix-blend-mode: overlay`
  SVG-noise overlay, always on.
- Stacked radial gradients + `mask-image` in `HeroBackdrop`
  (`src/components/HeroGenufy.jsx:401`) and the aurora mask.
- Continuous `requestAnimationFrame` canvas particle field
  (`src/components/HeroGenufy.jsx:13`) + GSAP ticker + Lenis raf running nonstop
  (`src/hooks/useLenis.js`).
- Large decoded images (see the WebP plan). Git history
  (*"downscale oversized service images 98MB→48MB decoded"*, *"pause off-screen
  canvas"*, *"content-visibility on safe sections"*) shows mobile memory was
  already a recurring problem — iOS is where it tips over.

### H2 — Stale Service Worker from a previous deploy
If this origin ever served a different stack (Vite/CRA/`next-pwa`) that
registered a service worker, iOS devices that visited it can have a SW stuck in
cache serving a broken shell and looping. The repo has no SW now — which is
exactly why it would be invisible in code.
- Note: `public/.htaccess` shows the site was previously an **Apache/cPanel
  static export** (`.html` rewrites, `mod_expires`), while `next.config.mjs` now
  describes a **Node host (`next start`)**. This deploy-target mismatch makes a
  stale-artifact / stale-SW scenario more plausible.
- Caveat: a stale SW is usually *device*-specific, not strictly OS-specific, so
  this is secondary.

### H3 — iOS-Safari-only JS / hydration exception during boot
Safari is stricter than Chrome (regex features, `Intl`/`Date` timezone
behavior, private-mode storage throwing). `app/error.jsx` would normally catch
and show a recovery screen — unless the throw happens in an effect that re-runs,
or before hydration, which can present as a loop.

### H4 — iPad-specific WebGL crash
iPad in landscape is ≥1024px wide with `hardwareConcurrency ≥ 4`, so
`useEnhancedMotion` (`src/hooks/useEnhancedMotion.js`) returns `true` and the
**Spline WebGL robot mounts** (`src/components/HeroGenufy.jsx:569,579`) → large
memory spike → crash-reload loop. The gate is width-based, not a real
mobile/Safari check, and **iPadOS reports as desktop Safari**, so it slips
through. If "iOS" includes iPad, this is a strong contributor.

### H5 — Viewport / Lenis edges (lowest priority)
`100dvh` (`src/components/HeroGenufy.jsx:478`) is fine on modern iOS; older iOS
falls back to `h-screen` (100vh) — not a loop. `html.lenis { height: auto }` +
hidden scrollbars usually cause scroll jank, not loops.

---

## 3. Debugging approach (confirm before fixing)

**A. Classify the loop type** (see §1) — 5 minutes, decides the path.

**B. Get a console off the device:**
- *With a Mac (best):* iPhone → Settings → Safari → Advanced → Web Inspector ON;
  connect via USB; Mac Safari → Develop → [device] → inspect. Watch the Console
  for the first throw and the Network tab for a request stuck "pending" or a
  redirect chain.
- *Without a Mac:* temporarily inject an on-screen console (`eruda` or
  `vConsole`) behind a `?debug=1` query param so errors are readable on the
  phone; and/or use BrowserStack / LambdaTest real iOS devices.

**C. Rule out infrastructure:**
- `curl -A "<iPhone Safari UA>" -IL https://genufy.in` — look for an
  iOS-UA-only redirect loop or odd headers.
- iOS Safari → Settings → Safari → Advanced → Website Data: check the origin for
  a registered service worker; clear it and retest.

**D. Confirm memory (H1/H4):** use the Mac inspector's Memory timeline, or A/B
test a build with the hero visual layers disabled (Phase 2) — if the loop stops,
it's memory.

---

## 4. Implementation plan (phased: isolate, then fix)

### Phase 0 — Reproduce & instrument
- Confirm it's the **deployed** build, not local.
- Capture the loop type (§1).
- Add a `?debug=1`-gated on-screen console + `window.onerror` /
  `onunhandledrejection` reporter so the first throw is visible on-device.

### Phase 1 — Eliminate infrastructure causes
- Check redirects/headers (§3C).
- Clear and re-check for a stale Service Worker. If one exists, ship a small
  unregister-and-reload guard so existing iOS users self-heal:
  - On load, `navigator.serviceWorker.getRegistrations()` → `unregister()` all,
    clear caches, reload once (guarded with a flag to avoid a new loop).
- Resolve the `.htaccess` ↔ `next.config` host mismatch (pick one target).

### Phase 2 — Bisect the heavy hero (decisive test)
Behind a temporary flag (or quick local toggles), disable in order and retest
on-device after each — whichever removal stops the loop is the culprit:
1. `blur(60px)` aurora (`app/globals.css:65-103`)
2. fixed `mix-blend-mode` noise overlay (`app/globals.css:48`)
3. `content-visibility: auto` (`app/globals.css:41`) — has iOS rendering history
4. canvas particles (`src/components/HeroGenufy.jsx:13`)

### Phase 3 — Apply targeted fixes
- **Real mobile/iOS detection** (not width). Add a `pointer: coarse` /
  `navigator.maxTouchPoints` check (and detect iPadOS:
  `navigator.platform === 'MacIntel' && maxTouchPoints > 1`). Use it to:
  - skip the `blur(60px)` aurora + mix-blend noise on phones (swap for a cheap
    static gradient), and
  - ensure the Spline robot never mounts on any touch/iOS device — gate
    `src/components/HeroGenufy.jsx:569` on pointer/touch, not `innerWidth>=1024`.
- **Cut GPU/memory footprint:** reduce blur radius drastically or replace
  blurred layers with pre-baked gradient images on mobile; cap canvas `dpr`
  lower on mobile; compress/lazy-load images (see the WebP plan — directly
  reduces memory pressure).
- **Harden boot (H3):** wrap iOS-suspect paths once the console confirms the
  throw; keep the `?debug=1` reporter until verified.
- **Viewport (H5):** keep `100dvh`; add an `@supports` fallback only if old iOS
  shows up in analytics.

### Phase 4 — Verify
- Real **iPhone** and **iPad (landscape)**, plus regression-check desktop /
  Android. Confirm: no reload loop, first paint < a few seconds, scroll smooth.

---

## 5. iOS Safari gotcha checklist
- Tight per-tab memory budget → heavy blur / gradients / large images cause
  crash-reload loops.
- Big `filter: blur()` and `backdrop-filter` are disproportionately expensive.
- `content-visibility: auto` has had iOS rendering bugs.
- iPadOS masquerades as desktop Safari → width/UA gating misfires.
- `100vh` includes the URL bar (use `dvh` / `svh`).
- Private mode can make `localStorage` / IndexedDB throw.
- Autoplay video needs `muted` + `playsInline` (current video is correct).
- Stale Service Workers persist across deploys and only bite returning devices.

---

## 6. Likely fix summary (once confirmed)
Most probable: **H1 + H4** — reduce hero GPU/memory cost on mobile and gate
Spline/WebGL behind a true touch/iOS check rather than viewport width. The WebP
image work compounds this by cutting decoded-image memory. Keep H2/H3 checks in
the rollout to rule out a stale SW or an iOS-only exception.
