---
artifact_type: work_block
work_block_id: WB-2026-08-25-shared-analysis-surface
status: assurance-complete-awaiting-owner-action
revision: v1
---

# Work Block Plan: Shared Analysis Surface

## Metadata

- Objective: publish a minimal safe GitHub-readable project-analysis surface.
- Governance: Managed.
- Subject branch: wb/2026-08-25-shared-analysis-surface.
- Base: 9d2b23bfaca4a5af63030f77cc2d7c7559c8ec18.
- Original checkout: dirty and preserved; implementation is isolated in this worktree.
- Frozen exclusion: WB-2026-08-25-worktree-ssot-binding was not present in the committed
  baseline inventory and is not modified.

## Explicit write-set

docs/specs/WB-2026-08-25-shared-analysis-surface.md,
docs/plans/WB-2026-08-25-shared-analysis-surface.md,
docs/tasklist/WB-2026-08-25-shared-analysis-surface.tasklist.md,
the matching Define/assurance reports, .gitignore, PROJECT_MAP.md,
FILE_REGISTRY.yml, docs/project-context.md, the four allowlisted
memory_bank/*.md files, scripts/validate-shared-context.py, and the new
Work Block coordination gates/active state.

## Implementation decisions

1. The four operational-memory files are newly authored from committed evidence
   and explicitly unknown state; stale ignored local memory is not promoted.
2. .env.vps.example remains allowed as an existing non-secret template; all
   other value-bearing .env and .env.* paths are forbidden by validation.
3. Git index checks are the source of truth for publication safety. Filesystem
   presence alone is insufficient.
4. Existing .codex/worktrees/ content remains in place and is protected by the
   ignore rule.

## Stage plan

- Define: specification, traceability, consistency, and Critic evidence.
- Execute: update the ignore boundary, navigation pointers, safe context files,
  and deterministic validator.
- Assure: Reviewer, Verifier, Drift, isolated clean-clone check, and frozen diff
  inspection.
- Close: report exact revision and Owner-controlled publication handoff; do not
  push or merge.

## Risks and controls

- Risk: stale/private local memory is promoted. Control: content screening and
  authored minimal files only.
- Risk: an ignore exception accidentally publishes all memory. Control: explicit
  allowlist plus validator negative checks.
- Risk: PROJECT_MAP and active JSON diverge. Control: stable pointer and exact
  active-state evidence.
- Risk: unrelated dirty work is overwritten. Control: isolated worktree and no
  staging/reset/stash/cleanup of the original checkout.

## Current closeout

Define, implementation, Review, Verification, and Drift are complete against
the exact local commit. The Owner-controlled publication boundary remains in
force; no PR, push, merge, or deployment was performed.
