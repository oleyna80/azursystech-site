# Agent Backend Architecture — Review

**Reviewed:** `docs/plans/agent-backend-architecture-2026-05-24.md`
**Date:** 2026-05-24
**Reviewer:** Claude Opus 4.7 (Reviewer / Architecture Analyst)
**Scope:** maturity, relevance, and completeness against 2026 best practices
**Method:** codebase inspection + web research (MCP) + subagent exploration

---

## Executive Summary

The plan is **factually accurate about the current codebase** and makes **sound architectural choices** at the macro level. It gets the big things right: channel-neutral core, PostgreSQL as SSOT, deterministic runtime with advisory LLM, and separation of conversational draft state from submitted briefs.

However, it has **six material gaps** that should be addressed before implementation begins, and **three areas where the complexity is underestimated**. The most critical gap is the absence of an idempotency strategy at the intake layer — without it, the system will produce duplicate messages, duplicate briefs, and duplicate AI calls on retry.

**Verdict:** Approvable with amendments. The six gaps below should be resolved in a revised version or captured as explicit follow-up gates.

---

## What the Plan Gets Right

### 1. Channel-Neutral Core Architecture

The "thin adapters over shared intake runtime" pattern is the consensus architecture for multi-channel AI agents in 2025-2026. Bitovi (2025), Tencent Cloud, and Synthflow all converge on a Surface Layer (channel I/O) / Core (reasoning) separation. The plan's implementation of this pattern — `telegram/intake-adapter.ts` (136 lines) and `web-chat/intake-adapter.ts` (65 lines) as pure normalization layers — is already proven in the codebase.

### 2. Deterministic Runtime + Advisory LLM

This is the "high-value if, low-value foreach" pattern validated by the DiscussLLM paper (NeurIPS 2025) and the GlobalDev FSM-inspired production pattern (July 2025). The decoupled classifier+generator architecture delivers 5x lower latency and 30x less GPU memory than end-to-end LLM. The plan's `runIntakeDryRun()` is correctly described as a pure deterministic function with no LLM calls.

### 3. Two-Layer Data Model

Separating `intake_channel_conversations.brief_draft` (mutable, conversational, partial) from `intake_briefs` (validated, submitted, canonical) is correct. JusDB (Feb 2026) and Tiger Data (Jan 2026) both recommend this pattern: draft state for in-flight work, normalized tables for finalized records.

### 4. Option Selection

Rejecting Option A (JSONB-only briefs) and Option B (full `/api/chat` rewrite) is the right call. Option A blurs draft/submitted boundaries; Option B carries unnecessary regression risk. Option C is the correct incremental step.

### 5. Factual Accuracy

A thorough codebase inspection confirmed every claim the plan makes about the current state. There are no misrepresentations. Specifically:

| Plan Claim | Actual Code | Match |
|---|---|---|
| Runtime is deterministic, collects 3 fields | `runIntakeDryRun()` in `runtime.ts:163` | Yes |
| `/brief` submit does not persist | `route.ts:146` returns payload, no DB write | Yes |
| No `intake_briefs` table exists | `ls web/sql/` shows 001-004 only | Yes |
| `sql-persistence.ts` persists conversations/messages/decisions/drafts | 965-line module with `SqlIntakePersistenceStore` + `SqlIntakeOutboxStore` | Yes |
| `brief-assistant.ts` provides field-level guidance | 609-line module with fr/ru per-field guidance | Yes |

---

## Material Gaps (Must Address Before Implementation)

### Gap 1: No Idempotency Strategy (CRITICAL)

The plan mentions idempotency once, in the risks section (line 533): "mitigate with idempotency key or conversation/source uniqueness for the agent-created brief path." This is under-specified for a 2026 system.

The 2026 article "Every AI Agent Failure I've Debugged in 2026 was an Idempotency Problem" is not hyperbole. Every modern delivery substrate (webhooks, HTTP retries, Telegram replay) is at-least-once. The current code already has an idempotency key in `buildIdempotencyKey()` (`runtime.ts:42-46`) using `channel:providerUpdateId`, but:

