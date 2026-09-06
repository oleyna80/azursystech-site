# Specification — WB-2026-09-06-video-generator-transaction-contract

## Objective

Adapt the approved transaction-safety contract from the historical media branch
to current AzurSysTech `main`. Historical implementation is reference-only and
must not be copied, cherry-picked, modernized, or used as an implementation
baseline.

## Requirements

- REQ-001: Model one explicitly approved provider transaction; material changes
  require fresh Owner authorization or a successor Work Block.
- REQ-002: Define deterministic transaction states and valid transitions;
  only `accepted-with-id` may use bounded pre-approved status retrieval.
- REQ-003: Never blindly retry or resubmit a billable generation after an
  ambiguous acknowledgement, timeout, or transport failure.
- REQ-004: Separate safe bounded status retrieval from billable submission and
  define retrieval attempts, deadline, capability, and stopping conditions.
- REQ-005: Provide a minimal provider transaction record template containing
  safe references, cost boundary, retrieval bound, state, provenance, and
  minimal output metadata only after an approved output exists.
- REQ-006: Explicitly prohibit secrets, raw provider/request data, source media,
  prompt content, signed URLs, and other sensitive payloads in tracked records.
- REQ-007: Require unconfirmed provenance to remain quarantined and not
  publication-ready.
- REQ-008: Keep technical validity, provenance confidence, and commercial /
  publication authorization as independent decisions owned by the appropriate
  downstream roles.
- REQ-009: Grant no provider-call, credential, generation, upload/download,
  publication, or deployment authority from the skill itself.

## Acceptance criteria

- AC-001 [req=REQ-001,REQ-003]: One approved transaction cannot silently expand
  into additional billable submissions.
- AC-002 [req=REQ-002]: States and valid transitions are explicit and internally
  consistent.
- AC-003 [req=REQ-003,REQ-004]: Submission retry and bounded retrieval are
  explicitly distinct.
- AC-004 [req=REQ-005,REQ-006]: The YAML template parses and excludes prohibited
  sensitive/raw fields.
- AC-005 [req=REQ-007]: Unconfirmed provenance requires quarantine.
- AC-006 [req=REQ-008]: Three independent handoff decisions remain explicit.
- AC-007 [req=REQ-009]: The skill grants no execution or publication authority.
- AC-008 [req=REQ-001,REQ-005]: Historical implementation is not copied or
  cherry-picked; current-main files are adapted semantically.
- AC-009 [req=REQ-001,REQ-009]: No application, provider, deployment, or
  framework paths are modified.
- AC-010 [req=REQ-001,REQ-009]: Canonical lifecycle and release-state checks pass
  after closeout.

## Scope

Primary writes are limited to `.agent/skills/video-generator/SKILL.md` and
`.agent/skills/video-generator/reference/provider-transaction-record.template.yml`.
Current lifecycle coordination and this WB's spec, plan, tasklist, and reports
may also be updated as required by the canonical workflow.

## Exclusions

No changes to application/media paths, hooks, bootstrap, provider adapters,
credentials, deployment, dependencies, `agentic-sdlc-framework`, or historical
source branch. No provider/API execution, paid generation, publication,
deployment, merge, or branch deletion.
