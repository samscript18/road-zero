export type RoomStatus = 'waiting' | 'ready_check' | 'loading' | 'countdown' | 'racing' | 'finished';
export type TrackId = 'ORCHARD' | 'QUARRY' | 'SUMMIT';
export type RoomSettings = { maxPlayers: 2 | 3 | 4; laps: 1 | 2 | 3 | 5; trackId: TrackId };
export type Avatar = { avatarId: string | null; avatarUrl: string | null };
export type PlayerProfile = Avatar & { nickname: string };
export type RoomPlayer = PlayerProfile & {
  id: string; connected: boolean; isHost: boolean; ready: boolean; loaded: boolean;
  micEnabled: boolean; lap: number; checkpoint: number;
};
export type RoomSnapshot = {
  id: string; code: string; hostPlayerId: string; settings: RoomSettings;
  status: RoomStatus; players: RoomPlayer[]; createdAt: number; startAt?: number;
};
export type ServerPacket = { type: string; payload: Record<string, unknown> };
export const ClientEvent: Readonly<Record<'ROOM_CREATE' | 'ROOM_JOIN' | 'ROOM_LEAVE' | 'PROFILE_UPDATE' | 'PLAYER_READY' | 'PLAYER_UNREADY' | 'HOST_START_REQUEST' | 'PLAYER_LOADED', string>>;
export const ServerEvent: Readonly<Record<'ROOM_CREATED' | 'ROOM_JOINED' | 'ROOM_STATE_UPDATED' | 'PLAYER_JOINED' | 'PLAYER_LEFT' | 'PROFILE_UPDATED' | 'HOST_CHANGED' | 'READY_STATE_UPDATED' | 'LOADING_STARTED' | 'ERROR', string>>;
export const RoomStatus: Readonly<Record<'WAITING' | 'READY_CHECK' | 'LOADING' | 'COUNTDOWN' | 'RACING' | 'FINISHED', RoomStatus>>;
export const TRACK_IDS: readonly TrackId[];
export const LAP_OPTIONS: readonly RoomSettings['laps'][];
export const CODE_ALPHABET: string;
export const DEFAULT_AVATARS: readonly string[];
export function normalizeRoomCode(value: unknown): string;
export function validateNickname(value: unknown): string | null;
export function validateSettings(value: unknown): RoomSettings | null;
export function validateAvatar(value: unknown, cloudName?: string): Avatar | null;
export function parseClientPacket(raw: unknown): { type: string; payload: Record<string, unknown> } | null;
