# Codex Runtime Adapter

## Status

Implemented generated-project baseline for project-scoped logical-role agents,
Codex hooks, provider-neutral machine gates, and explicit integration admission.

This adapter implements the Governance Core. It does not redefine authority,
source-of-truth order, Hard Stops, artifact verdicts, or closeout.

## Logical Role Mapping

| Logical role | Codex implementation | Default sandbox |
|---|---|---|
| Orchestrator | main Codex thread | parent session policy |
| Architect | `.codex/agents/architect.toml` | read-only |
| Critic | `.codex/agents/critic.toml` | read-only |
| Coder | `.codex/agents/coder.toml` | workspace-write |
| Reviewer | `.codex/agents/reviewer.toml` | read-only |
| Verifier | `.codex/agents/verifier.toml` | read-only |

The built-in explorer may support read-heavy discovery. Temporary
specializations change focus, not authority.

## Installed Files

```text
.agent/
├── active-work-block.json
├── authorizations/
└── hooks/
    └── hard_stop_policy.py

.codex/
├── config.toml.template
├── hooks.json
├── agents/
│   ├── architect.toml
│   ├── critic.toml
│   ├── coder.toml
│   ├── reviewer.toml
│   └── verifier.toml
└── hooks/
    ├── hard_stop_policy.py
    ├── pre_tool_use_policy.py
    ├── stage0_write_gate.py
    └── subagent_context.py
├── scripts/
│   ├── lifecycle.py
│   └── doctor.py
```

- `.agent/hooks/hard_stop_policy.py` is the shared provider-neutral
  consequential-action and external-runtime guard.
- `.codex/hooks/hard_stop_policy.py` is a Codex compatibility wrapper.
- `stage0_write_gate.py` is a deprecated compatibility entry point for the
  Codex write/scope policy.
- `config.toml.template` is not activated automatically.

## Configuration

Project multi-agent settings belong under `[agents]`:

```toml
[agents]
enabled = true
max_concurrent_threads_per_session = 6
interrupt_message = true
```

The public framework does not pin models/providers. Keep authentication,
provider definitions, private endpoints, telemetry settings, and concrete model
routing in user/private configuration.

Do not duplicate project hooks inline in `.codex/config.toml` when
`.codex/hooks.json` already declares them.

## Hook Layers

`.codex/hooks.json` registers:

1. shared Hard Stop policy for consequential Bash operations and direct external
   runtime CLI invocation;
2. Codex write/scope policy for Bash and edit/apply-patch paths;
3. bounded Work Block context on `SubagentStart`.

A command must pass every applicable hook. Approval in one layer does not bypass
another.

Project hooks are loaded only for trusted projects. Review source and run safe
fixtures before trusting new or modified hooks.

Hooks are guardrails, not OS isolation, and do not necessarily intercept every
hosted/specialized tool path. Plugins, MCP tools, connectors, browsers, and
other external capabilities require separate admission and runtime permission.

## Machine Work Block

`.agent/active-work-block.json` starts fail-closed and records:

- Work Block/governance profile;
- specification path/revision;
- Git `base_commit`;
- write gate/opened/expiry;
- Critic state/isolation/report;
- exact source and coordination write-sets;
- Hard Stop approvals;
- approved integration IDs and admission-record paths;
- Review, Verification, and Drift state/evidence;
- closeout mode.

Source writes require:

- schema version 2 and Work Block ID;
- approved specification path/revision;
- `write_gate.status: READY`;
- timezone-aware unexpired gate;
- current `HEAD` matching `base_commit`;
- a committed `.agent/authorizations/<work-block>.json` whose disk content and
  blob ID match `HEAD`, plus its committed sibling `.json.sig`; both are
  verified as `owner@agentic-sdlc` in namespace
  `agentic-sdlc-authorization` against the explicit external
  `AGENTIC_SDLC_OWNER_SIGNERS` trust anchor. The record's Work Block/spec
  digest/write-set/Critic evidence must match the gate and its expiry is the
  gate's ceiling;
- resolved required Critic;
- non-empty write-set;
- target path inside the write-set.

Coordination paths needed to prepare specifications/plans/reports/gate state may
remain writable while source is blocked.

After a commit changes `HEAD`, renew the gate before further source writes or an
approved push.

## Local Control-Plane Helpers

