# ROAD ZERO — RACE TOGETHER MULTIPLAYER EXPANSION

You are extending an EXISTING, WORKING racing game.

The existing game already contains:

- single-player championship,
- quick race,
- three AI rivals,
- multiple tracks,
- lap/checkpoint validation,
- race countdown,
- results screens,
- desktop controls,
- mobile/touch controls,
- existing 404 Game Jam compliance,
- existing visual/audio systems,
- existing local validation and tests.

DO NOT rebuild the existing game.

DO NOT destabilize working single-player systems.

The goal is to add a new multiplayer mode called:

# RACE TOGETHER

The mode allows players in different locations to create a private race, invite friends through a link or room code, wait for the selected number of racers, complete a ready check, load the race together, compete against real human-controlled cars, and optionally communicate through live voice chat.

This work MUST be completed in THREE SEPARATE PHASES.

Do not begin Phase 2 until Phase 1 passes its acceptance tests.

Do not begin Phase 3 until Phase 2 passes its acceptance tests.

The phases are:

1. Lobby / invite link / room code / player profiles / ready synchronization
2. Real human multiplayer racing
3. Live multiplayer voice chat

Preserve the working single-player game throughout all three phases.

---

# GLOBAL RULES

Before changing code:

1. Read the entire repository.
2. Read the existing `AGENTS.md` instructions and all relevant game documentation.
3. Run the existing tests.
4. Run the current game.
5. Understand the existing race state machine, track system, car controller, checkpoint system, championship system and UI.
6. Create a baseline receipt before modifying multiplayer-related code.

Create:

`docs/multiplayer/MULTIPLAYER_BASELINE.md`

Record:

- current commit SHA,
- current single-player test status,
- current build status,
- important architecture,
- existing race lifecycle,
- relevant files/modules,
- current multiplayer-related dependencies if any.

Do not modify existing working systems without understanding them first.

---

# ARCHITECTURAL PRINCIPLES

Multiplayer MUST be an additional mode.

Desired top-level game modes:

- CHAMPIONSHIP
- QUICK RACE
- RACE TOGETHER
- HOW TO PLAY

Single-player systems must continue functioning.

Reuse shared systems where sensible:

- track definitions,
- car visuals,
- lap/checkpoint logic,
- race countdown UI,
- race results UI,
- controls,
- camera,
- audio,
- environment.

Do not duplicate large amounts of race logic unnecessarily.

However, multiplayer-specific state must remain isolated enough that it cannot corrupt championship state.

---

# MULTIPLAYER TERMINOLOGY

Use these concepts consistently:

## Player

A connected human racer.

## Host

The player who creates a room.

## Room

A private multiplayer race session.

## Room Code

A short human-readable code such as:

`R7K4XP`

## Invite Link

A URL that automatically opens/join the corresponding room.

Example:

`/race/R7K4XP`

## Expected Players

The exact number of human racers selected by the host.

## Ready

A lobby state explicitly selected by a player.

## Loaded

A separate state indicating that a player's race scene has finished loading.

Ready and Loaded are NOT the same thing.

---

# PLAYER COUNT

Support:

- minimum: 2 human racers
- maximum: 4 human racers

Do not exceed 4 players in this implementation.

The existing racing game was designed around a small racing field and 2–4 participants keeps networking and voice complexity manageable.

---

# MULTIPLAYER STATE MACHINE

The server must be the authority over the room lifecycle.

Use explicit states:

```ts
type RoomStatus =
  | "waiting"
  | "ready_check"
  | "loading"
  | "countdown"
  | "racing"
  | "finished";
```

Expected progression:

```text
WAITING
   ↓
READY_CHECK
   ↓
LOADING
   ↓
COUNTDOWN
   ↓
RACING
   ↓
FINISHED
```

Illegal transitions must be rejected.

Do not let clients arbitrarily change the room state.

---

# SERVER AUTHORITY

The multiplayer server should own:

- room creation,
- room code generation,
- host identity,
- expected player count,
- room settings,
- current participants,
- connection states,
- ready states,
- loaded states,
- room lifecycle,
- synchronized start time,
- checkpoint progression,
- lap progression,
- finish validation,
- finishing order.

Clients may control their own driving input/physics during Phase 2, but must not be trusted to freely declare race results.

---

# REAL-TIME TRANSPORT

Use a real-time socket architecture suitable for browser multiplayer.

Prefer the simplest robust approach compatible with the existing repository.

Possible choices include:

- native WebSocket,
- Socket.IO,
- another already-existing compatible real-time layer.

Do not introduce unnecessary infrastructure.

Document the selected transport and why.

Create:

`docs/multiplayer/ARCHITECTURE.md`

---

# ROOM DATA MODEL

