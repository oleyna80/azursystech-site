# Claude Code Verifier Task: A6 Workflow Docs Readiness

## Assignment

- **Workdir:** `/home/azur/Projects/WSL/azursystech`
- **Work Block:** `WB-2026-06-24-a6-workflow-docs-readiness`
- **Stage:** Verification
- **Role:** Verifier
- **Execution:** read-only
- **Owner approval:** A6 WB implementation scope approved

## Objective

Verify the A6 workflow documentation candidate after Coder fixes and read-only
Reviewer approval. Confirm that scope, staging, secrets, whitespace, bootstrap,
and runtime-policy acceptance criteria are satisfied before the Orchestrator
prepares a selective commit decision.

## Candidate Files

```text
docs/implementation-readiness.md
docs/profiles.md
docs/reference/codex-model-routing.md
docs/reference/estimation-benchmarks.md
docs/reference/security-baseline.md
docs/reference/subagent-anti-patterns.md
docs/reference/verification-matrix.md
docs/session-bootstrap.md
docs/templates/architecture-brief-template.md
docs/templates/project-agent-update-template.md
docs/templates/stage-artifact-template.md
docs/plans/WB-2026-06-24-a6-workflow-docs-readiness.md
docs/plans/WB-2026-06-24-a6-workflow-docs-readiness-claude-coder-task.md
docs/plans/WB-2026-06-24-a6-workflow-docs-readiness-claude-review-task.md
docs/plans/WB-2026-06-24-a6-workflow-docs-readiness-claude-verifier-task.md
```

## Evidence Inputs

```text
/tmp/WB-2026-06-24-a6-workflow-docs-readiness/claude-coder-escalated.out
/tmp/WB-2026-06-24-a6-workflow-docs-readiness/claude-coder-fix-escalated.out
/tmp/WB-2026-06-24-a6-workflow-docs-readiness/claude-review-escalated.out
```

## Read-Only Context Allowed

```text
AGENTS.md
docs/plans/WB-2026-06-21-a1-selective-commit-readiness.md
docs/plans/WB-2026-06-21-a5-codex-runtime-decision.md
docs/templates/work-block-template.md
```

You may inspect the current exact-path Git state and A5 commit metadata.

## Hard Scope Boundary

Read-only only. Do not edit, stage, commit, push, delete, move, rename, format,
or generate files.

Do not read private config or secrets:

```text
.env*
.claude/settings.json
.codex/config.toml
provider credentials
private endpoints
```

Do not inspect application, deploy, database, CI, Docker/proxy, generated output,
`PROJECT_MAP.md`, `FILE_REGISTRY.yml`, or `memory_bank/`.

## Required Verification Questions

1. Are all candidate files within A6 scope and no A10 navigation files included?
2. Is the Git index empty?
3. Are unrelated dirty files left unstaged and untouched?
4. Are trailing whitespace checks clean for all candidate files?
5. Is targeted secret/token/key scan clean for all candidate files?
6. Does `bash scripts/bootstrap.sh` pass?
7. Do docs preserve the runtime policy: Codex Orchestrator, Codex Critic
   read-only reviewer, Claude Code controlled execution runtime, provider config
   private?
8. Are Reviewer blocking findings resolved?
9. Is the candidate ready for Owner selective commit decision?

## Required Read-Only Checks

Run exact-path checks only:

```bash
git status --short --branch
git status --short -- docs/implementation-readiness.md docs/profiles.md docs/reference/codex-model-routing.md docs/reference/estimation-benchmarks.md docs/reference/security-baseline.md docs/reference/subagent-anti-patterns.md docs/reference/verification-matrix.md docs/session-bootstrap.md docs/templates/architecture-brief-template.md docs/templates/project-agent-update-template.md docs/templates/stage-artifact-template.md docs/plans/WB-2026-06-24-a6-workflow-docs-readiness.md docs/plans/WB-2026-06-24-a6-workflow-docs-readiness-claude-coder-task.md docs/plans/WB-2026-06-24-a6-workflow-docs-readiness-claude-review-task.md docs/plans/WB-2026-06-24-a6-workflow-docs-readiness-claude-verifier-task.md
git diff --cached --name-only
git diff --check -- docs/implementation-readiness.md docs/profiles.md docs/reference/codex-model-routing.md docs/reference/estimation-benchmarks.md docs/reference/security-baseline.md docs/reference/subagent-anti-patterns.md docs/reference/verification-matrix.md docs/session-bootstrap.md docs/templates/architecture-brief-template.md docs/templates/project-agent-update-template.md docs/templates/stage-artifact-template.md docs/plans/WB-2026-06-24-a6-workflow-docs-readiness.md docs/plans/WB-2026-06-24-a6-workflow-docs-readiness-claude-coder-task.md docs/plans/WB-2026-06-24-a6-workflow-docs-readiness-claude-review-task.md docs/plans/WB-2026-06-24-a6-workflow-docs-readiness-claude-verifier-task.md
rg -n "[ \t]+$" docs/implementation-readiness.md docs/profiles.md docs/reference/codex-model-routing.md docs/reference/estimation-benchmarks.md docs/reference/security-baseline.md docs/reference/subagent-anti-patterns.md docs/reference/verification-matrix.md docs/session-bootstrap.md docs/templates/architecture-brief-template.md docs/templates/project-agent-update-template.md docs/templates/stage-artifact-template.md docs/plans/WB-2026-06-24-a6-workflow-docs-readiness.md docs/plans/WB-2026-06-24-a6-workflow-docs-readiness-claude-coder-task.md docs/plans/WB-2026-06-24-a6-workflow-docs-readiness-claude-review-task.md docs/plans/WB-2026-06-24-a6-workflow-docs-readiness-claude-verifier-task.md
rg -n "(sk-[A-Za-z0-9]{20,}|ghp_[A-Za-z0-9]{20,}|AKIA[0-9A-Z]{16}|-----BEGIN [A-Z ]*PRIVATE KEY|Bearer [A-Za-z0-9._-]{20,}|xox[baprs]-[A-Za-z0-9-]{20,})" docs/implementation-readiness.md docs/profiles.md docs/reference/codex-model-routing.md docs/reference/estimation-benchmarks.md docs/reference/security-baseline.md docs/reference/subagent-anti-patterns.md docs/reference/verification-matrix.md docs/session-bootstrap.md docs/templates/architecture-brief-template.md docs/templates/project-agent-update-template.md docs/templates/stage-artifact-template.md docs/plans/WB-2026-06-24-a6-workflow-docs-readiness.md docs/plans/WB-2026-06-24-a6-workflow-docs-readiness-claude-coder-task.md docs/plans/WB-2026-06-24-a6-workflow-docs-readiness-claude-review-task.md docs/plans/WB-2026-06-24-a6-workflow-docs-readiness-claude-verifier-task.md
bash scripts/bootstrap.sh
```

For `rg`, exit code `1` with no output is clean for scans. For untracked files,
the explicit trailing whitespace scan is required because `git diff --check`
does not reliably cover untracked candidates.

## Required Output

Return one verdict:

- `VERIFIED`: candidate is ready for Owner selective commit decision.
- `BLOCKED`: list exact blocking issue and stop condition.

Report:

- Checks run and exact result.
- Checks skipped and reason.
- Candidate files verified.
- Staged files, if any.
- Out-of-scope files detected, if any.
- Residual risks and non-blocking notes.
- Confirmation that no files were modified.
