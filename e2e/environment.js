const path = require('node:path');

const root = path.resolve(__dirname, '..');
const database = {
  host: process.env.E2E_DB_HOST || '127.0.0.1',
  port: Number(process.env.E2E_DB_PORT || 43306),
  user: process.env.E2E_DB_USER || 'e2e',
  password: process.env.E2E_DB_PASSWORD || 'e2e-password',
  database: process.env.E2E_DB_NAME || 'shoe_shop_e2e',
};
// Migrations, seeding and teardown must never target the normal shop database.
if (!/^[a-zA-Z0-9_]+_e2e$/.test(database.database)) {
  throw new Error('E2E_DB_NAME mora biti ločena testna baza z imenom, ki se konča z _e2e.');
}
const apiPort = Number(process.env.E2E_API_PORT || 5101);
const appPort = Number(process.env.E2E_APP_PORT || 3101);
const apiURL = `http://127.0.0.1:${apiPort}`;
const baseURL = `http://127.0.0.1:${appPort}`;
const backendEnv = {
  DB_HOST: database.host,
  DB_PORT: String(database.port),
  DB_USER: database.user,
  DB_PASSWORD: database.password,
  DB_NAME: database.database,
  PORT: String(apiPort),
  JWT_SECRET: 'isolated-e2e-test-secret',
};

module.exports = { root, database, apiPort, appPort, apiURL, baseURL, backendEnv };
