# SDLC Simplification v1 — Autonomous Orchestration Contract

Status: accepted design direction; implementation contract  
Depends on:
- `docs/architecture/sdlc-simplification-v1.md`
- `docs/architecture/sdlc-simplification-v1-enforcement-matrix.md`
- `docs/architecture/sdlc-simplification-v1-state-event-contract.md`

## 1. Principle

The target SDLC is autonomy-capable by design, but the baseline operating profile is human-governed delivery.

In the baseline configuration, the Owner remains an active participant: ideas may originate with the Owner, intent/spec/plan are discussed and refined with the Owner when useful, the Orchestrator autonomously drives implementation and assurance, and the system normally stops at a reviewed/published subject branch or PR-ready boundary for the Owner's final integration/deployment decision.

The same SDLC must also support a higher-autonomy profile in which an admitted event and bounded authority envelope allow the Orchestrator to drive the complete lifecycle through merge, deployment, verification, and feedback without human intervention when every required predicate is satisfied.

The safety model is neither "ask the Owner at every stage" nor "remove the Owner from the process."

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

## 4. Baseline human-governed lifecycle

In the baseline profile, normal engineering progression is autonomous between meaningful Owner checkpoints:

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
-> PR ready / CI green
-> Owner review/checklist checkpoint
-> Owner-authorized merge
-> Owner-authorized deploy
-> deployment verification
-> feedback
```

The Orchestrator may create and coordinate multiple Work Blocks when the approved plan requires them.

It may invoke Architect or additional analysis roles when useful without asking the Owner merely because another agent is needed.

The Owner checkpoint is not a substitute for Critic/Reviewer/Verifier. It is a business/operational release decision after the engineering system has already produced an assured candidate and deterministic CI evidence.

## 5. Autonomous internal rework

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

In the baseline profile, the Owner participates at the release/integration checkpoint even when the engineering path is otherwise fully autonomous. In higher-autonomy profiles, human intervention is required only when the next valid action is outside the pre-authorized envelope or when the intent itself requires a human business/risk decision.

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

## 11. Full autonomous delivery profile

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

This is a supported higher-autonomy operating mode, not the baseline default.

Human approval remains the normal release boundary in the baseline profile. Full autonomous delivery is enabled only for event/change classes whose profile has explicitly earned that authority.

## 12. Profile examples

These are examples, not mandatory names.

### Baseline human-governed delivery

May autonomously:

- plan;
- implement;
- assure;
- publish subject branch;
- create/update PR;
- gather deterministic CI/release-checklist evidence.

Then stops for the Owner's integration/deployment decision.

### Supervised integrated delivery

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

## 13. Autonomy maturity path

Full autonomy is a maturity target, not an assumption.

The intended progression is:

```text
Level 0 — human-governed baseline
Owner participates in intent/release decisions.
Agent autonomously performs the engineering cycle through assured PR-ready output.

Level 1 — supervised autonomy
Agent proposes merge/deploy after all gates are green.
Owner performs or explicitly authorizes the consequential action.

Level 2 — bounded autonomous delivery
Selected low-risk/event classes may merge and/or deploy automatically under a protected profile.

Level 3 — full admitted autonomous delivery
For explicitly admitted production change classes, the event can traverse the complete cycle through deployment and post-deploy verification without human interaction.
```

Promotion to a higher level is based on demonstrated reliability, not on changing prompts.

Evidence should include:

- deterministic E2E control-plane tests;
- repeated successful real/synthetic lifecycle runs;
- no unresolved gate-bypass or deadlock regressions;
- stable Critic/Reviewer/Verifier behavior;
- correct CI and GitHub integration;
- reliable deployment and rollback verification for the target environment;
- successful Owner review of earlier supervised runs.

The SDLC can be considered fully AI-native/production-mature for a given admitted change class when it can repeatedly complete the full event-to-deployment path within its authority envelope, produce the intended result, and respect every safety/assurance boundary without requiring human correction.

A single successful autonomous run is evidence, but not sufficient by itself to promote all change classes to full autonomy.

## 14. Relationship to controller state

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

## 15. Delivery authority after Work Block publication

The Work Block controller may still return to INACTIVE after successful subject-branch publication.

Therefore merge/deploy authority for higher-autonomy profiles must not depend solely on transient active Work Block state after publication.

For autonomous integration/deployment, a trusted external delivery authority context must persist the admitted run/profile binding across the publication boundary.

Preferred implementation direction:

- event/dispatcher creates a run identity and pins the profile;
- the Work Block state references that run/profile while active;
- GitHub PR/Actions or the trusted dispatcher carries the same immutable run/profile identity into merge/deploy;
- protected workflows/environments verify the profile and exact commit/PR facts before consequential actions;
- subject-branch code cannot edit or upgrade its own effective delivery authority.

This is not a second engineering lifecycle state machine. It is the external authority context for integration/deployment after the Work Block has completed its local engineering lifecycle.

In the baseline human-governed profile, this external context may simply resolve to `OWNER_APPROVAL_REQUIRED` for merge/deploy.

## 16. Authority-profile binding

The active autonomous run must have a pinned profile identity that the Orchestrator cannot change.

The implementation design should add a minimal immutable binding, conceptually:

```text
authority_profile_id
authority_profile_revision
```

The binding identifies the protected policy admitted for the run.

It is not a list of permissions copied into mutable Work Block state.

Runtime/Git/controller adapters consume the resolved policy but cannot widen it.

## 17. Event-driven execution contract

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

## 18. Required safeguards

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

## 19. Acceptance scenarios

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

## 19. Design consequence

The target AzurSysTech SDLC is therefore:

> autonomous progression inside a pre-authorized envelope, with independent assurance and deterministic promotion gates.

The Owner governs the envelope and exceptional decisions.

The Orchestrator executes the work.
