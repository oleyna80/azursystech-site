---
schema_version: 1
artifact_type: tasklist
work_block_id: WB-2026-09-09-release-state-fixture-isolation
specification: docs/specs/WB-2026-09-09-release-state-fixture-isolation.md
status: completed
---

# Tasklist — Release-State Fixture Isolation

- [x] TASK-001 [type=requirement] [req=REQ-001] [ac=AC-001] [paths=scripts/test-release-state-contracts.py] Reproduce the masking failure and derive the current PROJECT_MAP fixture projection from fixture state.
- [x] TASK-002 [type=requirement] [req=REQ-002] [ac=AC-002] [paths=scripts/test-release-state-contracts.py] Correct inactive fixture projection setup without changing validator semantics.
- [x] TASK-003 [type=requirement] [req=REQ-003] [ac=AC-003] [paths=scripts/test-release-state-contracts.py] Preserve the valid case and existing independent negative assertions.
- [x] TASK-004 [type=requirement] [req=REQ-004] [ac=AC-004] [paths=scripts/test-release-state-contracts.py,docs/specs/WB-2026-09-09-release-state-fixture-isolation.md] Verify the exact bounded diff and lifecycle evidence.
- [x] TASK-005 [type=assurance] [req=-] [ac=-] [paths=docs/reports/critic/WB-2026-09-09-release-state-fixture-isolation.md,docs/reports/reviews/WB-2026-09-09-release-state-fixture-isolation.md,docs/reports/verification/WB-2026-09-09-release-state-fixture-isolation.md,docs/reports/drift/WB-2026-09-09-release-state-fixture-isolation.md] Complete read-only assurance.

## Expected final result

The release-state regression suite is green because its malformed operational
fixture reaches the intended operational parser error; no validator rule or
production behavior is weakened or changed.
