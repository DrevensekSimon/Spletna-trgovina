const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { root, apiPort, appPort } = require('./environment');

const build = path.join(root, 'frontend', 'build');
if (!fs.existsSync(path.join(build, 'index.html'))) {
  throw new Error('Najprej zgradi frontend: npm --prefix frontend run build');
}
const types = {
  '.html': 'text/html; charset=utf-8', '.js': 'application/javascript',
  '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.ico': 'image/x-icon', '.woff2': 'font/woff2',
};
http.createServer((request, response) => {
  const url = new URL(request.url, 'http://localhost');
  if (url.pathname.startsWith('/api/')) {
    const proxy = http.request({
      hostname: '127.0.0.1', port: apiPort, path: request.url,
      method: request.method, headers: request.headers,
    }, upstream => {
      response.writeHead(upstream.statusCode, upstream.headers);
      upstream.pipe(response);
    });
    proxy.on('error', () => { response.writeHead(502); response.end('API unavailable'); });
    request.pipe(proxy);
    return;
  }
  const requested = path.resolve(build, '.' + decodeURIComponent(url.pathname));
  if (requested !== build && !requested.startsWith(build + path.sep)) {
    response.writeHead(403); response.end(); return;
  }
  const file = fs.existsSync(requested) && fs.statSync(requested).isFile()
    ? requested : path.join(build, 'index.html');
  response.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(response);
}).listen(appPort, '127.0.0.1', () => console.log(`E2E frontend: http://127.0.0.1:${appPort}`));
