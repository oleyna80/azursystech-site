---
name: git-orchestration-flow
description: Safe procedures for Git branch management, worktree isolation, two-pass Work Block closure projections, GitHub ruleset handling, PR thread resolution via GraphQL, and SSOT file conflict resolution. Use when managing complex Git flows, worktrees, PR merge blockers, or SSOT reconciliations.
---

# Git Orchestration Flow

Procedural guide for managing Git branches, worktrees, PR lifecycles, and SSOT file reconciliations within an agentic SDLC framework.

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
Finalizing a Work Block changes normative surfaces (`status: completed`, `active_work_block: null`), which alters SHA-256 aggregates. To preserve independent assurance integrity, use a two-pass sequence.

### Procedures

1. **Preliminary Candidate Assurance:**
   Compute the aggregate on the active candidate state and run independent preliminary assurance (Reviewer, Verifier, Drift Analyst).

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
GitHub repository rulesets (`required_review_thread_resolution: true`) block PR merges even when all CI checks pass if unresolved review comments exist (including outdated comments).

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
Resolve threads that have been addressed or invalidated by newer commits:
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
