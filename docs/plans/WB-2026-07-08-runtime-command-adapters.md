# WB-2026-07-08 - Runtime Command Adapters

## Status

Complete

## Lifecycle stage

Verification

## Objective

Add lightweight runtime adapters so the Owner can manually trigger sprint
analysis from OpenCode, Claude Code, and Codex-compatible skill discovery while
keeping `.agent/skills/sprint-analysis/SKILL.md` as the canonical process
contract.

## Role

Orchestrator / Control Tower

## Expected result

- OpenCode has a `/sprint` command adapter.
- Claude Code has a `/sprint` command adapter.
- Codex has a project skill discovery adapter for sprint analysis.
- Navigation docs identify the new adapter layer.
- No source code, provider config, env files, secrets, deploy files, or
  generated runtime state are changed.

## Approved scope

- `.opencode/commands/sprint.md`
- `.claude/commands/sprint.md`
- `.agents/README.md`
- `.agents/skills/sprint-analysis/SKILL.md`
- `.agent/ROSTER.md`
- `PROJECT_MAP.md`
- `FILE_REGISTRY.yml`
- `docs/engineering-memory/runtime-command-adapters.md`
- `docs/plans/WB-2026-07-08-runtime-command-adapters.md`

## Scope amendment

- `docs/engineering-memory/opencode-runtime-layer.md` was added during
  closeout because `.opencode/commands/` is part of the committed OpenCode
  runtime layer. The change is documentation/control-layer only and does not
  alter application source, provider config, secrets, deploy, or runtime state.

## Out of scope

- Application source code.
- Provider/model/API settings.
- `.env*`, credentials, secrets, private local config.
- Rewriting canonical `.agent/skills/sprint-analysis/SKILL.md`.
- Editing `.opencode/skills/**` mirrors.
- Committing session-local `.agent/verification-gate.md` values.
- Commit or push without separate Owner approval.

## Plan

1. Confirm dirty tree and ignore boundaries.
2. Add runtime adapters that defer to canonical `.agent` sprint-analysis skill.
3. Update project navigation and registry.
4. Run formatting, secret-boundary, and skill validation checks.
5. Close with review/verification result and residual risks.

## Implementation notes

- `.opencode/skills/**` is intentionally ignored/deferred, so this Work Block
  does not add a native OpenCode skill mirror.
- Claude Code project commands are kept as thin adapters because existing
  `.claude/commands/**` files remain supported while Claude Code skills are the
  preferred newer mechanism.
- Codex uses a `.agents/skills/**` adapter because Codex project skill
  discovery expects that plural directory shape.

## Closeout

- Stage: Verification
- Objective: runtime command adapters for sprint analysis - complete
- Role: Orchestrator / Control Tower
- Files changed:
  - `.opencode/commands/sprint.md`
  - `.claude/commands/sprint.md`
  - `.agents/README.md`
  - `.agents/skills/sprint-analysis/SKILL.md`
  - `.agent/ROSTER.md`
  - `PROJECT_MAP.md`
  - `FILE_REGISTRY.yml`
  - `docs/engineering-memory/runtime-command-adapters.md`
  - `docs/engineering-memory/opencode-runtime-layer.md`
  - `docs/plans/WB-2026-07-08-runtime-command-adapters.md`
- Checks performed:
  - `git status --short --branch` - branch `main...origin/main [ahead 2]`; dirty tree limited to this Work Block write-set at closeout
  - `git check-ignore -v -n ...` - command adapters and `.agents/**` not ignored; docs paths explicitly unignored
  - `git diff --check` - pass
  - `python3 /home/azur/.codex/skills/.system/skill-creator/scripts/quick_validate.py .agents/skills/sprint-analysis` - pass
  - secret-pattern scan over changed write-set - no matches
  - `bash scripts/bootstrap.sh` - pass
  - Owner live-test: OpenCode `/sprint` ran sprint analysis for `2026-07-01..2026-07-08`, loaded canonical `sprint-analysis`, ran `git status --short --branch`, ran `.agent/skills/sprint-analysis/scripts/extract.sh`, and produced a chat report
  - Owner live-test: Claude Code `/sprint` ran sprint analysis for `2026-07-01..2026-07-08`, loaded canonical `sprint-analysis`, ran `git status --short --branch`, ran `.agent/skills/sprint-analysis/scripts/extract.sh`, produced a chat report, then satisfied the stop hook by writing session-local `SKIPPED/lite` values to `.agent/verification-gate.md` and `memory_bank/orchestrator-log.md`
  - Owner live-test: Codex CLI ran sprint analysis for `2026-07-01..2026-07-08`, loaded `sprint-analysis`, ran `scripts/bootstrap.sh --check`, `git status --short --branch`, `.agent/skills/sprint-analysis/scripts/extract.sh`, git history/diff checks, and produced a read-only chat report
  - Control Tower reset `.agent/verification-gate.md` to the PENDING template after recording the live-test evidence
- Review result: adapters are thin wrappers over `.agent/skills/sprint-analysis/SKILL.md`; no duplicated metrics or alternate authority model introduced.
- Verification result: pass for docs/control-layer consistency; OpenCode, Claude Code, and Codex CLI sprint-analysis paths smoke-tested by Owner.
- Residual risks:
  - Codex CLI smoke test confirms the skill workflow can run from Codex context; exact Codex project skill discovery UX may still differ from CLI invocation.
  - `.opencode/skills/**` remains ignored/deferred by design; `/sprint` uses a command adapter rather than a native OpenCode skill mirror.
  - Claude Code command adapters are supported, while Claude Code skills are the newer preferred mechanism; this WB intentionally uses a command adapter to preserve `/sprint` and avoid forking the canonical skill body.
  - Runtime stop hooks may create session-local gate/log writes during otherwise read-only commands; `.agent/verification-gate.md` must be reset before commit.
- Next owner/action: commit requires separate Owner approval.
