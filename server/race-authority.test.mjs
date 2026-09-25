import test from 'node:test';
import assert from 'node:assert/strict';
import { acceptSnapshot, ranking, results, scheduleRace } from './race-authority.mjs';
import { RoomStatus } from '../shared/multiplayer-protocol.js';

function fixture(laps = 1) {
  const players = [0, 1].map(slot => ({ id: `p${slot}`, slot, nickname: `Driver${slot}`, avatarId: 'red-helmet', avatarUrl: null, connected: true }));
  const room = { code: 'ABC234', status: RoomStatus.LOADING, settings: { trackId: 'ORCHARD', laps, maxPlayers: 2 }, players };
  const scheduled = scheduleRace(room, 1000);
  return { room, players, scheduled };
}
function pose(room, t, sequence) {
  const point = room.route.curve.getPointAt(t);
  const tan = room.route.curve.getTangentAt(t);
  return { sequence, x: point.x, y: point.y + .16, z: point.z, rotationY: Math.atan2(tan.x, tan.z), speed: 24, steering: 0, lap: 999, checkpoint: 999 };
}

test('all-loaded schedule uses a future server timestamp and pre-GO movement is illegal', () => {
  const { room, players, scheduled } = fixture();
  assert.equal(scheduled.startAtServerTime, 5500);
  assert.equal(room.status, RoomStatus.COUNTDOWN);
  assert.equal(acceptSnapshot(room, players[0], pose(room, .02, 0), 5000).reason, 'NOT_RACING');
  assert.equal(players[0].race.lap, 1);
});

test('teleports, invalid speed and claimed lap/checkpoint cannot create progress', () => {
  const { room, players } = fixture(); room.status = RoomStatus.RACING;
  const player = players[0];
  assert.equal(acceptSnapshot(room, player, pose(room, .5, 0), 5600).reason, 'IMPOSSIBLE_MOVEMENT');
  const absurd = pose(room, .01, 1); absurd.speed = 900;
  assert.equal(acceptSnapshot(room, player, absurd, 5700).reason, 'INVALID_SNAPSHOT');
  assert.equal(acceptSnapshot(room, player, pose(room, .01, 2), 5800).accepted, true);
  assert.equal(player.race.lap, 1);
  assert.equal(player.race.checkpoint, 0);
  assert.equal(player.race.finishAt, null);
});

test('ordered actual route traversal finishes after the configured laps, with server result', () => {
  const { room, players } = fixture(2); room.status = RoomStatus.RACING;
  const player = players[0];
  let now = 5500;
  let sequence = 0;
  const events = [];
  for (let lap = 0; lap < 2; lap++) {
    for (let step = 1; step <= 200; step++) {
      now += 180;
      const outcome = acceptSnapshot(room, player, pose(room, (step / 200) % 1, sequence++), now);
      assert.equal(outcome.accepted, true, `${lap}:${step}:${outcome.reason}`);
      events.push(...outcome.events.map(item => item.type));
    }
  }
  assert.equal(player.race.lap, 2);
  assert.equal(player.race.checkpoint, 0);
  assert.ok(player.race.finishAt);
  assert.equal(events.filter(type => type === 'CHECKPOINT_CONFIRMED').length, 6);
  assert.equal(events.filter(type => type === 'LAP_CONFIRMED').length, 1);
  assert.equal(events.filter(type => type === 'PLAYER_FINISHED').length, 1);
  assert.equal(ranking(room)[0].id, player.id);
  assert.equal(results(room).order[0].dnf, false);
  assert.equal(results(room).order[1].dnf, true);
});
