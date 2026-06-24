# Claude Code Coder Task: A5 Codex Runtime Decision

## Mission Brief

- **Base Role:** Coder
- **Mission Role:** Codex Runtime Contract Analyst
- **Work Block:** `WB-2026-06-21-a5-codex-runtime-decision`
- **Objective:** reconcile the exact A5 Codex runtime files into one coherent,
  portable, safe project-local runtime contract.
- **Acceptance owner:** Codex Control Tower
- **Handoff target:** Claude Code Reviewer, then Claude Code Verifier
- **File-change permission:** write only the six subject paths listed below

You are the sole write-capable Coder for this Work Block. Other user and agent
changes already exist in the repository. Preserve them, do not revert work you
did not create, and do not modify unrelated dirty files.

Claude Code may use its own internal subagents for analysis inside this mission,
but only this Coder mission may write repository files and only inside the exact
write-set below. `mcp-codex` is Owner-authorized only as the GPT-subagent bridge
inside Claude Code for this WB. Do not launch any other nested external AI CLI
or MCP, such as a separate `codex`, another `claude`, Gemini, DeepSeek, Qwen, or
similar tools.

## Allowed External Runtimes / MCPs

- `mcp-codex`: allowed only for GPT subagents operating inside this Claude Code
  mission, under the same read/write-set, Hard Stop, and output constraints.
- Everything else: not authorized unless a later Owner message updates the Work
  Block gate and task file before execution.

## Required Read Set

Read only what is needed from:

1. `AGENTS.md`
2. `.agent/workflows/sdd-protocol.md`
3. `.agent/ROSTER.md`
4. `docs/plans/WB-2026-06-21-a5-codex-runtime-decision.md`
5. `.codex/write-gate.md`
6. the six approved subject files below
7. `/home/azur/Projects/WSL/agentic-sdlc-framework/framework/workflow/codex-model-routing.md`
   only as semantic reference if present

You may inspect `git status` and diffs limited to the approved write-set. Do not
bulk-read the dirty repository.

## Approved Write-Set

- `.codex/agents/verifier.toml`
- `.codex/agents/scoped-coder.toml`
- `.codex/config.toml.template`
- `.codex/critic.md`
- `.codex/hooks/stage0_write_gate.py`
- `.codex/instructions.md`

Do not write any report, log, plan, task, config, cache, transcript, generated
file, staged file, or private runtime file.

## Implementation Requirements

1. Keep Codex as Control Tower / mega-orchestrator and Claude Code as controlled
   execution runtime. Do not make Qwen, Gemini, RooCode, Cline, or other tools
   active project runtimes.
2. Make `critic.md`, `instructions.md`, agent TOML files, config template, and
   hook behavior agree on authority:
   - Critic/Reviewer/Verifier are read-only unless exact documentation report
     writes are separately approved.
   - One scoped Coder may write only an approved write-set.
   - Hard Stops remain with Owner approval.
   - This WB uses no Codex-native Reviewer or Verifier subagent; Review and
     Verification are later read-only Claude Code missions.
3. Keep real provider/model/API keys, private endpoints, credentials, and
   `.codex/config.toml` outside Git. `config.toml.template` may contain only
   sanitized examples and behavior comments.
4. Reconcile the Stage 0 hook with documented matcher names:
   `Bash`, `apply_patch`, `Edit`, and `Write`.
5. The hook must enforce only a declaration/process gate. It must not claim to
   prove semantic correctness, sandboxing, secret safety, or Critic quality.
6. The hook must preserve a practical bootstrap path for creating/updating
   `.codex/write-gate.md`, while denying ordinary write-like actions when the
   gate is missing, expired, or not `READY`.
7. Prefer the smallest coherent diff. Do not introduce new dependencies, package
   changes, app code changes, deploy changes, DB changes, or production config.

## Required Checks

Run as many as are safely possible inside the exact scope:

1. `git status --short --branch`
2. `git diff --check -- .codex/agents/verifier.toml .codex/agents/scoped-coder.toml .codex/config.toml.template .codex/critic.md .codex/hooks/stage0_write_gate.py .codex/instructions.md`
3. Python syntax/AST parse of `.codex/hooks/stage0_write_gate.py`
4. TOML parse of `.codex/agents/verifier.toml`, `.codex/agents/scoped-coder.toml`,
   and `.codex/config.toml.template`
5. Direct targeted scan of the six files for obvious secrets/private endpoints:
   `api_key`, `token`, `secret`, `password`, `Bearer`, `sk-`, `AKIA`,
   `.env`, `.codex/config.toml`, absolute workstation private paths, and
   provider URLs.
   Documented mentions that real private config belongs outside Git are allowed
   when they contain no value, endpoint, credential, or machine-specific path.
6. Isolated hook fixtures under `/tmp` for at least: missing gate, expired gate,
   valid `READY` gate, gate-only update, in-scope write-like command, and
   `Edit`/`Write` payload behavior if the hook supports those tools after your
   changes.
7. `git diff --cached --name-only`; expected empty.
8. Final `git diff --` limited to the six approved files.

If a check is unsafe or blocked by local tooling, report it as skipped with a
concrete reason. Do not broaden scope to make a check pass.

## Hard Stops

Stop and return an obstacle report if:

- any required change needs a path outside the approved write-set;
- the task requires inspecting or changing `.codex/config.toml`,
  `.claude/settings.json`, `.env*`, credentials, tokens, private endpoints,
  provider/model configuration, or private data;
- unrelated dirty content changes or blocks safe implementation;
- staging, commit, push, deploy, dependency, additional network, DB,
  destructive Git, production config, app code, or generated output action
  appears necessary;
- a required check fails and cannot be fixed inside the exact write-set.

Do not bypass hooks or permissions. Do not stage, commit, push, reset, clean,
checkout, stash, delete, or rewrite history.

## Output Contract

Return stdout only; do not create a report file. Use this exact structure:

```markdown
## Scoped Coder Report

**Status:** DONE | DONE_WITH_CONCERNS | NEEDS_CONTEXT | BLOCKED
**Write-set used:** [exact files actually changed]
**Scope check:** PASS | FAIL
**Ready for Reviewer:** YES | NO
**Pre-existing unrelated changes preserved:** YES | NO

### Implementation
- file: concise change and reason

### Checks
- command: PASS | FAIL | SKIPPED with reason

### Hook fixture coverage
- case: PASS | FAIL | SKIPPED with reason

### Secret/private-config boundary
- PASS | FAIL with evidence summary

### Risks or blockers
- none, or concrete issue

### Final changed paths
- exact repository-relative path list
```

Do not claim final project acceptance. Control Tower will inspect the diff and
route independent Claude Code Review and Verification.
