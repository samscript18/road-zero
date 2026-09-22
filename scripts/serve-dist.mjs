import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, resolve } from 'node:path';

const root = resolve('dist');
const port = Number(process.env.PORT || 8080);
const types = { '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.css':'text/css; charset=utf-8', '.json':'application/json', '.png':'image/png' };

createServer((req,res) => {
  const pathname = decodeURIComponent(new URL(req.url || '/', 'http://local').pathname);
  let file = resolve(root, `.${pathname === '/' ? '/index.html' : pathname}`);
  if (!file.startsWith(root) || !existsSync(file) || !statSync(file).isFile()) file = resolve(root, 'index.html');
  res.writeHead(200, {
    'Content-Type': types[extname(file)] || 'application/octet-stream',
    'Cache-Control': extname(file) === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable',
    'X-Content-Type-Options': 'nosniff'
  });
  createReadStream(file).pipe(res);
}).listen(port, '0.0.0.0', () => console.log(`ROAD//ZERO listening on ${port}`));