- The `/brief` submission route has **no idempotency check at all**. A client double-click or network retry will create duplicate brief rows.
- The proposed `intake_briefs` table has no `UNIQUE` constraint on an idempotency key column.
- The agent-created brief snapshot path (Step 5) would be vulnerable to duplicate inserts from webhook replays.

**Recommendation:** Add an `idempotency_key TEXT NOT NULL UNIQUE` column to `intake_briefs`. For `/brief` form submissions, derive the key from `source + client_fingerprint + created_at_window` or require the client to generate a stable UUID per submission attempt. For agent-created snapshots, reuse the existing `channel:providerUpdateId` key.

### Gap 2: No Transactional Outbox for Outbound Messages

The plan correctly describes the outbound lifecycle (draft -> approved -> queued -> sent) but does not mention the Transactional Outbox pattern, which is the 2025-2026 baseline for reliable message delivery.

The current codebase already has `IntakeOutboxStore` in `sql-persistence.ts` — this is good. But the plan does not specify whether the brief persistence and any follow-up notification are committed in the same transaction. Without this guarantee, a crash between brief commit and admin notification enqueue loses the notification.

**Recommendation:** Specify that brief persistence + admin notification decision are written atomically in one DB transaction. The outbox relay (polling or LISTEN/NOTIFY) picks up the notification row after commit. This is already partially implemented in `SqlIntakePersistenceStore.persistDecision()`.

### Gap 3: Outbound State Machine is Too Coarse

The outbound lifecycle in the plan ends at `sent`. For channels that provide delivery receipts (Telegram has read receipts via `Message` updates, WhatsApp has `delivered`/`read` webhooks), this is insufficient for observability.

**Recommended states for 2026:**
```
draft -> approved -> queued -> sent -> delivered -> read
                                           \-> rate_limited -> retry_scheduled -> queued
                                           \-> dead_letter
```

Missing states in the plan:
- `delivered` / `read` — provider confirmed delivery/read (Telegram, WhatsApp)
- `rate_limited` — distinguish "failed because broken" from "failed because throttled"
- `dead_letter` — terminal state after N retries with backoff + jitter

### Gap 4: No Cross-Channel Identity Resolution

The plan states the agent "remains channel-neutral" but does not address how to recognize that the same user is messaging from Telegram and later submitting a `/brief` form. Without identity mapping (email -> phone -> platform IDs), the unified core produces fragmented user experiences.

The contract spec (`AZR-INTAKE-agent-contract-v1.md`) already defines `channelContactId` and `externalContactId` in `IntakeAgentContext`, but the architecture plan does not reference these or propose a mapping strategy.

**Recommendation:** Add a brief section on identity resolution. For MVP, use explicit `conversationId` linking (already an open question in the plan, line 540). For post-MVP, add a `channel_contacts` table mapping `channel + external_contact_id -> canonical_user_id`.

### Gap 5: No Evaluation / Feedback Loop

DoorDash (2025) and boost.ai research both cite lack of ongoing evaluation as the root cause for 67% of chatbot implementation failures. The plan has no section on how to measure whether the intake system is working — no containment rate, no intent accuracy, no user satisfaction measurement, no A/B testing for contact-form-first vs brief-first flows.

**Recommendation:** Add a minimal evaluation section. For MVP: log decision accuracy (did the deterministic runtime classify commitment requests correctly?), track brief completion rate, and track contact-form acceptance rate. This data will validate or disprove the contact-form-first hypothesis.

### Gap 6: No Streaming Consideration

The plan treats all replies as batch-generated text. Both web chat and Telegram support streaming responses (Telegram via `sendChatAction` + incremental edits). Blocking on full LLM completion before rendering degrades user experience. The `/api/chat` route already uses streaming for DeepSeek responses, so the concept exists in the codebase but is not addressed for the shared intake path.

