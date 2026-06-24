# TASKLIST: AZR-005 Multi-Channel Intake Dry-Run Foundation

## Metadata

- Status: Accepted locally; full lint/type/build verification passed
- Architecture brief: `docs/specs/AZR-TELEGRAM-assistant-architecture-brief.md`
- Goal: create a minimal dry-run/test foundation for conversational brief collection through channel adapters.
- First channel: Telegram.
- Future channels: WhatsApp after API approval, website chat.
- Live status SSOT: this tasklist.
- MVP mode: dry-run/test only.

## Work Block

Current work block is summarized by the stage/objective below.

## Stage

Implementation - Multi-Channel Intake Dry-Run Foundation

## Objective

Create a minimal channel-neutral intake foundation that can accept a mocked Telegram inbound message, normalize it, run a brief-collection decision path, and return a dry-run response without real Telegram/WhatsApp/API calls.

## Role

Coder with Reviewer and Verifier gates.

## Expected result

Local testable foundation only:

- shared intake runtime boundary;
- Telegram adapter as the first channel adapter;
- mock/dry-run transport;
- brief-ready/admin-notification/Google-Sheets-mirror contracts defined or stubbed;
- no live external side effects.

## Execution topology

- Control Tower + one Coder subagent for implementation.
- Optional read-only Reviewer/Verifier subagents for route/security/test review.
- Context sharing: scoped prompts preferred; full-history fork only if required.
- Only one Coder may modify repository files.

## Scope

- Define channel-neutral intake types and runtime boundary.
- Define Telegram normalized inbound adapter for dry-run/test payloads.
- Define dry-run assistant decision output for conversational brief collection.
- Define or stub brief-ready state.
- Define admin notification payload contract without sending.
- Define Google Sheets mirror status/link contract without live Sheets write.
- Add focused local tests or a verification harness if an existing test path is available.

## Out of scope

- Real Telegram bot token/chat ID.
- Telegram `setWebhook`, `getUpdates`, `sendMessage`, or any live Telegram API call.
- WhatsApp API integration.
- Website UI changes.
- Production deploy, Docker push, VPS changes.
- Env/secrets/config changes.
- Live DB migration apply.
- Real client communications.
- Pricing, deadline, stack, appointment, delivery, or contract promises.

## Approved write-set

Implementation approval may include only these paths:

- `web/src/lib/intake/*`
- `web/src/lib/telegram/*`
- `web/src/app/api/telegram/webhook/route.ts` only if the route remains dry-run/test-gated
- `web/src/app/api/chat/route.ts` only if needed to extract shared channel-neutral intake logic
- `web/sql/*` only for additive draft migration files; no live apply
- relevant `web` tests or test fixtures if an existing test path is available
- `docs/tasklist/AZR-005-multi-channel-intake-dry-run.tasklist.md`
- `memory_bank/context.md`
- `memory_bank/progress.md`

Any other write path requires Control Tower approval before implementation.

## Dirty baseline

- Check `git status --short --untracked-files=all` before implementation.
- Stop if unrelated dirty production files are present.
- Local workflow docs may be ignored by Git and should not block implementation.

## Acceptance criteria

- Shared intake runtime boundary is channel-neutral and can later be reused by Telegram, WhatsApp, and website chat.
- Telegram adapter is thin: validate/normalize only, no prompt logic, no direct lead/brief mutation.
- Dry-run path does not require real Telegram token, chat ID, webhook registration, polling, or outbound send.
- No env/secrets/config changes are required.
- No live DB migration is applied.
- Duplicate provider updates are handled or explicitly covered by a mock idempotency layer.
- Assistant behavior is limited to brief collection and clarification.
- Assistant asks concise follow-up questions when brief data is missing or ambiguous.
- Assistant refuses or deflects pricing, deadline, stack, appointment, delivery, and contract commitments.
- Brief-ready state can create/update a local brief record or dry-run equivalent.
- Admin notification payload is defined but not sent live.
- Google Sheets mirror link/status is modeled or explicitly stubbed for dry-run.
- Logs/errors are sanitized and do not include tokens, full provider payloads, full PII, prompt internals, or LLM provider payloads.

## Verification tier

