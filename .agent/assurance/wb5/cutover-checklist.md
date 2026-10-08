# WB-006 Cutover Checklist (prepared by WB-005)

This artifact intentionally does not contain the WB-005 candidate SHA.

WB-006 starts from an independently Owner-approved exact replacement candidate SHA,
reads each canonical WB-005 artifact directly from that candidate tree, computes the
actual Git blob SHA, and requires equality with the post-candidate coordination binding.

## Preconditions

- Holistic Critic APPROVE for the complete WB-005 package.
- Reviewer READY and Verifier VERIFIED for the same exact candidate.
- Canonical deterministic assurance command PASS.
- Clean worktree/index and explicit default/subject branch identities.
- External registry outside the subject repository.
- Real GitHub authentication/protection facts available for activation smoke.

## Canonical artifacts

- `.agent/assurance/wb5/cutover.patch`
- `.agent/assurance/wb5/cutover-manifest.json`
- `.agent/assurance/wb5/comparison-corpus.json`
- `.agent/assurance/wb5/cutover-checklist.md`

The coordination binding is derivative only and cannot redirect any path to another blob.

## Apply

1. Validate manifest preimage blobs and modes.
2. Apply the exact `cutover.patch` bytes without regeneration or editing.
3. Validate resulting postimage blobs and modes.
4. Run `scripts/bootstrap.sh --install-sdlc-v1 <repository> <external-registry-path>`.
5. Run `scripts/bootstrap.sh --check-sdlc-v1`.
6. Run `python scripts/verify-sdlc-replacement.py`.
7. Execute actual Claude, Codex, Git commit/push and GitHub Actions activation smoke.
8. Only then allow the Owner-controlled cutover commit/merge.

## Rollback

On any failed predicate:

1. stop new consequential actions;
2. revoke/terminalize cutover-only active admission authority;
3. restore every tracked live-wiring preimage blob and mode;
4. restore prior `core.hooksPath`;
5. restore/remove Git-common-dir trusted configuration;
6. restore Git-private controller state snapshot;
7. prove no active registry authority introduced by cutover remains;
8. rerun deterministic rollback equality.

Historical evidence may remain only when it cannot grant future authority.
