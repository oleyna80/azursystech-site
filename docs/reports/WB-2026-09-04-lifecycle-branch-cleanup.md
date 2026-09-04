# Lifecycle / branch cleanup audit

## Scope and verdict

- Work Block: `WB-2026-09-04-lifecycle-branch-cleanup`
- Audit timestamp: 2026-09-04, Europe/Paris
- Repository: `oleyna80/azursystech-site`
- Baseline: `origin/main` at `b29ff40b53628cc6e4c755ce4a19cb791f8fa688`
- Subject branch: `audit/lifecycle-branch-cleanup`
- Mode: read-only inventory and disposition audit
- Overall verdict: **BLOCKED for destructive cleanup; PARTIAL for reconciliation**

## Post-audit reconciliation addendum

After this audit snapshot, the Owner-authorized Nice lifecycle-only closeout was
completed and published. PR #28 merged the reconciliation evidence into
`main` at `67c8f6ff346b0be5d4c847ee1f588628c6dce874`; the Nice operational SSOT
was closed locally and pushed as `fb7e62968a823993c9480248b456febba590504a`.
The Nice audit branch and its dedicated worktree were subsequently removed.

The canonical Nice worktree remains preserved at
`/home/azur/Projects/WSL/azursystech` with 21 unrelated untracked artifacts.
Its lifecycle record is now inactive (`write_gate=BLOCKED`, `opened_at=null`),
so the original Nice-specific cleanup blocker is reconciled operationally but
the artifacts remain Owner-gated and are not deletion candidates by inference.

The repository has several merged but retained remote/local branches and multiple lifecycle records whose state differs by branch tip. The canonical worktree contains an active Nice Work Block and untracked historical coordination artifacts. No branch or worktree is safe to delete from this audit alone.

## Evidence sources

- Exact Git preflight, `git fetch origin main`, `git branch`, `git for-each-ref`, `git worktree list`, `git merge-base --is-ancestor`, and branch-tip `.agent/active-work-block.json` reads.
- GitHub PR inventory from `gh pr list --state all` and PR metadata.
- Canonical worktree read-only status and active lifecycle record at `/home/azur/Projects/WSL/azursystech`.
- Current repository release-state validator: active Work Block `none` in this audit worktree.

## Branch / lifecycle matrix

| Ref | Exact tip | PR / ancestry | Branch-tip lifecycle | Disposition | Priority |
|---|---|---|---|---|---|
| `origin/feat/creation-site-internet-nice` | `fb7e62968a823993c9480248b456febba590504a` | PR #17 and lifecycle publication merged/pushed; implementation ancestry is durable | Nice WB operationally inactive; canonical worktree remains dirty with preserved artifacts | **RETAIN / separate artifact disposition required**; do not delete canonical worktree or artifacts from merge status alone | P1 |
| `origin/feat/technical-seo-multilingual-integrity` | `a6e02a9a30b856574f3ccfe1cfe65ab86f1e21ce` | PR #16 merged; tip not ancestor | SEO WB, `owner_publication_handoff_ready`, READY | **RETAIN / reconcile evidence**; do not merge stale tip | P1 |
| `origin/feat/automatiser-demandes-clients-guide` | `be43e8e7f6fac06cb69be9ec1a82e2c0d23ea0fc` | PR #19 merged; tip not ancestor | guide WB, `success-closeout`, READY | **RETAIN pending lifecycle/archive mapping** | P1 |
| `origin/wb/2026-08-25-shared-analysis-surface` | `515bb6dd83e6c883dc76d67d87277b9b9d0b72b5` | PR #20 merged; tip not ancestor | shared-analysis WB, `success-closeout`, READY | **RETAIN pending lifecycle/archive mapping** | P1 |
| `origin/feat/english-translation` | `d61113e27b6974f3288b805d3bfd1a108a14c5e6` | PR #15 merged; tip not ancestor | translation WB, `success-closeout`, READY | **RETAIN pending exact artifact/worktree check** | P2 |
| `origin/agent/showcase-production-multizone-github` | `acbb371d610c9c6b6f4ff7eb7435842d8503d743` | PR #13 merged; tip ancestor | showcase WB, `success-closeout`, READY | **POTENTIAL CLEANUP CANDIDATE**, but verify no worktree and preserve evidence first | P2 |
| `origin/fix/worktree-ssot-binding` | `68905f04b1bfb40b229feb9e5d78849153445d6e` | PR #18 merged; tip not ancestor | binding WB, `success-closeout`, BLOCKED | **RETAIN / investigate blocked state** | P1 |
| `origin/fix/seo-audit-lifecycle-closeout` | `9a4f73970e8a9b3a1535ca57bc3c7f96e2ecff72` | PR #25 merged; tip ancestor | inactive closeout, `success-closeout`, BLOCKED | **RETAIN as governance evidence; do not delete yet** | P1 |
| `origin/agent/github-capability-authority-migration` | `731c2d213b0785f01839ee6f9c9f4d18b6edbb0e` | PR #12 merged; tip ancestor | no active WB in tip | **POTENTIAL CLEANUP CANDIDATE**, pending ownership check | P2 |
| `origin/hotfix/deploy-ssh-action` | `23255cab6687a132885f97472d7b709bcceb6d29` | PR #9 merged; tip ancestor | no active WB in tip | **POTENTIAL CLEANUP CANDIDATE**, pending ownership check | P2 |
| `origin/infra/vps-runtime-consolidation` | `5df95d758afa7053374a3ffc5da5e17283a27da5` | PR #8 merged; tip ancestor | no active WB in tip | **POTENTIAL CLEANUP CANDIDATE**, pending ownership check | P2 |
| `origin/feat/showcase-links-and-immobilier-fix` | `77d0811b5ab9` | no PR listed; tip ancestor | blocked/pending state | **RETAIN / identify owner and purpose** | P1 |
| `origin/feat/web-development` | `6734db51e2a7` | no PR listed; tip ancestor | blocked/pending state | **RETAIN / identify owner and purpose** | P1 |
| `origin/sync/agentic-sdlc-framework` | `92df4227f834` | no PR listed; tip ancestor | blocked/pending state | **RETAIN / identify owner and purpose** | P1 |
| `origin/baseline/azursystech-441b134d` | `441b134d71f7` | no PR listed; tip ancestor | blocked/pending state | **RETAIN as baseline candidate pending registry confirmation** | P2 |
| `origin/codex/media-production-skills-curation` | `00cd532d7e3c` | no PR listed; not ancestor | lifecycle file missing | **RETAIN / unknown ownership and purpose** | P1 |

