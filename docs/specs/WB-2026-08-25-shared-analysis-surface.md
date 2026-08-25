# WB-2026-08-25 Shared Analysis Surface

## Status

- Work Block: WB-2026-08-25-shared-analysis-surface
- Lifecycle stage: Define
- Governance profile: Managed
- Subject branch: wb/2026-08-25-shared-analysis-surface
- Frozen base: 2fc0fbd6bd996681edfc4351a581f9543dba4fb0
- Authority: Owner-controlled GitHub Free publication; no push, merge, or deploy is authorized in this Work Block.

## Objective

Create the smallest safe, reproducible set of committed files that lets an external
agent with GitHub read access reconstruct current AzurSysTech project context,
coordination state, recent operational memory, durable engineering guidance, and
assurance evidence without publishing machine-local, private, secret, or heavy
runtime data.

## Requirements

### REQ-001 Shared operational-memory allowlist

Keep memory_bank/ ignored by default and allow only these four tracked paths:

- memory_bank/orchestrator-log.md
- memory_bank/context.md
- memory_bank/progress.md
- memory_bank/decisions.md

The four files must contain only safe, durable, current-or-explicitly-unknown
operational context. Raw transcripts, credentials, client data, private evidence,
runtime caches, and session scratch are excluded.

### REQ-002 Durable project context

Add docs/project-context.md with compact sections for business, services,
website, SEO/GEO/AI search, acquisition, AI/automation, current priorities, and
source material. It must be derived from committed repository evidence and safe
local source material only.

### REQ-003 Worktree safety

Ignore .codex/worktrees/** so linked worktrees cannot be accidentally staged by
normal Git commands. Existing worktrees are not moved or deleted.

### REQ-004 Active Work Block SSOT

Replace the mutable active Work Block value in PROJECT_MAP.md with a stable
pointer to .agent/active-work-block.json. The active JSON remains the source of
truth, and the frozen WB-2026-08-25-worktree-ssot-binding is not modified.

### REQ-005 Deterministic Git-aware validation

Add scripts/validate-shared-context.py with no network dependency. It must fail
if a required shared-context file is not tracked and fail if forbidden local or
private surfaces are tracked. It must verify the exact memory allowlist and allow
the existing safe .env.vps.example template while rejecting value-bearing env
files.

### REQ-006 Repository navigation

Register the new durable context, shared operational-memory paths, and validator
in FILE_REGISTRY.yml without changing unrelated source-zone publication policy.

### REQ-007 Scope boundary

Do not modify runtime profiles, bootstrap/profile installation, skill libraries,
agent profiles, private evidence, source-zone publication policy, or unrelated
working-tree paths.

## Acceptance criteria

- AC-001 A clean clone contains the required shared context from Git alone.
- AC-002 All four allowlisted memory paths and docs/project-context.md are tracked and readable.
- AC-003 Other memory_bank/** paths remain ignored and untracked.
- AC-004 .codex/worktrees/<representative-path> is ignored.
- AC-005 PROJECT_MAP.md points to .agent/active-work-block.json rather than duplicating an active ID.
- AC-006 The validator passes on the resulting repository state.
- AC-007 The validator fails when a required shared file is not tracked.
- AC-008 The validator fails when a forbidden local/private path is tracked.
- AC-009 No secrets, credentials, private evidence, provider configuration, client data, runtime cache, or heavy generated artifact is added.
- AC-010 The Work Block write-set excludes runtime profiles, skills, bootstrap, and agent-profile strategy.
- AC-011 Required Define and assurance evidence binds to the exact subject branch and base/head.

## Explicit non-goals

No changes to .codex/agents/**, .agent/skills/**, .claude/skills/**,
.opencode/skills/**, bootstrap/profile installation, or broad publication of
00_strategy/** through 08_showcase/**. No commit, push, merge, deployment,
database mutation, secret change, or destructive operation is authorized.

## Evidence boundary

The shared files are a read-only analysis surface, not an authority grant. The
active Work Block JSON, approved specification, reports, and Git revision remain
the authoritative governance chain. Local source zones are referenced only as
source zones; raw local material is not copied.

## Machine-readable Define records

- REQ-001: Keep memory_bank ignored except for the exact four-file shared operational-memory allowlist.
- REQ-002: Add compact safe durable project context for external analysis.
- REQ-003: Ignore .codex/worktrees/** without moving existing worktrees.
- REQ-004: Make PROJECT_MAP.md point to the active Work Block JSON SSOT.
- REQ-005: Add deterministic Git-aware shared-context validation with no network dependency.
- REQ-006: Register the shared context and validator in FILE_REGISTRY.yml.
- REQ-007: Exclude runtime profiles, skills, bootstrap, agent profiles, private evidence, and unrelated dirt.
- AC-001 [req=REQ-001,REQ-002,REQ-005]: A clean clone contains the required shared context from Git alone.
- AC-002 [req=REQ-001,REQ-002]: The five required shared files are tracked and readable.
- AC-003 [req=REQ-001,REQ-005]: Other memory_bank paths remain ignored and untracked.
- AC-004 [req=REQ-003,REQ-005]: A representative .codex/worktrees path is ignored and untracked.
- AC-005 [req=REQ-004]: PROJECT_MAP.md has no mutable active Work Block ID duplicate.
- AC-006 [req=REQ-005]: The validator passes on the resulting Git-index state.
- AC-007 [req=REQ-005]: The validator fails when a required shared file is not tracked.
- AC-008 [req=REQ-005]: The validator fails when a forbidden local/private surface is tracked.
- AC-009 [req=REQ-001,REQ-002,REQ-007]: No secret, private, client, provider, runtime, or heavy artifact is added.
- AC-010 [req=REQ-007]: The Work Block write-set excludes runtime profiles, skills, bootstrap, and agent-profile strategy.
- AC-011 [req=REQ-001,REQ-002,REQ-003,REQ-004,REQ-005,REQ-006,REQ-007]: Define and assurance evidence binds to the exact subject branch and revision.
