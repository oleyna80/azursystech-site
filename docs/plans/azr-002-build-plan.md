# PLAN: AZR-002 Build Plan

## Objective

Turn the existing MVP documentation set into a concrete implementation sequence for Tech Lead execution.

## Phase 1: Website Shell + Core Pages

### Scope
- establish route structure from `02_website/site-architecture.md`
- implement layout and navigation shell
- implement homepage and core page placeholders/content slots
- implement legal/privacy route skeletons
- align page structure with `02_website/wireframes.md`

### Main references
- `02_website/site-architecture.md`
- `02_website/wireframes.md`
- `01_brand/homepage-copy.md`
- `01_brand/faq.md`
- `00_strategy/positioning.md`
- `01_brand/brand-pack.md`

### Deliverable
- browsable MVP website shell with core route map and content-ready structure

## Phase 2: Form + CRM / Sheets

### Scope
- implement lead form fields and validations
- map form output to taxonomy and intake model
- define payload for CRM / Google Sheets fallback
- align analytics events with lead flow

### Main references
- `02_website/forms-spec.md`
- `02_website/analytics-spec.md`
- `03_leads/lead-intake-spec.md`
- `03_leads/lead-taxonomy.md`
- `03_leads/crm-pipeline.md`

### Deliverable
- working lead capture flow with implementation-ready field mapping and ops handoff compatibility

## Phase 3: Chat Widget + AI Intake

### Scope
- place chat widget area in website shell
- implement manual-assisted intake flow first
- wire `lead_router` runtime for dry-run and structured artifacts
- enforce approval / escalation boundaries

### Main references
- `05_ai/lead-agent-spec.md`
- `05_ai/approval-workflow.md`
- `05_ai/escalation-rules.md`
- `05_ai/prompt-library-support.md`
- `05_ai/README.md`
- `scripts/ai_agents.py`

### Deliverable
- AI-assisted intake MVP that supports structured lead triage without bypassing human approval

## Phase 4: Facebook / GBP Linkage

### Scope
- align CTA endpoints across website and Facebook docs
- support review and GBP linkage in site UX and ops flow
- ensure group / page / messenger sources map cleanly into analytics and lead intake

### Main references
- `04_facebook/facebook-strategy.md`
- `04_facebook/facebook-content-plan.md`
- `04_facebook/groups-outreach-list.md`
- `04_facebook/comment-reply-playbook.md`
- `04_facebook/dm-reply-playbook.md`
- `06_seo/gbp-setup-checklist.md`
- `06_seo/reviews-system.md`
- `02_website/analytics-spec.md`

### Deliverable
- consistent acquisition linkage between site, Facebook operations, reviews, and GBP

## Phase 5: Deploy + Runtime Hardening

### Scope
- confirm Docker build and VPS compose path
- validate health endpoint and deploy scripts
- document runtime secrets needed for go-live
- keep live AI runtime optional until launch decision is finalized

### Main references
- `docs/deployment/github-vps.md`
- `docs/deployment/backup-restore-runbook.md`
- `Dockerfile`
- `docker-compose.vps.yml`
- `.env.vps.example`
- `05_ai/README.md`

### Deliverable
- deployable MVP runtime with clear separation between implementation-complete and go-live-ready

## Validation Plan

- Manual validation against `AZR-002` spec AC1-AC5
- `python3 -m py_compile scripts/ai_agents.py`
- `./scripts/ai_agents.py list`
- website validation to be re-run in a clean Linux Node environment

## Rollback / Safety

- do not treat unresolved legal/contact/secret placeholders as implementation failures
- keep AI live-run optional until founder decision is explicit
- prefer manual-assisted ops over speculative automation in phase 1 implementation

## Execution Checklist

- [ ] Phase 1: Website shell + core pages scoped
- [ ] Phase 2: Form + CRM / Sheets scoped
- [ ] Phase 3: Chat widget + AI intake scoped
- [ ] Phase 4: Facebook / GBP linkage scoped
- [ ] Phase 5: Deploy + runtime hardening scoped
- [ ] Launch blockers separated from build scope
