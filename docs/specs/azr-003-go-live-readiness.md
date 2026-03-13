# SPEC: AZR-003 Go-Live Readiness

## Problem
`AZR-002` переводит проект в фазу реализации, но этого недостаточно для запуска.

На текущем этапе проект находится в состоянии:
- implementation-ready
- but not launch-ready

Основной риск: команда может смешать обязательные launch blockers с желательными улучшениями после запуска.

## Goal
Подготовить go-live readiness package для AzurSysTech, чтобы команда понимала:
- что обязательно закрыть до запуска;
- кто владелец каждого блокера;
- какие решения нужны до `go`;
- что можно сознательно отложить на post-launch.

## Launch Blockers

### 1. Legal readiness
Must be finalized before launch:
- legal identity / business data
- business status
- SIREN / SIRET if applicable at launch
- professional address
- contact email
- hosting identity data

### 2. Contact readiness
Must be finalized before launch:
- phone yes/no for launch
- WhatsApp yes/no for launch
- final public contact flow
- consistent contact CTA across site, Facebook, and GBP

### 3. Deployment readiness
Must be finalized before launch:
- GitHub secrets
- VPS runtime `.env`
- image repository values
- production deploy path verification

### 4. AI runtime readiness
Must be finalized before launch:
- launch decision:
  - `manual-assisted only`
  - or `live now`
- if live:
  - `DEEPSEEK_API_KEY`
  - runtime invocation policy
  - operator approval boundaries

### 5. GBP / review / local presence readiness
Must be finalized before launch:
- GBP setup baseline complete
- review request workflow usable in practice
- site and GBP contact logic aligned

## Cannot Launch Until

1. Legal/business identity placeholders are replaced with real data.
2. Hosting data is filled where required.
3. Contact flow is explicitly chosen and reflected in public-facing assets.
4. Deploy secrets and VPS runtime config are populated and verified.
5. AI launch mode is explicitly chosen.
6. GBP and review workflow are operationally usable.

## Source of Truth For Go-Live

- `AGENTS.md`
- `memory_bank/context.md`
- `memory_bank/progress.md`
- `memory_bank/decisions.md`
- `07_ops/launch-checklist.md`
- `02_website/legal-pages.md`
- `02_website/site-architecture.md`
- `02_website/forms-spec.md`
- `06_seo/gbp-setup-checklist.md`
- `06_seo/reviews-system.md`
- `.env.vps.example`
- `docs/deployment/github-vps.md`
- `05_ai/README.md`

## In Scope

1. Legal readiness
2. Contact readiness
3. Deployment readiness
4. AI runtime readiness
5. GBP / review / local presence readiness
6. Go / No-Go criteria definition

## Out of Scope

- major website redesign
- new content blocks not required for launch
- additional service pages beyond MVP
- multilingual expansion
- advanced AI automation beyond launch mode decision
- secondary SEO improvements not required for first live state

## Open Decisions

1. Legal entity launch state
- publish with finalized business identity now
- or delay public launch until business identity is fully confirmed

2. Operational lead board at launch
- Google Sheets fallback
- lightweight CRM board

## Confirmed Launch Decisions

- public WhatsApp is enabled on the same launch number:
  - `+33 7 49 70 54 65`
- AI launch mode:
  - `limited live intake`
  - intake + summary + handoff only
  - no autonomous outbound sending
  - no pricing commitments
  - no scheduling promises

## Recommended Launch Defaults

Unless explicitly overridden before launch:

- contact mode default:
  - `form + phone + WhatsApp + site chat`
- AI mode default:
  - `limited live intake`
  - intake + summary + handoff only
  - no autonomous outbound sending
  - no pricing commitments
  - no scheduling promises
- ops mode default:
  - website live
  - form live
  - CRM / Sheets live
  - Facebook manual ops live
  - GBP live

## Go / No-Go Criteria

### Go
- all launch blockers resolved
- launch checklist is materially complete
- owner is assigned for post-launch monitoring

### No-Go
- any legal identity placeholder remains public
- contact path is ambiguous
- deploy path is unverified
- AI mode is undefined but runtime is assumed in launch ops
- GBP / review path is not aligned with site and contact flow

## Post-Launch Deferred Items

These items must stay out of launch-blocker scope:
- localization rollout
- local citations expansion
- extended service page set
- deeper analytics refinement
- advanced CRM automation
- broader AI-assisted workflows
- cleanup of non-critical stale tails in legacy docs

## Acceptance Criteria

- AC1: Launch blockers are explicitly separated from post-launch improvements.
- AC2: `cannot launch until` conditions are concrete and enforceable.
- AC3: Each blocker area has a defined owner category and execution path.
- AC4: Go / No-Go criteria are clear enough for founder + Tech Lead decision-making.
- AC5: `AZR-003` can be executed without reopening implementation-scope debates from `AZR-002`.

## Risks

- If launch blockers are treated as "nice to have", the project may go live in a legally or operationally weak state.
- If post-launch improvements are mixed into go-live scope, launch will slip unnecessarily.
- If AI mode is not decided explicitly, the ops model at launch will stay ambiguous.
