# ROAD//ZERO rescue audit

Date: 2026-09-24  
Pre-overhaul commit: `3a7f232a723037fad7e499c870051dc248a71db4`  
Official recipe: `404-game-recipe@4effad311c5e137bca316257259fe5bffd6737de`  
Official jam rules: `404-game-jam@cef9c34754ec0109cb23a404343bf6bb1ddb50dd`

## Baseline evidence

- Existing production build: 508 KB uncompressed; Vite reports 504.30 KB JS / 129.71 KB gzip.
- `npm run typecheck`: pass.
- `npm run build`: pass.
- Official `ship.mjs dist`: pass in check-only mode.
- Prior passing custom receipt: `docs/evidence/final-local/gate-report.json`, 202 peak draw calls, 89,600 peak triangles, no recorded 404s or console errors.
- Fresh rescue-baseline gate attempt: failed at its 30 s distance wait on line 26. This exposes timing/flakiness in the gate and is recorded rather than called a pass.
- Current deployment: none. Submission URL, public source, team/contact and tested commit remain placeholders.
- Existing moving captures: `docs/evidence/final-local/`. These are the “before” control and must remain unchanged.

## Official constraints that govern the rescue

- Every actual 3D object is code built from Three.js constructors/operations through the recipe. No mesh files, downloaded models, literal vertex dumps or base64 geometry.
- Every important new asset needs a reference, three genuinely independent construction strategies, official verification, multi-view inspection and a visual selection. Expected dimensions belong beside candidates.
- Asset units are metres; base at `y=0`, centred on X/Z, front toward `+Z`, recognisable from every side.
- Cars require `keepHierarchy` or an equivalent preserved tree for moving wheels. Static merge destroys joints and `userData`; articulated parts should be baked per joint where practical.
- InstancedMesh matrices and per-instance colours must be expanded correctly during merges and bounds measurement. Use the official loader rather than reimplementing it.
- Transparent double-sided materials can draw twice; avoid material cloning and unnecessary transparency. Bake static scenery in spatial chunks, balancing draws against culling/triangles.
- Camera roll must come from authored track banking, never the ground normal. Spins must not instantly rotate the whole horizon.
- Real browser clicks, keys and multi-touch events are mandatory. A custom racing gate must assert racing facts, not call debug movement hooks.
- Final claims are separate: local custom gate, `ship --stamp`, deployed `live` phone/desktop checks, then the official phone jam gate under shaped 4G with the actual commit.
- Blind criticism uses shuffled pairs/contact sheets with the key withheld. Motion frames and real visual targets are mandatory. Build receipts must preserve failures and rejected work.

## Conflict and interpretation log

- The rescue brief names current official docs accurately; no named recipe file was missing.
- The brief requires final deployed/live/jam checks. Official rules make those checks valid only against a public URL and actual commit. They cannot be replaced by localhost evidence; until deployment exists they remain external blockers, never inferred passes.
- The previous game’s assembling-road / four-world structure conflicts with the replacement directive’s three-race persistent-rival identity. The new directive supersedes it; only reusable technical scaffolding survives.
- The official recipe is stricter than the prior implementation around articulated cars: `bakeStatic(createHero())` welds the wheels. All four rescue cars must preserve and verify their hierarchy.

## KEEP

- Vite/TypeScript/Three.js build setup and relative production base.
- Repository history and all existing before/critic receipts.
- Official copied loader/surface/rig utilities, after checking them against the fresh recipe revision.
- Real-event Puppeteer foundation, local static server, missing-request/error collection and telemetry budget sampling.
- Basic overlay state pattern, no-refresh restart, audio-unlock-on-interaction pattern and responsive safe-area CSS foundation.
- Championship points persistence as a concept, but not its current four-race implementation.
- Low current payload and broad performance margin.

## REWORK

- State machine into a real three-race championship plus Quick Race, ordered checkpoints, laps, results order, standings, deterministic tie-break and replay.
- Input into explicit accelerator, brake/reverse, speed-dependent steering, handbrake/slip, pause and reset on desktop and touch.
- Telemetry into real heading, checkpoint, lap, race progress, surface, recovery, AI personality state and player screen box.
- Custom gate into distance-steered deterministic racing legs with touch acceleration, touch steering, braking/slip, AI completion, recovery and full championship validation.
- Camera into spring-based position/heading/look-ahead with stable horizon, speed FOV and readable hero scale.
- Runtime Web Audio into a restrained combustion engine, tyre scrub, countdown, impacts and finish cues.
- Menu/results into a championship-first analog motorsport presentation with full finishing order and standings.

## REPLACE

- The entire cyberpunk/neon/orbital art direction, cyan emissive language, black void, purple accents and metallic laboratory palette.
- Blocky wedge hero and identical recoloured AI cars. Existing car is welded by static baking, lacks wheel articulation and reads as a robot chassis.
- Repeated 28 m sci-fi pylons, symmetric placement, empty track edges and fog-colour-only “world” changes.
- Straight auto-runner road and cosmetic route split. There are no actual bends, braking zones, laps, checkpoints, overtakes or meaningful racing line.
- Current AI: three scalar forward speeds plus damped lane targets. There is no navigation, braking, passing, defence, mistakes, recovery or persistent personality.
- Current “Championship”: four copies of the same 660 m straight, incomplete automated coverage, no displayed finishing order/standings and a point assignment risk from mapping rivals by filtered finish index.
- Flat Hemisphere + two DirectionalLight setup, crushed black environment and cyan rim. Replace with warm key/cool fill/aerial depth using official rig principles.
- Uniform dark road, floating construction pieces and thin white/cyan rails. Replace with authored asphalt, dirt shoulders, edge paint and grounded barrier language.
- Sci-fi HUD, slash typography, giant speed/score focus, generic results copy and mode names tied to the retired concept.
- Auto acceleration as the sole driving model. It prevents braking skill and makes the official touch hold unable to prove accelerator input.

## Deciding diagnosis

The old build does not merely need more props. Its camera, geometry, colour, mode structure and AI all communicate “procedural sci-fi runner,” while the rescue target is “inhabited analog championship racer.” Keeping the straight-road world and repainting it would preserve the structural failure. The correct rescue keeps the small compliant web-game foundation and replaces the authored experience above it.

## Rescue sequence and acceptance gates

1. Lock style, visual claims and six scene concepts.
2. Rebuild player and three rival cars through separate reference → three candidates → verify → inspect loops; prove articulated wheels.
3. Establish one excellent Orchard Sprint with real curves/checkpoints, handling and the three AI behaviours.
4. Build the shared analog environment kit through the same asset workflow, then compose Quarry and Summit variants.
5. Finish championship/results/tie-break and mobile controls.
6. Add lighting, sound and effects; capture motion frames.
7. Run three fresh critic rounds, fixing the single deciding issue each time.
8. Run asset verification, functional/AI tests, custom gate, ship/stamp, performance review and receipts.
9. Deploy only when authorised/available; then run live and official jam gates against the deployed commit.
