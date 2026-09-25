# ROAD//ZERO

> The road doesn't exist until you race it.

ROAD//ZERO is a high-speed Three.js arcade racer built for 404 Game Jam 001. Track plates physically fly into position ahead of the player, while SAFE and narrow REDLINE branches trade security for score and race advantage.

## Play

- W/Up: accelerate; S/Down: brake or reverse
- A/Left and D/Right: steer
- Space: handbrake slip
- Escape: pause
- Touch: drag the left analog control, or tap USE ARROWS beneath it for a four-way pad. On the pad, ▲ accelerates, ▼ brakes, and ◀/▶ steer. The GO, BRAKE, and SLIP pedals remain available on the right.

RUN is a finite escalating journey through Neon District, Redline Canyon, Skyline, and Orbital. Survive, drift, and choose REDLINE to multiply score. CHAMPIONSHIP races NOVA, VEX, and KAI through four races with a 10/7/5/3 points table.

## Technical architecture

- Vite + TypeScript + Three.js, one WebGL canvas and DOM HUD.
- Central arcade tuning in `src/main.ts`; real-time telemetry is exposed through the official `window.__GAME__` contract.
- Deterministic modular road descriptors and stable gameplay collision width are independent from the visual plate-assembly animation.
- Official recipe `bakeStatic` merges generated object parts by material to keep draw calls low.
- Web Audio synthesizes engine response after a real user interaction; no audio file or copyrighted music ships.

## 404 recipe compliance

Every shipped 3D object is code built from Three.js constructors. No GLB/GLTF, downloaded mesh, literal vertex dump, or embedded mesh data is used.

Production families—hero coupe, modular road, and monumental pylon—each followed:

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

Production:

```bash
npm run build
npm run preview
```

The static `dist/` folder uses relative paths and can be hosted at a domain root or repository subpath.

## Testing and gates

```bash
npm run typecheck
npm run build
node /path/to/404-game-recipe/harness/ship.mjs dist
PUPPETEER_EXECUTABLE_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  node scripts/road-zero-gate.mjs dist docs/evidence/latest-gate
```

The ROAD//ZERO gate uses real click, keyboard, multi-touch tap/drag events and asserts RUN completion/restart, construction, movement, Championship AI/position/next-race, costs, missing requests, and console errors. See [QA](docs/QA.md) and [performance receipts](docs/PERFORMANCE.md).

The final official live jam command must be run after deployment:

```bash
node harness/jam.mjs https://PLAY-URL/ --commit=<public-sha>
```

No passing live verdict is claimed before that happens.

## Documentation

- [Build plan](docs/BUILD_PLAN.md)
- [Asset provenance](docs/ASSET_PROVENANCE.md)
- [Iteration log](docs/ITERATION_LOG.md)
- [Visual targets](docs/VISUAL_TARGETS.md)
- [QA](docs/QA.md)
- [Performance](docs/PERFORMANCE.md)

## Deployment and submission

Deploy `dist/` as static content. After confirming the deployed URL points at the intended public commit, run `ship.mjs`, the ROAD//ZERO gate, the official live jam gate, and manual phone-sized touch verification. `submission/road-zero.json` is a truthful draft with external identity/URL fields deliberately left as placeholders.
