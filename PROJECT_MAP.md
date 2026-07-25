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
2. `AGENTS.md`.
3. Approved Work Block plan and write-set.
4. `PROJECT_MAP.md` and `FILE_REGISTRY.yml`.
5. Current `docs/engineering-memory/` entries.
6. Runtime-specific policy files such as committed core `.agent/` files,
   approved `.agent/skills/**` wrappers, `.codex/**`, `.claude/**`, hooks,
   settings, and agent prompts.
7. Reference docs, examples, logs, generated/discovery artifacts, and old chat
   context.

Generated or discovery artifacts may help locate information, but they do not
override normative instructions, Owner decisions, or approved scope.

## Operating Modes

Start with the smallest mode that can safely deliver the Work Block:

- **Minimal Codex-only:** one local agent, scope control, logs, review,
  verification, no Claude Code, no handoff.
- **Standard Codex SDLC:** Work Block flow with project-local skills,
  durable memory, review, and verification.
- **Claude Code team runtime:** Claude Code acts as a separate local team with
  its own runtime files when explicitly used.
- **OpenCode orchestration:** OpenCode may use `AGENTS.md` and the project
  memory layer as its root contract.
- **Antigravity design lab:** frontend/design prototyping only; no backend,
  DB, deploy, secrets, auth, or production-risk changes without explicit
  Owner approval.

## Key Paths

| Path | Status | Purpose |
|---|---|---|
| `AGENTS.md` | normative | Root operating contract for all agents. |
| `PROJECT_MAP.md` | normative | Human-readable map and authority model. |
| `FILE_REGISTRY.yml` | normative | Machine-readable registry for key files and zones. |
| `README.md` | reference | Product/repository overview and human quickstart. |
| `.agent/` | normative routing | Runtime-neutral roster, SDD workflow, gates, and approved skill wrappers. |
| `.agent/workflows/sdd-protocol.md` | normative | Canonical Work Block lifecycle and verification semantics. |
| `.agents/` | runtime adapter | Codex-compatible project skill discovery wrappers; canonical skill bodies remain in `.agent/skills/**`. |
| `.codex/` | runtime | Codex-specific instructions, critic contract, and write gate. |
| `.claude/` | runtime | Claude Code control layer: settings, hooks, command adapters, subagent contracts, security guidance (committed); skills curated separately, local state ignored. |
| `.opencode/` | runtime | OpenCode control layer: command adapters and subagent contracts in `agents/` (committed), mirroring `.claude/agents/`; plugin runtime state self-ignored. |
| `opencode.json` | runtime | OpenCode root config: permission floor mirroring Hard Stops, share disabled, autoupdate pinned; no provider/credential settings. |
| `docs/engineering-memory/` | normative | Durable project engineering memory for all agent runtimes. |
| `docs/policies/` | reference | Readable companion policy documents; non-normative and subordinate to their canonical Markdown instruction. |
| `docs/plans/` | evidence | Work Block plans and execution records. |
| `docs/templates/` | normative | Reusable Work Block, report, and mission templates. |
| `memory_bank/` | local runtime | Operational context/logs created by bootstrap; not durable authority. |
| `web/` | source | Production Next.js website and SQL-first intake flow. |
| `admin/` | source | Internal admin Next.js application. |
| `showcase/` | source | Portfolio/showcase Next.js application and demos. |
| `chat/` | source/reference | Chat or AI interaction experiments and support files. |
| `scripts/` | mixed | Bootstrap, verification, deploy, VPS, and maintenance scripts. |
| `.github/workflows/` | runtime | CI workflows. |

## Generated, Log, and Local-Only Boundaries

- `docs/engineering-memory/**` is committed durable project memory; keep it
  evidence-backed and secret-free.
- `docs/plans/**` and `docs/reports/**` are Work Block evidence and reports;
  the current approved plan matters more than older plans.
- `.agent/README.md`, `.agent/ROSTER.md`, `.agent/critic-gate.md`,
  `.agent/verification-gate.md`, and `.agent/workflows/**` are the committed
  runtime-neutral workflow layer that should survive a fresh clone.
- `.agent/skills/**` is commit-eligible only after a skill-curation Work Block
  approves exact skill paths. Unapproved local skill directories are deferred
  aids, not bootstrap requirements, and should remain ignored/local until
  curated.
- `.agents/**` contains Codex-compatible runtime adapters only. Keep canonical
  skill content in `.agent/skills/**`; do not commit provider config or local
  machine paths there.
- `.codex/**` may contain committed Codex policy/templates/hooks only.
  Private runtime config such as `.codex/config.toml` must stay local.
- `memory_bank/**` is operational runtime state. Bootstrap may create starter
  files locally; promote durable knowledge to `docs/engineering-memory/`.
- `.env*`, credentials, provider tokens, caches, build output, `.next`,
  `node_modules`, local browser artifacts, and machine state must not be
  committed.
- Future graph/discovery outputs are derived context only.

## New-Session Bootstrap

For project work, read in this order:

1. `AGENTS.md`
2. `PROJECT_MAP.md`
3. `FILE_REGISTRY.yml`
4. `docs/session-bootstrap.md`
5. The current task or Work Block plan
6. Relevant `docs/engineering-memory/` entries
7. `git status --short --branch`
8. Relevant diffs and target files

Do not assume memory from a previous session is current when repository files
are cheap to verify.

## Map Maintenance

Update this file and `FILE_REGISTRY.yml` when a change:

- adds, moves, or removes a major directory;
- changes authority, write gates, review gates, or verification gates;
- changes generated/local-only boundaries;
- adds a new runtime layer, profile, or project-specific governance rule.
