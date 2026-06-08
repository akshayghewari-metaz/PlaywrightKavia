import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright config for a container/CI friendly environment.
 * - Default headless is true (safe for CI).
 * - Use `npm run test:headed:xvfb` for headed runs in environments without a real X server.
 */
export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'list' : [['html', { open: 'never' }]],
  use: {
    // IMPORTANT: keep default headless true; headed is controlled by CLI flags in scripts.
    headless: true,
    viewport: { width: 1280, height: 720 },
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    }
  ],
});
