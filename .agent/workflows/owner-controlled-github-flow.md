# Owner-Controlled GitHub Flow — AzurSysTech

> Project-specific execution workflow for `oleyna80/azursystech-site` while the repository is private on GitHub Free.

## Purpose

Define the exact handoff between autonomous local agent work and Owner-controlled remote publication.

This workflow replaces per-Work-Block SSH signing for ordinary development. It does not replace Work Block/write-set/Critic/Reviewer/Verifier controls and does not grant production authority.

## Trigger

Use this workflow whenever work may progress from a local feature branch to GitHub publication, PR review, merge, release preparation, or deployment consideration.

## Authority boundary

### Agent may perform locally

- inspect repository state;
- edit only approved Work Block/write-set paths;
- run tests, builds, lint, type checks, and local disposable tooling;
- stage approved paths;
- create local commits;
- prepare/freeze a feature branch;
- run Critic/Reviewer/Verifier functions as required;
- inspect GitHub state after the Owner publishes the branch.

### Agent must stop before

- `git push` for `oleyna80/azursystech-site`;
- direct update of `main`;
- force/non-fast-forward/broad/mirror/prune/delete push;
- merge;
- tag/release publication;
- production workflow dispatch;
- VPS/SSH mutation;
- live DB/data mutation;
- credential/secret changes.

Technical access to a credential does not create authority to cross this boundary.

## Stage A — Local development

1. Confirm active Work Block, write-set, acceptance criteria, and side-effect class.
2. Implement inside scope.
3. Run required deterministic checks.
4. Stage only approved paths.
5. Create local commit(s).
6. Confirm the intended feature branch is not `main`.
7. Freeze the exact local feature-branch HEAD SHA.

Do not ask the Owner to publish an unfrozen or ambiguous branch state.

### Parallel worktrees and coordination SSOT

A Git worktree and a Work Block have separate lifecycles. Creating a worktree does **not** close, freeze, or supersede the Work Block in another checkout.

For parallel work:

1. create/use a dedicated non-default Git branch and worktree for each write-capable agent session;
2. open the Work Block from that worktree so `.agent/active-work-block.json` records the same `subject_branch` as the checked-out branch;
3. start the agent session with its process `cwd` inside that intended worktree — a `cd /other/worktree` embedded inside a later shell command does not rebind hook identity because `event.cwd` is supplied before command execution;
4. before source or coordination writes, verify:

```text
pwd
git rev-parse --show-toplevel
git branch --show-current
git rev-parse HEAD
cat .agent/active-work-block.json
```

The resolved top-level directory must be the intended worktree, the branch must equal `subject_branch`, and the active `work_block_id` must be the one intended for that session.

Normal coordination artifacts (`docs/plans/**`, `docs/specs/**`, `.agent/critic-gate.md`, `.agent/verification-gate.md`, `.codex/write-gate.md`, and related SSOT) are branch-bound exactly like source writes. Only `.agent/active-work-block.json` remains directly repairable when stale/invalid binding state must be corrected.

When prior work is complete or intentionally stopped, perform its explicit lifecycle transition (`freeze`/`close` as applicable) in that worktree. Do not treat creation of a new branch/worktree as lifecycle closeout of the old Work Block.

## Stage B — Assurance before publication handoff

Run the Work Block's required assurance sequence.

At minimum record:

- implementation status;
- deterministic checks;
- Critic state when required;
- Reviewer state when required;
- Verifier state when required;
- unresolved blockers or residual risks.

If required assurance is blocked, the publication handoff must say `BLOCKED`; do not present the branch as merge-ready.

## Stage C — Owner publication handoff

Produce exactly one bounded handoff block containing:

```text
OWNER PUBLICATION HANDOFF
Repository: oleyna80/azursystech-site
Branch: <feature-branch>
Exact HEAD: <40-char SHA>
Intended remote ref: origin/<feature-branch>
Scope: <concise changed-file/domain summary>
Checks: <PASS/BLOCKED + exact relevant checks>
Assurance: <current Critic/Reviewer/Verifier states>
Production impact: NONE
Requested Owner action: publish this exact feature branch only
```

Then stop. Do not execute the push autonomously.

## Current Work Block Handoff — 2026-08-25 synchronized SEO-003 candidate

OWNER PUBLICATION HANDOFF
Repository: oleyna80/azursystech-site
Branch: feat/automatiser-demandes-clients-guide
Exact HEAD: `<exact current branch HEAD from git rev-parse HEAD at handoff time>`
Intended remote ref: origin/feat/automatiser-demandes-clients-guide
Scope: localized evergreen guide, contextual Nice/AI links, sitemap entry set, regressions, and bounded governance/evidence correction in the approved write-set
Checks: PASS — control-plane 11/11, traceability, focused SEO-003 20/20, test:ci 158 passed/3 skipped, types, lint (0 errors/6 existing warnings), build 54/54, diff checks, Crash Test Gate
Assurance: Critic READY/APPROVE; Review READY/READY; Verification READY/READY; Drift READY/ALIGNED; optional Evaluation SKIPPED with reason
Production impact: NONE
Requested Owner action: publish the exact current feature branch HEAD above only; it is a descendant of synchronization merge commit 76cd3271785bc4493111ea4bd5fe42a25e876dc2

The synchronization candidate/merge commit was performed before the evidence/governance descendant. No remote publication, PR merge, deploy, or production action was performed for this handoff.

## Stage D — After Owner publication

After the Owner confirms the feature branch was published:

1. verify the remote branch resolves to the exact handed-off SHA;
2. create/update or inspect the PR as authorized by the active workflow;
3. inspect CI and review state;
4. remediate findings locally inside the Work Block;
5. if remediation creates a new HEAD, return to Stage B and issue a new publication handoff.

Owner approval for one SHA does not automatically authorize publication of later commits.

## Stage E — Merge handoff

When PR checks and assurance are ready, report:

```text
OWNER MERGE HANDOFF
PR: <number>
Branch: <feature-branch>
Exact PR head: <40-char SHA>
CI: <required checks and results>
Review/Verifier: <states>
Unresolved threads/blockers: <none or exact list>
Requested Owner action: merge this exact PR head
```

Do not merge autonomously.

## Stage F — Production separation

Merge completion ends the source-publication workflow.

Production is a separate Owner-controlled operation. Do not infer deploy authorization from:

- successful local tests;
- publication approval;
- PR approval;
- green CI;
- merge completion.

For production use the project deploy-operations skill and the explicit Owner-controlled deployment path.

## Failure modes

Stop and report `BLOCKED` when:

- branch is `main`;
- exact HEAD cannot be determined;
- worktree contains unreviewed scope drift relevant to the handoff;
- required checks are failing or unavailable and the Work Block requires them;
- the intended remote ref is ambiguous;
- the Owner publication target no longer matches the frozen SHA;
- a requested action includes production, DB, VPS, secrets, destructive Git, or other consequential side effects not separately authorized.

## Security statement

This workflow is an operational governance control for a private GitHub Free repository. It is not technical branch protection and must not be represented as such.

Canonical durable decision: `docs/engineering-memory/github-free-owner-controlled-flow.md`.
