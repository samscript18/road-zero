# Race Together · Phase 2 validation

## Checkpoint and scope

Known-good Phase 1 fallback: `5d9bd5966dd4c0fd76bba25ea395ed8750244900`. Its receipt was read and its lobby, Championship, and Quick Race gates were rerun before Phase 2 edits. Existing local `.env`/loader and audio edits were preserved. This phase adds no voice chat, deployment, Cloudinary credential work, AI opponents, or new 3D assets.

## What is implemented

- Two to four humans keep stable player IDs, room slots, nicknames, avatars, and four distinct existing car appearances. Each browser loads the selected track/lap count and all room cars before reporting loaded. The server waits for every required player.
- Browser-local `stepCar` remains responsive. Reverse acceleration now exceeds off-road drag; the verge no longer repeatedly kills negative speed. Player and nearby rival/human cars receive bounded, car-sized separation and speed damping rather than passing through one another or receiving unstable network impulses. Player top speed changed from 43 to 32 m/s; AI pace was reduced proportionately.
- Ping/pong estimates server-clock offset. The server schedules GO 4.5 seconds ahead; pre-GO movement is ignored by client and server. Compact snapshots send at 20 Hz and the server broadcasts validated batches at 10 Hz. Remote pose buffers render about 120 ms behind, interpolate yaw/position/steering, and limit extrapolation to short packet gaps. The interpolation unit suite covers jitter and dropped packets.
- The server uses the same deterministic track definition as the browser. It derives progress from plausible route motion and enforces ordered gates at approximately 22%, 47%, 72%, then the wrapped finish; client-declared lap/checkpoint values are ignored. It owns ranking, finish time, DNF, and common results. Implausible speed, teleports, off-route progress, and pre-GO movement are rejected.
- First finish opens a 90-second completion window. Disconnect has 25 seconds of reconnection grace; a returned browser reclaims its slot/state. Expiry or completion timeout yields DNF. An active race survives host departure. Rematch reuses the room; return-to-lobby resets race state.

## Test evidence

| Check | Result |
| --- | --- |
| TypeScript, production build | PASS; Vite warns that its single minified JS chunk is over 560 kB, but builds. |
| Vitest | 14/14 PASS, including off-road reverse, reduced tune, overlap separation, and remote interpolation. |
| Server/room tests | 17/17 PASS in the working tree, including 2/3/4 drivers, ordered checkpoints, false lap claims, early movement, teleport/speed rejection, disconnect/reconnect, DNF timeout, rematch, and lobby return. One of the 17 is the separately preserved, uncommitted env-loader test; the Phase 2 commit itself contains the other 16. |
| Phase 1 real-browser lobby gate | 23/23 PASS; four clients, ready synchronization, host migration, reconnect, default avatars, no console errors. The pre-edit 22/23 was an outdated optional-Cloudinary assumption, not a lobby failure; its assertion was corrected without testing upload. |
| Phase 2 real-browser race gate | 2-, 3-, and 4-browser cases PASS; common start timestamp (0 ms spread), throttle locked before GO, each local car moved 25–35 m, each browser observed all remote cars moving, result rows matched. One 2-player client used actual browser touch input. Three-player host disconnect/reconnect, two-player rematch, and four-player lobby return PASS. No console errors or asset 404s. See `phase-2-browser-gate.json` and race/results screenshots. |
| Championship / Quick Race project gate | 14/14 PASS; desktop keyboard, mobile touch, AI motion, reset, handling, console/404 checks. |
| Official 404 ship check | PASS: all production modules parse and paths stay inside `dist`. It flags a 108-number array in minified output for manual geometry review, not a failure; source adds no literal mesh arrays or downloaded models. |
| Official 404 generic playtest | Ran against `dist` with system Chrome. Drove 188.8 m at ~60 FPS, peak 355 draws / 43,942 triangles, but **failed its six-leg route** because one generic 50 m forward/turn leg did not cover its distance in 25 s. It also started through `__START__`, so it does not validate the real menu control. The custom racing gate above is the relevant real-input route test. |

The browser gate checks real controls and remote motion for the opening race. To cover the complete finish/results path within a repeatable test, it then advances the **server test clock** and feeds ordered route samples through the same socket handler. This verifies authoritative checkpoint/finish/result behaviour but is not a claim that humans drove every full lap in the automated run. A physical phone/tablet was not available; mobile evidence is a touch-enabled browser viewport.

## Performance and network

Production HTML/CSS/JS is approximately **632 KiB on disk** (Vite minified JS 622.22 kB, gzip 167.08 kB; CSS 18.83 kB, gzip 4.98 kB). In the Phase 2 race gate the largest observed renderer cost was **321 draw calls / 40,788 triangles**. Two-browser FPS was **52–58** at capture, three-browser **34–36**, four-browser **21–28**. These are simultaneous headless Chromium renderers on one host with software-rendering fallback enabled; they are not physical-device FPS measurements. The single-browser Championship/Quick Race gate reported ~60 FPS after startup; the official single-browser playtest reported minimum ~60 FPS. In the race gate a browser sent roughly **5.7–7.0 kB** of socket payload and received **15.7–37.5 kB** over the sampled opening; payload grows with room size. Snapshot and batch cadence is bounded rather than render-frame based.

## Known limitations

- Human-human contact is soft local separation, not shared rigid-body physics. The server does not let local collision impulses decide results. Brief visible mismatch is possible under poor connections.
- Clock synchronization is lightweight ping/pong, suitable for private rooms, not precision competition timing. Network jitter was unit-tested; no external network emulator or physical multi-device test was run.
- Full-lap browser results were driven by the test harness as described above. The 404 generic playtest route remains an acknowledged mismatch, not a claimed pass.
- No deployed-URL, live jam, Phase 3 voice, microphone, or custom-avatar successful-upload test was run by design.
