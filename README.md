# PlaywrightKavia

This repository is a minimal Playwright test runner scaffold that supports both:

- **Headless** runs (default; works in CI)
- **Headed** runs in environments **without a real display** by using a **virtual X server (Xvfb)**

## Why headed mode fails by default in this environment

If you run Playwright with `--headed` (or `headless: false`) inside a typical container/CI environment, Chromium can fail with:

- `Missing X server or $DISPLAY`

That means there is no display server available. The fix is to run with a virtual display.

This repo includes a **repo-controlled wrapper** (`scripts/run-with-xvfb.cjs`) that starts Xvfb on a known display and runs Playwright with `DISPLAY` set.

## Setup

Install Node dependencies:

```bash
cd PlaywrightKavia
npm install
```

### Install browsers (important)

In this environment, Playwright may be configured to look for browsers under `/ms-playwright` via `PLAYWRIGHT_BROWSERS_PATH`.
If browsers are not installed there, you may see:

- `Executable doesn't exist at /ms-playwright/...`

Recommended install:

```bash
npm run install:browsers:with-deps
```

If your environment expects `/ms-playwright`, set:

- `PLAYWRIGHT_BROWSERS_PATH=/ms-playwright` (see `.env.example`)

Then run the install script above again.

## Run tests (headless)

```bash
npm test
```

## Run tests in headed mode (reliable in environments without a real display)

IMPORTANT: Do **not** run `npx playwright test --headed` directly in this environment.
That bypasses the Xvfb wrapper and can fail with `Missing X server or $DISPLAY`.

Use the repo script instead:

```bash
npm run test:headed
```

## Run Playwright UI mode (virtual display)

```bash
npm run test:ui:xvfb
```

## View the Playwright HTML report (important)

After a test run, Playwright writes the HTML report to:

- `PlaywrightKavia/playwright-report/index.html`

In many environments, you **cannot** just open that file in a browser directly, and you also should not try to browse to `http://0.0.0.0:<port>`.

### Recommended: start the report server

```bash
cd PlaywrightKavia
npm run report:show
```

This starts a server bound to `0.0.0.0:9323` (so it can be reachable in containerized setups).

Then open:

- `http://127.0.0.1:9323` (if you are on the same machine)
- OR the environment/preview URL that maps to this container and port

If you see `ECONNREFUSED 0.0.0.0:9323`, it typically means:
- no server is running on that port, or
- you tried to browse to `0.0.0.0` (bind address) instead of a real host like `127.0.0.1`.

## Run tests in headed mode (real display required)

Only use this if you are on a machine/session that already has a working X server and `$DISPLAY` set:

```bash
npm run test:headed:real
```

## Hard limitation (important)

Xvfb provides a **virtual** display. It enables headed mode execution, but you won’t see a browser window on your local screen unless you additionally set up GUI forwarding (X11 forwarding) or a VNC/RDP server.
