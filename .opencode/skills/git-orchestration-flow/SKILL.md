---
name: git-orchestration-flow
description: Safe procedures for Git branch management, worktree isolation, two-pass Work Block closure projections, GitHub ruleset handling, PR thread resolution, SSOT conflict resolution, and the AzurSysTech Owner-controlled GitHub Free publication handoff. Use when managing complex Git flows, worktrees, PR merge blockers, source publication, or SSOT reconciliations.
---

# Git Orchestration Flow

Procedural guide for managing Git branches, worktrees, PR lifecycles, source publication, and SSOT file reconciliations within the AzurSysTech agentic SDLC.

## 1. Worktree Isolation & Cleanup

### Rule
When delegating work to isolated subagents or parallel streams, use dedicated worktrees or clones. Never attempt to delete a branch currently checked out in an active worktree.

### Procedures

#### Detaching HEAD before Branch Deletion
If a branch cannot be deleted because it is checked out in a worktree:
```bash
git checkout --detach origin/main
git branch -d <branch-name>
```

#### Pruning Worktrees
To forcibly remove a completed or obsolete worktree:
```bash
git worktree remove /path/to/worktree --force
git worktree prune
```

---

## 2. Two-Pass Closure Projection Pipeline

### Rule
Finalizing a Work Block changes normative surfaces (`status: completed`, `active_work_block: null`), which alters SHA-256 aggregates. To preserve assurance integrity, use a two-pass sequence when the Work Block requires that projection discipline.

### Procedures

1. **Preliminary Candidate Assurance:**
   Compute the aggregate on the active candidate state and run the required preliminary assurance (Reviewer, Verifier, Drift Analyst as configured).

2. **Ephemeral Projection:**
   Create an ephemeral non-repository projection to verify terminal state:
   ```bash
   cp -r . /tmp/wb-final-projection/
   # Edit /tmp/wb-final-projection/ files to project completed/no-active state
   ```

3. **Preflight Assurance:**
   Run preflight assurance against the ephemeral projection directory.

4. **Working Tree Application:**
   Apply the byte-equivalent projection changes to the working tree, re-verify deterministic checks, and commit.

---

## 3. GitHub PR Thread Resolution & Ruleset Handling

### Rule
Where a GitHub repository ruleset requires review-thread resolution, unresolved review comments can block merge even when CI is green.

AzurSysTech itself is currently private on GitHub Free and does not claim protected-main ruleset enforcement. Do not transplant public-framework ruleset assumptions into this project.

### Procedures

#### Inspecting PR Blockers
Check PR merge state and review threads:
```bash
gh pr view <pr-number> --json mergeStateStatus,mergeable,reviewDecision
```

#### Finding Unresolved Threads via GraphQL
```bash
gh api graphql -f query='
{
  repository(owner: "OWNER", name: "REPO") {
    pullRequest(number: PR_NUMBER) {
      reviewThreads(first: 20) {
        nodes {
          id
          isResolved
          isOutdated
          comments(first: 1) { nodes { body } }
        }
      }
    }
  }
}'
```

#### Resolving Outdated Threads
Resolve threads that have been addressed or invalidated by newer commits only when the active authority model permits that GitHub mutation:
```bash
gh api graphql -f query='
mutation {
  resolveReviewThread(input: {threadId: "THREAD_ID"}) {
    thread { id isResolved }
  }
}'
```

---

## 4. SSOT File Conflict Resolution (Rebase Pattern)

### Rule
When rebasing feature branches onto `main`, conflicts in `FILE_REGISTRY.yml` and `PROJECT_MAP.md` must be reconciled without losing historical completed Work Blocks or overwriting active state.

### Procedures

#### Reconciling `FILE_REGISTRY.yml`
- Retain all historical completed Work Blocks in `completed_work_blocks`.
- Set `active_work_block` to the current active plan (or `null` if closing).
- Retain all new file entry definitions (`entries:`).

#### Reconciling `PROJECT_MAP.md`
- Preserve the completed Work Block list in both HTML comment blocks and human-readable text.
- Maintain accurate architectural decision references.

#### Rebase Continuation
After editing conflict markers:
```bash
git add FILE_REGISTRY.yml PROJECT_MAP.md
GIT_EDITOR=true git rebase --continue
```

---

## 5. AzurSysTech GitHub Free Owner-Controlled Publication

### Rule
For `oleyna80/azursystech-site`, the repository remains private on GitHub Free and remote source publication is Owner-controlled.

The normal agent path may edit, test, stage, and create local commits inside an approved Work Block/write-set, but it **stops before `git push`**. Technical access to an Owner credential does not create authority to use it.

Canonical project workflow:

- `.agent/workflows/owner-controlled-github-flow.md`

Durable decision record:

- `docs/engineering-memory/github-free-owner-controlled-flow.md`

### Required feature-branch publication handoff

Before any source publication, freeze the exact local branch head and report:

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

Then stop. Do not autonomously execute the push.

### After Owner publication

1. Verify the remote feature branch resolves to the exact handed-off SHA.
2. Inspect/create/update the PR only within current GitHub authority.
3. Inspect CI and review state.
4. Remediate locally inside the Work Block if needed.
5. If the local HEAD changes, issue a new publication handoff for the new SHA.

One Owner publication decision covers only the exact SHA/ref handed off. It does not authorize later commits, `main`, force push, remote deletion, tags/releases, workflow dispatch, production, VPS, DB, or secrets.

### Merge handoff

When PR state is ready, report the exact PR/head/checks and request Owner merge. A green PR does not grant merge authority.

### Production separation

Merge does not grant deploy authority. Production remains a separate Owner-controlled operation governed by the deploy-operations skill and manual deployment workflow.

### Security statement

This is an operational governance boundary for the current private GitHub Free mode. It is not technical protected-branch enforcement and must never be represented as equivalent to a ruleset.
