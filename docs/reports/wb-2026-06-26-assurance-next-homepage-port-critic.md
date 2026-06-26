# WB-2026-06-26 Assurance Next Homepage Port — Critic Gate Report

## Status

Resolved

## Work Block

`WB-2026-06-26-assurance-next-homepage-port`

## Role

Critic / Control Tower consolidation

## Scope

Read-only review of the plan and Coder task for the homepage-only Assurance Next.js port.

## Critic review sequence

1. Initial Critic verdict: `SUPPLEMENT`
   - Required stronger dirty-tree isolation.
   - Required route-isolation proof.
   - Required excluding `form.js`.
   - Required deferred link policy.
   - Required dependency/config drift checks.
   - Required `/demo/plomberie` visual smoke.

2. Supplement verification verdict: `SUPPLEMENT`
   - Prior required categories were present.
   - Remaining issue: files created during the first blocked Claude Code attempt needed explicit classification.

3. Final gate verification verdict: `SUPPLEMENT`
   - `assurance-site` assets were correctly classified as in-scope Work Block output.
   - Remaining issue: `.agent/critic-gate.md` needed classification as Control Tower metadata.
   - GPT critic required: `no`.

## Resolution

Control Tower applied all required supplements:

- Added before/after dirty-tree inventory gate.
- Required non-overlapping `showcase/public/demo/assurance-site/**` asset namespace.
- Added static route marker requirement: `data-assurance-route="static-homepage"`.
- Excluded `/home/azur/Projects/assurance/assets/js/form.js` unless escalated.
- Added package/config/dependency drift checks.
- Added browser visual smoke for `/demo/plomberie`.
- Defined deferred internal link behavior for non-home pages.
- Classified `showcase/public/demo/assurance-site/agent/paul-clement.jpg` and `showcase/public/demo/assurance-site/hero/paris-hero.jpg` as in-scope Work Block output.
- Classified `.agent/critic-gate.md` as Control Tower metadata outside Coder scope.

## Gate decision

`APPROVE` after supplement resolution.

## GPT critic decision

`NOT_REQUIRED`

Reason: standard frontend homepage slice; no new security, payment, database, dependency, config, deploy, or architecture domain.

## Approved implementation write-set

- `showcase/app/demo/assurance/**`
- `showcase/components/assurance/**`
- `showcase/public/demo/assurance-site/**`

## Out of Coder scope

- `.agent/critic-gate.md`
- `docs/reports/wb-2026-06-26-assurance-next-homepage-port-critic.md`
- `showcase/demo-kit/sections/AutomationSection.tsx`
- `showcase/demo-kit/sections/FinalCTASection.tsx`
- `showcase/demo-kit/sections/ServiceAreaSection.tsx`
- `showcase/demo-kit/sections/UrgentRequestSection.tsx`
- `showcase/lib/demos.ts`
- `showcase/demos/assurance/**`
- `showcase/public/demo/assurance/**`

## Residual risks

- Static `/demo/assurance` route must be verified to render independently from the existing dynamic demo registry.
- Homepage-only slice intentionally leaves non-home pages for later Work Blocks.
- Existing dirty demo-kit changes remain unresolved and must not be mixed into this implementation.
