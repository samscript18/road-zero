// @ts-nocheck
/**
 * ROAD//ZERO - Festival Hillside Environment Kit (Next-Rated Overhaul)
 * - Start/Finish timber overhead gantry with checkerboard flags & rally banners
 * - Ancient Roman Viaduct / Aqueduct spanning the background gorge
 * - Stacked red/white tire barriers at heavy runoff zones
 * - Terraced dry-stone retaining walls with stone capping
 * - Dense spectator crowd clusters cheering along the walls and canopies
 * - Mediterranean olive trees, Italian cypresses, stone pines
 * - Chevron turn signs & festive pennant bunting
 * - Hillside Italian village with bell tower
 */

export default function createFestivalEnvironment(THREE) {
  const kit = new THREE.Group();
  kit.name = 'festival-environment-kit';

  // --- Palette Materials ---
  const stoneMat = new THREE.MeshStandardMaterial({ name: 'warm-stone', color: 0xa88869, roughness: 0.94 });
  const stoneDark = new THREE.MeshStandardMaterial({ name: 'stone-dark', color: 0x75604b, roughness: 0.96 });
  const timberMat = new THREE.MeshStandardMaterial({ name: 'weathered-timber', color: 0x6e4e37, roughness: 0.88 });
  const timberPost = new THREE.MeshStandardMaterial({ name: 'timber-post', color: 0x543b27, roughness: 0.92 });
  const strawMat = new THREE.MeshStandardMaterial({ name: 'golden-straw', color: 0xd5a23b, roughness: 0.92 });
  const ropeMat = new THREE.MeshStandardMaterial({ name: 'bale-rope', color: 0x3d3024, roughness: 0.85 });
  const canvasCream = new THREE.MeshStandardMaterial({ name: 'canvas-cream', color: 0xefe1c6, roughness: 0.85 });
  const canvasOrange = new THREE.MeshStandardMaterial({ name: 'canvas-orange', color: 0xc86845, roughness: 0.82 });
  const oliveFoliage = new THREE.MeshStandardMaterial({ name: 'olive-leaves', color: 0x768565, roughness: 0.92 });
  const cypressFoliage = new THREE.MeshStandardMaterial({ name: 'cypress-green', color: 0x3a4f3b, roughness: 0.95 });
  const deepGreen = new THREE.MeshStandardMaterial({ name: 'deep-foliage', color: 0x475b42, roughness: 0.94 });
  const trunkMat = new THREE.MeshStandardMaterial({ name: 'tree-trunk', color: 0x544030, roughness: 0.95 });
  const chevronYellow = new THREE.MeshStandardMaterial({ name: 'chevron-yellow', color: 0xd9a435, roughness: 0.7 });
  const chevronBlack = new THREE.MeshStandardMaterial({ name: 'chevron-black', color: 0x222224, roughness: 0.8 });
  const flagGreen = new THREE.MeshStandardMaterial({ name: 'flag-green', color: 0x4f8a48, roughness: 0.8 });
  const tireWhite = new THREE.MeshStandardMaterial({ name: 'tire-white', color: 0xefe1c6, roughness: 0.85 });
  const tireRed = new THREE.MeshStandardMaterial({ name: 'tire-red', color: 0xc84b3e, roughness: 0.85 });
  const tireBlack = new THREE.MeshStandardMaterial({ name: 'tire-black', color: 0x222324, roughness: 0.92 });

  // Spectator clothing colors
  const crowdMats = [
    new THREE.MeshStandardMaterial({ color: 0x3d5060, roughness: 0.85 }),
    new THREE.MeshStandardMaterial({ color: 0x9e4b38, roughness: 0.85 }),
    new THREE.MeshStandardMaterial({ color: 0xefe1c6, roughness: 0.85 }),
    new THREE.MeshStandardMaterial({ color: 0xd5a23b, roughness: 0.85 }),
    new THREE.MeshStandardMaterial({ color: 0x53694c, roughness: 0.85 }),
  ];

  // --- 1. Start/Finish Overhead Gantry ---
  const startGantry = new THREE.Group();
  startGantry.name = 'startGantry';
  // Side timber towers (spaced 10.5m apart to bridge the entire road)
  for (const gx of [-5.2, 5.2]) {
    for (const gz of [-0.4, 0.4]) {
      const gPost = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.16, 5.8, 8), timberPost);
      gPost.position.set(gx, 2.9, gz);
      gPost.castShadow = true;
      startGantry.add(gPost);
    }
    const truss = new THREE.Mesh(new THREE.BoxGeometry(0.08, 4.8, 0.6), timberMat);
    truss.position.set(gx, 2.9, 0);
    startGantry.add(truss);
  }
  // Overhead cross beams
  const gBeam = new THREE.Mesh(new THREE.BoxGeometry(11.2, 0.22, 0.9), timberMat);
  gBeam.position.set(0, 5.4, 0);
  gBeam.castShadow = true;
  startGantry.add(gBeam);

  // Big Rally Banner across gantry
  const banner = new THREE.Mesh(new THREE.BoxGeometry(7.5, 1.2, 0.08), canvasOrange);
  banner.position.set(0, 4.6, 0);
  banner.castShadow = true;
  startGantry.add(banner);

  // Checkerboard pattern blocks on banner
  for (let b = -3.2; b <= 3.2; b += 0.9) {
    const check = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.42, 0.09), canvasCream);
    check.position.set(b, 4.6, 0.01);
    startGantry.add(check);
  }

  // --- 2. Stacked Red & White Tire Barrier ---
  const tireBarrier = new THREE.Group();
  tireBarrier.name = 'tireBarrier';
  const tGeom = new THREE.CylinderGeometry(0.32, 0.32, 0.24, 14);
  for (let row = 0; row < 3; row++) {
    for (let stack = 0; stack < 3; stack++) {
      const isRed = (row + stack) % 2 === 0;
      const tm = new THREE.Mesh(tGeom, isRed ? tireRed : tireWhite);
      tm.position.set((row - 1) * 0.62, stack * 0.24 + 0.12, 0);
      tm.castShadow = true;
      tm.receiveShadow = true;
      tireBarrier.add(tm);
    }
  }

  // --- 3. Terraced Rustic Stone Retaining Wall with Cheering Crowds ---
  const stoneWall = new THREE.Group();
  stoneWall.name = 'stoneWall';
  const wallMesh = new THREE.Mesh(new THREE.BoxGeometry(4.8, 1.4, 0.75), stoneMat);
  wallMesh.position.y = 0.7;
  wallMesh.castShadow = true;
  wallMesh.receiveShadow = true;
  stoneWall.add(wallMesh);
  // Cap stones
  for (let c = -2.1; c <= 2.1; c += 0.84) {
    const cap = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.16, 0.82), stoneDark);
    cap.position.set(c, 1.48, 0);
    cap.castShadow = true;
    stoneWall.add(cap);
  }
  // Cheering crowd spectators standing along wall terrace
  for (let sp = 0; sp < 3; sp++) {
    const cx = -1.5 + sp * 1.5;
    const cMat = crowdMats[sp % crowdMats.length];
    const sTorso = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 0.85, 7), cMat);
    sTorso.position.set(cx, 1.95, -0.15);
    sTorso.castShadow = true;
    const sHead = new THREE.Mesh(new THREE.SphereGeometry(0.13, 7, 7), canvasCream);
    sHead.position.set(cx, 2.5, -0.15);
    // Waving arm
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.35, 0.08), cMat);
    arm.position.set(cx + 0.24, 2.15, 0.05);
    arm.rotation.z = -0.55;
    stoneWall.add(sTorso, sHead, arm);
  }

  // --- 4. Rustic Timber Guardrail ---
  const timberBarrier = new THREE.Group();
  timberBarrier.name = 'timberBarrier';
  const postGeom = new THREE.CylinderGeometry(0.09, 0.11, 1.15, 8);
  for (const px of [-1.5, 0, 1.5]) {
    const p = new THREE.Mesh(postGeom, timberPost);
    p.position.set(px, 0.55, 0);
    p.castShadow = true;
    timberBarrier.add(p);
  }
  const railGeom = new THREE.BoxGeometry(3.3, 0.16, 0.14);
  const rTop = new THREE.Mesh(railGeom, timberMat);
  rTop.position.set(0, 0.82, 0.05);
  rTop.castShadow = true;
  const rBot = new THREE.Mesh(railGeom, timberMat);
  rBot.position.set(0, 0.44, 0.05);
  rBot.castShadow = true;
  timberBarrier.add(rTop, rBot);

  // --- 5. Stacked Straw/Hay Bales ---
  const hayBale = new THREE.Group();
  hayBale.name = 'hayBale';
  const b1 = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.52, 0.62), strawMat);
  b1.position.set(0, 0.26, 0);
  b1.castShadow = true;
  b1.receiveShadow = true;
  hayBale.add(b1);
  for (const bx of [-0.25, 0.25]) {
    const band = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.015, 4, 16), ropeMat);
    band.rotation.y = Math.PI / 2;
    band.position.set(bx, 0.26, 0);
    hayBale.add(band);
  }
  const b2 = new THREE.Mesh(new THREE.BoxGeometry(0.98, 0.48, 0.58), strawMat);
  b2.position.set(0.12, 0.74, 0.04);
  b2.rotation.y = 0.08;
  b2.castShadow = true;
  hayBale.add(b2);

  // --- 6. Wooden Marshal Hut & Flagpole ---
  const marshalHut = new THREE.Group();
  marshalHut.name = 'marshalHut';
  for (const mx of [-1.1, 1.1]) {
    for (const mz of [-0.9, 0.9]) {
      const mp = new THREE.Mesh(new THREE.BoxGeometry(0.14, 2.7, 0.14), timberPost);
      mp.position.set(mx, 1.35, mz);
      mp.castShadow = true;
      marshalHut.add(mp);
    }
  }
  const wallGeom = new THREE.BoxGeometry(2.3, 1.2, 0.08);
  const backW = new THREE.Mesh(wallGeom, timberMat);
  backW.position.set(0, 0.6, -0.9);
  const sideW1 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.2, 1.8), timberMat);
  sideW1.position.set(-1.1, 0.6, 0);
  const sideW2 = sideW1.clone();
  sideW2.position.x = 1.1;
  marshalHut.add(backW, sideW1, sideW2);

  const mRoof = new THREE.Mesh(new THREE.BoxGeometry(2.7, 0.1, 2.4), canvasOrange);
  mRoof.position.set(0, 2.78, 0);
  mRoof.rotation.x = -0.16;
  mRoof.castShadow = true;
  marshalHut.add(mRoof);

  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 3.8, 8), timberPost);
  pole.position.set(1.28, 2.3, 0.9);
  marshalHut.add(pole);

  const flagShape = new THREE.Shape();
  flagShape.moveTo(0, 0);
  flagShape.lineTo(0.9, 0.18);
  flagShape.lineTo(0.85, -0.45);
  flagShape.lineTo(0, -0.38);
  flagShape.closePath();
  const flagMesh = new THREE.Mesh(new THREE.ExtrudeGeometry(flagShape, { depth: 0.02, bevelEnabled: false }), flagGreen);
  flagMesh.position.set(1.28, 3.8, 0.9);
  flagMesh.rotation.y = 0.4;
  marshalHut.add(flagMesh);

  // Marshal figure
  const mTorso = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.26, 0.7, 8), canvasCream);
  mTorso.position.set(0.2, 1.5, 0.1);
  const mHead = new THREE.Mesh(new THREE.SphereGeometry(0.16, 8, 8), canvasOrange);
  mHead.position.set(0.2, 1.95, 0.1);
  marshalHut.add(mTorso, mHead);

  // --- 7. Spectator Canopy with Cheering Crowd ---
  const spectatorCanopy = new THREE.Group();
  spectatorCanopy.name = 'spectatorCanopy';
  for (const cx of [-2.2, 2.2]) {
    for (const cz of [-1.5, 1.5]) {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 2.8, 8), timberPost);
      leg.position.set(cx, 1.4, cz);
      leg.castShadow = true;
      spectatorCanopy.add(leg);
    }
  }
  const awning = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.08, 3.4), canvasCream);
  awning.position.set(0, 2.85, 0);
  awning.rotation.x = -0.08;
  awning.castShadow = true;
  spectatorCanopy.add(awning);

  for (let sp = 0; sp < 7; sp++) {
    const cx = -1.8 + sp * 0.6;
    const cz = -0.4 + (sp % 2) * 0.5;
    const cMat = crowdMats[sp % crowdMats.length];
    const sBody = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 1.1, 7), cMat);
    sBody.position.set(cx, 0.55, cz);
    sBody.castShadow = true;
    const sHead = new THREE.Mesh(new THREE.SphereGeometry(0.14, 7, 7), cMat);
    sHead.position.set(cx, 1.22, cz);
    spectatorCanopy.add(sBody, sHead);
  }

  // --- 8. Mediterranean Olive Tree ---
  const oliveTree = new THREE.Group();
  oliveTree.name = 'oliveTree';
  const oTrunk = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.55, 3.2, 8), trunkMat);
  oTrunk.position.y = 1.6;
  oTrunk.rotation.z = 0.08;
  oTrunk.castShadow = true;
  oliveTree.add(oTrunk);

  const lobeGeom = new THREE.DodecahedronGeometry(1.4);
  const lobe1 = new THREE.Mesh(lobeGeom, oliveFoliage);
  lobe1.position.set(-0.6, 3.5, 0.2);
  lobe1.scale.set(1.4, 0.9, 1.2);
  lobe1.castShadow = true;
  const lobe2 = new THREE.Mesh(lobeGeom, oliveFoliage);
  lobe2.position.set(0.7, 3.8, -0.3);
  lobe2.scale.set(1.5, 1.0, 1.3);
  lobe2.castShadow = true;
  const lobe3 = new THREE.Mesh(lobeGeom, deepGreen);
  lobe3.position.set(0, 4.4, 0.1);
  lobe3.scale.set(1.3, 1.1, 1.2);
  lobe3.castShadow = true;
  oliveTree.add(lobe1, lobe2, lobe3);

  // --- 9. Tall Slender Italian Cypress Tree (Cupressus) ---
  const cypressTree = new THREE.Group();
  cypressTree.name = 'cypressTree';
  const cTrunk = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.28, 2.0, 8), trunkMat);
  cTrunk.position.y = 1.0;
  cypressTree.add(cTrunk);

  const spire1 = new THREE.Mesh(new THREE.ConeGeometry(0.85, 4.8, 10), cypressFoliage);
  spire1.position.y = 3.6;
  spire1.castShadow = true;
  const spire2 = new THREE.Mesh(new THREE.ConeGeometry(0.65, 3.6, 10), deepGreen);
  spire2.position.y = 5.6;
  spire2.castShadow = true;
  cypressTree.add(spire1, spire2);

  // --- 10. Directional Chevron Warning Arrow Sign ---
  const chevronSign = new THREE.Group();
  chevronSign.name = 'chevronSign';
  const cPost = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.8, 8), timberPost);
  cPost.position.y = 0.9;
  cPost.castShadow = true;
  chevronSign.add(cPost);

  const board = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.65, 0.06), chevronYellow);
  board.position.set(0, 1.45, 0);
  board.castShadow = true;
  chevronSign.add(board);

  const arrowShape = new THREE.Shape();
  arrowShape.moveTo(-0.35, -0.22);
  arrowShape.lineTo(0.15, 0);
  arrowShape.lineTo(-0.35, 0.22);
  arrowShape.lineTo(-0.15, 0.22);
  arrowShape.lineTo(0.35, 0);
  arrowShape.lineTo(-0.15, -0.22);
  arrowShape.closePath();
  const arrowMesh = new THREE.Mesh(new THREE.ShapeGeometry(arrowShape), chevronBlack);
  arrowMesh.position.set(0, 1.45, 0.035);
  chevronSign.add(arrowMesh);

  // --- 11. Festive Pennant Bunting Line ---
  const buntingLine = new THREE.Group();
  buntingLine.name = 'buntingLine';
  for (const bx of [-2.4, 2.4]) {
    const bp = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 2.6, 6), timberPost);
    bp.position.set(bx, 1.3, 0);
    buntingLine.add(bp);
  }
  const flagCols = [0xd74b3f, 0xefe1c6, 0x53694c, 0xd5a23b];
  for (let f = 0; f < 8; f++) {
    const fx = -2.1 + f * 0.6;
    const sagY = 2.4 - Math.sin((f / 7) * Math.PI) * 0.35;
    const fMat = new THREE.MeshStandardMaterial({ color: flagCols[f % 4], roughness: 0.8 });
    const tri = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.32, 3), fMat);
    tri.rotation.z = Math.PI;
    tri.position.set(fx, sagY, 0);
    buntingLine.add(tri);
  }

  // --- 12. Monumental Roman Viaduct / Aqueduct & Hillside Italian Village ---
  const distantScenery = new THREE.Group();
  distantScenery.name = 'distantScenery';
  const villaMat = new THREE.MeshStandardMaterial({ color: 0xc4b59f, roughness: 0.92 });
  const roofTerracotta = new THREE.MeshStandardMaterial({ color: 0xb55a3b, roughness: 0.88 });

  // Roman Aqueduct Arches spanning across the gorge
  const archPillarGeom = new THREE.BoxGeometry(2.4, 16, 3.2);
  const archCapGeom = new THREE.BoxGeometry(54, 1.8, 3.8);
  for (let a = -24; a <= 24; a += 8) {
    const pillar = new THREE.Mesh(archPillarGeom, stoneDark);
    pillar.position.set(a, 8, -12);
    distantScenery.add(pillar);
  }
  const bridgeDeck = new THREE.Mesh(archCapGeom, stoneMat);
  bridgeDeck.position.set(0, 16.5, -12);
  distantScenery.add(bridgeDeck);

  // Hillside village villas
  for (let v = 0; v < 7; v++) {
    const h = 6 + (v % 3) * 3.5;
    const house = new THREE.Mesh(new THREE.BoxGeometry(5.0, h, 4.4), villaMat);
    house.position.set(-18 + v * 6, h * 0.5, 0);
    const roof = new THREE.Mesh(new THREE.ConeGeometry(4.0, 2.6, 4), roofTerracotta);
    roof.rotation.y = Math.PI / 4;
    roof.position.set(-18 + v * 6, h + 1.3, 0);
    distantScenery.add(house, roof);
  }
  // Bell tower
  const tower = new THREE.Mesh(new THREE.BoxGeometry(3.6, 22, 3.6), villaMat);
  tower.position.set(2, 11, 2);
  const towerRoof = new THREE.Mesh(new THREE.ConeGeometry(3.0, 5.0, 4), roofTerracotta);
  towerRoof.rotation.y = Math.PI / 4;
  towerRoof.position.set(2, 24.5, 2);
  distantScenery.add(tower, towerRoof);

  kit.userData.parts = {
    startGantry,
    tireBarrier,
    stoneWall,
    timberBarrier,
    hayBale,
    marshalHut,
    spectatorCanopy,
    oliveTree,
    cypressTree,
    chevronSign,
    buntingLine,
    distantScenery,
  };
  kit.userData.keepHierarchy = true;

  return kit;
}
