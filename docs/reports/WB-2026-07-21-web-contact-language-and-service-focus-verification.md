# Verification Report — WB-2026-07-21-web-contact-language-and-service-focus

## Scope and verifier

- Role: Verifier / QA and security-contract reviewer
- Source changes verified: the eight approved `web/src` implementation and
  test paths only
- File changes by Verifier: none
- Live side effects: none; no webhook or Telegram provider call was made
- Actual verifier isolation: `same-session-degraded`
- Required verifier isolation: `os-isolated`

## Local verdict

**Local implementation: PASS. Formal verdict: BLOCKED.**

All three rendered contact surfaces — the contact page, French and Russian home
forms, and the chat handoff — collect a required preferred contact language
using `ru`, `fr`, or `en`. The equipment repair, setup, maintenance, and
related conditional fields are absent from the rendered UI. The contact-page
copy now describes remote web, website, and AI-automation work.

The server validates the required allowlist without resolving it as a site
locale, and the Telegram message uses the validated value. Legacy service
values remain server-accepted for non-UI compatibility, as approved.

## Evidence

| Check | Result | Notes |
|---|---|---|
| Focused Vitest | PASS | 2 files, 4 tests passed: accepted, missing, invalid language validation and Telegram message coverage. |
| Lint | PASS | 0 errors; 5 pre-existing `<img>` warnings. |
| Typecheck | PASS | `npm run check:types`. |
| Production build | PASS | `npm run build`. |
| Full Vitest suite | BLOCKED, unrelated | 19 files pass and one pre-existing showcase test fails: `src/app/[locale]/_home-data.test.ts` expects `/demo/bistrot`, while the current tree has `/demo/maison-olive`. |
| Browser smoke | PASS | Local Next server at port 3100; `/contact`, `/fr`, and `/ru` inspected at 375px; `/contact` and chat handoff inspected on desktop. Required selector, values, removed UI, remote copy, and zero console errors confirmed. Chat used a local `/api/chat` mock only. |
| Contract/security review | PASS locally | Dedicated `ru|fr|en` allowlist; no `resolveLocale` use for the preference; no route, origin, body-size, rate-limit, config, persistence, or secret change. |

## Formal blockers and follow-up

1. This Work Block carries the existing external webhook/Telegram integration;
   its gate requires `os-isolated` verification. The native same-session
   Verifier is advisory only.
2. The configured webhook receives the evolved JSON payload with
   `X-Contract-Version: 1`. A strict consumer may reject the added field.
   No live call, configuration change, or safe isolated contract check was
   authorized, so consumer compatibility is unverified.
3. The unrelated full-suite showcase assertion should be handled in its own
   Work Block; it does not invalidate the targeted implementation evidence.

No commit, push, deploy, or provider action is authorized by this report.
