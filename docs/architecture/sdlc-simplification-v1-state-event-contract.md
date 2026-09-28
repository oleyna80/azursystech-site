# SDLC Simplification v1 — State and Event Contract

Status: draft implementation contract  
Depends on:
- `docs/architecture/sdlc-simplification-v1.md`
- `docs/architecture/sdlc-simplification-v1-implementation-design.md`
- `docs/architecture/sdlc-simplification-v1-enforcement-matrix.md`

## 1. Purpose

This document defines the exact machine-facing contract for:

1. persisted per-worktree controller state;
2. lifecycle validation invariants;
3. normalized enforcement events consumed by the shared controller policy;
4. normalized policy decisions returned to runtime/Git adapters.

The contract intentionally excludes runtime/session/model provenance, durable AI reports, shell parsing, and historical archives.

## 2. Persisted state envelope

Schema version: `2`.

Canonical shape:

```json
{
  "schema_version": 2,
  "lifecycle_state": "INACTIVE",
  "active": null
}
```

Allowed lifecycle states:

```text
INACTIVE
DEFINE
EXECUTE
ASSURE
```

No other persisted lifecycle state is valid.

Missing state is not a persisted state. It means `NO_LOCAL_AUTHORITY`.

Unknown fields fail validation.

## 3. Active Work Block schema

When `lifecycle_state != INACTIVE`, `active` has exactly this shape:

```json
{
  "work_block_id": "WB-042",
  "initiative_ref": "docs/changes/example",

  "subject_branch": "feat/example",
  "base_commit": "0123456789abcdef0123456789abcdef01234567",

  "planning_subject": {
    "revision": "89abcdef0123456789abcdef0123456789abcdef",
    "paths": [
      "docs/changes/example/intent.md",
      "docs/changes/example/spec.md",
      "docs/changes/example/plan.md",
      "docs/changes/example/work-blocks/wb-01.md"
    ]
  },

  "implementation_write_set": [
    "web/app/example/**",
    "web/lib/example.ts"
  ],
  "coordination_scope": [
    "docs/changes/example/orchestrator-log.md",
    "docs/changes/example/closeout.md",
    "docs/engineering-memory/**"
  ],

  "critic": {
    "status": "PENDING",
    "subject_revision": null
  },

  "source_candidate_sha": null,

  "reviewer": {
    "status": "PENDING",
    "candidate_sha": null
  },

  "verifier": {
    "status": "PENDING",
    "candidate_sha": null
  }
}
```

No timestamps, report paths, execution IDs, runtime IDs, capability records, dispatch records, evidence arrays, write-gate flags, controller-tree pins, or closeout history are persisted.

## 4. Field contracts

### Identity fields

`work_block_id`

- non-empty bounded identifier;
- exact grammar is a controller constant, not duplicated across adapters;
- immutable for the lifetime of the active Work Block.

`initiative_ref`

- repository-relative directory path;
- must not be absolute;
- must not contain `..`;
- immutable for the active Work Block.

`subject_branch`

- exact attached non-default branch at `open`;
- immutable while active;
- detached HEAD is invalid for active source work.

`base_commit`

- exact full Git commit SHA;
- must exist in the target repository;
- must be an ancestor of the admitted subject history at open time;
- immutable while active;
- `open` may never silently rebase it to a later HEAD.

### Planning subject

`planning_subject.revision`

- exact full Git commit SHA containing the reviewed planning subject;
- identifies the revision Critic reviewed;
- changes only through explicit `revise`.

`planning_subject.paths`

- non-empty list of exact repository-relative file paths;
- no glob patterns;
- sorted/canonicalized before persistence;
- duplicates forbidden;
- each path must exist at `planning_subject.revision`;
- includes the exact Intent/Spec/Plan/material Work Block artifacts that define implementation authority;
- every planning-subject path must be matched by `coordination_scope` and must not be matched by `implementation_write_set`;
- `idea.md` is not included unless explicitly made authoritative for that Work Block.

Planning-subject immutability is checked by both:

1. comparing each path's Git object/content at `planning_subject.revision` with the corresponding path at the candidate/publication revision; and
2. requiring that no commit after `planning_subject.revision` through the candidate/publication tip changes any planning-subject path.

This deliberately rejects a planning change followed by a revert. A material planning change must use `revise`, receive a new planning revision, and return through Critic.

`planning_subject.revision` must be an ancestor of the candidate. A later HEAD is allowed to advance for implementation commits without changing `planning_subject.revision`.

