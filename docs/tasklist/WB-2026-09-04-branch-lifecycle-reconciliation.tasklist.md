# Tasklist — Branch / Lifecycle Reconciliation

- [x] TASK-001 [type=requirement] [req=REQ-001] [ac=AC-001] [paths=docs/reports/WB-2026-09-04-branch-lifecycle-reconciliation.md] Inventory all refs against `origin/main`.
- [x] TASK-002 [type=requirement] [req=REQ-002] [ac=AC-002,AC-003] [paths=docs/reports/WB-2026-09-04-branch-lifecycle-reconciliation.md] Correlate lifecycle and worktree evidence.
- [x] TASK-003 [type=requirement] [req=REQ-003] [ac=AC-004,AC-005] [paths=docs/reports/WB-2026-09-04-branch-lifecycle-reconciliation.md] Report safe next actions without mutation.

## In Progress

| ID | Task | AC | Owner | Status |
|---|---|---|---|---|
| See formal task records above | Inventory, correlation, disposition | See AC references above | Orchestrator | completed |

## Ready

| ID | Task | AC | Priority | Blocked By |
|---|---|---|---|---|
| See formal task records above | Inventory, correlation, disposition | See AC references above | P1 | - |

## Completed

| ID | Task | Verdict | Date |
|---|---|---|---|
| See formal task records above | Inventory, correlation, disposition | READY — 2026-09-04 |

## Blocked

| ID | Task | Verification Verdict | Blocker / Missing Evidence | Corrective Action |
|---|---|---|---|---|
| None | None | None | None | None |

## Acceptance criteria

- AC-001: every local/remote non-main ref has ancestry and unique-commit evidence;
- AC-002: lifecycle state and checked-out worktree ownership are independently recorded;
- AC-003: no deletion or mutation is recommended without explicit target evidence and Owner gate.
