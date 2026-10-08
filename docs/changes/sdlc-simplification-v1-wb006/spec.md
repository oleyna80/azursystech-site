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
5. In a separate full-history disposable clone with an independent Git
   common directory, use `git apply --check` and `git apply` on exact patch
   bytes; verify seven postimage `(mode, blob)` pairs and full-tree identity.
6. Create one exact candidate only from verified full postimage tree; require
   exact parent SHA, entire GitHub committed tree SHA equal to locally verified
   `git write-tree`, non-force `expected_sha` ref lease and fetch-back equality.
   Preserve exact candidate SHA for Reviewer/Verifier.
7. Fail closed on incomplete state, missing Git history, permission/API failure,
   dirty tree, manifest discrepancy or unexpected Git changes.

## Candidate assurance (isolated only)

- Run bootstrap/install and rollback ONLY in a full-history disposable CLONE
  with distinct Git common dir, isolated HOME and external registry. A linked
  worktree of the installed repository is not an activation test environment.
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

After assurance and real authenticated GitHub protection-facts review, obtain
explicit Owner GO for exact SHA, target ref, target-installation inventory,
maintenance barrier, window and rollback. Owner keeps an exclusive barrier
through merge, full-tree validation, bootstrap/restart/smoke or rollback.
PR publication is not merge approval; baseline never auto-merges/deploys.

## Rollback / failure classification

Before an approved promotion or in a failed disposable rehearsal, abort without
changing `main`. After authorized production promotion, stop consequential
actions, revoke/terminalize only cutover-created authority, restore exact seven
preimage Git `(mode, blob)`, prior `core.hooksPath`, trusted config and
Git-private state according to snapshots; reconcile external registry instead
of blindly overwriting concurrent audit/history. Assert no live dual authority.

Tracked production rollback is an Owner-controlled exact revert after verifying
actual tip; local authority rollback is conditional on current config/registry/
controller state still matching the cutover-owned value. Never overwrite
independently modified state or erase terminal history. Keep the barrier until
no mixed authority is independently proven. Failure => STOP/ROLLBACK_REQUIRED.

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

## Architecture Critic supplement — B1/B2/B3/M1 (authoritative)

This section constrains every earlier reference to a disposable worktree,
checkout, merge, install, or rollback. It neither expands the seven-path
implementation write set nor authorizes production changes.

### B1: Isolated clone with distinct common Git dir

All simulated installation, bootstrap, native Claude/Codex/Git activation smoke
and rollback testing MUST occur in a fresh full-history disposable `git clone`
whose Git common directory is different from the proposed installed repository
and its linked worktrees. Verify both common-dir identities before mutation.
Use separate HOME/Git configuration and external registry. Linked worktrees
share `core.hooksPath`, trusted installation config, and registry authority;
they are permitted only for read-only inspection or controlled candidate
construction with no shared authority/config mutations. A linked worktree MUST
NEVER execute simulated installation/rollback.

### B2: Exclusive Owner maintenance barrier, bounded to installations

Before Owner GO enumerate exact target installation path, Git common dir,
**all its linked worktrees**, existing Claude/Codex sessions, in-flight
consequential operations, external registry, responsible operator and snapshots.
Before the first snapshot, drain/stop all agent sessions and writes/commits/
pushes/delivery operations; prevent new agents/consequential execution on every
enumerated worktree. Snapshot seven preimage (mode, blob) pairs, refs/HEAD,
`core.hooksPath`, Git-common-dir installation config, per-worktree Git-private
controller state, external active admission bindings and cutover-owned state.
Immediately BEFORE tracked merge/local mutation recheck active admission
bindings, local authority, refs and inflight operations. Any unexpected state
is STOP.

Keep the **same exclusive barrier** through Owner-approved tracked merge,
post-merge full-tree verification, installation/bootstrap, agent restart and
native activation smoke, or through verified complete rollback. Old sessions
must not continue with cached legacy authority while new ones use replacement
wiring. The authority switch is one supervised operational transaction; no
atomicity is claimed for unrelated clones/remote installations. Independent
installations require independent inventory, barrier and Owner decision.

On rollback, hold barrier while terminalizing ONLY cutover-created admissions
and reverting exact tracked changes after checking tip/ancestry. Restore prior
`core.hooksPath`, config, controller state or registry values only when CURRENT
value equals the known cutover-owned post-snapshot value/absence. An independent
change after snapshot requires STOP and human reconciliation, never blind
registry replacement, wholesale deletion of bindings or erasure of immutable
audit/history. Release barrier only after independently proven exact rollback
and no remaining mixed/live cutover authority.

### B3: Full Git tree identity — local, GitHub, merged main

On exact expected parent SHA verify the seven manifest preimages `(mode, blob)`,
then apply the EXACT assured patch bytes in B1's isolated clone via
`git apply --check` and `git apply`. Stage exactly the seven manifest paths.
Record the complete locally verified `git write-tree` SHA, confirm seven
postimage blob/mode pairs and that EVERY other path matches parent tree.

When GitHub connector constructs the proposed commit require: (a) exact
verified parent SHA, (b) connector tree SHA == entire locally verified tree SHA,
(c) seven exact postimages and unchanged non-write-set paths. If any mismatch,
STOP before updating branch ref. Advance subject branch only non-force with
`expected_sha` lease equal to observed current head. Fetch back published
commit, parent and full tree and require identity. A regenerated or merely
similar patch is not accepted.

After an independently verified candidate receives a separate Owner GO,
under B2 maintenance barrier, independently check the resulting
`main^{tree}` is the EXACT previously approved post-patch Git tree, with
expected ancestry and seven exact postimages, BEFORE bootstrap/runtime
activation. Squash, rebase, conflict resolution, concurrency, or any
transformation yielding unexpected tree/ancestry requires STOP and renewed
Reviewer/Verifier + Owner approval. Neither successful merge nor apparent
seven-file equality replaces complete-tree equality.

### M1: Authenticated real GitHub platform facts

Real authenticated branch/ruleset protection, default-branch/ref and
publication authority facts are required before Owner GO from a trusted
authorized operator/tool. The connector's observed classic-protection
HTTP 403 and private-repository ruleset plan limitation mean UNKNOWN,
not absence of protection. UNKNOWN, inaccessible, malformed or unsupported
platform facts are an explicit STOP; offline fake-GitHub provider regression
is not sufficient release evidence. This does not authorize provider changes.

### Inert-stack promotion prerequisite

At Critic review, `main` is an ancestor of WB-005 closeout and trails it by
212 commits (98 net changed files). Separately Owner-approve and integrate
the already assured inert WB-0..5 chain, with its own checks and rollback.
Nothing in WB-006 authorizes that merge. Before cutover, require `main` to
contain exact closeout `0891bc5ce96149e3494dd2cc4ce0e0195bf5ceae` and
reconfirm seven manifest preimage `(mode, blob)` pairs, else STOP/replan.

### Supplement acceptance evidence

B1 distinct Git common-dir activation/rollback PASS; B2 continuous barrier and
conditional restore procedure approved; B3 local/GitHub and post-merge full-tree
equality; M1 trustworthy actual protection facts known; separate inert-stack
promotion complete. Architecture Critic must APPROVE before implementation.
