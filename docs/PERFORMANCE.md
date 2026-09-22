# Performance receipts

## Budgets

| metric | official ceiling | internal target | current |
|---|---:|---:|---:|
| transferred bytes | < 10 MB | < 7.5 MB | 508,169-byte uncompressed production folder; JS gzip 129.44 KB |
| draw calls | < 900 | < 600 peak | 202 sampled peak in final local custom gate |
| triangles | < 1,500,000 | < 900,000 peak | 93,168 sampled peak in custom system gate |
| ready time | official gate limit | margin below gate | not measured |
| long-RUN active modules | n/a | bounded pool | not measured |
| long-RUN memory | n/a | no sustained growth after warmup | not measured |

## Measurement rules

- FPS uses real elapsed time, never clamped simulation delta.
- Headless SwiftShader FPS is labelled smoke-test data, not a device verdict.
- Record medians/spread over repeat runs; do not infer improvement below route noise.
- Any optimization that lowers visual quality is named explicitly.

## Receipts

## 2026-09-22 production-local receipt

- `npm run build`: pass. Vite output 0.48 KB HTML, 4.13 KB CSS, 503.56 KB JS before transfer compression; 131.26 KB combined gzip estimate.
- `harness/ship.mjs dist`: initial failure correctly caught root-absolute Vite assets. Added `base: './'`, rebuilt, then passed: every module parses and every path remains inside the folder.
- Custom gate (`docs/evidence/system-pass/gate-report.json`): peak sample 149 draws / 93,168 triangles; no 404s or console errors.
- The gate explicitly uses SwiftShader because real-GPU headless Chrome is unstable on this host. Its 12–23 FPS readings are smoke data only, not device performance verdicts. Draw/triangle cost is portable.
- Recipe `bakeStatic` merges generated assets by material. This reduced the repeated track/pylon scene to a small fraction of its source mesh draw count without reducing geometry detail.
- `npm audit --omit=dev` could not reach the registry from the sandbox (`ENOTFOUND`); this is an uncompleted network audit, not a clean verdict.

## 2026-09-22 final local receipt

- Typecheck, production build and the recipe `ship.mjs` path/module validation passed.
- Custom gate (`docs/evidence/final-local/gate-report.json`) passed real click, keyboard steering/drift, touch start/drag/drift, RUN completion/restart, Championship start/AI/position/next race, construction capture, budgets, and error checks.
- Peak sampled cost was 202 draw calls and 89,600 triangles. There were no recorded console errors or network 404s. SwiftShader FPS remains non-authoritative smoke data.
