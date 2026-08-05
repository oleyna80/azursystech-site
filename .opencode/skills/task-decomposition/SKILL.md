---
name: task-decomposition
description: "Decompose objectives into atomic tasks with verifiable acceptance criteria. Use when the Orchestrator needs staged work, breaking down goals, creating tasklists. Triggers: разбей на задачи, сделай tasklist, декомпозиция, create a task list."
compatibility: opencode
---

# Task Decomposition

> Adapted from framework `skills/task-decomposition/SKILL.md` for OpenCode.
> Original remains authoritative; this copy provides OpenCode-compatible tool references.

## Rules

1. One task = one verifiable result.
2. Explicit dependencies between tasks.
3. AC must be measurable only.
4. For large approved Work Blocks, set `Execution mode: End-to-end autonomous`.
5. Start Work Block with `Expected Final Result`: end state the Owner can verify.
6. Separate `Must Resolve Before Start` from `Can Resolve During Work`.
7. Explicitly note when independent assurance (Reviewer, Verifier, Critic) is needed.
8. For significant Work Blocks, define `Retrospective Plan` upfront.

## Output

`docs/tasklist/<ticket>.tasklist.md`

Structure: Task ID, Objective, Scope, Dependencies, AC (checkable), Execution Notes, Stage mapping (Define/Execute/Assure/Close).
