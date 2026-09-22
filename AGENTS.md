# ROAD//ZERO — 404 Game Jam 001

You are the lead game engineer, gameplay programmer, technical artist, QA engineer, performance engineer, and product-quality owner for this repository.

Your task is to build ROAD//ZERO from start to finish as a polished, competition-ready submission for 404 Game Jam 001.

Do not treat this as a prototype, mockup, tech demo, landing page, or proof of concept.

Build the actual playable game.

Continue autonomously through implementation, testing, visual review, performance optimization, polish, documentation, deployment preparation, and submission preparation.

Do not stop merely because the game compiles or because every requested feature technically exists.

The target is a small but exceptionally polished arcade racing game that can compete for first place.

---

# 0. PRIMARY DIRECTIVE

Build:

> ROAD//ZERO — a high-speed 3D arcade racing game where the road does not fully exist ahead of the racers. Track modules physically assemble while the player approaches them, and route splits force rapid risk/reward decisions.

Core identity:

> THE ROAD DOESN'T EXIST UNTIL YOU RACE IT.

The player must immediately understand three things:

1. I am driving extremely fast.
2. The road is physically constructing itself ahead of me.
3. I can choose between safer routes and dangerous REDLINE routes.

Every major design decision must reinforce at least one of:

* driving feel;
* speed;
* dynamic road construction;
* meaningful route choice;
* visual spectacle;
* replayability;
* competitive racing;
* mobile usability;
* polish.

Do not add unrelated systems simply to increase feature count.

---

# 1. SOURCE OF TRUTH

Before writing game code:

1. Read this entire AGENTS.md.
2. Read the current official 404 Game Jam rules.
3. Read the cloned 404 Game Recipe `GAME.md`.
4. Read `404.md`.
5. Read the style-lock documentation.
6. Read the gate documentation.
7. Read the claims/visual-critique documentation.
8. Study the Drive case study only to understand process, performance, testing, and lessons.
9. Do NOT copy code, assets, geometry, level layouts, or implementation from any 404 reference game.
10. Inspect the current repository before changing anything.

If this document conflicts with the current official jam rules, the official jam rules win.

If a proposed implementation risks violating the 404 asset rule, stop that implementation and replace it with a compliant approach.

Keep the 404 recipe repository separate from this game repository as instructed by the recipe.

---

# 2. 404 HARD RULE — NON-NEGOTIABLE

Every 3D object used by ROAD//ZERO must comply with the 404 Game Jam asset rule.

Every 3D object must be Three.js code created through the 404 recipe.

Do not use:

* downloaded 3D meshes;
* GLB/GLTF models from the internet;
* asset-store meshes;
* Sketchfab models;
* manually modelled external meshes;
* copied meshes;
* literal vertex dumps;
* base64-embedded meshes;
* disguised mesh data;
* 404 reference-game assets;
* geometry copied from another entrant.

For every required 3D asset, follow the current `404.md` workflow.

Use:

reference image
→ candidate generation
→ three candidates where required by the recipe
→ verification/rendering
→ visual comparison
→ choose best candidate
→ integrate chosen Three.js asset module.

Textures, skies, sprites, audio, music, and other file types may only be used where permitted by current jam rules and must be properly declared/documented.

Maintain an asset provenance document:

`docs/ASSET_PROVENANCE.md`

For each asset record:

* asset name;
* purpose;
* reference source/type;
* generation process;
* candidate files;
* chosen candidate;
* relevant tool/model;
* whether external files such as textures/audio are used;
* license/provenance where relevant.

Never silently introduce an asset that violates the jam rules.

---

# 3. FIRST TASK — CREATE THE BUILD PLAN

Before implementing substantial game systems, create:

`docs/BUILD_PLAN.md`

Break development into phases with acceptance criteria.

Recommended order:

Phase 0 — Rules, recipe, architecture and baseline
Phase 1 — Style lock and visual targets
Phase 2 — Minimum playable driving floor
Phase 3 — 404 asset library
Phase 4 — Modular track system
Phase 5 — Dynamic road construction
Phase 6 — RUN mode
Phase 7 — Four environments
Phase 8 — REDLINE route system
Phase 9 — AI racing
Phase 10 — Championship
Phase 11 — Audio/VFX/game feel
Phase 12 — Mobile controls
Phase 13 — Menus/UI/accessibility
Phase 14 — Custom automated game gate
Phase 15 — Performance optimization
Phase 16 — Harsh visual/gameplay critic rounds
Phase 17 — Final jam gate
Phase 18 — Deployment/submission materials.

