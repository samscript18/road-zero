import test from 'node:test';
import assert from 'node:assert/strict';
import { RoomManager } from './rooms.mjs';
import { ClientEvent, RoomStatus } from '../shared/multiplayer-protocol.js';

class Socket {
  readyState = 1;
  messages = [];
  send(raw) { this.messages.push(JSON.parse(raw)); }
  close() { this.readyState = 3; }
  last(type) { return this.messages.findLast(item => item.type === type)?.payload; }
}
const profile = index => ({ nickname: `HillDriver${index}`, avatarId: 'red-helmet', avatarUrl: null });
const act = (manager, socket, type, payload = {}) => manager.handle(socket, JSON.stringify({ type, payload }), 'test');
function grid(count) {
  let now = 10_000;
  const manager = new RoomManager({ now: () => now });
  const sockets = Array.from({ length: count }, () => new Socket());
  act(manager, sockets[0], ClientEvent.ROOM_CREATE, { profile: profile(0), settings: { maxPlayers: count, laps: 1, trackId: 'ORCHARD' } });
  const code = sockets[0].last('ROOM_CREATED').room.code;
  for (let i = 1; i < count; i++) act(manager, sockets[i], ClientEvent.ROOM_JOIN, { code, profile: profile(i) });
  for (const socket of sockets) act(manager, socket, ClientEvent.PLAYER_READY);
  act(manager, sockets[0], ClientEvent.HOST_START_REQUEST);
  for (const socket of sockets) act(manager, socket, ClientEvent.PLAYER_LOADED);
  const room = manager.rooms.get(code);
  return { manager, sockets, room, code, clock: { get now() { return now; }, advance(ms) { now += ms; manager.tick(); } } };
}
function driveLap(fixture, socket) {
  const { manager, room, clock } = fixture;
  for (let step = 1; step <= 200; step++) {
    clock.advance(80);
    const t = (step / 200) % 1;
    const point = room.route.curve.getPointAt(t);
    const tangent = room.route.curve.getTangentAt(t);
    act(manager, socket, ClientEvent.RACE_SNAPSHOT, {
      sequence: step, x: point.x, y: point.y + .16, z: point.z,
      rotationY: Math.atan2(tangent.x, tangent.z), speed: 31, steering: 0,
      lap: 999, checkpoint: 999,
    });
  }
}

for (const count of [2, 3, 4]) {
  test(`${count}-driver room schedules together, continues after first finish, and broadcasts one order`, () => {
    const fixture = grid(count);
    const { manager, sockets, room, clock } = fixture;
    assert.equal(room.status, RoomStatus.COUNTDOWN);
    assert.equal(new Set(sockets.map(socket => socket.last('RACE_START_SCHEDULED')?.startAtServerTime)).size, 1);
    assert.equal(room.startAt, 14_500);
    act(manager, sockets[0], ClientEvent.RACE_SNAPSHOT, { sequence: 1, x: 0, y: 0, z: 0, rotationY: 0, speed: 20, steering: 0 });
    assert.equal(room.players[0].race.sequence, -1);
    clock.advance(4500);
    assert.equal(room.status, RoomStatus.RACING);
    driveLap(fixture, sockets[0]);
    assert.equal(room.status, RoomStatus.RACING);
    assert.equal(sockets[0].last('PLAYER_FINISHED')?.position, 1);
    for (let i = 1; i < count; i++) driveLap(fixture, sockets[i]);
    assert.equal(room.status, RoomStatus.FINISHED);
    const views = sockets.map(socket => socket.last('RACE_RESULTS'));
    assert.ok(views.every(Boolean));
    assert.ok(views.every(view => JSON.stringify(view) === JSON.stringify(views[0])));
    assert.equal(views[0].order.length, count);
    assert.equal(views[0].order[0].nickname, 'HillDriver0');
    assert.ok(views[0].order.every(item => !item.dnf));
  });
}

test('host disconnect does not end an active race; grace expiry marks DNF and rematch reuses room', () => {
  const fixture = grid(2);
  const { manager, sockets, room, clock, code } = fixture;
  clock.advance(4500);
  manager.leave(sockets[0]);
  assert.equal(room.status, RoomStatus.RACING);
  assert.equal(room.hostPlayerId, room.players[1].id);
  clock.advance(25_100);
  assert.equal(room.players[0].race.dnf, true);
  driveLap(fixture, sockets[1]);
  assert.equal(room.status, RoomStatus.FINISHED);
  assert.equal(sockets[1].last('RACE_RESULTS').order[1].dnf, true);
  const reconnect = new Socket();
  const token = sockets[0].last('ROOM_CREATED').resumeToken;
  act(manager, reconnect, ClientEvent.ROOM_JOIN, { code, resumeToken: token, profile: profile(0) });
  assert.equal(reconnect.last('ROOM_JOINED').playerId, room.players[0].id);
  act(manager, sockets[1], ClientEvent.REMATCH_REQUEST);
  assert.equal(room.status, RoomStatus.LOADING);
  assert.equal(room.players[0].race.lap, 1);
  assert.equal(room.players[0].race.dnf, false);
  act(manager, reconnect, ClientEvent.PLAYER_LOADED);
  act(manager, sockets[1], ClientEvent.PLAYER_LOADED);
  assert.equal(room.status, RoomStatus.COUNTDOWN);
});

test('mid-race reconnect keeps slot, state and identity; returning to lobby clears race progress', () => {
  const fixture = grid(2);
  const { manager, sockets, room, clock, code } = fixture;
  clock.advance(4500);
  const id = room.players[1].id;
  const slot = room.players[1].slot;
  const token = sockets[1].last('ROOM_JOINED').resumeToken;
  manager.leave(sockets[1]);
  assert.equal(room.status, RoomStatus.RACING);
  clock.advance(5000);
  const resumed = new Socket();
  act(manager, resumed, ClientEvent.ROOM_JOIN, { code, resumeToken: token, profile: profile(1) });
  assert.equal(resumed.last('ROOM_JOINED').playerId, id);
  assert.equal(room.players[1].slot, slot);
  assert.equal(room.players.length, 2);
  assert.equal(room.players[1].race.dnf, false);
  driveLap(fixture, sockets[0]); driveLap(fixture, resumed);
  assert.equal(room.status, RoomStatus.FINISHED);
  act(manager, sockets[0], ClientEvent.RETURN_TO_LOBBY);
  assert.equal(room.status, RoomStatus.READY_CHECK);
  assert.ok(room.players.every(player => !player.ready && !player.loaded && player.race == null));
});

test('first-finisher timeout classifies an idle connected racer as DNF', () => {
  const fixture = grid(2);
  const { room, sockets, clock } = fixture;
  clock.advance(4500);
  driveLap(fixture, sockets[0]);
  assert.equal(room.status, RoomStatus.RACING);
  clock.advance(90_100);
  assert.equal(room.status, RoomStatus.FINISHED);
  assert.equal(room.players[1].race.dnf, true);
  assert.equal(sockets[1].last('RACE_RESULTS').order[1].dnf, true);
});
