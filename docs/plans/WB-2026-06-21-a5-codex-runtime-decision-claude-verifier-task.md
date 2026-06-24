# Claude Code Verifier Task: A5 Codex Runtime Decision

## Mission Brief

- **Base Role:** Verifier
- **Mission Role:** Codex Runtime Contract Verifier
- **Work Block:** `WB-2026-06-21-a5-codex-runtime-decision`
- **Objective:** issue formal `SPEC_OK`/`SPEC_GAPS`, then run the A5 T3
  runtime-specific verification matrix and issue `APPROVED`, `NEEDS_CHANGES`,
  or `BLOCKED`.
- **File-change permission:** none; read-only repository inspection and stdout
  report only

You are not the Coder and must not modify repository files. Do not stage, commit,
push, deploy, run destructive Git, touch DB, or read private config/secrets.

Claude Code may use its own internal read-only subagents for verification, but
no verification agent may write files. `mcp-codex` is Owner-authorized only as
the GPT-subagent bridge inside Claude Code for this WB. Do not launch any other
nested external AI CLI or MCP, such as a separate `codex`, another `claude`,
Gemini, DeepSeek, Qwen, or similar tools.

## Allowed External Runtimes / MCPs

- `mcp-codex`: allowed only for read-only GPT subagents operating inside this
  Claude Code verification mission.
- Everything else: not authorized unless a later Owner message updates the Work
  Block gate and task file before execution.

## Required Read Set

- `AGENTS.md`
- `.codex/write-gate.md`
- `docs/plans/WB-2026-06-21-a5-codex-runtime-decision.md`
- `docs/plans/WB-2026-06-21-a5-codex-runtime-decision-claude-coder-task.md`
- `docs/plans/WB-2026-06-21-a5-codex-runtime-decision-claude-review-task.md`
- the six A5 subject files
- Coder stdout report path:
  `/tmp/WB-2026-06-21-a5-codex-runtime-decision/claude-coder-safe.out`
- Initial Coder attempt evidence, if needed:
  `/tmp/WB-2026-06-21-a5-codex-runtime-decision/claude-coder.out`
  and `/tmp/WB-2026-06-21-a5-codex-runtime-decision/claude-coder.err`
- Reviewer stdout report path:
  `/tmp/WB-2026-06-21-a5-codex-runtime-decision/claude-review.out`
- Reviewer stderr path:
  `/tmp/WB-2026-06-21-a5-codex-runtime-decision/claude-review.err`

Do not read `.codex/config.toml`, `.claude/settings.json`, `.env*`, secrets,
provider/model config, application code, deployment files, or unrelated dirty
files.

## Verification Flow

1. Stage 2a: check AC1-AC9 and write-set scope. Return `SPEC_GAPS` immediately
   if any acceptance criterion or scope condition fails.
2. Stage 2b: after `SPEC_OK`, run the A5 runtime-specific T3 checks from the
   plan as far as safely possible:
   - final status/diff scope and empty staged diff;
   - whitespace checks for the six subject files;
   - direct secret/private-config scan of the six files, classifying documented
     private-boundary mentions separately from real values;
   - Python parse for `.codex/hooks/stage0_write_gate.py`;
   - TOML parse for `.codex/agents/verifier.toml`,
     `.codex/agents/scoped-coder.toml`, and `.codex/config.toml.template`;
   - isolated hook fixture matrix for `Bash`, `apply_patch`, `Edit`, and
     `Write` behavior;
   - `bash scripts/bootstrap.sh`;
   - `scripts/verify.sh lite` only if it is present and does not require
     out-of-scope app/deploy mutation.

Do not broaden scope to run a check. Mark blocked/skipped checks explicitly.

## Output Contract

Return stdout only; do not create a report file.

```markdown
## Claude Code Verification Report

**Stage 2a:** SPEC_OK | SPEC_GAPS
**Stage 2b:** APPROVED | NEEDS_CHANGES | BLOCKED
**Scope check:** PASS | FAIL
**Staging empty:** YES | NO

### Acceptance Criteria
- AC1: PASS | FAIL | UNKNOWN - evidence

### Commands and results
- command: PASS | FAIL | SKIPPED - concise evidence

### Hook fixture matrix
- case: PASS | FAIL | SKIPPED - concise evidence

### Secret/private-config boundary
- PASS | FAIL - evidence summary

### Blockers
- none, or concrete blocker

### Residual risks
- none, or concrete residual risk
```
