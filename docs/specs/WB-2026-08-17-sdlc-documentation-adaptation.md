# Specification — SDLC Documentation Adaptation

## Status

- **Work Block:** `WB-2026-08-17-sdlc-documentation-adaptation`
- **Status:** approved by Owner on 2026-08-17; P0 documentation-only closeout completed on 2026-08-18. The frozen subject was rechecked against the exact subject and legacy exclusions; final review is `READY`, verification is `READY`, and documentation drift is `ALIGNED` under `same-session-degraded` advisory isolation.
- **Revision:** `v1`
- **Baseline:** `257d529d4a81147b6f7dea29bd17f52228ea17d6`

## Objective

Adapt the current runtime-neutral Agentic SDLC documentation from
`/home/azur/Projects/WSL/agentic-sdlc-framework` to the existing AzurSysTech
schema-v3, GitHub-capability authority model. The result must improve formal
Define-stage quality, traceability, and decision provenance without weakening
project-specific Owner-controlled publication, Hard Stops, or source authority.

## Requirements

- **REQ-001:** Formal Managed, Assured, and Distributed Work Blocks must state
  when requirements-quality review, REQ/AC/TASK traceability, and pre-execution
  consistency analysis are required. Controlled work must select these checks by
  risk; quick fixes and eligible NDR must not be forced into artificial IDs.
- **REQ-002:** Documentation must preserve the existing SSOT order. Define-quality
  evidence, templates, tasklists, and validators are supporting evidence only and
  never open a write gate or override an approved specification. This Work Block
  introduces no executable `define_quality` active-state field, schema default,
  validator, or hook; its evidence is recorded manually in the Work Block reports.
- **REQ-003:** New or materially changed reusable SDLC mechanisms must record
  decision provenance as `adopted`, `adapted`, or
  `original_experience_derived`, with source, local delta, rationale, and no
  novelty claim. Ordinary product work and formatting-only changes are excluded.
- **REQ-004:** Runtime capability and declared isolation must remain separate from
  authority. AzurSysTech-specific labels and the required mapping must not weaken
  the `independent-readonly-root` and `os-isolated` requirements.
- **REQ-005:** The documentation must retain the current Owner-controlled GitHub
  Free publication workflow: every `git push`, merge, deploy, live-data action,
  credential action, and destructive operation remains outside normal agent
  authority.
- **REQ-006:** All changed canonical documents, navigation, registry, workflow,
  roster, and templates must agree on the above behavior and identify canonical
  versus derived artifacts.

## Acceptance Criteria

- **AC-001 [req=REQ-001]:** `governance/lifecycle.md`, the SDD protocol, session
  bootstrap, Work Block template, tasklist template, and a new requirements
  review template consistently define proportional Define-quality use and the
  requirement/enabling/assurance/documentation task distinction.
- **AC-002 [req=REQ-002]:** Every new Define-quality reference preserves the
  existing authority order and explicitly says it cannot grant write authority.
- **AC-003 [req=REQ-003]:** A canonical decision-provenance contract is present,
  registered, and linked from lifecycle/Work Block guidance with a bounded
  applicability rule.
- **AC-004 [req=REQ-004]:** Authority, roster, and workflow documentation state
  that isolation/capability are evidence rather than permission and preserve the
  project isolation terminology.
- **AC-005 [req=REQ-005]:** No changed document permits autonomous publication or
  changes an Owner-controlled external Hard Stop.
- **AC-006 [req=REQ-006]:** Registry and map reflect every newly introduced
  canonical template or governance file; targeted Markdown/YAML/JSON and
  cross-reference checks complete without errors.

## Explicit Non-Goals

- Add or change source-write enforcement, hooks, validators, schemas, bootstrap,
  runtime configuration, skills, dependencies, or external integrations.
- Reconcile, stage, delete, or reinterpret existing untracked/staged legacy
  authorization plans and reports.
- Commit, publish, merge, deploy, or modify production/runtime data.

All listed external Hard Stops remain forbidden in this Work Block. In particular,
any `git push` remains an Owner-controlled publication action.

P2 delivery is not started. Any delivery, index reconciliation, commit, push, or
deployment requires a separate approved Work Block and does not follow from this
documentation-only closeout.

## Provenance

- **Classification:** `adapted`
- **Source:** local framework checkout at
  `9eaffcb1848f29d0e24a8f89c6b9ce1afdca51fe`, in particular
  `governance/define-quality.md` and `governance/decision-provenance.md`.
- **Local delta:** applies the generic contracts only to formal AzurSysTech Work
  Blocks, retains schema-v3 `github_capability`, maps terminology to the existing
  isolation tiers, and preserves the stricter Owner-controlled publication rule.
- **Rationale:** AzurSysTech already has a mature runtime-neutral control plane;
  selective documentation alignment is safer than importing framework
  self-hosting, runtime, release-state, or candidate-kit material.
- **Novelty claim:** none.

## Open Decisions

None. Automated traceability enforcement is deliberately deferred to a separate
implementation Work Block because it would change gate behavior.
