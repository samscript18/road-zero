import { defineConfig } from 'vite';

const multiplayerPort = Number(process.env.MULTIPLAYER_PORT || 8787);

export default defineConfig({
  base: './',
  server: {
    proxy: {
      '/multiplayer': { target: `ws://127.0.0.1:${multiplayerPort}`, ws: true },
      '/api/avatar': { target: `http://127.0.0.1:${multiplayerPort}` },
    },
  },
  build: {
    chunkSizeWarningLimit: 560,
  },
});
