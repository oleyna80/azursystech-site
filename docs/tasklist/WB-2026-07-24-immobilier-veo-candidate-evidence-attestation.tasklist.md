# WB-2026-07-24 — Immobilier Veo candidate evidence attestation

## Objective

Extend the existing os-isolated verifier runner with one fixed candidate-evidence mode that attests a bounded, text-only evidence manifest without accessing media or private provider material.

## Stage 0 preflight

- Work Block type: bounded candidate-evidence attestation extension.
- Side-effect class: local documentation/workflow and local test only.
- DB action mode: none.
- Hard Stops: no provider request, credential/configuration change, raw-media access or transformation, publication, app integration, deploy, client communication, destructive operation, staging, commit, or push.
- Skills Routing: checked=current-work-block-gates,media-production-orchestrator,video-provider-router,media-rights-compliance,security-pass,memory-ops,git-safety,creative-and-frontend-skills,video-generator; matched=media-production-orchestrator,video-provider-router,media-rights-compliance,security-pass,memory-ops; used=media-production-orchestrator,video-provider-router,media-rights-compliance,security-pass,memory-ops; skipped=git-safety(not relevant after inspection: no staging, commit, or push),creative-and-frontend-skills(not relevant after inspection: no design or app change),video-generator(not relevant after inspection: no provider call or generation).
- Subagent topology: Subagent-Required because the Work Block spans security, local host isolation, private evidence, documentation, and independent verification. One Scoped Coder owns the three implementation paths; Reviewer/Critic and Verifier are read-only.
- Write gate: READY.

## Approved write-set

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

## Acceptance criteria

1. The runner accepts only its existing no-argument process mode or one literal candidate-evidence mode; caller-controlled package/root/path/environment selection is impossible.
2. Candidate mode reads only its compile-time fixed list of bounded regular text evidence records; it rejects traversal, symbolic links, hard links, oversized records, and secret-like material.
3. Candidate mode never accesses, copies, hashes, names, or emits raw media, frames, contact sheets, prompt text, provider operation references, or raw provider terms.
4. Snapshots remain root-owned; the nologin verifier runs fixed system utilities with an empty environment and no network, Codex, or repository-code execution.
5. Fixtures prove the normal runner mode remains usable and candidate-mode boundaries reject unsafe inputs.
6. The runbook states exactly what the attestation proves and does not prove.
7. A separate read-only Verifier reviews the frozen diff. Formal closure additionally needs a fresh Owner root-terminal candidate-mode PASS.

## Status

- [x] Plan and critic supplement adopted.
- [x] Scoped Coder implementation — complete after two verifier-led corrective passes; only the approved three implementation paths changed.
- [x] Read-only verification — code-level boundary, syntax, and fixture evidence passed after the final byte-exact schema recheck.
- [ ] Owner isolated candidate-mode execution.
- [ ] Formal closeout.

## Status ceiling

This Work Block cannot change the candidate to `CONDITIONALLY_PERMISSIBLE` or `RELEASE_APPROVED`. Until a separately documented human decision and final-file release gate, the candidate remains `NEEDS_PROVIDER_CONFIRMATION` and release remains blocked.

## Current blocker

The sole remaining gate is an Owner-run, post-freeze os-isolated attestation using the exact command in `docs/templates/os-isolated-verifier-runbook.md`. Its bounded `PASS` proves only fixed text-record integrity linkage. It cannot establish media bytes, visual quality, SynthID, billing validity, ownership, third-party clearance, legal/provider eligibility, or release approval.
