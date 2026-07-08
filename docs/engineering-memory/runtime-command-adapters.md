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

## Maintenance

When a canonical `.agent/skills/**` contract changes, update adapters only if
the invocation path or runtime discovery text becomes stale. Do not fork the
canonical skill body into runtime-specific copies.
