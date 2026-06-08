# Headed Playwright run (xvfb) — last execution report

Command executed:

```bash
cd PlaywrightKavia && xvfb-run -a npx playwright test --headed
```

## Timeline / failures observed

### Failure 1 — missing test runner dependency

Error output:

```
Error: Cannot find module '@playwright/test'
Require stack:
- /home/kavia/workspace/code-generation/PlaywrightKavia/playwright.config.ts
- /home/kavia/.npm/_npx/e41f203b7505f1fb/node_modules/playwright/lib/common/index.js
- /home/kavia/.npm/_npx/e41f203b7505f1fb/node_modules/playwright/lib/program.js
- /home/kavia/.npm/_npx/e41f203b7505f1fb/node_modules/playwright/cli.js
...
code: 'MODULE_NOT_FOUND'
```

Fix applied:

```bash
cd PlaywrightKavia && npm install --no-fund --no-audit --save-dev @playwright/test
```

### Failure 2 — missing Chromium browser executable

After installing `@playwright/test`, test run failed with:

```
Error: browserType.launch: Executable doesn't exist at /ms-playwright/chromium-1223/chrome-linux64/chrome
╔════════════════════════════════════════════════════════════════╗
║ Looks like Playwright was just installed or updated.           ║
║ Please run the following command to download new browsers:     ║
║                                                                ║
║   npx playwright install                                       ║
║                                                                ║
║ <3 Playwright Team                                             ║
╚════════════════════════════════════════════════════════════════╝
```

Fix applied:

```bash
cd PlaywrightKavia && npx playwright install --with-deps chromium
```

### Final run result (after fixes)

Output summary:

- Running 2 tests using 1 worker
- 1 passed, 1 failed
- Total time: ~7.4s

Remaining failing test:

- `tests/example.spec.ts >> get started link exists`

Exact error:

```
Error: expect(locator).toBeVisible() failed
Locator: getByRole('link', { name: 'More information...' })
Expected: visible
Timeout: 5000ms
Error: element(s) not found
```

Playwright error-context snapshot indicates the page contains:

- heading "Example Domain"
- link "Learn more" → https://iana.org/domains/example

So the failing assertion is due to expecting the wrong link accessible name.
