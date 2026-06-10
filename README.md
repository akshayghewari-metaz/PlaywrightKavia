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

## Project structure
- `playwright.config.ts` — Playwright configuration
- `tests/` — E2E/spec tests (example smoke test included)
