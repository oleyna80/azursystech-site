---
artifact_type: work_block
work_block_id: WB-2026-09-03-lifecycle-inactive-closeout-coordination-reconciliation
status: in_progress
revision: v1
---

# Work Block Plan: Lifecycle Inactive Closeout Coordination Reconciliation

## Authority and Result

The Owner authorized implementation, local commit, publication, and merge of
this bounded repair. Deployment remains explicitly excluded. The result is a
branch whose canonical inactive closeout can be committed without reopening a
source-write gate solely for release-state index updates.

## Write Set and Ownership

One Coder owns these paths:

- `.agent/active-work-block.json`
- `.agent/active-work-block.default.json`
- `.claude/hooks/work_block_gate.py`
- `.codex/hooks/pre_tool_use_policy.py`
- `.codex/scripts/lifecycle.py`
- `scripts/validate-installation-profile.py`
- `scripts/test-release-state-contracts.py`
- `.agent/workflows/sdd-protocol.md`
- `governance/artifacts.md`
- `scripts/test-github-capability-control-plane.py`
- `FILE_REGISTRY.yml`, `PROJECT_MAP.md`
- `docs/specs/WB-2026-09-03-lifecycle-inactive-closeout-coordination-reconciliation.md`
- `docs/plans/WB-2026-09-03-lifecycle-inactive-closeout-coordination-reconciliation.md`
- `docs/tasklist/WB-2026-09-03-lifecycle-inactive-closeout-coordination-reconciliation.tasklist.md`
- `docs/reports/**`

## Execution Plan

1. Open a branch-bound Controlled Work Block after Define review and critic
   approval; preserve the already dirty predecessor closeout artifacts.
2. Add the two exact release-state metadata paths to the canonical coordination
   list in every owner of that list; do not add directory or wildcard authority.
3. Extend the deterministic regression for simultaneous `FILE_REGISTRY.yml`,
   `PROJECT_MAP.md`, and documentation closeout staging and commit behavior,
   retaining source-denial and stale-binding coverage. Keep release-state
   adversarial fixtures synchronized when they model an active Work Block.
4. Run the required regression and release-state matrix, then obtain independent
   read-only Review and Verification and perform Drift reconciliation.
5. While the Work Block remains active and READY, locally commit implementation
   and Stage-2 evidence, including every source-path change. Then close to the
   canonical inactive state and make a separate local commit containing only
   declared coordination closeout artifacts. Record both exact SHAs before
   pushing, observe required CI, and merge only through the protected-branch
   workflow after it is ready. Do not deploy.

## Risks

- Divergent copies of the list could invalidate canonical-state detection; the
  regression must exercise each owner.
- Adding broad patterns could permit source writes while inactive; only exact
  root metadata paths are permitted.
- GitHub/CI or merge policy may block publication independently of local proof;
  this is reported rather than bypassed.
