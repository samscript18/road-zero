# ROAD//ZERO — the locked style

> Monumental near-future infrastructure formed from layered graphite, satin gunmetal and pale structural ceramic, cut by precise luminous guide channels and large readable mechanical joints; sleek, restrained and engineered rather than cluttered cyberpunk.

This sentence and every fixed decision below must be supplied unchanged for every generated reference and every 404 geometry candidate.

| role | hex | where it belongs |
|---|---:|---|
| void | `0x05070B` | deepest sky, gaps, tunnel recesses |
| graphite | `0x111820` | primary road and vehicle lower mass |
| gunmetal | `0x27313B` | mechanical frames, barriers, joints |
| ceramic | `0xDCE5E7` | sparse structural faces and readability accents |
| lane white | `0xB9C8CA` | road markings and SAFE direction |
| ion cyan | `0x24E5FF` | navigation, assembly pulse, Neon/Skyline accent |
| redline | `0xFF304C` | dangerous route, brake/impact, Canyon accent |
| amber | `0xFFB547` | warnings, countdown, Canyon secondary accent |
| electric violet | `0x8D63FF` | Orbital secondary energy accent |
| sky blue | `0x74B9E8` | atmospheric depth and Skyline distance |

## Fixed dimensions

- Metres. Base at `y = 0`, centred on `x` and `z`, front faces `+Z` for standalone asset modules.
- Standard track module: 12 m wide × 48 m long; wide module 16 m; narrow/REDLINE module 7 m.
- Lane: 4.2 m; centre gap/marking zone: 0.35 m; road slab: 0.55 m thick.
- Barrier: 0.75 m high, 0.32 m thick, with a 0.09 m luminous guide inset.
- Hero vehicle: 1.92 m wide × 4.35 m long × 1.18 m high; wheelbase 2.72 m; wheel diameter 0.68 m.
- Rival vehicles share the hero envelope within ±4%, using silhouette and accent—not scale—for identity.
- Assembly plate: 3.8–5.8 m wide × 12 m long × 0.48 m thick; four plates form a standard module.
- Split signage: lower edge 3.6 m above road; icon field at least 1.3 m square; no small printed glyphs.
- City structural bays: 12 m multiples; primary towers 45–120 m; Canyon pylons 18–35 m; Skyline structures 30–90 m; Orbital rings 60–180 m visible diameter.

## Shape language

- Primary silhouettes use long wedges, chamfered slabs, split buttresses, exposed circular locks, and repeated three-part ribs.
- Every object over 0.6 m carries at least two signatures: a recessed luminous channel, a pale structural face, or a visible circular/hexagonal connection joint.
- Large forms first; small detail exists only where it survives chase-camera distance.
- No random pipes, illegible micro-panels, ornamental clutter, spikes, skulls, graffiti, logos, or trademarked forms.
- No literal printed text on 3D objects. SAFE uses an open arch/parallel-line icon; REDLINE uses a pointed split/chevron icon, reinforced by road width and barrier shape.

## Materials

- Use `MeshStandardMaterial` with explicit colours. Primary road: roughness 0.72, metalness 0.12. Structural ceramic: roughness 0.46, metalness 0.05. Gunmetal: roughness 0.38, metalness 0.72.
- Vehicle paint may use `MeshPhysicalMaterial` in game integration; geometry candidates remain contract-safe standard materials. Paint is glossy but not mirror-like.
- Emissive channels are narrow and controlled. Bloom may enlarge them no more than roughly 2× their source width in motion.
- Contract surface names are exactly: `plaster`, `stone`, `timber`, `tile`, `metal`, `fabric`, `foliage`, `ground`. ROAD//ZERO primarily uses `metal`, `stone`, `tile`, and `ground`.
- Flat colours in asset modules; recipe surfaces are applied at load time. No downloaded texture or mesh data.

## Lighting and camera principles

- Road exposure is protected first: the playable surface remains separated from the surrounding value by at least one strong edge/light cue.
- Hero vehicle occupies about 28–38% of landscape frame height during ordinary driving and never becomes a black silhouette against the road.
- One cool key/fill family plus one restrained warm or red counter-accent per world; black remains black and highlights do not clip broad surfaces.
- Atmospheric depth is built with fog and silhouette layers, not dense particle blankets.
- Camera horizon stays stable; bank response derives from track metadata, not wheel contact normals.

## Environment accent treatment

- Neon District: near-black city canyons, cyan navigation and sparse violet windows; wet-looking highlights without a generic rain/noise layer.
- Redline Canyon: oxidized red stone/ceramic masses, amber work lights, red REDLINE hardware; the road remains cool graphite.
- Skyline: pale cloud sea and blue atmosphere, dark road silhouette, cyan-white navigation; barriers gain stronger dark undersides for contrast.
- Orbital: black-violet void, pale station ceramics, cyan primary energy and violet secondary arcs; stars remain subordinate to the road.

## UI principles

- Condensed uppercase display typography for headings; neutral system sans for numbers/body to avoid font payload and licensing risk.
- Oblique cuts, thin rule lines, generous empty space, compact labels. No glass-card dashboard clutter.
- HUD anchors to safe-area edges and leaves the central 55% of the screen unobstructed.
- Touch targets are at least 52 CSS px. Route choice is communicated through geometry/icon/width plus colour.
- Motion is quick and mechanical: 120–220 ms UI transitions; no long unskippable presentation.
