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
- UI mode:
  ```bash
  npm run test:e2e:ui
  ```
- Debug mode:
  ```bash
  npm run test:e2e:debug
  ```

## Open the HTML report
After running the tests, open the generated Playwright HTML report with:

```bash
npm run report
```

This project uses an environment-safe wrapper around:

```bash
npx playwright show-report --host 0.0.0.0 --port 9323 --no-open playwright-report
```

Why this matters:
- Playwright may still print or try to open `http://localhost:9323` even when the server is bound to `0.0.0.0`
- in this environment, `localhost` may point to the container itself rather than the externally reachable preview/session URL
- binding to `0.0.0.0` makes the report server reachable through the environment's forwarded link/port handling, but the URL you should actually open is the container preview / forwarded URL for port `9323`
- the `npm run report` script disables auto-open and prints this reminder so you do not follow the misleading localhost URL

If you are running purely on your own machine and want the default local-only binding, you can use:

```bash
npm run report:local
```

## Project structure
- `playwright.config.ts` — Playwright configuration
- `tests/` — E2E/spec tests (example smoke test included)
