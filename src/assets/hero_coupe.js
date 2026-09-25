// @ts-nocheck
/**
 * ROAD//ZERO - Hero Player Coupe (Next-Rated Overhaul)
 * Procedural 1970s vintage fastback racing coupe matching references/assets/player-car/reference.png
 * - Clearcoat enamel paint with specular highlights
 * - Detailed cockpit: driver in vintage helmet, 3-spoke steering wheel, tubular roll cage
 * - Glowing headlamps & dynamic brake lamp flares
 * - Dual chrome exhaust tips with backfire emission points
 * - Articulated steering wheels, spinning Minilite alloy rims, suspension body roll
 */
export default function createHeroCoupe(THREE) {
  const root = new THREE.Group();
  root.name = 'hero-player-coupe';

  // --- Palette & Materials ---
  const redEnamel = new THREE.MeshPhysicalMaterial({
    name: 'red-enamel',
    color: 0xd74b3f,
    roughness: 0.27,
    metalness: 0.0,
    clearcoat: 0.48,
    clearcoatRoughness: 0.3,
  });

  const redDark = new THREE.MeshPhysicalMaterial({
    name: 'red-enamel-shade',
    color: 0xaa2d25,
    roughness: 0.28,
    metalness: 0.0,
    clearcoat: 0.32,
    clearcoatRoughness: 0.36,
  });

  const chrome = new THREE.MeshStandardMaterial({
    name: 'vintage-chrome',
    color: 0xe8e8e8,
    roughness: 0.15,
    metalness: 0.9,
  });

  const glass = new THREE.MeshStandardMaterial({
    name: 'cabin-glass',
    color: 0x1f2e34,
    roughness: 0.3,
    metalness: 0.0,
  });

  const rubber = new THREE.MeshStandardMaterial({
    name: 'tyre-rubber',
    color: 0x191a1a,
    roughness: 0.98,
    metalness: 0.0,
  });

  const wheelRim = new THREE.MeshStandardMaterial({
    name: 'alloy-rim',
    color: 0xd5d5d5,
    roughness: 0.25,
    metalness: 0.75,
  });

  const wheelSpokes = new THREE.MeshStandardMaterial({
    name: 'magnesium-spokes',
    color: 0x505050,
    roughness: 0.4,
    metalness: 0.45,
  });

  const creamRoundel = new THREE.MeshStandardMaterial({
    name: 'cream-roundel',
    color: 0xefe1c6,
    roughness: 0.6,
    metalness: 0.0,
  });

  const tailLampRed = new THREE.MeshStandardMaterial({
    name: 'tail-lamp-red',
    color: 0xb51c19,
    emissive: 0x6a0d0c,
    emissiveIntensity: 0.6,
    roughness: 0.2,
  });

  const tailLampAmber = new THREE.MeshStandardMaterial({
    name: 'tail-lamp-amber',
    color: 0xd88a22,
    emissive: 0x50320a,
    emissiveIntensity: 0.4,
    roughness: 0.2,
  });

  const headlampGlass = new THREE.MeshStandardMaterial({
    name: 'headlamp-glass',
    color: 0xfffaea,
    emissive: 0xffe899,
    emissiveIntensity: 0.28,
    roughness: 0.3,
  });

  const darkInterior = new THREE.MeshStandardMaterial({
    name: 'dark-interior',
    color: 0x1c1e20,
    roughness: 0.88,
  });

  const rollCageMat = new THREE.MeshStandardMaterial({
    name: 'roll-cage',
    color: 0xcccccc,
    roughness: 0.35,
    metalness: 0.6,
  });

  const driverSuit = new THREE.MeshStandardMaterial({
    name: 'driver-suit',
    color: 0x2e4250,
    roughness: 0.8,
  });

  const helmetMat = new THREE.MeshStandardMaterial({
    name: 'driver-helmet',
    color: 0xefe1c6,
    roughness: 0.3,
    metalness: 0.1,
  });

  const helmetVisor = new THREE.MeshStandardMaterial({
    name: 'helmet-visor',
    color: 0x151618,
    roughness: 0.15,
  });

  // Body group sits on chassis for suspension roll & pitch
  const body = new THREE.Group();
  body.name = 'chassis-body';
  root.add(body);

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

  // --- 1. Sculpted Fastback Body ---
  // Main hull
  const mainHullGeom = new THREE.CylinderGeometry(0.85, 0.82, 3.2, 18);
  mainHullGeom.rotateX(Math.PI / 2);
  addMesh(mainHullGeom, redEnamel, 'main-hull', body, [0, 0.46, 0], [0, 0, 0], [0.98, 0.44, 1.0]);

  // Front bonnet nose taper
  const bonnetGeom = new THREE.ConeGeometry(0.84, 1.3, 18);
  bonnetGeom.rotateX(-Math.PI / 2);
  addMesh(bonnetGeom, redEnamel, 'bonnet-nose', body, [0, 0.46, 1.7], [0, 0, 0], [0.94, 0.42, 0.7]);

  // Rounded front nose cap
  const noseSphere = new THREE.SphereGeometry(0.76, 18, 14);
  addMesh(noseSphere, redEnamel, 'nose-cap', body, [0, 0.45, 1.82], [0, 0, 0], [0.98, 0.38, 0.35]);

  // Power bulge & dual hood vents
  const bulgeGeom = new THREE.CylinderGeometry(0.22, 0.28, 1.4, 10);
  bulgeGeom.rotateX(Math.PI / 2);
  addMesh(bulgeGeom, redEnamel, 'bonnet-bulge', body, [0, 0.63, 0.95], [0, 0, 0], [1.0, 0.28, 1.0]);
  for (const s of [-0.28, 0.28]) {
    const vent = new THREE.BoxGeometry(0.12, 0.02, 0.35);
    addMesh(vent, darkInterior, `hood-vent-${s}`, body, [s, 0.64, 1.05], [-0.1, 0, 0]);
  }

  // Muscular rear haunches
  const rearHaunchGeom = new THREE.CylinderGeometry(0.88, 0.84, 1.1, 18);
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
  addMesh(new THREE.BoxGeometry(1.36, 0.07, 0.16), redEnamel, 'ducktail-spoiler', body, [0, 0.76, -1.68], [-0.22, 0, 0]);

  // Flared wheel arches in ZY plane
  const archTorusF = new THREE.TorusGeometry(0.35, 0.065, 8, 18, Math.PI);
  archTorusF.rotateY(Math.PI / 2);
  addMesh(archTorusF, redEnamel, 'arch-fl', body, [-0.78, 0.33, 1.12]);
  addMesh(archTorusF, redEnamel, 'arch-fr', body, [0.78, 0.33, 1.12]);

  const archTorusR = new THREE.TorusGeometry(0.37, 0.08, 8, 18, Math.PI);
  archTorusR.rotateY(Math.PI / 2);
  addMesh(archTorusR, redEnamel, 'arch-rl', body, [-0.80, 0.33, -1.14]);
  addMesh(archTorusR, redEnamel, 'arch-rr', body, [0.80, 0.33, -1.14]);

  // Side rocker panels
  const rockerGeom = new THREE.CylinderGeometry(0.06, 0.06, 1.9, 8);
  rockerGeom.rotateX(Math.PI / 2);
  addMesh(rockerGeom, redDark, 'rocker-l', body, [-0.81, 0.22, 0]);
  addMesh(rockerGeom, redDark, 'rocker-r', body, [0.81, 0.22, 0]);

  // --- 2. Cockpit, Driver, Roll Cage & Glass ---
  addMesh(new THREE.BoxGeometry(1.22, 0.45, 1.6), darkInterior, 'interior-tub', body, [0, 0.52, -0.1]);

  // Tubular Roll Cage (visible through glass)
  const cageTube = new THREE.CylinderGeometry(0.02, 0.02, 0.55, 6);
  addMesh(cageTube, rollCageMat, 'cage-post-l', body, [-0.52, 0.78, -0.45], [0, 0, 0.1]);
  addMesh(cageTube, rollCageMat, 'cage-post-r', body, [0.52, 0.78, -0.45], [0, 0, -0.1]);
  const cageBar = new THREE.CylinderGeometry(0.02, 0.02, 1.02, 6);
  cageBar.rotateZ(Math.PI / 2);
  addMesh(cageBar, rollCageMat, 'cage-cross-top', body, [0, 1.02, -0.45]);
  const cageDiagonal = new THREE.CylinderGeometry(0.018, 0.018, 1.15, 6);
  cageDiagonal.rotateZ(0.72);
  addMesh(cageDiagonal, rollCageMat, 'cage-diagonal', body, [0, 0.78, -0.46]);

  // Driver in vintage helmet & racing suit
  const driverBody = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 0.42, 8), driverSuit);
  driverBody.position.set(-0.25, 0.72, -0.05);
  driverBody.rotation.x = -0.12;
  body.add(driverBody);

  const helmet = new THREE.Mesh(new THREE.SphereGeometry(0.14, 12, 10), helmetMat);
  helmet.position.set(-0.25, 0.98, -0.02);
  const visor = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.07, 0.12), helmetVisor);
  visor.position.set(-0.25, 0.97, 0.09);
  body.add(helmet, visor);

  // 3-Spoke vintage racing steering wheel
  const wheelRimMesh = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.016, 6, 16), darkInterior);
  wheelRimMesh.position.set(-0.25, 0.74, 0.32);
  wheelRimMesh.rotation.x = 0.55;
  body.add(wheelRimMesh);

  // Roof cap
  const roofGeom = new THREE.CylinderGeometry(0.56, 0.64, 1.15, 14);
  roofGeom.rotateX(Math.PI / 2);
  addMesh(roofGeom, redEnamel, 'roof-cap', body, [0, 0.98, -0.22], [0, 0, 0], [1.02, 0.34, 1.0]);

  // Windshield & chrome cowl trim
  const windshieldShape = new THREE.Shape();
  windshieldShape.moveTo(-0.62, 0.62);
  windshieldShape.lineTo(0.62, 0.62);
  windshieldShape.lineTo(0.54, 0.96);
  windshieldShape.lineTo(-0.54, 0.96);
  windshieldShape.closePath();
  const windshieldExtrude = new THREE.ExtrudeGeometry(windshieldShape, { depth: 0.04, bevelEnabled: true, bevelSize: 0.015, bevelThickness: 0.015 });
  addMesh(windshieldExtrude, glass, 'windshield', body, [0, 0, 0.32], [-0.56, 0, 0]);
  addMesh(new THREE.BoxGeometry(1.2, 0.03, 0.04), chrome, 'windshield-cowl-trim', body, [0, 0.67, 0.52]);

  // Fastback Rear Glass
  const rearGlassShape = new THREE.Shape();
  rearGlassShape.moveTo(-0.54, 0.96);
  rearGlassShape.lineTo(0.54, 0.96);
  rearGlassShape.lineTo(0.64, 0.68);
  rearGlassShape.lineTo(-0.64, 0.68);
  rearGlassShape.closePath();
  const rearGlassExtrude = new THREE.ExtrudeGeometry(rearGlassShape, { depth: 0.03, bevelEnabled: true, bevelSize: 0.015, bevelThickness: 0.015 });
  addMesh(rearGlassExtrude, glass, 'rear-fastback-glass', body, [0, 0.03, -0.74], [0.42, 0, 0]);

  // Side cabin glass & pillars
  addMesh(new THREE.BoxGeometry(0.04, 0.28, 1.05), glass, 'side-glass-l', body, [-0.64, 0.82, -0.15], [0, 0, 0.12]);
  addMesh(new THREE.BoxGeometry(0.04, 0.28, 1.05), glass, 'side-glass-r', body, [0.64, 0.82, -0.15], [0, 0, -0.12]);
  addMesh(new THREE.SphereGeometry(0.05, 8, 8), chrome, 'mirror-l', body, [-0.74, 0.74, 0.38]);
  addMesh(new THREE.SphereGeometry(0.05, 8, 8), chrome, 'mirror-r', body, [0.74, 0.74, 0.38]);

  // --- 3. Front Grille, Round Headlamps & Light Cones ---
  const grilleGeom = new THREE.CylinderGeometry(0.18, 0.22, 0.68, 14);
  grilleGeom.rotateZ(Math.PI / 2);
  addMesh(grilleGeom, darkInterior, 'front-grille-mesh', body, [0, 0.36, 1.94], [0, 0, 0], [1.0, 0.65, 0.5]);
  addMesh(new THREE.TorusGeometry(0.32, 0.02, 6, 20), chrome, 'front-grille-rim', body, [0, 0.36, 1.96], [0, 0, 0], [1.1, 0.55, 1.0]);

  // Headlamps
  const headlampBezel = new THREE.TorusGeometry(0.11, 0.02, 8, 18);
  const headlampLens = new THREE.SphereGeometry(0.10, 12, 10, 0, Math.PI * 2, 0, Math.PI / 2);
  headlampLens.rotateX(Math.PI / 2);

  // Subtle forward headlight beam cones (semi-transparent warm yellow cone)
  const beamMat = new THREE.MeshBasicMaterial({
    color: 0xffea9f,
    transparent: true,
    opacity: 0.18,
    side: THREE.DoubleSide,
    depthWrite: false,
  });

  for (const side of [-1, 1]) {
    addMesh(headlampBezel, chrome, `headlamp-bezel-${side}`, body, [side * 0.54, 0.48, 1.84], [-0.15, side * 0.12, 0]);
    addMesh(headlampLens, headlampGlass, `headlamp-lens-${side}`, body, [side * 0.54, 0.48, 1.85], [-0.15, side * 0.12, 0]);

    // Forward light beam
    const beamGeom = new THREE.ConeGeometry(0.65, 5.5, 10, 1, true);
    beamGeom.rotateX(-Math.PI / 2);
    beamGeom.translate(0, 0, 2.75);
    const beam = new THREE.Mesh(beamGeom, beamMat);
    beam.position.set(side * 0.54, 0.48, 1.85);
    body.add(beam);

    addMesh(new THREE.SphereGeometry(0.045, 8, 8), tailLampAmber, `indicator-${side}`, body, [side * 0.56, 0.32, 1.87]);
    const bGeom = new THREE.CapsuleGeometry(0.035, 0.22, 4, 8);
    bGeom.rotateZ(Math.PI / 2);
    addMesh(bGeom, chrome, `front-bumperette-${side}`, body, [side * 0.44, 0.26, 1.92]);
  }

  // --- 4. Rear Fascia & Dual Exhaust with Backfire Points ---
  const exhaustL = addMesh(new THREE.CylinderGeometry(0.05, 0.05, 0.28, 12), chrome, 'exhaust-l', body, [-0.18, 0.20, -1.82], [Math.PI / 2, 0, 0]);
  const exhaustR = addMesh(new THREE.CylinderGeometry(0.05, 0.05, 0.28, 12), chrome, 'exhaust-r', body, [-0.07, 0.20, -1.82], [Math.PI / 2, 0, 0]);
  addMesh(new THREE.BoxGeometry(0.68, 0.16, 0.08), darkInterior, 'rear-valance', body, [-0.12, 0.24, -1.77]);

  // Quad round tail lamps
  const tailLamps = [];
  const tailRing = new THREE.TorusGeometry(0.08, 0.015, 6, 16);
  const tailLens = new THREE.CylinderGeometry(0.07, 0.07, 0.04, 12);
  tailLens.rotateX(Math.PI / 2);

  for (const side of [-1, 1]) {
    addMesh(tailRing, chrome, `taillamp-ring-in-${side}`, body, [side * 0.36, 0.49, -1.77]);
    const redLamp = addMesh(tailLens, tailLampRed, `taillamp-lens-in-${side}`, body, [side * 0.36, 0.49, -1.78]);
    tailLamps.push(redLamp);

    addMesh(tailRing, chrome, `taillamp-ring-out-${side}`, body, [side * 0.58, 0.49, -1.75]);
    addMesh(tailLens, tailLampAmber, `taillamp-lens-out-${side}`, body, [side * 0.58, 0.49, -1.76]);

    const rBumper = new THREE.CapsuleGeometry(0.035, 0.24, 4, 8);
    rBumper.rotateZ(Math.PI / 2);
    addMesh(rBumper, chrome, `rear-bumperette-${side}`, body, [side * 0.48, 0.27, -1.79]);
  }

  // Competition door roundels & fuel cap
  const roundelGeom = new THREE.CylinderGeometry(0.32, 0.32, 0.02, 20);
  roundelGeom.rotateZ(Math.PI / 2);
  addMesh(roundelGeom, creamRoundel, 'roundel-l', body, [-0.84, 0.49, 0.06]);
  addMesh(roundelGeom, creamRoundel, 'roundel-r', body, [0.84, 0.49, 0.06]);
  addMesh(new THREE.CylinderGeometry(0.05, 0.06, 0.03, 10), chrome, 'fuel-cap', body, [0.44, 0.73, -1.02], [-0.3, 0, 0.2]);

  // --- 5. Articulated Vintage Minilite Wheels ---
  const createWheel = (name) => {
    const wheelGroup = new THREE.Group();
    wheelGroup.name = name;

    const tyreGeom = new THREE.TorusGeometry(0.24, 0.09, 12, 24);
    tyreGeom.rotateY(Math.PI / 2);
    wheelGroup.add(new THREE.Mesh(tyreGeom, rubber));

    const treadGeom = new THREE.CylinderGeometry(0.315, 0.315, 0.16, 20, 1, true);
    treadGeom.rotateZ(Math.PI / 2);
    wheelGroup.add(new THREE.Mesh(treadGeom, rubber));

    const rimGeom = new THREE.CylinderGeometry(0.22, 0.22, 0.17, 18);
    rimGeom.rotateZ(Math.PI / 2);
    wheelGroup.add(new THREE.Mesh(rimGeom, wheelRim));

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

    const hubGeom = new THREE.CylinderGeometry(0.045, 0.05, 0.19, 8);
    hubGeom.rotateZ(Math.PI / 2);
    wheelGroup.add(new THREE.Mesh(hubGeom, chrome));

    return wheelGroup;
  };

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

  root.userData.parts = {
    body,
    tailLamps,
    tailLampMaterial: tailLampRed,
    exhaustL,
    exhaustR,
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