Use an explicit typed structure similar to:

```ts
type RaceRoom = {
  id: string;
  code: string;

  hostPlayerId: string;

  settings: {
    maxPlayers: number;
    laps: number;
    trackId: string;
  };

  status:
    | "waiting"
    | "ready_check"
    | "loading"
    | "countdown"
    | "racing"
    | "finished";

  players: MultiplayerPlayer[];

  createdAt: number;

  startAt?: number;
};

type MultiplayerPlayer = {
  id: string;

  nickname: string;
  avatarUrl: string;

  connected: boolean;
  isHost: boolean;

  ready: boolean;
  loaded: boolean;

  micEnabled: boolean;

  lap: number;
  checkpoint: number;

  finishTime?: number;
  finishPosition?: number;
};
```

Adjust implementation details as necessary while preserving equivalent semantics.

---

# ROOM CODE GENERATION

Generate short room codes that are:

- easy to copy,
- case-insensitive,
- difficult to confuse visually.

Avoid ambiguous characters where possible:

- `0`
- `O`
- `1`
- `I`
- `L`

Example alphabet:

`ABCDEFGHJKMNPQRSTUVWXYZ23456789`

Target approximately 6 characters.

Room codes must be unique among active rooms.

---

# ROOM EXPIRATION

Rooms should not live forever.

Implement sensible cleanup.

For example:

- remove an empty room after a short grace period,
- expire abandoned waiting rooms,
- clean up completed rooms after an appropriate duration.

Do not create unbounded server memory growth.

---

# ============================================================
# PHASE 1
# LOBBY / LINK / CODE / PROFILE / READY SYNCHRONIZATION
# ============================================================

# PHASE 1 GOAL

Build the entire multiplayer lobby experience WITHOUT implementing real multiplayer driving yet.

At the end of Phase 1, multiple browsers/devices must be able to:

- create a race,
- obtain a room code,
- obtain an invite link,
- join the same room,
- see one another,
- edit nickname/avatar,
- see live join/leave state,
- wait for the required number of racers,
- perform a synchronized ready check,
- allow only the host to proceed,
- enter a placeholder/loading state together.

Do NOT implement synchronized human race cars yet.

---

# PHASE 1.1 — LANDING PAGE

Add:

# RACE TOGETHER

to the main game menu.

It should visually match the existing game.

Do not redesign the whole landing page.

Selecting it opens:

## CREATE RACE

and

## JOIN RACE

---

# PHASE 1.2 — PLAYER PROFILE

Every multiplayer player needs:

- nickname,
- avatar.

On first entry automatically assign:

- a generated nickname,
- a random default avatar.

Examples of generated nicknames:

- DustRider42
- ApexFox17
- HillRunner63
- TrackHawk28
- RedlineBear51

Avoid offensive or inappropriate generation.

Use a deterministic or safe vocabulary-based nickname generator.

---

# DEFAULT AVATARS

Create a small set of default avatars matching the established analog motorsport aesthetic.

Target:

8–12 default avatars.

They should feel like:

- vintage racing helmets,
- rally goggles,
- mechanic caps,
- scarves,
- racing silhouettes,
- motorsport characters.

No robot avatars.

No cyberpunk avatars.

No trademarked characters.

Default avatars may be bundled with the application if compliant.

---

# EDIT PROFILE

Players must be able to edit:

- nickname,
- avatar.

Nickname validation:

- trim whitespace,
- reasonable max length,
- prevent empty nicknames,
- basic abusive/input sanitization,
- do not accept HTML.

Suggested maximum:

16–20 characters.

Store the player's preferred multiplayer profile locally so it survives refresh/revisit.

Use:

`localStorage`

or the project's existing client preference mechanism.

---

# CLOUDINARY AVATAR UPLOAD

Support custom avatar upload through Cloudinary.

CRITICAL SECURITY RULE:

Never expose:

`CLOUDINARY_API_SECRET`

to browser/client code.

Never commit Cloudinary credentials.

Never print secrets into logs.

Never place API secret inside a public `VITE_*`, `NEXT_PUBLIC_*`, or equivalent client-side variable.

Expected server environment variables:

