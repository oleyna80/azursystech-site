---
artifact_type: work_block_plan
status: implementation_verified_publication_blocked
work_block_id: WB-039
scope: planning-only
not_active_work_block: true
architecture_freeze: v0.6
strategy: maintenance_mode
---

# WB-039 — SDLC Maintenance Mode / Repair Bootstrap

## Objective

Introduce an explicit Owner-controlled Maintenance Mode for SDLC control-plane remediation.

The purpose is to let agents repair the control plane without being blocked by the cooperative local guards whose own implementation is under repair, while keeping consequential Owner/external hard stops fully enforced.

WB-039 does **not** repair all SDLC defects itself.

It establishes the safe repair window in which the subsequent remediation batches can run.

## Architecture binding

Normative architecture remains Architecture Freeze v0.6.

Implementation strategy is defined by:

- `docs/architecture/sdlc-maintenance-mode.md`;
- `docs/architecture/sdlc-remediation-plan.md`;
- `docs/architecture/sdlc-authority-control-model.md`;
- WB-038 baseline findings in the audit branch.

This Work Block changes implementation strategy, not frozen architecture.

## Why WB-039 changed

WB-038 proved a self-hosting publication deadlock.

The initial narrow WB-039 plan attempted to repair only candidate/index publication while remaining fully constrained by the old cooperative guard system.

Subsequent work showed that other cooperative controls also create remediation friction, including:

- session-root blocking of deliberate worktree handoff;
- direct-single-Git-command restriction;
- complex mutating Bash restriction;
- inactive/OPEN/freeze write-gate restrictions around control-plane repair.

The previous WB-039 plan was never OPEN and changed no production source.

It is therefore superseded before implementation.

## Desired end state

WB-039 succeeds when the repository has one explicit maintenance-mode mechanism with these properties:

- activation is Owner-controlled;
- activation is bound to an exact repository, remediation branch/worktree, trusted base, and bounded control-plane scope;
- cooperative local guards can switch from ENFORCE to AUDIT/WARN for the maintenance scope;
- hard external/Owner boundaries remain ENFORCED;
- every downgraded decision is logged;
- no operation can silently claim normal lifecycle approval while maintenance mode is active;
- mode can be deactivated deterministically;
- normal enforcement remains the default outside the maintenance scope.

## Always-enforced boundaries

WB-039 must not weaken:

- force/non-fast-forward push prohibition;
- merge boundary;
- deploy/release boundary;
- default/protected branch mutation boundary;
- secrets/credentials boundary;
- live production data boundary;
- production infrastructure boundary;
- destructive Git/filesystem operations unless separately Owner-authorized;
- irreversible external side effects;
- arbitrary cross-repository writes.

## Cooperative controls eligible for maintenance downgrade

Within the exact maintenance scope only, WB-039 may provide AUDIT/WARN behavior for:

- inactive-WB coordination-only restriction;
- source `write_gate=READY` requirement for local remediation edits;
- post-freeze staging denial when exercising a maintenance repair transition;
- normal lifecycle sequencing rules whose implementation is under repair;
- direct-single-Git-command restriction;
- complex mutating Bash restriction;
- session-root/worktree binding for deliberate verified handoff inside the same repository;
- candidate/terminal sequencing checks whose implementation is explicitly being repaired.

The implementation must make this classification explicit rather than scatter ad-hoc exceptions across runtime adapters.

## Recommended implementation direction

Prefer one shared runtime-neutral maintenance policy signal consumed by existing shared policy/lifecycle layers.

Do not implement separate maintenance semantics independently in Codex and Claude adapters.

A concrete mechanism may be a small authoritative maintenance-state artifact or equivalent bounded configuration, provided it includes at least:

- schema/version;
- enabled/disabled state;
- repository identity;
- subject/remediation branch;
- trusted base;
- allowed path scope;
- activated-by / Owner approval reference;
- activation reason;
- activation timestamp/date metadata;
- allowed downgraded guard classes;
- immutable always-enforced hard-stop classes.

Exact file/module placement is a Define decision after repository inspection.

## Admission model

WB-039 itself may require a one-time bootstrap because the current normal lifecycle can block the work required to introduce Maintenance Mode.

The Owner has approved the **strategy**, not arbitrary implementation.

During Define:

- prepare the exact bounded implementation scope;
- document the bootstrap activation procedure;
- distinguish normal reversible local writes from consequential boundaries;
- obtain Critic review when an independent reviewer is available.

If runtime capacity prevents Critic execution, that alone must not indefinitely block this maintenance-bootstrap Work Block.

Any work performed before normal lifecycle OPEN must be explicitly marked as Maintenance Bootstrap work and must not claim normal lifecycle approval.

## Implementation plan

