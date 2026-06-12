# .agent/ROSTER.md — Agent & Mode Registry

> Canonical registry of all agents, modes, and their responsibilities.
> Update when adding new modes or skills.
> Team functions are temporary specializations by default, not permanent roles,
> unless they require a new authority model.

---

## Roo / Cline Modes (`.roomodes`)

| Slug | Name | Role | Hard Stop Authority |
|---|---|---|---|
| `azursystech-control-tower` | Control Tower | Orchestration, planning, SSOT ownership | Owns plan approval gate |
| `azursystech-docs-reviewer` | Docs Reviewer | Read-only audit, SSOT drift | None (read-only) |
| `azursystech-scoped-coder` | Scoped Coder | Approved-scope implementation | None (execute only) |
| `azursystech-verifier` | Verifier | AC verification gate | BLOCKED verdict halts pipeline |

---

## Codex (OpenAI)

Config: `.codex/config.toml` — `multi_agent = true`
Instructions: `.codex/instructions.md` — delegation policy, SDD stage mapping, context hygiene
Custom agents: `.codex/agents/scoped-coder.toml`, `.codex/agents/verifier.toml`
Routing: follows `AGENTS.md` stage flow + skill triggers. Main chat stays
Control Tower. Use subagents whenever they materially improve speed, quality,
or context hygiene, and for large expected outputs. Use one write-capable Scoped
Coder per approved write-set; keep Reviewer/Verifier subagents read-only for
source, runtime, config, DB, infra, secrets, and production state unless a Work
Block explicitly scopes verification artifact writes.
Create a new project-local skill only for a recurring repo-specific workflow
not already covered by an existing workflow or skill; otherwise update the
existing source. Public/vendor skills may be adapted locally when useful, but
tool capability or external availability never expands file authority, hard-stop
rules, or approved scope.

Project-local Codex skills live in `.agent/skills/<skill>/SKILL.md`. Skills may
include `agents/openai.yaml` UI metadata plus optional `scripts/`, `references/`,
and `assets/` resources. Load bundled resources only when the active task needs
them.

Codex memories are a shared recall layer, not an authority source and not a
per-agent SSOT. Keep mandatory process rules in `AGENTS.md` and durable project
state in the documented SSOT files. If a role accumulates repeatable verified
lessons, curate them into that role's skill `references/` files instead of
creating ad hoc per-agent memory folders.

Temporary specializations are allowed per Work Block. Use the base role for
authority and a specialization for focus, for example `Reviewer / Architecture
Analyst`, `Reviewer / Security Analyst`, `Coder / Backend Coder`, or `Verifier /
QA Analyst`.

---

## Qwen

Config: `.qwen/settings.json`
Allowed commands whitelist. Follows `AGENTS.md` for flow policy.

Runtime allowlists and tool capabilities do not grant process authority. All
agents still follow `AGENTS.md` for approved write-set, hard stops, staging,
commit, deploy, and file authority rules.

---

## Claude (Anthropic)

Used via Antigravity / direct API.
Follows `AGENTS.md` for flow policy, hard stops, and file write authority.
Skill routing: same as Codex — stage flow + skill triggers.

### Claude Code Agents (`.claude/agents/`)

> Native Claude Code agents with persistent memory. Each agent accumulates
> institutional knowledge across Work Blocks in its own memory store.

| Agent | SDLC Phase | Authority | Memory | Purpose |
|---|---|---|---|---|
| `solution-architect` | Plan (pre-implementation) | Read-only research, risk flagging | `.claude/agent-memory/solution-architect/` | Codebase analysis, architectural decisions, risk matrix, optimal solution proposal |
| `verifier` | Verify (post-implementation) | Read-only source/config/DB/infra, can issue BLOCKED verdict | `.claude/agent-memory/verifier/` | Acceptance criteria verification, contract/schema/security checks, tier-based gate (lite/standard/full) |

**Proven pattern:** `solution-architect → verifier(skill) → Plan mode → Implement → verifier(agent)`.

**When to add a new agent:** recurring role with cumulative knowledge (failure patterns, contract-sensitive zones, anti-patterns). One-off tasks → use skills instead.

