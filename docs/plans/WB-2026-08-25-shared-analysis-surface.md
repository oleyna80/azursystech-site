---
artifact_type: work_block
work_block_id: WB-2026-08-25-shared-analysis-surface
status: repository-side-closeout-complete
revision: v1
---

# Work Block Plan: Shared Analysis Surface

## Metadata

- Objective: publish a minimal safe GitHub-readable project-analysis surface.
- Governance: Managed.
- Subject branch: wb/2026-08-25-shared-analysis-surface.
- Base: 2fc0fbd6bd996681edfc4351a581f9543dba4fb0.
- Original checkout: dirty and preserved; implementation is isolated in this worktree.
- Frozen exclusion: WB-2026-08-25-worktree-ssot-binding was not present in the committed
  baseline inventory and is not modified.

## Explicit write-set

docs/specs/WB-2026-08-25-shared-analysis-surface.md,
docs/plans/WB-2026-08-25-shared-analysis-surface.md,
docs/tasklist/WB-2026-08-25-shared-analysis-surface.tasklist.md,
the matching Define/assurance reports, .gitignore, PROJECT_MAP.md,
FILE_REGISTRY.yml, docs/project-context.md, the four allowlisted
memory_bank/*.md files, scripts/validate-shared-context.py,
scripts/test-validate-shared-context.py,
.github/workflows/control-plane-contracts.yml, and the new Work Block
coordination gates/active state.

## Implementation decisions

1. The four operational-memory files are newly authored from committed evidence
   and explicitly unknown state; stale ignored local memory is not promoted.
2. .env.vps.example remains allowed as an existing non-secret template; all
   other value-bearing .env and .env.* paths are forbidden by validation.
3. Git index checks are the source of truth for publication safety. Filesystem
   presence alone is insufficient.
4. Existing .codex/worktrees/ content remains in place and is protected by the
   ignore rule.
5. The shared-context regression fixture and validator run in the existing
   control-plane workflow so the P1 boundary cannot remain present-only.
6. The control-plane workflow must also trigger when any validator-protected
   input class changes: root or nested `.env*`, `memory_bank/**`,
   `docs/project-context.md`, `.codex/worktrees/**`, or `private_evidence/**`.
   The regression fixture reads both actual workflow trigger lists and fails if
   their protected trigger contract is removed.

## Stage plan

- Define: specification, traceability, consistency, and Critic evidence.
- Execute: update the ignore boundary, navigation pointers, safe context files,
  and deterministic validator.
- Assure: Reviewer, Verifier, Drift, isolated clean-clone check, and frozen diff
  inspection.
- Close: prepare the repository-side lifecycle package and the Owner-controlled
  handoff contract. Resolve exact remote revision and CI externally after the
  last repository commit; do not push or merge.

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

The initial P1 assurance evidence is historical after a second P1 correction
extended protected-input workflow trigger coverage and its regression contract.
That technical delta received an independent APPROVE review. The full candidate
now has repository-side Review and Verification READY plus fresh independent
Drift ALIGNED. The final local corrective commit may proceed.
The package deliberately contains no current PR/CI snapshot or final remote SHA.
The Owner-controlled publication and merge boundary remains in force; exact
remote evidence is resolved externally after the last repository commit.
