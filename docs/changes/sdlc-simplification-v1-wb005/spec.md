# WB-005 — Holistic Replacement Assurance — Specification

## Objective

Deliver the final inert replacement package and deterministic evidence required before WB-006 may change live control-plane wiring.

## Identity and immutable baseline

- Work Block: `WB-005`
- initiative: `docs/changes/sdlc-simplification-v1-wb005`
- base: `de129c8c8e924ff9b1b96a49e853a501f2171f1f`
- subject branch: `feat/sdlc-wb005-holistic-assurance`

The old/legacy side of semantic comparison is always evaluated against the exact WB-004 closeout baseline above.

## Production invocation surface

WB-005 may add inert executable replacement bridges/providers, but must not wire them live.

Required bridge surface:

1. Claude structured-write entrypoint.
2. Codex structured-write entrypoint.
3. Git pre-commit entrypoint.
4. Git commit-msg entrypoint.
5. Git pre-push entrypoint.
6. trusted controller open entrypoint.
7. trusted controller publish entrypoint.
8. concrete fail-closed GitHub branch-protection provider.
9. trusted installation-config loader.
10. trusted active-admission resolution.

Runtime/Git payloads cannot select admission profile, policy revision, registry path, provider, repository identity, or other authority configuration.

## Active admission model

Immutable `admissions` remain historical records.

The trusted external registry additionally owns a unique active binding:

`(repository_id, subject_branch) -> admission_id`

Rules:

- a new admission atomically claims its subject binding;
- a second active admission for the same repository/branch is denied;
- runtime bridges use only exact active lookup and never "latest";
- terminal/revoke removes the active binding without deleting history;
- terminal reason is append-only and one of `COMPLETED`, `CANCELLED`, `REVOKED`, `ROLLED_BACK`;
- authority-bearing external operations require the exact admission to remain active;
- historical facts may remain after terminalization but cannot grant future authority.

## Trusted installation configuration

The replacement bridges read one strict trusted configuration from the exact Git common directory.

The configuration binds at minimum:

- repository identity;
- external registry path;
- trusted remote;
- branch-protection provider configuration.

Requirements:

- no payload override;
- no environment override;
- no subject-tree authority configuration;
- exact Git-common-dir location;
- regular file only;
- symlink/hardlink rejected;
- restrictive permissions required;
- strict schema with unknown fields rejected;
- registry must remain outside the subject repository.

Malformed/tampered/unavailable configuration fails closed.

## Branch-protection provider

Production implementation uses authenticated GitHub platform facts and fails closed on unknown repository, missing authentication, API failure, malformed response, or ambiguous state.

WB-005 offline verification must exercise the same implementation through deterministic fixtures rather than the real network.

## Semantic comparison

Each scenario records:

- `scenario_id`;
- invariant/domain;
- `security_sensitive`;
- legacy result;
- replacement result;
- classification;
- rationale;
- accepted pre-WB-005 architecture requirement reference.

Allowed classifications:

- `EQUIVALENT`;
- `INTENTIONAL_CHANGE`;
- `REMOVED_OR_TRANSFERRED_LEGACY_MECHANISM`.

Removed/transferred cases require explicit disposition, target authority boundary, and replacement test.

A security-sensitive `DENY -> ALLOW` result fails unless an architecture requirement already present at the WB-004 baseline explicitly authorizes the relaxation.

WB-005-created rationale cannot authorize its own relaxation.

## Canonical cutover artifacts

The source candidate contains fixed canonical paths:

- `.agent/assurance/wb5/cutover.patch`
- `.agent/assurance/wb5/cutover-manifest.json`
- `.agent/assurance/wb5/comparison-corpus.json`
- `.agent/assurance/wb5/cutover-checklist.md`

The manifest includes:

- exact allowed live-wiring paths;
- preimage Git blob SHA/file mode;
- expected postimage Git blob SHA/file mode;
- entrypoint disposition: `REPLACE`, `REMOVE`, or `RETAIN_NON_AUTHORITY`;
- rollback classification;
- cutover ordering/preconditions.

The patch is inert data during WB-005.

## Post-candidate binding

The source candidate does not self-reference its own SHA.

After exact candidate freeze, a coordination-only record binds:

- expected replacement candidate SHA;
- Git blob SHA for each fixed canonical artifact path.

The binding is derivative only.

WB-006 must independently start from its expected exact replacement candidate SHA, read each canonical path directly from that candidate tree, compute/read the actual Git blob SHA, and compare it with the binding.

The binding cannot redirect WB-006 to another Git blob.

## Disposable cutover rehearsal

Rehearsal uses actual future invocation paths rather than direct policy APIs.

It must:

1. create a clean disposable checkout with isolated HOME and no user Git config;
2. snapshot tracked live-wiring blobs/modes and local activation state;
3. validate and apply exact `cutover.patch`;
4. run the future bootstrap/install path;
5. create trusted Git-common-dir config and disposable external registry;
6. exercise exact Claude/Codex hook commands with native representative payloads, nested cwd and pre-WB planning;
7. perform real `git add` / `git commit` using installed pre-commit and commit-msg;
8. perform real `git push` to local bare remote using pre-push;
9. exercise trusted open/publish with the concrete provider implementation;
10. run the canonical deterministic assurance command;
11. rollback;
12. prove deterministic restoration/terminalization.

Rollback assertions cover:

- tracked blobs;
- file modes;
- `core.hooksPath`;
- Git-common-dir trusted config;
- Git-private controller state;
- bootstrap-created ignored/local activation state;
- authority-bearing external registry state.

Evidence-only historical state may remain only when explicitly classified as harmless residue.

## Canonical deterministic command

WB-005 establishes one future CI target:

`python scripts/verify-sdlc-replacement.py`

It must be offline, deterministic, clean-clone safe, and independent of user Git config.

It owns:

- compile/import validation;
- complete controller regressions;
- complete orchestration regressions with ResourceWarning promoted to error;
- WB-003 E2E/regression coverage;
- legacy finding inventory validation;
- old-vs-new semantic comparison;
- cutover manifest validation;
- real-entrypoint rehearsal;
- rollback equality;
- guard that WB-005 source candidate itself does not change live wiring.

Candidate-relative rule:

The live-wiring immutability check compares WB-004 baseline to the exact `replacement_candidate_sha`, never simply to current HEAD.

The same command can therefore run after WB-006 activation while continuing to validate the exact assured candidate and separately validating the activated tree as the exact cutover result.

## Acceptance criteria

WB-005 is READY only if:

- final package receives holistic Critic approval;
- Reviewer is READY for one exact candidate SHA;
- Verifier independently verifies that same exact SHA;
- canonical deterministic command passes;
- semantic corpus is complete and contains no unauthorized security relaxation;
- exact cutover patch/manifest pass rehearsal;
- rollback leaves no active authority residue;
- all activation bridges are present and tested but not live-wired;
- cutover checklist is READY;
- no live authority/configuration file changed from WB-004 baseline.
