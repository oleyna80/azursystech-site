# SDLC Simplification v1 — Implementation Plan

Status: implementation plan; no code authority until holistic Critic READY
Branch: docs/sdlc-simplification-v1

Depends on:
- docs/architecture/sdlc-simplification-v1.md
- docs/architecture/sdlc-simplification-v1-implementation-design.md
- docs/architecture/sdlc-simplification-v1-enforcement-matrix.md
- docs/architecture/sdlc-simplification-v1-state-event-contract.md
- docs/architecture/sdlc-simplification-v1-autonomous-orchestration.md
- regression findings from branch audit/sdlc-revision

## Objective

Replace the current legacy Agentic SDLC control plane with the simplified controller built from the existing inert .agent/controllers/v1 package.

The resulting system must:
- support the human-governed baseline as the first production mode;
- be autonomy-capable by architecture, without later weakening or replacing core gates;
- allow normal engineering progression and rework without human micro-approval;
- preserve mandatory Critic before implementation;
- bind Reviewer/Verifier to an exact committed candidate;
- use deterministic Git facts for commit/candidate/publication boundaries;
- support Claude Code and Codex through thin runtime-specific adapters;
- prevent the Orchestrator from widening its own authority;
- support future event-driven execution through merge/deploy under higher-autonomy profiles;
- eliminate the legacy deadlock/blocking classes documented in audit/sdlc-revision.

## Scope

This plan covers:
1. refactoring the inert controller core;
2. exact per-worktree state/storage;
3. normalized event/policy evaluation;
4. lifecycle CLI;
5. Claude/Codex runtime adapters;
6. Git-native pre-commit, commit-msg and pre-push enforcement;
7. deterministic E2E/regression harness;
8. protected autonomy-profile contract and baseline admission;
9. orchestration-runner interface required for future event-driven execution;
10. Owner-controlled cutover from the legacy control plane;
11. baseline human-governed production rollout;
12. later bounded/full autonomy enablement without controller redesign.

## Inputs / outputs

### Inputs

The implementation consumes:
- accepted architecture/design contracts listed above;
- existing inert .agent/controllers/v1;
- current Claude/Codex hook payload capabilities;
- current Git hook/bootstrap/CI wiring;
- legacy failure cases F-001 through F-039 as applicable;
- current GitHub Actions deployment/integration model;
- Owner-defined autonomy policy.

### Outputs

The implementation produces:
- one shared production controller policy engine;
- one per-worktree active state;
- one normalized event/decision contract;
- thin Claude and Codex adapters;
- thin Git hook adapters;
- deterministic controller/Git E2E tests;
- protected autonomy-profile registry;
- trusted admission/runner interface;
- baseline human-governed profile;
- cutover procedure;
- updated CI/governance/runtime documentation;
- later delivery automation using the same authority model through merge/deploy.

## Constraints

### Migration
- Current legacy control plane remains authoritative until cutover.
- Replacement stays inert while being implemented and tested.
- No dual live authority after cutover.
- Cutover is a separate Owner-controlled operation.
- Replacement may not rewrite its own live enforcement during activation.

### Lifecycle
Persisted states remain exactly: INACTIVE, DEFINE, EXECUTE, ASSURE.

No PR, merge, release, deploy or rollback Work Block states are added.

### Authority
- Baseline production profile is human-governed delivery.
- Higher autonomy is enabled by protected profile/configuration, not controller-code changes.
- Orchestrator cannot choose or upgrade its own high-authority profile.
- Missing authority means OWNER_DECISION_REQUIRED.
- Platform credentials/permissions remain final consequential boundaries.

### Git
- Candidate is a committed Git SHA.
- Commit precedes candidate formation.
- Git hooks operate on actual staged/ref facts.
- No custom candidate hash.
- No post-freeze staging model.

### Runtime
- Claude/Codex adapters normalize runtime-native events into one controller event model.
- Runtime hooks are early guardrails, not the sole promotion boundary.
- No general bespoke shell parser.
- Blocking Stop assurance hooks are removed from authority.

