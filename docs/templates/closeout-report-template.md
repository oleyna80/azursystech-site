# Closeout Report Template

## Closeout Report — [Work Block ID]

- **Date:** [YYYY-MM-DD]
- **Stage Execution State:** [completed]
- **Review Verdict:** [READY | CHANGES_REQUIRED | BLOCKED | UNVERIFIED | valid skip]
- **Verification Verdict:** [READY | BLOCKED | UNVERIFIED]
- **Evaluation Verdict:** [READY | BLOCKED | UNVERIFIED | NOT_REQUIRED]
- **Evaluation Plan / Report:** [paths | not required with reason]
- **Drift Verdict:** [ALIGNED | ALIGNMENT_REQUIRED | BLOCKED | UNVERIFIED | valid skip]
- **Closeout Classification:** [SUCCESS | REPORTING_ONLY]
- **Task Status:** [completed | blocked]

### Result
[Actual result compared with the expected final result.]

### Process Feedback

Every non-trivial Work Block must include exactly one structured block. Each
dimension has an explicit `state` (`CLEAR` or `FRICTION_OBSERVED`) and concise
`evidence`. Use `NONE — checked` only when all eight states are `CLEAR`; any
observed friction requires `OBSERVATIONS_RECORDED` and at least one
evidence-backed registry ID. The registry is advisory only.

```yaml process-feedback
contract_version: 1
work_block_id: [Work Block ID]
date: "[YYYY-MM-DD]"
result: NONE — checked
dimensions:
  documentation:
    state: CLEAR
    evidence: "no material documentation gap observed"
  contracts_invariants:
    state: CLEAR
    evidence: "no material contract mismatch observed"
  tooling_skills:
    state: CLEAR
    evidence: "no material tooling friction observed"
  context_memory:
    state: CLEAR
    evidence: "no material context or memory gap observed"
  governance_authority:
    state: CLEAR
    evidence: "no material authority ambiguity observed"
  environment_setup:
    state: CLEAR
    evidence: "no material environment issue observed"
  validation_tests:
    state: CLEAR
    evidence: "no material validation or test issue observed"
  process_overhead_repeated_work:
    state: CLEAR
    evidence: "no material repeated work observed"
avoidable_friction_count: 0
observation_ids: []
registry: docs/engineering-memory/process-feedback-registry.yml
```

An observation cannot authorize a governance, architecture, lifecycle,
validator, or production change; accepted systemic improvements require a
separate approved Work Block.

### Evidence
- **Frozen subject revision:** [commit/hash/version]
- **Provider-native check snapshot:** [artifact path and subject SHA | not applicable]
- **Deterministic checks:** [commands/results]
- **Output evaluation:** [criteria/results | not required]
- **Observable trajectory evaluation:** [event sources/results | not required]
- **Review / Verification / Drift:** [reports]
- **Inspection gaps:** [none | list]

Trajectory evidence references observable events only. Do not include private
chain-of-thought, hidden reasoning, model scratchpads, secrets, or protected data.
Do not copy dynamic Git commit counts, check counts, or CI counters into this
tracked report; use the SHA-bound provider snapshot artifact instead.

### Engineering Memory
- **Classification:** [promoted | operational-only | not-applicable]
- **Entries Updated:** [docs/engineering-memory/* | none]
- **Reason:** [why reusable knowledge was or was not promoted]

### Residual Risk
- [none | unresolved risk]

### Corrective Action or Unresolved Dependency
- [not applicable for passing required verdicts | required for BLOCKED/UNVERIFIED]

### Next Action
- [promotion/merge only for passing required verdicts | corrective Work Block/rerun]

`SUCCESS` and task status `completed` require Review and Verification to pass,
required Evaluation status/verdict `READY`, and required Drift `ALIGNED`.
`BLOCKED`, `UNVERIFIED`, or unresolved `CHANGES_REQUIRED` requires
`REPORTING_ONLY`, keeps the task blocked, and prohibits promotion, merge, deploy,
release-ready, or success claims.
