# SDLC Simplification v1 — Enforcement Matrix

Status: draft implementation contract  
Basis: approved SDLC Simplification v1 baseline and implementation-design direction  
Policy owner: shared controller v1 replacement

## 1. Principle

One invariant should have one canonical policy definition.

The shared controller owns project-local lifecycle and authority semantics. Runtime adapters, Git hooks, CI, and external Owner/platform controls observe different facts and enforce the same contract at the layer where those facts are reliable.

No enforcement surface may create authority that the controller/governance model does not grant.

## 2. Enforcement layers

### Shared controller

Owns:

- active Work Block schema and lifecycle state;
- planning-subject/Critic binding;
- implementation and coordination write authority;
- source candidate identity;
- Reviewer/Verifier candidate binding;
- transition and invalidation rules;
- project-local publication eligibility;
- normalized ALLOW/DENY decisions for supported project-local events.

Does not own:

- model/runtime/session provenance;
- full shell-language interpretation;
- GitHub merge authority;
- deployment credentials or production permissions;
- durable AI reports.

### Runtime hooks/adapters

Own:

- runtime event normalization;
- exact structured write target extraction when provided natively;
- stable repository/worktree binding;
- calling the shared controller;
- translating decisions back to Claude/Codex;
- early warning/denial before an invalid structured write happens.

Do not own:

- lifecycle semantics;
- assurance report validation;
- shell AST/security parsing;
- merge/release/deploy authorization;
- session-stop lifecycle transitions.

### Git hooks

Own Git-native transition facts:

- staged paths;
- commit message/trailer;
- current branch;
- commit/candidate identity;
- remote/ref update shape at push time.

They call the shared controller/schema/policy predicates rather than maintain another lifecycle implementation.

### CI

Owns deterministic repository validation after commit/PR:

- schema/contracts;
- controller unit tests;
- runtime-adapter parity tests;
- Git-hook fixtures;
- E2E lifecycle reachability;
- project build/test/static checks.

CI does not create Critic/Reviewer/Verifier authority.

### Owner / external platform

Owns consequential boundaries that local files cannot safely grant:

- merge;
- deploy/release;
- protected/default branch changes;
- force/non-fast-forward/destructive ref changes;
- credentials/secrets;
- live database/data mutation;
- live infrastructure mutation;
- exceptional controller repair/cutover authorization.

## 3. Event matrix

### Open Work Block

Canonical owner: shared controller.

Controller checks:

- state is INACTIVE;
- attached non-default subject branch;
- exact `base_commit`;
- Work Block and initiative identity;
- non-empty `implementation_write_set`;
- bounded `coordination_scope`;
- valid `planning_subject_revision`;
- no conflicting active Work Block in the same worktree.

Runtime hook role: none beyond invoking/allowing the lifecycle CLI.

Git hook role: none.

CI role: transition tests only.

Explicitly not checked:

- Critic runtime/session identity;
- report path;
- subagent topology.

### Approve Critic / enter EXECUTE

Canonical owner: shared controller.

Controller checks:

- lifecycle state is DEFINE;
- `critic_status == READY`;
- `critic_subject_revision == planning_subject_revision`.

Result:

- transition to EXECUTE;
- implementation writes become eligible.

Runtime hook role:

- structured source writes allowed only in EXECUTE and inside `implementation_write_set`;
- coordination writes allowed only inside `coordination_scope` and under stage-specific rules.

Git hook role: none specific to Critic.

Explicitly not checked:

- Critic report file existence;
- execution/session ID;
- runtime/model;
- topology/capability probe.

### Structured implementation write

Canonical owner: shared controller policy.

Runtime adapter supplies:

- repository/worktree identity;
- current branch;
- exact target path(s), when the runtime exposes them structurally.

Controller checks:

- active Work Block;
- EXECUTE;
- branch matches subject branch;
- target inside `implementation_write_set`;
- no applicable Hard Stop.

Git hook later rechecks actual staged paths.

Explicitly not checked:

- arbitrary Bash-string interpretation.

### Coordination write

Canonical owner: shared controller policy.

Controller checks:

- active Work Block;
- target inside `coordination_scope`;
- whether the target is part of the authoritative planning subject;
- stage-specific mutability.

Rules:

- authoritative planning-subject change requires DEFINE and invalidates Critic;
- harmless Orchestrator-log/closeout/engineering-memory updates may remain valid after assurance when they do not alter planning meaning or implementation paths.

### Planning-subject revision

Canonical owner: shared controller.

Controller checks:

- explicit transition to DEFINE;
- new `planning_subject_revision` differs from prior revision.

Result:

- `critic_status = PENDING`;
- `critic_subject_revision = null`;
- candidate and candidate-bound assurance are cleared when already present.

Runtime/Git hooks must not silently update the planning revision from current HEAD.

### Commit during implementation

Canonical owner for lifecycle eligibility: shared controller.  
Canonical owner for staged facts: Git pre-commit.

Pre-commit checks:

- attached subject branch;
- actual staged paths obtained from Git;
- staged paths are within `implementation_write_set + coordination_scope`;
- prohibited local/session/secret-bearing files are absent;
- active state/schema is valid.

