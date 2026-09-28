# SDLC Simplification v1 — Enforcement Matrix

Status: enforcement design checkpoint accepted; exact state/event schemas pending  
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
- root-stable controller/hook resolution independent of mutable shell cwd;
- calling the shared controller;
- translating decisions back to Claude/Codex;
- early warning/denial before an invalid structured write happens.

Do not own:

- lifecycle semantics;
- assurance report validation;
- shell AST/security parsing;
- merge/release/deploy authorization;
- session-stop lifecycle transitions;
- subagent authority.

Subagent-start hooks may provide the active Work Block context to a delegated agent, but they do not open write authority, satisfy Critic/Reviewer/Verifier gates, or prove independence/topology.

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

CI does not create Critic/Reviewer/Verifier authority and does not invoke opaque AI review as a required control-plane gate. Its enforcement is deterministic.

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

- warn once that a Work Block remains active;
- expose current stage/pending assurance;
- allow a runtime-provided re-entrant Stop/termination attempt to complete without lifecycle mutation.

Runtime hook must not:

- mutate controller state;
- fabricate closeout;
- require READY assurance merely to terminate a session;
- recursively block re-entrant Stop indefinitely.

Restart reads the same per-worktree state.

Hook entrypoints must resolve from the bound repository/project root rather than the runtime's mutable current working directory.

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
- may deny a clearly identified unauthorized local merge attempt as defense in depth;
- must not treat merge as autonomous authority.

Local hooks cannot grant merge authority. GitHub/Owner remains the authoritative merge boundary.

### Deploy / release / live mutation

Canonical owner: Owner / deployment platform / production credentials.

Controller may expose provenance:

- source candidate;
- merged/released SHA;
- deployed SHA.

Controller does not grant the consequential action. Runtime/local policy may deny a clearly structured unauthorized attempt, but platform credentials/permissions and Owner authorization remain the final boundary.

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

## 6. Runtime-specific hook contract

The controller contract is runtime-neutral, but hook wiring is not identical between Claude Code and Codex.

The implementation must therefore keep two thin adapters with one normalized controller event model.

### Common normalized events

Both adapters should map their native hook payloads into a minimal common shape such as:

```text
runtime
event
repository_root
worktree_root
cwd
tool_name
operation
paths
tool_input
reentrant_stop
agent_type
```

Only fields required by the specific event are populated.

Runtime/session/model identifiers may be logged for diagnostics but do not create authority.

### Claude Code adapter

Use Claude Code `PreToolUse` for structured pre-write enforcement.

Claude Code can deny a tool call before execution and supplies structured `tool_name` / `tool_input` data. The adapter should use only the subset needed for supported structured events.

Claude Code project-root and worktree facts require special handling:

- hook script resolution should be stable and independent of mutable shell cwd;
- `${CLAUDE_PROJECT_DIR}` identifies the project root where the session started;
- hook input `cwd` follows the current directory/worktree;
- therefore project-root script location and target worktree authority are distinct facts;
- the adapter must derive the target worktree from the structured hook `cwd`, not assume `${CLAUDE_PROJECT_DIR}` is the active worktree.

`SubagentStart` is context-only for this SDLC. It may inject Work Block context but cannot open authority or satisfy assurance.

No blocking Stop hook is required by the target SDLC. If a Stop hook is retained for advisory UX, it must never mutate lifecycle state and must honor the runtime re-entrancy signal.

Claude-specific richer decisions such as ask/defer/input rewriting are not part of the canonical SDLC policy contract unless a later requirement explicitly needs them.

### Codex adapter

Use Codex `PreToolUse` for structured pre-write enforcement.

Current Codex hook payloads expose `cwd`, `tool_name`, `tool_input`, and optional subagent context, so the adapter can normalize the same core write events as Claude Code.

Codex hook output supports blocking before tool execution. The target SDLC should use the smallest portable subset: allow/no decision or deny/block with a reason.

`SubagentStart` may emit additional context and is context-only for this SDLC. It does not grant write authority or prove Critic/Reviewer/Verifier independence.

Codex also exposes a Stop re-entrancy signal. No blocking Stop hook is required by the target SDLC.

Codex project-local hook launch must resolve the active repository/worktree robustly from Git/runtime facts rather than depend on a mutable nested cwd path string. The adapter then passes that worktree identity to the shared controller.

### Portable protection baseline

The SDLC relies on runtime hooks only for protections both runtimes can implement reliably:

1. pre-execution denial of structured file mutations outside the current controller authority;
2. branch/worktree/state binding for those structured mutations;
3. optional context injection for subagents;
4. advisory diagnostics.

