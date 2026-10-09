# WB-006 — Owner-Controlled Baseline Cutover — Intent

Status: PROPOSED / ARCHITECTURE CRITIC PENDING
Date: 2026-10-08

## Objective

Activate the exact inert replacement package assured in WB-005 by applying its
fixed seven-path cutover patch, with no regeneration, no dual live authority,
and explicit Owner authorization for the production authority switch.

## Immutable inputs

- WB-006 Git base: `0891bc5ce96149e3494dd2cc4ce0e0195bf5ceae` (WB-005 coordination closeout).
- Owner-expected frozen WB-005 source candidate: `e167b6ffbe01f3977ca2b738d8c12a17a4004110`.
- Derivative binding: `docs/reports/sdlc-wb005-candidate-binding.json`.
- Frozen cutover.patch Git blob: `58b044f8990395611538712b1d8e76ea46cdb632`.
- Exact WB-004 baseline: `de129c8c8e924ff9b1b96a49e853a501f2171f1f`.
- Subject branch: `feat/sdlc-wb006-owner-cutover`.

The Owner-expected candidate SHA is independent of the binding. The binding
cannot choose a candidate, alternate path, or alternate artifact.

## Authority and risk boundary

WB-006 may prepare and independently assure a proposed cutover commit on its
isolated subject branch. It may not autonomously merge to `main`, deploy,
change production-host Git config/registry/state, or enable higher-autonomy profiles.

The authority switch requires a separate explicit Owner go/no-go after Reviewer
READY and Verifier VERIFIED for the exact cutover candidate. On failure, stop
consequential work and execute the preapproved rollback boundary.

## Integration prerequisite — separate Owner-controlled promotion

At planning time `main` is `703dcd05c0aa561d10571b4e1c652302769c1b06`,
212 commits behind the WB-005 closeout, with 98 changed files and no diverging
commit. Recommendation: independently promote the already assured inert WB-0..5
chain to `main` as an Owner-controlled precursor, then make WB-006 cutover PR
contain only the seven wiring changes plus approved coordination documents.

No precursor merge is authorized by this planning package. Before release, require current `main` includes exact WB-005 closeout
`0891bc5ce96149e3494dd2cc4ce0e0195bf5ceae` and still has seven
manifest preimages `(mode, blob)`; otherwise STOP for Owner replan.

## Not in scope

Controller redesign, provider changes, new orchestration features, regenerating
or editing the patch, legacy source deletion, governance rewrite, higher-autonomy
activation, autonomous merge/deploy, and unrelated cleanup.

## Next gate

Independent delta-only Architecture Critic after closure of B1–B3 and M1
across four planning files. No live wiring changes until APPROVE.

## Architecture Critic SUPPLEMENT — scope of approval

- **B1 — isolated tests.** All simulated activation, bootstrap, native
  hook smoke and rollback must use independent full-history disposable clone
  with distinct Git common dir, isolated HOME and external registry. Linked
  worktrees share authority/config and may be used only for read-only
  inspection or controlled candidate construction without test installation.
- **B2 — exclusive cutover barrier.** Owner names each target installation
  and every linked worktree, drains sessions/consequential operations, prevents
  new agent execution before snapshot, and rechecks local/registry authority
  just before mutation. Keep barrier through merge, tree verification,
  bootstrap, session restart, activation smoke or completed rollback.
  Restore post-snapshot authority state conditionally; never blindly
  overwrite independent changes. Scope excludes unrelated remote clones.
- **B3 — exact full tree.** Local patch-result `git write-tree` SHA equals
  exact entire tree committed through GitHub connector; seven postimages/modes
  and all untouched paths match; exact commit parent, non-force
  `expected_sha` branch lease, fetch-back verification. After Owner merge,
  `main^{tree}` MUST match approved tree exactly. Unexpected squash/rebase/
  conflict/transformed tree or ancestry requires STOP and fresh approval.
- **M1 — real platform evidence.** Authenticated GitHub protection/ruleset
  facts must be known before Owner GO. Connector HTTP 403/plan limitation
  means UNKNOWN → STOP, not an unprotected branch.

The inert WB-0..5 chain is ACCEPTED as a separately authorized, tested
Owner-controlled promotion prerequisite, not part of WB-006 merge authority.
The seven-path implementation boundary is unchanged. No implementation
may begin before delta-only Architecture Critic APPROVE.
