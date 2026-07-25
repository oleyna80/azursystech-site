# Private AI-video evidence package

This directory contains a repository-safe skeleton for a private package for
one AI-video asset. Create the real package only in access-controlled private
storage outside Git and outside this repository.

The package supports an auditable internal authorization and traceability
chain: it links the approved request, provider operation, output, review, and
release decision. It is not proof of every external fact and does not create
provider access, generation authority, output rights, exclusivity, or legal
clearance.

## Safe structure

Use one private directory per video. Keep its manifest as the index and use
opaque or redacted references for evidence held elsewhere in the same approved
private storage:

```text
private-evidence-store/
  asset-opaque-id/
    manifest.yml
    authorization/
    provider-evidence/
    rights-and-consent/
    provenance-and-qa/
    transformations/
    release-and-revocation/
```

The real package may contain private evidence, media, and source or consent
documents only in that access-controlled storage. Do not copy the real package
or its contents into Git.

## Checklist

- Record an opaque asset/package identifier, private-storage status, and the
  authorized intended purpose.
- Link authorization and request evidence; record the exact provider, route,
  service, model, billing context, and model status.
- Capture current terms/model evidence by URL, retrieval date, and content
  hash; decide `BLOCKED`, `NEEDS_PROVIDER_CONFIRMATION`, or
  `CONDITIONALLY_PERMISSIBLE`.
- For `Preview`, capture status/date evidence, monitoring owner, revalidation
  triggers, and migration or fallback decision. `Preview` neither grants nor
  removes commercial/public eligibility on its own.
- Link opaque prompt, parameters, and provider-operation records; do not copy
  their raw contents into the manifest.
- Link input-rights and consent evidence, record original and release hashes,
  and preserve the transformation/QC chain.
- Record provenance/SynthID result where available, human approval of the
  exact candidate, release state, revocation control, evidence index, and
  retention/access rule.

## Repository exclusion

The committed template and its manifest contain references, hashes, redacted
values, and opaque identifiers only. Never put credentials, authentication
headers, signed links, account or project identifiers, raw provider payloads,
raw prompts, personal data, consent records, source/generated media,
thumbnails, contact sheets, or media bytes in Git.

Copying this skeleton does not authorize provider use, storage access,
generation, or publication. Follow the canonical
[AI Video Production Operating Instruction](../../engineering-memory/ai-video-production-operating-instruction.md)
and the approved execution Work Block for every real action.

## Controlled record intake

Where an approved local Work Block needs a redacted record, use
`scripts/ai-video-private-evidence.sh` rather than copying arbitrary evidence
into a package. Its fixed production root outside Git requires root and accepts
no runtime root override; fixtures use a copied helper with a substituted
compiled default under `/tmp`. It accepts only small direct `/tmp/*.record`
inputs with approved package IDs and categories, and does not print contents.
It rejects links, traversal, raw-media-like names, sensitive markers, and
overwrites. This is an integrity/traceability aid only; it does not establish
rights, legal clearance, provider permission, or release approval.