```env
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

The browser must NOT receive the API secret.

Use a safe signed-upload flow or an appropriately configured upload preset.

The backend should provide only the minimum required signed upload data.

Store/propagate the resulting secure Cloudinary URL.

Validate avatar uploads:

- images only,
- reasonable file-size limit,
- crop/transform to square,
- reasonable dimensions,
- do not allow arbitrary executable content.

If Cloudinary credentials are unavailable during development:

DO NOT block Phase 1.

Use default avatars and implement the upload integration behind a graceful configuration check.

---

# PHASE 1.3 — CREATE RACE

Host clicks:

CREATE RACE

Show configuration screen.

Required settings:

## Number of racers

Options:

- 2
- 3
- 4

This includes the host.

## Number of laps

Use reasonable options such as:

- 1
- 2
- 3
- 5

Do not allow absurd lap counts.

## Track

Allow selection from the existing tracks:

- Orchard Sprint
- Quarry Loop
- Summit Run

Do not create new tracks.

---

# CREATE ROOM

When submitted:

1. create room server-side,
2. assign host identity,
3. generate unique room code,
4. generate shareable invitation URL,
5. navigate host into room lobby.

Example:

```text
ROOM CODE
R7K4XP
```

Example link:

```text
https://game-domain/race/R7K4XP
```

Do not hard-code production domain.

Generate the URL from runtime location/configuration.

---

# PHASE 1.4 — SHARE UI

Lobby should offer:

COPY CODE

COPY INVITE LINK

INVITE RACERS

Where supported, use the browser Web Share API:

```ts
navigator.share(...)
```

Provide fallback copying behavior when unavailable.

Suggested share content:

```text
Join my Road Zero race 🏁
Room code: R7K4XP
[invite URL]
```

---

# PHASE 1.5 — JOIN RACE

JOIN RACE should provide:

- room-code input,
- JOIN button.

Normalize:

- whitespace,
- lowercase/uppercase.

If room does not exist:

show useful error.

If room is full:

show useful error.

If race already started:

do not allow a new racer to join as a participant.

Do not silently fail.

---

# DIRECT INVITE LINKS

Opening:

`/race/:code`

must automatically resolve the room.

If the player's profile has not been set, allow quick nickname/avatar confirmation before joining.

Then enter the correct lobby directly.

---

# PHASE 1.6 — WAITING ROOM

Until the selected number of players has joined, display an animated waiting experience.

Example:

# WAITING ON THE GRID

`2 / 4 RACERS JOINED`

Supporting copy:

`Engines warming up…`

Use subtle animation:

- idling cars,
- flag movement,
- pulsing dots,
- track ambience,
- participant cards appearing.

Do not make this look like a generic SaaS waiting room.

It should look part of the racing game.

---

# PLAYER CARDS

Every connected participant should have a card showing:

- avatar,
- nickname,
- host badge if relevant,
- connection state,
- readiness state,
- microphone state placeholder for future Phase 3.

Example:

```text
[Avatar]
DustRider42
HOST
NOT READY
```

Update live when participants join/leave.

---

# WAITING RULE

The ready check must NOT begin until:

```text
connected players === room.settings.maxPlayers
```

If host selected 4 racers:

2/4 = wait.

3/4 = wait.

4/4 = ready check becomes available.

Do not start early.

---

# PHASE 1.7 — READY CHECK

Once required player count is reached:

Change presentation to:

# THE GRID IS COMPLETE

Show all players.

Every player receives:

READY

button.

When pressed:

- server updates readiness,
- all clients immediately see the change.

Example:

```text
DustRider42       READY ✓
ApexFox17         READY ✓
HillRunner63      NOT READY
TrackHawk28       READY ✓
```

Players must be able to unready before loading begins.

---

# HOST START RULE

The host must NOT receive an enabled start/proceed button until:

```text
all expected players connected
AND
all players ready
```

Only host sees:

# PROCEED TO RACE

once conditions are satisfied.

Non-host players see:

`Waiting for host to start the race…`

---

# HOST DISCONNECT BEFORE RACE

Do not destroy the room immediately.

If host disconnects before racing begins:

promote the longest-connected active player to host.

Broadcast new host identity.

Show notification:

`ApexFox17 is now the host.`

Do not silently transfer host role.

---

# PLAYER DISCONNECT BEFORE START

If player count falls below expected count:

- return to waiting state,
- clear or appropriately reset ready states,
- disable host proceed button.

Do not begin without the configured number of racers.

---

# PHASE 1.8 — LOADING STATE

When host presses PROCEED TO RACE:

server transitions room:

```text
ready_check → loading
```

Every client begins loading the selected track/race assets.

Each client reports:

```text
PLAYER_LOADED
```

only after it is genuinely ready.

Display:

# PREPARING THE GRID

Examples:

```text
DustRider42       READY TO RACE
ApexFox17         LOADING…
HillRunner63      READY TO RACE
TrackHawk28       LOADING…
```

Do NOT begin countdown in Phase 1.

For Phase 1, stop at a successful synchronized loading/placeholder state.

Phase 2 will connect this to actual racing.

---

# PHASE 1 NETWORK EVENTS

Define typed events.

Examples:

Client → server:

```text
ROOM_CREATE
ROOM_JOIN
ROOM_LEAVE
PROFILE_UPDATE
PLAYER_READY
PLAYER_UNREADY
HOST_START_REQUEST
PLAYER_LOADED
```

Server → clients:

```text
ROOM_CREATED
ROOM_JOINED
ROOM_STATE_UPDATED
PLAYER_JOINED
PLAYER_LEFT
PROFILE_UPDATED
HOST_CHANGED
READY_STATE_UPDATED
ROOM_FULL
LOADING_STARTED
ERROR
```

Do not scatter anonymous magic strings throughout code.

Use shared typed contracts.

---

# PHASE 1 RECONNECTION

Handle temporary socket loss.

Assign a stable session/player token locally.

Allow reasonable reconnection to the same room.

Do not accidentally create duplicate players after refresh/reconnect.

If reconnection fails after grace period, remove player normally.

---

# PHASE 1 TESTS

Automate as much as reasonable.

Must test:

1. create 2-player room,
2. create 3-player room,
3. create 4-player room,
4. unique room code,
5. join via room code,
6. join via invite URL,
7. room full rejection,
8. invalid code rejection,
9. profile edit propagation,
10. readiness synchronization,
11. cannot proceed before room full,
12. cannot proceed before everybody ready,
13. non-host cannot proceed,
14. host can proceed when all ready,
15. player leaving returns room to waiting,
16. host migration,
17. reconnect without duplicate player,
18. loading state broadcast,
19. custom avatar failure does not break lobby,
20. single-player game remains functional.

Use multiple browser contexts where possible.

---

# PHASE 1 ACCEPTANCE GATE

DO NOT BEGIN PHASE 2 until all of these work:

- 2–4 browser clients can join the same room,
- invite URL works,
- room code works,
- nickname/avatar works,
- player list updates live,
- required player count is enforced,
- ready states synchronize,
- only host can proceed,
- host migration works,
- loading state synchronizes,
- single player still works,
- no secrets are exposed,
- tests pass,
- no console errors.

Create:

`receipts/multiplayer/PHASE_1_VALIDATION.md`

Document exact test results.

Commit Phase 1 separately.

---

# ============================================================
# PHASE 2
# REAL HUMAN MULTIPLAYER RACING
# ============================================================

# PHASE 2 GOAL

Replace the Phase-1 loading placeholder with a real networked race.

Players must control their own cars from different browser instances/devices.

All clients must see:

- same track,
- same racers,
- smoothly moving remote cars,
- shared countdown,
- synchronized race start,
- valid laps,
- valid checkpoints,
- accurate finishing order.

Do not add voice yet.

---

# PHASE 2.1 — HUMAN PLAYER SLOTS

For Race Together:

all race slots are human players.

Do not automatically include Charger/Technician/Defender unless explicitly designed later.

Current multiplayer target:

2–4 humans.

The existing AI championship remains unchanged outside Race Together.

---

# PLAYER VEHICLE ASSIGNMENT

Assign each human a distinguishable vehicle colour/appearance.

Use the established visual language.

Avoid duplicate visual identity within the same room.

Player identity above/near remote cars may show a restrained:

- nickname,
- avatar/indicator,

only if it does not clutter racing visibility.

---

# PHASE 2.2 — LOCAL AUTHORITY MODEL

For this private jam multiplayer mode:

Each client may simulate its own local car.

The server remains authoritative over:

- legal room state,
- checkpoint ordering,
- lap progression,
- race start,
- finish validation,
- final standings.

Do NOT attempt to build a full rollback/netcode esports architecture.

Do NOT let clients simply report:

`I finished.`

---

# NETWORK UPDATE FORMAT

Transmit compact snapshots.

Equivalent structure:

```ts
type PlayerRaceSnapshot = {
  playerId: string;

  sequence: number;
  timestamp: number;

  position: {
    x: number;
    y: number;
    z: number;
  };

  rotationY: number;

  speed: number;
  steering: number;

  lap: number;
  checkpoint: number;
};
```

Send only required information.

Do not stream entire game objects.

---

# UPDATE RATE

Start around:

15–20 updates per second.

Tune based on testing.

Do not send at render-frame rate.

Rendering can remain 60 FPS while networking runs at lower frequency.

---

# REMOTE PLAYER INTERPOLATION

Never directly snap remote car transforms to every received packet.

Maintain snapshot buffers.

Render remote cars slightly behind real time and interpolate between snapshots.

Handle:

- jitter,
- uneven packet timing,
- temporary packet loss.

Use short extrapolation only when necessary.

Clamp it.

When updates resume, reconcile smoothly.

Remote cars should not:

- teleport,
- vibrate,
- rotate wildly,
- jump between lanes.

---

# PHASE 2.3 — SYNCHRONIZED LOADING

After all players report LOADED:

server creates a future start timestamp.

Example:

```ts
startAt = serverNow + 4000;
```

Broadcast:

```text
RACE_START_SCHEDULED
```

containing synchronized start data.

Each client must use server clock synchronization/offset logic.

Do not rely on message-arrival time alone.

---

# COUNTDOWN

Every player should see effectively the same:

```text
3
2
1
GO
```

Cars remain input-locked until the synchronized race start.

Do not let fastest device begin earlier.

Do not let host's local countdown control everybody independently.

---

# CLOCK SYNCHRONIZATION

Implement lightweight client/server time-offset estimation.

Use ping/pong samples.

Estimate server clock offset.

Use server timestamp for:

- countdown,
- race start,
- finish timing.

Do not use clients' unrelated local wall clocks directly.

---

# PHASE 2.4 — CHECKPOINT AUTHORITY

Reuse the existing ordered checkpoint system.

Server must validate progression.

A valid lap requires:

all required checkpoints in correct order  
→ start/finish crossing.

Reject impossible jumps.

Do not trust client lap number alone.

---

# POSITION / RANKING

Race ranking should consider:

1. finished racers by finish time,
2. current lap,
3. current checkpoint,
4. progress between checkpoints where practical.

Avoid constant position flicker.

---

# FINISHING

When player completes required laps legitimately:

server records authoritative finish time.

Broadcast:

```text
PLAYER_FINISHED
```

with position.

Example:

```text
1. DustRider42
2. ApexFox17
3. TrackHawk28
4. HillRunner63
```

The race should not necessarily freeze immediately when first player finishes.

Allow remaining players to finish, within a reasonable timeout.

---

# POST-RACE TIMEOUT

After first finisher:

allow remaining racers a reasonable completion window.

If necessary, finalize remaining positions based on progress after timeout.

Do not let one disconnected player hold the result screen forever.

---

# PHASE 2.5 — COLLISIONS

Networked player collision is difficult.

Prefer stability over realism.

First implementation may use:

- soft local collision,
- reduced physical impulse,
- ghosting under severe desynchronization,
- collision avoidance.

Do not allow multiplayer collisions to turn into:

- pinball,
- teleportation,
- infinite spinning,
- griefing.

If physically synchronized collisions cannot be made reliable quickly, use a restrained/soft collision model rather than destabilizing the whole race.

Document the choice.

---

# DISCONNECT DURING RACE

If a player disconnects:

- mark them disconnected,
- do not crash race,
- allow short reconnection grace period.

If they reconnect quickly:

restore their racer where reasonably possible.

If they fail to reconnect:

mark DNF after grace period.

Remaining players continue.

Host disconnect during active race must NOT cancel race.

Once racing begins, host privileges should no longer determine race continuity.

---

# ANTI-CHEAT / VALIDATION

This is a private invite game, not competitive esports.

Still implement basic sanity validation:

- impossible teleport distance,
- impossible velocity,
- invalid checkpoint sequence,
- invalid lap completion,
- race input before start,
- impossible finish.

Do not spend disproportionate development time building sophisticated anti-cheat.

---

# MULTIPLAYER RESULTS

Reuse existing result presentation where possible.

Show:

- finishing position,
- avatar,
- nickname,
- finish time/gap,
- DNF when appropriate.

Options:

REMATCH  
RETURN TO LOBBY  
MAIN MENU

For rematch:

reuse same room and settings where practical.

Reset:

- ready,
- loaded,
- race progression,
- finish states.

---

# PHASE 2 NETWORK EVENTS

Examples:

Client → server:

```text
PLAYER_LOADED
CLOCK_PING
RACE_SNAPSHOT
CHECKPOINT_CROSSED
RECONNECT_RACE
```

Server → clients:

```text
CLOCK_PONG
RACE_START_SCHEDULED
RACE_SNAPSHOT_BATCH
CHECKPOINT_CONFIRMED
LAP_CONFIRMED
PLAYER_FINISHED
PLAYER_DNF
RACE_RESULTS
```

Use typed schemas.

Validate payloads.

---

# PHASE 2 BANDWIDTH

Monitor bandwidth.

Do not send:

- full scene state,
- environment state,
- static track geometry,
- unnecessary UI data.

Static game assets already exist on every client.

Transmit only changing multiplayer state.

---

# PHASE 2 MULTI-BROWSER TEST MATRIX

Test at least:

## 2 players

desktop + desktop.

## 3 players

multiple browser contexts.

## 4 players

full target room.

## Mixed device viewport

desktop + mobile-sized contexts.

Where possible, test actual separate devices/local network as well.

---

# PHASE 2 TESTS

Verify:

1. synchronized countdown,
2. no movement before GO,
3. all clients see every racer,
4. remote movement interpolates smoothly,
5. steering orientation syncs,
6. checkpoints validate,
7. skipped checkpoints rejected,
8. laps validate,
9. finish order consistent across clients,
10. disconnect does not crash room,
11. reconnect behaves safely,
12. host disconnect during race doesn't end race,
13. DNF timeout works,
14. rematch reset works,
15. bandwidth remains reasonable,
16. mobile controls work,
17. single-player championship still works,
18. quick race still works.

---

# PHASE 2 ACCEPTANCE GATE

Do NOT BEGIN PHASE 3 until:

- 2–4 players can race simultaneously,
- all clients see the same opponents,
- remote cars move smoothly,
- countdown is synchronized,
- start cannot be cheated trivially,
- checkpoint/lap validation works,
- finish order is server-controlled,
- reconnect/disconnect is handled,
- results work,
- no major race desynchronization exists,
- single-player remains unaffected,
- tests pass.

Create:

`receipts/multiplayer/PHASE_2_VALIDATION.md`

Commit Phase 2 separately.

---

# ============================================================
# PHASE 3
# LIVE VOICE CHAT
# ============================================================

# PHASE 3 GOAL

Allow players in the same Race Together room to hear one another regardless of physical location.

Voice chat must be OPTIONAL.

A player who denies microphone access must still be able to:

- join,
- ready,
- race,
- finish.

Voice failure must NEVER block gameplay.

---

# PHASE 3 TECHNOLOGY

Use:

# WebRTC

for live audio.

Do NOT route continuous audio through the ordinary game WebSocket.

The existing real-time server should handle:

# WebRTC signaling

including:

- offers,
- answers,
- ICE candidates.

---

# VOICE TOPOLOGY

Because rooms are limited to a maximum of four players, use a peer-to-peer mesh initially unless the existing infrastructure strongly favours another solution.

Maximum peer relationships remain manageable at four users.

Document architecture.

---

# WEBRTC SIGNALING EVENTS

Examples:

```text
VOICE_JOIN
VOICE_LEAVE
WEBRTC_OFFER
WEBRTC_ANSWER
WEBRTC_ICE_CANDIDATE
VOICE_STATE
```

Do not mix signaling logic unpredictably with race-state messages.

Use a dedicated voice module.

---

# STUN / TURN

Do NOT assume STUN alone guarantees connectivity.

Players may be:

- on different mobile carriers,
- behind NAT,
- behind restrictive routers,
- in different countries.

Support TURN configuration.

Credentials must remain appropriately protected/configured.

Do not hard-code secret TURN credentials in public frontend source if using static secrets.

Prefer time-limited TURN credentials if supported by the selected provider.

Create configuration documentation:

`docs/multiplayer/VOICE_INFRASTRUCTURE.md`

Clearly explain:

- STUN,
- TURN,
- required environment variables,
- local-dev behaviour,
- production behaviour.

---

# MICROPHONE PERMISSION

Never request microphone permission on initial page load.

Request it only after an explicit user action.

Example:

# ENABLE VOICE CHAT

Browser permission appears after that click.

If denied:

show:

`Microphone unavailable — you can still race.`

Do not repeatedly spam permission requests.

---

# VOICE CONTROLS

Each player should have:

## MUTE

Stops sending microphone audio.

## DEAFEN

Stops local playback of other racers.

Optional:

## PUSH TO TALK

Only if implementation remains simple and reliable.

Do not delay completion for push-to-talk.

---

# PLAYER VOICE STATE

Player cards should display:

- microphone enabled,
- muted,
- speaking,
- unavailable.

Examples:

🎙  
🔇  
speaking indicator.

Do not show microphone active when no audio is actually connected.

---

# SPEAKING INDICATOR

Use Web Audio API analysis or equivalent to estimate local/remote voice activity.

Animate:

- small avatar ring,
- subtle waveform,
- restrained glow compatible with current art style.

Do not use cyberpunk neon.

---

# VOICE DURING RACING

Voice remains connected through:

- lobby,
- loading,
- countdown,
- race,
- results.

Do NOT rebuild peer connections every time screen/UI state changes.

Voice lifecycle should correspond to room membership.

---

# AUDIO MIXING

Existing game audio includes:

- engine,
- tyres,
- ambience,
- effects.

Voice must remain understandable.

Implement sensible ducking:

When voice activity occurs, slightly lower non-critical game audio.

Do NOT completely mute the engine.

Allow user-level voice volume if simple.

Example:

VOICE VOLUME slider.

---

# ECHO / NOISE PROCESSING

Request browser audio constraints such as:

```ts
{
  echoCancellation: true,
  noiseSuppression: true,
  autoGainControl: true
}
```

where supported.

Gracefully tolerate unsupported constraints.

---

# MOBILE VOICE

Test:

- iOS/Safari where practical,
- Android/Chrome where practical,
- browser autoplay restrictions,
- suspended AudioContext,
- microphone permission states.

Voice must unlock through a user gesture.

Do not assume desktop browser behaviour applies to phones.

---

# VOICE PEER FAILURE

If voice connection to one player fails:

race continues.

Show:

`Voice unavailable for ApexFox17`

Do not disconnect that racer from the room.

---

# LATE VOICE ENABLE

A player should be able to join room with voice disabled and enable it later.

Do not require page reload.

---

# PLAYER LEAVES

When a racer leaves:

- close their peer connections,
- stop their remote audio,
- release relevant media resources.

Avoid memory leaks.

---

# PRIVACY

Do not record voice.

Do not persist audio.

Do not upload microphone data to Cloudinary or other unrelated services.

Do not create recordings unless explicitly requested in a future task.

Make the UI clear that voice is live.

---

# PHASE 3 TESTS

Test:

1. 2-player voice,
2. 3-player voice,
3. 4-player voice,
4. mute,
5. unmute,
6. deafen,
7. undeafen,
8. microphone denied,
9. microphone unavailable,
10. one peer voice failure,
11. player leaves,
12. player reconnects,
13. voice survives lobby → race transition,
14. voice survives race → results transition,
15. speaking indicator,
16. mobile-sized viewport,
17. game audio + voice mixing,
18. race works perfectly with voice disabled.

---

# PHASE 3 ACCEPTANCE GATE

Phase 3 is complete only when:

- voice works between remote players,
- voice is optional,
- microphone denial never blocks racing,
- mute works,
- deafen works,
- speaking state is visible,
- player disconnect cleans up audio,
- TURN configuration is documented,
- game audio remains usable,
- no secrets are exposed,
- multiplayer racing remains stable,
- single-player remains stable.

Create:

`receipts/multiplayer/PHASE_3_VALIDATION.md`

Commit Phase 3 separately.

---

# ============================================================
# UX DETAILS
# ============================================================

The multiplayer experience should feel like part of Road Zero rather than an external dashboard.

Suggested sequence:

```text
MAIN MENU

        ↓

