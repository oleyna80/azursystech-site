---
artifact_type: specification
work_block_id: WB-2026-09-08-active-work-block-state-recovery
revision: amendment-recovery-v3
status: approved
---

# Specification — active Work Block state recovery

## Objective

Recover missing or corrupt operational Work Block state without making normal
hooks permissive, and prevent completed Work Blocks from publishing or closing
with stale active authority. Successful closeout must materialize canonical
inactive state, while release projections and terminal publication agree that
no Work Block is active.

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
- REQ-007: the dedicated recovery command proves that its cwd resolves to the
  same Git worktree as the script itself and verifies required AzurSysTech
  repository markers before it can write. It exposes no arbitrary root,
  payload, template, or output-path writer interface.
- REQ-008: recovery atomically materializes the canonical default state for a
  missing or malformed/corrupt operational record, refuses valid active state,
  and leaves valid canonical inactive state unchanged.
- REQ-009: lifecycle transitions use `.agent/active-work-block.default.json`
  as their sole canonical producer, reject syntactically valid templates that
  retain specification or integration/admission authority, and persist
  replacements with file fsync, atomic replacement, and parent-directory fsync.
- REQ-010: normal hooks remain fail-closed for missing/corrupt state; only the
  dedicated recovery path may repair that condition.

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
- AC-007 [req=REQ-007]: recovery permits only the script-owned current Git
  worktree with required AzurSysTech markers; arbitrary
  root/template/output/payload arguments, non-Git cwd, missing markers, and a
  real foreign Git repository are denied.
- AC-008 [req=REQ-008]: the regression matrix passes for missing, malformed,
  corrupt, active, and canonical inactive records without discarding active
  authority.
- AC-009 [req=REQ-009]: template integrity denies malformed and syntactically
  valid unsafe templates (including residual specification or
  integration/admission authority) without creating or replacing state, and
  durability checks prove fsync(file) -> atomic replace -> fsync(parent).
- AC-010 [req=REQ-010]: normal lifecycle/hook admission denies missing or
  malformed state, while only the dedicated recovery path repairs it.

## Boundaries

In scope: lifecycle producer, recovery helper, release-state validator,
recovery and terminal-publication regression tests, Work Block documents,
assurance evidence, and closeout projections. Out of scope: application roots,
dependencies, database,
deployment, credentials, `main` mutation, merge, and hook bypass.
