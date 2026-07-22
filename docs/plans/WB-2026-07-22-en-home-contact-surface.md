# Work Block — English Home Contact Surface

## Meta

- **Work Block ID:** WB-2026-07-22-en-home-contact-surface
- **Date:** 2026-07-22
- **Owner:** Owner
- **Execution Mode:** end-to-end autonomous
- **Side-Effect Class:** production-code and local-test
- **DB Action Mode:** none
- **Verification Tier:** standard

## Lifecycle State

- **Current Stage:** Stage 3
- **Stage Execution State:** completed
- **Write Gate:** READY
- **Owner Approval Evidence:** Owner message “подтверждаю” after the proposed order: English form first, delivery diagnostic second; Owner message “коммить и завтра продолжим” authorizes one local scoped closeout commit only
- **Critic Gate:** SUPPLEMENT, adopted
- **Verification Gate:** READY
- **Verification Verdict:** READY
- **Stage 3 Mode:** completed

## Objective

Expose the existing feedback form on the English homepage and make it reachable through the English header and FAQ CTA, with complete English copy and the existing preferred-contact-language choice.

## Expected Final Result

`/en` contains the same established feedback form surface as `/fr` and `/ru`, with English labels and web/application/AI project options. English header and FAQ navigation reach `/en#contact`. No form submission, delivery configuration, API, database, provider behavior, or legacy route is changed.

## Done Criteria

- [x] `/en` renders the shared contact section with complete English copy.
- [x] The section preserves its field names, service values, and explicit `ru`/`fr`/`en` preferred-language options.
- [x] English header and FAQ CTA use the local `#contact` anchor.
- [x] Focused contract tests, typecheck, and desktop/mobile no-submit browser smoke pass.

## Preflight State

- **Git baseline:** dirty; scoped `git diff` identifies an unrelated Local SEO removal in `page.tsx` and the already Owner-requested contact-service cleanup in `home-contact.tsx`.
- **Proceed rule:** the local commit includes the English changes and the prerequisite contact-service cleanup in the same shared component, but must not stage or reformat the unrelated Local SEO or other ambient hunks.
- **Pre-Edit Lifecycle Check:** passed; the four source targets were not added in the last five calendar days.

## Scope

### In Scope

- Render `HomeContactSection` for the established English locale.
- Add English copy to that existing component.
- Add English `Contact` navigation and route the English FAQ CTA to `/en#contact`.
- Add a Node-compatible focused form-copy contract test.

### Out of Scope

- `/api/contact/submit`, `contact-submit`, e-mail/webhook/integration configuration, env/secrets, DB, provider calls, form submission, chat, legacy `/contact` deletion, `web/src/i18n.js`, deploy, and push. One literal local closeout commit is authorized.

## Write-Set

```text
web/src/app/[locale]/page.tsx
web/src/components/sections/home-contact.tsx
web/src/components/sections/home-contact.test.ts
web/src/components/shell/site-header.tsx
.agent/critic-gate.md
.agent/verification-gate.md
.codex/write-gate.md
docs/plans/WB-2026-07-22-en-home-contact-surface.md
docs/tasklist/WB-2026-07-22-en-home-contact-surface.tasklist.md
docs/reports/critic-WB-2026-07-22-en-home-contact-surface.md
docs/reports/WB-2026-07-22-en-home-contact-surface-verification.md
memory_bank/orchestrator-log.md
memory_bank/review-log.md
memory_bank/context.md
memory_bank/progress.md
memory_bank/decisions.md
```

## Navigation and Design Brief

- **Navigation impact:** no routes added or removed; `/en#contact` becomes a real local anchor. No `PROJECT_MAP.md` or `FILE_REGISTRY.yml` update is needed.
- **Visual thesis:** preserve the existing calm, conversion-focused split form; this is localization and discoverability, not a redesign.
- **Content hierarchy:** section rationale and direct channels, then segment, contact details, project type, description, preferred language/urgency, and one CTA.
- **Design dials:** variance 3/10, motion 2/10, density 5/10. No new visual system or animation.

## Risks and Mitigations

| Risk | Mitigation | Stop Condition |
|---|---|---|
| Ambient dirty hunks are overwritten | Target only the EN condition/copy/navigation and inspect scoped diff | Any patch requires replacing unrelated hunks |
| A browser check sends a real request | Do not submit; assert zero contact API requests | Tooling cannot prevent form submission |
| UI READY is mistaken for e-mail readiness | Keep delivery diagnostic as separate follow-up WB | API/config/provider change becomes necessary |

## Subagents and Skills

- **Classification:** Subagent-Required: production UI, 4+ files, independent verification.
- **Topology:** Architecture Analyst completed read-only Stage 0 review; native Critic was blocked by thread limit, so `review-degraded:inline-fallback` was recorded; exactly one Scoped Coder then one read-only Verifier.
- **Skills checked:** current-work-block-gates, frontend-skill, design-direction, webapp-testing, subagent-mission-brief, memory-ops, git-safety, security-pass, impeccable.
- **Skills used:** frontend-skill, design-direction, webapp-testing, subagent-mission-brief, memory-ops.
- **Skipped:** security-pass (no API/config/security change); impeccable (existing system adaptation, not a polish/redesign pass).

## Verification Plan

- **Checks:** focused Vitest contract, `npm run check:types`, scoped diff check, and browser smoke at 1440×900 and 375×812.
- **Browser smoke:** `/en` returns 200; English labels, service options and preferred-language options render; header/FAQ anchors reach the section; segment control works; no console errors, overflow, or `/api/contact/submit` request; do not submit or open external contact links.
- **Isolation:** non-sensitive UI-only scope; required and actual verifier isolation is `same-session-degraded`. Native Verifier is advisory; Control Tower records the formal evidence.

## Rollback

Revert only this Work Block’s additive EN render, copy, header/FAQ anchor, and focused-test hunks; leave pre-existing dirty changes untouched.

## Execution Log

| Stage | Action | Status |
|---|---|---|
| 0 | Scope, dirty tree, lifecycle check, skill routing, and design brief recorded | completed |
| 0.5 | Architecture Analyst completed; native critic unavailable due thread limit; inline fallback critique adopted | completed |
| 1 | Scoped implementation | completed |
| 2 | Read-only verification | completed — advisory native Verifier plus non-sensitive inline formal closeout; ambient Local SEO deletion excluded |
| 3 | SSOT sync and closeout | completed — READY; Owner authorized one literal local commit after final staged checks; no push, form submission, or external request |
