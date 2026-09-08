---
artifact_type: review_report
work_block_id: WB-2026-09-08-active-work-block-state-recovery
status: approved
revision: amendment-terminal-publication-v1
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
