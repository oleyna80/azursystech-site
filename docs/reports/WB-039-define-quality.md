---
artifact_type: define_quality
work_block_id: WB-039
specification: docs/specs/WB-039.md
revision: v2
status: READY
strategy: maintenance_mode
---

# WB-039 Define quality

## Requirements review

REQ-001 through REQ-006 define a single runtime-neutral, exact-scope,
disabled-by-default Maintenance Mode with immutable hard stops, bounded
cooperative downgrades, durable audit evidence, reversible activation, and a
verified same-repository handoff. Git Transaction, Contract Reader, Terminal
Transaction, Assurance, application source, and external publication remain
excluded.

## Traceability

`python3 scripts/validate-define-traceability.py --spec docs/specs/WB-039.md --tasks docs/tasklist/WB-039.tasklist.md --json` returned `READY` (6 requirements, 8 acceptance criteria, 7 tasks, no errors). The seven tasks cover every requirement and acceptance criterion; source and coordination paths are explicit.

## Consistency and authority review

- The refreshed audit contract supersedes the prior narrow Publication
  Bootstrap. This Define set names Maintenance Mode as the current strategy.
- Hard stops remain in the provider-neutral shared policy. The new evaluator is
  only a cooperative downgrade route and cannot grant normal lifecycle
  approval.
- Disabled or invalid state preserves current enforcement. Enabled state binds
  repository, branch, base, and paths before any AUDIT/WARN result.
- Both Codex and Claude call the same module, avoiding divergent runtime
  semantics.
- Owner-authorized bootstrap is reversible and records a blocked normal
  transition; it does not mutate normal lifecycle state to claim OPEN.

## Critic status

Independent Define Critic was attempted through three available agent slots and
each was unavailable due the external usage limit at 2026-09-27. This is a
capacity status, not an approval or a waiver. Owner-authorized Maintenance
Bootstrap permits bounded implementation; Critic must be rerun if capacity
returns before WB-039 completion.

Verdict: READY for Define evidence; normal lifecycle OPEN is not claimed.
