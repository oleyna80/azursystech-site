# Shared Operational Context

## Current Work Block

- ID: WB-2026-08-25-shared-analysis-surface
- Subject branch: wb/2026-08-25-shared-analysis-surface
- Base: 9d2b23bfaca4a5af63030f77cc2d7c7559c8ec18
- Stage: Execute after Define
- Define Quality: READY
- Critic: APPROVE
- Source Write Gate: READY for the explicit Work Block write-set

## Boundaries

The original checkout had unrelated dirty and untracked paths and was preserved.
This Work Block uses an isolated worktree. The frozen
WB-2026-08-25-worktree-ssot-binding was not modified. No commit, push, merge,
deploy, database mutation, or secret/config change is authorized.

## Source of truth

Read AGENTS.md, governance/, .agent/active-work-block.json, the Work Block
specification and plan, then the reports under docs/reports/. Durable engineering
guidance is in docs/engineering-memory/. This file is a shared orientation
record, not an authority grant.
