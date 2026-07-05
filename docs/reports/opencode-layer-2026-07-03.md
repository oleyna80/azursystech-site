# OpenCode Permanent Layer — Closeout Report — 2026-07-03

Work Block: WB-2026-07-03-opencode-layer
Critic: APPROVE (after SUPPLEMENT round) —
docs/reports/critic-WB-2026-07-03-opencode-layer.md
Mode: Owner-approved formalization. Nothing staged or committed.

## Context

`.opencode/agents/` (8 subagent contracts mirroring `.claude/agents/`) existed
untracked and unreferenced by any SSOT document. Quick-fix
WB-2026-07-03-opencode-agent-colors earlier today made the layer loadable
(named frontmatter colors → hex; opencode 1.17.13 loads all 8 agents).
OpenCode runtime also self-generates `.opencode/.gitignore` (node_modules,
package*.json, bun.lock) and installs `@opencode-ai/plugin` — that local
state is git-ignored by the nested .gitignore.

## Changes

- `FILE_REGISTRY.yml`: new `.opencode/**` entry — `committed_control_layer`,
  boundary (committed agents/ vs local plugin runtime state vs pre-empted
  provider config), update_when includes sync with `.claude/agents/`.
- `PROJECT_MAP.md`: `.opencode/` row in Key Paths.
- `.agent/ROSTER.md`: new `## OpenCode` section (roles, frontmatter specifics
  incl. hex-color requirement, authority model, skill routing).
- `AGENTS.md` (§ Agent Roster): OpenCode listed among approved runtimes with
  authority statement and pointer to `.opencode/agents/**` (critic MUST
  finding).
- `.gitignore`: preventive rules `.opencode/config.toml`,
  `.opencode/opencode.json`, `.opencode/*.local*` (critic SHOULD finding),
  plus plugin runtime state (node_modules, package*.json, bun.lock, nested
  .gitignore) — the opencode-generated `.opencode/.gitignore` self-ignores,
  so on a fresh clone only root-level rules provide protection.

## Committable Content

`.opencode/agents/*.md` (8 files) only. Plugin runtime state stays local via
root .gitignore rules (nested generated .gitignore is itself ignored).

## Follow-up (not implemented)

Drift-check between `.claude/agents/` and `.opencode/agents/` (contracts are
duplicates by design; colors already diverged once). Candidate: pre-commit
hook or verification skill in a future Work Block.

## Verification (lite, inline)

- `git diff --check` — clean.
- FILE_REGISTRY.yml parses as YAML.
- `git check-ignore` matrix: `agents/*.md` and `.opencode/.gitignore`
  committable; `config.toml`/`opencode.json`/`*.local*`/node_modules ignored.
- `opencode agent list` — all 8 project agents load, no validation errors.

## Status

Ready for Owner review/commit. Gate files hold live session values — reset
from scratchpad backups before commit.
