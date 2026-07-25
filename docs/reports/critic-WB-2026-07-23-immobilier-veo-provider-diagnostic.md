# Critic report — WB-2026-07-23 Immobilier Veo provider diagnostic

## Status

SUPPLEMENT — adopted.

## Adopted boundaries

- Use public Gemini API discovery metadata only; do not send any generation,
  polling, upload, or download request.
- Do not read, print, store, or transmit the Gemini API key, prompt, account
  identifiers, raw request, or raw provider response.
- Keep all diagnostic evidence redacted and private; no source or public-media
  change is authorized.
- Treat any inferred JSON-shape mismatch as a diagnosis, not authorization to
  retry. A corrected candidate requires a separate Owner approval.

## Critic findings

- The sole provider read is constrained to the unauthenticated, header-free
  public discovery GET; it must not follow redirects or retain raw/verbose
  output.
- The public discovery schema contains generic `instances` and `parameters`,
  so it cannot prove the prior `HTTP 400` cause. Current Veo documentation can
  support only a present-contract field-shape comparison.
- Private evidence is allowlisted to a source URL without query, retrieval
  time, HTTP status, schema pointers/types, derived comparison, and an
  optional digest. Raw discovery JSON, headers, prompt, key, account data,
  reconstructed request, and raw provider response remain prohibited.
- Every non-field cause (historical provider state, quota, entitlement,
  policy, malformed bytes, or prior response detail) remains `UNASSESSABLE`.
- The current gates were rebound from the previous paid-generation Work Block
  before the implementation/evidence stage. The earlier keyless discovery
  GET was read-only and did not generate a video, but its timing is recorded
  as an evidence limitation rather than treated as a gate-compliant run.

## Critic conclusion

The diagnostic may proceed only as a present-contract comparison. It cannot
authorize a retry or establish billing state. Required verifier isolation is
`os-isolated`; any same-session result is advisory only.

## Review questions

1. Does the evidence method establish the request contract without a paid or
   generative provider operation?
2. Are privacy and no-retry controls sufficient?
3. Is the planned verification appropriately limited by runtime isolation?
