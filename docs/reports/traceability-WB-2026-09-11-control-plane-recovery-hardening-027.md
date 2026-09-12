---
artifact_type: traceability
work_block_id: WB-2026-09-11-control-plane-recovery-hardening-027
specification: docs/specs/WB-2026-09-11-control-plane-recovery-hardening-027.md
revision: recovery-successor-r1
status: READY
---

# Traceability — control-plane recovery hardening

| Requirement | Acceptance | Task | Evidence boundary |
|---|---|---|---|
| REQ-001 | AC-001 | TASK-003 | both fixture harnesses |
| REQ-002 | AC-001 | TASK-003 | hook launch status/error classification |
| REQ-003 | AC-002, AC-003 | TASK-004 | bounded recovery and path/template guards |
| REQ-004 | AC-002 | TASK-004, TASK-005 | normal hook fail-closed matrix |
| REQ-005 | AC-003 | TASK-004 | full canonical inactive contract |
| REQ-006 | AC-002, AC-004 | TASK-005, TASK-006 | focused/current regressions and assurance |
| REQ-007 | AC-005 | TASK-001, TASK-007 | path/status/authority audit |

All requirements have measurable acceptance criteria and an owning task. The
recovery matrix is the source of truth for positive and adversarial-negative
recovery behavior; fixture output must prove that hooks actually launched.
