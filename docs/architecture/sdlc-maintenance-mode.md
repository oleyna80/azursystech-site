---
artifact_type: implementation_strategy
status: owner_approved
revision: v0.1
scope: docs-only
not_work_block: true
architecture_freeze: v0.6
owner_approved_on: 2026-09-27
---

# SDLC Maintenance Mode

## Purpose

Define a temporary, Owner-controlled repair mode for the AzurSysTech SDLC control plane.

The mode exists because the current cooperative local guardrails have become self-hosting obstacles: they successfully expose control-plane defects, but some of the same guards also prevent agents from repairing those defects through the normal lifecycle.

Maintenance Mode changes **how the existing control plane is repaired**. It does not amend Architecture Freeze v0.6.

## Core decision

During an explicitly activated maintenance window:

- external/consequential authority boundaries remain enforced;
- local cooperative SDLC guards that only protect the normal engineering workflow may be downgraded from **ENFORCE** to **AUDIT/WARN**;
- control-plane repair proceeds in bounded remediation batches;
- after each coherent repair batch, deterministic E2E checks are run;
- guards are re-enabled incrementally;
- any guard that makes a valid lifecycle transition unreachable is repaired before it is re-enabled permanently.

The goal is not to remove governance. The goal is to stop using the broken implementation of governance as the mandatory mechanism for repairing itself.

## Why this is needed

Observed implementation behavior has shown three distinct classes of friction:

1. post-freeze candidate/index materialization is blocked because index mutation is treated as source mutation;
2. session-root binding prevents an already-running agent from writing to a newly created clean checkout even when that checkout was intentionally created for the next remediation step;
3. command-shape restrictions such as direct-single-Git invocation and complex mutating Bash denial add operational friction during control-plane repair.

These guards are useful on the normal engineering path, but they are cooperative local controls, not external security boundaries.

Architecture Freeze v0.6 already states that:

- local hooks are cooperative guardrails;
- Lifecycle Engine owns transition semantics;
- Git Transaction Layer owns deterministic materialization;
- exceptional governance override remains Owner-controlled;
- merge, deploy/release, force push, protected/default mutation, secrets, and live production operations remain Owner-controlled.

Maintenance Mode operationalizes those existing principles for the remediation period.

## Authority

Maintenance Mode activation and deactivation are Owner-controlled.

Activation does not authorize:

- merge;
- deploy or release;
- force push;
- protected/default branch mutation;
- tag/release publication;
- credential/secret mutation;
- live production data mutation;
- production infrastructure mutation;
- destructive filesystem or Git cleanup outside an explicit Owner-approved recovery action.

Maintenance Mode may only broaden local reversible engineering capability inside the declared remediation branch/worktree scope.

## Guard classification

### Always enforced

The following remain hard stops throughout maintenance:

- force or non-fast-forward push;
- push to default/protected branches unless separately Owner-authorized;
- merge;
- deploy/release;
- tag/release publication;
- secrets/credentials mutation;
- live production data mutation;
- production infrastructure mutation;
- destructive Git/filesystem operations such as hard reset/clean unless separately Owner-authorized;
- writes outside the declared repository/remediation scope;
- irreversible external side effects.

### Maintenance-mode audit/warn

The following cooperative controls may be downgraded to audit-only while repairing the control plane:

- inactive-WB coordination-only restriction;
- source `write_gate=READY` requirement for local remediation edits;
- post-freeze local staging denial when the requested operation is part of control-plane repair;
- exact normal-lifecycle ordering checks that are themselves under repair;
- direct-single-Git-invocation restriction;
- complex mutating Bash restriction;
- session-root/worktree binding that blocks deliberate handoff to a verified checkout of the same repository;
- local candidate/terminal sequencing checks whose implementation is the subject of the remediation.

Downgrading means:

- operation is logged;
- affected paths/state are recorded;
- no claim is made that the normal SDLC lifecycle approved the operation;
- the operation must remain reversible and inside the maintenance scope.

## Maintenance scope

Maintenance Mode must be bound to:

- repository identity;
- explicit remediation branch/worktree;
- exact trusted base;
- declared control-plane path scope;
- activation record;
- Owner approval;
- expected remediation objective.

It must not silently follow the agent into unrelated repositories or product/application work.

## Repair workflow

Canonical maintenance workflow:

```text
OWNER ACTIVATE MAINTENANCE MODE
        ↓
capture exact base + scope
        ↓
cooperative local guards → AUDIT/WARN
external hard stops remain ENFORCED
        ↓
repair batch
        ↓
focused tests
        ↓
synthetic E2E
        ↓
record findings
        ↓
next repair batch
        ↓
...
        ↓
incremental guard re-enable
        ↓
E2E after each guard group
        ↓
full normal-path E2E green
        ↓
OWNER DEACTIVATE MAINTENANCE MODE
```

## Remediation batches

The maintenance window should preserve the frozen remediation architecture while removing self-hosting deadlocks.

Recommended sequence:

1. Git Transaction / Index Recovery.
2. Contract Reader Foundation.
3. Terminal Transaction & Closeout Ordering.
4. Assurance & Evidence Contract Cleanup.
5. Hook Responsibility Simplification.
6. Incremental guard re-enable.
7. Full E2E Green + Schema/Conformance Hardening.

