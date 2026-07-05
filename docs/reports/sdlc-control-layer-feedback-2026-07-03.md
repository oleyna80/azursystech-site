# SDLC Control Layer Feedback - 2026-07-03

## Scope
Review current uncommitted SDLC/control-layer updates in `azursystech` before
selective commit.

Reviewed areas:
- `AGENTS.md`
- `PROJECT_MAP.md`
- `FILE_REGISTRY.yml`
- `docs/session-bootstrap.md`
- `docs/engineering-memory/**`
- `.agent/**`
- `.codex/**`
- `.agentsignore`
- `.codexignore`
- `.gitignore`
- `docs/templates/**`
- `scripts/bootstrap.sh`

Out of scope:
- Application source code
- Dependencies
- Production config
- Secrets
- Commit or push

## Review Inputs
- Orchestrator direct inspection
- Read-only Critic Reviewer subagent
- Read-only Docs/Workflow Analyst subagent

## Verdict
`SUPPLEMENT`

The SDLC direction is coherent and useful, but the current control layer should
not be committed as-is. The key issues are consistency and portability, not the
overall architecture.

## Findings

### F-001 - Publish/local-only boundary conflict
**Severity:** High

`AGENTS.md` still says `.agent/`, `.codexignore`, `.agentsignore`, and
`memory_bank/` are local-first and should not be published unless explicitly
approved. At the same time, `.gitignore` now explicitly unignores `.agent/**`,
`.codex/**`, docs, `PROJECT_MAP.md`, and `FILE_REGISTRY.yml` as committed SDLC
files.

This creates conflicting instructions for a future agent deciding what can be
staged and committed.

**Recommended correction:** Record an explicit Owner-approved boundary:
- committed SDLC navigation/policy files;
- committed runtime templates/wrappers;
- local-only runtime state, credentials, caches, generated reports, and logs.

### F-002 - Gate files overstate mechanical hook enforcement
**Severity:** High

`.agent/critic-gate.md` refers to `critic-gate.sh`, and
`.agent/verification-gate.md` refers to `verification-gate.sh`, but those hook
scripts are not present in the reviewed layer. This can create false confidence
that Stage 0 and Stage 2 gates are mechanically enforced.

**Recommended correction:** Either add real hook scripts to the approved
runtime layer, or downgrade wording so these files are evidence contracts rather
than claimed blocking hooks.

### F-003 - Quick-fix threshold mismatch
**Severity:** Medium

`AGENTS.md` describes quick-fix as `<=3 files`, while
`.agent/workflows/sdd-protocol.md` allows the quick-fix path only for at most
2 planned implementation/write-set files.

**Recommended correction:** Pick one threshold and apply it consistently in
`AGENTS.md`, `sdd-protocol.md`, and the Work Block template.

### F-004 - New normative files missing from write-authority table
**Severity:** Medium

`PROJECT_MAP.md`, `FILE_REGISTRY.yml`, `docs/session-bootstrap.md`, and
`docs/engineering-memory/**` are now normative, but the write-authority table
in `AGENTS.md` does not explicitly list them.

**Recommended correction:** Add these paths to the local docs/workflow write
authority row or create a dedicated navigation/control row.

### F-005 - Bootstrap has side effects but is framed as preflight
**Severity:** Medium

`scripts/bootstrap.sh` creates local `memory_bank/*` files and
`memory_bank/snapshots`, while several docs describe it as a preflight check.

**Recommended correction:** Either split it into `--check` and `--init`, or
document clearly that `scripts/bootstrap.sh` is an onboarding/init preflight
that may create ignored local runtime memory.

### F-006 - Fresh-clone portability issues
**Severity:** Medium

`FILE_REGISTRY.yml` contains a hardcoded workstation path in `project.root`.
Runtime references such as `.roomodes` and `.qwen/settings.json` are mentioned
but not present.

**Recommended correction:** Make `FILE_REGISTRY.yml` repository-root relative
and mark optional runtime files as optional/local templates, or add templates.

### F-007 - Stage terminology needs an explicit mapping
**Severity:** Medium

The project workflow mentions `Plan -> Spec -> Implementation -> Review ->
Verification`, while the SDD protocol uses `Stage 0 Plan & Discover`, `Stage 1
Implement`, `Stage 2 Verify`, and `Stage 3 Sync & Report`.

**Recommended correction:** Add a short mapping table so future agents do not
treat these as competing workflows.

### F-008 - `.agent/README.md` contains stale local-only structure text
**Severity:** Low

`.agent/README.md` lists `.agent/.gitignore` and says it keeps `.agent/`
local-only. That file does not exist, and the intended direction appears to be
a committed `.agent/` workflow layer.

**Recommended correction:** Update the directory tree and committed/local
wording after F-001 is resolved.

### F-009 - Verification gate wording can be misread
**Severity:** Low

`.agent/verification-gate.md` correctly says gate `READY` means evidence is
resolved, not necessarily that verification passed. This distinction is easy
to miss.

**Recommended correction:** Keep both `Verification Gate` and `Verification
Verdict` in closeouts and require final summaries to state both.

### F-010 - Broad docs unignore may be too permissive
**Severity:** Low

`.gitignore` uses `!docs/**`, which can expose more documentation artifacts
than intended.

**Recommended correction:** If only SDLC docs should be public, narrow the
unignore rules to the approved control/documentation paths.

## Recommended Correction Scope
Before commit, open a follow-up correction Work Block with write-set:

```
AGENTS.md
PROJECT_MAP.md
FILE_REGISTRY.yml
.gitignore
.agent/README.md
.agent/ROSTER.md
.agent/workflows/sdd-protocol.md
.agent/critic-gate.md
.agent/verification-gate.md
docs/session-bootstrap.md
docs/templates/work-block-template.md
scripts/bootstrap.sh
docs/plans/[correction-wb].md
docs/reports/[verification-report].md
```

Do not include application source code, dependencies, production config,
secrets, deploy files, or private provider settings.

## Required Checks for Correction WB
- `bash -n scripts/bootstrap.sh`
- `bash scripts/bootstrap.sh`
- `git diff --check`
- `git check-ignore -v` for intended committed and local-only paths
- `rg -n` for stale hook/script names, absolute machine paths, placeholder
  authority text, and secret-like tokens
- YAML parse for `FILE_REGISTRY.yml`

## Commit Readiness
Not ready for selective commit yet.

Recommended next state: `READY_FOR_CORRECTION_SCOPE`.
