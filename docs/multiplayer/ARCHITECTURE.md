# Race Together · Phase 1 architecture

Phase 1 adds a private lobby beside the existing Championship and Quick Race. It stops at a synchronized `loading` placeholder. No human race cars, network snapshots, countdown, results authority, or voice are part of this phase.

## Transport and hosting

The browser uses the standard WebSocket API; the Node server uses the small `ws` package. One socket carries typed lobby events and room snapshots. Local development runs Vite and the room server together, with Vite proxying `/multiplayer` and `/api/avatar` to the server. A Node static-plus-socket command serves a built `dist/` for local network tests. No production domain is embedded: invite URLs use the browser's current origin and `/race/:code`.

The room server is authoritative for room creation, code allocation, capacity, host, player identity, connected/ready/loaded flags, and transitions. Clients can request actions but cannot submit a room snapshot or status directly. Shared constants and payload validators live in `shared/multiplayer-protocol.js`, with TypeScript declarations beside them for the browser.

## Room lifecycle

`waiting` becomes `ready_check` only when the exact configured number of players is connected. Disconnecting drops the room back to `waiting` and clears readiness. Only the host may change `ready_check` to `loading`, and only when everyone is connected and ready. Each client reports `PLAYER_LOADED` after its local selected track and car resources are prepared. Phase 1 remains at `loading`, displaying individual loaded states; it does not enter `countdown`.

Server-generated six-character codes use an unambiguous alphabet and are checked against active rooms. A server-generated private resume token is stored per room in each browser's local storage and is never included in public room snapshots. Rejoining with that token replaces the old socket without creating another player. Disconnected players hold their slot for a short grace period; the earliest connected player inherits host if the old host leaves. Empty, idle, and completed rooms expire from memory.

## Profiles and avatars

Safe generated nicknames and one of eight original analog motorsport SVG portraits provide a complete no-credential experience. Profile preferences remain in local storage. The server trims and validates nicknames and accepts only known default avatar IDs or Cloudinary secure image URLs for the configured cloud. Cloudinary upload is optional: the Node server signs a narrowly scoped image upload after validating a room resume token. The browser never receives `CLOUDINARY_API_SECRET`. The upload control reports unavailability when credentials are absent and leaves the lobby usable.

## Single-player isolation

The multiplayer UI owns separate screens and socket state. It only hides or shows the existing menu and uses the existing 3D scene as its background. It does not modify `resetRace()`, `update()`, AI logic, checkpoints, points, or the championship state. The existing custom browser gate remains the single-player regression check.
