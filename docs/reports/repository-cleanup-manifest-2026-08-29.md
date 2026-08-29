# Repository cleanup manifest — 2026-08-29

**Advisory only.** Bound to `origin/main` `feb38b0c8eb13df73024d5a8f7e7a23dc9d42fd1`.
This manifest grants no authority. Before execution, the Owner must approve and
each listed SHA/path/clean state must be refreshed.

## REMOTE_DELETE_BATCH

Each row is safe only because its intended change is represented on current main
or its exact tip is an ancestor; dependency check is `no recovery dependency`
unless noted.

| Branch | Expected remote SHA | Why safe | Dependency check |
|---|---|---|---|
| agent/github-capability-authority-migration | 731c2d213b0785f01839ee6f9c9f4d18b6edbb0e | ancestor | none |
| agent/showcase-production-multizone-github | acbb371d610c9c6b6f4ff7eb7435842d8503d743 | ancestor | clean registered worktree is separately listed |
| feat/automatiser-demandes-clients-guide | be43e8e7f6fac06cb69be9ec1a82e2c0d23ea0fc | represented squash intent | stale record separately listed |
| feat/english-translation | d61113e27b6974f3288b805d3bfd1a108a14c5e6 | represented squash intent | none |
| feat/showcase-links-and-immobilier-fix | 77d0811b5ab98c7068e971b5ae33853294873bbc | ancestor | none |
| feat/technical-seo-multilingual-integrity | a6e02a9a30b856574f3ccfe1cfe65ab86f1e21ce | represented squash intent | none |
| feat/web-development | 6734db51e2a7392340d31d4e0e5af7b34c5ec255 | ancestor | none |
| fix/worktree-ssot-binding | 68905f04b1bfb40b229feb9e5d78849153445d6e | represented squash intent | none |
| hotfix/deploy-ssh-action | 23255cab6687a132885f97472d7b709bcceb6d29 | ancestor | none |
| infra/vps-runtime-consolidation | 5df95d758afa7053374a3ffc5da5e17283a27da5 | ancestor | none |
| sync/agentic-sdlc-framework | 92df4227f83415968c799534a8d9ba4e577cdfb2 | ancestor | none |
| wb/2026-08-25-shared-analysis-surface | 515bb6dd83e6c883dc76d67d87277b9b9d0b72b5 | represented squash intent | stale record separately listed |
| wb/2026-08-28-repository-lifecycle-normalization | 55fb4838082c4f487af3091109b4b2179c9ce06b | represented squash intent | clean directory separately listed |

## LOCAL_WORKTREE_REMOVE_BATCH

| Exact path | Expected branch/SHA | Expected state | Proposed command |
|---|---|---|---|
| `/home/azur/Projects/WSL/azursystech/.codex/worktrees/showcase-production-multizone-github` | agent/showcase-production-multizone-github / acbb371d610c9c6b6f4ff7eb7435842d8503d743 | clean | `git -C /home/azur/Projects/WSL/azursystech worktree remove /home/azur/Projects/WSL/azursystech/.codex/worktrees/showcase-production-multizone-github` |

## LOCAL_PRUNE_OR_DIRECTORY_BATCH

| Record or directory | Evidence / proposed action |
|---|---|
| `/tmp/azursystech-shared-analysis-surface` | missing registered gitdir at `515bb6d`; `git -C /home/azur/Projects/WSL/azursystech worktree prune` |
| `/tmp/azursystech-wb-2026-08-25-guide` | missing registered gitdir at `be43e8e`; same single prune batch |
| `/home/azur/Projects/WSL/azursystech-branch-audit` | clean unregistered stale audit checkout; delete directory only after refresh |
| `/home/azur/Projects/WSL/azursystech-pr20-p1-repair` | clean unregistered historical evidence; delete directory only after refresh |
| `/home/azur/Projects/WSL/azursystech-pr20-second-p1-baseline` | clean detached historical baseline; delete directory only after refresh |
| `/home/azur/Projects/WSL/azursystech-wb-2026-08-28-lifecycle-normalization` | clean unregistered predecessor checkout; delete directory only after refresh |

## PRESERVE_OR_RECOVER

| Branch or path | Classification | Reason / future action |
|---|---|---|
| main | KEEP | primary branch; retain |
| baseline/azursystech-441b134d | KEEP | explicit preservation baseline; retain |
| codex/media-production-skills-curation | RECOVER_INTENT | eight unmerged commits / 59 unique files; Owner-approved selective recovery or explicit abandonment required |
| feat/creation-site-internet-nice and canonical checkout | DIRTY_PRESERVE | attached canonical checkout with 27 unrelated dirty paths; reconcile separately, no destructive action |
| five dirty `azursystech-pr20-second-p1-*` checkouts | DIRTY_PRESERVE | detached assurance checkouts with ten modified paths each; retain until reconciled |

**STOP:** `OWNER_CLEANUP_GATE`. No command in this document has been executed.