The SDLC does not rely on runtime hooks alone for:

- commit eligibility;
- staged-path containment;
- candidate identity;
- assurance-to-candidate binding at Git publication;
- push ref safety;
- merge/deploy/production authority.

Those protections are enforced again at Git-native or external boundaries.

### Runtime parity rule

Equivalent normalized events must produce the same shared-controller decision regardless of runtime.

Adapter-specific tests must prove:

- Claude structured write allow/deny parity with Codex;
- nested cwd behavior;
- worktree behavior;
- malformed payload fail-closed behavior for authority-bearing events;
- subagent context does not grant authority;
- Stop/session termination does not change lifecycle state.

Runtime-specific features may improve UX but must not become a required invariant unless both the enforcement matrix and regression suite explicitly adopt that dependency.

## 7. Per-worktree state discovery and recovery contract

### Canonical state location

The active controller state is not stored in the checkout and is not tracked by Git.

For the target worktree, resolve the state path through Git:

```text
git rev-parse --path-format=absolute --git-path azursystech/active-work-block.json
```

The controller does not construct `.git/worktrees/<name>` paths itself.

This gives each linked worktree its own private state location while allowing Git to decide the correct private/common metadata path.

No absolute worktree path is persisted inside the authority record.

### Worktree discovery

For a runtime event:

1. take the runtime-provided event `cwd`;
2. resolve the target worktree with `git -C <cwd> rev-parse --show-toplevel`;
3. reject events that are not inside a valid non-bare worktree when the operation needs Work Block authority;
4. resolve the state path from that target worktree using `git rev-parse --git-path`;
5. evaluate branch/state/path authority against that worktree.

The runtime's initial project root is used only to locate stable hook/controller code where the runtime requires it. It is not assumed to be the target worktree.

Git hooks run the same resolver from the Git worktree in which the hook event occurs.

### Missing state is not INACTIVE

A missing state file means:

```text
NO_LOCAL_AUTHORITY
```

It is a bootstrap condition outside the four-state lifecycle, not a fifth persisted lifecycle state.

Consequences:

- read-only inspection remains possible;
- ordinary source mutation receives no Work Block authority;
- Critic/Reviewer/Verifier status is not reconstructed;
- no hook or bootstrap helper silently creates an active or successful state.

A normal lifecycle `open` may create the first state record only after validating the exact target worktree and the new Work Block opening contract.

### Canonical INACTIVE

After a normal closeout the state file remains present in canonical `INACTIVE` form.

This makes the difference explicit:

```text
missing file  = no local authority / uninitialized or lost state
INACTIVE      = controller initialized and no active Work Block
active state  = exact current Work Block authority
```

The canonical INACTIVE record is generated by controller code. There is no tracked `active-work-block.default.json`.

### Lost active state

Loss/corruption of an active state fails closed.

The controller must not infer the missing Critic/Reviewer/Verifier or active authority from:

- current branch name;
- latest commit trailer;
- reports;
- chat/runtime memory;
- Git history heuristics.

Recovery uses durable planning/source Git artifacts only to restart the workflow explicitly.

At minimum:

- source writes remain blocked;
- current Git work must be preserved;
- the operator/Orchestrator identifies the durable planning subject and candidate state;
- the relevant Critic/Reviewer/Verifier checks are rerun where transient authority was lost;
- a fresh DEFINE/open or fresh worktree may be used rather than fabricating prior runtime state.

No exact continuation guarantee exists after local transient state loss.

### Worktree handoff

Authority never follows a runtime merely because it executes `cd`.

A runtime event is evaluated against the worktree containing that event's `cwd`.

If a runtime cannot safely rebind its project/hook environment to a different worktree, the correct handoff is a new/restarted session in the target worktree. Session termination itself remains non-authoritative and must not mutate lifecycle state.

### Tests

Required regressions:

- main worktree and linked worktree resolve distinct state files;
- two linked worktrees cannot read/write each other's controller state through normal resolution;
- nested cwd resolves the same target worktree state;
- missing state grants no mutation authority;
- canonical INACTIVE is distinct from missing state;
- corrupted state fails closed;
- active-state deletion does not become INACTIVE;
- deliberate new-session worktree handoff succeeds;
- stale original-session project root cannot redirect authority away from the event worktree;
- controller state never appears in staged/committed paths.

## 8. Commit linkage, candidate, and publication contract

### Work-Block commit trailer

Retain the `Work-Block:` commit trailer as mandatory traceability while a Work Block is active.

Example:

```text
Work-Block: WB-042
```

The trailer is not authority.

The Git `commit-msg` hook checks only:

- active per-worktree controller state is valid;
- current branch matches the active subject branch;
- exactly one `Work-Block:` trailer is present;
- trailer value exactly matches `work_block_id`.

When controller state is canonical INACTIVE, the trailer is not required.

Planning commits created before a Work Block is opened do not require a Work Block trailer.

Squash/rebase/merge strategy may change the final main-branch commit identity; the durable candidate-to-merge relation is tracked separately and does not depend on preserving the trailer in the final merge commit.

### Candidate command

The target lifecycle has one explicit candidate transition from EXECUTE to ASSURE.

Conceptual command:

```text
controller candidate
```

It does not stage or commit source.

The candidate must already be a committed Git revision.

Preconditions:

- active state is EXECUTE;
- current attached branch exactly equals `subject_branch`;
- worktree and index are clean;
- current HEAD is a valid commit;
- `base_commit` is an ancestor of HEAD;
- current planning-subject binding still matches the Critic-approved revision;
- Critic is READY for that exact planning revision;
- actual Git-changed paths since the admitted baseline are contained in `implementation_write_set + coordination_scope`;
- no authoritative planning-subject path has changed since `planning_subject_revision` without returning to DEFINE.

Result:

```text
source_candidate_sha = HEAD
reviewer_status = PENDING
reviewer_candidate_sha = null
verifier_status = PENDING
verifier_candidate_sha = null
EXECUTE -> ASSURE
```

No custom content hash or Git-tree candidate identity is created.

This ordering is mandatory:

```text
implementation
-> stage
-> commit
-> candidate
-> Reviewer
-> Verifier
```

There is no post-freeze staging phase.

### Post-assurance coordination commits

After `source_candidate_sha` is established, source implementation is immutable until a rework transition.

Coordination-only commits may be created after assurance when needed for:

- Orchestrator log;
- closeout documentation;
- reusable engineering-memory notes;
- publication/deployment notes that do not redefine the assured planning subject.

A post-assurance commit must not modify:

- any path matched by `implementation_write_set`;
- any authoritative `planning_subject.paths`.

Allowed paths must be matched by `coordination_scope`.

If one actual path ambiguously matches both implementation and coordination scope, the operation fails closed. Scope definitions should therefore be non-overlapping.

Reviewer/Verifier binding remains attached to `source_candidate_sha`, not to later coordination-only HEAD commits.

### Publication relation

The normal publishable branch tip may be later than the assured candidate:

```text
source_candidate_sha
  -> zero or more coordination-only commits
  -> publish_tip_sha
```

Publication validation requires:

- `source_candidate_sha` is an ancestor of the exact pushed tip;
- Reviewer READY and Verifier READY both bind to `source_candidate_sha`;
- every commit after `source_candidate_sha` and up to the pushed tip changes only allowed post-assurance coordination paths;
- no post-candidate commit changes an implementation path or authoritative planning-subject path, even if a later commit would revert the net tree change;
- pushed ref is the exact non-default subject branch;
- update is non-force / fast-forward;
- no external Hard Stop applies.

Checking each post-candidate commit prevents a source-change-then-revert history from being treated as equivalent to clean coordination-only history.

### Preferred publication operation

Do not depend on arbitrary Bash parsing for the normal publication path.

The target CLI should expose a dedicated publication operation, conceptually:

```text
controller publish
```

It validates the shared controller/Git predicates and performs only the exact allowed subject-branch publication form.

A Git pre-push hook remains a deterministic backstop for direct Git usage.

Normal successful procedure:

```text
ASSURE
-> Reviewer READY
-> Verifier READY
-> optional durable coordination-only closeout commit(s)
-> controller publish
-> remote exact-ref verification
-> success close
-> INACTIVE
```

If publication fails, the active ASSURE state remains intact and the operation can be retried. The controller must not clear active authority before successful publication when publication is part of the normal Work Block delivery procedure.

Reporting-only/cancelled closeout remains separate and must not claim publication or assurance success.

### Required regressions

- implementation can be staged and committed before candidate creation;
- candidate creation never requires post-candidate staging;
- candidate command rejects dirty worktree/index;
- candidate command rejects changed planning subject with stale Critic binding;
- candidate command rejects actual Git paths outside admitted scopes;
- Reviewer/Verifier remain bound to candidate after safe coordination-only commits;
- post-candidate implementation-path commit is rejected;
- post-candidate planning-subject commit is rejected;
- source-change-then-revert history after candidate is rejected;
- exact non-force subject push succeeds;
- failed push leaves ASSURE state active;
- direct Git push receives the same core decision through pre-push;
- Work-Block trailer mismatch/duplicate is rejected without adding lifecycle semantics to commit-msg.