### Write scopes

`implementation_write_set`

- non-empty list using the exact path grammar defined below;
- defines implementation mutation authority;
- source candidate changes must be contained by it, except explicitly admitted coordination paths.

`coordination_scope`

- list using the exact path grammar defined below;
- should be narrow;
- does not grant source implementation authority;
- does not by itself make a planning-subject mutation harmless.

Scope path grammar is intentionally small:

- exact repository-relative file/path, for example `web/lib/example.ts`;
- directory-prefix pattern ending exactly in `/**`, for example `web/app/example/**`.

No other glob syntax is supported. `*`, `?`, `[`, and `]` are invalid anywhere except the terminal literal `/**`.

All paths/prefixes:

- use POSIX `/` separators;
- are non-empty and not absolute;
- contain no `.` or `..` segments;
- are canonicalized and sorted;
- contain no duplicates.

For an actual path:

- matching `planning_subject.paths` means planning authority rules take precedence;
- matching both implementation and coordination scopes is invalid/ambiguous and fails closed;
- a structured-write target that resolves through a symlink outside the target worktree is denied;
- planning-subject paths must be covered by coordination scope and excluded from implementation scope.

### Critic

Canonical shape:

```json
{
  "status": "PENDING | BLOCKED | READY",
  "subject_revision": null
}
```

Rules:

- `PENDING` -> `subject_revision = null`;
- `BLOCKED` -> `subject_revision = null`;
- `READY` -> `subject_revision == planning_subject.revision`;
- `EXECUTE` and `ASSURE` require Critic READY for the current planning revision;
- a planning revision resets Critic to PENDING/null.

`critic ready` performs the DEFINE -> EXECUTE transition immediately. Therefore a valid persisted DEFINE state normally contains PENDING or BLOCKED Critic status, not READY.

### Source candidate

`source_candidate_sha`

- null in DEFINE and EXECUTE;
- exact full Git commit SHA in ASSURE;
- set only by `candidate`;
- candidate revision must already be committed and clean;
- candidate revision must descend from `base_commit`;
- candidate planning-subject paths must match `planning_subject.revision`;
- candidate actual changed paths must satisfy admitted scope rules.

### Reviewer

Canonical shape:

```json
{
  "status": "PENDING | READY",
  "candidate_sha": null
}
```

Rules:

- `PENDING` -> `candidate_sha = null`;
- `READY` -> `candidate_sha == source_candidate_sha`;
- Reviewer status is PENDING outside ASSURE;
- negative Reviewer outcomes are transitions, not persisted verdict states.

### Verifier

Same persisted status model as Reviewer:

```json
{
  "status": "PENDING | READY",
  "candidate_sha": null
}
```

Rules:

- `PENDING` -> null SHA;
- `READY` -> exact `source_candidate_sha`;
- Verifier READY requires Reviewer READY for the same candidate;
- evidence-only failure resets Verifier to PENDING/null without changing candidate or Reviewer READY;
- source rework and scope-change outcomes are transitions, not persisted failure states.

## 5. Pre-Work-Block planning authority

The accepted lifecycle creates Idea/Intent/Spec/Plan and material Work Block definition before source execution authority exists.

To avoid adding an initiative lifecycle state, the controller has one static planning surface:

```text
docs/changes/**
```

When state is missing (`NO_LOCAL_AUTHORITY`) or canonical INACTIVE:

- structured writes may be allowed only inside `docs/changes/**`;
- Git commits may contain only `docs/changes/**`;
- the current branch must be attached and non-default;
- no Work-Block trailer is required;
- source/code/control-plane writes remain denied.

This is planning-document authority only. It does not grant implementation, merge, deploy, or control-plane modification authority.

Normal intended flow:

```text
non-default planning branch
-> Idea / Intent / Spec / Plan / Work Block definition commits
-> exact planning commit
-> open Work Block
-> Critic
-> EXECUTE
```

Parallel Work Blocks may branch from the same committed planning subject.

The static pre-WB planning surface is a controller constant shared by runtime and Git policy; adapters do not maintain their own copies.

## 7. State invariants by lifecycle state

### INACTIVE

Required:

```text
active == null
```

No Work Block authority exists.

### DEFINE

Required:

```text
active != null
source_candidate_sha == null
reviewer == PENDING/null
verifier == PENDING/null
critic in {PENDING, BLOCKED}
```

