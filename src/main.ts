import * as THREE from 'three';
import createHeroCoupe from './assets/hero_coupe.js';
import createRivalCar from './assets/rival_cars.js';
import { createRoadSystem, type RoadSystem } from './road_system';
import createFestivalEnvironment from './assets/festival_environment.js';
import { ParticleEngine } from './particles';
import { RaceAudio } from './audio';
import { bakeStatic } from './assetlib.js';
import { awardRace, nearestTrackXZ, rankedStandings, RACES, RIVAL_TUNING, stepCar, type CarState, type RivalId, type Standing } from './race';
import './styles.css';

const $ = <T extends Element>(q: string) => document.querySelector<T>(q)!;
const app = $<HTMLDivElement>('#app');

app.innerHTML = `
<main id="menu" class="screen">
  <section class="card hero">
    <div class="menu-masthead"><p class="kicker">THE CANTERA HILL-CLIMB · 1982</p><span>03 ROUNDS · 04 DRIVERS</span></div>
    <h1><span>ROAD</span><i>ZERO</i></h1>
    <p class="lede">Three mountain roads. Three rivals to read. One title to win.</p>
    <div class="rival-strip" aria-label="Your three championship rivals">
      <span class="rival-chip"><b class="rival-dot charger-dot"></b>CHARGER</span>
      <span class="rival-chip"><b class="rival-dot technician-dot"></b>TECHNICIAN</span>
      <span class="rival-chip"><b class="rival-dot defender-dot"></b>DEFENDER</span>
    </div>
    <div class="actions">
      <button id="championship" class="primary"><span>START CHAMPIONSHIP</span><span aria-hidden="true">↗</span></button>
      <button id="quick"><span>QUICK RACE</span><span aria-hidden="true">→</span></button>
      <button id="how"><span>HOW TO PLAY</span><span aria-hidden="true">→</span></button>
    </div>
    <p class="keys">WASD / ARROWS <em>DRIVE</em><span>·</span> SPACE <em>SLIP</em><span>·</span> R <em>RESET</em></p>
  </section>
  <div class="menu-broadcast" aria-hidden="true"><span class="live-mark"></span><span>LIVE FROM THE HILLSIDE</span><b>01 / 03</b></div>
  <div class="menu-scene-caption" aria-hidden="true"><span>ORCHARD SPRINT</span><i></i><span>THE GRID IS MOVING</span></div>
</main>
<section id="brief" class="screen hidden">
  <div class="card modal">
    <p class="kicker">DRIVER BRIEFING</p>
    <h2>READ THE RIVALS</h2>
    <p><b class="charger">CHARGER</b> (Ochre #12) dives late and can overcommit on braking. <b class="technician">TECHNICIAN</b> (Blue #7) owns the clean line and hits every apex. <b class="defender">DEFENDER</b> (Green #4) protects position without weaving.</p>
    <p>Brake before turning, clip the kerbs, and power out. Road verges slow you down. Tap handbrake into hairpin bends to break traction.</p>
    <button id="close" class="primary">GOT IT</button>
  </div>
</section>
<section id="preRace" class="screen hidden">
  <div class="card">
    <p id="round" class="kicker"></p>
    <h2 id="raceName"></h2>
    <p id="raceCopy" class="lede"></p>
    <button id="grid" class="primary">TO THE GRID</button>
  </div>
</section>
<div id="hud" class="hidden">
  <div class="plate"><b id="position">1 / 4</b><small>POSITION</small></div>
  <div class="plate center"><b id="lap">1 / 2</b><small>LAP</small></div>
  <div class="plate right"><b id="speed">000</b><small>KM/H</small></div>
  <div id="raceLabel"></div>
  <div id="countdown"></div>
  <div id="tacho">
    <div class="needle" id="tachoNeedle"></div>
    <div class="center-pin"></div>
    <div class="rpm-num" id="tachoRpm">1</div>
    <small>GEAR · RPM</small>
  </div>
  <div id="notice"></div>
</div>
<div id="touch" class="hidden">
  <div class="steering-controls">
    <div id="steerPad" aria-label="Analog steering"><span id="steerKnob"></span></div>
    <div id="directionPad" class="hidden" aria-label="Directional driving controls">
      <button type="button" id="directionUp" aria-label="Accelerate">▲</button>
      <button type="button" id="directionLeft" aria-label="Steer left">◀</button>
      <span class="direction-center" aria-hidden="true"></span>
      <button type="button" id="directionRight" aria-label="Steer right">▶</button>
      <button type="button" id="directionDown" aria-label="Brake or reverse">▼</button>
    </div>
    <button type="button" id="steerMode" aria-pressed="false" aria-controls="steerPad directionPad" aria-label="Switch to directional controls">USE ARROWS</button>
  </div>
  <div class="pedals">
    <button type="button" id="brake">BRAKE</button>
    <button type="button" id="throttle">GO</button>
    <button type="button" id="handbrake">SLIP</button>
  </div>
</div>
<section id="results" class="screen hidden">
  <div class="card results-card">
    <p id="resultKicker" class="kicker"></p>
    <h2 id="resultTitle"></h2>
    <div id="raceOrder"></div>
    <h3>CHAMPIONSHIP STANDINGS</h3>
    <div id="standings"></div>
    <button id="next" class="primary">NEXT RACE</button>
    <button id="menuButton">MAIN MENU</button>
  </div>
</section>`;

// --- Renderer & WebGL Setup ---
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.18;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
app.prepend(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xb5a389);
scene.fog = new THREE.Fog(0xc9b99e, 110, 420);

const camera = new THREE.PerspectiveCamera(54, innerWidth / innerHeight, 0.1, 750);

// --- Golden Hour Lighting Rig ---
const hemi = new THREE.HemisphereLight(0xaad0d8, 0x886348, 1.85);
scene.add(hemi);

const sun = new THREE.DirectionalLight(0xffd594, 3.8);
sun.position.set(-65, 75, -45);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
sun.shadow.camera.near = 10;
sun.shadow.camera.far = 350;
sun.shadow.camera.left = -95;
sun.shadow.camera.right = 95;
sun.shadow.camera.top = 95;
sun.shadow.camera.bottom = -95;
sun.shadow.bias = -0.0003;
scene.add(sun);

