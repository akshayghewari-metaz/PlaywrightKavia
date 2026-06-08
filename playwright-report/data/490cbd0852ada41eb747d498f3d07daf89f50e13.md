# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: example.spec.ts >> get started link exists
- Location: tests/example.spec.ts:8:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('link', { name: 'More information...' })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByRole('link', { name: 'More information...' })

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
  3  | test('has title', async ({ page }) => {
  4  |   await page.goto('https://example.com/');
  5  |   await expect(page).toHaveTitle(/Example Domain/);
  6  | });
  7  | 
  8  | test('get started link exists', async ({ page }) => {
  9  |   await page.goto('https://example.com/');
> 10 |   await expect(page.getByRole('link', { name: 'More information...' })).toBeVisible();
     |                                                                         ^ Error: expect(locator).toBeVisible() failed
  11 | });
  12 | 
```