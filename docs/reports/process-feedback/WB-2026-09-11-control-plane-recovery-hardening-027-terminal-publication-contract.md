---
artifact_type: process_feedback_observation
work_block_id: WB-2026-09-11-control-plane-recovery-hardening-027
observation_id: PF-2026-09-12-terminal-plan-tasklist-publication-mismatch
date: "2026-09-12"
category: CONTRACT_MISMATCH
status: TRIAGED
authority: advisory_only
---

# Process Feedback — terminal plan/tasklist publication mismatch

## Observation

The terminal publication guard admitted only its static coordination paths and
did not admit the lifecycle-required exact Work Block plan and tasklist. The
assured historical terminal candidate `6e6e3252fc4bbb3c3b23fdcbb81b6e0e069256e6`
therefore failed the local terminal publication predicate even though its
parent/child state, assurance, branch, and commit-trailer predicates passed.
The historical child changed the bound plan but did not yet contain the
tasklist projection, exposing the contract gap rather than authorizing a
generic path allowlist.

## Evidence and scope

- Affected phase: Stage 3 Close / terminal publication.
- Fresh Critic execution/context: `01a0965a-820a-7f72-9026-908b502de0e8`.
- Exact static policy surface: `.agent/hooks/hard_stop_policy.py`.
- Reproduction: `terminal_closeout_push_allowed(...)` was false solely because
  the terminal diff was not admitted by the static path set.
- Corrective regression now proves exact bound plan + tasklist allow and denies
  unrelated, extra, arbitrary, malformed, mismatched, and incomplete variants.

## Cause, impact, and follow-up

Confirmed root cause: the repository terminal publication contract was static
where the lifecycle contract required dynamic identity-bound plan/tasklist
projection. This was a repository-local control-plane contract mismatch, not a
runtime/plugin JSON issue and not an authority to weaken hard stops.

Impact: a valid assured terminal candidate could become unpublishable, while
the missing tasklist projection could remain under-validated.

Avoidable: yes. Recommended follow-up: retain exact parent-derived paths,
strict Work Block/specification identity and revision checks, completed closure
markers, all required checked task items, and exact-set diff rejection in all
future terminal publication changes.
