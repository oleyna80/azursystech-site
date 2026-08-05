---
name: subagent-mission-brief
description: "Support skill for writing clear operational mission briefs for subagents, delegated reviews, verification gates, and scoped implementation handoffs. Triggers when delegating non-trivial work: review, verify, implement, analyze, audit."
compatibility: opencode
---

# Subagent Mission Brief

> Adapted from framework `skills/subagent-mission-brief/SKILL.md` for OpenCode.
> Original remains authoritative; this copy provides OpenCode-compatible tool references.

## Purpose

Use when Orchestrator delegates non-trivial work to a subagent and needs a concise operational assignment instead of a broad prompt. The brief defines authority, focus, scope, tools, stop conditions, expected output, and handoff target.

## When to Use

- Architecture, security, backend, frontend, QA, docs, or product analysis
- Large file inspection or broad review
- Independent verifier or reviewer gates
- Scoped implementation with an approved write-set
- Tasks where output is large enough to keep out of the main chat

## When to Skip

- Trivial local tasks where delegation adds overhead
- One-line checks or simple status commands
- Discussion-only turns

## Brief Structure

1. **Identity and outcome** — Work Block, lifecycle stage, base role, objective, expected handoff
2. **Scope and authority** — in/out scope, required inputs, selected procedure, isolation
3. **Permission boundary** — approved write-set (or none), writer ownership, side effects
4. **Evidence and hard stops** — required checks, sibling assignments, expected response format
