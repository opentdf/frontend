import { PlaywrightTestConfig, devices } from '@playwright/test';

/* See https://playwright.dev/docs/test-configuration. */
const config: PlaywrightTestConfig = {
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: Boolean(process.env.CI),
  /* Retry on CI only */
  retries: process.env.CI ? 3 : 1,
  /* Enable parallel execution using multiple workers */
  workers: 1,
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  // globalSetup: require.resolve('./global-setup'),
  use: {
    actionTimeout: 60 * 1000,
    navigationTimeout: 30 * 1000,
    // storageState: './tests/e2e/storageState.json',
    /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
    // actionTimeout: 0,
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: "http://localhost:3000/",
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    browserName: "chromium",
    headless: !false,
    launchOptions: {
      slowMo: 500,
    }
  },
  expect: {
  /**
   * Maximum time expect() should wait for the condition to be met.
   * For example in `await expect(locator).toHaveText();`
   */
    timeout: 8000
  },
  /* Maximum time one test can run for. */
  timeout: 3 * 60 * 1000,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: process.env.CI ? 'line' : 'html',
  /* Configure projects for major browsers */
  projects: [
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
  ],
};

export default config;
