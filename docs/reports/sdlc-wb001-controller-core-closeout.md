# WB-001 — Core Controller Contract — Closeout

Status: COMPLETE / ASSURED

Source candidate:

`60fef2519dd79a539bc00f5263a3d8f9743f3a42`

WB-001 base:

`0b759a50f1e998ba0d19434fa5770cf6ea4216e8`

Branch:

`feat/sdlc-wb001-controller-core`

## Assurance

Reviewer:

`READY` for exact candidate `60fef2519dd79a539bc00f5263a3d8f9743f3a42`.

Verifier:

`READY` for exact candidate `60fef2519dd79a539bc00f5263a3d8f9743f3a42`.

Independent verification confirmed:

- 63 tests;
- 0 failures;
- 0 errors;
- 1 intentional skip for WB-002 runtime adapters/hooks;
- `python -m compileall -q .agent/controllers/v1` exit 0;
- 14/14 additional independent probes passed.

## Delivered

WB-001 provides the inert shared controller core:

- schema v2 with INACTIVE / DEFINE / EXECUTE / ASSURE;
- missing state distinct from INACTIVE;
- Git-private per-worktree state;
- immutable admission/branch/base/profile bindings;
- Critic / revise / Reviewer / Verifier lifecycle transitions;
- exact Git commit source-candidate identity;
- trusted WB-0 AdmissionResolver boundary;
- Git-native staged/changed/commit path facts;
- deletion and both rename sides included in authority path accounting;
- post-candidate source/planning immutability;
- conservative denial of post-candidate merge commits;
- trusted publication shape using origin, Git-derived default branch, and injected trusted protection status;
- verified publish success -> INACTIVE;
- failed publication preserves ASSURE.

## Closed findings

Reviewer/Verifier rework closed:

- deletion paths omitted from enforcement;
- rename source path collapsing bypass;
- post-candidate merge ambiguity;
- caller-controlled publication remote/default-branch facts;
- failed-publication test fixture not reaching controller path.

## Inertness

WB-001 does not switch live Claude/Codex hooks or Git hook wiring.

Runtime and Git adapters remain WB-002 scope.

## Next

Proceed to `WB-002 — Runtime and Git adapters, still inert` from this closeout tip.
