# Performance receipts

## Budgets

| metric | official ceiling | internal target | current |
|---|---:|---:|---:|
| transferred bytes | < 10 MB | < 7.5 MB | not measured |
| draw calls | < 900 | < 600 peak | not measured |
| triangles | < 1,500,000 | < 900,000 peak | not measured |
| ready time | official gate limit | margin below gate | not measured |
| long-RUN active modules | n/a | bounded pool | not measured |
| long-RUN memory | n/a | no sustained growth after warmup | not measured |

## Measurement rules

- FPS uses real elapsed time, never clamped simulation delta.
- Headless SwiftShader FPS is labelled smoke-test data, not a device verdict.
- Record medians/spread over repeat runs; do not infer improvement below route noise.
- Any optimization that lowers visual quality is named explicitly.

## Receipts

No production measurements yet.
