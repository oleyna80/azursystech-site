# SDLC Simplification v1 — Autonomous Orchestration Contract

Status: accepted design direction; implementation contract  
Depends on:
- `docs/architecture/sdlc-simplification-v1.md`
- `docs/architecture/sdlc-simplification-v1-enforcement-matrix.md`
- `docs/architecture/sdlc-simplification-v1-state-event-contract.md`

## 1. Principle

The target SDLC is autonomous by default.

Given an admitted event and a bounded authority envelope, the Orchestrator may drive the engineering lifecycle from intake through planning, implementation, independent assurance, publication, merge, deployment, verification, and feedback without human intervention when every required predicate is satisfied.

The safety model is not "ask the Owner at every stage."

The safety model is:

```text
Event
  -> admitted authority envelope
  -> Orchestrator autonomous progression
  -> deterministic controller / Git / CI gates
  -> independent Critic / Reviewer / Verifier
  -> platform authority boundaries
```

The Orchestrator owns progression.

The controller owns eligibility.

The authority envelope owns the maximum permitted consequence.

The Orchestrator must never create, widen, reinterpret, or self-approve its own authority envelope.

## 2. Event admission

An event may start an autonomous run only when it is admitted by a trusted dispatcher, Owner action, or equivalent external entrypoint.

Examples:

- Owner instruction;
- approved GitHub issue/label;
- scheduled maintenance event;
- dependency-update event;
- monitoring finding;
- support/operations event mapped to an approved automation class.

The event itself does not grant arbitrary repository or production authority.

Admission resolves:

- the exact repository/project;
- the starting branch/base policy;
- the applicable autonomy profile;
- any event-specific intent/scope constraints;
- the maximum external actions allowed for this run.

The Orchestrator receives that admitted context. It does not choose a more permissive profile.

## 3. Authority envelope

An autonomy profile is a protected policy definition, not an agent-authored planning artifact.

Conceptually it defines which terminal capabilities may be exercised when all lower-level gates pass, for example:

```text
subject_branch_publish
open_or_update_pr
merge
deploy_nonproduction
deploy_production
live_data_change
credential_change
```

A profile may also restrict:

- trigger classes;
- repositories/services;
- target environments;
- branch/ref destinations;
- path or component classes;
- required CI checks;
- required rollback capability;
- risk/change classes;
- time/change windows where applicable.

Absence of a capability means DENY / OWNER_DECISION_REQUIRED, never implicit permission.

The profile is loaded from a trusted/protected source and pinned for the run.

Normal subject-branch work cannot modify the effective profile.

Changing the profile is itself an Owner/platform governance action outside the active autonomous run.

## 4. Autonomous lifecycle

Inside the admitted envelope, the Orchestrator proceeds without asking for approval between normal stages:

```text
event
-> Idea
-> Intent
-> Spec
-> Plan
-> Work Block definition/decomposition
-> open
-> Critic
-> implementation / Coder
-> tests
-> commit
-> candidate
-> Reviewer
-> Verifier
-> durable closeout/learning
-> publish subject branch
-> PR/integration action if profile permits
-> merge if profile permits
-> deploy if profile permits
-> deployment verification
-> feedback
```

The Orchestrator may create and coordinate multiple Work Blocks when the approved plan requires them.

It may invoke Architect or additional analysis roles when useful without asking the Owner merely because another agent is needed.

## 5. Autonomous rework

Normal negative findings are part of autonomous execution, not human escalation.

Examples:

```text
Critic BLOCKED
-> revise planning
-> Critic again

Reviewer REWORK
-> EXECUTE
-> fix
-> commit
-> new candidate
-> Reviewer
-> Verifier

Verifier REWORK
-> EXECUTE
-> fix
-> new candidate
-> assurance again

Reviewer/Verifier SCOPE_CHANGE
-> DEFINE
-> revise
-> Critic
-> implementation
```

The Orchestrator continues these loops autonomously while the required correction remains inside the admitted intent, scope, architecture constraints, and authority envelope.

## 6. Independent assurance

Autonomy does not mean self-approval.

The Orchestrator may dispatch Critic, Reviewer, and Verifier automatically, but mandatory assurance roles remain logically independent from the implementation decision they check.

The controller records only their bound status/result identity, not runtime/session/model provenance.

The Orchestrator cannot mark a gate READY merely because an assurance agent is unavailable or inconvenient.

If required independent assurance cannot be obtained, the run is blocked rather than silently downgraded.

## 7. Anti-self-expansion rules

The Orchestrator must stop or return to the appropriate earlier stage when execution would require any of the following:

- changing the business objective rather than implementing it;
- materially expanding scope beyond admitted intent;
- weakening acceptance criteria to make the implementation pass;
- changing architecture constraints that require higher authority;
- widening implementation/coordination scopes without an explicit planning revision and Critic review;
- selecting a more permissive autonomy profile;
- modifying the protected authority-policy source governing its own run;
- bypassing a failed controller/Git/CI/platform gate;
- treating unavailable credentials or permissions as permission to find a workaround;
- accepting material residual risk when that authority is not pre-authorized.

"Do something else until it works" is not authority.

The safe response is explicit re-planning or `OWNER_DECISION_REQUIRED`.

## 8. Owner decision boundary

Human intervention is required only when the next valid action is outside the pre-authorized envelope or when the intent itself requires a human business/risk decision.

Typical reasons:

- ambiguous business requirement with materially different outcomes;
- scope expansion beyond the admitted event;
- unsupported architecture/governance change;
- material residual risk requiring acceptance;
- missing capability in the current autonomy profile;
- production action not pre-authorized for this change class;
- credential/security authority not pre-authorized;
- exceptional control-plane repair/cutover.

