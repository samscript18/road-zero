# ROAD//ZERO

> The road doesn't exist until you race it.

ROAD//ZERO is an analog hillside arcade racer with a three-race championship, three distinct AI rivals, and private 2–4 player Race Together races. The live game is at https://road-zero.onrender.com/.

## Play

- W/Up: accelerate; S/Down: brake or reverse
- A/Left and D/Right: steer
- Space: handbrake slip
- Escape: pause
- Touch: move the left analog control up to accelerate, down to brake or reverse, and sideways to steer. Or tap USE ARROWS beneath it for a four-way pad: ▲ accelerates, ▼ brakes or reverses, and ◀/▶ steer. The GO, BRAKE, and SLIP pedals remain available on the right.
- On supported mobile and tablet browsers, landscape play enters full screen from a player tap. Use the FULL SCREEN button if the browser asks for another tap.

Championship visits Orchard Sprint, Quarry Loop, and Summit Run. Quick Race starts a single-player race immediately. Race Together creates a private 2–4 driver room with a six-character code or invite URL, a ready check, synchronized countdown, human-controlled cars, server-validated laps, and shared results. Voice chat is not implemented.

## Technical architecture

- Vite + TypeScript + Three.js, one WebGL canvas and DOM HUD.
- Arcade handling and three AI personalities live in `src/race.ts`; real-time telemetry is exposed through `window.__GAME__`.
- Race Together uses the Node WebSocket server at `/multiplayer` for room state, synchronized starts, ordered checkpoint/lap validation, and final results. Clients simulate their own cars and interpolate remote cars. The multiplayer mode is isolated from Championship and Quick Race.
- Official recipe `bakeStatic` merges generated object parts by material to keep draw calls low.
- Web Audio synthesizes engine response after a real user interaction; no audio file or copyrighted music ships.

## 404 recipe compliance

Every shipped 3D object is code built from Three.js constructors. No GLB/GLTF, downloaded mesh, literal vertex dump, or embedded mesh data is used.

The game's hero asset families followed:

1. generated isolated reference image;
2. three independent JavaScript geometry candidates;
3. official five-view verifier at 560 px;
4. visual selection by inspecting the sheet;
5. documented selection and rejection reasons.

See [STYLE_LOCK.md](STYLE_LOCK.md), [asset provenance](docs/ASSET_PROVENANCE.md), and the candidate folders under `src/assets/candidates/`. Reference images are process evidence only and are not shipped in the production build.

Tools/models: Codex with GPT-5 for code and review; OpenAI built-in image generation for process references and the shipped 2D website logo/social preview. Their provenance is in [the brand asset record](docs/BRAND_ASSET_PROVENANCE.md). The official 404 recipe/harness commits are recorded in [the build plan](docs/BUILD_PLAN.md).

## Local development

Requirements: Node 20+ and npm.

```bash
npm install
npm run dev
```

`npm run dev` starts both Vite and the local Race Together room server. Open two or more browsers at the Vite URL to try a race. To serve a built game and room server together for local network testing:

```bash
npm run build
npm run multiplayer:serve
```

The lobby server listens on `MULTIPLAYER_PORT` (or `PORT`, default `8787`). Eight original default portraits work without external credentials. Optional custom portrait upload uses server-only Cloudinary variables listed in `.env.example`; never place the API secret in a `VITE_` variable or commit `.env`. See [multiplayer architecture](docs/multiplayer/ARCHITECTURE.md) and [Phase 2 design](docs/multiplayer/PHASE_2_DESIGN.md).

Production build and combined server:

```bash
npm run build
npm run multiplayer:serve
```

`npm run preview` serves only the static single-player build. The production Dockerfile builds the frontend, then runs the same Node process for static files and the Race Together WebSocket endpoint. Render hosts the public combined build at the URL above.

## Testing and gates

```bash
npm run typecheck
npm test
npm run test:multiplayer
npm run build
npm run gate:multiplayer
npm run gate:race-together
npm run gate
```

The multiplayer gates use separate browser contexts and real menu actions to cover 2–4 players, ready/loading synchronization, real local and remote movement, results, host migration, and reconnection. The single-player gate uses real keyboard and touch events. See [Phase 1 validation](receipts/multiplayer/PHASE_1_VALIDATION.md), [Phase 2 validation](receipts/multiplayer/PHASE_2_VALIDATION.md), and [submission-safety notes](receipts/multiplayer/PHASE_2_SUBMISSION_SAFETY.md).

The deployed build passed the official 404 phone jam gate with real touch on 25 Sep 2026. The exact verdict belongs to the deployed commit named in the submission pull request; a new commit requires a new deployed-URL check before claiming the same result.

## Documentation

- [Build plan](docs/BUILD_PLAN.md)
- [Asset provenance](docs/ASSET_PROVENANCE.md)
- [Iteration log](docs/ITERATION_LOG.md)
- [Visual targets](docs/VISUAL_TARGETS.md)
- [QA](docs/QA.md)
- [Performance](docs/PERFORMANCE.md)

## Scope

Race Together includes live human racing but no voice chat. Custom avatar upload is optional; the default avatars are sufficient to play. The game is feature-frozen for the 404 Game Jam submission.
