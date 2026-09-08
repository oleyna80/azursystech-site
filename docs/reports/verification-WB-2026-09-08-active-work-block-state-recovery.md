---
artifact_type: verification_report
work_block_id: WB-2026-09-08-active-work-block-state-recovery
status: approved
revision: amendment-recovery-v3
---

# Verification — active Work Block state recovery

- **Verdict:** READY
- `python3 scripts/validate-define-traceability.py --spec docs/specs/WB-2026-09-08-active-work-block-state-recovery.md --tasks docs/tasklist/WB-2026-09-08-active-work-block-state-recovery.tasklist.md` → READY (10 requirements, 10 acceptance criteria, 9 tasks).
- `python3 scripts/test-active-work-block-recovery.py` → OK; missing,
  malformed, corrupt, active, inactive, missing-marker, real foreign Git
  repository, unsafe-valid template without replacement, atomicity, and
  normal-hook fail-closed cases passed.
- `python3 scripts/test-github-capability-control-plane.py` → PASS=14 FAIL=0,
  including active allow, valid terminal allow, requested terminal denials,
  and literal-command protections.
- AST syntax parse and `git diff --check` → OK.

The checks are deterministic local evidence; no merge, deployment, or `main`
repair was performed.
- `python3 scripts/test-github-capability-control-plane.py` → PASS=14 FAIL=0,
  preserving the terminal-publication regression suite.

Focused v3 verification additionally used
`PYTHONPYCACHEPREFIX=/tmp/active-work-block-recovery-pycache python3 -m py_compile`
for the changed Python files and `git diff --check` → OK. Release-state
validation is intentionally deferred until success-closeout because an opened
Work Block correctly makes the interim active candidate ineligible.
