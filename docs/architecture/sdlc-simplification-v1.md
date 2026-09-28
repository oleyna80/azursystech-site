# SDLC Simplification v1 — Proposal

Status: accepted architectural baseline; general model agreed, pending one holistic Critic review before implementation design  
Scope: AzurSysTech Agentic SDLC  
Intent: simplify the current SDLC without losing useful engineering control.

## Core principles

Project memory lives in repository documentation and Git, not in chat sessions.

Durable project artifacts contain decisions, requirements, architecture, plans, implementation, and reusable conclusions. Agent discussion and intermediate review reports are working material, not project memory.

The control plane should enforce only the workflow invariants that prevent meaningful errors or unauthorized actions. It should not become a second system that agents must constantly manage.

Owner authority remains explicit. The baseline operating profile is human-governed delivery: the Orchestrator may autonomously progress through planning, implementation, assurance, publication, PR preparation, and deterministic CI evidence, while the Owner remains the normal integration/deployment decision point. Higher-autonomy profiles may pre-authorize merge, release, deploy, and verification for specific event/change classes once the system has demonstrated sufficient maturity. The Orchestrator may never widen its own profile.

The default high-level flow is:

**Idea → Intent → Spec → Plan → Work Block definition/decomposition → Critic → Implementation → Source Candidate → Reviewer → Verifier → Closeout → Merge/Deploy → Feedback**

The Orchestrator may invoke the Critic earlier at any stage, but the mandatory implementation gate occurs only after the implementation-ready package, including material Work Block boundaries, is known.

A Tasklist may be used when it materially helps execution, but it is not mandatory as a separate artifact.

## 1. Initiative before Work Blocks

A Work Block is an implementation unit, not the container for an idea from its earliest stage.

Before implementation, one initiative is represented by one durable directory, for example:

```text
docs/changes/ai-phone-secretary/
  idea.md
  intent.md
  spec.md
  plan.md
  orchestrator-log.md
  work-blocks/
```

The directory is the durable entrypoint for the initiative.

### idea.md

Captures the original idea, problem, opportunity, or requested change.

It may begin as a rough statement. No implementation lifecycle is opened merely because an idea exists.

### intent.md

Captures what we decided to achieve and why:

- goal;
- business value;
- constraints;
- non-goals;
- relevant context;
- expected outcome.

### spec.md

Defines what the resulting system must do:

- requirements;
- behavior;
- interfaces/contracts;
- acceptance criteria;
- architecture constraints;
- non-goals where clarification is useful.

### plan.md

Defines how the approved design will be implemented:

- implementation strategy;
- sequencing;
- affected components;
- dependencies;
- testing approach;
- migration/operational considerations;
- known risks.

### Tasklist

A separate Tasklist is optional.

Use one only when decomposition materially helps execution, parallel ownership, recovery, traceability, or coordination. Otherwise the Plan may contain the executable steps directly.

## 2. Critic is an independent reusable role

The Critic exists to prevent the Orchestrator from becoming the sole judge of its own decisions.

The Orchestrator may invoke the Critic at any point where independent challenge is useful, including:

- Intent;
- Spec;
- Plan;
- Work Block decomposition;
- material implementation decisions;
- closeout questions.

For material design decisions, the Critic should challenge assumptions, analyze risks, identify contradictions, and test whether the proposed direction remains consistent with the previous durable artifacts.

The Critic may also be consulted by the Coder, Reviewer, or Verifier when they encounter ambiguity or cannot safely decide how to proceed.

A Coder may use Critic feedback to understand the problem or compare options, but may not independently redefine approved scope, architecture, acceptance criteria, or authority boundaries. Material design changes return to the Orchestrator.

## 3. Mandatory pre-code Critic gate

The Critic is flexible as an advisory role, but one checkpoint is mandatory and mechanically enforced:

> The Orchestrator may not send an implementation plan into source-code execution until an independent Critic has reviewed the implementation-ready package and blocking concerns are resolved.

The implementation-ready package is normally:

**Intent + Spec + Plan + Work Block definition/decomposition + Tasklist when separately useful**

