# Verification record — WB-2026-07-23 Immobilier Veo provider diagnostic

## Result

`ADVISORY: LIKELY_SCHEMA_MISMATCH; FORMAL READY: BLOCKED BY REQUIRED
os-isolated VERIFIER`

## Evidence examined

- Public Gemini v1beta discovery endpoint was retrieved on
  `2026-07-23T20:42:58Z` with one unauthenticated, header-free GET and no
  redirect following. No raw document was retained.
- The discovery document exposes `models.predictLongRunning` at
  `v1beta/{+model}:predictLongRunning`; its generic request envelope accepts
  `instances` and `parameters`.
- Current official Veo documentation lists
  `veo-3.1-fast-generate-preview`, one output per request, `16:9`, `720p`,
  and `durationSeconds` as the string values `"4"`, `"6"`, or `"8"`.
- The redacted prior field-shape record used a numeric `8` for
  `durationSeconds`; `aspectRatio: "16:9"`, `resolution: "720p"`, and
  `numberOfVideos: 1` align with the current documentation.

## Assessment

The numeric `durationSeconds` value is a `LIKELY_SCHEMA_MISMATCH` and the
strongest current explanation for the earlier HTTP 400. This is not a
confirmed root cause: the former raw request and error body were not retained,
and the current Preview contract may differ from the historical one.

The following remain `UNASSESSABLE`: historical provider/model state,
entitlement, quota, policy/safety handling, account status, request headers,
malformed request bytes, and billing state.

## Boundary and privacy checks

- PASS — this diagnostic sent no generation POST, retry, polling, download,
  upload, fallback, account, or billing request.
- PASS — no API key, prompt, account identifier, raw request/response,
  discovery JSON, header, or verbose transcript was retained.
- PASS — focused secret-pattern check found no credential in the approved
  records. `scripts/secret-scan.sh tracked` passed; its missing-file warnings
  refer to the pre-existing deleted hero-loop path outside this Work Block.
- PASS — the private package contains one redacted report only:
  `diagnostic.md`, SHA-256
  `641916f5cc680113c185f25c77c8fbd30caf6047389b249152ef8746ed472647`.
- PASS — no Immobilier source or public-media path was modified by this Work
  Block.
- BLOCKED — the required `os-isolated` verifier is unavailable in this
  same-session runtime. Same-session inspection is advisory only and cannot
  produce a formal provider-facing READY result.
- BLOCKED — native Scoped Coder and Verifier dispatch were both unavailable
  due to the runtime thread limit. Control Tower's constrained control-record
  fallback does not change the required isolation or delegation rule.

## Sources

- https://ai.google.dev/gemini-api/docs/veo
- https://ai.google.dev/api/models#method:-models.predictlongrunning

## Next authorization required

A corrected request is not authorized. It needs a separate Owner-approved
generation Work Block with a cost ceiling, current provider/terms evidence,
private evidence path, and os-isolated execution/verification arrangement.
