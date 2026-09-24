# Critic round 3 — racing in motion

## Verdict

**FAIL**

## Material reviewed

- `STYLE_LOCK.md`
- `docs/VISUAL_CLAIMS.md`
- all six target frames in `references/scenes/`
- `receipts/playtests/current/desktop-racing.png`
- `receipts/playtests/current/mobile-racing.png`
- `receipts/playtests/current/gate-report.json`

This was a blind motion-frame review. No other critic output was consulted.

## Single largest reason the build still loses to the target

The visible racing corridor has almost no authored spatial depth: a ribbon road crosses a largely flat, empty brown plane beneath a flat blue sky, with isolated primitive trees and rocks standing in for an environment. The target frames derive their identity and sense of speed from a continuous foreground shoulder, corner-responsive furniture and spectators in the midground, and layered mountain/village silhouettes in atmospheric background depth. In the current desktop frame those layers are absent, so the image reads immediately as an early Three.js prototype even though the red coupe and timing-card HUD have moved toward the style lock. The mobile frame makes the same problem harsher: once the car leaves the road, almost the entire view becomes undifferentiated brown ground.

This is the decisive failure behind Visual Claims 5 (depth), 8 (authored asymmetry), 10 (motion quality), and 14 (made-thing test). It also weakens speed, corner readability, and the car's hero status. Telemetry confirms that the build is healthy enough to render considerably more than the captured scene (`40–150` draws and `22,232–47,624` triangles in sampled motion states, versus the internal targets of `<700` draws and `<1.2M` triangles), so this is an art-direction/composition omission rather than a performance-imposed compromise.

## Highest-impact fix

Rebuild the *visible roadside corridor for Orchard Sprint* as a composed three-depth-band scene before adding any more UI polish: keep continuous dirt/grass shoulders and timber/bale parallax within roughly 0–12 m of the road; place one asymmetric authored spectator/canopy/orchard landmark cluster on each principal bend in the 12–45 m midground; and enclose the horizon with overlapping sage/blue mountain masses plus a small warm village silhouette under golden directional light and cooler haze. Place these elements from track/corner data so they frame the racing line rather than reading as random scatter. Validate the result from the same desktop and mobile moving viewpoints, including an off-road moment.

## Motion-specific notes supporting the verdict

- The desktop road direction is readable, but the mostly featureless surroundings provide weak parallax and little sensation of speed.
- The player coupe is readable but occupies materially less than the locked 30–38% landscape frame height, which further exposes the empty world around it.
- Rival colours can be distinguished at distance, but their silhouettes are too small in this capture to demonstrate personality or close-racing drama.
- The warm cream/charcoal HUD language is on target and does not cause this failure.
- The mobile controls are legible and the gate records real touch movement/steering, but the captured car is off the asphalt with the apex largely hidden by the composition; phone survival is therefore not visually demonstrated by this frame.
- No cyan/purple glow or overt sci-fi residue is visible in the reviewed motion frames.