The exact files may vary for small work, but the durable package must contain enough information to understand objective, scope, expected behavior, implementation strategy, and acceptance.

Source implementation writes remain blocked until the Critic gate is READY for the exact reviewed planning subject.

The Critic gate is bound to a concrete planning revision:

```text
critic_status
critic_subject_revision
```

A READY status without a matching current subject revision grants no implementation authority.

If a material change occurs after Critic approval, the gate returns to PENDING before coding continues.

Material changes include:

- architecture;
- scope;
- acceptance criteria;
- approved write-set;
- security/authority boundaries;
- substantial implementation strategy.

Purely mechanical edits do not require another Critic pass.

This is the primary mandatory Critic control. It should remain simple.

## 4. Work Block begins at implementation

After the Plan is prepared, the Orchestrator defines or decomposes it into one or more Work Blocks before the mandatory Critic review. The Critic then reviews the complete implementation-ready package, including the material Work Block definition/decomposition. Source execution for a Work Block may begin only after the Critic gate is READY for that reviewed planning subject.

Work Block decomposition is itself a material Orchestrator decision. The Critic should review the decomposition before implementation begins when one initiative is split into multiple Work Blocks or when the chosen boundaries materially affect dependencies, sequencing, assurance, or scope.

One initiative may produce several Work Blocks.

Example:

```text
docs/changes/ai-phone-secretary/
  ...
  work-blocks/
    wb-01-sip-ingress.md
    wb-02-ai-bridge.md
    wb-03-knowledge-base.md
```

A Work Block is:

> a bounded unit of implementation with its own execution scope, write-set, branch/base, source candidate, and assurance state.

The Work Block does not duplicate Intent, Spec, or Plan. It links back to them.

Minimum useful Work Block information:

- Work Block ID;
- objective;
- source initiative references;
- dependencies;
- subject branch;
- base commit;
- implementation_write_set;
- coordination_scope;
- current stage;
- source candidate SHA when created;
- Critic gate status;
- Reviewer status;
- Verifier status;
- closeout status.

The Work Block is therefore a small implementation manifest, not a second specification.

Authority is intentionally split into two scopes:

- `implementation_write_set` — source, tests, and other implementation paths whose changes affect the assured candidate;
- `coordination_scope` — a small set of Work Block/initiative coordination and durable documentation paths that the workflow is allowed to update outside source implementation.

These scopes define write authority only. They do not determine whether a change invalidates a previous Critic/Reviewer/Verifier decision.

The authoritative planning subject is the reviewed planning package, including as applicable:

- Intent;
- Spec;
- Plan;
- material Work Block definition/decomposition;
- acceptance criteria;
- architecture constraints.

If any authoritative planning-subject content changes after Critic READY, the Critic gate becomes PENDING for the new planning revision. If such a change affects the meaning, requirements, expected behavior, or assurance basis of an already-created source candidate, the corresponding Reviewer/Verifier evidence is stale and must be rerun as required.

By contrast, harmless coordination updates such as `orchestrator-log`, closeout records, engineering-memory notes, or deployment notes do not invalidate assurance when they do not change the authoritative planning subject or any `implementation_write_set` path.

The coordination scope must remain narrow. It does not recreate the old broad coordination write-set, FILE_REGISTRY/PROJECT_MAP synchronization, or publication machinery.

During implementation, the repository should expose one simple active-work pointer so a fresh session can immediately identify the current initiative and active Work Block. This should be a minimal state/pointer, not another registry or duplicated project map.

Target conceptual Work Block state:

**PLANNING → IMPLEMENTING → CANDIDATE → VERIFIED → CLOSED**

GitHub/CI then owns external integration state:

**PR → MERGED → DEPLOYED**

## 5. Default executor chain

The normal Work Block execution chain is:

**Orchestrator → Architect if needed → Critic → Coder → Reviewer → Verifier → Orchestrator closeout**

### Orchestrator

Owns:

- understanding the task;
- planning;
- Work Block decomposition;
- coordination;
- escalation;
- final durable knowledge capture.

The Orchestrator may use an Architect when architecture complexity justifies it.

The Orchestrator does not self-approve the implementation plan.

