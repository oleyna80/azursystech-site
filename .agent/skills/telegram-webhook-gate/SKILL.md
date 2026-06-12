---
name: telegram-webhook-gate
description: Use for AzurSysTech Telegram webhook receive, registration readiness, inbound smoke, or first live-send gates. Keeps receive, registration, outbound sends, env/secrets, deploy, and DB actions separate with local verification first.
---

# Skill: Telegram Webhook Gate

Use this skill for Telegram webhook route implementation, readiness planning,
registration gates, inbound-only smoke, or first-send gates.

## Purpose

Keep Telegram integration work safe by splitting it into explicit gates:

1. local route implementation;
2. deploy/readiness;
3. webhook registration;
4. inbound-only smoke;
5. first approved outbound send.

Do not combine these gates unless the Owner explicitly approves the combined
risk.

## When to Use

- `/api/telegram/webhook` changes.
- `TELEGRAM_WEBHOOK_*` or Telegram sender readiness work.
- Telegram `setWebhook`, `deleteWebhook`, `getWebhookInfo`, or first-send
  planning.
- Live Telegram deploy/readiness verification.
- Inbound Telegram persistence smoke.

## When to Skip

- Non-Telegram intake work.
- Pure docs discussion with no Telegram runtime decision.
- Existing dry-run tests that do not affect live readiness.

## Gate Boundaries

- `TELEGRAM_WEBHOOK_RECEIVE_ENABLED` controls inbound receive.
- `TELEGRAM_WEBHOOK_REGISTRATION_ENABLED` controls one-time registration only.
- `TELEGRAM_LIVE_SENDS_ENABLED` controls outbound sends only.
- `TELEGRAM_WEBHOOK_SECRET` is the canonical secret for
  `X-Telegram-Bot-Api-Secret-Token`.
- `TELEGRAM_BOT_TOKEN` is not required for inbound route handling.

## Local Implementation Workflow

1. Inspect the active tasklist and current route/sender/storage files.
2. Confirm write-set and Hard Stops before edits.
3. Implement receive path without calling Telegram APIs.
4. Preserve non-production dry-run behavior unless the task says otherwise.
5. Keep production responses minimal; do not expose assistant decisions.
6. Verify unsupported updates return sanitized `200 ignored`.
7. Verify `sql_primary` persistence failure returns `503` for retry.
8. Run local route smoke and temporary DB smoke.
9. Stop local servers and drop temporary DBs before closeout.
10. Sync tasklist and memory bank only after verification evidence exists.

## Required Local Smoke

For webhook route changes, cover:

- `GET` returns `404`;
- receive disabled returns `404`;
- wrong/missing secret returns `404`;
- invalid JSON returns `400`;
- oversized body returns `413`;
- unsupported or non-private update returns `200 ignored`;
- private text update returns `200 ok`;
- `sql_primary` persistence unavailable returns `503`;
- temporary DB smoke confirms conversation, inbound `sent`, outbound `draft`,
  and decision rows.

## Hard Stops

Stop for explicit Owner approval before:

- `setWebhook`, `deleteWebhook`, `sendMessage`, or any Telegram API call;
- adding/changing/printing real Telegram token or webhook secret;
- deploy or VPS runtime env changes;
- live DB migration or schema changes;
- real client/admin messages;
- WhatsApp or Google Sheets calls.

## Output

Report:

- gate executed;
- files changed;
- route behavior;
- local smoke results;
- DB smoke result and cleanup;
- live actions not performed;
- blockers/non-blockers;
- next gate.

## Handoff

- **Success condition**: local checks and smoke pass; no live action occurred;
  SSOT reflects current gate and next gate.
- **Next**: verifier/review or deploy-readiness gate, depending on tasklist.
- **Auto-proceed**: 🟢 YES for local implementation and verification inside an
  approved Work Block.
- **Hard stop**: 🔴 YES for live Telegram API calls, secrets, deploy, live DB,
  or real messages.
