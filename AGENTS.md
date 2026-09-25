# 404 GAME JAM RACER — COMPLETE RESCUE, VISUAL OVERHAUL & FINALIZATION DIRECTIVE

You are taking over an EXISTING 404 Game Jam racing project.

The project is already substantially implemented, but the current result is NOT acceptable.

The previous implementation feels generic, synthetic and overly robotic. The visual design looks like an AI-generated prototype rather than a deliberately art-directed game. The environment, cars, lighting, UI, materials and overall composition lack a cohesive identity.

Your job is NOT to blindly add more features on top of the current version.

Your job is to:

1. audit the existing game,
2. preserve what works,
3. identify why it currently feels generic/robotic,
4. establish a completely new cohesive art direction,
5. rebuild weak visual assets correctly through the 404 recipe,
6. substantially improve driving feel,
7. implement/refine the three distinct AI rivals,
8. finish the championship structure,
9. improve presentation and game feel,
10. create proper visual and gameplay validation loops,
11. pass the official 404 jam requirements,
12. leave strong build receipts showing the iteration process.

This is an overhaul of an existing build, not a superficial polish pass.

Do not declare the project finished simply because it runs.

The finished game should feel like somebody deliberately designed a racing game rather than an agent assembled one.

---

# 0. READ THE OFFICIAL MATERIAL BEFORE TOUCHING THE GAME

Before editing the project, locate/read the latest versions of:

* `GAME.md`
* `404.md`
* `docs/style-lock.md`
* `docs/traps.md`
* `docs/gates.md`
* `docs/claims.md`
* `docs/concept-images.md`
* `docs/asset-contract.md`
* the official 404 Game Jam README/rules
* relevant harness files

Do not rely on assumptions from this AGENTS.md if the official repository gives a stricter technical requirement.

The hard jam requirements take priority.

Remember in particular:

Every actual 3D object must remain compliant with the 404 recipe.

No downloaded meshes.

No asset-store models.

No GLB/GLTF models.

No hand-modelled binary meshes.

No literal vertex-array smuggling.

No base64 mesh data.

No copied assets or copied game code from 404's Drive racer or any other reference game.

Reference games may be studied for lessons only.

The existing repository history must be preserved. Do not squash everything into a fake single build.

---

# 1. DO NOT START BY CODING

The first task is an audit.

Run the current game and play it properly on both desktop and a phone-sized viewport.

Capture screenshots while:

* sitting on the starting grid,
* accelerating,
* cornering,
* following another racer,
* overtaking,
* entering a visually dense part of the circuit,
* finishing a race,
* viewing menus/results/championship screens.

Inspect the current source tree and determine what is already working.

Create:

`docs/RESCUE_AUDIT.md`

Document:

### KEEP

Existing systems that are structurally good enough to preserve.

For example:

* race state machine,
* checkpoint logic,
* lap counting,
* input system,
* AI navigation,
* collision system,
* championship data model,
* deployment setup,
* telemetry,
* existing compliant assets that genuinely look good.

### REWORK

Things that basically work but need meaningful improvement.

### REPLACE

Anything causing the generic/robotic result.

Pay particular attention to:

* blocky vehicles,
* box-like buildings,
* metallic grey materials everywhere,
* excessive emissive lighting,
* cyan/purple sci-fi lighting,
* neon outlines,
* sterile environments,
* repeated procedural boxes,
* perfectly symmetrical scenery,
* empty track edges,
* generic HUD panels,
* robotic-looking spectators,
* unrealistic object proportions,
* weak road material,
* flat lighting,
* no visual hierarchy,
* camera that feels detached from the car,
* scenery that does not establish a real place.

Do not preserve weak work just because it already exists.

---

# 2. CREATE A CHECKPOINT BEFORE THE OVERHAUL

Before major destructive changes, make sure the repository is in a known working state.

Record:

* current commit,
* current screenshots,
* current gate/test status,
* current performance,
* current deployment status if deployed.

Do not erase previous build history.

The improvement from bad first version → final version is useful evidence for the jam's build-receipts criterion.

---

# 3. NEW ART DIRECTION

The existing robotic visual identity must be discarded.

The new direction is:

## ANALOG HILLSIDE MOTORSPORT FESTIVAL

This is NOT cyberpunk.

This is NOT sci-fi.