### Reports
- Detailed Critic/Reviewer/Verifier reports are transient by default.
- Runtime state does not archive reports, dispatches, sessions, topology, capabilities or closeout history.
- Durable conclusions are promoted to normal Git documentation.

## File / module responsibilities

### .agent/controllers/v1/__init__.py
Package identity and exported exceptions/constants only. No state load, Git inspection or activation side effects.

### errors.py
Small exception taxonomy: invalid state/contract, denied transition, stop-and-preserve, durability uncertainty, Git-fact failure.

### canonical.py
Deterministic JSON serialization only. Never candidate identity.

### state.py
Owns:
- schema v2 validation;
- exact lifecycle invariants;
- pure transitions;
- immutable WB/profile identity;
- Critic/Reviewer/Verifier status semantics.

Remove:
- history;
- write_gate;
- controller tree pin;
- capability;
- dispatch/evidence arrays;
- assurance retry/boundary fields.

### storage.py
Owns:
- per-worktree private state resolution through Git;
- missing-state distinction from INACTIVE;
- strict read/validation;
- compare-before-write;
- same-directory temp write, fsync, atomic replace and readback.

Target state location is resolved with:
    git rev-parse --path-format=absolute --git-path azursystech/active-work-block.json

Tracked default-state recovery is removed.

### New gitfacts.py
Runtime-neutral Git facts only:
- repository/worktree/common-dir resolution;
- attached branch;
- SHA resolution;
- clean worktree/index;
- staged paths;
- changed paths between revisions;
- per-commit post-candidate paths;
- ancestry/fast-forward;
- planning-subject comparison;
- remote-ref verification.

No lifecycle decisions.

### New events.py
Owns:
- normalized event schema;
- strict per-kind validation;
- normalized decision schema/codes;
- exact event-path canonicalization.

### policy.py
Single local enforcement evaluator:
- pre-WB planning surface;
- planning/implementation/coordination classification;
- stage-specific write decisions;
- pre-commit;
- commit-message traceability;
- pre-push;
- stable decision codes.

No general Bash parsing.

### adapters.py
Runtime-native mapping only.

Claude:
- structured Write/Edit/MultiEdit equivalents;
- optional SubagentStart context.

Codex:
- apply_patch/Edit/Write equivalents;
- optional SubagentStart context.

Requirements:
- target worktree derived from native cwd;
- hook script location independent of mutable cwd;
- exact target paths for authority-bearing writes;
- parity across runtimes.

### hook.py
Thin stdin/stdout wrapper:
1. parse native payload;
2. resolve target worktree;
3. normalize;
4. load state;
5. call shared policy;
6. emit native decision.

### cli.py
Sole normal lifecycle writer.

Target verbs:
- status
- open
- critic
- revise
- candidate
- reviewer
- verifier
- publish
- close

CLI derives branch/candidate/Git facts itself rather than trusting payload values.

Successful publish:
    ASSURE -> validate -> exact subject push -> verify remote -> INACTIVE

Failed publish leaves ASSURE unchanged.

### evidence.py
Remove from production controller architecture.

If temporary role-result parsing needs a helper, create a narrowly named module without persistent session/report provenance.

### Autonomy policy source
Preferred protected machine-readable source:
    .agent/policies/autonomy-profiles.json

Initial profile: human-governed.

It may autonomously allow planning, implementation, assurance, subject publication, PR preparation/update and deterministic CI/release evidence collection.

Merge/deploy remain Owner decisions in the baseline profile.

### Orchestration/admission boundary
Preferred package:
    .agent/orchestration/

Separate from controller.

Responsibilities:
- accept trusted event/admission context;
- pin run/profile identity;
- drive normal controller transitions;
- dispatch Critic/Coder/Reviewer/Verifier;
- handle autonomous rework loops;
- preserve OWNER_DECISION_REQUIRED;
- carry delivery authority context across PR/merge/deploy when higher profiles are enabled.

Runner cannot bypass controller/Git/platform gates.

## Implementation plan

### WB-1 — Core controller contract, inert

