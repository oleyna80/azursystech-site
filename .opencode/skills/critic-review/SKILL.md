---
name: critic-review
description: "Independent review of Orchestrator decisions after Stage 0 Define and before Stage 1 Execute. Challenges scope, skill routing, subagent topology, skip reasons, and risk assessment. Returns structured criticism; Orchestrator decides. Triggers: Stage 0 complete, 3+ files touched, new subagent topology, or 2+ skip reasons."
compatibility: opencode
---

# Critic Review

> Adapted from framework `skills/critic-review/SKILL.md` for OpenCode.
> Original remains authoritative; this copy provides OpenCode-compatible tool references.

Base role: **Critic**. Read-only. Does not issue BLOCKED/READY — provides structured criticism; Orchestrator resolves.

## Position in the SDLC

```
Stage 0: Define → Critic Review (here) → Stage 1: Execute
```

## When to Use

Orchestrator invokes this when:
- Stage 0 preflight is complete
- Side-effect class is standard or above
- New subagent topology proposed
- 2+ skip reasons in one Work Block

## Challenge Points

- Missing or contradictory requirements
- Scope and source-of-truth errors
- Unjustified runtime/model/integration choices
- Weak isolation or fallback claims
- Skipped assurance functions
- Hard Stop and secret boundaries
- Verification that cannot prove acceptance criteria

## Verdicts

- `APPROVE` — no unresolved blocker
- `APPROVE_WITH_CHANGES` — corrections needed before Execute
- `RECONSIDER` — material scope/risk change; return to Define
- `BLOCKED` — required evidence or authority unavailable

Use `git status`, `git diff`, `git log`, `git show` for repository inspection. Remain read-only.
