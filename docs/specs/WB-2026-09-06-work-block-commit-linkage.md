# Specification — WB-2026-09-06-work-block-commit-linkage

## Objective

Adapt a cooperative local `commit-msg` control to the current schema-v3
canonical lifecycle. An active Work Block requires exactly one matching Git
trailer; an inactive lifecycle permits ordinary commits.

## Requirements

- REQ-001: Read `.agent/active-work-block.json` with structured JSON parsing.
- REQ-002: Use exactly one canonical `Work-Block: <WB-ID>` trailer when active.
- REQ-003: Block an active commit with a missing trailer and name the expected ID.
- REQ-004: Block multiple `Work-Block` trailers; never choose one silently.
- REQ-005: Block malformed values matching neither `WB-YYYY-MM-DD-slug` nor
  the repository's canonical ID format.
- REQ-006: Block a valid trailer that does not match `work_block_id`.
- REQ-007: Require active `subject_branch` to match the attached branch; block
  stale state and detached HEAD.
- REQ-008: Enforce linkage while an active WB is frozen with `write_gate.status`
  `BLOCKED`; write authority and commit linkage remain separate.
- REQ-009: Allow ordinary commits when canonical `work_block_id` is empty.
- REQ-010: Fail closed for missing, malformed, or unsupported canonical state,
  and for an active state without a valid subject branch.
- REQ-011: Document that the local hook is cooperative and bypassable with
  `git commit --no-verify`, and does not cover GitHub/API merge paths.
- REQ-012: Preserve no-argument bootstrap behavior while adding explicit,
  non-silent install and read-only check modes for `.githooks`.

## Acceptance criteria

- AC-001 [req=REQ-001,REQ-002]: active matching trailer passes deterministically.
- AC-002 [req=REQ-003]: active missing trailer blocks with expected WB ID.
- AC-003 [req=REQ-004,REQ-005,REQ-006]: duplicate, malformed, and mismatched
  trailers block deterministically.
- AC-004 [req=REQ-007]: stale branch and detached active state block.
- AC-005 [req=REQ-008]: frozen active state still requires matching linkage.
- AC-006 [req=REQ-009]: inactive and canonical closed state allow ordinary commit.
- AC-007 [req=REQ-010]: corrupted/missing state cannot silently disable control.
- AC-008 [req=REQ-012]: default bootstrap remains backward-compatible and hook
  installation is explicit; check mode is read-only.
- AC-009 [req=REQ-003,REQ-004,REQ-005,REQ-006,REQ-007,REQ-008,REQ-009,REQ-010,REQ-012]: deterministic disposable fixtures cover all required cases and CI runs them.
- AC-010 [req=REQ-011]: cooperative `--no-verify` limitation is explicit.
- AC-011 [req=REQ-001,REQ-012]: no application or framework paths change.
- AC-012 [req=REQ-001,REQ-002,REQ-012]: lifecycle, traceability, and
  release-state validations pass after closeout.

## Boundaries

In scope: `.githooks/commit-msg`, its fixture script, `scripts/bootstrap.sh`,
the control-plane workflow if needed, lifecycle coordination, and WB evidence.
Out of scope: application paths, skills, provider/media logic, deployment,
framework, schema changes, historical branch mutation, and real shared
`core.hooksPath` activation.
