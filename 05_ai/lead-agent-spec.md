# Lead Agent Spec

## Agent ID

`lead_router`

## Purpose

Classify inbound leads and draft a first response that is consistent with AzurSysTech tone and service scope.

## Inputs

Required payload fields:
- `lead_message`
- `source`
- `language`

Optional fields:
- `customer_name`
- `channel_metadata`
- `notes`

## Output Contract

The model output must contain:
1. lead_type (`particulier`, `tpe`, `unknown`)
2. intent (short label)
3. urgency (`low`, `medium`, `high`)
4. confidence (0-100)
5. escalation_required (`yes`, `no`)
6. draft_reply (ready-to-send message)
7. next_internal_action (one line)

## Runtime settings

- default model: `gpt-4.1-mini`
- temperature: `0.2`
- approval: required before sending
- escalation detection: keyword-based + operator review

## Command

```bash
./scripts/ai_agents.py run \
  --agent lead_router \
  --input-file 05_ai/examples/lead_router_input.json \
  --dry-run
```
