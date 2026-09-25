import * as THREE from 'three';
import createHeroCoupe from '../assets/hero_coupe.js';
import createRivalCar from '../assets/rival_cars.js';
import { createTrackRoute, trackIndex } from '../../shared/track-route.js';
import { ClientEvent, ServerEvent, type RoomSnapshot } from '../../shared/multiplayer-protocol.js';
import { MULTIPLAYER_CAR_TUNE, resolveCarOverlap, stepCar, type CarInput, type CarState } from '../race';
import type { RoadSystem } from '../road_system';
import { avatarDataUrl } from './avatars';
import { interpolatePose, type RacePose, type TimedPose } from './interpolation';
import './race-mode.css';

type AudioPort = {
  update: (speed: number, throttle: number, slip: number, offroad: boolean, index: number) => void;
  cue: (kind: 'count' | 'go' | 'lap' | 'finish') => void;
  impact: (severity: number) => void;
  silence: () => void;
};
type Options = {
  scene: THREE.Scene; camera: THREE.PerspectiveCamera; renderer: THREE.WebGLRenderer;
  road: () => RoadSystem | null; buildTrack: (index: number) => void;
  input: () => CarInput; audio: AudioPort; send: (type: string, payload?: Record<string, unknown>) => void;
  setSingleCarsVisible: (visible: boolean) => void; onMainMenu: () => void;
};
const $ = <T extends Element>(selector: string) => document.querySelector<T>(selector)!;

export class MultiplayerRace {
  private room: RoomSnapshot | null = null;
  private playerId = '';
  private cars = new Map<string, THREE.Group>();
  private localCar: THREE.Group | null = null;
  private local: CarState = { x: 0, z: 0, heading: 0, speed: 0, slip: 0, steerAngle: 0, offroad: false };
  private buffers = new Map<string, TimedPose[]>();
  private latest = new Map<string, RacePose>();
  private latestArrival = new Map<string, number>();
  private order: string[] = [];
  private startAt = 0;
  private clockOffset = 0;
  private bestRtt = Infinity;
  private rtt = 0;
  private sequence = 0;
  private lastSend = 0;
  private sentBytes = 0;
  private receivedBytes = 0;
  private active = false;
  private finished = false;
  private lastCountdown = 4;
  private resultScreen: HTMLElement;
  private standingsHud: HTMLElement;
  private debug: HTMLElement;
  private trackRoute: ReturnType<typeof createTrackRoute> | null = null;
  private lastCollision = 0;

  constructor(private options: Options) {
    this.resultScreen = document.createElement('section');
    this.resultScreen.id = 'mpResults'; this.resultScreen.className = 'screen hidden';
    this.standingsHud = document.createElement('div');
    this.standingsHud.id = 'mpStandings'; this.standingsHud.className = 'hidden';
    this.debug = document.createElement('div');
    this.debug.id = 'mpDebug'; this.debug.className = 'hidden';
    $('#app').append(this.resultScreen, this.standingsHud, this.debug);
  }

  get isActive() { return this.active; }

  get telemetry() {
    return { active: this.active, room: this.room?.code || '', playerId: this.playerId,
      state: this.room?.status || '', clockOffset: this.clockOffset, rtt: this.rtt,
      snapshotsSent: this.sequence, sentBytes: this.sentBytes, receivedBytes: this.receivedBytes,
      remoteCars: this.cars.size - (this.localCar ? 1 : 0), speed: this.local.speed,
      position: [this.local.x, this.local.z], order: this.order,
      heading: this.local.heading, startAt: this.startAt,
      remotePositions: [...this.cars].filter(([id]) => id !== this.playerId).map(([id, car]) => ({ playerId: id, x: car.position.x, z: car.position.z })),
      lap: this.latest.get(this.playerId)?.lap || 1,
      checkpoint: this.latest.get(this.playerId)?.checkpoint || 0 };
  }

