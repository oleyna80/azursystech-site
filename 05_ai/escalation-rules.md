# Escalation Rules

Escalation is mandatory when any of the following is true:

1. Legal risk indicators in user input or model output
- examples: legal threat, lawsuit, complaint escalation

2. Security incident indicators
- examples: ransomware, breach, data loss

3. High emotional or reputational risk
- examples: angry customer, refund dispute, public accusation

4. Content compliance risk
- examples: fake review request, invented guarantees, unsupported claims

## Runtime implementation

- First-pass detection uses keyword matching from `05_ai/agents/registry.json`.
- Any keyword hit marks run status as `escalated`.
- Human operator reviews and decides final action.

## Operator action levels

- `L1` Review and edit copy
- `L2` Direct callback to lead/customer
- `L3` Founder/owner escalation for legal or major incident
