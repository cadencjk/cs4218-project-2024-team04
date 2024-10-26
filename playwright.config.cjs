// @ts-check
const { defineConfig, devices } = require('@playwright/test');
const dotenv = require('dotenv');

// Load environment variables from .env.ui-test
dotenv.config({ path: '.env.ui-test' });

module.exports = defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  /* Global setup and teardown */
  globalSetup: require.resolve('./test-db-utils/globalSetup.js'),
  globalTeardown: require.resolve('./test-db-utils/globalTeardown.js'),

  webServer: {
    command: 'npm run ui-test',
    url: 'http://localhost:6060',
    reuseExistingServer: !process.env.CI,
  },
});
