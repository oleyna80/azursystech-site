# Codex Stage 0 Write Gate

Status: BLOCKED
Expires: YYYY-MM-DD
Work Block: [wb-id]
Approved Scope: [owner-approved write-set reference]
Codex Critic: REQUIRED
Critic Verdict: PENDING
Critic Report: [docs/reports/critic-[wb-id].md]
Critic Skip Reason: [N/A unless Codex Critic is SKIPPED]
Orchestrator Response: [required for SUPPLEMENT or RECONSIDER]
Orchestrator Log: memory_bank/orchestrator-log.md
Review Log: memory_bank/review-log.md

Codex must not modify repository files until the Owner-approved scope for the
current workblock is recorded here or in the active conversation.

Set `Status: READY` only after Stage 0 preflight is complete and the approved
scope is clear. Use a short-lived expiry for the active Work Block. Do not
commit a permanent or future-dated `READY` gate as project baseline state.

This file is a reusable gate contract. Current Work Block evidence belongs in
the Work Block plan/report and may be copied here only for the active local
session before write-capable work begins.

For non-trivial Work Blocks, also set `Codex Critic` before writes:

- `READY` when a read-only Codex critic subagent or external critic completed.
- `FALLBACK` when a same-session critic pass completed because native subagents
  were unavailable.
- `SKIPPED` only for valid skip conditions in `.codex/critic.md` or explicit
  Owner approval.
- `REQUIRED` means the critic requirement is not resolved yet and writes must
  remain blocked.

When `Codex Critic` is `READY` or `FALLBACK`, set `Critic Verdict` to
`APPROVE`, `SUPPLEMENT`, or `RECONSIDER`. When `Codex Critic` is `SKIPPED`,
write a concrete `Critic Skip Reason`.

If `Critic Verdict` is `SUPPLEMENT` or `RECONSIDER`, set a concrete
`Orchestrator Response` before marking `Status: READY`. For `RECONSIDER`, the
response must explain that Stage 0 was rerun or why the Owner explicitly
accepted proceeding.
