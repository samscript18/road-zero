import { randomBytes, randomUUID } from 'node:crypto';
import {
  ClientEvent, ServerEvent, RoomStatus, CODE_ALPHABET, DEFAULT_AVATARS,
  normalizeRoomCode, parseClientPacket, validateAvatar, validateNickname, validateSettings,
} from '../shared/multiplayer-protocol.js';

const RECONNECT_GRACE_MS = 25_000;
const EMPTY_GRACE_MS = 60_000;
const WAITING_TTL_MS = 45 * 60_000;
const LOADING_TTL_MS = 15 * 60_000;

export class RoomManager {
  constructor({ now = () => Date.now(), cloudName = process.env.CLOUDINARY_CLOUD_NAME || '' } = {}) {
    this.now = now;
    this.cloudName = cloudName;
    this.rooms = new Map();
    this.socketPlayers = new WeakMap();
    this.creationTimes = new Map();
  }

  send(socket, type, payload) {
    if (socket?.readyState === 1) socket.send(JSON.stringify({ type, payload }));
  }

  error(socket, code, message) {
    this.send(socket, ServerEvent.ERROR, { code, message });
  }

  snapshot(room) {
    return {
      id: room.id, code: room.code, hostPlayerId: room.hostPlayerId,
      settings: room.settings, status: room.status, createdAt: room.createdAt,
      players: room.players.map(player => ({
        id: player.id, nickname: player.nickname, avatarId: player.avatarId,
        avatarUrl: player.avatarUrl, connected: player.connected,
        isHost: player.id === room.hostPlayerId, ready: player.ready,
        loaded: player.loaded, micEnabled: false, lap: 0, checkpoint: 0,
      })),
    };
  }

  broadcast(room, type, payload) {
    for (const player of room.players) this.send(player.socket, type, payload);
  }

  update(room) {
    room.updatedAt = this.now();
    this.broadcast(room, ServerEvent.ROOM_STATE_UPDATED, { room: this.snapshot(room) });
  }

  generateCode() {
    for (let attempt = 0; attempt < 100; attempt++) {
      const bytes = randomBytes(6);
      const code = Array.from(bytes, byte => CODE_ALPHABET[byte % CODE_ALPHABET.length]).join('');
      if (!this.rooms.has(code)) return code;
    }
    throw new Error('Room code space temporarily exhausted');
  }

  profile(payload) {
    const nickname = validateNickname(payload.nickname);
    const avatar = validateAvatar(payload, this.cloudName);
    return nickname && avatar ? { nickname, ...avatar } : null;
  }

  handle(socket, raw, ip = '') {
    const packet = parseClientPacket(typeof raw === 'string' ? raw : raw.toString());
    if (!packet) return this.error(socket, 'BAD_REQUEST', 'That lobby request could not be read.');
    const { type, payload } = packet;
    switch (type) {
      case ClientEvent.ROOM_CREATE: return this.create(socket, payload, ip);
      case ClientEvent.ROOM_JOIN: return this.join(socket, payload);
      case ClientEvent.ROOM_LEAVE: return this.leave(socket, true);
      case ClientEvent.PROFILE_UPDATE: return this.profileUpdate(socket, payload);
      case ClientEvent.PLAYER_READY: return this.setReady(socket, true);
      case ClientEvent.PLAYER_UNREADY: return this.setReady(socket, false);
      case ClientEvent.HOST_START_REQUEST: return this.startLoading(socket);
      case ClientEvent.PLAYER_LOADED: return this.setLoaded(socket);
      default: return this.error(socket, 'BAD_REQUEST', 'That lobby action is unavailable.');
    }
  }

  create(socket, payload, ip = '') {
    if (this.socketPlayers.has(socket)) return this.error(socket, 'ALREADY_IN_ROOM', 'Leave your current room first.');
    const settings = validateSettings(payload.settings);
    const profile = this.profile(payload.profile || {});
    if (!settings || !profile) return this.error(socket, 'BAD_REQUEST', 'Choose valid race settings and a driver profile.');
    const now = this.now();
    const times = (this.creationTimes.get(ip) || []).filter(time => now - time < 60_000);
    if (times.length >= 6) return this.error(socket, 'RATE_LIMIT', 'Too many rooms were opened. Try again shortly.');
    times.push(now);
    this.creationTimes.set(ip, times);
    const code = this.generateCode();
    const player = this.newPlayer(socket, profile);
    const room = {
      id: randomUUID(), code, settings, status: RoomStatus.WAITING,
      hostPlayerId: player.id, players: [player], createdAt: now, updatedAt: now,
    };
    this.rooms.set(code, room);
    this.socketPlayers.set(socket, { code, playerId: player.id });
    this.send(socket, ServerEvent.ROOM_CREATED, { room: this.snapshot(room), playerId: player.id, resumeToken: player.resumeToken });
    this.update(room);
    return room;
  }

