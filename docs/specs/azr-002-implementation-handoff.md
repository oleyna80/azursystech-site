# SPEC: AZR-002 Implementation Handoff

## Problem
Проект вышел из bootstrap-фазы: контентные и операционные документы по MVP в основном заполнены, но Tech Lead все еще не получил единый implementation handoff для первой очереди сборки.

Без такого handoff-пакета команда рискует:
- строить не по тем source-of-truth документам;
- смешать implementation scope с go-live blockers;
- тратить время на новые маркетинговые документы вместо сборки MVP.

## Goal
Подготовить implementation handoff для первой очереди сборки AzurSysTech, чтобы Tech Lead мог перейти от документации к исполнению.

## Locked MVP Baseline

### Locked business and brand baseline
- `00_strategy/positioning.md`
- `00_strategy/offer-stack.md`
- `00_strategy/target-audience.md`
- `00_strategy/pricing-framework.md`
- `01_brand/brand-pack.md`

### Locked website and lead flow baseline
- `01_brand/homepage-copy.md`
- `01_brand/faq.md`
- `02_website/site-architecture.md`
- `02_website/wireframes.md`
- `02_website/forms-spec.md`
- `02_website/analytics-spec.md`
- `02_website/legal-pages.md`
- `03_leads/lead-intake-spec.md`
- `03_leads/lead-taxonomy.md`
- `03_leads/crm-pipeline.md`
- `03_leads/follow-up-sequences.md`
- `03_leads/response-templates.md`

### Locked channel and SEO baseline
- `04_facebook/facebook-strategy.md`
- `04_facebook/facebook-content-plan.md`
- `04_facebook/groups-outreach-list.md`
- `04_facebook/comment-reply-playbook.md`
- `04_facebook/dm-reply-playbook.md`
- `06_seo/local-seo-plan.md`
- `06_seo/gbp-setup-checklist.md`
- `06_seo/reviews-system.md`
- `06_seo/service-pages-plan.md`

### Locked AI and infra baseline
- `05_ai/content-engine-spec.md`
- `05_ai/lead-agent-spec.md`
- `05_ai/prompt-library-content.md`
- `05_ai/prompt-library-support.md`
- `05_ai/escalation-rules.md`
- `05_ai/approval-workflow.md`
- `05_ai/README.md`
- `scripts/ai_agents.py`
- `docs/deployment/github-vps.md`
- `docs/deployment/backup-restore-runbook.md`

## Source of Truth Rules

1. `AGENTS.md`
2. `memory_bank/context.md`
3. `memory_bank/progress.md`
4. `memory_bank/decisions.md`
5. Relevant implementation docs in `00_strategy` to `06_seo`

If there is a conflict:
- management docs define phase and priority;
- block-level docs define implementation behavior;
- memory bank defines the latest accepted operational decisions.

## In Scope: First Implementation Queue

1. Website shell and core routes
- homepage
- services page
- business page
- home page
- pricing page
- FAQ page
- contact page
- legal/privacy pages

2. Lead capture and intake flow
- core lead form
- validation rules
- analytics events
- CRM / Google Sheets compatible handoff fields

3. AI-assisted intake MVP
- chat entry flow
- lead classification runtime
- structured run artifacts
- approval / escalation guardrails

4. Basic acquisition channel linkage
- website <-> Facebook CTA consistency
- website <-> GBP support
- review workflow compatibility

5. Delivery and runtime
- Dockerized deployment path
- VPS runtime chain
- health checks
- immutable image delivery flow

## Out of Scope

- final legal/business data entry
- final phone / WhatsApp decision
- final deploy secret values
- multilingual rollout
- expanded service page library beyond first wave
- advanced CRM automation
- autonomous AI live operations
- Facebook/GBP publishing execution itself

## Launch Blockers

1. Legal and business identity placeholders are still unresolved.
2. Phone / WhatsApp / contact flow is not finalized.
3. Deploy secrets and VPS `.env` are not populated with production values.
4. AI live-run decision is still open:
   - `manual-assisted only`
   - or `DeepSeek live-run enabled at launch`

## Open Decisions

1. Contact mode at launch
- form-only
- form + phone
- form + WhatsApp
- form + phone + WhatsApp

2. AI mode at launch
- manual-assisted only
- dry-run only
- live DeepSeek intake enabled

3. CRM operating mode at launch
- Google Sheets fallback first
- lightweight CRM board from day one

## Acceptance Criteria

- AC1: Tech Lead can identify the exact source-of-truth documents for MVP implementation.
- AC2: First implementation queue is clearly separated from out-of-scope work.
- AC3: Launch blockers are explicitly listed and not mixed into normal build scope.
- AC4: Open decisions are named clearly enough for founder / Tech Lead resolution.
- AC5: `AZR-002` can be used as the basis for plan + tasklist execution.

## Risks

- If launch blockers are not separated from build scope, implementation may stall on missing business data.
- If source-of-truth priority is ignored, old docs may reintroduce stale assumptions.
- If AI live-run is not explicitly decided, Tech Lead may overbuild or underbuild the runtime path.
