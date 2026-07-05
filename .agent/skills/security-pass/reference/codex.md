---
name: codex-verification
description: "External adversarial review using OpenAI Codex (GPT) through the project Codex MCP server. Use for Full verification tier, security-sensitive Work Blocks, first work in a new domain, or when a second opinion from a different model family is needed. Codex output is evidence, not acceptance — Control Tower validates before acting."
user-invocable: true
argument-hint: "[read-only focus text for adversarial review] [base/ref]"
allowed-tools:
  - mcp__codex__codex
---

# Codex Verification

## Purpose

Run an adversarial review using OpenAI Codex as a second pair of eyes from a
different model family. Complements Claude Verifier — catches blind spots that
one model family misses.

Codex runs locally via the Codex MCP server configured in `.mcp.json`. It shares
the same filesystem and git repository, but the template starts it with
`--sandbox read-only --ask-for-approval never` and this skill uses it as a
read-only advisory reviewer/verifier by default.

## Prerequisites

1. Codex CLI installed: `npm install -g @openai/codex`
2. Codex authenticated: `codex login`
3. MCP server configured in `.mcp.json`: `codex --sandbox read-only --ask-for-approval never mcp-server`
4. Claude settings allow the MCP tool, not direct `Bash(codex *)`

## When to Use (Triggers)

Control Tower MUST invoke this skill when:

- Verification tier is **Full** (security/auth/deploy/DB Work Blocks)
- Changes touch **auth, payments, DB schema, or middleware**
- First Work Block in a new domain (no-skip, critic mandatory)
- Claude verifier verdict is **BLOCKED** or **UNVERIFIED**

Control Tower MAY also invoke it after major refactoring or when another
advisory opinion is useful.

Skip when:
- Codex is not installed or authenticated (log gap, proceed without)
- Verification tier is Lite or Standard only when no other mandatory trigger
  matches
- Work Block is trivial and no mandatory trigger matches

## Workflow

1. Control Tower spawns `gpt-critic` for Stage 0.5 decision review or
   `gpt-verifier` for Stage 2 implementation verification
2. Agent prepares a focused read-only prompt with objective, scope, base/ref,
   changed files or preflight decisions, and project rules
3. Agent calls Codex through `mcp__codex__codex`
4. Agent structures Codex output with session id, mode, scope, findings,
   inspection gaps, and merge recommendation
5. Control Tower merges Codex findings with Claude critic/verifier findings
6. Consolidated results go into the closeout or review report

## Relationship with Other Skills

| Skill | Relationship |
|---|---|
| `verifier` | Codex review runs alongside Claude Verifier — complementary |
| `merge-protocol` | Merge protocol consolidates both Claude + Codex findings |
| `critic-review` | Critic may recommend Codex review for high-risk changes |
| `reviewer` | Codex is an external reviewer, not a replacement for Claude Reviewer |

## Constraints

- Codex output is **evidence, not acceptance** — Control Tower validates
- Codex cannot issue the authoritative verdict — it is an advisory reviewer
- If Codex is unavailable → log gap, proceed with Claude-only verification
- Codex review adds time — use only for Full tier, not every WB
- Codex findings may overlap with Claude findings → merge protocol deduplicates
- Codex must stay read-only/advisory. Prompt it as read-only even though the
  template MCP server also starts it with a read-only sandbox and never-ask
  approval policy.
- Do not call `codex` through Bash; use the MCP tool only
- Degraded Codex/GPT availability never upgrades a non-READY Claude verdict

## Handoff

- **Success condition:** Codex review completed, findings structured, report returned to Control Tower
- **Next:** Merge protocol (consolidate with Verifier findings)
- **Auto-proceed:** YES — Codex is advisory, not a gate
- **Hard stop:** NO
