# Work Block Plan — SDLC Documentation Adaptation

## Metadata

- **Work Block:** `WB-2026-08-17-sdlc-documentation-adaptation`
- **Governance profile:** Managed
- **Side-effect class:** coordination/documentation write
- **DB action mode:** none
- **Owner approval:** 2026-08-17 conversation confirmation
- **Specification:** `docs/specs/WB-2026-08-17-sdlc-documentation-adaptation.md` (`v1`)
- **Baseline:** `257d529d4a81147b6f7dea29bd17f52228ea17d6`
- **Evaluation:** not required; deterministic documentation contracts only

## Scope and Write-Set

```text
AGENTS.md
PROJECT_MAP.md
FILE_REGISTRY.yml
docs/session-bootstrap.md
governance/authority.md
governance/lifecycle.md
governance/artifacts.md
governance/define-quality.md
governance/decision-provenance.md
.agent/ROSTER.md
.agent/workflows/sdd-protocol.md
docs/templates/work-block-template.md
docs/templates/tasklist-template.md
docs/templates/requirements-quality-review-template.md
docs/specs/WB-2026-08-17-sdlc-documentation-adaptation.md
docs/plans/WB-2026-08-17-sdlc-documentation-adaptation.md
docs/tasklist/WB-2026-08-17-sdlc-documentation-adaptation.tasklist.md
docs/reports/critic-WB-2026-08-17-sdlc-documentation-adaptation.md
docs/reports/requirements-quality-WB-2026-08-17-sdlc-documentation-adaptation.md
docs/reports/traceability-WB-2026-08-17-sdlc-documentation-adaptation.md
docs/reports/review-WB-2026-08-17-sdlc-documentation-adaptation.md
docs/reports/verification-WB-2026-08-17-sdlc-documentation-adaptation.md
.agent/active-work-block.json
.agent/critic-gate.md
.agent/verification-gate.md
.codex/write-gate.md
```

This Work Block contains only Control Tower-owned documentation and coordination
paths. The Orchestrator updates the bounded write-set after the Critic gate is
resolved; no Coder is assigned because no production-source path is in scope.
Existing dirty/untracked/staged legacy files are explicitly excluded.

### Frozen Subject Manifest

The assurance subject is exactly the `write_set` in
`.agent/active-work-block.json` at the frozen baseline, including its tracked
edits and its Work-Block-specific untracked additions. It excludes all other
working-tree paths, especially the pre-existing legacy authorization/deploy-skill
changes and `.codex/worktrees/**`. The verification report must list each subject
path as `tracked-modified`, `untracked-added`, or `operational-state`, and must
separately list the excluded legacy paths observed at preflight.

## Plan

| ID | Type | Owner | Paths | Acceptance link | Status |
|---|---|---|---|---|---|
| TASK-001 | documentation | Orchestrator | spec, plan, tasklist, active gate | AC-001–AC-006 | complete |
| TASK-002 | assurance | Orchestrator | requirements-quality report | REQ-001, AC-001 | complete before Critic |
| TASK-003 | assurance | Orchestrator | traceability/consistency report | REQ-001–REQ-006, AC-001–AC-006 | complete before Critic |
| TASK-004 | requirement | Orchestrator | governance, AGENTS, workflow, roster | AC-001–AC-005 | implemented; frozen subject |
| TASK-005 | requirement | Orchestrator | map, registry, bootstrap, templates | AC-001–AC-006 | implemented; frozen subject |
| TASK-006 | assurance | Reviewer | frozen diff, review report | AC-001–AC-006 | complete; final P0 review `READY` is recorded as same-session-degraded evidence |
| TASK-007 | assurance | Verifier | checks, verification report | AC-001–AC-006 | complete; final P0 verification `READY` and drift `ALIGNED` are recorded for the exact 12/11/3 inventory |
| TASK-008 | documentation | Orchestrator | tasklist, gate records, closeout state | AC-006 | complete; active state records documentation-only success-closeout while source gate remains blocked |
| TASK-009 | coordination | Orchestrator | spec, plan, tasklist, Critic report, active state | AC-006 | complete; corrected closeout status and evidence boundaries without changing the frozen documentation subject |

## P0 Closeout Correction (TASK-009)

