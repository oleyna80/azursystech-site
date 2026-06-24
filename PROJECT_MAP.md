# Project Map

This file is the first navigation map for `azursystech`. It helps humans and
agents orient before reading the full repository.

## Purpose

AzurSysTech is a local web systems and AI automation project for small
businesses, independent professionals, and TPE owners around Nice. The
repository contains the public website, admin surface, lead/intake automation,
deployment helpers, product strategy documents, and the project-local Agentic
SDLC layer.

The Agentic SDLC layer runs scoped Work Blocks with explicit roles, approved
write-sets, review, verification, and durable logs. It must protect project
specific rules around SQL-first intake, Telegram gates, deploy gates, secrets,
and local/private agent runtime state.

## Authority Model

When files conflict, use this order:

1. Explicit Owner instruction for the current task.
2. `AGENTS.md` in this project.
3. Approved Work Block plan and write-set.
4. `PROJECT_MAP.md` and `FILE_REGISTRY.yml`.
5. Runtime-specific policy files such as `.codex/critic.md`,
   `.codex/write-gate.md`, `.claude/settings.json`, hooks, and agent prompts.
6. Reference docs, examples, logs, and generated/discovery artifacts.

Generated or discovery artifacts may help locate information, but they do not
override normative instructions, Owner decisions, approved scope, or the
current tasklist.

## Operating Modes

Start with the smallest mode that can safely deliver the Work Block. See
`docs/profiles.md` for selection rules.

- **Minimal Codex-only**: one local agent, scope control, logs, review,
  verification, no Claude Code handoff.
- **Standard Codex SDLC**: full Work Block flow with reusable project-local
  skills and stronger closeout evidence.
- **Claude Code Team Runtime**: Claude Code acts as its own local team with
  agents, hooks, skills, settings, and memory.
- **Codex -> Claude Code Handoff**: Codex delegates scoped work to Claude Code
  as an external team through an explicit handoff task.
- **Codex model routing overlay**: optional user-level Codex profiles keep
  strong models on orchestration/critic decisions and cheaper or local models
  on bounded executor tasks. Real provider settings stay outside committed
  project files.

## Key Paths

| Path | Status | Purpose |
|---|---|---|
| `AGENTS.md` | normative | Root operating contract for agents in this project. |
| `PROJECT_MAP.md` | normative | Human-readable project map. |
| `FILE_REGISTRY.yml` | normative | Machine-readable key file/path registry. |
| `README.md` | normative | Human-facing repository entrypoint and quickstart. |
| `PRODUCT.md` | normative | Product positioning, users, voice, and design principles. |
| `CLAUDE.md` | runtime-specific | Claude/Anthropic entrypoint when available. |
| `.agent/` | normative routing | Runtime-neutral roster, workflows, gates, and project-local skills. |
| `.codex/` | mixed runtime | Portable Codex policy, templates, agents, and hooks are tracked; real provider config, backups, and machine-local state remain ignored. |
| `.claude/` | runtime-specific | Claude Code agents, hooks, skills, settings, and project-local agent memory. |
| `memory_bank/` | mixed | Durable project context, decisions, rolling progress, and workflow evidence logs. |
| `docs/` | mixed | Plans, specs, tasklists, reports, templates, references, deployment docs, and session bootstrap. |
| `00_strategy/` | normative | Strategy, positioning, offer stack, roadmap, and pivot decisions. |
| `01_brand/` | reference | Brand copy, FAQ, advertising and social page content. |
| `02_website/` | reference | Website copy/specs, legal content, wireframes, and template notes. |
| `03_leads/` | normative/reference | Lead intake specs, taxonomy, response templates, and CRM pipeline. |
| `04_facebook/` | normative/reference | Facebook/social automation strategy and playbooks. |
| `05_ai/` | normative/reference | AI agent specs, prompts, escalation rules, examples, and agent registry. |
| `06_seo/` | reference | Local SEO, GBP, reviews, and service page planning. |
| `07_ops/` | reference | Launch checklist, KPI framework, and task board. |
| `08_showcase/` | reference | Showcase and static mockup materials when present. |
| `web/` | source | Production public website application and tests. |
| `admin/` | source | Internal admin application, auth, social automation modules, and tests. |
| `showcase/` | source | Demo/showcase Next.js application and demo-kit renderer. |
| `chat/` | source | Legacy or auxiliary chat server code. |
| `scripts/` | project-specific | Bootstrap, verification, backup, deploy, VPS, and DB helper scripts. |
| `web/sql/`, `admin/sql/` | source | Database migrations; live apply is approval-gated. |
| `.github/workflows/` | runtime | CI and publication workflows; changes require appropriate verification. |

## Generated, Log, and Local-Only Boundaries

- `.env*`, credentials, provider tokens, private keys, local model/provider
  config, raw transcripts, caches, build output, and local machine state must
  not be committed.
- Selected `.codex/` policy files are portable and tracked so the same write
  gate, critic, agent, and hook contracts are available on every workstation.
  `.codex/config.toml`, backups, local overrides, credentials, provider URLs,
  and API/model secrets remain ignored and must not be committed.
- Claude Code project policy lives under `.claude/`, but the active local
  provider/model environment for this workstation lives outside the repository
  at `~/.config/claude-code/env` (`/home/azur/.config/claude-code/env` here).
  Keep that file private and untracked.
- `.claude/agent-memory/**` is project-local agent memory unless deliberately
  reviewed for publication.
- `docs/plans/**` and `docs/reports/**` are Work Block evidence and reports;
  the current approved tasklist matters more than older plans or reports.
- `memory_bank/orchestrator-log.md`, `memory_bank/review-log.md`, and
  `memory_bank/external-team-log.md` are evidence logs, not current authority.
- `output/**`, `.next/**`, `dist/**`, `build/**`, `coverage/**`,
  `node_modules/**`, `web/test-results/**`, and similar generated paths are
  derived/local state.
- `.roo/`, `.roomodes`, `.qwen/`, and archived orchestration imports are not
  active authority for current Codex/Claude Code execution.

## New-Session Bootstrap

For project work, read in this order:

1. `AGENTS.md`
2. `PROJECT_MAP.md`
3. `FILE_REGISTRY.yml`
4. `docs/session-bootstrap.md`
5. `.agent/workflows/sdd-protocol.md`
6. `.agent/ROSTER.md`
7. `memory_bank/context.md`
8. `memory_bank/progress.md`
9. `memory_bank/decisions.md`
10. The current task, active tasklist, or approved Work Block plan
11. `git status --short --branch`
12. Relevant diffs and target files

Do not assume memory from a previous session is current when repository files
are cheap to verify.

## Map Maintenance

Update this file and `FILE_REGISTRY.yml` when a change:

- adds, moves, or removes a major directory;
- changes authority, write gates, review gates, or verification gates;
- changes generated/local-only boundaries;
- adds a new runtime layer, profile, or project-specific governance rule;
- changes source ownership boundaries for `web/`, `admin/`, `showcase/`,
  `scripts/`, SQL, deploy, or agent workflow files.
