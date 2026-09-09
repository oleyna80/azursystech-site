---
artifact_type: work_block
work_block_id: WB-2026-09-09-process-feedback-self-improvement
status: completed
revision: v2
specification: docs/specs/WB-2026-09-09-process-feedback-self-improvement.md
base_commit: efb2d4e0f09150d2a6b0b573b821673004a734b6
subject_branch: feat/process-feedback-self-improvement-025
governance_profile: Assured
process_feedback_required: true
---

# Work Block Plan — Process Feedback / Self-Improvement

## Objective

Implement the smallest repository-native contract that makes Process Feedback
explicit at non-trivial Work Block closeout, stores evidence-backed material
friction in one canonical structured sink, and supports later read-only
aggregation without granting systemic change authority.

## Scope and write set

The approved write set is the exact set listed in the tasklist, including the
Process Feedback registry, templates, lifecycle routing, validators, tests,
assurance reports, and required lifecycle/coordination projections. No
application source or production configuration is in scope.

## Architecture and boundaries

The registry extends `docs/engineering-memory`, an existing durable reference
zone. `memory_bank/orchestrator-log.md` remains an operational event log;
closeout reports remain assurance evidence. The registry is advisory data, not
an authority source. Promotion from an accepted observation to a systemic
change requires a new approved improvement Work Block and normal review,
verification, and closeout.

## Execution stages

1. Define: approve this specification, traceability, consistency, and exact write set.
2. Execute: implement the contract, registry schema, closeout integration, validators, templates, and aggregate command with one Coder.
3. Assure: run Critic, frozen-diff Review, Verification, and drift checks; correct only within this write set.
4. Close: write the final Process Feedback block, project canonical inactive lifecycle state, commit, and non-force push the exact subject branch.

## Risks and mitigations

- Validator drift: use one Python library for registry and closeout parsing and add focused tests.
- Historical incompatibility: opt in new Work Blocks through `process_feedback_required: true`; do not rewrite old closeouts.
- Formal `NONE`: require all eight named dimensions to use explicit
  `CLEAR`/`FRICTION_OBSERVED` state plus evidence; friction must link a
  canonical observation, and expose reviewer/verifier concern fields.
- Authority escalation: validate a fixed `advisory_only` authority field and document separate improvement Work Blocks.
- Overhead: keep the clean path to one compact block and zero observation IDs.

## Evidence and completion boundary

Completion requires Define traceability, focused Process Feedback tests,
release-state/control-plane regression suites, a read-only review, a
read-only verification report, drift alignment, exact candidate SHA, and
non-force publication to `feat/process-feedback-self-improvement-025`.
Merge and deploy remain Owner decisions.

## Final State

- **Stage State:** completed
- **Review Gate:** READY
- **Verification Verdict:** READY
- **Evaluation Verdict:** SKIPPED — deterministic repository contract work has no generative or rubric-based deliverable
- **Drift Gate:** ALIGNED
- **Closeout Mode:** success-closeout
- **Task Status:** completed

## Owner Integration Correction

Owner review identified a mismatch between the former clean result and the
installation-profile assurance residual. The existing Work Block was revised
in place: explicit dimension states now make the environment friction
structurally visible, the closeout links `PF-2026-09-09-agent-browser-capability`,
and the validator rejects both a clean result with observed friction and
unlinked observed friction. This correction does not install the missing
capability or grant authority for a systemic change.
