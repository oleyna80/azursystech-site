---
artifact_type: process_feedback_observation
work_block_id: WB-2026-09-11-control-plane-recovery-hardening-027
status: TRIAGED
category: CONTRACT_MISMATCH
observation_id: PF-2026-09-12-codex-hook-json-contract-mismatch
---

# Process Feedback Observation — Codex Hook JSON Contract

## Classification

- **Work Block:** `WB-2026-09-11-control-plane-recovery-hardening-027`
- **Observation:** `PF-2026-09-12-codex-hook-json-contract-mismatch`
- **Category:** `CONTRACT_MISMATCH`
- **Status:** `TRIAGED`
- **Severity:** `LOW`
- **Avoidable friction:** `true`
- **Ownership:** external/global runtime integration boundary; not repository-local source

## Failure classes and evidence

The execution transcript repeatedly recorded these exact runtime failures:

```text
hook returned invalid session start JSON output
hook returned invalid post-tool-use JSON output
hook returned invalid stop hook JSON output
```

The current successor repository has no Codex `SessionStart`, `PostToolUse`, or
`Stop` declaration in `.codex/hooks.json`. Its repo-local declarations are
limited to `PreToolUse` and `SubagentStart`. The Claude project settings do
declare `PostToolUse` and `Stop`, but their local handlers emit only fields
accepted by the active Codex command-hook schemas: `typecheck.sh` emits a
`systemMessage` on a typecheck diagnostic, and `assurance_gate.py` emits
`decision` and `reason` only when it blocks.

The user-level Codex configuration shows the enabled
`security-guidance@claude-plugins-official` integration registered for all
three affected lifecycle phases. The installed plugin is version `2.0.8` at:

```text
/home/azur/.codex/plugins/cache/claude-plugins-official/security-guidance/2.0.8/hooks/
```

Its declarations invoke `ensure_agent_sdk.py` for `SessionStart` and
`security_reminder_hook.py` for `PostToolUse` and `Stop`, through the
pass-through wrapper `sg-python.sh`.

Direct non-mutating serializer probes produced the following raw protocol
outputs:

PostToolUse stdout:

```json
{"metrics":{"pv":20008,"skipped":true,"skip_reason":21}}
```

Stop stdout:

```json
{"metrics":{"pv":20008,"security_review":1},"rewakeSummary":"Commit security review found issues","decision":"block","reason":"Security guidance finding"}
```

Stop stderr contained the diagnostic `Security guidance finding`. The
SessionStart handler source explicitly prints this Claude async bootstrap line
before its final response:

```json
{"async":true,"asyncTimeout":180000}
```

It then prints a response containing a top-level `metrics` object and may add
Claude-specific `hookSpecificOutput` and `systemMessage` fields. The wrapper
does not add protocol output; it executes the Python handler and passes its
stdout through.

The active Codex binary's command-hook schemas were inspected locally. The
PostToolUse, SessionStart, and Stop output objects all set
`additionalProperties: false`. Their allowed top-level fields are respectively
Codex `continue`, `decision`, `hookSpecificOutput`, `reason`, `stopReason`,
`suppressOutput`, `systemMessage`; SessionStart's corresponding subset; and
Stop's `continue`, `decision`, `reason`, `stopReason`, `suppressOutput`, and
`systemMessage`. `metrics`, `rewakeSummary`, and `async` are not accepted.

The historical event payload was not present in the persisted local session log
available during this investigation; the exact messages supplied by the Owner,
the current handler source, and the direct raw stdout/stderr probes above are
the reproducible evidence. No plugin bootstrap was run because it can mutate
user-level plugin state and install dependencies.

## Ownership and decision

This is one external contract mismatch explaining all three event classes:
Claude Code's `SyncHookJSONOutput`/async-hook protocol is being delivered at a
Codex command-hook boundary whose schema is strict. It is not a defect in
`.codex/hooks.json`, `.claude/hooks/typecheck.sh`,
`.claude/hooks/assurance_gate.py`, or the accepted recovery implementation.

No repository hook behavior was changed. No global or user Codex configuration
was changed. The recovery implementation remains byte-identical to the
accepted source candidate, and normal hooks remain fail-closed. The recommended
follow-up is for the plugin/runtime integration owner to gate Claude-specific
hooks by runtime or provide a Codex-specific serializer, while keeping metrics
and diagnostics off protocol stdout. This observation is advisory and does not
authorize a generic recovery bypass, hook disabling path, guard relaxation, or
global configuration mutation.
