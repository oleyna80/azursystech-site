# Critic Gate — active Work Block. OWNED BY CONTROL TOWER — subagents must not edit this file.

Status: READY
Work Block: WB-2026-07-22-retire-legacy-home-business-routes
Verification Tier: standard
New Domain: false
Subagent Topology Status: PLANNED
Critic Verdict: SUPPLEMENT
Critic Supplement: adopted
Critic Report: docs/reports/WB-2026-07-22-retire-legacy-home-business-routes-critic.md
GPT Critic Status: NOT_REQUIRED
GPT Critic Reason: Route-retirement Critic supplement is adopted; no second runtime is needed
No-Skip: false
Owner Authorization: 2026-07-22 — Owner instructed removal of /home and /business, then approved a local scoped commit series. Push remains excluded.
Skills Routing: checked=current-work-block-gates,webapp-testing,playwright,subagent-mission-brief,memory-ops,git-safety; matched=current-work-block-gates,webapp-testing,playwright,subagent-mission-brief,memory-ops,git-safety; used=current-work-block-gates,playwright,subagent-mission-brief,memory-ops,git-safety; skipped=webapp-testing-skill-file-unavailable
Session: any
Expires: 2026-07-29

Approved Write-Set:
- .agent/critic-gate.md
- .agent/verification-gate.md
- .codex/write-gate.md
- docs/plans/WB-2026-07-22-retire-legacy-home-business-routes.md
- docs/tasklist/WB-2026-07-22-retire-legacy-home-business-routes.tasklist.md
- docs/reports/WB-2026-07-22-retire-legacy-home-business-routes-critic.md
- docs/reports/WB-2026-07-22-retire-legacy-home-business-routes-verification.md
- memory_bank/orchestrator-log.md
- memory_bank/review-log.md
- memory_bank/context.md
- memory_bank/progress.md
- web/src/app/home/page.tsx
- web/src/app/business/page.tsx
- web/src/app/sitemap.ts
- web/src/app/sitemap.test.ts
- web/src/app/thank-you/page.tsx

Stage 0 preflight: Work Block type=production route retirement and CTA repair; side-effect class=production code deletion/write and local browser runtime plus an Owner-authorized local commit; DB action mode=none; Hard Stops=none; Subagent topology=Subagent-Required because five production source paths, public routes, sitemap/navigation, and verification are in scope. Native Critic SUPPLEMENT adopted; Scoped Coder dispatch is blocked by thread limit, so the Control Tower applies the narrow `review-degraded:inline-fallback` with the same literal route whitelist. Write gate=READY. Scope is only deleting /home and /business, their sitemap/test entries, and the thank-you Business CTA to existing /brief, then committing that closed scope locally. Existing dirty hunks remain outside scope; no contact route, EN route, form, provider, config, deploy, or push action is authorized.