This is NOT futuristic.

This is NOT a world filled with robots.

This is NOT neon racing.

This is NOT a metallic industrial simulation.

Imagine a fictional late-1970s/early-1980s grassroots hill-climb championship taking place in a warm mountainous region.

The world should feel:

* handcrafted,
* sun-warmed,
* tactile,
* imperfect,
* energetic,
* colourful,
* inhabited,
* slightly nostalgic,
* stylized rather than photorealistic,
* premium rather than childish.

The visual inspiration is classic analog motorsport photography, vintage hill-climb events, rally paddocks, handmade race barriers, dusty mountain roads, cloth flags, sun-faded structures, spectators sitting around improvised viewing areas and colourful compact racing coupes.

DO NOT copy any real motorsport brand, logo, vehicle or trademark.

Everything remains fictional.

---

# 4. CREATE THE STYLE LOCK BEFORE GENERATING ANY NEW ASSET

Create:

`STYLE_LOCK.md`

Every agent or sub-agent creating visual work MUST receive this exact style lock.

Use this core style sentence:

> A warm analog hill-climb motorsport festival rendered as a premium stylized miniature world: rounded compact racing coupes, painted fiberglass and enamel bodywork, sun-faded plaster and timber architecture, dry grass, rock, cloth track furniture, dusty roadside detail, strong silhouettes and golden natural light, with believable proportions and absolutely no sci-fi, cyberpunk, robotic or neon visual language.

Use a tightly controlled palette.

Suggested master palette:

* warm cream: `#EFE1C6`
* sun-faded orange: `#C86845`
* ochre: `#D5A23B`
* forest green: `#53694C`
* dusty sage: `#849077`
* faded blue: `#507D92`
* asphalt charcoal: `#343537`
* warm stone: `#A88869`
* earth brown: `#79533F`
* deep shadow: `#353A3B`

Player-car accent:

`#D74B3F`

Rival accents:

* Rival 1: `#D7A72F`
* Rival 2: `#3F7390`
* Rival 3: `#617B4E`

Do not make every material saturated.

Use colour intentionally.

Most environment surfaces should have moderate or high roughness.

Vehicle paint may have controlled gloss.

Glass may reflect.

Chrome should be rare and restrained.

Emissive materials should NOT dominate the visual design.

Brake lamps may emit subtly.

No glowing vehicle outlines.

No cyan holographic UI.

No purple cyberpunk lighting.

No futuristic transparent dashboards.

No sci-fi hexagon motifs.

No random metallic panels.

No robot-like human characters.

---

# 5. REAL-WORLD SCALE MUST BE CONSISTENT

Put approximate real sizes in `STYLE_LOCK.md`.

Suggested scale:

Compact race coupe:

* width roughly 1.65–1.80 m
* height roughly 1.25–1.45 m
* length roughly 3.7–4.2 m

Safety barrier:

* roughly 0.8–1.0 m high

Hay bale:

* roughly 0.45 m high
* roughly 0.9 m long

Marshal hut:

* roughly 2.3–2.8 m high

Spectator canopy:

* roughly 2.4–3 m high

Tree:

* roughly 5–9 m depending on variant

Track:

* approximately 7–9 m usable racing width where appropriate

Everything should look like it belongs to the same physical world.

---

# 6. BUILD CONCEPT FRAMES BEFORE REBUILDING THE WORLD

Do NOT immediately start remodelling scenery from text.

Generate or source several visual references for the intended final look.

Create/reference frames for:

1. starting grid at golden hour,
2. sweeping uphill corner,
3. village or paddock section,
4. rocky mountain section,
5. close chase-camera racing frame,
6. four cars battling into a corner.

These are VISUAL TARGETS.

Do not use them as textures.

Use them to judge composition, lighting, density, silhouettes and colour relationships.

Create:

`references/scenes/`

and store the permitted reference/concept material there when appropriate.

If Atlas MCP is connected, it may be used for generating concept frames, visual references, sky/audio/texture material and other permitted files.

If Atlas MCP is not configured, do not block development.

Do not expose, print, commit or hard-code `ATLAS_API_KEY`.

---

# 7. TURN THE VISUAL TARGET INTO TESTABLE CLAIMS

Create:

`docs/VISUAL_CLAIMS.md`

Include objective visual statements such as:

