import { PlaywrightTestConfig } from '@playwright/test';
import dotenv from "dotenv";
// @ts-ignore
dotenv.config({ multiline: true });

/* See https://playwright.dev/docs/test-configuration. */
const config: PlaywrightTestConfig = {
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI and Local env for now (due to test failures with multiple workers - PLAT-1774  */
  workers: process.env.CI ? 1 : 1,
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
    // actionTimeout: 0,
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: "http://localhost:65432",
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    browserName: "chromium",
    headless: false,
    launchOptions: {
      slowMo: 50,
      // devtools: true,
    }
  },
  expect: {
  /**
   * Maximum time expect() should wait for the condition to be met.
   * For example in `await expect(locator).toHaveText();`
   */
    timeout: 5000
  },
  /* Maximum time one test can run for. */
  timeout: 30 * 1000,
  //   /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  //   /* Configure projects for major browsers */
  // projects: [
  //   {
  //     name: 'chromium',
  //     use: { ...devices['Desktop Chrome'] },
  //   },
  //   {
  //     name: 'firefox',
  //     use: { ...devices['Desktop Firefox'] },
  //   },
  //   {
  //     name: 'webkit',
  //     use: { ...devices['Desktop Safari'] },
  //   },
  // ],
};

export default config;