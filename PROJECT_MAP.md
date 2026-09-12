# AzurSysTech Project Map

This map is the primary orientation layer for humans and AI agents entering the
`azursystech` repository. It explains authority, major repository zones, and navigation.

## Release State

<!-- release-state
completed_work_blocks:
  - docs/plans/WB-2026-08-25-shared-analysis-surface.md
  - docs/plans/WB-2026-08-28-repository-lifecycle-normalization.md
  - docs/plans/WB-2026-08-29-repository-closeout-cleanup.md
  - docs/plans/WB-2026-09-03-lifecycle-inactive-publication-reconciliation.md
  - docs/plans/WB-2026-09-03-lifecycle-inactive-publication-commit-reconciliation.md
  - docs/plans/WB-2026-09-03-lifecycle-inactive-closeout-coordination-reconciliation.md
  - docs/plans/WB-2026-09-03-lifecycle-inactive-commit-bypass-correction.md
  - docs/plans/WB-2026-09-03-technical-seo-cwv-entity-audit.md
  - docs/plans/WB-2026-09-08-active-work-block-state-recovery.md
  - docs/plans/WB-2026-09-09-crawl-indexation-reconciliation.md
  - docs/plans/WB-2026-09-09-release-state-fixture-isolation.md
  - docs/plans/WB-2026-09-09-lifecycle-ownership-reconciliation.md
  - docs/plans/WB-2026-09-09-process-feedback-self-improvement.md
  - docs/plans/WB-2026-09-11-control-plane-recovery-hardening-027.md
active_work_block: null
-->

```yaml
release_state:
  schema_version: 1
  authority_mode: github_capability
  repository_status: operational
  active_work_block: null
  governance_profile: Assured
  publication_mode: autonomous_assured_subject_branch_owner_merge_decision
  last_reconciled_commit: repository_evidence_only
```

## Migration Work

- No active implementation Work Block.
- The completed corrective Work Block is recorded in the release-state completed list.
- The completed migration index and active path are machine-readable in
  `FILE_REGISTRY.yml:migration_state`.

## Architecture

`azursystech` is the repository for AzurSysTech's IT services platform:
production website, internal operations admin surface, showcase demos, intake flows,
deployment automation, and supporting Agentic SDLC operating files.

The architecture comprises four separable layers:

1. **Governance Core** — `governance/` (authority, lifecycle, artifacts, define-quality,
   decision provenance, release state, runtime capabilities, evaluation).
2. **Portable Workflow & Memory** — `.agent/workflows/` (SDD protocol, subject-branch candidate flow),
   `.agent/ROSTER.md`, `docs/specs/`, `docs/plans/`, `docs/tasklist/`, `docs/reports/`,
   `docs/engineering-memory/`, and `.agent/skills/`.
3. **Runtime & Tool Surfaces** — `.agent/` control files, `.codex/`, `.claude/`, `.opencode/`,
   and validation scripts in `scripts/`.
4. **Application Source Roots** —
   - `web/` — public marketing website and intake flow (Next.js App Router);
   - `admin/` — internal operations and intake admin panel (Next.js);
   - `showcase/` — portfolio demo applications (Next.js);
   - `scripts/` — VPS deployment, DB operations, and CI contracts.

## Authority Order

When sources conflict, use this exact order:

### Product and Delivery Intent
1. explicit Owner instruction or approved change request;
2. approved specification (`docs/specs/`);
3. accepted architecture decisions and external contracts (`docs/architecture/`);
4. approved implementation and evaluation plans and write-set (`docs/plans/`);
5. active tasklist (`docs/tasklist/`);
6. requirements-quality, consistency, review, verification, drift, closeout evidence (`docs/reports/`);
7. runtime/integration policy, operational logs, generated output, references.

Engineering memory preserves rationale and lessons; it is not an authority source.

### Agent Behavior and Permissions
1. explicit Owner instruction;
2. `AGENTS.md` and Governance Core (`governance/`);
3. active Work Block scope, write-set, and assurance state (`.agent/active-work-block.json`);
4. canonical SDLC protocol (`.agent/workflows/sdd-protocol.md`, `.agent/workflows/owner-controlled-github-flow.md`);
5. installed runtime adapters and skills;
6. operational logs and generated artifacts.

## Work Block Profiles

Each Work Block selects independently:
- **Governance profile:** Advisory, Controlled, Managed, Assured, Distributed.
- **Runtime profile:** one installed runtime adapter.
- **Integration profile:** none or an admitted bridge/tool/transport.
- **Model class:** task-appropriate capability class.
- **Isolation:** actual boundary from `same-session-degraded` to `os-isolated`.
- **Evaluation posture:** not required or approved deterministic/output/trajectory plan.

## Define-Stage Requirements Quality

`governance/define-quality.md` establishes the pre-execution quality loop for formal work:

```text
specification draft
  -> clarification (evidence-first, bounded interaction budget)
  -> requirements-quality review
  -> architecture / implementation plan
  -> traceable task decomposition + write-set (REQ-*, AC-*, TASK-*)
  -> deterministic traceability validation (scripts/validate-define-traceability.py)
  -> read-only specification/plan/task consistency analysis
  -> Critic gate
  -> write gate READY
```

## Key Paths

| Path | Status | Purpose |
|---|---|---|
| `AGENTS.md` | normative | Root operating contract for all agents. |
| `PROJECT_MAP.md` | normative | Human-readable map and authority model. |
| `FILE_REGISTRY.yml` | normative | Machine-readable registry for key files and zones. |
| `governance/` | normative | Runtime-neutral governance core (authority, lifecycle, define-quality, etc.). |
| `.agent/bootstrap-profile.json` | generated | Resolved installation profile and path contract. |
| `.agent/workflows/sdd-protocol.md` | normative | Canonical 4-stage SDD lifecycle and gate semantics. |
| `.agent/workflows/owner-controlled-github-flow.md` | operational consequence | Subject-branch candidate publication and Owner decision handoff. |
| `.agent/ROSTER.md` | normative | Logical roles, skill routing, runtime binding, isolation. |
| `.agent/active-work-block.json` | operational gate | Active specification, write-set, integrations, assurance. |
| `.agent/skills/` | normative skills | Project-local portable and operational skills. |
| `docs/specs/` | normative | Approved product and technical specifications. |
| `docs/plans/` | evidence | Work Block plans and execution records. |
| `docs/tasklist/` | derived | Active task decomposition and SSOT status. |
| `docs/reports/` | evidence | Review, verification, requirements, evaluation, closeout evidence. |
| `docs/templates/` | normative | Reusable Work Block, tasklist, evaluation, report templates. |
| `docs/engineering-memory/` | durable reference | Rationale and lessons; never an authority source. |
| `scripts/` | source/tools | Validation scripts, deployment, VPS operations, and CI contracts. |
| `web/` | source | Production Next.js website and SQL intake flow. |
| `admin/` | source | Internal admin Next.js application. |
| `showcase/` | source | Portfolio/showcase Next.js application and demos. |
