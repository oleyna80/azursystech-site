---
artifact_type: drift_report
work_block_id: WB-2026-09-11-control-plane-recovery-hardening-027
status: accepted
revision: terminal-publication-reconciliation-r2
verdict: ALIGNED
---

# Drift report — WB-027 corrective candidate

`ALIGNED`. The specification, active Work Block, frozen source identity,
implementation, tests, assurance, Process Feedback, and release-state
projections describe the same corrective revision.

- Root: `/tmp/azursystech-wb-control-plane-recovery-hardening-027-r1`
- Branch: `feat/control-plane-recovery-hardening-027-r1`
- Baseline: `3b4e04ad9f28d4715e4327f9d6a960bed23da3f7`
- Historical terminal candidate preserved: `3b4e04ad9f28d4715e4327f9d6a960bed23da3f7`
- Frozen identity: `content-sha256:090c6f2d3e46520c181366b088d85b4dec826d29b0fb43d1f2fadc34535539a2`
- Final Critic: `01a09701-65e4-7ac0-bcf0-d1116049e363`, `APPROVE`
- Reviewer: `01a09735-eef2-7c33-a90d-5a95ad0bbced`, `READY`
- Verifier: `01a09757-5aff-70d2-b832-43ad63353b02`, `READY`

The exact plan and tasklist paths are derived from the Work Block identity.
The terminal projection is required to use canonical inactive
`governance_profile: Controlled`; no broad plan/tasklist path allowance is
introduced. The `.gitignore` correction is limited to generated Python cache
under `.agent`, and `.codex/scripts/lifecycle.py` changes only literal `./`
write-set prefix handling so hidden source paths are hashed correctly.

No application, database, deployment, topology, recovery-lane, or normal
admission drift was found. Native separate-context evidence does not claim
OS-level isolation. The PF observations for hook JSON, terminal
plan/tasklist admission, inactive governance projection, and `.agent` ignore
precedence remain distinct and are recorded in the registry.
