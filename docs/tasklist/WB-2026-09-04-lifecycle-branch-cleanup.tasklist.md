---
schema_version: 1
artifact_type: traceable_tasklist
work_block_id: WB-2026-09-04-lifecycle-branch-cleanup
---

# Tasklist — lifecycle / branch cleanup audit

- [x] TASK-001 [type=requirement] [req=REQ-001] [ac=AC-001,AC-002] [paths=docs/reports/WB-2026-09-04-lifecycle-branch-cleanup.md] Capture exact refs and correlate branch/PR/worktree evidence.
- [x] TASK-002 [type=requirement] [req=REQ-002,REQ-003] [ac=AC-003,AC-004] [paths=docs/reports/WB-2026-09-04-lifecycle-branch-cleanup.md] Classify lifecycle and cleanup candidates without mutation.
- [x] TASK-003 [type=requirement] [req=REQ-004] [ac=AC-005] [paths=docs/reports/WB-2026-09-04-lifecycle-branch-cleanup.md] Produce bounded Owner-gated follow-up dispositions.

## Acceptance criteria

- AC-001 [req=REQ-001]: exact baseline and preflight are recorded;
- AC-002 [req=REQ-001]: branch, PR, worktree, and lifecycle evidence is correlated;
- AC-003 [req=REQ-002,REQ-003]: canonical dirty state is preserved;
- AC-004 [req=REQ-003]: every candidate has a safe disposition and confidence;
- AC-005 [req=REQ-004]: no destructive or application mutation occurs.