RACE TOGETHER

        ↓

CREATE RACE
or
JOIN RACE

        ↓

ROOM

R7K4XP

Waiting on the grid...
2 / 4 racers

        ↓

Grid complete

Player A    READY
Player B    READY
Player C    READY
Player D    READY

        ↓

HOST:
PROCEED TO RACE

        ↓

Preparing the grid...

Player A    LOADED
Player B    LOADED
Player C    LOADED
Player D    LOADED

        ↓

3
2
1
GO

        ↓

LIVE MULTIPLAYER RACE

        ↓

RESULTS
```

---

# ERROR UX

Never show raw server errors to users.

Handle meaningful states:

- room not found,
- room full,
- room expired,
- race already started,
- disconnected,
- reconnecting,
- host changed,
- microphone denied,
- voice unavailable.

Messages should fit the game's tone.

---

# SECURITY REQUIREMENTS

Validate all network payloads.

Never trust:

- nicknames,
- avatar URLs,
- room codes,
- claimed lap values,
- claimed checkpoints,
- client finish results.

Sanitize strings.

Enforce server-side room capacity.

Rate-limit room creation if necessary.

Rate-limit or throttle race updates appropriately.

Do not expose environment secrets.

---

# CLOUDINARY SECURITY — NON-NEGOTIABLE

When Cloudinary credentials are later provided:

DO NOT put the API secret in client code.

DO NOT commit `.env`.

DO NOT echo secrets in terminal output.

DO NOT place secret values in generated documentation.

Use environment variables.

If `.env.example` is needed, include only names:

```env
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

