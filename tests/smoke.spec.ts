import { test, expect } from '@playwright/test';

test.describe('smoke', () => {
  test('browser launches and can render a basic page', async ({ page }) => {
    await page.setContent('<main><h1>Hello Playwright</h1></main>');
    await expect(page.getByRole('heading', { name: 'Hello Playwright' })).toBeVisible();
  });
});
