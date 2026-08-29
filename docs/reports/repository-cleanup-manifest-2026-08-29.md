# Repository cleanup manifest and reconciliation — 2026-08-29

**Authority boundary:** this document was advisory during Phase 1. Phase 2
execution required a separate explicit Owner instruction and exact refreshed
preconditions. It does not authorize any future operation.

## REMOTE_DELETE_BATCH

| Branch | Expected remote SHA | Result | Dependency check |
|---|---|---|---|
| agent/github-capability-authority-migration | 731c2d213b0785f01839ee6f9c9f4d18b6edbb0e | EXECUTED | no registered dependency |
| agent/showcase-production-multizone-github | acbb371d610c9c6b6f4ff7eb7435842d8503d743 | EXECUTED | registered worktree removed only after clean-state match |
| feat/automatiser-demandes-clients-guide | be43e8e7f6fac06cb69be9ec1a82e2c0d23ea0fc | SKIPPED / PRESERVED | stale registered worktree remains |
| feat/english-translation | d61113e27b6974f3288b805d3bfd1a108a14c5e6 | EXECUTED | no registered dependency |
| feat/showcase-links-and-immobilier-fix | 77d0811b5ab98c7068e971b5ae33853294873bbc | EXECUTED | no registered dependency |
| feat/technical-seo-multilingual-integrity | a6e02a9a30b856574f3ccfe1cfe65ab86f1e21ce | EXECUTED | no registered dependency |
| feat/web-development | 6734db51e2a7392340d31d4e0e5af7b34c5ec255 | EXECUTED | no registered dependency |
| fix/worktree-ssot-binding | 68905f04b1bfb40b229feb9e5d78849153445d6e | EXECUTED | no registered dependency |
| hotfix/deploy-ssh-action | 23255cab6687a132885f97472d7b709bcceb6d29 | EXECUTED | no registered dependency |
| infra/vps-runtime-consolidation | 5df95d758afa7053374a3ffc5da5e17283a27da5 | EXECUTED | no registered dependency |
| sync/agentic-sdlc-framework | 92df4227f83415968c799534a8d9ba4e577cdfb2 | EXECUTED | no registered dependency |
| wb/2026-08-25-shared-analysis-surface | 515bb6dd83e6c883dc76d67d87277b9b9d0b72b5 | SKIPPED / PRESERVED | stale registered worktree remains and refreshed local record mismatched |
| wb/2026-08-28-repository-lifecycle-normalization | 55fb4838082c4f487af3091109b4b2179c9ce06b | EXECUTED | no registered dependency |

## LOCAL_WORKTREE_REMOVE_BATCH

| Exact path | Expected branch/SHA | Result | Preflight result |
|---|---|---|---|
| `/home/azur/Projects/WSL/azursystech/.codex/worktrees/showcase-production-multizone-github` | agent/showcase-production-multizone-github / acbb371d610c9c6b6f4ff7eb7435842d8503d743 | EXECUTED | registered, exact ref, tracked clean, no untracked files |

## LOCAL_PRUNE_OR_DIRECTORY_BATCH

| Record or directory | Result | Evidence / disposition |
|---|---|---|
| `/tmp/azursystech-shared-analysis-surface` | SKIPPED / PRESERVED | refreshed stale registration was `05bc097...`, not the separately authorized expected `515bb6d...`; no prune run |
| `/tmp/azursystech-wb-2026-08-25-guide` | SKIPPED / PRESERVED | retained because the authorized prune was a single batch and the other stale record mismatched |
| `/home/azur/Projects/WSL/azursystech-branch-audit` | EXECUTED | clean, unregistered, expected `2fc0fbd...`; removed under separate authorization |
| `/home/azur/Projects/WSL/azursystech-pr20-p1-repair` | EXECUTED | clean, unregistered, expected `515bb6d...`; removed under separate authorization |
| `/home/azur/Projects/WSL/azursystech-pr20-second-p1-baseline` | EXECUTED | clean, unregistered, expected `fb5a743...`; removed under separate authorization |
| `/home/azur/Projects/WSL/azursystech-wb-2026-08-28-lifecycle-normalization` | EXECUTED | clean, unregistered, expected `55fb483...`; removed under separate authorization |

## PRESERVE_OR_RECOVER

| Branch or path | Classification | Reason / required future action |
|---|---|---|
| main | PRESERVED / KEEP | primary branch; no action |
| baseline/azursystech-441b134d | PRESERVED / KEEP | explicit preservation baseline; no action |
| codex/media-production-skills-curation | PRESERVED / RECOVER_INTENT | selective recovery or explicit abandonment decision remains required |
| feat/creation-site-internet-nice and canonical checkout | PRESERVED / DIRTY_PRESERVE | current inventory is 4 modified plus 22 untracked paths; reconcile separately |
| five dirty `azursystech-pr20-second-p1-*` checkouts | PRESERVED / DIRTY_PRESERVE | each remains dirty; reconcile separately |
| feat/automatiser-demandes-clients-guide and wb/2026-08-25-shared-analysis-surface | PRESERVED / RE-AUDIT | dependent stale registrations require a new, exact authorization after re-audit |

Operational execution detail is recorded separately in
`docs/reports/repository-cleanup-execution-2026-08-29.md`. No further cleanup is
authorized by this document.
