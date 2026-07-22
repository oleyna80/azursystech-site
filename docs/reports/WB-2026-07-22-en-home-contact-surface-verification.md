# Verification Report — English Home Contact Surface

- **Work Block:** `WB-2026-07-22-en-home-contact-surface`
- **Tier:** standard
- **Verifier:** `ct-inline` after an advisory native Verifier review
- **Sensitive Domains:** none
- **Required / actual isolation:** `same-session-degraded` / `same-session-degraded`
- **Formal verdict:** **READY**

## Scope attribution

The pre-implementation scoped diff and the approved plan both recorded the
Local SEO removal in `web/src/app/[locale]/page.tsx` as an ambient change. It
pre-dated this Work Block and remains excluded. This Work Block adds only the
English FAQ anchor, unconditional shared-contact render, English form copy,
English header contact link, and focused form contract test. No ambient hunk
was restored, staged, or otherwise changed.

## Evidence

| Check | Result | Evidence |
|---|---|---|
| Focused contract test | PASS | `npm run test:ci -- src/components/sections/home-contact.test.ts` — 1/1 passed |
| Typecheck | PASS | `npm run check:types` |
| Diff hygiene | PASS | `git diff --check` |
| Lint | PASS | 0 errors; 3 pre-existing `no-img-element` warnings outside this Work Block |
| English source contract | PASS | `HomeContactSection` accepts `en`; EN copy includes the required `ru`, `fr`, and `en` preferred-language options and only web/application/AI project services |
| Navigation contract | PASS | EN header Contact and FAQ CTA both use `/en#contact` |
| Desktop browser smoke | PASS | `/en` returned 200 at 1440×900; form, anchors and segment control rendered; no console error or horizontal overflow |
| Mobile browser smoke | PASS | `/en` rendered at 375×812; no horizontal overflow; segment control works |
| No-submit safeguard | PASS | browser smoke made zero requests to `/api/contact/submit` |
| Narrow locale regression | PASS | `/fr` and `/ru` returned 200 |

## Limits and follow-up

`scripts/with_server.py` is absent, so browser proof used the already-running
local development server. This does not affect the observed UI contract.

This is UI-only readiness. It neither calls nor proves e-mail delivery,
integration configuration, database state, provider credentials, or external
consumer compatibility. `EN-CONTACT-02` remains the separately approved,
read-only `integration_not_ready` diagnostic.
