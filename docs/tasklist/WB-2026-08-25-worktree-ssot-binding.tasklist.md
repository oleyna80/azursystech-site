# WB-2026-08-25-worktree-ssot-binding — Task list

- [x] TASK-001 [req=REQ-005] Add `subject_branch` to the default active Work Block state.
- [x] TASK-002 [req=REQ-005] Make lifecycle `open` capture the current feature branch and reject detached/default-branch source opening.
- [x] TASK-003 [req=REQ-001,REQ-002] Add runtime Git context and branch-binding validation to the Codex write hook.
- [x] TASK-004 [req=REQ-001,REQ-002] Add equivalent runtime Git context and branch-binding validation to the Claude write hook.
- [x] TASK-005 [req=REQ-003] Require valid binding for normal coordination writes while preserving direct active-gate repair.
- [x] TASK-006 [req=REQ-004] Add denial diagnostics with root, branch, HEAD, Work Block ID, and session/worktree guidance.
- [x] TASK-007 [req=REQ-006] Update existing test fixtures to set `subject_branch`.
- [x] TASK-008 [req=REQ-006] Add two-linked-worktree isolation tests for Codex and Claude hooks.
- [x] TASK-009 [req=REQ-006] Add tests for coordination mismatch, repair escape hatch, detached/missing branch, and diagnostic content.
- [x] TASK-010 [req=REQ-007] Document parallel worktree and explicit Work Block closeout rules in the Owner-controlled workflow.
- [x] TASK-011 [req=REQ-001,REQ-006] Run `python3 scripts/test-github-capability-control-plane.py` and `git diff --check`.
- [x] TASK-012 [req=REQ-001,REQ-006,REQ-007] Freeze diff and complete read-only Reviewer, Verifier, and drift assurance.
