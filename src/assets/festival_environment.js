// @ts-nocheck
/**
 * ROAD//ZERO - Festival Hillside Environment Kit
 * Procedural 3D assets for the Analog Hillside Motorsport Festival:
 * - Terraced rustic stone retaining walls
 * - Rustic timber post guardrails
 * - Stacked straw/hay bales with rope bindings
 * - Timber marshal huts with flagpoles and marshals waving flags
 * - Colorful pennant bunting (red, white, green, yellow flags)
 * - Canvas spectator canopies with paddock props
 * - Cheering spectator crowd silhouettes
 * - Mediterranean olive trees, Italian cypresses, stone pines
 * - Chevron turn signs
 * - Distant mountain backdrop & Italian hillside village silhouettes
 */

export default function createFestivalEnvironment(THREE) {
  const kit = new THREE.Group();
  kit.name = 'festival-environment-kit';

  // --- Materials ---
  const stoneMat = new THREE.MeshStandardMaterial({ name: 'warm-stone', color: 0xa88869, roughness: 0.94 });
  const stoneDark = new THREE.MeshStandardMaterial({ name: 'stone-dark', color: 0x7a634e, roughness: 0.96 });
  const timberMat = new THREE.MeshStandardMaterial({ name: 'weathered-timber', color: 0x6e4e37, roughness: 0.88 });
  const timberPost = new THREE.MeshStandardMaterial({ name: 'timber-post', color: 0x5a3d28, roughness: 0.92 });
  const strawMat = new THREE.MeshStandardMaterial({ name: 'golden-straw', color: 0xd5a23b, roughness: 0.92 });
  const ropeMat = new THREE.MeshStandardMaterial({ name: 'bale-rope', color: 0x3d3024, roughness: 0.85 });
  const canvasMat = new THREE.MeshStandardMaterial({ name: 'canvas-cream', color: 0xefe1c6, roughness: 0.85 });
  const canvasOrange = new THREE.MeshStandardMaterial({ name: 'canvas-orange', color: 0xc86845, roughness: 0.82 });
  const oliveFoliage = new THREE.MeshStandardMaterial({ name: 'olive-leaves', color: 0x768565, roughness: 0.92 });
  const cypressFoliage = new THREE.MeshStandardMaterial({ name: 'cypress-green', color: 0x3a4f3b, roughness: 0.95 });
  const deepGreen = new THREE.MeshStandardMaterial({ name: 'deep-foliage', color: 0x475b42, roughness: 0.94 });
  const trunkMat = new THREE.MeshStandardMaterial({ name: 'tree-trunk', color: 0x544030, roughness: 0.95 });
  const chevronYellow = new THREE.MeshStandardMaterial({ name: 'chevron-yellow', color: 0xd9a435, roughness: 0.7 });
  const chevronBlack = new THREE.MeshStandardMaterial({ name: 'chevron-black', color: 0x222224, roughness: 0.8 });
  const flagGreen = new THREE.MeshStandardMaterial({ name: 'flag-green', color: 0x4f8a48, roughness: 0.8 });
  const crowdMatA = new THREE.MeshStandardMaterial({ name: 'crowd-a', color: 0x3d5060, roughness: 0.85 });
  const crowdMatB = new THREE.MeshStandardMaterial({ name: 'crowd-b', color: 0x9e4b38, roughness: 0.85 });
  const crowdMatC = new THREE.MeshStandardMaterial({ name: 'crowd-c', color: 0xefe1c6, roughness: 0.85 });

  // --- 1. Terraced Rustic Stone Retaining Wall ---
  const stoneWall = new THREE.Group();
  stoneWall.name = 'stoneWall';
  const wallBase = new THREE.BoxGeometry(4.8, 1.4, 0.75);
  const wallMesh = new THREE.Mesh(wallBase, stoneMat);
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

  // --- 2. Rustic Timber Guardrail ---
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

  // --- 3. Stacked Straw/Hay Bales ---
  const hayBale = new THREE.Group();
  hayBale.name = 'hayBale';
  const baleGeom = new THREE.BoxGeometry(1.05, 0.52, 0.62);
  const b1 = new THREE.Mesh(baleGeom, strawMat);
  b1.position.set(0, 0.26, 0);
  b1.castShadow = true;
  b1.receiveShadow = true;
  hayBale.add(b1);
  // Twine bands
  for (const bx of [-0.25, 0.25]) {
    const band = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.015, 4, 16), ropeMat);
    band.rotation.y = Math.PI / 2;
    band.position.set(bx, 0.26, 0);
    hayBale.add(band);
  }
  // Stacked top bale
  const b2 = new THREE.Mesh(new THREE.BoxGeometry(0.98, 0.48, 0.58), strawMat);
  b2.position.set(0.12, 0.74, 0.04);
  b2.rotation.y = 0.08;
  b2.castShadow = true;
  hayBale.add(b2);

  // --- 4. Wooden Marshal Hut & Flagpole ---
  const marshalHut = new THREE.Group();
  marshalHut.name = 'marshalHut';
  // Wooden frame posts
  for (const mx of [-1.1, 1.1]) {
    for (const mz of [-0.9, 0.9]) {
      const mp = new THREE.Mesh(new THREE.BoxGeometry(0.14, 2.7, 0.14), timberPost);
      mp.position.set(mx, 1.35, mz);
      mp.castShadow = true;
      marshalHut.add(mp);
    }
  }
  // Plaster & timber plank walls (lower half)
  const wallGeom = new THREE.BoxGeometry(2.3, 1.2, 0.08);
  const backW = new THREE.Mesh(wallGeom, timberMat);
  backW.position.set(0, 0.6, -0.9);
  const sideW1 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.2, 1.8), timberMat);
  sideW1.position.set(-1.1, 0.6, 0);
  const sideW2 = sideW1.clone();
  sideW2.position.x = 1.1;
  marshalHut.add(backW, sideW1, sideW2);

  // Slanted corrugated roof
  const roof = new THREE.Mesh(new THREE.BoxGeometry(2.7, 0.1, 2.4), canvasOrange);
  roof.position.set(0, 2.78, 0);
  roof.rotation.x = -0.16;
  roof.castShadow = true;
  marshalHut.add(roof);

  // Flagpole & waving green flag
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 3.8, 8), timberPost);
  pole.position.set(1.28, 2.3, 0.9);
  marshalHut.add(pole);
  // Green flag
  const flagShape = new THREE.Shape();
  flagShape.moveTo(0, 0);
  flagShape.lineTo(0.9, 0.18);
  flagShape.lineTo(0.85, -0.45);
  flagShape.lineTo(0, -0.38);
  flagShape.closePath();
  const flagGeom = new THREE.ExtrudeGeometry(flagShape, { depth: 0.02, bevelEnabled: false });
  const flagMesh = new THREE.Mesh(flagGeom, flagGreen);
  flagMesh.position.set(1.28, 3.8, 0.9);
  flagMesh.rotation.y = 0.4;
  marshalHut.add(flagMesh);

  // Stylized marshal silhouette inside
  const marshalTorso = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.26, 0.7, 8), crowdMatC);
  marshalTorso.position.set(0.2, 1.5, 0.1);
  const marshalHead = new THREE.Mesh(new THREE.SphereGeometry(0.16, 8, 8), canvasOrange);
  marshalHead.position.set(0.2, 1.95, 0.1);
  marshalHut.add(marshalTorso, marshalHead);

  // --- 5. Spectator Canopy & Paddock Structure ---
  const spectatorCanopy = new THREE.Group();
  spectatorCanopy.name = 'spectatorCanopy';
  // Timber legs
  for (const cx of [-2.2, 2.2]) {
    for (const cz of [-1.5, 1.5]) {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 2.8, 8), timberPost);
      leg.position.set(cx, 1.4, cz);
      leg.castShadow = true;
      spectatorCanopy.add(leg);
    }
  }
  // Sloping canvas awning
  const awning = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.08, 3.4), canvasMat);
  awning.position.set(0, 2.85, 0);
  awning.rotation.x = -0.08;
  awning.castShadow = true;
  spectatorCanopy.add(awning);

  // Cheering crowd spectators standing under and around canopy
  for (let sp = 0; sp < 6; sp++) {
    const cx = -1.6 + sp * 0.64;
    const cz = -0.4 + (sp % 2) * 0.5;
    const cMat = sp % 3 === 0 ? crowdMatA : sp % 3 === 1 ? crowdMatB : crowdMatC;
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 1.1, 7), cMat);
    body.position.set(cx, 0.55, cz);
    body.castShadow = true;
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.14, 7, 7), cMat);
    head.position.set(cx, 1.22, cz);
    spectatorCanopy.add(body, head);
  }

  // --- 6. Mediterranean Olive Tree ---
  const oliveTree = new THREE.Group();
  oliveTree.name = 'oliveTree';
  // Twisted gnarled trunk
  const oTrunk = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.55, 3.2, 8), trunkMat);
  oTrunk.position.y = 1.6;
  oTrunk.rotation.z = 0.08;
  oTrunk.castShadow = true;
  oliveTree.add(oTrunk);

  // Branch clusters
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

  // --- 7. Tall Slender Italian Cypress Tree (Cupressus) ---
  const cypressTree = new THREE.Group();
  cypressTree.name = 'cypressTree';
  const cTrunk = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.28, 2.0, 8), trunkMat);
  cTrunk.position.y = 1.0;
  cypressTree.add(cTrunk);

  // Slender conical/flame spire foliage
  const spire1 = new THREE.Mesh(new THREE.ConeGeometry(0.85, 4.8, 10), cypressFoliage);
  spire1.position.y = 3.6;
  spire1.castShadow = true;
  const spire2 = new THREE.Mesh(new THREE.ConeGeometry(0.65, 3.6, 10), deepGreen);
  spire2.position.y = 5.6;
  spire2.castShadow = true;
  cypressTree.add(spire1, spire2);

  // --- 8. Directional Chevron Warning Arrow Sign ---
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

  // Black arrow '>' shape
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

  // --- 9. Festive Pennant Bunting Line ---
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

  // --- 10. Hillside Rock Cut Formation ---
  const rockFormation = new THREE.Group();
  rockFormation.name = 'rockFormation';
  for (let r = 0; r < 4; r++) {
    const rGeom = new THREE.DodecahedronGeometry(1.6 + (r % 2) * 0.5);
    const rm = new THREE.Mesh(rGeom, r % 2 === 0 ? stoneMat : stoneDark);
    rm.position.set((r - 1.5) * 1.8, 1.2 + (r % 2) * 0.4, (r % 3) * 0.3);
    rm.rotation.set(r * 0.4, r * 0.7, 0);
    rm.scale.set(1.4, 1.1, 1.0);
    rm.castShadow = true;
    rm.receiveShadow = true;
    rockFormation.add(rm);
  }

  // --- 11. Distant Village & Mountain Silhouette Group ---
  const distantScenery = new THREE.Group();
  distantScenery.name = 'distantScenery';
  const villaMat = new THREE.MeshStandardMaterial({ color: 0xbaa48e, roughness: 0.95 });
  const roofTerracotta = new THREE.MeshStandardMaterial({ color: 0xb55a3b, roughness: 0.9 });
  const mountainMat = new THREE.MeshStandardMaterial({ color: 0x5a686b, roughness: 0.98 });

  // Hillside village building clusters
  for (let v = 0; v < 6; v++) {
    const h = 5 + (v % 3) * 3;
    const house = new THREE.Mesh(new THREE.BoxGeometry(4.5, h, 4.0), villaMat);
    house.position.set(-15 + v * 6, h * 0.5, 0);
    const roof = new THREE.Mesh(new THREE.ConeGeometry(3.6, 2.4, 4), roofTerracotta);
    roof.rotation.y = Math.PI / 4;
    roof.position.set(-15 + v * 6, h + 1.2, 0);
    distantScenery.add(house, roof);
  }
  // Bell tower
  const tower = new THREE.Mesh(new THREE.BoxGeometry(3.5, 18, 3.5), villaMat);
  tower.position.set(0, 9, 2);
  const towerRoof = new THREE.Mesh(new THREE.ConeGeometry(2.8, 4.5, 4), roofTerracotta);
  towerRoof.rotation.y = Math.PI / 4;
  towerRoof.position.set(0, 20.2, 2);
  distantScenery.add(tower, towerRoof);

  // Arched viaduct bridge silhouette
  for (let a = -18; a <= 18; a += 9) {
    const archPillar = new THREE.Mesh(new THREE.BoxGeometry(2.2, 12, 3), stoneDark);
    archPillar.position.set(a, 6, -10);
    distantScenery.add(archPillar);
  }
  const bridgeDeck = new THREE.Mesh(new THREE.BoxGeometry(45, 1.5, 3.8), stoneMat);
  bridgeDeck.position.set(0, 12.5, -10);
  distantScenery.add(bridgeDeck);

  kit.userData.parts = {
    stoneWall,
    timberBarrier,
    hayBale,
    marshalHut,
    spectatorCanopy,
    oliveTree,
    cypressTree,
    chevronSign,
    buntingLine,
    rockFormation,
    distantScenery,
  };
  kit.userData.keepHierarchy = true;

  return kit;
}