### Architect — optional

Used when architecture, interfaces, migration strategy, security design, or cross-system dependencies require specialist analysis.

Architect output becomes input to the Orchestrator and Critic. Architect is not a mandatory stage for every Work Block.

### Critic

Independent challenger and risk analyst.

Mandatory before source implementation starts.

May also be called voluntarily by any relevant executor when additional independent reasoning is useful.

### Coder

Implements the approved Work Block.

Consumes the durable initiative artifacts and Work Block manifest.

The Coder may decide local implementation details inside the approved scope.

If implementation exposes a material design problem, the Coder stops that decision path and escalates to the Orchestrator. The Critic may be consulted during this process.

### Reviewer

Reviews the exact source candidate for:

- correctness;
- architecture conformity;
- regression risk;
- scope adherence;
- maintainability.

### Verifier

Independently checks the exact source candidate against:

- acceptance criteria;
- deterministic tests;
- expected behavior;
- required integration/evaluation evidence.

### Orchestrator closeout

After Reviewer and Verifier are ready, the Orchestrator:

1. captures material conclusions in durable project documentation;
2. updates the Orchestrator log;
3. records residual risks/follow-up where useful;
4. confirms that no implementation-path changes occurred after assurance;
5. closes the Work Block;
6. removes temporary agent reports.

The process is not strictly linear. Normal rework loops are:

- Critic finds a material issue → Orchestrator updates Intent/Spec/Plan/Work Block decomposition → Critic rechecks the changed decision;
- Coder discovers a material design problem → Coder stops that decision path and escalates to Orchestrator, optionally consulting Critic;
- Reviewer or Verifier rejects the source candidate → Coder fixes the implementation → a new source candidate is created → affected assurance is rerun.

These loops should not require a separate complex lifecycle state machine.

## 6. Temporary Critic / Reviewer / Verifier reports

Critic, Reviewer, and Verifier reports are working evidence, not durable project documentation by default.

Every newly created report should include:

- role;
- Work Block or initiative context;
- creation date;
- creation time;
- timezone;
- subject revision/candidate where relevant;
- verdict/result.

Reports must remain available from creation until Work Block closeout so the process can survive ordinary pauses and session restarts.

They should live in a persistent local runtime location associated with the repository/worktree and be excluded from Git.

The exact storage path is an implementation detail.

Temporary reports are not committed.

The SDLC does not guarantee continuation of transient gate evidence after a fresh clone, lost worktree, machine loss, or deleted local runtime state. Durable project context must still be recoverable from Git. If transient Critic/Reviewer/Verifier evidence is lost, the relevant check is simply run again against the current durable subject or candidate.

No gate receipt is required in Git solely to preserve transient agent output.

At Work Block closeout:

- the Orchestrator first transfers material decisions, risks, and reusable conclusions into durable documentation and the Orchestrator log;
- only then are temporary reports removed.

There is no machine-level prohibition against deleting these reports. Their retention until closeout is a workflow rule, not a security boundary.

## 7. Durable project memory

Only information that remains useful after the working discussion should be committed.

Typical durable memory includes:

- `idea.md`;
- `intent.md`;
- `spec.md`;
- `plan.md`;
- optional Tasklist;
- Work Block manifests where they remain useful;
- source code;
- tests;
- architecture decisions;
- operational documentation;
- engineering memory;
- concise Orchestrator log entries;
- deployment/release documentation where it has durable value.

The Orchestrator log is a navigation and decision-memory artifact, not an event stream.

It records decisions and conclusions, not full agent conversations, command history, every subagent launch, or every intermediate thought.

Example purpose:

- what changed after Critic feedback;
- why an architecture choice was made;
- which risk was accepted;
- which follow-up was created;
- why a Work Block was split or redirected.

The project should preserve the result of reasoning, not every intermediate discussion.

For small deterministic changes, artifact structure may be collapsed when doing so does not lose objective, scope, acceptance, implementation strategy, or durable context. A small change does not automatically require separate `idea.md`, `intent.md`, `spec.md`, and `plan.md` files. The Critic requirement still applies whenever the Orchestrator prepares an implementation plan that is about to be sent into source execution.

