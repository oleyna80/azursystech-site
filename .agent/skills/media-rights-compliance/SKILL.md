---
name: media-rights-compliance
description: Plan rights, consent, licensing, watermark, provenance, and provider-terms checks for AI media.
user-invocable: true
argument-hint: "[brief, source assets, and selected provider]"
---

# Media Rights Compliance

> **Azursystech authority boundary.** Curated from `agentic-sdlc-framework@49850ff6fa0816bbe7feee2d54af2d792444bb5a` (MIT). This skill is advisory planning guidance only. It never overrides `AGENTS.md` or the active Work Block, grants no Web/tool authority, and is not legal advice.

Provide an operational risk gate, not legal certainty. Escalate material uncertainty instead of inventing permission.

## Planned pre-generation checks

Record ownership/license for source media, intended-use fit, identifiable-person consent, minors/sensitive context, protected characters/logos/living-artist imitation, model commercial terms, endpoint status, visible watermark, provenance mark, input retention/training, and any advertised IP protection for the exact service/account tier.

## Blocking conditions

Return `blocked` for unknown source rights, missing consent, watermark removal/hiding, unknown terms for exact model/endpoint, unsupported exclusivity, misleading impersonation or endorsement, or a rights-sensitive final asset on a disallowed preview/beta route.

## Planned publication checks

Confirm that only the approved candidate is delivered; rejected or source assets are not published accidentally; attribution is included when required; the generation manifest and terms-verification date are retained; the page does not represent a synthetic scene as documentary evidence; and a human approved the exact final output.

## Report format

```yaml
status: cleared | conditional | blocked
asset_rights:
  owner:
  evidence:
  restrictions: []
people_and_consent:
  identifiable_people:
  consent_evidence:
provider_terms:
  provider:
  model:
  endpoint:
  verified_at:
  commercial_use:
  output_rights:
  visible_watermark:
  provenance_mark:
  preview_or_beta:
  ip_protection:
  exclusions: []
publication_conditions: []
blocking_issues: []
reviewer_note:
```

Use official terms as primary evidence in a separately approved research/execution Work Block. Distinguish output ownership from third-party claims, commercial permission from indemnity, and direct providers from aggregators. Never promise universal copyrightability or recommend stripping provenance.

## Exit criteria

The report makes remaining risk visible to the Owner and returns a clear `cleared`, `conditional`, or `blocked` result.
