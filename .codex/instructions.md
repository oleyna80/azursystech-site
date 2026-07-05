# Codex Instructions — Project-Level

> System instructions for Codex CLI. Read alongside `AGENTS.md`.
> Root `AGENTS.md` is the shared Agentic SDLC contract.
> This file defines how Codex runs that contract with its own subagents,
> write gate, context hygiene, and optional handoff to Claude Code.

---

## Sub-Agent Delegation Policy

Codex may operate as an independent SDLC runtime. You have `multi_agent = true`.
Keep the main thread as Control Tower: plan,
delegate, collect results, handle Owner/Hard Stop decisions, and report. Use
sub-agents actively whenever delegation materially improves speed, quality,
context isolation, or expected work size. Do not run large/non-trivial pipelines
entirely in the main thread.

Owner approval of a Work Block is explicit authorization to launch scoped
sub-agents automatically when the Work Block is `Subagent-Required` under
`AGENTS.md -> Multi-Agent Default`. This authorization is limited to the
approved scope. It does not expand write authority, side-effect authority,
DB authority, or Hard Stop authority.

Before any non-trivial edit/write action, the first visible Work Block output
must include `Stage 0 Routing Preflight` with Skill Routing Gate, Subagent
Topology, side-effect class, DB action mode, Hard Stops, and
`Write gate: READY` or `Write gate: BLOCKED`. It must also state the Codex
Critic status: `required`, `ready`, `fallback`, or `skipped`.

After Stage 0 and before Stage 1, run Stage 0.5 Codex Critic Review whenever
`.codex/critic.md` mandatory triggers match. This is automatic under Work Block
approval; do not wait for the Owner to ask for the critic separately. Preferred
mode is a read-only native Codex subagent. If that is unavailable, run a
same-session fallback critic pass and label it explicitly in `.codex/write-gate.md`,
`memory_bank/orchestrator-log.md`, and `memory_bank/review-log.md`.

### When to spawn sub-agents

| Situation | Action |
|---|---|
| Stage 1 (Implement) has 2+ independent tasks | Spawn one agent per task, wait for all |
| Running tests, lint, type checks, build | Spawn a verifier agent — keeps main context clean |
| Reading many files for discovery | Spawn a reader agent for each independent area |
| Expected work is large or multi-domain | Split by independent domain/task |
| SSOT sync (Stage 3) | Spawn a sync agent to update memory_bank |

### When NOT to spawn

- Quick-fix pipeline (≤3 files, trivial change) — run inline
- Single-file edit — no benefit from delegation
- Hard Stop operations — handle in main thread for explicit Owner interaction

### Delegation template

When spawning a sub-agent, always include:

1. **Task name**: descriptive (e.g., `implement-feature-x`)
2. **Scope**: exact files the agent may modify (write-set)
3. **Constraints**: "You are not alone in the environment."
4. **Verification tier**: Lite / Standard / Full
5. **Recursion guard**: "Do not spawn sub-agents yourself and do not launch nested external AI CLI tools."
6. **Self-report boundary**: "Report only from your assigned role."
7. **Authority boundary**: include Side-effect class and DB action mode from `AGENTS.md`.
8. **Close**: always `close_agent` when done

---

## SDD Stage Mapping

```
Stage 0 · Plan & Discover  →  Main thread (you)
Stage 0.5 · Critic Review  →  Read-only Codex critic subagent or labeled fallback
Stage 1 · Implement         →  Spawn sub-agent(s) per task from write-set
Stage 2 · Verify            →  Spawn verifier agent OR run inline for Lite tier
Stage 3 · Sync & Report     →  Main thread (you)
```

## Claude Code Handoff

Use Claude Code only when the Work Block benefits from an external team with
its own orchestrator, subagents, hooks, critic/verifier gates, or MCP toolchain.
Do not treat Claude Code as a required part of ordinary Codex execution.

When delegating:

1. Write a task file from `handoff/templates/claude-team-task-template.md`.
2. Include objective, context, approved scope, forbidden scope, timeout,
   expected reports, and external-team-log requirements.
3. Run the handoff runner or queue watcher from the framework repository.
4. Read the result file and logs.
5. Accept, reject, or escalate based on evidence. Claude Code output is an
   external-team delivery, not automatic approval.

When Codex is the mega-orchestrator for a handoff, record the handoff decision
in `memory_bank/orchestrator-log.md`, read `memory_bank/external-team-log.md`
if present, and run Stage 0.5 Codex Critic Review before accepting risky or
multi-file external-team results.

### Verification tier routing

| Tier | Verifier approach |
|---|---|
| Lite | Run `git diff --check` inline, no sub-agent needed |
| Standard | Spawn one verifier agent: types + lint + build |
| Full | Spawn one verifier agent: full check suite |

---

## Context Hygiene

- **Offload noisy reads**: spawn an agent to scan large codebases
- **Keep main thread for planning**: main thread plans, delegates, collects, reports
- **Close agents**: always `close_agent` after collecting results

---

## File Authority

Same as `AGENTS.md § File Write Authority`. Sub-agents inherit your sandbox policy.
Constrain each sub-agent's write-set explicitly.

---

## Memory Bank

Read on session start (main thread):
1. `memory_bank/context.md`
2. `memory_bank/progress.md`
3. `memory_bank/decisions.md`

Update only in Stage 3 (Sync & Report), after verification evidence exists.

Audit logs are written inline during the Work Block:
- `memory_bank/orchestrator-log.md` records Codex-Orchestrator decisions,
  including critic skip reasons and responses to critic findings.
- `memory_bank/review-log.md` records Codex critic, reviewer, verifier, and
  external-team result summaries.

---

## Hard Stops

Sub-agents must NOT perform Hard Stop operations. These stay in the main thread:
- Production deploy
- Live DB migration
- Credential rotation
- Destructive git ops
- Real client communications
