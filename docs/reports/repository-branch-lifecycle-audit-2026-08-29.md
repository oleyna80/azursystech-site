# Repository branch lifecycle audit — 2026-08-29

**Snapshot:** `origin/main` = `feb38b0c8eb13df73024d5a8f7e7a23dc9d42fd1`; 17
heads after `fetch --prune`. Provider associations below are read-only external
evidence, never normative lifecycle content. `ahead` is branch/main commit count.

| Branch | SHA | Relation / ahead | Local or recovery dependency | Class |
|---|---|---|---|---|
| main | feb38b0c8eb13df73024d5a8f7e7a23dc9d42fd1 | same / 0 | primary | KEEP |
| agent/github-capability-authority-migration | 731c2d213b0785f01839ee6f9c9f4d18b6edbb0e | ancestor / 0 | none | SAFE_REMOTE_DELETE |
| agent/showcase-production-multizone-github | acbb371d610c9c6b6f4ff7eb7435842d8503d743 | ancestor / 0 | registered clean worktree | SAFE_REMOTE_DELETE |
| baseline/azursystech-441b134d | 441b134d71f781d2d0fcc48d3a8da86875835a9c | ancestor / 0 | preservation baseline | KEEP |
| codex/media-production-skills-curation | 00cd532d7e3ca57751dcdc71b8fc5ad8af3e48e8 | diverged / 8 | 59 unique files; selective recovery | RECOVER_INTENT |
| feat/automatiser-demandes-clients-guide | be43e8e7f6fac06cb69be9ec1a82e2c0d23ea0fc | squash-diverged / 4 | stale record only; intent represented | SAFE_REMOTE_DELETE |
| feat/creation-site-internet-nice | 9d2b23bfaca4a5af63030f77cc2d7c7559c8ec18 | squash-diverged / 1 | canonical dirty checkout | DIRTY_PRESERVE |
| feat/english-translation | d61113e27b6974f3288b805d3bfd1a108a14c5e6 | squash-diverged / 9 | intent represented | SAFE_REMOTE_DELETE |
| feat/showcase-links-and-immobilier-fix | 77d0811b5ab98c7068e971b5ae33853294873bbc | ancestor / 0 | none | SAFE_REMOTE_DELETE |
| feat/technical-seo-multilingual-integrity | a6e02a9a30b856574f3ccfe1cfe65ab86f1e21ce | squash-diverged / 2 | intent represented | SAFE_REMOTE_DELETE |
| feat/web-development | 6734db51e2a7392340d31d4e0e5af7b34c5ec255 | ancestor / 0 | none | SAFE_REMOTE_DELETE |
| fix/worktree-ssot-binding | 68905f04b1bfb40b229feb9e5d78849153445d6e | squash-diverged / 27 | intent represented | SAFE_REMOTE_DELETE |
| hotfix/deploy-ssh-action | 23255cab6687a132885f97472d7b709bcceb6d29 | ancestor / 0 | none | SAFE_REMOTE_DELETE |
| infra/vps-runtime-consolidation | 5df95d758afa7053374a3ffc5da5e17283a27da5 | ancestor / 0 | none | SAFE_REMOTE_DELETE |
| sync/agentic-sdlc-framework | 92df4227f83415968c799534a8d9ba4e577cdfb2 | ancestor / 0 | none | SAFE_REMOTE_DELETE |
| wb/2026-08-25-shared-analysis-surface | 515bb6dd83e6c883dc76d67d87277b9b9d0b72b5 | squash-diverged / 11 | stale record; intent represented | SAFE_REMOTE_DELETE |
| wb/2026-08-28-repository-lifecycle-normalization | 55fb4838082c4f487af3091109b4b2179c9ce06b | squash-diverged / 3 | clean isolated checkout; intent represented | SAFE_REMOTE_DELETE |

Read-only provider evidence associates historical changes for the seven prior
known candidates and the two Work Blocks; deterministic ancestry resolves the
four former investigations. Totals: KEEP 2, SAFE_REMOTE_DELETE 13,
RECOVER_INTENT 1, DIRTY_PRESERVE 1, INVESTIGATE 0.

## Post-authorized execution reconciliation

The table above is the Phase 1 planning snapshot, not a current provider-state
assertion. A separate Owner-authorized, preflight-bound batch subsequently
executed eleven eligible remote candidates. The two dependent candidates
`feat/automatiser-demandes-clients-guide` and
`wb/2026-08-25-shared-analysis-surface` were preserved because the required
single prune batch was skipped on a stale-record SHA mismatch. See
`docs/reports/repository-cleanup-execution-2026-08-29.md` for operational
evidence; no future deletion is authorized by this audit.
