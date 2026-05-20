# AzurSysTech Web

This directory contains the production website for AzurSysTech.

## Stack

- Next.js `16.2.6`
- React `19.2.3`
- TypeScript
- Tailwind CSS
- PostgreSQL client via `pg`
- Docker standalone build for VPS deployment

## Local Development

```bash
npm ci
npm run dev
```

Open `http://localhost:3000`.

## Checks

Run before committing frontend/runtime changes:

```bash
npm run lint
npm run check:types
npm run build
```

Full CI-style check:

```bash
npm run check:ci
```

`check:ci` includes `npm audit --omit=dev --audit-level=high`, which requires npm registry access.

## Important Routes

| Route | Purpose |
| --- | --- |
| `/` | Homepage |
| `/contact` | Main contact/intake form |
| `/ai-automation` | AI automation service/pillar page |
| `/brief` | AI automation discovery brief |
| `/api/contact/submit` | Contact/intake submit endpoint |
| `/api/brief/submit` | Brief submit endpoint |
| `/api/chat` | Website chat API |
| `/health` | Runtime health check |

## Runtime Notes

- Contact intake storage mode is controlled by `INTAKE_STORAGE_MODE`.
- SQL-primary intake requires `DATABASE_URL`.
- Chat live mode is gated by `AI_LAUNCH_MODE` and safety flags.
- Telegram lead notifications are optional and controlled by `AZURSYSTECH_TELEGRAM_*` variables.
- Real production values must not be committed.

Use `.env.vps.example` at the repository root as the public runtime template.

## VPS / Docker

The VPS build uses the repository-root files:

- `Dockerfile`
- `docker-compose.vps.yml`
- `nginx.proxy.conf`