  newPlayer(socket, profile) {
    return {
      id: randomUUID(), resumeToken: randomBytes(24).toString('base64url'),
      ...profile, connected: true, ready: false, loaded: false,
      joinedAt: this.now(), disconnectedAt: null, socket,
    };
  }

  join(socket, payload) {
    if (this.socketPlayers.has(socket)) return this.error(socket, 'ALREADY_IN_ROOM', 'Leave your current room first.');
    const code = normalizeRoomCode(payload.code);
    const room = this.rooms.get(code);
    if (!room) return this.error(socket, 'ROOM_NOT_FOUND', 'That room could not be found or has expired.');
    const token = typeof payload.resumeToken === 'string' ? payload.resumeToken : '';
    const returning = token && room.players.find(player => player.resumeToken === token);
    if (returning) {
      if (returning.socket && returning.socket !== socket) {
        this.socketPlayers.delete(returning.socket);
        returning.socket.close?.(4001, 'Reconnected elsewhere');
      }
      returning.socket = socket;
      returning.connected = true;
      returning.disconnectedAt = null;
      room.emptyAt = null;
      if (room.status === RoomStatus.LOADING) returning.loaded = false;
      this.socketPlayers.set(socket, { code, playerId: returning.id });
      this.recomputeReadyState(room);
      this.send(socket, ServerEvent.ROOM_JOINED, { room: this.snapshot(room), playerId: returning.id, resumeToken: returning.resumeToken, reconnected: true });
      this.update(room);
      return room;
    }
    if (room.status !== RoomStatus.WAITING && room.status !== RoomStatus.READY_CHECK) {
      return this.error(socket, 'RACE_STARTED', 'This grid has already moved on.');
    }
    if (room.players.length >= room.settings.maxPlayers) return this.error(socket, 'ROOM_FULL', 'This race already has every driver.');
    const profile = this.profile(payload.profile || {});
    if (!profile) return this.error(socket, 'INVALID_PROFILE', 'Choose a valid nickname and avatar.');
    const player = this.newPlayer(socket, profile);
    room.players.push(player);
    if (!room.players.some(item => item.id === room.hostPlayerId && item.connected)) {
      room.hostPlayerId = player.id;
      this.broadcast(room, ServerEvent.HOST_CHANGED, { playerId: player.id, nickname: player.nickname });
    }
    room.emptyAt = null;
    this.socketPlayers.set(socket, { code, playerId: player.id });
    this.recomputeReadyState(room);
    this.send(socket, ServerEvent.ROOM_JOINED, { room: this.snapshot(room), playerId: player.id, resumeToken: player.resumeToken, reconnected: false });
    this.broadcast(room, ServerEvent.PLAYER_JOINED, { playerId: player.id, nickname: player.nickname });
    this.update(room);
    return room;
  }

  current(socket) {
    const link = this.socketPlayers.get(socket);
    const room = link && this.rooms.get(link.code);
    const player = room?.players.find(item => item.id === link.playerId);
    return room && player ? { room, player } : null;
  }

  profileUpdate(socket, payload) {
    const current = this.current(socket);
    if (!current) return this.error(socket, 'NOT_IN_ROOM', 'Join a room first.');
    if (current.room.status === RoomStatus.LOADING) return this.error(socket, 'ROOM_LOCKED', 'Driver profiles are locked while the grid loads.');
    const profile = this.profile(payload);
    if (!profile) return this.error(socket, 'INVALID_PROFILE', 'Use 2–18 letters or numbers and a valid avatar.');
    Object.assign(current.player, profile);
    this.broadcast(current.room, ServerEvent.PROFILE_UPDATED, { playerId: current.player.id });
    this.update(current.room);
  }

