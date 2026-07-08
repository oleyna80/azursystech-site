# OpenCode Runtime Layer

Durable record of the opencode-native agent and skill layer in this repository.
Promoted from WB-001 closeout (2026-07-03).

## Why this exists

The project's Agentic SDLC was originally authored for Claude Code (`.claude/agents/`, `.claude/skills/`) and a Codex runtime (`.codex/`). To run the same SDLC under the opencode runtime used in this workstation, an opencode-native layer was added under `.opencode/`. The Claude and Codex layers remain valid for their runtimes; `.opencode/` is the opencode entry point, not a replacement.

## Subagents (`.opencode/agents/*.md`)

Eight subagents ported from `.claude/agents/` to opencode frontmatter
(`description`, `mode: subagent`, `permission: {edit, bash}`, `color`, `model`).
Bodies are adapt copies, not verbatim — verbose Claude agent-memory taxonomy
sections were trimmed for opencode subagent context budget.

| Agent | model | edit | role |
|---|---|---|---|
| `solution-architect` | opencode-go/glm-5.2 | deny | read-only research before changes |
| `critic` | opencode-go/qwen3.7-max | deny | Stage 0.5 review of CT decisions |
| `reviewer` | opencode-go/glm-5.2 | deny | multi-dimension read-only review |
| `scoped-coder` | opencode-go/kimi-k2.7-code | allow | write-set-scoped implementation |
| `verifier` | opencode-go/deepseek-v4-pro | deny | post-impl READY/BLOCKED gate |
| `gpt-critic` | opencode-go/glm-5.2 | deny | external review via `codex_codex` MCP |
| `gpt-verifier` | opencode-go/glm-5.2 | deny | external verify via `codex_codex` MCP |
| `codex-reviewer` | opencode-go/glm-5.2 | deny | optional deep Codex MCP review |

The three Codex-backed agents (`gpt-critic`, `gpt-verifier`, `codex-reviewer`)
delegate to the `codex_codex` / `codex_codex-reply` MCP tools exposed by this
runtime — not to a shell `codex` CLI. No shell pipe, no plugin dependency.

## Skills (`.opencode/skills/`)

36 skill directories mirrored from `.agent/skills/`. Canonical source is
`.agent/skills/`; `.opencode/skills/` is a re-generated mirror for native
opencode `Skill` tool loading. Skill-curation Work Blocks edit `.agent/skills/`
then re-copy to `.opencode/skills/`. Four folders were renamed to match their
frontmatter `name:` (opencode requires the match):

- `brutalist-skill` -> `industrial-brutalist-ui`
- `minimalist-skill` -> `minimalist-ui`
- `output-skill` -> `full-output-enforcement`
- `redesign-skill` -> `redesign-existing-projects`

`.agent/ROSTER.md` and `FILE_REGISTRY.yml` reflect both the opencode layer and
the rename. `.claude/skills/` (vendor skills with executable assets) stays
Claude Code runtime-local and is not mirrored into `.opencode/skills/`.

## Commands (`.opencode/commands/`)

OpenCode project commands are thin runtime adapters. They must point back to
canonical `.agent/skills/**` contracts instead of duplicating process rules.

Current command:

- `/sprint` -> `.opencode/commands/sprint.md` -> `.agent/skills/sprint-analysis/SKILL.md`

Commands inherit the same safety boundary as the canonical skill: sprint
analysis is read-only by default; report files under `docs/reports/` require an
explicit Owner request; adapters must not edit source code, skills, hooks,
templates, provider config, secrets, stage files, commit, push, or deploy.

## Authority and write ownership

`.opencode/**` is `committed_control_layer` (see `FILE_REGISTRY.yml`). Per
AGENTS.md File Write Authority it is not in the `web/`, `admin/`, `showcase/`,
`scripts/`, `05_ai/` Scoped-Coder row — it is Control Tower owned. The
`edit: allow` permission on `.opencode/agents/scoped-coder.md` is the agent's
own runtime permission when *it* executes inside an approved write-set; it does
not transfer write authority over `.opencode/agents/` itself.

## Liveness

`.opencode/agents/*.md` are read lazily by opencode at session start (new agents
can appear without an explicit restart in some builds, though a restart is the
documented contract). `.opencode/skills/` are loaded at opencode startup.
Model assignment in agent frontmatter is honored by the runtime; per
WB-001, model routing reachability was confirmed for subagent dispatch but
runtime model-loading was not individually probed for all 8 agents — flagged as
an open follow-up.

## Topology precedent set by WB-001

A 44-file control-layer porting WB was run single-agent with skip reason
`trivial`. AGENTS.md rule 2 makes 4+ file WBs `Subagent-Required` and
`trivial` requires ≤3 files, so this was technically a contract violation.
Closed under "Control Tower only" compact preflight with the owner's explicit
acceptance that the work was mechanical copy+adapt of control-layer config with
no runtime/DB/deploy/security impact. This is a documented precedent, **not** a
general carve-out: future 4+ file control-layer WBs should either dispatch a
Scoped Coder or record `user-disabled` with rationale.
