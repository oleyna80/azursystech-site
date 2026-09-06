---
schema_version: 1
artifact_type: tasklist
work_block_id: WB-2026-09-06-sprint-analysis-hardening
specification: docs/specs/WB-2026-09-06-sprint-analysis-hardening.md
specification_revision: "1"
status: approved
---

# Traceable Tasklist

- [x] TASK-001 [type=requirement] [req=REQ-001,REQ-002,REQ-003,REQ-004,REQ-005,REQ-006,REQ-007,REQ-012] [ac=AC-001,AC-002,AC-003,AC-004,AC-005,AC-010] [paths=.agent/skills/sprint-analysis/scripts/extract.sh] Implement trailer-first commit classification and stable output.
- [x] TASK-002 [type=requirement] [req=REQ-008,REQ-009,REQ-010] [ac=AC-006,AC-007,AC-008] [paths=.agent/skills/sprint-analysis/scripts/extract.sh] Add period-end status snapshot and evidence-caveat semantics.
- [x] TASK-003 [type=requirement] [req=REQ-011] [ac=AC-009] [paths=.agent/skills/sprint-analysis/SKILL.md] Align skill instructions with extractor precedence and evidence vocabulary.
- [x] TASK-004 [type=requirement] [req=REQ-001,REQ-002,REQ-003,REQ-004,REQ-005,REQ-006,REQ-007,REQ-008,REQ-009,REQ-010,REQ-011,REQ-012,REQ-013] [ac=AC-011,AC-012,AC-014] [paths=.agent/skills/sprint-analysis/tests/commit-linkage-fixtures.sh,.github/workflows/control-plane-contracts.yml] Add deterministic linkage, repository-state, and control-plane CI fixtures.
- [x] TASK-005 [type=requirement] [req=REQ-001,REQ-002,REQ-003,REQ-004,REQ-005,REQ-006,REQ-007,REQ-008,REQ-009,REQ-010,REQ-011,REQ-012,REQ-013] [ac=AC-012,AC-014] [paths=.agent/skills/sprint-analysis/tests/commit-linkage-fixtures.sh,.github/workflows/control-plane-contracts.yml] Verify fixture output and current-main compatibility without historical mutation.
- [x] TASK-006 [type=assurance] [req=-] [ac=-] [paths=docs/reports/**] Record Critic, Review, Verification, Traceability, and Drift evidence.
- [x] TASK-007 [type=requirement] [req=REQ-012] [ac=AC-013] [paths=.agent/active-work-block.json,.agent/critic-gate.md,.agent/verification-gate.md,.codex/write-gate.md,docs/reports/**] Complete lifecycle closeout and scope assurance.
