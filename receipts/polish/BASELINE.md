# Polish baseline

Captured 2026-09-25 before the environment/material polish. The repository was already on commit `cef3ac8d` with an existing dirty visual-work pass; those pre-existing changes were preserved rather than reset or claimed as this pass.

## Verification

- `npm run typecheck`: PASS
- `npm test -- --run`: PASS, 5/5
- `npm run build`: PASS
- Production payload: 555,768 bytes on disk; Vite output 550.70 KB JS / 144.86 KB gzip, 4.59 KB CSS / 1.65 KB gzip.
- Existing real-input racing gate: PASS.
- Console errors: 0.
- Asset 404s: 0.

## Measured rendering baseline

The standard gate observed approximately 60 FPS, 189 draw calls and 55,344 triangles in its sampled racing views. A separate three-track capture exposed a denser Summit/Quarry view at **806 draw calls**, 46,346 triangles and 59.99 minimum sampled FPS. This wider measurement supersedes the older receipt's 117 / 42,004 headline for this polish branch.

Known prior reference point:

- transfer approximately 0.6 MB,
- peak draw calls approximately 117,
- peak triangles approximately 42,004,
- median FPS approximately 60,
- console errors 0,
- asset 404s 0.

The geometry budget has enormous headroom. Draw-call headroom is not equally large in the densest view, so this pass should batch repeated festival/crowd props before increasing density.

## Baseline frames

- `baseline/orchard.png`
- `baseline/quarry.png`
- `baseline/summit.png`
- `baseline/tracks-telemetry.json`

The capture menu remains visible because the QA start hook does not alter menu state; the unobscured right half is still a comparable record of each track's current environment, lighting and road treatment.
