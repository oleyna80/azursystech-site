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

- Use local disposable Git worktree/ Codex only where an actual `git apply`,
  file mode or hook execution is required; GitHub connector remains the
  branch/object provenance and PR interface.
- Check/apply exact WB-005 `cutover.patch` bytes; do not regenerate.
- Check seven exact manifest postimages and no extra tracked writes.
- Commit isolated cutover candidate; pin SHA and push only to WB-006 branch
  with non-force ref lease. Do not touch `main`.

Exit: one frozen candidate with exact seven-path implementation delta.

## Wave 3 — Isolated assurance and rollback

- Run install/check, full canonical in ACTIVATED mode, deterministic regression
  and actual Claude/Codex/Git/trusted-open/publish smoke in disposable checkout.
- Check CI full history and real GitHub auth/protection separately from fake gh.
- Prove no live legacy authority, human-governed-only profile.
- Execute fault/rollback rehearsal and exact state/mode/config/registry equality.
- Fresh Holistic Critic, independent Reviewer READY and Verifier VERIFIED on
  the exact cutover candidate. Rework creates a new SHA and repeats assurance.

Exit: frozen WB-006 candidate READY for Owner review.

## Wave 4 — Explicit Owner go/no-go, not automatic

- Recheck target `main` ancestry and inert-stack prerequisite.
- Produce short promotion and rollback checklist with exact SHA/ref/environment.
- Owner individually approves or rejects the cutover.
- Only on GO: Owner-controlled PR merge, operational bootstrap/activation,
  post-merge smoke, and monitored rollback readiness.
- On failure: STOP/revoke/revert and prove no mixed authority.

Exit: Owner-approved activation and verification, or BLOCKED with no unsafe
partial activation.

## Out of scope / defer to WB-007

Production tuning, generalized platform migration, legacy code deletion, new
autonomy, process cleanup, unrelated documentation rewrite, and optimization.
