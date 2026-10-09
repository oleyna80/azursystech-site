# WB-006 — Owner-Controlled Baseline Cutover — Plan

Status: PLANNING / CRITIC PENDING

## Wave 0 — Architecture and integration readiness

- Freeze `intent.md`, `spec.md`, `plan.md`, and `work-blocks/wb-006.md`.
- Independent Architecture Critic checks trust roots, exact seven-path scope,
  default-branch integration prerequisite, rollback and Owner boundary.
- Resolve findings in planning documents only; no cutover code before APPROVE.
- Separately decide the release prerequisite for the 212 unmerged inert
  commits/98 changed files. Do NOT merge them as a side effect of this Wave.

Exit: Critic APPROVE and explicit Owner authorization for implementation only.

## Wave 1 — Read-only preflight

- Independently pin `e167b6ffbe01f3977ca2b738d8c12a17a4004110`.
- Read four fixed artifact paths directly from this source candidate Git tree.
- Verify all four actual blob identities against derivative coordination binding.
- Verify manifest exact seven preimage blobs/modes on WB-006 base/head.
- Check clean disposable worktree, exact repository/branch, external registry
  boundary, active-admission quiescence, and rollback snapshot capability.
- STOP on unexpected history, drift or authority ambiguity.

Exit: preflight evidence READY. No wiring edits.

## Wave 2 — Exact proposed cutover candidate

- Use local Codex/real Git in an independent full-history disposable CLONE
  (distinct Git common dir) for patch, installation and rollback testing.
  Linked worktrees can be used for read-only inspection or controlled
  candidate construction without shared authority changes. GitHub connector
  remains the candidate/ref/PR interface.
- Check/apply exact WB-005 `cutover.patch` bytes; do not regenerate.
- Check seven exact postimage blobs/modes, unchanged other paths and entire
  locally verified `git write-tree` SHA.
- GitHub-created candidate must have exact parent and complete tree SHA equal
  to local verified tree. Publish non-force with `expected_sha` ref lease;
  fetch back commit/parent/tree and revalidate. STOP on mismatch; no `main` edit.

Exit: one frozen candidate with exact seven-path implementation delta.

## Wave 3 — Isolated assurance and rollback

- Run install/check, full canonical in ACTIVATED mode, deterministic regression
  and actual Claude/Codex/Git/trusted-open/publish smoke in disposable checkout.
- Check full-history CI and real authenticated GitHub branch protection/rulesets
  with trusted operator; 403/plan limitation/UNKNOWN status is STOP.
- Prove no live legacy authority, human-governed-only profile.
- Execute fault/rollback rehearsal and exact state/mode/config/registry equality.
- Fresh Holistic Critic, independent Reviewer READY and Verifier VERIFIED on
  the exact cutover candidate. Rework creates a new SHA and repeats assurance.

Exit: frozen WB-006 candidate READY for Owner review.

## Wave 4 — Explicit Owner go/no-go, not automatic

- Recheck target `main` ancestry and inert-stack prerequisite.
- Produce short promotion and rollback checklist with exact SHA/ref/environment.
- Owner individually approves or rejects the cutover.
- BEFORE production mutation, hold exclusive Owner maintenance barrier on
  named installation AND every linked worktree; drain agent sessions/operations,
  block new execution, snapshot and recheck local/registry active bindings.
- Only on GO under same continuous barrier: Owner merge, independently require
  `main^{tree}` equals approved full cutover tree/ancestry BEFORE bootstrap,
  then install, restart agents and smoke. Transformations => STOP/reapproval.
- On failure, keep barrier while conditionally restoring state and revoking
  cutover-only authority; never overwrite independent config/registry state.

Exit: Owner-approved full-tree-equal activation with verified smoke and barrier
release, or STOP/ROLLBACK_REQUIRED under held barrier until proven safe.

## Out of scope / defer to WB-007

Production tuning, generalized platform migration, legacy code deletion, new
autonomy, process cleanup, unrelated documentation rewrite, and optimization.

## Critic B1–B3/M1 closure checks — mandatory wave exits

- Wave 0: submit four corrected planning documents for **delta-only
  Architecture Critic APPROVE**. Separately promote inert WB-0..5 through
  independent Owner-controlled integration checks/approval, never implicitly.
- Wave 1: verify exact frozen SHA and derivative binding, seven preimages,
  independent clone Git common-dir isolation, disposable authority snapshots,
  production installation + linked-worktree inventory, and barrier mechanism.
- Wave 2: use exact WB-005 patch bytes. Demand full locally verified Git
  tree SHA (via `git write-tree`) equals GitHub created commit tree, exact
  parent, seven postimages and unchanged other paths. Use non-force leased
  `expected_sha`, then fetch-back verified identity.
- Wave 3: run bootstrap/activated smoke/rollback **only in independent clone**,
  with isolated HOME and external registry; full canonical/CI/Reviewer/Verifier
  and real authenticated GitHub protection facts. UNKNOWN/403 remains STOP.
- Wave 4: after separately Owner-approved inert-stack promotion, verify
  `main` contains exact WB-005 closeout and seven preimages; Owner GO only
  with complete barrier inventory and authenticated platform facts.
  Barrier begins before snapshot, drains old operations, blocks new ones,
  rechecks active authority immediately before merge, remains held through
  merge → full `main^{tree}` equality/ancestry → bootstrap → agent restart →
  smoke or conditional rollback. Do not overwrite independently created
  authority state, and do not claim atomicity across unrelated clones.
