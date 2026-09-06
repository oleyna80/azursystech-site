---
name: video-generator
description: Define a bounded, approved-request transaction contract for future video generation.
user-invocable: true
argument-hint: "[approved generation package]"
---

# Video Generator

> **Azursystech authority boundary.** This skill defines a transaction contract only. It never overrides `AGENTS.md` or the active Work Block and grants no provider, paid-generation, credential, upload/download, Bash, file-processing, or publication authority. Any execution requires a separate Owner-approved Work Block.

Future execution must perform exactly one approved request, without making
creative, provider, cost, retry, or publication decisions.

## Preconditions for a future execution Work Block

Require an approved brief, cleared or explicitly conditional rights report,
selected provider/model with fresh registry evidence, approved prompt package,
exactly one approved candidate transaction, approved budget boundary, approved
output workspace, and credentials only through approved environment/secret
management. Stop if credentials appear in a tracked file.

## Responsibility boundaries

`video-provider-router` owns provider/model selection, capability, cost, and
terms evidence. `video-quality-control` owns technical and visual candidate
review. `media-rights-compliance` and the Owner own rights and
commercial/publication authorization. This skill records the approved
transaction boundary and handoff; it does not duplicate or assume those
responsibilities.

## Single transaction and retry rules

Validate without printing secrets; estimate against the approved boundary;
persist a request record before submission; submit exactly one approved
transaction; persist a returned request ID; use only the bounded retrieval path
below; validate output technical metadata; record actual cost only when
available; then hand off to QC.

A submission retry is never automatic. No resubmission is permitted after
`accepted-with-id`, `accepted-without-id`, `timeout`, or `transport-failure`,
and no fallback provider, creative retry, changed duration/resolution, or
increased cost/candidate count is permitted without fresh Owner authorization
or a successor WB.

Safe/read-only status retrieval is distinct from a billable submission. Before
submission, the execution WB must record a finite maximum attempt count,
retrieval deadline/window, provider capability required for lookup, and stopping
condition. Retrieval is allowed only for `accepted-with-id`, where provider and
request identity make it safe. Stop when the bound or deadline is reached; never
poll unboundedly.

## Transaction state machine

Use exactly these states:

- `not-submitted`: no request was sent.
- `rejected`: provider or approval rejected the request; terminal.
- `accepted-with-id`: provider acknowledged and returned a request ID; the only
  non-terminal state eligible for bounded status retrieval.
- `accepted-without-id`: acknowledgement is ambiguous; terminal for submission.
- `completed-traceable-output`: output and returned request identity are
  traceable; terminal and handed to QC.
- `output-present-provenance-unconfirmed`: output exists but origin cannot be
  proved; terminal and quarantined.
- `timeout`: bounded retrieval for an `accepted-with-id` transaction reached its
  approved deadline/bound; terminal and never resubmitted.
- `transport-failure`: acknowledgement is unknown after transport failure;
  terminal for submission and never resubmitted.

Permitted transitions are:

```text
not-submitted -> rejected | accepted-with-id | accepted-without-id | transport-failure
accepted-with-id -> completed-traceable-output | output-present-provenance-unconfirmed | timeout | transport-failure
accepted-without-id -> output-present-provenance-unconfirmed  # only if output already exists
transport-failure -> output-present-provenance-unconfirmed    # only if output already exists
```

All other states are terminal. `accepted-without-id`, `timeout`, and
`transport-failure` never authorize status retrieval or resubmission.

## Transaction record

Create the declarative record from
[`reference/provider-transaction-record.template.yml`](reference/provider-transaction-record.template.yml)
before any future submission. Keep references opaque and minimal. Record the
provider request ID only when actually returned, and local checksum/technical
metadata only after an approved local output exists.

The record must never contain tokens, authorization headers, cookies, signed
URLs, account/session IDs, raw provider responses, raw request bodies, source
media, data URIs, prompt text, source paths, source checksums, or secret-bearing
environment values.

## Provenance and handoff

Technical success is not proof of origin. If an output cannot be tied reliably
to the recorded transaction, set provenance to `unconfirmed` and require
quarantine; it is not publication-ready. The handoff keeps three independent
decisions visible:

1. technical validity;
2. provenance confidence;
3. commercial/publication authorization.

QC may reject a candidate but must not silently regenerate it. This skill does
not authorize provider calls, credential use, generation, downloads, uploads,
integration, publication, or deployment.

## Historical boundary

The historical `showcase/scripts/generate_hero_veo.py` is reference-only. Do not
copy, cherry-pick, modernize, or use it as an implementation baseline. This
current-main contract adapts transaction-safety semantics only.
