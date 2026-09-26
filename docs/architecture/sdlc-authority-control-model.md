---
artifact_type: architecture_model
status: draft
scope: docs-only
not_work_block: true
---

# SDLC Authority & Control-Point Model

## Purpose

This document defines where authority lives, which layer owns each control point, and which controls are safety boundaries versus cooperative guardrails.

It is an architectural draft for the SDLC revision branch. It does not grant implementation authority.

## Core principle

> Put each invariant in the lowest layer that can observe and enforce it reliably, and do not duplicate lifecycle policy across runtimes.

Preferred enforcement order:

1. external platform / capability boundary;
2. Git-native validation where Git has authoritative evidence;
3. shared runtime-neutral policy;
4. thin runtime-specific adapters;
5. prose only where no mechanical control is practical.

## Authority classes

### AUTH-1 — Ordinary engineering authority

May be exercised autonomously inside an approved Work Block.

Includes:

- source changes inside exact write-set;
- coordination/evidence changes inside exact coordination set;
- tests;
- freeze;
- candidate assurance;
- exact candidate staging;
- local candidate commit;
- exact non-force push to the subject branch when publication prerequisites are satisfied.

Ordinary engineering must not require Owner approval for every routine transition.

### AUTH-2 — Bounded lifecycle recovery authority

May be exercised autonomously only through explicit lifecycle transitions whose preconditions are mechanically verifiable.

Examples:

- source REWORK after Reviewer/Verifier finding;
- EVIDENCE_REPAIR;
- REBUILD_FROZEN_INDEX;
- terminal repair with unchanged candidate;
- recovery of an unpublished candidate where the lifecycle transition has a deterministic postcondition.

If the required recovery capability is not implemented or the state is ambiguous, escalate instead of improvising Git commands.

### AUTH-3 — Owner-controlled authority

Requires explicit human authorization.

Includes:

- material scope or architecture expansion;
- governance override;
- exceptional recovery not represented by the lifecycle;
- controller activation/change where designated Owner-controlled;
- merge;
- deploy/release;
- destructive production data operations;
- production infrastructure mutation outside an already-approved bounded operational contract;
- credentials/secrets mutation;
- force push;
- protected/default branch mutation where not explicitly allowed by repository policy.

### AUTH-4 — External platform authority

Must be enforced outside the agent where possible.

Examples:

- protected branch rules;
- merge permissions;
- deployment environment approvals;
- production credentials;
- infrastructure/provider permissions.

Local hooks are not a substitute for these boundaries.

## Local hooks are cooperative guardrails

Runtime hooks and local Git hooks are valuable for preventing accidental policy violations on the normal engineering path.

They are **not** a security boundary against arbitrary shell execution by a process that already has filesystem/Git credentials.

Therefore:

- hook bypass must not expand authority;
- consequential transitions are independently checked by GitHub/CI/Owner boundaries;
- local enforcement should be deterministic and fail-closed for ambiguous normal-path requests;
- local policy should not pretend to provide OS-level isolation it does not actually have.

## Canonical control points

### CP-01 — Bootstrap / admission

Owner:

- Lifecycle Engine + shared policy.

Checks:

- repository root;
- subject branch;
- base commit;
- Work Block identity;
- approved specification;
- write-sets;
- Define Critic;
- runtime/session binding where needed.

Runtime adapter responsibility:

- provide normalized event/session context only.

The adapter must not implement a second admission policy.

### CP-02 — Before source write

Owner:

- shared runtime-neutral policy.

Checks:

- active WB;
- READY source write gate;
- exact subject branch;
- target inside effective source write-set;
- no external hard stop;
- no forbidden control-surface mutation.

For Git-related writes, validate effective selected paths where command syntax alone is insufficient.

### CP-03 — Before freeze

Owner:

- Lifecycle Engine.

Checks:

- candidate source identity can be computed deterministically;
- required contract/test prerequisites are satisfied;
- source/coordination state is internally consistent.

Runtime hooks may prevent obvious invalid calls, but freeze semantics belong to lifecycle.

### CP-04 — Before assurance dispatch

Owner:

- lifecycle/assurance dispatch layer.

Checks:

- exact role;
- exact candidate or contract identity;
- capability/session freshness for the new dispatch;
- required isolation metadata that the runtime can actually prove.

Completed evidence does not expire merely because dispatch capability freshness later changes.

### CP-05 — After rework

Owner:

- Lifecycle Engine.

Checks:

- previous frozen identity invalidated if source changed;
- candidate-bound assurance reset only where required;
- new contract Critic required when contract semantics changed;
- evidence/index-only repairs do not trigger unnecessary source invalidation.

### CP-06 — Before candidate commit

Owner:

- Git-native pre-commit + shared candidate validator.

Checks:

- staged source equals exact frozen candidate;
- required assurance READY/resolved;
- no forbidden/extra paths;
- commit metadata valid;
- exact WB/branch binding.

The hook does not decide lifecycle ordering; it validates the commit transition already authorized by lifecycle state.

### CP-07 — Before terminal commit

Owner:

- Git-native terminal validator.

Checks:

