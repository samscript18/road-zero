# Asset provenance

No production asset may be integrated without a completed row and its candidate decision record. All 3D assets are JavaScript modules returning a Three.js `Group`; no external mesh files, vertex dumps, or embedded mesh data are permitted.

## Workflow ledger

| asset | purpose | reference source/type | generation process | candidates | chosen | tool/model | external files / licence |
|---|---|---|---|---|---|---|---|
| Hero coupe | Player vehicle and rival basis | `docs/evidence/references/hero-coupe.png`, generated isolated three-quarter reference | Three independent code readings: primitive assembly, extruded side profiles, vertex-shaped wedge assembly; official five-view verify at 560 px; visual selection | `hero_a.js`, `hero_b.js`, `hero_c.js` | `src/assets/hero_coupe.js` from C | Reference: OpenAI built-in image generation; geometry: Codex / GPT-5 | Reference is process-only; no external file ships |
| Standard track module | Reusable straight and transformed branch road | `docs/evidence/references/road-module.png`, generated isolated aerial three-quarter reference | Three independent code readings: primitive plate/joint assembly, extruded cross-section, transverse plate assembly; official five-view verify at 560 px; visual selection | `track_a.js`, `track_b.js`, `track_c.js` | `src/assets/track_module.js` from A | Reference: OpenAI built-in image generation; geometry: Codex / GPT-5 | Reference is process-only; no external file ships |

## Decision record template

### Asset name

- Purpose:
- Locked dimensions:
- Reference file and source/model/prompt:
- Candidate A construction strategy:
- Candidate B construction strategy:
- Candidate C construction strategy:
- Official verifier command/result:
- Sheet inspected at:
- Chosen candidate and visual reason:
- Rejected candidates and reason:
- Integration file:
- External texture/audio/image shipped:
- Licence/provenance:

## Non-mesh media

- Planned audio is synthesized at runtime with Web Audio and contains no third-party recording.
- Generated critic/reference images are process evidence only and are not shipped as game textures or sprites.

## Hero coupe decision

- Locked size: 1.92 × 4.35 × 1.18 m envelope.
- Verifier: all three clean; A 2,180 triangles, B 2,472, C 1,072.
- Choice: C. Its wedge construction, separated ceramic shoulders, continuous side channels and readable front/rear silhouette most closely preserve the reference at chase-camera scale. A is more toy-like and B loses the reference's front architecture.

## Standard track module decision

- Locked size: 12 × 48 m, about 1.7 m overall structural height.
- Initial verifier failure: A/C connection faces flagged; B extrusion was rotated into a 48.79 m height. Front/back are legitimate flush module connections and were explicitly declared; B orientation was corrected. All three then verified clean.
- Verified costs: A 3,568 triangles, B 240, C 2,764.
- Choice: A. It preserves four visible longitudinal plates, circular end locks, underside ribs and barrier channels. B is too visually sparse; C reads well from above but loses the reference's connection hardware.
