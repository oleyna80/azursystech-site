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

Before remote publication, record the exact `HEAD`, required checks, Critic,
Reviewer, Verifier, and residual risks. Required Critic, Review, and
Verification must all be `READY`; formal profiles also require READY
Define-quality evidence. A corrective change creates a new candidate and
repeats the affected assurance.

## Stage C — Autonomous exact-subject candidate push

The sole autonomous publication form is:

```text
git push origin HEAD:refs/heads/<active subject_branch>
```

It is permitted only when the attached non-default branch matches the active
Work Block `subject_branch`, the READY write gate and formal Define evidence are
present, and required Critic, Review, and Verification are `READY`. The exact
push is the sole shell command: it cannot be coupled to another action. The
explicit remote and destination prevent an upstream or arbitrary refspec from
changing the target. A push retry after a transport failure or a corrected
assured candidate uses the same bounded form; no local "one push" counter is
authoritative.

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
