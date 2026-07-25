# Critic report — WB-2026-07-24 AI-video isolated evidence and verifier lane

## Verdict

**SUPPLEMENT — adopted.** This is an interim `review-degraded:inline-fallback`
because new native Reviewer/Critic allocation reached `thread-limit`. The
fallback does not close verification and requires a read-only verifier after
implementation.

## Scope reviewed

The reusable private-evidence helper, separate-account deterministic integrity
attestation scripts, documentation, templates, and test fixtures named in the
approved write-set. No provider, media, credential, release, or application
operation is reviewed or authorized.

## Required corrections and constraints

1. The evidence helper must use one fixed private root rather than accepting a
   caller-controlled destination. It may accept only small redacted records from
   `/tmp`, permitted categories and safe filenames; it must reject symlinks,
   traversal, raw media extensions, overwrites, and output of record contents.
2. A paid API call or an evidence package cannot prove ownership, exclusivity,
   copyrightability, indemnity, third-party clearance, or release approval.
   All policy wording must retain the documented responsible-human release
   decision and explicit Preview final-output exception.
3. `os-isolated` must be literal: a distinct nologin system user, root-owned
   clean home, empty environment, source snapshot frozen before the user runs,
   and no Codex/provider/network/repository-code invocation. The runner is a
   bounded integrity attestation, not an AI/legal verifier.
4. Root provisioning must be opt-in (`--apply`) and idempotent; its normal
   `--check` path must not change host state. It must neither read nor copy
   credentials, `.env` files, raw assets, or user home configuration.
5. The runner must copy only explicit safe relative paths from the repository,
   reject symlinks and forbidden paths, make the snapshot root-owned/read-only,
   and return `BLOCKED` rather than falling back to same-user verification.
6. Fixture tests must never require root by default. They must prove the
   helper's negative cases and label an unavailable privileged host test as
   `SKIP|root-required`, never `PASS`.

## Decision

Adopt all six constraints. The approved write-set remains verbatim the list in
the active critic gate. Formal `READY` remains unavailable until the
deterministic attestation has actually run under the isolated account and a
full verifier records its bounded outcome.
