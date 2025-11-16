import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import http from 'http'

const ESP_IP_ADDRESS = 'http://10.211.19.160'

export default defineConfig(() => ({
  plugins: [react()],
  server: {
    host: true,
    port: 8080,
    logLevel: 'info',
    proxy: {
      '/api': {
        target: ESP_IP_ADDRESS,
        changeOrigin: true,
        secure: false,
        timeout: 30000,        // wait longer for upstream responses
        proxyTimeout: 30000,
        ws: false,
        rewrite: (p) => p.replace(/^\/api/, ''),
        // create a fresh agent that does NOT keep sockets alive
        agent: new http.Agent({ keepAlive: false }),
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            try { proxyReq.setHeader('Connection', 'close'); } catch(e){}
            try { proxyReq.setHeader('Accept-Encoding', 'identity'); } catch(e){}
            console.log('[proxyReq] ', req.method, req.url);
          });
          proxy.on('error', (err, req, res) => {
            console.error('[proxy error]', err && err.message);
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('[proxyRes] ', req.url, proxyRes && proxyRes.statusCode);
          });
        },
      },
    },
  },
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
}));
