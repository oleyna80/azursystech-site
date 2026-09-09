---
artifact_type: specification
work_block_id: WB-2026-09-09-process-feedback-self-improvement
status: approved
revision: v1
baseline: efb2d4e0f09150d2a6b0b573b821673004a734b6
process_feedback_required: true
---

# Specification — Process Feedback / Self-Improvement

## Decision summary

The repository will use exactly one structured Process Feedback sink:
`docs/engineering-memory/process-feedback-registry.yml`. This is a bounded
extension of the existing durable engineering-memory zone, which already
holds recurring failure patterns and lessons. Operational logs, closeout
reports, and tasklists remain evidence or workflow artifacts; they are not
parallel Process Feedback registries.

The mechanism preserves:

`Execute → Observe → Record → Aggregate → Analyze → Decide → Improve → Verify`

Observation is autonomous. A finding is advisory evidence only and never
grants authority to alter architecture, lifecycle semantics, governance,
authority rules, validators, or production behavior. Any systemic improvement
must be proposed and executed by a separate approved Work Block.

## Requirements

- REQ-001: Every new non-trivial Work Block must declare and complete a structured Process Feedback closeout review covering all eight mandatory dimensions.
- REQ-002: A clean review must use `NONE — checked` with non-empty dimension evidence, while material friction must use the canonical evidence-backed observation schema.
- REQ-003: The registry and validator must enforce stable categories, severities, lifecycle values, required evidence fields, and the advisory-only authority boundary.
- REQ-004: Reviewers and Verifiers must have an explicit read-only surface for missed, unsupported, misclassified, duplicate, and recurring feedback.
- REQ-005: A read-only aggregation command must expose frequency, severity, recurrence, avoidable friction, deduplication, and candidate improvement signals without implementing changes.
- REQ-006: Existing release-state, lifecycle, authority, and control-plane semantics must remain valid; historical closeouts must not be rewritten solely to retrofit this mechanism.
- REQ-007: The mechanism must keep clean-Work-Block overhead bounded to one compact structured closeout block and a zero-count field.

## Acceptance criteria

- AC-001 [req=REQ-001,REQ-002]: The closeout contract requires `process_feedback_required: true`, an exact Process Feedback block, all eight dimensions, and either an evidenced `NONE — checked` result or referenced registry observations.
- AC-002 [req=REQ-002,REQ-003]: The validator rejects bare/empty `NONE`, malformed observations, unknown category/severity/status values, duplicate IDs, missing evidence, and non-advisory authority metadata.
- AC-003 [req=REQ-003,REQ-006]: The registry is documented as the only canonical sink, and release-state validation applies the new contract to opted-in Work Blocks while preserving historical closeout compatibility.
- AC-004 [req=REQ-004]: Critic/Reviewer/Verifier report templates contain explicit fields for missed, unsupported, classification, duplicate, and recurring feedback concerns, without write authority.
- AC-005 [req=REQ-005]: The aggregate command produces deterministic JSON or text summaries for counts, categories, severities, lifecycle, recurrence, and candidate improvements.
- AC-006 [req=REQ-006]: Existing release-state and focused control-plane validator suites remain green, and no application, route, sitemap, multilingual, deployment, or branch-cleanup files are changed.
- AC-007 [req=REQ-007]: A valid clean review is represented by eight concise dimension entries plus `avoidable_friction_count: 0` and no observation records.

## Observation contract

Required fields are `id`, `work_block_id`, `date`, `category`, `observation`,
`evidence`, `likely_systemic_cause`, `impact`, `suggested_improvement`,
`severity`, `status`, and `authority: advisory_only`. Optional fields are
`duplicate_of`, `related_work_blocks`, `avoidable_friction`,
`expected_benefit`, and `improvement_risk`.

Categories are the approved nine values:
`DOCUMENTATION_GAP`, `CONTRACT_MISMATCH`, `TOOLING_FRICTION`,
`VALIDATOR_OR_TEST_ISSUE`, `CONTEXT_OR_MEMORY_GAP`, `GOVERNANCE_AMBIGUITY`,
`ENVIRONMENT_ISSUE`, `PROCESS_OVERHEAD`, and `RECURRING_IMPLEMENTATION_ERROR`.
Severity is one of `LOW`, `MEDIUM`, `HIGH`, or `SYSTEMIC`. Status follows
`NEW → TRIAGED → ACCEPTED / DUPLICATE / REJECTED` and
`ACCEPTED → IMPROVEMENT_WB → VERIFIED → CLOSED`.

Evidence is an observable file, command, test, runtime symptom, or report
reference. Private chain-of-thought is out of scope.

## Anti-laziness and assurance semantics

`NONE — checked` is valid only when all dimensions have concise evidence text.
Reviewers and Verifiers may record concerns in their read-only reports.
Repeated `NONE` results that conflict with assurance evidence are themselves
observable process-quality evidence. `avoidable_friction_count` counts only
referenced observations explicitly marked `avoidable_friction: true`; it does
not require agents to invent a problem. Unsupported complaints fail validation
because the evidence field is mandatory and are reportable as unsupported.

## Explicit exclusions

This Work Block does not seed historical observations, rewrite historical
Work Blocks, create dashboards or external services, modify production
application behavior, change routes/SEO/sitemaps, deploy, merge, delete
branches/worktrees, or permit autonomous governance self-modification.