The prior final-closeout wording was misleading because the frozen subject and
legacy exclusions were not individually recorded in the closeout evidence while
review, verification, and drift were represented as passing. TASK-009 is a
coordination-only correction: it does not alter the documentation subject,
implementation acceptance criteria, authority model, or any production/runtime
behavior. It restored the Work Block to an honest pending-assurance state before
new review and verification occurred. Final P0 review and verification then
completed with `READY` and `ALIGNED` respectively; the result is a
documentation-only closeout, not a delivery authorization.

### Skill Routing and Isolation

| Capability | Decision | Evidence / reason |
|---|---|---|
| Critic | used | Required Define-stage Critic issued `SUPPLEMENT`; its P0 supplement records the exact subject and exclusions. |
| Reviewer | used | Final read-only review returned `READY` after the exact-subject evidence was recorded. |
| Verifier | used | Final deterministic verification returned `READY`; the documentation drift audit returned `ALIGNED`. |
| git-safety | skipped | TASK-009 performs no Git mutation: no stage, commit, push, reset, clean, or checkout. |
| ssot-sync-closeout | unavailable | No installed skill directory was available under that name; this absence is recorded rather than substituted with a claim. |

All native subagent evidence to date shares the workspace/runtime and is
`same-session-degraded`. That is advisory isolation only; it is not
`independent-readonly-root` or `os-isolated` assurance.

### Exact Frozen Subject Manifest

The 26-path subject is fixed for the P0 recheck. Expected categories are:

- **tracked-modified (12):** `AGENTS.md`; `PROJECT_MAP.md`;
  `FILE_REGISTRY.yml`; `docs/session-bootstrap.md`;
  `governance/lifecycle.md`; `governance/artifacts.md`;
  `governance/authority.md`; `.agent/ROSTER.md`;
  `.agent/workflows/sdd-protocol.md`; `docs/templates/work-block-template.md`;
  `docs/templates/tasklist-template.md`; `.agent/active-work-block.json`.
- **untracked-added (11):** `governance/define-quality.md`;
  `governance/decision-provenance.md`;
  `docs/templates/requirements-quality-review-template.md`;
  `docs/specs/WB-2026-08-17-sdlc-documentation-adaptation.md`;
  `docs/plans/WB-2026-08-17-sdlc-documentation-adaptation.md`;
  `docs/tasklist/WB-2026-08-17-sdlc-documentation-adaptation.tasklist.md`;
  `docs/reports/requirements-quality-WB-2026-08-17-sdlc-documentation-adaptation.md`;
  `docs/reports/traceability-WB-2026-08-17-sdlc-documentation-adaptation.md`;
  `docs/reports/critic-WB-2026-08-17-sdlc-documentation-adaptation.md`;
  `docs/reports/review-WB-2026-08-17-sdlc-documentation-adaptation.md`;
  `docs/reports/verification-WB-2026-08-17-sdlc-documentation-adaptation.md`.
- **operational-state (3):** `.agent/critic-gate.md`;
  `.agent/verification-gate.md`; `.codex/write-gate.md`.

### Observed Legacy Exclusions at P0 Preflight

These paths are not part of TASK-009 or the frozen subject and must remain
untouched.

- **staged (5):** `.agent/authorizations/WB-2026-08-12-showcase-production-multizone.json`;
  `.agent/authorizations/WB-2026-08-12-showcase-production-multizone.json.sig`;
  `.agent/skills/deploy-operations/SKILL.md`; `.claude/skills/deploy-operations/SKILL.md`;
  `.opencode/skills/deploy-operations/SKILL.md`.
