---
name: video-generator
description: Define the approved-request execution contract for future video generation.
user-invocable: true
argument-hint: "[approved generation package]"
---

# Video Generator

> **Azursystech authority boundary.** Curated from `agentic-sdlc-framework@49850ff6fa0816bbe7feee2d54af2d792444bb5a` (MIT). **This Work Block is planning-only.** This skill never overrides `AGENTS.md` or the active Work Block and grants no provider, paid-generation, credential, upload/download, Bash, file-processing, or manifest-write authority. Any execution requires a future Owner-approved Work Block.

Future execution must perform the approved request exactly, without making creative or provider decisions.

## Preconditions for a future execution Work Block

Require approved brief, cleared/explicitly conditional rights report, selected provider/model with fresh registry entry, approved prompt package, bounded candidate count/cost, approved output workspace, and credentials only through approved environment/secret management. Stop if credentials appear in a tracked file.

## Future adapter contract

The provider adapter should support `validate-config`, `estimate`, `submit`, `status`, `download`, and `cancel`, accept a provider-neutral request, and normalize results. Provider-specific parameters belong in a request manifest rather than scattered application code.

## Future sequence and retry rules

Validate without printing secrets; estimate cost; persist a request record before submission; submit only approved candidates; persist request IDs; poll with bounded backoff; validate output type/size/duration/dimensions/decodeability; record actual cost; pass to quality review. Retry transient transport failures at most twice; do not resubmit a known request ID, bypass moderation/rights through another provider, or silently increase cost, duration, resolution, or candidate count.

The execution order is: validate local dependencies and credentials without values; estimate and compare to approved limit; create the request manifest; submit exactly approved candidates; persist IDs immediately; poll with bounded maximum wait; download only approved results to the approved raw-candidate area; verify type, non-zero size, duration, dimensions, and decodeability; update actual cost/result metadata; return control to QC. Use idempotency keys where supported.

## Manifest shape

```json
{
  "assetId": "",
  "provider": "",
  "model": "",
  "endpoint": "",
  "requestIds": [],
  "submittedAt": "",
  "completedAt": "",
  "promptFile": "",
  "inputFiles": [],
  "parameters": {},
  "estimatedCost": 0,
  "actualCost": 0,
  "outputs": [],
  "termsVerifiedAt": ""
}
```

Never log authorization headers, signed URLs, tokens, account IDs, or raw private responses; never upload unrelated files. Exit only when every future output is traceable to request, prompt, source set, provider/model, parameters, terms date, and cost.
