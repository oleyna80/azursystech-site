# AzurSysTech

**Domain:** [azursystech.fr](https://azursystech.fr)

## Purpose

Local IT services (informatique de proximité) for individuals and small businesses (TPE) in the Nice + 30 km area. Priority: **get first leads fast**.

## Current Status

🟡 **Bootstrap+** — strategy docs partially filled, and AI agent runtime scaffold is in place (`scripts/ai_agents.py` + `05_ai/`).
Web delivery scaffold is also in place (`web/` + Docker/VPS CI/CD chain).

## Directory Overview

| Folder | Contents |
|---|---|
| `00_strategy/` | Roadmap, positioning, target audience, offer stack, pricing |
| `01_brand/` | Brand pack, homepage copy, Facebook copy, ads, FAQ |
| `02_website/` | Site architecture, wireframes, forms, analytics, legal |
| `03_leads/` | Lead intake, taxonomy, response templates, CRM pipeline |
| `04_facebook/` | Strategy, content plan, groups outreach, reply playbooks |
| `05_ai/` | Content engine, lead agent, prompt libraries, escalation |
| `06_seo/` | Local SEO plan, GBP checklist, reviews, service pages |
| `07_ops/` | KPI framework, task board, launch checklist |
| `.agent/` | Agent roles, rules, workflows, reusable skills |
| `memory_bank/` | Persistent project context for AI handoffs |
| `assets/` | Images, logos, and media assets |
| `docs/` | Project notes, decisions log, backlog |
| `scripts/` | Bootstrap and automation helpers |

## AI Wrapper Quickstart

```bash
./scripts/ai_agents.py list
./scripts/ai_agents.py run --agent lead_router --input-file 05_ai/examples/lead_router_input.json --dry-run
```

For live execution with OpenAI API:

```bash
export OPENAI_API_KEY=your_key
./scripts/ai_agents.py run --agent content_writer --input-file 05_ai/examples/content_writer_input.json
```

## Website Quickstart

```bash
cd web
npm ci
npm run dev
```

Health check endpoint:

```bash
curl -s http://127.0.0.1:3000/health
```

Production/VPS files:
- `Dockerfile`
- `docker-compose.vps.yml`
- `nginx.proxy.conf`
- `.github/workflows/*` (`CI -> Docker Publish -> Deploy to VPS`)

## Agent Ops Bootstrap

- Operational contract: `AGENTS.md`
- Roles and skills: `.agent/ROSTER.md`, `.agent/skills/*`
- Session memory: `memory_bank/context.md`, `memory_bank/progress.md`, `memory_bank/decisions.md`
- Active ticket pointer: `docs/.active_ticket`

## Next Steps

1. Paste roadmap into `00_strategy/roadmap.md`
2. Paste positioning into `00_strategy/positioning.md`
3. Define offer stack in `00_strategy/offer-stack.md`
4. Write homepage copy in `01_brand/homepage-copy.md`
5. Draft Facebook page copy in `01_brand/facebook-page-copy.md`
6. Define lead form fields in `02_website/forms-spec.md`
7. Check `07_ops/task-board.md` for the full Kanban board