not real values.

---

# DEVELOPMENT PRACTICE

For every phase:

1. inspect existing implementation,
2. design minimal architecture,
3. implement incrementally,
4. test with multiple clients,
5. run existing single-player regression suite,
6. document results,
7. commit meaningful checkpoint.

Do not wait until Phase 3 to discover that Phase 1 broke.

---

# LOGGING

Use structured development logs for useful events:

- room created,
- player joined,
- player disconnected,
- host migrated,
- race scheduled,
- player finished,
- WebRTC peer connected/disconnected.

Do not log:

- secrets,
- API credentials,
- raw microphone audio,
- sensitive tokens.

Production logging should not be noisy.

---

# OBSERVABILITY

In development, provide a simple multiplayer debug overlay or debug mode capable of displaying:

- room code,
- player ID,
- room state,
- socket state,
- ping,
- server-clock offset,
- snapshot rate,
- remote interpolation delay,
- current lap/checkpoint.

This must be removable/disabled for normal players.

Do not clutter production UI.

---

# PERFORMANCE

Multiplayer must not destroy the game's existing performance.

Monitor:

- draw calls,
- triangles,
- CPU usage,
- network update rate,
- bandwidth,
- FPS.

Remote car interpolation should be lightweight.

Voice processing should not cause major rendering degradation.

