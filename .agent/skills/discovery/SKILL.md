---
name: discovery
description: Research & analysis before implementation. Modes: strategic (stack/API/DB), tactical (structure/dependencies/ripple), map (code graph). Use for unfamiliar domains, architecture questions, or dependency navigation.
user-invocable: true
allowed-tools:
  - Read
  - Bash(git *)
  - Bash(ls *)
  - Bash(find *)
  - Bash(grep *)
  - Bash(cat *)
  - Bash(rg *)
  - Bash(jq *)
---

# discovery: Architecture & Technical Discovery

> Consolidated skill merging architecture-discovery, technical-discovery, and graphify-code-map. Use for pre-implementation research, architecture decisions, and code navigation.

## Modes

| Mode | Trigger | Use Case | Output | Reference |
|---|---|---|---|---|
| **strategic** | "what's the best stack/API approach", "should we use X or Y", architectural decisions | Pre-implementation research for new modules, third-party integrations, security-sensitive design | Architecture Brief | `reference/architecture.md` |
| **tactical** | "исследуй структуру", "что зависит от чего", ripple-analysis | Understand current code structure, dependencies, call paths, refactor scope | Brief summary + dependency map | `reference/technical.md` |
| **map** | "code map", unfamiliar broad slice, before large review | Visual navigation of entrypoints, high-degree modules, call flows | Code graph + navigation hints | `reference/graphify.md` |

## When to Use

✓ New projects or major modules
✓ Unclear technical direction
✓ Stack or library selection
✓ API contract design, DB/schema design
✓ Third-party integrations
✓ Security-sensitive design
✓ Large refactors with architecture risk
✓ Unfamiliar runtime slice, broad route/service review

✗ Small bugfixes
✗ Text/doc-only edits
✗ Minor CSS/UI changes
✗ Tasks with approved implementation plan
✗ Live DB, deploy, provider API, client-facing actions

## Workflow

1. **Verify state** — check git, current work
2. **Read canonical context** — AGENTS.md, ROSTER, memory bank, tasklist
3. **Inspect repo conventions** — existing patterns before proposing new approach
4. **Research uncertain areas only** — don't over-scope
5. **Compare practical options** — including "keep current approach"
6. **Recommend approach** — with boundaries, risks, verification needs
7. **Hand off** — to Control Tower for SDD Work Block

## Hard Limits

- Do not install packages without Owner approval
- Do not use real credentials or call production APIs
- Do not apply migrations or deploy
- Do not run destructive git operations
- Do not change production code as part of discovery
- Do not expand scope beyond approved question

## Handoff

- **Success condition:** Architecture Brief (strategic) or dependency map (tactical) or code graph (map)
- **Next:** Control Tower → SDD planning or implementation Work Block
- **Auto-proceed:** YES (read-only discovery inside approved scope)
- **Hard stop:** YES before install, credentials, production API, destructive git, or code changes

---

## Reference Files

- [`reference/architecture.md`](reference/architecture.md) — Architecture Discovery (strategic mode)
- [`reference/technical.md`](reference/technical.md) — Technical Discovery (tactical mode)
- [`reference/graphify.md`](reference/graphify.md) — Graphify Code Map (map mode)

