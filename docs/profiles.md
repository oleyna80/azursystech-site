# Project Profiles

Start with the smallest profile that can safely deliver the Work Block. Upgrade
only when the task needs the extra process, tools, or independent review.

Before choosing a profile in a new session, read `PROJECT_MAP.md`,
`FILE_REGISTRY.yml`, and `docs/session-bootstrap.md`. The map and registry
explain the current project structure and authority boundaries; this profile
guide explains how much of the project-local Agentic SDLC layer to activate.

## Profile Summary

| Profile | Use When | Main Files | Avoid Initially |
|---|---|---|---|
| Level 1 - Minimal Codex-only | One local agent needs scope, logs, review, and verification | `AGENTS.md`, `.codex/`, `memory_bank/`, core templates | Claude Code handoff, MCP additions, deploy/live operations |
| Level 2 - Standard Codex SDLC | Work needs full Work Blocks, project-local skills, and stronger closeout | Level 1 plus `.agent/`, `docs/`, selected skills | External AI CLI delegation |
| Level 3 - Claude Code Team Runtime | Claude Code runs as a controlled execution runtime with internal subagents, hooks, memory, and provider config. Codex remains the project-level Control Tower. | `CLAUDE.md`, `.claude/`, `.agent/` | Automated handoff until Claude Code works locally |
| Level 4 - Codex -> Claude Code Handoff | Codex should delegate a scoped Work Block to Claude Code as an external team | task file under `docs/plans/` or equivalent, `memory_bank/external-team-log.md` | Parallel swarms until single handoff is reliable |
| Advanced overlay - Codex model routing | Strong Codex reasoning should supervise cheaper executor models | user-level Codex profiles, `.codex/critic.md`, `docs/reference/codex-model-routing.md` | provider credentials or proxy URLs in committed project files |

## Level 1 - Minimal Codex-only

### Included

```text
AGENTS.md
.codex/write-gate.md
.codex/critic.md
memory_bank/orchestrator-log.md
memory_bank/review-log.md
docs/templates/work-block-template.md
.agent/skills/scoped-coder/
.agent/skills/reviewer/
.agent/skills/verifier/
```

### Expected Flow

```text
Stage 0 preflight -> scoped implementation -> critic/reviewer check ->
verification -> closeout log
```

### Smoke Check

```bash
bash scripts/bootstrap.sh
```

Expected result: bootstrap preflight passes.

### Upgrade When

- tasks repeatedly need specialized skills;
- the project needs reusable memory discipline and tasklist sync;
- Work Blocks need standard closeout and publication evidence.

## Level 2 - Standard Codex SDLC

### Included

Everything in Level 1, plus:

```text
.agent/ROSTER.md
.agent/workflows/
.agent/skills/
docs/plans/
docs/specs/
docs/reports/
docs/tasklist/
memory_bank/context.md
memory_bank/progress.md
memory_bank/decisions.md
```

### Expected Flow

```text
Plan -> Spec -> Implementation -> Review -> Verification -> Closeout
```

Codex can use its own subagents when available and allowed by the active
runtime. The Orchestrator remains accountable for scope, write-set, critic
routing, hard stops, and final evidence.

### Smoke Check

```bash
git status --short --branch
bash scripts/bootstrap.sh
```

### Upgrade When

- a second agent/runtime should review or implement independently;
- the Work Block benefits from Claude Code's native agents, hooks, or MCP
  integrations.

## Level 3 - Claude Code Team Runtime

### Included

Everything in Level 2, plus:

```text
CLAUDE.md
.claude/settings.json
.claude/agents/
.claude/hooks/
.claude/skills/
.claude/agent-memory/
```

### Expected Flow

Claude Code acts as a controlled execution runtime with its own internal
subagent management, hooks, critic/verifier gates, and project-local memory.
Codex remains the project-level Control Tower and Orchestrator. Agent
definitions should inherit model/provider behavior from the active Claude Code
environment.

### Smoke Check

```bash
claude --version
bash scripts/bootstrap.sh
```

Then run a small read-only Claude Code task before allowing state-changing work.

### Upgrade When

- Codex should remain the control tower;
- Claude Code should be called for a scoped Work Block and return a result/log
  through files.

## Level 4 - Codex -> Claude Code Handoff

### Included

Level 2 or Level 3 project files, plus a project-local task file that defines:

- objective and scope;
- read set and write-set;
- forbidden side effects;
- timeout and fallback behavior;
- required output contract;
- review and verification evidence expected by Codex.

Record completed external-team work in `memory_bank/external-team-log.md`.

### Expected Flow

```text
Codex writes task -> external Claude Code team works within scope -> result/log
written -> Codex reviews result -> local verification -> closeout
```

### Smoke Check

Use a small read-only or docs-only task before using handoff for production
code, DB, deploy, provider, or client-facing work.

## Advanced Overlay - Codex Model Routing

This is not a separate runtime level. It is an optional overlay for users who
want strong models only where they add clear value and cheaper models where the
task is bounded execution.

### Recommended Topology

```text
Codex mega-orchestrator
  -> Codex critic for decision review
  -> Claude Code teams for controlled implementation when needed
```

Use Codex for decomposition, architecture decisions, handoff acceptance, and
critic review. Use Claude Code teams for scoped implementation when their hooks,
logs, subagents, and project-local process make execution more controllable.

### Configuration Boundary

The project may contain templates and policy only. Real provider settings, API
keys, proxy URLs, organization-specific provider definitions, and local model
endpoints belong in the user's runtime configuration or a private environment.

Do not commit provider credentials, `.env` files, user-level Codex/Claude Code
runtime config, or private local model settings into the project.

### Suggested Codex Profiles

Keep real config in user-level Codex profiles such as:

```text
~/.codex/strong-review.config.toml
~/.codex/cheap-worker.config.toml
~/.codex/oss-local.config.toml
```

Use the strongest available model for Codex-Orchestrator decisions and Codex
Critic review. Use cheaper or local models only after a smoke task proves they
can handle the intended executor role.

See `docs/reference/codex-model-routing.md` for the detailed project-local
policy.

## Profile Selection Rules

- Run the session bootstrap first; do not select a higher profile from stale
  memory alone.
- Prefer Level 1 for narrow docs/workflow or single-agent Work Blocks.
- Use Level 2 when repeatable SDLC evidence matters.
- Use Level 3 only after Claude Code CLI and provider configuration work in the
  target shell.
- Use Level 4 only after a local Claude Code task has succeeded and the handoff
  process has passed a smoke task.
- Use Codex model routing only as an overlay. It must not weaken critic,
  verification, write-gate, or secret-handling rules.
- Do not add a higher level because it is available. Add it because the Work
  Block needs independent execution, better observability, or stronger review.

## Publishing Agent State

Project workflow files are local-first unless deliberately synchronized. If a
team wants to publish `.agent/`, `.codex/`, `.claude/agent-memory/`, or
`memory_bank/`, review every file for:

- secrets and provider credentials;
- private client/project context;
- raw transcripts;
- local machine paths;
- generated logs;
- unreviewed agent conclusions.

Publish only reusable governance and evidence that the team deliberately wants
to share.
