// @ts-nocheck
/**
 * ROAD//ZERO - Hero Player Coupe
 * Procedural 1970s vintage fastback racing coupe matching references/assets/player-car/reference.png
 * Compliant with 404 Game Jam recipe: pure Three.js procedural geometry, no external assets.
 */
export default function createHeroCoupe(THREE) {
  const root = new THREE.Group();
  root.name = 'hero-player-coupe';

  // --- Palette & Materials (Analog Hillside Festival Style Lock) ---
  const redEnamel = new THREE.MeshStandardMaterial({
    name: 'red-enamel',
    color: 0xd74b3f,
    roughness: 0.32,
    metalness: 0.05,
  });

  const redDark = new THREE.MeshStandardMaterial({
    name: 'red-enamel-shade',
    color: 0xb5352c,
    roughness: 0.38,
    metalness: 0.05,
  });

  const chrome = new THREE.MeshStandardMaterial({
    name: 'vintage-chrome',
    color: 0xdddddd,
    roughness: 0.22,
    metalness: 0.85,
  });

  const glass = new THREE.MeshStandardMaterial({
    name: 'cabin-glass',
    color: 0x223035,
    roughness: 0.15,
    metalness: 0.1,
    transparent: true,
    opacity: 0.88,
  });

  const rubber = new THREE.MeshStandardMaterial({
    name: 'tyre-rubber',
    color: 0x252627,
    roughness: 0.92,
    metalness: 0.0,
  });

  const wheelRim = new THREE.MeshStandardMaterial({
    name: 'alloy-rim',
    color: 0xd8d8d8,
    roughness: 0.3,
    metalness: 0.7,
  });

  const wheelSpokes = new THREE.MeshStandardMaterial({
    name: 'magnesium-spokes',
    color: 0x585858,
    roughness: 0.45,
    metalness: 0.4,
  });

  const creamNumber = new THREE.MeshStandardMaterial({
    name: 'cream-roundel',
    color: 0xefe1c6,
    roughness: 0.65,
    metalness: 0.0,
  });

  const tailLampRed = new THREE.MeshStandardMaterial({
    name: 'tail-lamp-red',
    color: 0xb01a18,
    emissive: 0x5a0b0a,
    emissiveIntensity: 0.45,
    roughness: 0.25,
  });

  const tailLampAmber = new THREE.MeshStandardMaterial({
    name: 'tail-lamp-amber',
    color: 0xd58520,
    emissive: 0x4a2e0a,
    emissiveIntensity: 0.35,
    roughness: 0.25,
  });

  const headlampGlass = new THREE.MeshStandardMaterial({
    name: 'headlamp-glass',
    color: 0xfffaea,
    emissive: 0xffeaae,
    emissiveIntensity: 0.3,
    roughness: 0.15,
  });

  const darkInterior = new THREE.MeshStandardMaterial({
    name: 'dark-interior',
    color: 0x242628,
    roughness: 0.85,
  });

  const grillMesh = new THREE.MeshStandardMaterial({
    name: 'black-grille',
    color: 0x1c1e20,
    roughness: 0.75,
  });

  const body = new THREE.Group();
  body.name = 'chassis-body';
  root.add(body);

  // Helper function for adding meshes
  const addMesh = (geom, mat, name, parent = body, pos = [0, 0, 0], rot = [0, 0, 0], scale = [1, 1, 1]) => {
    const m = new THREE.Mesh(geom, mat);
    m.name = name;
    m.position.set(...pos);
    m.rotation.set(...rot);
    m.scale.set(...scale);
    m.castShadow = true;
    m.receiveShadow = true;
    parent.add(m);
    return m;
  };

  // --- 1. Sculpted Body Volume (Fastback Sports Coupe) ---
  // Lower main hull
  const mainHullGeom = new THREE.CylinderGeometry(0.85, 0.82, 3.2, 16);
  mainHullGeom.rotateX(Math.PI / 2);
  const mainHull = addMesh(mainHullGeom, redEnamel, 'main-hull', body, [0, 0.46, 0], [0, 0, 0], [0.98, 0.44, 1.0]);

  // Front bonnet / nose taper
  const bonnetGeom = new THREE.ConeGeometry(0.84, 1.3, 16);
  bonnetGeom.rotateX(-Math.PI / 2);
  addMesh(bonnetGeom, redEnamel, 'bonnet-nose', body, [0, 0.46, 1.7], [0, 0, 0], [0.94, 0.42, 0.7]);

  // Rounded front nose cap
  const noseSphere = new THREE.SphereGeometry(0.76, 16, 12);
  addMesh(noseSphere, redEnamel, 'nose-cap', body, [0, 0.45, 1.82], [0, 0, 0], [0.98, 0.38, 0.35]);

  // Front bonnet center power bulge
  const bulgeGeom = new THREE.CylinderGeometry(0.22, 0.28, 1.4, 8);
  bulgeGeom.rotateX(Math.PI / 2);
  addMesh(bulgeGeom, redEnamel, 'bonnet-bulge', body, [0, 0.63, 0.95], [0, 0, 0], [1.0, 0.28, 1.0]);

  // Rear Kamm-tail haunches
  const rearHaunchGeom = new THREE.CylinderGeometry(0.88, 0.84, 1.1, 16);
  rearHaunchGeom.rotateX(Math.PI / 2);
  addMesh(rearHaunchGeom, redEnamel, 'rear-haunches', body, [0, 0.52, -1.05], [0, 0, 0], [1.02, 0.46, 1.0]);

  // Rear Kamm vertical flat panel
  const rearTailShape = new THREE.Shape();
  rearTailShape.moveTo(-0.76, 0.22);
  rearTailShape.lineTo(0.76, 0.22);
  rearTailShape.lineTo(0.72, 0.72);
  rearTailShape.quadraticCurveTo(0, 0.76, -0.72, 0.72);
  rearTailShape.closePath();
  const rearTailExtrude = new THREE.ExtrudeGeometry(rearTailShape, { depth: 0.1, bevelEnabled: true, bevelSize: 0.03, bevelThickness: 0.03 });
  rearTailExtrude.translate(0, 0, -1.75);
  addMesh(rearTailExtrude, redDark, 'rear-kamm-panel', body, [0, 0, 0]);

  // Ducktail rear lip spoiler
  const ducktailGeom = new THREE.BoxGeometry(1.36, 0.07, 0.16);
  addMesh(ducktailGeom, redEnamel, 'ducktail-spoiler', body, [0, 0.76, -1.68], [-0.22, 0, 0]);

  // Flared wheel arches (front & rear, left & right)
  const archTorusF = new THREE.TorusGeometry(0.35, 0.065, 8, 18, Math.PI);
  archTorusF.rotateY(Math.PI / 2);
  addMesh(archTorusF, redEnamel, 'arch-fl', body, [-0.78, 0.33, 1.12], [0, 0, 0]);
  addMesh(archTorusF, redEnamel, 'arch-fr', body, [0.78, 0.33, 1.12], [0, 0, 0]);

  // Rear muscular arches
  const archTorusR = new THREE.TorusGeometry(0.37, 0.08, 8, 18, Math.PI);
  archTorusR.rotateY(Math.PI / 2);
  addMesh(archTorusR, redEnamel, 'arch-rl', body, [-0.80, 0.33, -1.14], [0, 0, 0]);
  addMesh(archTorusR, redEnamel, 'arch-rr', body, [0.80, 0.33, -1.14], [0, 0, 0]);

  // Side rocker panels
  const rockerGeom = new THREE.CylinderGeometry(0.06, 0.06, 1.9, 8);
  rockerGeom.rotateX(Math.PI / 2);
  addMesh(rockerGeom, redDark, 'rocker-l', body, [-0.81, 0.22, 0]);
  addMesh(rockerGeom, redDark, 'rocker-r', body, [0.81, 0.22, 0]);

  // --- 2. Curved Cabin Greenhouse & Fastback Glass ---
  // Cockpit base / interior tub
  const interiorTub = new THREE.BoxGeometry(1.22, 0.45, 1.6);
  addMesh(interiorTub, darkInterior, 'interior-tub', body, [0, 0.52, -0.1]);

  // Roof cap
  const roofGeom = new THREE.CylinderGeometry(0.56, 0.64, 1.15, 12);
  roofGeom.rotateX(Math.PI / 2);
  addMesh(roofGeom, redEnamel, 'roof-cap', body, [0, 0.98, -0.22], [0, 0, 0], [1.02, 0.34, 1.0]);

  // Curved Windshield
  const windshieldShape = new THREE.Shape();
  windshieldShape.moveTo(-0.62, 0.62);
  windshieldShape.lineTo(0.62, 0.62);
  windshieldShape.lineTo(0.54, 0.96);
  windshieldShape.lineTo(-0.54, 0.96);
  windshieldShape.closePath();
  const windshieldExtrude = new THREE.ExtrudeGeometry(windshieldShape, { depth: 0.04, bevelEnabled: true, bevelSize: 0.015, bevelThickness: 0.015 });
  addMesh(windshieldExtrude, glass, 'windshield', body, [0, 0, 0.32], [-0.56, 0, 0]);

  // Windshield chrome surround trim
  const windshieldTrim = new THREE.BoxGeometry(1.2, 0.03, 0.04);
  addMesh(windshieldTrim, chrome, 'windshield-cowl-trim', body, [0, 0.67, 0.52]);

  // Fastback Rear Glass (sloping continuously down to Kamm tail)
  const rearGlassShape = new THREE.Shape();
  rearGlassShape.moveTo(-0.54, 0.96);
  rearGlassShape.lineTo(0.54, 0.96);
  rearGlassShape.lineTo(0.64, 0.68);
  rearGlassShape.lineTo(-0.64, 0.68);
  rearGlassShape.closePath();
  const rearGlassExtrude = new THREE.ExtrudeGeometry(rearGlassShape, { depth: 0.03, bevelEnabled: true, bevelSize: 0.015, bevelThickness: 0.015 });
  addMesh(rearGlassExtrude, glass, 'rear-fastback-glass', body, [0, 0.03, -0.74], [0.42, 0, 0]);

  // Side cabin glass
  const sideGlassGeom = new THREE.BoxGeometry(0.04, 0.28, 1.05);
  addMesh(sideGlassGeom, glass, 'side-glass-l', body, [-0.64, 0.82, -0.15], [0, 0, 0.12]);
  addMesh(sideGlassGeom, glass, 'side-glass-r', body, [0.64, 0.82, -0.15], [0, 0, -0.12]);

  // Thin A-pillars & B/C pillars
  const pillarGeom = new THREE.CylinderGeometry(0.025, 0.03, 0.48, 6);
  addMesh(pillarGeom, redEnamel, 'pillar-a-l', body, [-0.58, 0.82, 0.42], [0.45, 0, 0.22]);
  addMesh(pillarGeom, redEnamel, 'pillar-a-r', body, [0.58, 0.82, 0.42], [0.45, 0, -0.22]);
  addMesh(pillarGeom, redEnamel, 'pillar-c-l', body, [-0.63, 0.78, -0.82], [-0.38, 0, 0.22]);
  addMesh(pillarGeom, redEnamel, 'pillar-c-r', body, [0.63, 0.78, -0.82], [-0.38, 0, -0.22]);

  // Chrome side mirrors
  const mirrorGeom = new THREE.SphereGeometry(0.05, 8, 8);
  addMesh(mirrorGeom, chrome, 'mirror-l', body, [-0.74, 0.74, 0.38]);
  addMesh(mirrorGeom, chrome, 'mirror-r', body, [0.74, 0.74, 0.38]);

  // --- 3. Front Fascia Details (Classic Vintage Hill-Climb Nose) ---
  // Oval radiator grille recess
  const grilleGeom = new THREE.CylinderGeometry(0.18, 0.22, 0.68, 12);
  grilleGeom.rotateZ(Math.PI / 2);
  addMesh(grilleGeom, grillMesh, 'front-grille-mesh', body, [0, 0.36, 1.94], [0, 0, 0], [1.0, 0.65, 0.5]);
  // Chrome grille trim ring
  const grilleRim = new THREE.TorusGeometry(0.32, 0.02, 6, 20);
  addMesh(grilleRim, chrome, 'front-grille-rim', body, [0, 0.36, 1.96], [0, 0, 0], [1.1, 0.55, 1.0]);

  // Dual round headlights with chrome bezels and inner bulb reflectors
  const headlampBezel = new THREE.TorusGeometry(0.11, 0.02, 8, 16);
  const headlampLens = new THREE.SphereGeometry(0.10, 12, 10, 0, Math.PI * 2, 0, Math.PI / 2);
  headlampLens.rotateX(Math.PI / 2);
  for (const side of [-1, 1]) {
    addMesh(headlampBezel, chrome, `headlamp-bezel-${side}`, body, [side * 0.54, 0.48, 1.84], [-0.15, side * 0.12, 0]);
    addMesh(headlampLens, headlampGlass, `headlamp-lens-${side}`, body, [side * 0.54, 0.48, 1.85], [-0.15, side * 0.12, 0]);
    // Small round amber indicator below
    const indLens = new THREE.SphereGeometry(0.045, 8, 8);
    addMesh(indLens, tailLampAmber, `indicator-${side}`, body, [side * 0.56, 0.32, 1.87]);
    // Chrome front bumperette
    const bumperGeom = new THREE.CapsuleGeometry(0.035, 0.22, 4, 8);
    bumperGeom.rotateZ(Math.PI / 2);
    addMesh(bumperGeom, chrome, `front-bumperette-${side}`, body, [side * 0.44, 0.26, 1.92]);
  }

  // --- 4. Rear Fascia Details (Quad Round Taillights & Twin Exhausts) ---
  // Twin exhaust pipes (polished chrome)
  const exhaustGeom = new THREE.CylinderGeometry(0.05, 0.05, 0.28, 12);
  exhaustGeom.rotateX(Math.PI / 2);
  addMesh(exhaustGeom, chrome, 'exhaust-l', body, [-0.18, 0.20, -1.82]);
  addMesh(exhaustGeom, chrome, 'exhaust-r', body, [-0.07, 0.20, -1.82]);
  // Dark lower rear valance panel
  const valanceGeom = new THREE.BoxGeometry(0.68, 0.16, 0.08);
  addMesh(valanceGeom, darkInterior, 'rear-valance', body, [-0.12, 0.24, -1.77]);

  // Quad round tail lamps: outer amber, inner red (as in reference.png!)
  const tailRing = new THREE.TorusGeometry(0.08, 0.015, 6, 16);
  const tailLens = new THREE.CylinderGeometry(0.07, 0.07, 0.04, 12);
  tailLens.rotateX(Math.PI / 2);
  for (const side of [-1, 1]) {
    // Inner red brake lamp
    addMesh(tailRing, chrome, `taillamp-ring-in-${side}`, body, [side * 0.36, 0.49, -1.77]);
    addMesh(tailLens, tailLampRed, `taillamp-lens-in-${side}`, body, [side * 0.36, 0.49, -1.78]);
    // Outer amber lamp
    addMesh(tailRing, chrome, `taillamp-ring-out-${side}`, body, [side * 0.58, 0.49, -1.75]);
    addMesh(tailLens, tailLampAmber, `taillamp-lens-out-${side}`, body, [side * 0.58, 0.49, -1.76]);
    // Rear bumperette
    const rBumper = new THREE.CapsuleGeometry(0.035, 0.24, 4, 8);
    rBumper.rotateZ(Math.PI / 2);
    addMesh(rBumper, chrome, `rear-bumperette-${side}`, body, [side * 0.48, 0.27, -1.79]);
  }

  // Competition details: Circular door roundel (white/cream competition circle)
  const roundelGeom = new THREE.CylinderGeometry(0.32, 0.32, 0.02, 20);
  roundelGeom.rotateZ(Math.PI / 2);
  addMesh(roundelGeom, creamNumber, 'roundel-l', body, [-0.84, 0.49, 0.06]);
  addMesh(roundelGeom, creamNumber, 'roundel-r', body, [0.84, 0.49, 0.06]);

  // Chrome vintage quick-release fuel filler cap on rear right deck
  const fuelCap = new THREE.CylinderGeometry(0.05, 0.06, 0.03, 10);
  addMesh(fuelCap, chrome, 'fuel-cap', body, [0.44, 0.73, -1.02], [-0.3, 0, 0.2]);

  // --- 5. Articulated Vintage Wheels (8-Spoke Minilite Alloy Rims & Wide Tires) ---
  const createWheel = (name) => {
    const wheelGroup = new THREE.Group();
    wheelGroup.name = name;

    // Wide black rubber tyre
    const tyreGeom = new THREE.TorusGeometry(0.24, 0.09, 12, 24);
    tyreGeom.rotateY(Math.PI / 2);
    const tyre = new THREE.Mesh(tyreGeom, rubber);
    tyre.castShadow = true;
    wheelGroup.add(tyre);

    // Tread cap (outer cylinder to give flat contact patch)
    const treadGeom = new THREE.CylinderGeometry(0.315, 0.315, 0.16, 20, 1, true);
    treadGeom.rotateZ(Math.PI / 2);
    const tread = new THREE.Mesh(treadGeom, rubber);
    wheelGroup.add(tread);

    // Deep-dish alloy wheel rim with polished chrome lip
    const rimGeom = new THREE.CylinderGeometry(0.22, 0.22, 0.17, 18);
    rimGeom.rotateZ(Math.PI / 2);
    const rim = new THREE.Mesh(rimGeom, wheelRim);
    wheelGroup.add(rim);

    // 8-Spoke Minilite / Campagnolo style center
    const spokeGroup = new THREE.Group();
    const spokeGeom = new THREE.CylinderGeometry(0.022, 0.03, 0.15, 6);
    for (let s = 0; s < 8; s++) {
      const angle = (s / 8) * Math.PI * 2;
      const spoke = new THREE.Mesh(spokeGeom, wheelSpokes);
      spoke.position.set(0, Math.cos(angle) * 0.08, Math.sin(angle) * 0.08);
      spoke.rotation.x = angle;
      spokeGroup.add(spoke);
    }
    wheelGroup.add(spokeGroup);

    // Center hub cap with chrome lug nut
    const hubGeom = new THREE.CylinderGeometry(0.045, 0.05, 0.19, 8);
    hubGeom.rotateZ(Math.PI / 2);
    const hub = new THREE.Mesh(hubGeom, chrome);
    wheelGroup.add(hub);

    return wheelGroup;
  };

  // Wheel positions (Track width 1.58m, Wheelbase 2.26m)
  const wheelFL = new THREE.Group();
  wheelFL.name = 'wheelFL-pivot';
  wheelFL.position.set(-0.78, 0.31, 1.12);
  const wFL = createWheel('wheelFL-mesh');
  wheelFL.add(wFL);
  root.add(wheelFL);

  const wheelFR = new THREE.Group();
  wheelFR.name = 'wheelFR-pivot';
  wheelFR.position.set(0.78, 0.31, 1.12);
  const wFR = createWheel('wheelFR-mesh');
  wheelFR.add(wFR);
  root.add(wheelFR);

  const wheelRL = new THREE.Group();
  wheelRL.name = 'wheelRL-pivot';
  wheelRL.position.set(-0.80, 0.31, -1.14);
  const wRL = createWheel('wheelRL-mesh');
  wheelRL.add(wRL);
  root.add(wheelRL);

  const wheelRR = new THREE.Group();
  wheelRR.name = 'wheelRR-pivot';
  wheelRR.position.set(0.80, 0.31, -1.14);
  const wRR = createWheel('wheelRR-mesh');
  wheelRR.add(wRR);
  root.add(wheelRR);

  // Store hierarchy parts in userData for runtime steering and wheel rotation
  root.userData.parts = {
    body,
    wheelFL,
    wheelFR,
    wheelRL,
    wheelRR,
    meshFL: wFL,
    meshFR: wFR,
    meshRL: wRL,
    meshRR: wRR,
  };
  root.userData.keepHierarchy = true;

  return root;
}
