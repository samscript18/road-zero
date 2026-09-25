import { ClientEvent, ServerEvent, normalizeRoomCode, validateNickname, type RoomSettings, type RoomSnapshot, type PlayerProfile } from '../../shared/multiplayer-protocol.js';
import { avatarDataUrl, avatarIds } from './avatars';
import './lobby.css';

type LobbyOptions = { onOpen: () => void; onClose: () => void; prepareTrack: (trackId: RoomSettings['trackId']) => Promise<void> };
const tracks: Record<string, string> = { ORCHARD: 'Orchard Sprint', QUARRY: 'Quarry Loop', SUMMIT: 'Summit Run' };
const profileKey = 'road-zero-multiplayer-profile';
const tokenKey = (code: string) => `road-zero-room-${code}`;
const safeWords = ['Dust', 'Apex', 'Hill', 'Track', 'Redline', 'Rally', 'Canyon', 'Paddock'];
const safeEnds = ['Rider', 'Fox', 'Runner', 'Hawk', 'Bear', 'Ace', 'Pilot', 'Swift'];
const random = (max: number) => Math.floor(Math.random() * max);
const freshProfile = (): PlayerProfile => ({ nickname: `${safeWords[random(safeWords.length)]}${safeEnds[random(safeEnds.length)]}${10 + random(90)}`, avatarId: avatarIds[random(avatarIds.length)], avatarUrl: null });
function storedProfile(): PlayerProfile {
  try {
    const data = JSON.parse(localStorage.getItem(profileKey) || 'null');
    if (validateNickname(data?.nickname) && (avatarIds.includes(data.avatarId) || (typeof data.avatarUrl === 'string' && data.avatarUrl.startsWith('https://res.cloudinary.com/')))) return data;
  } catch { /* use a safe local default */ }
  const profile = freshProfile();
  localStorage.setItem(profileKey, JSON.stringify(profile));
  return profile;
}

