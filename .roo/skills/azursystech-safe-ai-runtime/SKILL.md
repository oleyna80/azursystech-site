---
name: azursystech-safe-ai-runtime
description: Use when changing AI runtime, prompts, deploy env, or chat intake behavior for AzurSysTech. This skill enforces the accepted launch-safe AI policy: limited_live_intake only, intake+summary+handoff only, no autonomous outbound sending, no pricing commitments, no scheduling promises, and human approval before risky/public actions.
---

# AzurSysTech Safe AI Runtime

Use this skill when touching:
- `scripts/ai_agents.py`
- `05_ai/*`
- `.env.vps.example`
- deploy docs or runtime env flags
- chat intake UX that interacts with AI logic

## Canonical runtime policy

- `AI_LAUNCH_MODE=limited_live_intake`
- `AI_ALLOW_AUTONOMOUS_OUTBOUND=false`
- `AI_ALLOW_PRICING_COMMITMENTS=false`
- `AI_ALLOW_SCHEDULING_PROMISES=false`

## Hard constraints

- Only `intake + summary + handoff` is allowed in launch mode.
- No autonomous outbound sending.
- No pricing commitments.
- No scheduling promises.
- Approval/escalation boundaries must stay intact.
- Any public or client-visible risky action remains human-approved.

## Required references

1. `memory_bank/decisions.md`
2. `05_ai/lead-agent-spec.md`
3. `05_ai/approval-workflow.md`
4. `05_ai/escalation-rules.md`
5. `05_ai/README.md`

## Validation minimum

- `python3 -m py_compile scripts/ai_agents.py`
- relevant dry-run command for changed agent
- confirm env flags still enforce safe launch mode

## Review questions

- Does runtime still fail on unsafe launch config?
- Do prompts still mention launch-safe boundaries?
- Do env docs still match actual enforcement?
- Was any autonomous behavior introduced by accident?

