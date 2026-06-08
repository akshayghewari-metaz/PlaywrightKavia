import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://example.com/');
  await expect(page).toHaveTitle(/Example Domain/);
});

test('get started link exists', async ({ page }) => {
  await page.goto('https://example.com/');
  await expect(page.getByRole('link', { name: 'Learn more' })).toBeVisible();
});
