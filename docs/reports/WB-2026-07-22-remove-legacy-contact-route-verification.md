# Verification — WB-2026-07-22 Remove Legacy `/contact` Route

## Formal verdict

`BLOCKED` — the source change and local runtime contract are verified, but a
formal independent readonly verifier did not produce a final verdict and the
production build could not fetch its Google-hosted fonts in this environment.
This is not a claim that the route removal is defective.

## Scope and side effects

- Verified only the owner-approved retirement of the standalone `/contact`
  route and migration of its active internal references.
- No form was submitted. No email, database, provider, credential, deploy,
  staging, commit, or push action occurred.
- Existing unrelated dirty Work Blocks were preserved and not assessed.

## Acceptance evidence

| Check | Result | Evidence |
|---|---|---|
| Route-only source removed | PASS | `web/src/app/contact/page.tsx` and `web/src/components/contact/contact-page-client.tsx` are deleted; source scan found no import of either. |
| `/contact` has no redirect and returns 404 | PASS | Browser navigation to `http://localhost:3000/contact` reported `404 Not Found`; `curl` also returned `404`. |
| Sitemap removal | PASS | `web/src/app/sitemap.ts` has 24 routes and no `/contact`; `src/app/sitemap.test.ts` passed. |
| Sitemap crash smoke | PASS | Every listed sitemap route returned `200` or the expected `308` (`/ai-automation`) on the existing localhost server; `/contact` returned `404`. |
| French/Russian contact anchors | PASS | Browser smoke opened `/fr#contact` and `/ru#contact`; both rendered the homepage contact form. The Russian form exposed the required preferred-contact-language selector. |
| English boundary | PASS | Browser smoke of `/en` rendered its WhatsApp-led flow and no contact form or `/en#contact` link. |
| Stale legacy route scan | PASS | Search found only valid API paths such as `/api/contact/submit`; current README entries describe `/fr#contact` and `/ru#contact`. |
| Focused tests | PASS | `npm run test:ci -- src/app/sitemap.test.ts src/app/[locale]/ai-automation/page.test.ts src/lib/contact-submit.test.ts src/lib/web-chat/llm.test.ts`: 16 passed. |
| Lint | PASS with existing warnings | `npm run lint`: 0 errors; five existing `img` warnings outside this Work Block. |
| Typecheck | PASS | `npm run check:types` completed successfully after Next regenerated stale route metadata. |
| Diff hygiene | PASS | `git diff --check` completed with no whitespace errors. |
| Production build | BLOCKED | `npm run build` reached Next/Turbopack font loading but could not fetch `Geist` and `Geist Mono` from `fonts.googleapis.com`; no source/type error was reported. |
| Dev-log assertion | PARTIAL | No route-removal error was observed. The existing dev log contains an unrelated `Persistent rate limit fallback enabled for scope=contact_submit` line, so a global clean-log claim is not made. |

## Independent verification record

`scripts/agent-runtime-doctor.sh` passed all prerequisites, including the
private verifier home and readonly profile. The Control Tower then invoked
`scripts/run-independent-verifier.sh` after the application diff was frozen.

- Two native same-session Verifier dispatches returned no report; the local
  evidence above is therefore labelled `review-degraded:inline-fallback`.
- A first independent readonly run was too broad and ended without a captured
  final verdict.
- A bounded retry used a route-only prompt. Its verifier command had a shell
  quoting failure and likewise created no final capture.
- A direct sandbox invocation also reported `verifier-home-not-writable`; the
  retry was launched through the Owner-provisioned outer environment, while
  the child verifier itself remained `approval=never` and `sandbox=read-only`.

Because neither independent run returned `READY`, the required formal verdict
cannot be closed. Re-run the independent verifier with a reviewed, bounded
prompt and re-run `npm run build` in an environment that can reach Google
Fonts before any commit/release decision.

## Maintainability review

The migration follows the existing locale routes rather than introducing a
redirect or a new compatibility layer. FR/RU handoffs target real homepage
anchors; English keeps its pre-existing WhatsApp-only boundary. API intake
paths are intentionally retained and remain distinct from the retired public
page route.
