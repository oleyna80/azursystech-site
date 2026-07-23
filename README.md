# AzurSysTech

**Domain:** [azursystech.fr](https://azursystech.fr)

AzurSysTech is a local IT services project for small businesses and private clients in the Nice + 30 km area. The current delivery baseline is a production Next.js website on VPS with SQL-first intake, contact/brief flows, and AI automation service content.

## Current Status

- Website runtime: `web/` Next.js app, Docker/VPS deployment.
- Intake baseline: `/api/contact/submit` with SQL-primary storage and optional downstream integrations.
- Current public lead paths: homepage contact forms (`/fr#contact`, `/ru#contact`), `/brief`, chat handoff, phone, WhatsApp.
- AI automation content: `/ai-automation` plus `/brief` discovery flow.

## Repository Overview

| Path | Purpose |
| --- | --- |
| `web/` | Production website application |
| `admin/` | Internal admin application |
| `scripts/` | Build, deploy, backup, and VPS helper scripts |
| `Dockerfile`, `Dockerfile.admin`, `docker-compose*.yml` | Container build and runtime configuration |

## Web Quickstart

```bash
cd web
npm ci
npm run dev
```

Useful checks:

```bash
cd web
npm run lint
npm run check:types
npm run build
```

More web-specific details are in `web/README.md`.

## Deployment Notes

Production/VPS-related files:

- `Dockerfile`
- `docker-compose.vps.yml`
- `nginx.proxy.conf`
- `.env.vps.example`

Real secrets belong only in `.env` or environment-specific secret storage. Do not commit live keys, tokens, or production credentials.
