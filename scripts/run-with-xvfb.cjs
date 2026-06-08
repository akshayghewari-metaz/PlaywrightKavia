#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Run a command under a virtual X server (Xvfb) when no real display is available.
 *
 * Why this exists:
 * - Playwright headed mode requires an X server ($DISPLAY).
 * - In many CI/container environments there is no display.
 * - `xvfb-run` is not always installed; this script falls back to invoking `Xvfb` directly if possible.
 *
 * Usage:
 *   node scripts/run-with-xvfb.cjs -- <command> [args...]
 *
 * Examples:
 *   node scripts/run-with-xvfb.cjs -- npx playwright test --headed
 *   node scripts/run-with-xvfb.cjs -- npx playwright test --ui
 */

const { spawn, spawnSync } = require('node:child_process');

function which(cmd) {
  const res = spawnSync('sh', ['-lc', `command -v ${cmd} >/dev/null 2>&1`], { stdio: 'ignore' });
  return res.status === 0;
}

function hasUsableDisplay() {
  if (!process.env.DISPLAY || process.env.DISPLAY.trim().length === 0) return false;

  // If xdpyinfo exists, use it to validate that DISPLAY points to a *working* X server.
  // This avoids false positives where DISPLAY is set but unusable (common in containers).
  if (which('xdpyinfo')) {
    const res = spawnSync('xdpyinfo', [], { stdio: 'ignore', env: process.env });
    return res.status === 0;
  }

  // If we cannot validate, conservatively assume the display is usable if set.
  return true;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseArgs(argv) {
  const idx = argv.indexOf('--');
  if (idx === -1 || idx === argv.length - 1) {
    return null;
  }
  return argv.slice(idx + 1);
}

async function main() {
  const cmdArgs = parseArgs(process.argv.slice(2));
  if (!cmdArgs) {
    console.error('Usage: node scripts/run-with-xvfb.cjs -- <command> [args...]');
    process.exit(2);
  }

  // If the caller already has a *usable* display, just run the command.
  // (DISPLAY can be set but broken; in that case we should still use Xvfb.)
  if (hasUsableDisplay()) {
    const child = spawn(cmdArgs[0], cmdArgs.slice(1), { stdio: 'inherit' });
    child.on('exit', (code) => process.exit(code ?? 1));
    return;
  }

  if (process.env.DISPLAY && process.env.DISPLAY.trim().length > 0) {
    console.warn(
      `[run-with-xvfb] DISPLAY is set to "${process.env.DISPLAY}", but it does not appear to be usable. Falling back to Xvfb.`
    );
  }

  // Prefer xvfb-run when available (it manages DISPLAY + cleanup for us).
  if (which('xvfb-run')) {
    const xvfbArgs = [
      '-a',
      '-s',
      '-screen 0 1920x1080x24 -ac +extension RANDR',
      ...cmdArgs,
    ];
    const child = spawn('xvfb-run', xvfbArgs, { stdio: 'inherit' });
    child.on('exit', (code) => process.exit(code ?? 1));
    return;
  }

  // Fallback: start Xvfb directly if present.
  if (which('Xvfb')) {
    const display = ':99';
    const xvfb = spawn(
      'Xvfb',
      [
        display,
        '-screen',
        '0',
        '1920x1080x24',
        '-ac',
        '+extension',
        'RANDR',
      ],
      { stdio: 'inherit' }
    );

    // Give Xvfb a moment to come up.
    await sleep(300);

    // If Xvfb exited immediately, fail with a clear message.
    if (xvfb.exitCode !== null) {
      console.error('[run-with-xvfb] Xvfb exited immediately and cannot provide a virtual display.');
      console.error('[run-with-xvfb] Ensure Xvfb is installed and functional in this environment.');
      process.exit(xvfb.exitCode || 1);
    }

    const child = spawn(cmdArgs[0], cmdArgs.slice(1), {
      stdio: 'inherit',
      env: { ...process.env, DISPLAY: display },
    });

    const cleanup = () => {
      try {
        xvfb.kill('SIGTERM');
      } catch {
        // ignore
      }
    };

    child.on('exit', (code) => {
      cleanup();
      process.exit(code ?? 1);
    });

    child.on('error', (err) => {
      console.error('Failed to start child process:', err);
      cleanup();
      process.exit(1);
    });

    process.on('SIGINT', () => {
      cleanup();
      process.exit(130);
    });
    process.on('SIGTERM', () => {
      cleanup();
      process.exit(143);
    });

    return;
  }

  console.error('Headed Playwright requires an X server, but no $DISPLAY is set.');
  console.error('Also, neither `xvfb-run` nor `Xvfb` was found in this environment.');
  console.error('');
  console.error('Repo-specific fix: install Xvfb (Debian/Ubuntu):');
  console.error('  sudo apt-get update -y && sudo apt-get install -y xvfb');
  console.error('');
  console.error('Then run headed mode via the repo wrapper (do NOT call `playwright test --headed` directly):');
  console.error('  npm run test:headed');
  process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
