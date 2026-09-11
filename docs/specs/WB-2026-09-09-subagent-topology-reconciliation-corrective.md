---
artifact_type: specification
work_block_id: WB-2026-09-09-subagent-topology-reconciliation
status: approved
revision: corrective-v1
base_commit: c8b8954cee3218b7a670aa1049ac326ef98d390a
---

# Corrective specification — topology freshness and cooperative finalization

## Objective

Resolve the two bounded blockers found after the completed topology
reconciliation without changing application behavior, topology architecture,
freshness policy, or external authority boundaries.

The corrective source write-set is exactly:

- `.codex/scripts/lifecycle.py`
- `scripts/test-subagent-topology.py`

The historical candidate `89e76cbfd02994d6f225bac1354fbdebe6478672` and
identity `content-sha256:ece3a5ae5eebfd6daedc4ad01b62675ee06b88f5bbd9951d94a7f0eb732c62ab`
remain baseline evidence only. They do not claim coverage of this revision.

## Requirements

- REQ-001: Lifecycle topology validation must accept an optional internal fixture clock while production callers that omit it continue using real current UTC.
- REQ-002: The production freshness limit must remain exactly 24 hours, including stale and future timestamp rejection.
- REQ-003: Finalization must remain cooperative project-local sequencing with exact provisional execution, provenance, report, result, duplicate, and transition validation, without caller authentication.
- REQ-004: The corrective candidate must be covered by fresh distinct native Critic, Reviewer, and Verifier evidence bound to the correct revision.
- REQ-005: The corrected Work Block must satisfy release-state, Process Feedback, topology, and exact active-parent-to-terminal-child publication contracts.

## Acceptance criteria

- AC-001 [req=REQ-001]: Deterministic lifecycle tests pass repeatedly with one explicit fixture clock propagated through every tested topology-validation path, while omitted-clock runtime calls use real current UTC.
- AC-002 [req=REQ-002]: Focused tests reject evidence older than 24 hours and future evidence outside the existing tolerance without changing the production freshness constant.
- AC-003 [req=REQ-003]: Focused tests reject caller-supplied actor authority, mismatched provisional provenance, mismatched execution/report/result records, and duplicate or conflicting verification results.
- AC-004 [req=REQ-004]: Assurance records contain fresh native role bindings with distinct execution/dispatch IDs, exact root/branch/runtime tuple, and the corrected frozen identity.
- AC-005 [req=REQ-005]: Release-state, Process Feedback, topology, diff, active-parent, terminal-allowlist, and exact non-force subject publication checks pass without source or architecture changes.

## Approved decisions

`FRESHNESS = 24 hours` remains the production rule. Lifecycle helpers that
invoke topology validation may accept an internal optional keyword clock for
deterministic tests. Production callers omit it, so topology validation keeps
using real current UTC. No CLI, environment, configuration, timestamp
spoofing, or freshness-policy override is introduced.

Finalization is cooperative project-local process control. The Verifier
independently returns a verdict; the lifecycle helper validates the exact
provisional execution provenance, execution ID, frozen candidate/provenance,
authoritative report binding, result, and valid transition. The helper does
not authenticate an Orchestrator caller and accepts no caller-supplied actor
authority. Runtime separation, GitHub controls, credentials, OS/workflow
boundaries, and Owner-controlled actions remain the consequential authority
boundaries.

## Acceptance criteria

- Every tested lifecycle path passes one explicit fixture clock through all
  topology validations it invokes.
- Omitted clock preserves real current UTC behavior and the unchanged 24-hour
  freshness limit.
- Existing stale and future-timestamp denial fixtures remain rejected,
  including future values outside the permitted tolerance.
- A caller-supplied role label cannot establish authority; no actor parameter,
  token, signature, or local authentication state exists.
- Exact provisional Verifier execution/provenance remains mandatory.
- Mismatched execution, report, or result and duplicate/conflicting result
  records remain rejected.
- Focused topology tests pass repeatedly independent of wall-clock date.
- The corrective candidate receives fresh native Critic, Reviewer, and
  Verifier evidence with distinct IDs and valid frozen-revision bindings.
- Release-state, Process Feedback, Drift, and publication topology contracts
  remain satisfied before the exact non-force subject push.

## Exclusions

No application code, database, dependency, deployment, credential, unrelated
governance, topology architecture, hard-stop policy, or publication authority
change is authorized.