* The player's car is immediately recognisable as the visual hero.
* At normal chase distance, the player's vehicle occupies enough screen space to read its body shape and wheels clearly.
* Cars must not look like boxes with wheels attached.
* Vehicle wheel arches, cabin, bonnet/hood, body volume and rear mass must read as intentional separate forms.
* There must always be foreground, midground and background depth during normal racing.
* Track boundaries must remain readable at racing speed.
* The road must not blend into the environment.
* Every major gameplay frame should contain both warm and cool colour relationships rather than flat single-temperature lighting.
* No major gameplay frame should read as a grey metallic environment.
* No scene should resemble a robotics laboratory, futuristic warehouse or cyberpunk track.
* The world should contain deliberate asymmetry.
* Important corners should have recognisable landmark silhouettes.
* The background must not be empty sky plus flat ground.
* Trackside scenery must visibly respond to the road and terrain instead of being randomly scattered.
* Cars must remain readable in shadow.
* Racing frames must look good while moving, not only when parked.
* AI cars must be distinguishable from one another without relying solely on HUD labels.
* The HUD should feel like analog motorsport graphic design rather than a sci-fi interface.

A critic must be able to reject a visual round if these claims fail.

---

# 8. REBUILD HERO ASSETS USING THE ACTUAL 404 RECIPE

Do not invent important assets from descriptions.

For every significant asset:

1. obtain/create an appropriate reference image,
2. generate THREE genuinely independent geometry approaches,
3. run the official asset verifier,
4. inspect multiple views,
5. select the strongest candidate BY EYE,
6. reject all candidates if none are good enough,
7. regenerate when necessary.

Do not simply make version A and then slightly modify it twice.

Use different construction strategies.

Important assets that deserve this process include at minimum:

* player race car,
* Rival 1 car,
* Rival 2 car,
* Rival 3 car,
* marshal hut,
* track barrier system,
* hay bale / soft barrier,
* spectator canopy,
* roadside tree,
* rock formation,
* paddock structure,
* village/building module if used,
* distinctive track landmark.

Cars are the most important visual assets in the entire game.

Spend disproportionate effort on them.

---

# 9. VEHICLES MUST NOT LOOK LIKE ROBOTS

This is a hard artistic requirement.

The old version's robotic/AI aesthetic must not survive.

Each vehicle needs:

* coherent body volume,
* rounded or intentionally shaped fenders,
* convincing wheel placement,
* clear wheel arches,
* visible tyres,
* a readable greenhouse/cabin,
* windscreen and side glass,
* front and rear visual identity,
* believable stance,
* body-over-wheel proportion,
* subtle suspension/body movement,
* appropriate material separation.

Avoid:

* rectangles stacked on rectangles,
* exposed geometric joints that resemble robot limbs,
* glowing panels,
* mechanical face-like fronts,
* excessive greebling,
* floating body components,
* tiny wheels,
* wheels buried inside boxes,
* unrealistic cabin height,
* razor-thin body panels,
* identical bodies recoloured four times.

The four cars should belong to the same racing category while having recognisable silhouettes.

Do not copy an existing real production car.

---

# 10. THE PLAYER CAR

The player car should be a compact, agile hill-climb racing coupe.

It should visually communicate:

* light weight,
* speed,
* grip,
* character.

Use the red player accent from the style lock.

It must be the hero object of the frame.

Make sure its paint responds attractively to light.

Keep the body readable even in shade.

Wheels should rotate correctly.

Front wheels should visibly steer.

If hierarchy is required for moving wheels/parts, preserve hierarchy through the asset loader.

Do not merge away parts that need articulation.

---

# 11. THREE RIVALS — NOT THREE GENERIC BOTS

The championship has exactly three major AI rivals in addition to the player.

They are recurring characters expressed primarily through DRIVING BEHAVIOUR.

Do not turn them into humanoid characters.

Do not use talking robots.

Their identity comes from:

* car silhouette,
* colour,
* driving style,
* race behaviour,
* championship performance.

## RIVAL 1 — THE CHARGER

Character:

Aggressive and exciting.

Behaviour:

* highest willingness to attempt overtakes,
* brakes later,
* slightly higher peak pace,
* accepts smaller gaps,
* sometimes overshoots,
* higher error probability,
* particularly dangerous on straights and heavy braking zones.

