# Project Context - AzurSysTech

## Что это за проект

AzurSysTech - локальный IT-сервис для `particuliers` и TPE в зоне Nice + 30 km.
Цель запуска: получать первые лиды через понятный сайт, надежный contact flow, SQL-first intake и controlled launch operations.

## Текущее состояние

- Активный тикет: `AZR-003` (`docs/.active_ticket`).
- Текущая фаза: post-launch / go-live hardening + page-by-page QA.
- Production baseline жив:
  - domain: `azursystech.fr`
  - deploy repo: `oleyna80/azursystech-site`
  - VPS app dir: `/home/dmitrii/projects/azursystech-site`
  - deploy path: `CI -> SSH -> git pull -> docker compose up -d --build`
  - health endpoint: `https://azursystech.fr/health`
- Current website/design/runtime baseline: `web`.
- Historical/reference only: `frontend_mvp`.
- Public MVP language: Russian for the russophone audience on the Cote d'Azur.
- Approved visual direction: `Local Professional`.

## Текущий этап AZR-003

Launch-critical path is closed:

- `AZR-003-001` legal identity and business data - done
- `AZR-003-006` GBP and review readiness - done
- `AZR-003-007` go / no-go review - done
- `AZR-003-012` frontend baseline parity / migration closure - done
- `AZR-003-013` public phone / WhatsApp consistency - done
- `AZR-003-014` SQL-first intake runtime proof - done
- `AZR-003-011` AI widget live integration + Telegram notification baseline - done
- `/ai-automation` service/pillar page and `/brief` discovery flow are implemented in `web`

Remaining AZR-003 queue:

1. Page-by-page QA and cleanup of current public website.
2. `AZR-003-008`: separate deferred improvements from launch-ready baseline.
3. CRM / HubSpot phase remains deferred until launch intake is stable.

## Intake / Runtime Baseline

- Primary intake architecture: `web backend -> PostgreSQL`.
- `INTAKE_STORAGE_MODE` supports:
  - `legacy`
  - `dual`
  - `sql_primary`
- Current accepted baseline: SQL-first / `sql_primary`.
- `n8n` and Google Sheets are historical launch evidence and optional secondary automation/export layers, not the primary system of record.
- `/api/contact/submit` is the main contact intake endpoint.
- `/api/brief/submit` returns structured `brief.v1` discovery payload for human review; durable SQL persistence for brief submissions is future backend scope.
- Telegram lead notifications are optional and non-blocking for SQL-primary intake success.
- Chat live mode is gated by `AI_LAUNCH_MODE=limited_live_intake` and explicit safety flags.

## Public Website Scope

Current public routes in `web`:

- `/`
- `/business`
- `/services`
- `/ai-automation`
- `/brief`
- `/contact`
- `/about`
- `/faq`
- `/pricing`
- `/services/new-pc-setup`
- `/services/wifi-printer`
- `/services/tpe-setup`
- `/services/onsite-support`
- `/legal`
- `/privacy`
- `/terms`
- `/thank-you`
- `/home` exists and should be checked as potential legacy/alias route

API/runtime routes:

- `/health`
- `/api/contact/submit`
- `/api/brief/submit`
- `/api/chat`

## Текущий рабочий режим

- Primary role: `Tech Lead / Control Tower / Orchestrator`.
- Execution model: approved work blocks with internal stages.
- Stage roles:
  - `Reviewer`: read-only analysis, risks, AC, plan, verdict.
  - `Coder`: scoped implementation only.
  - `Verifier`: checks against goals, no code changes.
- Every stage should state:
  - `stage`
  - `objective`
  - `role`
  - `expected result`
- Inside an approved work block, Control Tower may proceed between internal stages if objective/scope do not change and no dangerous action is required.
- New confirmation is required for scope changes, deploy/infra, secrets, production data, destructive actions, real client communication, or materially new work packages.
- `RooCode` is retained only as a fallback external coder stream if explicitly chosen.

## Что уже сделано

- Website scope closure completed:
  - `/about`
  - four SEO service pages
  - legal/privacy readiness
- `frontend_mvp -> web` migration closed:
  - `web` is current baseline
  - `frontend_mvp` retained only as historical/reference
- SQL-first intake confirmed on VPS:
  - self-hosted PostgreSQL in Docker Compose
  - schema applied
  - controlled submit verified in `intake_leads` + `intake_lead_events`
  - backup/restore scripts and runbook verified
- Contact consistency closed:
  - current public phone / WhatsApp: `+33 7 80 72 09 94`
- AI runtime hardening accepted:
  - no autonomous outbound
  - no pricing commitments
  - no scheduling promises
  - chat has policy gate and safe fallback
- `/ai-automation` implemented:
  - pillar/service page for AI automation
  - realistic positioning for AI agents, intake, qualification, repeatable workflows
  - links to `/brief`, `/contact`, `/business`, legal/privacy context
- `/brief` implemented:
  - Russian five-step discovery form
  - shared schema/validation/payload builder
  - inline `?` hints only on fields that actually need clarification
  - dedicated `POST /api/brief/submit`
- README hierarchy synced:
  - root `README.md` as project map
  - `web/README.md` as web-specific instructions
  - `.agent/README.md` as agent workflow map

## Page-by-Page QA Plan

Core conversion path first:

1. `/`
2. `/ai-automation`
3. `/brief`
4. `/contact`

Then:

5. `/business`
6. `/services`
7. service pages
8. `/about`, `/faq`, `/pricing`
9. legal / utility pages
10. API/runtime smoke checks

For each page, check:

- purpose and source of truth
- visible copy and positioning
- contact values and CTA targets
- header/footer navigation
- mobile layout at narrow widths
- desktop layout
- SEO basics: title, description, one H1, H2 structure
- forms/interactions where applicable
- verdict: `pass`, `needs fix`, or `defer`

Current page-QA notes:

- `/ai-automation`: near-final service/pillar page; main CTA leads to `/brief`.
- `/brief`: helper sidebar removed; inline field hints are current baseline.
- `/contact` and `/business`: routes still exist, but current public conversion/navigation leans on homepage anchors `/#contact` and `/#business` until those pages are re-reviewed.

## Важные операционные факты

- Do not return to GHCR path as launch baseline without a new decision.
- Do not weaken AI runtime policy:
  - no autonomous outbound sending
  - no pricing commitments
  - no scheduling promises
- Do not treat `n8n` / Google Sheets as primary intake storage.
- Do not use or expose real secrets in repo artifacts.
- `azursystech-site` placeholder history is preserved in branch `placeholder-backup`.

**Last update:** 2026-04-21