## 8. Simplify lifecycle.py

The lifecycle mechanism should validate workflow state, not agent-runtime internals.

For ordinary Work Blocks, `lifecycle.py` should not require or manage:

- durable Critic/Reviewer/Verifier report files;
- report paths as promotion authority;
- execution IDs;
- context IDs;
- native subagent topology;
- capability probes;
- adapter/runtime provenance;
- report deletion;
- complex report ancestry.

Modern harnesses normally provide the Orchestrator with native subagent capability. The SDLC should use that capability directly rather than building a second proof system around it.

The lifecycle only needs enough state to enforce important transitions.

Before implementation, conceptually:

```text
critic_required = true
critic_status = READY
critic_subject_revision = <planning-subject-sha>
```

Before successful closeout, conceptually:

```text
source_candidate_sha = <sha>

reviewer_status = READY
reviewer_candidate_sha = <same-source-candidate-sha>

verifier_status = READY
verifier_candidate_sha = <same-source-candidate-sha>
```

READY is fail-closed: unresolved blocking findings mean the gate is not READY. A raw SUPPLEMENT disposition does not itself open the gate.

The exact schema remains an implementation detail.

If a runtime cannot provide required subagent functionality, that is a runtime limitation to surface explicitly, not a reason to make every Work Block carry universal topology/capability ceremony.

## 9. Bind final assurance to the source candidate

After implementation, create a concrete source candidate SHA.

Then:

**Source Candidate → Reviewer → Verifier → Closeout**

Reviewer and Verifier inspect that exact candidate.

If any implementation path in the `implementation_write_set` changes after assurance:

- the old assurance becomes stale;
- a new source candidate is created;
- Reviewer/Verifier are rerun as required.

Later documentation, coordination, or closeout-only commits inside the approved `coordination_scope` do not invalidate source assurance only when both conditions hold:

- no `implementation_write_set` path changed; and
- no authoritative planning-subject content changed in a way that alters the candidate's requirements, expected behavior, acceptance basis, or architecture constraints.

The source candidate SHA is the identity of the implementation that was actually assured.

Commit semantics should remain simple and recognizable:

1. implementation commits — build the Work Block;
2. source candidate commit — the exact implementation revision sent to Reviewer/Verifier;
3. post-assurance documentation/closeout commits — durable knowledge and coordination only, with no implementation-path changes.

This distinction should be enough to reason about assurance invalidation without terminal-child ancestry or publication-state machinery.

## 10. Keep hooks narrow

Hooks should enforce clear authority and workflow boundaries, not interpret arbitrary shell language.

Keep strict enforcement for:

- source implementation writes before the mandatory Critic gate is READY for the current planning subject revision;
- writes outside the approved `implementation_write_set` or narrow `coordination_scope`;
- protected/default branch mutation;
- force/history rewriting;
- merge/release/deploy without required Owner authority;
- credentials/secrets;
- destructive operations;
- production/live infrastructure mutation;
- live-data mutation.

Ordinary local read-only engineering operations should not require complex lifecycle negotiation.

Prefer native event data and direct capability boundaries over broad shell-string parsing.

The control plane should not attempt to become a general shell interpreter.

## 11. Deterministic CI

CI primarily validates deterministic evidence:

- unit/integration tests;
- lint;
- type checking;
- build;
- security/static checks;
- focused contract checks;
- essential control-plane invariants.

AI Critic/Reviewer/Verifier work belongs to the agentic workflow around planning and candidate assurance, not as an opaque mandatory AI call inside every CI run.

## 12. Merge, deploy, rollback, and Owner authority

Merge/release/deploy remain consequential authority-controlled actions. They may be executed autonomously when an Owner-defined protected autonomy profile pre-authorizes the exact action and all deterministic/platform predicates pass.

The SDLC does not need a second publication state machine to mirror GitHub or deployment infrastructure.

For deployments where operational traceability is useful, retain only minimal durable evidence:

- deployed source/release SHA;
- deployment result;
- rollback target or rollback method when the deployment is consequential.

A large deployment report is not required for every normal deploy.

