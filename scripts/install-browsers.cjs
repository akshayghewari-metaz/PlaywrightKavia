#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Install Playwright browsers in a way that matches this environment.
 *
 * Problem this solves:
 * - In some environments, PLAYWRIGHT_BROWSERS_PATH is set to "/ms-playwright".
 * - If browsers are not installed at that path, Playwright fails with:
 *     "Executable doesn't exist at /ms-playwright/..."
 *
 * This script installs Chromium to the correct location by respecting
 * PLAYWRIGHT_BROWSERS_PATH (if set) and provides clear guidance otherwise.
 *
 * Usage:
 *   node scripts/install-browsers.cjs
 *   node scripts/install-browsers.cjs --with-deps
 */

const { spawnSync } = require('node:child_process');

function run(cmd, args, env) {
  const res = spawnSync(cmd, args, { stdio: 'inherit', env });
  if (res.status !== 0) process.exit(res.status ?? 1);
}

function main() {
  const withDeps = process.argv.includes('--with-deps');

  const env = { ...process.env };
  const browsersPath = env.PLAYWRIGHT_BROWSERS_PATH;

  if (browsersPath) {
    console.log(`[install-browsers] Using PLAYWRIGHT_BROWSERS_PATH=${browsersPath}`);
  } else {
    console.log(
      '[install-browsers] PLAYWRIGHT_BROWSERS_PATH is not set. Browsers will install to the default cache path.'
    );
    console.log(
      '[install-browsers] If your environment expects /ms-playwright, set PLAYWRIGHT_BROWSERS_PATH=/ms-playwright (see .env.example).'
    );
  }

  // Use the local project-installed Playwright CLI (via npx) for version consistency.
  const args = ['playwright', 'install'];
  if (withDeps) args.push('--with-deps');
  args.push('chromium');

  run('npx', args, env);
}

main();
