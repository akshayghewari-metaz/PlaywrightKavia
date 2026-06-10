import { test, expect } from '@playwright/test';

test.describe('baseline', () => {
  test('can launch browser and open a page', async ({ page }) => {
    await page.goto('https://example.com/');
    await expect(page).toHaveTitle(/Example Domain/);
    await expect(page.locator('h1')).toHaveText('Example Domain');
  });
});
