// ROAD//ZERO rescue player candidate C — layered fastback shell.
// Authored entirely from Three.js primitives; dimensions are metres, front is +Z.
export default function createPlayerCandidateC(THREE) {
  const root = new THREE.Group();
  root.name = 'player-c-layered-fastback';

  const paint = new THREE.MeshPhysicalMaterial({
    name: 'player-red-enamel', color: 0xd74b3f, roughness: 0.3, metalness: 0,
    clearcoat: 0.38, clearcoatRoughness: 0.24,
  });
  const paintShade = new THREE.MeshStandardMaterial({
    name: 'player-red-lower', color: 0xa93631, roughness: 0.42, metalness: 0,
  });
  const glass = new THREE.MeshPhysicalMaterial({
    name: 'smoked-glass', color: 0x3e5158, roughness: 0.2, metalness: 0,
    transparent: true, opacity: 0.82, depthWrite: true,
  });
  const tyre = new THREE.MeshStandardMaterial({ name: 'rubber', color: 0x202221, roughness: 0.92 });
  const wheelMetal = new THREE.MeshStandardMaterial({ name: 'wheel-alloy', color: 0x77756c, roughness: 0.5, metalness: 0.35 });
  const dark = new THREE.MeshStandardMaterial({ name: 'grille-and-interior', color: 0x272b2a, roughness: 0.82 });
  const cream = new THREE.MeshStandardMaterial({ name: 'cream-roundel', color: 0xefe1c6, roughness: 0.7 });
  const lampRed = new THREE.MeshStandardMaterial({ name: 'tail-lamp', color: 0x8f211d, emissive: 0x4a0907, emissiveIntensity: 0.22, roughness: 0.38 });
  const lampWarm = new THREE.MeshStandardMaterial({ name: 'head-lamp', color: 0xf0d7a2, roughness: 0.28 });

  const body = new THREE.Group();
  body.name = 'articulated-body';
  root.add(body);

  const ellipsoid = (name, scale, position, material, segments = 32) => {
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.5, segments, Math.max(12, segments / 2)), material);
    mesh.name = name;
    mesh.scale.set(...scale);
    mesh.position.set(...position);
    body.add(mesh);
    return mesh;
  };

  // Low central tub, long bonnet and a separate rear deck establish a coherent shell.
  ellipsoid('lower-body', [1.48, 0.52, 3.38], [0, 0.58, 0.02], paint);
  ellipsoid('front-bonnet', [1.38, 0.34, 1.72], [0, 0.78, 1.03], paint);
  ellipsoid('rear-deck', [1.5, 0.43, 1.46], [0, 0.79, -1.22], paint);
  ellipsoid('front-valance', [1.3, 0.32, 0.64], [0, 0.43, 1.66], paintShade, 24);
  ellipsoid('rear-valance', [1.42, 0.38, 0.6], [0, 0.47, -1.66], paintShade, 24);

  // Four proud fender volumes flow over the tyres rather than enclosing them in boxes.
  const axleZ = 1.22;
  for (const z of [-axleZ, axleZ]) {
    for (const x of [-0.55, 0.55]) {
      ellipsoid(`${z > 0 ? 'front' : 'rear'}-${x > 0 ? 'left' : 'right'}-fender`, [0.62, 0.68, 1.02], [x, 0.57, z], paint, 24);
    }
  }

  // Fastback cabin: an opaque under-shell supports inset glass volumes and a thin roof crown.
  ellipsoid('cabin-under-shell', [1.18, 0.83, 1.83], [0, 0.92, -0.28], paint, 32);
  ellipsoid('greenhouse', [1.04, 0.68, 1.56], [0, 1.0, -0.22], glass, 32);
  ellipsoid('roof-crown', [1.02, 0.16, 1.3], [0, 1.26, -0.29], paint, 28);

  // A body-colour spine separates front and rear glazing without futuristic trim.
  const spine = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.5, 0.11), paintShade);
  spine.name = 'windscreen-spine';
  spine.position.set(0, 1.05, -0.32);
  spine.rotation.x = -0.12;
  body.add(spine);

  // Simple analog face and tail details.
  for (const x of [-0.48, 0.48]) {
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.115, 20, 12), lampWarm);
    head.name = 'round-headlamp';
    head.scale.z = 0.32;
    head.position.set(x, 0.66, 1.917);
    body.add(head);
    const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.105, 0.105, 0.035, 20), lampRed);
    tail.name = 'round-tail-lamp';
    tail.rotation.x = Math.PI / 2;
    tail.position.set(x, 0.65, -1.924);
    body.add(tail);
  }
  const grille = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.16, 0.035), dark);
  grille.name = 'lower-air-intake';
  grille.position.set(0, 0.36, 1.94);
  body.add(grille);

  // Blank cream roundels supply period race character without text or logos.
  for (const side of [-1, 1]) {
    const disk = new THREE.Mesh(new THREE.CircleGeometry(0.29, 32), cream);
    disk.name = 'blank-number-roundel';
    disk.rotation.y = side * Math.PI / 2;
    disk.position.set(side * 0.756, 0.75, 0.2);
    body.add(disk);
  }

  function makeWheel(name, x, z, steerable) {
    const pivot = new THREE.Group();
    pivot.name = `${name}-pivot`;
    pivot.position.set(x, 0.3, z);
    const rolling = new THREE.Group();
    rolling.name = `${name}-rolling`;
    const rubber = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.24, 28, 1), tyre);
    rubber.name = `${name}-tyre`;
    rubber.rotation.z = Math.PI / 2;
    rolling.add(rubber);
    for (const side of [-1, 1]) {
      const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.19, 0.012, 20), wheelMetal);
      rim.name = `${name}-rim`;
      rim.rotation.z = Math.PI / 2;
      rim.position.x = side * 0.126;
      rolling.add(rim);
    }
    pivot.add(rolling);
    pivot.userData.steerable = steerable;
    pivot.userData.rolling = rolling;
    root.add(pivot);
    return pivot;
  }

  const wheelFL = makeWheel('wheelFL', -0.74, axleZ, true);
  const wheelFR = makeWheel('wheelFR', 0.74, axleZ, true);
  const wheelRL = makeWheel('wheelRL', -0.74, -axleZ, false);
  const wheelRR = makeWheel('wheelRR', 0.74, -axleZ, false);

  root.userData.parts = { wheelFL, wheelFR, wheelRL, wheelRR, body };
  root.userData.asset = {
    name: 'player-c-layered-fastback', front: '+Z', units: 'metres',
    strategy: 'overlapping sculpted shell volumes with articulated wheel pivots',
  };
  return root;
}
