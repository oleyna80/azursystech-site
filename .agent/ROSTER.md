# .agent/ROSTER.md — Agent & Skill Registry (10 Skills)

> Curated registry of all agents and 10 skills (9 consolidated + sprint-analysis). Authority model: Control Tower (plan/sync), Scoped Coder (execute), Verifier (independent check), Reviewer (read-only analysis). Model routing: haiku (discover), sonnet (coder/verifier/reviewer), opus (architect). GPT agents inherit via Codex MCP (DEGRADED path when unavailable).

---

## The 10 Skills

| # | Skill | Triggers | Primary Agent | Mode(s) | Key References |
|---|---|---|---|---|---|
| 1 | **impeccable** | Vendor wrapper (OpenCode local) | Scoped Coder (when wrapper available) | Local vendor skill | (keep as-is, local only) |
| 2 | **design-direction** | "build landing", "redesign", "brutalist/minimalist", "fix animation", "pick theme" | Scoped Coder | Greenfield, Redesign, Style, Theme | taste, emil, theme-factory, redesign, brutalist, minimalist, frontend-design |
| 3 | **discovery** | "research before coding", "best stack/API", "how does X interact", "code map" | Control Tower / Architect | Strategic, Tactical, Map | architecture, technical, graphify |
| 4 | **security-pass** | "pentest report", "fix findings", "verify hardening", auth/payments/DB changes | Reviewer (triage), Coder (harden), Verifier (verify) | Triage, Harden, Verify, Codex, Handoff-smoke | triage, harden, verify, codex, handoff-smoke |
| 5 | **memory-ops** | "log decision", "freeze state", "housekeep memory", "sync closeout", "review friction" | Control Tower | Log, Snapshot, Bank, SSOT-sync, Ops-review | log, snapshot, bank-manager, ssot-sync, ops-review |
| 6 | **git-safety** | "scoped commit", "2+ agents done", "merge conflicts", "bash/PowerShell error" | Coder (commit), Control Tower (merge, shell) | Scoped-commit, Merge-protocol, Shell-context | scoped-commit, merge, shell-context |
| 7 | **systematic-debugging** | Debugging, logging, error isolation | Control Tower / Debugger | Root-cause, isolation | (kept as-is, no merge) |
| 8 | **webapp-testing** | QA, smoke tests, visual regression | Verifier / QA Analyst | Browser tests, acceptance | (kept as-is, no merge) |
| 9 | **subagent-mission-brief** | Subagent dispatch, mission framing | Control Tower | Mission definition, scope isolation | (kept as-is, no merge) |
| 10 | **sprint-analysis** | "проанализируй спринт", "что сделали за неделю", velocity, план/факт, retro with numbers | Control Tower | Period analytics (log + git) | scripts/extract.sh |

---

## Agent Authority & Hard Stops

| Agent | Role | Authority | Hard Stops |
|---|---|---|---|
| **Control Tower** | Orchestrator, SSOT owner | Plan approval, stage flow, subagent dispatch, scope gate, closeout | plan approval, scope expansion, tier selection, critic verdict |
| **Scoped Coder** | Implementation executor | Write approved write-set only | None (execute within scope only) |
| **Verifier** | Acceptance gate | AC validation, checks, security, verdict (READY/BLOCKED/UNVERIFIED) | BLOCKED verdict halts pipeline |
| **Reviewer** | Read-only analyst | Code audit, security triage, feedback (no changes) | None (advisory only) |
| **Critic** | Decision reviewer | Pre-Work-Block quality gate, verdict (SUPPLEMENT sends back) | RECONSIDER verdict |

---

## Model Routing

| Task Class | Model | Rationale |
|---|---|---|
| Discover/Explore | **haiku** | Fast, cheap research |
| Implement/Code/Verify | **sonnet** | Fast, capable, cost-effective |
| Architect/Hard Decisions | **opus** | Strong reasoning for complex decisions |
| Optional external critic/verifier | **inherit** | Explicit second-runtime audit only; native Codex agents are the normal path |

