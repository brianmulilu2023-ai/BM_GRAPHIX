import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

/**
 * Vite Dev & Local-Network Media API Plugin
 * - Serves media seamlessly to mobile phones and desktop simultaneously.
 * - Saves uploaded files directly to public/uploads/ so mobile devices can load
 *   real images and MP4 videos instead of failing on massive base64 strings.
 * - Stores projects in src/data/custom_projects.json so any mobile device connecting
 *   over the network immediately sees whatever was uploaded on Windows.
 */
function portfolioBackendPlugin() {
  const uploadsDir = path.resolve(process.cwd(), 'public', 'uploads');
  const dataDir = path.resolve(process.cwd(), 'src', 'data');
  const projectsJsonPath = path.resolve(dataDir, 'custom_projects.json');
  const mediaJsonPath = path.resolve(dataDir, 'custom_media.json');

  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  return {
    name: 'portfolio-backend-api',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        // Universal CORS headers so mobile devices on LAN can read/write
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        if (req.method === 'OPTIONS') {
          res.statusCode = 204;
          return res.end();
        }

        // 1. GET /api/projects
        if (req.method === 'GET' && req.url === '/api/projects') {
          res.setHeader('Content-Type', 'application/json');
          if (fs.existsSync(projectsJsonPath)) {
            try {
              const data = fs.readFileSync(projectsJsonPath, 'utf-8');
              return res.end(data || '[]');
            } catch (e) {
              return res.end(JSON.stringify({ error: e.message }));
            }
          }
          return res.end(JSON.stringify([]));
        }

        // 2. POST /api/projects
        if (req.method === 'POST' && req.url === '/api/projects') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', () => {
            try {
              const parsed = JSON.parse(body);
              fs.writeFileSync(projectsJsonPath, JSON.stringify(parsed, null, 2), 'utf-8');
              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify({ success: true, count: Array.isArray(parsed) ? parsed.length : 1 }));
            } catch (err) {
              res.statusCode = 400;
              return res.end(JSON.stringify({ error: err.message }));
            }
          });
          return;
        }

        // 3. GET /api/media
        if (req.method === 'GET' && req.url === '/api/media') {
          res.setHeader('Content-Type', 'application/json');
          if (fs.existsSync(mediaJsonPath)) {
            try {
              const data = fs.readFileSync(mediaJsonPath, 'utf-8');
              return res.end(data || '[]');
            } catch (e) {
              return res.end(JSON.stringify({ error: e.message }));
            }
          }
          return res.end(JSON.stringify([]));
        }

        // 4. POST /api/media
        if (req.method === 'POST' && req.url === '/api/media') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', () => {
            try {
              const parsed = JSON.parse(body);
              fs.writeFileSync(mediaJsonPath, JSON.stringify(parsed, null, 2), 'utf-8');
              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify({ success: true }));
            } catch (err) {
              res.statusCode = 400;
              return res.end(JSON.stringify({ error: err.message }));
            }
          });
          return;
        }

        // 5. POST /api/upload — saves base64 file to public/uploads/ and returns static path
        if (req.method === 'POST' && req.url === '/api/upload') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', () => {
            try {
              const { filename, dataUrl } = JSON.parse(body);
              if (!dataUrl) {
                res.statusCode = 400;
                return res.end(JSON.stringify({ error: 'Missing dataUrl' }));
              }

              // Extract base64 payload
              const matches = dataUrl.match(/^data:([A-Za-z0-9\/\-\+\.]+);base64,(.+)$/);
              if (!matches || matches.length !== 3) {
                res.statusCode = 400;
                return res.end(JSON.stringify({ error: 'Invalid dataUrl format' }));
              }

              const mime = matches[1];
              let ext = filename ? path.extname(filename) : '';
              if (!ext) {
                if (mime.includes('mp4')) ext = '.mp4';
                else if (mime.includes('webm')) ext = '.webm';
                else if (mime.includes('png')) ext = '.png';
                else if (mime.includes('webp')) ext = '.webp';
                else ext = '.jpg';
              }

              const safeName = `media-${Date.now()}-${Math.floor(Math.random() * 10000)}${ext}`;
              const targetFilePath = path.join(uploadsDir, safeName);
              const buffer = Buffer.from(matches[2], 'base64');
              fs.writeFileSync(targetFilePath, buffer);

              const fileUrl = `/uploads/${safeName}`;
              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify({ success: true, url: fileUrl, filename: safeName }));
            } catch (err) {
              res.statusCode = 500;
              return res.end(JSON.stringify({ error: err.message }));
            }
          });
          return;
        }

        next();
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), portfolioBackendPlugin()],
  server: {
    host: true, // Listen on all network addresses (0.0.0.0) so mobile devices on LAN can connect!
    port: 3000,
    open: false
  }
});
