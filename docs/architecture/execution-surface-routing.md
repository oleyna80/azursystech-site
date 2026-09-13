# Execution Surface Routing

## Purpose

This document defines the preferred execution surface for AzurSysTech project work. It is an operational routing rule only and does not change authority defined elsewhere in the repository.

## Default rule

Use the current chat and its connected tools first when they can safely complete the requested operation.

Route to another execution environment only when the required capability is unavailable in the current chat or when local runtime evidence is required.

## Routing

### Chat + connected plugins

Use for Owner/Architect decisions and supported remote operations, especially GitHub work that can be completed through the connected GitHub plugin:

- read repository files, branches, commits, pull requests, diffs, reviews, checks, workflows and logs;
- compare exact SHAs;
- create a non-default branch from an exact approved SHA;
- make bounded documentation-only repository changes that do not require local runtime evidence;
- create or update pull requests;
- independently inspect a pushed candidate;
- verify exact-head CI and mergeability;
- perform an Owner-authorized merge using the exact expected head SHA.

Do not hand these operations to Codex or Work when the current chat already has a safe connected capability and no local evidence is required.

### Codex

Use when execution requires the local repository or development runtime, including:

- isolated worktrees and local branch state;
- local filesystem or untracked-file preservation;
- repository lifecycle scripts and hooks;
- local tests, builds, linters and smoke checks;
- local subagent assurance such as Critic, Reviewer and Verifier;
- proof of local worktree/root/session binding;
- local commits under repository lifecycle rules;
- exact normal non-force publication of an assured subject branch;
- local cleanup after remote integration.

Normal handoff:

```text
Chat defines objective and authority boundary
  -> Codex executes local Work Block
  -> Codex pushes exact subject branch
  -> Codex stops
  -> Chat performs independent remote GitHub review
```

### Work

Use when execution requires browser/computer interaction or broader external multi-application workflows not covered by the current chat plugins or Codex repository runtime.

## Post-push GitHub flow

After Codex publishes a subject branch, remote integration returns to the current chat.

```text
resolve exact remote HEAD
  -> compare with current main
  -> inspect actual changed paths and diff
  -> verify architecture/governance invariants
  -> MERGE / REVISION / REJECT
```

For `REVISION`, return bounded findings to Codex. Codex corrects the same Work Block/subject branch, repeats affected assurance, pushes normally, then stops again.

For `MERGE`, the chat may use the GitHub plugin to:

1. create or update the PR;
2. capture the exact PR head SHA;
3. verify diff and mergeability;
4. inspect GitHub Actions for that exact SHA;
5. inspect failed jobs/logs if needed;
6. return implementation/process failures to Codex as `REVISION`;
7. perform the Owner-authorized merge using the exact expected head SHA;
8. verify the resulting `main` SHA.

Merge never implies deployment.

## Remote-only documentation changes

A separate Codex Work Block is not required when a change is fully remote-safe and does not depend on local repository/runtime evidence, for example a small documentation-only operating rule or PR metadata update.

Preferred flow:

```text
read exact main
  -> create non-default branch
  -> make bounded change
  -> inspect diff
  -> open PR
  -> verify exact-head CI when applicable
  -> Owner-authorized merge
```

Do not use this shortcut for lifecycle, hooks, runtime, build-sensitive, application, migration or deployment changes whose correctness requires local execution evidence.

## Scope boundary

Tool availability does not itself grant authority. Existing project authority, hard-stop and deployment rules remain unchanged. When routing and authority conflict, authority takes precedence.