  async prepare(room: RoomSnapshot, playerId: string) {
    this.disposeCars();
    this.room = room; this.playerId = playerId; this.finished = false; this.active = false;
    this.sequence = 0; this.lastSend = 0; this.buffers.clear(); this.latest.clear(); this.order = [];
    this.order = [...room.players].sort((a, b) => a.slot - b.slot).map(item => item.id);
    const index = trackIndex[room.settings.trackId];
    this.options.buildTrack(index);
    this.trackRoute = createTrackRoute(room.settings.trackId);
    this.options.setSingleCarsVisible(false);
    const makers = [() => createHeroCoupe(THREE), () => createRivalCar(THREE, 'CHARGER'),
      () => createRivalCar(THREE, 'TECHNICIAN'), () => createRivalCar(THREE, 'DEFENDER')];
    for (const player of room.players) {
      const car = makers[player.slot]();
      const pose = this.trackRoute.grid(player.slot);
      car.position.set(pose.x, pose.y, pose.z); car.rotation.y = pose.rotationY;
      car.name = `human-${player.slot}-${player.id}`;
      this.options.scene.add(car); this.cars.set(player.id, car);
      if (player.id === playerId) {
        this.localCar = car;
        this.local = { x: pose.x, z: pose.z, heading: pose.rotationY, speed: 0, slip: 0, steerAngle: 0, offroad: false };
      }
    }
    if (!this.localCar || this.cars.size !== room.settings.maxPlayers) throw new Error('Could not construct the full human grid');
    this.updateCamera(0, true);
    this.options.renderer.compile(this.options.scene, this.options.camera);
    await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
  }

  onClockPong(payload: { clientTime: number; serverTime: number }) {
    const received = Date.now();
    const rtt = received - payload.clientTime;
    if (rtt < 0 || rtt > 3000) return;
    this.rtt = rtt;
    if (rtt <= this.bestRtt + 5) {
      this.bestRtt = Math.min(this.bestRtt, rtt);
      this.clockOffset = payload.serverTime - (payload.clientTime + received) / 2;
    }
  }

  startCountdown(startAt: number, room?: RoomSnapshot) {
    if (room) this.room = room;
    if (!this.localCar) return;
    this.startAt = startAt;
    this.active = true; this.finished = false; this.lastCountdown = 4;
    this.resultScreen.classList.add('hidden');
    this.standingsHud.classList.remove('hidden');
    $('#hud').classList.remove('hidden');
    $('#touch').classList.toggle('hidden', !(matchMedia('(any-pointer:coarse)').matches || navigator.maxTouchPoints > 0));
    this.updateHud();
  }

  onRoomState(room: RoomSnapshot) { this.room = room; }

  onBatch(batch: { serverNow: number; order: string[]; players: RacePose[] }) {
    this.receivedBytes += JSON.stringify(batch).length;
    this.order = batch.order;
    for (const pose of batch.players) {
      this.latest.set(pose.playerId, pose);
      if (pose.playerId === this.playerId) continue;
      const list = this.buffers.get(pose.playerId) || [];
      if (!list.length || batch.serverNow > list[list.length - 1].serverNow) {
        list.push({ ...pose, serverNow: batch.serverNow });
        while (list.length > 12 || list[0]?.serverNow < batch.serverNow - 1200) list.shift();
        this.buffers.set(pose.playerId, list);
        this.latestArrival.set(pose.playerId, performance.now());
      }
    }
    this.updateHud();
  }

  onReset(pose: { x: number; y: number; z: number; rotationY: number }) {
    this.local = { x: pose.x, z: pose.z, heading: pose.rotationY, speed: 0, slip: 0, steerAngle: 0, offroad: false };
    if (this.localCar) { this.localCar.position.set(pose.x, pose.y, pose.z); this.localCar.rotation.y = pose.rotationY; }
  }

