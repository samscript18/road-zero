# ROAD//ZERO

> The road doesn't exist until you race it.

ROAD//ZERO is an analog hillside arcade racer with a three-race championship, three distinct AI rivals, and a new Race Together lobby. Multiplayer Phase 1 currently ends at a synchronized loading grid; online driving is not implemented yet.

## Play

- W/Up: accelerate; S/Down: brake or reverse
- A/Left and D/Right: steer
- Space: handbrake slip
- Escape: pause
- Touch: move the left analog control up to accelerate, down to brake or reverse, and sideways to steer. Or tap USE ARROWS beneath it for a four-way pad: ▲ accelerates, ▼ brakes or reverses, and ◀/▶ steer. The GO, BRAKE, and SLIP pedals remain available on the right.
- On supported mobile and tablet browsers, landscape play enters full screen from a player tap. Use the FULL SCREEN button if the browser asks for another tap.

Championship visits Orchard Sprint, Quarry Loop, and Summit Run. Quick Race starts a single-player race immediately. Race Together creates a private 2–4 driver lobby with a six-character room code and invite URL.

## Technical architecture

- Vite + TypeScript + Three.js, one WebGL canvas and DOM HUD.
- Arcade handling and three AI personalities live in `src/race.ts`; real-time telemetry is exposed through `window.__GAME__`.
- Phase 1 room state is authoritative on the Node WebSocket server. It does not alter the single-player race loop.
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

Tools/models: Codex with GPT-5 for code and review; OpenAI built-in image generation for process-only isolated references. The official 404 recipe/harness commits are recorded in [the build plan](docs/BUILD_PLAN.md).

## Local development

Requirements: Node 20+ and npm.

```bash
npm install
npm run dev
```

`npm run dev` starts both Vite and the local Race Together room server. Open two or more browsers at the Vite URL to try the lobby. To serve a built game and room server together for local network testing:

```bash
npm run build
npm run multiplayer:serve
```

The lobby server listens on `MULTIPLAYER_PORT` (or `PORT`, default `8787`). Optional custom portraits use server-only `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET`. Copy `.env.example` to `.env` and fill those in; `npm run dev` and `npm run multiplayer:serve` load `.env` automatically. Already-set shell variables win over the file. Without them, all eight bundled original portraits work; do not put the secret in a `VITE_` variable. See [Phase 1 architecture](docs/multiplayer/ARCHITECTURE.md).

Production:

```bash
npm run build
npm run preview
```

Static `dist/` preview supports single-player. Race Together needs the Node server and `/multiplayer` WebSocket endpoint. No deployment is part of Phase 1.

## Testing and gates

```bash
npm run typecheck
npm test
npm run test:multiplayer
npm run build
npm run gate:multiplayer
npm run gate
```

The multiplayer gate uses separate browser contexts and real menu actions to cover room joining, ready sync, loading, host migration, and reconnection. The single-player gate uses real keyboard and touch events. See [Phase 1 validation](receipts/multiplayer/PHASE_1_VALIDATION.md).

No deployed/live verdict is claimed for this local Phase 1 work.

## Documentation

- [Build plan](docs/BUILD_PLAN.md)
- [Asset provenance](docs/ASSET_PROVENANCE.md)
- [Iteration log](docs/ITERATION_LOG.md)
- [Visual targets](docs/VISUAL_TARGETS.md)
- [QA](docs/QA.md)
- [Performance](docs/PERFORMANCE.md)

## Phase 1 status

The multiplayer work stops at the shared loading screen by design. Human car networking and voice are later phases. No deployment or live URL validation was performed for this phase.
