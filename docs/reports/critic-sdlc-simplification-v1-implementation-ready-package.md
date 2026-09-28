# Holistic Critic Review — SDLC Simplification v1 Implementation-Ready Package

Date: 2026-09-29
Role: Independent pre-code Critic
Reviewed branch: docs/sdlc-simplification-v1
Reviewed head: d8cd003426255deaea4e41044ce149dd7b3868d8
Verdict: SUPPLEMENT

## Reviewed package

- docs/architecture/sdlc-simplification-v1.md
- docs/architecture/sdlc-simplification-v1-implementation-design.md
- docs/architecture/sdlc-simplification-v1-enforcement-matrix.md
- docs/architecture/sdlc-simplification-v1-state-event-contract.md
- docs/architecture/sdlc-simplification-v1-autonomous-orchestration.md
- docs/architecture/sdlc-simplification-v1-implementation-plan.md

The review also inspected current live governance on main, the inert .agent/controllers/v1 implementation, and audit/sdlc-revision including the F-001..F-039 regression corpus.

## Executive assessment

The target direction is materially better than the current live SDLC. It removes freeze/index deadlocks, runtime/session/topology evidence as authority, report-path authority, broad shell parsing, blocking Stop lifecycle pressure, publication projection machinery, FILE_REGISTRY/PROJECT_MAP lifecycle duplication, and universal define-quality/process-feedback ceremony while retaining the useful engineering invariants.

The existing inert controller is a reasonable technical starting point. The package is close to implementation-ready, but four issues should be resolved before WB-1 source implementation begins.

# Must

## M1 — Make the exact state/enforcement contracts internally consistent

Three exact-contract statements currently disagree.

1. Missing-state open: the state contract permits NO_LOCAL_AUTHORITY -> open -> DEFINE and the CLI section also allows a valid missing-state bootstrap, but the Event Matrix says Open checks only that state is INACTIVE. Align the Event Matrix with the state contract.

2. Critic READY: the state contract says critic ready atomically binds the current planning revision and transitions DEFINE -> EXECUTE, and valid persisted DEFINE normally has Critic PENDING or BLOCKED. The Event Matrix instead lists critic_status == READY as a precondition. Describe this as one atomic transition; do not require an intermediate persisted DEFINE+READY state.

3. Successful closeout: the exact state model and CLI define publish success -> INACTIVE and close only for reporting-only/cancelled. The Event Matrix still describes a separate successful closeout that clears active state. Keep durable closeout preparation while ASSURE, then use publish as the single successful terminal transition.

These are contract corrections only; no new state or control layer is needed.

## M2 — Define a reachable material-revision transaction

The package says planning-subject paths are immutable in EXECUTE/ASSURE, a material change requires revise, and revise installs a new committed planning_subject revision. But normal planning writes are denied in EXECUTE/ASSURE, so the Orchestrator can need a new planning commit before it has a legal way to enter DEFINE.

This can reproduce the same class of transition deadlock the redesign is intended to remove.

Define one deterministic sequence without adding a new persisted lifecycle state. A minimal model is:

- from EXECUTE/ASSURE, revise-begin moves to DEFINE, clears Critic/candidate/assurance, and temporarily retains the old planning binding;
- DEFINE allows planning edits and commit;
- revise-bind installs the new planning revision/paths/scopes while remaining DEFINE;
- Critic reviews the committed new planning subject and READY returns to EXECUTE.

The same revise verb may use state-dependent begin/bind semantics if desired; a second CLI verb is not required.

Required E2E coverage: proactive revision discovered in EXECUTE; proactive revision discovered in ASSURE; Critic BLOCKED revision; Reviewer/Verifier scope-change revision.

## M3 — Resolve trusted admission/run binding before freezing schema v2

The autonomy contract requires a trusted external delivery context that survives event/admission -> Work Block -> subject publication -> local INACTIVE -> PR/merge/deploy. It explicitly says the dispatcher creates a run identity and that Work Block state references the run/profile while active.

The exact state schema stores only authority_profile id/revision. The implementation plan nevertheless says orchestration will pin run/profile identity and carry delivery authority across publication.

