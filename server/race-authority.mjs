import { createTrackRoute } from '../shared/track-route.js';
import { RoomStatus, ServerEvent } from '../shared/multiplayer-protocol.js';

export const SNAPSHOT_INTERVAL_MS = 50;
export const BATCH_INTERVAL_MS = 100;
export const FINISH_WINDOW_MS = 90_000;
export const MAX_RACE_MS = 8 * 60_000;
const MAX_SPEED = 38;

export function resetRaceState(room) {
  room.route = createTrackRoute(room.settings.trackId);
  room.startAt = null;
  room.firstFinishAt = null;
  room.lastBatchAt = 0;
  for (const player of room.players) {
    const pose = room.route.grid(player.slot);
    player.race = {
      x: pose.x, y: pose.y, z: pose.z, rotationY: pose.rotationY,
      speed: 0, steering: 0, sequence: -1, progress: pose.t,
      lap: 1, checkpoint: 0, finishAt: null, dnf: false,
      lastAcceptedAt: null, lastPacketAt: null, accepted: 0, rejected: 0,
    };
  }
}

export function scheduleRace(room, now) {
  resetRaceState(room);
  room.startAt = now + 4500;
  room.status = RoomStatus.COUNTDOWN;
  return { startAtServerTime: room.startAt, serverNow: now };
}

export function validSnapshot(payload) {
  if (!payload || typeof payload !== 'object') return false;
  const values = [payload.x, payload.y, payload.z, payload.rotationY, payload.speed, payload.steering];
  return Number.isSafeInteger(payload.sequence) && payload.sequence >= 0 &&
    values.every(value => typeof value === 'number' && Number.isFinite(value)) &&
    Math.abs(payload.x) < 1000 && Math.abs(payload.y) < 200 && Math.abs(payload.z) < 1000 &&
    Math.abs(payload.speed) <= MAX_SPEED && Math.abs(payload.steering) <= 3 &&
    Math.abs(payload.rotationY) < 1000;
}

export function acceptSnapshot(room, player, payload, now) {
  if (room.status !== RoomStatus.RACING || now < room.startAt || !player.connected || player.race?.finishAt || player.race?.dnf) return { accepted: false, reason: 'NOT_RACING' };
  if (!validSnapshot(payload)) return { accepted: false, reason: 'INVALID_SNAPSHOT' };
  const state = player.race;
  if (payload.sequence <= state.sequence) return { accepted: false, reason: 'OLD_SEQUENCE' };
  if (state.lastPacketAt != null && now - state.lastPacketAt < 25) return { accepted: false, reason: 'RATE_LIMIT' };
  const dt = state.lastAcceptedAt == null ? Math.max(0, now - room.startAt) : Math.max(0, now - state.lastAcceptedAt);
  const distance = Math.hypot(payload.x - state.x, payload.z - state.z);
  if (distance > 4 + MAX_SPEED * Math.min(dt, 500) / 1000) {
    state.rejected++;
    return { accepted: false, reason: 'IMPOSSIBLE_MOVEMENT' };
  }
  const route = room.route.nearest(payload.x, payload.z);
  if (route.distance > 9 || Math.abs(payload.y - route.y) > 4) {
    state.rejected++;
    return { accepted: false, reason: 'OFF_ROUTE' };
  }
  const prev = state.progress;
  let forward = route.t - prev;
  if (forward < -0.5) forward += 1;
  if (forward > 0.5) forward -= 1;
  if (Math.abs(forward) > 0.055) {
    state.rejected++;
    return { accepted: false, reason: 'IMPOSSIBLE_PROGRESS' };
  }
  Object.assign(state, {
    x: payload.x, y: payload.y, z: payload.z, rotationY: payload.rotationY,
    speed: payload.speed, steering: payload.steering, sequence: payload.sequence,
    progress: route.t, lastAcceptedAt: now, lastPacketAt: now,
  });
  state.accepted++;
  const events = [];
  const thresholds = [0.22, 0.47, 0.72];
  const gate = thresholds[state.checkpoint];
  if (forward > 0 && gate != null && prev < gate && route.t >= gate && route.distance < 6.5) {
    state.checkpoint++;
    events.push({ type: ServerEvent.CHECKPOINT_CONFIRMED, payload: { playerId: player.id, checkpoint: state.checkpoint, lap: state.lap } });
  }
  if (forward > 0 && prev > 0.8 && route.t < 0.2 && state.checkpoint === 3 && route.distance < 6.5) {
    state.checkpoint = 0;
    if (state.lap >= room.settings.laps) {
      state.finishAt = now;
      state.speed = 0;
      if (room.firstFinishAt == null) room.firstFinishAt = now;
      const position = room.players.filter(item => item.race?.finishAt != null).length;
      events.push({ type: ServerEvent.PLAYER_FINISHED, payload: { playerId: player.id, position, finishTime: (now - room.startAt) / 1000 } });
    } else {
      state.lap++;
      events.push({ type: ServerEvent.LAP_CONFIRMED, payload: { playerId: player.id, lap: state.lap } });
    }
  }
  return { accepted: true, events };
}

export function ranking(room) {
  return [...room.players].sort((a, b) => {
    const ra = a.race, rb = b.race;
    if (ra?.finishAt != null || rb?.finishAt != null) {
      if (ra?.finishAt == null) return 1;
      if (rb?.finishAt == null) return -1;
      return ra.finishAt - rb.finishAt || a.slot - b.slot;
    }
    if (ra?.dnf !== rb?.dnf) return ra?.dnf ? 1 : -1;
    return (rb?.lap || 0) - (ra?.lap || 0) || (rb?.checkpoint || 0) - (ra?.checkpoint || 0) ||
      (rb?.progress || 0) - (ra?.progress || 0) || a.slot - b.slot;
  });
}

export function raceBatch(room, now) {
  return {
    serverNow: now,
    order: ranking(room).map(player => player.id),
    players: room.players.map(player => {
      const race = player.race;
      return {
        playerId: player.id, slot: player.slot, connected: player.connected,
        x: race.x, y: race.y, z: race.z, rotationY: race.rotationY,
        speed: race.speed, steering: race.steering, sequence: race.sequence,
        lap: race.lap, checkpoint: race.checkpoint, progress: race.progress,
        finished: race.finishAt != null, dnf: race.dnf,
      };
    }),
  };
}

export function results(room) {
  return {
    code: room.code, trackId: room.settings.trackId,
    order: ranking(room).map((player, index) => ({
      playerId: player.id, nickname: player.nickname, avatarId: player.avatarId,
      avatarUrl: player.avatarUrl, position: index + 1,
      finishTime: player.race?.finishAt == null ? null : (player.race.finishAt - room.startAt) / 1000,
      dnf: player.race?.finishAt == null,
    })),
  };
}
