# Race Together · Phase 2 design

Rollback checkpoint: `5d9bd5966dd4c0fd76bba25ea395ed8750244900`. The Phase 1 lobby gate was rerun before edits: 22 of 23 assertions passed; its only failure was the test's outdated assumption that optional Cloudinary configuration is absent. All lobby racing-flow assertions passed. Existing Championship/Quick Race browser gate passed 14/14; race unit tests passed 8/8 and room tests 8/8. The pre-existing uncommitted `.env`-loader and README edits are preserved, not part of this design.

## Authority and transport

The local browser runs the existing `stepCar` arcade controller immediately; no server round trip delays steering. It sends compact position/heading/speed/steer snapshots at 20 Hz on the existing WebSocket. The server owns the room state, start time, ordered checkpoints, laps, ranking, finish times, DNF, and final results. It ignores client-supplied lap/checkpoint claims. The same three deterministic track curves are used on browser and server. The server batches the latest validated states at 10 Hz. Payloads are validated and movement is sanity-checked against elapsed server time and track position.

## Race lifecycle

Phase 1 assigns stable player IDs and room-order slots. Loading creates one existing compliant car per slot, no AI. `PLAYER_LOADED` follows track/car creation and renderer compilation. When all required connected racers report loaded, the server schedules a start 4.5 seconds ahead. Clients estimate clock offset from multiple ping/pong samples and render 3–2–1–GO from the server timestamp. Server and clients reject movement/progress before GO.

## Remote motion

Each remote car keeps a short timestamped snapshot buffer. Rendering targets server time minus about 120 ms; it interpolates position, yaw, steering, and wheel rotation between samples. Gaps permit at most a brief clamped extrapolation before holding the last pose. Big corrections are smoothed instead of teleporting on ordinary packet jitter. Local driving is never interpolated.

## Progress and recovery

The server derives normalized route position from the current 3D track samples and accepts only plausible motion. Checkpoints use the existing single-player gates at roughly 0.22, 0.47, 0.72, and the wrapped start/finish after 0.8; all must occur in order and close to the route. A missed packet can still cross a threshold, but a skipped gate or a client-declared lap cannot advance progress. Reverse and reset are allowed without granting checkpoint progress. Reconnecting within the existing 25-second grace restores identity and the server's last validated pose; after grace the racer is DNF. A host disconnect during racing has no special race effect. The first finisher starts a 90-second completion window; remaining racers become DNF at expiry. Rematch reuses the room and resets loaded/ready/progress.

## Collision compromise

Nearby vehicles use bounded local separation and speed damping, not network-authoritative rigid-body impacts. This prevents visible overlap without pinball impulses or a second distributed physics simulation. Server standings never depend on local collision impulse. If remote updates become stale, the collision response fades rather than pushing the local car into a stale ghost.

## Scope boundary

No Phase 3 microphone/WebRTC work, deployment, credential changes, or new significant 3D assets. Default portraits remain sufficient. The existing Championship and Quick Race paths stay separate.