1. Reconcile/replace the previous local WB-039 Define artifacts with this plan.
2. Identify the minimum shared policy/lifecycle locations required to represent Maintenance Mode.
3. Add an explicit maintenance state/config contract.
4. Add one shared evaluator that distinguishes:
   - hard stop → DENY;
   - cooperative normal guard under active maintenance scope → AUDIT/WARN;
   - ordinary allowed operation → ALLOW.
5. Wire runtime adapters/hooks to consume the shared decision without duplicating policy.
6. Add structured audit logging for downgraded decisions.
7. Add positive and negative tests proving:
   - mode applies only to the exact remediation scope;
   - mode does not follow the agent into unrelated repositories/worktrees;
   - hard stops remain denied;
   - cooperative guards become non-blocking only when explicitly enabled;
   - disabling the mode restores normal enforcement.
8. Run focused tests.
9. Run the existing WB-038 harness where practical to verify that maintenance operations are no longer blocked merely by cooperative guardrails.
10. Record exact activation/deactivation procedure for subsequent remediation batches.

## Acceptance criteria

- AC-001: Maintenance Mode is explicit, Owner-controlled, and disabled by default.
- AC-002: mode is bound to exact repository/remediation scope and cannot silently apply elsewhere.
- AC-003: external/Owner hard stops remain enforced while the mode is active.
- AC-004: selected cooperative guards can be downgraded to AUDIT/WARN without being deleted or bypassed.
- AC-005: downgraded decisions produce durable/structured audit evidence.
- AC-006: runtime adapters do not implement divergent maintenance policies.
- AC-007: mode activation/deactivation is deterministic and testable.
- AC-008: deliberate same-repository worktree handoff is not blocked solely by stale session-root binding when maintenance scope is valid.
- AC-009: local reversible control-plane repair is not blocked solely by inactive/write-gate/command-shape cooperative guards.
- AC-010: normal enforcement is restored when maintenance mode is disabled.
- AC-011: no force push, merge, deploy, production mutation, or secret mutation is enabled.
- AC-012: WB-039 produces a documented maintenance activation procedure for the next remediation batch.
- AC-013: an unresolved active Work Block does not force authoritative lifecycle mutation merely to terminate/restart an agent session.
- AC-014: cooperative shell-policy parsing does not treat quoted occurrences such as `2>/dev/null` inside search text as actual write targets.
- AC-015: Claude runtime hook commands remain resolvable after session/tool cwd changes away from repository root.
- AC-016: a missing/unresolvable hook entrypoint is reported as runtime wiring failure rather than being conflated with a policy denial.

### Runtime wiring paths

The WB-039 Define write-set may include runtime wiring/configuration paths strictly required to make Maintenance Mode robust, including:

- `.claude/settings.json` for project-root-stable hook invocation;
- `.claude/hooks/work_block_gate.py`;
- `.codex/hooks/pre_tool_use_policy.py` when writable from the active runtime;
- shared runtime-neutral maintenance evaluator/state/test paths.

A general `CLAUDE.md` documentation rewrite is out of scope for WB-039.

## Verification

Required tests should include:

- mode disabled → current enforcement behavior unchanged;
- wrong repository → DENY;
- wrong branch/worktree scope → DENY;
- path outside maintenance scope → DENY;
- force push → DENY;
- default/protected branch mutation → DENY;
- merge/deploy/live-production classes → DENY;
- session-root mismatch to verified same-repo maintenance checkout → AUDIT/WARN or explicit maintenance handoff;
- inactive/write-gate local repair operation in scope → AUDIT/WARN;
- maintenance disabled after repair → normal guard behavior restored;
- active unresolved WB + agent session stop/restart → no lifecycle-state mutation required;
- quoted/search-text redirection tokens → no false write-path classification;
- change cwd to a nested repository directory → PreToolUse/PostToolUse/Stop hook entrypoints still resolve from the project root;
- deliberately invalid hook path fixture → explicit wiring failure classification, not ordinary policy denial.

## Completion boundary

After Maintenance Mode is implemented and its guard classification is verified:

- stop WB-039;
- report exact branch/HEAD and activation mechanism;
- do not automatically begin the next remediation batch;
- the next approved batch is Git Transaction / Index Recovery under Maintenance Mode.

## Out of scope

WB-039 does not itself implement:

- `MATERIALIZE_CANDIDATE_PACKAGE`;
- `REBUILD_CANDIDATE_INDEX`;
- Contract Reader;
- terminal transaction redesign;
- assurance/evidence cleanup;
- broad hook simplification beyond the minimum shared maintenance routing;
- final CI hardening;
- merge/deploy/release.


## Owner bootstrap authorization — 2026-09-27

Owner authorized WB-039 to begin as the Maintenance Mode bootstrap.

This authorization exists because the current cooperative guard implementation may prevent the normal lifecycle from opening or editing the files required to introduce Maintenance Mode.

Authorized local activity is limited to:

- replacing/reconciling the stale pre-maintenance WB-039 Define artifacts;
- implementing the minimum shared Maintenance Mode mechanism;
- adding focused tests and audit evidence;
- performing reversible local control-plane edits inside the exact WB-039 remediation scope;
- downgrading eligible cooperative guards only as required to bootstrap and verify Maintenance Mode.

This bootstrap authorization does **not** permit:

- force/non-fast-forward push;
- merge;
- deploy/release;
- protected/default branch mutation;
- secrets/credentials changes;
- live production data or infrastructure mutation;
- destructive cleanup/reset;
- arbitrary cross-repository writes.

Any operation performed under this bootstrap must be explicitly recorded as Maintenance Bootstrap work and must not claim normal lifecycle approval.

When the Maintenance Mode mechanism is functional, subsequent repair batches must use its explicit scoped activation rather than ad-hoc exceptions.


## Implementation progress — 2026-09-27

Status: **partial implementation complete; blocked on Codex adapter self-modification boundary**.

Operator-reported local WB-039 result:

- branch: `fix/sdlc-publication-bootstrap-039`;
- HEAD/base remains `c4829e77e2e9ae6a694a7def87b381c54571fd6d`;
- normal lifecycle remains inactive; no normal OPEN is claimed;
- Critic remained unavailable due external runtime usage limits;
- work proceeded only under Owner-authorized Maintenance Bootstrap;
- no force push, merge, deploy, production mutation, privilege escalation, or remount was used.

Implemented locally:

- shared runtime-neutral evaluator: `.agent/hooks/maintenance_mode.py`;
- disabled-by-default state: `.agent/maintenance-mode.json`;
- structured append-only maintenance audit log;
- exact repository/branch/base/path-scope binding;
- 8 cooperative guard classes;
- 15 immutable hard-stop classes;
- explicit `AUDIT` result with `normal_lifecycle_approval=false`;
- deterministic deactivate behavior;
- fail-closed handling for malformed state, repository/branch/base/scope mismatch, and path traversal;
- Claude adapter integration in `.claude/hooks/work_block_gate.py`.

Reported verification:

- Maintenance Mode tests: 7 passed;
- hard-stop fixtures: PASS=19 FAIL=0;
- gate fixtures: PASS=61 FAIL=0;
- control-plane tests: PASS=19 FAIL=0;
- Git conformance: PASS=25 FAIL=0;
- Define traceability: READY;
- Python compilation: PASS;
- `git diff --check`: PASS;
- disabled-mode probe preserved normal inactive-lifecycle source-write denial.

Residual blocker:

Inside the Codex runtime namespace, `.codex` is mounted read-only. Therefore the Codex adapter `.codex/hooks/pre_tool_use_policy.py` could not be connected to the shared evaluator from that same Codex session.

WB-039 is not complete until the Codex adapter is updated out-of-band or from a writable runtime/context and the cross-runtime behavior is reverified.

The implementation was performed against audit head `ae0b7b1485b0c2c68a70fd844b6cd140b8116777`. Before completion it must reconcile with later audit additions, including the session-stop/lifecycle-integrity and quoted-redirection parser regressions.


## Owner activation decision — 2026-09-27

For the remaining WB-039 source-level bootstrap edits, use the explicit **Maintenance Mode** route rather than forcing a normal lifecycle OPEN.

Reason:

- WB-039 exists specifically because the current normal lifecycle/guard implementation blocks repair of that same control plane;
- fabricating or downgrading Critic/lifecycle state to obtain normal OPEN would misrepresent normal lifecycle approval;
- manual patch-only handoff is unnecessary because the bounded maintenance mechanism is already the approved bootstrap strategy.

Activation requirements:

- enable Maintenance Mode only for the exact WB-039 repository/branch/base/path scope;
- record all downgraded cooperative decisions with `normal_lifecycle_approval=false`;
- keep immutable hard-stop classes enforced;
- do not set Critic to SKIPPED merely to obtain normal OPEN;
- do not claim normal lifecycle OPEN for bootstrap work;
- deactivate Maintenance Mode deterministically after the WB-039 implementation/verification step;
- verify normal enforcement is restored after deactivation.

This decision authorizes the bounded activation needed to complete WB-039. It does not authorize merge, deploy/release, force push, protected/default branch mutation, secrets, production mutation, privilege escalation, remount, or destructive cleanup.


## Final local implementation result — 2026-09-27

Status: **implementation verified locally; publication/commit blocked by existing Git-native control path**.

Operator-reported final WB-039 state:

- Maintenance Mode was activated under explicit Owner authorization for the exact WB-039 repo/branch/base/path scope;
- all downgraded decisions were logged with `normal_lifecycle_approval=false`;
- Critic was not downgraded or marked SKIPPED to obtain normal OPEN;
- normal lifecycle OPEN was not claimed;
- Maintenance Mode was deterministically deactivated after verification;
- final state is `enabled=false`, `activated_at=null`;
- normal source-write enforcement is restored in both Claude and Codex adapters;
- no force push, merge, deploy, remount, privilege escalation, or production mutation occurred.

