# Shared Operational Context

## Current Work Block

- ID: WB-2026-08-25-shared-analysis-surface
- Subject branch: wb/2026-08-25-shared-analysis-surface
- Base: 2fc0fbd6bd996681edfc4351a581f9543dba4fb0
- Synchronization provenance: 1a019d2b80f775a07248499b666dc32767ed90be
- Stage: Repository-side shared-memory reconciliation for the current P1
- Define Quality: READY
- Critic: Define APPROVE; follow-on P1 SUPPLEMENT adopted
- Synchronization: complete
- Current REQ-005 P1 correction: the validator consumes original Git index
  pathnames through `git ls-files -z`, byte-NUL splitting, and `os.fsdecode`, so
  Git C-quoted display output cannot bypass protected-prefix checks. Regression
  fixtures force `core.quotePath=true` and reject non-ASCII protected paths plus
  newline and tab pathnames with category diagnostics. The earlier
  `private_evidence` root-trigger and `/**` semantics correction is historical.
- Assurance for the NUL-path correction is repository-side Review READY,
  Verification READY, and Drift ALIGNED. This shared record asserts no exact
  final SHA, remote equality, or GitHub CI result.
- Source Write Gate: READY for the explicit Work Block write-set

## Boundaries

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
