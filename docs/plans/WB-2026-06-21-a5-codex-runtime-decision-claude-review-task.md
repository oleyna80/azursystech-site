# Claude Code Review Task: A5 Codex Runtime Decision

## Mission Brief

- **Base Role:** Reviewer
- **Mission Role:** Codex Runtime Contract Reviewer
- **Work Block:** `WB-2026-06-21-a5-codex-runtime-decision`
- **Objective:** review the Claude Code Coder result against the approved A5
  plan, acceptance criteria, and exact six-file write-set.
- **File-change permission:** none; read-only repository inspection and stdout
  report only

You are not the Coder and must not modify repository files. Other user and agent
changes already exist in the repository; do not revert, stage, commit, push, or
clean anything.

Claude Code may use its own internal read-only subagents for this review, but no
review agent may write files. `mcp-codex` is Owner-authorized only as the
GPT-subagent bridge inside Claude Code for this WB. Do not launch any other
nested external AI CLI or MCP, such as a separate `codex`, another `claude`,
Gemini, DeepSeek, Qwen, or similar tools.

## Allowed External Runtimes / MCPs

- `mcp-codex`: allowed only for read-only GPT subagents operating inside this
  Claude Code review mission.
- Everything else: not authorized unless a later Owner message updates the Work
  Block gate and task file before execution.

## Required Read Set

- `AGENTS.md`
- `.codex/write-gate.md`
- `docs/plans/WB-2026-06-21-a5-codex-runtime-decision.md`
- `docs/plans/WB-2026-06-21-a5-codex-runtime-decision-claude-coder-task.md`
- the six A5 subject files
- Coder stdout report path:
  `/tmp/WB-2026-06-21-a5-codex-runtime-decision/claude-coder-safe.out`
- Initial Coder attempt evidence, if needed:
  `/tmp/WB-2026-06-21-a5-codex-runtime-decision/claude-coder.out`
  and `/tmp/WB-2026-06-21-a5-codex-runtime-decision/claude-coder.err`

Do not read `.codex/config.toml`, `.claude/settings.json`, `.env*`, secrets,
provider/model config, application code, deployment files, or unrelated dirty
files.

## Review Focus

1. AC1-AC9 from the A5 plan.
2. Scope: final changed subject paths must be a subset of the six approved A5
   files; no staging.
3. Authority consistency: Codex remains Control Tower, Critic is read-only,
   Claude Code is controlled execution runtime, and this WB does not authorize
   Codex-native Coder/Reviewer/Verifier execution beyond Critic.
4. Hook/docs contract: declaration gate only, not semantic/security proof.
5. Private config boundary: no real provider/model/API keys, endpoints, tokens,
   credentials, `.env` content, or private `.codex/config.toml` content.
6. Review the Coder check evidence and call out missing or weak checks.

## Output Contract

Return stdout only; do not create a report file.

```markdown
## Claude Code Review Report

**Verdict:** APPROVE | NEEDS_CHANGES | BLOCKED
**Scope check:** PASS | FAIL
**Ready for Verifier:** YES | NO

### Findings
| Severity | Finding | Evidence | Recommendation |
|---|---|---|---|

### Acceptance Criteria
- AC1: PASS | FAIL | UNKNOWN - note

### Checks reviewed
- check/evidence: sufficient | weak | missing - note

### Risks
- none, or concrete residual risk
```
