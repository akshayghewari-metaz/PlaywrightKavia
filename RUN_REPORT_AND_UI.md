# Playwright report + UI mode (local/proxied URLs)

This repository uses Playwright `1.60.0`.

## HTML Report server

Working command:

```bash
npx playwright show-report --host 0.0.0.0 --port 9324 playwright-report
```

- Listens inside container: `http://0.0.0.0:9324`
- Open in browser (proxied): `<session-base-url>/proxy/9324/`

Note: avoid `npx playwright show-report` without `--port` in this environment; it defaults to port 9323 and can error with `EADDRINUSE`.

## Playwright UI mode

Working command:

```bash
npx playwright test --ui --ui-host 0.0.0.0 --ui-port 9325
```

- Listens inside container: `http://0.0.0.0:9325`
- Open in browser (proxied): `http://localhost:9325`