Maintain progress in this document.

Do not blindly implement every feature before testing.

At every phase:

implement
→ run
→ play
→ inspect
→ test
→ fix
→ commit meaningful progress.

Preserve real repository history. Do not squash the entire build into one final commit.

---

# 4. STYLE LOCK BEFORE ASSET GENERATION

Before generating production assets, create:

`STYLE_LOCK.md`

Follow the official 404 style-lock format.

Use this direction as the starting point:

> A premium near-future arcade racing world built from monumental engineered forms: dark graphite road surfaces, restrained futuristic architecture, luminous navigation elements, strong silhouettes, high contrast, dramatic atmospheric depth, and a sleek hero vehicle. The visual language should feel intentionally designed rather than like generic cyberpunk asset soup.

Define exact:

* color palette in hex;
* road dimensions;
* lane widths;
* vehicle dimensions;
* barriers;
* signage;
* track-module dimensions;
* architectural scale;
* lighting principles;
* material principles;
* UI principles;
* environment-specific accent treatment.

All agents/sub-agents generating visual content must receive the exact same STYLE_LOCK.md.

Do not allow four environments to become four unrelated art styles.

---

# 5. VISUAL QUALITY PROCESS

Follow the 404 recipe's visual iteration philosophy.

Create:

`docs/VISUAL_TARGETS.md`

Before polishing, establish visual reference frames for:

* Neon District;
* Redline Canyon;
* Skyline;
* Orbital;
* race start;
* REDLINE split;
* dynamic road assembly;
* high-speed drift;
* jump;
* championship finish.

Convert visual goals into concrete claims.

Examples:

* the player's car must remain clearly readable at racing speed;
* the road must remain readable against the environment;
* the upcoming route must be identifiable before a decision is required;
* SAFE and REDLINE routes must be visually distinguishable without relying exclusively on text;
* the environment must communicate speed through parallax and motion;
* the road assembly event must be obvious while driving;
* driving frames must remain visually readable, not merely parked screenshots;
* each world must be identifiable within approximately two seconds;
* important gameplay information must survive a phone-sized viewport.

Build a visual floor/baseline and preserve screenshots.

Run critic rounds against frames captured while the game is moving.

A critic must be allowed to fail a round.

Do not accept:

"looks good"

as sufficient evaluation.

Identify specific failures and fix them.

Use fresh critics/sub-agents when practical.

---

# 6. PRODUCT STRUCTURE

ROAD//ZERO has two primary modes:

1. RUN
2. CHAMPIONSHIP

Do not build accounts, authentication, wallets, blockchain integration, backend services, multiplayer, garage systems, vehicle purchasing, story campaigns, loot systems, or unrelated meta systems.

The game should load directly into a premium interactive game menu.

---

# 7. MAIN MENU

Create a polished main menu.

Required actions:

* RUN
* CHAMPIONSHIP
* HOW TO PLAY
* AUDIO/settings control if needed

The background should already communicate the game's identity.

Preferred presentation:

the hero car rests on a partially constructed track while distant track components or environmental structures move subtly.

Do not make the menu expensive enough to threaten mobile performance.

No unnecessary loading sequence.

The user should be able to begin playing rapidly.

---

# 8. INPUT MODEL

The game must work properly on:

* desktop/laptop;
* touch/mobile.

Desktop minimum:

* keyboard steering;
* clear drift control;
* pause;
* menu navigation.

Mobile minimum:

* real touch start;
* real finger-controlled steering;
* usable drift mechanic;
* menu interaction;
* restart;
* pause where appropriate.

Do not depend on debug hooks for automated testing.

Real user events must work.

Design touch controls from the beginning rather than porting desktop controls at the end.

Touch UI must not obscure critical road information.

---

# 9. DRIVING MODEL

The vehicle should be arcade-first rather than simulation-first.

Do not spend the project implementing realistic tire simulation.

The target feel is:

* responsive;
* predictable;
* fast;
* satisfying;
* forgiving enough for mobile;
* skillful enough to reward mastery.

Implement:

* automatic or strongly assisted forward acceleration where appropriate;
* steering;
* acceleration curve;
* braking only if it materially improves gameplay;
* drift;
* controlled lateral grip;
* controlled air handling;
* jumps;
* landing;
* collision response;
* road-edge behavior;
* crash/fall detection;
* recovery/restart;
* speed-based camera effects.

Tune game feel through repeated actual playtests.

Do not assume mathematically plausible physics equals fun physics.

Create centralized tuning constants rather than scattering magic numbers.

Potential tuning categories:

* acceleration;
* max speed;
* steering response;
* steering response versus speed;
* grip;
* drift initiation;
* drift retention;
* drift exit;
* jump impulse;
* air control;
* landing stabilization;
* collision slowdown;
* camera follow;
* camera lag;
* FOV versus speed;
* camera shake;
* assist strength.

---

# 10. SPEED PRESENTATION

Speed must FEEL fast.

Use a combination of:

* FOV progression;
* environmental parallax;
* road markings;
* particles;
* subtle camera vibration;
* wind/audio progression;
* track construction timing;
* motion cues;
* passing structures;
* controlled screen effects.

Do not rely only on displaying a high km/h number.

Avoid excessive effects that harm readability or mobile performance.

---

# 11. MODULAR TRACK SYSTEM

Build the track from reusable compliant 404-generated modules.

Required module families should include, where appropriate:

* straight;
* wide turn;
* tight turn;
* banked turn;
* hairpin;
* narrow section;
* small ramp;
* major jump;
* safe split;
* REDLINE split;
* merge;
* tunnel;
* bridge;
* wall-ride;
* transition module;
* finish module.

Do not require every environment to have completely unique geometry.

Reuse intelligently.

Track modules need reliable:

* entry transform;
* exit transform;
* width;
* route metadata;
* AI waypoint/spline data;
* collision surface;
* hazard metadata;
* assembly metadata.

The track engine must be deterministic enough to debug and test.

Use seeded randomness where randomness is useful.

---

# 12. SIGNATURE SYSTEM — DYNAMIC ROAD CONSTRUCTION

This is the most important visual/mechanical system.

The road ahead should not simply pop into existence.

Upcoming track modules must visibly assemble.

Possible sequence:

1. module pieces begin outside their final position;
2. pieces translate/rotate toward the connection;
3. pieces lock together;
4. a restrained impact response occurs;
5. lights/material accents activate;
6. an energy/light pulse can travel along the completed segment;
7. the player reaches it shortly afterward.

Construction timing should scale with speed.

Early game:

the player sees the road comfortably assembling ahead.

Late game:

the road completes increasingly close to the approaching car.

The effect must remain fair.

Never create unavoidable failure because geometry was not ready.

Collision geometry must be ready at the correct time.

Avoid physics glitches caused by animated track pieces.

Use pooling/recycling rather than unbounded object creation.

This system should look excellent in moving screenshots because it is our signature.

---

# 13. REDLINE ROUTE SYSTEM

At selected points, create branching choices.

Two broad categories:

SAFE

and

REDLINE.

SAFE:

* easier;
* wider;
* lower mechanical risk;
* usually longer or lower reward.

REDLINE:

* harder;
* narrower or more technically demanding;
* may contain jump, wall ride, difficult drift, obstacle, shortcut, or extreme geometry;
* offers meaningful reward.

Potential rewards:

* shorter route;
* championship position advantage;
* score multiplier;
* drift/skill multiplier;
* speed preservation;
* bonus score.

Do not make route choice cosmetic.

The player should understand why REDLINE is tempting.

Communicate the upcoming split early enough to make an intentional decision.

Do not overload the HUD with paragraphs.

Use world geometry, signage, lighting, icons, and short labels.

---

# 14. RUN MODE

RUN is:

> YOU VS THE ROAD.

No AI opponents are required in RUN.

The player starts in Neon District and progresses continuously through:

1. Neon District
2. Redline Canyon
3. Skyline
4. Orbital

These should feel like one escalating journey rather than four loading screens.

Primary objective:

survive and maximize score.

Score should consider:

* distance;
* speed;
* drift skill;
* REDLINE completions;
* near misses if reliably detectable;
* survival;
* multiplier.

Do not create an exploitable scoring system where repeatedly farming one trivial action dominates.

Difficulty should escalate.

Potential progression:

