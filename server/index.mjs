import { createHash, randomUUID } from 'node:crypto';
import { createReadStream, existsSync, readFileSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { WebSocketServer } from 'ws';
import { RoomManager } from './rooms.mjs';
import { normalizeRoomCode } from '../shared/multiplayer-protocol.js';

const mime = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.webp': 'image/webp', '.ico': 'image/x-icon',
};

function json(res, status, data) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff',
  });
  res.end(JSON.stringify(data));
}

async function readJson(req, maxBytes = 2048) {
  let text = '';
  for await (const chunk of req) {
    text += chunk;
    if (text.length > maxBytes) throw new Error('Too much data');
  }
  return JSON.parse(text);
}

function cloudinaryConfigured() {
  return !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);
}

export function createRoomServer({ serveDist = false, root = resolve('dist'), manager = new RoomManager() } = {}) {
  const signingTimes = new Map();
  const server = createServer(async (req, res) => {
    let pathname;
    try { pathname = new URL(req.url || '/', 'http://local').pathname; }
    catch { return json(res, 400, { error: 'Invalid request.' }); }

    if (pathname === '/api/avatar/config' && req.method === 'GET') {
      return json(res, 200, { available: cloudinaryConfigured(), maxBytes: 2_000_000 });
    }
    if (pathname === '/favicon.ico') { res.writeHead(204); res.end(); return; }
    if (pathname === '/api/avatar/sign' && req.method === 'POST') {
      if (!cloudinaryConfigured()) return json(res, 503, { error: 'Custom portraits are not configured yet. Default portraits remain available.' });
      let body;
      try { body = await readJson(req); }
      catch { return json(res, 400, { error: 'Could not read the portrait request.' }); }
      const code = normalizeRoomCode(body.code);
      const room = manager.rooms.get(code);
      const player = room?.players.find(item => item.connected && item.resumeToken === body.resumeToken);
      if (!player) return json(res, 403, { error: 'Join the room before uploading a portrait.' });
      if (room.status === 'loading') return json(res, 409, { error: 'Portraits are locked while the grid loads.' });
      const now = Date.now();
      const recent = (signingTimes.get(player.id) || []).filter(time => now - time < 60_000);
      if (recent.length >= 5) return json(res, 429, { error: 'Too many portrait attempts. Try again shortly.' });
      recent.push(now);
      signingTimes.set(player.id, recent);
      const params = {
        folder: 'road-zero/avatars', format: 'jpg', overwrite: 'false',
        public_id: randomUUID(), timestamp: Math.floor(now / 1000),
        transformation: 'c_fill,g_auto,w_256,h_256',
      };
      const toSign = Object.entries(params).sort(([a], [b]) => a.localeCompare(b))
        .map(([key, value]) => `${key}=${value}`).join('&');
      const signature = createHash('sha1')
        .update(toSign + process.env.CLOUDINARY_API_SECRET).digest('hex');
      return json(res, 200, {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY,
        signature, params,
      });
    }

    if (!serveDist) return json(res, 404, { error: 'Not found.' });
    let decoded;
    try { decoded = decodeURIComponent(pathname); }
    catch { return json(res, 400, { error: 'Invalid path.' }); }
    const file = resolve(root, `.${decoded === '/' ? '/index.html' : decoded}`);
    const inside = file === root || file.startsWith(root + sep);
    const target = inside && existsSync(file) && statSync(file).isFile() ? file :
      decoded.startsWith('/race/') || decoded === '/' ? resolve(root, 'index.html') : null;
    if (!target || !existsSync(target)) return json(res, 404, { error: 'Not found.' });
    const extension = extname(target);
    res.writeHead(200, {
      'Content-Type': mime[extension] || 'application/octet-stream',
      'Cache-Control': extension === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable',
      'X-Content-Type-Options': 'nosniff',
    });
    if (decoded.startsWith('/race/') && target === resolve(root, 'index.html')) {
      res.end(readFileSync(target, 'utf8').replace('<head>', '<head><base href="/" />'));
      return;
    }
    createReadStream(target).pipe(res);
  });

  const sockets = new WebSocketServer({ noServer: true, maxPayload: 8192 });
  server.on('upgrade', (req, socket, head) => {
    let pathname;
    try { pathname = new URL(req.url || '/', 'http://local').pathname; }
    catch { socket.destroy(); return; }
    if (pathname !== '/multiplayer') { socket.destroy(); return; }
    sockets.handleUpgrade(req, socket, head, ws => sockets.emit('connection', ws, req));
  });
  sockets.on('connection', (socket, req) => {
    socket.on('message', raw => manager.handle(socket, raw, req.socket.remoteAddress || 'unknown'));
    socket.on('close', () => manager.leave(socket));
    socket.on('error', () => manager.leave(socket));
  });
  const cleanup = setInterval(() => manager.sweep(), 5_000);
  cleanup.unref();
  server.on('close', () => { clearInterval(cleanup); sockets.close(); });
  return { server, manager, sockets };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.MULTIPLAYER_PORT || process.env.PORT || 8787);
  const serveDist = process.env.SERVE_DIST === '1';
  const { server } = createRoomServer({ serveDist });
  server.listen(port, '0.0.0.0', () => {
    console.log(JSON.stringify({ event: 'multiplayer_server_ready', port, serveDist }));
  });
}