const sunFill = new THREE.DirectionalLight(0xffe2b8, 0.95);
sunFill.position.set(45, 30, 60);
scene.add(sunFill);

// --- Hillside Ground & Mountain Terrain ---
const groundGeom = new THREE.PlaneGeometry(550, 550, 48, 48);
groundGeom.rotateX(-Math.PI / 2);
const posAttr = groundGeom.attributes.position;
for (let i = 0; i < posAttr.count; i++) {
  const gx = posAttr.getX(i);
  const gz = posAttr.getZ(i);
  const distFromCenter = Math.hypot(gx, gz);
  let hillHeight = -0.18;
  // Keep a broad, guaranteed-clear terrain bowl beneath every track layout.
  // The former radius-75 band allowed hills to cut through wide corners and
  // occlude both the road and vehicle.
  if (distFromCenter > 122) {
    const outer = distFromCenter - 122;
    hillHeight = -0.18 + Math.sin(gx * 0.012) * 2.4 + Math.cos(gz * 0.015) * 2.4 + outer * 0.12;
  }
  posAttr.setY(i, hillHeight);
}
groundGeom.computeVertexNormals();

const groundMat = new THREE.MeshStandardMaterial({
  color: 0x847957,
  roughness: 0.98,
  metalness: 0.0,
});
const ground = new THREE.Mesh(groundGeom, groundMat);
ground.receiveShadow = true;
scene.add(ground);

// Distant mountain ranges
const mountainGroup = new THREE.Group();
mountainGroup.name = 'mountain-backdrop';
const mountainMat = new THREE.MeshStandardMaterial({ color: 0x56676a, roughness: 0.98 });
for (let m = 0; m < 18; m++) {
  const angle = (m / 18) * Math.PI * 2;
  const radius = 220 + (m % 4) * 22;
  const height = 48 + (m % 5) * 16;
  const mGeom = new THREE.ConeGeometry(38 + (m % 3) * 12, height, 7);
  const peak = new THREE.Mesh(mGeom, mountainMat);
  peak.position.set(Math.sin(angle) * radius, height * 0.45 - 5, Math.cos(angle) * radius);
  peak.scale.set(1.4, 1.0, 1.2);
  mountainGroup.add(peak);
}
scene.add(mountainGroup);

// --- Track Layout Generators ---
const layoutConfigs = [
  { points: 14, radius: 76, wave: 11, phase: 0.3, elevation: 3.2 },
  { points: 16, radius: 72, wave: 15, phase: 1.2, elevation: 4.8 },
  { points: 16, radius: 78, wave: 13, phase: 2.4, elevation: 6.2 },
];

function generateTrackPoints(index: number): THREE.Vector3[] {
  const cfg = layoutConfigs[index];
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i < cfg.points; i++) {
    const a = (i / cfg.points) * Math.PI * 2 - Math.PI / 2;
    const r = cfg.radius + Math.sin(i * 1.6 + cfg.phase) * cfg.wave + Math.cos(i * 0.9 + index) * 4.5;
    // A positive datum keeps the complete asphalt ribbon above the shared
    // terrain bowl, including Summit's lowest switchback.
    const y = 7.0 + Math.sin(i * 1.2 + index) * cfg.elevation;
    pts.push(new THREE.Vector3(Math.cos(a) * r, y, Math.sin(a) * r));
  }
  return pts;
}

let roadSystem: RoadSystem | null = null;
let sceneryGroup = new THREE.Group();
scene.add(sceneryGroup);

// Initialize Particle Engine
const particleEngine = new ParticleEngine(scene);
const raceAudio = new RaceAudio();

function buildTrack(index: number) {
  if (roadSystem) {
    scene.remove(roadSystem.group);
  }
  scene.remove(sceneryGroup);
  sceneryGroup = new THREE.Group();
  scene.add(sceneryGroup);

  const points = generateTrackPoints(index);
  const atmospheres = [
    { sky: 0xb8a88d, fog: 0xcbbda3, ground: 0x847957 },
    { sky: 0xa99c8a, fog: 0xbbae96, ground: 0x75684f },
    { sky: 0xaeb5b2, fog: 0xb8b8ad, ground: 0x79765d },
  ];
  const atmosphere = atmospheres[index];
  scene.background = new THREE.Color(atmosphere.sky);
  scene.fog = new THREE.Fog(atmosphere.fog, index === 2 ? 90 : 110, index === 2 ? 370 : 420);
  (ground.material as THREE.MeshStandardMaterial).color.setHex(atmosphere.ground);
  roadSystem = createRoadSystem(points, 8.4, 380, index);
  scene.add(roadSystem.group);

  buildFestivalScenery(index);
}

