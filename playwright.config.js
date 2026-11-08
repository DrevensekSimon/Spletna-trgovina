const { defineConfig, devices } = require('@playwright/test');
const { root, baseURL, apiURL } = require('./e2e/environment');

module.exports = defineConfig({
  testDir: './e2e/tests',
  fullyParallel: false,
  workers: 1,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  timeout: 30000,
  globalTimeout: 10 * 60 * 1000,
  expect: { timeout: 10000 },
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['junit', { outputFile: 'output/naloga-4-marko/junit.xml' }],
    ['json', { outputFile: 'output/naloga-4-marko/results.json' }],
  ],
  use: {
    baseURL,
    ...devices['Desktop Chrome'],
    locale: 'sl-SI',
    timezoneId: 'Europe/Ljubljana',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }],
  webServer: [
    {
      name: 'API + testna baza', command: 'node e2e/start-backend.js', cwd: root,
      url: `${apiURL}/api/health`, reuseExistingServer: false, timeout: 120000,
      stdout: 'pipe',
    },
    {
      name: 'React',
      command: 'npm --prefix frontend run build && node e2e/serve-frontend.js',
      cwd: root, url: baseURL, reuseExistingServer: false, timeout: 180000,
      stdout: 'pipe',
      env: { REACT_APP_API_URL: '/api', BROWSER: 'none' },
    },
  ],
});
