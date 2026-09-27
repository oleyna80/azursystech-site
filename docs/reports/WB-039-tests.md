---
artifact_type: maintenance_bootstrap_evidence
work_block_id: WB-039
specification: docs/specs/WB-039.md
revision: v3
status: MAINTENANCE_BOOTSTRAP
base_commit: c4829e77e2e9ae6a694a7def87b381c54571fd6d
audit_ref: b7a980f871e26817a52bab554a2b9fd93202712a
---

# WB-039 maintenance bootstrap evidence

This batch ran under the Owner-authorized Maintenance Bootstrap window recorded
in the audit SSOT. It claims no normal lifecycle OPEN and no Critic approval;
Critic capacity is recorded as unavailable in `docs/reports/WB-039-critic.md`.

## Base and scope

- repository `azursystech`, branch `fix/sdlc-publication-bootstrap-039`;
- base and unchanged HEAD `c4829e77e2e9ae6a694a7def87b381c54571fd6d`;
- maintenance state bound to that identity, branch, base, and the 16-path
  control-plane scope in the spec write-set;
- maintenance deactivated after the batch: `enabled: false`, `activated_at: null`.

## Changed paths

- `.claude/settings.json` — all four hook commands resolve from
  `$CLAUDE_PROJECT_DIR` and report an unresolvable entrypoint as
  `[hook-wiring-failure]` (exit 2) instead of a policy denial;
- `.claude/hooks/assurance_gate.py` — an inactive Work Block no longer blocks
  session termination; an active unresolved Work Block keeps enforcement unless
  the shared evaluator downgrades `lifecycle_sequencing` to AUDIT/WARN;
- `.claude/hooks/work_block_gate.py` — quote-aware redirect and mutating
  detection (`unquoted_view`, `unquoted_redirects`);
- `.codex/hooks/pre_tool_use_policy.py` — same quote-aware parsing plus the same
  maintenance routing helpers and guard-class vocabulary as the Claude adapter;
- `.agent/hooks/tests/test_hook_wiring.py` — new regression module;
- `.claude/hooks/tests/hook-wiring-fixtures.sh` — new shell fixtures;
- `scripts/test-maintenance-mode.py` — discovers both test modules.

## Verification results

| Check | Result |
|---|---|
| `scripts/test-maintenance-mode.py` | 16 tests OK (9 new wiring, 7 maintenance) |
| `.claude/hooks/tests/hook-wiring-fixtures.sh` | PASS=9 FAIL=0 |
| `.claude/hooks/tests/gate-fixtures.sh` | PASS=61 FAIL=0 |
| `.claude/hooks/tests/hard-stop-fixtures.sh` | PASS=19 FAIL=0 |
| `.codex/hooks/tests/gate-fixtures.sh` | PASS=61 FAIL=0 |
| `.codex/hooks/tests/hard-stop-fixtures.sh` | PASS=19 FAIL=0 |
| control-plane tests | PASS=19 FAIL=0 |
| Define traceability | READY — 10 requirements, 16 acceptance, 13 tasks |
| Python compilation | PASS |
| `git diff --check` | clean |
| settings JSON validity | valid |
| adapter parity (in-scope / out-of-scope Edit event) | identical decisions and reasons |
| normal enforcement after deactivation | source write DENY in both adapters; evaluator DENY |
| Git conformance | BLOCKED — `subject has no commits beyond trusted default ancestor` (pre-existing; no commit is made by this batch) |

## Downgraded decisions

26 audited downgrades, all `guard_class=inactive_coordination`, every record
carrying `normal_lifecycle_approval: false`. The other seven configured classes
are covered by the unit suite but were not exercised by real writes in this
window. Audit records grant no authority and are never read as approval.

## Findings

1. Quoted-text false positives were wider than redirection: a quoted `->` and a
   quoted `merge` both triggered denials. Redirect, mutating, and separator
   detection are now quote-aware; `maintenance_immutable_command` stays
   deliberately textual and fail-closed because widening it would weaken an
   immutability guard.
2. A genuine unquoted `2>/dev/null` still resolves outside the repository and is
   denied. Fail-closed behaviour is preserved; this is friction for the next
   batch, not a defect fixed here.
3. The shared Git dispatch policy denies any `bash -c` / `sh -c` command
   outright, which is broader than the direct-single-Git rule.
4. The Codex adapter omits the legacy top-level `"continue": false` field that
   the Claude adapter emits; decisions and reasons are equivalent.
5. The Codex `apply_patch` path cannot consult the evaluator when patch headers
   expose no paths, so that denial has no downgrade route.

## Runtime coverage

The Claude runtime consumes the shared evaluator for PreToolUse, PostToolUse,
and Stop classes. The Codex runtime consumes it for PreToolUse; Codex configures
no Stop hook, so the Stop class is explicitly unsupported there rather than
duplicated. Cross-runtime parity was verified by direct hook invocation from
this repository; reverification from inside a Codex session remains open.

## Residual blockers

- Critic remains unavailable; no normal lifecycle approval is claimed.
- Git conformance stays blocked until a commit exists beyond the trusted
  ancestor, which is an Owner-controlled publication decision.