- **untracked (15):** `.codex/worktrees/**`;
  `docs/plans/WB-2026-08-11-deploy-recovery.authorization-draft.json`;
  `docs/plans/WB-2026-08-11-deploy-recovery.md`;
  `docs/plans/WB-2026-08-12-showcase-production-multizone.authorization-draft.json`;
  `docs/plans/WB-2026-08-12-showcase-production-multizone.md`;
  `docs/plans/WB-2026-08-13-repository-cleanup-schema-v3.md`;
  `docs/reports/WB-2026-08-11-deploy-recovery-verification.md`;
  `docs/reports/critic-WB-2026-08-11-deploy-recovery.md`;
  `docs/reports/critic-WB-2026-08-12-showcase-production-multizone.md`;
  `docs/reports/critic-WB-2026-08-13-repository-cleanup-schema-v3.md`;
  `docs/reports/legacy-authorization-inventory-2026-08-13.md`;
  `docs/tasklist/WB-2026-08-08-deployment-documentation-audit.tasklist.md`;
  `docs/tasklist/WB-2026-08-11-deploy-recovery.tasklist.md`;
  `docs/tasklist/WB-2026-08-12-showcase-production-multizone.tasklist.md`;
  `docs/tasklist/WB-2026-08-13-repository-cleanup-schema-v3.tasklist.md`.

## Required Assurance

- **Requirements quality and traceability:** required before Critic. The reports
  record REQ/AC/TASK coverage, exact-path scope, and any gap; they are manual
  evidence only and cannot open the write gate.
- **Critic:** required before opening the documentation write gate; a separate
  read-only subagent reviews scope, conflicts, provenance, and verification.
- **Review:** required after the Orchestrator freezes the diff; separate
  read-only reviewer.
- **Verification:** required; deterministic document-structure and
  cross-reference checks. No output/trajectory evaluation because the delivered
  artifact is bounded, deterministic documentation rather than autonomous
  behavior.
- **Drift audit:** required as a documentation-specific consistency pass because
  multiple normative SSOT documents change; it is recorded in the verification
  report.
- **Runtime and isolation:** Critic, Reviewer, and Verifier run as native
  read-only subagents in the shared workspace/runtime. Their actual isolation is
  `same-session-degraded`; no result may be described as
  `independent-readonly-root` or `os-isolated`. This is sufficient for this
  documentation-only Work Block but advisory for sensitive work. Capability
  evidence is the delegated role plus read-only tool use; if unavailable, the
  corresponding result is `UNVERIFIED` rather than substituted by a claim.

## Hard Stops and Risks

- No external Hard Stop action will be performed; every listed Hard Stop remains
  forbidden, including any `git push`.
- The existing Owner-controlled `git push` boundary is a non-negotiable
  acceptance constraint.
- Legacy signed-authorization artifacts are historical evidence only and must
  not be edited, staged, or used to authorize this Work Block.
- If an implementation requires a hook, validator, schema, bootstrap, runtime,
  config, or skill change, stop and return to Define for separate Owner approval.

## Verification Plan

1. Run `git diff --check --` with each tracked subject path from the frozen
   subject manifest; expected result: no whitespace errors. Do not run it over
   the broad dirty working tree.
2. Parse `.agent/active-work-block.json` with `python3 -m json.tool`; expected
   result: valid JSON and a `BLOCKED` write gate outside the bounded edit window.
3. Parse `FILE_REGISTRY.yml` with the repository's available YAML reader; if no
   reader is available, record `UNVERIFIED` rather than treating text inspection
   as syntax proof.
4. Use `rg -n` on the exact changed paths for `git push`, `Owner-controlled`,
   `define_quality`, `independent-readonly-root`, and `os-isolated`; expected
   result: no autonomous publication permission and no executable-enforcement
   import.
5. For each untracked subject path, run `git diff --no-index --check /dev/null
   <path>`; expected result: no whitespace diagnostic (the content-difference
   exit status is expected). Use `git status --short -- <subject paths>` to
   enumerate both tracked and untracked subject paths, then compare that list to
   the manifest. No pre-existing legacy path may be attributed to this Work Block.
6. Check every new canonical path is present in `PROJECT_MAP.md` and
   `FILE_REGISTRY.yml`, then map AC-001–AC-006 to evidence in the verification
   report. Unavailable proof is `UNVERIFIED`, never `READY`.

## Recovery

If a document check or review fails, keep the source gate `BLOCKED`, correct only
the approved path with `apply_patch`, and repeat the affected read-only check.
Do not reset, clean, delete, stage, commit, publish, or alter pre-existing dirt.

## Closeout Boundary

P0 is complete as a documentation-only success-closeout. The source write gate
remains `BLOCKED` with `opened_at: null`; no staging, commit, push, publication,
deployment, or legacy/index reconciliation occurred. P2 delivery is not started
and requires a separate approved Work Block.
