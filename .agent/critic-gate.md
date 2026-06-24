Status: SKIPPED
Work Block: wb-claude-config-sync
Verification Tier: lite
New Domain: false
Subagent Topology Status: SINGLE_AGENT
Critic Verdict: APPROVE
Critic Report: —
GPT Critic Status: NOT_REQUIRED
GPT Critic Reason: Config sync — no code, no routes, no schema, no DB, no security impact
GPT Critic Report: —
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

Config sync from choushop: hooks, agents, skills, settings, .agent docs. No production code, no routes, no schema, no DB, no security, no API changes.

Approved Write-Set:

- .claude/**
- .agent/**
- memory_bank/**

## Skip Record (if SKIPPED)

critic: SKIPPED — Config sync from choushop: hooks, agents, skills, settings. Component-level config change, no DB/auth/payment/new-domain triggers.
