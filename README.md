# PlaywrightKavia

This repository contains a minimal, runnable Playwright test suite baseline.

## Prerequisites
- Node.js (LTS recommended)
- npm

## Install dependencies
```bash
npm install
```

## Install browser binaries (Chromium)
Run this once per environment (or whenever Playwright updates):

```bash
npm run test:e2e:install
```

Note: The base runtime image often already contains Playwright + Chromium at the infrastructure level, but the project still pins `@playwright/test` and provides an explicit install script for consistency.

## Run tests
```bash
npm test
```

Or:

```bash
npm run test:e2e
```

## Useful commands
- Headed run:
  ```bash
  npm run test:e2e:headed
  ```
  This repository runs headed Playwright tests through `xvfb-run` so they work in CI/container environments that do not have a native X server. Running plain `playwright test --headed` directly in this environment fails with `Missing X server or $DISPLAY`.
- UI mode:
  ```bash
  npm run test:e2e:ui
  ```
- Debug mode:
  ```bash
  npm run test:e2e:debug
  ```

## Headed mode in this environment
- `npm run test:e2e:headed` uses `xvfb-run -a playwright test --headed`
- this requires the system package that provides `xvfb-run` (typically Xvfb) to be available in the runtime image
- in environments where a real desktop display server is available, you can still run Playwright headed directly if desired

If you see an error like:

```text
Looks like you launched a headed browser without having a XServer running.
Missing X server or $DISPLAY
```

use the provided `npm run test:e2e:headed` script instead of calling `playwright test --headed` directly.

## Open the HTML report
After running the tests, open the generated Playwright HTML report with:

```bash
npm run report
```

This project uses an environment-safe wrapper around:

```bash
npx playwright show-report --host 0.0.0.0 --port 9324 --no-open playwright-report
```

Why this matters:
- Playwright may still print or try to open `http://localhost:9323` even when the server is bound to `0.0.0.0`
- in this Kavia environment, `localhost` points to the container itself (not your browser), so it will not be reachable from outside
- binding to `0.0.0.0` makes the report server reachable through the environment's forwarded link/port handling, but the URL you should actually open is the forwarded **`/proxy/9323/`** URL
- the PreviewManager preview for this container typically runs the report server on its allocated container port (commonly **9323**), accessible as **`/proxy/9323/`**
- the `npm run report` script disables auto-open and prints a reminder so you do not follow the misleading localhost URL

Open the report in your browser at:

- `<your-session-base-url>/proxy/9324/` (when you run `npm run report` manually)
- `<your-session-base-url>/proxy/9323/` (when using the container preview, which runs the report server on the container port)

(In general, the pattern is: your session base URL + `/proxy/<port>/`.)

If you are running purely on your own machine and want the default local-only binding, you can use:

```bash
npm run report:local
```

## Project structure
- `playwright.config.ts` — Playwright configuration
- `tests/` — E2E/spec tests (example smoke test included)
