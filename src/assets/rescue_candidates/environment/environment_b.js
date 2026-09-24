export default function generate(THREE) {
  const showcase = new THREE.Group();
  showcase.name = 'analogFestivalEnvironmentCandidateB';

  const material = (name, color, roughness = 0.85) => {
    const value = new THREE.MeshStandardMaterial({ color, roughness, metalness: 0 });
    value.name = name;
    return value;
  };
  const cream = material('sunFadedCream', 0xefe1c6, 0.82);
  const orange = material('sunFadedOrange', 0xc86845, 0.78);
  const ochre = material('dryOchre', 0xd5a23b, 0.93);
  const forest = material('forestGreen', 0x53694c, 0.94);
  const sage = material('dustySage', 0x849077, 0.96);
  const blue = material('fadedBlue', 0x507d92, 0.84);
  const stone = material('warmStone', 0xa88869, 0.98);
  const earth = material('earthBrown', 0x79533f, 0.92);
  const shadow = material('deepShadow', 0x353a3b, 0.9);
  const plasterShade = material('coolPlasterShade', 0xcbbca4, 0.88);

  const mesh = (geometry, mat, name, parent, x = 0, y = 0, z = 0) => {
    const value = new THREE.Mesh(geometry, mat);
    value.name = name;
    value.position.set(x, y, z);
    parent.add(value);
    return value;
  };

  const extruded = (name, points, depth, mat, parent, position, options = {}) => {
    const shape = new THREE.Shape();
    shape.moveTo(points[0][0], points[0][1]);
    for (let index = 1; index < points.length; index += 1) shape.lineTo(points[index][0], points[index][1]);
    shape.closePath();
    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth,
      bevelEnabled: options.bevel !== false,
      bevelSegments: 2,
      bevelSize: options.bevelSize ?? 0.025,
      bevelThickness: options.bevelSize ?? 0.025,
      curveSegments: 4,
    });
    geometry.translate(0, 0, -depth / 2);
    const value = mesh(geometry, mat, name, parent, position[0], position[1], position[2]);
    if (options.rotationY) value.rotation.y = options.rotationY;
    return value;
  };

  const groupAt = (name, x, z) => {
    const value = new THREE.Group();
    value.name = name;
    value.position.set(x, 0, z);
    value.userData.parts = {};
    showcase.add(value);
    return value;
  };

  // Marshal hut: a tiny plaster station with a curved corrugated-looking canopy profile.
  const hut = groupAt('marshalHut', -9.7, -2.15);
  hut.userData.parts.shell = extruded('hutPlasterShell', [
    [-1.18, 0], [1.18, 0], [1.18, 1.92], [0.75, 2.32], [-0.88, 2.32], [-1.18, 1.95],
  ], 1.72, cream, hut, [0, 0, 0]);
  hut.userData.parts.opening = extruded('hutDeepWindow', [
    [-0.72, 0], [0.72, 0], [0.64, 0.72], [-0.64, 0.72],
  ], 0.045, shadow, hut, [0, 1.03, 0.886], { bevelSize: 0.012 });
  const hutRoofCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-1.42, 0, 0), new THREE.Vector3(-0.72, 0.14, 0),
    new THREE.Vector3(0.35, 0.11, 0), new THREE.Vector3(1.42, -0.04, 0),
  ]);
  hut.userData.parts.roof = mesh(new THREE.TubeGeometry(hutRoofCurve, 18, 0.105, 7, false), orange, 'hutCurvedRoofEdge', hut, 0, 2.38, 0.02);
  mesh(new THREE.BoxGeometry(2.75, 0.09, 2.05), orange, 'hutRoofPlane', hut, 0, 2.34, 0);
  mesh(new THREE.CylinderGeometry(0.07, 0.07, 2.1, 10), earth, 'hutFlagPole', hut, 1.02, 3.25, 0.25);

  // Timber barrier: lathed posts and two softened rails, deliberately irregular rather than industrial.
  const barrier = groupAt('timberBarrier', -6.35, -2.15);
  const postProfile = [
    new THREE.Vector2(0.12, 0), new THREE.Vector2(0.15, 0.08), new THREE.Vector2(0.145, 0.76),
    new THREE.Vector2(0.09, 0.91), new THREE.Vector2(0, 0.94),
  ];
  const postGeometry = new THREE.LatheGeometry(postProfile, 9);
  for (const x of [-1.2, 0, 1.2]) mesh(postGeometry, earth, `barrierPost${x}`, barrier, x, 0, 0);
  const railProfile = [[-1.45, 0], [1.42, 0.04], [1.39, 0.23], [-1.38, 0.19]];
  barrier.userData.parts.rails = [
    extruded('lowerTimberRail', railProfile, 0.16, earth, barrier, [0, 0.31, 0.02], { bevelSize: 0.035 }),
    extruded('upperTimberRail', railProfile, 0.16, earth, barrier, [0, 0.66, -0.03], { bevelSize: 0.035 }),
  ];

  // Hay bale: rounded rectangular profile with visible binding straps.
  const bale = groupAt('hayBale', -3.75, -2.15);
  bale.userData.parts.body = extruded('compressedHayBody', [
    [-0.42, 0], [0.42, 0], [0.47, 0.08], [0.47, 0.37], [0.38, 0.46],
    [-0.38, 0.46], [-0.47, 0.37], [-0.47, 0.08],
  ], 0.52, ochre, bale, [0, 0, 0], { bevelSize: 0.04 });
  for (const x of [-0.22, 0.22]) mesh(new THREE.TorusGeometry(0.257, 0.012, 5, 20), earth, 'baleBinding', bale, x, 0.23, 0).rotation.y = Math.PI / 2;

  // Spectator canopy: an asymmetric cloth section swept along a shallow arch.
  const canopy = groupAt('spectatorCanopy', 0, -2.15);
  for (const x of [-2.18, 2.18]) {
    const leg = mesh(new THREE.CylinderGeometry(0.055, 0.07, 2.48, 9), earth, 'canopyTimberLeg', canopy, x, 1.24, 0);
    leg.rotation.z = x < 0 ? -0.035 : 0.035;
  }
  const canopyShape = new THREE.Shape();
  canopyShape.moveTo(-2.4, 0); canopyShape.quadraticCurveTo(-1.1, 0.28, 0.15, 0.16);
  canopyShape.quadraticCurveTo(1.45, 0.02, 2.4, 0.2); canopyShape.lineTo(2.37, 0.34);
  canopyShape.quadraticCurveTo(1.45, 0.15, 0.15, 0.3); canopyShape.quadraticCurveTo(-1.1, 0.42, -2.4, 0.14); canopyShape.closePath();
  const canopyClothGeometry = new THREE.ExtrudeGeometry(canopyShape, { depth: 3.1, bevelEnabled: true, bevelSize: 0.018, bevelThickness: 0.018, bevelSegments: 2, curveSegments: 8 });
  canopyClothGeometry.translate(0, 0, -1.55);
  canopy.userData.parts.cloth = mesh(canopyClothGeometry, cream, 'batteredCreamCanopyCloth', canopy, 0, 2.38, 0);
  mesh(new THREE.BoxGeometry(1.15, 0.06, 3.13), orange, 'canopyOrangePanel', canopy, 0.83, 2.57, 0);

  // Tree: tapered lathed trunk and scalloped opaque crown lobes.
  const tree = groupAt('roadsideTree', 4.45, -2.15);
  const trunkProfile = [
    new THREE.Vector2(0.38, 0), new THREE.Vector2(0.32, 0.45), new THREE.Vector2(0.25, 2.2),
    new THREE.Vector2(0.16, 3.45), new THREE.Vector2(0.04, 3.65),
  ];
  tree.userData.parts.trunk = mesh(new THREE.LatheGeometry(trunkProfile, 11), earth, 'taperedTreeTrunk', tree);
  const crownGeometry = new THREE.SphereGeometry(1, 11, 7);
  const crownLobes = [[0, 4.1, 0, 1.35], [-0.86, 3.78, 0.12, 1.04], [0.84, 3.85, -0.08, 1.13], [-0.32, 4.75, -0.08, 0.94], [0.45, 4.65, 0.16, 0.88]];
  tree.userData.parts.crown = [];
  crownLobes.forEach((entry, index) => {
    const lobe = mesh(crownGeometry, index % 2 ? sage : forest, `scallopedCrown${index}`, tree, entry[0], entry[1], entry[2]);
    lobe.scale.set(entry[3], entry[3] * 0.76, entry[3] * 0.9);
    tree.userData.parts.crown.push(lobe);
  });

  // Rock formation: separate warm strata profiles communicate a worked hillside cut.
  const rock = groupAt('rockFormation', 8.4, -2.15);
  rock.userData.parts.strata = [];
  const strataProfiles = [
    [[-1.42, 0], [1.26, 0], [1.48, 0.45], [0.9, 0.88], [-0.35, 0.78], [-1.5, 0.34]],
    [[-1.08, 0], [1.05, 0], [0.72, 0.68], [-0.2, 1.14], [-0.92, 0.7]],
    [[-0.62, 0], [0.72, 0], [0.43, 0.56], [-0.22, 0.86], [-0.72, 0.43]],
  ];
  strataProfiles.forEach((profile, index) => rock.userData.parts.strata.push(extruded(
    `rockStratum${index}`, profile, 1.65 - index * 0.22, index === 1 ? earth : stone, rock,
    [index * 0.1, index * 0.65, index * -0.06], { bevelSize: 0.08 },
  )));

  // Paddock bay: cloth-roofed service shelter with a shaped back board.
  const paddock = groupAt('paddockStructure', -7.8, 2.15);
  paddock.userData.parts.back = extruded('paddockBackWall', [
    [-2.6, 0], [2.6, 0], [2.6, 2.72], [0.65, 2.98], [-1.75, 2.86], [-2.6, 2.62],
  ], 0.16, plasterShade, paddock, [0, 0, -1.72], { bevelSize: 0.025 });
  for (const x of [-2.38, 2.38]) mesh(new THREE.CylinderGeometry(0.065, 0.085, 2.85, 9), earth, 'paddockPost', paddock, x, 1.425, 1.7);
  const roofProfile = [[-2.72, 0], [-1.35, 0.18], [0.35, 0.12], [2.72, 0.26], [2.72, 0.39], [0.35, 0.26], [-1.35, 0.33], [-2.72, 0.13]];
  paddock.userData.parts.roof = extruded('paddockClothRoof', roofProfile, 3.58, cream, paddock, [0, 2.76, 0], { bevelSize: 0.02 });
  mesh(new THREE.BoxGeometry(1.55, 0.72, 0.66), blue, 'paddockToolChest', paddock, -1.3, 0.36, -1.15);
  mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.2, 16), shadow, 'paddockSpareTyre', paddock, 1.45, 0.31, -1.25).rotation.z = Math.PI / 2;

  // Village module: whitewashed gable house and timber shade balcony.
  const village = groupAt('villageModule', -1.45, 2.15);
  village.userData.parts.house = extruded('whitewashedVillageHouse', [
    [-2.15, 0], [2.15, 0], [2.15, 3.35], [0, 4.75], [-2.15, 3.35],
  ], 3.25, cream, village, [0, 0, 0], { bevelSize: 0.04 });
  village.userData.parts.door = extruded('villageDeepDoor', [[-0.45, 0], [0.45, 0], [0.45, 1.68], [0, 2.02], [-0.45, 1.68]], 0.05, shadow, village, [0.78, 0, 1.65], { bevelSize: 0.015 });
  for (const x of [-1.32, 0.02]) extruded('villageBlueShutter', [[-0.3, 0], [0.3, 0], [0.3, 0.85], [-0.3, 0.85]], 0.045, blue, village, [x, 2.05, 1.66], { bevelSize: 0.012 });
  mesh(new THREE.BoxGeometry(4.62, 0.1, 1.05), earth, 'villageTimberAwning', village, 0, 3.25, 1.75);
  for (const x of [-1.88, 1.88]) mesh(new THREE.CylinderGeometry(0.055, 0.07, 2.2, 9), earth, 'villageAwningPost', village, x, 2.15, 2.14);

  // Finish landmark: cloth-and-timber hill-climb arch, readable by silhouette and colour only.
  const finish = groupAt('finishLandmark', 5.65, 2.15);
  const towerProfile = [[-0.34, 0], [0.34, 0], [0.3, 4.86], [0.18, 5.55], [-0.18, 5.55], [-0.3, 4.86]];
  finish.userData.parts.towers = [
    extruded('finishLeftTimberTower', towerProfile, 0.58, earth, finish, [-2.05, 0, 0], { bevelSize: 0.025 }),
    extruded('finishRightTimberTower', towerProfile, 0.58, earth, finish, [2.05, 0, 0], { bevelSize: 0.025 }),
  ];
  const bannerShape = new THREE.Shape();
  bannerShape.moveTo(-2.2, 0); bannerShape.quadraticCurveTo(-0.65, 0.18, 0, 0.05);
  bannerShape.quadraticCurveTo(0.9, -0.1, 2.2, 0.14); bannerShape.lineTo(2.2, 0.76);
  bannerShape.quadraticCurveTo(0.65, 0.54, 0, 0.69); bannerShape.quadraticCurveTo(-0.9, 0.8, -2.2, 0.62); bannerShape.closePath();
  const bannerGeometry = new THREE.ExtrudeGeometry(bannerShape, { depth: 0.12, bevelEnabled: true, bevelSize: 0.015, bevelThickness: 0.015, bevelSegments: 2, curveSegments: 8 });
  bannerGeometry.translate(0, 0, -0.06);
  finish.userData.parts.banner = mesh(bannerGeometry, orange, 'finishClothBanner', finish, 0, 4.62, 0);
  for (const x of [-1.42, -0.48, 0.48, 1.42]) {
    const pendant = extruded('finishCreamPendant', [[-0.19, 0], [0.19, 0], [0.14, 0.52], [0, 0.78], [-0.14, 0.52]], 0.08, cream, finish, [x, 3.75, 0], { bevelSize: 0.012 });
    pendant.rotation.z = x * 0.025;
  }

  showcase.userData.parts = {
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
  showcase.userData.keepHierarchy = true;
  return showcase;
}