function buildFestivalScenery(index: number) {
  if (!roadSystem) return;
  const envKit = createFestivalEnvironment(THREE);
  const parts = envKit.userData.parts as Record<string, THREE.Group>;
  const bakedParts = Object.fromEntries(Object.entries(parts).map(([name, part]) => [name, bakeStatic(part)])) as Record<string, THREE.Group>;

  const samples = roadSystem.samples;
  const tangents = roadSystem.tangents;
  const binormals = roadSystem.binormals;
  const total = samples.length;

  const placeProp = (propName: string, idx: number, sideDist: number, rotYOffset = 0, scale = 1.0) => {
    const template = bakedParts[propName];
    if (!template) return;
    const clone = template.clone(true);
    const p = samples[idx % total];
    const side = binormals[idx % total];
    const tan = tangents[idx % total];

    clone.position.copy(p).addScaledVector(side, sideDist);
    clone.rotation.y = Math.atan2(tan.x, tan.z) + rotYOffset;
    clone.scale.setScalar(scale);
    sceneryGroup.add(clone);
  };

  // Common event spine: start/finish reads strongly on every circuit.
  placeProp('startGantry', 0, 0, 0);
  placeProp('marshalHut', 4, -7.8, 0);
  placeProp('buntingLine', 2, 7.2, 0);
  placeProp('spectatorCanopy', 8, 9.2, 0);

  const placeCluster = (name: string, center: number, side: number, offsets: number[], distance: number, scale = 1) =>
    offsets.forEach((offset, n) => placeProp(name, center + offset, side * (distance + (n % 2) * 2.1), side > 0 ? Math.PI : 0, scale * (0.92 + (n % 3) * 0.07)));

  if (index === 0) {
    // ORCHARD: dense hero bend, open vista, then paddock pocket.
    placeCluster('oliveTree', 58, 1, [-12, -7, -2, 4, 10, 16], 10.5, 1.08);
    placeCluster('timberBarrier', 62, -1, [-10, -5, 0, 5, 10], 6.6);
    placeProp('spectatorCanopy', 72, 11.4, Math.PI, 1.12);
    placeProp('marshalHut', 80, 8.4, Math.PI);
    placeCluster('hayBale', 76, -1, [-6, -2, 2, 6], 5.5, 1.05);
    placeCluster('oliveTree', 238, -1, [-14, -8, -1, 7, 14], 12, 1.18);
    placeProp('spectatorCanopy', 252, -11.2, 0, 1.08);
    placeProp('buntingLine', 262, 8.8, Math.PI);
    placeProp('distantScenery', Math.floor(total * 0.42), -112, 0.4, 1.28);
  } else if (index === 1) {
    // QUARRY: readable braking walls, exposed basin and elevated crowd ledge.
    placeCluster('stoneWall', 54, 1, [-14, -8, -2, 4, 10, 16], 7.4, 1.08);
    placeCluster('tireBarrier', 66, -1, [-8, -3, 2, 7], 6.2);
    placeCluster('chevronSign', 72, 1, [-6, 0, 6], 7.3);
    placeProp('marshalHut', 84, 9.5, Math.PI, 1.05);
    placeCluster('stoneWall', 205, -1, [-15, -9, -3, 3, 9, 15], 7.5, 1.14);
    placeProp('spectatorCanopy', 220, -11.8, 0, 1.08);
    placeCluster('cypressTree', 244, 1, [-9, 0, 11], 13, 1.12);
    placeProp('distantScenery', Math.floor(total * 0.34), 122, -0.5, 0.9);
  } else {
    // SUMMIT: quiet exposed ridge followed by a concentrated championship finale.
    placeCluster('stoneWall', 118, -1, [-15, -9, -3, 3, 9, 15], 7.2, 1.12);
    placeCluster('cypressTree', 132, 1, [-12, -4, 6, 16], 12.5, 1.22);
    placeProp('marshalHut', 144, 8.8, Math.PI, 1.08);
    placeCluster('spectatorCanopy', 272, -1, [-16, 0, 17], 12.2, 1.12);
    placeCluster('buntingLine', 286, 1, [-12, 0, 12], 8.5, 1.08);
    placeCluster('stoneWall', 304, -1, [-12, -6, 0, 6, 12], 7.4, 1.16);
    placeCluster('hayBale', 330, 1, [-8, -3, 2, 7], 5.6, 1.05);
    placeProp('distantScenery', Math.floor(total * 0.52), -135, 0.4, 1.08);
  }

  // Low-cost foreground parallax, deliberately concentrated around authored zones.
  const grassCount = index === 0 ? 170 : index === 1 ? 95 : 120;
  const grass = new THREE.InstancedMesh(
    new THREE.ConeGeometry(0.12, 0.75, 5),
    new THREE.MeshStandardMaterial({ color: index === 1 ? 0x776f50 : 0x8f8a5c, roughness: 1 }),
    grassCount,
  );
  const grassDummy = new THREE.Object3D();
  for (let i = 0; i < grassCount; i++) {
    const route = index === 0 ? (44 + i * 1.23) % total : index === 1 ? (38 + i * 2.1) % total : (100 + i * 1.7) % total;
    const sideSign = i % 2 ? 1 : -1;
    grassDummy.position.copy(samples[Math.floor(route)]).addScaledVector(binormals[Math.floor(route)], sideSign * (5.2 + (i % 7) * 0.42));
    grassDummy.position.y += 0.32;
    grassDummy.rotation.set(0, i * 2.17, sideSign * 0.08);
    grassDummy.scale.set(0.8 + (i % 3) * 0.16, 0.75 + (i % 5) * 0.12, 0.8 + (i % 4) * 0.1);
    grassDummy.updateMatrix();
    grass.setMatrixAt(i, grassDummy.matrix);
  }
  grass.instanceMatrix.needsUpdate = true;
  sceneryGroup.add(grass);

  // Crowd banks read as warm colour clusters at racing distance: two draws per bank,
  // no uncanny close-up figures and no randomly scattered one-off meshes.
  const addCrowdBank = (center: number, sideSign: number, count: number, spread: number) => {
    const bodies = new THREE.InstancedMesh(
      new THREE.CapsuleGeometry(0.13, 0.34, 3, 6),
      new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.92 }),
      count,
    );
    const heads = new THREE.InstancedMesh(
      new THREE.SphereGeometry(0.13, 7, 5),
      new THREE.MeshStandardMaterial({ color: 0xb98262, roughness: 0.96 }),
      count,
    );
    const palette = [0xc86845, 0xd5a23b, 0x53694c, 0x507d92, 0xefe1c6];
    const bodyDummy = new THREE.Object3D();
    const headDummy = new THREE.Object3D();
    for (let i = 0; i < count; i++) {
      const routeIndex = (center + Math.round((i / Math.max(1, count - 1) - 0.5) * spread) + total) % total;
      const rank = Math.floor(i / 9);
      const lateral = sideSign * (8.2 + rank * 1.05 + (i % 3) * 0.24);
      const base = samples[routeIndex].clone().addScaledVector(binormals[routeIndex], lateral);
      base.y += 0.52 + rank * 0.12;
      bodyDummy.position.copy(base);
      bodyDummy.rotation.set(0, Math.atan2(tangents[routeIndex].x, tangents[routeIndex].z) + (sideSign > 0 ? Math.PI : 0), 0);
      bodyDummy.scale.setScalar(0.92 + (i % 4) * 0.04);
      bodyDummy.updateMatrix();
      bodies.setMatrixAt(i, bodyDummy.matrix);
      bodies.setColorAt(i, new THREE.Color(palette[(i * 3 + center) % palette.length]));
      headDummy.position.copy(base).add(new THREE.Vector3(0, 0.48, 0));
      headDummy.scale.setScalar(0.9 + (i % 3) * 0.05);
      headDummy.updateMatrix();
      heads.setMatrixAt(i, headDummy.matrix);
    }
    bodies.instanceMatrix.needsUpdate = true;
    bodies.instanceColor!.needsUpdate = true;
    heads.instanceMatrix.needsUpdate = true;
    bodies.name = 'spectator-colour-bank';
    heads.name = 'spectator-head-bank';
    sceneryGroup.add(bodies, heads);
  };

  if (index === 0) {
    addCrowdBank(72, 1, 30, 28);
    addCrowdBank(250, -1, 24, 22);
  } else if (index === 1) {
    addCrowdBank(84, 1, 22, 18);
    addCrowdBank(220, -1, 28, 26);
  } else {
    addCrowdBank(286, -1, 42, 38);
    addCrowdBank(8, 1, 34, 26);
  }
}

