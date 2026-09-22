# Iteration log

This is an evidence log, not a reconstructed narrative. Entries are added when work is tested or a decision changes.

## 2026-09-22 — Phase 0 intake

- Starting workspace contained only `AGENTS.md` and had no Git repository.
- Read the complete local brief and current official recipe/rules at the recorded commits in `BUILD_PLAN.md`.
- Confirmed the game folder is separate from the recipe clone at `/private/tmp/404-game-recipe`.
- Recipe `npm install` did not leave its pinned Chrome available. `npx puppeteer browsers install chrome` downloaded a corrupt archive, so the required self-test was rerun with the installed `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome` via `PUPPETEER_EXECUTABLE_PATH`.
- Official self-test then passed every deliberately broken, clean out-of-tree, mounting-face, instancing, and expected-size check. The verifier is trusted for this environment with that executable override.
- Chose a deterministic fixed-step, pooled modular-track architecture to protect fairness and long-RUN memory behavior.

## 2026-09-22 — Baseline and first asset loop

- Generated isolated hero-car and road-module references with the locked style; references are evidence only, not shipped art.
- Authored three independent code candidates for each. All hero candidates passed the official verifier. The track verifier caught a 48.79 m axis error and under-declared flat connection faces; corrected the extrusion and declared the legitimate flush module mounts, after which all three passed.
- Chose hero C and track A by inspecting 560 px five-view sheets. See `ASSET_PROVENANCE.md` for visual reasons.
- Built the first playable floor: real menu start, automatic acceleration, keyboard steering/drift, phone touch stick/drift control, visible multi-part road assembly, an early SAFE/REDLINE split, scoring, fall failure, results, and no-refresh restart.
- Preserved the first moving frames under `docs/evidence/baseline/`. Honest floor critique: the world is stark/empty, the hero is too small in motion, road values are readable but overly uniform, and the mobile gate intentionally steered far enough to expose unforgiving lateral tuning.
- `bakeStatic` from the official recipe reduced the scene from roughly one draw per generated part to 41 desktop draw calls / 33,184 triangles in the gate sample.
- The stock playtest reached system Chrome but stopped before readiness output because its real-GPU headless launch is unstable on this host. A repository-owned gate using the same real event principles and explicitly labelled SwiftShader completed. First run failed only on an unhandled browser-requested favicon; server handling was corrected.
