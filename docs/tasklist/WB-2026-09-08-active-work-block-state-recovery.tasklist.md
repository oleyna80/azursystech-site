---
artifact_type: tasklist
work_block_id: WB-2026-09-08-active-work-block-state-recovery
status: completed
---

# Task List: active Work Block state recovery

- [x] TASK-001 [type=requirement] [req=REQ-001,REQ-002] [ac=AC-001,AC-002] [paths=.codex/scripts/lifecycle.py,scripts/validate-release-state.py] Preserve lifecycle canonical inactive materialization and enforce its release-state contract.
- [x] TASK-002 [type=requirement] [req=REQ-003] [ac=AC-003] [paths=.codex/scripts/recover-active-work-block.py,scripts/test-release-state-contracts.py] Add safe recovery helper and stale active-state regression fixtures.
- [x] TASK-003 [type=requirement] [req=REQ-004] [ac=AC-004] [paths=docs/reports/**,.agent/active-work-block.json,FILE_REGISTRY.yml,PROJECT_MAP.md] Complete review, verification, synchronization, closeout, and exact subject-branch publication.
- [x] TASK-004 [type=requirement] [req=REQ-005,REQ-006] [ac=AC-005,AC-006] [paths=.agent/hooks/hard_stop_policy.py,governance/authority.md,governance/lifecycle.md,.agent/workflows/owner-controlled-github-flow.md] Implement the Owner-approved ancestry-bound terminal closeout publication path without widening active publication authority.
- [x] TASK-005 [type=assurance] [req=REQ-005,REQ-006] [ac=AC-005,AC-006] [paths=scripts/test-github-capability-control-plane.py,docs/reports/**] Add and execute positive/negative terminal publication regression coverage, including literal-command and terminal release-state invariants.
