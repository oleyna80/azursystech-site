# SDLC Simplification v1 — Implementation Plan

Status: implementation plan; original Must findings closed, focused closure SUPPLEMENT dependency-order correction incorporated; final delta-only Critic check required before source implementation
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
7. minimal trusted admission foundation required by planning/open;
8. deterministic E2E/regression harness;
9. full orchestration-runner interface required for future event-driven execution;
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
- protected autonomy-profile registry and trigger mapping;
- minimal trusted admission record/resolver/store interface with immutable `admission_id` correlation;
- full orchestration runner and later delivery-continuation interface;
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
- Every normal run has a trusted admission record created before planning; active state stores immutable `admission_id` + matching profile/base binding.
- `base_commit` is pinned by trusted admission from the configured base ref before subject-branch planning; it is not a subject-selected diff boundary.
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
- immutable WB/admission/profile/base identity;
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
Canonical protected machine-readable sources:

    .agent/policies/autonomy-profiles.json
    .agent/policies/admission-rules.json

Trusted admission reads both from one exact pinned commit of the trusted repository default/policy branch.

`admission-rules.json` maps trusted trigger classes to the maximum available profile and base policy.

Ordinary Work Blocks cannot include `.agent/policies/**` in implementation or coordination authority.

Initial profile: human-governed.

It may autonomously allow planning, implementation, assurance, subject publication, PR preparation/update and deterministic CI/release evidence collection.

Merge/deploy remain Owner decisions in the baseline profile.

### Minimal admission foundation

Canonical shared package:

    .agent/admission/

This package is below both the controller and the full orchestration runner in the dependency graph.

Responsibilities:

- exact `AdmissionRecord` model matching the accepted contract;
- immutable `admission_id` generation/validation;
- canonical policy loading from:
  - `.agent/policies/autonomy-profiles.json`;
  - `.agent/policies/admission-rules.json`;
- trusted trigger -> maximum profile/base-policy resolution;
- trusted `base_ref -> base_commit` pinning before subject planning;
- subject-branch/base consistency checks;
- admission record resolver interface;
- store interface;
- inert/test store implementation used by WB-0 through WB-3.

It does not:

- schedule Critic/Coder/Reviewer/Verifier;
- run the SDLC;
- merge/deploy;
- own Work Block lifecycle transitions.

The controller consumes only the stable admission record/resolver contract. The orchestration runner later consumes the same contract.

### Full orchestration boundary
Canonical package:
    .agent/orchestration/

Separate from controller and built on top of `.agent/admission/`.

Responsibilities:
- accept trusted event/admission context;
- generate/store trusted external `admission_id` records;
- pin repository/trigger/profile/base/subject identity;
- drive normal controller transitions;
- dispatch Critic/Coder/Reviewer/Verifier as distinct logical roles;
- reject self-substitution when independent assurance is unavailable;
- serialize overlapping write-capable Coders while allowing disjoint scopes in parallel;
- handle autonomous rework loops;
- preserve OWNER_DECISION_REQUIRED;
- carry delivery authority context across PR/merge/deploy when higher profiles are enabled.

Runner cannot bypass controller/Git/platform gates.

## Implementation plan

### WB-0 — Minimal trusted admission foundation, inert

Objective:

Implement the smallest stable admission contract required by pre-WB planning, `open`, trusted `base_commit`, and WB-3 E2E before the controller core depends on it.

This is not the full orchestration system.

Primary paths:

```text
.agent/policies/autonomy-profiles.json
.agent/policies/admission-rules.json
.agent/orchestration/__init__.py
.agent/orchestration/admission.py
.agent/orchestration/tests/test_admission.py
```

Responsibilities:

1. define the immutable `AdmissionRecord` contract containing at minimum:
   - `admission_id`;
   - repository identity;
   - trigger class;
   - authority profile id/revision;
   - base ref;
   - exact base commit;
   - subject branch;
2. define one stable admission-store/resolver interface consumed later by controller/open/policy;
3. implement an inert/local test store suitable for disposable repository E2E;
4. implement exact validation that profile/base/subject facts match the resolved admission record;
5. implement trusted base resolution from configured base ref before subject-branch planning;
6. implement canonical baseline `manual-owner -> human-governed` admission rule;
7. make `.agent/policies/**` protected from ordinary Work Block authority;
8. keep dispatcher, role scheduling, PR/merge/deploy continuation, and higher-autonomy execution out of this WB.

