export default function generate(THREE) {
  const car = new THREE.Group();
  car.name = 'playerProfileCoupeB';

  const enamel = new THREE.MeshPhysicalMaterial({
    name: 'playerRedEnamel', color: 0xd74b3f, roughness: 0.3, metalness: 0,
    clearcoat: 0.48, clearcoatRoughness: 0.25,
  });
  const enamelShade = new THREE.MeshStandardMaterial({ name: 'playerRedLower', color: 0xa93631, roughness: 0.46, metalness: 0 });
  const glass = new THREE.MeshPhysicalMaterial({
    name: 'smokedGlass', color: 0x39484c, roughness: 0.18, metalness: 0,
    transparent: true, opacity: 0.78, depthWrite: true,
  });
  const rubber = new THREE.MeshStandardMaterial({ name: 'tyreRubber', color: 0x252626, roughness: 0.92, metalness: 0 });
  const rim = new THREE.MeshStandardMaterial({ name: 'warmAlloy', color: 0x8a8171, roughness: 0.5, metalness: 0.48 });
  const cream = new THREE.MeshStandardMaterial({ name: 'creamRoundel', color: 0xefe1c6, roughness: 0.6, metalness: 0 });
  const lamp = new THREE.MeshStandardMaterial({ name: 'warmTailLamp', color: 0x8d251f, roughness: 0.38, emissive: 0x48100c, emissiveIntensity: 0.35 });
  const dark = new THREE.MeshStandardMaterial({ name: 'underbody', color: 0x353a3b, roughness: 0.84, metalness: 0 });

  const sideExtrusion = (name, points, width, material, y = 0) => {
    const shape = new THREE.Shape();
    shape.moveTo(points[0][0], points[0][1]);
    for (let i = 1; i < points.length; i += 1) shape.lineTo(points[i][0], points[i][1]);
    shape.closePath();
    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth: width, bevelEnabled: true, bevelSegments: 3, bevelSize: 0.018, bevelThickness: 0.018, curveSegments: 5,
    });
    geometry.rotateY(Math.PI / 2);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = name;
    mesh.position.set(-width / 2, y, 0);
    return mesh;
  };

  const body = new THREE.Group();
  body.name = 'body';
  car.add(body);

  // The side profile supplies the fastback mass; its shaped shoulders replace stacked boxes.
  body.add(sideExtrusion('mainFastbackBody', [
    [-1.93, 0.20], [-1.86, 0.38], [-1.60, 0.54], [-1.32, 0.61],
    [-0.82, 0.64], [-0.32, 0.69], [0.32, 0.68], [0.88, 0.62],
    [1.42, 0.57], [1.78, 0.47], [1.93, 0.30], [1.90, 0.16],
    [1.38, 0.12], [-1.48, 0.12],
  ], 1.67, enamel, 0.29));

  body.add(sideExtrusion('lowerValance', [
    [-1.84, 0.03], [-1.76, 0.18], [-1.24, 0.24], [1.42, 0.22],
    [1.84, 0.15], [1.87, 0.03],
  ], 1.55, enamelShade, 0.27));

  // A separate, narrower profile creates a readable greenhouse and preserves material separation.
  body.add(sideExtrusion('glassHouse', [
    [-0.93, 0.04], [-0.67, 0.35], [-0.34, 0.55], [0.17, 0.62],
    [0.57, 0.56], [0.91, 0.31], [1.02, 0.05],
  ], 1.24, glass, 0.69));

  body.add(sideExtrusion('roofCap', [
    [-0.74, 0.02], [-0.38, 0.17], [0.15, 0.21], [0.57, 0.15], [0.79, 0.02],
  ], 1.29, enamel, 1.105));

  // Plan-profile deck insert narrows toward both overhangs, avoiding slab-like ends.
  const plan = new THREE.Shape();
  plan.moveTo(-0.55, -1.80); plan.quadraticCurveTo(-0.80, -1.35, -0.77, -0.62);
  plan.lineTo(-0.73, 0.94); plan.quadraticCurveTo(-0.68, 1.55, -0.48, 1.82);
  plan.lineTo(0.48, 1.82); plan.quadraticCurveTo(0.68, 1.55, 0.73, 0.94);
  plan.lineTo(0.77, -0.62); plan.quadraticCurveTo(0.80, -1.35, 0.55, -1.80); plan.closePath();
  const deckGeometry = new THREE.ExtrudeGeometry(plan, { depth: 0.055, bevelEnabled: true, bevelSize: 0.014, bevelThickness: 0.014, bevelSegments: 2 });
  deckGeometry.rotateX(Math.PI / 2);
  const deck = new THREE.Mesh(deckGeometry, enamel);
  deck.name = 'shapedPlanDeck';
  deck.position.y = 0.96;
  body.add(deck);

  const roundelGeometry = new THREE.CylinderGeometry(0.27, 0.27, 0.012, 32);
  for (const side of [-1, 1]) {
    const roundel = new THREE.Mesh(roundelGeometry, cream);
    roundel.name = `blankRoundel${side < 0 ? 'L' : 'R'}`;
    roundel.rotation.z = Math.PI / 2;
    roundel.position.set(side * 0.846, 0.72, 0.25);
    body.add(roundel);
  }

  const axleStations = { front: 1.22, rear: -1.20 };
  const wheelParts = {};
  const tyreProfile = [
    new THREE.Vector2(0.225, -0.105), new THREE.Vector2(0.286, -0.085),
    new THREE.Vector2(0.31, -0.035), new THREE.Vector2(0.31, 0.035),
    new THREE.Vector2(0.286, 0.085), new THREE.Vector2(0.225, 0.105),
    new THREE.Vector2(0.205, 0.075), new THREE.Vector2(0.205, -0.075),
  ];
  const tyreGeometry = new THREE.LatheGeometry(tyreProfile, 24);
  tyreGeometry.rotateZ(Math.PI / 2);
  const rimGeometry = new THREE.CylinderGeometry(0.175, 0.175, 0.112, 20, 1, false);
  rimGeometry.rotateZ(Math.PI / 2);

  const addWheel = (key, x, z, steerable) => {
    const pivot = new THREE.Group();
    pivot.name = `${key}${steerable ? 'SteeringPivot' : 'WheelPivot'}`;
    pivot.position.set(x, 0.31, z);
    const roller = new THREE.Group();
    roller.name = `${key}Roll`;
    const tyre = new THREE.Mesh(tyreGeometry, rubber); tyre.name = `${key}Tyre`; roller.add(tyre);
    const hub = new THREE.Mesh(rimGeometry, rim); hub.name = `${key}Rim`; roller.add(hub);
    pivot.add(roller);
    car.add(pivot);
    pivot.userData.steerable = steerable;
    pivot.userData.roller = roller;
    wheelParts[key] = pivot;
  };
  addWheel('wheelFL', -0.75, axleStations.front, true);
  addWheel('wheelFR', 0.75, axleStations.front, true);
  addWheel('wheelRL', -0.75, axleStations.rear, false);
  addWheel('wheelRR', 0.75, axleStations.rear, false);

  const lampGeometry = new THREE.CylinderGeometry(0.105, 0.105, 0.04, 20);
  lampGeometry.rotateX(Math.PI / 2);
  for (const x of [-0.45, 0.45]) {
    const tail = new THREE.Mesh(lampGeometry, lamp);
    tail.position.set(x, 0.63, -1.925);
    tail.name = 'tailLamp';
    body.add(tail);
  }

  const grille = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.13, 0.035), dark);
  grille.name = 'rearCoolingSlot';
  grille.position.set(0, 0.42, -1.936);
  body.add(grille);

  car.userData.parts = {
    body,
    wheelFL: wheelParts.wheelFL,
    wheelFR: wheelParts.wheelFR,
    wheelRL: wheelParts.wheelRL,
    wheelRR: wheelParts.wheelRR,
  };
  car.userData.keepHierarchy = true;
  return car;
}