The local branch inventory mirrors several remote refs. The local `feat/creation-site-internet-nice` is the checked-out branch in the canonical dirty worktree. Local branches `feat/automatiser-demandes-clients-guide`, `feat/technical-seo-multilingual-integrity`, and `wb/2026-08-25-shared-analysis-surface` also remain present and should not be removed without exact target confirmation.

## Critical finding — canonical worktree is not cleanup-safe

- Path: `/home/azur/Projects/WSL/azursystech`
- Branch: `feat/creation-site-internet-nice`
- HEAD: `1a5a4884123410c04440567a5863806746afbbc9`
- Status: `ahead 2, behind 21` relative to current `origin/main`
- Active SSOT: Nice record retained as an inactive historical record, `write_gate=BLOCKED`, `opened_at=null`, `closeout_mode=success-closeout`
- Untracked artifacts: 21 lifecycle/authorization/spec/plan/tasklist/report paths
- Classification: **PARTIAL / BLOCKER for destructive cleanup authorization**
- Impact: deleting the worktree could destroy user-owned untracked governance evidence; lifecycle state itself is reconciled.
- Confidence: High.
- Recommended action: preserve unchanged; use a dedicated artifact-by-artifact disposition WB. No cleanup command is authorized by this audit.

## Lifecycle observations

1. Current audit worktree is clean and release-state validation reports `Active Work Block: none`.
2. Branch-tip JSON is not a sufficient deletion oracle: merged branches can still contain READY handoff records, and blocked records may be governance evidence.
3. A branch being an ancestor of `origin/main` is useful evidence for implementation history, but does not prove that local worktrees, untracked artifacts, or lifecycle records are disposable.
4. Absence of a PR is not proof of abandonment; such refs require owner/purpose identification before deletion.

## Bounded next actions

1. **Owner-gated canonical worktree artifact reconciliation (P1):** inventory the 21 untracked artifacts and the published Nice lifecycle commits, preserve them, and decide retain/archive/rehome targets. No deletion in the inventory phase.
2. **Merged-branch archive review (P1):** for the merged branches with READY handoff records, verify PR merge commit, worktree ownership, and durable closeout evidence; produce an exact deletion candidate list.
3. **Unknown-ref ownership review (P1):** identify purpose/owner for refs without PRs or without lifecycle SSOT (`codex/media-production-skills-curation`, `feat/showcase-links-and-immobilier-fix`, `feat/web-development`, `sync/agentic-sdlc-framework`, baseline ref).
4. **Destructive cleanup execution (separate WB, Owner approval required):** delete only exact remote/local refs and worktrees that pass the preceding evidence gates. Do not use broad globs or repository-wide cleanup.

## Assurance boundary

This audit WB did not modify application code, deployment, secrets, or the canonical
untracked artifacts. Its later documented reconciliation included the exact
Nice lifecycle SSOT commit and PR #28 publication; no cleanup command was used
against the canonical worktree. The remaining uncommitted state in this audit
worktree is limited to this WB's lifecycle/spec/plan/tasklist/report artifacts.