// --- Racers & Vehicles Setup ---
const playerCar = createHeroCoupe(THREE);
scene.add(playerCar);

const rivalCharger = createRivalCar(THREE, 'CHARGER');
const rivalTech = createRivalCar(THREE, 'TECHNICIAN');
const rivalDefender = createRivalCar(THREE, 'DEFENDER');
scene.add(rivalCharger, rivalTech, rivalDefender);

const rivalCars = [rivalCharger, rivalTech, rivalDefender];
const rivalIds: RivalId[] = ['CHARGER', 'TECHNICIAN', 'DEFENDER'];

type Racer = {
  id: 'PLAYER' | RivalId;
  car: THREE.Group;
  progress: number;
  checkpoint: number;
  lap: number;
  speed: number;
  lane: number;
  finished: boolean;
  finishTime: number;
};

let racers: Racer[] = [];
let player: CarState = { speed: 0, heading: 0, slip: 0, steerAngle: 0, x: 0, z: 0, offroad: false };

let mode: 'championship' | 'quick' = 'championship';
const requestedCaptureTrack = /^(localhost|127\.0\.0\.1)$/.test(location.hostname)
  ? Number(new URLSearchParams(location.search).get('track'))
  : 0;
let raceIndex = Number.isInteger(requestedCaptureTrack) ? THREE.MathUtils.clamp(requestedCaptureTrack, 0, 2) : 0;
let racing = false;
let paused = false;
let countdown = 0;
let raceClock = 0;
let last = performance.now();
let fps = 60;
let frames = 0;
let fpsStamp = last;
let standings: Standing[] = [];
let prevThrottle = 0;
let lastCountdownNumber = 4;

const keys = new Set<string>();
let touchSteer = 0;
let touchThrottle = 0;
let touchBrake = 0;
let touchHandbrake = false;
let directionLeft = false;
let directionRight = false;
let directionUp = false;
let directionDown = false;

const freshStandings = () =>
  ['PLAYER', 'CHARGER', 'TECHNICIAN', 'DEFENDER'].map(id => ({
    id,
    points: 0,
    wins: 0,
    bestFinish: 99,
    lastFinish: 99,
  }));

function nearestTrack(pos: THREE.Vector3) {
  if (!roadSystem) return { t: 0, distance: 0, idx: 0 };
  const samples = roadSystem.samples;
  const nearest = nearestTrackXZ(pos, samples);
  return { t: nearest.idx / samples.length, ...nearest };
}

function placeRacer(r: Racer, t: number, lane: number) {
  if (!roadSystem) return;
  const clampedT = ((t % 1) + 1) % 1;
  const p = roadSystem.curve.getPointAt(clampedT);
  const tan = roadSystem.curve.getTangentAt(clampedT).setY(0).normalize();
  const side = new THREE.Vector3(-tan.z, 0, tan.x);

  r.car.position.copy(p).addScaledVector(side, lane);
  r.car.position.y += 0.16;
  r.car.rotation.y = Math.atan2(tan.x, tan.z);
}

function showPreRace() {
  const race = RACES[raceIndex];
  $('#menu').classList.add('hidden');
  $('#results').classList.add('hidden');
  $('#preRace').classList.remove('hidden');
  $('#round').textContent = `ROUND ${raceIndex + 1} OF 3`;
  $('#raceName').textContent = race.name;
  $('#raceCopy').textContent = [
    "Flowing orchard bends reward bravery — watch for the Charger diving on late braking.",
    "Craggy rock faces and tight apexes give the Technician clean air to exploit.",
    "High summit switchbacks demand patience: set up switchbacks against the Defender.",
  ][raceIndex];
}

function updateCameraPosition(dt: number, isCountdown = false) {
  const heading = player.heading;
  const dir = new THREE.Vector3(Math.sin(heading), 0, Math.cos(heading));
  const isPortrait = innerWidth < innerHeight;

  const dist = isPortrait ? 6.4 : 5.4;
  const height = isPortrait ? 3.1 : 2.4;

  if (isCountdown) {
    const gridCamTarget = playerCar.position.clone().addScaledVector(dir, -4.5).add(new THREE.Vector3(0, 1.65, 0));
    camera.position.lerp(gridCamTarget, dt > 0 ? 1 - Math.exp(-6 * dt) : 1);
    camera.lookAt(playerCar.position.clone().addScaledVector(dir, 8.5).add(new THREE.Vector3(0, 0.9, 0)));
  } else {
    const target = playerCar.position.clone().addScaledVector(dir, -dist).add(new THREE.Vector3(0, height, 0));
    const side = new THREE.Vector3(-dir.z, 0, dir.x);
    target.addScaledVector(side, -player.steerAngle * 0.65);

    // High-speed visceral camera shake (> 80 km/h)
    const kph = Math.abs(player.speed) * 3.6;
    if (kph > 80) {
      const shakeAmt = Math.min(0.06, (kph - 80) * 0.0008);
      target.x += (Math.random() - 0.5) * shakeAmt;
      target.y += (Math.random() - 0.5) * shakeAmt;
      target.z += (Math.random() - 0.5) * shakeAmt;
    }

    camera.position.lerp(target, dt > 0 ? 1 - Math.exp(-6 * dt) : 1);
    const lookTarget = playerCar.position.clone().addScaledVector(dir, 7.5).add(new THREE.Vector3(0, 0.75, 0));
    camera.lookAt(lookTarget);
  }

  const baseFov = isPortrait ? 60 : 54;
  const speedKick = Math.min(8, Math.abs(player.speed) * 0.18);
  camera.fov = THREE.MathUtils.damp(camera.fov, baseFov + speedKick, 4, dt || 0.016);
  camera.updateProjectionMatrix();
}

