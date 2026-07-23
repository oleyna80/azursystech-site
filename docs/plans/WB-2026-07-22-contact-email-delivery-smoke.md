# WB-2026-07-22 — Contact E-mail Delivery Smoke

## Objective

Perform exactly one Owner-authorized fictitious contact-form submission through
the existing local web runtime. It may create one live lead record and may
forward one e-mail to the already configured recipient. Establish whether the
new `preferred_contact_language` field reaches the existing outbound flow.

## Owner authorization

- 2026-07-22: one fake e-mail test to the configured recipient.
- 2026-07-22: one corresponding fake record in the live intake database.
- Owner confirms the live form currently delivers to e-mail, not Telegram.

## Boundaries

In scope:

- One browser-driven submit of `/contact` on the local development server.
- One explicitly fictitious payload marked `TEST — DO NOT CONTACT`, using
  `preferred_contact_language=en` and a current web-service option.
- Observation of the browser result and a recipient-side confirmation from the
  Owner; only sanitized response metadata may be recorded.

Out of scope:

- Reading, changing, or printing environment variables, credentials, tokens,
  recipient addresses, or provider endpoints.
- A second submission, retry, direct database access, migration, deployment,
  commit, push, or any source/configuration change.
- Telegram, WhatsApp, phone, or any other client-facing channel.

## Preflight

| Field | Record |
|---|---|
| Work Block type | Owner-authorized external-consumer smoke / compatibility evidence |
| Side-effect class | One client-facing e-mail and one live DB write, both explicitly authorized; local browser interaction |
| DB action mode | Existing application write only; no direct DB access or schema change |
| Hard Stops | One e-mail and one live DB record approved by Owner; all other client sends and live-data actions prohibited |
| Skill routing | checked=current-work-block-gates,security-pass,webapp-testing,subagent-mission-brief,git-safety; matched=current-work-block-gates,security-pass,webapp-testing,subagent-mission-brief; used=current-work-block-gates,security-pass-verify,webapp-testing,subagent-mission-brief; skipped=git-safety-no-commit-or-staging |
| Subagent topology | Subagent-Required: live DB and external provider. Read-only Critic before the one-shot action; read-only Verifier after it. No Coder: no source writes. |
| Required verifier isolation | os-isolated for formal READY; this smoke can yield only operational evidence unless an Owner-provisioned os-isolated verifier is available. |
| Write gate | READY — Owner confirmed the exact lead/event/webhook footprint and that Telegram is disabled for this form. |

## Acceptance criteria

1. At most one form submission is made.
2. The submitted content is unmistakably fictitious and requests no contact.
3. The browser receives the application success path, or the exact safe failure
   class is recorded without retrying.
4. The Owner can confirm whether the configured mailbox received the message
   and whether it contains `preferred_contact_language: en` (or equivalent
   rendered wording), without pasting e-mail contents or addresses here.
5. No secrets, endpoint URLs, tokens, personal data, or database rows are
   exposed in evidence.

## Stop conditions

- Critic finds an unapproved additional external side effect.
- Local runtime is not available or does not have the configured integration.
- The form reports a failure, validation error, or rate limit: do not retry.
- Recipient-side confirmation requires access to a mailbox not available to the
  Owner in this session.
- Telegram is enabled or its disabled state cannot be attested without exposing
  configuration.
