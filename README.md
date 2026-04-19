# AzurSysTech

**Domain:** [azursystech.fr](https://azursystech.fr)

AzurSysTech is a local IT services project for small businesses and private clients in the Nice + 30 km area. The current delivery baseline is a production Next.js website on VPS with SQL-first intake, contact/brief flows, and a multi-agent project workflow.

## Current Status

- Active ticket: `AZR-003` (`docs/.active_ticket`).
- Current branch baseline: `integration/azr-002-023-handoff`.
- Website runtime: `web/` Next.js app, Docker/VPS deployment.
- Intake baseline: `/api/contact/submit` with SQL-primary storage and optional downstream integrations.
- Current public lead paths: `/contact`, `/brief`, chat handoff, phone, WhatsApp.
- AI automation content: `/ai-automation` plus `/brief` discovery flow.

For the latest delivery state, read:

- `memory_bank/progress.md`
- `memory_bank/context.md`
- `memory_bank/decisions.md`
- `docs/tasklist/azr-003-tasklist.md`

## Directory Overview

| Path | Purpose |
| --- | --- |
| `00_strategy/` | Roadmap, positioning, target audience, offer stack, pricing |
| `01_brand/` | Brand pack, homepage copy, FAQ, marketing copy |
| `02_website/` | Site architecture, page specs, wireframes, forms, legal content |
| `03_leads/` | Lead intake, brief schemas, CRM pipeline, response templates |
| `04_facebook/` | Social/outreach strategy and playbooks |
| `05_ai/` | AI agent specs, prompts, brief assistant rules, run artifacts |
| `06_seo/` | Local SEO plan, GBP checklist, service-page SEO |
| `07_ops/` | KPI framework, task board, launch checklist |
| `.agent/` | Agent rules, roster, workflows, skills |
| `docs/` | Specs, plans, tasklists, deployment notes, reports |
| `memory_bank/` | Persistent project context and decision memory |
| `scripts/` | Automation helpers |
| `web/` | Production website application |

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

## Agent Workflow

Primary operating contract:

- `AGENTS.md`
- `.agent/README.md`
- `.agent/ROSTER.md`
- `.agent/workflows/sdd-protocol.md`
- `.agent/skills/*/SKILL.md`

Before making changes, agents should read `AGENTS.md`, the current Memory Bank files, and the relevant task/spec artifacts.

## Deployment Notes

Production/VPS-related files:

- `Dockerfile`
- `docker-compose.vps.yml`
- `nginx.proxy.conf`
- `.env.vps.example`
- `docs/deployment/`

Real secrets belong only in `.env` or environment-specific secret storage. Do not commit live keys, tokens, or production credentials.