function resetRace() {
  void raceAudio.unlock();
  buildTrack(raceIndex);
  raceClock = 0;
  countdown = 3.7;
  lastCountdownNumber = 4;
  racing = true;
  paused = false;

  $('#preRace').classList.add('hidden');
  $('#results').classList.add('hidden');
  $('#hud').classList.remove('hidden');
  $('#touch').classList.toggle('hidden', !matchMedia('(pointer:coarse)').matches);

  racers = [
    { id: 'PLAYER', car: playerCar, progress: 0.005, checkpoint: 0, lap: 1, speed: 0, lane: -1.35, finished: false, finishTime: 0 },
    ...rivalCars.map((car, i) => ({
      id: rivalIds[i],
      car,
      progress: 0.994 - i * 0.008,
      checkpoint: 3,
      lap: 0,
      speed: 0,
      lane: [1.35, -1.35, 1.35][i],
      finished: false,
      finishTime: 0,
    })),
  ];

  racers.forEach(r => placeRacer(r, r.progress, r.lane));

  const p = playerCar.position;
  player = { speed: 0, heading: playerCar.rotation.y, slip: 0, steerAngle: 0, x: p.x, z: p.z, offroad: false };

  updateCameraPosition(0, true);
  updateHud();
}

function updateHud() {
  const p = racers[0];
  const rank = p ? 1 + racers.filter(r => r !== p && r.lap + r.progress > p.lap + p.progress).length : 1;
  $('#position').textContent = `${rank} / 4`;
  $('#lap').textContent = `${Math.min(p?.lap || 1, 2)} / 2`;
  const kph = Math.round(Math.abs(player.speed) * 3.6);
  $('#speed').textContent = String(kph).padStart(3, '0');
  $('#raceLabel').textContent = RACES[raceIndex].name;

  // Analog Tachometer updates
  const needle = $<HTMLElement>('#tachoNeedle');
  const rpmNum = $<HTMLElement>('#tachoRpm');
  if (needle && rpmNum) {
    const gear = kph < 35 ? 1 : kph < 65 ? 2 : kph < 95 ? 3 : kph < 125 ? 4 : 5;
    const gearMax = [0, 38, 70, 102, 132, 160][gear];
    const gearMin = [0, 0, 32, 62, 92, 122][gear];
    const revFraction = THREE.MathUtils.clamp((kph - gearMin) / (gearMax - gearMin), 0.15, 1.0);
    const needleDeg = -120 + revFraction * 240;
    needle.style.transform = `rotate(${needleDeg}deg)`;
    rpmNum.textContent = String(gear);
  }
}

function finishRace() {
  if (!racing) return;
  racing = false;
  raceAudio.cue('finish');
  const order = [...racers]
    .sort((a, b) =>
      a.finished === b.finished
        ? a.finished
          ? a.finishTime - b.finishTime
          : b.lap + b.progress - (a.lap + a.progress)
        : a.finished
          ? -1
          : 1,
    )
    .map(r => r.id);

  if (mode === 'championship') standings = awardRace(standings, order);
  const rank = order.indexOf('PLAYER') + 1;
  const final = mode === 'championship' && raceIndex === 2;
  const table = rankedStandings(standings);

  $('#resultKicker').textContent = `${RACES[raceIndex].name} · ${[10, 7, 4, 2][rank - 1]} POINTS`;
  $('#resultTitle').textContent = final
    ? table[0].id === 'PLAYER'
      ? 'CANTERA CHAMPION'
      : 'CHAMPIONSHIP COMPLETE'
    : rank === 1
      ? 'STAGE WIN'
      : 'RACE COMPLETE';

  $('#raceOrder').innerHTML = order
    .map((id, i) => `<div><span>${i + 1}</span><b class="${id.toLowerCase()}">${id}</b></div>`)
    .join('');
  $('#standings').innerHTML = table
    .map((s, i) => `<div><span>${i + 1}</span><b>${s.id}</b><em>${s.points} PTS</em></div>`)
    .join('');
  $('#next').textContent = final ? 'NEW CHAMPIONSHIP' : mode === 'quick' ? 'RACE AGAIN' : 'NEXT RACE';
  $('#hud').classList.add('hidden');
  $('#touch').classList.add('hidden');
  $('#results').classList.remove('hidden');
}

function resetPlayer() {
  if (!roadSystem) return;
  const t = racers[0]?.progress || 0;
  const p = roadSystem.curve.getPointAt(t);
  const tan = roadSystem.curve.getTangentAt(t).setY(0).normalize();
  player = { speed: 0, heading: Math.atan2(tan.x, tan.z), slip: 0, steerAngle: 0, x: p.x, z: p.z, offroad: false };
  playerCar.position.copy(p);
  playerCar.position.y += 0.16;
  updateCameraPosition(0, false);
}