---

## Gemini (Google)

Used via Antigravity / direct API.
Follows `AGENTS.md` for flow policy, hard stops, and file write authority.
Skill routing: same as Codex — stage flow + skill triggers.

---

## Skill → Agent Assignment

This table lists routing-critical skills, not every utility skill in `.agent/skills/`.

| Skill | Primary Agent |
|---|---|
| `task-decomposition` | Control Tower |
| `subagent-mission-brief` | Control Tower |
| `agent-operations-review` | Control Tower |
| `project-estimation` | Control Tower |
| `technical-discovery` | Control Tower |
| `architecture-discovery` | Control Tower (optional pre-SDD research) |
| `memory-bank-manager` | Control Tower |
| `ssot-sync-closeout` | Control Tower |
| `reviewer` | Docs Reviewer / read-only Reviewer subagent |
| `scoped-coder` | Scoped Coder |
| `verifier` | Verifier |
| `azursystech-contract-verifier` | Verifier |
| `security-verification-gate` | Verifier |
| `intake-agent-foundation` | Scoped Coder |
| `azursystech-schema-route` | Scoped Coder |
| `security-audit-triage` | Docs Reviewer |
| `security-hardening-pass` | Scoped Coder |
| `contact-drift-audit` | Docs Reviewer |
| `copy-review` | Docs Reviewer |
| `index-exclusions-manager` | Scoped Coder |
| `local-seo-ops` | Scoped Coder |
| `lead-response-ops` | Scoped Coder |
| `social-automation-ops` | Scoped Coder |
| `ai-runtime-ops` | Scoped Coder |
| `telegram-webhook-gate` | Control Tower / Scoped Coder |
| `scoped-commit-guard` | Scoped Coder |
| `systematic-debugging` | Control Tower |
| `shell-context-guard` | Control Tower |
| `compose-preflight` | Control Tower |
| `deploy-readiness-gate` | Control Tower |
| `vps-registry-pull-deploy` | Control Tower (Owner approval required) |
| `vps-deploy-recovery` | Control Tower (Owner approval required) |
| `vps-db-tunnel-ops` | Control Tower (Owner approval required) |
| `vps-repo-sync` | Control Tower |
| `vps-ghcr-credential-rotation` | Control Tower (Owner approval required) |
| `vps-security-runtime-proof` | Verifier |
| `vps-sql-runtime-proof` | Verifier |
| `theme-factory` | Control Tower → Scoped Coder (theme application) |
| `brand-guidelines` | Control Tower / Scoped Coder |
| `frontend-design` | Scoped Coder |
| `emil-design-eng` | Scoped Coder (on-demand UI polish + animation review) |
| `impeccable` | Scoped Coder (wrapper in `.agent/skills/impeccable`, vendor source `.claude/skills/impeccable`) |
| `taste-skill` | Scoped Coder (strategic: brief inference + 3 param dials) |
| `minimalist-skill` | Scoped Coder (Linear/Notion editorial style) |
| `soft-skill` | Scoped Coder (premium/calm high-end agency look) |
| `brutalist-skill` | Scoped Coder (Swiss typography + industrial aesthetic) |
| `redesign-skill` | Scoped Coder (audit & upgrade existing UIs) |
| `output-skill` | Scoped Coder (force complete unabridged output) |
| `imagegen-frontend-web` | Scoped Coder (section-level design reference images) |
| `image-to-code-skill` | Scoped Coder (reference image → production code) |

Utility / preflight skills are intentionally omitted from the routing-critical
table unless they define ownership. Invoke these by trigger when needed:
`graphify-code-map`, `nextjs-seo-build-verifier`, `npm-audit-wsl`,
`wsl-browser-preflight`.

---

## Autonomy Level per Skill

| Level | Meaning |
|---|---|
| 🟢 AUTO | Skill auto-proceeds; no Owner confirmation needed |
| 🔴 HARD STOP | Skill requires explicit Owner approval before execution |

See each `SKILL.md → ## Handoff` for per-skill level.
