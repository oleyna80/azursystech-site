# Task Board — AzurSysTech

## Current Phase

- `post-intake go-live execution`
- active ticket target: `AZR-003 go-live readiness`
- previous ticket `AZR-002 website MVP implementation` — **closed** (25/25 tasks done)
- current website/design/runtime baseline: `web`
- `frontend_mvp` is historical/reference only after design transfer to `web`

## Now

- keep `web` as the canonical launch website baseline
- execute `AZR-003-014` backend-first SQL intake core hardening on `web`
- keep launch-safe AI constraints enforced:
  - no autonomous outbound
  - no pricing commitments
  - no scheduling promises

## Next

- run `AZR-003-013` public phone / WhatsApp consistency sync across `web` and current docs
- complete SQL runtime wiring (`DATABASE_URL`, schema apply, controlled smoke)
- implement live AI widget integration on `web` against backend events path
- verify Telegram notification for new contact/intake events
- after `AZR-003-011`, separate deferred improvements from blockers (`AZR-003-008`)

## Blocked

- P0 consistency risk before deploy verification: public phone / WhatsApp values drift across `web` and docs
- do not start new work in `frontend_mvp` unless explicitly opened as a sandbox/reference task

## Later

- French / English localization rollout
- local citations plan
- broader service page expansion beyond MVP SEO set
- CRM implementation and automation
- broader AI runtime automation beyond draft-assist mode
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
- VPS delivery live with Docker and GitHub Actions
- deploy assumptions confirmed for `azursystech.fr`
- multi-agent operating model standardized (ADR-012)
- launch contact baseline confirmed (ADR-008): form + phone + WhatsApp + site chat
- launch AI mode confirmed (ADR-010): `limited_live_intake`
- historical launch intake activation `site -> n8n -> Google Sheets` completed (ADR-018)
- current primary intake architecture fixed as backend-first SQL; `n8n` is optional automation/export layer (ADR-020)
- `AZR-003-012` baseline closure: design/template work transferred from `frontend_mvp` to `web`; `web` remains canonical baseline (ADR-019)
