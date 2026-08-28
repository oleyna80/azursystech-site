# Shared Operational Context

## Current Work Block

- ID: WB-2026-08-28-repository-lifecycle-normalization
- Subject branch: wb/2026-08-28-repository-lifecycle-normalization
- Base: 96dbd44102785005bfd23b0f99192f5bfeb17e68
- Stage: Repository lifecycle SSOT normalization and operational specification-binding correction
- Define Quality: READY
- Critic: SUPPLEMENT adopted for the operational active-record and specification-binding P1s
- Current correction: the release-state validator resolves the canonical active
  plan from registry/Project Map, cross-checks its Work Block ID against the
  operational JSON, parses the declared specification frontmatter, and requires
  its artifact type and Work Block ID to match the canonical active plan. It
  fails closed for missing, malformed, stale, divergent, or wrong-existing-
  specification state. Disposable fixtures cover matching and divergent projections;
  the workflow contract also covers specification-path changes.
- Fresh repository-side Review and Verification are READY and Drift is ALIGNED
  for this correction. This shared record asserts no exact final SHA, remote
  equality, or GitHub CI result.
- Source Write Gate: READY for the explicit Work Block write-set

## Boundaries

The active Work Block is `WB-2026-08-28-repository-lifecycle-normalization`.
It normalizes repository-owned lifecycle evidence after the prior shared-context
Work Block. A timestamped branch/worktree inventory is advisory only: remote
branch deletion, local worktree prune/deletion, push, PR mutation, merge, and
deployment remain separately Owner-controlled.

The original checkout had unrelated dirty and untracked paths and was preserved.
This Work Block uses an isolated worktree. The frozen
WB-2026-08-25-worktree-ssot-binding was not modified. Publication and merge remain
Owner-controlled; deployment, database mutation, and secret/config change are
separately unauthorized. The earlier shared-context P1 correction is covered by
a regression fixture and the existing control-plane workflow. The current P1
preserves raw Git pathnames for validator checks and has matching local
assurance. This shared-memory reconciliation remains local-only: push, PR
mutation, merge, deployment, and production authority are not granted.

## Source of truth

Read AGENTS.md, governance/, .agent/active-work-block.json, the Work Block
specification and plan, then the reports under docs/reports/. Durable engineering
guidance is in docs/engineering-memory/. This file is a shared orientation
record, not an authority grant.
