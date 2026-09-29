# Focused Critic Closure — SDLC Simplification v1 Implementation-Ready Package

Date: 2026-09-29
Role: Independent pre-code Critic
Reviewed corrected package head: e1c2c8175b3340994295b5ef0aa1e6166fd39a60
Original holistic Critic: cd684f75f97fb860096f16f7deb2994ea036ee8d
Verdict: SUPPLEMENT

## Closure of original Must findings

### M1 — Exact contract consistency
Status: CLOSED.

The corrected contracts now agree on:
- NO_LOCAL_AUTHORITY or canonical INACTIVE as valid open origins;
- atomic critic ready: DEFINE + current committed planning subject -> bind READY -> EXECUTE, with no persisted DEFINE+READY intermediate;
- publish as the only normal successful terminal transition to INACTIVE; close remains reporting-only/cancelled.

### M2 — Reachable material revision
Status: CLOSED.

The package now defines a reachable two-phase revision transaction:

EXECUTE/ASSURE -> revise begin -> DEFINE -> planning edit/commit -> revise bind -> Critic -> EXECUTE.

DEFINE has a derived initiative planning surface, candidate/assurance is cleared on revise begin, revise bind installs the exact committed new planning revision/scopes, and the requested E2E cases are explicit.

### M3 — Trusted admission/run/profile/base binding
Status: CLOSED at architecture/contract level.

The corrected package chose Option A and now defines:
- immutable opaque admission_id in schema v2;
- canonical .agent/policies/autonomy-profiles.json and .agent/policies/admission-rules.json;
- trusted admission-pinned subject branch/profile/base_commit before planning;
- ordinary Work Blocks denied authority over .agent/policies/**;
- external delivery correlation admission_id -> candidate -> publish tip -> PR -> merged/released SHA -> deployed SHA.

### M4 — Logical independence and overlapping writers
Status: CLOSED for the requested contract scope.

Orchestration now explicitly owns logical-role separation and overlapping-writer scheduling without restoring runtime/session/topology authority. Required tests are present.

## New Must — Fix implementation dependency order for trusted admission

The M3 correction introduced a sequencing inconsistency in the implementation plan.

The exact contracts now require trusted admission before planning/open:
- pre-WB planning requires a valid external admission record;
- open validates admission_id/profile/base/subject against that record;
- base_commit is pinned by trusted admission;
- WB-3 happy path starts with trusted admission/base pin.

But the implementation plan currently schedules the trusted admission registry/interface and binding resolver only in WB-4, after:
- WB-1 core controller;
- WB-2 adapters;
- WB-3 E2E transaction/regression harness.

Therefore WB-1/WB-3 depend on a component that the plan says does not exist until WB-4.

Required correction: move only the minimal admission foundation earlier, without moving the full orchestration system.

A minimal sequence is sufficient:

1. before or inside WB-1, define/implement the trusted admission record interface/resolver needed by schema/open/pre-WB policy, plus fixture storage for inert tests;
2. WB-1 consumes that stable interface;
3. WB-2 remains adapters;
4. WB-3 runs real inert admission -> planning -> open E2E through that interface;
5. WB-4 adds the full orchestration runner, role scheduling, external delivery continuation, and higher-autonomy fixtures.

Equivalent reordering is acceptable. The important invariant is that WB-3 must not fake a contract whose production interface is only designed later.

This does not require a new lifecycle state, new authority layer, or redesign of the accepted architecture.

## Non-blocking observation — cross-run overlap

The orchestration contract currently serializes overlapping writers only among active Coders in the same orchestration run.

For the baseline this is acceptable. Before Level 2/3 event concurrency is enabled, explicitly decide whether the one-writer invariant is intended only per run or across simultaneous admitted runs in the same repository. If repository-wide, the trusted admission/orchestration layer needs a lightweight reservation/serialization mechanism. This is not a WB-1 blocker.

## Final assessment

The original four Must findings are closed.

The corrected architecture, state/event model, enforcement contract, autonomy contract, and implementation semantics are coherent and materially simpler than the current live SDLC.

Only one implementation-order correction remains before source implementation: trusted admission must exist before the Work Blocks that require it.

After that plan correction, a final delta-only closure check is sufficient. No further holistic architecture review is needed.