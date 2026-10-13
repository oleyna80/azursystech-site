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

## Stage B — Bind and assure an exact Controller v1 candidate

Use the installed Controller v1 lifecycle, not tracked schema-v3
`write_gate` state. Trusted admission and a committed planning revision
precede independent Critic `READY` binding and `DEFINE → EXECUTE`.
After implementation and checks, commit a clean exact source candidate SHA
and enter `ASSURE`. Independent Reviewer and Verifier `READY` bindings
must match **that SHA**. Missing or mismatched bindings block publication;
reports alone never open authority. Source/planning rework requires renewed
planning or candidate assurance as dictated by the Controller.

Only allowed *linear coordination-only* changes may follow the assured
source candidate. Merges, source/planning changes, or prohibited
deletions/renames are denied. Preserve both exact source candidate and
intended published tip in immutable evidence.

## Stage C — Trusted Controller v1 subject publication

The Orchestrator uses the **existing trusted Controller v1 publish** entry
point, subject to `governance/authority.md`. Direct standalone `git push`,
GitHub `update_ref`, and historical terminal closeout publication are
**not substitutes** for this transaction.

Trusted publish checks the active `ASSURE` state, exact source candidate,
trusted origin, non-default/unprotected subject ref, permitted history and
required external authorization. Unknown branch protection fails closed.
After an allowed non-force subject push, it verifies the exact remote tip
and records immutable publication provenance before reaching `INACTIVE`.
Failure preserves `ASSURE`; Git pre-push hooks alone are insufficient.
A published tip may differ from the assured source candidate only through
permitted linear coordination commits.

The trusted publisher must not expose credentials or production authority
to an untrusted agent-executed shell. Establish actual process/network/secret
isolation independently where required; this procedure does not prove it.

Do not perform alternate remote/URL, force/non-fast-forward, delete/mirror/
prune/all/tag push, protected/default-branch mutation, merge, release, deploy,
production workflow dispatch, VPS/SSH mutation, live data/secret changes or
destructive operations. They require separate Owner/external authority.

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

A Work Block must be bound to the intended installation and worktree through
trusted admission and Git-private Controller state. Repository, subject
branch, base and authority profile must agree with trusted Git facts;
changing a shell cwd does not change a native client's session authority. Project-local hooks
are cooperative controls, not substitutes for GitHub branch rules, least-
privilege credentials, or OS isolation. The local predicate fails closed when
it cannot identify the configured default branch; it cannot independently prove
remote GitHub rulesets or credential scope.
