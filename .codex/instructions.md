# Codex Instructions — Project-Level

> System instructions for Codex CLI. Read alongside `AGENTS.md`.
> Root `AGENTS.md` is the shared Agentic SDLC contract.
> This file defines how Codex runs that contract with its own subagents,
> Controller v1 bindings, context hygiene, and optional handoff to Claude Code.

---

## Sub-Agent Delegation Policy

Codex may operate as an independent SDLC runtime. You have `multi_agent = true`.
Keep the main thread as Control Tower: plan,
delegate, collect results, handle Owner/Hard Stop decisions, and report. Use
sub-agents actively whenever delegation materially improves speed, quality,
context isolation, or expected work size. Do not run large/non-trivial pipelines
entirely in the main thread.

Owner approval of a Work Block is explicit authorization to launch scoped
sub-agents automatically when the approved topology requires them. This
authorization is limited to the approved scope. It does not expand write
authority, side-effect authority, DB authority, or Hard Stop authority.

Before a non-trivial write, report objective, role, approved write-set, trusted
active admission, actual Controller v1 lifecycle state and next required gate.
Resolve trusted installation config from the installed repository's Git common
dir, its external registry, and per-worktree Git-private schema-v2 state.
Tracked schema-v3 state and `.codex/write-gate.md` are historical; they neither
grant nor deny current authority. Missing/corrupt private state is not INACTIVE.
Pre-WB planning uses its admitted path without fabricating controller state.

Independent Critic review binds the committed planning revision in DEFINE;
Controller v1 Critic READY atomically moves to EXECUTE. Candidate admission
requires a clean committed exact SHA; Reviewer and Verifier bind that SHA in
ASSURE. Capability/topology reports are evidence, not admission. Required
independent assurance cannot be replaced by same-context advisory output.

### When to spawn sub-agents

| Situation | Action |
|---|---|
| Stage 1 (Implement) has 2+ independent tasks | Spawn one agent per task, wait for all |
| Running tests, lint, type checks, build | Spawn a verifier agent — keeps main context clean |
| Reading many files for discovery | Spawn a reader agent for each independent area |
| Expected work is large or multi-domain | Split by independent domain/task |
| Coordination / reporting | Use only approved coordination paths; reports do not grant runtime authority |

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

## Controller v1 Lifecycle Mapping

```text
DEFINE  · committed planning → independent Critic READY binding
EXECUTE · scoped implementation → clean exact committed candidate
ASSURE  · Reviewer + Verifier bind exact candidate → trusted publish
INACTIVE · reached only after successful verified publication
```

Revision and scope changes return to DEFINE; implementation rework returns to
EXECUTE. Failed publication preserves ASSURE. Normal success cannot use legacy
Close/finalize helpers or `close --success`.

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
in approved coordination evidence, read existing external-team logs if relevant,
and preserve required independent Critic/Reviewer/Verifier bindings before
accepting risky or multi-file external-team results.

### Verification tier routing

| Tier | Verifier approach |
|---|---|
| Lite | Genuinely trivial checks only; never overrides trusted admission or required independent assurance |
| Standard | Spawn one verifier agent: types + lint + build |
| Full | Spawn one verifier agent: full check suite |

---

## Context Hygiene

- **Offload noisy reads**: spawn an agent to scan large codebases
- **Keep main thread for planning**: main thread plans, delegates, collects, reports
- **Close agents**: always `close_agent` after collecting results

---

## File Authority

Use root `AGENTS.md` authority, lifecycle and write boundaries. Sub-agents inherit your sandbox policy.
Constrain each sub-agent's write-set explicitly.

---

## Memory Bank

Read on session start (main thread):
1. `memory_bank/context.md`
2. `memory_bank/progress.md`
3. `memory_bank/decisions.md`

Update only approved coordination paths after verification evidence exists.
Memory and logs never replace external active admission or Git-private state.

Existing audit-log locations (write only if included in approved scope):
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
