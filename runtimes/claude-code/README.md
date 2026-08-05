# Claude Code Runtime Adapter

## Status

Implemented generated-project baseline for logical-role subagents, project hooks,
portable skills, and explicit opt-in integrations.

This adapter implements the Governance Core. It does not redefine authority,
source-of-truth order, Hard Stops, lifecycle gates, or completion.

## Logical Role Mapping

| Logical role | Claude Code implementation | Default authority |
|---|---|---|
| Orchestrator | Main Claude Code session | workflow and coordination artifacts |
| Architect | `.claude/agents/solution-architect.md` | read-only plus approved drafts |
| Critic | `.claude/agents/critic.md` | read-only |
| Coder | `.claude/agents/scoped-coder.md` | approved write-set only |
| Reviewer | `.claude/agents/reviewer.md` | read-only |
| Verifier | `.claude/agents/verifier.md` | read-only plus approved reports |

Names in `.claude/agents/` are runtime identifiers. The logical role and active
Work Block determine authority.

Provider-named agents such as `gpt-critic`, `gpt-verifier`, and
`codex-reviewer` are no longer part of the generated-project default. Cross-
runtime review is performed through an admitted integration and remains bound
to the normal Critic, Reviewer, or Verifier function.

## Installed Project Files

```text
CLAUDE.md
.claude/
├── settings.json
├── agents/
│   ├── solution-architect.md
│   ├── critic.md
│   ├── scoped-coder.md
│   ├── reviewer.md
│   └── verifier.md
├── hooks/
│   ├── critic-gate.sh
│   ├── hard-stop.sh
│   ├── typecheck.sh
│   └── verification-gate.sh
├── skills/
└── agent-memory/
```

`.mcp.json` is present but empty by default. No plugin, MCP server, external
runtime, credential, watcher, or service is installed or enabled automatically.

## Session Bootstrap

1. Read `CLAUDE.md`.
2. Read `AGENTS.md` and follow its progressive read set.
3. Identify the active Work Block and approved specification.
4. Record actual Claude Code capabilities, permission mode, hooks, integrations,
   and isolation.
5. Bind required logical functions to Claude Code agents or admitted external
   integrations.
6. Keep source writes blocked until Define is complete.

`CLAUDE.md` is a runtime entry point, not a second governance contract.

## Hooks

The generated baseline retains project hooks for:

- consequential Bash / Hard Stop checks;
- Critic/write-gate checks before edits;
- targeted post-edit type checks;
- verification-gate checks at stop.

Hooks are guardrails, not OS-level isolation. They depend on the installed
Claude Code version, project trust, settings, shell environment, and the event
payload. Review hook source and run safe fixtures after runtime updates.

If a hook is unavailable or cannot enforce the required boundary:

- label the capability degraded;
- use a more restrictive permission mode, separate worktree/runtime, or manual
  approval;
- do not upgrade blocked or unverified evidence.

## Permissions

Default project settings do not pre-authorize MCP tools or external integrations.

Role agents further restrict tools in their frontmatter. The runtime's effective
permissions must be recorded because user, enterprise, CLI, and project settings
may combine or override one another.

Hard Stops remain explicit Owner decisions even when Claude Code offers an
approval prompt or an auto-approval mode.

## Skills and Memory

Portable skills are copied to `.claude/skills/` and `.agent/skills/`. Skills
provide procedures; they do not grant tool or write authority.

`.claude/agent-memory/` is runtime-local operational state. It may contain useful
patterns but is not normative. Promote durable, evidence-backed knowledge to
`docs/engineering-memory/` through closeout.

Do not store secrets, credentials, personal data, or hidden reasoning in agent
memory.

## Integrations

### Codex from Claude Code

Preferred route:

- `integrations/claude-code-codex-plugin/` — official Codex plugin.

Compatibility route:

- `integrations/mcp/` — reviewed Codex MCP configuration.

Recovery/transport route:

- `integrations/file-handoff/` — audited task/result files.

None is enabled by default. An integration must have an admission record and
must be bound to a logical function in the active Work Block.

### Other MCP and Plugins

Treat plugins, MCP tools, browser tools, issue trackers, and vendor CLIs as
integration adapters. Tool access does not expand the invoking role.

## Capability Snapshot

Start with observed values, not assumptions:

```yaml
runtime: claude-code
status: available
capabilities:
  project_instructions: observed
  custom_subagents: observed
  project_hooks: observed
  per_agent_tool_policy: observed
  native_plan_mode: observed
  separate_child_sessions: observed
  plugins: unknown_until_installed
  mcp: unknown_until_configured
  worktrees: external_workflow
  os_isolation: false
limitations:
  - same machine and checkout unless separately configured
  - user and enterprise settings may affect effective permissions
  - hooks are not an operating-system security boundary
```

Replace `observed` with evidence and version references in project state.

## Assurance Topology

For low-risk work, separate subagent passes may be sufficient. For stronger
independence:

- use a separate Claude Code session or worktree;
- use an admitted Codex/OpenCode integration;
- use a separate runtime, container, account, machine, or human review where the
  governance profile requires it.

A different model name alone does not establish independence.

## Validation

After bootstrap or runtime/plugin updates:

- parse `.claude/settings.json`;
- verify only logical-role agents are active by default;
- run harmless hook fixtures;
- confirm `.mcp.json` is empty unless explicitly admitted;
- confirm no committed secret values;
- test one read-only Architect/Reviewer task;
- test one blocked write outside the approved scope;
- record runtime version and inspection gaps.

## Degraded Mode

When subagents or hooks are unavailable, preserve the lifecycle through separate
manual passes or sessions. Record actual authority and isolation. Do not claim
independent review or executable enforcement that did not occur.

## References

- Claude Code documentation: <https://docs.anthropic.com/en/docs/claude-code/>
- Integration adapters: `integrations/`
