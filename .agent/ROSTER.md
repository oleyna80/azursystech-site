# .agent/ROSTER.md — Agent & Skill Registry (23 Skills)

> Curated registry of 23 skills (10 core + 13 media-production planning skills). Authority model: Control Tower (plan/sync), Design Analyst (read-only design routing/brief), Scoped Coder (execute), Verifier (independent check), Reviewer (read-only analysis). Model routing: haiku (discover), sonnet (coder/verifier/reviewer/design), opus (architect). GPT agents inherit via Codex MCP (DEGRADED path when unavailable).

---

## The 23 Skills

| # | Skill | Triggers | Primary Agent | Mode(s) | Key References |
|---|---|---|---|---|---|
| 1 | **impeccable** | Vendor wrapper (OpenCode local) | Scoped Coder (when wrapper available) | Local vendor skill | (keep as-is, local only) |
| 2 | **design-direction** | "build landing", "redesign", "brutalist/minimalist", "fix animation", "pick theme", "choose design skill stack", "design brief" | Design Analyst (routing/brief), Scoped Coder (implementation) | Greenfield, Redesign, Style, Theme, Design Brief | taste, emil, theme-factory, redesign, brutalist, minimalist, frontend-design |
| 3 | **discovery** | "research before coding", "best stack/API", "how does X interact", "code map" | Control Tower / Architect | Strategic, Tactical, Map | architecture, technical, graphify |
| 4 | **security-pass** | "pentest report", "fix findings", "verify hardening", auth/payments/DB changes | Reviewer (triage), Coder (harden), Verifier (verify) | Triage, Harden, Verify, Codex, Handoff-smoke | triage, harden, verify, codex, handoff-smoke |
| 5 | **memory-ops** | "log decision", "freeze state", "housekeep memory", "sync closeout", "review friction" | Control Tower | Log, Snapshot, Bank, SSOT-sync, Ops-review | log, snapshot, bank-manager, ssot-sync, ops-review |
| 6 | **git-safety** | "scoped commit", "2+ agents done", "merge conflicts", "bash/PowerShell error" | Coder (commit), Control Tower (merge, shell) | Scoped-commit, Merge-protocol, Shell-context | scoped-commit, merge, shell-context |
| 7 | **systematic-debugging** | Debugging, logging, error isolation | Control Tower / Debugger | Root-cause, isolation | (kept as-is, no merge) |
| 8 | **webapp-testing** | QA, smoke tests, visual regression | Verifier / QA Analyst | Browser tests, acceptance | (kept as-is, no merge) |
| 9 | **subagent-mission-brief** | Subagent dispatch, mission framing | Control Tower | Mission definition, scope isolation | (kept as-is, no merge) |
| 10 | **sprint-analysis** | "проанализируй спринт", "что сделали за неделю", velocity, план/факт, retro with numbers | Control Tower | Period analytics (log + git) | scripts/extract.sh |
| 11 | **media-production-orchestrator** | Website/video media objective, production pipeline | Control Tower | Planning only | production-contract; future WB required for execution |
| 12 | **media-art-director** | Hero motion, product reveal, motion-medium choice | Design Analyst / Control Tower | Planning | static/reduced-motion alternative |
| 13 | **media-rights-compliance** | Source rights, consent, licensing, watermark, provider terms | Reviewer / Control Tower | Advisory planning | No legal certainty; future approved evidence research |
| 14 | **short-video-scriptwriter** | 3–15 second loop, reveal, visual beats | Design Analyst | Planning | beat/loop contract |
| 15 | **storyboard-director** | Multi-beat, safe-zone, responsive or continuity storyboard | Design Analyst | Planning | frame plan and review evidence |
| 16 | **cinematography-director** | Camera, lens, light, motion, factual fidelity | Design Analyst | Planning | shot specification |
| 17 | **video-creative-brief** | Production-ready media brief | Control Tower / Design Analyst | Planning | bounded budget and approval role |
| 18 | **video-prompt-engineer** | Prompt package and immutable motion constraints | Design Analyst | Planning | provider-neutral prompt only |
| 19 | **video-provider-router** | Provider/model route, cost, watermark, terms | Control Tower / Reviewer | Planning only | No research/config/external action without future WB |
| 20 | **video-generator** | Approved generation package | Scoped Coder in future WB | Future execution contract | No paid call, credential, upload/download now |
| 21 | **video-quality-control** | Generated-candidate review | Verifier in future WB | Future review contract | No ffprobe/file processing now |
| 22 | **video-postproduction** | Delivery variants, posters, encoding budget | Scoped Coder in future WB | Future processing contract | No encoder/Bash/output now |
| 23 | **web-video-integration** | Responsive, accessible website video integration | Scoped Coder in future WB | Future integration contract | No source/assets integration now |

---

## Agent Authority & Hard Stops

| Agent | Role | Authority | Hard Stops |
|---|---|---|---|
| **Control Tower** | Orchestrator, SSOT owner | Plan approval, stage flow, subagent dispatch, scope gate, closeout | plan approval, scope expansion, tier selection, critic verdict |
| **Design Analyst** | Read-only design strategist | Design read, design-skill stack selection, source fidelity mode, Design Brief, visual QA plan | No repository writes; hand off to Scoped Coder |
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
| "prepare design brief" | design-direction | Design Brief | Design Analyst |
| "which design skill should this use?" | design-direction | Design Brief | Design Analyst |
| "fix this button animation" | design-direction | Style (emil) | Coder |
| "this site needs redesign" | design-direction | Redesign | Coder |
| "pick theme for demo" | design-direction | Theme | Design Analyst -> Coder |
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
| "нужно ли видео на странице?" | media-art-director | Planning | Design Analyst |
| "подготовь видео-бриф" | video-creative-brief | Planning | Control Tower / Design Analyst |
| "сценарий короткого ролика" | short-video-scriptwriter | Planning | Design Analyst |
| "сториборд/кадры/безопасная зона" | storyboard-director | Planning | Design Analyst |
| "камера, свет, объектив" | cinematography-director | Planning | Design Analyst |
| "промпт для видео" | video-prompt-engineer | Planning | Design Analyst |
| "права, согласие, watermark" | media-rights-compliance | Advisory planning | Reviewer |
| "выбор провайдера/модели видео" | video-provider-router | Planning only | Control Tower |
| "сгенерируй/скачай/обработай/встрой видео" | media-production-orchestrator | Future approved WB required | Control Tower |

For any future AI-video generation or release, use the evidence and stop
conditions in [AI Video Production Operating Instruction](../docs/engineering-memory/ai-video-production-operating-instruction.md).
That instruction is a governance boundary, not authority to access a provider,
use a key, spend budget, write media, or publish an asset.

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