The player should learn:

"Don't assume the door will stay closed when the Charger is behind me."

---

## RIVAL 2 — THE TECHNICIAN

Character:

Clean and calculated.

Behaviour:

* strongest adherence to optimal line,
* smooth braking,
* excellent corner exits,
* low variance,
* avoids unnecessary contact,
* very consistent lap times,
* difficult to catch once allowed into clean air.

The player should learn:

"I have to disrupt the Technician's rhythm instead of simply waiting for a mistake."

---

## RIVAL 3 — THE DEFENDER

Character:

Position-focused.

Behaviour:

* slightly lower ultimate pace,
* strong awareness of a nearby challenger,
* chooses defensive line when threatened,
* makes the player work for overtakes,
* returns toward the racing line appropriately,
* should NOT zig-zag unrealistically.

The player should learn:

"I need to set up an overtake rather than dive at the first opening."

---

# 12. THE AI DIFFERENCES MUST BE REAL

Do not implement rival personalities as text labels attached to identical AI.

Their behaviour parameters must actually differ.

Possible parameters include:

* preferred racing line,
* corner-entry speed,
* brake point offset,
* acceleration confidence,
* overtaking threshold,
* lateral passing offset,
* defensive line bias,
* risk tolerance,
* mistake probability,
* recovery speed,
* reaction distance,
* tyre/grip utilisation abstraction,
* slip tolerance.

Keep AI fair.

Do not teleport.

Do not rubber-band visibly.

Moderate catch-up assistance is acceptable only if subtle and not enough to erase player skill.

AI should recover safely if stuck.

---

# 13. THE CORE "WHAT I FOUND" MECHANIC

The distinctive idea of this game is NOT simply:

"I made a racing game."

It is:

> A championship racer built around three persistent rivals with visibly different racing personalities, where the player learns how each rival behaves across several races and adapts strategy accordingly.

Everything should support this.

The game should create moments where the player thinks:

* "That's the aggressive one."
* "The blue car always nails this section."
* "I need to make the defender cover the inside and switch back."
* "If I pressure the Charger, it may overcommit."

This is how the game becomes memorable.

---

# 14. CHAMPIONSHIP STRUCTURE

Create a compact championship that is realistic for a jam game but feels complete.

Target:

3 races.

4 racers total:

* Player
* Charger
* Technician
* Defender

Use a simple persistent points system.

For example:

1st — 10 points
2nd — 7 points
3rd — 4 points
4th — 2 points

Or another sensible distribution.

A tie should have a deterministic tiebreak.

Keep the whole championship short enough that judges can experience meaningful progression within their play session.

---

# 15. TRACK STRATEGY

Do NOT build three completely unrelated giant worlds if that damages quality.

Create one cohesive fictional motorsport region and use a shared art kit intelligently.

Three championship races can have different layouts and local identities while sharing core materials/assets.

Suggested identity:

## Race 1 — ORCHARD SPRINT

Opening event.

Flowing.

Accessible.

Dry grass.

Trees.

Timber barriers.

Spectator pockets.

Introduces overtaking and basic rival behaviour.

---

## Race 2 — QUARRY LOOP

More technical.

Rock formations.

Elevation.

Tighter braking zones.

Dust.

Stronger opportunities for the Technician to shine.

---

## Race 3 — SUMMIT RUN

Championship finale.

Most dramatic elevation.

A mix of flowing and technical sections.

Stronger visual composition.

Big finish-line atmosphere.

Use the most impressive vista and lighting here.

The tracks must remain original and must not copy the 404 Drive reference track.

---

# 16. REUSE ASSETS WITHOUT MAKING THE WORLD REPETITIVE

Reuse is good.

Obvious repetition is bad.

For repeated props:

* vary rotation,
* vary scale slightly,
* create a small number of genuine variants,
* cluster objects naturally,
* place them according to terrain and track context,
* avoid perfect grids,
* avoid identical spacing.

For trees, rocks and track furniture, build reusable families.

Use instancing where appropriate.

Be aware of the official InstancedMesh traps.

Do not accidentally collapse instances through an incorrect loader path.

---

# 17. DRIVING MUST BECOME THE NUMBER ONE PRIORITY

The jam's largest judging category is whether the game is good to play.

A visually beautiful car with poor handling will still lose.

