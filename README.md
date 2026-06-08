# PlaywrightKavia

This repository is a minimal Playwright test runner scaffold that supports both:
- **Headless** runs (default; works in CI)
- **Headed** runs in environments **without a real display** by using a **virtual X server (Xvfb)**

## Why headed mode fails by default in this environment

If you run Playwright with `--headed` (or `headless: false`) inside a typical container/CI environment, Chromium will fail with:

- `Missing X server or $DISPLAY`

That means there is no display server available. The fix is to run with a virtual display.

This repo includes a **repo-controlled wrapper** (`scripts/run-with-xvfb.cjs`) that:
- Uses `xvfb-run` if available
- Otherwise starts `Xvfb` directly
- Otherwise fails with a clear “install Xvfb” message

## Setup

Install Node dependencies:

```bash
cd PlaywrightKavia
npm install
```

Install Chromium + OS deps (recommended):

```bash
npm run install:browsers
```

## Run tests (headless)

```bash
npm test
```

## Run tests in headed mode (works without a real display)

IMPORTANT: Do **not** run `npm test -- --headed` or `npx playwright test --headed` in this environment.
Those commands bypass the Xvfb wrapper and can still fail with `Missing X server or $DISPLAY`.

Use the repo script instead:

```bash
npm run test:headed
```

## Run Playwright UI mode (works without a real display)

```bash
npm run test:ui:xvfb
```

## Run tests in headed mode (real display required)

Only use this if you are on a machine/session that already has a working X server and `$DISPLAY` set:

```bash
npm run test:headed:real
```

## Hard limitation (important)

Xvfb provides a **virtual** display. It enables headed mode execution, but you won’t see a browser window on your local screen unless you additionally set up GUI forwarding (X11 forwarding) or a VNC/RDP server.