The interface must be backend-independent. WB-4 may replace/add the production trusted registry/dispatcher backend without changing the controller-facing admission contract.

Exit criteria:

- admission record/schema/resolver tests green;
- exact base pinning proven in disposable Git fixtures;
- invalid/mismatched admission/profile/base/subject fails closed;
- baseline manual-owner fixture can create a valid inert admission;
- no live hook or production orchestration wiring changes;
- no merge/deploy authority exists.

### WB-0 — Minimal trusted admission foundation, inert

Objective:

Implement the smallest stable admission dependency required by schema/open/pre-WB planning before the controller core depends on it.

Primary paths:

- `.agent/admission/**` — new shared foundation;
- `.agent/policies/autonomy-profiles.json`;
- `.agent/policies/admission-rules.json`;
- admission foundation tests.

Work:

1. define exact `AdmissionRecord` fields:
   - `admission_id`;
   - repository identity;
   - trigger class;
   - authority profile id/revision;
   - base ref;
   - exact base commit;
   - subject branch;
2. implement strict record validation and immutable correlation semantics;
3. implement canonical policy readers against one exact pinned policy commit;
4. implement trigger -> maximum profile/base-policy resolution;
5. implement trusted base-ref resolution to exact `base_commit`;
6. implement subject-branch/base consistency validation;
7. define `AdmissionStore` / `AdmissionResolver` interfaces;
8. provide inert/test storage usable in disposable repositories without creating a production dispatcher;
9. provide a minimal admission creation path for tests/manual-owner fixtures that exercises the real interface rather than fabricating controller inputs;
10. keep all admission foundation code inert relative to live hooks/runtime.

Exit criteria:

- admission record creation/resolution tests green;
- controller-independent tests prove arbitrary later `base_commit` substitution is rejected;
- stronger profile selection than admission rules permit is rejected;
- mismatched repository/subject/profile/base resolution fails closed;
- WB-1 can consume the stable resolver interface;
- no orchestration runner or live authority is introduced.

### WB-1 — Core controller contract, inert

Dependency:

- consumes the stable admission resolver/interface delivered by WB-0;
- does not implement a parallel admission model.

Primary paths:
- .agent/controllers/v1/state.py
- storage.py
- gitfacts.py
- events.py
- policy.py
- cli.py
- tests

Dependencies:
- WB-0 admission foundation READY.

Work:
1. replace current state with schema v2;
2. remove history/evidence/capability/write-gate fields;
3. implement Git-private per-worktree state;
4. implement strict path grammar;
5. implement pre-WB planning authority using the WB-0 admission resolver;
6. validate `open` against exact admission_id/repository/subject/profile/base binding;
7. implement Git fact helpers;
8. implement lifecycle transitions including `revise begin` -> DEFINE and `revise bind` after committed planning changes;
9. implement committed candidate creation;
10. implement post-candidate history validation;
11. implement normalized decisions/codes;
12. implement target CLI;
13. keep package inert.

Exit:
- unit tests green;
- no live hook/config changes;
- no legacy deletion;
- no authority change.

### WB-2 — Runtime and Git adapters, still inert

Dependencies:
- WB-0 admission foundation READY;
- WB-1 controller core READY.

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

Use disposable Git repositories/worktrees, the real WB-0 admission interface/test store, and the inert controller directly.

WB-3 must not fabricate admission state through controller test-only shortcuts.

Happy path:
    trusted admission / base pin
    -> pre-WB planning
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
- proactive EXECUTE revision -> revise begin -> DEFINE edit/commit -> revise bind -> Critic;
- proactive ASSURE revision -> revise begin -> DEFINE edit/commit -> revise bind -> Critic;
- Critic BLOCKED -> DEFINE edit/commit -> revise bind -> READY;
- Reviewer rework -> EXECUTE -> new candidate;
- Verifier rework -> EXECUTE -> new candidate;
- Verifier evidence problem keeps same candidate/Reviewer;
- Reviewer/Verifier scope change -> DEFINE edit/commit -> revise bind -> Critic.

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

