import * as THREE from 'three';
import createHeroCoupe from './assets/hero_coupe.js';
import createRivalCar from './assets/rival_cars.js';
import { createRoadSystem, type RoadSystem } from './road_system';
import createFestivalEnvironment from './assets/festival_environment.js';
import { awardRace, rankedStandings, RACES, RIVAL_TUNING, stepCar, type CarState, type RivalId, type Standing } from './race';
import './styles.css';

const $ = <T extends Element>(q: string) => document.querySelector<T>(q)!;
const app = $<HTMLDivElement>('#app');

app.innerHTML = `
<main id="menu" class="screen">
  <section class="card hero">
    <p class="kicker">THE CANTERA HILL-CLIMB · 1982</p>
    <h1>ROAD<br><i>ZERO</i></h1>
    <p class="lede">Three persistent rivals. Three mountain roads. Learn how they drive.</p>
    <div class="actions">
      <button id="championship" class="primary">START CHAMPIONSHIP</button>
      <button id="quick">QUICK RACE</button>
      <button id="how">HOW TO PLAY</button>
    </div>
    <p class="keys">WASD / ARROWS TO DRIVE · SPACE TO SLIP · R TO RESET · ESC TO PAUSE</p>
  </section>
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
  <div id="notice"></div>
</div>
<div id="touch" class="hidden">
  <div id="steerPad"><span id="steerKnob"></span></div>
  <div class="pedals">
    <button id="brake">BRAKE</button>
    <button id="throttle">GO</button>
    <button id="handbrake">SLIP</button>
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
renderer.toneMappingExposure = 1.15;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
app.prepend(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xaf9f87);
scene.fog = new THREE.Fog(0xc5b497, 110, 400);

const camera = new THREE.PerspectiveCamera(54, innerWidth / innerHeight, 0.1, 750);

// --- Golden Hour Lighting Rig (Analog Hillside Festival) ---
// Hemisphere sky/ground ambient fill
const hemi = new THREE.HemisphereLight(0xa5c4cc, 0x826046, 1.8);
scene.add(hemi);

// Warm low-angle golden sunlight
const sun = new THREE.DirectionalLight(0xffd594, 3.8);
sun.position.set(-65, 75, -45);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
sun.shadow.camera.near = 10;
sun.shadow.camera.far = 350;
sun.shadow.camera.left = -90;
sun.shadow.camera.right = 90;
sun.shadow.camera.top = 90;
sun.shadow.camera.bottom = -90;
sun.shadow.bias = -0.0003;
scene.add(sun);

// Subtle golden fill light for shadow softening
const sunFill = new THREE.DirectionalLight(0xffe2b8, 0.9);
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
  const distFromTrack = Math.abs(distFromCenter - 75);
  let hillHeight = -0.18;
  if (distFromTrack > 18) {
    hillHeight = Math.sin(gx * 0.012) * 3.5 + Math.cos(gz * 0.015) * 3.5 + (distFromTrack > 35 ? (distFromTrack - 35) * 0.22 : 0);
  }
  posAttr.setY(i, hillHeight);
}
groundGeom.computeVertexNormals();

const groundMat = new THREE.MeshStandardMaterial({
  color: 0x827756,
  roughness: 0.98,
  metalness: 0.0,
});
const ground = new THREE.Mesh(groundGeom, groundMat);
ground.receiveShadow = true;
scene.add(ground);

// Distant mountain ranges
const mountainGroup = new THREE.Group();
mountainGroup.name = 'mountain-backdrop';
const mountainMat = new THREE.MeshStandardMaterial({ color: 0x5a6a6d, roughness: 0.98 });
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
    const y = 1.4 + Math.sin(i * 1.2 + index) * cfg.elevation;
    pts.push(new THREE.Vector3(Math.cos(a) * r, y, Math.sin(a) * r));
  }
  return pts;
}

let roadSystem: RoadSystem | null = null;
let sceneryGroup = new THREE.Group();
scene.add(sceneryGroup);

function buildTrack(index: number) {
  if (roadSystem) {
    scene.remove(roadSystem.group);
  }
  scene.remove(sceneryGroup);
  sceneryGroup = new THREE.Group();
  scene.add(sceneryGroup);

  const points = generateTrackPoints(index);
  roadSystem = createRoadSystem(points, 8.4, 380);
  scene.add(roadSystem.group);

  buildFestivalScenery(index);
}

function buildFestivalScenery(index: number) {
  if (!roadSystem) return;
  const envKit = createFestivalEnvironment(THREE);
  const parts = envKit.userData.parts as Record<string, THREE.Group>;

  const samples = roadSystem.samples;
  const tangents = roadSystem.tangents;
  const binormals = roadSystem.binormals;
  const total = samples.length;

  const placeProp = (propName: string, idx: number, sideDist: number, rotYOffset = 0, scale = 1.0) => {
    const template = parts[propName];
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

  // 1. Starting grid & Finish landmark at start (idx ~0)
  placeProp('marshalHut', 4, -7.5, 0);
  placeProp('buntingLine', 2, 6.8, 0);
  placeProp('spectatorCanopy', 8, 8.5, 0);

  // 2. Continuous stone retaining walls and timber barriers along corners
  for (let i = 0; i < total; i += 7) {
    const tan0 = tangents[i];
    const tan1 = tangents[(i + 4) % total];
    const crossY = tan0.x * tan1.z - tan0.z * tan1.x;
    const curvature = Math.abs(crossY);

    if (curvature > 0.04) {
      const outsideSgn = crossY > 0 ? 1 : -1;
      // Stone retaining wall on outside of curve
      placeProp('stoneWall', i, outsideSgn * 7.6, outsideSgn > 0 ? Math.PI : 0);
      // Hay bales protecting apex
      if (i % 14 === 0) {
        placeProp('hayBale', i, -outsideSgn * 5.6, 0);
        placeProp('chevronSign', i + 3, outsideSgn * 7.2, outsideSgn > 0 ? Math.PI : 0);
      }
    } else if (i % 21 === 0) {
      // Flowing straights get rustic timber guardrails
      placeProp('timberBarrier', i, -6.8, 0);
      placeProp('timberBarrier', i + 1, 6.8, Math.PI);
    }
  }

  // 3. Mediterranean Olive Trees, Cypresses, and Spectator Pockets
  for (let i = 0; i < total; i += 9) {
    const sgn = i % 2 === 0 ? 1 : -1;
    const dist = 9.5 + (i % 4) * 2.5;
    if (i % 18 === 0) {
      placeProp('oliveTree', i, sgn * dist, (i * 0.7) % Math.PI, 0.9 + (i % 3) * 0.15);
    } else if (i % 27 === 0) {
      placeProp('cypressTree', i, sgn * dist, 0, 1.0 + (i % 4) * 0.2);
      placeProp('cypressTree', i + 1, sgn * (dist + 3.2), 0, 0.9 + (i % 3) * 0.15);
    } else if (i % 36 === 0) {
      placeProp('spectatorCanopy', i, sgn * 10.5, sgn > 0 ? Math.PI : 0);
    } else if (i % 45 === 0) {
      placeProp('marshalHut', i, -sgn * 8.0, sgn > 0 ? 0 : Math.PI);
    } else if (i % 54 === 0) {
      placeProp('rockFormation', i, sgn * 8.5, (i * 0.4) % Math.PI);
    }
  }

  // 4. Distant Italian hillside village in the far midground
  placeProp('distantScenery', Math.floor(total * 0.38), -115, 0.4, 1.2);
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
let raceIndex = 0;
let racing = false;
let paused = false;
let countdown = 0;
let raceClock = 0;
let last = performance.now();
let fps = 60;
let frames = 0;
let fpsStamp = last;
let standings: Standing[] = [];

const keys = new Set<string>();
let touchSteer = 0;
let touchThrottle = 0;
let touchBrake = 0;
let touchHandbrake = false;

// --- Tire Golden Dust Particle System ---
const MAX_DUST = 70;
const dustParticles = new THREE.InstancedMesh(
  new THREE.DodecahedronGeometry(0.24, 1),
  new THREE.MeshStandardMaterial({
    color: 0xd4ba8a,
    roughness: 0.95,
    transparent: true,
    opacity: 0.45,
  }),
  MAX_DUST,
);
dustParticles.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
scene.add(dustParticles);

const dustData: Array<{ pos: THREE.Vector3; vel: THREE.Vector3; scale: number; life: number; maxLife: number }> = [];
const dummyObj = new THREE.Object3D();

function spawnDust(x: number, y: number, z: number, intensity: number) {
  if (dustData.length >= MAX_DUST) return;
  dustData.push({
    pos: new THREE.Vector3(x + (Math.random() - 0.5) * 0.4, y + 0.1, z + (Math.random() - 0.5) * 0.4),
    vel: new THREE.Vector3((Math.random() - 0.5) * 1.5, 0.8 + Math.random() * 1.2, (Math.random() - 0.5) * 1.5),
    scale: 0.35 + intensity * 0.45,
    life: 0,
    maxLife: 0.65 + Math.random() * 0.45,
  });
}

function updateDust(dt: number) {
  for (let i = dustData.length - 1; i >= 0; i--) {
    const d = dustData[i];
    d.life += dt;
    if (d.life >= d.maxLife) {
      dustData.splice(i, 1);
      continue;
    }
    d.pos.addScaledVector(d.vel, dt);
    d.scale += dt * 0.6;
  }
  for (let i = 0; i < MAX_DUST; i++) {
    if (i < dustData.length) {
      const d = dustData[i];
      dummyObj.position.copy(d.pos);
      dummyObj.scale.setScalar(d.scale);
      dummyObj.updateMatrix();
      dustParticles.setMatrixAt(i, dummyObj.matrix);
    } else {
      dummyObj.position.set(0, -999, 0);
      dummyObj.scale.setScalar(0.001);
      dummyObj.updateMatrix();
      dustParticles.setMatrixAt(i, dummyObj.matrix);
    }
  }
  dustParticles.instanceMatrix.needsUpdate = true;
}

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
  let best = Infinity;
  let idx = 0;
  for (let i = 0; i < samples.length; i++) {
    const d = pos.distanceToSquared(samples[i]);
    if (d < best) {
      best = d;
      idx = i;
    }
  }
  return { t: idx / samples.length, distance: Math.sqrt(best), idx };
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

  // Adapt camera distance and elevation to screen aspect ratio
  const dist = isPortrait ? 6.4 : 5.4;
  const height = isPortrait ? 3.1 : 2.4;

  if (isCountdown) {
    // Cinematic Starting Grid Camera (references/scenes/01-starting-grid.png):
    // Positioned low behind the player car looking forward across the starting grid
    const gridCamTarget = playerCar.position.clone().addScaledVector(dir, -4.5).add(new THREE.Vector3(0, 1.65, 0));
    camera.position.lerp(gridCamTarget, dt > 0 ? 1 - Math.exp(-6 * dt) : 1);
    camera.lookAt(playerCar.position.clone().addScaledVector(dir, 8.5).add(new THREE.Vector3(0, 0.9, 0)));
  } else {
    // Dynamic Spring Chase Camera:
    const target = playerCar.position.clone().addScaledVector(dir, -dist).add(new THREE.Vector3(0, height, 0));
    // Lateral inertia response on steering
    const side = new THREE.Vector3(-dir.z, 0, dir.x);
    target.addScaledVector(side, -player.steerAngle * 0.65);

    camera.position.lerp(target, dt > 0 ? 1 - Math.exp(-6 * dt) : 1);
    const lookTarget = playerCar.position.clone().addScaledVector(dir, 7.5).add(new THREE.Vector3(0, 0.75, 0));
    camera.lookAt(lookTarget);
  }

  // Adjust camera FOV responsively
  const baseFov = isPortrait ? 60 : 54;
  const speedKick = Math.min(8, Math.abs(player.speed) * 0.18);
  camera.fov = THREE.MathUtils.damp(camera.fov, baseFov + speedKick, 4, dt || 0.016);
  camera.updateProjectionMatrix();
}

function resetRace() {
  buildTrack(raceIndex);
  raceClock = 0;
  countdown = 3.7;
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

  // Immediately place camera behind the player car on the starting grid
  updateCameraPosition(0, true);
  updateHud();
}

function updateHud() {
  const p = racers[0];
  const rank = p ? 1 + racers.filter(r => r !== p && r.lap + r.progress > p.lap + p.progress).length : 1;
  $('#position').textContent = `${rank} / 4`;
  $('#lap').textContent = `${Math.min(p?.lap || 1, 2)} / 2`;
  $('#speed').textContent = String(Math.round(Math.abs(player.speed) * 3.6)).padStart(3, '0');
  $('#raceLabel').textContent = RACES[raceIndex].name;
}

function finishRace() {
  if (!racing) return;
  racing = false;
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
  updateDust(dt);

  if (countdown > 0) {
    countdown -= dt;
    $('#countdown').textContent = countdown > 0.55 ? String(Math.ceil(countdown)) : 'GO!';
    if (countdown <= 0) setTimeout(() => ($('#countdown').textContent = ''), 500);

    // Keep camera smoothly positioned on grid during countdown!
    updateCameraPosition(dt, true);
    return;
  }

  const throttle = (keys.has('KeyW') || keys.has('ArrowUp') ? 1 : 0) || touchThrottle;
  const brake = (keys.has('KeyS') || keys.has('ArrowDown') ? 1 : 0) || touchBrake;
  const steer =
    (keys.has('KeyA') || keys.has('ArrowLeft') ? -1 : 0) +
    (keys.has('KeyD') || keys.has('ArrowRight') ? 1 : 0) +
    touchSteer;
  const handbrake = keys.has('Space') || touchHandbrake;

  const before = nearestTrack(playerCar.position);
  player.offroad = before.distance > 4.3;
  player = stepCar(player, { throttle, brake, steer, handbrake }, dt);

  const after = nearestTrack(new THREE.Vector3(player.x, 0, player.z));
  const trackPoint = roadSystem.curve.getPointAt(after.t);

  // Soft barrier boundary collision so car rebounds off roadside walls and stays on track
  if (after.distance > 5.2) {
    const toTrack = trackPoint.clone().sub(new THREE.Vector3(player.x, 0, player.z)).setY(0).normalize();
    player.x += toTrack.x * (after.distance - 5.1) * 0.45;
    player.z += toTrack.z * (after.distance - 5.1) * 0.45;
    player.speed *= 0.88;
  }

  playerCar.position.set(player.x, trackPoint.y + 0.16, player.z);
  playerCar.rotation.y = player.heading;
  playerCar.rotation.z = THREE.MathUtils.damp(playerCar.rotation.z, -player.slip * 0.24, 7, dt);

  // Steer front wheels & spin tyres
  const parts = playerCar.userData.parts;
  if (parts) {
    parts.wheelFL.rotation.y = player.steerAngle * 0.26;
    parts.wheelFR.rotation.y = player.steerAngle * 0.26;
    const spin = (player.speed * dt) / 0.31;
    parts.meshFL.rotation.x -= spin;
    parts.meshFR.rotation.x -= spin;
    parts.meshRL.rotation.x -= spin;
    parts.meshRR.rotation.x -= spin;
  }

  // Spawn dust plumes behind rear tires during acceleration or drifting
  if (Math.abs(player.speed) > 5 || Math.abs(player.slip) > 0.15) {
    const dir = new THREE.Vector3(Math.sin(player.heading), 0, Math.cos(player.heading));
    const side = new THREE.Vector3(-dir.z, 0, dir.x);
    const intensity = Math.abs(player.slip) * 1.5 + (player.offroad ? 1.0 : 0.2);
    spawnDust(player.x - dir.x * 1.2 - side.x * 0.7, trackPoint.y + 0.1, player.z - dir.z * 1.2 - side.z * 0.7, intensity);
    spawnDust(player.x - dir.x * 1.2 + side.x * 0.7, trackPoint.y + 0.1, player.z - dir.z * 1.2 + side.z * 0.7, intensity);
  }

  // Lap and checkpoint tracking
  const pr = racers[0];
  const prev = pr.progress;
  pr.progress = after.t;
  if (pr.checkpoint === 0 && after.t > 0.22 && after.t < 0.45) pr.checkpoint = 1;
  if (pr.checkpoint === 1 && after.t > 0.47 && after.t < 0.7) pr.checkpoint = 2;
  if (pr.checkpoint === 2 && after.t > 0.72 && after.t < 0.94) pr.checkpoint = 3;
  if (prev > 0.8 && after.t < 0.2 && pr.checkpoint === 3) {
    pr.checkpoint = 0;
    pr.lap++;
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

    // AI wheel spin & steering
    const rParts = r.car.userData.parts;
    if (rParts) {
      const rSpin = (r.speed * dt) / 0.31;
      rParts.meshFL.rotation.x -= rSpin;
      rParts.meshFR.rotation.x -= rSpin;
      rParts.meshRL.rotation.x -= rSpin;
      rParts.meshRR.rotation.x -= rSpin;
    }

    // Car-to-car bumper collision response
    if (r.car.position.distanceTo(playerCar.position) < 1.6) {
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
  keys.add(e.code);
  if (e.code === 'KeyR' && racing) resetPlayer();
  if (e.code === 'Escape') paused = !paused;
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) e.preventDefault();
});
addEventListener('keyup', e => keys.delete(e.code));

// Touch Steering & Pedal Controls
const pad = $<HTMLElement>('#steerPad');
const knob = $<HTMLElement>('#steerKnob');

function steerTouch(e: PointerEvent) {
  const r = pad.getBoundingClientRect();
  touchSteer = THREE.MathUtils.clamp((e.clientX - r.left - r.width / 2) / (r.width * 0.38), -1, 1);
  knob.style.transform = `translateX(${touchSteer * 38}px)`;
}

pad.addEventListener('pointerdown', e => {
  pad.setPointerCapture(e.pointerId);
  steerTouch(e);
});
pad.addEventListener('pointermove', e => {
  if (pad.hasPointerCapture(e.pointerId)) steerTouch(e);
});
pad.addEventListener('pointerup', () => {
  touchSteer = 0;
  knob.style.transform = '';
});

for (const [id, set] of [
  ['throttle', (v: number) => (touchThrottle = v)],
  ['brake', (v: number) => (touchBrake = v)],
  ['handbrake', (v: number) => (touchHandbrake = !!v)],
] as const) {
  const el = $<HTMLElement>(`#${id}`);
  el.addEventListener('pointerdown', e => {
    el.setPointerCapture(e.pointerId);
    set(1);
  });
  el.addEventListener('pointerup', () => set(0));
  el.addEventListener('pointercancel', () => set(0));
}

function frame(now: number) {
  requestAnimationFrame(frame);
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;

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
buildTrack(0);
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
placeRacer(preview, 0.005, -1.35);
rivalCars.forEach((car, i) =>
  placeRacer(
    { ...preview, id: rivalIds[i], car },
    0.994 - i * 0.008,
    [1.35, -1.35, 1.35][i],
  ),
);

// Menu preview camera: angled view across the starting grid
camera.position.set(-6, 3.8, -84);
camera.lookAt(playerCar.position.clone().add(new THREE.Vector3(4, 0.5, 8)));

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
