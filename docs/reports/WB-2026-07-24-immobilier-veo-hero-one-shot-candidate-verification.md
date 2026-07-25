# Verification report — WB-2026-07-24-immobilier-veo-hero-one-shot-candidate

## Scope and isolation

Tier: full. Verifier: native read-only subagent. Actual isolation:
`same-session-degraded`; required isolation: `os-isolated`. Therefore this
report is advisory and cannot issue formal `READY`.

## Verified evidence

- Private outcome ledger records one generation POST, HTTP 200, one accepted
  operation, `completed_with_single_video`, and `retry=no`.
- Private request metadata records 16:9, 720p, numeric duration 8, and omitted
  `numberOfVideos`.
- The evidence package and all directories are mode 0700; its records and raw
  candidate are mode 0600. The raw candidate is quarantined with
  `release_state: pending`; a hash and size record exist.
- The scoped repository control records contain no key, header, signed URL,
  account/project, or operation identifier. `git diff --check` and
  `scripts/secret-scan.sh staged` passed.
- The outcome ledger records transform, QC acceptance, application copy,
  integration, release, and publication as prohibited.

## Unverified or blocked

- No provider, media playback, frame, duration, quality, rights-release, or
  live-runtime proof was performed by the Verifier.
- `npm audit --omit=dev --audit-level=high` is unavailable because the repository
  has no lockfile (`ENOLOCK`); this WB changed no Node application code.
- Ambient dirty `showcase/**` media/UI changes prevent repository-wide source or
  public-media attribution. They are excluded from this WB.
- Formal release readiness is BLOCKED: a separate `os-isolated` readonly
  verifier and a separately approved exact-candidate QC/release Work Block are
  required before any integration or publication.

## Verdict

Advisory evidence check: PASS. Formal verdict: BLOCKED by unmet verifier
isolation. The internal-only private candidate exists but is not approved for
production use.

