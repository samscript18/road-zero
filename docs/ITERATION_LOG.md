# Iteration log

This is an evidence log, not a reconstructed narrative. Entries are added when work is tested or a decision changes.

## 2026-09-22 — Phase 0 intake

- Starting workspace contained only `AGENTS.md` and had no Git repository.
- Read the complete local brief and current official recipe/rules at the recorded commits in `BUILD_PLAN.md`.
- Confirmed the game folder is separate from the recipe clone at `/private/tmp/404-game-recipe`.
- Recipe `npm install` did not leave its pinned Chrome available. `npx puppeteer browsers install chrome` downloaded a corrupt archive, so the required self-test was rerun with the installed `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome` via `PUPPETEER_EXECUTABLE_PATH`.
- Official self-test then passed every deliberately broken, clean out-of-tree, mounting-face, instancing, and expected-size check. The verifier is trusted for this environment with that executable override.
- Chose a deterministic fixed-step, pooled modular-track architecture to protect fairness and long-RUN memory behavior.
