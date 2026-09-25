#!/usr/bin/env node
import { mkdirSync, writeFileSync } from 'node:fs';
import puppeteer from 'puppeteer';
import { createRoomServer } from '../server/index.mjs';

const { server, manager } = createRoomServer({ serveDist: true });
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const origin = `http://127.0.0.1:${server.address().port}`;
const browser = await puppeteer.launch({ headless: true, executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', args: ['--no-sandbox', '--enable-unsafe-swiftshader'] });
const errors = [];
const contexts = [];
const report = { runs: [], errors };
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
async function newPage(mobile = false, path = '/') {
  const context = await browser.createBrowserContext(); contexts.push(context);
  const tab = await context.newPage();
  await tab.setViewport(mobile ? { width: 844, height: 390, isMobile: true, hasTouch: true, deviceScaleFactor: 1 } : { width: 1280, height: 720 });
  tab.on('pageerror', error => errors.push(error.message));
  tab.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  tab.on('response', response => { if (response.status() === 404) errors.push(`404 ${response.url()}`); });
  await tab.goto(origin + path, { waitUntil: 'networkidle0' });
  await tab.waitForFunction(() => window.__READY__ === true);
  return tab;
}
const telemetry = tab => tab.evaluate(() => window.__GAME__.multiplayer);
const distance = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
async function run(count) {
  const tabs = [await newPage()];
  const host = tabs[0];
  await host.click('#raceTogether'); await host.click('.lobby-actions .primary');
  await host.select('#lobbyCount', String(count)); await host.select('#lobbyLaps', '1');
  await host.click('#multiplayerLobby .primary:last-of-type');
  await host.waitForSelector('.lobby-room-code');
  const code = await host.$eval('.lobby-room-code', element => element.textContent.trim());
  for (let i = 1; i < count; i++) {
    const mobile = count === 2 && i === 1;
    const guest = await newPage(mobile, `/race/${code}`);
    tabs.push(guest);
    if (mobile) await guest.tap('#multiplayerLobby .primary:last-of-type');
    else await guest.click('#multiplayerLobby .primary:last-of-type');
  }
  await host.waitForFunction(expected => document.querySelector('.lobby-counter')?.textContent?.includes(`${expected} / ${expected}`), {}, count);
  await Promise.all(tabs.map(tab => tab.waitForSelector('.lobby-ready')));
  for (const [i, tab] of tabs.entries()) {
    if (count === 2 && i === 1) await tab.tap('.lobby-ready');
    else await tab.click('.lobby-ready');
    await pause(200);
  }
  await host.waitForSelector('.lobby-proceed');
  await host.click('.lobby-proceed');
  await Promise.all(tabs.map(tab => tab.waitForFunction(() => window.__GAME__?.multiplayer?.active && window.__GAME__?.multiplayer?.state === 'countdown', { timeout: 30000 })));
  const countdowns = await Promise.all(tabs.map(tab => telemetry(tab)));
  const startSpread = Math.max(...countdowns.map(item => item.startAt)) - Math.min(...countdowns.map(item => item.startAt));
  const beforeGo = countdowns[0].position;
  await host.keyboard.down('KeyW');
  await pause(450);
  const locked = distance(beforeGo, (await telemetry(host)).position) < .15;
  await Promise.all(tabs.map(tab => tab.waitForFunction(() => window.__GAME__?.multiplayer?.state === 'racing', { timeout: 12000 })));
  for (let i = 1; i < tabs.length; i++) if (!(count === 2 && i === 1)) await tabs[i].keyboard.down('KeyW');
  let touchSession = null;
  if (count === 2) {
    const guest = tabs[1];
    const button = await guest.$('#throttle'); const box = await button.boundingBox();
    touchSession = await guest.createCDPSession();
    await touchSession.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: box.x + box.width / 2, y: box.y + box.height / 2, id: 1 }] });
  }
  const before = await Promise.all(tabs.map(tab => telemetry(tab)));
  await pause(2200);
  const after = await Promise.all(tabs.map(tab => telemetry(tab)));
  await host.keyboard.up('KeyW');
  for (let i = 1; i < tabs.length; i++) if (!(count === 2 && i === 1)) await tabs[i].keyboard.up('KeyW');
  if (touchSession) await touchSession.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  const moved = after.map((item, i) => distance(item.position, before[i].position));
  const remoteMoved = after.map((item, i) => item.remotePositions.some(remote => {
    const prior = before[i].remotePositions.find(pose => pose.playerId === remote.playerId);
    return prior && Math.hypot(remote.x - prior.x, remote.z - prior.z) > 1;
  }));
  if (count === 2) {
    mkdirSync('receipts/multiplayer', { recursive: true });
    await host.screenshot({ path: 'receipts/multiplayer/phase-2-desktop-race.png' });
    await tabs[1].screenshot({ path: 'receipts/multiplayer/phase-2-mobile-race.png' });
  }
  const result = { count, code, startSpreadMs: startSpread, lockedBeforeGo: locked,
    localMovedMetres: moved, remoteVisibleAndMoved: remoteMoved,
    remoteCounts: after.map(item => item.remoteCars),
    fps: await Promise.all(tabs.map(tab => tab.evaluate(() => window.__GAME__.fps))),
    draws: await Promise.all(tabs.map(tab => tab.evaluate(() => window.__GAME__.draws))),
    tris: await Promise.all(tabs.map(tab => tab.evaluate(() => window.__GAME__.tris))),
    sentBytes: after.map(item => item.sentBytes), receivedBytes: after.map(item => item.receivedBytes),
    passed: startSpread === 0 && locked && moved.every(value => value > 1) && remoteMoved.every(Boolean) && after.every(item => item.remoteCars === count - 1),
  };
  if (count === 3) {
    const hostId = after[0].playerId;
    const context = host.browserContext();
    await host.close();
    await tabs[1].waitForFunction(() => window.__GAME__?.multiplayer?.state === 'racing');
    const beforeContinue = (await telemetry(tabs[1])).position;
    await tabs[1].keyboard.down('KeyW'); await pause(1100); await tabs[1].keyboard.up('KeyW');
    result.hostDisconnectKeepsRace = manager.rooms.get(code)?.status === 'racing' && distance(beforeContinue, (await telemetry(tabs[1])).position) > .5;
    const resumed = await context.newPage(); tabs.push(resumed);
    await resumed.setViewport({ width: 1280, height: 720 });
    resumed.on('pageerror', error => errors.push(error.message));
    resumed.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    await resumed.goto(`${origin}/race/${code}`, { waitUntil: 'networkidle0' });
    await resumed.click('#multiplayerLobby .primary:last-of-type');
    await resumed.waitForFunction(() => window.__GAME__?.multiplayer?.active && window.__GAME__?.multiplayer?.state === 'racing', { timeout: 30000 });
    result.hostReconnectSameIdentity = (await telemetry(resumed)).playerId === hostId && manager.rooms.get(code)?.players.length === 3;
    result.passed &&= result.hostDisconnectKeepsRace && result.hostReconnectSameIdentity;
  }
  // Real keyboard/touch movement was checked above. Complete all racers by
  // passing ordered route samples through the same socket event handler with
  // an accelerated server test clock, then compare actual browser result UI.
  const room = manager.rooms.get(code);
  let simulatedMs = 0;
  manager.now = () => Date.now() + simulatedMs;
  for (const racer of room.players) {
    let sequence = racer.race.sequence + 1000;
    const start = Math.floor(racer.race.progress * 200);
    for (let step = start; step <= 200; step++) {
      simulatedMs += 85;
      const t = (step / 200) % 1;
      const point = room.route.curve.getPointAt(t);
      const tangent = room.route.curve.getTangentAt(t);
      manager.handle(racer.socket, JSON.stringify({ type: 'RACE_SNAPSHOT', payload: {
        sequence: sequence++, x: point.x, y: point.y + .16, z: point.z,
        rotationY: Math.atan2(tangent.x, tangent.z), speed: 31, steering: 0,
        lap: 999, checkpoint: 999,
      } }), 'test');
    }
  }
  const visibleTabs = tabs.filter(tab => !tab.isClosed());
  await Promise.all(visibleTabs.map(tab => tab.waitForSelector('#mpResults:not(.hidden)', { timeout: 10000 })));
  const views = await Promise.all(visibleTabs.map(tab => tab.$$eval('.mp-result-row', rows => rows.map(row => row.textContent))));
  result.authoritativeResultsAgree = views.every(view => JSON.stringify(view) === JSON.stringify(views[0])) && views[0].length === count;
  result.serverFinished = room.status === 'finished';
  result.finishRows = views[0];
  result.passed &&= result.authoritativeResultsAgree && result.serverFinished;
  if (count === 2) {
    await host.screenshot({ path: 'receipts/multiplayer/phase-2-results.png' });
    await host.click('.mp-result-actions button:first-child');
    result.rematchKeepsRoom = manager.rooms.get(code) === room && ['loading', 'countdown'].includes(room.status);
    result.passed &&= result.rematchKeepsRoom;
  }
  if (count === 4) {
    await host.click('.mp-result-actions button:nth-child(2)');
    await Promise.all(visibleTabs.map(tab => tab.waitForFunction(() => {
      const lobby = document.querySelector('#multiplayerLobby');
      return lobby && !lobby.classList.contains('hidden') && lobby.querySelector('h2')?.textContent === 'THE GRID IS COMPLETE';
    }, { timeout: 10000 })));
    result.returnToLobbySynchronized = room.status === 'ready_check';
    result.passed &&= result.returnToLobbySynchronized;
  }
  manager.now = () => Date.now();
  report.runs.push(result);
  for (const tab of tabs) if (!tab.isClosed()) await tab.close();
  return result;
}
try {
  for (const count of [2, 3, 4]) await run(count);
  writeFileSync('receipts/multiplayer/phase-2-browser-gate.json', JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  if (report.runs.some(run => !run.passed) || errors.length) process.exitCode = 1;
} catch (error) { console.error(error); console.log(JSON.stringify(report, null, 2)); process.exitCode = 1; }
finally { for (const context of contexts) await context.close().catch(() => {}); await browser.close(); server.close(); }
