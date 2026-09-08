---
artifact_type: consistency_analysis
work_block_id: WB-2026-09-08-active-work-block-state-recovery
status: approved
revision: amendment-recovery-v2
---

# Consistency analysis

The specification, plan, tasklist, lifecycle producer, validator, and tests
share the same canonical inactive invariant. The observed stale `main` state is
handled only by the candidate contract; no direct `main` repair is included.

- **Verdict:** READY
- **Amendment consistency:** active assured publication and terminal inactive
  publication are separate predicates; terminal eligibility requires the
  immediate active parent and cannot be obtained from local inactive state.
- **Corrective consistency:** lifecycle and recovery both consume the repository
  default template; only recovery may repair missing/corrupt state, while all
  ordinary hook admission remains fail-closed.
