export default function createEnvironmentCandidateC(THREE) {
  const root = new THREE.Group();
  root.name = 'analog-festival-environment-c';

  const material = (name, color, roughness = 0.86) => new THREE.MeshStandardMaterial({
    name,
    color,
    roughness,
    metalness: 0,
  });
  const cream = material('sun-faded-cream-plaster', 0xefe1c6, 0.84);
  const orange = material('sun-faded-orange-paint', 0xc86845, 0.78);
  const ochre = material('dry-ochre-fibre', 0xd5a23b, 0.94);
  const forest = material('forest-green-foliage', 0x53694c, 0.96);
  const sage = material('dusty-sage-foliage', 0x849077, 0.95);
  const fadedBlue = material('faded-blue-paint', 0x507d92, 0.82);
  const charcoal = material('asphalt-charcoal', 0x343537, 0.91);
  const stone = material('warm-layered-stone', 0xa88869, 0.98);
  const earth = material('sun-faded-timber', 0x79533f, 0.9);
  const shadow = material('deep-painted-shadow', 0x353a3b, 0.88);

  const addBox = (parent, name, size, position, mat, rotation = [0, 0, 0]) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), mat);
    mesh.name = name;
    mesh.position.set(...position);
    mesh.rotation.set(...rotation);
    parent.add(mesh);
    return mesh;
  };
  const addCylinder = (parent, name, radii, height, position, mat, radial = 12) => {
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radii[0], radii[1], height, radial), mat);
    mesh.name = name;
    mesh.position.set(...position);
    parent.add(mesh);
    return mesh;
  };
  const addSphere = (parent, name, position, scale, mat, segments = 12) => {
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(1, segments, 8), mat);
    mesh.name = name;
    mesh.position.set(...position);
    mesh.scale.set(...scale);
    parent.add(mesh);
    return mesh;
  };
  const asset = (name, x, z = 0) => {
    const group = new THREE.Group();
    group.name = name;
    group.position.set(x, 0, z);
    root.add(group);
    return group;
  };

  // An open-front marshal hut: frame, inset panels and layered roof communicate its build.
  const marshalHut = asset('marshal-hut', -10.5, -1.35);
  const hutFloor = addBox(marshalHut, 'hut-raised-floor', [2.15, 0.16, 1.65], [0, 0.18, 0], earth);
  const hutPosts = [];
  for (const x of [-0.96, 0.96]) {
    for (const z of [-0.7, 0.7]) hutPosts.push(addBox(marshalHut, 'hut-timber-post', [0.13, 2.15, 0.13], [x, 1.28, z], earth));
  }
  const hutBack = addBox(marshalHut, 'hut-cream-back-panel', [1.85, 1.55, 0.1], [0, 1.22, -0.69], cream);
  const hutRail = addBox(marshalHut, 'hut-orange-front-rail', [1.92, 0.22, 0.13], [0, 0.92, 0.71], orange);
  const hutRoof = addBox(marshalHut, 'hut-overhanging-roof', [2.45, 0.16, 1.95], [0, 2.43, -0.03], fadedBlue, [0.025, 0, -0.045]);
  marshalHut.userData.parts = { hutFloor, hutPosts, hutBack, hutRail, hutRoof };

  // Timber safety barrier uses visible rails, posts and diagonal rear braces.
  const timberBarrier = asset('timber-safety-barrier', -8.0, 2.45);
  const barrierPosts = [];
  for (const x of [-1.22, 0, 1.22]) {
    barrierPosts.push(addBox(timberBarrier, 'barrier-post', [0.16, 0.9, 0.18], [x, 0.45, 0], earth));
  }
  const upperRail = addBox(timberBarrier, 'barrier-upper-rail', [2.75, 0.2, 0.16], [0, 0.76, 0.03], cream);
  const lowerRail = addBox(timberBarrier, 'barrier-lower-rail', [2.75, 0.18, 0.16], [0, 0.42, 0.03], orange);
  const barrierBrace = addBox(timberBarrier, 'barrier-rear-brace', [2.45, 0.12, 0.12], [0, 0.37, -0.31], earth, [0, 0, 0.2]);
  timberBarrier.userData.parts = { barrierPosts, upperRail, lowerRail, barrierBrace };

  // Compressed bale with crossing twine and subtly uneven end caps.
  const hayBale = asset('hay-bale-soft-barrier', -6.2, -2.25);
  const baleCore = addBox(hayBale, 'compressed-hay-core', [0.9, 0.46, 0.52], [0, 0.23, 0], ochre);
  const baleEndA = addBox(hayBale, 'rough-hay-end-a', [0.05, 0.42, 0.48], [-0.46, 0.23, 0], cream, [0.02, 0, 0.01]);
  const baleEndB = addBox(hayBale, 'rough-hay-end-b', [0.05, 0.42, 0.48], [0.46, 0.23, 0], cream, [-0.02, 0, -0.01]);
  const baleTwine = [];
  for (const x of [-0.24, 0.24]) baleTwine.push(addBox(hayBale, 'bale-twine', [0.025, 0.49, 0.54], [x, 0.24, 0], earth));
  hayBale.userData.parts = { baleCore, baleEndA, baleEndB, baleTwine };

  // Cloth canopy is intentionally asymmetric, with an exposed timber frame and two colour fields.
  const spectatorCanopy = asset('spectator-canopy', -3.3, 1.55);
  const canopyPosts = [];
  for (const x of [-2.05, 2.05]) {
    for (const z of [-1.25, 1.25]) canopyPosts.push(addBox(spectatorCanopy, 'canopy-timber-post', [0.11, 2.45, 0.11], [x, 1.225, z], earth));
  }
  const canopyBeams = [
    addBox(spectatorCanopy, 'canopy-front-beam', [4.3, 0.12, 0.12], [0, 2.4, 1.25], earth),
    addBox(spectatorCanopy, 'canopy-back-beam', [4.3, 0.12, 0.12], [0, 2.4, -1.25], earth),
  ];
  const canopyClothCream = addBox(spectatorCanopy, 'canopy-cream-cloth', [2.3, 0.07, 2.8], [-1.03, 2.57, 0], cream, [0, 0, 0.035]);
  const canopyClothOrange = addBox(spectatorCanopy, 'canopy-orange-cloth', [1.95, 0.07, 2.8], [1.1, 2.5, 0], orange, [0, 0, -0.04]);
  const canopyBench = addBox(spectatorCanopy, 'canopy-spectator-bench', [3.45, 0.22, 0.42], [-0.15, 0.46, -0.42], earth);
  spectatorCanopy.userData.parts = { canopyPosts, canopyBeams, canopyClothCream, canopyClothOrange, canopyBench };

  // Scalloped opaque crowns give the roadside tree a handcrafted silhouette.
  const roadsideTree = asset('roadside-tree', 0, -1.6);
  const trunk = addCylinder(roadsideTree, 'tree-trunk', [0.27, 0.38], 3.0, [0, 1.5, 0], earth, 10);
  const branchA = addBox(roadsideTree, 'tree-branch-a', [0.18, 1.5, 0.18], [-0.34, 2.65, 0], earth, [0, 0, -0.48]);
  const branchB = addBox(roadsideTree, 'tree-branch-b', [0.16, 1.3, 0.16], [0.35, 2.85, 0.05], earth, [0, 0, 0.52]);
  const treeCrowns = [
    addSphere(roadsideTree, 'tree-crown-low', [-0.55, 3.7, 0], [1.05, 0.9, 0.95], sage),
    addSphere(roadsideTree, 'tree-crown-high', [0.2, 4.65, -0.08], [1.12, 1.15, 1.02], forest),
    addSphere(roadsideTree, 'tree-crown-side', [0.82, 3.95, 0.08], [0.8, 0.82, 0.78], sage),
  ];
  roadsideTree.userData.parts = { trunk, branchA, branchB, treeCrowns };

  // Strata are separate warm slabs rather than one generic boulder primitive.
  const rockFormation = asset('layered-rock-formation', 2.45, 2.2);
  const rockLayers = [
    addSphere(rockFormation, 'rock-stratum-low', [0, 0.48, 0], [1.25, 0.48, 0.78], stone, 9),
    addSphere(rockFormation, 'rock-stratum-middle', [-0.16, 0.91, -0.05], [0.93, 0.38, 0.67], earth, 9),
    addSphere(rockFormation, 'rock-stratum-top', [0.18, 1.22, -0.03], [0.63, 0.31, 0.52], stone, 9),
  ];
  rockLayers[0].rotation.y = -0.18;
  rockLayers[1].rotation.y = 0.24;
  rockLayers[2].rotation.y = -0.34;
  rockFormation.userData.parts = { rockLayers };

  // Service bay: a legible portal frame, half-height side wall and shaded work bench.
  const paddockStructure = asset('paddock-structure', 5.0, -1.7);
  const paddockFloor = addBox(paddockStructure, 'paddock-floor', [4.45, 0.12, 3.45], [0, 0.06, 0], stone);
  const paddockPosts = [];
  for (const x of [-2.02, 2.02]) {
    for (const z of [-1.5, 1.5]) paddockPosts.push(addBox(paddockStructure, 'paddock-post', [0.15, 2.9, 0.15], [x, 1.51, z], earth));
  }
  const paddockRoof = addBox(paddockStructure, 'paddock-canvas-roof', [4.55, 0.12, 3.55], [0, 2.98, 0], cream, [0.015, 0, -0.025]);
  const paddockWall = addBox(paddockStructure, 'paddock-blue-side-wall', [0.12, 1.75, 3.1], [-2.01, 0.94, 0], fadedBlue);
  const paddockBench = addBox(paddockStructure, 'paddock-work-bench', [2.5, 0.62, 0.62], [0.48, 0.42, -1.12], earth);
  const paddockCrate = addBox(paddockStructure, 'paddock-parts-crate', [0.68, 0.58, 0.68], [1.46, 0.35, 0.65], orange);
  paddockStructure.userData.parts = { paddockFloor, paddockPosts, paddockRoof, paddockWall, paddockBench, paddockCrate };

  // Village module mixes plaster volumes and a street-facing timber shade frame.
  const villageModule = asset('village-building-module', 8.5, 1.75);
  const villageMain = addBox(villageModule, 'village-main-plaster-volume', [3.35, 3.9, 2.8], [0, 1.95, 0], cream);
  const villageSide = addBox(villageModule, 'village-offset-stone-volume', [1.2, 2.45, 2.95], [1.92, 1.225, -0.05], stone);
  const villageRoof = addBox(villageModule, 'village-sun-faded-roof', [3.65, 0.24, 3.1], [0, 4.06, 0], orange, [0, 0, -0.035]);
  const villageDoor = addBox(villageModule, 'village-deep-door', [0.82, 1.88, 0.08], [-0.72, 0.94, 1.425], shadow);
  const villageShutter = addBox(villageModule, 'village-blue-shutter', [0.92, 1.12, 0.08], [0.75, 2.42, 1.425], fadedBlue);
  const villageAwning = addBox(villageModule, 'village-timber-awning', [2.35, 0.12, 1.0], [0.42, 2.98, 1.82], earth, [-0.12, 0, 0]);
  villageModule.userData.parts = { villageMain, villageSide, villageRoof, villageDoor, villageShutter, villageAwning };

  // Finish landmark is a timber timing gantry with cloth tabs, never a glowing portal.
  const finishLandmark = asset('finish-timing-landmark', 11.0, -1.45);
  const towerLegs = [
    addBox(finishLandmark, 'finish-left-leg', [0.28, 5.55, 0.32], [-0.92, 2.775, 0], earth),
    addBox(finishLandmark, 'finish-right-leg', [0.28, 5.55, 0.32], [0.92, 2.775, 0], earth),
  ];
  const towerCrossbars = [
    addBox(finishLandmark, 'finish-lower-crossbar', [2.15, 0.22, 0.3], [0, 3.72, 0], cream),
    addBox(finishLandmark, 'finish-upper-crossbar', [2.35, 0.28, 0.34], [0, 5.38, 0], orange),
  ];
  const towerBraces = [
    addBox(finishLandmark, 'finish-brace-a', [2.05, 0.13, 0.15], [0, 4.55, 0], earth, [0, 0, 0.67]),
    addBox(finishLandmark, 'finish-brace-b', [2.05, 0.13, 0.15], [0, 4.55, 0], earth, [0, 0, -0.67]),
  ];
  const timingPanel = addBox(finishLandmark, 'blank-charcoal-timing-panel', [1.3, 0.72, 0.12], [0, 4.55, 0.18], charcoal);
  const clothTabs = [
    addBox(finishLandmark, 'finish-cream-cloth-tab', [0.42, 0.78, 0.06], [-0.58, 3.2, 0.2], cream, [0, 0, 0.06]),
    addBox(finishLandmark, 'finish-orange-cloth-tab', [0.42, 0.92, 0.06], [0.58, 3.12, 0.2], orange, [0, 0, -0.05]),
  ];
  finishLandmark.userData.parts = { towerLegs, towerCrossbars, towerBraces, timingPanel, clothTabs };

  root.userData.parts = {
    marshalHut,
    timberBarrier,
    hayBale,
    spectatorCanopy,
    roadsideTree,
    rockFormation,
    paddockStructure,
    villageModule,
    finishLandmark,
  };
  root.userData.assetContract = {
    units: 'metres',
    groundY: 0,
    forward: '+Z',
    keepHierarchy: true,
  };
  return root;
}
