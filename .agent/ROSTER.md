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

Config template: `.codex/config.toml.template` — `multi_agent = true`
Instructions: `.codex/instructions.md` — delegation policy, SDD stage mapping, context hygiene
Custom agents: none committed by default; use runtime-native subagents when
available and this roster for role/scope contracts.
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

---

## OpenCode

Config: `.opencode/agents/*.md` — subagent contracts mirroring
`.claude/agents/` (same roles: solution-architect, critic, gpt-critic,
reviewer, scoped-coder, verifier, gpt-verifier, codex-reviewer).
Frontmatter is opencode-specific: `mode: subagent`, `permission` block,
`color` as hex or theme token (named colors are invalid).
Root config: `opencode.json` — permission floor mirroring `AGENTS.md` Hard
Stops (deny push-to-main/force-push/ssh/deploy/live-DB/direct Codex CLI;
ask by default), `share: disabled`, `autoupdate: false`.
GPT models: native OpenAI provider via ChatGPT Plus/Pro subscription auth
(`opencode auth login`); Codex MCP is not required inside OpenCode —
gpt-critic/gpt-verifier may pin a GPT model via `model:` frontmatter.
Follows `AGENTS.md` for flow policy, hard stops, and file write authority.
Skill routing: same as Codex — stage flow + skill triggers.
Plugin runtime state under `.opencode/` (node_modules, package*.json) is
local-only, self-ignored via generated `.opencode/.gitignore`.

---

## Gemini (Google)

Used via Antigravity / direct API.
Follows `AGENTS.md` for flow policy, hard stops, and file write authority.
Skill routing: same as Codex — stage flow + skill triggers.

---

## Skill → Agent Assignment

This table lists routing-critical skill candidates and approved project-local
skills. It does not mean every listed `.agent/skills/<name>/` directory is
committed or required in a fresh clone. Use the skill workflow only when the
skill file exists in the workspace and is inside the approved scope; otherwise
record `skill-file-unavailable` and use the nearest committed gate/template.

| Skill | Primary Agent |
|---|---|
| `task-decomposition` | Control Tower |
| `subagent-mission-brief` | Control Tower |
| `agent-operations-review` | Control Tower |
| `project-estimation` | Control Tower |
| `technical-discovery` | Control Tower |
| `architecture-discovery` | Control Tower / Architecture Analyst |
| `memory-bank-manager` | Control Tower |
| `ssot-sync-closeout` | Control Tower |
| `context-snapshot` | Control Tower |
| `orchestrator-log` | Control Tower |
| `merge-protocol` | Control Tower |
| `shell-context-guard` | Control Tower |
| `systematic-debugging` | Control Tower |
| `handoff-live-smoke` | Control Tower (Owner approval if external runtime/API is used) |
| `mcp-builder` | Control Tower (Owner approval if config/dependency changes are required) |
| `graphify-code-map` | Control Tower / Architecture Analyst |
| `skill-creator` | Control Tower |
| `scoped-coder` | Scoped Coder |
| `scoped-commit-guard` | Scoped Coder / Control Tower before staging |
| `reviewer` | Docs Reviewer |
| `critic-review` | Docs Reviewer / Reviewer |
| `verifier` | Verifier |
| `codex-verification` | Verifier |
| `security-verification-gate` | Verifier |
| `security-audit-triage` | Docs Reviewer |
| `security-hardening-pass` | Scoped Coder |
| `theme-factory` | Control Tower → Scoped Coder (theme application) |
| `frontend-design` | Scoped Coder |
| `emil-design-eng` | Scoped Coder (on-demand UI polish + animation review) |
| `azursystech-impeccable` | Scoped Coder when an approved OpenCode wrapper exists; vendor `impeccable` remains runtime-local under `.claude/skills/impeccable` |
| `taste-skill` | Scoped Coder (strategic: brief inference + 3 param dials) |
| `minimalist-ui` | Scoped Coder (Linear/Notion editorial style) |
| `industrial-brutalist-ui` | Scoped Coder (Swiss typography + industrial aesthetic) |
| `redesign-existing-projects` | Scoped Coder (audit & upgrade existing UIs) |
| `full-output-enforcement` | Scoped Coder (force complete unabridged output) |
| `webapp-testing` | Verifier / QA Analyst |

Utility / preflight skills are intentionally omitted from the routing-critical
table unless they define ownership. Invoke these by trigger when needed:
runtime tools, MCP tools, browser helpers, and project-specific scripts.

---

## Autonomy Level per Skill

| Level | Meaning |
|---|---|
| 🟢 AUTO | Skill auto-proceeds; no Owner confirmation needed |
| 🔴 HARD STOP | Skill requires explicit Owner approval before execution |

See each `SKILL.md → ## Handoff` for per-skill level.
