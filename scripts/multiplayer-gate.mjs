#!/usr/bin/env node
import puppeteer from 'puppeteer';
import { mkdirSync, writeFileSync } from 'node:fs';
import { createRoomServer } from '../server/index.mjs';

const { server } = createRoomServer({ serveDist: true });
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const origin = `http://127.0.0.1:${server.address().port}`;
const browser = await puppeteer.launch({ headless: true, executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', args: ['--no-sandbox', '--enable-unsafe-swiftshader', '--window-size=1280,720'] });
const errors = [];
const pages = [];
const checks = {};
mkdirSync('receipts/multiplayer', { recursive: true });
async function page(path = '/') {
  const context = await browser.createBrowserContext();
  const tab = await context.newPage();
  tab.on('pageerror', error => errors.push(error.message));
  tab.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  tab.on('response', response => { if (response.status() === 404) errors.push(`404 ${response.url()}`); });
  await tab.goto(origin + path, { waitUntil: 'networkidle0' });
  await tab.waitForFunction(() => window.__READY__ === true);
  pages.push({ context, tab });
  return tab;
}
async function text(tab, selector) { return tab.$eval(selector, el => el.textContent.trim()); }
async function waitText(tab, selector, expected) { await tab.waitForFunction((selector, expected) => document.querySelector(selector)?.textContent?.includes(expected), {}, selector, expected); }
async function run() {
  const host = await page();
  await host.click('#raceTogether');
  checks.menuEntry = await text(host, '#multiplayerLobby h2') === 'RACE TOGETHER';
  checks.avatars = await host.$$eval('.lobby-avatar-button', buttons => buttons.length === 8);
  await host.click('.lobby-actions .primary');
  await host.select('#lobbyCount', '4');
  await host.select('#lobbyTrack', 'QUARRY');
  await host.click('#multiplayerLobby .primary:last-of-type');
  await host.waitForSelector('.lobby-room-code');
  const code = await text(host, '.lobby-room-code');
  checks.roomCode = /^[A-Z2-9]{6}$/.test(code);
  checks.hostWaiting = (await text(host, '.lobby-counter')) === '1 / 4 RACERS JOINED';
  checks.noPrematureReady = await host.$('#multiplayerLobby .lobby-proceed') === null;
  await host.click('.lobby-share button:nth-of-type(1)');
  await waitText(host, '.lobby-notice', 'Room code copied');
  checks.copyCode = true;
  await host.click('.lobby-share button:nth-of-type(2)');
  await waitText(host, '.lobby-notice', 'Invite link copied');
  checks.copyInvite = true;
  await host.screenshot({ path: 'receipts/multiplayer/phase-1-waiting.png' });
  const guest1 = await page(`/race/${code}`);
  checks.inviteRoute = (await text(guest1, '#lobbyJoinCode')) === '' && await guest1.$eval('#lobbyJoinCode', el => el.value) === code;
  await guest1.click('#multiplayerLobby .primary:last-of-type');
  await waitText(host, '.lobby-counter', '2 / 4');
  const guest2 = await page();
  await guest2.click('#raceTogether'); await guest2.click('.lobby-actions button:last-child');
  await guest2.type('#lobbyJoinCode', code.toLowerCase());
  await guest2.click('#multiplayerLobby .primary:last-of-type');
  await waitText(host, '.lobby-counter', '3 / 4');
  checks.codeJoin = await text(guest2, '.lobby-room-code') === code;
  const guest3 = await page(`/race/${code}`);
  await guest3.click('#multiplayerLobby .primary:last-of-type');
  await waitText(host, '.lobby-counter', '4 / 4');
  checks.fourClients = (await text(host, '.lobby-counter')) === '4 / 4 RACERS JOINED';
  checks.readyCheck = await text(host, '#multiplayerLobby h2') === 'THE GRID IS COMPLETE';
  await host.screenshot({ path: 'receipts/multiplayer/phase-1-ready.png' });
  await guest1.click('.lobby-edit');
  await guest1.$eval('.lobby-name', el => { el.value = 'Apex Fox'; el.dispatchEvent(new Event('change', { bubbles: true })); });
  await waitText(host, '.lobby-grid', 'Apex Fox');
  checks.profilePropagation = (await text(host, '.lobby-grid')).includes('Apex Fox');
  for (const tab of [host, guest1, guest2]) await tab.click('.lobby-ready');
  checks.notAllReady = await host.$('.lobby-proceed') === null;
  await guest3.click('.lobby-ready');
  await host.waitForSelector('.lobby-proceed');
  checks.readySync = await host.$$eval('.lobby-driver.is-ready', nodes => nodes.length === 4);
  await guest3.click('.lobby-ready');
  await host.waitForFunction(() => document.querySelectorAll('.lobby-driver.is-ready').length === 3);
  checks.unreadySync = await host.$('.lobby-proceed') === null;
  await guest3.click('.lobby-ready');
  await host.waitForSelector('.lobby-proceed');
  checks.hostOnly = await guest1.$('.lobby-proceed') === null;
  await host.click('.lobby-proceed');
  for (const tab of [host, guest1, guest2, guest3]) await waitText(tab, '#multiplayerLobby h2', 'PREPARING THE GRID');
  await host.waitForFunction(() => document.querySelectorAll('.lobby-driver-detail').length === 4 && [...document.querySelectorAll('.lobby-driver-detail')].every(node => node.textContent.includes('READY TO RACE')), { timeout: 20000 });
  checks.loadingSync = true;
  await guest1.screenshot({ path: 'receipts/multiplayer/phase-1-loading.png' });
  const extra = await page(`/race/${code}`);
  await extra.click('#multiplayerLobby .primary:last-of-type');
  await waitText(extra, '.lobby-notice', 'already moved on');
  checks.startedRoomRejectsJoin = true;
  const noCloud = await extra.evaluate(async () => (await (await fetch('/api/avatar/config')).json()).available);
  checks.customAvatarFallback = noCloud === false;

  const smallHost = await page();
  const hostContext = pages.at(-1).context;
  await smallHost.click('#raceTogether'); await smallHost.click('.lobby-actions .primary');
  await smallHost.select('#lobbyCount', '2');
  await smallHost.click('#multiplayerLobby .primary:last-of-type');
  await smallHost.waitForSelector('.lobby-room-code');
  const smallCode = await text(smallHost, '.lobby-room-code');
  const smallGuest = await page(`/race/${smallCode}`);
  await smallGuest.click('#multiplayerLobby .primary:last-of-type');
  await waitText(smallGuest, '.lobby-counter', '2 / 2');
  await smallHost.close();
  await waitText(smallGuest, '.lobby-grid', 'HOST');
  checks.hostMigration = await smallGuest.$eval('.lobby-driver:nth-child(2) .lobby-driver-detail small', el => el.textContent.includes('HOST'));
  checks.hostMigrationNotice = (await text(smallGuest, '.lobby-notice')).includes('is now the host');
  const resumedHost = await hostContext.newPage();
  resumedHost.on('pageerror', error => errors.push(error.message));
  resumedHost.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  await resumedHost.goto(`${origin}/race/${smallCode}`, { waitUntil: 'networkidle0' });
  await resumedHost.click('#multiplayerLobby .primary:last-of-type');
  await waitText(resumedHost, '.lobby-counter', '2 / 2');
  checks.reconnectNoDuplicate = await resumedHost.$$eval('.lobby-driver-detail', nodes => nodes.length === 2);
}
try {
  await run();
  checks.noConsoleErrors = errors.length === 0;
  writeFileSync('receipts/multiplayer/phase-1-browser-gate.json', JSON.stringify({ checks, errors }, null, 2));
  console.log(JSON.stringify({ checks, errors }, null, 2));
  if (Object.values(checks).some(value => !value)) process.exitCode = 1;
} catch (error) {
  console.error(error);
  console.log(JSON.stringify({ checks, errors }, null, 2));
  process.exitCode = 1;
} finally {
  for (const { context } of pages) await context.close().catch(() => {});
  await browser.close();
  server.close();
}
