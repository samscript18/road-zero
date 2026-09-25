import * as THREE from 'three';

export interface Particle {
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  scale: number;
  maxScale: number;
  life: number;
  maxLife: number;
  type: 'dust' | 'smoke' | 'flame';
}

/**
 * Dedicated high-performance particle engine for:
 * - Volumetric golden dust plumes kicked up by tires
 * - White tire smoke from slides and handbrake drifts
 * - Orange/yellow exhaust backfire flame bursts
 */
export class ParticleEngine {
  private particles: Particle[] = [];
  private readonly maxParticles = 140;

  // Instanced meshes for batch rendering
  private dustMesh: THREE.InstancedMesh;
  private smokeMesh: THREE.InstancedMesh;
  private flameMesh: THREE.InstancedMesh;

  private dummy = new THREE.Object3D();

  constructor(scene: THREE.Scene) {
    // 1. Golden Dust (dodecahedron with warm earth tone)
    const dustMat = new THREE.MeshStandardMaterial({
      color: 0xd4ba8a,
      roughness: 0.95,
      transparent: true,
      opacity: 0.42,
    });
    this.dustMesh = new THREE.InstancedMesh(new THREE.DodecahedronGeometry(0.25, 1), dustMat, 60);
    this.dustMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

    // 2. White Tire Smoke
    const smokeMat = new THREE.MeshStandardMaterial({
      color: 0xdddddd,
      roughness: 0.9,
      transparent: true,
      opacity: 0.38,
    });
    this.smokeMesh = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(0.22, 1), smokeMat, 50);
    this.smokeMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

    // 3. Exhaust Flame Bursts (emissive orange/yellow)
    const flameMat = new THREE.MeshStandardMaterial({
      color: 0xffaa22,
      emissive: 0xff5500,
      emissiveIntensity: 2.2,
      roughness: 0.2,
    });
    this.flameMesh = new THREE.InstancedMesh(new THREE.SphereGeometry(0.12, 8, 8), flameMat, 30);
    this.flameMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

    scene.add(this.dustMesh, this.smokeMesh, this.flameMesh);
  }

  public spawnDust(pos: THREE.Vector3, intensity = 1.0) {
    if (this.particles.length >= this.maxParticles) return;
    this.particles.push({
      pos: pos.clone().add(new THREE.Vector3((Math.random() - 0.5) * 0.35, 0.08, (Math.random() - 0.5) * 0.35)),
      vel: new THREE.Vector3((Math.random() - 0.5) * 1.6, 0.6 + Math.random() * 1.4, (Math.random() - 0.5) * 1.6),
      scale: 0.25 + intensity * 0.3,
      maxScale: 0.8 + intensity * 0.6,
      life: 0,
      maxLife: 0.65 + Math.random() * 0.45,
      type: 'dust',
    });
  }

  public spawnSmoke(pos: THREE.Vector3, intensity = 1.0) {
    if (this.particles.length >= this.maxParticles) return;
    this.particles.push({
      pos: pos.clone().add(new THREE.Vector3((Math.random() - 0.5) * 0.3, 0.06, (Math.random() - 0.5) * 0.3)),
      vel: new THREE.Vector3((Math.random() - 0.5) * 1.2, 0.8 + Math.random() * 1.6, (Math.random() - 0.5) * 1.2),
      scale: 0.2 + intensity * 0.25,
      maxScale: 0.9 + intensity * 0.5,
      life: 0,
      maxLife: 0.55 + Math.random() * 0.35,
      type: 'smoke',
    });
  }

  public spawnBackfire(pos: THREE.Vector3, dir: THREE.Vector3) {
    for (let f = 0; f < 3; f++) {
      if (this.particles.length >= this.maxParticles) break;
      this.particles.push({
        pos: pos.clone().add(new THREE.Vector3((Math.random() - 0.5) * 0.1, (Math.random() - 0.5) * 0.1, (Math.random() - 0.5) * 0.1)),
        vel: dir.clone().multiplyScalar(-3.5 - Math.random() * 2.0).add(new THREE.Vector3((Math.random() - 0.5) * 0.8, 0.4 + Math.random() * 0.6, (Math.random() - 0.5) * 0.8)),
        scale: 0.2 + Math.random() * 0.15,
        maxScale: 0.35,
        life: 0,
        maxLife: 0.16 + Math.random() * 0.14,
        type: 'flame',
      });
    }
  }

  public update(dt: number) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life += dt;
      if (p.life >= p.maxLife) {
        this.particles.splice(i, 1);
        continue;
      }
      p.pos.addScaledVector(p.vel, dt);
      const progress = p.life / p.maxLife;
      p.scale = THREE.MathUtils.lerp(p.scale, p.maxScale, progress);
    }

    let dCount = 0;
    let sCount = 0;
    let fCount = 0;

    for (const p of this.particles) {
      this.dummy.position.copy(p.pos);
      this.dummy.scale.setScalar(p.scale);
      this.dummy.updateMatrix();

      if (p.type === 'dust' && dCount < 60) {
        this.dustMesh.setMatrixAt(dCount++, this.dummy.matrix);
      } else if (p.type === 'smoke' && sCount < 50) {
        this.smokeMesh.setMatrixAt(sCount++, this.dummy.matrix);
      } else if (p.type === 'flame' && fCount < 30) {
        this.flameMesh.setMatrixAt(fCount++, this.dummy.matrix);
      }
    }

    // Hide unused instances
    this.dummy.position.set(0, -999, 0);
    this.dummy.scale.setScalar(0.001);
    this.dummy.updateMatrix();

    for (let i = dCount; i < 60; i++) this.dustMesh.setMatrixAt(i, this.dummy.matrix);
    for (let i = sCount; i < 50; i++) this.smokeMesh.setMatrixAt(i, this.dummy.matrix);
    for (let i = fCount; i < 30; i++) this.flameMesh.setMatrixAt(i, this.dummy.matrix);

    this.dustMesh.instanceMatrix.needsUpdate = true;
    this.smokeMesh.instanceMatrix.needsUpdate = true;
    this.flameMesh.instanceMatrix.needsUpdate = true;
  }
}