  setReady(socket, ready) {
    const current = this.current(socket);
    if (!current) return this.error(socket, 'NOT_IN_ROOM', 'Join a room first.');
    if (current.room.status !== RoomStatus.READY_CHECK) return this.error(socket, 'BAD_STATE', 'The ready check is not open yet.');
    current.player.ready = ready;
    this.broadcast(current.room, ServerEvent.READY_STATE_UPDATED, { playerId: current.player.id, ready });
    this.update(current.room);
  }

  startLoading(socket) {
    const current = this.current(socket);
    if (!current) return this.error(socket, 'NOT_IN_ROOM', 'Join a room first.');
    const { room, player } = current;
    if (player.id !== room.hostPlayerId) return this.error(socket, 'HOST_ONLY', 'Only the host can send the grid onward.');
    if (room.status !== RoomStatus.READY_CHECK || room.players.length !== room.settings.maxPlayers ||
      !room.players.every(item => item.connected && item.ready)) {
      return this.error(socket, 'NOT_READY', 'Wait until the grid is full and every driver is ready.');
    }
    room.status = RoomStatus.LOADING;
    room.players.forEach(item => { item.loaded = false; });
    this.broadcast(room, ServerEvent.LOADING_STARTED, { trackId: room.settings.trackId });
    this.update(room);
  }

  setLoaded(socket) {
    const current = this.current(socket);
    if (!current) return this.error(socket, 'NOT_IN_ROOM', 'Join a room first.');
    if (current.room.status !== RoomStatus.LOADING) return this.error(socket, 'BAD_STATE', 'The grid is not loading yet.');
    current.player.loaded = true;
    this.update(current.room);
  }

  recomputeReadyState(room) {
    if (room.status === RoomStatus.LOADING) return;
    const full = room.players.length === room.settings.maxPlayers && room.players.every(item => item.connected);
    const status = full ? RoomStatus.READY_CHECK : RoomStatus.WAITING;
    if (room.status !== status) room.players.forEach(player => { player.ready = false; });
    room.status = status;
  }

  leave(socket, explicit = false) {
    const current = this.current(socket);
    if (!current) return;
    const { room, player } = current;
    this.socketPlayers.delete(socket);
    player.socket = null;
    player.connected = false;
    player.ready = false;
    player.loaded = false;
    player.disconnectedAt = this.now();
    if (explicit) room.players = room.players.filter(item => item !== player);
    if (room.players.every(item => !item.connected)) room.emptyAt = this.now();
    if (room.status === RoomStatus.READY_CHECK) {
      room.status = RoomStatus.WAITING;
      room.players.forEach(item => { item.ready = false; });
    }
    if (room.hostPlayerId === player.id) {
      const next = room.players.find(item => item.connected);
      if (next) {
        room.hostPlayerId = next.id;
        this.broadcast(room, ServerEvent.HOST_CHANGED, { playerId: next.id, nickname: next.nickname });
      }
    }
    this.broadcast(room, ServerEvent.PLAYER_LEFT, { playerId: player.id, nickname: player.nickname, disconnected: !explicit });
    this.update(room);
  }

  sweep() {
    const now = this.now();
    for (const [code, room] of this.rooms) {
      const before = room.players.length;
      room.players = room.players.filter(player => player.connected || now - player.disconnectedAt < RECONNECT_GRACE_MS);
      if (room.players.length !== before) {
        this.recomputeReadyState(room);
        this.update(room);
      }
      const empty = room.players.every(player => !player.connected);
      const idle = now - room.updatedAt;
      if ((empty && room.emptyAt != null && now - room.emptyAt >= EMPTY_GRACE_MS) ||
        (room.status === RoomStatus.LOADING && idle >= LOADING_TTL_MS) ||
        (room.status !== RoomStatus.LOADING && idle >= WAITING_TTL_MS)) {
        for (const player of room.players) {
          if (player.socket) this.error(player.socket, 'ROOM_EXPIRED', 'This room has expired. Create a new race.');
          player.socket?.close?.(4002, 'Room expired');
        }
        this.rooms.delete(code);
      }
    }
    for (const [ip, times] of this.creationTimes) {
      const recent = times.filter(time => now - time < 60_000);
      if (recent.length) this.creationTimes.set(ip, recent);
      else this.creationTimes.delete(ip);
    }
  }
}
