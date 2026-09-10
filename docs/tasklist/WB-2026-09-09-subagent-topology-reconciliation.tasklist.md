---
schema_version: 1
artifact_type: tasklist
work_block_id: WB-2026-09-09-subagent-topology-reconciliation
specification: docs/specs/WB-2026-09-09-subagent-topology-reconciliation.md
status: in_progress
---

# Tasklist — Subagent topology reconciliation

- [ ] TASK-001 [type=requirement] [req=REQ-001,REQ-002,REQ-003,REQ-007] [ac=AC-001,AC-002] [paths=docs/specs/WB-2026-09-09-subagent-topology-reconciliation.md,docs/plans/WB-2026-09-09-subagent-topology-reconciliation.md,docs/reports/requirements-quality-WB-2026-09-09-subagent-topology-reconciliation.md,docs/reports/traceability-WB-2026-09-09-subagent-topology-reconciliation.md,docs/reports/consistency-WB-2026-09-09-subagent-topology-reconciliation.md,docs/reports/capability/WB-2026-09-09-subagent-topology-reconciliation.md,docs/reports/critic/WB-2026-09-09-subagent-topology-reconciliation.md] [owner=Orchestrator] [depends=none] Reconstruct and validate the Define package, run the bounded Critic/Reviewer/Verifier role-capability probes, and resolve the first Critic SUPPLEMENT. Done when traceability and consistency are READY and a fresh Critic approves; later assurance bindings are not part of this task.
- [ ] TASK-002 [type=enabling] [req=-] [ac=-] [paths=FILE_REGISTRY.yml,PROJECT_MAP.md,.agent/active-work-block.json] [owner=Orchestrator] [depends=TASK-001] Project the Work Block in `PROJECT_MAP.md` and `FILE_REGISTRY.yml`, then perform the `open` transition last and validate the active state before any source write. Done when the active state matches the approved branch/base/spec/write-set and the gate is READY with the Critic binding.
- [ ] TASK-003 [type=requirement] [req=REQ-001,REQ-002,REQ-003,REQ-004,REQ-005] [ac=AC-001,AC-003,AC-004,AC-005] [paths=.agent/active-work-block.default.json,.agent/ROSTER.md,.agent/workflows/sdd-protocol.md,governance/authority.md,governance/lifecycle.md,governance/runtime-capabilities.md,runtimes/codex/README.md,.codex/critic.md,.codex/hooks/pre_tool_use_policy.py,.codex/hooks/subagent_context.py,.codex/hooks/verification-gate.sh,.codex/scripts/lifecycle.py,scripts/validate-release-state.py,scripts/subagent_topology.py,scripts/test-subagent-topology.py,scripts/test-release-state-contracts.py] [owner=Coder] [depends=TASK-002] Implement the canonical evidence schema, admission/closeout checks, context metadata, policy-dimension reconciliation, and deterministic positive/adversarial tests. Done when the sole Coder reports only approved source paths, all focused checks pass, and no unplanned dependency/config/DB change occurs.
- [ ] TASK-004 [type=requirement] [req=REQ-006] [ac=AC-006] [paths=docs/reports/process-feedback/WB-2026-09-09-subagent-topology-reconciliation.md] [owner=Orchestrator] [depends=TASK-003] Record the failed first-session friction observation and any degraded condition after implementation. Done when the Process Feedback report points to runtime evidence or explicitly records its limitation; pre-open capability and Critic artifacts remain owned by TASK-001.
- [ ] TASK-005 [type=assurance] [req=REQ-003,REQ-004,REQ-005] [ac=AC-002,AC-003,AC-004,AC-005] [paths=.agent/active-work-block.json,.agent/verification-gate.md,.codex/write-gate.md,docs/reports/reviews/WB-2026-09-09-subagent-topology-reconciliation.md,docs/reports/verification/WB-2026-09-09-subagent-topology-reconciliation.md,docs/reports/drift/WB-2026-09-09-subagent-topology-reconciliation.md] [owner=Orchestrator] [depends=TASK-003] Freeze the candidate, record post-freeze Reviewer/Verifier bindings, obtain separate native assurance, and run Drift. Done when both bindings match the frozen revision and verdicts are READY, or the actual DEGRADED/BLOCKED condition is recorded without substitution.
- [ ] TASK-006 [type=documentation] [req=-] [ac=-] [paths=memory_bank/context.md,memory_bank/progress.md,memory_bank/decisions.md,memory_bank/orchestrator-log.md,memory_bank/review-log.md,FILE_REGISTRY.yml,PROJECT_MAP.md,docs/reports/closeout/WB-2026-09-09-subagent-topology-reconciliation.md] [owner=Orchestrator] [depends=TASK-005] Synchronize Process Feedback, lifecycle status, registry/projections, and closeout evidence; publish only the exact subject refspec. Done when canonical inactive validation passes, the final candidate SHA is recorded, and the Owner integration-review handoff is complete.

## Required topology

Native read-only Critic → one scoped Coder → freeze → native read-only
Reviewer ∥ native read-only Verifier. Each assurance role must have a distinct
native execution identifier and observable worktree evidence. No parallel
writers; no main-thread substitution while native capability is available.

## Expected final result

The candidate adds executable topology admission and closeout checks, preserves
the existing session-root and security-isolation guards, passes focused and
release-state tests, and has separate native Critic, Reviewer, and Verifier
evidence bound to the frozen revision. A failed or unavailable required role
remains explicitly `DEGRADED`/`BLOCKED`; it is never silently replaced. The
exact subject candidate may be published only after closeout is valid, and the
Owner receives the SHA for integration review.

## Execution mode and start gates

Execution mode: end-to-end autonomous inside the approved Work Block scope.
Before implementation, the Define task must have a fresh Critic approval, the
capability report must be fresh, and the root/branch/baseline must match. The
Coder is admitted only after the projection/open task activates the exact
write-set and Critic binding.

## Resolve-before-start and in-flight handling

Resolve before implementation: missing Define authority evidence, unresolved
Critic findings, scope or ownership ambiguity, a failed capability probe, or a
root/branch/baseline mismatch. Resolve during execution: deterministic test
failures, documentation drift, and report-linkage defects that stay within the
approved write-set. Return to Define for dependency, configuration, database,
deployment, authority, security-boundary, or scope changes.

## Retrospective and closeout evidence

At closeout, record the first-session root-inheritance friction only if the
canonical Process Feedback evidence contract is satisfied, synchronize the
memory-bank operational records, record Reviewer/Verifier execution bindings,
run Drift, validate canonical inactive state, and document residual risks. The
closeout report must distinguish verification, commit, publication, merge, and
deployment; this Work Block stops before Owner integration review.
