# AzurSysTech — Codex Instructions

> System instructions for Codex CLI. Read alongside `AGENTS.md`.

---

## Sub-Agent Delegation Policy

You have `multi_agent = true`. Keep the main thread as Control Tower: plan,
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
`Write gate: READY` or `Write gate: BLOCKED`. Edit/write actions may proceed
only when the gate is `READY`. If this preflight is missing, incomplete, or
blocked, stop and create or complete it before editing files, staging,
committing, pushing, deploying, touching DB/env/secrets, or performing
client-facing actions.

### When to spawn sub-agents

| Situation | Action |
|---|---|
| Stage 1 (Implement) has 2+ independent tasks | Spawn one agent per task, wait for all |
| Running tests, lint, type checks, build | Spawn a verifier agent to run checks — keeps main context clean |
| Reading many files for discovery | Spawn a reader agent for each independent area |
| Expected work is large or multi-domain | Split by independent domain/task; main thread coordinates only |
| SSOT sync (Stage 3) | Spawn a sync agent to update memory_bank while you prepare the report |

For `Subagent-Required` Work Blocks, spawn scoped read-only Reviewer, Verifier,
or Analyst agents unless Stage 0 records an allowed skip reason from `AGENTS.md`:
`trivial`, `blocked`, `hard-stop`, or `user-disabled`.

Codex-native Reviewer and Verifier subagents require explicit Work Block
authorization. When the Owner routes Review and Verification through Claude Code
or external audit runners instead, do not spawn Codex-native Reviewer/Verifier
subagents. Record the routing decision in the Work Block plan and `.codex/write-gate.md`.

### When NOT to spawn

- Quick-fix pipeline (≤3 files, trivial change) — run inline
- Single-file edit — no benefit from delegation
- Hard Stop operations — handle in main thread for explicit Owner interaction

### Delegation template

When spawning a sub-agent, always include:

1. **Task name**: descriptive (e.g., `implement-chat-persistence`)
2. **Scope**: exact files the agent may modify (write-set)
3. **Constraints**: "You are not alone in the environment. Do not revert or impact work of other agents."
4. **Verification tier**: Lite / Standard / Full (from plan)
5. **Recursion guard**: "Do not spawn sub-agents yourself and do not launch
   nested external AI CLI tools such as codex, claude, gemini, deepseek, qwen,
   or similar reviewers unless the mission explicitly names `External Audit
   Runner` as the role."
6. **Self-report boundary**: "Report only from your assigned role; do not
   present yourself as Control Tower or judge native/fallback orchestration."
7. **Authority boundary**: for DB, deploy, infra, secret, or client-facing work,
   include `Side-effect class` and `DB action mode` from `AGENTS.md`.
8. **Close**: Always `close_agent` when done

For `Subagent-Required` and otherwise non-trivial Work Blocks, first write a
compact Parallel Decomposition Matrix from `.agent/workflows/sdd-protocol.md`. Use
`.agent/skills/subagent-mission-brief/SKILL.md` as the prompt shape for each
non-trivial sub-agent. A returned sub-agent result is evidence, not acceptance:
Control Tower still checks scope, AC coverage, verification evidence, and risks.

External reviewer output from Claude Code, DeepSeek, Qwen, or another tool is
handled the same way: evidence only. Before requesting an external audit, create
a local task file with objective, scope, read set, forbidden side effects,
file-change permission, and required output format. Do not accept or implement
external findings until they are verified against the live tree.

Native Codex subagents must not try to obtain a second "external verdict" by
running `codex`, `claude`, Gemini, DeepSeek, Qwen, or similar CLI tools from
inside the subagent. Nested external audit execution is a separate work item
owned by Control Tower and must be explicitly assigned as `External Audit
Runner`.

Inherit the current model/reasoning by default. Request a model or reasoning
override only for a concrete task-specific reason, and include that reason in
the mission brief.

Example:
```
Spawn an agent named 'implement-intake-storage':
- Task: implement storage.ts changes per approved write-set
- Files allowed: web/src/lib/intake/storage.ts, web/src/app/api/chat/route.ts
- You are not alone — do not modify files outside your write-set
- Run Tier Standard checks after implementation
- Do not spawn sub-agents
- Report: files changed, checks run, risks
```

---

## SDD Stage Mapping

Follow `sdd-protocol.md` for the 4-stage pipeline. Here is how stages map to agents:

```
Stage 0 · Plan & Discover  →  Main thread (you)
Stage 1 · Implement         →  Spawn sub-agent(s) per task from write-set
Stage 2 · Verify            →  Spawn verifier agent OR run inline for Lite tier
Stage 3 · Sync & Report     →  Main thread (you) — produces Owner report
```

Stage 0 records why work is parallel, sequential, or local. Do not keep a large
review, broad implementation, or independent verification in the main thread
unless the matrix gives a concrete reason.

For non-trivial Work Blocks, Stage 0 Routing Preflight is mandatory evidence.
Verifier must treat missing preflight, incomplete preflight, or any `Write gate`
other than `READY` as a `SPEC_GAPS` result, even if the code or docs diff
otherwise looks correct.

### Verification tier routing

| Tier | Verifier approach |
|---|---|
| Lite | Run `git diff --check` inline, no sub-agent needed |
| Standard | Spawn one verifier agent: `check:types` + `lint` + `build` |
| Full | Spawn one verifier agent: full check suite + contract-verifier checklist |

---

## Context Hygiene

- **Offload noisy reads**: spawn an agent to scan large codebases or run `rg` searches
- **Keep main thread for planning**: main thread = orchestrator. It plans, delegates, collects results, reports
- **Close agents**: always `close_agent` after collecting results to free context
- **Review operational friction**: after large Work Blocks, repeated approval waits, sandbox/tooling failures, or subagent incidents, use the local `agent-operations-review` skill. It may recommend workflow or allowlist changes, but it must not parse raw private transcripts by default or weaken `AGENTS.md` Hard Stops.

---

## File Authority

Same as `AGENTS.md § File Write Authority`. Sub-agents inherit your sandbox policy.
Constrain each sub-agent's write-set explicitly in the spawn message.
Tool capability is not authority. For DB-related work, use `AGENTS.md § DB
Access Matrix` before any DB command, migration, runtime wiring, or verification
gate.

---

## Memory Bank

Read on session start (main thread):
1. `memory_bank/context.md`
2. `memory_bank/progress.md`
3. `memory_bank/decisions.md`

Update only in Stage 3 (Sync & Report), after verification evidence exists.
If updated SSOT files are ignored/local-only, verify them with direct `rg`/`sed`
inspection plus `git check-ignore -v`, and say in the closeout that these
changes will not appear in public Git history unless separately approved.

---

## Hard Stops

Sub-agents must NOT perform Hard Stop operations. These stay in the main thread:
- Production deploy
- Live DB migration
- Credential rotation
- Destructive git ops
- Real client communications

See `AGENTS.md` → Hard Stops.
