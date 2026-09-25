export const ClientEvent = Object.freeze({
  ROOM_CREATE: 'ROOM_CREATE', ROOM_JOIN: 'ROOM_JOIN', ROOM_LEAVE: 'ROOM_LEAVE',
  PROFILE_UPDATE: 'PROFILE_UPDATE', PLAYER_READY: 'PLAYER_READY',
  PLAYER_UNREADY: 'PLAYER_UNREADY', HOST_START_REQUEST: 'HOST_START_REQUEST',
  PLAYER_LOADED: 'PLAYER_LOADED',
});

export const ServerEvent = Object.freeze({
  ROOM_CREATED: 'ROOM_CREATED', ROOM_JOINED: 'ROOM_JOINED',
  ROOM_STATE_UPDATED: 'ROOM_STATE_UPDATED', PLAYER_JOINED: 'PLAYER_JOINED',
  PLAYER_LEFT: 'PLAYER_LEFT', PROFILE_UPDATED: 'PROFILE_UPDATED',
  HOST_CHANGED: 'HOST_CHANGED', READY_STATE_UPDATED: 'READY_STATE_UPDATED',
  LOADING_STARTED: 'LOADING_STARTED', ERROR: 'ERROR',
});

export const RoomStatus = Object.freeze({
  WAITING: 'waiting', READY_CHECK: 'ready_check', LOADING: 'loading',
  COUNTDOWN: 'countdown', RACING: 'racing', FINISHED: 'finished',
});

export const TRACK_IDS = Object.freeze(['ORCHARD', 'QUARRY', 'SUMMIT']);
export const LAP_OPTIONS = Object.freeze([1, 2, 3, 5]);
export const CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
export const DEFAULT_AVATARS = Object.freeze([
  'red-helmet', 'ochre-helmet', 'blue-helmet', 'green-helmet',
  'cream-cap', 'orange-cap', 'sage-goggles', 'stone-goggles',
]);

const clientTypes = new Set(Object.values(ClientEvent));
const bannedNicknames = /(?:fuck|shit|cunt|nazi|hitler|slur)/i;

export function normalizeRoomCode(value) {
  return typeof value === 'string' ? value.replace(/\s|-/g, '').toUpperCase() : '';
}

export function validateNickname(value) {
  if (typeof value !== 'string') return null;
  const nickname = value.trim().replace(/\s+/g, ' ');
  if (nickname.length < 2 || nickname.length > 18 || !/^[A-Za-z0-9 _-]+$/.test(nickname) || bannedNicknames.test(nickname)) return null;
  return nickname;
}

export function validateSettings(value) {
  if (!value || typeof value !== 'object') return null;
  const { maxPlayers, laps, trackId } = value;
  return [2, 3, 4].includes(maxPlayers) && LAP_OPTIONS.includes(laps) && TRACK_IDS.includes(trackId)
    ? { maxPlayers, laps, trackId } : null;
}

export function validateAvatar(value, cloudName = '') {
  if (!value || typeof value !== 'object') return null;
  if (typeof value.avatarId === 'string' && DEFAULT_AVATARS.includes(value.avatarId)) {
    return { avatarId: value.avatarId, avatarUrl: null };
  }
  if (!cloudName || typeof value.avatarUrl !== 'string' || value.avatarUrl.length > 600) return null;
  try {
    const url = new URL(value.avatarUrl);
    if (url.protocol !== 'https:' || url.hostname !== 'res.cloudinary.com' || url.search || url.hash) return null;
    if (!url.pathname.startsWith(`/${cloudName}/image/upload/`) || !/\.(png|jpe?g|webp)$/i.test(url.pathname)) return null;
    return { avatarId: null, avatarUrl: url.toString() };
  } catch {
    return null;
  }
}

export function parseClientPacket(raw) {
  if (typeof raw !== 'string' || raw.length > 8192) return null;
  try {
    const packet = JSON.parse(raw);
    if (!packet || typeof packet !== 'object' || !clientTypes.has(packet.type) ||
      !packet.payload || typeof packet.payload !== 'object' || Array.isArray(packet.payload)) return null;
    return packet;
  } catch {
    return null;
  }
}