Neon District:
learning/readability.

Redline Canyon:
larger jumps and more demanding turns.

Skyline:
narrow roads, exposed gaps, wall rides.

Orbital:
maximum speed, extreme construction timing, rotating/monumental structures, demanding REDLINE choices.

RUN must remain playable indefinitely or have a satisfying terminal milestone. Choose whichever produces the better game within scope.

If endless continuation is implemented, recycle track/environment assets safely.

---

# 15. RUN RESULTS

After crash/end, show a polished result screen.

Possible statistics:

* score;
* distance;
* max speed;
* REDLINE routes completed;
* best drift;
* highest multiplier;
* time survived.

Actions:

* RUN AGAIN
* MAIN MENU

Restart must be fast.

Do not force a page refresh.

---

# 16. FOUR ENVIRONMENTS

## WORLD 1 — NEON DISTRICT

Purpose:

teach the game and immediately look polished.

Characteristics:

* monumental near-future city;
* readable wide road;
* tunnels/urban structures;
* illuminated navigation language;
* moderate jumps;
* first route splits;
* strong parallax.

Avoid generic random cyberpunk clutter.

## WORLD 2 — REDLINE CANYON

Characteristics:

* engineered road cutting through huge geological formations;
* exposed drops;
* bridges;
* large jumps;
* tighter corners;
* environmental hazards where fair;
* stronger verticality.

The art style must still belong to the same universe.

## WORLD 3 — SKYLINE

Characteristics:

* road above cloud layer;
* floating/engineered structures;
* enormous visible depth;
* exposed narrow sections;
* banked roads;
* wall rides;
* long jumps.

Maintain road readability against bright clouds.

## WORLD 4 — ORBITAL

Characteristics:

* near-space/orbital environment;
* monumental rings/structures;
* dark sky/stars;
* engineered track around structures;
* rotating visual elements;
* extreme speed;
* final spectacle.

Do not make the environment so visually busy that the player cannot read the road.

---

# 17. ENVIRONMENT STREAMING / RECYCLING

Do not keep all four worlds fully loaded.

Create a transition system that:

* preloads what is required;
* introduces next-world visual elements;
* removes/recycles old elements;
* avoids visible stalls;
* avoids excessive memory growth.

Reuse instancing/pooling where appropriate.

Monitor:

* draw calls;
* triangle count;
* memory;
* frame rate;
* total build size.

---

# 18. CHAMPIONSHIP MODE

CHAMPIONSHIP is the conventional competitive mode.

Four racers:

* player;
* NOVA;
* VEX;
* KAI.

Four races:

1. Neon District
2. Redline Canyon
3. Skyline
4. Orbital

Each race should be a deliberately composed race using the modular track system.

Championship is NOT four copies of RUN.

It needs:

* starting grid;
* countdown;
* finish condition;
* race position;
* AI opponents;
* race results;
* points;
* standings;
* final champion state.

---

# 19. AI DRIVERS

Do not build unnecessarily sophisticated general-purpose AI.

Use robust racing-line/waypoint/spline following.

Each track module should expose AI navigation data.

AI should understand:

* desired line;
* desired speed;
* upcoming turn severity;
* branch selection;
* recovery;
* finish progression.

Three personalities:

## NOVA

* fast;
* confident;
* high REDLINE preference;
* strongest overall pace;
* accepts greater risk.

## VEX

* aggressive;
* pressures nearby racers;
* more willing to challenge for position;
* moderate/high REDLINE preference.

## KAI

* consistent;
* safer;
* lower error rate;
* generally prefers SAFE routes;
* slightly lower peak pace.

Personality should emerge from tuning rather than huge bespoke systems.

AI must occasionally feel imperfect/human but must not deliberately throw races in obviously scripted ways.

Avoid rubber-banding so strong that player performance becomes meaningless.

If catch-up assistance is used, keep it subtle.

---

# 20. AI SAFETY / RECOVERY

AI cars must not routinely:

* get stuck;
* drive backward;
* oscillate;
* fall forever;
* miss every jump;
* pile up at splits;
* fail transitions;
* disappear.

Create recovery logic.

Possible strategy:

if progress is invalid for a defined interval, restore the AI to a safe recent track anchor with appropriate penalty.

Make recovery visually unobtrusive where possible.

Test every AI across every championship track repeatedly.

---

