# Repository worktree audit — 2026-08-28

**Scope:** read-only local inventory. No `worktree prune`, deletion, reset, or
cleanup command was run.

| Location / record | Class | Evidence and disposition |
| --- | --- | --- |
| canonical `azursystech` | DIRTY_PRESERVE | Attached to `feat/creation-site-internet-nice`; 27 unrelated changes. |
| `.codex/worktrees/showcase-production-multizone-github` | REGISTERED_PRESERVE | Attached to `agent/showcase-production-multizone-github`; clean at snapshot. |
| `/tmp/azursystech-shared-analysis-surface` registration | PRUNABLE_RECORD | Gitdir target is absent; do not prune without Owner authorization. |
| `/tmp/azursystech-wb-2026-08-25-guide` registration | PRUNABLE_RECORD | Gitdir target is absent; do not prune without Owner authorization. |
| `azursystech-branch-audit` | UNREGISTERED_CLEAN | Local main checkout; owner to decide retention. |
| `azursystech-pr20-p1-repair` | UNREGISTERED_CLEAN | Retained PR #20 repair checkout; preserves lifecycle evidence. |
| `azursystech-pr20-second-p1-baseline` | UNREGISTERED_CLEAN | Detached historical baseline. |
| `azursystech-pr20-second-p1-drift` and review/verification variants | UNREGISTERED_DIRTY_PRESERVE | Detached checkouts with local changes; preserve. |
| current isolated WB checkout | ACTIVE_VALID_SELF | Fresh clean branch rooted at immutable main base. |

Any later cleanup must enumerate exact paths, refresh status, and obtain a
separate Owner-approved local deletion/prune authority.
