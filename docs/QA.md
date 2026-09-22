# QA matrix

Status key: `—` not run, `P` pass, `F` fail, `B` externally blocked. Every failure links to an iteration-log entry or issue before it can be closed.

| surface | scenario | desktop keyboard | mobile touch | evidence/status |
|---|---|---:|---:|---|
| load | fresh production load, real start | — | — | |
| RUN | steering and drift | — | — | |
| RUN | construction and first split | — | — | |
| RUN | SAFE completion | — | — | |
| RUN | REDLINE success/failure | — | — | |
| RUN | fall/crash/results/restart | — | — | |
| RUN | all world transitions | — | — | |
| RUN | ten-minute recycling/memory | — | — | |
| Championship | start/countdown/AI progress | — | — | |
| Championship | each of four races completes | — | — | |
| Championship | win and non-win final flows | — | — | |
| systems | pause/resume and repeated restart | — | — | |
| systems | audio mute/unmute/autoplay handling | — | — | |
| layout | resize/orientation/safe areas | — | — | |
| accessibility | non-colour routes, contrast, target sizes | — | — | |
| production | no console errors, 404s, path escapes | — | — | |

## Target environments

- Current Chrome-like desktop browser, 1440×900 and 1280×720.
- Phone landscape 844×390 (primary play orientation).
- Phone portrait 390×844 (supported menu/instruction and orientation guidance; gameplay remains operable).

## Known limitations

- None recorded yet; the game has not been scaffolded.
