---
name: git-orchestration-flow
description: Safe procedures for Git branch management, stacked PR synchronization, frozen-subject assurance, worktree isolation, two-pass Work Block closure projections, GitHub ruleset handling, PR thread resolution, and SSOT conflict resolution. Use when managing complex Git flows, worktrees, stacked PRs, PR merge blockers, frozen heads, or SSOT reconciliations.
---

# Git Orchestration Flow

Procedural guide for managing Git branches, worktrees, PR lifecycles, stacked
changes, frozen assurance subjects, and SSOT file reconciliations within an
agentic SDLC framework.

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
When a rebase is intentionally selected for a simple feature branch, conflicts in
`FILE_REGISTRY.yml` and `PROJECT_MAP.md` must be reconciled without losing
historical completed Work Blocks or overwriting active state.

Do **not** default to this rebase pattern for already-reviewed stacked PRs where
preserving ancestry, frozen-subject evidence, and review history matters. Use the
stacked synchronization procedure in Section 5 instead.

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

## 5. Stacked PR Synchronization & Frozen Assurance

Use this workflow when a child PR was built on another feature branch and its
parent/base has moved or merged. When terminology, illustrative cases,
evidence-record formats, or Git-tree mode background needs clarification, read
`reference/stacked-pr-synchronization.md`. The workflow, decision rules, and
stops are defined here.

### Rule

Synchronize bottom-up and produce a new child tree that means:

```text
accepted new parent + only the still-intended child delta
```

Preserve review/history with a two-parent merge and a normal non-force update
when that preservation is material. Do not use rebase or force-push as the
default in that situation. The authoritative local check is always
`new_parent -> new_child`, before any remote ref movement.

Accepted parent semantics are the baseline. Do not restore an old whole-file
child version merely to avoid conflict resolution; reapply only child behavior
that remains in scope.

### Inputs and invariant

For each child, record:

```text
P0 = old parent head/base
C0 = old child head
P1 = new accepted or synchronized parent head
C1 = synchronized child head
```

The intended outcome is:

```text
intent_delta = semantic delta of P0 -> C0
C1 tree      = P1 tree + still-valid intent_delta
C1 parents   = [C0, P1]
```

For a stack `main -> A -> B -> C`, process `main -> A`, then `new A -> B`,
then `new B -> C`. Never update an upper child before the exact lower parent is
settled.

### Procedure

1. **Freeze the old child intent.** Record the repository/PR, draft state, P0,
   C0, P1, the old `P0 -> C0` changed paths, new-parent overlap, and the exact
   CI/review/frozen-head subjects currently available. Classify each overlap as
   child-only, additive, parent-superseded, or uncertain/material conflict.
2. **Start from P1.** Switch to the child only after confirming a clean worktree.
   Use a normal merge without committing first when a checkout is available:

   ```bash
   git switch <child-branch>
   git status --short
   git merge --no-ff --no-commit <new-parent-ref>
   ```

   Resolve only the intended surviving child delta. Where direct Git-object
   construction is required, construct `T1` from `P1.tree` plus resolved child
   overlays, create `C1` with parents `[C0, P1]`, and do not move a branch ref
   while doing so.
3. **Resolve with parent-first semantics.** Read the accepted parent version,
   identify the exact still-required child behavior, apply only that behavior to
   the parent version, and preserve accepted architecture, authority,
   documentation placement, tests, and contracts. Blanket `ours`/`theirs`
   strategies are not appropriate for normative files.
4. **Verify C1 locally before remote movement.** Inspect `P1 -> C1`, not merely
   `C0 -> C1`. Confirm the expected changed-file set, surviving child intent,
   absence of stale inherited parent/root surfaces and unrelated paths,
   parent-first conflict resolution, relevant file modes, and ancestry
   `[C0, P1]`. A failed check is a hard stop: do not push or update a remote ref.
5. **Advance non-destructively only after Step 4 passes.** Confirm the remote
   child still equals recorded C0, then use a normal non-force push or an
   `update_ref(force=false)` equivalent:

   ```bash
   git push <remote> <child-branch>
   ```

   A rejected normal update is a hard stop; inspect unexpected movement and do
   not fall back to force-push. Re-read PR base/head and Draft/Ready metadata
   after the update. Mergeability is not proof of semantic correctness.

### Retargeting and synchronization

Retargeting changes the GitHub comparison base; it does not reconcile a child
tree with new parent semantics. Retarget only when the child already includes
the required parent semantics. Otherwise synchronize first, verify
`new_parent -> child`, then retarget if the stack structure requires it. A clean
GitHub diff after retargeting is not sufficient semantic proof.

### Frozen-subject assurance

Independent assurance is bound to exactly:

```text
frozen_base_sha -> frozen_head_sha
```

Before review or verification, read live PR base and head values, confirm both
match the frozen pair, and capture the pair's changed-file set/diff. Immediately
before verdict, re-read both values. If either differs, report `SUBJECT MOVED`;
do not issue a verdict for the old pair or reuse its CI/review as current
assurance. A base retarget or advance changes the assurance subject even if the
head SHA does not move. Older evidence remains historical only.

### Evidence and mutation boundaries

- Identify PR merge-ref/integration CI separately from detached-head execution;
  do not claim the latter unless that is what actually ran.
- Do not write a current validated HEAD into a normative file on that same
  branch: the write creates a new head and invalidates the claim. Use immutable
  inputs or external/provider evidence, and renew assurance if a closeout report
  intentionally joins the frozen subject.
- Treat GitHub Contents API updates as repository mutations, including apparent
  no-op updates that can create a commit. Compare intended bytes first and skip
  a no-op write.
- Use PR metadata operations for title, body, base, Draft/Ready, reviewers, and
  labels when repository content does not need to change.
- When constructing a tree directly, preserve the original modes (for example
  `100644`, `100755`, and `040000`); blob identity alone does not preserve an
  executable bit.
- Never merge into a default branch, release, or otherwise change protected
  remote state without the applicable Owner/repository authority.

### Hard stops

Return to Define/Owner decision instead of resolving automatically when parent
and child contain material product/governance conflict; retaining the child would
undo accepted authority or security semantics; scope must expand; the remote
head moved; history rewrite appears necessary; the intended child delta cannot
be separated from stale inheritance; or external merge/protected-branch
authority is absent.
