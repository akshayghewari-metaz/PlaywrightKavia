#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Serve the Playwright HTML report in a container/CI environment.
 *
 * Why this exists:
 * - Users sometimes try to open the HTML report server at `0.0.0.0:<port>` and get ECONNREFUSED.
 * - `0.0.0.0` is a bind address (server listens on all interfaces), not a client address to browse to.
 * - In containerized environments, you usually must bind the server to `0.0.0.0` to make it reachable,
 *   but you must browse to a *real* host (e.g., 127.0.0.1, localhost, or the environment-provided URL).
 *
 * Usage:
 *   node scripts/show-report.cjs
 *   node scripts/show-report.cjs --port 9323
 *   node scripts/show-report.cjs --host 0.0.0.0 --port 9323
 */

const { spawn } = require('node:child_process');

function parseArgs(argv) {
  const out = { host: '0.0.0.0', port: '9323' };

  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];

    if (a === '--host') {
      out.host = argv[i + 1];
      i += 1;
      continue;
    }

    if (a === '--port') {
      out.port = argv[i + 1];
      i += 1;
      continue;
    }

    if (a === '-h' || a === '--help') {
      out.help = true;
      continue;
    }
  }

  return out;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help) {
    console.log('Usage: node scripts/show-report.cjs [--host <host>] [--port <port>]');
    console.log('');
    console.log('Defaults: --host 0.0.0.0 --port 9323');
    process.exit(0);
  }

  if (!args.port || Number.isNaN(Number(args.port))) {
    console.error(`[show-report] Invalid --port value: ${args.port}`);
    process.exit(2);
  }

  // Note: The report directory is the Playwright default.
  // If it doesn't exist, Playwright will error; that is OK (user needs to run tests first).
  const cmd = 'npx';
  const cmdArgs = [
    'playwright',
    'show-report',
    'playwright-report',
    '--host',
    args.host,
    '--port',
    String(args.port),
  ];

  console.log(`[show-report] Starting Playwright report server on ${args.host}:${args.port}`);
  console.log('');
  console.log('[show-report] IMPORTANT: Do NOT browse to http://0.0.0.0:<port>');
  console.log(`[show-report] Browse to: http://127.0.0.1:${args.port}  (local)`);
  console.log('[show-report] Or use your environment/preview URL pointing to this container and port.');
  console.log('');

  const child = spawn(cmd, cmdArgs, { stdio: 'inherit' });
  child.on('exit', (code) => process.exit(code ?? 1));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
