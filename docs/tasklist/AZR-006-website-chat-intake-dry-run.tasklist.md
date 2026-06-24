# TASKLIST: AZR-006 Website Chat Intake Dry-Run Integration

## Metadata

- Status: Accepted locally; full lint/type/build verification passed
- Parent: AZR-005 Multi-Channel Intake Dry-Run Foundation
- Goal: connect the shared channel-neutral intake runtime to website chat in a dry-run/test-only path.
- Live status SSOT: this tasklist.

## Work Block

Current work block is summarized by the stage/objective below.

## Stage

Implementation - Website Chat Intake Dry-Run Integration

## Objective

Add a local/test-only website chat dry-run path that normalizes `/api/chat` input into the shared intake runtime without changing the live chat path.

## Role

Orchestrator with Scoped Coder and Verifier gates.

## Expected result

- website chat adapter over `web_chat` channel;
- `/api/chat` dry-run branch gated by non-production runtime and `x-azursystech-dry-run: true`;
- no live AI behavior change;
- no env/secrets/config/DB/deploy changes.

## Scope

- `web/src/lib/web-chat/*`
- `web/src/app/api/chat/route.ts`
- `docs/tasklist/AZR-006-website-chat-intake-dry-run.tasklist.md`
- `memory_bank/context.md`
- `memory_bank/progress.md`

## Out of scope

- Live Telegram/WhatsApp API calls.
- Live DB persistence or migration apply.
- Env/secrets/config changes.
- Website UI redesign.
- Deploy, staging, push, or real client/admin messages.

## Acceptance criteria

- Shared intake runtime can be exercised through website chat dry-run mode.
- Normal `/api/chat` behavior remains unchanged unless dry-run header is present outside production.
- Dry-run path accepts optional `conversationKey`, `senderKey`, and intake `state`.
- Dry-run path returns `{ ok, mode: "dry_run", decision }`.
- No new secrets, env requirements, DB access, Telegram/WhatsApp calls, or outbound messages are introduced.

## Verification

- `git diff --check` passed.
- `cd web && npm run lint` passed with existing non-blocking `<img>` warnings only.
- `cd web && npm run check:types` passed.
- `cd web && npm run build` passed.
- Targeted ESLint for touched files passed.
- Secret/API scan found only existing `DEEPSEEK_API_KEY` references in `/api/chat`.
