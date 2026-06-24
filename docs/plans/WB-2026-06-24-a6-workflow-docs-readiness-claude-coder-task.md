# Claude Code Coder Task: A6 Workflow Docs Readiness

## Assignment

- **Workdir:** `/home/azur/Projects/WSL/azursystech`
- **Work Block:** `WB-2026-06-24-a6-workflow-docs-readiness`
- **Stage:** Implementation
- **Role:** Coder
- **Execution:** write-capable, exact-path only
- **Owner approval:** A6 WB implementation scope approved

## Objective

Review and correct the remaining A6 workflow documentation so it is internally
consistent with the already-published A1/A5 runtime layer:

- Codex is the Orchestrator / control tower.
- Codex Critic is the strong decision reviewer.
- Claude Code teams are controlled execution runtime for coder/review/verifier
  work.
- Real provider/model/API configuration lives only at user/project private
  level and is not committed to the base framework or public project docs.
- `mcp-codex` is allowed only as the Owner-authorized GPT-subagent bridge inside
  Claude Code for this Work Block.
- A10 navigation refresh remains deferred; do not edit navigation artifacts in
  A6.

## Approved Write-Set

You may edit only these files:

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
```

Do not edit this task file, the A6 plan, or any other path. If you believe an
out-of-scope edit is required, stop and report it.

## Read-Only Context Allowed

You may read exact relevant context paths only:

```text
AGENTS.md
docs/plans/WB-2026-06-21-a1-selective-commit-readiness.md
docs/plans/WB-2026-06-21-a5-codex-runtime-decision.md
docs/plans/WB-2026-06-24-a6-workflow-docs-readiness.md
docs/templates/work-block-template.md
```

You may also inspect the published A5 commit metadata with exact Git commands
such as:

```bash
git show --stat --oneline --name-only 5172ca9
```

## Out of Scope / Hard Stops

Do not read, edit, stage, or otherwise touch:

```text
.env*
.claude/settings.json
.codex/config.toml
provider credentials
private endpoints
PROJECT_MAP.md
FILE_REGISTRY.yml
memory_bank/
application source
showcase/
web/
deploy files
CI files
Docker/proxy files
database files
dependency manifests
generated output
```

No commit, push, merge, rebase, branch switch, stash, reset, clean, deletion,
dependency install, deploy, database action, or production/runtime config
change is authorized.

## External Runtime Boundary

`mcp-codex` is authorized only as the Owner-approved GPT-subagent bridge inside
Claude Code for this Work Block. No other external AI CLI, MCP, or provider
runtime is authorized.

There is no token or budget cap for this Claude Code mission. Use enough
reasoning to produce a correct result, while staying strictly within scope.

## Required Work

1. Read the A6 plan and approved read-only context.
2. Inspect each approved A6 write-set file.
3. Make only documentation corrections needed for consistency, scope clarity,
   closeout readiness, and non-conflict with A1/A5.
4. Ensure the docs do not imply committed/private provider keys, real API
   values, mandatory external runtimes, or A6 navigation edits.
5. Ensure templates preserve role separation, subagent expectations, final
   result/closeout fields, and SDD-style verification evidence.
6. Leave all unrelated dirty files untouched.

## Review Fix Pass

If this task is rerun after Claude Code Reviewer, address only these
`REQUEST_CHANGES` items unless local inspection proves a narrower equivalent is
better:

1. In `docs/reference/codex-model-routing.md`, remove the ambiguous phrase
   "their own orchestrator" for Claude Code teams. Use wording aligned with
   `docs/profiles.md`, such as "internal subagent management", while preserving
   Codex as the project-level Orchestrator / Control Tower.
2. In `docs/templates/architecture-brief-template.md`, add the minimum
   SDD-aligned evidence fields requested by review:
   - review evidence or review disposition;
   - verification evidence;
   - side-effect class;
   - DB action mode;
   - structured expected/final result or closeout-oriented result field.

Do not add unrelated template churn. Do not edit files outside the approved
write-set.

## Suggested Local Checks

Run bounded checks only against exact A6 paths. If a command is unavailable or
blocked, report it instead of broadening scope.

```bash
git status --short -- docs/implementation-readiness.md docs/profiles.md docs/reference/codex-model-routing.md docs/reference/estimation-benchmarks.md docs/reference/security-baseline.md docs/reference/subagent-anti-patterns.md docs/reference/verification-matrix.md docs/session-bootstrap.md docs/templates/architecture-brief-template.md docs/templates/project-agent-update-template.md docs/templates/stage-artifact-template.md
git diff --check -- docs/implementation-readiness.md docs/profiles.md docs/reference/codex-model-routing.md docs/reference/estimation-benchmarks.md docs/reference/security-baseline.md docs/reference/subagent-anti-patterns.md docs/reference/verification-matrix.md docs/session-bootstrap.md docs/templates/architecture-brief-template.md docs/templates/project-agent-update-template.md docs/templates/stage-artifact-template.md
rg -n "[ \t]+$" docs/implementation-readiness.md docs/profiles.md docs/reference/codex-model-routing.md docs/reference/estimation-benchmarks.md docs/reference/security-baseline.md docs/reference/subagent-anti-patterns.md docs/reference/verification-matrix.md docs/session-bootstrap.md docs/templates/architecture-brief-template.md docs/templates/project-agent-update-template.md docs/templates/stage-artifact-template.md
rg -n "(sk-[A-Za-z0-9]{20,}|ghp_[A-Za-z0-9]{20,}|AKIA[0-9A-Z]{16}|-----BEGIN [A-Z ]*PRIVATE KEY|Bearer [A-Za-z0-9._-]{20,}|xox[baprs]-[A-Za-z0-9-]{20,})" docs/implementation-readiness.md docs/profiles.md docs/reference/codex-model-routing.md docs/reference/estimation-benchmarks.md docs/reference/security-baseline.md docs/reference/subagent-anti-patterns.md docs/reference/verification-matrix.md docs/session-bootstrap.md docs/templates/architecture-brief-template.md docs/templates/project-agent-update-template.md docs/templates/stage-artifact-template.md
test -f scripts/bootstrap.sh && bash scripts/bootstrap.sh
```

Notes:

- `git diff --check` may not fully cover untracked files. The explicit trailing
  whitespace `rg` check above is required for untracked A6 files.
- `rg` exit code `1` means no matches; treat that as success for scans.
- Do not stage files.

## Required Output

Report:

- Summary of corrections made.
- Exact files changed.
- Exact files inspected but left unchanged.
- Checks run and result.
- Checks skipped and reason.
- Any risks or open questions.
- Whether the A6 docs are ready for read-only review.
- Confirmation that no files outside the approved write-set were edited.