The game should be immediately enjoyable with arcade handling.

Target:

easy to understand,
responsive,
fast,
forgiving enough for a first-time player,
but with enough depth that good cornering matters.

---

# 18. VEHICLE HANDLING

Implement/refine:

* acceleration curve,
* braking,
* reverse,
* speed-dependent steering,
* lateral grip,
* controlled rear slip,
* drag,
* off-road slowdown,
* collision response,
* recovery/reset.

Steering should become less twitchy at high speed.

The player should be able to feel:

* braking before a corner,
* weight/load change,
* turning in,
* reaching grip limit,
* accelerating out.

Do not create a physics simulator.

This is an arcade championship racer.

But do not make it a floating cube either.

---

# 19. DRIFT / SLIP

If drift/slip already exists, make it deliberate.

If it does not exist and can be implemented without destabilising the project, add a controlled form of rear slip.

The player should be able to rotate the car slightly under aggressive cornering.

Avoid constant uncontrolled drifting.

Grip racing should remain viable.

If a dedicated handbrake is used:

Desktop:

* Space or another intuitive key.

Mobile:

* dedicated reachable button.

Do not let the drift mechanic destroy accessibility.

---

# 20. COLLISION FEEL

Collisions should communicate impact without feeling punitive.

Use:

* brief camera impulse,
* subtle sound,
* slight speed loss,
* body reaction,
* small particles when appropriate.

Avoid:

* cars exploding,
* arcade pinball,
* spinning the player 180° from a light touch,
* AI pushing the player unrealistically,
* cars clipping through each other.

---

# 21. CAMERA

The chase camera must be significantly improved.

Requirements:

* spring-based smoothing,
* anticipatory look direction,
* subtle FOV increase with speed,
* slight lateral response,
* stable horizon,
* strong player-car visibility,
* no nausea-inducing oscillation.

Do NOT orient camera roll directly from whatever ground normal exists beneath the car.

Use track banking information if banking is required.

Clamp any camera roll.

If the car spins, do not instantly spin the entire camera with it.

Allow the camera to lag and recover smoothly.

---

# 22. SENSE OF SPEED

Create speed through:

* road motion,
* nearby trackside objects,
* appropriate FOV response,
* subtle camera vibration only at high speed,
* dust,
* tyre audio,
* engine pitch,
* wind audio,
* roadside parallax,
* particles,
* suspension/body motion.

Do not fake speed primarily with excessive motion blur.

---

# 23. START PROCEDURE

A race should feel like an event.

Flow:

Championship/race screen
→ starting grid
→ 3
→ 2
→ 1
→ GO
→ race.

The countdown must be visually clear.

AI cannot launch before GO.

Allow a tiny dramatic pause between numbers.

Audio should reinforce it if available.

---

# 24. RACING HUD

Completely eliminate the generic robot/sci-fi dashboard aesthetic.

The HUD should feel inspired by vintage motorsport timing graphics.

Use:

* warm cream,
* charcoal,
* small colour accents,
* strong numbers,
* simple geometric plates,
* restrained shadows,
* clear hierarchy.

During a race show only important information:

* position: `2 / 4`
* lap: `2 / 3`
* speed
* current race identity if useful
* optional compact checkpoint/progress indicator
* championship context only when necessary

Avoid:

* giant glass panels,
* glowing holographic panels,
* sci-fi corner brackets,
* cyberpunk typography,
* unnecessary telemetry.

The game world should remain the focus.

---

# 25. RESULTS PRESENTATION

After each race show:

* race finishing order,
* earned points,
* championship standings,
* next race action.

Make standings easy to understand immediately.

At the final race:

show the championship result clearly.

Winning should feel rewarding.

Losing should still allow replay.

---

# 26. MAIN MENU

Keep it simple and polished.

Possible options:

CHAMPIONSHIP
QUICK RACE
HOW TO PLAY

Do not create ten unnecessary modes.

If Quick Race is already functional, preserve it.

Championship is the hero mode.

The first screen must look intentionally designed.

Use an attractive real-time background or hero composition from the game if performance allows.

---

# 27. AUDIO

Audio contributes strongly to perceived quality.

Implement or improve:

