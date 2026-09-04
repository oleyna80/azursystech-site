# WB-2026-08-13 — Repository cleanup and schema-v3 reconciliation

## Stage

Stage 0 — Define and reconciliation only.

## Objective

Remove duplicate local Git worktree state and retire legacy SSH-signature
authorization materials from active navigation without losing historical audit
evidence. Prepare one clean, schema-v3 `github_capability` path for the later
Showcase production Work Block.

## Scope

- Inventory and classify the current worktrees, local branches, staged and
  untracked legacy authorization artifacts.
- Create an immutable inventory of historical authorization evidence.
- Keep deployment-recovery evidence as historical documentation, not active
  authority.
- Remove only Owner-confirmed duplicate local worktrees/branches and stale
  Git worktree metadata after the inventory is reviewed.

## Out of scope

- Showcase source, Docker, Compose, Nginx, deploy scripts, CI workflows, or
  production implementation.
- `git push`, remote-ref mutation, workflow dispatch, Docker publish, VPS/SSH,
  production deployment, database/data activity, secret changes, commits, or
  destructive bulk cleanup.
- Changing the contents of historical authorization JSON or SSH signature
  files. They remain audit evidence only.

## Authority and lifecycle

- Baseline: `257d529d4a81147b6f7dea29bd17f52228ea17d6` on `main` and
  `origin/main`.
- Active model: schema 3, `authority_mode=github_capability`.
- Governance profile: Managed coordination work; source write gate remains
  BLOCKED throughout this Work Block.
- DB action mode: none.
- External Hard Stops: remote publication, deploy, Docker/image publication,
  VPS/SSH, secrets, DB/data, destructive operations, and remote branch changes.
- Legacy SSH keygen/signature/authorization flow is retired and must not be
  reopened or developed.

## Inventory decision

1. Retain the dirty isolated candidate worktree and branch
   `agent/showcase-production-multizone-github`. It contains the only current
   Showcase implementation candidate and is not an authority record.
2. Remove only after a final pre-removal check: the clean duplicate worktree
   `/tmp/azursystech-showcase-production-multizone`, its matching local branch
   `agent/showcase-production-multizone`, the disposable clean clone created
   for prior intake, and the prunable missing verifier registration.
3. Preserve all legacy authorization artifacts and deployment-recovery reports
   as historical evidence. Exclude them from future Showcase write-sets and
   active lifecycle state.
4. Keep other local/remote feature branches out of this cleanup unless a
   branch-specific review proves that deletion is safe; no remote branch is in
   scope.

## Exact local-removal manifest

This manifest is frozen for the next Owner confirmation. It is intentionally
local-only and is not an authorization to mutate remote refs.

| Order | Exact target | Precondition recorded on 2026-08-13 | Action |
| --- | --- | --- | --- |
| 1 | `/tmp/azursystech-showcase-production-multizone` | registered worktree, branch `agent/showcase-production-multizone`, `HEAD=257d529d4a81147b6f7dea29bd17f52228ea17d6`, clean `git status --short` | remove this exact worktree only |
| 2 | `refs/heads/agent/showcase-production-multizone` | after order 1, confirm no worktree is checked out on it and `main..agent/showcase-production-multizone` is empty | delete this exact local branch only |
| 3 | `/tmp/azursystech-showcase-production-multizone-github-clean` | disposable intake clone, `HEAD=257d529d4a81147b6f7dea29bd17f52228ea17d6`, clean `git status --short` | remove this exact disposable clone only |
| 4 | registration for `/tmp/azursystech-hook-verifier.lncEB8` | `git worktree list --porcelain` declares it `prunable` because its gitdir file points to a non-existent location | prune this missing registration only |

Pre-check before every row: re-run its stated identity and cleanliness checks.
Post-check after every row: re-run the full `git worktree list --porcelain`,
`git branch -vv`, canonical `git status --short`, the retained candidate's
status, and all legacy-evidence SHA-256 values. Stop if any excluded item
changes. The retained worktree
`/home/azur/Projects/WSL/azursystech/.codex/worktrees/showcase-production-multizone-github`
and its branch are explicitly excluded.

## Acceptance criteria

- An inventory report gives origin path and SHA-256 for every known legacy
  authorization artifact.
- No legacy artifact is treated as current authority or included in the next
  Showcase Work Block.
- All removals are exact, local-only, prechecked, and Owner-confirmed.
- The retained Showcase candidate and canonical dirty user changes remain
  untouched by cleanup.
- A Critic resolves the cleanup plan before a destructive/local-removal stage.

## Next gate

Critic review of this plan, then an Owner-facing exact-removal manifest. No
removal occurs before that manifest is accepted.
