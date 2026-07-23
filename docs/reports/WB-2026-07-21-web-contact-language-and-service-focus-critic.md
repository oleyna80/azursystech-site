# Critic Report — WB-2026-07-21-web-contact-language-and-service-focus

## Mission

- Role: Reviewer / Security and frontend critic
- Permission: read-only
- Objective: assess the proposed preferred-contact-language field and removal of
  onsite equipment-service offers from the public contact surfaces.

## Verdict

**SUPPLEMENT — adopted.**

The initial direct-form scope was incomplete: the live chat handoff form also
posts to the same contact endpoint. The approved scope therefore includes the
chat widget and its French, Russian, and English copy.

## Findings and adopted decisions

1. **Shared intake contract — high.** The root chat widget submits to
   `/api/contact/submit`; it must collect the required language field and use
   the same allowlisted values as the direct forms.
2. **External webhook contract — high.** The validated payload is forwarded as
   JSON with `X-Contract-Version: 1`. Adding a field may affect a strict
   consumer. This Work Block does not change configuration, versioning, or call
   a live provider. Compatibility remains a formal-verification follow-up.
3. **Legacy service compatibility — medium.** The Owner requested removal from
   forms, not a breaking API migration. Legacy equipment-service values remain
   accepted server-side for historical or external producers, but are removed
   from every user-facing selector in scope.
4. **Business-focus consistency — medium.** Remove hardware-specific
   conditional fields and replace the contact-page intervention wording with
   remote web, site, and AI-automation wording.

## Approved write-set

Control-Tower evidence paths:

- `.agent/critic-gate.md`
- `.agent/verification-gate.md`
- `docs/tasklist/WB-2026-07-21-web-contact-language-and-service-focus.tasklist.md`
- `docs/reports/WB-2026-07-21-web-contact-language-and-service-focus-critic.md`
- `docs/reports/WB-2026-07-21-web-contact-language-and-service-focus-verification.md`
- `memory_bank/orchestrator-log.md`
- `memory_bank/context.md`
- `memory_bank/progress.md`
- `memory_bank/decisions.md`

Scoped Coder source and test paths:

- `web/src/components/contact/contact-page-client.tsx`
- `web/src/components/sections/home-contact.tsx`
- `web/src/ChatWidget.jsx`
- `web/src/i18n.js`
- `web/src/lib/contact-submit.ts`
- `web/src/lib/telegram-notify.ts`
- `web/src/lib/contact-submit.test.ts`
- `web/src/lib/telegram-notify.test.ts`

Out of scope: webhook and Telegram configuration, API route, persistence
schema, migrations, external calls, deployment, commit, and push.

## Verification requirements

- Validate missing and invalid preferred-language values on the server.
- Assert the language is included in notification output without exposing
  secrets.
- Run type, targeted-test, build, and browser-smoke checks.
- Record external-provider compatibility as blocked unless an OS-isolated
  verifier can perform approved non-live contract verification.
