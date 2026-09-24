export default function createEnvironmentCandidateA(THREE) {
  const root = new THREE.Group();
  root.name = 'analog-festival-environment-candidate-a';

  const mat = (name, color, roughness = 0.88) => new THREE.MeshStandardMaterial({
    name,
    color,
    roughness,
    metalness: 0,
  });
  const cream = mat('sun-faded-cream', 0xefe1c6, 0.82);
  const orange = mat('sun-faded-orange', 0xc86845, 0.78);
  const ochre = mat('straw-ochre', 0xd5a23b, 0.96);
  const forest = mat('forest-foliage', 0x53694c, 0.94);
  const sage = mat('dusty-sage-foliage', 0x849077, 0.95);
  const blue = mat('faded-blue-cloth', 0x507d92, 0.86);
  const stone = mat('warm-stone', 0xa88869, 0.98);
  const stoneDark = mat('earth-shadow-stone', 0x79533f, 1);
  const timber = mat('sun-dried-timber', 0x79533f, 0.91);
  const timberLight = mat('worn-timber-face', 0xa88869, 0.88);
  const charcoal = mat('asphalt-charcoal', 0x343537, 0.94);

  const box = (group, name, size, position, material, rotation = [0, 0, 0]) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
    mesh.name = name;
    mesh.position.set(...position);
    mesh.rotation.set(...rotation);
    group.add(mesh);
    return mesh;
  };
  const cylinder = (group, name, radii, height, position, material, sides = 12, rotation = [0, 0, 0]) => {
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radii[0], radii[1], height, sides), material);
    mesh.name = name;
    mesh.position.set(...position);
    mesh.rotation.set(...rotation);
    group.add(mesh);
    return mesh;
  };
  const sphere = (group, name, position, scale, material, segments = 12) => {
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(1, segments, Math.max(8, segments - 4)), material);
    mesh.name = name;
    mesh.position.set(...position);
    mesh.scale.set(...scale);
    group.add(mesh);
    return mesh;
  };
  const finalize = (group, parts) => {
    group.userData.parts = parts;
    group.userData.assetContract = { units: 'metres', groundY: 0, forward: '+Z' };
    root.add(group);
    return group;
  };

  // A compact, asymmetric marshal hut: plaster mass, timber feet and a deep cloth shade.
  const hut = new THREE.Group();
  hut.name = 'marshal-hut';
  hut.position.set(-9, 0, -2.55);
  const hutBody = box(hut, 'plaster-cabin', [2.15, 1.65, 1.55], [0, 1.08, 0], cream);
  const hutRoof = box(hut, 'orange-canopy-roof', [2.55, 0.16, 2.0], [0.08, 2.27, -0.03], orange, [0, 0, -0.055]);
  const hutWindow = box(hut, 'cool-front-opening', [1.28, 0.62, 0.08], [0, 1.38, 0.814], blue);
  const hutDeck = box(hut, 'timber-deck', [2.4, 0.16, 0.6], [0, 0.28, 0.86], timberLight);
  const hutPosts = [-0.88, 0.88].map((x, index) => box(hut, `hut-post-${index + 1}`, [0.13, 2.34, 0.13], [x, 1.17, 0.67], timber));
  finalize(hut, { body: hutBody, roof: hutRoof, window: hutWindow, deck: hutDeck, posts: hutPosts });

  // Timber safety barrier: broad tactile rail with slightly irregular supports.
  const barrier = new THREE.Group();
  barrier.name = 'timber-safety-barrier';
  barrier.position.set(-3.3, 0, -2.55);
  const barrierRail = box(barrier, 'rounded-main-rail', [3.05, 0.34, 0.26], [0, 0.67, 0], timberLight, [0, 0, 0.018]);
  const barrierLower = box(barrier, 'shadow-rail', [2.9, 0.2, 0.22], [0.03, 0.34, -0.035], timber);
  const barrierPosts = [-1.22, 0.08, 1.28].map((x, index) => box(barrier, `barrier-post-${index + 1}`, [0.2, 0.9, 0.28], [x, 0.45, -0.02], index === 1 ? timberLight : timber, [0, 0, index === 0 ? -0.035 : 0.025]));
  finalize(barrier, { mainRail: barrierRail, lowerRail: barrierLower, posts: barrierPosts });

  // Soft barrier with rolled straw ends and two restrained tying bands.
  const bale = new THREE.Group();
  bale.name = 'hay-bale-soft-barrier';
  bale.position.set(1.1, 0, -2.55);
  const baleCore = box(bale, 'pressed-straw-mass', [0.9, 0.46, 0.52], [0, 0.23, 0], ochre);
  const baleEnds = [-1, 1].map((side) => cylinder(bale, `rolled-end-${side < 0 ? 'left' : 'right'}`, [0.23, 0.23], 0.045, [side * 0.46, 0.23, 0], ochre, 14, [0, 0, Math.PI / 2]));
  const baleBands = [-0.22, 0.22].map((x, index) => box(bale, `binding-band-${index + 1}`, [0.045, 0.485, 0.535], [x, 0.24, 0], timber));
  finalize(bale, { core: baleCore, ends: baleEnds, bands: baleBands });

  // Cloth canopy uses opaque layered planes with timber poles—no expensive transparency.
  const canopy = new THREE.Group();
  canopy.name = 'spectator-canopy';
  canopy.position.set(6.4, 0, -2.35);
  const canopyTop = box(canopy, 'cream-cloth-top', [4.7, 0.12, 3.05], [0, 2.62, 0], cream, [0.04, 0, 0.035]);
  const canopyValance = box(canopy, 'orange-front-valance', [4.72, 0.3, 0.08], [0, 2.46, 1.51], orange, [0, 0, 0.025]);
  const canopyPosts = [[-2.12, -1.28], [2.12, -1.28], [-2.12, 1.28], [2.12, 1.28]].map(([x, z], index) => cylinder(canopy, `canopy-pole-${index + 1}`, [0.055, 0.065], 2.6, [x, 1.3, z], timber, 10));
  const benches = [-0.55, 0.45].map((z, index) => box(canopy, `spectator-bench-${index + 1}`, [3.35, 0.18, 0.42], [0, 0.53, z], timberLight));
  finalize(canopy, { cloth: canopyTop, valance: canopyValance, poles: canopyPosts, benches });

  // Scalloped crown silhouette: several overlapping opaque leaf masses over a tapered trunk.
  const tree = new THREE.Group();
  tree.name = 'roadside-tree';
  tree.position.set(-9, 0, 1.55);
  const trunk = cylinder(tree, 'tapered-tree-trunk', [0.24, 0.36], 3.05, [0, 1.525, 0], timber, 10);
  const branchA = cylinder(tree, 'left-branch', [0.11, 0.16], 1.8, [-0.42, 2.55, 0], timber, 8, [0, 0, -0.47]);
  const branchB = cylinder(tree, 'right-branch', [0.1, 0.15], 1.65, [0.48, 2.72, -0.08], timber, 8, [0.08, 0, 0.52]);
  const crownData = [
    [-0.72, 4.05, 0, 1.18, 1.08, 0.92, sage],
    [0.55, 4.3, -0.1, 1.3, 1.16, 1.0, forest],
    [0.02, 4.82, 0.08, 1.25, 1.1, 0.95, sage],
    [1.0, 4.9, 0.1, 0.78, 0.72, 0.72, forest],
    [-0.98, 4.72, -0.1, 0.72, 0.66, 0.68, forest],
  ];
  const crowns = crownData.map((c, index) => sphere(tree, `scalloped-crown-${index + 1}`, c.slice(0, 3), c.slice(3, 6), c[6], 12));
  finalize(tree, { trunk, branches: [branchA, branchB], crowns });

  // Layered, offset stone masses imply weathering without noisy surface greebles.
  const rock = new THREE.Group();
  rock.name = 'rock-formation';
  rock.position.set(-4.4, 0, 1.25);
  const rockMasses = [
    [-0.65, 0.72, 0, 1.25, 0.72, 0.92, stone],
    [0.58, 0.98, -0.16, 1.08, 0.98, 0.8, stoneDark],
    [0.1, 1.48, 0.08, 0.92, 0.76, 0.66, stone],
    [1.12, 0.42, 0.24, 0.65, 0.42, 0.72, stone],
  ].map((c, index) => sphere(rock, `weathered-rock-${index + 1}`, c.slice(0, 3), c.slice(3, 6), c[6], 8));
  finalize(rock, { masses: rockMasses });

  // A practical open paddock bay with cream rear wall and timber sun shade.
  const paddock = new THREE.Group();
  paddock.name = 'paddock-structure';
  paddock.position.set(0.2, 0, 1.65);
  const paddockFloor = box(paddock, 'paddock-floor', [5.25, 0.14, 3.7], [0, 0.07, 0], stone);
  const paddockWall = box(paddock, 'cream-rear-wall', [5.25, 2.72, 0.18], [0, 1.43, -1.76], cream);
  const paddockRoof = box(paddock, 'faded-blue-roof', [5.42, 0.16, 3.9], [0, 3.0, 0], blue, [0, 0, -0.035]);
  const paddockPosts = [-2.35, 2.35].map((x, index) => box(paddock, `front-post-${index + 1}`, [0.15, 2.92, 0.15], [x, 1.46, 1.68], timber));
  const workbench = box(paddock, 'timber-workbench', [2.2, 0.66, 0.62], [-0.7, 0.4, -1.15], timberLight);
  finalize(paddock, { floor: paddockFloor, wall: paddockWall, roof: paddockRoof, posts: paddockPosts, workbench });

  // Village module: sun-warmed plaster with an offset shallow roof and shaded arcade.
  const village = new THREE.Group();
  village.name = 'village-building-module';
  village.position.set(7.9, 0, 1.25);
  const villageMain = box(village, 'whitewashed-main-mass', [4.45, 3.6, 3.0], [0, 1.8, 0], cream);
  const villageWing = box(village, 'warm-stone-side-wing', [1.6, 2.45, 2.5], [-2.15, 1.225, -0.18], stone);
  const villageRoof = box(village, 'sun-faded-roof', [4.8, 0.26, 3.36], [0.05, 3.78, 0], orange, [0, 0, -0.04]);
  const doorway = box(village, 'deep-shade-doorway', [0.86, 1.78, 0.09], [-0.75, 0.89, 1.545], charcoal);
  const shutter = box(village, 'faded-blue-shutter', [0.82, 1.02, 0.08], [0.92, 2.1, 1.55], blue);
  const shadeBeam = box(village, 'timber-shade-beam', [3.4, 0.16, 0.16], [0.35, 2.78, 1.78], timber);
  finalize(village, { main: villageMain, wing: villageWing, roof: villageRoof, doorway, shutter, shadeBeam });

  // Finish landmark is intentionally timber-and-cloth: an event structure, never a sci-fi gate.
  const finish = new THREE.Group();
  finish.name = 'festival-finish-landmark';
  finish.position.set(10.25, 0, -1.45);
  const finishPosts = [-1.7, 1.7].map((x, index) => box(finish, `finish-post-${index + 1}`, [0.26, 5.75, 0.34], [x, 2.875, 0], timber));
  const finishBeam = box(finish, 'finish-crossbeam', [3.72, 0.34, 0.38], [0, 5.47, 0], timberLight);
  const finishCloth = box(finish, 'cream-finish-cloth', [2.95, 0.78, 0.09], [0, 4.74, 0.23], cream, [0, 0, 0.025]);
  const finishAccent = box(finish, 'orange-cloth-band', [2.95, 0.18, 0.105], [0, 4.46, 0.24], orange);
  const flagA = box(finish, 'left-ochre-flag', [0.92, 0.58, 0.07], [-1.2, 5.12, 0.24], ochre, [0, 0, -0.09]);
  const flagB = box(finish, 'right-blue-flag', [0.92, 0.58, 0.07], [1.18, 5.08, 0.24], blue, [0, 0, 0.07]);
  finalize(finish, { posts: finishPosts, beam: finishBeam, cloth: finishCloth, accent: finishAccent, flags: [flagA, flagB] });

  root.userData.parts = {
    marshalHut: hut,
    timberBarrier: barrier,
    hayBale: bale,
    spectatorCanopy: canopy,
    roadsideTree: tree,
    rockFormation: rock,
    paddockStructure: paddock,
    villageModule: village,
    finishLandmark: finish,
  };
  root.userData.assetContract = {
    units: 'metres',
    groundY: 0,
    forward: '+Z',
    keepHierarchy: true,
  };
  return root;
}
