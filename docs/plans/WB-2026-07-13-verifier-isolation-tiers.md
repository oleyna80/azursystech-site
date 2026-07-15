# Work Block — verifier isolation tiers

## Stage 0 — Routing preflight

- **Work Block:** `WB-2026-07-13-verifier-isolation-tiers`
- **Type:** policy, local Codex runtime configuration, and deterministic gate hardening
- **Side-effect class:** local docs/workflow write; local user runtime configuration write
- **DB action mode:** none
- **Hard Stops:** none (no deploy, credential change, live data, destructive operation, commit, or push)
- **Subagent topology:** `Subagent-Required` — native read-only Critic → one Scoped Coder → native read-only Verifier; sensitive closeout additionally requires an independent top-level readonly Codex verification root. New child dispatch hit `thread-limit`; the completed Critic thread is reassigned as the single Scoped Coder for this stage. Parallel writers remain prohibited.
- **Skill Routing:** checked: git-safety, security-pass, memory-ops, current Work Block/gate templates, openai-docs; matched/used: security-pass, memory-ops, current gate templates, openai-docs; skipped: git-safety (no commit); other categories not relevant
- **Write gate:** READY after Critic approval and exact write-set is recorded in `.agent/critic-gate.md`.

## Objective

Make read-only subagent safety explicit and usable: native same-session reviewers are advisory, sensitive closeout requires a separate readonly Codex root, and higher-risk operations require OS isolation. Harden the verification gate so it fails closed on missing, invalid, or inadequate declared isolation without claiming it can prove process isolation.

## Approved write-set

Control Tower artifacts:

- `.agent/critic-gate.md`
- `.agent/verification-gate.md`
- `docs/plans/WB-2026-07-13-verifier-isolation-tiers.md`
- `docs/reports/WB-2026-07-13-verifier-isolation-tiers-critic.md`
- `docs/reports/WB-2026-07-13-verifier-isolation-tiers-verification.md`
- `memory_bank/context.md`
- `memory_bank/progress.md`
- `memory_bank/decisions.md`
- `memory_bank/orchestrator-log.md`
- `memory_bank/review-log.md`

Scoped Coder only:

- `AGENTS.md`
- `.agent/workflows/sdd-protocol.md`
- `.claude/hooks/verification-gate.sh`
- `.claude/hooks/tests/gate-fixtures.sh`
- `.codex/AGENTS.md`
- `.codex/instructions.md`
- `.codex/hooks/verification-gate.sh`
- `.codex/hooks/tests/gate-fixtures.sh`
- `docs/templates/subagent-mission-brief-template.md`
- `/home/azur/.codex/config.toml`
- `/home/azur/.codex/readonly.config.toml`

## Out of scope

- MCP server definitions, tokens, credentials, `.env`, provider settings, and external side effects.
- Application code, deployment, database, dependency, commit, and push changes.
- Automatic provisioning of separate OS users, containers, or mounts.

## Acceptance criteria

1. Policy defines `same-session-degraded`, `independent-readonly-root`, and `os-isolated`, including when each is required and their limits.
2. `READY` gate rejects missing or unknown isolation, rejects same-session verification for non-`none` sensitive domains, and preserves `SKIPPED` Quick-Fix behavior.
3. Claude and Codex hook variants and their fixtures remain aligned and pass.
4. Default future Codex roots use `workspace-write`; readonly profile is `read-only` plus `approval_policy = "never"`.
5. A separate top-level readonly Codex root independently verifies this sensitive Work Block after the diff is frozen; otherwise the verification gate remains blocked.

## Stage status

- Stage 0: READY
- Stage 1: DONE — one Scoped Coder completed the approved write-set.
- Stage 2: DONE — independent readonly Codex root `019f5bde-2344-7eb3-89e6-dcc05ebb032b` returned `READY` after diff freeze.
- Stage 3: DONE — Control Tower recorded the independent verdict and synchronized the local SSOT.
