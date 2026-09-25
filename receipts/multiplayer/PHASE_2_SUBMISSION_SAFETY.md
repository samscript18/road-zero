# Phase 2 submission-safety validation

Date: 2026-09-25. Preserved checkpoints: Phase 1 `5d9bd59`; Phase 2 `d74d4a7`. This pass began on the later `da7bde9` working-tree HEAD and does not replace either checkpoint. No Phase 3, actual deployment, 3D asset, or credential work was undertaken.

## Official guidance and the generic playtest

Read the current official `docs/gates.md`, `docs/verify-loop.md`, and `harness/playtest.mjs` in the cloned 404 recipe. `gates.md` explicitly warns that its generic arrow-key route is unsuitable for many games and calls for a genre-specific real-input gate. The current harness has six fixed legs: forward 50 m, forward+right 18 m, forward 45 m, forward+left 18 m, forward 45 m, forward+right 20 m. It does not follow this track's centreline, brake, or recover from a verge.

At `d74d4a7`, the generic playtest exited 1: **188.8/196 m**, one stalled leg, no reported console/404 or cost failure. Its filmstrip also exposed a test-integration issue: no `#startb` existed, so the harness called `__START__`, which invoked `resetRace()` without hiding the main menu. The game drove behind the menu. This pass makes the hook use the existing Championship start path; the real Championship button remains unchanged.

After restoring single-player forward pace and rebuilding, the official generic playtest was rerun with installed system Chrome. It again exited **1**: **173.5/196 m**, one stalled leg; peak **325 draws / 41,936 triangles**, minimum sampled **~60 FPS**. The fifth leg (45 m of forward-only input) is the stall. Frames 3→4 advance only about 21 m in world displacement while the car is visibly on the outside verge; frame 4 still reports ~9.6 m/s. The road bends away from the harness's fixed heading. The existing verge constraint pulls the off-road car back toward the track each frame, cancelling much of that forward-only travel. The final 20 m turning leg then runs. This is a **generic route/handling mismatch**, not evidence that normal steering, recovery, or inputs have regressed. No road geometry or driving tune was changed to satisfy that route. The official playtest still does not test the real start button because this game's actual button is `#championship`, not `#startb`.

## Scope correction

Comparison with `5d9bd59` confirmed that Phase 2 had changed shared forward `CAR_TUNE` (43→32 m/s, 15.5→12.5 acceleration, 28→26 braking) and all three AI top speeds. That unintentionally slowed Championship and Quick Race. Their approved forward acceleration, braking, speed limit, and rival speeds are restored. Race Together alone passes the lower 32 m/s tune to the same controller. The shared off-road reverse improvement and car-overlap response remain, because they address the reported control/collision defects. A unit test now locks the single-player and multiplayer limits separately.

## Local results after correction

| Validation | Result |
| --- | --- |
| Typecheck | PASS |
| Production build | PASS; existing >560 kB minified-chunk advisory only |
| Client tests | 15/15 PASS |
| Server/lobby tests | 17/17 PASS |
| Championship and Quick Race custom browser gate | 14/14 PASS; real keyboard, touch movement/steering, AI motion, reset, no console errors or asset 404s |
| Phase 1 lobby browser gate | 23/23 PASS after correcting a stale host-migration row selector; host promotion itself worked |
| Race Together browser gate | 2-, 3-, and 4-client runs PASS; 0 ms scheduled-start spread, pre-GO lock, all local/remote cars move, common server results, mobile touch in the two-player case, host disconnect/reconnect, rematch, lobby return, no console errors or asset 404s |
| Official `ship.mjs dist` | PASS: modules parse and imports stay inside `dist`; one 108-number array in the minified bundle is flagged for manual review, not failed. No geometry source changed in this pass. |
| Official generic `playtest.mjs dist` | **FAIL**: fifth fixed leg stalls as described above; not claimed as passed. |

The Race Together gate's full-lap finish path still uses ordered route samples and an accelerated test clock after proving real keyboard/touch driving in browsers. This verifies server authority and consistent result UI; it is not a claim of human-driven full laps. Browser mobile testing is a touch-enabled viewport, not a physical device.

## Ready for a deployed-URL check, but not a jam verdict

The production folder builds and passes `ship.mjs`; the local single-player and multiplayer gates pass. `.env` is ignored by Git, not tracked, and now excluded from the Docker build context. No credential value was printed or copied into a receipt. The former Dockerfile served static files only, which would leave Race Together without its WebSocket backend. The revised runtime installs production dependencies and runs the existing combined static/WebSocket server with `SERVE_DIST=1`; its browser/server path was exercised by the local multiplayer gate. The Docker image itself **was not built** because this machine's Docker daemon is unavailable, so container startup remains an unverified deployment preflight item.

The official `jam.mjs` and `live.mjs` check a **deployed URL** and were not run here; there is no live jam verdict. Once deployment is separately authorized and a URL exists, use the real visible Championship control and analog pad, e.g. `jam.mjs <deployed-url> --start="#championship" --hold="#steerPad" --commit=<deployed-sha>`, then run `live.mjs` on phone and desktop. A deployed multiplayer smoke test must also verify that the browser can reach its WebSocket backend at the public origin; local loopback success alone cannot establish that.
