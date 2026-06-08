#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Run a command under a virtual X server (Xvfb) when no real display is available.
 *
 * Why this exists:
 * - Playwright headed mode requires an X server ($DISPLAY).
 * - In many CI/container environments there is no display.
 *
 * Design:
 * - If a *usable* DISPLAY exists => run the command normally.
 * - Otherwise, provide a deterministic virtual display on :99.
 *   We prefer launching Xvfb directly because it is simpler/more deterministic than xvfb-run
 *   in minimal environments. If Xvfb is missing but xvfb-run exists, we fall back to xvfb-run.
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

function hasUsableDisplay(env = process.env) {
  if (!env.DISPLAY || env.DISPLAY.trim().length === 0) return false;

  // If xdpyinfo exists, validate DISPLAY points to a working X server.
  if (which('xdpyinfo')) {
    const res = spawnSync('xdpyinfo', [], { stdio: 'ignore', env });
    return res.status === 0;
  }

  // If we cannot validate, conservatively assume the display is usable if set.
  return true;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForDisplay(env, { timeoutMs = 5000, intervalMs = 200 } = {}) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (hasUsableDisplay(env)) return true;
    await sleep(intervalMs);
  }
  return hasUsableDisplay(env);
}

function parseArgs(argv) {
  const idx = argv.indexOf('--');
  if (idx === -1 || idx === argv.length - 1) return null;
  return argv.slice(idx + 1);
}

async function runChild(cmdArgs, env) {
  const child = spawn(cmdArgs[0], cmdArgs.slice(1), { stdio: 'inherit', env });
  return await new Promise((resolve) => {
    child.on('exit', (code) => resolve(code ?? 1));
  });
}

async function main() {
  const cmdArgs = parseArgs(process.argv.slice(2));
  if (!cmdArgs) {
    console.error('Usage: node scripts/run-with-xvfb.cjs -- <command> [args...]');
    process.exit(2);
  }

  if (hasUsableDisplay(process.env)) {
    process.exit(await runChild(cmdArgs, process.env));
  }

  const display = ':99';
  const xvfbEnv = { ...process.env, DISPLAY: display };

  if (process.env.DISPLAY && process.env.DISPLAY.trim().length > 0) {
    console.warn(
      `[run-with-xvfb] DISPLAY is set to "${process.env.DISPLAY}", but it does not appear usable. Starting Xvfb on ${display}.`
    );
  } else {
    console.log(`[run-with-xvfb] No usable DISPLAY detected. Starting Xvfb on ${display}.`);
  }

  // Prefer Xvfb directly if present (more deterministic than xvfb-run).
  if (which('Xvfb')) {
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
        // Avoid TCP listening; use only local socket.
        '-nolisten',
        'tcp'
      ],
      { stdio: 'inherit' }
    );

    const ok = await waitForDisplay(xvfbEnv);

    if (xvfb.exitCode !== null) {
      console.error('[run-with-xvfb] Xvfb exited immediately and cannot provide a virtual display.');
      process.exit(xvfb.exitCode || 1);
    }

    if (!ok) {
      console.error('[run-with-xvfb] Xvfb started, but $DISPLAY did not become usable in time.');
      try {
        xvfb.kill('SIGTERM');
      } catch {
        // ignore
      }
      process.exit(1);
    }

    const cleanup = () => {
      try {
        xvfb.kill('SIGTERM');
      } catch {
        // ignore
      }
    };

    const code = await runChild(cmdArgs, xvfbEnv);
    cleanup();
    process.exit(code);
  }

  // Fallback to xvfb-run if Xvfb isn't available but wrapper is.
  if (which('xvfb-run')) {
    const xvfbArgs = [
      '-a',
      '--server-num',
      display.replace(':', ''),
      '-s',
      '-screen 0 1920x1080x24 -ac +extension RANDR -nolisten tcp',
      ...cmdArgs
    ];
    const code = await runChild(['xvfb-run', ...xvfbArgs], xvfbEnv);
    process.exit(code);
  }

  console.error('Headed Playwright requires an X server, but no usable $DISPLAY is available.');
  console.error('Also, neither `Xvfb` nor `xvfb-run` was found in this environment.');
  console.error('');
  console.error('Repo guidance: install Xvfb (Debian/Ubuntu):');
  console.error('  sudo apt-get update -y && sudo apt-get install -y xvfb');
  console.error('');
  console.error('Then run headed mode via:');
  console.error('  npm run test:headed');
  process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
