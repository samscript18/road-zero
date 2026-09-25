import test from 'node:test';
import assert from 'node:assert/strict';
import { RoomManager } from './rooms.mjs';
import { ClientEvent, RoomStatus } from '../shared/multiplayer-protocol.js';

class Socket {
  readyState = 1;
  messages = [];
  send(raw) { this.messages.push(JSON.parse(raw)); }
  close() { this.readyState = 3; }
  latest(type) { return this.messages.findLast(item => item.type === type)?.payload; }
}
const profile = (nickname, avatarId = 'red-helmet') => ({ nickname, avatarId, avatarUrl: null });
function action(manager, socket, type, payload = {}) { manager.handle(socket, JSON.stringify({ type, payload }), socket.ip || '127.0.0.1'); }
function makeRoom(count = 2) {
  const manager = new RoomManager();
  const host = new Socket();
  action(manager, host, ClientEvent.ROOM_CREATE, { profile: profile('HillRider'), settings: { maxPlayers: count, laps: 2, trackId: 'ORCHARD' } });
  const created = host.latest('ROOM_CREATED');
  assert.ok(created);
  return { manager, host, created, code: created.room.code };
}
function join(manager, code, nickname) {
  const socket = new Socket();
  action(manager, socket, ClientEvent.ROOM_JOIN, { code: code.toLowerCase(), profile: profile(nickname) });
  return socket;
}

test('2, 3 and 4 player rooms hold exact chosen capacity, and codes are unique', () => {
  const manager = new RoomManager();
  const codes = new Set();
  for (const count of [2, 3, 4]) {
    const host = new Socket(); host.ip = String(count);
    action(manager, host, ClientEvent.ROOM_CREATE, { profile: profile('HillRider'), settings: { maxPlayers: count, laps: 1, trackId: 'SUMMIT' } });
    const created = host.latest('ROOM_CREATED');
    assert.equal(created.room.settings.maxPlayers, count);
    assert.equal(created.room.settings.trackId, 'SUMMIT');
    assert.match(created.room.code, /^[A-Z2-9]{6}$/);
    codes.add(created.room.code);
    for (let i = 1; i < count; i++) join(manager, created.room.code, `Driver${i}`);
    assert.equal(manager.rooms.get(created.room.code).status, RoomStatus.READY_CHECK);
    const extra = join(manager, created.room.code, 'ExtraDriver');
    assert.equal(extra.latest('ERROR')?.code, 'ROOM_FULL');
  }
  assert.equal(codes.size, 3);
});

test('joining via normalized code and missing code gives explicit result', () => {
  const { manager, code } = makeRoom(3);
  const guest = join(manager, ` ${code.slice(0, 3)}-${code.slice(3)} `, 'DustFox');
  assert.equal(guest.latest('ROOM_JOINED').room.code, code);
  const missing = join(manager, 'ZZZZZZ', 'DustFox');
  assert.equal(missing.latest('ERROR')?.code, 'ROOM_NOT_FOUND');
});

test('profile edits propagate, invalid names and untrusted avatar URLs are rejected', () => {
  const { manager, host, code } = makeRoom();
  const guest = join(manager, code, 'DustFox');
  action(manager, guest, ClientEvent.PROFILE_UPDATE, profile('Apex Hawk', 'blue-helmet'));
  assert.equal(host.latest('ROOM_STATE_UPDATED').room.players[1].nickname, 'Apex Hawk');
  assert.equal(host.latest('ROOM_STATE_UPDATED').room.players[1].avatarId, 'blue-helmet');
  action(manager, guest, ClientEvent.PROFILE_UPDATE, { nickname: '<script>', avatarUrl: 'https://evil.example/bad.png' });
  assert.equal(guest.latest('ERROR')?.code, 'INVALID_PROFILE');
});

