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

## 2026-09-22 — Environment and Championship pass

- The empty-road floor failed visual review. Generated and verified a reusable monumental pylon family, selected candidate C, baked it by material, and used paired/rotated/scaled placements to create authored parallax with a shared universe silhouette.
- Added continuous Neon District, Redline Canyon, Skyline and Orbital atmosphere bands and a finite four-world RUN completion at 660 m. The current distinction is strongest in value/atmosphere and structural placement; Canyon still needs a dedicated geological asset and Skyline needs better bright-road contrast.
- Pulled the chase camera materially closer after the floor capture. The hero is more legible but still below the style-lock's target share of frame in several captures.
- Activated Championship: real button start, concise countdown, three generated-car rivals, personality-tuned pace/branch preference, route-progress position, 10/7/5/3 scoring, four world races, next-race flow and final champion/non-champion result.
- Extended the custom gate to real-click Championship, wait through countdown, prove all AI progress, validate position, capture a four-car moving frame, and preserve performance telemetry.

## 2026-09-22 — Critic round 1: failed on the signature

- Three independent critics failed the build. Driving and stage-one critics independently selected the same deciding property: captures showed `ROAD LINKED` text over a continuous road but did not visually prove displaced road pieces assembling.
- The mobile critic selected chase-camera composition: undersized/off-centre hero colliding with the left control region. Secondary common failures were repeated-world dressing, weak world-space SAFE/REDLINE distinction, and insufficient speed cues.
- Fixed the deciding shared issue first: moved construction from 150 m into a 38–88 m near-field window, increased plate offsets/rotation, moved incoming pieces above the horizon, added a temporary cyan energy wash to the road material, exposed `assemblyProgress`, and captured a three-frame 0.2→0.9 sequence with no `ROAD LINKED` overlay.
- First post-fix attempt placed pieces above the horizon but still captured only a single ambiguous lattice. The second attempt changed the gate from one frame to three progress-gated frames so convergence and completed road are judged as a sequence.

## 2026-09-22 — Construction critic rounds 2–3

- Round 2 still failed: the moving silhouettes read as rails and scenery, not broad road plates. Split the generated module's four road lanes into distinct but visually matched `ground` materials so the recipe baker preserves four independently animatable compliant plates.
- Round 3 still failed on causal legibility. The plates were substantial, but their steep starting pose read as upright walls collapsing near an independently existing road.
- The final targeted response keeps plates near the road plane, stages them laterally beside a visible socket, slides/rolls them into their exact lane positions, and moves the 40 m assembly interval closer to the car. No further critic loop was run after the three-round limit; this remains an honestly documented visual risk for device review.
- Tightened chase framing, increased the hero's visual scale, made camera lateral follow keep the car clear of the touch stick, and extended the real-event gate to assert touch drift rather than merely checking that the button exists.
