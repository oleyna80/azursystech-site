# Approval Workflow

All non-dry AI outputs are treated as drafts.

## Status lifecycle

1. `completed`
- Generated and no escalation keywords found

2. `pending_approval`
- Generated but requires human approval before publish/send

3. `escalated`
- High-risk signal found; operator review mandatory

4. `dry_run`
- Prompt assembled only, no API call

## Artifacts

For each run:
- JSON log: `05_ai/runs/<timestamp>-<agent>.json`
- Approval note (if needed): `05_ai/runs/<timestamp>-<agent>.approval.md`

## Approval checklist

- Facts match known offers and geography
- No unsupported promises or legal claims
- Tone is aligned with brand pack
- CTA is clear and realistic
- Language quality is acceptable (FR/EN as requested)
