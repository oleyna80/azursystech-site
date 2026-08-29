# Repository worktree and checkout audit — 2026-08-29

No prune, removal, deletion, reset, clean, checkout, or stash was run.

| Path / record | Registration, ref and state | Class / advisory disposition |
|---|---|---|
| `/home/azur/Projects/WSL/azursystech` | primary; `feat/creation-site-internet-nice` `9d2b23b`; 27 dirty paths | DIRTY_PRESERVE; no action |
| `/home/azur/Projects/WSL/azursystech/.codex/worktrees/showcase-production-multizone-github` | registered; `agent/showcase-production-multizone-github` `acbb371`; clean | SAFE_WORKTREE_REMOVE after Owner gate; remote intent is represented |
| `/tmp/azursystech-shared-analysis-surface` | missing registered gitdir; `515bb6d` | SAFE_PRUNE_RECORD |
| `/tmp/azursystech-wb-2026-08-25-guide` | missing registered gitdir; `be43e8e` | SAFE_PRUNE_RECORD |
| `/home/azur/Projects/WSL/azursystech-branch-audit` | unregistered clean `main` `2fc0fbd` | SAFE_LOCAL_DIRECTORY_DELETE; stale audit evidence |
| `/home/azur/Projects/WSL/azursystech-pr20-p1-repair` | unregistered clean `515bb6d` | SAFE_LOCAL_DIRECTORY_DELETE; evidence now repository-owned |
| `/home/azur/Projects/WSL/azursystech-pr20-second-p1-baseline` | unregistered clean detached `fb5a743` | SAFE_LOCAL_DIRECTORY_DELETE; contained by repair evidence |
| five `azursystech-pr20-second-p1-*` review/drift/verification checkouts | unregistered detached `fb5a743`; each dirty (10 modified) | DIRTY_PRESERVE |
| `/home/azur/Projects/WSL/azursystech-wb-2026-08-28-lifecycle-normalization` | unregistered clean `55fb483` | SAFE_LOCAL_DIRECTORY_DELETE; closeout is repository-owned |

All clean-directory claims are contingent on the listed repository evidence
remaining available at execution time; dirty locations are excluded from deletion.
