# Content Engine Spec

## Agent ID

`content_writer`

## Purpose

Generate website/social draft copy in the AzurSysTech brand voice using strategy documents as context.

## Inputs

Required payload fields:
- `task`
- `asset_type`
- `language`

Recommended optional fields:
- `audience`
- `length_target`
- `channel`
- `constraints`
- `source_points`

## Output Contract

The model output should provide:
- title
- main copy
- CTA
- optional variants (only when asked)

## Runtime settings

- default model: `gpt-4.1-mini`
- temperature: `0.4`
- approval: required before publish
- escalation detection: policy-sensitive keyword checks

## Command

```bash
./scripts/ai_agents.py run \
  --agent content_writer \
  --input-file 05_ai/examples/content_writer_input.json \
  --dry-run
```
