# Final local validation

## Passed

- TypeScript typecheck and production Vite build.
- Vitest: 5/5 tests covering ordered checkpoints, lap completion, deterministic championship scoring/ties, braking/reverse/slip, and material rival-parameter differences.
- Official asset verifier: player candidates 3/3 clean; environment candidates 3/3 clean.
- Custom production racing gate: real desktop keyboard and real mobile touch start/throttle/steer; countdown lock, movement, steering, handbrake slip, AI movement, reset, real elapsed-time FPS, no console errors, no 404s.
- Official 404 playtest: 200.3 m driven, ~60 FPS, 49 peak draws, 24,508 peak triangles.
- Official 404 ship check: one page/one module, all paths inside the folder. The static audit flags a 108-number array in bundled code for human reading; source uses Three.js constructors and profile/control-point code rather than embedded mesh data.
- Official local jam gate using the stamped production shape: PASS at 390×844 @3x with 4G and 2× CPU throttle; ready 1.4 s, 0.6 MB, 60.0 m real-touch movement, 117 peak draws, 42,172 peak triangles, zero errors and zero 404s.
- Official blind-pairs sheet generated and reviewed with `KEY.json` withheld.

## External blockers

- No deployed URL exists, so `live.mjs` and the deployed-URL `jam.mjs` have not been run.
- Kite Cloud deployment is not authenticated (`kpass` exit 3). Authentication needs the user's email and one-time code; provisioning may also require a funding approval.
- Submission metadata still needs the user's GitHub handle, public source URL, contact, deployed play URL, and deployed commit SHA.

## Remaining product limitations

- Blind pairs preferred both richer concept targets; real-time scenery remains simpler in materials, crowd density, and layered depth.
- No authored audio pass is included.
- Collision response is intentionally light and does not model detailed vehicle-to-barrier physics.