---

## Archived Skills (`.agent/skills/_archive/`)

37 → 9 consolidation. Archived skills are preserved locally with their original SKILL.md intact for reference:

**Design consolidations (7 → design-direction):**
- taste-skill, emil-design-eng, theme-factory, frontend-design, brutalist-skill, minimalist-skill, redesign-skill

**Discovery consolidations (3 → discovery):**
- architecture-discovery, technical-discovery, graphify-code-map

**Security consolidations (5 → security-pass):**
- security-audit-triage, security-hardening-pass, security-verification-gate, codex-verification, handoff-live-smoke

**Memory/Ops consolidations (5 → memory-ops):**
- orchestrator-log, context-snapshot, memory-bank-manager, ssot-sync-closeout, agent-operations-review

**Git consolidations (3 → git-safety):**
- merge-protocol, scoped-commit-guard, shell-context-guard

**Agent duplicates (removed, authority moved to .claude/agents/):**
- critic-review, reviewer, verifier, scoped-coder

**Vendor/utility (moved to _archive for reference, not active):**
- skill-creator, mcp-builder, output-skill, project-estimation, task-decomposition

---

## Quick Skill Routing

| Brief | → Skill | Mode | Agent |
|---|---|---|---|
| "build landing page" | design-direction | Greenfield | Coder |
| "fix this button animation" | design-direction | Style (emil) | Coder |
| "this site needs redesign" | design-direction | Redesign | Coder |
| "pick theme for demo" | design-direction | Theme | Coder |
| "what's the best stack?" | discovery | Strategic | Control Tower |
| "how does code interact?" | discovery | Tactical | Control Tower |
| "check pentest report" | security-pass | Triage | Reviewer |
| "fix security findings" | security-pass | Harden | Coder |
| "verify after hardening" | security-pass | Verify | Verifier |
| "commit only these files" | git-safety | Scoped-commit | Coder |
| "2+ agents completed" | git-safety | Merge-protocol | Control Tower |
| "log this decision" | memory-ops | Log | Control Tower |
| "freeze state for parallel" | memory-ops | Snapshot | Control Tower |
| "sync SSOT on closeout" | memory-ops | SSOT-sync | Control Tower |
| "проанализируй спринт" | sprint-analysis | Period analytics | Control Tower |

---

## Runtime Command Adapters

Canonical skill contracts live in `.agent/skills/**`. Runtime adapters may make
those skills easier to invoke, but must stay thin and must not fork the
canonical instructions.

| Runtime | Invocation | Adapter | Canonical source |
|---|---|---|---|
| OpenCode | `/sprint` | `.opencode/commands/sprint.md` | `.agent/skills/sprint-analysis/SKILL.md` |
| Claude Code | `/sprint` | `.claude/commands/sprint.md` | `.agent/skills/sprint-analysis/SKILL.md` |
| Codex | skill discovery / `$sprint-analysis` | `.agents/skills/sprint-analysis/SKILL.md` | `.agent/skills/sprint-analysis/SKILL.md` |

Adapter rules:

- Sprint analysis is read-only by default.
- `docs/reports/**` output is allowed only when the Owner explicitly asks for a file.
- Adapters must not edit skills, hooks, templates, source code, env/provider config, or perform commit/push/deploy.
- Improvement candidates become proposals for a later Work Block, not automatic permission to self-edit process files.

---

## Configuration References

- **AGENTS.md:** SDD operating contract, stage flow, Hard Stops, skill triggers, authority model (source of truth)
- **CLAUDE.md:** Global code style, environment setup, multi-agent workflows
- **Codex Config:** `.codex/config.toml.template`, `.codex/instructions.md`
- **OpenCode:** `.opencode/commands/*.md`, `.opencode/agents/*.md`, `opencode.json` (permission floor = AGENTS.md Hard Stops)

---

**This ROSTER is canonical for "which skill?" and "who decides?" All implementation and approval flows through Control Tower → Scoped Coder execution → Verifier gates.**
