# Claude Code Team Task: WB-2026-06-24-a2-agent-runtime-control-readiness

## Invocation

Run Phase A from the repository root first. Phase A is read-only and must not
modify files:

```bash
cd /home/azur/Projects/WSL/azursystech
timeout -k 5s 1800s claude -p \
  < docs/plans/WB-2026-06-24-a2-agent-runtime-control-readiness-claude-team-task.md \
  > /tmp/WB-2026-06-24-a2-agent-runtime-control-readiness-claude-inventory.out \
  2> /tmp/WB-2026-06-24-a2-agent-runtime-control-readiness-claude-inventory.err
```

Run Phase B only after Codex Control Tower refreshes `.codex/write-gate.md`,
`.agent/critic-gate.md`, and `.agent/verification-gate.md` for this WB, and
after the Owner approves exact write pathspecs from Phase A:

```bash
cd /home/azur/Projects/WSL/azursystech
timeout -k 5s 1800s claude -p --permission-mode acceptEdits \
  < docs/plans/WB-2026-06-24-a2-agent-runtime-control-readiness-claude-team-task.md \
  > /tmp/WB-2026-06-24-a2-agent-runtime-control-readiness-claude-implementation.out \
  2> /tmp/WB-2026-06-24-a2-agent-runtime-control-readiness-claude-implementation.err
```

No token, model-spend, or artificial reasoning budget limit is assigned. The
timeout only prevents a hung shell process.

## Base Role

Claude Code Team Runtime under Codex Control Tower.

## Mission Role

Runtime-control readiness team: architecture audit, critic review, scoped
implementation if needed, read-only review, and independent verification.

## Objective

Audit and prepare the project-local agent runtime/control layer for a selective
commit candidate, using Claude Code project subagents as much as practical while
respecting role boundaries and write gates. Phase A is read-only inventory,
review, and write-set proposal. Phase B may implement only after refreshed gates
and exact Owner-approved pathspecs exist.

## Context

Codex is the Control Tower. Claude Code is the controlled execution runtime.
Codex direct native subagent use is limited to Critic. Claude Code should use
its project-local subagents for architecture/topology review, critic review,
scoped coding, review, and verification. GPT subagents must call Codex only
through `mcp__codex__codex`; direct Bash `codex` calls are forbidden.

The project has a large unrelated dirty tree. Do not touch application source,
deploy files, production config, DB/schema, package/dependency files, secrets,
or private/local config. Do not read or emit contents of local-private config;
metadata checks such as ignore/status/existence are allowed.

## Required Project-Local Skills

- `subagent-mission-brief`
- `ai-runtime-ops`
- `scoped-coder`
- `reviewer`
- `verifier`
- `security-verification-gate`
- `scoped-commit-guard`
- `shell-context-guard`

If a required skill is unavailable, report `skill-blocked:<reason>` and do not
silently replace it with memory-derived steps.

## Required Subagents

Use these subagents unless unavailable. If unavailable, report a concrete
`subagent-blocked:<name>:<reason>` entry.

- `solution-architect`: read-only topology and runtime boundary review.
- `critic`: read-only Stage 0 review of scope, gates, and write-set.
- `gpt-critic`: read-only adversarial review through `mcp__codex__codex`.
- `scoped-coder`: only write-capable implementation agent.
- `reviewer`: read-only candidate review.
- `verifier`: read-only final verification.
- `gpt-verifier`: read-only adversarial verification through `mcp__codex__codex`.
- `codex-reviewer`: optional extra deep Codex MCP review if reviewer/verifier finds non-trivial risk.

## Scope

Read and reason about:

```text
AGENTS.md
CLAUDE.md
.agent/README.md
.agent/ROSTER.md
.agent/critic-gate.md
.agent/verification-gate.md
.agent/workflows/sdd-protocol.md
.claude/settings.json
.claude/hooks/
.claude/agents/
.claude/agent-memory/
.claude/skills/
.codex/agents/
.codex/config.toml.template
.codex/critic.md
.codex/hooks/
.codex/instructions.md
.codex/write-gate.md
.mcp.json
docs/plans/WB-2026-06-24-a2-agent-runtime-control-readiness.md
docs/templates/work-block-template.md
docs/templates/subagent-mission-brief-template.md
```

Read-only candidate universe for Phase A inventory:

```text
.agent/critic-gate.md
.agent/verification-gate.md
.codex/write-gate.md
.claude/settings.json
.claude/hooks/hard-stop.sh
.claude/hooks/critic-gate.sh
.claude/hooks/typecheck.sh
.claude/hooks/verification-gate.sh
.claude/agents/*.md
.claude/agent-memory/*/MEMORY.md
.claude/skills/SKILL-CONVENTION.md
.claude/skills/*/SKILL.md
.claude/skills/*/agents/*.yaml
.claude/skills/*/scripts/*
.claude/skills/*/reference/*
.claude/claude-security-guidance.md
.claude/security-patterns.yaml
.codex/agents/*.toml
.codex/config.toml.template
.codex/critic.md
.codex/hooks/stage0_write_gate.py
.codex/instructions.md
docs/reports/WB-2026-06-24-a2-agent-runtime-control-readiness-*.md
```

