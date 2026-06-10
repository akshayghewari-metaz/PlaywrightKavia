# PlaywrightKavia - Playwright Test Execution Report

## Runs

### Run 1 (initial)
Command:
- npm test -- --reporter=list

Result:
- Did not successfully invoke Playwright runner in this environment.
- Output included: `error: unknown command 'test'`

Notes:
- Suspected environment/tooling shim interference. Proceeded with explicit dependency install + `npx playwright test`.

### Run 2 (after npm install, before browser install)
Command:
- CI=true npx playwright test --reporter=list

Result:
- 1 test failed

Failure:
- `Error: browserType.launch: Executable doesn't exist at /ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-linux64/chrome-headless-shell`
- Playwright recommended: `npx playwright install`

Fix applied:
- `npx playwright install --with-deps chromium`

### Run 3 (final)
Command:
- CI=true npx playwright test --reporter=list

Result:
- Running 1 test using 1 worker
- ✓ [chromium] tests/example.spec.ts: baseline › can launch browser and open a page
- 1 passed (1.7s)

### Run 4 (current)
Command:
- npm ci
- CI=true npx playwright test --reporter=list

Result:
- Running 2 tests using 2 workers
- ✓ [chromium] tests/example.spec.ts:4:3 › baseline › can launch browser and open a page
- ✘ [chromium] tests/navigation.spec.ts:4:3 › navigation › can follow the More information link and reach an IANA page
- 1 failed
- 1 passed (6.7s)

Failure details:
- File/line: `tests/navigation.spec.ts:13:32`
- Error: `expect(locator).toHaveAttribute(expected) failed` / `element(s) not found`
- Locator: `getByRole('link', { name: /more information/i })`
- Note: example.com link text is currently **"Learn more"**, so the locator does not resolve.

Artifacts:
- Screenshot: `test-results/navigation-navigation-can--f501c-link-and-reach-an-IANA-page-chromium/test-failed-1.png`
- Video: `test-results/navigation-navigation-can--f501c-link-and-reach-an-IANA-page-chromium/video.webm`
- Error context: `test-results/navigation-navigation-can--f501c-link-and-reach-an-IANA-page-chromium/error-context.md`

## Summary
- Total tests: 2
- Passed: 1
- Failed: 1
- Skipped: 0
