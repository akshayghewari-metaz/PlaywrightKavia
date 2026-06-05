import { test, expect } from '@playwright/test';

const stateStoragePath = 'stateStorage/auth.json';

test.describe('authenticated smoke', () => {
  // Reuse the logged-in session across all tests in this file.
  test.use({ storageState: stateStoragePath });

  test('can load the app root while authenticated', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // A lightweight, app-agnostic assertion: page should not be the login screen.
    // This avoids assuming specific app content while still verifying auth reuse.
    await expect(page).not.toHaveURL(/\/login/i);
    await expect(page.locator('body')).toBeVisible();
  });

  test('can navigate to a second page without re-authenticating', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Try clicking a "Logout" or profile menu etc. is too app-specific.
    // Instead, do a second navigation; if auth is persisted, user should remain logged in.
    await page.goto('/login', { waitUntil: 'domcontentloaded' });

    // If the app redirects authenticated users away from /login, URL should change.
    // Otherwise, it might still show something else. We at least verify we don't see
    // a password field (common for unauthenticated login form).
    const passwordField = page.locator('input[type="password"]');
    await expect(passwordField).toHaveCount(0);
  });
});
