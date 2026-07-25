# Verification report — WB-2026-07-24-immobilier-veo-hero-candidate-qc-release-gate

## Scope and isolation

- Tier: Full.
- Verifier: native subagent, read-only.
- Required isolation: `os-isolated`.
- Actual isolation: `same-session-degraded`.
- The verifier inspected only repository control records and private
  QA/rights/release evidence. It made no provider call, media transform,
  publication, integration, deploy, staging, commit, or push.

## Advisory results

| Check | Result | Evidence summary |
| --- | --- | --- |
| Raw-candidate integrity | PASS | Private QA record attests pre/post hash continuity and quarantine relation. |
| Technical QC | PASS | Container/codec, aspect, duration, frame rate, audio, and clean decode are recorded. |
| Visual QC | PASS (advisory) | Sampled interior-to-terrace-to-sea traversal and continuity checks found zero recorded visual blockers. |
| Watermark / SynthID | PARTIAL | No overt visible watermark was recorded; embedded SynthID is explicitly `not assessable` without a supported detector. |
| Input-rights evidence | PASS | Private records state text-only input and no supplied assets, people, private data, or requested brands. |
| Release boundary | PASS | Private records retain `NEEDS_PROVIDER_CONFIRMATION` and explicitly reject `RELEASE_APPROVED`. |
| Sensitive-data hygiene | PASS | No common secret signature was found in reviewed private records or the repository diff; the verifier report is sanitized. |
| Work-Block-only repository attribution | UNVERIFIED | Ambient dirty Immobilier public-media/UI paths preclude repository-wide attribution; no private package content is Git-tracked. |

## Formal verdict

**BLOCKED.** This is not a production/release approval.

The native verifier is below the required isolation level, and the canonical
policy classifies the direct Gemini Developer API Preview route as
`NEEDS_PROVIDER_CONFIRMATION`. Paid billing and a non-ownership statement do
not provide exclusivity, copyrightability, indemnity, third-party clearance, or
an automatic public-release right.

No site integration, publication, deploy, staging, commit, or push occurred.

## Required future gate

Before any release-positive claim or public use: freeze the exact private
evidence set, obtain documented provider confirmation for the route, and run a
credential-free, provider-free, readonly `os-isolated` verifier. Re-check the
candidate and any proposed final derivative; do not remove, hide, crop around,
or transcode away provenance or watermark signals.