A batch may be split further if it becomes too broad.

## Work Block behavior during maintenance

Normal Work Block documents remain useful for scope, requirements, acceptance criteria, and durable evidence.

However, while Maintenance Mode is active:

- local lifecycle gates are not the security boundary;
- Critic/Reviewer/Verifier may still be used for quality assurance when capacity is available;
- temporary unavailability of an AI reviewer must not block reversible local control-plane repair;
- no artifact may falsely claim normal lifecycle approval when the work was performed under Maintenance Mode;
- each batch records that it ran under Owner-approved Maintenance Mode.

The normal strict lifecycle becomes mandatory again before Maintenance Mode is closed.

## Runtime/worktree handling

During Maintenance Mode, deliberate movement to a verified checkout of the same repository is permitted when:

- the target checkout has the expected repository identity;
- branch and exact base are verified;
- the target is inside the declared remediation scope;
- the operation is reversible;
- the handoff is recorded.

A new correctly bound runtime session remains preferred.

If the runtime cannot rebind safely, its session-root restriction should become an audit warning rather than a blocker for the maintenance branch only.

Command-local `cd` must still not silently grant authority to arbitrary repositories.

## Git behavior

Maintenance Mode does not authorize arbitrary Git history manipulation.

Allowed local repair operations should remain:

- explicit;
- branch-scoped;
- non-force;
- reversible;
- independently inspectable.

Exact subject-branch publication may occur only after the repaired control plane has passed the required local conformance checks for that batch.

Merge remains Owner-only.

## Evidence requirements

Each maintenance batch must record:

- exact base;
- exact changed paths;
- tests run;
- E2E scenarios affected;
- guards temporarily downgraded;
- new findings;
- residual blockers;
- whether the batch can be reproduced under normal enforcement.

The audit branch remains the durable architecture/remediation SSOT.

## Re-enable strategy

Guards are re-enabled by responsibility group, not all at once.

Recommended order:

1. repository/branch/path scope checks;
2. source mutation and freeze checks;
3. candidate/index transaction checks;
4. commit/history checks;
5. push/publication checks;
6. runtime adapter convenience restrictions.

After each group:

- run focused tests;
- run the relevant synthetic E2E scenarios;
- confirm no valid transition becomes unreachable.

If a re-enabled guard breaks reachability, the guard/predicate is repaired before continuing.

## Exit criteria

Maintenance Mode may be closed only when:

- canonical happy path reaches `PUBLISHED_VERIFIED` without exceptional local bypass;
- B-006/B-007 candidate/index scenarios pass;
- candidate → terminal transaction is reachable;
- parser/schema consumers use the intended shared contract semantics for the migrated scope;
- required assurance/evidence transitions are reachable;
- all intended cooperative guards are re-enabled;
- full E2E remains green with those guards enabled;
- merge/deploy remain Owner boundaries;
- no unresolved maintenance-only shortcut is required for ordinary Work Blocks.

## Rollback

If a maintenance batch destabilizes the control plane:

- stop the batch;
- preserve its working copy/evidence;
- return to the last known good maintenance base through an explicit reversible Git operation;
- do not force-push or rewrite published history;
- record the failed approach in the audit SSOT;
- revise the batch plan before retrying.

## Relationship to WB-039

The previous narrow WB-039 publication-bootstrap plan is superseded before lifecycle OPEN.

WB-039 is repurposed as:

**SDLC Maintenance Mode / Repair Bootstrap**

Its job is to introduce the maintenance-mode capability and prove that local cooperative guards can be downgraded without weakening external/Owner hard stops.

After WB-039 establishes that repair window, subsequent remediation batches execute under Maintenance Mode until normal enforcement is restored.


## Session termination and lifecycle integrity

Runtime session termination is not a lifecycle transition.

A Stop/session-exit hook may:

- warn that an active Work Block is unresolved;
- report the current lifecycle state;
- point to the required closeout/recovery procedure.

It must not require an agent to change authoritative lifecycle state merely so the runtime can stop.

In particular:

- `closeout_mode=reporting-only` is not a generic session-exit escape hatch;
- STOPPED/reporting-only semantics require their normal lifecycle evidence/postconditions;
- Maintenance Mode should downgrade Stop-hook lifecycle-completion enforcement to AUDIT/WARN for remediation sessions;
- ending or restarting an agent session must remain possible without falsifying Work Block state.

Maintenance tests must include a case where an active unresolved WB exists and the runtime can terminate/restart without mutating authoritative lifecycle state.


## Runtime adapter bootstrap boundary

A runtime is not required to be capable of modifying its own adapter.

If an adapter surface is read-only inside that runtime:

- do not remount, escalate privilege, or bypass the filesystem boundary;
- keep shared policy in a runtime-neutral writable location where practical;
- update the thin adapter from a separate writable context, another runtime, Owner/operator action, or an out-of-band Git/GitHub transaction;
- restart/rebind the affected runtime after the adapter update;
- verify equivalent normalized events produce equivalent maintenance decisions across adapters.

Maintenance Mode is not complete until every supported runtime that participates in remediation either consumes the shared evaluator or is explicitly declared unsupported for maintenance sessions.