`.codex/scripts/lifecycle.py` provides atomic, fail-closed coordination state:
`status` is read-only; `prepare`, `freeze`, and `close` produce BLOCKED state;
`open` accepts only the path to a role-separated committed authorization record
with its detached signature and derives all authority-bearing fields from
`git show HEAD:<path>`; it never creates, edits, or signs that record. Set the
trust anchor explicitly, for example
`export AGENTIC_SDLC_OWNER_SIGNERS=/absolute/path/to/owner-signers`; it must
not be stored in project `HEAD`. `renew` only refreshes expiry within the
committed ceiling and cannot broaden the write-set. This is cooperative local
governance with cryptographic Owner-signature verification, not an OS security
boundary: hooks can be bypassed, but a same-user writer cannot forge Owner
approval without the separate private key.

`.codex/scripts/doctor.py` redacts sensitive field values and reports external
trust-anchor and authorization-signature readiness separately from CLI
availability and static state. Normal CI never invokes it. Explicit
`--live` performs only a local CLI version check in a disposable Git repository:
`AVAILABLE` means the CLI answered, not that hooks or native smoke passed. An
unavailable runtime is `UNVERIFIED`.

## Hard Stops

Supported Bash forms require an active approval window and matching Owner flag
for:

- commit and push;
- default-branch push/refspecs;
- recursive removal/destructive operations;
- live infrastructure and live-data mutation;
- credential/secret access or mutation;
- client-facing communications.

Direct child-runtime commands also cross an integration boundary:

| Command | Integration ID |
|---|---|
| `codex` | `codex-cli` |
| `claude` | `claude-code-cli` |
| `opencode` | `opencode-cli` |

They require:

- active non-expired Work Block;
- fresh Git baseline;
- matching ID in `integrations.approved`;
- at least one concrete path in `integrations.admission_records`.

Admission does not authorize child-runtime writes. The mission/function binding
and approved write-set must separately permit them.

Pattern matching covers common direct command forms; wrappers, aliases,
interpreters, containers, hosted tools, and indirect process launches need their
own admission/permission review.

## Write and Bash Scope Policy

The Codex write/scope layer:

- denies source writes while the gate is blocked/invalid/expired/stale;
- denies patches outside the write-set;
- denies uninspectable dynamic/globbed/repository-wide/compound mutations;
- validates staged paths before an approved commit;
- rejects broad implicit dependency-manager writes unless handled by an
  explicitly reviewed workflow;
- recommends small inspectable commands or `apply_patch`.

## Subagent Context and Isolation

`subagent_context.py` adds bounded operational context:

- logical agent type and permission mode;
- role authority;
- Work Block/governance profile;
- specification/revision;
- source gate/expiry and Critic state;
- source and coordination write-sets.

Context does not grant approval.

Custom-agent sandbox defaults are defense in depth. The parent turn's live
sandbox/approval overrides may apply to children. Record actual isolation and
shared machine/checkout/auth resources. Use separate worktrees, roots, runtimes,
containers, users, machines, accounts, or human review when stronger assurance
is required.

Parallel writers require separate worktrees/non-overlapping write-sets, one
consolidation owner, and assurance of the consolidated result.

## Integrations

Codex may be:

- the primary runtime;
- called through the official Claude Code Codex plugin;
- exposed through a reviewed MCP server;
- targeted through audited file handoff;
- invoked as an admitted direct CLI process.

See `integrations/`. No plugin, MCP server, external runtime, or service is
enabled by default.

## Activation

1. Bootstrap the project.
2. Read `AGENTS.md`, Governance Core, and this adapter.
3. Review `.codex/agents/`, `.codex/hooks.json`, and shared/Codex hooks.
4. Copy `.codex/config.toml.template` to `.codex/config.toml` only when desired.
5. Create the human Work Block and populate the machine gate while blocked.
6. Record capability/runtime/model/isolation evidence.
7. Resolve required Critic and integration admissions.
8. Set current base commit, scope/write-set, short expiry, and required approvals.
9. Change the source gate to `READY` only after Define is complete.
10. Trust hooks deliberately and run safe fixtures/read-only smoke.

## Validation

Framework CI runs:

```bash
bash scripts/test-sdd-contract.sh
python scripts/test-integration-contracts.py
python scripts/test-codex-adapter.py
python scripts/test-codex-hard-stops.py
bash scripts/validate-governance.sh
bash scripts/validate-publication.sh
```

The disposable scaffold verifies agents, shared/Codex hooks, machine gate,
runtime/integration adapters, safe defaults, and templates.

## Degraded Mode

When custom agents/hooks are unavailable:

- preserve logical functions through separate sessions/runtimes/manual passes;
- record actual authority/isolation and missing enforcement;
- keep source blocked unless another approved guardrail enforces scope;
- label same-context assurance degraded;
- do not upgrade `BLOCKED`/`UNVERIFIED` evidence.

## Official References

- <https://developers.openai.com/codex/subagents>
- <https://developers.openai.com/codex/hooks>
- <https://developers.openai.com/codex/config-reference>