This candidate universe is not write authority. It is for read-only inventory
and classification only.

## Out of Scope

- `web/`, `showcase/`, CI, Docker, nginx, deploy scripts, VPS config,
  production config, database/schema, payment/order/lead behavior, provider
  integrations, dependencies, package lockfiles, generated outputs, caches.
- `.claude/settings.local.json`, `.codex/config.toml`, global `~/.mcp.json`,
  `.env*`, secrets, tokens, private keys, provider credentials, private
  transcripts. Do not read, copy, summarize, scan content into logs, or report
  content from these files; only ignore/status/existence metadata is allowed.
- Git staging, commit, push, branch switch, stash, reset, clean, deletion, or
  history rewrite.

## Allowed Tools / MCP

- Shell read commands, `git status`, `git diff`, `git ls-files`, `git check-ignore`.
- `bash -n` for shell hook syntax.
- Available parsers for JSON/TOML/YAML where installed.
- `mcp__codex__codex` only from `gpt-critic`, `gpt-verifier`, or `codex-reviewer`.

## Nested External AI CLI

Forbidden. Do not run `codex` through Bash. Do not pipe prompts or diffs into a
shell-based external AI command. Use `mcp__codex__codex` only.

## Approved Write-Set

Phase A approved write-set:

```text
none
```

Phase B approved write-set:

```text
BLOCKED until Codex Control Tower provides exact pathspecs in refreshed gates.
```

Do not use wildcard directory grants as write authority. If `.codex/write-gate.md`,
`.agent/critic-gate.md`, or `.agent/verification-gate.md` still reference another
Work Block or do not list exact A2 pathspecs, return `BLOCKED_BY_GATE` with the
exact reason. The broad candidate universe above is not an approved write-set.

## Hard Stops

Stop and return `BLOCKED` if:

- any real secret, token, key, private path, or provider credential appears in
  a tracked candidate file;
- `.claude/settings.local.json`, `.codex/config.toml`, global MCP config,
  `.env*`, app code, deploy/prod config, DB/schema, or package/dependency files
  require modification or content inspection;
- `.codex/write-gate.md`, `.agent/critic-gate.md`, or
  `.agent/verification-gate.md` are stale, missing, or authorize a different WB
  during a write-capable Phase B run;
- Phase B has no exact approved write pathspec list;
- any non-`scoped-coder` subagent would need to write files;
- GPT critic/verifier cannot use `mcp__codex__codex` and the WB requires GPT
  evidence;
- hook/gate changes weaken hard stops or allow broad/destructive actions.

## Required Checks

Run or explicitly justify skipped:

```bash
git status --short --branch
bash -n .claude/hooks/hard-stop.sh .claude/hooks/critic-gate.sh .claude/hooks/typecheck.sh .claude/hooks/verification-gate.sh
python -c "import ast, pathlib; ast.parse(pathlib.Path('.codex/hooks/stage0_write_gate.py').read_text())"
git diff --check -- <approved-exact-pathspecs>
git check-ignore -v .claude/settings.local.json .codex/config.toml .env .env.local
rg --files-with-matches "(BEGIN (RSA|OPENSSH|EC) PRIVATE|PRIVATE KEY|Bearer [A-Za-z0-9_.-]{20,}|api[_-]?key|secret|token|DATABASE_URL|ANTHROPIC_API_KEY|OPENAI_API_KEY)" <approved-exact-pathspecs>
```

For Phase A, where no approved write-set exists yet, replace
`<approved-exact-pathspecs>` with this task file and the main WB plan only.
Full-tree `git diff --check` is informational while unrelated dirty files exist;
do not fail Phase A solely on unrelated dirty files.

If a parser is available, also parse changed JSON/TOML/YAML config files.

## Expected Output

Return a concise but evidence-backed report with these sections:

1. `Subagent dispatch evidence`
   - list each required subagent;
   - status: USED, NOT_REQUIRED, DEGRADED, or BLOCKED;
   - report path or stdout evidence marker;
   - whether it wrote files.
2. `Inventory`
   - synchronized candidate files;
   - local/private files that must remain unstaged;
   - uncertain files needing Owner decision.
   - exact Phase B write pathspec proposal, if edits are needed.
3. `Changes made`
   - exact files changed by `scoped-coder`, or `none`.
4. `Review findings`
   - findings first, severity ordered;
   - each finding dispositioned.
5. `Verification`
   - commands run and result;
   - skipped checks and residual risk.
6. `Commit readiness`
   - exact pathspecs recommended for later selective commit;
   - exact paths to leave unstaged.
7. `Verdict`
   - `READY_FOR_CODEX_REVIEW`, `READY_FOR_OWNER_COMMIT_DECISION`, or `BLOCKED`.

## Handoff Target

Codex Control Tower. Do not commit or push.
