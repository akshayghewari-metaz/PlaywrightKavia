# PlaywrightKavia

This repository is a minimal Playwright test runner scaffold that supports both:
- **Headless** runs (default; works in CI)
- **Headed** runs in environments **without a real display** by using **Xvfb** (`xvfb-run`)

## Why headed mode fails by default in this environment

If you run Playwright with `--headed` (or `headless: false`) inside a typical container/CI environment, Chromium will fail with:

- `Missing X server or $DISPLAY`

That means there is no display server available. The fix is to run with a virtual display.

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

## Run tests in headed mode (virtual display via Xvfb)

Use this in environments that do not provide a real X server:

```bash
npm run test:headed:xvfb
```

## Run Playwright UI mode (virtual display via Xvfb)

```bash
npm run test:ui:xvfb
```

## If headed still fails

1) Confirm you are using the Xvfb scripts (`*:xvfb`) and not plain `--headed`.

2) Ensure Playwright browsers are installed:

```bash
npm run install:browsers
```

3) If you still see missing libraries, re-run the install step above; it uses `--with-deps` to install OS-level dependencies.

## Hard limitation (important)

`xvfb-run` provides a **virtual** display. It enables headed mode execution, but you won't see a browser window on your local screen unless you additionally set up GUI forwarding (X11 forwarding) or a VNC/RDP server.
"""
