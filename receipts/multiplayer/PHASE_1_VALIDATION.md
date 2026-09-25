# Race Together · Phase 1 validation

Date: 2026-09-25. Baseline commit: `36f9b952ab500315c1c5b905e542a85252a1f96b`.

## Delivered boundary

The landing menu now offers Race Together without replacing Championship or Quick Race. A host chooses 2–4 racers, 1/2/3/5 laps, and one of the three existing tracks. The Node room server allocates a six-character code; invite links use the current origin and `/race/:code`. Code/link joining, eight original analog driver portraits, safe generated nicknames, local profile persistence, live cards, copy/share controls, ready/unready, host-only proceed, host migration, reconnect tokens, and per-player track-loading acknowledgements are implemented. The state stops at `loading`; no online car driving, countdown, or voice was started in Phase 1.

Optional custom portraits use a server-side Cloudinary signed image upload. The browser receives cloud name, public API key, constrained upload parameters, and a signature, never the API secret. The client checks image MIME and a 2 MB limit, crops to 256×256 JPEG, and defaults remain usable if upload fails or credentials are absent. No Cloudinary credentials were available here, so the signed happy path was **not** live-tested.

## Tests actually run

- `npm run typecheck`: PASS.
- `npm test`: PASS, 8/8 existing race/handling tests.
- `npm run test:multiplayer`: PASS, 7/7 room-manager suites covering 2/3/4 capacity, unique and normalized codes, invalid/full/started joins, profile validation/propagation, ready and host rules, loading flags, leave/reset, host migration, reconnect without duplicate identity, and custom-avatar rejection/default fallback.
- `npm run build`: PASS. Built HTML 0.63 kB, CSS 17.56 kB, JS 606.93 kB (raw Vite output); Vite still reports its 560 kB chunk warning. No new 3D geometry was added.
- `node scripts/multiplayer-gate.mjs`: PASS, 23/23 browser checks across separate Chromium browser contexts. Four clients joined one room via direct link and normalized code; copy code/link, profile propagation, ready and unready, host-only proceed, shared loading and loaded cards, and post-start rejection were observed. A second two-driver room confirmed visible host transfer and reconnect without a duplicate player. No page errors, console errors, or 404 responses were observed. Machine-readable result: [phase-1-browser-gate.json](phase-1-browser-gate.json). Visual captures: [waiting](phase-1-waiting.png), [ready](phase-1-ready.png), [loading](phase-1-loading.png).
- `node scripts/road-zero-gate.mjs dist receipts/playtests/current`: PASS, 14/14 existing single-player keyboard/touch checks. Championship desktop driving, Quick Race mobile touch, AI motion, reset, countdown lock, no asset 404s, and no console errors were observed. Receipt: [gate-report.json](../playtests/current/gate-report.json).
- Existing running Vite development proxy responded to `GET /api/avatar/config` with `{"available":false,"maxBytes":2000000}`.
- A scan of the built `dist/` for `CLOUDINARY_API_SECRET`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_CLOUD_NAME` returned no matches.
- `git diff --check`: PASS.

The final sampled single-player browser gate reported 59.997 FPS, 360 draw calls, and 44,184 triangles at its highest sampled racing state. These are samples from local headless Chromium, not a device-wide performance guarantee.

## Limits and next phase boundary

The Cloudinary signed upload success path could not be tested without server credentials; the unavailable/failure path was tested. The browser gate used emulated Chromium contexts, not physical phones. The existing custom single-player gate exercised real touch events in a mobile viewport. Online driving, countdown, race authority, and voice belong to later phases and were deliberately not implemented. No deployment or live URL check was performed.
