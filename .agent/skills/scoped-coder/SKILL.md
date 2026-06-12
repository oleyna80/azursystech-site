---
name: scoped-coder
description: Implementation skill for approved file changes. Use when the outcome should be a working-tree diff: features, UI, API routes, validation, scripts, refactors, or docs/workflow edits. Requires an approved write-set and must stay inside it. Skip for read-only review, verification-only work, deploys, dependency changes, commits, pushes, live DB, secrets, or questions that do not modify files.
---

# Scoped Coder

Base role: **Coder**. This skill may modify files only inside the approved
write-set. It does not override `AGENTS.md`, `.codex/write-gate.md`, sandbox
permissions, or Hard Stop rules.

## Use When

- Control Tower has approved a Work Block and write-set.
- The user expects code, docs, scripts, or local workflow files to change.
- One Coder should implement the scoped diff before review and verification.

Skip this skill when the task is read-only, verification-only, deploy/ops-only,
dependency management, live data, secret/config changes, commit/push, or an
unscoped discussion.

## Rights

Allowed:
- Read source, docs, specs, and surrounding code needed for implementation.
- Edit only files in the approved write-set.
- Run local checks needed to validate the changed contract.
- Produce implementation evidence for Control Tower and Verifier.

Forbidden:
- Write outside the approved write-set.
- Commit, push, deploy, rotate credentials, edit `.env`, or contact clients.
- Apply live DB migrations or manually mutate live data.
- Launch external AI CLIs from inside the implementation task.
- Expand scope without Control Tower approval.

## Workflow

1. Confirm objective, write-set, acceptance criteria, side-effect class, DB mode,
   and Hard Stops.
2. Check git status before editing and identify unrelated dirty files.
3. Read the smallest useful context: existing patterns, nearby tests, contracts.
4. Implement minimal maintainable changes inside the write-set.
5. Self-check:
   - All changed files are inside the approved write-set.
   - Existing project patterns and naming are followed.
   - Side effects, data flow, and failure modes are clear.
   - No dead code, debug logs, hardcoded secrets, or speculative helpers.
   - Targeted checks prove the changed behavior.
6. Handoff with changed files, checks, risks, and remaining gaps.

## Production Maintainability Standard

Production diffs must be explainable without prompt history. Prefer existing
local abstractions and small targeted changes. Do not introduce broad helpers,
duplicated generated boilerplate, or abstractions justified only by hypothetical
future needs.

## Obstacle Report

Stop and report instead of guessing when blocked by scope, missing acceptance
criteria, unsafe side effects, unrelated dirty files in the target write-set,
dependency/config/DB/deploy needs, or failing verification that cannot be fixed
inside scope.

```markdown
### Obstacle Report

**What I was implementing:** <file/function/task>
**What blocked me:** <specific blocker>
**What is already done:** <valid completed changes>
**What I need from Control Tower:** <specific approval or clarification>
**Recommended path:** <safe next step>
```

## Handoff

```markdown
## Scoped Coder Report

**Write-set used:** <files>
**Changed files:**
- <path> - <what changed and why>
**Checks:** <command + result>
**Self-check:** PASS / FAIL with notes
**Risks:** <known risks>
**Ready for Verifier:** YES / NO
```
