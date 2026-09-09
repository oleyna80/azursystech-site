# Future Work Block Brief — SDLC Process Feedback / Self-Improvement

Status: PARKED INPUT FOR A FUTURE WORK BLOCK

This document is not an active Work Block and does not grant implementation authority. It exists so the approved design can be picked up later without reconstructing the decision from chat history.

Primary design reference:

`docs/engineering-memory/process-feedback-self-improvement-design.md`

## Objective

Implement the smallest maintainable Process Feedback mechanism that makes every non-trivial Work Block perform a short evidence-based workflow review during Closeout, records material friction in the repository's canonical error/process-memory layer, and enables later aggregate analysis without allowing ordinary agents to rewrite SDLC architecture or governance autonomously.

## Scope

The future Work Block should:

1. inventory the current memory, error, failure, lesson, and reproducibility layers;
2. choose one canonical sink for process-friction observations rather than creating a parallel source of truth;
3. add an explicit Process Feedback result to non-trivial Work Block Closeout;
4. support `NONE — checked` only after all mandatory review dimensions are considered;
5. define a compact structured observation shape;
6. preserve the approved category and severity taxonomy unless current repository evidence requires a bounded refinement;
7. allow Reviewer/Verifier to report missed process feedback;
8. capture `avoidable_friction_count` or an equivalent simple metric for repeated preventable issues;
9. define a lightweight triage/meta-analysis path for accumulated observations;
10. add only the minimum validation needed to prevent empty/formal compliance.

## Mandatory Review Dimensions

- documentation
- contracts/invariants
- tooling/skills
- context/memory
- governance/authority
- environment/setup
- validation/tests
- process overhead/repeated work

## Observation Categories

- `DOCUMENTATION_GAP`
- `CONTRACT_MISMATCH`
- `TOOLING_FRICTION`
- `VALIDATOR_OR_TEST_ISSUE`
- `CONTEXT_OR_MEMORY_GAP`
- `GOVERNANCE_AMBIGUITY`
- `ENVIRONMENT_ISSUE`
- `PROCESS_OVERHEAD`
- `RECURRING_IMPLEMENTATION_ERROR`

## Minimum Observation Fields

- `work_block_id`
- `date`
- `category`
- `observation`
- `evidence`
- `likely_systemic_cause`
- `impact`
- `suggested_improvement`
- `severity`
- `status`
- optional `duplicate_of`
- optional `related_work_blocks`

## Feedback Lifecycle

```text
NEW → TRIAGED → ACCEPTED / DUPLICATE / REJECTED
ACCEPTED → IMPROVEMENT_WB → VERIFIED → CLOSED
```

## Constraints

- Do not make Process Feedback a reason to fail an otherwise valid Work Block merely because friction was observed.
- Do not allow a bare `NONE`; it must mean the mandatory dimensions were actually checked.
- Do not store private chain-of-thought.
- Do not require agents to invent issues when none are supported by evidence.
- Do not let an ordinary Work Block autonomously change SDLC architecture, lifecycle semantics, governance, authority rules, or validator semantics based only on its observation.
- Do not create a new memory/log system until existing sinks are inventoried.
- Prefer a small repository-native mechanism over a service/database/dashboard.
- Keep clean Work Block overhead low.

## Anti-Laziness Acceptance

The implementation should make the following behavior observable:

- the worker explicitly completes the feedback check;
- Reviewer/Verifier can flag obvious omitted friction;
- repeated `NONE` results that conflict with assurance findings become evidence themselves;
- previously known but recurring preventable issues can be counted as avoidable friction;
- the mechanism distinguishes unsupported complaint/noise from evidence-backed process defects.

## Suggested Analysis Loop

Accumulated feedback should later support:

- deduplication;
- clustering;
- frequency and severity analysis;
- recurring root-cause detection;
- avoidable-friction analysis;
- candidate improvement generation;
- benefit/risk prioritization.

A separate improvement Work Block should be required before systemic changes are implemented.

## Acceptance Criteria

1. A non-trivial Work Block has a defined Process Feedback closeout contract.
2. `NONE — checked` cannot be emitted without representing all mandatory review dimensions.
3. Material observations have a stable, compact, evidence-based schema.
4. At least one canonical repository sink is selected and documented.
5. Reviewer/Verifier can record missed feedback without changing the worker's implementation scope.
6. The observation lifecycle and triage path are documented.
7. Recurring/avoidable friction can be identified without manual chat-history reconstruction.
8. Existing release-state/control-plane/SDLC validators remain semantically intact unless an architecture decision explicitly authorizes changes.
9. No observation directly grants authority for an SDLC/governance modification.
10. Documentation and validation are sufficient for a future autonomous Codex session to use the mechanism without Owner micromanagement.

## Out of Scope

- automatic self-modification of SDLC/governance;
- LLM fine-tuning;
- external observability platforms;
- dashboards unless later evidence proves they are necessary;
- production application behavior;
- SEO/product work;
- unrelated branch/worktree cleanup;
- replacing the existing engineering-memory architecture.

## Future Handoff

When this work is activated, the Owner/architecture layer should approve the implementation boundary first. Codex may then autonomously inspect the repository, create the formal Work Block, choose bounded implementation details, implement, test, review, verify, document, commit, and publish a non-default candidate under normal repository governance.
