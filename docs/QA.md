# QA matrix

Status key: `—` not run, `P` pass, `F` fail, `B` externally blocked. Every failure links to an iteration-log entry or issue before it can be closed.

| surface | scenario | desktop keyboard | mobile touch | evidence/status |
|---|---|---:|---:|---|
| load | fresh production load, real start | P | P | `system-pass`: click and touch tap |
| RUN | steering and drift | P | P | real key chord; real touch drag; gate observes `drift=1` during a real touch press |
| RUN | construction and first split | P | P | construction count > 0; split captured in moving evidence |
| RUN | SAFE completion | — | — | |
| RUN | REDLINE success/failure | — | — | |
| RUN | fall/crash/results/restart | P | — | fall/results manually implemented; gate proves completion result and no-refresh restart |
| RUN | all world transitions | P | — | gate captures all four distance bands |
| RUN | ten-minute recycling/memory | — | — | |
| Championship | start/countdown/AI progress | P | — | gate waits through countdown; all AI progress > 0 |
| Championship | each of four races completes | — | — | |
| Championship | win and non-win final flows | — | — | |
| systems | pause/resume and repeated restart | P | — | Escape path present; gate verifies two independent resets |
| systems | audio mute/unmute/autoplay handling | P | — | AudioContext begins after start interaction; menu mute control |
| layout | resize/orientation/safe areas | — | — | |
| accessibility | non-colour routes, contrast, target sizes | P | P | icon + width + label cues; 52+ px targets |
| production | no console errors, 404s, path escapes | P | P | custom gate clean; `ship.mjs` clean after relative-path fix |

## Target environments

- Current Chrome-like desktop browser, 1440×900 and 1280×720.
- Phone landscape 844×390 (primary play orientation).
- Phone portrait 390×844 (supported menu/instruction and orientation guidance; gameplay remains operable).

## Known limitations

- Championship full four-race completion/win/non-win paths are implemented but the automated gate currently proves one race plus NEXT RACE, not all four.
- Real physical-phone FPS remains unmeasured; SwiftShader FPS is not used as a verdict.
- Phone crash/results and portrait play require additional manual coverage.
- Environments currently reuse the locked pylon family heavily; Canyon lacks a dedicated geological asset and Skyline bright-scene road contrast needs another critic pass.
