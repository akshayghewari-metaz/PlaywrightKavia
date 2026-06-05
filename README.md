# PlaywrightKavia

This container folder contains a minimal, runnable Playwright test scaffold.

## What’s included
- Playwright test runner pinned via `@playwright/test`
- `playwright.config.ts` with sensible CI defaults
- A smoke test under `tests/` that does not require any external app/server
- Convenience npm scripts for install + running tests

## Prerequisites
- Node.js (LTS recommended)

## Quickstart

### 1) Install npm dependencies
```bash
cd PlaywrightKavia
npm install
```

### 2) Install Chromium browser binary (recommended in CI and fresh environments)
```bash
npm run test:e2e:install
```

### 3) Run tests
```bash
npm run test:e2e
```

## Common commands
- Headed mode:
  ```bash
  npm run test:e2e:headed
  ```
- Playwright UI mode:
  ```bash
  npm run test:e2e:ui
  ```
- View HTML report after a run:
  ```bash
  npm run test:e2e:report
  ```

## Notes / Next steps
- This scaffold does not start any `webServer` because there is no app in this repo yet.
- When you add an application to test, update `playwright.config.ts`:
  - set `use.baseURL`
  - optionally configure `webServer` to start/stop the app automatically
"
