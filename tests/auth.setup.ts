import { test, expect } from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';

const stateStoragePath = 'stateStorage/auth.json';

/**
 * Ensure the stateStorage folder exists before writing the file.
 */
async function ensureStateStorageDirExists() {
  const dir = path.dirname(stateStoragePath);
  await fs.mkdir(dir, { recursive: true });
}

test.describe('auth setup', () => {
  test('login and save storageState (stateStorage)', async ({ page }) => {
    await ensureStateStorageDirExists();

    // Navigate to login page
    await page.goto('/login', { waitUntil: 'domcontentloaded' });

    // This test intentionally keeps selectors flexible: we don't know the exact DOM.
    // It tries a few common patterns so the test is resilient to minor UI changes.
    const email = process.env.E2E_EMAIL;
    const password = process.env.E2E_PASSWORD;

    if (!email || !password) {
      throw new Error(
        'Missing required env vars for login.\n' +
          'Please provide:\n' +
          '- E2E_EMAIL\n' +
          '- E2E_PASSWORD\n'
      );
    }

    // Try common selectors for email/username and password.
    const emailField = page
      .locator('input[type="email"]')
      .or(page.getByLabel(/email/i))
      .or(page.getByPlaceholder(/email/i))
      .or(page.getByRole('textbox', { name: /email|username/i }));

    const passwordField = page
      .locator('input[type="password"]')
      .or(page.getByLabel(/password/i))
      .or(page.getByPlaceholder(/password/i));

    await expect(emailField.first()).toBeVisible({ timeout: 15_000 });
    await emailField.first().fill(email);

    await expect(passwordField.first()).toBeVisible({ timeout: 15_000 });
    await passwordField.first().fill(password);

    // Attempt to click a submit/login button.
    const submitButton = page
      .getByRole('button', { name: /log in|login|sign in|submit/i })
      .or(page.locator('button[type="submit"]'));

    await expect(submitButton.first()).toBeVisible({ timeout: 15_000 });
    await Promise.all([
      // Login often triggers navigation; don't hard-fail if it doesn't.
      page.waitForLoadState('networkidle').catch(() => null),
      submitButton.first().click()
    ]);

    // Heuristic: after login, many apps redirect away from /login.
    // If it doesn't redirect, this still might be OK (SPA), so we also check for
    // the presence/absence of common login form elements.
    await page.waitForTimeout(1000);

    const stillOnLogin = page.url().includes('/login');
    if (stillOnLogin) {
      // If we're still on /login, ensure the password input isn't still visible
      // (common indication login did not succeed).
      // We keep this soft-ish but still a meaningful assertion.
      await expect(passwordField.first()).toBeHidden({ timeout: 10_000 });
    }

    await page.context().storageState({ path: stateStoragePath });
  });
});