---

# TEST SINGLE-PLAYER AFTER EVERY PHASE

After Phase 1:

test Championship and Quick Race.

After Phase 2:

test Championship and Quick Race again.

After Phase 3:

test Championship and Quick Race again.

Race Together must never become an excuse to regress the original game.

---

# DO NOT WORK ON DEPLOYMENT YET

Unless explicitly instructed separately:

Do not:

- configure production deployment,
- modify DNS,
- configure Kite Passport,
- ask for OTP,
- request passkeys,
- request funding,
- publish production secrets.

Local/network testing is enough for this implementation task.

---

# FINAL DOCUMENTATION

When all three phases are complete create:

`docs/multiplayer/RACE_TOGETHER.md`

Explain:

- architecture,
- lobby lifecycle,
- room codes,
- invite links,
- player profiles,
- Cloudinary avatar flow,
- room state machine,
- race networking,
- interpolation,
- checkpoint authority,
- reconnection,
- results,
- WebRTC signaling,
- STUN/TURN,
- environment variables,
- local development,
- known limitations.

---

# FINAL REPORT

At the very end provide a structured report.

## Phase 1

Report:

- lobby implementation,
- room codes,
- invite links,
- profile/avatar system,
- Cloudinary integration state,
- ready system,
- host logic,
- loading synchronization,
- tests.