Choose one model before implementing schema v2:

- Option A: add one opaque immutable admission_id/run_id to active state. The controller does not interpret it; the trusted orchestration/delivery layer owns the detailed envelope.
- Option B: keep run identity external only, remove the statement that Work Block state references it, and define the exact immutable external correlation tuple used across publication.

Also resolve two linked admission details now:

- choose the canonical protected profile source and trusted trigger->profile mapping instead of calling them merely preferred;
- make base_commit either pinned by trusted admission or deterministically derived from admitted branch/base policy. It must not be a free later base that can hide pre-open changes from candidate containment.

Ordinary subject Work Blocks must not be able to include or modify the protected profile/policy source inside their effective implementation/coordination authority. Profile changes remain Owner/platform governance actions outside the run they would affect.

GitHub platform note: the plugin verified that the repository is private and that the linked account has admin/push permission. It could not read classic branch-protection state through the integration, and the repository-rulesets endpoint returned a GitHub plan/visibility restriction. Therefore higher-autonomy enablement must verify real external protections at rollout time rather than assume them. This does not block the human-governed baseline.

## M4 — Assign logical independence and overlapping-writer ownership to orchestration

The implementation design explicitly preserves mandatory independent Critic, independent Reviewer/Verifier semantics, and one writer per overlapping implementation scope. The controller intentionally removes runtime/session/topology provenance, which is a good simplification, but another layer must own the actual execution discipline.

Make the orchestration layer explicitly responsible for:

- logical-role separation: Coder output cannot satisfy Critic/Reviewer/Verifier; unavailable independent assurance blocks rather than self-approves;
- overlapping-writer serialization: do not concurrently dispatch write-capable Coders whose implementation_write_set values overlap; non-overlapping Work Blocks may run in parallel.

Add orchestration tests for those rules. No execution IDs or global controller registry need to be persisted.

# Should

## S1 — Make legacy regression mapping explicit

In test_legacy_regressions.py maintain finding ID -> target test(s) -> covered/superseded/not-applicable + rationale. Do not rely only on the phrase F-001 through F-039 as applicable.

## S2 — Pin normal open baseline semantics

The CLI should derive or consume a trusted admitted branch/base fact rather than accept an arbitrary subject-selected base. Candidate diff containment depends on this boundary.

## S3 — Preserve delivery provenance outside the Work Block lifecycle

Retain source candidate -> publish tip -> PR/merged SHA -> deployed SHA in the external delivery context, especially for squash/rebase merge. No extra Work Block lifecycle state is needed.

## S4 — Do not enable higher autonomy until real platform protections are proven

Keep Level 2/3 fixture-only before stabilization and require evidence for protected admission, least-privilege merge/deploy credentials, target restrictions, rollback, and post-deploy verification.

# Comparison with current SDLC

The new package is a substantial improvement over the current control plane: commit-before-candidate replaces freeze/index reconstruction; Reviewer/Verifier bind to commit SHA; report/session/topology evidence leaves authority state; Stop no longer forces lifecycle mutation; Git facts replace shell-intent parsing; coordination writes are first-class; publication has one exact terminal operation; active state becomes per-worktree private runtime state; release/merge/deploy stay outside the engineering state machine.

Nothing in this review justifies restoring define_quality aggregation, universal topology/capability proof, execution/context IDs, report-path authority, prepare/finalize assurance ceremony, canonical inactive-child ancestry, release-state projection registries, broad shell parser enforcement, blocking Stop closeout pressure, or mandatory multi-dimension Process Feedback.

# Final verdict

SUPPLEMENT.

The package is architecturally sound and substantially simpler than the current SDLC. No broad redesign is required.

Before source implementation, resolve:

1. exact contract inconsistencies around missing-state open, Critic transition, and successful closeout;
2. reachable material revise transaction;
3. trusted admission/run/profile/base binding across publication and protected policy source;
4. orchestration ownership of logical independence and overlapping writers.

After those four points are incorporated, the next Critic pass can be a focused closure review rather than another full architecture review.