## 9. Local Hard Stops and retained runtime hooks

### Protection guarantee

The target control plane guarantees that an unauthorized or out-of-scope local mutation cannot become an accepted candidate or normal publication merely because a runtime hook missed the transient working-tree mutation.

The authoritative promotion boundaries are:

```text
structured pre-write hook
    -> Git pre-commit actual staged paths
    -> controller candidate actual committed Git state
    -> Reviewer/Verifier candidate binding
    -> Git pre-push / controller publish exact ref facts
    -> Owner/platform merge/deploy boundaries
```

Runtime hooks provide early prevention and ergonomics. Git/controller/platform boundaries provide the deterministic promotion guarantees.

### Bash is not an authority parser

A project-local Bash hook is not required to prove all possible shell side effects.

In particular, the SDLC does not claim that arbitrary shell execution cannot transiently modify a working tree outside scope.

Such mutation remains:

- unapproved;
- reversible/local;
- unable to pass normal pre-commit/candidate publication checks.

Runtime sandbox/approval mechanisms and user/Owner permissions remain additional protection against destructive local shell behavior.

A small direct-command accident guard may remain for obvious dangerous forms, but it is defense-in-depth only and must not be used as proof that shell execution is safe.

### Local deterministic Hard Stops

Keep deterministic local denial where the controlling layer has reliable facts:

- commit on default branch -> Git pre-commit DENY;
- staged path outside admitted scopes -> Git pre-commit DENY;
- prohibited local/secret-bearing files staged -> Git pre-commit DENY;
- force/non-fast-forward/ref deletion/default or protected subject publication -> Git pre-push/controller publish DENY;
- candidate mismatch or stale assurance at publication -> Git pre-push/controller publish DENY;
- malformed/ambiguous controller authority state -> controller/Git hooks DENY.

### External Hard Stops

Final authority remains outside project-local hooks for:

- merge;
- deploy/release;
- production/live-data mutation;
- live infrastructure mutation;
- credentials/secrets changes;
- protected/default branch administration;
- exceptional force/history rewrite;
- destructive external operations.

Runtime adapters may deny a clearly structured unauthorized attempt as defense in depth, but local text/state cannot grant these capabilities.

### Claude Code hooks retained

Target authority hooks:

- `PreToolUse` for structured mutation tools such as Edit/Write/MultiEdit or equivalent runtime-native file-write events;
- optional `SubagentStart` context injection only.

Not part of target authority:

- blocking Stop assurance gate;
- PostToolUse lifecycle gates;
- Bash shell parser as lifecycle/security proof.

A project-specific PostToolUse typecheck may remain as developer feedback, but it is outside SDLC authority.

Hook command location must be root-stable. Target worktree authority is derived from the hook event's `cwd`.

### Codex hooks retained

Target authority hooks:

- `PreToolUse` for structured mutation tools such as `apply_patch`, Edit, Write, or equivalent structured file mutation events;
- optional `SubagentStart` context injection only.

Not part of target authority:

- blocking Stop assurance gate;
- Bash shell parser as lifecycle/security proof;
- runtime capability/topology gate.

Equivalent normalized structured writes must receive the same controller decision as Claude Code.

### Git hooks retained

Target Git hooks:

- `pre-commit` — actual staged-path containment, valid controller state/branch, candidate-safe Git invariants;
- `commit-msg` — Work-Block traceability only;
- `pre-push` — actual ref update, candidate/assurance/publication predicates.

All three call shared controller/schema functions and must remain thin.

## 10. Target lifecycle CLI

The target lifecycle CLI is intentionally small and explicit.

### `status`

Read-only.

Reports:

- state presence;
- lifecycle state;
- active WB identity;
- branch binding;
- planning/Critic binding;
- candidate and Reviewer/Verifier status.

It creates no authority.

### `open`

Creates a new DEFINE state from canonical INACTIVE or a valid missing-state bootstrap condition.

Binds:

- Work Block ID;
- initiative reference;
- subject branch;
- base commit;
- current planning-subject revision/paths;
- implementation write set;
- coordination scope.

It fails when another Work Block is active.

### `critic`

Records Critic disposition for the exact current planning subject.

Supported outcomes:

- `ready` -> bind `critic_subject_revision` and transition DEFINE -> EXECUTE;
- `blocked` -> remain DEFINE without source authority.

No report/runtime/session identity is required.

### `revise`

Explicit material planning revision.

May be invoked from DEFINE, EXECUTE, or ASSURE.

It:

- preserves Work Block ID, initiative, branch, and base commit;
- installs a new planning-subject revision/paths;
- may explicitly replace implementation/coordination scopes when the new planning revision changes them;
- resets Critic to PENDING;
- clears candidate and Reviewer/Verifier bindings;
- transitions to DEFINE.

There is no silent re-open of an active Work Block.

### `candidate`

Performs the committed candidate transition defined above:

```text
EXECUTE -> ASSURE
source_candidate_sha = HEAD
```

It never stages or commits files.

### `reviewer`

Supported outcomes:

- `ready` -> bind Reviewer READY to exact candidate;
- `rework` -> clear candidate assurance and return to EXECUTE;
- `scope-change` -> clear candidate assurance, reset Critic, return to DEFINE.

### `verifier`

Supported outcomes:

- `ready` -> bind Verifier READY to exact candidate, requiring Reviewer READY first;
- `rework` -> clear candidate assurance and return to EXECUTE;
- `scope-change` -> clear candidate assurance, reset Critic, return to DEFINE;
- `evidence-problem` -> remain ASSURE, preserve candidate and valid Reviewer READY, reset Verifier only.

### `publish`

Normal successful terminal operation.

It:

1. requires ASSURE;
2. requires Reviewer and Verifier READY for `source_candidate_sha`;
3. validates post-candidate history as coordination-only;
4. validates exact subject-branch non-force publication;
5. performs the exact allowed subject-branch push;
6. verifies the remote ref equals the pushed local tip;
7. only after successful verification clears active authority to canonical INACTIVE.

If push or verification fails, ASSURE state remains unchanged.

This avoids a separate persistent PUBLISHED lifecycle state and removes the old terminal/publication projection machinery.

### `close`

Non-success terminal operation only:

- `reporting-only`;
- `cancelled`.

It clears active local authority without claiming candidate assurance/publication success.

Normal successful delivery uses `publish`, not `close --success`.

### Removed legacy verbs/concepts

No target equivalent is required for:

- `prepare`;
- `freeze`;
- `prepare-reviewer`;
- `finalize-reviewer`;
- `prepare-verifier`;
- `finalize-verifier`;
- capability refresh/probe;
- dispatch records;
- assurance retry flag;
- terminal prepare/finalize publication states.

## 11. CLI transition regressions

The E2E suite must prove:

- `open` cannot replace an active Work Block;
- `critic ready` cannot bind a stale planning revision;
- no implementation write becomes valid before EXECUTE;
- `revise` is the only normal way to change material planning/scopes after open;
- `candidate` requires a committed clean valid Git state;
- Reviewer rework returns to EXECUTE without changing the planning revision;
- scope change returns to DEFINE and requires a new Critic binding;
- Verifier evidence-only retry preserves candidate and Reviewer READY;
- `publish` fails without exact assurance;
- failed publication leaves ASSURE active;
- successful publication returns directly to INACTIVE;
- reporting-only/cancelled close never claims success.

## 12. Accepted enforcement checkpoint

The following implementation-design decisions are accepted as the baseline for the next design pass:

- one shared local controller policy engine;
- thin, runtime-specific Claude Code and Codex adapters;
- per-worktree controller state stored in Git private worktree metadata;
- missing state means no local authority, not INACTIVE;
- mandatory Work-Block commit trailer while a Work Block is active, for traceability only;
- implementation is committed before candidate formation;
- source candidate identity is the exact Git commit SHA;
- Reviewer and Verifier bind to the exact source candidate SHA;
- post-assurance commits are coordination-only and must preserve implementation and planning-subject immutability;
- normal publication is exact non-force subject-branch publication after assurance;
- successful publish returns directly to INACTIVE after remote-ref verification;
- runtime hooks protect structured pre-write operations but are not the sole promotion boundary;
- Git hooks are authoritative for staged paths, commit linkage, and ref updates;
- no bespoke general shell parser is part of the target security model;
- blocking Stop hooks are removed from SDLC authority;
- CI is deterministic only;
- merge, deploy/release, credentials, production/live data, protected/default branch administration, and exceptional history rewrite remain Owner/platform boundaries;
- Maintenance Mode is not part of the normal target lifecycle;
- legacy blocking cases from `audit/sdlc-revision` are required regression inputs.

This checkpoint is architecture/design only and grants no implementation authority.

The next design pass must define:

1. the exact persisted active-state schema and validation invariants;
2. the normalized event schema shared by Claude Code, Codex, Git hooks, and CLI/controller policy;
3. the exact adapter mapping from each runtime-native hook payload into that normalized event model.

## 13. Next decisions

Before code changes, resolve:

All enforcement-placement questions in this document are resolved. The next design pass is the exact state/event schema contract.
