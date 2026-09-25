declare module '*.js' {
  import type * as THREE from 'three';
  const generate: (namespace: typeof THREE, ...args: any[]) => THREE.Group;
  export default generate;
  export function bakeStatic(root: THREE.Object3D): THREE.Group;
}

declare module '*/rival_cars.js' {
  import type * as THREE from 'three';
  export function createRivalCar(namespace: typeof THREE, id: string): THREE.Group;
}

declare module '*/festival_environment.js' {
  import type * as THREE from 'three';
  export function createFestivalEnvironment(namespace: typeof THREE): THREE.Group;
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
