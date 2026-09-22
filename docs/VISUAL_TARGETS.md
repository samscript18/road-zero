# Visual targets and failable claims

Target images are critic-only evidence, never shipped game assets. Captures must be taken while moving at the same aspect ratio as their comparison set. Each quantitative claim must be measured over at least two unchanged gate runs before being trusted.

## Scene briefs

| frame | target composition |
|---|---|
| Neon District | Chase camera low behind readable hero; broad graphite road through monumental dark bays; a cyan module visibly flying into place ahead; parallax structures frame rather than clutter. |
| Redline Canyon | Cool road bridging huge warm engineered rock masses; exposed depth; amber joints; a major landing zone clearly readable beyond a jump. |
| Skyline | Dark narrow road above a bright cloud deck; pale structural arches; very large depth cues; cyan edge guides preserve silhouette. |
| Orbital | Road curling past one enormous ring against near-black space; sparse violet/cyan energy; spectacle concentrated away from the driving line. |
| Race start | Four distinct car silhouettes on an authored staggered grid; short `3 2 1 DRIVE` focus; road and first assembly event visible. |
| REDLINE split | SAFE is a wide open arch and parallel path; REDLINE is a narrow pointed gateway with chevrons and risk geometry; decision visible at least 2.5 seconds before divergence. |
| Road assembly | Three or four plates remain visibly displaced while another locks with a pulse; final road position is unmistakable and reachable. |
| High-speed drift | Hero yaw and trail show controlled slip; exit direction and road edge remain readable; no full-frame blur. |
| Jump | Clear takeoff, visible landing target, deep environment separation, stable horizon. |
| Championship finish | Player and rivals remain legible near a monumental finish structure; position/result feels earned rather than an overlay on an empty road. |

## Claims

1. Hero readability: the player car occupies 28–38% of landscape frame height in standard chase view, and body/road luminance do not merge for more than one consecutive captured frame.
   - Gameable by: enlarging a featureless car or adding a halo. Critic must still reject poor surface/form readability.
2. Road readability: both outer road edges or barriers remain identifiable through the next decision zone in at least 80% of motion frames.
   - Gameable by: drawing intrusive HUD edge lines. Only world geometry counts.
3. Construction legibility: at least two displaced pieces and one clear final connection are visible in a construction sequence; a fresh viewer should identify assembly rather than spawning.
   - Gameable by: parking pieces beside a completed road. Their motion and lock sequence must read across frames.
4. Route comprehension: SAFE and REDLINE differ simultaneously by width, gateway silhouette/icon, and colour before steering input is required.
   - Gameable by: oversized labels. World-space form must carry the distinction with UI hidden.
5. Speed: three independent cues—FOV/parallax, passing road marks/structures, and audio/particles/camera response—scale with speed without centre-screen blur.
   - Eye check; a single numerical speed readout does not count.
6. World identity: two of palette, horizon/environment mass, and signature structure change at each world transition while road/vehicle language remains constant.
   - Eye check; swapping fog colour alone fails.
7. Phone survival: speed, route cue, road edge, and one mode objective remain understandable at 390×844 and 844×390 without controls covering the decision zone.
   - Gameable by: shrinking everything until technically present. Minimum touch and type sizes remain binding.
8. Value range: moving frames contain true dark structure, readable midtone road, and restrained bright navigation; emissive pixels do not wash broad surfaces.
   - Gameable by: isolated white specks. Bright areas must support structure or guidance.
9. Cohesion: every large prop visibly uses at least two locked signatures, and no world introduces an unrelated material or micro-detail language.
   - Eye check against `STYLE_LOCK.md`.
10. Stage-one finish: with UI/name context minimized, a motion frame clearly communicates a deliberately authored racing game and its assembling-road hook rather than a generic Three.js road demo.
   - Final blind-pair verdict, not reducible to one statistic.

## Evidence plan

- Preserve six baseline frames in `docs/evidence/baseline/`.
- Preserve reference/target images with source/model/prompt metadata in `docs/evidence/references/index.md`.
- Preserve each critic round's filmstrip, blind-pair key (not shown to critic), verdict, deciding property, and after frame under `docs/evidence/critics/round-N/`.
