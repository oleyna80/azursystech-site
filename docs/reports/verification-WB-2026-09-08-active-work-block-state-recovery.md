---
artifact_type: verification_report
work_block_id: WB-2026-09-08-active-work-block-state-recovery
status: approved
revision: amendment-recovery-v2
---

# Verification — active Work Block state recovery

- **Verdict:** READY
- `python3 scripts/validate-define-traceability.py --spec docs/specs/WB-2026-09-08-active-work-block-state-recovery.md --tasks docs/tasklist/WB-2026-09-08-active-work-block-state-recovery.tasklist.md` → READY (10 requirements, 10 acceptance criteria, 9 tasks).
- `python3 scripts/test-active-work-block-recovery.py` → OK; missing,
  malformed, corrupt, active, inactive, wrong-repository, template-integrity,
  atomicity, and normal-hook fail-closed cases passed.
- `python3 scripts/test-github-capability-control-plane.py` → PASS=14 FAIL=0,
  including active allow, valid terminal allow, requested terminal denials,
  and literal-command protections.
- AST syntax parse and `git diff --check` → OK.

The checks are deterministic local evidence; no merge, deployment, or `main`
repair was performed.
- `python3 scripts/test-github-capability-control-plane.py` → PASS=14 FAIL=0,
  preserving the terminal-publication regression suite.
