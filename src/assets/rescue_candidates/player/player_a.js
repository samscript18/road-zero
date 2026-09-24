export default function createPlayerCandidateA(THREE) {
  const root = new THREE.Group();
  root.name = 'player-coupe-candidate-a';

  const paint = new THREE.MeshStandardMaterial({
    name: 'red-enamel',
    color: 0xd74b3f,
    roughness: 0.3,
    metalness: 0,
  });
  const paintShade = new THREE.MeshStandardMaterial({
    name: 'red-enamel-shadow',
    color: 0xa9342f,
    roughness: 0.38,
    metalness: 0,
  });
  const glass = new THREE.MeshStandardMaterial({
    name: 'smoked-glass',
    color: 0x31454a,
    roughness: 0.2,
    metalness: 0,
  });
  const rubber = new THREE.MeshStandardMaterial({
    name: 'tyre-rubber',
    color: 0x292a28,
    roughness: 0.93,
    metalness: 0,
  });
  const wheelMetal = new THREE.MeshStandardMaterial({
    name: 'warm-wheel-metal',
    color: 0x77736a,
    roughness: 0.52,
    metalness: 0.22,
  });
  const cream = new THREE.MeshStandardMaterial({
    name: 'warm-cream',
    color: 0xefe1c6,
    roughness: 0.66,
    metalness: 0,
  });
  const lampRed = new THREE.MeshStandardMaterial({
    name: 'tail-lamp',
    color: 0x8f201d,
    emissive: 0x4a0907,
    emissiveIntensity: 0.22,
    roughness: 0.42,
  });
  const lampAmber = new THREE.MeshStandardMaterial({
    name: 'warm-lamp',
    color: 0xd58a32,
    roughness: 0.32,
  });
  const dark = new THREE.MeshStandardMaterial({
    name: 'deep-shadow',
    color: 0x353a3b,
    roughness: 0.84,
  });

  const sphere = new THREE.SphereGeometry(1, 24, 14);
  const detailSphere = new THREE.SphereGeometry(1, 16, 10);
  const body = new THREE.Group();
  body.name = 'body';
  root.add(body);

  function ellipsoid(name, material, position, scale, geometry = sphere) {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = name;
    mesh.position.set(...position);
    mesh.scale.set(...scale);
    body.add(mesh);
    return mesh;
  }

  // Three overlapping masses create a continuous fastback rather than stacked boxes.
  ellipsoid('lower-body', paint, [0, 0.58, 0], [0.84, 0.48, 1.56]);
  ellipsoid('rounded-nose', paint, [0, 0.56, 1.48], [0.77, 0.39, 0.48]);
  ellipsoid('rounded-tail', paint, [0, 0.61, -1.49], [0.82, 0.43, 0.47]);
  ellipsoid('fastback-glass', glass, [0, 0.98, -0.16], [0.65, 0.36, 1.02]);
  ellipsoid('painted-roof-cap', paint, [0, 1.12, -0.2], [0.57, 0.22, 0.88]);

  // Sculpted shoulders and wheel brows make the body read over the wheels.
  const archGeometry = new THREE.TorusGeometry(0.36, 0.085, 8, 24);
  const axleZ = { front: 1.18, rear: -1.18 };
  for (const z of [axleZ.front, axleZ.rear]) {
    for (const side of [-1, 1]) {
      const arch = new THREE.Mesh(archGeometry, paint);
      arch.name = `${z > 0 ? 'front' : 'rear'}-${side < 0 ? 'left' : 'right'}-wheel-brow`;
      arch.position.set(side * 0.76, 0.42, z);
      arch.rotation.y = Math.PI / 2;
      body.add(arch);
    }
  }

  // Period-style rocker strip and subtle bumpers keep the silhouette grounded.
  const rockerGeometry = new THREE.CapsuleGeometry(0.075, 2.25, 5, 12);
  for (const side of [-1, 1]) {
    const rocker = new THREE.Mesh(rockerGeometry, paintShade);
    rocker.name = `${side < 0 ? 'left' : 'right'}-rocker`;
    rocker.position.set(side * 0.78, 0.27, 0);
    rocker.rotation.x = Math.PI / 2;
    body.add(rocker);
  }

  const bumperGeometry = new THREE.CapsuleGeometry(0.055, 1.15, 5, 12);
  for (const z of [-1.92, 1.92]) {
    const bumper = new THREE.Mesh(bumperGeometry, dark);
    bumper.name = z > 0 ? 'front-bumper' : 'rear-bumper';
    bumper.position.set(0, 0.38, z);
    bumper.rotation.z = Math.PI / 2;
    body.add(bumper);
  }

  // Cream blank roundels are graphic shapes only—no logos or glyphs.
  const roundelGeometry = new THREE.CircleGeometry(0.3, 28);
  for (const side of [-1, 1]) {
    const roundel = new THREE.Mesh(roundelGeometry, cream);
    roundel.name = `${side < 0 ? 'left' : 'right'}-roundel`;
    roundel.position.set(side * 0.843, 0.67, 0.15);
    roundel.rotation.y = side * Math.PI / 2;
    roundel.scale.y = 1.2;
    body.add(roundel);
  }

  function lamp(name, x, y, z, material, radius) {
    const mesh = new THREE.Mesh(detailSphere, material);
    mesh.name = name;
    mesh.position.set(x, y, z);
    mesh.scale.set(radius, radius, 0.045);
    body.add(mesh);
  }
  lamp('headlamp-left', -0.43, 0.65, 1.936, cream, 0.14);
  lamp('headlamp-right', 0.43, 0.65, 1.936, cream, 0.14);
  lamp('indicator-left', -0.65, 0.52, 1.91, lampAmber, 0.075);
  lamp('indicator-right', 0.65, 0.52, 1.91, lampAmber, 0.075);
  lamp('tail-left', -0.43, 0.65, -1.936, lampRed, 0.13);
  lamp('tail-right', 0.43, 0.65, -1.936, lampRed, 0.13);

  function createWheel(name, x, z, steerable) {
    const pivot = new THREE.Group();
    pivot.name = name;
    pivot.position.set(x, 0.31, z);
    pivot.userData.steerable = steerable;

    const tyre = new THREE.Mesh(new THREE.CylinderGeometry(0.31, 0.31, 0.22, 24, 1), rubber);
    tyre.name = `${name}-tyre`;
    tyre.rotation.z = Math.PI / 2;
    pivot.add(tyre);

    const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.232, 12, 1), wheelMetal);
    rim.name = `${name}-rim`;
    rim.rotation.z = Math.PI / 2;
    pivot.add(rim);

    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.245, 12), dark);
    hub.name = `${name}-hub`;
    hub.rotation.z = Math.PI / 2;
    pivot.add(hub);
    root.add(pivot);
    return pivot;
  }

  const wheelFL = createWheel('wheelFL', -0.74, axleZ.front, true);
  const wheelFR = createWheel('wheelFR', 0.74, axleZ.front, true);
  const wheelRL = createWheel('wheelRL', -0.74, axleZ.rear, false);
  const wheelRR = createWheel('wheelRR', 0.74, axleZ.rear, false);

  root.userData.parts = { body, wheelFL, wheelFR, wheelRL, wheelRR };
  root.userData.assetContract = {
    units: 'metres',
    groundY: 0,
    forward: '+Z',
    keepHierarchy: true,
  };
  return root;
}
