# Critic report — corrected Immobilier Veo hero candidate

## Verdict

`SUPPLEMENT` — adopted with an execution block.

## Evidence reviewed

- The prior one-shot attempt and diagnostic conclusion: numeric
  `durationSeconds` is a likely current-schema mismatch, not a proven cause.
- Google’s current Veo documentation: Fast Preview supports one video with
  audio, and the duration field accepts string values including `"8"`.
- Google’s current pricing: Fast 720p is USD 0.10 per second, so the approved
  one 8-second candidate is within the USD 0.80 ceiling.
- Google’s current terms: Gemini API is a Paid Service only through a Cloud
  Project associated with an active billing account.

## Required controls

1. Do not submit before non-secret Owner confirmation of active Cloud Billing
   for the key’s Cloud Project.
2. If unblocked, submit exactly one request with `durationSeconds: "8"`; do
   not retry, use a fallback, or create a second candidate.
3. Keep prompt, API key, headers, signed URL, account/project identifiers, raw
   provider envelopes, and media outside Git in the named private package.
4. Maintain release state `pending`; no integration, publication, or silent
   derivative is included in this Work Block.
5. Formal release-readiness verification still requires `os-isolated` runtime.

## Native topology limitation

The required Coder/Verifier dispatch is blocked by `thread-limit`. The
resulting Control Tower fallback is limited to these control records and cannot
perform the paid external-provider action.
