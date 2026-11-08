const { execFileSync } = require('node:child_process');
const path = require('node:path');
const { root, backendEnv } = require('./environment');

Object.assign(process.env, backendEnv);
for (const script of ['migrate.js', 'seeders/seed.js']) {
  execFileSync(process.execPath, [path.join(root, 'backend', script)], {
    env: process.env,
    stdio: 'inherit',
  });
}
require('../backend/server');