**Recommendation:** Add a note that streaming is a post-MVP concern for the shared runtime, but the reply model should not preclude it. Current `assistantReply: string` is fine for MVP but should be extensible to `AsyncIterable<string>` later.

---

## Underestimated Complexity

### 1. contact_cta_state State Machine

The plan proposes adding a 5-state CTA machine (`not_offered, offered, accepted, insufficient, skipped`) plus 4 next-step values (`clarify, contact_form, brief, handoff`) to the deterministic runtime (lines 170-186). The current runtime has 3 states (`ask_followup, mark_brief_ready, duplicate_ignored`).

This is a 6x increase in state space (3 -> 18+ combinations) and requires the runtime to:
- Track whether the contact form was offered, accepted, or skipped
- Decide when "enough context" exists to offer the form
- Handle the case where the form is offered but the client keeps talking
- Handle the case where the form is accepted but the client later has deeper questions

The implementation impact is significantly larger than the concise plan text suggests. The runtime's `resolveBriefDraft()` function (42 lines) would roughly triple in size. Consider simplifying the first iteration: two states (`clarify` or `brief_ready`) with contact form as a fixed reply template when brief_ready fires, rather than a full state machine.

### 2. Agent-Created Brief Snapshot Complexity

Step 5 ("save agent-created brief snapshot") requires the runtime to decide when a three-field draft is "good enough" to save as a `draft` brief. But the plan also says "Avoid pretending the three-field draft fully satisfies the large `/brief` form" (line 355). These two goals are in tension: saving a three-field snapshot to a table designed for 33-field validated submissions creates a schema mismatch.

The plan mitigates this with `metadata.completeness: "minimal"` but doesn't specify what `payload` looks like for a three-field snapshot. If `payload` is the full `BriefSubmissionPayload` type, most fields will be empty strings — violating `NOT NULL` semantics.

**Recommendation:** Either:
- Make `payload` nullable for `draft` status briefs, or
- Use a separate `IntakeBriefDraft` type for draft snapshots and reserve `BriefSubmissionPayload` for submitted briefs, or
- Populate only the fields that exist in the draft (problemStatement, contactHint, city) and leave the rest as empty strings — but document this explicitly.

### 3. Legacy Schema Coexistence

The plan's inventory skips `001_intake_schema.sql` entirely — it has legacy `intake_conversations` and `intake_conversation_messages` tables. The new `intake_channel_conversations` table references `intake_leads` via foreign key, which means the legacy and new schemas coexist. The plan proposes `lead_id` on `intake_briefs` but does not clarify whether this points to the legacy `intake_leads` or a future `intake_channel_leads`.

**Recommendation:** Note that `intake_briefs.lead_id` should reference `intake_leads(id)` to maintain consistency with the existing FK in `intake_channel_conversations`. Document the legacy schema dependency explicitly.

---

## Open Questions — Assessment

The plan lists 6 open questions (lines 539-545). My assessment:

| Question | Assessment |
|---|---|
| Should `/api/brief/submit` accept optional `conversationId`? | **Yes, in this slice.** Without it, the chat-to-brief link can't be established, which is the whole point of the two-layer model. Accept it as optional, validate it exists if provided, store it. |
| Should Telegram identity be enough to create/link a lead? | **Post-MVP.** Telegram identity alone (no email/phone) is too thin to create a canonical lead. Store as `channel_contact` and link when richer identity data arrives. |
| What minimum fields make an agent brief ready for owner review? | **The three fields are enough for "ready"** if `metadata.completeness: "minimal"` is set. The owner sees a problem statement, contact method, and city — that's actionable for a first review. Don't overthink this for MVP. |
| Google Sheets mirror timing? | **Post-MVP.** Admin review first, mirror after approval. Automating sheets on every brief save creates noise. |
| Website live chat contact-form-first before shared runtime? | **Yes.** The current `/api/chat` route already has CTA policy built into its prompt. Don't change behavior before migration. |
| Canonical test command for this slice? | **Determine in Step 1** (baseline check). Run `npm run check:types` and `npm run test -- --testPathPattern=intake` in `web/` to see what exists. |

