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
- [x] TASK-006 [type=requirement] [req=REQ-007,REQ-008] [ac=AC-007,AC-008] [paths=.codex/scripts/recover-active-work-block.py,scripts/test-active-work-block-recovery.py] Restore Git-bound missing/corrupt recovery with active refusal and inactive no-op behavior.
- [x] TASK-007 [type=requirement] [req=REQ-009] [ac=AC-009] [paths=.codex/scripts/lifecycle.py,scripts/test-active-work-block-recovery.py] Load the canonical default template and enforce durable atomic replacement.
- [x] TASK-008 [type=requirement] [req=REQ-010] [ac=AC-010] [paths=.agent/hooks/**,scripts/test-active-work-block-recovery.py] Prove normal admission remains fail-closed and recovery is the sole repair exception.
- [x] TASK-009 [type=assurance] [req=REQ-001,REQ-002,REQ-003,REQ-004,REQ-005,REQ-006,REQ-007,REQ-008,REQ-009,REQ-010] [ac=AC-001,AC-002,AC-003,AC-004,AC-005,AC-006,AC-007,AC-008,AC-009,AC-010] [paths=docs/reports/**,.agent/active-work-block.json] Complete corrective Review, Verification, Closeout, and exact subject-branch terminal publication.
