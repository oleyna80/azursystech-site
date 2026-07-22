# WB-2026-07-22 — Retire Legacy Home and Business Routes

## Objective

Fully remove root `/home` and `/business`. Both URLs must return `404` with no
redirect. Their public content remains available only through the localized
homepage and the existing `/brief` business-intake route.

## Owner decision

On 2026-07-22 the Owner explicitly instructed: “`/home` и `/business`
удаляй”. This authorizes source-route deletion only; it does not authorize
deployment, external calls, staging, commit, or push.

## Stage 0 preflight

| Field | Record |
|---|---|
| Work Block type | Production route retirement and internal-link repair |
| Side-effect class | Production code deletion/write; local test runtime only |
| DB action mode | None |
| Hard Stops | No provider, client send, live data, deploy, staging, commit, push, or destructive Git action. Source-route deletion is explicitly Owner-authorized. |
| Skills routing | checked=current-work-block-gates,webapp-testing,playwright,subagent-mission-brief,memory-ops,git-safety; matched=current-work-block-gates,webapp-testing,playwright,subagent-mission-brief,memory-ops; used=current-work-block-gates,playwright,subagent-mission-brief,memory-ops; skipped=webapp-testing-skill-file-unavailable,git-safety-no-commit-or-staging |
| Subagent topology | Subagent-Required: five production source paths, public routes, sitemap/navigation contract, and independent verification. Native Critic completed. One Scoped Coder, then read-only Verifier. |
| Required verifier isolation | same-session-degraded; Sensitive Domains: none. |
| Write gate | READY — Critic `SUPPLEMENT` is adopted. |

## Approved source write-set

- `web/src/app/home/page.tsx` (delete)
- `web/src/app/business/page.tsx` (delete)
- `web/src/app/sitemap.ts`
- `web/src/app/sitemap.test.ts`
- `web/src/app/thank-you/page.tsx`

Control-Tower evidence paths are listed literally in `.agent/critic-gate.md`.

## Acceptance criteria

1. The `/home` and `/business` route files are absent; both local URLs return
   `404` without redirect.
2. Sitemap output excludes both URLs and has explicit negative test assertions.
3. The thank-you business CTA targets existing `/brief`; no `/business`
   reference remains in `web/src`.
4. Focused sitemap tests, lint, typecheck, build, diff hygiene, all-sitemap
   crash smoke, and browser verification pass.
5. The dirty baseline is preserved: no restore, stage, commit, or unrelated
   edit occurs.

## Boundaries

Out of scope: redirects, replacement routes, custom 404 UI, localized homepage
content or translations, `/services` cleanup, contact/provider/DB behavior,
configuration, deployment, staging, commit, and push.

## Risks and mitigations

| Risk | Mitigation | Stop condition |
|---|---|---|
| Ambient changes overlap all five paths | Freeze baseline and preserve all unrelated hunks | A required fix needs an out-of-scope source path |
| Business CTA becomes dead | Repoint only its existing target to `/brief` | `/brief` is unavailable or its contract changes |
| Sitemap/drift hides retired routes | Explicit negative test plus runtime 404 matrix | Verification needs an external side effect |

## Verification plan

- `npm run test:ci -- src/app/sitemap.test.ts`
- `npm run lint`, `npm run check:types`, `npm run build`, `git diff --check`
- Local smoke: `/home` and `/business` are `404`; remaining sitemap entries
  are `200` or expected `308`; rendered thank-you CTA is `/brief`; browser
  console has no new errors.

## Closeout

Result: CLOSED / READY. The legacy route modules are absent, the sitemap has no
home or business URL, and the former business CTA leads to the existing brief
route. The native Verifier completed source/build checks but its sandbox could
not open localhost sockets. The permitted non-sensitive Control Tower runtime
fallback confirmed the required 404, sitemap, CTA, and browser-console
contracts. No staging, commit, push, deployment, provider, or data action
occurred.
