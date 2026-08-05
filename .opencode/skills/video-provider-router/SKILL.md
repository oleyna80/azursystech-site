---
name: video-provider-router
description: Plan a selection of an approved video-generation provider and model using current terms, cost, capabilities, and project constraints.
user-invocable: true
argument-hint: "[generation requirements and budget]"
---

# Video Provider Router

> **Azursystech authority boundary.** Curated from `agentic-sdlc-framework@49850ff6fa0816bbe7feee2d54af2d792444bb5a` (MIT). **This Work Block is planning-only.** This skill never overrides `AGENTS.md` or the active Work Block and grants no Web, provider, paid-generation, configuration, or external-action authority. Any research, registry update, provider selection, or external execution requires a future Owner-approved Work Block.

Route by verified capability and risk, not fashion or demo attractiveness.

## Future registry requirement

A future execution Work Block must use an approved project registry with current official-source evidence. This Work Block creates no registry, provider entry, endpoint, account identifier, or resolver. See [`reference/provider-registry.template.yml`](reference/provider-registry.template.yml) for a non-operational schema.

## Evaluation dimensions

Evaluate mode, reference/first-last-frame support, duration/aspect, identity fidelity, camera/motion control, resolution, visible watermark, provenance, commercial terms, preview/beta status, IP protection, retention/training, geography, cost/latency, and API stability/rate limits.

## Cost control

Estimate cost per second or request, candidate count, upscaling/post-processing, expected retries, and separate desktop/mobile generations. Do not hide fallback cost inside a generic buffer.

## Risk policy

- Block unknown commercial terms and visible-watermarked production output.
- Allow invisible provenance marks but never remove or evade any provenance/watermark.
- Block preview/beta models for rights-sensitive final output unless explicitly approved.
- Prefer direct provider API terms for final client assets when an aggregator does not extend equivalent protection; aggregation is draft-only when the underlying terms/endpoint are recorded.

## Decision format

```yaml
requirements:
  mode:
  duration:
  aspect_ratio:
  fidelity:
  budget:
selected:
  provider:
  model:
  verified_at:
  reason:
  estimated_cost:
  visible_watermark:
  provenance_mark:
  commercial_use:
  preview_or_beta:
  rights_protection:
fallbacks:
  - provider:
    model:
    trigger:
rejected:
  - provider:
    model:
    reason:
```

Estimate per-request/second, candidate count, post-processing, retries, and separate formats. Re-verify official evidence after a freshness window, model/version, price/terms/watermark change, or rights-guarantee request. Return one selected route, one bounded fallback, and documented rejections only in a future approved decision.
