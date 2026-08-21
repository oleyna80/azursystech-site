# Specification — Full Agentic SDLC Framework Adaptation

## Status

- **Work Block:** `WB-2026-08-21-sdlc-framework-full-adaptation`
- **Status:** approved by Owner on 2026-08-21
- **Revision:** `v1`
- **Baseline:** `257d529d4a81147b6f7dea29bd17f52228ea17d6`

## Objective

Adapt the complete, runtime-neutral Agentic SDLC framework from
`/home/azur/Projects/WSL/agentic-sdlc-framework` into `azursystech`. The resulting
agent documentation, governance core, templates, validation scripts, and skill
library will provide full Define-stage quality, stable traceability, release-state
reconciliation, and engineering decision principles while strictly preserving
AzurSysTech's private GitHub Free Owner-controlled publication handoff, infrastructure
Hard Stops, and schema-v3 GitHub-capability authority model.

## Requirements

- REQ-001: Fully synchronize `governance/` with the framework contracts while maintaining AzurSysTech's explicit Owner-controlled publication and isolation tier mappings.
- REQ-002: Refactor `AGENTS.md` into the standard 9-section modular format while embedding local hard stops, and update `docs/session-bootstrap.md` with Define-Quality and Evaluation preflights.
- REQ-003: Update `PROJECT_MAP.md` (with machine-readable release-state block) and `FILE_REGISTRY.yml` (upgraded to v8 schema structure with explicit authority order, define-quality, evaluation, repair-assurance, and all repository paths).
- REQ-004: Synchronize `.agent/workflows/sdd-protocol.md` and `.agent/ROSTER.md` with the 4-stage lifecycle (Define -> Execute -> Assure -> Close), single/parallel writer constraints, and fallback rules, while retaining `owner-controlled-github-flow.md`.
- REQ-005: Synchronize and expand `docs/templates/` (`traceable-tasklist-template.md`, `work-block-template.md`, `requirements-quality-review-template.md`, `design-md-template.md`, `critic-report-template.md`, `verification-report-template.md`, `closeout-report-template.md`, `integration-admission-template.md`).
- REQ-006: Port and adapt `scripts/validate-define-traceability.py` and `scripts/validate-release-state.py`, ensuring all validation scripts pass cleanly.
- REQ-007: Add/update procedural Define-quality skills (`requirements-clarification`, `requirements-quality-review`, `spec-consistency-analysis`, `spec-drift-audit`, `task-decomposition`, `skill-library-maintenance`, `git-orchestration-flow`) and add `docs/engineering-memory/engineering-decision-principles.md`.
- REQ-008: Execute comprehensive verification, validate all deterministic contracts, check links, ensure no source-write leakage, and produce final closeout evidence.

## Acceptance Criteria

- AC-001 [req=REQ-001]: All files in `governance/` match the framework's normative contracts and accurately describe Define-quality, decision provenance, release-state, and runtime capabilities with AzurSysTech isolation tiers.
- AC-002 [req=REQ-002]: `AGENTS.md` is formatted in the standard 9-section modular structure, under 200 lines, retaining explicit Owner-controlled publication and local pre-commit gates; `docs/session-bootstrap.md` contains Define-Quality and Evaluation preflights.
- AC-003 [req=REQ-003]: `PROJECT_MAP.md` contains the machine-readable `release-state` block; `FILE_REGISTRY.yml` conforms to schema v8 with `product_and_delivery` vs `agent_behavior` authority order.
- AC-004 [req=REQ-004]: `.agent/workflows/sdd-protocol.md` and `.agent/ROSTER.md` consistently define the 4-stage lifecycle, single/parallel writer boundaries, and isolation levels without weakening `owner-controlled-github-flow.md`.
- AC-005 [req=REQ-005]: `docs/templates/` contains `traceable-tasklist-template.md`, updated `work-block-template.md`, `requirements-quality-review-template.md`, `design-md-template.md`, and all standard assurance templates.
- AC-006 [req=REQ-006]: `scripts/validate-define-traceability.py` and `scripts/validate-release-state.py` are executable, error-free, and pass on project templates.
- AC-007 [req=REQ-007]: `.agent/skills/` contains the procedural Define-quality skills and `docs/engineering-memory/engineering-decision-principles.md` is recorded.
- AC-008 [req=REQ-008]: Deterministic contract validators (`validate-installation-profile.py`, `validate-define-traceability.py`, `validate-evaluation.py`, `test-github-capability-control-plane.py`) execute successfully with zero errors.

## Explicit Non-Goals

- Modifying production application source code (`web/**`, `admin/**`, `showcase/**`).
- Changing live PostgreSQL schema, data, or running migrations.
- Modifying production VPS deployment or infrastructure credentials.
- Executing autonomous `git push` or merging directly into `main`.

## Provenance

- **Classification:** `adapted`
- **Source:** `/home/azur/Projects/WSL/agentic-sdlc-framework` at commit `f206e6b`.
- **Local delta:** Preserves AzurSysTech's Owner-controlled GitHub Free publication handoff, schema-v3 GitHub-capability authority model, Next.js multizone applications, and existing consolidated operational skills.
- **Novelty claim:** none.
