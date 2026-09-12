---
artifact_type: process_feedback_observation
work_block_id: WB-2026-09-11-control-plane-recovery-hardening-027
observation_id: PF-2026-09-12-terminal-inactive-governance-projection-mismatch
date: "2026-09-12"
category: CONTRACT_MISMATCH
status: TRIAGED
authority: advisory_only
avoidable_friction: true
---

# Process Feedback — terminal inactive governance projection mismatch

## Observation

After canonical success closeout, `.agent/active-work-block.json` correctly
returned to the inactive `Controlled` governance profile, but the terminal
`PROJECT_MAP.md` release-state projection retained `governance_profile:
Assured`. The resulting projection disagreed with the canonical inactive
state.

## Evidence and cause

- Work Block: `WB-2026-09-11-control-plane-recovery-hardening-027`.
- Reproduction: `python3 scripts/test-release-state-contracts.py` failed with
  `PROJECT_MAP governance_profile does not match active Work Block:
  projected='Assured', active='Controlled'` during terminal closeout
  validation.
- The canonical inactive template and lifecycle state require `Controlled`;
  the terminal projection writer/closeout artifact had not reconciled that
  field.
- Confirmed root cause: repository-local terminal release-state projection
  contract mismatch, separate from the plan/tasklist path mismatch and the
  external plugin JSON mismatch.

## Impact and follow-up

The terminal child could not satisfy release-state contract validation even
though the inactive gate itself was canonical. This was avoidable friction and
blocked publication. The terminal projection must set
`release_state.governance_profile: Controlled` and retain the regression; no
validator weakening or hard-stop bypass is permitted.
