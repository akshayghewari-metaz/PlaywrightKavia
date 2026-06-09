# Playwright HTML report preview verification (Kavia)

## Goal
Verify `cd PlaywrightKavia && npm run show-report` serves the Playwright HTML report on the preview port and is reachable.

## Findings

### 1) `npm run show-report` (initial state)
Command:
- `cd PlaywrightKavia && npm run show-report`

Result:
- Failed with: `npm error Missing script: "show-report"`

Root cause:
- `package.json` had `report:show` but not `show-report`.

Minimal fix applied:
- Add npm script alias:
  - `"show-report": "node scripts/show-report.cjs"`

### 2) Report server behavior (`npm run report:show`)
Command:
- `cd PlaywrightKavia && PORT=9323 npm run report:show`

Observed output:
- `[show-report] Starting Playwright report server on 0.0.0.0:9323`
- `Serving HTML report at http://0.0.0.0:9323. Press Ctrl+C to quit.`

Local reachability check:
- `curl -I http://127.0.0.1:9323` → `HTTP/1.1 200 OK`

Notes:
- Binding to `0.0.0.0` is correct for Kavia preview/proxy.
- The script uses `process.env.PORT || 9323`, which supports preview-port injection.

## Test execution

### Initial test run (before installing browsers)
Command:
- `cd PlaywrightKavia && npm test -- --reporter=list`

Result:
- 2 failed with:
  - `Error: browserType.launch: Executable doesn't exist at /ms-playwright/chromium_headless_shell-1223/...`

Fix:
- `cd PlaywrightKavia && npx playwright install chromium`

### Final test run (after installing browsers)
Command:
- `cd PlaywrightKavia && npm test -- --reporter=list`

Result:
- `2 passed (6.3s)`

## Expected usage after fix
- Run tests (if needed): `cd PlaywrightKavia && npm test`
- Serve report (Kavia preview): `cd PlaywrightKavia && PORT=<preview_port> npm run show-report`
  - The server binds to `0.0.0.0` and should be reachable through the Kavia preview URL for that container/port.
