# AzurSysTech Project Map

This map is the fast orientation layer for humans and agents entering the
`azursystech` repository. It should answer "where do I look first?" before an
agent starts reading source files.

## Purpose

`azursystech` is the working repository for AzurSysTech's local IT services
presence: production website, internal admin surface, showcase demos, intake
flows, deployment scripts, and supporting Agentic SDLC operating files.

The project uses a scoped Agentic SDLC layer so Codex, Claude Code, OpenCode,
Antigravity, Gemini, DeepSeek, or future agents can work from the same project
memory and approval model.

## Authority Model

When files conflict, use this order:

1. Explicit Owner instruction for the current task.
2. `AGENTS.md` and Governance Core (`governance/`).
3. Approved Work Block plan, specification, and write-set.
4. `PROJECT_MAP.md` and `FILE_REGISTRY.yml`.
5. Current `docs/engineering-memory/` entries.
6. Runtime-specific policy files such as committed core `.agent/` files,
   approved `.agent/skills/**` wrappers, `.codex/**`, `.claude/**`, `.opencode/`,
   hooks, settings, and agent prompts.
7. Reference docs, examples, logs, generated/discovery artifacts, and old chat
   context.

Generated or discovery artifacts may help locate information, but they do not
override normative instructions, Owner decisions, or approved scope.

## Work Block Profiles

Each Work Block selects independently:

- **Governance profile:** Advisory, Controlled, Managed, Assured, Distributed.
- **Runtime profile:** one installed or otherwise approved runtime adapter.
- **Integration profile:** none or an admitted bridge/tool/transport.
- **Model class:** task-appropriate capability class.
- **Isolation:** actual boundary from same context to OS-isolated.
- **Evaluation posture:** not required or an approved deterministic/output/trajectory plan.

The installation profile (`.agent/bootstrap-profile.json`) constrains local availability;
it does not activate a runtime, integration, or evaluation authority.

## Evaluation & Repair Assurance

`governance/evaluation.md` distinguishes:

- deterministic tests for objective contracts;
- output evaluation against an approved rubric;
- observable trajectory evaluation for tool, gate, check, retry, side-effect,
  and evidence events.

Narrow Deterministic Repair (NDR) is a constrained mode for CI/bootstrap repairs.

## Key Paths

| Path | Status | Purpose |
|---|---|---|
| `AGENTS.md` | normative | Root operating contract for all agents. |
| `.agent/bootstrap-profile.json` | generated | Resolved installation profile and path contract. |
| `governance/` | normative | Runtime-neutral authority, lifecycle, artifacts, evaluation, capabilities. |
| `PROJECT_MAP.md` | normative | Human-readable map and authority model. |
| `FILE_REGISTRY.yml` | normative | Machine-readable registry for key files and zones. |
| `README.md` | reference | Product/repository overview and human quickstart. |
| `.agent/` | normative routing | Runtime-neutral roster, SDD workflow, gates, and approved skill wrappers. |
| `.agent/workflows/sdd-protocol.md` | normative | Canonical Work Block lifecycle and verification semantics. |
| `.agent/ROSTER.md` | normative | Logical roles, skill routing, runtime binding, isolation. |
| `.agent/active-work-block.json` | operational gate | Specification, write-set, integrations, assurance, closeout. |
| `.agent/active-work-block.default.json` | portable default | Fail-closed restore state. |
| `.agent/critic-gate.md` | compatibility view | Decision critique summary. |
| `.agent/verification-gate.md` | compatibility view | Review, verification, evaluation, drift, closeout summary. |
| `.agent/skills/` | normative skills | Project-local portable skills (including git-orchestration-flow, skill-library-maintenance, sprint-analysis). |
| `.codex/` | runtime | Codex-specific instructions, critic contract, agents, scripts, and write gate. |
| `.claude/` | runtime | Claude Code control layer: settings, hooks, command adapters, subagent contracts, security guidance. |
| `.opencode/` | runtime | OpenCode control layer: command adapters, subagent contracts in `agents/`, and adapted skills in `skills/`. |
| `opencode.json` | runtime | OpenCode root config: permission floor mirroring Hard Stops, default_agent, subagent_depth, snapshot. |
| `docs/engineering-memory/` | normative | Durable project engineering memory for all agent runtimes. |
| `docs/plans/` | evidence | Work Block plans and execution records. |
| `docs/specs/` | normative | Approved product and technical specifications. |
| `docs/tasklist/` | derived | Active task decomposition. |
| `docs/evals/` | evidence/config | Approved evaluation plans, fixtures, observable events. |
| `docs/reports/` | evidence | All assurance, evaluation, integration, and closeout evidence. |
| `docs/templates/` | normative | Reusable Work Block, evaluation, NDR, report, and mission templates. |
| `memory_bank/` | local runtime | Operational context/logs created by bootstrap; not durable authority. |
| `runtimes/` | adapter documentation | Capability, activation, limitation, fallback documentation. |
| `integrations/` | adapter documentation | Optional bridge/tool/transport admission documentation. |
| `web/` | source | Production Next.js website and SQL-first intake flow. |
| `admin/` | source | Internal admin Next.js application. |
| `showcase/` | source | Portfolio/showcase Next.js application and demos. |
| `chat/` | source/reference | Chat or AI interaction experiments and support files. |
| `scripts/bootstrap.sh` | health check | Validates profile/default and restores local state. |
| `scripts/validate-installation-profile.py` | validator | Selected paths, kinds, absent surfaces, blocked default. |
| `scripts/validate-evaluation.py` | validator | Evaluation plan/report consistency and closeout binding. |
| `scripts/repair-lifecycle.py` | validator | Fail-closed NDR record limit validation. |
| `.github/workflows/` | runtime | CI workflows. |

## Generated, Log, and Local-Only Boundaries

- `docs/engineering-memory/**` is committed durable project memory; keep it
  evidence-backed and secret-free.
- `docs/plans/**` and `docs/reports/**` are Work Block evidence and reports.
- `.agent/bootstrap-profile.json` is generated installation evidence.
- `.agent/README.md`, `.agent/ROSTER.md`, `.agent/critic-gate.md`,
  `.agent/verification-gate.md`, and `.agent/workflows/**` are the committed
  runtime-neutral workflow layer.
- `memory_bank/**` is operational runtime state.
- `.env*`, credentials, provider tokens, caches, build output, `.next`,
  `node_modules`, local browser artifacts, and machine state must not be
  committed.

## New-Session Bootstrap

For project work, read in this order:

1. `AGENTS.md`
2. `.agent/bootstrap-profile.json`
3. `PROJECT_MAP.md`
4. `FILE_REGISTRY.yml`
5. `docs/session-bootstrap.md`
6. The current task or Work Block plan
7. Relevant `docs/engineering-memory/` entries
8. `git status --short --branch`
9. Relevant diffs and target files

## Map Maintenance

Update this file and `FILE_REGISTRY.yml` when a change adds, moves, or removes
major directories, gates, runtimes, or path boundaries.