Implementation source writes are denied.

Planning/coordination writes are permitted only through explicit DEFINE rules and admitted scopes.

### EXECUTE

Required:

```text
critic == READY/current planning revision
source_candidate_sha == null
reviewer == PENDING/null
verifier == PENDING/null
```

Implementation writes may be allowed inside `implementation_write_set`.

Planning-subject paths are immutable. Changing them requires `revise`.

### ASSURE

Required:

```text
critic == READY/current planning revision
source_candidate_sha != null
reviewer in {PENDING, READY}
verifier in {PENDING, READY}
```

Additional rules:

- Reviewer READY binds exact candidate;
- Verifier READY binds exact candidate;
- Verifier READY requires Reviewer READY;
- implementation and planning-subject mutations are denied;
- admitted post-candidate coordination-only commits may occur.

## 7. Lifecycle transitions

Persisted transitions are exactly:

```text
NO_LOCAL_AUTHORITY --open--> DEFINE
INACTIVE           --open--> DEFINE

DEFINE  --critic ready--> EXECUTE
DEFINE  --critic blocked--> DEFINE
DEFINE  --revise--> DEFINE
DEFINE  --close reporting-only/cancelled--> INACTIVE

EXECUTE --revise--> DEFINE
EXECUTE --candidate--> ASSURE
EXECUTE --close reporting-only/cancelled--> INACTIVE

ASSURE --reviewer rework--> EXECUTE
ASSURE --reviewer scope-change--> DEFINE
ASSURE --reviewer ready--> ASSURE

ASSURE --verifier rework--> EXECUTE
ASSURE --verifier scope-change--> DEFINE
ASSURE --verifier evidence-problem--> ASSURE
ASSURE --verifier ready--> ASSURE

ASSURE --revise--> DEFINE
ASSURE --publish success--> INACTIVE
ASSURE --close reporting-only/cancelled--> INACTIVE
```

No generic `open` transition exists from an active state.

## 8. Normalized enforcement event envelope

Event schema version: `1`.

Canonical envelope:

```json
{
  "event_version": 1,
  "source": "claude",
  "kind": "structured_write",
  "worktree_root": "/absolute/resolved/worktree",
  "branch": "feat/example",
  "paths": [
    "web/app/example/page.tsx"
  ],
  "facts": {}
}
```

Allowed `source` values:

```text
claude
codex
git
controller
```

Allowed authority-bearing `kind` values:

```text
structured_write
git_pre_commit
git_commit_message
git_pre_push
```

Context-only/non-authority events may use:

```text
subagent_context
diagnostic
```

Lifecycle CLI transitions do not masquerade as runtime enforcement events. They call the controller transition API directly.

## 9. Common event fields

`event_version`

- exact integer `1`.

`source`

- identifies adapter origin only;
- never grants authority;
- equivalent events from Claude/Codex must produce equivalent decisions.

`kind`

- determines the exact fact schema;
- unknown authority-bearing kinds fail closed.

`worktree_root`

- absolute canonical path resolved by the adapter from runtime/Git facts;
- used to locate the per-worktree Git-private controller state;
- not persisted in state;
- the shared controller independently verifies that the target worktree belongs to the same Git common repository as the invoked controller/hook installation before granting authority.

`branch`

- exact current attached branch when the event requires active Work Block authority;
- null is allowed only for event kinds where branch is irrelevant;
- detached/unknown branch fails closed for mutation/publication events.

`paths`

- canonical repository-relative actual target paths;
- exact paths only, never patterns;
- sorted and duplicate-free;
- adapter must reject/deny an authority-bearing event when exact required paths cannot be extracted.

`facts`

- strict per-kind object;
- unknown keys fail validation;
- raw runtime `tool_input`, shell command text, prompt text, model/session IDs, and report paths do not enter the canonical policy event.

## 10. Structured write event

Shape:

```json
{
  "event_version": 1,
  "source": "claude | codex",
  "kind": "structured_write",
  "worktree_root": "/abs/worktree",
  "branch": "feat/example",
  "paths": ["web/app/example/page.tsx"],
  "facts": {
    "tool_class": "write | edit | patch"
  }
}
```

Rules:

- at least one exact target path is required;
- all targets are evaluated together;
- any denied target denies the whole event;
- `tool_class` is diagnostic/routing information only;
- shell/Bash commands do not get converted to `structured_write` by guessing side effects.

Policy checks:

