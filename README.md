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
- in this Kavia environment, `localhost` points to the container itself (not your browser), so it will not be reachable from outside
- binding to `0.0.0.0` makes the report server reachable through the environment's forwarded link/port handling, but the URL you should actually open is the forwarded **`/proxy/9323/`** URL
- the `npm run report` script disables auto-open and prints a reminder so you do not follow the misleading localhost URL

Open the report in your browser at:

- `https://vscode-internal-25803-beta.beta01.cloud.kavia.ai/proxy/9323/`

(In general, the pattern is: your session base URL + `/proxy/9323/`.)

If you are running purely on your own machine and want the default local-only binding, you can use:

```bash
npm run report:local
```

## Project structure
- `playwright.config.ts` — Playwright configuration
- `tests/` — E2E/spec tests (example smoke test included)