function update(dt: number) {
  if (!racing || paused || !roadSystem) return;
  raceClock += dt;
  particleEngine.update(dt);

  if (countdown > 0) {
    raceAudio.update(0, 0, 0, false, raceIndex);
    countdown -= dt;
    const countdownNumber = Math.ceil(countdown);
    if (countdownNumber > 0 && countdownNumber < lastCountdownNumber) {
      raceAudio.cue('count');
      lastCountdownNumber = countdownNumber;
    }
    if (countdown <= 0 && lastCountdownNumber !== 0) {
      raceAudio.cue('go');
      lastCountdownNumber = 0;
    }
    $('#countdown').textContent = countdown > 0.55 ? String(Math.ceil(countdown)) : 'GO!';
    if (countdown <= 0) setTimeout(() => ($('#countdown').textContent = ''), 500);

    updateCameraPosition(dt, true);
    return;
  }

  const throttle = (keys.has('KeyW') || keys.has('ArrowUp') ? 1 : 0) || touchThrottle || (directionUp ? 1 : 0);
  const brake = (keys.has('KeyS') || keys.has('ArrowDown') ? 1 : 0) || touchBrake || (directionDown ? 1 : 0);
  const steer =
    (keys.has('KeyA') || keys.has('ArrowLeft') ? 1 : 0) +
    (keys.has('KeyD') || keys.has('ArrowRight') ? -1 : 0) -
    touchSteer + (directionLeft ? 1 : 0) - (directionRight ? 1 : 0);
  const handbrake = keys.has('Space') || touchHandbrake;

  const before = nearestTrack(playerCar.position);
  player.offroad = before.distance > 4.3;
  player = stepCar(player, { throttle, brake, steer, handbrake }, dt);
  raceAudio.update(player.speed, throttle, player.slip, player.offroad, raceIndex);

  const after = nearestTrack(new THREE.Vector3(player.x, 0, player.z));
  const trackPoint = roadSystem.curve.getPointAt(after.t);

  // Soft barrier boundary rebound
  if (after.distance > 5.2) {
    const toTrack = trackPoint.clone().sub(new THREE.Vector3(player.x, 0, player.z)).setY(0).normalize();
    player.x += toTrack.x * (after.distance - 5.1) * 0.45;
    player.z += toTrack.z * (after.distance - 5.1) * 0.45;
    player.speed *= 0.88;
  }

  playerCar.position.set(player.x, trackPoint.y + 0.16, player.z);
  playerCar.rotation.y = player.heading;

  // Dynamic Suspension Simulation (Chassis roll & pitch)
  const parts = playerCar.userData.parts;
  if (parts) {
    // Body roll into corners & slip
    const bodyRoll = -player.steerAngle * 0.1 - player.slip * 0.18;
    // Body pitch (dive on brake, squat on acceleration)
    const bodyPitch = brake * 0.05 - throttle * 0.035;
    parts.body.rotation.z = THREE.MathUtils.damp(parts.body.rotation.z, bodyRoll, 8, dt);
    parts.body.rotation.x = THREE.MathUtils.damp(parts.body.rotation.x, bodyPitch, 8, dt);

    // Front wheels steering & all wheels spinning
    parts.wheelFL.rotation.y = player.steerAngle * 0.26;
    parts.wheelFR.rotation.y = player.steerAngle * 0.26;
    const spin = (player.speed * dt) / 0.31;
    parts.meshFL.rotation.x -= spin;
    parts.meshFR.rotation.x -= spin;
    parts.meshRL.rotation.x -= spin;
    parts.meshRR.rotation.x -= spin;

    // Dynamic brake lamp flares
    if (parts.tailLampMaterial) {
      const isBraking = brake > 0.05 || handbrake;
      parts.tailLampMaterial.emissiveIntensity = isBraking ? 2.8 : 0.6;
      parts.tailLampMaterial.color.setHex(isBraking ? 0xff2010 : 0xb51c19);
    }

    // Exhaust backfire flame bursts on sudden throttle lift-off or handbrake
    if (prevThrottle > 0.7 && throttle < 0.2 && Math.abs(player.speed) > 15) {
      const carDir = new THREE.Vector3(Math.sin(player.heading), 0, Math.cos(player.heading));
      const exPos = playerCar.position.clone().addScaledVector(carDir, -1.8).add(new THREE.Vector3(0, 0.22, 0));
      particleEngine.spawnBackfire(exPos, carDir);
    }
  }
  prevThrottle = throttle;

  // Spawn volumetric golden dust & tire smoke
  const dir = new THREE.Vector3(Math.sin(player.heading), 0, Math.cos(player.heading));
  const side = new THREE.Vector3(-dir.z, 0, dir.x);
  const rearL = new THREE.Vector3(player.x, trackPoint.y + 0.1, player.z).addScaledVector(dir, -1.2).addScaledVector(side, -0.75);
  const rearR = new THREE.Vector3(player.x, trackPoint.y + 0.1, player.z).addScaledVector(dir, -1.2).addScaledVector(side, 0.75);

  if (Math.abs(player.speed) > 4) {
    const dustInt = Math.abs(player.slip) * 1.5 + (player.offroad ? 1.2 : 0.25);
    particleEngine.spawnDust(rearL, dustInt);
    particleEngine.spawnDust(rearR, dustInt);
  }

  // White tire smoke during drifts
  if (Math.abs(player.slip) > 0.16 && Math.abs(player.speed) > 8) {
    particleEngine.spawnSmoke(rearL, Math.abs(player.slip) * 1.8);
    particleEngine.spawnSmoke(rearR, Math.abs(player.slip) * 1.8);
  }

  // Lap & checkpoint tracking
  const pr = racers[0];
  const prev = pr.progress;
  pr.progress = after.t;
  if (pr.checkpoint === 0 && after.t > 0.22 && after.t < 0.45) pr.checkpoint = 1;
  if (pr.checkpoint === 1 && after.t > 0.47 && after.t < 0.7) pr.checkpoint = 2;
  if (pr.checkpoint === 2 && after.t > 0.72 && after.t < 0.94) pr.checkpoint = 3;
  if (prev > 0.8 && after.t < 0.2 && pr.checkpoint === 3) {
    pr.checkpoint = 0;
    pr.lap++;
    if (pr.lap <= 2) raceAudio.cue('lap');
    if (pr.lap > 2) {
      pr.finished = true;
      pr.finishTime = raceClock;
      finishRace();
      return;
    }
  }

  // AI Rivals Update with distinctive racing personalities
  for (let i = 1; i < racers.length; i++) {
    const r = racers[i];
    const tune = RIVAL_TUNING[r.id as RivalId];
    if (r.finished) continue;

    const bend = roadSystem.curve
      .getTangentAt((r.progress + 0.018) % 1)
      .angleTo(roadSystem.curve.getTangentAt((r.progress + 0.045) % 1));
    let target = tune.topSpeed * (1 - Math.min(0.5, bend * 1.35));

    if (r.id === 'CHARGER' && Math.sin(raceClock * 0.75 + i * 4) > 0.985) {
      target *= 1 - tune.mistakeLoss;
    }

    const delta = pr.lap + pr.progress - (r.lap + r.progress);
    if (r.id === 'DEFENDER' && delta < 0.035 && delta > -0.01) {
      r.lane = THREE.MathUtils.damp(r.lane, Math.sign(pr.lane || 1) * 1.75, 3, dt);
    } else if (r.id === 'CHARGER' && Math.abs(delta) < 0.025) {
      r.lane = THREE.MathUtils.damp(r.lane, -Math.sign(pr.lane || 1) * 2.1, 4, dt);
    } else {
      r.lane = THREE.MathUtils.damp(r.lane, r.id === 'TECHNICIAN' ? 0 : i % 2 ? 1.1 : -1.1, tune.lineSmoothing, dt);
    }

    r.speed = THREE.MathUtils.damp(r.speed, target, tune.launch * 1.25, dt);
    r.progress += (r.speed * dt) / roadSystem.curve.getLength();
    if (r.progress >= 1) {
      r.progress--;
      r.lap++;
      if (r.lap > 2) {
        r.finished = true;
        r.finishTime = raceClock;
      }
    }
    placeRacer(r, r.progress, r.lane);

    // AI wheel spin
    const rParts = r.car.userData.parts;
    if (rParts) {
      const rSpin = (r.speed * dt) / 0.31;
      rParts.meshFL.rotation.x -= rSpin;
      rParts.meshFR.rotation.x -= rSpin;
      rParts.meshRL.rotation.x -= rSpin;
      rParts.meshRR.rotation.x -= rSpin;
    }

    // Car-to-car collision
    if (r.car.position.distanceTo(playerCar.position) < 1.6) {
      raceAudio.impact(Math.abs(player.speed - r.speed) / 43);
      player.speed *= 0.88;
      const push = playerCar.position.clone().sub(r.car.position).setY(0).normalize().multiplyScalar(0.09);
      player.x += push.x;
      player.z += push.z;
    }
  }

  const tanAtPlayer = roadSystem.tangents[after.idx];
  pr.lane = new THREE.Vector3(player.x, 0, player.z)
    .sub(trackPoint)
    .dot(new THREE.Vector3(-tanAtPlayer.z, 0, tanAtPlayer.x));

  updateCameraPosition(dt, false);
  updateHud();
}

