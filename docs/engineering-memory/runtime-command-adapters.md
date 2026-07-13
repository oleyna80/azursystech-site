# Runtime Command Adapters

Accepted 2026-07-08.

## Purpose

The project keeps canonical process skills in `.agent/skills/**`, while each
agent runtime may need a different discovery mechanism. Runtime command
adapters make common Owner commands available without duplicating the process
contract.

## Sprint analysis adapter

Canonical source:

- `.agent/skills/sprint-analysis/SKILL.md`

Runtime adapters:

- OpenCode: `.opencode/commands/sprint.md` exposes `/sprint` (Owner
  smoke-tested on 2026-07-08).
- Claude Code: `.claude/commands/sprint.md` exposes `/sprint` (Owner
  smoke-tested on 2026-07-08).
- Codex: `.agents/skills/sprint-analysis/SKILL.md` exposes the project skill
  for Codex skill discovery (Codex CLI smoke-tested on 2026-07-08).

All adapters must instruct the runtime to read and follow the canonical
`.agent` skill. Adapters may add runtime-specific invocation details, but must
not redefine metrics, authority, write permissions, or closeout policy.

## Safety rules

- Sprint analysis is read-only by default.
- Writing a report under `docs/reports/` requires explicit Owner request.
- Runtime stop hooks may require session-local gate classification. In that
  case, Control Tower may write SKIPPED/lite values only to
  `.agent/verification-gate.md` and `memory_bank/orchestrator-log.md`; the gate
  file must be reset to its PENDING template before any commit.
- Adapters must not edit source code, hooks, templates, skills, provider
  settings, env files, secrets, commit, push, or deploy.
- Improvement candidates from a sprint analysis are proposals for a later Work
  Block, not automatic permission to self-edit the process layer.
- Provider/model/API settings remain outside committed project adapters.

## Agent runtime resilience

Accepted 2026-07-13. The repository distinguishes process controls from host
capacity and credential boundaries.

- Before a runtime/configuration/infrastructure Work Block, Control Tower runs
  `scripts/agent-runtime-doctor.sh`. `WARN` or `BLOCKED` is recorded as
  `incident: agent-runtime` in the closeout evidence for future sprint analysis.
- The canonical independent readonly verifier is Control-Tower-only:
  `scripts/run-independent-verifier.sh PROMPT_FILE` after the implementation
  diff is frozen. Native subagents must not launch a nested Codex CLI.
- The runner requires an Owner-provisioned `CODEX_VERIFIER_HOME` at mode `0700`
  and a readonly profile. It never reads, copies, prints, creates, or modifies
  credentials. `--ephemeral` is not a promise that no runtime state is written.
- `independent-readonly-root` is a source filesystem-write boundary only. It is
  not credential or network isolation; credentials, live DB, deploy, live
  infrastructure, and external-provider work still require `os-isolated`.
- `scripts/agent-runtime-sysctl.conf` is the reviewed source for the approved
  inotify capacity baseline. Installing it under `/etc/sysctl.d/` and applying
  it are explicit Owner-authorized host actions, then values must be reread.
- `scripts/tests/agent-runtime-fixtures.sh` is a disposable mutable test lane.
  It proves runner/doctor behavior but is never formal readonly verification.
- Formal final-message capture uses the Owner-installed
  `run-codex\x2dverifier\x2doutput.mount`: a 4 MiB,
  `0700,nosuid,nodev,noexec` tmpfs at `/run/codex-verifier-output`. This
  bounds only the capture filesystem; do not use process-wide `RLIMIT_FSIZE`,
  because it can also block Codex internal ephemeral writes. Before each
  formal run, the runner rechecks target, type, capacity, ownership, mode, and
  output-path safety.

## Maintenance

When a canonical `.agent/skills/**` contract changes, update adapters only if
the invocation path or runtime discovery text becomes stale. Do not fork the
canonical skill body into runtime-specific copies.
