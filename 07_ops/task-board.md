# Task Board — AzurSysTech

## Current Phase

- `site closure + go-live preparation`
- active ticket target: `AZR-003 go-live readiness`
- previous ticket `AZR-002 website MVP implementation` — **closed** (25/25 tasks done)

## Now

- fully close the website scope before new integrations
- keep remaining AZR-003 blockers visible (legal identity, GBP readiness)
- prepare the next downstream step as `site -> n8n -> Google Sheets`

## Next

- implement `/about` trust/founder page
- implement SEO service landing pages: `/services/new-pc-setup`, `/services/wifi-printer`, `/services/tpe-setup`, `/services/onsite-support`
- prepare legal/privacy pages for real data injection when founder closes `AZR-003-001`
- enable live intake path `site -> n8n -> Google Sheets`
- add AI widget live integration and Telegram notification after the intake path is stable

## Blocked

- public legal publishability depends on founder closing `AZR-003-001` (legal identity data)
- GBP / reviews readiness open under `AZR-003-006` (founder)
- end-to-end lead intake blocked until VPS/n8n stream configures webhook + Google Sheets write target
- go/no-go review (`AZR-003-007`) depends on AZR-003-001 + AZR-003-006

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
- launch intake baseline reset to `Google Sheets via n8n`; CRM deferred to a later phase (ADR-018)
