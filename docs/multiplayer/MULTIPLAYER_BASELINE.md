# Race Together · Phase 1 baseline

Captured before multiplayer code changes on 2026-09-25.

- Commit: `36f9b952ab500315c1c5b905e542a85252a1f96b`.
- `npm test`: PASS, 8/8 Vitest tests.
- `npm run build`: PASS; Vite reports 592.70 kB JS (156.66 kB gzip), 13.54 kB CSS (3.82 kB gzip), and 0.63 kB HTML. Vite's 560 kB chunk warning remains.
- `npm run gate`: PASS on an escalated local-only loopback run after the sandbox initially denied `127.0.0.1` binding (`EPERM`). All 14 checks passed, including real desktop and mobile input, countdown lock, AI movement, reset, no 404s, and no console errors. The receipt is `receipts/playtests/current/gate-report.json`. Sampled desktop movement was 13.35 m after throttle; mobile moved 10.16 m. Sampled FPS was approximately 60 after launch; the sampled maximum was 358 draw calls and 43,864 triangles.
- No multiplayer server, room state, network event contract, or direct WebSocket dependency exists. `ws` is currently present only transitively through Puppeteer.

## Existing architecture to preserve

- `src/main.ts`: Three.js renderer, three track layouts, scene composition, menu and race UI, keyboard/touch input, countdown, race lifecycle, AI movement, checkpoint/lap tracking, championship results, telemetry.
- `src/race.ts`: pure handling, three AI tuning profiles, race list, checkpoint helper, championship scoring/tie-break.
- `src/road_system.ts`: generated road ribbons and route samples.
- `src/assets/*.js`: code-built articulated vehicles and environment objects.
- `src/audio.ts`: user-unlocked Web Audio race feedback.
- `src/race.test.ts`: existing pure race and handling checks.
- `scripts/road-zero-gate.mjs`: real browser single-player keyboard/touch gate, requiring a local loopback server.
- `vite.config.ts` and `scripts/serve-dist.mjs`: Vite development and static production serving; neither currently supports a multiplayer socket endpoint.

## Existing race lifecycle

The menu selects Championship or Quick Race. `resetRace()` builds a selected track, places one player and three AI rivals, and begins a 3.7-second input-locked countdown. The player is simulated locally with `stepCar`; AI use route progress and rival tuning. Ordered route progress advances lap/checkpoint state; finish computes order, points, standings, and next-race/replay actions. Phase 1 will add separate menu/lobby screens and will stop at a synchronized `loading` placeholder. It must not alter the running single-player race loop.