function startChampionship() {
  mode = 'championship';
  raceIndex = 0;
  standings = freshStandings();
  $('#menu').classList.add('hidden');
  resetRace();
}

$('#championship').addEventListener('click', startChampionship);
$('#quick').addEventListener('click', () => {
  mode = 'quick';
  raceIndex = 0;
  standings = freshStandings();
  $('#menu').classList.add('hidden');
  resetRace();
});
$('#grid').addEventListener('click', resetRace);
$('#how').addEventListener('click', () => $('#brief').classList.remove('hidden'));
$('#close').addEventListener('click', () => $('#brief').classList.add('hidden'));
$('#menuButton').addEventListener('click', () => location.reload());
$('#next').addEventListener('click', () => {
  if (mode === 'championship' && raceIndex < 2) {
    raceIndex++;
    showPreRace();
  } else if (mode === 'championship') {
    startChampionship();
  } else {
    resetRace();
  }
});

addEventListener('keydown', e => {
  void raceAudio.unlock();
  keys.add(e.code);
  if (e.code === 'KeyR' && racing) resetPlayer();
  if (e.code === 'Escape') paused = !paused;
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) e.preventDefault();
});
addEventListener('keyup', e => keys.delete(e.code));

// Touch Steering & Pedal Controls
const pad = $<HTMLElement>('#steerPad');
const knob = $<HTMLElement>('#steerKnob');
const directionPad = $<HTMLElement>('#directionPad');
const steerMode = $<HTMLButtonElement>('#steerMode');

function clearSteering() {
  touchSteer = 0;
  directionLeft = false;
  directionRight = false;
  directionUp = false;
  directionDown = false;
  knob.style.transform = '';
  directionPad.querySelectorAll('button').forEach(button => button.classList.remove('pressed'));
}

steerMode.addEventListener('click', () => {
  clearSteering();
  const arrowsActive = steerMode.getAttribute('aria-pressed') !== 'true';
  steerMode.setAttribute('aria-pressed', String(arrowsActive));
  steerMode.setAttribute('aria-label', arrowsActive ? 'Switch to analog steering' : 'Switch to directional controls');
  steerMode.textContent = arrowsActive ? 'USE ANALOG' : 'USE ARROWS';
  pad.classList.toggle('hidden', arrowsActive);
  directionPad.classList.toggle('hidden', !arrowsActive);
});

for (const [id, setPressed] of [
  ['directionLeft', (pressed: boolean) => (directionLeft = pressed)],
  ['directionRight', (pressed: boolean) => (directionRight = pressed)],
  ['directionUp', (pressed: boolean) => (directionUp = pressed)],
  ['directionDown', (pressed: boolean) => (directionDown = pressed)],
] as const) {
  const button = $<HTMLButtonElement>(`#${id}`);
  button.addEventListener('pointerdown', e => {
    e.preventDefault();
    void raceAudio.unlock();
    button.setPointerCapture(e.pointerId);
    setPressed(true);
    button.classList.add('pressed');
  });
  const release = () => {
    setPressed(false);
    button.classList.remove('pressed');
  };
  button.addEventListener('pointerup', release);
  button.addEventListener('pointercancel', release);
  button.addEventListener('lostpointercapture', release);
}
$<HTMLElement>('#touch').addEventListener('contextmenu', e => e.preventDefault());

