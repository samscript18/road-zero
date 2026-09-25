import type * as THREE from 'three';
export const trackIndex: Readonly<Record<'ORCHARD' | 'QUARRY' | 'SUMMIT', number>>;
export function generateTrackPoints(index: number): THREE.Vector3[];
export function createTrackRoute(trackId: 'ORCHARD' | 'QUARRY' | 'SUMMIT'): {
  curve: THREE.CatmullRomCurve3; samples: THREE.Vector3[]; length: number;
  nearest(x: number, z: number): { t: number; distance: number; y: number };
  grid(slot: number): { x: number; y: number; z: number; rotationY: number; t: number };
};