## 13. Feedback and project learning

Feedback is event-driven.

Create durable architecture or engineering-memory updates when there is a reusable lesson, systemic problem, operational constraint, or important decision.

Do not create permanent governance artifacts for every temporary agent observation or one-off local inconvenience.

## 14. Fresh-session recovery

Before implementation exists, a fresh agent should be able to recover context by:

1. reading repository agent instructions;
2. locating the initiative under `docs/changes/<slug>/`;
3. reading `idea.md`, `intent.md`, `spec.md`, `plan.md`, and Tasklist if present;
4. reading the concise Orchestrator log.

During implementation, it should additionally:

5. identify the active Work Block through a per-worktree active pointer;
6. inspect its branch/base/implementation_write_set/coordination_scope/stage;
7. inspect current source candidate and assurance status where applicable;
8. continue from repository state without requiring prior chat history.

## 15. Proposed simplification targets in the current control plane

For ordinary Work Blocks, review and simplify or remove:

- mandatory `define_quality` ceremony;
- universal topology/capability bindings;
- execution/context ID requirements;
- prepare/finalize Reviewer/Verifier lifecycle ceremony;
- dual active/terminal publication state machines;
- canonical inactive-child ancestry;
- mandatory ordinary-WB synchronization through `FILE_REGISTRY.yml` / `PROJECT_MAP.md`;
- mandatory multi-dimension Process Feedback forms;
- broad shell-command parsing;
- report-path-based lifecycle blocking;
- gate receipts committed solely to preserve transient agent reports;
- machine enforcement of temporary-report retention/deletion;
- lifecycle transitions that do not represent a meaningful engineering state change.

This does not authorize blind deletion.

Implementation should preserve mechanisms that protect a concrete consequential boundary and simplify those whose operational cost exceeds their value.

## 16. Non-goals

This proposal is not:

- an instruction to weaken security or production boundaries;
- an instruction to remove independent Critic/Reviewer/Verifier reasoning;
- an implementation specification;
- authorization to rewrite the control plane immediately;
- authorization to merge/release/deploy without the required pinned autonomy profile and platform authority;
- a requirement that every initiative use the same number of files or Work Blocks;
- a requirement to create heavyweight planning artifacts for small deterministic changes.

## Desired outcome

AzurSysTech SDLC should be explainable as:

> **idea → durable project artifact → independent challenge where it matters → bounded implementation → candidate assurance → durable conclusions**

The resulting process should ensure that:

- project memory is recoverable from Git without chat history;
- one initiative has one understandable documentation directory;
- Work Blocks retain their original meaning as implementation units;
- the Orchestrator can call Critic whenever useful but cannot send an unreviewed plan to implementation;
- Coders can ask Critic for help without gaining authority to redefine the project;
- temporary agent reports support active work without polluting Git history;
- lifecycle state stays small and practical;
- Critic approval is bound to an exact planning subject revision;
- Reviewer/Verifier approval is bound to the exact source candidate;
- implementation and coordination authority remain separate without recreating the old coordination machinery;
- transient assurance may be rerun after local-state loss instead of being permanently archived in Git;
- normal rework loops are explicit without creating extra lifecycle bureaucracy;
- a fresh session can find the active initiative/Work Block through one simple pointer;
- implementation, source-candidate, and post-assurance commit semantics are easy to distinguish;
- deployments retain only the operational evidence that remains useful;
- consequential authority/security boundaries remain strict even when the Owner has pre-authorized autonomous execution;
- agents spend most of their time designing, implementing, reviewing, and verifying the product rather than servicing the control plane.


## Autonomous orchestration

The complete autonomy model is defined in `docs/architecture/sdlc-simplification-v1-autonomous-orchestration.md`.

The intended architecture is autonomy-capable with graduated operating modes. In the baseline human-governed profile, normal internal progression and rework are autonomous, but the Owner remains the normal release/integration checkpoint. Higher-autonomy profiles may continue through merge and deployment when explicitly permitted. Full event-to-deployment autonomy is a maturity target demonstrated through tests and repeated successful supervised cycles, not an assumption of the initial rollout.
