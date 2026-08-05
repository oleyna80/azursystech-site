---
name: media-production-orchestrator
description: Plan a controlled end-to-end AI media-production pipeline for websites and digital products.
user-invocable: true
argument-hint: "[page, asset, campaign, or media objective]"
---

# Media Production Orchestrator

> **Azursystech authority boundary.** Curated from `agentic-sdlc-framework@49850ff6fa0816bbe7feee2d54af2d792444bb5a` (MIT). **This Work Block is planning-only.** This skill never overrides `AGENTS.md` or the active Work Block and grants no Write, Bash, Agent, provider, paid-generation, file-processing, integration, or publication authority. Any workspace creation, manifest persistence, provider/external action, or asset integration requires a future Owner-approved Work Block.

Plan a controlled pipeline instead of jumping directly to generation.

## Authority model

- The orchestrator owns planning routing, stage transitions, scope, budget, and evidence.
- Only a future, separately authorized `video-generator` execution may initiate a paid request.
- `media-rights-compliance` may block generation or publication; `video-quality-control` may reject an output but must not silently regenerate it.
- Human approval is required before a generated asset is published to a client-facing production environment.

## Planning pipeline

1. `media-art-director`: choose generated video, conventional editing, Rive/Lottie, CSS/GSAP, or static media.
2. `video-creative-brief`: define placement, objective, source assets, formats, duration, safe zones, intensity, budget, and ownership status.
3. `media-rights-compliance`: identify rights/consent/terms evidence and block status.
4. `short-video-scriptwriter`, `storyboard-director`, and `cinematography-director`: develop timing, composition, continuity, and shots.
5. `video-prompt-engineer` and `video-provider-router`: create a provider-neutral prompt and a future route decision with bounded cost/fallback.
6. Future approved execution only: `video-generator`, `video-quality-control`, `video-postproduction`, and `web-video-integration`.

## Governance gates

- Rights may block generation or publication; quality control may reject an output without silently regenerating it.
- Before any future paid call, require approved purpose, provider/model, candidate count, cost, source rights, commercial terms, watermark policy, and human approval before publication.
- Rejected output returns to the smallest responsible planning stage; do not automatically restart the pipeline or spend on an unapproved fallback.
- Never expose, print, commit, or copy credentials into project files.

## Budget gate for a future paid call

```yaml
generation_gate:
  purpose: approved
  provider: approved
  model: approved
  candidate_count: approved
  estimated_cost: within_budget
  source_rights: cleared
  commercial_terms: verified
  visible_watermark: forbidden_for_production
  human_approval_before_publish: required
```

If any field is unknown, do not generate.

## Retry policy

- A future execution may retry transport/provider errors at most twice with bounded backoff.
- Technical retries with no billable output do not become creative iterations.
- Do not automatically regenerate an aesthetically weak result: return QC evidence and revise the responsible brief, shot, or prompt.
- Never use an expensive fallback without updating the approved cost estimate.

## Planning artifacts

Use the following as a conceptual separation only; this Work Block creates none of them: `brief`, `rights-check`, `script`, `storyboard`, `prompt`, `provider-decision`, `generation-manifest`, `candidates`, `review`, `delivery`, and `closeout`.

## Reference

Read [`reference/production-contract.md`](reference/production-contract.md) when defining a future approved production profile. It is a non-operational template, not a runtime resolver or permission grant.
