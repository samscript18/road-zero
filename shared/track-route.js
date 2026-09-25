import * as THREE from 'three';

const layouts = [
  { points: 14, radius: 76, wave: 11, phase: 0.3, elevation: 3.2 },
  { points: 16, radius: 72, wave: 15, phase: 1.2, elevation: 4.8 },
  { points: 16, radius: 78, wave: 13, phase: 2.4, elevation: 6.2 },
];
export const trackIndex = Object.freeze({ ORCHARD: 0, QUARRY: 1, SUMMIT: 2 });

export function generateTrackPoints(index) {
  const cfg = layouts[index];
  if (!cfg) throw new Error('Unknown track');
  const points = [];
  for (let i = 0; i < cfg.points; i++) {
    const a = (i / cfg.points) * Math.PI * 2 - Math.PI / 2;
    const r = cfg.radius + Math.sin(i * 1.6 + cfg.phase) * cfg.wave + Math.cos(i * 0.9 + index) * 4.5;
    const y = 7.0 + Math.sin(i * 1.2 + index) * cfg.elevation;
    points.push(new THREE.Vector3(Math.cos(a) * r, y, Math.sin(a) * r));
  }
  return points;
}

export function createTrackRoute(trackId) {
  const curve = new THREE.CatmullRomCurve3(generateTrackPoints(trackIndex[trackId]), true, 'catmullrom', 0.35);
  const samples = Array.from({ length: 380 }, (_, i) => curve.getPointAt(i / 380));
  return {
    curve,
    samples,
    length: curve.getLength(),
    nearest(x, z) {
      let best = Infinity;
      let index = 0;
      for (let i = 0; i < samples.length; i++) {
        const dx = x - samples[i].x;
        const dz = z - samples[i].z;
        const distance = dx * dx + dz * dz;
        if (distance < best) { best = distance; index = i; }
      }
      return { t: index / samples.length, distance: Math.sqrt(best), y: samples[index].y };
    },
    grid(slot) {
      const t = (0.005 - Math.floor(slot / 2) * 0.009 + 1) % 1;
      const p = curve.getPointAt(t);
      const tan = curve.getTangentAt(t).setY(0).normalize();
      const lane = slot % 2 === 0 ? -1.35 : 1.35;
      return { x: p.x - tan.z * lane, y: p.y + 0.16, z: p.z + tan.x * lane, rotationY: Math.atan2(tan.x, tan.z), t };
    },
  };
}