The Orchestrator should report the exact blocked decision and the minimum authority needed.

It should not ask the Owner to confirm ordinary internal progression.

## 9. Autonomous merge

Merge is autonomous when and only when the admitted profile permits merge and all configured merge predicates are satisfied.

Typical predicates include:

- assured source candidate;
- required deterministic CI green;
- exact PR/branch relationship;
- no unresolved required review/check;
- merge method permitted by policy;
- target is the configured protected/default branch;
- GitHub/platform permissions allow the operation.

Direct push to a protected/default branch remains prohibited unless a separate explicit policy permits that exact mechanism.

The Orchestrator cannot convert subject-branch publication authority into merge authority.

If merge is not present in the profile, the run stops at the merge boundary with `OWNER_DECISION_REQUIRED`.

## 10. Autonomous deployment

Deployment may also be autonomous when the admitted profile permits the exact deployment target and all deployment predicates are satisfied.

A production-capable profile should require deterministic conditions appropriate to the service, for example:

- exact merged/released SHA;
- required CI/build checks green;
- deployment target matches the admitted environment;
- platform credentials are scoped to that environment;
- rollback target/method exists where required;
- no unresolved assurance or deployment blocker;
- post-deploy verification is defined.

The platform/environment remains the final authority boundary.

The Orchestrator cannot use a staging capability to infer production authority.

Failed deployment does not authorize arbitrary repair. Recovery follows the admitted rollback/retry policy; otherwise it stops for the missing authority.

## 11. Full autonomous path

When a profile permits the complete delivery chain, the system may execute:

```text
event
-> plan
-> Critic
-> implement
-> candidate
-> Reviewer
-> Verifier
-> publish
-> PR
-> merge
-> deploy
-> verify deployment
-> feedback
```

with no human interaction.

This is a normal supported operating mode, not an exception.

Human approval remains available as one possible admission/authority mechanism, not as a mandatory stage in every run.

## 12. Profile examples

These are examples, not mandatory names.

### Engineering autonomy

May:

- plan;
- implement;
- assure;
- publish subject branch;
- create/update PR.

Stops before merge.

### Integrated delivery

Adds:

- merge when CI/assurance predicates pass;
- deploy to approved non-production environments.

### Autonomous production delivery

Adds:

- merge;
- production deployment for explicitly admitted change classes/environments;
- post-deploy verification;
- bounded rollback/retry.

This profile requires the strongest protected policy and platform controls, because no live Owner confirmation is expected during a normal successful run.

## 13. Relationship to controller state

The four-state Work Block lifecycle remains:

```text
INACTIVE -> DEFINE -> EXECUTE -> ASSURE -> INACTIVE
```

Merge/deployment do not require adding more Work Block lifecycle states.

The controller protects engineering candidate formation and publication.

The Orchestrator continues into integration/deployment using the same pinned authority envelope and external platform facts.

Durable traceability may record:

```text
source_candidate_sha
-> published_tip_sha
-> merged/released_sha
-> deployed_sha
```

without creating a second lifecycle state machine.

## 14. Authority-profile binding

The active autonomous run must have a pinned profile identity that the Orchestrator cannot change.

The implementation design should add a minimal immutable binding, conceptually:

```text
authority_profile_id
authority_profile_revision
```

The binding identifies the protected policy admitted for the run.

It is not a list of permissions copied into mutable Work Block state.

Runtime/Git/controller adapters consume the resolved policy but cannot widen it.

## 15. Event-driven execution contract

An event-driven runner may automatically:

1. receive an admitted event;
2. create/select the subject branch/worktree;
3. create planning artifacts;
4. open Work Block(s);
5. drive all normal controller transitions;
6. launch Critic/Coder/Reviewer/Verifier;
7. publish;
8. perform integration/deployment actions allowed by the profile;
9. verify final external state;
10. write durable feedback and finish.

A crash/restart resumes only from durable Git artifacts plus valid local controller state/external platform facts.

Lost transient assurance is rerun rather than fabricated.

## 16. Required safeguards

Full autonomy requires all of the following:

- immutable/pinned authority profile for the run;
- controller state and scope enforcement;
- Critic before source execution;
- exact candidate-bound Reviewer/Verifier;
- deterministic Git promotion checks;
- deterministic CI where required;
- protected platform permissions;
- least-privilege deployment credentials;
- explicit production target restrictions;
- deterministic post-deploy verification where the profile requires deployment;
- fail-closed behavior when authority or target identity is missing/ambiguous.

No single agent prompt is treated as a sufficient security boundary.

## 17. Acceptance scenarios

The implementation/E2E suite must eventually cover:

- event -> autonomous planning -> Critic -> implementation -> assurance -> subject publication;
- autonomous Reviewer/Verifier rework loop;
- blocked Critic causing autonomous re-plan;
- profile without merge permission stops exactly at merge;
- profile with merge permission merges when all predicates pass;
- non-production profile cannot deploy production;
- production profile can complete deploy when exact predicates pass;
- Orchestrator cannot change its own effective profile;
- attempted profile/policy modification inside subject work is denied;
- missing capability returns OWNER_DECISION_REQUIRED rather than workaround;
- failed deploy follows only admitted rollback/retry behavior;
- full admitted event -> deploy -> verification path completes without human interaction.

## 18. Design consequence

The target AzurSysTech SDLC is therefore:

> autonomous progression inside a pre-authorized envelope, with independent assurance and deterministic promotion gates.

The Owner governs the envelope and exceptional decisions.

The Orchestrator executes the work.
