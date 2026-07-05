---
name: handoff-live-smoke
description: "Run or review a live Codex-to-Claude Code handoff smoke test. Use when validating handoff-runner against a clean scaffold, diagnosing queue/active/done lifecycle, or documenting live Claude Code delegation evidence without leaking env/secrets."
---

# Handoff Live Smoke

## Purpose

Validate the real Codex-to-Claude Code handoff path on a freshly bootstrapped
project without confusing sandbox failures, ignored workflow files, or
publication evidence.

This skill is for live runner validation, not fake CLI unit tests.

## When To Use

Use this skill for:

- Live `handoff/runner/handoff-runner.sh` validation.
- Clean scaffold smoke tests under `/tmp`.
- Debugging `queue/ -> active/ -> done/failed/` lifecycle issues.
- Verifying that Claude Code writes both requested outputs and its audit trail.
- Writing publication-safe Work Block evidence for handoff runs.

Skip this skill for:

- Pure shell syntax checks.
- Fake `claude` binary tests.
- Normal delegated implementation tasks after the handoff layer is already
  trusted.

## Required Preconditions

1. `claude` is installed and authenticated for the current user.
2. Provider env is available to the runner through an ignored local env contract
   such as `handoff/runtime/handoff.env`.
3. The live runner command is executed as an unrestricted user process when real
   model access is required.
4. The smoke target is a fresh `/tmp` project created by `./bootstrap.sh`.
5. The task file has explicit `project_root`, `allowed_scope`, and
   `forbidden_scope`.

## Sandbox Rule

Do not treat a live Claude Code API failure inside the restricted Codex sandbox
as a runner failure.

Observed failure mode:

```text
API Error: Unable to connect to API (ConnectionRefused)
```

If that happens, record it as a sandbox boundary and rerun the live smoke outside
the restricted sandbox. Unit tests can stay inside the sandbox by using fake
`claude` binaries.

## Minimal Allowed Scope

For Claude Code acting as an independent team, include both the requested output
files and the expected CC process audit files.

Typical smoke allowlist:

```yaml
allowed_scope:
  - memory_bank/handoff-smoke.txt
  - memory_bank/external-team-log.md
  - memory_bank/orchestrator-log.md
  - .agent/critic-gate.md
  - .agent/verification-gate.md
forbidden_scope:
  - .env
  - .env.*
  - secrets/**
  - "*.pem"
  - "*.key"
```

Do not narrow the allowlist to only the requested output file if the task expects
Claude Code to operate with its own gates, logs, or team process. A too-narrow
allowlist should fail with `scope_failed`; that is correct runner behavior.

## Verification Checklist

Collect evidence from the runner and filesystem snapshot, not only from git.
Generated projects ignore `.agent/` and `memory_bank/` by default, so `git
status` alone can miss workflow artifacts.

Verify:

- runner final output reports `status=complete` and `exit_code=0`
- `status.json` reports `complete`
- task and result are in `handoff/done/`
- task is absent from `handoff/queue/` and `handoff/active/`
- result file exists and is non-empty
- session log exists and is non-empty
- smoke output content is exact
- `memory_bank/external-team-log.md` contains the task id and status
- `scope-audit` reports `status=passed`
- `changed_paths` are expected and `violations=[]`
- forbidden artifact name check finds no `.env`, `.env.*`, `secrets/**`,
  `*.pem`, or `*.key` files in the smoke project

## Secret Handling

- Never read or print `handoff/runtime/handoff.env`.
- Never print credential values from the shell environment.
- It is acceptable to log that an ignored env file was loaded.
- In reports, do not claim that no secret contents were inspected unless that
  was actually proven. Prefer: "env contents were not read or printed during
  this Work Block" and "forbidden artifact path check found no matches."

## Report Wording

Use evidence-based language:

- "demonstrated by one live smoke run"
- "observed failure mode"
- "scope audit passed"
- "forbidden artifact name check found no matches"

Avoid overclaims:

- "proved the architecture"
- "guaranteed no secrets were accessed"
- "fully validated all handoff modes"

## Handoff

- **Success condition:** one unrestricted live smoke completes with scope audit
  passed and publication-safe evidence captured.
- **Next:** update the Work Block report and changelog; commit only after Owner
  approval.
- **Auto-proceed:** YES within the approved smoke-test Work Block.
- **Hard stop:** YES if the run requires reading credentials, changing provider
  config, or widening scope beyond expected smoke and audit files.