* engine loop with pitch responding to RPM/speed,
* tyre scrub,
* collision thump,
* countdown,
* UI feedback,
* ambient crowd/wind/environment,
* race finish cue,
* restrained menu ambience/music if allowed.

Do not let sounds clip.

Do not play every effect at maximum volume.

Do not make the engine sound like a robot/electric sci-fi machine unless deliberately justified, which it is not for this art direction.

---

# 28. LIGHTING

The lighting must be rebuilt if the current scene uses generic ambient + directional light.

Use the official rig principles where appropriate.

Target golden late-afternoon light.

Create colour separation:

warm direct sunlight,
cooler ambient/sky contribution,
strong but readable shadow,
atmospheric depth.

Cars must remain readable when shaded.

Road must remain readable.

Important track geometry must not disappear into black.

Avoid flat exposure.

Avoid uniformly lit objects.

Avoid every surface having identical colour temperature.

---

# 29. SKY & ATMOSPHERE

The sky should support the world.

Use:

* warm horizon,
* clearer/cooler upper sky,
* subtle atmospheric haze,
* distant terrain depth.

Do not use giant sci-fi planets.

Do not use cyberpunk skylines.

Do not overload the sky with effects.

---

# 30. ROAD

The road occupies a huge percentage of every racing frame.

Treat it as a hero surface.

It should have:

* subtle colour variation,
* believable roughness,
* slight procedural material variation,
* clear edge definition,
* occasional wear,
* readable relationship to surrounding dirt/grass.

Avoid:

* perfectly uniform grey,
* mirror-like asphalt,
* pitch-black asphalt,
* repeated obvious texture tiling.

If procedural surfaces are used, follow the recipe's provided surface tooling where appropriate.

---

# 31. TRACK EDGES

Track boundaries must communicate racing line intuitively.

Use combinations of:

* edge paint/curbing,
* timber/soft barriers,
* hay bales,
* stone,
* dust transitions,
* roadside vegetation,
* banners/colour shapes without relying heavily on readable text.

The 404 format is weak at small printed typography.

Do not build the art direction around readable trackside advertising.

Use shape, colour and silhouette instead.

---

# 32. HUMAN PRESENCE WITHOUT "ROBOT VIBE"

The game should feel inhabited.

This does NOT require highly detailed human models everywhere.

Use:

* spectator groups,
* canopies,
* parked service vehicles if generated properly,
* marshal stations,
* flags,
* folding structures,
* viewing areas,
* distant crowd treatment.

Any close human figures must not look like robots.

Do not place metallic grey humanoid primitives along the track.

For distant crowds, prefer appropriate low-cost treatment rather than ugly close-up geometry.

---

# 33. PARTICLES AND GAME FEEL

Use restrained effects:

* dust when leaving asphalt,
* small tyre smoke under heavy slip,
* tiny debris where appropriate,
* finish celebration if lightweight.

Particles must support gameplay.

Do not fill the screen with effects.

---

# 34. VISUAL HIERARCHY

At any racing moment, the eye should understand:

1. player car,
2. next track direction,
3. opponents,
4. immediate track boundaries,
5. environment.

If scenery competes with gameplay, simplify it.

---

# 35. PERFORMANCE BUDGET

The official hard limits are not our targets.

Leave safety margin.

Aim approximately for:

* total transferred size under 8 MB,
* draw calls generally under 700,
* triangles generally under 1.2M,
* stable usable mobile performance,
* ideally around 60 FPS where realistic.

Hard jam limits must still be respected.

Optimise using:

* instancing,
* shared materials,
* sensible object density,
* distance-based detail,
* pooled particles,
* avoiding excessive transparency,
* avoiding needless material clones.

Be especially careful with transparent double-sided materials.

---

# 36. MOBILE IS A FIRST-CLASS PLATFORM

The judges play on phone and laptop.

The game must not merely "technically support touch."

Mobile controls must be comfortable.

Suggested layout:

Left thumb:

* steering control.

Right thumb:

* accelerator,
* brake,
* optional handbrake.

Buttons should be large enough.

Do not cover the racing line.

Respect safe areas.

Test portrait behaviour and lock/use landscape appropriately if the game requires landscape.

If landscape is required, communicate it elegantly.

Real touch events must start and move the game.

---

# 37. DESKTOP CONTROLS

Support:

* WASD
* Arrow keys where sensible
* brake/reverse
* optional handbrake
* pause
* restart/reset

