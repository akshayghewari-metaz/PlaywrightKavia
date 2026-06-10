# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: navigation.spec.ts >> navigation >> can follow the More information link and reach an IANA page
- Location: tests/navigation.spec.ts:4:3

# Error details

```
Error: expect(locator).toHaveAttribute(expected) failed

Locator: getByRole('link', { name: /more information/i })
Expected pattern: /iana\.org/i
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toHaveAttribute" with timeout 5000ms
  - waiting for getByRole('link', { name: /more information/i })

```

```yaml
- heading "Example Domain" [level=1]
- paragraph: This domain is for use in documentation examples without needing permission. Avoid use in operations.
- paragraph:
  - link "Learn more":
    - /url: https://iana.org/domains/example
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('navigation', () => {
  4  |   test('can follow the More information link and reach an IANA page', async ({ page }) => {
  5  |     await page.goto('https://example.com/');
  6  | 
  7  |     // Sanity check initial content.
  8  |     await expect(page).toHaveTitle(/Example Domain/);
  9  |     await expect(page.getByRole('heading', { name: 'Example Domain' })).toBeVisible();
  10 | 
  11 |     // Click the only link on the page and ensure we navigate away.
  12 |     const moreInfoLink = page.getByRole('link', { name: /more information/i });
> 13 |     await expect(moreInfoLink).toHaveAttribute('href', /iana\.org/i);
     |                                ^ Error: expect(locator).toHaveAttribute(expected) failed
  14 | 
  15 |     await moreInfoLink.click();
  16 | 
  17 |     // The target page can change over time; assert stable signals:
  18 |     // - we left example.com
  19 |     // - the new page includes IANA in either title or main heading.
  20 |     await expect(page).not.toHaveURL(/example\.com/);
  21 | 
  22 |     await expect
  23 |       .poll(
  24 |         async () => {
  25 |           const title = await page.title();
  26 |           const h1 = (await page.locator('h1').first().textContent()) ?? '';
  27 |           return `${title}\n${h1}`.toLowerCase();
  28 |         },
  29 |         { timeout: 10_000 }
  30 |       )
  31 |       .toContain('iana');
  32 |   });
  33 | });
  34 | 
```