import { test, expect } from '@playwright/test';

test.describe('navigation', () => {
  test('can follow the More information link and reach an IANA page', async ({ page }) => {
    await page.goto('https://example.com/');

    // Sanity check initial content.
    await expect(page).toHaveTitle(/Example Domain/);
    await expect(page.getByRole('heading', { name: 'Example Domain' })).toBeVisible();

    // Click the only link on the page and ensure we navigate away.
    // NOTE: example.com link text has historically changed (e.g., "More information" -> "Learn more"),
    // so prefer a robust href-based locator with a name-based fallback.
    const hrefLink = page.locator('a[href*="iana.org/domains/example"]');
    const nameFallbackLink = page.getByRole('link', { name: /learn more|more information/i });
    const moreInfoLink = (await hrefLink.count()) > 0 ? hrefLink.first() : nameFallbackLink;

    await expect(moreInfoLink).toBeVisible();
    await expect(moreInfoLink).toHaveAttribute('href', /iana\.org/i);

    await Promise.all([page.waitForNavigation(), moreInfoLink.click()]);

    // The target page content can change over time; assert stable signals:
    // - we left example.com
    // - we ended up on the iana.org hostname
    //
    // Using hostname avoids brittle assertions on localized/variable page text.
    await expect(page).not.toHaveURL(/example\.com/);
    await expect(page).toHaveURL((url) => url.hostname === 'iana.org', { timeout: 10_000 });
  });
});