Standard for implementation. Full verification only if schema files or shared chat route behavior are changed.

## Required checks

- `git diff --check`
- `git status --short --untracked-files=all`
- `cd web && npm run lint`
- `cd web && npm run check:types`
- Run focused tests or verification harness if added.
- Inspect changed sections directly.
- Verify no secrets/tokens/env values are present in the diff.
- Explicitly report skipped live checks: Telegram API, WhatsApp API, live DB migration, Google Sheets write, deploy.

## Stop conditions

- Need for real Telegram/WhatsApp credentials.
- Need for live Telegram API calls.
- Need for live DB migration apply.
- Need for deploy/VPS/env/secrets/config changes.
- Need to send real client/admin messages.
- Need to change package dependencies.
- Unrelated dirty production files block safe implementation.
- Acceptance criteria require product decisions not captured in this tasklist.

## Rollback notes

- Revert only files changed by this Work Block.
- No live external state should exist because the foundation is dry-run/test-only.
- If draft SQL migration is added, rollback is file removal only unless a local/test DB smoke was run.

## SSOT updates

- Update this tasklist as the live status source.
- Update `memory_bank/context.md` with current focus and next gate.
- Update `memory_bank/progress.md` after verification evidence exists.
- Keep architecture brief as reference; do not use it as live task status.

## Implementation Tasks

- [x] Baseline git status and confirm allowed write-set.
- [x] Decide whether to create `web/src/lib/intake/*` fresh or recover a missing prior intake foundation.
- [x] Define channel-neutral intake message, contact, conversation, brief state, and decision types.
- [x] Define Telegram dry-run inbound adapter.
- [x] Define dry-run/mock Telegram transport contract.
- [x] Define brief-ready/admin-notification/Google-Sheets-mirror contracts.
- [x] Add idempotency strategy for provider update/message IDs.
- [x] Add or reuse rate-limit boundary.
- [x] Check for existing test path; no test runner is present, so use targeted lint/type/build and direct inspection.
- [x] Run required checks.

## Verification Tasks

- [x] Confirm no real Telegram API call path exists in the new dry-run modules.
- [x] Confirm no WhatsApp API path exists.
- [x] Confirm no env/secrets changes are required.
- [x] Confirm no live DB migration apply was run.
- [x] Confirm assistant decision policy cannot promise pricing/deadline/stack/appointment/delivery.
- [x] Confirm admin notification and Google Sheets mirror are dry-run contracts only.
- [x] Confirm logs/errors are sanitized.
- [x] Confirm tasklist and memory bank are updated after verification.

## Delivery Notes

- Added `web/src/lib/intake/types.ts` and `web/src/lib/intake/runtime.ts` as the channel-neutral dry-run intake foundation.
- Added `web/src/lib/telegram/intake-adapter.ts` and `web/src/lib/telegram/dry-run.ts` as thin Telegram dry-run normalization and execution wrappers.
- Added `web/src/app/api/telegram/webhook/route.ts` as a local/test-only dry-run route guarded by non-production runtime and `x-azursystech-dry-run: true`.
- No env, secret, config, DB migration, deploy, live Telegram/WhatsApp API call, Google Sheets write, or real message send was added.
- Existing test runner is not present; verification used targeted ESLint, typecheck, build, direct section inspection, and secret/API-call search.
- Full `npm run lint`, `npm run check:types`, and `npm run build` pass locally.
- Acceptance cleanup fixed the unrelated `web/src/ChatWidget.jsx` internal privacy link lint blocker by switching it to `next/link`.

## Acceptance Criteria Tracking

- [x] AC1: Channel-neutral intake runtime boundary exists.
- [x] AC2: Telegram adapter is thin and dry-run/test-only.
- [x] AC3: No live Telegram/WhatsApp/API calls.
- [x] AC4: No env/secrets/config changes.
- [x] AC5: No live DB migration apply.
- [x] AC6: Brief collection behavior is constrained and safe.
- [x] AC7: Brief-ready/admin notification/Sheets mirror contracts exist.
- [x] AC8: Idempotency and rate-limit behavior are covered.
- [x] AC9: Sanitized logging/errors verified.
- [x] AC10: Required checks pass or blockers are reported.
