# Critic Report — WB-2026-07-13-codex-sdlc-alignment

## Stage 0 preflight

- Work Block type: Codex SDLC alignment and guardrail hardening.
- Side-effect class: local workflow/config write; no production, DB, deploy, client, commit, or push action.
- DB action mode: none.
- Hard Stops: none in scope; global MCP authentication headers and credentials are explicitly out of scope.
- Skills Routing: checked=openai-docs, roster, current gate templates; matched=openai-docs; used=openai-docs for current official Codex behavior; skipped=all non-documentation skills as not relevant.
- Subagent Topology: required (runtime configuration, workflow, hooks, and independent verification); read-only Security Analyst and Config Analyst dispatched; exactly one Control Tower write stream.
- Write gate: READY after this report and the matching `.agent/critic-gate.md` record are refreshed.

## Verdict

**APPROVE WITH REQUIRED FIXES.**

The current delegated-agent topology remains sound: one approved writer, read-only analytical agents, and `max_depth = 1`. The following changes are required before the SDLC can claim current Codex compatibility:

1. State that native subagents inherit the parent live sandbox and approval policy; a role profile alone is not a technical read-only boundary.
2. Make the Codex critic hook process `apply_patch` payloads and return the current PreToolUse deny shape.
3. Make verification fail closed when the verifier verdict is `BLOCKED`.
4. Require an exact same-day `origin main` push approval with final `Owner` actor column.
5. Use native Codex critic/verifier as the normal route; treat a second runtime as an explicit, risk-driven audit rather than a mandatory Codex-MCP dependency.
6. Migrate legacy global `[profiles.*]` tables to separate profile files without touching MCP headers or credentials.
7. Replace unconditional `close_agent` wording with a runtime-capability condition and make the mission brief record effective permissions.

## Approved Write-Set

- AGENTS.md
- .agent/ROSTER.md
- .agent/workflows/sdd-protocol.md
- .agent/critic-gate.md
- .agent/verification-gate.md
- .claude/hooks/hard-stop.sh
- .claude/hooks/verification-gate.sh
- .claude/hooks/tests/gate-fixtures.sh
- .claude/hooks/tests/hard-stop-fixtures.sh
- .codex/AGENTS.md
- .codex/hooks.json
- .codex/hooks/critic-gate.sh
- .codex/hooks/hard-stop.sh
- .codex/hooks/secret-scan.sh
- .codex/hooks/typecheck.sh
- .codex/hooks/verification-gate.sh
- .codex/hooks/tests/gate-fixtures.sh
- .codex/hooks/tests/hard-stop-fixtures.sh
- .codex/instructions.md
- docs/reports/WB-2026-07-13-codex-sdlc-alignment-critic.md
- docs/templates/subagent-mission-brief-template.md
- /home/azur/.codex/config.toml
- /home/azur/.codex/techlead.config.toml
- /home/azur/.codex/coder.config.toml
- /home/azur/.codex/readonly.config.toml
- /home/azur/.codex/fast.config.toml
- /home/azur/.codex/docs.config.toml

## Out of Scope

Application code, `.env*`, MCP server definitions and authentication headers, global agent prompts, dependency changes, staging, commit, push, deploy, DB, and external provider calls.
