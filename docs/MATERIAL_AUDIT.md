# Material audit

| surface | current state / problem | intended response | polish change |
|---|---|---|---|
| player paint | Red enamel is readable but broad masses can look uniformly coloured. | Warm highlight rolloff, deep red shade, restrained clearcoat-like lobe. | Use physical paint with low metalness, moderate roughness, clearcoat and subtle secondary red panels; preserve shape readability. |
| rival paint | Strong colour separation, similar response across all rivals. | Same category, slightly different age/finish. | Charger warmer/glossier, Technician cleaner/cooler, Defender slightly rougher; no metallic sci-fi finish. |
| tyres | Dark and articulated, but can disappear into asphalt/shadow. | Dry rubber with soft diffuse edge and visible sidewall. | High roughness, near-zero specular/metalness, slightly lifted charcoal value. |
| glass | Dark cap risks mirror-black appearance. | Cool restrained reflection that still describes greenhouse. | Raise roughness/value, use opaque single-pass physical suggestion rather than costly transparency. |
| road | Broad charcoal surface still reads too uniform in some frames. | Mid-dark aggregate, patches, repaired seams and dusty intrusion. | Add low-frequency per-segment value variation plus sparse wear/patch geometry; avoid high-frequency shimmer. |
| dirt | Large single-value areas flatten the world. | Warm compacted soil with dusty shoulders and darker sheltered areas. | Track-specific earth values and shoulder bands, with particles off-road. |
| dry grass | Ground reads as one broad ochre/sage plane. | Layered straw/sage rhythm and nearby parallax. | Cluster instanced grass tufts near hero sections; maintain open breathing zones. |
| rock | Faceted geometry is suitable but colour/value repeats. | Warm cut faces near road, cooler/desaturated distant stone. | Two or three shared rock materials selected by distance/track; stronger contact shadow. |
| timber | Correct roughness, sometimes merges into earth. | Sun-faded warm rails with dark end grain/post contrast. | Separate rail/post values and place against lighter shoulder zones. |
| plaster | Cream is appropriate but flat. | Sun-warmed face with cooler recessed openings. | Shared cream material plus darker inset/shutter material; no transparency. |
| fabric | Canopies and flags are readable but rigid. | Matte sun-faded cloth with small silhouette variation. | Alternate cream/orange/faded-blue cloth, slight rotations and scalloped edges. |
| barriers | Multiple materials and individual meshes raise draws. | Physical, matte, readable safety rhythm. | Batch/merge each static module by shared material before placement; preserve colour cadence. |
| terrain/background | Similar shader response across ground and mountains reduces depth. | Rough warm foreground, cooler lower-contrast distance bands. | Track-specific haze, progressively cooler mountain materials and reduced distant contrast. |
