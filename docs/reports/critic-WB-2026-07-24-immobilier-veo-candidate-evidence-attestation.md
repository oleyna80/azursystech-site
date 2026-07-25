# Critic supplement — WB-2026-07-24 candidate evidence attestation

## Verdict

`SUPPLEMENT` — adopted by Control Tower before implementation.

## Scope boundary

The existing os-isolated lane proves only a bounded process. This Work Block may extend it solely with a compile-time fixed, text-only candidate manifest. It must not take caller-provided identifiers, roots, paths, or environment overrides and must not access raw media or raw provider evidence.

## Approved Write-Set

- `.agent/critic-gate.md`
- `.agent/verification-gate.md`
- `.codex/write-gate.md`
- `docs/tasklist/WB-2026-07-24-immobilier-veo-candidate-evidence-attestation.tasklist.md`
- `docs/reports/critic-WB-2026-07-24-immobilier-veo-candidate-evidence-attestation.md`
- `docs/reports/WB-2026-07-24-immobilier-veo-candidate-evidence-attestation-verification.md`
- `docs/templates/os-isolated-verifier-runbook.md`
- `scripts/run-os-isolated-verifier.sh`
- `scripts/tests/os-isolated-verifier-fixtures.sh`
- `memory_bank/context.md`
- `memory_bank/orchestrator-log.md`
- `memory_bank/progress.md`
- `memory_bank/review-log.md`

## Required controls

1. Permit only the existing no-argument mode or a single literal candidate-evidence flag.
2. Use a fixed candidate identifier and an explicit fixed regular-file allowlist.
3. Reject traversal, symbolic links, hard links, oversized records, and secret-like material before snapshotting.
4. Keep snapshots root-owned and run only fixed system utilities as the nologin verifier under an empty environment.
5. Emit only a bounded aggregate attestation; do not disclose evidence contents, source paths, media names, provider operation references, or secrets.
6. Add fixtures for normal-mode continuity and each relevant candidate-mode rejection boundary.

## Non-claims

Even a successful isolated run does not prove media bytes, visual quality, SynthID, billing validity, ownership, exclusivity, third-party clearance, legal or provider eligibility, or release approval. It therefore cannot change the candidate status or authorize publication.