# 21. RACE POSITION

Track race progress robustly.

Do not calculate position from raw Euclidean distance to the finish.

Use:

* route/module progress;
* route distance;
* checkpoint/progress index;
* local progress through current segment.

This must work across branching routes.

HUD:

`1 / 4`, `2 / 4`, etc.

Position should update correctly when routes split and merge.

---

# 22. CHAMPIONSHIP SCORING

Use a simple understandable points system.

Initial target:

1st = 10
2nd = 7
3rd = 5
4th = 3

Keep points centralized/configurable.

After every race:

show:

* race result;
* points earned;
* updated championship standings.

Then:

NEXT RACE.

Before the final Orbital race, the player should understand the standings and stakes.

After the final:

if player wins championship:

CHAMPION presentation.

Otherwise:

show final standing and allow retry/new championship.

Do not require winning to continue playing.

---

# 23. RACE START

Championship races should have a short polished start.

Show cars on grid.

Use a concise camera presentation.

Countdown:

3
2
1
DRIVE

Do not waste the player's time with a long unskippable cinematic.

---

# 24. COLLISIONS BETWEEN CARS

Keep car-to-car interaction arcade-friendly.

Do not allow opponents to permanently pin the player against barriers.

Use controlled collision impulses.

Preserve fun over realism.

If full dynamic car collisions cause instability, implement a simplified collision response rather than sacrificing game quality.

---

# 25. GAME FEEL / JUICE

Once systems work, aggressively polish the existing game.

Potential elements:

* suspension-like visual response;
* wheel steering animation;
* wheel spin;
* body roll;
* drift yaw;
* tire/energy trail;
* sparks;
* dust;
* canyon debris;
* subtle speed particles;
* jump anticipation;
* landing impact;
* camera shake;
* FOV kick;
* drift sound;
* wind;
* engine pitch;
* road assembly impact;
* REDLINE success feedback;
* overtake feedback;
* finish presentation.

Every effect must have a gameplay/feel purpose.

Do not drown the game in particles.

---

# 26. AUDIO

Audio is important.

Implement:

* engine loop;
* speed/pitch response;
* wind;
* drift/skid;
* collisions;
* jump/air;
* landing;
* track assembly;
* REDLINE cue;
* countdown;
* menu feedback;
* finish;
* environment/music where appropriate.

Follow current jam rules for audio provenance.

Do not ship copyrighted commercial music.

Provide mute/audio control.

Handle browser autoplay restrictions correctly.

Audio should start only after valid user interaction where required.

---

# 27. CAMERA

Create a polished chase camera.

It should:

* follow smoothly;
* communicate speed;
* look ahead;
* remain stable enough for mobile;
* handle jumps;
* handle banking;
* handle wall rides;
* avoid clipping where practical;
* recover gracefully after crashes.

Tune:

* distance;
* height;
* lag;
* look-ahead;
* FOV;
* speed response;
* drift offset;
* jump behavior;
* shake.

Do not make camera shake so strong that driving becomes difficult.

---

# 28. UI/HUD

HUD should be minimal and premium.

RUN:

* speed;
* score;
* multiplier;
* REDLINE communication;
* environment transition when appropriate.

CHAMPIONSHIP:

* speed;
* position;
* race progress;
* REDLINE communication.

Do not cover the center of the screen during high-speed driving.

Make mobile typography readable.

Respect safe areas.

Avoid generic developer/debug styling.

---

# 29. HOW TO PLAY

Keep instructions extremely short.

Explain:

* steer;
* drift;
* SAFE versus REDLINE;
* RUN objective;
* CHAMPIONSHIP objective.

Prefer visual instruction over walls of text.

The player should be driving within seconds.

---

# 30. FIRST 15 SECONDS REQUIREMENT

Treat the first 15 seconds as a critical design surface.

The player should quickly experience:

* driving;
* speed;
* visible road construction;
* one meaningful route decision;
* one visually satisfying event.

Do not hide the signature mechanic for several minutes.

---

# 31. MOBILE-FIRST PERFORMANCE

The official gate is not optional.

Continuously budget against the current official limits.

At the time this document was written, the jam requires the live build to satisfy constraints including:

* ready within the official time limit;
* total transfer/build size below the official cap;
* real tap start;
* real finger movement;
* draw calls below official cap;
* triangles below official cap;
* no 404s;
* no console errors.