function steerTouch(e: PointerEvent) {
  if (steerMode.getAttribute('aria-pressed') === 'true') return;
  const r = pad.getBoundingClientRect();
  touchSteer = THREE.MathUtils.clamp((e.clientX - r.left - r.width / 2) / (r.width * 0.38), -1, 1);
  knob.style.transform = `translateX(${touchSteer * 38}px)`;
}

pad.addEventListener('pointerdown', e => {
  void raceAudio.unlock();
  pad.setPointerCapture(e.pointerId);
  steerTouch(e);
});
pad.addEventListener('pointermove', e => {
  if (pad.hasPointerCapture(e.pointerId)) steerTouch(e);
});
const releaseAnalog = () => {
  touchSteer = 0;
  knob.style.transform = '';
};
pad.addEventListener('pointerup', releaseAnalog);
pad.addEventListener('pointercancel', releaseAnalog);
pad.addEventListener('lostpointercapture', releaseAnalog);

for (const [id, set] of [
  ['throttle', (v: number) => (touchThrottle = v)],
  ['brake', (v: number) => (touchBrake = v)],
  ['handbrake', (v: number) => (touchHandbrake = !!v)],
] as const) {
  const el = $<HTMLElement>(`#${id}`);
  el.addEventListener('pointerdown', e => {
    void raceAudio.unlock();
    el.setPointerCapture(e.pointerId);
    set(1);
  });
  el.addEventListener('pointerup', () => set(0));
  el.addEventListener('pointercancel', () => set(0));
  el.addEventListener('lostpointercapture', () => set(0));
}

function frame(now: number) {
  requestAnimationFrame(frame);
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;

  if (!racing && !$('#menu').classList.contains('hidden')) updateMenuPreview(dt);
  update(dt);
  renderer.render(scene, camera);

  frames++;
  if (now - fpsStamp > 600) {
    fps = (frames * 1000) / (now - fpsStamp);
    frames = 0;
    fpsStamp = now;
  }

  const p = racers[0];
  window.__GAME__ = {
    pos: [playerCar.position.x, playerCar.position.z],
    fps,
    speed: player.speed,
    score: standings.find(s => s.id === 'PLAYER')?.points || 0,
    over: !racing && !!p,
    draws: renderer.info.render.calls,
    tris: renderer.info.render.triangles,
    progress: p?.progress || 0,
    drift: Math.abs(player.slip),
    route: RACES[raceIndex].id,
    construction: 0,
    modules: 1,
    heading: player.heading,
    position: p ? 1 + racers.filter(r => r !== p && r.lap + r.progress > p.lap + p.progress).length : 1,
    aiProgress: racers.slice(1).map(r => r.progress),
    mode,
  };
}

addEventListener('resize', () => {
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  updateCameraPosition(0, countdown > 0);
});

// Initial Setup
buildTrack(raceIndex);
const preview: Racer = {
  id: 'PLAYER',
  car: playerCar,
  progress: 0.005,
  checkpoint: 0,
  lap: 1,
  speed: 0,
  lane: -1.35,
  finished: false,
  finishTime: 0,
};
const menuPreviewRacers: Racer[] = [preview, ...rivalCars.map((car, i) => ({
  ...preview,
  id: rivalIds[i],
  car,
}))];
const menuPreviewOffsets = [0, 0.023, 0.045, -0.019];
const menuPreviewLanes = [-0.7, 1.55, -1.35, 1.2];
const menuPreviewLook = new THREE.Vector3();
const menuTrackLength = roadSystem!.curve.getLength();
const reduceMenuMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
let menuPreviewTime = 0;

function updateMenuPreview(dt: number, immediate = false) {
  if (!roadSystem) return;
  if (!reduceMenuMotion) menuPreviewTime += dt;
  const progress = (0.07 + menuPreviewTime * 17 / menuTrackLength) % 1;
  menuPreviewRacers.forEach((racer, i) => {
    placeRacer(racer, (progress + menuPreviewOffsets[i] + 1) % 1, menuPreviewLanes[i]);
    if (dt > 0 && !reduceMenuMotion) {
      const wheels = racer.car.userData.parts;
      const spin = 17 * dt / 0.31;
      for (const part of ['meshFL', 'meshFR', 'meshRL', 'meshRR']) {
        if (wheels?.[part]) wheels[part].rotation.x -= spin;
      }
    }
  });

  const heading = playerCar.rotation.y;
  const forward = new THREE.Vector3(Math.sin(heading), 0, Math.cos(heading));
  const right = new THREE.Vector3(-forward.z, 0, forward.x);
  const portrait = innerWidth < innerHeight;
  const cameraTarget = playerCar.position.clone()
    .addScaledVector(forward, portrait ? -12 : -11.5)
    .addScaledVector(right, portrait ? 0 : -1)
    .add(new THREE.Vector3(0, portrait ? 5.1 : 4.1, 0));
  const lookTarget = playerCar.position.clone()
    .addScaledVector(forward, portrait ? 9 : 13)
    .addScaledVector(right, portrait ? 0 : -4)
    .add(new THREE.Vector3(0, 0.8, 0));
  if (immediate) {
    camera.position.copy(cameraTarget);
    menuPreviewLook.copy(lookTarget);
  } else {
    camera.position.lerp(cameraTarget, 1 - Math.exp(-3 * dt));
    menuPreviewLook.lerp(lookTarget, 1 - Math.exp(-3 * dt));
  }
  camera.lookAt(menuPreviewLook);
}

updateMenuPreview(0, true);

standings = freshStandings();
window.__READY__ = true;
window.__START__ = resetRace;
window.__GAME__ = {
  pos: [0, 0],
  fps: 0,
  speed: 0,
  score: 0,
  over: false,
  draws: 0,
  tris: 0,
  progress: 0,
  drift: 0,
  route: 'MENU',
  construction: 0,
  modules: 1,
  heading: 0,
};

frame(performance.now());
