# ROAD//ZERO build plan

Status key: `[ ]` pending, `[~]` active, `[x]` accepted. A phase is accepted only after its listed evidence exists; compilation alone is not acceptance.

## Governing constraints

- Official rules snapshot: `404-Repo/404-game-jam` at `cef9c34754ec0109cb23a404343bf6bb1ddb50dd` (read 22 Sep 2026).
- Recipe snapshot: `404-Repo/404-game-recipe` at `4effad311c5e137bca316257259fe5bffd6737de`.
- Deadline: 25 Sep 2026, 23:59 UTC. Repository's first commit must be on/after 11 Sep 2026.
- Every 3D object is a Three.js code module produced through the 404 reference → three candidates → verify → visual choice workflow.
- Live gate ceilings: under 10 MB transferred, under 900 draw calls, under 1.5M triangles, real tap start, real finger movement, no 404s or console errors.
- Internal targets: under 7.5 MB, peak under 600 draw calls and 900k triangles, stable memory across a 10-minute RUN.
- Three critic rounds are planned after the complete build. A repeated structural failure twice changes the plan rather than causing an unbounded loop.

## Architecture decision

- Vite + TypeScript + Three.js, no gameplay framework or backend.
- Deterministic fixed-step arcade simulation; rendering interpolates separately.
- Track expressed as module descriptors with entry/exit frames, centreline samples, route and assembly metadata.
- Pooled visual module instances; stable collision ribbons are available before animated pieces visually lock.
- Procedural Web Audio only unless a later declared, licensed file materially improves the game.
- DOM UI over one WebGL canvas; landscape-first with a supported portrait warning/layout.

## Phases

### Phase 0 — Rules, recipe, architecture, baseline `[~]`

Acceptance:

- [x] Read AGENTS.md, official rules, GAME.md, 404.md, style-lock, gates, claims, asset contract, verifier, traps, surfaces, and Drive case study.
- [x] Confirm the game and recipe are separate repositories/directories.
- [x] Run the official recipe self-test successfully and record environmental workaround.
- [x] Inspect starting repository and initialize honest Git history.
- [ ] Scaffold a standalone build and establish baseline telemetry.
- [ ] Preserve six moving baseline frames under `docs/evidence/baseline/`.

### Phase 1 — Style lock and visual targets `[~]`

Acceptance:

- [x] Exact palette, dimensions, materials, lighting, UI, and world accents in `STYLE_LOCK.md`.
- [x] Failable motion-frame claims and target-frame briefs in `docs/VISUAL_TARGETS.md`.
- [ ] Generate/collect local reference frames and record sources.

### Phase 2 — Minimum playable driving floor `[ ]`

Acceptance:

- [ ] Automatic acceleration, steering, drift, jump/landing, edge failure, recovery, and fast restart.
- [ ] Stable speed-responsive chase camera and centralized tuning.
- [ ] Real keyboard and touch controls both move the telemetry position.
- [ ] Desktop and phone-sized manual/gate checks recorded.

### Phase 3 — 404 asset library `[ ]`

Acceptance:

- [ ] Isolated reference image for each production asset family.
- [ ] Three genuinely independent candidates per reference, with expected-size manifests.
- [ ] Official verifier passes and candidate sheets are inspected.
- [ ] Chosen modules copied to `src/assets/`; every decision recorded in `docs/ASSET_PROVENANCE.md`.

### Phase 4 — Modular track system `[ ]`

Acceptance:

- [ ] Straight, turns, bank, hairpin, narrow, ramps/jumps, split/merge, tunnel, bridge, wall-ride, transition, finish descriptors.
- [ ] Deterministic seeded sequence and branch-safe centreline/progress data.
- [ ] Collision, hazards, AI navigation, and assembly metadata validated.

### Phase 5 — Dynamic road construction `[ ]`

Acceptance:

- [ ] Multi-piece translate/rotate/lock animation, restrained impact, light activation, and pulse.
- [ ] Timing scales with speed but collision is always fair.
- [ ] Pooling prevents object/memory growth; construction is obvious in moving captures.

### Phase 6 — RUN mode `[ ]`

