---
artifact_type: specification
work_block_id: WB-2026-09-08-active-work-block-state-recovery
revision: amendment-terminal-publication-v1
status: approved
---

# Specification — active Work Block state recovery

## Objective

Prevent a completed Work Block from publishing or closing with stale active
operational authority. Successful closeout must materialize the canonical
inactive `.agent/active-work-block.json` and the release projections must agree
that no Work Block is active.

## Requirements

- REQ-001: lifecycle successful closeout produces canonical inactive state with
  empty `work_block_id`, `subject_branch`, `base_commit`, and specification
  identity, an empty `write_set`, and `write_gate.status == BLOCKED`.
- REQ-002: release-state validation rejects inactive candidates retaining any
  active subject binding or source admission authority.
- REQ-003: deterministic regression tests cover stale active state in a
  closeout/merge candidate and preserve the coordination-only inactive commit
  boundary.
- REQ-004: the change is limited to lifecycle/release-state control-plane
  tooling and evidence; no main repair, hook bypass, merge, deploy, or
  application change is allowed.
- REQ-005: terminal subject publication is admitted only for one immediate
  Git-ancestry transition from a publication-eligible active parent of this
  Work Block to a canonical inactive closeout child.
- REQ-006: terminal publication remains literal, non-force, exact-subject,
  coordination-only, and fail-closed for arbitrary inactive state, wrappers,
  chaining, substitutions, default/protected destinations, tags, releases,
  deletion, and source/application mutation.

## Acceptance criteria

- AC-001 [req=REQ-001]: `lifecycle.py close --mode success-closeout` writes a
  canonical inactive state with the required empty identities and blocked gate.
- AC-002 [req=REQ-002]: `validate-release-state.py` reports READY only when the
  release projections and operational inactive state are mutually consistent.
- AC-003 [req=REQ-003]: regression fixtures fail for stale branch, base, or
  source write-set authority and pass for canonical inactive state.
- AC-004 [req=REQ-004]: only the approved control-plane write-set changes; no
  default-branch repair or hook bypass occurs.
- AC-005 [req=REQ-005]: a valid one-commit terminal closeout push is allowed
  only when parent assurance, subject binding, Work Block linkage, and child
  canonical inactive state are proven from committed history.
- AC-006 [req=REQ-006]: active publication remains allowed and all terminal
  negative regression cases are denied; release-state validation reports an
  inactive terminal candidate as READY.

## Boundaries

In scope: lifecycle producer, recovery helper, release-state validator and
deterministic tests, Work Block documents, assurance evidence, and closeout
projections. Out of scope: application roots, dependencies, database,
deployment, credentials, `main` mutation, merge, and hook bypass.