## Phase 2

Report:

- networking architecture,
- update frequency,
- interpolation,
- server validation,
- synchronized countdown,
- checkpoints/laps,
- results,
- disconnect/reconnect,
- tests.

## Phase 3

Report:

- WebRTC architecture,
- signaling,
- STUN/TURN state,
- mute/deafen,
- speaking indicators,
- mobile behaviour,
- failure handling,
- tests.

## Regression

Report whether:

- Championship passes,
- Quick Race passes,
- Race Together passes.

## Security

Confirm:

- no Cloudinary API secret in client,
- no committed credentials,
- network payloads validated,
- voice not recorded.

## Known limitations

Be explicit.

Do not hide unfinished items.

---

# IMPLEMENTATION ORDER — NON-NEGOTIABLE

Execute exactly in this sequence:

# PHASE 1

Lobby  
→ Room creation  
→ Room code  
→ Invite link  
→ Join flow  
→ Profiles  
→ Default avatars  
→ Cloudinary-safe avatar architecture  
→ Waiting screen  
→ Player list  
→ Ready synchronization  
→ Host permissions  
→ Host migration  
→ Loading synchronization  
→ Phase 1 tests  
→ Phase 1 receipt

STOP AND VERIFY.

Then:

# PHASE 2

Human car slots  
→ Network snapshots  
→ Remote interpolation  
→ Clock synchronization  
→ All-loaded synchronization  
→ Shared countdown  
→ Race start  
→ Checkpoint authority  
→ Lap authority  
→ Finish authority  
→ Results  
→ Disconnect/reconnect  
→ Rematch  
→ Phase 2 tests  
→ Phase 2 receipt

STOP AND VERIFY.

Then:

# PHASE 3

Microphone opt-in  
→ WebRTC signaling  
→ Peer connections  
→ STUN  
→ TURN configuration  
→ Mute  
→ Deafen  
→ Speaking detection  
→ Game-audio mixing  
→ Disconnect cleanup  
→ Mobile voice testing  
→ Phase 3 tests  
→ Phase 3 receipt

Do not combine these phases.

---

# FINAL DIRECTIVE

The existing game is already finished as a strong single-player racing game.

Do not destroy it trying to make multiplayer impressive.

Build multiplayer as a reliable extension.

The core experience should feel this simple:

> Create a room.  
> Choose racers, laps and track.  
> Send the code or link.  
> Watch friends join.  
> Everyone gets ready.  
> Host starts.  
> Everyone loads.  
> 3…2…1…GO.  
> Race real people.  
> Talk while racing if voice is enabled.

Reliability beats complexity.

Phase 1 must work before cars are networked.

Phase 2 must work before microphones are introduced.

Voice must never be required for gameplay.

Cloudinary secrets must never reach the browser.

Preserve the original championship.

Begin by auditing the repository and writing `docs/multiplayer/MULTIPLAYER_BASELINE.md`, then implement Phase 1 only.