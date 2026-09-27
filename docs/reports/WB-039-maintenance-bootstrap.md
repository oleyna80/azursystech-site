# WB-039 Maintenance Bootstrap Evidence

Status: BLOCKED_PARTIAL_EXTERNAL_CAPABILITY
Date: 2026-09-27
Base: c4829e77e2e9ae6a694a7def87b381c54571fd6d
Branch: fix/sdlc-publication-bootstrap-039
Audit contract: ae0b7b1485b0c2c68a70fd844b6cd140b8116777
Normal lifecycle approval: false

## Implemented

- Added the shared runtime-neutral evaluator in .agent/hooks/maintenance_mode.py.
- Added explicit disabled-by-default state in .agent/maintenance-mode.json.
- Added append-only audit records in .agent/maintenance-mode.audit.jsonl.
- Added focused unit coverage for disabled behavior, exact repository/branch/base/scope binding, wrong repository, wrong branch, wrong base, out-of-scope paths, malformed state, immutable hard stops, audited cooperative decisions, and deactivation.
- Wired .claude/hooks/work_block_gate.py to the shared evaluator for the named cooperative classes:
  inactive_coordination, source_write_gate, post_freeze_staging,
  verified_same_repository_handoff, direct_single_git, and
  complex_mutating_bash.
- The Claude adapter preserves its existing hard-stop delegation for push and other consequential Git transitions.

## Evidence

- python3 -m unittest discover -s .agent/hooks/tests -p test_maintenance_mode.py - 7 tests passed.
- python3 scripts/test-maintenance-mode.py - 7 tests passed.
- python3 -m py_compile .agent/hooks/maintenance_mode.py .claude/hooks/work_block_gate.py scripts/test-maintenance-mode.py - passed.
- bash .claude/hooks/tests/hard-stop-fixtures.sh - PASS=19 FAIL=0.
- bash .claude/hooks/tests/gate-fixtures.sh - PASS=61 FAIL=0.
- python3 scripts/test-github-capability-control-plane.py - PASS=19 FAIL=0.
- python3 scripts/test-git-conformance.py - PASS=25 FAIL=0.
- validate-define-traceability.py - READY (6 requirements, 8 acceptance criteria, 7 tasks).
- No WB-038-specific E2E harness or B-006/B-007 runner is present in this
  checkout; the available fixture/conformance suites above were run instead.
- Audit record shows a downgraded cooperative decision with
  normal_lifecycle_approval: false.
- State was deactivated after probing; the checked-in state remains disabled and
  keeps the exact WB-039 path scope, authorization reference, cooperative class
  list, and canonical hard-stop list.

## Blocking capability

The repository submount .codex is read-only:

findmnt -T .codex/hooks/pre_tool_use_policy.py -o TARGET,FSTYPE,OPTIONS
reports .../.codex ext4 ro,nosuid,nodev,relatime.

The existing Codex adapter therefore could not be updated in this checkout.
Attempts to write or apply a patch to
.codex/hooks/pre_tool_use_policy.py failed with Read-only file system.
No remount, privilege escalation, bypass, force push, merge, deploy, or
production mutation was attempted.

Because the Codex adapter remains unchanged, WB-039 is not complete and no
normal lifecycle OPEN, READY, Reviewer, Verifier, or closeout claim is
made. The exact remaining change is the same shared-evaluator wiring already
prepared for the Claude adapter, applied to the approved Codex path once the
.codex submount is writable.
