// @ts-nocheck
/**
 * ROAD//ZERO - AI Rival Cars
 * Procedural 1970s racing cars matching the visual references and style lock:
 * - Charger: Ochre/Yellow 70s Muscle Coupe (wider front, quad headlights, black stripes, #12)
 * - Technician: Faded Blue Aerodynamic Lightweight Coupe (sleek teardrop, white stripe, #7)
 * - Defender: Forest Green Classic Rally Saloon (upright boxy haunches, chrome grille, #4)
 */

export default function createRivalCar(THREE, id) {
  const root = new THREE.Group();
  root.name = `rival-${id.toLowerCase()}`;

  const rubber = new THREE.MeshStandardMaterial({ name: 'tyre-rubber', color: 0x242526, roughness: 0.92 });
  const wheelRim = new THREE.MeshStandardMaterial({ name: 'wheel-rim', color: 0xcccccc, roughness: 0.35, metalness: 0.7 });
  const chrome = new THREE.MeshStandardMaterial({ name: 'chrome', color: 0xdddddd, roughness: 0.2, metalness: 0.85 });
  const glass = new THREE.MeshStandardMaterial({ name: 'glass', color: 0x223035, roughness: 0.15, transparent: true, opacity: 0.88 });
  const darkInterior = new THREE.MeshStandardMaterial({ name: 'dark', color: 0x1f2122, roughness: 0.85 });
  const tailLampRed = new THREE.MeshStandardMaterial({ name: 'tail-red', color: 0xad1b18, emissive: 0x5a0b0a, emissiveIntensity: 0.45 });
  const headlampGlass = new THREE.MeshStandardMaterial({ name: 'headlamp', color: 0xfffaea, emissive: 0xffeaae, emissiveIntensity: 0.3 });
  const creamMat = new THREE.MeshStandardMaterial({ name: 'cream-accents', color: 0xefe1c6, roughness: 0.65 });

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

  const createWheel = (name, spokeColor = 0x444444) => {
    const g = new THREE.Group();
    g.name = name;
    const tyreGeom = new THREE.TorusGeometry(0.24, 0.09, 12, 22);
    tyreGeom.rotateY(Math.PI / 2);
    g.add(new THREE.Mesh(tyreGeom, rubber));

    const treadGeom = new THREE.CylinderGeometry(0.315, 0.315, 0.16, 18, 1, true);
    treadGeom.rotateZ(Math.PI / 2);
    g.add(new THREE.Mesh(treadGeom, rubber));

    const rimGeom = new THREE.CylinderGeometry(0.22, 0.22, 0.17, 16);
    rimGeom.rotateZ(Math.PI / 2);
    g.add(new THREE.Mesh(rimGeom, wheelRim));

    const spokesMat = new THREE.MeshStandardMaterial({ color: spokeColor, roughness: 0.4, metalness: 0.4 });
    const spokeGeom = new THREE.CylinderGeometry(0.02, 0.025, 0.15, 6);
    for (let s = 0; s < 6; s++) {
      const a = (s / 6) * Math.PI * 2;
      const sp = new THREE.Mesh(spokeGeom, spokesMat);
      sp.position.set(0, Math.cos(a) * 0.08, Math.sin(a) * 0.08);
      sp.rotation.x = a;
      g.add(sp);
    }
    return g;
  };

  if (id === 'CHARGER') {
    // === RIVAL 1: CHARGER (Ochre/Yellow 70s Muscle Coupe) ===
    const ochrePaint = new THREE.MeshStandardMaterial({ name: 'ochre-paint', color: 0xd5a23b, roughness: 0.35, metalness: 0.05 });
    const blackStripe = new THREE.MeshStandardMaterial({ name: 'black-stripe', color: 0x1f2022, roughness: 0.7 });

    // Wide aggressive muscular body
    const mainGeom = new THREE.BoxGeometry(1.68, 0.52, 3.8);
    addMesh(mainGeom, ochrePaint, 'charger-main', body, [0, 0.45, 0]);

    // Fastback roof / cabin
    const cabinGeom = new THREE.BoxGeometry(1.42, 0.44, 1.95);
    addMesh(cabinGeom, ochrePaint, 'charger-cabin', body, [0, 0.88, -0.25]);

    // Sloping windshield & rear fastback window
    addMesh(new THREE.BoxGeometry(1.36, 0.42, 0.05), glass, 'charger-windshield', body, [0, 0.84, 0.65], [-0.55, 0, 0]);
    addMesh(new THREE.BoxGeometry(1.32, 0.46, 0.05), glass, 'charger-rear-glass', body, [0, 0.84, -1.15], [0.52, 0, 0]);
    addMesh(new THREE.BoxGeometry(0.05, 0.28, 1.45), glass, 'charger-side-glass', body, [0.72, 0.84, -0.25]);
    addMesh(new THREE.BoxGeometry(0.05, 0.28, 1.45), glass, 'charger-side-glass-l', body, [-0.72, 0.84, -0.25]);

    // Black dual racing stripes down bonnet & roof
    addMesh(new THREE.BoxGeometry(0.22, 0.02, 1.4), blackStripe, 'stripe-l', body, [-0.22, 0.72, 1.15]);
    addMesh(new THREE.BoxGeometry(0.22, 0.02, 1.4), blackStripe, 'stripe-r', body, [0.22, 0.72, 1.15]);
    addMesh(new THREE.BoxGeometry(0.22, 0.02, 1.9), blackStripe, 'stripe-roof-l', body, [-0.22, 1.11, -0.25]);
    addMesh(new THREE.BoxGeometry(0.22, 0.02, 1.9), blackStripe, 'stripe-roof-r', body, [0.22, 1.11, -0.25]);

    // Wide aggressive front grille with quad round headlights
    addMesh(new THREE.BoxGeometry(1.58, 0.32, 0.15), blackStripe, 'recessed-grille', body, [0, 0.45, 1.92]);
    const lampGeom = new THREE.CylinderGeometry(0.09, 0.09, 0.05, 12);
    lampGeom.rotateX(Math.PI / 2);
    for (const side of [-1, 1]) {
      addMesh(lampGeom, headlampGlass, `quad-outer-${side}`, body, [side * 0.64, 0.48, 1.98]);
      addMesh(lampGeom, headlampGlass, `quad-inner-${side}`, body, [side * 0.44, 0.48, 1.98]);
      // Front chin spoiler
      addMesh(new THREE.BoxGeometry(0.72, 0.08, 0.25), blackStripe, `chin-spoiler-${side}`, body, [side * 0.45, 0.22, 1.88]);
    }

    // Rear ducktail spoiler
    addMesh(new THREE.BoxGeometry(1.55, 0.14, 0.22), ochrePaint, 'rear-spoiler', body, [0, 0.76, -1.88], [-0.35, 0, 0]);
    // Dual rectangular tail lamps
    const rTail = new THREE.BoxGeometry(0.48, 0.12, 0.04);
    for (const side of [-1, 1]) {
      addMesh(rTail, tailLampRed, `tail-charger-${side}`, body, [side * 0.52, 0.52, -1.91]);
    }
    // Number #12 on cream roundel
    const roundel = new THREE.CylinderGeometry(0.28, 0.28, 0.02, 16);
    roundel.rotateZ(Math.PI / 2);
    addMesh(roundel, creamMat, 'roundel-l', body, [-0.85, 0.48, 0.05]);
    addMesh(roundel, creamMat, 'roundel-r', body, [0.85, 0.48, 0.05]);

  } else if (id === 'TECHNICIAN') {
    // === RIVAL 2: TECHNICIAN (Faded Blue Aerodynamic Lightweight Coupe) ===
    const bluePaint = new THREE.MeshStandardMaterial({ name: 'faded-blue-paint', color: 0x507d92, roughness: 0.32, metalness: 0.05 });
    const whiteStripe = new THREE.MeshStandardMaterial({ name: 'white-stripe', color: 0xefe1c6, roughness: 0.5 });

    // Sleek rounded teardrop body
    const mainHull = new THREE.CylinderGeometry(0.82, 0.80, 3.4, 16);
    mainHull.rotateX(Math.PI / 2);
    addMesh(mainHull, bluePaint, 'tech-hull', body, [0, 0.44, 0], [0, 0, 0], [0.96, 0.42, 1.0]);

    // Sloping front nose
    const noseGeom = new THREE.ConeGeometry(0.80, 1.25, 16);
    noseGeom.rotateX(-Math.PI / 2);
    addMesh(noseGeom, bluePaint, 'tech-nose', body, [0, 0.44, 1.6], [0, 0, 0], [0.92, 0.38, 0.7]);

    // Rounded roof
    const roofGeom = new THREE.SphereGeometry(0.72, 16, 12);
    addMesh(roofGeom, bluePaint, 'tech-roof', body, [0, 0.72, -0.22], [0, 0, 0], [0.82, 0.48, 1.5]);

    // Sloping teardrop glass
    const glassCone = new THREE.ConeGeometry(0.68, 1.8, 14);
    glassCone.rotateX(Math.PI / 2);
    addMesh(glassCone, glass, 'tech-fastback-glass', body, [0, 0.74, -0.45], [0, 0, 0], [0.82, 0.36, 0.95]);

    // White center racing stripe
    addMesh(new THREE.BoxGeometry(0.24, 0.02, 3.2), whiteStripe, 'tech-stripe', body, [0, 0.72, 0.3]);
    addMesh(new THREE.BoxGeometry(0.24, 0.02, 1.4), whiteStripe, 'tech-stripe-roof', body, [0, 1.02, -0.2]);

    // Classic teardrop front headlamps with clear fairings
    const techHeadlamp = new THREE.SphereGeometry(0.12, 12, 10);
    for (const side of [-1, 1]) {
      addMesh(techHeadlamp, headlampGlass, `tech-lamp-${side}`, body, [side * 0.52, 0.46, 1.72], [-0.25, side * 0.15, 0]);
      // Small round rear lamps
      const rLamp = new THREE.CylinderGeometry(0.065, 0.065, 0.04, 12);
      rLamp.rotateX(Math.PI / 2);
      addMesh(rLamp, tailLampRed, `tech-tail-${side}`, body, [side * 0.44, 0.48, -1.72]);
    }
    // Number #7 on cream roundel
    const roundel = new THREE.CylinderGeometry(0.26, 0.26, 0.02, 16);
    roundel.rotateZ(Math.PI / 2);
    addMesh(roundel, creamMat, 'roundel-l', body, [-0.80, 0.46, 0.1]);
    addMesh(roundel, creamMat, 'roundel-r', body, [0.80, 0.46, 0.1]);

  } else {
    // === RIVAL 3: DEFENDER (Forest Green Classic Rally Saloon) ===
    const greenPaint = new THREE.MeshStandardMaterial({ name: 'forest-green-paint', color: 0x53694c, roughness: 0.38, metalness: 0.05 });
    const greenDark = new THREE.MeshStandardMaterial({ name: 'green-shade', color: 0x3d4e37, roughness: 0.45 });

    // Upright three-box rally saloon body
    addMesh(new THREE.BoxGeometry(1.64, 0.54, 3.65), greenPaint, 'defender-hull', body, [0, 0.44, 0]);
    // Upright saloon cabin
    addMesh(new THREE.BoxGeometry(1.38, 0.52, 1.75), greenPaint, 'defender-cabin', body, [0, 0.94, -0.15]);

    // Upright front windshield & rear screen
    addMesh(new THREE.BoxGeometry(1.32, 0.46, 0.04), glass, 'defender-windshield', body, [0, 0.92, 0.68], [-0.38, 0, 0]);
    addMesh(new THREE.BoxGeometry(1.30, 0.46, 0.04), glass, 'defender-rear-glass', body, [0, 0.92, -0.98], [0.38, 0, 0]);
    addMesh(new THREE.BoxGeometry(0.04, 0.36, 1.45), glass, 'defender-side-glass-l', body, [-0.68, 0.92, -0.15]);
    addMesh(new THREE.BoxGeometry(0.04, 0.36, 1.45), glass, 'defender-side-glass-r', body, [0.68, 0.92, -0.15]);

    // Flared boxy rally arches
    const boxArch = new THREE.BoxGeometry(0.12, 0.28, 0.72);
    for (const side of [-1, 1]) {
      addMesh(boxArch, greenDark, `fender-flare-f-${side}`, body, [side * 0.84, 0.40, 1.12]);
      addMesh(boxArch, greenDark, `fender-flare-r-${side}`, body, [side * 0.84, 0.40, -1.14]);
    }

    // Classic wide chrome front horizontal grille & bumper
    addMesh(new THREE.BoxGeometry(1.52, 0.28, 0.06), darkInterior, 'def-grille', body, [0, 0.45, 1.84]);
    const defBumper = new THREE.CapsuleGeometry(0.045, 1.58, 4, 8);
    defBumper.rotateZ(Math.PI / 2);
    addMesh(defBumper, chrome, 'def-front-bumper', body, [0, 0.26, 1.88]);
    addMesh(defBumper, chrome, 'def-rear-bumper', body, [0, 0.26, -1.86]);

    // Round headlamps
    const defHeadlamp = new THREE.CylinderGeometry(0.10, 0.10, 0.04, 12);
    defHeadlamp.rotateX(Math.PI / 2);
    for (const side of [-1, 1]) {
      addMesh(defHeadlamp, headlampGlass, `def-lamp-${side}`, body, [side * 0.58, 0.48, 1.86]);
      // Vertical rear tail lamp cluster
      const rTail = new THREE.BoxGeometry(0.14, 0.28, 0.04);
      addMesh(rTail, tailLampRed, `def-tail-${side}`, body, [side * 0.62, 0.48, -1.84]);
    }
    // Number #4 on cream door roundel
    const roundel = new THREE.CylinderGeometry(0.28, 0.28, 0.02, 16);
    roundel.rotateZ(Math.PI / 2);
    addMesh(roundel, creamMat, 'roundel-l', body, [-0.83, 0.48, 0.05]);
    addMesh(roundel, creamMat, 'roundel-r', body, [0.83, 0.48, 0.05]);
  }

  // --- Articulated Wheels ---
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
