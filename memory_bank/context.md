# Shared Operational Context

## Current Work Block

- ID: WB-2026-08-25-shared-analysis-surface
- Subject branch: wb/2026-08-25-shared-analysis-surface
- Base: 2fc0fbd6bd996681edfc4351a581f9543dba4fb0
- Synchronization provenance: 1a019d2b80f775a07248499b666dc32767ed90be
- Stage: Repository-side P1 correction and assurance
- Define Quality: READY
- Critic: APPROVE
- Synchronization: complete
- Follow-on exact-head P1 correction: `private_evidence` root trigger coverage
  and strict `/**` regression semantics are locally corrected; full-candidate
  Review and Verification are READY and Drift is ALIGNED.
- Source Write Gate: READY for the explicit Work Block write-set

## Boundaries

The original checkout had unrelated dirty and untracked paths and was preserved.
This Work Block uses an isolated worktree. The frozen
WB-2026-08-25-worktree-ssot-binding was not modified. Publication and merge remain
Owner-controlled; deployment, database mutation, and secret/config change are
separately unauthorized. The first shared-context P1 correction is covered by a
  regression fixture and the existing control-plane workflow. A follow-on P1 adds
  the exact private-evidence root trigger and corrects trigger-pattern semantics.
  Fresh local Review and Verification cover the complete uncommitted candidate
  and Drift is ALIGNED. The repository-side
package is ready for its final local corrective commit; exact final revision and
GitHub CI result remain external handoff evidence after that commit.

## Source of truth

Read AGENTS.md, governance/, .agent/active-work-block.json, the Work Block
specification and plan, then the reports under docs/reports/. Durable engineering
guidance is in docs/engineering-memory/. This file is a shared orientation
record, not an authority grant.