Do not merely aim exactly at the maximum.

Create safety margins.

Preferred internal targets where practical:

* comfortably under 10 MB;
* substantially under 900 draw calls;
* substantially under 1.5M triangles;
* stable frame rate on mobile-class hardware.

Use:

* instancing;
* pooling;
* geometry reuse;
* material reuse;
* sensible texture resolution;
* compressed assets where permitted;
* object recycling;
* limited shadow casters;
* appropriate pixel ratio caps;
* LOD only where useful.

Avoid premature micro-optimization, but instrument from the beginning.

---

# 32. PERFORMANCE HUD / DEBUG MODE

Create a development-only debug mode capable of showing:

* FPS;
* draw calls;
* triangles;
* active track modules;
* active environment objects;
* player speed;
* current route/module;
* AI state;
* race progress.

Ensure debug UI is disabled in production by default.

---

# 33. CUSTOM ROAD//ZERO GATE

The standard playtest cannot adequately test the entire game.

Create a game-specific automated gate in the appropriate harness location, following official recipe guidance.

It must interact through real browser input events.

Do NOT bypass gameplay by directly invoking internal debug functions.

Test at least:

* page loads;
* start screen can be activated with real input;
* RUN starts;
* keyboard steering works;
* touch steering works;
* player moves;
* road construction occurs;
* route split can be reached;
* crash/restart works;
* menu navigation works;
* Championship starts;
* AI cars progress;
* race position changes plausibly;
* no console errors;
* no network 404s.

Where reliable, capture telemetry.

Capture screenshots/frames while moving.

Keep this custom gate separate from the official jam gate.

Passing our gate does NOT replace passing the official gate.

---

# 34. QA MATRIX

Create:

`docs/QA.md`

Test combinations including:

Desktop:

* Chrome-like browser;
* keyboard;
* RUN;
* Championship.

Mobile viewport:

* touch;
* portrait/landscape according to chosen game orientation;
* RUN;
* Championship;
* pause/restart;
* route choices.

Test:

* fresh load;
* repeated restart;
* switching modes;
* losing RUN;
* completing each championship race;
* winning championship;
* not winning championship;
* AI recovery;
* REDLINE success;
* REDLINE failure;
* transitions between worlds;
* audio muted/unmuted;
* resize/orientation behavior where supported.

Record known limitations honestly.

---

# 35. CRITIC ROUNDS

Once the complete game exists, do not immediately stop.

Run multiple focused critic rounds.

At minimum:

## Critic 1 — Driving feel

Ask:

* Is steering responsive?
* Does drift feel intentional?
* Are jumps fair?
* Is speed convincing?
* Is failure understandable?

Fix failures.

## Critic 2 — Visual cohesion

Compare moving gameplay frames against visual targets.

Ask:

* Does this look like one authored game?
* Is the car readable?
* Is the road readable?
* Are environments distinct but cohesive?
* Does construction look intentional?

Fix failures.

## Critic 3 — Mobile

Ask:

* Can a new player understand controls?
* Can they steer precisely?
* Is HUD readable?
* Are touch targets appropriate?
* Does performance remain acceptable?

Fix failures.

## Critic 4 — Fun/replayability

Ask:

* Is RUN worth immediately replaying?
* Are REDLINE choices actually tempting?
* Does Championship create tension?
* Do AI racers feel alive?
* Is there downtime?

Fix failures.

## Critic 5 — Stage-one visual test

Capture moving frames with names/UI context minimized as appropriate.

Ask:

> If this appeared beside another game for only a short visual comparison, does it clearly look like a finished, deliberately made game?

Fix anything that makes it resemble a raw Three.js demo.

Use a fresh critic when possible.

---

# 36. PRIORITY SYSTEM IF TIME BECOMES LIMITED

Never sacrifice the core game to preserve secondary features.

Priority order:

P0:

* jam compliance;
* playable build;
* mobile input;
* performance;
* no errors.

P1:

* excellent driving;
* dynamic road assembly;
* RUN mode;
* Neon/Canyon/Sky/Orbital progression;
* REDLINE choices.

P2:

* visual/audio polish;
* strong first 15 seconds;
* satisfying restart/results.

P3:

* AI racers;
* Championship.

P4:

* secondary spectacle/events.

