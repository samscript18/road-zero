import { createServer } from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer';

const root = path.resolve('dist');
const out = path.resolve('receipts/playtests/views');
fs.mkdirSync(out, { recursive: true });

const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png' };
const server = createServer((req, res) => {
  let rel = decodeURIComponent(req.url.split('?')[0]);
  if (rel === '/favicon.ico') { res.writeHead(204).end(); return; }
  if (rel.endsWith('/')) rel += 'index.html';
  const file = path.resolve(root, `.${rel}`);
  if (!file.startsWith(root) || !fs.existsSync(file)) {
    res.writeHead(404).end();
    return;
  }
  res.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});

await new Promise(r => server.listen(0, '127.0.0.1', r));
const port = server.address().port;

const browser = await puppeteer.launch({
  headless: true,
  executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  args: ['--no-sandbox', '--enable-unsafe-swiftshader']
});

// 1. Desktop Starting Grid Countdown
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 720 });
await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'networkidle0' });
await page.click('#championship');
await new Promise(r => setTimeout(r, 600));
await page.screenshot({ path: path.join(out, 'desktop-grid-countdown.png') });

// Wait for countdown to finish and drive forward
await new Promise(r => setTimeout(r, 3600));
await page.keyboard.down('KeyW');
await new Promise(r => setTimeout(r, 1200));
await page.screenshot({ path: path.join(out, 'desktop-racing-forward.png') });
await page.keyboard.up('KeyW');
await page.close();

// 2. Mobile Portrait (390 x 844)
const mobilePortrait = await browser.newPage();
await mobilePortrait.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
await mobilePortrait.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'networkidle0' });
await mobilePortrait.tap('#quick');
await new Promise(r => setTimeout(r, 800));
await mobilePortrait.screenshot({ path: path.join(out, 'mobile-portrait-grid.png') });

await new Promise(r => setTimeout(r, 3400));
const throttle = await mobilePortrait.$('#throttle');
const tb = await throttle.boundingBox();
const cdp = await mobilePortrait.createCDPSession();
await cdp.send('Input.dispatchTouchEvent', {
  type: 'touchStart',
  touchPoints: [{ x: tb.x + tb.width / 2, y: tb.y + tb.height / 2, id: 1 }]
});
await new Promise(r => setTimeout(r, 1200));
await mobilePortrait.screenshot({ path: path.join(out, 'mobile-portrait-racing.png') });
await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
await mobilePortrait.close();

await browser.close();
server.close();
console.log('Captured all responsive view screenshots.');
