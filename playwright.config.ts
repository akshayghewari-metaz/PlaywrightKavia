import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for this container.
 *
 * Notes:
 * - This scaffold does not assume an app/dev server exists yet (no webServer configured).
 * - When you add an app to test, set `use.baseURL` and optionally `webServer`.
 */
export default defineConfig({
  testDir: './tests',
  /* Keep runs reasonably fast; CI typically sets process.env.CI=true. */
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  /* Parallel by default; workers limited on CI for stability. */
  fullyParallel: true,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? 'list' : 'html',

  use: {
    /* External app under test (no webServer needed). */
    baseURL: 'https://los-fe-five.vercel.app',
    /**
     * Shared authenticated state file ("stateStorage").
     * Tests can opt-in by setting `test.use({ storageState: stateStoragePath })`.
     */
    storageState: 'stateStorage/auth.json',
    /* Collect trace on first retry to aid debugging in CI. */
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },

  projects: [
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/
    },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup']
    }
  ]
});