Make controls visible in How To Play and/or pre-race presentation.

---

# 38. WRITE A CUSTOM RACING PLAYTEST/GATE

The generic recipe playtest is insufficient for this game.

Build a game-specific automated racing test inside the appropriate harness location.

The test should use REAL browser input events.

Do not invoke internal debug movement functions.

The test should verify at minimum:

* game reaches ready state,
* start button works,
* race countdown completes,
* forward input moves the player,
* steering changes vehicle heading,
* touch acceleration moves the player on mobile viewport,
* touch steering changes direction,
* AI cars move,
* race position logic updates plausibly,
* checkpoint progress works,
* reset/recovery works,
* no console errors,
* no asset 404s,
* FPS telemetry is based on real elapsed time,
* draw calls and triangles remain healthy.

If practical, test braking and handbrake/slip as well.

Expose/update official telemetry:

`window.__READY__`

`window.__START__`

`window.__GAME__`

with real:

* position,
* FPS,
* speed,
* score/state if relevant,
* race-over state,
* draw calls,
* triangles.

Do not fake telemetry.

---

# 39. FUNCTIONAL TESTS

Test the race state machine separately.

Verify:

* countdown,
* race start,
* checkpoint order,
* lap completion,
* finish detection,
* race ranking,
* tie handling,
* championship points,
* next-race transition,
* final standings,
* replay,
* restart,
* AI recovery.

A player must not be able to finish laps by crossing only the start/finish line repeatedly.

Use ordered checkpoints.

---

# 40. AI VALIDATION

Create repeatable AI simulation checks where possible.

Run AI races without player intervention and verify:

* all cars can complete the route,
* none remain permanently stuck,
* differences in personality actually affect behaviour,
* no AI routinely drives through walls,
* no AI permanently reverses,
* no AI circles one checkpoint forever,
* no AI finishes impossible laps.

The personalities should create variance without breaking fairness.

---

# 41. CRITIC ROUND 1 — COMPOSITION

After the first visual rebuild:

Run the game in motion.

Capture representative frames.

Use a fresh critic/sub-agent that did not build the scene.

Give it:

* target concept frames,
* current frames,
* `STYLE_LOCK.md`,
* `VISUAL_CLAIMS.md`.

Ask it to identify the SINGLE largest visual reason the current build still loses to the target.

It must issue:

PASS

or

FAIL.

"Looks okay" is not a pass.

If FAIL, fix the highest-impact issue.

Record the critique under:

`receipts/critics/round-1.md`

---

# 42. CRITIC ROUND 2 — VEHICLES & MATERIALS

Use a different critic.

Focus especially on:

* car silhouette,
* wheels,
* paint response,
* glass,
* body proportions,
* rival differentiation,
* robotic/generic geometry,
* material quality.

Record it.

Fix the most decisive problem.

---

# 43. CRITIC ROUND 3 — RACING IN MOTION

Use another fresh critic.

This round MUST judge moving race frames.

Not menu screenshots.

Not parked cars.

Not isolated assets.

Compare:

* close racing,
* overtaking,
* fast corner,
* shaded section,
* finish section.

Ask:

Does this look like a deliberately art-directed finished racing game while moving?

If not, identify the one largest reason.

Fix it.

---

# 44. OPTIONAL ROUND 4

Only run a fourth major critic round if there is a clearly fixable high-impact gap.

Do NOT loop forever.

If critics repeatedly identify a structural limitation twice, change the approach instead of blindly rerunning the same process.

---

# 45. SAVE THE RECEIPTS

Create:

`receipts/`

Keep useful evidence such as:

* initial screenshots,
* style lock,
* scene reference list,
* visual claims,
* rejected asset candidates,
* verifier output,
* critic rounds,
* performance logs,
* gameplay-test logs,
* jam-gate output,
* before/after comparisons.

Do not clutter the shipped build if receipt files can be kept outside the public game payload.

These receipts should show real iteration.

---

# 46. MAKE MEANINGFUL COMMITS

Do not put the entire rescue into one mega-commit if work naturally breaks into stages.

Examples of meaningful phases:

* audit and art-direction lock,
* player-car rebuild,
* rival-car rebuild,
* environment asset rebuild,
* track visual pass,
* driving feel improvement,
* AI personality refinement,
* championship/results polish,
* mobile controls,
* audio/FX,
* performance,
* gate fixes.