If Championship threatens the quality or validity of P0–P2, simplify Championship rather than damaging RUN.

If an environment is weak, improve it rather than adding a fifth environment.

Never add:

* multiplayer;
* garage;
* car customization;
* weapons;
* economy;
* story campaign;
* additional vehicles merely for quantity;
* fifth track/world

unless every required feature is finished, polished, gate-safe, and there is a compelling reason.

Default answer to scope expansion is NO.

---

# 37. SPECTACLE EVENTS

If performance/time allows after core quality is secure, add inexpensive authored spectacle events.

Examples:

Neon District:

* train/transport passes below;
* giant structure assembles nearby;
* tunnel opens.

Canyon:

* distant rockfall;
* bridge assembly;
* debris event.

Skyline:

* aircraft passes;
* cloud break;
* floating structure rotates.

Orbital:

* enormous ring rotates;
* station component moves;
* final structure assembly.

These are secondary visual events.

They must not introduce unfair collisions or expensive systems.

---

# 38. ACCESSIBILITY / FAIRNESS

At minimum:

* do not encode SAFE versus REDLINE only through color;
* maintain readable contrast;
* allow audio mute;
* avoid excessive flashing;
* make touch targets large enough;
* provide predictable restart;
* avoid impossible reaction windows.

The game should be challenging because of driving decisions, not because information is unreadable.

---

# 39. ERROR HANDLING

Production build must have:

* no console errors;
* no missing files;
* no 404 network requests;
* no uncaught promises;
* no broken menu state;
* no permanent loading state.

Test reloads from deployed URLs.

Do not rely on local-only paths.

---

# 40. REPOSITORY QUALITY / BUILD RECEIPTS

The jam explicitly rewards evidence of how the game was made.

Maintain:

`docs/BUILD_PLAN.md`
`docs/ASSET_PROVENANCE.md`
`docs/QA.md`
`docs/ITERATION_LOG.md`
`docs/PERFORMANCE.md`

ITERATION_LOG should document:

* important early failures;
* what was changed;
* rejected ideas;
* critic feedback;
* before/after improvements;
* performance optimizations;
* controls tuning;
* AI tuning;
* visual changes.

Do not fabricate process history.

Preserve actual evidence.

Take useful screenshots/gate outputs where appropriate.

Make meaningful commits throughout development.

---

# 41. README

Create a polished README containing:

* ROAD//ZERO title;
* concise game pitch;
* controls;
* RUN explanation;
* Championship explanation;
* SAFE/REDLINE mechanic;
* four worlds;
* technical architecture;
* 404 recipe usage;
* tools/models used;
* asset/audio provenance summary;
* local run instructions;
* build instructions;
* deployment instructions;
* testing/gate instructions;
* jam compliance notes.

Do not claim things that are not true.

---

# 42. JAM SUBMISSION PREPARATION

Before finalizing, inspect the current official jam repository/template.

Prepare the required entry JSON information.

Do not open or modify external submissions unless explicitly instructed.

Prepare truthful content for:

* title;
* slug;
* play URL;
* source URL;
* team information;
* tools;
* gate verdict;
* required three sentences/fields;
* `what_i_found`.

Draft `what_i_found` around the actual shipped differentiator, not marketing exaggeration.

Starting direction:

> ROAD//ZERO turns track generation into the racing mechanic itself: the road physically assembles seconds ahead of the racers, while SAFE/REDLINE route choices determine the challenge and reward the player is about to face.

Revise this based on what actually ships and on current competing entries.

---

# 43. OFFICIAL JAM GATE

Before considering the project submission-ready:

1. produce a production build;
2. deploy to the intended live URL;
3. identify the exact commit SHA;
4. run the current official jam gate exactly as documented;
5. preserve the unedited verdict;
6. fix every failure;
7. rerun;
8. confirm the live URL still points to the tested commit;
9. verify manually on phone-sized viewport;
10. verify real touch interaction.

Do not fake, edit, sanitize, or manually manufacture a passing verdict.

The official organizers will rerun it.

---

# 44. FINAL PERFORMANCE PASS

Before final sign-off, inspect:

* total transferred bytes;
* draw calls;
* triangles;
* frame pacing;
* FPS;
* memory growth over a long RUN;
* object counts;
* shader/material count;
* network requests;
* console;
* mobile viewport.

