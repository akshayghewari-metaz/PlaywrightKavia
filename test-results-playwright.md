# Playwright Headed Test Run Report

Command executed:
- `npm run test:e2e:headed` (script: `xvfb-run -a playwright test --headed`)

Date:
- 2026-06-17

## Summary (latest run)

- Total tests: 2
- Passed: 1
- Failed: 1
- Skipped: 0
- Duration: ~14.1s

## Environment / Setup Notes

### Initial failure (before rerun)
The first attempt to run headed tests failed because the Chromium executable was missing:

- Error: `Executable doesn't exist at /ms-playwright/chromium-1223/chrome-linux64/chrome`

Fix applied (non-interactive CI mode):
- `CI=true npx playwright install --with-deps chromium`

After installing the browser binaries, the tests were re-run.

## Detailed Results (latest run)

### PASS
- `tests/example.spec.ts:4:3` — `baseline` — `can launch browser and open a page`

### FAIL
- `tests/navigation.spec.ts:4:3` — `navigation` — `can follow the More information link and reach an IANA page`

Failure:
- `expect(received).toContain(expected)`
- Expected substring: `iana`
- Received string: `example domains\nexample domains`
- Failure location: `tests/navigation.spec.ts:40:8`
- Timeout occurred while waiting in `expect.poll` (10s timeout configured; error mentions predicate timeout)

Artifacts:
- Screenshot: `test-results/navigation-navigation-can--f501c-link-and-reach-an-IANA-page-chromium/test-failed-1.png`
- Video: `test-results/navigation-navigation-can--f501c-link-and-reach-an-IANA-page-chromium/video.webm`
- Error context: `test-results/navigation-navigation-can--f501c-link-and-reach-an-IANA-page-chromium/error-context.md`

## Analysis / Hypothesis

The failing test uses:

- `await Promise.all([ page.waitForNavigation(), moreInfoLink.click() ]);`

This can be unreliable if the click triggers a navigation pattern that Playwright does not classify as a traditional navigation event (or if timing causes `waitForNavigation()` to miss the event). The observed page content implies we did not reach the intended IANA content.

## Recommendation for next agent

Update `tests/navigation.spec.ts` to wait on a more deterministic signal, for example:
- `await moreInfoLink.click();`
- `await page.waitForURL(/iana\.org/);`
- or `await expect(page).toHaveURL(/iana\.org\/domains\/example/);`

Optionally relax content assertion to reduce flakiness from external page changes and focus on URL-based validation.