If commit-message linkage remains enabled, `commit-msg` checks:

- exactly one valid `Work-Block:` trailer;
- trailer matches active Work Block;
- branch matches subject branch.

Explicitly not checked:

- Reviewer/Verifier reports;
- shell command that produced the index.

### Create source candidate / enter ASSURE

Canonical owner: shared controller lifecycle command using Git facts.

Preconditions:

- EXECUTE;
- Critic still READY for current planning subject;
- worktree/index conditions required by the chosen candidate command are deterministic;
- candidate is already committed;
- actual changed implementation paths from `base_commit` remain inside approved scope.

Result:

- `source_candidate_sha = HEAD`;
- Reviewer/Verifier state reset to PENDING/null;
- transition to ASSURE;
- implementation writes blocked.

No custom content hash or Git-tree identity is created.

### Reviewer result

Canonical owner: shared controller.

READY accepted only when:

- state is ASSURE;
- `reviewer_candidate_sha == source_candidate_sha`.

Negative result requiring source change:

- transition to EXECUTE;
- candidate cleared;
- Reviewer/Verifier reset.

Material planning/scope finding:

- transition to DEFINE;
- planning revision must change;
- Critic and candidate assurance invalidated.

Temporary report remains local/non-authoritative.

### Verifier result

Canonical owner: shared controller.

READY accepted only when:

- state is ASSURE;
- Reviewer is READY for exact candidate;
- `verifier_candidate_sha == source_candidate_sha`.

Failure requiring source change:

- transition to EXECUTE;
- candidate and candidate-bound assurance cleared.

Evidence-only problem with unchanged candidate:

- remain ASSURE;
- Reviewer READY may remain valid;
- Verifier returns to PENDING/null.

### Session Stop / restart

Canonical owner: runtime behavior, not lifecycle.

Runtime hook may:

- warn that a Work Block remains active;
- expose current stage/pending assurance.

Runtime hook must not:

- mutate controller state;
- fabricate closeout;
- require READY assurance merely to terminate a session;
- recursively block re-entrant Stop indefinitely.

Restart reads the same per-worktree state.

### Closeout

Canonical owner: shared controller.

Successful closeout requires:

- ASSURE;
- Reviewer READY for exact candidate;
- Verifier READY for exact candidate;
- required durable conclusions already transferred to project docs/logs;
- no implementation-path change since candidate assurance.

Result:

- active state cleared;
- lifecycle returns to INACTIVE.

Reporting-only/cancelled closeout may occur from supported active states without claiming success.

No historical assurance archive is retained in runtime state.

### Non-force subject-branch push

Canonical lifecycle owner: shared controller.  
Canonical Git facts owner: pre-push.

Pre-push checks:

- exact current subject branch;
- exact permitted remote/ref shape;
- no force/non-fast-forward/destructive update;
- destination is not default/protected branch;
- pushed candidate includes/points to the assured `source_candidate_sha` according to the selected publication contract;
- Reviewer/Verifier are READY for that candidate;
- no Hard Stop applies.

Push may be autonomous when all predicates are true.

Merge is not implied.

### Merge

Canonical owner: Owner / GitHub platform.

Project-local controller:

- may report candidate eligibility;
- must not treat merge as autonomous authority.

Local hooks cannot grant merge authority.

### Deploy / release / live mutation

Canonical owner: Owner / deployment platform / production credentials.

Controller may expose provenance:

- source candidate;
- merged/released SHA;
- deployed SHA.

Controller does not grant the consequential action.

### Exceptional controller repair / cutover

Canonical owner: Owner.

Requirements:

- explicit exact scope;
- exact branch/base;
- explicit reason;
- bounded operation;
- deterministic postconditions;
- no fabricated normal lifecycle approval.

This is not a normal lifecycle state and is not a standing Maintenance Mode.

## 4. Shell policy

The controller/runtime adapters do not implement a general shell grammar.

Rules:

- structured write tools are preferred for path-level pre-write enforcement;
- Git-native hooks validate actual Git results;
- exact known consequential operations such as subject-branch push may have narrow command/ref contracts;
- unsupported ambiguous consequential actions fail closed;
- inert task/prompt/document text containing dangerous command examples is not executable intent by itself.

Regression coverage must include the shell-parser failures recorded in `audit/sdlc-revision`, but the solution is to avoid depending on bespoke shell parsing rather than to reproduce a larger parser.

## 5. Shared schema rule

Controller lifecycle commands, runtime hooks, Git hooks, and CI consume the same state/schema implementation.

There must not be separate definitions of:

- canonical inactive state;
- Work Block identity;
- branch binding;
- scope matching;
- candidate identity;
- assurance readiness.

A valid controller transition must remain representable and committable by the Git-native enforcement layer.

## 6. Next decisions

Before code changes, resolve:

1. exact per-worktree state path;
2. whether `Work-Block:` commit trailers remain mandatory;
3. exact candidate-creation command/postconditions;
4. exact publication relation between assured candidate SHA and later coordination-only commits;
5. minimal local Hard Stop classifier versus boundaries delegated entirely to platform/Owner;
6. exact runtime hook set retained for Claude and Codex.