  update(dt: number) {
    if (!this.active || !this.localCar || !this.room || !this.trackRoute) return;
    const now = Date.now() + this.clockOffset;
    const remaining = this.startAt - now;
    if (remaining > 0) {
      const number = remaining <= 3000 ? Math.ceil(remaining / 1000) : 4;
      $('#countdown').textContent = number === 4 ? 'GRID' : String(number);
      if (number < this.lastCountdown && number > 0 && number < 4) this.options.audio.cue('count');
      this.lastCountdown = number;
      this.options.audio.update(0, 0, 0, false, trackIndex[this.room.settings.trackId]);
      this.renderRemotes(dt, now);
      this.updateCamera(dt, true);
      return;
    }
    if (this.lastCountdown !== 0) { this.options.audio.cue('go'); this.lastCountdown = 0; }
    $('#countdown').textContent = remaining > -650 ? 'GO!' : '';
    if (!this.finished && !this.latest.get(this.playerId)?.finished && !this.latest.get(this.playerId)?.dnf) {
      const input = this.options.input();
      const road = this.options.road();
      if (road) {
        const before = this.trackRoute.nearest(this.local.x, this.local.z);
        this.local.offroad = before.distance > 4.3;
        this.local = stepCar(this.local, input, dt, MULTIPLAYER_CAR_TUNE);
        const after = this.trackRoute.nearest(this.local.x, this.local.z);
        if (after.distance > 5.2) {
          const point = this.trackRoute.curve.getPointAt(after.t);
          const dx = point.x - this.local.x, dz = point.z - this.local.z;
          const length = Math.hypot(dx, dz) || 1;
          this.local.x += dx / length * (after.distance - 5.1) * .65;
          this.local.z += dz / length * (after.distance - 5.1) * .65;
          if (this.local.speed > 0) this.local.speed *= .985;
        }
        const height = this.trackRoute.nearest(this.local.x, this.local.z).y + .16;
        this.localCar.position.set(this.local.x, height, this.local.z);
        this.localCar.rotation.y = this.local.heading;
        this.animateWheels(this.localCar, this.local.speed, this.local.steerAngle, dt);
        this.resolveContacts();
        this.options.audio.update(this.local.speed, input.throttle, this.local.slip, this.local.offroad, trackIndex[this.room.settings.trackId]);
        if (performance.now() - this.lastSend >= 50) {
          this.lastSend = performance.now();
          const snapshot = { sequence: this.sequence++, x: this.local.x, y: this.localCar.position.y, z: this.local.z,
            rotationY: this.local.heading, speed: this.local.speed, steering: this.local.steerAngle };
          this.sentBytes += JSON.stringify(snapshot).length;
          this.options.send(ClientEvent.RACE_SNAPSHOT, snapshot);
        }
      }
    } else {
      this.options.audio.silence();
    }
    this.renderRemotes(dt, now);
    this.updateCamera(dt, false);
    this.updateHud();
    if (new URLSearchParams(location.search).has('mpdebug')) this.updateDebug();
  }

  private renderRemotes(dt: number, serverNow: number) {
    for (const [id, car] of this.cars) {
      if (id === this.playerId) continue;
      const sample = interpolatePose(this.buffers.get(id) || [], serverNow - 120);
      if (!sample) continue;
      car.position.set(sample.x, sample.y, sample.z);
      car.rotation.y = sample.rotationY;
      this.animateWheels(car, sample.speed, sample.steering, dt);
    }
  }

  private animateWheels(car: THREE.Group, speed: number, steer: number, dt: number) {
    const parts = car.userData.parts;
    if (!parts) return;
    if (parts.wheelFL) parts.wheelFL.rotation.y = steer * .26;
    if (parts.wheelFR) parts.wheelFR.rotation.y = steer * .26;
    for (const key of ['meshFL', 'meshFR', 'meshRL', 'meshRR']) if (parts[key]) parts[key].rotation.x -= speed * dt / .31;
  }

  private resolveContacts() {
    if (!this.localCar) return;
    for (const [id, car] of this.cars) {
      if (id === this.playerId || performance.now() - (this.latestArrival.get(id) || 0) > 350) continue;
      const contact = resolveCarOverlap(this.local, car.position);
      if (contact.overlap <= 0) continue;
      this.local.x = contact.x; this.local.z = contact.z;
      this.localCar.position.x = contact.x; this.localCar.position.z = contact.z;
      this.local.speed *= contact.overlap > .2 ? .78 : .94;
      if (performance.now() - this.lastCollision > 400) {
        this.options.audio.impact(Math.min(1, contact.overlap)); this.lastCollision = performance.now();
      }
    }
  }

  private updateCamera(dt: number, grid: boolean) {
    if (!this.localCar) return;
    const direction = new THREE.Vector3(Math.sin(this.local.heading), 0, Math.cos(this.local.heading));
    const portrait = innerWidth < innerHeight;
    const distance = grid ? 5.2 : portrait ? 6.4 : 5.4;
    const height = grid ? 2.3 : portrait ? 3.1 : 2.4;
    const target = this.localCar.position.clone().addScaledVector(direction, -distance).add(new THREE.Vector3(0, height, 0));
    this.options.camera.position.lerp(target, dt > 0 ? 1 - Math.exp(-6 * dt) : 1);
    this.options.camera.lookAt(this.localCar.position.clone().addScaledVector(direction, grid ? 9 : 7.5).add(new THREE.Vector3(0, .75, 0)));
    this.options.camera.fov = THREE.MathUtils.damp(this.options.camera.fov, (portrait ? 60 : 54) + Math.min(6, Math.abs(this.local.speed) * .16), 4, dt || .016);
    this.options.camera.updateProjectionMatrix();
  }