- parent is exact candidate commit;
- terminal projection was prepared before closeout;
- canonical inactive state is correct;
- terminal paths are exact and complete;
- no new source/evidence generation is being smuggled into the terminal commit.

### CP-08 — Before push

Owner:

- Git-native pre-push/shared push policy.

Allowed autonomous publication is narrowly bounded:

- exact subject branch;
- exact expected HEAD;
- non-force;
- non-default/non-protected target unless repository policy explicitly says otherwise;
- valid candidate + terminal history;
- required assurance complete.

Denied:

- ambiguous refspec;
- multiple unrelated refs;
- force/force-with-lease unless explicit Owner-controlled exception exists;
- default/protected branch publication;
- non-subject branch publication.

### CP-09 — External hard stops

Owner:

- external platform/capability controls first;
- shared policy second.

Examples:

- merge;
- deploy/release;
- protected/default mutation;
- force push;
- secrets/credentials;
- production/live data;
- destructive infrastructure;
- governance override.

Where the external platform can enforce the boundary, local policy is defense in depth only.

### CP-10 — Closeout

Owner:

- Lifecycle Engine.

Two distinct outcomes:

- `CLOSED_SUCCESS`;
- `STOPPED` / reporting-only.

Success requires the full prepared terminal transaction and resolved required assurance.

STOPPED preserves blocker/reason and must not synthesize successful assurance.

## Runtime adapter contract

Codex, Claude Code, or future runtimes may expose different hook/event formats.

Runtime adapters should only:

- normalize event type;
- normalize command/tool identity;
- normalize repository/session context;
- fail closed on malformed or ambiguous input;
- call the same shared evaluator.

They must not:

- contain runtime-specific governance semantics;
- silently widen authority;
- implement separate write-set logic;
- maintain separate lifecycle state machines.

Equivalent normalized events must produce equivalent decisions.

## Session / repository binding

Observed behavior showed that runtime policy can bind the repository root from initial session `event.cwd`, and command-local `cd` does not rebind authority.

This protects against accidental cross-worktree mutation but creates usability failures when work is handed to another worktree within the same session.

Target design:

- repository/worktree binding is explicit at session bootstrap;
- handoff to another worktree requires a new correctly bound session or a first-class runtime rebind capability if the platform can prove it safely;
- command-local `cd` never implicitly changes authority;
- error messages should distinguish "wrong bound root" from ordinary write-set denial.

## Push versus merge/deploy

A key authority distinction:

### Exact subject-branch push

Can be autonomous when:

- the Work Block explicitly allows publication;
- exact branch/ref and HEAD are known;
- push is non-force;
- assurance and history contracts are satisfied.

### Merge

Owner-controlled.

### Deploy / release

Owner-controlled and separate from merge.

This preserves engineering autonomy without allowing the agent to cross product/production authority boundaries.

## Findings derived from WB-036/WB-037

### AC-F01 — Runtime-specific enforcement risk

Multiple runtime entrypoints can drift if they embed policy rather than normalize into shared policy.

Required direction:

One runtime-neutral evaluator with thin adapters.

### AC-F02 — Session-root binding was safe but operationally opaque

Command-local `cd` could not rebind an already-bound session, causing failures when a worktree was created after session start.

Required direction:

Make worktree handoff an explicit bootstrap action, not an implicit shell behavior.

### AC-F03 — Owner authorization and runtime executability were disconnected

Explicit Owner authorization for bounded local recovery did not make the runtime transition executable because PreToolUse had no representation for that recovery capability.

Required direction:

Owner authorization should authorize a named lifecycle capability, not an arbitrary Git command string.

### AC-F04 — Publication authority and source write authority were previously coupled

A frozen candidate correctly blocks source mutation, but publication of the exact assured candidate should not require reopening source write authority.

Required direction:

Separate `source_mutable` from `candidate_publishable`.

### AC-F05 — Local hooks cannot be the final authority boundary

Arbitrary shell/process access can potentially bypass cooperative local hooks.

Required direction:

Keep irreversible/high-impact operations protected by remote/platform/Owner controls and independently validate published history.

## Design decisions accepted so far

1. Lifecycle Engine owns state transitions.
2. Git Transaction Layer owns deterministic worktree/index/history materialization.
3. Runtime hooks validate/authorize requests but do not invent lifecycle sequencing.
4. Git hooks validate Git-observable invariants at commit/push boundaries.
5. Runtime adapters are thin normalization layers.
6. Exact non-force subject-branch push may remain autonomous after assurance.
7. Merge and deploy remain separate Owner boundaries.
8. Local hooks are cooperative guardrails, not OS/security boundaries.
9. Exceptional recovery should become named lifecycle capabilities instead of ad-hoc Git command authorization.
10. Worktree/session binding must be explicit.

## Open questions

1. Which external GitHub protections are guaranteed available in every repository tier used by AzurSysTech?
2. Should exact subject-branch push be allowed immediately after local terminal validation or only after a local published-conformance dry run?
3. Which infrastructure operations can be classified as ordinary bounded engineering versus always Owner-controlled?
4. Does the future Git Transaction Layer need its own executable entrypoint, or should lifecycle commands call it internally?
5. What minimum normalized event schema is shared by Codex, Claude Code, and future runtimes?
