# Critic report — WB-2026-07-24 Immobilier Veo canonical evidence manifest

## Verdict

**RECONSIDER — blocked pending explicit Owner scope amendment.** No implementation
is authorized yet.

## Confirmed

- A dedicated no-argument materializer for five compile-time text records is
  the correct boundary; it must not access media, prompts, provider material,
  credentials, billing, or release data.
- The Work Block is correctly classified `Subagent-Required`; exactly one
  Scoped Coder remains required after approval.
- The five records and an isolated verification are separate from provenance,
  rights, provider eligibility, quality, and release authority.

## Must address before Stage 1

1. Authorize a bounded root-owned frozen-copy mechanism. Root must not execute
   a mutable workspace script. The Owner command must create fixed root-only
   temporary copies, compare their SHA-256 values with the frozen reviewed
   sources, execute only the copies, and state the fixed location and cleanup
   behaviour.
2. Add `scripts/run-os-isolated-verifier.sh` and
   `scripts/tests/os-isolated-verifier-fixtures.sh` to the Scoped Coder
   write-set. The runner currently checks required records but cannot prove
   that the package has only the canonical five entries.
3. Require a root-owned staging directory, atomic no-clobber publication of the
   candidate directory, rejection of a pre-existing or partial target, full
   ancestor checks, and exact-tree rejection of extra entries.
4. Synchronize all active gates only after the Owner adopts this amended scope.

## Approved write-set after Owner amendment

- `scripts/materialize-candidate-evidence.sh`
- `scripts/tests/materialize-candidate-evidence-fixtures.sh`
- `scripts/run-os-isolated-verifier.sh`
- `scripts/tests/os-isolated-verifier-fixtures.sh`

The Scoped Coder may change only these four paths.

## Control Tower write-set after Owner amendments

- `.agent/critic-gate.md`
- `.agent/verification-gate.md`
- `.codex/write-gate.md`
- `docs/tasklist/WB-2026-07-24-immobilier-veo-canonical-evidence-manifest.tasklist.md`
- `docs/reports/critic-WB-2026-07-24-immobilier-veo-canonical-evidence-manifest.md`
- `docs/reports/WB-2026-07-24-immobilier-veo-canonical-evidence-manifest-verification.md`
- `docs/templates/os-isolated-verifier-runbook.md`
- `memory_bank/orchestrator-log.md`
- `memory_bank/context.md`
- `memory_bank/progress.md`
- `memory_bank/review-log.md`

Control Tower owns only these gate, tasklist, report, runbook, and memory-bank
paths. The Owner additionally approved the fixed root-only ancestor creation
and removal of the incompatible generic process step; neither change expands
the Scoped Coder write-set.

## Required acceptance checks

- Arguments, existing target, partial target, unsafe ancestor, symlink,
  hardlink, extra entry, NUL/binary record, and schema drift fail closed.
- Success creates exactly five directories and five records under the fixed
  candidate identifier, with root:root `0700` directories and `0600` records.
- Fixtures exercise materialization and the OS-isolated candidate checker
  together, without root storage or private evidence.
- The Owner evidence records source/copy SHA-256 values and only aggregate
  command output; it never records media, prompts, credentials, or record
  contents.

## Non-claims

Even a PASS proves neither media provenance nor rights, billing, provider
eligibility, visual quality, SynthID, public release, or application
integration.
