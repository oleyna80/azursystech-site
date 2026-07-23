# WB-2026-07-22 — Remove the Legacy `/contact` Route

## Objective

Remove the obsolete standalone `/contact` page. The URL must return `404`;
there is no redirect. Move every active internal entry point and generated
contact URL to the current homepage form: `/fr#contact` or `/ru#contact`.

## Owner decision

On 2026-07-22 the Owner explicitly chose a complete removal: `/contact` must
return `404`; preserving legacy users or external links is not required.

## Boundaries

In scope:

- Delete the route and its route-only client component.
- Remove `/contact` from the sitemap and sitemap expectation.
- Replace public links, fallback copy, JSON-LD service URLs, chat handoff
  prompts, and repository route documentation that point to `/contact`.
- Send locale-aware FR/RU routes to `/{locale}#contact`; where locale is not
  available, use `/fr#contact`. English has no homepage contact anchor, so it
  must not receive `/en#contact`. Root-relative `/#contact` is prohibited:
  the root redirect discards that fragment.
- Verify `/contact` is `404`, contact sections work for French and Russian,
  and no executable web source or current route documentation retains the
  legacy URL.

Out of scope:

- A redirect, custom 404 design, or any SEO migration of external links.
- Contact delivery, mail, database, provider configuration, credentials,
  deployment, client sends, staging, commit, or push.
- A broader rewrite of legacy page copy or the AI assistant's service
  positioning; those need a separate positioning Work Block.

## Stage 0 preflight

| Field | Record |
|---|---|
| Work Block type | Production route retirement and internal-link migration |
| Side-effect class | Production code deletion/write; local test runtime only |
| DB action mode | None |
| Hard Stops | No runtime, live-data, provider, client-facing, deploy, commit, push, or destructive repository operation. Source-route deletion is explicitly approved by the Owner. |
| Skills routing | checked=current-work-block-gates,webapp-testing,subagent-mission-brief,git-safety; matched=current-work-block-gates,webapp-testing,subagent-mission-brief; used=current-work-block-gates,webapp-testing,subagent-mission-brief; skipped=git-safety-no-commit-or-staging |
| Subagent topology | Subagent-Required: production route retirement spans source, SEO/sitemap, public chat handoff, tests, and documentation. Read-only Reviewer and Critic precede one Scoped Coder; read-only Verifier follows. |
| Required verifier isolation | independent-readonly-root for formal closure because the scope includes production route and public chat-handoff code; same-session verifier evidence is advisory. |
| Write gate | PLANNED — becomes READY only after the native Critic accepts this exact write-set. |

## Approved implementation write-set

- `web/src/app/contact/page.tsx` (delete)
- `web/src/components/contact/contact-page-client.tsx` (delete)
- `web/src/app/sitemap.ts`
- `web/src/app/sitemap.test.ts`
- `web/src/ChatWidget.jsx`
- `web/src/components/chat-widget-shell.tsx`
- `web/src/components/brief/brief-form.tsx`
- `web/src/components/shell/site-footer.tsx`
- `web/src/app/about/page.tsx`
- `web/src/app/business/page.tsx`
- `web/src/app/faq/page.tsx`
- `web/src/app/home/page.tsx`
- `web/src/app/pricing/page.tsx`
- `web/src/app/brief/page.tsx`
- `web/src/app/thank-you/page.tsx`
- `web/src/app/ai-automation/page.tsx`
- `web/src/app/[locale]/ai-automation/page.tsx`
- `web/src/app/[locale]/ai-automation/page.test.ts`
- `web/src/lib/contact-submit.ts`
- `web/src/lib/contact-submit.test.ts`
- `web/src/lib/web-chat/llm.ts`
- `web/src/lib/web-chat/llm.test.ts`
- `README.md`
- `web/README.md`

Control-layer and evidence write-set:

- `.agent/critic-gate.md`
- `.agent/verification-gate.md`
- `.codex/write-gate.md`
- `docs/plans/WB-2026-07-22-remove-legacy-contact-route.md`
- `docs/tasklist/WB-2026-07-22-remove-legacy-contact-route.tasklist.md`
- `docs/reports/WB-2026-07-22-remove-legacy-contact-route-critic.md`
- `docs/reports/WB-2026-07-22-remove-legacy-contact-route-verification.md`

## Acceptance criteria

1. `web/src/app/contact/page.tsx` and its route-only client component no
   longer exist.
2. A local production-equivalent route smoke returns `404` for `/contact`.
3. Sitemap output and its test do not contain `/contact`.
4. Active FR/RU links land on an existing `#contact` section; English keeps
   its deliberate WhatsApp/no-contact behavior.
5. Current executable source, current tests, and current route documentation
   have no stale standalone `/contact` URL. API paths such as
   `/api/contact/submit` are excluded from this rule.
6. Targeted tests, lint, typecheck, build, and browser/crash smoke pass without
   submitting the form or contacting external systems.

## Stop conditions

- A required link migration needs a new route, redirect, design change, or
  external/provider action.
- The deletion exposes an import outside this approved write-set.
- Verification needs a client send, live DB action, deployment, or secret.

## Independent verifier mission

Act as a read-only Verifier for this Work Block. Inspect the current frozen
working tree against the objective and approved write-set above. Do not edit
files, start a server, submit a form, use credentials, contact external
systems, stage, commit, or push. Report only an evidence-backed verdict:
`READY`, `BLOCKED`, or `UNVERIFIED`.

Verify in particular that the former standalone route is absent, `/contact`
has no redirect in source, active FR/RU links use valid homepage contact
anchors, English has no `/en#contact` link, sitemap/tests/documentation no
longer list the route, and the implementation is maintainable. Treat API
paths such as `/api/contact/submit` as valid and out of scope for removal.
List the inspected files and commands. If a runtime claim cannot be proved in
the readonly environment, state that explicitly rather than guessing.