Look especially for leaks caused by endless/dynamic track recycling.

RUN should not continually accumulate abandoned objects.

Dispose/reuse Three.js resources correctly.

---

# 45. FINAL GAMEPLAY PASS

Play the game like a judge.

Do not debug while playing.

Ask:

* Do I understand it immediately?
* Does the car feel good?
* Does road construction impress me?
* Do I intentionally choose REDLINE?
* Does RUN make me want another attempt?
* Are four environments meaningfully different?
* Does Championship feel competitive?
* Are AI opponents believable enough?
* Does the final Orbital race feel climactic?
* Is restarting painless?
* Is anything obviously unfinished?

Fix the largest remaining issue rather than adding another feature.

---

# 46. FINAL VISUAL PASS

Capture gameplay in motion from:

* first 15 seconds;
* Neon District;
* Canyon jump;
* Skyline;
* Orbital;
* REDLINE split;
* four-car race;
* championship climax.

Judge those frames without relying on explanations.

The game must visually communicate:

speed,
road construction,
racing,
risk,
cohesion,
finish.

If parked screenshots look great but driving screenshots look weak, the game is not finished.

---

# 47. DEFINITION OF DONE

ROAD//ZERO is done only when:

* the game is genuinely playable;
* RUN works end-to-end;
* all four environment phases work;
* road construction is visually obvious and mechanically stable;
* SAFE/REDLINE choices matter;
* steering feels good;
* drift feels good;
* mobile controls work;
* restart works;
* production has no console errors or 404s;
* performance is safely within current jam limits;
* official jam gate passes;
* documentation reflects reality;
* asset provenance is complete;
* repo history demonstrates actual development;
* moving gameplay looks intentionally finished.

If Championship ships, additionally require:

* all three AI racers reliably complete races;
* all four championship races work;
* route branching works for AI;
* race position is accurate enough;
* points/standings work;
* final championship result works.

Do not label unfinished functionality as complete.

---

# 48. DEVELOPMENT BEHAVIOR

Work autonomously.

Do not stop after every small change to ask for permission.

Do not repeatedly ask questions whose answers can be derived from:

* this file;
* official 404 documentation;
* repository state;
* standard engineering judgment.

When uncertain:

1. inspect the relevant source/rules;
2. choose the safest compliant implementation;
3. document important assumptions;
4. proceed.

Ask the human only when:

* a required credential/token is unavailable;
* a decision cannot safely be reversed;
* external paid action is required;
* deployment/account authorization is required;
* the official rules are genuinely ambiguous in a way that could risk disqualification.

Do not hide failures.

If something is blocked, report:

* exact blocker;
* evidence;
* attempted fixes;
* safest next action.

---

# 49. QUALITY BAR

Do not confuse:

"implemented"

with

"finished."

A feature is finished when:

* it works;
* it feels good;
* it looks intentional;
* it works on target inputs;
* it survives testing;
* it does not violate performance budgets;
* it integrates with the rest of the game.

Prefer one exceptional mechanic over five mediocre mechanics.

ROAD//ZERO's exceptional mechanic is:

> racing on a world that is physically being constructed immediately ahead of you.

Protect that mechanic above everything except jam validity.

---

# 50. START NOW

Begin by:

1. inspecting the repository;
2. locating/reading the current official 404 documentation;
3. verifying the project is separate from the recipe repository;
4. running the recipe self-test where applicable;
5. creating `docs/BUILD_PLAN.md`;
6. creating `STYLE_LOCK.md`;
7. creating the asset/provenance/iteration documentation skeleton;
8. establishing the minimum game architecture;
9. building a deliberately simple baseline/floor version;
10. capturing the baseline;
11. implementing the minimum playable car controller;
12. validating desktop AND touch input;
13. building the first compliant road/car assets through the 404 process;
14. creating the modular track engine;
15. implementing visible road assembly;
16. producing the first playable Neon District RUN slice.

The first major milestone is:

> On both desktop and a phone-sized touch viewport, the player can tap to start, drive a visually compliant 404-generated car down a compliant modular track, steer reliably, see road modules physically assemble ahead, encounter a SAFE/REDLINE split, choose a route, crash/fall, and restart without refreshing the page.

Do not proceed deeply into Championship until that milestone is genuinely fun and stable.

After reaching it, continue through this document until the game is submission-ready.
