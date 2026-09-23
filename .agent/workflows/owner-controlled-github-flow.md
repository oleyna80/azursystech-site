# Autonomous Subject-Branch Candidate Flow — AzurSysTech

> Operational workflow subordinate to the canonical authority policy in
> `governance/authority.md`.

## Purpose

Apply the canonical authority boundary for `oleyna80/azursystech-site` without
turning a runtime permission, credential, or mutable local record into an
authority source. This workflow describes the execution evidence; it cannot
expand the policy in `governance/authority.md`.

## Stage A — Autonomous Work Block execution

The Orchestrator may, within the approved Work Block, perform Define, planning,
implementation, read-only subagent work, test and review corrective loops,
documentation, staging, and local commits. Routine test failure,
`CHANGES_REQUIRED`, and in-bound refactoring do not require an Owner pause.

Stop and return to Define for a material requirement, architecture, authority,
security/business/governance decision, risk, or write-set expansion.

## Stage B — Freeze and assure a candidate

Before remote publication, record the exact `HEAD`, frozen source candidate,
required checks, Critic disposition, Reviewer, Verifier, and residual risks in
repository artifacts. A freeze sets `write_gate: BLOCKED` for source edits and
resets candidate-specific Reviewer and Verifier evidence. Reviewer and Verifier
must be READY for the same frozen candidate; formal profiles also require READY
Define-quality evidence. Critic is resolved by READY with APPROVE/SUPPLEMENT or
explicit SKIPPED with a nonempty reason. DEGRADED/FALLBACK do not qualify for
autonomous publication. A corrective source change requires rework, a new
freeze, and fresh assurance. Repository reports bind execution IDs, WB,
specification revision, frozen candidate, separate context, and verdict;
Critic disposition also binds its status and any skip reason. Reports are committed before
publication without entering their own content-sha256 source hash.

## Stage C — Autonomous exact-subject candidate push

The sole autonomous publication form is:

```text
git push origin HEAD:refs/heads/<exact subject_branch>
```

Source-write permission and candidate-publication permission are separate
predicates. An active frozen candidate must have the attached non-default
branch and matching active Work Block `subject_branch`, BLOCKED source write
gate, unchanged frozen source content committed at HEAD, applicable READY
Define evidence, resolved Critic, and candidate-bound READY Reviewer and
Verifier reports committed at HEAD. A terminal candidate must instead be the immediate
child of that publication-eligible active commit, with the same Work Block and
subject branch proven from committed parent state and commit trailers; its
current state must be exact canonical inactive and its commit diff must contain
only the minimal closeout/coordination allowlist. Inactive state by itself is
not an allowance. A second commit, source mutation, malformed parent, or any
missing required evidence removes terminal eligibility. Terminal publication
is a distinct legacy path and is not required for a frozen subject candidate.

The exact push is the sole shell command: it cannot be coupled to another
action. The explicit remote and destination prevent an upstream or arbitrary
refspec from changing the target. A push retry after a transport failure or a
corrected assured candidate uses the same bounded form; no local "one push"
counter is authoritative.

Do not perform a bare push, alternate-remote/URL push, alternate source or
destination ref, force/non-fast-forward/delete/mirror/prune/all/tag push,
default/protected branch update, merge, release, deploy, production workflow
dispatch, VPS/SSH mutation, live data change, credential/secret change, or
destructive operation.

## Stage D — Owner candidate review

After a successful push, provide one bounded candidate report:

```text
OWNER CANDIDATE REVIEW
Repository: oleyna80/azursystech-site
Remote branch: <exact subject_branch>
Pushed candidate SHA: <40-char SHA>
Scope: <concise changed-file/domain summary>
Checks: <PASS/BLOCKED + exact checks>
Assurance: <Critic/Reviewer/Verifier states>
Residual risks: <none or exact list>
Production impact: NONE
Requested Owner decision: MERGE / REVISION / REJECT
```

This report does not request or authorize a merge. The Owner alone decides
`MERGE`, `REVISION`, or `REJECT`; a later merge, release, or deployment has its
own Owner-controlled path.

## Worktree binding and control limitation

The Work Block must be opened from the intended worktree so its
`subject_branch`, current branch, and process root agree. Project-local hooks
are cooperative controls, not substitutes for GitHub branch rules, least-
privilege credentials, or OS isolation. The local predicate fails closed when
it cannot identify the configured default branch; it cannot independently prove
remote GitHub rulesets or credential scope.
