---
artifact_type: review_report
work_block_id: WB-2026-09-08-active-work-block-state-recovery
status: approved
revision: amendment-recovery-v3
---

# Review — active Work Block state recovery

- **Verdict:** READY
- **Scope:** lifecycle producer, release-state validator, recovery helper,
  deterministic fixtures, and coordination projections.
- **Finding:** `lifecycle.py` already creates fresh inactive state; the
  validator now rejects residual subject/base/write-set authority when the
  release projections are inactive.
- **Boundary:** no application, dependency, database, deployment, default
- **Amendment review:** shared hard-stop policy retains the existing active
  predicate and adds a fail-closed ancestry check; wrapper, chaining,
  substitution, source-path, wrong-parent, missing-READY, and second-commit
  regressions are covered.
  branch, merge, or hook-bypass change was found.
- **Regression quality:** positive closeout materialization and negative stale
  authority cases are deterministic and readable.
- **Corrective review:** recovery now handles missing, malformed, and corrupt
  records; refuses valid active state; no-ops canonical inactive state; derives
  the repository from Git cwd; and exposes no arbitrary writer parameters.
- **Durability review:** the canonical producer loads
  `.agent/active-work-block.default.json`, and persistence performs file fsync,
  atomic replace, and parent-directory fsync.
- **Focused review:** `repository_root()` compares the resolved root of its
  own script with the resolved cwd worktree and requires AzurSysTech markers;
  a genuine foreign Git repository cannot become a recovery target. Template
  validation rejects residual specification and integration/admission identity
  before recovery can read, create, or replace operational state.
