# All-Browser "Loading Loop" — Investigation & Fix Plan (v2)

> Symptom: after a deploy, the site shows a continuous loading / reload state in
> **every** browser (not just iOS) and never renders.
> Host: a **Railpack / Railway-style container builder** (the deploy log shows
> `Railpack 0.15.4`), running a Next.js **server build** via `next start`.
> (Earlier notes said "cPanel" — corrected after the deploy log was seen.)
>
> Status: review-first plan. The two fixes already SHIPPED are in §2; the rest is
> diagnostic and not yet applied.

---

## 0. First question: is a *fixed* build actually live?

The last deploy failed in Railpack's prepare step:
`✖ Failed to ensure mise is installed: ... gzip: invalid header`. That fails
**before build**, so if it never succeeded, the fixes below are **not live** and
the origin still serves the old broken build (or nothing). Confirm what is
actually deployed *before* hunting client-side causes.

---

## 1. Already shipped (commit `5ea3b5e`)

- **`next.config.mjs`** — load `@next/bundle-analyzer` only when `ANALYZE=true`
  (guarded `require`). It is a devDependency; importing it at the top level
  crashed `next start` on production installs that omit devDependencies → server
  never booted → all browsers hung. `headers()` kept (correct on a Node host).
- **`Dockerfile` + `.dockerignore`** — deterministic build (`node:20-bookworm-slim`:
  install all deps → `npm run build` → `next start`). The platform builds from
  the Dockerfile and **skips Railpack's failing `mise` step**.

Verified locally: `npm run build` compiles (22 pages); `next.config.mjs` loads
with `ANALYZE` unset (no devDependency needed).

---

## 2. Ground truth (read-only, ~10 min) — run against the LIVE domain

1. Status + redirects:
   `curl -sS -o /dev/null -w "code=%{http_code} redirects=%{num_redirects} final=%{url_effective}\n" -L https://DOMAIN/`
   `curl -sSI https://DOMAIN/`  (headers: server, cf-*, location, set-cookie)
2. Assets served? `curl -sS -o /dev/null -w "%{http_code}\n" https://DOMAIN/_next/static/<chunk>.js`
3. Platform logs: did the **Dockerfile** build run (not `mise`)? runtime **stderr**
   (missing module / throw / "listening on PORT")?
4. Desktop Chrome DevTools on the live site:
   - **Network**: main doc status, redirect chain, failed/pending/404 requests.
   - **Console**: first error.
   - **Application → Service Workers** + **Cache Storage**: registered SW? stale caches?

---

## 3. Ranked hypotheses & their signatures

| # | Hypothesis | Signature |
|---|-----------|-----------|
| H1 | **Deploy never succeeded** (mise error) → old/no build live | platform's last *successful* deploy predates the fix |
| H2 | **Server won't boot** (missing module / startup / PORT / Node ver) | main doc **502/503**/timeout; stderr throw |
| H3 | **Stale service worker** from the old Vite SPA, cached per browser | works in **Incognito** / after **Clear site data**; Application→SW shows a registration |
| H4 | **Redirect loop** (proxy / Cloudflare SSL / www↔apex / HTTPS) | high `num_redirects` / "too many redirects"; cycling `location` |
| H5 | **Assets 404 / hang** (proxy strips `/_next`, chunk mismatch) | doc 200 but `/_next/static/*` 404/pending; blank, console chunk errors |
| H6 | **Client JS exception** each render | doc 200, console stack, blank page |

**Note (H3):** the site migrated **from a Vite/React-Router SPA**. If that old
site registered a service worker, it persists on every visitor's browser and
keeps serving a broken cached shell until explicitly unregistered — independent
of server redeploys. The current repo has **no** SW/PWA artifacts, so a stale SW
would be a leftover on the *origin*, only visible via DevTools on the live site.
This is the standout "persists across all browsers / survives redeploys" cause.

---

## 4. Targeted fix per finding

- **H1** — Make the deploy succeed: confirm the platform builds **from the
  Dockerfile** (set Builder = Dockerfile if needed). The `mise` error is also
  often transient — retry once.
- **H2** — Read stderr; ensure start boots `next start` bound to the injected
  `PORT`; Node ≥ 18.17. (Analyzer boot crash already fixed.)
- **H3 — service-worker killswitch.** Ship a self-unregistering SW at the **old
  SW's path** (need the exact path from DevTools; commonly `/sw.js` or
  `/service-worker.js`) + a one-time unregister snippet so visitors self-heal:
  ```js
  // public/sw.js
  self.addEventListener('install', () => self.skipWaiting());
  self.addEventListener('activate', async () => {
    await self.registration.unregister();
    for (const k of await caches.keys()) await caches.delete(k);
    for (const c of await self.clients.matchAll()) c.navigate(c.url);
  });
  ```
  plus an app-load unregister of any `navigator.serviceWorker` registration.
- **H4** — Fix at proxy/DNS (Cloudflare SSL "Full (strict)", one canonical host,
  no double HTTPS redirect); set `trailingSlash` consistently if relevant.
- **H5** — `assetPrefix`/`basePath` are unset (correct); ensure the Node app
  serves `/_next/static` and no proxy strips it.
- **H6** — Capture the stack (Console / iOS Web Inspector) and fix the throw.

---

## 5. Verify
Desktop Chrome/Firefox + iPhone: main doc **200**, renders, no loop. Also test a
fresh **Incognito/Private** window — if that works but a normal window loops,
it's a client cache / service worker (H3).

---

## 6. Debugging on iPhone (Safari/iOS)

**With a Mac (full DevTools):**
1. iPhone → Settings → Safari → Advanced → **Web Inspector = ON**.
2. USB-connect iPhone to Mac; trust it.
3. Mac Safari → Settings → Advanced → **Show Develop menu**.
4. Open the site on iPhone → Mac Safari → **Develop → [iPhone] → [page]**.
5. Real Console / Network / Storage (incl. **Service Workers / Caches** — kill a
   stale SW here).

**Without a Mac:**
- **Clear a stale SW/cache (often the whole fix):** iPhone Settings → Safari →
  **Clear History and Website Data**, or Advanced → Website Data → delete just
  the origin. Reload.
- **Bypass SW to test:** open the site in a **Private** tab (doesn't use the
  existing SW). Works there but not normally → client cache/SW (H3).
- **On-device console:** add `eruda`/`vConsole` + `window.onerror` reporter
  behind `?debug=1` so errors are readable on the phone.
- **Cloud real devices:** BrowserStack / LambdaTest (real iOS Safari + logs).

**iOS gotchas:** Private mode can make `localStorage`/IndexedDB throw; a SW
persists until cleared; `100vh` vs URL bar; stricter JS engine.

---

## 7. Prevention
- Never import a `devDependency` at the top of `next.config.*` (done — guarded).
- CI check: `npm ci --omit=dev && node -e "import('./next.config.mjs')"` to prove
  the config loads with production-only deps before deploy.
- Keep a service-worker killswitch at the legacy SW path for a release cycle
  after migrating away from any PWA.

---

## 8. To proceed I need
1. The **live domain** / the Phase-2 `curl` outputs, and whether the **last
   deploy succeeded** with the Dockerfile.
2. DevTools **Application → Service Workers** on the live site: **is one
   registered, and at what path?** (confirms/kills H3).
3. The platform **runtime stderr** snippet.

Then the fix is typically one of: (a) get the Dockerfile build to deploy,
(b) ship the **service-worker killswitch**, or (c) fix a proxy redirect.
