# ROAD//ZERO — style lock

## One sentence

> A warm analog hill-climb motorsport festival rendered as a premium stylized miniature world: rounded compact racing coupes, painted fiberglass and enamel bodywork, sun-faded plaster and timber architecture, dry grass, rock, cloth track furniture, dusty roadside detail, strong silhouettes and golden natural light, with believable proportions and absolutely no sci-fi, cyberpunk, robotic or neon visual language.

This exact document governs every reference, generated asset, environment placement, material, light, UI element and critic round in the rescue build.

## Non-negotiable exclusions

- No cyan/purple neon language, holograms, robots, orbital scenery, glowing vehicle outlines, metallic laboratory architecture, sci-fi hexagons or random mechanical greebles.
- No real marques, logos, liveries, named circuits or recognisable production-car copies.
- No text-dependent trackside advertising. Identity comes from colour blocks, cloth, silhouette and placement.
- No downloaded meshes, GLB/GLTF, literal vertex dumps or binary 3D assets. Every 3D object follows the 404 recipe.

## Palette

| role | hex | use |
|---|---|---|
| warm cream | `#EFE1C6` | plaster, canvas, UI paper, sunlit highlights |
| sun-faded orange | `#C86845` | festival furniture, flags, secondary car detail |
| ochre | `#D5A23B` | hay, Charger body, timing accents |
| forest green | `#53694C` | Defender body, deep foliage |
| dusty sage | `#849077` | scrub, faded paint, ambient landscape |
| faded blue | `#507D92` | Technician body, cool shade, distant terrain |
| asphalt charcoal | `#343537` | road, tyres, primary dark UI |
| warm stone | `#A88869` | rock, retaining walls, dust |
| earth brown | `#79533F` | soil, timber shadow, wheel dirt |
| deep shadow | `#353A3B` | controlled occlusion, never featureless black |
| player red | `#D74B3F` | player body and one HUD accent only |

Sunlit surfaces lean cream/orange; shade leans faded blue/sage. Saturation is concentrated on the four cars, flags and selected timing furniture.

## Real-world scale in metres

| object | locked size |
|---|---|
| player coupe | 1.72 W × 1.34 H × 3.92 L |
| Charger coupe | 1.78 W × 1.31 H × 4.06 L |
| Technician coupe | 1.69 W × 1.28 H × 3.86 L |
| Defender coupe | 1.76 W × 1.39 H × 3.98 L |
| tyre diameter / width | 0.58–0.63 / 0.20–0.25 |
| usable road | 8.0 W typical; 7.0 minimum |
| safety barrier | 0.90 H; 2.4–3.2 module length |
| hay bale | 0.90 L × 0.46 H × 0.52 D |
| marshal hut | 2.5 H × 2.4 W × 1.8 D |
| spectator canopy | 2.7 H × 4.8 W × 3.2 D |
| roadside tree | 5.5–8.5 H |
| paddock bay | 3.1 H × 5.5 W × 4.0 D |
| village module | 5–8 H, 4–7 W |
| landmark timing tower | 7.5 H × 4.2 W |

All assets sit at `y=0`, are centred on X/Z, face `+Z`, and have matching `.expect.json` dimensions.

## Vehicle language

- One racing category, four genuinely different silhouettes: rounded arches, coherent body volume, visible rubber, separate cabin glass, believable overhangs and stance.
- Player: light fastback, red enamel, cream number roundel without glyphs, twin warm tail lamps.
- Charger: ochre, broader shoulders, shorter high tail, aggressive planted stance.
- Technician: faded blue, low teardrop cabin, clean narrow tail and precise proportions.
- Defender: forest green, upright greenhouse, wider rear mass and stable stance.
- Paint uses controlled gloss; tyres and interiors are high roughness; chrome is limited to small lamp bezels or exhaust tips.
- Wheels remain articulated through `keepHierarchy`; front wheel pivots steer, all tyres rotate, and body response is separate from chassis motion.

## Environment language

- One warm mountain region across three events: orchard foothills, worked quarry, high summit.
- Foreground: road wear, dirt shoulders, grass tufts, bales and timber barriers.
- Midground: asymmetric prop clusters, canopies, marshal huts, parked paddock shapes, rocks and trees placed in response to corners.
- Background: layered low-poly mountains and haze; never empty sky plus flat ground.
- Repeated families receive 3–5 real variants plus restrained scale/rotation variation; no perfect grids.
- Signature forms: scalloped tree crowns, battered cream/orange cloth, warm layered rock, whitewashed walls with timber shade structures.

## Materials

- Asphalt: charcoal, roughness 0.82–0.94, subtle procedural aggregate and wear variation, no mirror response.
- Dirt/stone: warm and matte, roughness 0.88–1.0.
- Timber: sun-faded brown, roughness 0.78–0.92.
- Plaster/canvas: cream with warm/cool value variation, roughness 0.72–0.9.
- Foliage: sage/forest family, roughness 0.9, opaque geometry preferred near camera.
- Car enamel/fiberglass: roughness 0.24–0.38, metalness 0, restrained clearcoat; avoid saturated-sky magenta in shade.
- Glass: dark cool grey-blue, restrained opacity/reflection; use single-pass where transparency is required.
- Emissive is limited to subtle brake lamps and cannot light broad surfaces.

## Lighting and atmosphere

- Golden late afternoon: warm direct sun from rear-side, cooler sky fill, readable 50–65% shade, contact shadows and aerial depth.
- Use the official rig principles at approximately 16:30–17:00 with a desaturated upper sky and warm horizon.
- Cars must remain readable in shade. Asphalt stays a mid-dark neutral rather than black.
- No global cyan rim, purple fog, broad bloom or flat ambient wash.

## Camera and composition

- Chase camera target: hero occupies 30–38% of landscape frame height and remains centred away from touch controls.
- Stable horizon; no road-normal roll. Spring lag preserves direction through slip and recovers smoothly.
- Standard landscape FOV 52–62 degrees, widening subtly with speed; portrait receives a separate composition.
- Every racing frame contains foreground, midground and background, plus at least one asymmetric landmark or spectator cluster.

## Track and race language

- Painted cream edge line, dusty shoulder and physical timber/bale/stone boundary; direction should read without HUD text.
- Orchard Sprint: flowing bends, timber, trees, cloth flags and spectator pockets.
- Quarry Loop: rock cuts, dust, tight braking, orange barriers and marshal posts.
- Summit Run: exposed vista, stone retaining walls, larger festival finish and cooler distant terrain.
- Starting grids and finish lines use painted ground bands, flags, rope, timber timing furniture and crowds—not futuristic gates.

## UI language

- Vintage timing-card graphic design: warm cream paper plates, charcoal ink, red/orange position accents, tabular bold numerals and restrained shadows.
- Championship is primary; Quick Race secondary; no slashes-as-cyberpunk motif, glass panels, neon brackets or holographic typography.
- Race HUD: position, lap/checkpoint progress, speed and race identity only. Large phone-safe targets and safe-area padding.

## Performance and geometry bands

- Hero/rival cars: 2,000–18,000 triangles each; articulated nodes baked per joint where useful.
- Landmark/building: 500–12,000 each.
- Trees/rocks/canopies: 250–5,000 each; instance repeated static props safely.
- Small furniture: 150–2,500 each.
- Internal scene target: <700 draw calls and <1.2M triangles at peak; official ceilings remain 900 / 1.5M.
