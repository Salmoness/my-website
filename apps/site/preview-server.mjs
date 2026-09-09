import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, 'dist');
const port = Number(process.env.PORT ?? process.argv[2]) || 4321;

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.txt': 'text/plain; charset=utf-8',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
};

function isWithin(root, target) {
  const relative = path.relative(root, target);
  return relative !== '..' && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative);
}

const server = http.createServer((req, res) => {
  function fail(status, message) {
    res.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(req.method === 'HEAD' ? undefined : message);
  }

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('Allow', 'GET, HEAD');
    fail(405, '405 Method Not Allowed');
    return;
  }

  let decodedPath;
  try {
    decodedPath = decodeURIComponent((req.url ?? '/').split(/[?#]/, 1)[0]);
  } catch {
    fail(400, '400 Bad Request');
    return;
  }

  // Reject traversal before filesystem access, including Windows separators and streams.
  if (
    !decodedPath.startsWith('/') ||
    decodedPath.startsWith('//') ||
    /[\\:\u0000-\u001f\u007f]/.test(decodedPath) ||
    decodedPath.split('/').includes('..')
  ) {
    fail(404, '404 Not Found');
    return;
  }

  let filePath = path.resolve(distDir, `.${decodedPath}`);
  if (!isWithin(distDir, filePath)) {
    fail(404, '404 Not Found');
    return;
  }

  try {
    if (decodedPath.endsWith('/')) {
      filePath = path.join(filePath, 'index.html');
    } else if (!path.extname(filePath)) {
      if (fs.existsSync(path.join(filePath, 'index.html'))) {
        filePath = path.join(filePath, 'index.html');
      } else if (fs.existsSync(`${filePath}.html`)) {
        filePath += '.html';
      }
    }

    // A symlink or junction inside dist must not expose files outside the built site.
    const realRoot = fs.realpathSync(distDir);
    const realFile = fs.realpathSync(filePath);
    if (!isWithin(realRoot, realFile)) {
      fail(404, '404 Not Found');
      return;
    }

    const stat = fs.statSync(realFile);
    if (!stat.isFile()) {
      fail(404, '404 Not Found');
      return;
    }

    res.writeHead(200, {
      'Content-Type': mimeTypes[path.extname(filePath).toLowerCase()] || 'application/octet-stream',
      'Content-Length': stat.size,
      'X-Content-Type-Options': 'nosniff',
    });
    if (req.method === 'HEAD') {
      res.end();
      return;
    }

    const stream = fs.createReadStream(realFile);
    stream.on('error', () => {
      if (res.headersSent) res.destroy();
      else {
        res.removeHeader('Content-Length');
        fail(500, '500 Internal Server Error');
      }
    });
    res.on('close', () => stream.destroy());
    stream.pipe(res);
  } catch {
    fail(404, '404 Not Found');
  }
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Static preview server listening on http://127.0.0.1:${port}`);
});
