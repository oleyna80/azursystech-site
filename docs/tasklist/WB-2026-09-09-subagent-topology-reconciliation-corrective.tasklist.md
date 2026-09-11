---
schema_version: 1
artifact_type: tasklist
work_block_id: WB-2026-09-09-subagent-topology-reconciliation
specification: docs/specs/WB-2026-09-09-subagent-topology-reconciliation-corrective.md
status: in_progress
revision: corrective-v1
---

# Corrective tasklist

- [x] TASK-001 [type=requirement] [req=REQ-001,REQ-002,REQ-003] [ac=AC-001,AC-002,AC-003] [paths=.codex/scripts/lifecycle.py,scripts/test-subagent-topology.py] Add optional internal clock injection to lifecycle topology-validation call paths and deterministic fixture propagation while preserving production defaults, exact freshness, and actor rejection.
- [x] TASK-002 [type=requirement] [req=REQ-003] [ac=AC-003] [paths=.codex/scripts/lifecycle.py,scripts/test-subagent-topology.py] Preserve exact provisional execution, provenance, report, result, duplicate, conflict, and transition validation under the cooperative finalization model.
- [x] TASK-003 [type=requirement] [req=REQ-004] [ac=AC-004] [paths=.agent/active-work-block.json,docs/reports/capability/**,docs/reports/critic/**,docs/reports/reviews/**,docs/reports/verification/**] Bind fresh distinct native assurance evidence to the corrected frozen candidate without reusing capability probe IDs.
- [x] TASK-004 [type=assurance] [req=REQ-004] [ac=AC-004] [paths=docs/reports/critic/**,docs/reports/reviews/**,docs/reports/verification/**] Complete final fresh Critic, Reviewer, and Verifier evidence and lifecycle bindings.
- [x] TASK-005 [type=requirement] [req=REQ-005] [ac=AC-005] [paths=.agent/active-work-block.json,FILE_REGISTRY.yml,PROJECT_MAP.md,docs/reports/closeout/**] Validate and commit the active READY parent, create exactly one canonical inactive terminal child, validate the allowlist, and perform the exact subject push.

The only implementation paths in CT-002 are
`.codex/scripts/lifecycle.py` and `scripts/test-subagent-topology.py`.
