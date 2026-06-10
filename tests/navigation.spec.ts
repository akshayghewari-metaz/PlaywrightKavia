import { test, expect } from '@playwright/test';

test.describe('navigation', () => {
  test('can follow the More information link and reach an IANA page', async ({ page }) => {
    await page.goto('https://example.com/');

    // Sanity check initial content.
    await expect(page).toHaveTitle(/Example Domain/);
    await expect(page.getByRole('heading', { name: 'Example Domain' })).toBeVisible();

    // Click the only link on the page and ensure we navigate away.
    const moreInfoLink = page.getByRole('link', { name: /more information/i });
    await expect(moreInfoLink).toHaveAttribute('href', /iana\.org/i);

    await moreInfoLink.click();

    // The target page can change over time; assert stable signals:
    // - we left example.com
    // - the new page includes IANA in either title or main heading.
    await expect(page).not.toHaveURL(/example\.com/);

    await expect
      .poll(
        async () => {
          const title = await page.title();
          const h1 = (await page.locator('h1').first().textContent()) ?? '';
          return `${title}\n${h1}`.toLowerCase();
        },
        { timeout: 10_000 }
      )
      .toContain('iana');
  });
});
