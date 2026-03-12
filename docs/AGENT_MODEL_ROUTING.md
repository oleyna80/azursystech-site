# Agent Model Routing

## Goal
Явно зафиксировать, какая роль каким агентом выполняется.

## Routing

- `Tech Lead` -> Codex (analysis, spec, plan, review)
- `Coder` -> RooCode Code mode (implementation)
- `Researcher` -> Codex/RooCode Ask mode (discovery)
- `Reviewer` -> Codex or RooCode Debug mode

## Handoff Contract

1. Перед handoff передается ticket ID и AC.
2. Перед coding проверяются `memory_bank/*` и релевантные docs.
3. После coding обновляются task status + memory bank.