---

## Additional Recommendations

### 1. Add CHECK Constraints on JSONB

The plan's proposed `intake_briefs` table uses `payload JSONB NOT NULL`. PG16+ supports JSONB CHECK constraints. Add at minimum:
```sql
CHECK (jsonb_typeof(payload) = 'object')
```

### 2. Add Rate Limiting for Agent-Created Brief Snapshots

The `/brief` form route has rate limiting (5 req/min). The agent-created brief snapshot path (Step 5) does not. A Telegram user rapidly sending messages could trigger multiple `mark_brief_ready` events. Add a cooldown: don't save a new draft snapshot if one was saved for the same conversation in the last N minutes.

### 3. Consider content-length-based throttling

The plan uses flat rate limits (X requests/min). LLM requests vary 10x+ in token consumption. A 2000-character problem statement costs significantly more than a 30-character "hello." For MVP this is fine; flag as a post-MVP concern.

### 4. Verify the Write-Set Against Reality

The plan's write-set (lines 207-215) lists `web/src/lib/intake/briefs.ts` and `web/src/lib/intake/brief-persistence.ts` as new files. These don't exist yet and are correctly scoped. However, the plan also lists `web/src/lib/intake/storage.ts` which already handles persistence routing — adding new persistence functions there vs in a new `brief-persistence.ts` is a design choice the coder should make after inspecting the existing routing logic.

---

## 2017-2026 Relevance Timeline

| Concept | Plan Status | 2026 Maturity |
|---|---|---|
| Channel-neutral core | Recommended | Industry standard |
| Deterministic intake runtime | Implemented | Validated (FSM+LLM pattern) |
| Two-layer draft/brief model | Recommended | Sound, with CHECK constraints |
| PostgreSQL JSONB for drafts | Implemented | Acceptable for metadata; normalize queryable fields |
| Outbound message lifecycle | Partially implemented | Needs delivered/read/rate_limited/dead_letter |
| Transactional outbox | Implemented in code, not documented in plan | Industry baseline — mention explicitly |
| Idempotency at intake | Partial (runtime only, not /brief) | Critical gap — fix before implementation |
| Contact-form-first flow | Proposed | Valid pattern, needs abandonment data |
| Cross-channel identity | Not addressed | Gap for multi-channel MVP |
| Evaluation/feedback loop | Not addressed | Gap for production readiness |
| Streaming replies | Not addressed | Post-MVP concern |
| MCP/tool integration | Not addressed | Post-MVP concern for this slice |

---

## Summary of Required Changes to the Plan

1. **CRITICAL:** Add idempotency strategy section — `UNIQUE` on `intake_briefs.idempotency_key`, client-side UUID for `/brief` submissions
2. **HIGH:** Add transactional outbox guarantee — brief persistence and admin notification in same DB transaction
3. **HIGH:** Clarify agent-created brief snapshot `payload` shape for three-field drafts
4. **MEDIUM:** Extend outbound state machine — add `delivered`, `read`, `rate_limited`, `dead_letter` (can be post-MVP)
5. **MEDIUM:** Add cross-channel identity resolution note — explicit `conversationId` linking for MVP
6. **MEDIUM:** Add minimal evaluation section — track brief completion rate, contact-form acceptance rate
7. **LOW:** Note legacy schema dependency in inventory
8. **LOW:** Add note on JSONB CHECK constraints
9. **LOW:** Acknowledge that `contact_cta_state` implementation is ~3x the current runtime complexity

---

## Conclusion

The plan is a **solid, well-researched architecture document** that accurately describes the current state and makes defensible choices. It is at the right level of abstraction for a coder to implement from. The six gaps above do not invalidate the architecture — they are refinements that prevent predictable production failures. The most urgent is idempotency (#1), which costs almost nothing to add now and is very expensive to retrofit later.

**Recommendation:** Accept with amendments for gaps 1-3. Capture gaps 4-6 as post-MVP follow-ups. Proceed to implementation after revising the plan.