Implemented and verified locally:

- cwd-stable Claude hook entrypoints using the project-root binding;
- explicit hook-wiring-failure classification;
- Stop/session integrity: canonical inactive state may terminate without lifecycle mutation; active unresolved state remains enforced unless explicitly downgraded by Maintenance Mode;
- quote-aware redirect/MUTATING/separator parsing in Claude and Codex adapters;
- Codex adapter integration with the shared runtime-neutral Maintenance Mode evaluator;
- cross-runtime parity for equivalent in-scope/out-of-scope events;
- durable Python and shell regression coverage.

Reported post-change verification:

- `scripts/test-maintenance-mode.py`: 16 tests OK;
- hook-wiring fixtures: PASS=9 FAIL=0;
- Claude gate fixtures: PASS=61 FAIL=0;
- Codex gate fixtures: PASS=61 FAIL=0;
- Claude hard-stop fixtures: PASS=19 FAIL=0;
- Codex hard-stop fixtures: PASS=19 FAIL=0;
- control-plane tests: PASS=19 FAIL=0;
- Define traceability: READY — 10 requirements / 16 acceptance criteria / 13 tasks;
- Python compilation: PASS;
- `git diff --check`: clean;
- JSON validation: valid;
- adapter parity: in-scope both ALLOW, out-of-scope both DENY with equivalent reason.

Residual publication boundary:

The source changes still cannot be committed through the current normal/inactive Git path.

Two independent barriers remain:

1. the Work Block/source staging gate rejects source staging in canonical inactive state;
2. the Git-native pre-commit transaction policy rejects any inactive commit containing paths outside the coordination write-set.

The Git-native commit layer does not currently consume the Maintenance Mode evaluator, so activating Maintenance Mode cannot make the verified WB-039 implementation durable through the normal commit path.

This is now the only blocking boundary for making WB-039 durable. The implementation itself is locally complete and verified.

Do not misclassify this as failed Maintenance Mode behavior: the mode correctly repairs runtime cooperative adapters, but the Git-native transaction layer is a separate control plane that belongs to the next remediation concern.

Before starting the normal Git Transaction / Index Recovery batch, WB-039 requires one explicit Owner-controlled bootstrap publication decision.


## Owner one-time commit bootstrap authorization — 2026-09-27

Owner authorizes one exact local commit bootstrap for the verified WB-039 implementation.

This authorization is limited to the following 17 paths:

- `.agent/hooks/maintenance_mode.py`
- `.agent/hooks/tests/test_maintenance_mode.py`
- `.agent/hooks/tests/test_hook_wiring.py`
- `.codex/hooks/pre_tool_use_policy.py`
- `.claude/hooks/work_block_gate.py`
- `.claude/hooks/assurance_gate.py`
- `.claude/settings.json`
- `.claude/hooks/tests/hook-wiring-fixtures.sh`
- `scripts/test-maintenance-mode.py`
- `.agent/maintenance-mode.json`
- `docs/specs/WB-039.md`
- `docs/plans/WB-039.md`
- `docs/tasklist/WB-039.tasklist.md`
- `docs/reports/WB-039-define-quality.md`
- `docs/reports/WB-039-critic.md`
- `docs/reports/WB-039-maintenance-bootstrap.md`
- `docs/reports/WB-039-tests.md`

Explicit exclusions:

- `.agent/maintenance-mode.audit.jsonl`
- all `__pycache__/**` and `*.pyc`
- `.agent/active-work-block.json`
- all WB-037/WB-038 artifacts
- any unrelated path

Precondition:

- branch remains `fix/sdlc-publication-bootstrap-039`;
- HEAD remains `c4829e77e2e9ae6a694a7def87b381c54571fd6d`;
- `.agent/maintenance-mode.json` has `enabled=false` and `activated_at=null`;
- staged path set equals the 17-path allowlist exactly;
- `git diff --cached --check` is clean.

Authorized exceptional commit mechanism:

- Owner may use `git commit --no-verify` once for this exact local commit because the current Git-native pre-commit policy cannot represent the approved Maintenance Bootstrap source commit.
- This does not create agent authority to use `--no-verify` generally.
- The commit message is `WB-039 maintenance mode bootstrap: shared evaluator wiring and hook repair` with trailer `Work-Block: WB-039`.

Publication is **not** authorized by this commit authorization.

After the local commit, the full WB-039 verification battery and Git conformance must be rerun against the new HEAD. Subject-branch push requires a separate Owner decision based on those results.

No force push, merge, deploy, release, protected/default mutation, production mutation, remount, privilege escalation, or history rewrite is authorized.
