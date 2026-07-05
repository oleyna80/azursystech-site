# WB-2026-07-05-skills-curation

Owner approved (sprint retro, docs/reports/sprint-retro-sdlc-2026-07-05.md, section 5): orchestrator-implementation rule, model routing, skills consolidation 37→~9, GPT critic/verifier keep DEGRADED path.

## Goals

1. **AGENTS.md**: add Control Tower execution rule — after plan approval the orchestrator does not implement or verify; scoped-coder implements the write-set, verifier verifies; browser smoke/screenshots only inside verifier (verdict returns, images do not). Add model routing table: Explore/inventory → haiku; scoped-coder/verifier/reviewer/critic → sonnet; solution-architect → opus (hard architecture only); gpt-* → inherit via Codex MCP, DEGRADED path stays when Codex is unavailable.
2. **`.claude/agents/*.md`**: replace stale model pins (claude-sonnet-4-6, opus-4-8) with aliases: critic/reviewer/scoped-coder/verifier → `sonnet`; solution-architect → `opus`; gpt-critic/gpt-verifier/codex-reviewer → leave `inherit`.
3. **Skills consolidation** in `.agent/skills/` (37 → 9):
   - Keep: `impeccable`, `systematic-debugging`, `webapp-testing`, `subagent-mission-brief`.
   - Merge → `design-direction`: taste-skill, emil-design-eng, theme-factory, frontend-design, brutalist-skill, minimalist-skill, redesign-skill (style presets become reference/*.md inside).
   - Merge → `discovery`: architecture-discovery, technical-discovery, graphify-code-map.
   - Merge → `security-pass` (modes: triage | harden | verify): security-audit-triage, security-hardening-pass, security-verification-gate, codex-verification, handoff-live-smoke.
   - Merge → `memory-ops`: orchestrator-log, context-snapshot, memory-bank-manager, ssot-sync-closeout, agent-operations-review.
   - Merge → `git-safety`: merge-protocol, scoped-commit-guard, shell-context-guard.
   - Delete (agent-wrapper duplicates of `.claude/agents/`): critic-review, reviewer, verifier, scoped-coder — unique content (if any) folds into the corresponding agent .md.
   - Archive to `.agent/skills/_archive/` (stays gitignored): skill-creator, mcp-builder, output-skill, project-estimation, task-decomposition (estimation/decomposition fold into solution-architect prompt; output rule folds into AGENTS.md if absent).
4. **`.agent/ROSTER.md`**: rewrite to a one-pager — 9 skills, agent mappings, model routing. Skill Routing Gate must be scannable in ~30s.
5. **Commit**: curated light skills via `git add -f` (per .gitignore policy note); `impeccable` stays local (1.9M vendor wrapper, reinstallable). `.opencode/skills/` mirror sync deferred to a later WB.

## Execution topology (per new rule)

- scoped-coder A (sonnet): AGENTS.md + .claude/agents pins.
- scoped-coder B (sonnet): skills merge + ROSTER rewrite.
- verifier (sonnet): ROSTER↔skills consistency (no dangling references), agents frontmatter valid, merged skills have valid frontmatter + Triggers, AGENTS.md coherent.
- Control Tower: gates, log, consolidation, commit.

## Write-set

- AGENTS.md
- .agent/ROSTER.md
- .agent/skills/ (merge/archive operations)
- .claude/agents/
- .agent/verification-gate.md
- docs/reports/
- docs/plans/

## Verification (standard-lite)

- All 9 skill dirs exist with valid SKILL.md frontmatter; zero references in ROSTER to removed skills.
- `.claude/agents/*.md` YAML frontmatter parses; model values ∈ {sonnet, opus, haiku, inherit}.
- grep: no orphan mentions of deleted skill names in AGENTS.md / ROSTER / workflows.
- git status clean after commit except session gate files.

## Critic supplements (accepted 2026-07-05)

- Model aliases: `sonnet`/`opus`/`haiku` are native Claude Code agent frontmatter values (harness-resolved). Document in AGENTS.md.
- Explicit deletions: rm .agent/skills/{critic-review,reviewer,verifier,scoped-coder}/ ; ROSTER rewritten without those rows.
- design-direction/SKILL.md MUST contain: trigger table (style adjectives/task types → reference file), reference index, allowed-tools = union of merged skills, 2-3 example invocations.
- memory-ops and security-pass SKILL.md MUST document mode selection explicitly (when triage vs harden vs verify; when log vs snapshot vs bank vs ssot-sync).
- No per-coder commits: Control Tower makes ONE consolidated commit after verifier READY.
- AGENTS.md mention of scoped-commit-guard updated to git-safety.
