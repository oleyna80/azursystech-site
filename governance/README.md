# Governance Core

This directory contains the runtime-neutral control contract for the Agentic
SDLC Framework.

The governance core answers these questions independently of Codex, Claude Code,
OpenCode, Antigravity, or any future agent runtime:

- What outcome is approved?
- Which artifacts are authoritative?
- Which role may decide, write, review, verify, evaluate, or approve?
- Which side effects require a hard stop?
- What deterministic, output, and observable trajectory evidence is required?
- What happens when a capability, review, verification, or evaluation step is unavailable?
- When may a Work Block be declared successful?

## Normative Documents

| Document | Purpose |
|---|---|
| `authority.md` | Stable logical roles, authority boundaries, runtime/model/isolation separation |
| `lifecycle.md` | Runtime-neutral lifecycle functions, stage transitions, degraded paths |
| `artifacts.md` | Portable artifact chain, status, versioning, evidence, and SSOT rules |
| `evaluation.md` | Deterministic tests, output evaluation, observable trajectory assurance, judge limits, and verdicts |
| `runtime-capabilities.md` | Capability negotiation and topology selection |

## Boundary

Runtime-specific instructions, model names, plugins, hooks, MCP servers, CLI
commands, provider credentials, and transport mechanisms do not belong in this
directory. They belong under `runtimes/`, `integrations/`, user-level runtime
configuration, or project-local private configuration.

Evaluation governance defines observable evidence and verdict semantics. It does
not require or authorize access to private chain-of-thought, hidden reasoning,
model scratchpads, or internal deliberation.

## Core Principle

The SDLC manages the work. Agent runtimes execute the contracts.

A runtime may implement several logical roles in one process for low-risk work,
or distribute them across independent agents, sessions, worktrees, or machines
for higher assurance. The selected topology must preserve the authority,
artifact, evidence, evaluation, and closeout rules defined here.

## Migration Status

The runtime-neutral control plane, adapters, installation profiles, and bootstrap
restore hardening are implemented. WB-007 adds the evaluation assurance layer
without changing role authority or enabling external integrations.

See the accepted ADR:
`docs/architecture/decisions/2026-07-25-runtime-neutral-control-plane.md`.