Do not fabricate history.

Use the actual work.

---

# 47. DO NOT COPY 404 DRIVE

You may inspect 404's Drive reference for general lessons about:

* camera,
* controls,
* performance,
* recipe usage,
* testing methodology.

You MUST NOT copy:

* its code,
* assets,
* layout,
* exact track,
* vehicle design,
* environment composition,
* UI,
* distinctive game mechanics.

Our game needs its own identity.

---

# 48. PRIORITY ORDER

If time becomes constrained, work in this exact priority order:

1. Game starts and remains technically valid.
2. Driving feels good.
3. Player car looks excellent.
4. AI opponents race correctly.
5. Rival personalities are clearly different.
6. One race looks genuinely excellent.
7. Championship works.
8. Remaining track layouts look cohesive.
9. Mobile controls feel good.
10. Lighting/environment composition.
11. Race presentation and HUD.
12. Audio/particles/minor polish.

Do not sacrifice items 1–6 to add unnecessary breadth.

One excellent environment reused intelligently is better than three ugly unrelated worlds.

---

# 49. DEFINITION OF "DONE"

Do NOT mark this project complete because:

* it compiles,
* the cars move,
* AI follows waypoints,
* three tracks exist,
* the menu works.

The project is done only when all of the following are true:

The game has a coherent visual identity.

The old robotic aesthetic is gone.

The player car looks intentionally designed.

All three rivals are visually and behaviourally recognisable.

Driving is immediately enjoyable.

The camera feels good at speed.

The championship works from beginning to end.

The result screen works.

Mobile controls work with real touch events.

The game runs without console errors.

The game runs without missing assets.

Track boundaries are readable.

The world feels inhabited.

The road/environment do not look like placeholder geometry.

Lighting creates depth.

Motion frames still look good.

At least three meaningful critic rounds have been completed.

The custom racing gate passes.

The official shipping checks pass.

The deployed URL works.

The official jam gate passes.

---

# 50. FINAL OFFICIAL VALIDATION

Before finalising:

Run appropriate asset verification.

Run the custom racing gameplay test.

Run the recipe shipping check.

Use stamping where instructed by the recipe.

Deploy the real game.

Then test THE DEPLOYED URL rather than trusting localhost.

Run the official live/mobile verification.

Finally run the official jam gate against the deployed URL and the actual submission commit.

Do not paste an invented verdict.

Use the real verdict exactly as produced.

---

# 51. FINAL REPORT BACK TO ME

When everything is finished, give me a concise but complete report containing:

### A. Audit

What was wrong with the original version.

### B. Visual overhaul

Which assets/environment systems were replaced and why.

### C. 404 asset process

Which important assets used references, three candidates, verification and final selection.

### D. Gameplay

What changed in handling, camera, collisions and racing.

### E. Rivals

Explain precisely how Charger, Technician and Defender differ in code and actual behaviour.

### F. Championship

Race structure, points and progression.

### G. Mobile

What was tested with real touch.

### H. Critic rounds

What each critic rejected and what changed as a result.

### I. Performance

Final load size, draw calls, triangle count and FPS observations.

### J. Tests

Every automated/manual test run and its result.

### K. Jam compliance

Results of ship/live/jam validation.

### L. Remaining limitations

State anything still imperfect instead of hiding it.

---

# FINAL DIRECTIVE

Do not make another generic AI racing demo.

Make a small but convincing finished racing game.

Quality beats quantity.

Gameplay comes first.

Cars come second.

Visual composition comes third.

Then polish everything around them.

The player's first reaction should NOT be:

"This looks AI-generated."

It should be:

"This actually feels like a little racing game."

The strongest identity of the project is the persistent-rival championship:

four cars,
three recurring opponents,
three recognisable racing personalities,
three races,
one championship.

The player should finish the game knowing how each opponent drives.

Preserve anything from the existing build that genuinely helps achieve that.

Replace everything that does not.

https://github.com/404-Repo/404-game-recipe

Now read the existing repository, read the official 404 recipe documents, audit the current game, write `RESCUE_AUDIT.md` and `STYLE_LOCK.md`, and then execute the overhaul end-to-end without stopping after the first acceptable-looking pass.
