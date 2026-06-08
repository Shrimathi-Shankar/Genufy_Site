# iPhone-Only Loading Loop — Implementation Plan (v2, narrowed)

> Updated after live testing. The earlier version treated this as possibly
> server/deploy/SW related; those are now **ruled out** (see below).

## Confirmed state (what we know now)

| Tested | Result | Conclusion |
|--------|--------|-----------|
| Desktop browsers | **Renders fine** | Server, build, deploy, redirects are OK |
| iPhone Safari | **Loops / never renders** | Problem is **iOS-client-side** |
| iPhone Private tab | Still loops | **Not** a service worker |
| iPhone after Clear Website Data | Still loops | **Not** cached data |

Code scan also found **no** iOS-unsupported JS APIs, **no** resize/setState loop
on the mobile path (canvas particles + Spline robot are already gated off on
phones), and no client redirect loop. So this is a **runtime failure specific to
iOS Safari** — either:

- **H-A: iOS-only JavaScript exception** during boot/hydration, or
- **H-B: iOS memory-pressure crash → auto reload loop** (Safari kills the tab for
  exceeding its tight per-tab memory budget, then reloads → repeat).

We cannot tell which without seeing the device — hence Step 1.

---

## Step 1 — Make the iPhone show its error (instrumentation)

**Status: staged locally (uncommitted)** in `app/layout.jsx`.

An on-device debug overlay that activates **only** with `?debug=1` (no effect for
normal visitors). It installs `window.onerror` / `onunhandledrejection` handlers
in `<head>` *before* the app boots, so it captures hydration/boot crashes that
are otherwise invisible on iOS. It also lazy-loads `eruda` for a full console.

Rollout: commit/push → deploy → on the iPhone open `https://DOMAIN/?debug=1`.

**Read the overlay:**
- **A `JS ERROR` / `PROMISE REJECT` with a stack appears** → **H-A** (JS
  exception). Copy the text; fix the exact failing code.
- **Boot lines appear, then the page reloads with no error** → **H-B** (memory
  crash; the tab was killed before throwing).
- **Overlay never appears** → document/JS not loading on iOS → re-check network
  (status, a hung/redirected request).

---

## Step 2 — Fix per finding

### H-B (memory) — most likely; the targeted fix
On phones, disable the GPU/memory-heavy hero layers that still run on every
device today, swapping in a cheap static gradient:
- `filter: blur(60px)` aurora — `app/globals.css:70` (`.aurora-layer`).
- fixed full-screen `mix-blend-mode: overlay` noise — `app/globals.css:48`
  (`.noise`).

Implementation:
- Add a real **mobile/iOS detection** (CSS `@media (pointer: coarse)` and/or a
  JS `matchMedia('(pointer: coarse)')` / `navigator.maxTouchPoints` check; detect
  iPadOS via `navigator.platform === 'MacIntel' && maxTouchPoints > 1`).
- Gate the aurora blur + noise off (or drastically reduce blur radius) on phones.
- Already done and compounding: WebP images (decoded-memory cut), reduced-motion
  handling, Spline/canvas gated off on mobile.

### H-A (JS exception) — fix exactly what the overlay reports
Patch the throwing code (and wrap the iOS-suspect path). Common iOS-only
offenders: stricter regex/`Intl`/`Date`, private-mode storage throwing,
a feature used before its dynamic chunk resolves.

### Safety net (either case)
Add `app/global-error.jsx` so a root-level render throw shows a branded error
screen instead of a blank/looping page (and surfaces the error).

---

## Step 3 — Verify
On the iPhone (normal, no `?debug`): page renders, no loop, first paint within a
couple of seconds, scroll smooth. Regression-check desktop + Android.

---

## Step 4 — Clean up
Once fixed, the `?debug=1` overlay can stay (it's inert without the flag) or be
removed. Keep `app/global-error.jsx`.

---

## iPhone debugging reference

**With a Mac (full DevTools):** iPhone Settings → Safari → Advanced → Web
Inspector ON; USB connect; Mac Safari → Develop → [iPhone] → [page] → real
Console / Network / Storage.

**Without a Mac:** use the `?debug=1` overlay above; or BrowserStack /
LambdaTest real iOS devices; Private tab to bypass cache (already tested).

---

## What I need to finish this
1. Approve commit/push + deploy of the `?debug=1` overlay (Step 1).
2. Send me what `https://DOMAIN/?debug=1` shows on the iPhone.

Then I implement the matching fix (H-B mobile-gate the blur/noise, or H-A the
specific throw) — optionally I can stage the H-B fix in the *same* deploy so if
it's memory, it's fixed immediately while the overlay still captures any error.