Acceptance:

- [ ] Continuous score/survival loop, difficulty escalation, fair crash/end, complete results and instant replay.
- [ ] Score rewards distance, speed, drift, survival, and REDLINE without trivial farming.

### Phase 7 — Four environments `[ ]`

Acceptance:

- [ ] Neon District, Redline Canyon, Skyline, and Orbital read within about two seconds while sharing the style lock.
- [ ] Continuous transitions stream/recycle world dressing without stalls or retained growth.

### Phase 8 — REDLINE routes `[ ]`

Acceptance:

- [ ] SAFE and REDLINE are distinguishable by form, iconography, width, and light—not colour alone.
- [ ] Choice is intentional, mechanically different, and REDLINE grants a meaningful reward.
- [ ] First split occurs within the first 15 seconds.

### Phase 9 — AI racing `[ ]`

Acceptance:

- [ ] NOVA, VEX, and KAI follow route-aware centreline data with distinct tuning.
- [ ] Split selection, turn speed, recovery, finish progress, and repeated full-track completion work.

### Phase 10 — Championship `[ ]`

Acceptance:

- [ ] Four authored races, grid/countdown, accurate route-progress position, results, 10/7/5/3 points, standings, final result.
- [ ] Both winning and non-winning flows can continue without refresh.

### Phase 11 — Audio, VFX, game feel `[ ]`

Acceptance:

- [ ] Engine, wind, drift, collision, air/landing, assembly, REDLINE, countdown, UI, and finish cues.
- [ ] Suspension/body response, wheel motion, trails/sparks/dust, impact and speed presentation improve feel without obscuring play.

### Phase 12 — Mobile controls `[ ]`

Acceptance:

- [ ] Real tap start, finger steering, drift, pause and restart at phone viewport.
- [ ] Controls respect safe areas, remain readable, and do not obscure the road.

### Phase 13 — Menus, UI, accessibility `[ ]`

Acceptance:

- [ ] Premium menu with RUN, CHAMPIONSHIP, HOW TO PLAY, and audio control.
- [ ] Mode-appropriate minimal HUD, concise instructions, keyboard navigation, contrast, non-colour route cues, reduced-flash restraint.

### Phase 14 — Custom ROAD//ZERO gate `[ ]`

Acceptance:

- [ ] Real browser events cover load/start, keyboard/touch, movement, drift, construction, split, crash/restart, menus, championship, AI and position.
- [ ] Fails on console errors, 404s, missing content, cost ceilings, or unexercised core mechanics.
- [ ] Produces repeatable moving filmstrips and telemetry.

### Phase 15 — Performance `[ ]`

Acceptance:

- [ ] Production build meets internal budgets and official ceilings.
- [ ] Ten-minute RUN shows bounded modules, objects and memory.
- [ ] Build size/network/material/shader/draw/triangle receipts in `docs/PERFORMANCE.md`.

### Phase 16 — Critic rounds `[ ]`

Acceptance:

- [ ] Driving, visual cohesion, mobile, replayability, and stage-one reviews use moving captures and can fail.
- [ ] Three fresh rounds maximum; each fixes the single deciding property and records before/after evidence.
- [ ] Final build beats the preserved floor in blind pairs.

### Phase 17 — Final jam gate `[ ]`

Acceptance:

- [ ] `ship.mjs` clean; production deployed; exact public commit identified.
- [ ] Official `jam.mjs` verdict passes unedited against live URL and commit.
- [ ] `live.mjs` desktop/mobile and manual phone-sized touch verification pass.

### Phase 18 — Deployment and submission `[ ]`

Acceptance:

- [ ] README and all receipts reflect shipped reality.
- [ ] Entry JSON draft contains truthful URLs, commit, tools/models, team/contact/wallet placeholders, and final `what_i_found`.
- [ ] Submission assets/captures are ready; external PR awaits human account authorization.

## Current milestone

Deliver the Neon RUN slice on desktop and phone-sized touch: real tap start, compliant generated car, modular road, visible construction, SAFE/REDLINE choice, failure and restart without refresh. Championship work stays shallow until this is fun and stable.
