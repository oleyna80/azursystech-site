# Task Board — AzurSysTech

## Current Phase

- `post-launch / go-live hardening + page-by-page QA`
- active ticket target: `AZR-003 go-live readiness / post-launch QA`
- previous ticket `AZR-002 website MVP implementation` — **closed** (25/25 tasks done)
- launch-critical `AZR-003` path is closed; current work is QA cleanup and deferred-improvement separation
- current website/design/runtime baseline: `web`
- `frontend_mvp` is historical/reference only after design transfer to `web`

## Now

- keep `web` as the canonical launch website baseline
- prepare a clean release decision for the current local changes:
  - publishable AZR-003 docs/QA sync and lint fixes are one scope
  - AZR-004 social automation / VPS / schema changes are a separate scope
- continue page-by-page QA after the core conversion path:
  - `/`
  - `/ai-automation`
  - `/brief`
  - `/contact`
- verify that contact/brief paths keep the backend-first SQL intake and manual-review constraints documented in SSOT
- keep launch-safe AI constraints enforced:
  - no autonomous outbound
  - no pricing commitments
  - no scheduling promises

## Next

- continue page-by-page QA after the core path:
  - `/business`
  - `/services` and service detail pages
  - `/about`
  - `/faq`
  - `/pricing`
  - legal and utility pages
- close `AZR-003-008`: separate deferred improvements from launch-ready baseline
- update tasklist and Memory Bank after accepted QA verdicts

## Blocked

- no active launch-critical blocker is recorded in the current SSOT
- deploy now uses WSL-built GHCR images and VPS `docker compose pull`; future deploys still require explicit Owner approval
- do not start new work in `frontend_mvp` unless explicitly opened as a sandbox/reference task
- do not mix the dirty `AZR-004` social automation stream into `AZR-003` page QA

## Later

- French / English localization rollout
- local citations plan
- broader service page expansion beyond MVP SEO set
- CRM implementation and automation
- broader AI runtime automation beyond draft-assist mode
- social automation runtime work continues under separate `AZR-004` stream
- cleanup of non-critical stale tails in legacy docs

## Done

- **AZR-002 website MVP implementation** — all 25 tasks closed:
  - strategy/brand/ops docs baseline filled (`00_strategy` – `07_ops`)
  - app shell, header, footer, nav
  - all Phase 1 routes: `/`, `/services`, `/business`, `/home`, `/pricing`, `/faq`, `/contact`, `/thank-you`, `/legal`, `/privacy`
  - chat widget shell (intake-only, launch-safe)
  - visual consistency pass (`Local Professional`, ADR-015)
  - safe site-side submit path with contract validation and honeypot handling
  - runtime adapter for `v1` transport contract `site → n8n` (ADR-016)
  - historical HubSpot MVP property mapping locked as phase-2 reference (ADR-017)
- AI runtime MVP scaffolded and aligned with DeepSeek contract (ADR-007)
- VPS delivery live with Docker registry-pull deploy; GitHub remains portfolio/source repo, not the production deploy source
- VPS GHCR pull credential rotated to a dedicated classic PAT with `read:packages` only
- deploy assumptions confirmed for `azursystech.fr`
- multi-agent operating model standardized (ADR-012)
- launch contact baseline confirmed (ADR-008): form + phone + WhatsApp + site chat
- launch AI mode confirmed (ADR-010): `limited_live_intake`
- historical launch intake activation `site -> n8n -> Google Sheets` completed (ADR-018)
- current primary intake architecture fixed as backend-first SQL; `n8n` is optional automation/export layer (ADR-020)
- `AZR-003-012` baseline closure: design/template work transferred from `frontend_mvp` to `web`; `web` remains canonical baseline (ADR-019)
- `AZR-003-013` public phone / WhatsApp consistency sync completed; canonical public number is `+33 7 80 72 09 94`
- `AZR-003-014` backend-first SQL intake hardening completed on `web`
- `AZR-003-011` live intake path moved to SQL-primary behavior with optional external integration/notification fallback
- `/ai-automation` and `/brief` are present in `web` as the current AI automation conversion path
- core conversion-path lint blockers cleared for `/`, `/brief`, and shared header; `web` passes `npm run check:ci` with non-blocking image optimization/audit warnings
