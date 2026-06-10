import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for this repository.
 * This repo currently provides a baseline runnable suite (no app/webServer assumed).
 */
export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  expect: {
    timeout: 5_000
  },

  // Keep artifacts on failure to help debugging in CI.
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },

  // HTML report is useful locally; list is concise for CI logs.
  reporter: process.env.CI ? 'list' : [['html', { open: 'never' }]],

  // A small baseline matrix; can be expanded later.
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ]
});
