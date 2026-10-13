# Agentic SDLC v1 — P0 Documentation Reconciliation

**Status:** P0 changes implemented as an isolated GitHub-only documentation candidate. **Independent review, native runtime checks and CI NOT VERIFIED.**

- Repository: `oleyna80/azursystech-site`
- Frozen base/main: `49e976aefc29402b2e1578efbe64768dd5c30b41`
- Candidate branch: `docs/sdlc-v1-p0-reconciliation-2026-10-13`
- Owner authorization: 2026-10-13 — begin P0 documentation corrections only, no merge or deployment
- Independent source audit: [27 findings, 8 HIGH](https://github.com/oleyna80/azursystech-site/blob/0ba68b423c9b159981fc01ecd4473372b649a510/docs/reports/sdlc-v1-documentation-conflict-audit-2026-10-13.md)

## Goal and authority boundary

Align live descriptions of scope, Controller state, assurance and publication with installed Controller v1, while **retaining** historical schema-v3 release-state compatibility records and validators unchanged. Human policy: `AGENTS.md`, `governance/authority.md`. Executable runtime: trusted external active admission, common-dir trusted installation config, per-worktree Git-private schema-v2 Controller state, and Controller v1 API. Missing state is not `INACTIVE`.

The current v1 lifecycle is `INACTIVE → DEFINE → EXECUTE → ASSURE → INACTIVE`. Process Close is not a separate live state. Normal successful delivery uses exact-assured-candidate Reviewer/Verifier bindings and trusted publish with verified remote tip and immutable provenance; direct Git push alone is insufficient.

## Scope delivered

1. `governance/lifecycle.md` — installed Controller v1 precedence and exact state model; process closeout distinguished from live state; old schema-v3 transitions marked historical.
2. `governance/release-state.md` — tracked operational schema-v3 JSON reclassified explicitly as legacy repository/CI release projection, not live Controller v1 authority; legacy validator requirements retained.
3. `governance/define-quality.md` — retained requirements-quality/traceability/consistency methodology and evidence, removed implication that `define_quality` schema-v3 machine aggregate is the installed v1 admission gate.
4. `governance/artifacts.md` — documented that process closeout and projections do not grant inactive-state writes.
5. `FILE_REGISTRY.yml` — corrected `agent_behavior` navigation and legacy file classifications; `migration_state` and schema retained.
6. `.agent/workflows/owner-controlled-github-flow.md` — replaced pre-v1 raw-push/terminal publication instructions with trusted Controller publish, exact SHA/provenance and hard-stop boundaries.
7. `docs/templates/work-block-template.md` — introduced explicit v1 admission, state, planning SHA, candidate SHA, independent assurance bindings and publication evidence fields.
8. `docs/templates/verification-report-template.md` — distinguished Verifier evidence from trusted binding and removed obsolete reporting-only Stage 3 instruction.

The nine-file change set is these eight files plus this P0 report. No source code, Controller, hooks, CI workflows, runtime configs, production authority records or tracked schema-v3 JSON was modified.

## Audit findings addressed or bounded

- Addressed directly: **DOC-001, DOC-002, DOC-003, DOC-004, DOC-007, DOC-008, DOC-009, DOC-010**.
- **DOC-005/DOC-006** (git-orchestration-flow canonical/mirror skills) remain **P1**, not silently claimed fixed. Other role, OpenCode, capability, runtime index, missing links and historical cleanup findings remain P1/P2/P3 as prioritized by the audit.
- Existing `.agent/workflows/sdd-protocol.md` explicitly labels its pre-v1 historical body non-authoritative. No archival deletion was attempted.
- The operational smoke's sandbox, missing Codex hook-dispatch scenario, Claude global-plugin metadata drift, credentials and restricted-egress concerns are **not** resolved by this documentation correction.

## Evidence and limits

- Authoring method: connected GitHub connector, immutable reads at the frozen main commit, explicit text replacement of unique original anchors, branch-scoped commits.
- Source-only checks: each replaced section existed exactly once at the baseline, changed paths were explicitly scoped, and no intended behavior changes were made to source code.
- **Not run:** `scripts/validate-release-state.py`, `scripts/test-release-state-contracts.py`, YAML parsing/semantic validators, GitHub CI, runtime hooks, production tests and independent assurance roles. A GitHub-only edit must not be represented as passing these gates.
- Next acceptance: independent Reviewer should compare actual diff against the frozen audit, inspect `FILE_REGISTRY.yml` consumers, legacy release-state CI, current Controller v1 terminology and Markdown references. Result remains **REVIEW REQUIRED**, not `READY`.
- No PR, merge or local `git pull` authorized under this change. Owner decides integration separately.

## Remaining risks

This candidate changes normative documentation and registry metadata; its effect on any downstream YAML/schema/CI consumer has not been executed or verified. Any dependency failure requires a bounded revision and renewed review, not weakening Controller authority or silently changing runtime code.
