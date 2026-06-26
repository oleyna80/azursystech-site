Status: READY
Work Block: WB-2026-06-26-assurance-next-homepage-port
Verification Tier: standard
New Domain: false
Subagent Topology Status: PLANNED
Critic Verdict: APPROVE
Critic Report: docs/reports/wb-2026-06-26-assurance-next-homepage-port-critic.md
GPT Critic Status: NOT_REQUIRED
GPT Critic Reason: Supplement resolved; remaining inventory issue handled in plan/task; standard frontend homepage slice, no security/payment/database/deploy/dependency scope
GPT Critic Report: docs/reports/wb-2026-06-26-assurance-next-homepage-port-critic.md
GPT Critic Degraded Reason: —

# Critic Gate

> Control Tower updates this file after Stage 0 Preflight.
> The `critic-gate.sh` hook blocks Edit/Write until critic review,
> subagent topology, GPT critic decision, and write-set are resolved.

## Control Boundary

The gate controls the phase boundary for Claude Code, not the internal team
process. It must verify that the orchestrator resolved critic review,
subagent topology, GPT critic decision, and the approved write-set before
source edits begin.

## Gate Status

| Status | Meaning | Edit/Write |
|---|---|---|
| PENDING | Critic not yet launched | BLOCKED |
| READY | Critic completed, report in `docs/reports/` | ALLOWED |
| SKIPPED | Owner approval + orchestrator-log entry + no-skip domain check passed | ALLOWED |

## Subagent Topology Status

| Status | Meaning | Edit/Write |
|---|---|---|
| PENDING | Stage 0 did not classify topology yet | BLOCKED |
| SINGLE_AGENT | Work Block does not match Subagent-Required triggers | ALLOWED |
| PLANNED | Subagent dispatch plan recorded for this Work Block | ALLOWED |
| BLOCKED | Subagent dispatch unavailable; inline fallback recorded | ALLOWED |

## GPT Critic Status

| Status | Meaning | Edit/Write |
|---|---|---|
| PENDING | GPT critic trigger not resolved | BLOCKED |
| NOT_REQUIRED | Not Full tier, not first domain Work Block, and Claude critic did not return SUPPLEMENT/RECONSIDER | ALLOWED |
| READY | `gpt-critic` completed and findings were merged | ALLOWED |
| DEGRADED | Codex MCP unavailable; degraded reason recorded | ALLOWED |

## No-Skip Domain

No-Skip: false

## Triggers Active

Homepage-only Next port for Assurance showcase. Standard frontend verification. No package/config/dependency/database/deploy/payment scope.

Approved Write-Set:

- .agent/critic-gate.md
- docs/plans/WB-2026-06-26-assurance-next-homepage-port.md
- docs/plans/WB-2026-06-26-assurance-next-homepage-port-claude-coder-task.md
- showcase/app/demo/assurance/**
- showcase/components/assurance/**
- showcase/public/demo/assurance-site/**

## Skip Record (if SKIPPED)

critic: APPROVE after supplement handling — native Codex Critic dispatched twice; GPT critic NOT_REQUIRED for standard homepage slice after inventory supplement.
