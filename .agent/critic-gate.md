# Critic Gate — Compatibility View

> Human-readable view only. The executable source of truth is
> `.agent/active-work-block.json`.

## Default State

- **Work Block:** unset
- **Critic required:** true
- **Critic status:** PENDING
- **Critic verdict:** PENDING
- **Critic report:** unset
- **Critic isolation:** unknown
- **Approved write-set:** empty
- **Write gate:** BLOCKED

## Machine Fields

The active Work Block records:

```json
"critic": {
  "required": true,
  "status": "PENDING",
  "verdict": "PENDING",
  "report": "",
  "isolation": "unknown",
  "skip_reason": ""
}
```

Valid Critic verdicts:

- `APPROVE`;
- `SUPPLEMENT`;
- `RECONSIDER`.

Valid operational statuses include `PENDING`, `READY`, `DEGRADED`, `FALLBACK`,
and `SKIPPED`. A required Critic must resolve to an evidence-backed state before
source writes. `RECONSIDER` blocks the write gate until Define is rerun.

## Runtime and Integration Independence

The Critic may run as:

- a Claude Code subagent;
- a Codex custom agent;
- an OpenCode subagent;
- a separate session or runtime;
- an admitted plugin, MCP, or file-handoff integration;
- a human reviewer.

Record the actual runtime, integration, and isolation in the Work Block. Provider
or model names do not create a new gate or authority class.

## Write Authority

Claude Code and Codex hooks read the machine gate, specification, expiry,
`base_commit`, Critic state, and `write_set`.

Do not edit this Markdown file to authorize a write. Update the active Work Block
only after the required review and approvals exist.
