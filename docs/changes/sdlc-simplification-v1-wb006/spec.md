# WB-006 — Owner-Controlled Baseline Cutover — Specification

Status: PROPOSED / ARCHITECTURE CRITIC PENDING
Base: `0891bc5ce96149e3494dd2cc4ce0e0195bf5ceae`
Branch: `feat/sdlc-wb006-owner-cutover`

## Objective and acceptance target

Prove that the exact WB-005-assured replacement can be activated on a clean
proposed branch, tested through native entrypoints and rolled back exactly.
The only production authority change is a separate Owner-controlled promotion.

## Inputs and trust roots

1. Independently pinned Owner-approved replacement candidate:
   `e167b6ffbe01f3977ca2b738d8c12a17a4004110`.
2. Fixed canonical paths read from that candidate's Git tree:
   - `.agent/assurance/wb5/cutover.patch`
   - `.agent/assurance/wb5/cutover-manifest.json`
   - `.agent/assurance/wb5/comparison-corpus.json`
   - `.agent/assurance/wb5/cutover-checklist.md`
3. Derivative coordination binding:
   `docs/reports/sdlc-wb005-candidate-binding.json`.
4. Exact binding values, checked against candidate-tree Git blobs:
   - patch: `58b044f8990395611538712b1d8e76ea46cdb632`
   - manifest: `35a18b949489c991b109a5759e895479b665f272`
   - corpus: `18a532dc56c2798b98e0320260e88385c9de02e8`
   - checklist: `007c9f05cb10f45d5211d7482f76e5b6167f355c`
5. WB-004 baseline: `de129c8c8e924ff9b1b96a49e853a501f2171f1f`.
6. Owner-approved installation repository identity, external registry path,
   Git remote and rollback snapshot destination, set outside runtime payloads.

Never trust binding, branch HEAD, environment or hook payload to select
candidate SHA, Git blob, provider, profile, or registry.

## Implementation write set — EXACTLY seven tracked paths

- `.claude/settings.json`
- `.codex/hooks.json`
- `.githooks/pre-commit` (ADD, mode 100755)
- `.githooks/commit-msg`
- `.githooks/pre-push` (ADD, mode 100755)
- `scripts/bootstrap.sh`
- `.github/workflows/control-plane-contracts.yml`

The source of every postimage is the exact assured patch/manifest. No manual
rewrites, generated substitutes, extra wiring file, or physical deletion of
legacy Python hook source is permitted.

## Coordination write set

Only `docs/changes/sdlc-simplification-v1-wb006/**` and
`docs/reports/sdlc-wb006-*/**` or WB-006-specific flat reports under
`docs/reports/**` for review/verification/closeout evidence.

Coordination cannot authorize additional implementation files.

## Authority / activation invariants

- Legacy control plane stays authoritative on `main` until Owner cutover.
- Only one control plane is wired for any promoted checkout; no mixed old/new hooks.
- Installed bridge binds to its own Git common repository; linked worktrees
  inherit the same trusted config; foreign repositories deny.
- Trusted installation config remains in exact Git common dir, registry external.
- Human-governed is the initial profile; merge/deploy remain Owner-only.
- No active write-capable admission or unresolved consequential operation may
  span the production cutover. Resolve or revoke with durable evidence first.
- An unapproved branch/CI run or disposable bootstrap is not production approval.

## Preflight and patch transaction

1. Verify branch starts from exact WB-005 closeout base and is clean, attached,
   with expected local/remote refs and no concurrent writes.
2. Resolve independently pinned source SHA; read the four fixed artifacts directly
   from that Git tree; compare actual Git blob SHAs to the derivative binding.
3. Require manifest schema, allowed path set, preimage Git `(mode, blob)` for
   all seven paths, and exact patch SHA. Reject any drift.
4. Snapshot tracked preimages and local authority state (existing
   `core.hooksPath`, installation config, Git-private controller state, external
   registry active admissions and cutover-related authority) before mutation.
5. On a clean disposable worktree use `git apply --check`, then
   `git apply` **on the exact patch bytes**. Verify exact seven postimages
   `(mode, blob)` and zero undeclared tracked changes.
6. Create one exact cutover candidate commit from verified postimage tree;
   preserve its exact SHA for Reviewer/Verifier. GitHub connector may transfer
   verified Git objects but cannot substitute a reconstructed/modified patch.
7. Fail closed on incomplete state, missing Git history, permission/API failure,
   dirty tree, manifest discrepancy or unexpected Git changes.

## Candidate assurance (isolated only)

- Run future bootstrap install/check on an isolated disposable checkout with
  a disposable external registry; never install production-host authority here.
- Canonical FIRST for exact frozen replacement SHA:
  `python scripts/verify-sdlc-replacement.py --replacement-candidate e167b6ffbe01f3977ca2b738d8c12a17a4004110`.
- Require `ACTIVATED`, controller/orchestration/WB5 suites, semantic corpus,
  exact mode/blobs, full-history CI-equivalent verification.
- Run native Claude/Codex structured-write, Git pre-commit/commit-msg/pre-push,
  trusted open/publish, linked-worktree and foreign-repository probes.
- Separately check real authenticated GitHub platform facts required for
  promotion; offline fake-`gh` tests do not stand in for real platform facts.
- Verify no legacy entrypoint remains wired as live authority and no
  higher-autonomy capability was enabled.
- Force a failed-path rehearsal and prove rollback restores exact tracked and
  local authority state and leaves no cutover-created active admission.
- Independent Reviewer READY and Verifier VERIFIED bind one exact cutover SHA.

## Owner release boundary and default-branch prerequisite

Before approval, verify current `main` includes the WB-005 closeout tip
(or explicitly stop for Owner-approved replan), with no unreviewed base drift.
Because `main` currently trails WB-005 by 212 commits / 98 changed files,
the recommended precursor is a separate Owner-controlled promotion of the
previously assured inert stack. It is not authorized by this WB-006 plan.

After assurance, obtain an explicit Owner GO for exact cutover SHA, target ref,
activation window, operator and rollback instructions. PR publication alone does
not authorize merge. GitHub merge/deploy is never automatic in baseline mode.

## Rollback / failure classification

Before an approved promotion or in a failed disposable rehearsal, abort without
changing `main`. After authorized production promotion, stop consequential
actions, revoke/terminalize only cutover-created authority, restore exact seven
preimage Git `(mode, blob)`, prior `core.hooksPath`, trusted config and
Git-private state according to snapshots; reconcile external registry instead
of blindly overwriting concurrent audit/history. Assert no live dual authority.

Tracked production rollback is an Owner-controlled exact revert of cutover
commit(s); local authority rollback remains mandatory and separately verified.
Any failed invariant leaves STOP/ROLLBACK_REQUIRED, never READY.

## Acceptance criteria

- Architecture Critic: APPROVE before implementation.
- Candidate/binding/artifact identities independently proven from frozen tree.
- Only seven implementation paths changed; exact assured patch and Git modes.
- Rollback snapshot/equality and local authority-revocation evidence PASS.
- Canonical `ACTIVATED`, native smoke, CI and real GitHub preflight PASS.
- Independent Reviewer READY and Verifier VERIFIED for same frozen cutover SHA.
- Human-governed only; old live hooks absent; no dual authority.
- Owner approval explicitly gates default-branch merge and operational activation.
- No WB-006 source/authority change to `main` during plan/critic/implementation
  before Owner GO.
