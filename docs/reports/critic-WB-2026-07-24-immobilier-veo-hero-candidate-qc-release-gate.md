# Critic report — WB-2026-07-24-immobilier-veo-hero-candidate-qc-release-gate

## Verdict

SUPPLEMENT — adopted before candidate inspection.

## Adopted conditions

1. Paid Service status and Google's non-ownership wording do not clear a
   Preview-route candidate for commercial/public release. The canonical policy
   classifies the direct Gemini Developer API Preview route as
   `NEEDS_PROVIDER_CONFIRMATION`; this WB cannot set `RELEASE_APPROVED`.
2. The only permitted results are `approved-for-private-QC`,
   `NEEDS_PROVIDER_CONFIRMATION`, or `BLOCKED`.
3. The raw candidate remains unchanged. Extracted frames/contact sheets are
   private QA-only artifacts, remain in the approved private subtrees, and
   retain their raw-hash relationship. No watermark/SynthID/provenance signal
   may be removed, hidden, cropped around, or transcoded away.
4. QC must cover hash continuity, bounded decode, codec/container, dimensions,
   duration, frame rate, audio, first/last-frame suitability, temporal
   continuity, geometry, pseudo-text/logos/people, watermark/SynthID,
   safety/misleading content, and brief conformance. Missing required proof or
   a blocking defect prevents a release-positive conclusion.
5. A native verifier is advisory. Any future release claim requires a frozen
   evidence set and a credential-free, provider-free `os-isolated` readonly
   verifier.

## Scope result

One Scoped Coder then one read-only advisory Verifier is the correct topology.
Ambient `showcase/**` changes remain excluded. No private asset, credential, or
provider state was inspected by the Critic; no file was changed.
