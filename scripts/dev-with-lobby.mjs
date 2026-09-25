import { spawn } from 'node:child_process';
import { resolve } from 'node:path';

const children = [
  spawn(process.execPath, [resolve('server/index.mjs')], { stdio: 'inherit', env: process.env }),
  spawn(process.execPath, [resolve('node_modules/vite/bin/vite.js'), '--host', '0.0.0.0', ...process.argv.slice(2)], { stdio: 'inherit', env: process.env }),
];

let stopping = false;
function stop(exitCode = 0) {
  if (stopping) return;
  stopping = true;
  for (const child of children) if (child.exitCode === null) child.kill('SIGTERM');
  process.exitCode = exitCode;
}

for (const child of children) {
  child.on('error', error => { console.error(error.message); stop(1); });
  child.on('exit', code => { if (!stopping) stop(code || 1); });
}
process.on('SIGINT', () => stop());
process.on('SIGTERM', () => stop());
