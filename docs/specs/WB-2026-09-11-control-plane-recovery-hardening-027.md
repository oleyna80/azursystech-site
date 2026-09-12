---
artifact_type: specification
work_block_id: WB-2026-09-11-control-plane-recovery-hardening-027
revision: recovery-successor-r1
status: approved
---

# Specification — control-plane recovery hardening

This is a recovery continuation of the existing Work Block, bound to the
successor execution surface `feat/control-plane-recovery-hardening-027-r1`.
It does not create a new architecture or expand the approved scope.

## Objective

Repair the two evidenced control-plane defects: make both gate-fixture
harnesses execute against a runnable disposable repository, and provide a
narrow Owner-authorized recovery lane for missing or corrupted active Work
Block state without weakening normal fail-closed admission.

## Requirements

- REQ-001: Both `.claude` and `.codex` gate-fixture harnesses materialize the
  minimal executable hook dependencies, repository markers, and Git context
  required by the compatibility hooks and evaluation validator.
- REQ-002: A fixture hook-launch failure is reported as an error/failing
  fixture, never reclassified as a functional ALLOW or DENY result.
- REQ-003: The bounded recovery command accepts no arguments, resolves only
  the script-owned current Git worktree, requires the repository markers and
  canonical inactive template, atomically replaces missing/corrupted state,
  and refuses valid active state or foreign/arbitrary paths.
- REQ-004: Normal hooks remain fail-closed for missing, malformed,
  unsupported, or active Work Block state; recovery is not a generic bypass.
- REQ-005: Canonical inactive identity is defined by the full approved default
  template; harmless closeout metadata may not make an otherwise incomplete
  inactive record appear canonical.
- REQ-006: Regression evidence covers positive recovery, active refusal,
  normal-hook denial, unsafe template denial, launch errors, path binding,
  canonical variants, and lifecycle closure fields.
- REQ-007: The implementation is limited to the four approved source paths;
  coordination artifacts are reconstructed through the current lifecycle.
  `scripts/subagent_topology.py`, application code, default branch, remote
  refs, deployment, credentials, and predecessor worktree are out of scope.

## Acceptance criteria

- AC-001 [req=REQ-001,REQ-002]: Both fixture suites pass from repository root,
  exercise actual hook launch, and fail explicitly on missing dependency or
  non-zero hook launch.
- AC-002 [req=REQ-003,REQ-004]: The recovery matrix passes for missing and
  malformed state, while normal hooks deny those states and valid active state
  remains unchanged.
- AC-003 [req=REQ-003,REQ-005]: Recovery succeeds only in the script-owned
  repository with required markers and canonical template, uses durable
  atomic replacement, and rejects unsafe template/path/argument variants.
- AC-004 [req=REQ-006]: Focused and relevant current repository suites pass
  with exact commands and exit codes recorded in assurance artifacts.
- AC-005 [req=REQ-007]: The candidate contains no changes outside the approved
  source or coordination write-sets and does not mutate predecessor or remote
  state.

## Boundaries

In scope: the two fixture harnesses, the bounded recovery helper, its focused
matrix, current Work Block coordination, and assurance evidence. Out of scope:
generic recovery, hook disabling, arbitrary writers, topology implementation
changes, application/dependency/database changes, push, merge, deployment,
branch/tag cleanup, and predecessor-worktree repair.
