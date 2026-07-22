# WB-2026-07-22 — Retire Legacy Information Routes

## Objective

Fully remove root `/about`, `/pricing`, and `/faq`. Each route must return
`404`; no redirect is permitted. The useful pricing and FAQ content already on
the localized homepage remains the sole public surface.

## Owner decision

On 2026-07-22 the Owner explicitly approved deleting these pages because they
confuse models and duplicate content on the homepage. The legacy on-site
hardware positioning in `/about` is intentionally removed, not migrated.

## Boundaries

In scope:

- Delete `web/src/app/about/page.tsx`, `pricing/page.tsx`, and `faq/page.tsx`.
- Remove only those three entries from the sitemap and add explicit negative
  sitemap assertions.
- Change French and Russian footer pricing/FAQ links to the existing localized
  homepage anchors through the current footer localizer.
- Change the thank-you FAQ CTA to `/${locale}#faq`.
- Prove the three root routes and the absent English equivalents return `404`;
  prove the remaining sitemap routes and homepage anchors work.

Out of scope:

- Redirects, replacement standalone pages, custom 404 design, or external SEO
  migration.
- `/home`, `/business`, translations, localized homepage implementation,
  contact/mail/provider/DB behavior, credentials, configuration, deployment,
  staging, commit, and push.
- Historical reports and tasklists, which remain immutable evidence.

## Stage 0 preflight

| Field | Record |
|---|---|
| Work Block type | Production route retirement and internal-link migration |
| Side-effect class | Production code deletion/write; local test runtime only |
| DB action mode | None |
| Hard Stops | No client send, provider, live data, deploy, commit, push, or destructive Git operation. Source-route deletion is explicitly Owner-authorized. |
| Skills routing | checked=current-work-block-gates,webapp-testing,playwright,subagent-mission-brief,memory-ops,git-safety; matched=current-work-block-gates,webapp-testing,playwright,subagent-mission-brief,memory-ops,git-safety; used=current-work-block-gates,webapp-testing,playwright,subagent-mission-brief,memory-ops; skipped=git-safety-no-commit-or-staging |
| Subagent topology | Subagent-Required: seven production source paths and route, sitemap, navigation, test, and browser verification contracts. Native Critic completed. Two Scoped Coder dispatches failed with `thread-limit` from earlier interrupted verifier threads, so a bounded Control Tower inline fallback is used only inside this literal write-set; read-only Verifier still follows. |
| Required verifier isolation | same-session-degraded; Sensitive Domains is `none`. The native Verifier is advisory evidence for this non-sensitive local route retirement. |
| Write gate | READY — Critic `SUPPLEMENT` is adopted in `.agent/critic-gate.md`. |

## Approved implementation write-set

- `web/src/app/about/page.tsx` (delete)
- `web/src/app/pricing/page.tsx` (delete)
- `web/src/app/faq/page.tsx` (delete)
- `web/src/app/sitemap.ts`
- `web/src/app/sitemap.test.ts`
- `web/src/app/thank-you/page.tsx`
- `web/src/components/shell/site-footer.tsx`

Control-layer and evidence paths are listed literally in
`.agent/critic-gate.md`.

## Acceptance criteria

1. The three root route files are absent, with no redirect introduced.
2. `/about`, `/pricing`, `/faq`, `/en/about`, `/en/pricing`, and `/en/faq`
   return `404` locally.
3. Sitemap output does not contain the three retired root URLs, and its test
   has explicit negative assertions for all three.
4. The French and Russian footer render `/fr#pricing`, `/fr#faq`,
   `/ru#pricing`, and `/ru#faq`; the existing English FAQ anchor behavior is
   preserved.
5. The thank-you FAQ CTA stays within its FR/RU locale at `/${locale}#faq`.
6. The shared localized homepage retains `id="pricing"` and `id="faq"`.
7. Focused tests, lint, typecheck, build, diff hygiene, sitemap crash smoke,
   rendered-link/anchor smoke, and dev-log inspection pass. An external-font
   network build failure is BLOCKED evidence, not a pass.

## Stop conditions

- A necessary fix touches a route, translation, provider, configuration, or
  source path outside this write-set.
- Verification requires a client send, live DB action, deployment, or secret.
- A pre-existing dirty change cannot be preserved safely.

## Verifier mission

Act as a read-only Verifier for this Work Block. Inspect only the frozen
approved diff and its contracts. Do not edit, use credentials, submit forms,
contact external systems, deploy, stage, commit, or push. Report `READY`,
`BLOCKED`, or `UNVERIFIED` with evidence for route absence, sitemap exclusion,
localized link targets, anchor existence, checks, and dirty-baseline
containment.
