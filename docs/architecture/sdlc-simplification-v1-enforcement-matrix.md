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

## 8. Next decisions

Before code changes, resolve:

1. whether `Work-Block:` commit trailers remain mandatory;
2. exact candidate-creation command/postconditions;
3. exact publication relation between assured candidate SHA and later coordination-only commits;
4. minimal local Hard Stop classifier versus boundaries delegated entirely to platform/Owner;
5. exact runtime hook set retained for Claude and Codex.