Primary paths:
- .agent/controllers/v1/state.py
- storage.py
- gitfacts.py
- events.py
- policy.py
- cli.py
- tests

Work:
1. replace current state with schema v2;
2. remove history/evidence/capability/write-gate fields;
3. implement Git-private per-worktree state;
4. implement strict path grammar;
5. implement pre-WB planning authority;
6. implement Git fact helpers;
7. implement lifecycle transitions;
8. implement committed candidate creation;
9. implement post-candidate history validation;
10. implement normalized decisions/codes;
11. implement target CLI;
12. keep package inert.

Exit:
- unit tests green;
- no live hook/config changes;
- no legacy deletion;
- no authority change.

### WB-2 — Runtime and Git adapters, still inert

Primary paths:
- adapters.py
- hook.py
- optional git_adapter.py
- controller tests
- Git fixture tests

Work:
1. Claude structured-write normalization;
2. Codex structured-write normalization;
3. root-stable worktree resolution;
4. context-only SubagentStart;
5. normalized pre-commit;
6. normalized commit-message;
7. normalized pre-push;
8. native response mapping;
9. runtime parity tests;
10. remove shell authority parsing.

Exit:
- equivalent Claude/Codex events return same decision codes;
- Git fixtures use real index/ref facts;
- still disconnected from live hook configs.

### WB-3 — E2E transaction + legacy regression harness

Use disposable Git repositories/worktrees and inert controller directly.

Happy path:
    pre-WB planning
    -> open
    -> Critic READY
    -> EXECUTE
    -> commit
    -> candidate
    -> Reviewer READY
    -> Verifier READY
    -> coordination-only closeout commit
    -> exact subject publish
    -> INACTIVE

Rework:
- Critic BLOCKED -> revise -> READY;
- Reviewer rework -> EXECUTE -> new candidate;
- Verifier rework -> EXECUTE -> new candidate;
- Verifier evidence problem keeps same candidate/Reviewer;
- scope change -> DEFINE -> new planning revision -> Critic.

Worktree/recovery:
- isolated linked-worktree state;
- nested cwd;
- missing/corrupt state;
- restart without lifecycle mutation.

Git transaction:
- out-of-scope staged paths;
- hidden descendants through directory staging;
- dirty candidate rejection;
- planning change/revert rejection;
- post-candidate source change/revert rejection;
- pre-push vs publish parity;
- failed push preserves ASSURE;
- idempotent publish after valid direct push.

Legacy blocker mapping must cover applicable F-001..F-039, especially freeze/index deadlock, coordination deadlock, Stop pressure, cwd-sensitive hooks, re-open/base replacement, canonical-state disagreement and shell-parser failure classes.

Exit:
- every normal state has a reachable continuation;
- happy path needs no bootstrap/bypass;
- no test depends on legacy session/report/topology ceremony.

### WB-4 — Autonomy profiles + orchestration foundation