export function mountLobby({ onOpen, onClose, prepareTrack }: LobbyOptions) {
  let profile = storedProfile();
  let socket: WebSocket | null = null;
  let room: RoomSnapshot | null = null;
  let playerId = '';
  let resumeToken = '';
  let reconnectTimer: number | null = null;
  let retry = 0;
  let active = false;
  let intent: 'create' | 'join' | null = null;
  let joinCode = '';
  let view: 'entry' | 'create' | 'join' | 'room' = 'entry';
  let uploadAvailable = false;
  let avatarConfigChecked = false;
  let noticeText = '';
  let editingProfile = false;
  const root = document.createElement('section');
  root.id = 'multiplayerLobby';
  root.className = 'screen hidden';
  root.setAttribute('aria-label', 'Race together lobby');
  document.querySelector('#app')!.append(root);

  function node<K extends keyof HTMLElementTagNameMap>(tag: K, className = '', value = ''): HTMLElementTagNameMap[K] {
    const el = document.createElement(tag);
    el.className = className;
    el.textContent = value;
    return el;
  }
  function button(label: string, click: () => void, className = '') {
    const el = node('button', className, label);
    el.type = 'button';
    el.addEventListener('click', click);
    return el;
  }
  function notice(value: string) {
    noticeText = value;
    const el = root.querySelector<HTMLElement>('.lobby-notice');
    if (el) el.textContent = value;
  }
  function send(type: string, payload: Record<string, unknown> = {}) {
    if (socket?.readyState === WebSocket.OPEN) socket.send(JSON.stringify({ type, payload }));
    else notice('Connection unavailable. Reconnecting…');
  }
  function connect(next: 'create' | 'join', code = '') {
    intent = next;
    joinCode = normalizeRoomCode(code);
    if (socket) { socket.onclose = null; socket.close(); }
    const scheme = location.protocol === 'https:' ? 'wss:' : 'ws:';
    socket = new WebSocket(`${scheme}//${location.host}/multiplayer`);
    socket.onopen = () => {
      retry = 0;
      send(next === 'create' ? ClientEvent.ROOM_CREATE : ClientEvent.ROOM_JOIN,
        next === 'create' ? { profile, settings: settingsFromForm() } : { code: joinCode, profile, resumeToken: resumeToken || localStorage.getItem(tokenKey(joinCode)) || '' });
      notice('Connected to the paddock.');
    };
    socket.onmessage = event => {
      let packet: { type: string; payload: any };
      try { packet = JSON.parse(event.data); } catch { return; }
      const data = packet.payload || {};
      if (packet.type === ServerEvent.ROOM_CREATED || packet.type === ServerEvent.ROOM_JOINED) {
        room = data.room;
        playerId = data.playerId;
        resumeToken = data.resumeToken;
        localStorage.setItem(tokenKey(room!.code), resumeToken);
        history.replaceState(null, '', `/race/${room!.code}`);
        view = 'room';
        render();
        if (data.reconnected) notice('Back on the grid. Your place is saved.');
        if (room!.status === 'loading') {
          void prepareTrack(room!.settings.trackId).then(() => send(ClientEvent.PLAYER_LOADED))
            .catch(() => notice('Track loading failed. Try refreshing the page.'));
        }
      } else if (packet.type === ServerEvent.ROOM_STATE_UPDATED) {
        room = data.room;
        if (view === 'room') render();
      } else if (packet.type === ServerEvent.HOST_CHANGED) {
        render(); notice(`${data.nickname} is now the host.`);
      } else if (packet.type === ServerEvent.LOADING_STARTED) {
        void prepareTrack(data.trackId).then(() => send(ClientEvent.PLAYER_LOADED)).catch(() => notice('Track loading failed. Try refreshing the page.'));
      } else if (packet.type === ServerEvent.ERROR) {
        notice(data.message || 'Something went wrong.');
        if (['ROOM_NOT_FOUND', 'ROOM_FULL', 'RACE_STARTED', 'ROOM_EXPIRED'].includes(data.code)) {
          room = null; resumeToken = ''; view = 'join'; render(); notice(data.message);
        }
      }
    };
    socket.onerror = () => notice('Cannot reach the race lobby server. Check your connection.');
    socket.onclose = () => {
      if (!active || !room || !intent) return;
      if (retry >= 8) { notice('Connection lost. Reopen the invite to try again.'); return; }
      notice('Connection interrupted. Holding your grid slot…');
      reconnectTimer = window.setTimeout(() => { retry++; connect('join', room!.code); }, Math.min(1000 * 2 ** retry, 4000));
    };
  }
  function settingsFromForm(): RoomSettings {
    const get = (id: string) => (root.querySelector<HTMLSelectElement>(`#${id}`)?.value || '');
    return { maxPlayers: Number(get('lobbyCount')) as 2 | 3 | 4, laps: Number(get('lobbyLaps')) as 1 | 2 | 3 | 5, trackId: get('lobbyTrack') as RoomSettings['trackId'] };
  }
  function avatarImage(avatar: { avatarId: string | null; avatarUrl: string | null }) {
    const img = node('img', 'lobby-avatar');
    img.alt = 'Driver portrait';
    img.src = avatar.avatarUrl || avatarDataUrl(avatar.avatarId);
    img.referrerPolicy = 'no-referrer';
    return img;
  }
  function profileEditor(parent: HTMLElement) {
    const box = node('div', 'lobby-profile');
    const heading = node('h3', '', 'YOUR DRIVER');
    const input = node('input', 'lobby-name') as HTMLInputElement;
    input.value = profile.nickname;
    input.maxLength = 18;
    input.setAttribute('aria-label', 'Driver nickname');
    input.addEventListener('change', () => {
      const nickname = validateNickname(input.value);
      if (!nickname) { input.value = profile.nickname; notice('Use 2–18 letters or numbers; spaces, hyphens and underscores are okay.'); return; }
      profile = { ...profile, nickname };
      localStorage.setItem(profileKey, JSON.stringify(profile));
      if (room) send(ClientEvent.PROFILE_UPDATE, profile);
    });
    box.append(heading, input);
    const choices = node('div', 'lobby-avatars');
    for (const id of avatarIds) {
      const choice = button('', () => {
        profile = { ...profile, avatarId: id, avatarUrl: null };
        localStorage.setItem(profileKey, JSON.stringify(profile));
        if (room) send(ClientEvent.PROFILE_UPDATE, profile);
        render();
      }, `lobby-avatar-button ${profile.avatarId === id ? 'chosen' : ''}`);
      choice.setAttribute('aria-label', id.replaceAll('-', ' '));
      choice.append(avatarImage({ avatarId: id, avatarUrl: null }));
      choices.append(choice);
    }
    box.append(choices);
    if (uploadAvailable) {
      const file = node('input') as HTMLInputElement;
      file.type = 'file'; file.accept = 'image/png,image/jpeg,image/webp'; file.className = 'lobby-file';
      file.addEventListener('change', () => { if (file.files?.[0]) void uploadPortrait(file.files[0]); });
      box.append(file);
    } else box.append(node('small', '', 'Custom portraits unavailable here; choose a paddock portrait.'));
    parent.append(box);
  }
  async function uploadPortrait(file: File) {
    if (!room || !resumeToken) return notice('Join a room before uploading a portrait.');
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type) || file.size > 2_000_000) return notice('Use a PNG, JPEG or WebP image under 2 MB.');
    try {
      const image = await createImageBitmap(file);
      const canvas = document.createElement('canvas'); canvas.width = canvas.height = 256;
      const context = canvas.getContext('2d')!;
      const side = Math.min(image.width, image.height);
      context.drawImage(image, (image.width - side) / 2, (image.height - side) / 2, side, side, 0, 0, 256, 256);
      image.close();
      const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob(result => result ? resolve(result) : reject(new Error('Image conversion failed')), 'image/jpeg', .85));
      const signed = await fetch('/api/avatar/sign', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code: room.code, resumeToken }) });
      const data = await signed.json();
      if (!signed.ok) throw new Error(data.error || 'Portrait service unavailable.');
      const form = new FormData();
      for (const [key, value] of Object.entries(data.params)) form.append(key, String(value));
      form.append('api_key', data.apiKey); form.append('signature', data.signature); form.append('file', blob, 'driver.jpg');
      const upload = await fetch(`https://api.cloudinary.com/v1_1/${encodeURIComponent(data.cloudName)}/image/upload`, { method: 'POST', body: form });
      const result = await upload.json();
      if (!upload.ok || !result.secure_url) throw new Error('Portrait upload failed.');
      profile = { ...profile, avatarId: null, avatarUrl: result.secure_url };
      localStorage.setItem(profileKey, JSON.stringify(profile));
      send(ClientEvent.PROFILE_UPDATE, profile); render(); notice('New portrait fitted to your driver card.');
    } catch (error) { notice(`Portrait could not be uploaded. ${error instanceof Error ? error.message : ''} Default portraits still work.`); }
  }
  function inviteUrl() { return `${location.origin}/race/${room?.code || ''}`; }
  async function copy(value: string, label: string) {
    try { await navigator.clipboard.writeText(value); notice(`${label} copied.`); }
    catch {
      const input = document.createElement('textarea'); input.value = value;
      document.body.append(input); input.select();
      const okay = document.execCommand('copy'); input.remove();
      notice(okay ? `${label} copied.` : `${label}: ${value}`);
    }
  }
  function select(label: string, id: string, options: [string, string][], selected: string) {
    const wrapper = node('label', 'lobby-field', label);
    const el = node('select') as HTMLSelectElement; el.id = id;
    for (const [value, text] of options) { const option = node('option', '', text) as HTMLOptionElement; option.value = value; el.append(option); }
    el.value = selected; wrapper.append(el); return wrapper;
  }
  function render() {
    if (!active) return;
    root.replaceChildren();
    const card = node('div', 'lobby-card');
    const top = node('div', 'lobby-top');
    top.append(node('span', 'kicker', 'CANTERA MOTORSPORT · RACE TOGETHER'), button('← MENU', close, 'lobby-back'));
    card.append(top);
    if (view === 'entry') {
      card.append(node('h2', '', 'RACE TOGETHER'), node('p', 'lobby-intro', 'Call your crew to the hillside. Four drivers, one shared grid.'));
      profileEditor(card);
      const actions = node('div', 'lobby-actions');
      actions.append(button('CREATE RACE ↗', () => { view = 'create'; render(); }, 'primary'), button('JOIN RACE →', () => { view = 'join'; render(); }));
      card.append(actions);
    } else if (view === 'create') {
      card.append(node('h2', '', 'SET THE GRID'));
      profileEditor(card);
      const fields = node('div', 'lobby-settings');
      fields.append(select('RACERS', 'lobbyCount', [['2', '2 DRIVERS'], ['3', '3 DRIVERS'], ['4', '4 DRIVERS']], '4'),
        select('LAPS', 'lobbyLaps', [['1', '1 LAP'], ['2', '2 LAPS'], ['3', '3 LAPS'], ['5', '5 LAPS']], '2'),
        select('ROAD', 'lobbyTrack', [['ORCHARD', 'ORCHARD SPRINT'], ['QUARRY', 'QUARRY LOOP'], ['SUMMIT', 'SUMMIT RUN']], 'ORCHARD'));
      card.append(fields, button('CREATE ROOM ↗', () => { const nickname = validateNickname(root.querySelector<HTMLInputElement>('.lobby-name')?.value || profile.nickname); if (nickname) profile.nickname = nickname; connect('create'); }, 'primary'));
    } else if (view === 'join') {
      card.append(node('h2', '', 'JOIN THE GRID'));
      profileEditor(card);
      const field = node('input', 'lobby-code') as HTMLInputElement;
      field.id = 'lobbyJoinCode'; field.placeholder = 'ROOM CODE'; field.maxLength = 12;
      field.value = joinCode;
      field.setAttribute('aria-label', 'Room code');
      card.append(field, button('JOIN RACE →', () => {
        const code = normalizeRoomCode(field.value);
        if (!/^[A-Z2-9]{6}$/.test(code)) return notice('Enter the six-character room code.');
        connect('join', code);
      }, 'primary'));
    } else if (room) {
      const me = room.players.find(p => p.id === playerId);
      const connected = room.players.filter(p => p.connected).length;
      const full = connected === room.settings.maxPlayers;
      const loading = room.status === 'loading';
      card.append(node('p', 'lobby-round', `${tracks[room.settings.trackId]} · ${room.settings.laps} LAP${room.settings.laps > 1 ? 'S' : ''}`),
        node('h2', '', loading ? 'PREPARING THE GRID' : full ? 'THE GRID IS COMPLETE' : 'WAITING ON THE GRID'),
        node('p', 'lobby-counter', `${connected} / ${room.settings.maxPlayers} RACERS JOINED`));
      if (!loading) card.append(node('p', 'lobby-sub', full ? 'Every driver must signal ready before the host sends us onward.' : 'Engines warming up… invite your racers.'));
      if (!loading) {
        card.append(button(editingProfile ? 'DONE EDITING DRIVER' : 'EDIT DRIVER', () => { editingProfile = !editingProfile; render(); }, 'lobby-edit'));
        if (editingProfile) profileEditor(card);
      }
      const share = node('div', 'lobby-share');
      share.append(node('strong', 'lobby-room-code', room.code), button('COPY CODE', () => void copy(room!.code, 'Room code')),
        button('COPY INVITE LINK', () => void copy(inviteUrl(), 'Invite link')),
        button('INVITE RACERS', () => {
          const message = `Join my Road Zero race 🏁\nRoom code: ${room!.code}\n${inviteUrl()}`;
          if (navigator.share) void navigator.share({ title: 'Road Zero race', text: message, url: inviteUrl() }).catch(() => {});
          else void copy(message, 'Invitation');
        }));
      card.append(share);
      const grid = node('div', 'lobby-grid');
      for (let i = 0; i < room.settings.maxPlayers; i++) {
        const p = room.players[i];
        const item = node('div', `lobby-driver ${p?.ready || p?.loaded ? 'is-ready' : ''}`);
        if (p) {
          item.append(avatarImage(p));
          const detail = node('div', 'lobby-driver-detail');
          detail.append(node('strong', '', p.nickname), node('small', '', `${p.isHost ? 'HOST · ' : ''}${!p.connected ? 'RECONNECTING' : loading ? p.loaded ? 'READY TO RACE' : 'LOADING…' : p.ready ? 'READY ✓' : 'NOT READY'} · MIC OFF`));
          item.append(detail);
        } else item.append(node('span', 'lobby-empty', `GRID SLOT ${i + 1} · AWAITING DRIVER`));
        grid.append(item);
      }
      card.append(grid);
      if (!loading) {
        if (full && me) card.append(button(me.ready ? 'UNREADY' : 'READY UP ✓', () => send(me.ready ? ClientEvent.PLAYER_UNREADY : ClientEvent.PLAYER_READY), `lobby-ready ${me.ready ? '' : 'primary'}`));
        if (me?.isHost && full && room.players.every(p => p.ready && p.connected)) card.append(button('PROCEED TO RACE →', () => send(ClientEvent.HOST_START_REQUEST), 'primary lobby-proceed'));
        else if (!me?.isHost && full && room.players.every(p => p.ready && p.connected)) card.append(node('p', 'lobby-sub', 'Waiting for host to start the race…'));
      } else card.append(node('p', 'lobby-phase-note', 'Phase 1 grid assembled. Live racing arrives in the next phase.'));
      card.append(button('LEAVE ROOM', close, 'lobby-leave'));
    }
    card.append(node('p', 'lobby-notice', noticeText));
    root.append(card);
  }
  function open() {
    if (active) return;
    active = true; onOpen(); root.classList.remove('hidden');
    if (!avatarConfigChecked) {
      avatarConfigChecked = true;
      fetch('/api/avatar/config').then(r => r.ok ? r.json() : null)
        .then(data => { const available = !!data?.available; if (available !== uploadAvailable) { uploadAvailable = available; if (active) render(); } }).catch(() => {});
    }
    const match = location.pathname.match(/^\/race\/([A-Za-z0-9-]+)\/?$/);
    if (match) { joinCode = normalizeRoomCode(match[1]); view = 'join'; }
    else view = 'entry';
    render();
  }
  function close() {
    active = false;
    if (reconnectTimer != null) window.clearTimeout(reconnectTimer);
    if (socket) { if (socket.readyState === WebSocket.OPEN) send(ClientEvent.ROOM_LEAVE); socket.onclose = null; socket.close(); socket = null; }
    room = null; playerId = ''; resumeToken = ''; retry = 0;
    root.classList.add('hidden'); history.replaceState(null, '', '/'); onClose();
  }
  return { open, openInvite: () => { if (location.pathname.startsWith('/race/')) open(); } };
}