Legacy blocker mapping must maintain an explicit machine/test-readable inventory:

    finding_id -> target test(s) -> COVERED | SUPERSEDED | NOT_APPLICABLE -> rationale

for every F-001..F-039.

It must explicitly cover freeze/index deadlock, coordination deadlock, Stop pressure, cwd-sensitive hooks, re-open/base replacement, canonical-state disagreement and shell-parser failure classes.

Exit:
- every normal state has a reachable continuation;
- happy path needs no bootstrap/bypass;
- no test depends on legacy session/report/topology ceremony.

### WB-4 — Full orchestration and delivery-continuation foundation

Primary paths:
- .agent/policies/autonomy-profiles.json
- .agent/policies/admission-rules.json
- .agent/orchestration/**
- tests

Work:
1. retain the WB-0 admission record/resolver contract unchanged;
2. add the production trusted admission registry/dispatcher backend;
3. add richer trigger mappings/higher-autonomy fixture profiles without enabling them live;
4. implement orchestration runner around controller;
5. implement logical Critic/Coder/Reviewer/Verifier separation;
6. implement overlapping-writer serialization within one orchestration run;
7. implement autonomous role progression/rework;
8. implement OWNER_DECISION_REQUIRED contract;
9. implement external delivery authority continuation across publication keyed by `admission_id`;
10. implement PR/merge/deploy simulation fixtures for higher autonomy.

WB-4 must not require controller schema or admission-interface redesign.

Admission rule:
- WB-0 already makes every run admitted before planning;
- WB-4 extends the trusted backend/dispatcher but does not change this controller-facing contract;
- manual Owner flow uses trusted trigger class `manual-owner` and baseline profile;
- local/untrusted initiation cannot select a stronger profile than `admission-rules.json` permits;
- higher profiles require trusted dispatcher/platform admission;
- admission resolves base ref -> exact base commit before subject branch/worktree creation;
- subject-branch work cannot change `.agent/policies/**`, upgrade effective profile, replace `admission_id`, or move `base_commit` forward.

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

Before enabling Level 2/3 multi-run event concurrency, resolve one additional concurrency policy:

- decide whether the one-writer invariant is per orchestration run or repository-wide across simultaneous admitted runs;
- if repository-wide, add a lightweight trusted reservation/serialization mechanism keyed by repository + normalized implementation scope;
- prove stale reservation recovery and disjoint-run concurrency;
- do not infer repository-wide safety from the current same-run scheduler.

This is not a WB-0/WB-1 or baseline cutover blocker.

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

### Admission foundation
- AC-000a admission record/resolver interface exists before controller implementation consumes it.
- AC-000b trusted admission pins exact base commit and subject branch before planning.
- AC-000c controller-facing admission validation rejects repository/profile/base/subject mismatch.
- AC-000d baseline manual-owner admission works through the same interface used by WB-3.
- AC-000e WB-4 can add a production registry/dispatcher backend without changing controller state schema or admission resolver contract.

### Admission foundation
- AC-000a trusted admission foundation exists before controller implementation depends on it.
- AC-000b admission record resolver binds admission_id/repository/subject/profile/base exactly.
- AC-000c base_commit is pinned from trusted base policy before planning and cannot be replaced by a later subject-selected base.
- AC-000d stronger profile selection than admission rules permit is rejected.
- AC-000e WB-3 uses the real inert admission interface/store rather than fabricating admission-bound controller state.

### Core
- AC-001 only four lifecycle states validate.
- AC-002 missing state differs from INACTIVE and grants no source authority.
- AC-003 linked worktrees have independent state.
- AC-004 corrupt authority state fails closed.
- AC-005 state persistence is atomic and compare-before-write.
- AC-006 active identity fields cannot silently change.
- AC-007 `admission_id`, authority profile and trusted `base_commit` bindings are immutable.

### Planning / Critic
- AC-008 pre-WB writes require a valid trusted admission and are limited to docs/changes/** on the exact admitted non-default subject branch.
- AC-009 source denied before Critic READY.
- AC-010 Critic READY binds exact planning revision.
- AC-011 planning change/revert without revise cannot reach candidate.
- AC-012 `revise begin` is reachable before planning edits from EXECUTE/ASSURE; DEFINE planning edits can then commit; `revise bind` installs the new revision/scopes; immutable WB/admission/profile/base identity is preserved.

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
- AC-040 Orchestrator cannot replace/upgrade its own `admission_id`, profile or base binding.
- AC-041 higher profiles require trusted admission through canonical admission rules.
- AC-042 normal assurance rework loops need no Owner intervention.
- AC-043 subjective/business decisions return OWNER_DECISION_REQUIRED.
- AC-044 simulated full event-to-deploy uses same controller/gates.
- AC-045 higher autonomy is enabled by protected profile/dispatcher/platform configuration, not weakened controller invariants.
- AC-045a Coder output cannot satisfy Critic/Reviewer/Verifier; unavailable independent assurance blocks.
- AC-045b write-capable Coders with overlapping implementation scopes are serialized; disjoint scopes may run concurrently.

### Migration
- AC-046 replacement is tested while inert.
- AC-047 no dual live policy engine at cutover.
- AC-048 cutover rollback is deterministic.
- AC-049 live baseline smoke transaction succeeds.
- AC-050 legacy blockers remain regression-covered after retirement.

## Acceptance-test inventory

Minimum suites:
- orchestration/tests/test_admission.py — admission record/resolver, base pinning, mismatch fail-closed
- admission/tests/ — record schema, trigger/profile/base resolution, resolver/store, non-escalation
- test_state.py — schema, transitions, admission/profile/base immutability
- test_storage.py — Git-private state, atomicity, missing/corrupt/CAS
- test_gitfacts.py — staged/history/ancestry/ref facts
- test_events.py — normalized event/decision schemas
- test_policy.py — planning/write/commit/message/push policy
- test_cli.py — lifecycle verbs and Git-derived facts
- test_adapters_hook.py — Claude/Codex parity, cwd/worktree, malformed payload
- test_e2e_transaction.py — happy path, rework, publish
- test_legacy_regressions.py — explicit F-001..F-039 status/rationale mapping plus target tests
- orchestration/tests/ — baseline progression, Owner decision, admission/profile/base non-escalation, logical-role independence, overlapping-writer serialization, simulated higher autonomy

Git-hook shell fixtures test invocation/exit behavior only. Lifecycle semantics stay in shared Python tests.

## Implementation order

    Architecture package
      -> holistic Critic
      -> focused closure corrections
      -> WB-0 minimal admission foundation
      -> WB-1 core
      -> WB-2 adapters/Git
      -> WB-3 E2E/regressions
      -> WB-4 profiles/orchestration
      -> WB-5 replacement assurance
      -> WB-6 cutover
      -> WB-7 stabilization
      -> WB-8 graduated autonomy

WB-0 through WB-4 remain inert relative to current production enforcement.

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

### Cross-run writer concurrency before Level 2/3

Current one-writer scheduling guarantee is within one orchestration run.

This is sufficient for the baseline and is not a WB-0/WB-1 blocker.

Before concurrent Level 2/3 admitted runs are enabled, explicitly decide whether the invariant is repository-wide. If yes, add a lightweight trusted admission/orchestration reservation keyed by repository + implementation scope so overlapping write-capable runs serialize across admissions. Do not add a global registry to the baseline unless this higher-autonomy requirement is activated.

## Practical next step

Holistic Critic `cd684f75f97fb860096f16f7deb2994ea036ee8d` identified four Must findings; those are closed.

Focused closure Critic `872d3e66c93544ac14e87312b4ef252e607cae93` confirmed M1-M4 CLOSED and identified one implementation-order blocker: trusted admission was required by WB-1/WB-3 but scheduled only in WB-4.

This plan resolves that blocker by adding WB-0 Minimal Trusted Admission Foundation before controller implementation.

Next:

1. run one final delta-only independent Critic check on this implementation-order correction;
2. require READY for the exact corrected package revision;
3. freeze the implementation-ready package;
4. define and execute WB-0;
5. then define WB-1 against the stable admission interface.

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
