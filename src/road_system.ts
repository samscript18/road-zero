import * as THREE from 'three';

export interface RoadSystem {
  group: THREE.Group;
  curve: THREE.CatmullRomCurve3;
  samples: THREE.Vector3[];
  tangents: THREE.Vector3[];
  normals: THREE.Vector3[];
  binormals: THREE.Vector3[];
  roadWidth: number;
}

/**
 * Builds a continuous smooth ribbon road mesh with:
 * - High-resolution asphalt ribbon with vertex normals and UVs
 * - Solid painted white edge borders
 * - Red-and-white alternating apex kerbs (rumble strips) at corner apexes
 * - Tire rubber skid marks at heavy braking zones
 * - Warm dusty gravel shoulders
 */
export function createRoadSystem(points: THREE.Vector3[], roadWidth = 8.4, segments = 360): RoadSystem {
  const group = new THREE.Group();
  group.name = 'road-system';

  const curve = new THREE.CatmullRomCurve3(points, true, 'catmullrom', 0.35);

  const samples: THREE.Vector3[] = [];
  const tangents: THREE.Vector3[] = [];
  const normals: THREE.Vector3[] = [];
  const binormals: THREE.Vector3[] = [];

  const up = new THREE.Vector3(0, 1, 0);

  for (let i = 0; i < segments; i++) {
    const t = i / segments;
    const p = curve.getPointAt(t);
    const tan = curve.getTangentAt(t).normalize();
    // Compute binormal (side vector across road width)
    const side = new THREE.Vector3().crossVectors(up, tan).normalize();
    const norm = new THREE.Vector3().crossVectors(tan, side).normalize();

    samples.push(p);
    tangents.push(tan);
    normals.push(norm);
    binormals.push(side);
  }

  // --- 1. Continuous Asphalt Road Surface ---
  const halfW = roadWidth * 0.5;
  const roadPositions: number[] = [];
  const roadNormals: number[] = [];
  const roadUvs: number[] = [];
  const roadIndices: number[] = [];

  for (let i = 0; i <= segments; i++) {
    const idx = i % segments;
    const p = samples[idx];
    const side = binormals[idx];
    const norm = normals[idx];

    // Left vertex
    const lp = p.clone().addScaledVector(side, -halfW);
    roadPositions.push(lp.x, lp.y, lp.z);
    roadNormals.push(norm.x, norm.y, norm.z);
    roadUvs.push(0, (i / segments) * 28);

    // Right vertex
    const rp = p.clone().addScaledVector(side, halfW);
    roadPositions.push(rp.x, rp.y, rp.z);
    roadNormals.push(norm.x, norm.y, norm.z);
    roadUvs.push(1, (i / segments) * 28);

    if (i < segments) {
      const v0 = i * 2;
      const v1 = i * 2 + 1;
      const v2 = (i + 1) * 2;
      const v3 = (i + 1) * 2 + 1;
      roadIndices.push(v0, v2, v1, v1, v2, v3);
    }
  }

  const roadGeom = new THREE.BufferGeometry();
  roadGeom.setAttribute('position', new THREE.Float32BufferAttribute(roadPositions, 3));
  roadGeom.setAttribute('normal', new THREE.Float32BufferAttribute(roadNormals, 3));
  roadGeom.setAttribute('uv', new THREE.Float32BufferAttribute(roadUvs, 2));
  roadGeom.setIndex(roadIndices);

  const roadMat = new THREE.MeshStandardMaterial({
    color: 0x2e3032,
    roughness: 0.86,
    metalness: 0.05,
    side: THREE.DoubleSide,
  });

  const roadMesh = new THREE.Mesh(roadGeom, roadMat);
  roadMesh.name = 'asphalt-surface';
  roadMesh.receiveShadow = true;
  group.add(roadMesh);

  // --- 2. Painted Crisp White Road Edge Lines ---
  const lineWidth = 0.28;
  for (const sgn of [-1, 1]) {
    const linePositions: number[] = [];
    const lineNormals: number[] = [];
    const lineIndices: number[] = [];

    const offsetCenter = sgn * (halfW - lineWidth * 0.7);

    for (let i = 0; i <= segments; i++) {
      const idx = i % segments;
      const p = samples[idx];
      const side = binormals[idx];
      const norm = normals[idx];

      const p0 = p.clone().addScaledVector(side, offsetCenter - lineWidth * 0.5).addScaledVector(norm, 0.008);
      const p1 = p.clone().addScaledVector(side, offsetCenter + lineWidth * 0.5).addScaledVector(norm, 0.008);

      linePositions.push(p0.x, p0.y, p0.z, p1.x, p1.y, p1.z);
      lineNormals.push(norm.x, norm.y, norm.z, norm.x, norm.y, norm.z);

      if (i < segments) {
        const v0 = i * 2;
        const v1 = i * 2 + 1;
        const v2 = (i + 1) * 2;
        const v3 = (i + 1) * 2 + 1;
        lineIndices.push(v0, v2, v1, v1, v2, v3);
      }
    }

    const lineGeom = new THREE.BufferGeometry();
    lineGeom.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    lineGeom.setAttribute('normal', new THREE.Float32BufferAttribute(lineNormals, 3));
    lineGeom.setIndex(lineIndices);

    const lineMat = new THREE.MeshStandardMaterial({
      color: 0xefe1c6,
      roughness: 0.6,
      metalness: 0.0,
      side: THREE.DoubleSide,
    });

    const edgeLine = new THREE.Mesh(lineGeom, lineMat);
    edgeLine.name = `edge-line-${sgn > 0 ? 'right' : 'left'}`;
    group.add(edgeLine);
  }

  // --- 3. Red & White Alternating Apex Kerbs (Rumble Strips) on Curves ---
  const kerbWidth = 0.65;
  const kerbHeight = 0.055;
  const redMat = new THREE.MeshStandardMaterial({ color: 0xd74b3f, roughness: 0.75 });
  const whiteMat = new THREE.MeshStandardMaterial({ color: 0xefe1c6, roughness: 0.75 });

  // Detect sharp corners by measuring tangent change
  for (let i = 0; i < segments; i++) {
    const nextIdx = (i + 4) % segments;
    const tan0 = tangents[i];
    const tan1 = tangents[nextIdx];
    const crossY = tan0.x * tan1.z - tan0.z * tan1.x; // positive = right turn, negative = left turn
    const curvature = Math.abs(crossY);

    if (curvature > 0.06) {
      // Curve apex detected! Place kerb on inside (and optionally outside)
      const insideSgn = crossY > 0 ? -1 : 1;
      const isRed = Math.floor(i / 2) % 2 === 0;
      const kMat = isRed ? redMat : whiteMat;

      const p = samples[i];
      const side = binormals[i];
      const norm = normals[i];
      const tan = tangents[i];

      const kerbBox = new THREE.BoxGeometry(kerbWidth, kerbHeight, (curve.getLength() / segments) * 1.05);
      const km = new THREE.Mesh(kerbBox, kMat);
      km.position.copy(p).addScaledVector(side, insideSgn * (halfW + kerbWidth * 0.42)).addScaledVector(norm, kerbHeight * 0.4);
      km.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), tan);
      km.receiveShadow = true;
      group.add(km);
    }
  }

  // --- 4. Gravel / Dusty Verge Shoulders ---
  const shoulderWidth = 2.2;
  const shoulderPositions: number[] = [];
  const shoulderNormals: number[] = [];
  const shoulderIndices: number[] = [];

  for (const sgn of [-1, 1]) {
    const startIdx = shoulderPositions.length / 3;
    for (let i = 0; i <= segments; i++) {
      const idx = i % segments;
      const p = samples[idx];
      const side = binormals[idx];
      const norm = normals[idx];

      const pInner = p.clone().addScaledVector(side, sgn * halfW).addScaledVector(norm, -0.01);
      const pOuter = p.clone().addScaledVector(side, sgn * (halfW + shoulderWidth)).addScaledVector(norm, -0.08);

      shoulderPositions.push(pInner.x, pInner.y, pInner.z, pOuter.x, pOuter.y, pOuter.z);
      shoulderNormals.push(norm.x, norm.y, norm.z, norm.x, norm.y, norm.z);

      if (i < segments) {
        const v0 = startIdx + i * 2;
        const v1 = startIdx + i * 2 + 1;
        const v2 = startIdx + (i + 1) * 2;
        const v3 = startIdx + (i + 1) * 2 + 1;
        if (sgn > 0) {
          shoulderIndices.push(v0, v1, v2, v1, v3, v2);
        } else {
          shoulderIndices.push(v0, v2, v1, v1, v2, v3);
        }
      }
    }
  }

  const shoulderGeom = new THREE.BufferGeometry();
  shoulderGeom.setAttribute('position', new THREE.Float32BufferAttribute(shoulderPositions, 3));
  shoulderGeom.setAttribute('normal', new THREE.Float32BufferAttribute(shoulderNormals, 3));
  shoulderGeom.setIndex(shoulderIndices);

  const shoulderMat = new THREE.MeshStandardMaterial({
    color: 0x8a7a58,
    roughness: 0.96,
    metalness: 0.0,
  });

  const shoulderMesh = new THREE.Mesh(shoulderGeom, shoulderMat);
  shoulderMesh.name = 'gravel-shoulders';
  shoulderMesh.receiveShadow = true;
  group.add(shoulderMesh);

  // --- 5. Dark Tire Rubber Skid Marks on Braking Zones ---
  const skidMat = new THREE.MeshStandardMaterial({
    color: 0x18191a,
    roughness: 0.95,
    transparent: true,
    opacity: 0.42,
  });

  for (let s = 12; s < segments; s += 28) {
    const p = samples[s];
    const side = binormals[s];
    const tan = tangents[s];
    const norm = normals[s];

    for (const lane of [-1.4, 1.4]) {
      const sm = new THREE.Mesh(new THREE.PlaneGeometry(0.24, 7.5), skidMat);
      sm.position.copy(p).addScaledVector(side, lane).addScaledVector(norm, 0.012);
      sm.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), norm);
      sm.rotateY(Math.atan2(tan.x, tan.z));
      group.add(sm);
    }
  }

  return {
    group,
    curve,
    samples,
    tangents,
    normals,
    binormals,
    roadWidth,
  };
}