  private updateHud() {
    if (!this.room || !this.active) return;
    const rank = Math.max(1, this.order.indexOf(this.playerId) + 1);
    const lap = this.latest.get(this.playerId)?.lap || 1;
    $('#position').textContent = `${rank} / ${this.room.settings.maxPlayers}`;
    $('#lap').textContent = `${Math.min(lap, this.room.settings.laps)} / ${this.room.settings.laps}`;
    $('#speed').textContent = String(Math.round(Math.abs(this.local.speed) * 3.6)).padStart(3, '0');
    $('#raceLabel').textContent = `${this.room.settings.trackId} · RACE TOGETHER`;
    this.standingsHud.replaceChildren();
    for (const [index, id] of this.order.entries()) {
      const player = this.room.players.find(item => item.id === id);
      if (!player) continue;
      const row = document.createElement('div');
      row.textContent = `${index + 1}  ${player.nickname}${player.connected ? '' : ' · LINK LOST'}`;
      if (id === this.playerId) row.className = 'mine';
      this.standingsHud.append(row);
    }
  }

  private updateDebug() {
    const t = this.telemetry;
    this.debug.classList.remove('hidden');
    this.debug.textContent = `${t.room} · ${t.state} · ${t.playerId.slice(0, 8)} · ${Math.round(t.rtt)}ms RTT · ${Math.round(t.clockOffset)}ms OFFSET · 20Hz TX / 10Hz RX · 120ms INTERP · LAP ${t.lap} CP ${t.checkpoint}`;
  }

  showResults(data: { order: Array<{ playerId: string; nickname: string; avatarId: string | null; avatarUrl: string | null; position: number; finishTime: number | null; dnf: boolean }> }) {
    this.active = false; this.finished = true;
    $('#hud').classList.add('hidden'); $('#touch').classList.add('hidden');
    this.standingsHud.classList.add('hidden');
    this.resultScreen.replaceChildren();
    const card = document.createElement('div'); card.className = 'card mp-results-card';
    const kicker = document.createElement('p'); kicker.className = 'kicker'; kicker.textContent = 'RACE TOGETHER · OFFICIAL RESULT';
    const title = document.createElement('h2'); title.textContent = data.order[0]?.playerId === this.playerId ? 'STAGE WIN' : 'RACE COMPLETE';
    card.append(kicker, title);
    for (const entry of data.order) {
      const row = document.createElement('div'); row.className = 'mp-result-row';
      const img = document.createElement('img'); img.alt = ''; img.src = entry.avatarUrl || avatarDataUrl(entry.avatarId);
      const name = document.createElement('strong'); name.textContent = `${entry.position}. ${entry.nickname}`;
      const time = document.createElement('span'); time.textContent = entry.dnf ? 'DNF' : `${entry.finishTime!.toFixed(2)} s`;
      row.append(img, name, time); card.append(row);
    }
    const actions = document.createElement('div'); actions.className = 'mp-result-actions';
    const action = (label: string, type: string, disabled = false) => {
      const button = document.createElement('button'); button.textContent = label; button.disabled = disabled;
      button.onclick = () => this.options.send(type); actions.append(button);
    };
    const host = this.room?.hostPlayerId === this.playerId;
    action('REMATCH', ClientEvent.REMATCH_REQUEST, !host);
    action('RETURN TO LOBBY', ClientEvent.RETURN_TO_LOBBY, !host);
    const menu = document.createElement('button'); menu.textContent = 'MAIN MENU'; menu.onclick = this.options.onMainMenu; actions.append(menu);
    card.append(actions);
    if (!host) { const hint = document.createElement('p'); hint.textContent = 'The host can call the next grid.'; card.append(hint); }
    this.resultScreen.append(card);
    this.resultScreen.classList.remove('hidden');
    this.options.audio.silence();
    this.options.audio.cue('finish');
  }

  disposeCars() {
    for (const car of this.cars.values()) {
      this.options.scene.remove(car);
      const geometries = new Set<THREE.BufferGeometry>();
      const materials = new Set<THREE.Material>();
      car.traverse(object => {
        if (!(object instanceof THREE.Mesh)) return;
        geometries.add(object.geometry);
        for (const material of Array.isArray(object.material) ? object.material : [object.material]) materials.add(material);
      });
      geometries.forEach(geometry => geometry.dispose());
      materials.forEach(material => material.dispose());
    }
    this.cars.clear(); this.localCar = null; this.active = false; this.finished = false;
    this.resultScreen.classList.add('hidden'); this.standingsHud.classList.add('hidden'); this.debug.classList.add('hidden');
    $('#hud').classList.add('hidden'); $('#touch').classList.add('hidden');
    this.options.setSingleCarsVisible(true);
  }
}
