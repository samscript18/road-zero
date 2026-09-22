declare module '*.js' {
  import type * as THREE from 'three';
  const generate: (namespace: typeof THREE) => THREE.Group;
  export default generate;
  export function bakeStatic(root: THREE.Object3D): THREE.Group;
}

interface GameTelemetry {
  pos: [number, number]; fps: number; speed: number; score: number; over: boolean;
  draws: number; tris: number; progress: number; drift: number; route: string;
  construction: number; modules: number; heading: number;
  position?: number; aiProgress?: number[]; mode?: string;
  assemblyProgress?: number;
}

interface Window {
  __READY__: boolean;
  __START__: () => void;
  __GAME__: GameTelemetry;
}
