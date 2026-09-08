---
artifact_type: specification
work_block_id: WB-2026-09-08-autonomous-work-block-execution
revision: owner-request-2026-09-08
status: approved
---

# Specification — WB-2026-09-08-autonomous-work-block-execution

## Objective

Establish the Owner-approved Autonomous Work Block Execution model as the one
canonical runtime-neutral governance contract for AzurSysTech. Within an
approved, branch-bound Work Block, the Orchestrator may independently complete
reversible delivery work through a normal non-force push of its exact subject
branch candidate. The Owner retains final review and the `MERGE / REVISION /
REJECT` decision.

## Requirements

- REQ-001: `governance/authority.md` is the single canonical source for the
  autonomous-execution and Owner-escalation boundary. Other governance,
  workflow, template, runtime, and memory documents must defer to it or state
  only their operational consequence.
- REQ-002: An approved Work Block with a matching non-default `subject_branch`,
  READY write gate, approved write set, and completed required assurance may
  autonomously perform Define, planning, implementation, corrective loops,
  tests, documentation, local commits, and one normal non-force push of the
  exact subject branch candidate.
- REQ-003: Routine implementation choices, test failures, `CHANGES_REQUIRED`,
  refactoring, and corrective loops within approved scope/risk boundaries do
  not require Owner escalation.
- REQ-004: Direct/default/protected-branch updates, force or non-fast-forward
  pushes, remote branch deletion, broad/mirror/prune pushes, tags/releases,
  merge, deploy, live data/infrastructure, secrets/credentials, and destructive
  operations remain blocked Owner-controlled boundaries.
- REQ-005: Project-local hard-stop enforcement must allow only a normal
  subject-branch push bound to an active READY Work Block and deny the protected
  and irreversible publication forms in REQ-004, with deterministic positive
  and negative tests.
- REQ-006: Runtime-specific Codex, Claude, and OpenCode guidance/configuration
  must express the same operational boundary without granting authority through
  a runtime, permission prompt, or technical credential alone.
- REQ-007: Work Block and governance templates distinguish autonomous local
  commits and exact subject-branch pushes from Owner-controlled actions, and
  point readers to the canonical authority source.
- REQ-008: Engineering memory records rationale and lessons only; it must not
  be represented as an authority source.
- REQ-009: The lifecycle/default-state producer and runtime guards remain
  internally consistent with the formal Define-quality prerequisite; no
  lifecycle-generated active Managed Work Block may silently omit it.
- REQ-010: Documentation and enforcement changes remain within this repository
  control plane. No application source, dependency, schema, deployment, secret,
  framework-repository, merge, tag/release, branch deletion, force-push, or
  production action is performed.

## Acceptance criteria

- AC-001 [req=REQ-001,REQ-007,REQ-008]: authority, lifecycle/workflow,
  templates, navigation, and memory wording identify `governance/authority.md`
  as canonical and contain no conflicting every-push Owner handoff rule.
- AC-002 [req=REQ-002,REQ-003]: a formal active Work Block records the approved
  autonomous lifecycle including corrective loops and ordinary subject-branch
  publication without a routine Owner pause.
- AC-003 [req=REQ-004,REQ-005]: deterministic hook fixtures allow a normal
  exact-subject branch publication and deny default/protected targets, force,
  deletion, broad/mirror/prune, tags, infrastructure, data, credentials, deploy,
  merge, and irreversible publication paths.
- AC-004 [req=REQ-006]: Codex, Claude, and OpenCode operational surfaces are
  consistent with the canonical authority boundary.
- AC-005 [req=REQ-009]: lifecycle-generated state includes and honors the
  formal Define-quality prerequisite, with fixture coverage for required and
  non-required profiles.
- AC-006 [req=REQ-010]: deterministic control-plane, traceability, diff, and
  scoped secret-safety checks pass; no application or framework path changes.
- AC-007 [req=REQ-002,REQ-004]: the completed candidate is non-force pushed
  only to the exact Work Block subject branch and handed to the Owner for
  `MERGE / REVISION / REJECT`; no merge or deployment is performed.

## Boundaries

In scope: the governance/runtime-neutral authority contract, lifecycle and
publication workflow, control-plane templates, installed runtime guidance and
cooperative enforcement, deterministic tests, Work Block evidence, navigation,
and engineering-memory rationale.

Out of scope: application code (`web/`, `admin/`, `showcase/`), the separate
`agentic-sdlc-framework` repository, dependencies, database/schema changes,
production configuration, credentials, deployment, merge, tags/releases,
force-push, remote branch deletion, and any destructive action.