test('ready synchronization and host-only start enforce full/ready rules', () => {
  const { manager, host, code } = makeRoom(3);
  action(manager, host, ClientEvent.HOST_START_REQUEST);
  assert.equal(host.latest('ERROR')?.code, 'NOT_READY');
  const a = join(manager, code, 'DustFox');
  action(manager, a, ClientEvent.PLAYER_READY);
  assert.equal(a.latest('ERROR')?.code, 'BAD_STATE');
  const b = join(manager, code, 'TrackHawk');
  action(manager, host, ClientEvent.PLAYER_READY);
  action(manager, a, ClientEvent.PLAYER_READY);
  assert.equal(b.latest('ROOM_STATE_UPDATED').room.players.filter(p => p.ready).length, 2);
  action(manager, host, ClientEvent.HOST_START_REQUEST);
  assert.equal(host.latest('ERROR')?.code, 'NOT_READY');
  action(manager, b, ClientEvent.PLAYER_READY);
  action(manager, b, ClientEvent.HOST_START_REQUEST);
  assert.equal(b.latest('ERROR')?.code, 'HOST_ONLY');
  action(manager, a, ClientEvent.PLAYER_UNREADY);
  assert.equal(host.latest('ROOM_STATE_UPDATED').room.players[1].ready, false);
  action(manager, a, ClientEvent.PLAYER_READY);
  action(manager, host, ClientEvent.HOST_START_REQUEST);
  assert.equal(manager.rooms.get(code).status, RoomStatus.LOADING);
  assert.equal(b.latest('LOADING_STARTED')?.trackId, 'ORCHARD');
  action(manager, b, ClientEvent.PLAYER_LOADED);
  assert.equal(host.latest('ROOM_STATE_UPDATED').room.players[2].loaded, true);
  const late = join(manager, code, 'LateRider');
  assert.equal(late.latest('ERROR')?.code, 'RACE_STARTED');
});

test('leaving resets the ready check; host migration promotes oldest connected guest', () => {
  const { manager, host, code } = makeRoom(3);
  const a = join(manager, code, 'DustFox');
  const b = join(manager, code, 'TrackHawk');
  action(manager, host, ClientEvent.PLAYER_READY);
  action(manager, a, ClientEvent.PLAYER_READY);
  action(manager, b, ClientEvent.ROOM_LEAVE);
  assert.equal(manager.rooms.get(code).status, RoomStatus.WAITING);
  assert.equal(manager.rooms.get(code).players.some(p => p.ready), false);
  manager.leave(host);
  assert.equal(manager.rooms.get(code).hostPlayerId, a.latest('ROOM_JOINED').playerId);
  assert.equal(a.latest('HOST_CHANGED')?.nickname, 'DustFox');
});

test('reconnect resumes the same player instead of creating a duplicate', () => {
  const { manager, code } = makeRoom();
  const guest = join(manager, code, 'DustFox');
  const first = guest.latest('ROOM_JOINED');
  manager.leave(guest);
  const next = new Socket();
  action(manager, next, ClientEvent.ROOM_JOIN, { code, resumeToken: first.resumeToken, profile: profile('DustFox') });
  assert.equal(next.latest('ROOM_JOINED').playerId, first.playerId);
  assert.equal(next.latest('ROOM_JOINED').reconnected, true);
  assert.equal(manager.rooms.get(code).players.length, 2);
  assert.equal(JSON.stringify(next.latest('ROOM_JOINED').room).includes(first.resumeToken), false);
});

test('invalid custom avatar does not break creation or the default portrait path', () => {
  const manager = new RoomManager();
  const bad = new Socket();
  action(manager, bad, ClientEvent.ROOM_CREATE, { profile: { nickname: 'DustFox', avatarUrl: 'https://evil.example/image.png' }, settings: { maxPlayers: 2, laps: 1, trackId: 'ORCHARD' } });
  assert.equal(bad.latest('ERROR')?.code, 'BAD_REQUEST');
  const good = new Socket();
  action(manager, good, ClientEvent.ROOM_CREATE, { profile: profile('DustFox'), settings: { maxPlayers: 2, laps: 1, trackId: 'ORCHARD' } });
  assert.ok(good.latest('ROOM_CREATED'));
});
