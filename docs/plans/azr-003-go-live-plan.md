# PLAN: AZR-003 Go-Live Plan

Status: HISTORICAL PLAN COMPLETED

## Current Status Note

The launch-critical go-live path described in this plan is complete.

Current project phase has moved to:
- post-launch / go-live hardening;
- page-by-page QA and cleanup of the current public website;
- deferred-work separation under `AZR-003-008`.

Use this file as the historical launch plan and closure reference.
For current execution priority, rely on:
- `docs/tasklist/azr-003-tasklist.md`
- `memory_bank/context.md`
- `memory_bank/progress.md`

## Objective

Move AzurSysTech from implementation-ready to launch-ready by closing only the blockers that are mandatory for first live operation.

## Recommended Execution Order

1. Legal baseline
2. Contact baseline
3. Deploy baseline
4. AI baseline decision
5. GBP / review / local presence readiness
6. Go / No-Go review

## Phase 1: Legal Readiness

### Scope
- replace legal and business placeholders with real values
- confirm business identity details
- confirm hosting identity details
- ensure legal pages are publishable

### Main references
- `02_website/legal-pages.md`
- `07_ops/launch-checklist.md`

### Deliverable
- legal and business identity data is launch-ready and no public placeholder remains

## Phase 2: Contact Readiness

### Scope
- decide launch contact model
- reflect that model in website structure and form expectations
- align Facebook / GBP / website contact logic

### Main references
- `02_website/site-architecture.md`
- `02_website/forms-spec.md`
- `01_brand/homepage-copy.md`
- `04_facebook/facebook-page-copy.md`
- `06_seo/gbp-setup-checklist.md`

### Deliverable
- one consistent launch contact flow across public channels

## Phase 3: Deployment Readiness

### Scope
- populate deploy secrets
- populate VPS `.env`
- verify image repository values
- verify deploy path and health checks

### Main references
- `.env.vps.example`
- `docs/deployment/github-vps.md`
- `docs/deployment/backup-restore-runbook.md`
- `07_ops/launch-checklist.md`

### Deliverable
- deploy path is operational and can be used for live release

## Phase 4: AI Runtime Readiness

### Scope
- implement the confirmed launch AI mode
- keep live usage limited to intake + summary + handoff
- no autonomous outbound sending
- no pricing commitments
- no scheduling promises

### Main references
- `05_ai/README.md`
- `05_ai/approval-workflow.md`
- `05_ai/escalation-rules.md`
- `AGENTS.md`

### Deliverable
- AI launch mode is explicit and no runtime ambiguity remains

## Phase 5: GBP / Review / Local Presence Readiness

### Scope
- confirm GBP baseline setup requirements
- confirm review request workflow is usable
- confirm local presence flow is aligned with contact and launch model

### Main references
- `06_seo/gbp-setup-checklist.md`
- `06_seo/reviews-system.md`
- `06_seo/local-seo-plan.md`
- `07_ops/launch-checklist.md`

### Deliverable
- local presence layer is usable at launch and not disconnected from the site

## Phase 6: Go / No-Go Review

### Scope
- review all blocker states
- confirm owner per area
- separate unresolved blockers from deferred improvements

### Deliverable
- explicit go / no-go decision package

## Validation Plan

- manual review against `AZR-003` spec AC1-AC5
- verify no launch blocker is still categorized as deferred
- verify no deferred item is treated as a launch blocker
- re-check `07_ops/launch-checklist.md` against resolved blocker set

## Rollback / Safety

- if legal or contact readiness is incomplete, do not launch
- if deploy path is not verified, do not treat staging completion as production readiness
- if AI live intake creates risk in practice, fall back to `manual-assisted only`

## Execution Checklist

- [x] Phase 1: Legal readiness closed
- [x] Phase 2: Contact readiness closed
- [x] Phase 3: Deployment readiness closed
- [x] Phase 4: AI runtime readiness closed
- [x] Phase 5: GBP / review / local presence readiness closed
- [x] Phase 6: Go / No-Go decision prepared