Primary paths:
- .agent/policies/autonomy-profiles.json
- .agent/orchestration/**
- tests

Work:
1. protected profile schema;
2. human-governed baseline profile;
3. immutable profile binding/resolver;
4. trusted admission interface;
5. orchestration runner around controller;
6. autonomous role progression/rework;
7. OWNER_DECISION_REQUIRED contract;
8. external delivery authority context across publication;
9. higher-autonomy fixture profiles, not live-enabled.

Admission rule:
- local/untrusted initiation can select only baseline profile;
- higher profiles require trusted dispatcher/platform admission;
- subject-branch work cannot upgrade effective profile.

Exit:
- runner completes engineering lifecycle through PR-ready/publish in tests;
- profile self-upgrade rejected;
- higher delivery paths simulated only.

### WB-5 — Holistic replacement assurance

Before activation:
- holistic Critic on final package;
- Reviewer on exact replacement candidate;
- Verifier on exact candidate;
- deterministic CI;
- full E2E/regression;
- old-vs-new enforcement comparison;
- cutover rehearsal in disposable repo/worktree.

Any source fix creates a new candidate and reruns required assurance.

Exit:
- replacement candidate READY;
- cutover checklist READY;
- no live change yet.

### WB-6 — Owner-controlled baseline cutover

Expected paths:
- .claude/settings.json
- .claude/hooks/**
- .codex/hooks.json
- .codex/hooks/**
- .githooks/**
- .github/workflows/control-plane-contracts.yml
- scripts/bootstrap.sh
- AGENTS.md
- governance/**
- .agent/workflows/**

Sequence:
1. verify exact assured candidate;
2. verify clean cutover branch/worktree;
3. wire Claude adapter;
4. wire Codex adapter;
5. wire Git hooks;
6. update hook bootstrap;
7. point CI to replacement tests;
8. update governance/runtime docs;
9. disable/remove legacy live authority paths;
10. run live-wiring smoke E2E;
11. confirm human-governed profile active;
12. publish cutover branch;
13. Owner reviews, merges and deploys control-plane change.

No higher-autonomy production capability is enabled during this cutover.

Rollback: revert cutover commit(s) to restore previous wiring; never run mixed old/new authority.

### WB-7 — Baseline stabilization

Use new SDLC for real project work with Owner checkpoint at PR/merge/deploy.

Validate:
- planning usability;
- Critic/rework;
- Claude/Codex parity;
- commit/push ergonomics;
- CI stability;
- no false blocks;
- no scope escapes;
- restart/worktree behavior;
- release checklist quality.

Any failure becomes a regression test before its fix.

### WB-8 — Graduated delivery autonomy

Level 1 — supervised:
- Orchestrator reaches merge/deploy-ready;
- gathers PR, CI and release checklist;
- Owner authorizes consequential action.

Level 2 — bounded autonomous delivery:
- trusted event classes may merge/deploy to admitted targets automatically.

Level 3 — full admitted autonomous delivery:
    event
    -> planning
    -> Critic
    -> implementation
    -> Reviewer
    -> Verifier
    -> CI
    -> PR
    -> merge
    -> GitHub Actions deploy
    -> post-deploy verification
    -> feedback

Before Level 3 for a change class:
- deterministic E2E successful;
- stable supervised real runs;
- no unresolved authority/deadlock regressions;
- protected trusted admission;
- least-privilege credentials;
- environment restrictions;
- rollback/retry policy;
- post-deploy verification;
- Owner approval of the profile/change class.

## Acceptance criteria

### Core
- AC-001 only four lifecycle states validate.
- AC-002 missing state differs from INACTIVE and grants no source authority.
- AC-003 linked worktrees have independent state.
- AC-004 corrupt authority state fails closed.
- AC-005 state persistence is atomic and compare-before-write.
- AC-006 active identity fields cannot silently change.
- AC-007 authority profile binding is immutable.

### Planning / Critic
- AC-008 pre-WB writes limited to docs/changes/** on non-default branch.
- AC-009 source denied before Critic READY.
- AC-010 Critic READY binds exact planning revision.
- AC-011 planning change/revert without revise cannot reach candidate.
- AC-012 revise resets dependent gates and preserves immutable identity/profile.

### Execution / candidate
- AC-013 implementation structured writes require EXECUTE and scope.
- AC-014 coordination follows stage-specific scope rules.
- AC-015 staged out-of-scope paths rejected.
- AC-016 candidate requires clean committed HEAD.
- AC-017 candidate identity is exact commit SHA.
- AC-018 no post-freeze/index reconstruction exists.

### Assurance
- AC-019 Reviewer READY binds only exact candidate.
- AC-020 Verifier READY requires Reviewer READY on exact candidate.
- AC-021 source rework creates a new candidate path.
- AC-022 evidence-only Verifier retry preserves candidate/Reviewer.
- AC-023 scope change returns through DEFINE/Critic.

### Publication
- AC-024 post-candidate commits are coordination-only.
- AC-025 implementation/planning change/revert after candidate rejected.
- AC-026 direct pre-push and publish share predicates.
- AC-027 normal publication is exact non-force subject branch.
- AC-028 failed publish leaves ASSURE.
- AC-029 successful verified publish returns INACTIVE.
- AC-030 publish is idempotent after valid direct push.

### Runtime / Git
- AC-031 Claude/Codex equivalent writes produce equivalent decision codes.
- AC-032 nested cwd/worktree resolves correctly.
- AC-033 hook path resolution is independent of mutable cwd.
- AC-034 no blocking Stop hook mutates/holds lifecycle.
- AC-035 no general shell parser is required for promotion safety.
- AC-036 commit-msg is traceability only.
- AC-037 Git hooks/controller share one schema/policy.

### Autonomy
- AC-038 baseline autonomously progresses through PR-ready/publish.
- AC-039 baseline requires Owner for merge/deploy.
- AC-040 Orchestrator cannot upgrade its own profile.
- AC-041 higher profiles require trusted admission.
- AC-042 normal assurance rework loops need no Owner intervention.
- AC-043 subjective/business decisions return OWNER_DECISION_REQUIRED.
- AC-044 simulated full event-to-deploy uses same controller/gates.
- AC-045 higher autonomy is enabled by protected profile/dispatcher/platform configuration, not weakened controller invariants.

### Migration
- AC-046 replacement is tested while inert.
- AC-047 no dual live policy engine at cutover.
- AC-048 cutover rollback is deterministic.
- AC-049 live baseline smoke transaction succeeds.
- AC-050 legacy blockers remain regression-covered after retirement.

## Acceptance-test inventory

Minimum suites:
- test_state.py — schema, transitions, profile immutability
- test_storage.py — Git-private state, atomicity, missing/corrupt/CAS
- test_gitfacts.py — staged/history/ancestry/ref facts
- test_events.py — normalized event/decision schemas
- test_policy.py — planning/write/commit/message/push policy
- test_cli.py — lifecycle verbs and Git-derived facts
- test_adapters_hook.py — Claude/Codex parity, cwd/worktree, malformed payload
- test_e2e_transaction.py — happy path, rework, publish
- test_legacy_regressions.py — mapped F-001..F-039
- orchestration/tests/ — baseline progression, Owner decision, profile non-escalation, simulated higher autonomy

Git-hook shell fixtures test invocation/exit behavior only. Lifecycle semantics stay in shared Python tests.

## Implementation order

    Architecture package
      -> holistic Critic
      -> WB-1 core
      -> WB-2 adapters/Git
      -> WB-3 E2E/regressions
      -> WB-4 profiles/orchestration
      -> WB-5 replacement assurance
      -> WB-6 cutover
      -> WB-7 stabilization
      -> WB-8 graduated autonomy

WB-1 through WB-4 remain inert relative to current production enforcement.

WB-6 is the first Work Block allowed to change live authority wiring.

## Risks

### Self-hosting deadlock
Mitigation: inert build, separate cutover, exact rollback.

### Policy duplication
Mitigation: shared controller/state/events/policy; thin adapters; parity tests.

### Authority self-escalation
Mitigation: immutable profile; baseline-only local admission; trusted higher-profile admission; protected policy source; platform final boundary.

### False confidence from unit tests
Mitigation: mandatory disposable-repo E2E, legacy regressions, live-wiring smoke.

### Runtime hook drift
Mitigation: minimal portable subset, separate adapters, Git-native backstops.

### Excess autonomy too early
Mitigation: human-governed baseline, graduated profiles, evidence-based promotion.

## Practical next step

Before source implementation:
1. run one holistic independent Critic over the complete architecture and this plan;
2. resolve blocking/material findings only;
3. freeze the implementation-ready package;
4. define WB-1 from this plan;
5. begin inert controller implementation.

## Out of scope

This plan does not:
- activate replacement immediately;
- authorize merge/deploy of the redesign;
- enable Level 2/3 production autonomy immediately;
- redesign product/application architecture;
- implement a general shell security parser;
- claim cryptographic protection against a malicious same-user local process;
- retain legacy report/session/topology/capability ceremony;
- require automation of subjective UX/design judgment.

The target is strong workflow autonomy with deterministic engineering boundaries, not elimination of human judgment where judgment is inherently subjective.
