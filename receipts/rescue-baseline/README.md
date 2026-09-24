# Rescue baseline receipt

- Commit tested: `3a7f232a723037fad7e499c870051dc248a71db4`.
- `npm run typecheck`: pass.
- `npm run build`: pass.
- Official `ship.mjs dist`: pass, check-only.
- Fresh custom gate: failed at the 30-second distance wait on `scripts/road-zero-gate.mjs:26`; this is recorded as a flaky/insufficient gate, not a passing run.
- The unchanged prior successful motion set remains under `docs/evidence/final-local/` and is the visual before-control.
- Deployment: none.