- same-repository worktree binding;
- valid per-worktree state, or static pre-WB planning authority when state is missing/INACTIVE;
- active branch binding when a Work Block is active;
- lifecycle stage;
- path classification: planning / implementation / coordination / outside;
- applicable deterministic local Hard Stop.

## 11. Git pre-commit event

Git adapter gathers facts from Git, not command text.

Shape:

```json
{
  "event_version": 1,
  "source": "git",
  "kind": "git_pre_commit",
  "worktree_root": "/abs/worktree",
  "branch": "feat/example",
  "paths": [
    "web/app/example/page.tsx"
  ],
  "facts": {
    "head_sha": "0123456789abcdef0123456789abcdef01234567"
  }
}
```

`paths` are the exact staged paths from the index.

Policy checks:

- same-repository worktree binding;
- valid active state, canonical INACTIVE, or missing-state pre-WB planning case as applicable;
- default branch mutation denied;
- active branch binding;
- staged paths inside admitted scopes when active;
- post-candidate ASSURE commits contain only allowed coordination paths and no planning-subject paths;
- forbidden local/secret-bearing staged paths denied by deterministic path rules.

The pre-commit policy does not inspect shell history or the command that produced the index.

## 12. Git commit-message event

Shape:

```json
{
  "event_version": 1,
  "source": "git",
  "kind": "git_commit_message",
  "worktree_root": "/abs/worktree",
  "branch": "feat/example",
  "paths": [],
  "facts": {
    "work_block_trailers": ["WB-042"]
  }
}
```

Adapter parses trailers with Git-native facilities before producing the normalized event.

Policy checks when a Work Block is active:

- exactly one trailer;
- exact match to `work_block_id`;
- branch match.

When canonical INACTIVE or missing-state pre-WB planning, no Work-Block trailer is required by SDLC authority.

## 13. Git pre-push event

One normalized event represents one ref update.

Shape:

```json
{
  "event_version": 1,
  "source": "git",
  "kind": "git_pre_push",
  "worktree_root": "/abs/worktree",
  "branch": "feat/example",
  "paths": [],
  "facts": {
    "remote_name": "origin",
    "local_ref": "refs/heads/feat/example",
    "local_sha": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    "remote_ref": "refs/heads/feat/example",
    "remote_sha": "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"
  }
}
```

A new remote branch uses the all-zero Git SHA for `remote_sha`.

Policy checks:

- active state is ASSURE;
- exact remote destination equals `refs/heads/<subject_branch>`;
- deletion is denied;
- update is fast-forward or creates the branch;
- local SHA contains the exact `source_candidate_sha`;
- Reviewer and Verifier are READY for that candidate;
- every commit after candidate through local SHA is coordination-only and changes neither implementation paths nor planning-subject paths.

A pre-push invocation containing multiple ref updates evaluates each update independently and denies the whole push if any update is denied.

## 14. Context-only subagent event

Optional shape:

```json
{
  "event_version": 1,
  "source": "claude | codex",
  "kind": "subagent_context",
  "worktree_root": "/abs/worktree",
  "branch": "feat/example",
  "paths": [],
  "facts": {}
}
```

Response may include read-only contextual fields such as:

- work_block_id;
- lifecycle_state;
- initiative_ref;
- subject_branch;
- implementation_write_set;
- coordination_scope.

It never changes state and never grants authority.

## 15. Normalized policy decision

Decision schema version: `1`.

Canonical shape:

```json
{
  "decision_version": 1,
  "decision": "ALLOW",
  "code": "WRITE_IMPLEMENTATION_ALLOWED",
  "reason": "EXECUTE write is inside implementation_write_set"
}
```

Allowed decisions:

```text
ALLOW
DENY
ADVISORY
```

`code` is a stable machine-readable identifier used by parity/regression tests.

`reason` is concise human-readable detail and may vary without changing semantics.

Adapters map this object into their runtime-native hook response format.

Equivalent normalized Claude/Codex events must produce the same `decision` and `code`.

## 16. Initial decision codes

Minimum stable codes:

```text
STATE_MISSING
STATE_INVALID
STATE_INACTIVE
BRANCH_UNKNOWN
BRANCH_MISMATCH
LIFECYCLE_STAGE_DENIED

WRITE_IMPLEMENTATION_ALLOWED
WRITE_COORDINATION_ALLOWED
WRITE_PLANNING_ALLOWED
WRITE_OUTSIDE_SCOPE
WRITE_SCOPE_AMBIGUOUS
WRITE_PLANNING_STAGE_DENIED

COMMIT_ALLOWED
COMMIT_DEFAULT_BRANCH_DENIED
COMMIT_SCOPE_DENIED
COMMIT_POST_CANDIDATE_DENIED
COMMIT_FORBIDDEN_PATH

COMMIT_MESSAGE_ALLOWED
COMMIT_MESSAGE_TRAILER_MISSING
COMMIT_MESSAGE_TRAILER_DUPLICATE
COMMIT_MESSAGE_TRAILER_MISMATCH

PUSH_ALLOWED
PUSH_STAGE_DENIED
PUSH_REF_DENIED
PUSH_DELETE_DENIED
PUSH_NON_FAST_FORWARD_DENIED
PUSH_CANDIDATE_MISMATCH
PUSH_ASSURANCE_NOT_READY
PUSH_POST_CANDIDATE_HISTORY_DENIED

CONTEXT_AVAILABLE
CONTEXT_UNAVAILABLE
```

Additional codes require a distinct deterministic policy outcome, not merely a different prose explanation.

## 17. Adapter mapping requirements

### Claude Code

The Claude adapter:

1. receives native hook JSON;
2. resolves target worktree from native `cwd`;
3. extracts exact path(s) only for supported structured mutation tools;
4. emits normalized `structured_write`;
5. maps shared decision back to Claude's native hook decision schema.

If a native structured mutation tool is recognized but the exact target path cannot be extracted, the adapter emits/returns a fail-closed authority error rather than guessing.

Bash is not normalized into structured-write authority.

### Codex

The Codex adapter follows the same sequence.

For structured patch/edit/write operations, exact paths are extracted from the native structured payload.

If an operation is only available as opaque shell text, the adapter does not invent structured write facts.

### Git

Git hooks do not pass raw stdin/argv directly into controller policy.

The Git adapter first converts Git-native facts into the exact normalized event shape, then calls the shared evaluator.

## 18. Validation and canonicalization

State/event validation must be strict:

- exact schema versions;
- exact allowed keys;
- exact types;
- full Git SHAs where required;
- safe repository-relative path grammar;
- deterministic ordering before persistence/comparison;
- duplicate paths rejected;
- unknown authority-bearing enum values rejected;
- malformed authority data fails closed.

Canonical JSON serialization remains useful for atomic state persistence, but canonical serialization is not a candidate identity mechanism.

## 19. Regression requirements

At minimum test:

### State

- exact INACTIVE validation;
- unknown field rejection;
- invalid state/stage combinations;
- stale Critic binding;
- Reviewer/Verifier candidate mismatch;
- Verifier READY without Reviewer READY;
- source candidate outside ASSURE;
- active state missing candidate in ASSURE;
- immutable identity fields preserved across transitions.

### Planning subject

- implementation commits can advance HEAD while planning revision remains fixed;
- candidate rejected when any planning-subject path differs from reviewed revision;
- planning path change followed by revert before candidate is still detected when committed history rules require explicit revise;
- `revise` resets Critic/candidate assurance.

### Events

- Claude/Codex structured-write parity;
- unknown exact path fails closed;
- runtime source field does not change policy outcome;
- raw shell text never becomes structured authority by inference;
- actual staged paths override command intent;
- multi-ref push denies atomically when one ref is invalid.

### Worktrees

- state path isolation between linked worktrees;
- nested cwd resolves correct worktree;
- missing/corrupt state grants no mutation authority.

## 20. Work Block identifier grammar

Retain the existing repository-compatible grammar:

```text
^WB-(?:[0-9]{3}|[0-9]{4}-[0-9]{2}-[0-9]{2}-[a-z0-9]+(?:-[a-z0-9]+)*)$
```

Examples:

```text
WB-042
WB-2026-09-28-sdlc-controller
```

The controller owns this grammar as one constant shared by state validation and commit-message validation.

Identifier naming style is traceability, not authority. No new identifier format is introduced as part of this simplification.

## 21. Design checkpoint

The exact state/event contract is now resolved for implementation planning, including:

- state envelope and active fields;
- lifecycle/status invariants;
- pre-WB planning authority;
- planning-subject immutability;
- scope path grammar;
- normalized event/decision schemas;
- runtime/Git adapter responsibility;
- Work Block identifier grammar.

The next step is to derive the implementation plan and acceptance-test inventory from this contract before modifying controller code.
