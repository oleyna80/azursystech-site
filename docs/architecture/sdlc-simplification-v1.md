# SDLC Simplification v1 — Proposal

Status: accepted architectural baseline with high-level refinements in progress  
Scope: AzurSysTech Agentic SDLC  
Intent: simplify the current SDLC without losing useful engineering control.

## Core principles

Project memory lives in repository documentation and Git, not in chat sessions.

Durable project artifacts contain decisions, requirements, architecture, plans, implementation, and reusable conclusions. Agent discussion and intermediate review reports are working material, not project memory.

The control plane should enforce only the workflow invariants that prevent meaningful errors or unauthorized actions. It should not become a second system that agents must constantly manage.

The default high-level flow is:

**Idea → Intent → Spec → Plan → Critic → Work Block(s) → Implementation → Source Candidate → Reviewer → Verifier → Closeout → Merge/Deploy → Feedback**

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

**Intent + Spec + Plan + Tasklist when separately useful**

The exact files may vary for small work, but the durable package must contain enough information to understand objective, scope, expected behavior, implementation strategy, and acceptance.

Source implementation writes remain blocked until the Critic gate is READY.

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

After the implementation-ready package is accepted, the Orchestrator decomposes the Plan into one or more Work Blocks.

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
- approved write-set;
- current stage;
- source candidate SHA when created;
- Critic gate status;
- Reviewer status;
- Verifier status;
- closeout status.

The Work Block is therefore a small implementation manifest, not a second specification.

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

Reports must remain available from creation until Work Block closeout so the process can survive pauses and session restarts.

They should live in a persistent runtime location associated with the repository/worktree and be excluded from Git.

The exact storage path is an implementation detail.

Temporary reports are not committed.

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

The Orchestrator log records decisions and conclusions, not full agent conversations.

Example purpose:

- what changed after Critic feedback;
- why an architecture choice was made;
- which risk was accepted;
- which follow-up was created;
- why a Work Block was split or redirected.

The project should preserve the result of reasoning, not every intermediate discussion.

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
```

Before successful closeout, conceptually:

```text
source_candidate_sha = <sha>
reviewer_status = READY
verifier_status = READY
```

The exact schema remains an implementation detail.

If a runtime cannot provide required subagent functionality, that is a runtime limitation to surface explicitly, not a reason to make every Work Block carry universal topology/capability ceremony.

## 9. Bind final assurance to the source candidate

After implementation, create a concrete source candidate SHA.

Then:

**Source Candidate → Reviewer → Verifier → Closeout**

Reviewer and Verifier inspect that exact candidate.

If any implementation path in the approved write-set changes after assurance:

- the old assurance becomes stale;
- a new source candidate is created;
- Reviewer/Verifier are rerun as required.

Later documentation, coordination, or closeout-only commits do not invalidate source assurance when a deterministic Git diff proves that no implementation path changed.

The source candidate SHA is the identity of the implementation that was actually assured.

## 10. Keep hooks narrow

Hooks should enforce clear authority and workflow boundaries, not interpret arbitrary shell language.

Keep strict enforcement for:

- source implementation writes before the mandatory Critic gate is ready;
- writes outside the approved Work Block write-set;
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

## 12. Feedback and project learning

Feedback is event-driven.

Create durable architecture or engineering-memory updates when there is a reusable lesson, systemic problem, operational constraint, or important decision.

Do not create permanent governance artifacts for every temporary agent observation or one-off local inconvenience.

## 13. Fresh-session recovery

Before implementation exists, a fresh agent should be able to recover context by:

1. reading repository agent instructions;
2. locating the initiative under `docs/changes/<slug>/`;
3. reading `idea.md`, `intent.md`, `spec.md`, `plan.md`, and Tasklist if present;
4. reading the concise Orchestrator log.

During implementation, it should additionally:

5. identify the active Work Block;
6. inspect its branch/base/write-set/stage;
7. inspect current source candidate and assurance status where applicable;
8. continue from repository state without requiring prior chat history.

## 14. Proposed simplification targets in the current control plane

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
- machine enforcement of temporary-report retention/deletion;
- lifecycle transitions that do not represent a meaningful engineering state change.

This does not authorize blind deletion.

Implementation should preserve mechanisms that protect a concrete consequential boundary and simplify those whose operational cost exceeds their value.

## 15. Non-goals

This proposal is not:

- an instruction to weaken security or production boundaries;
- an instruction to remove independent Critic/Reviewer/Verifier reasoning;
- an implementation specification;
- authorization to rewrite the control plane immediately;
- authorization to merge/release/deploy without Owner control;
- a requirement that every initiative use the same number of files or Work Blocks.

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
- final assurance is bound to an exact source candidate;
- consequential Owner/security boundaries remain strict;
- agents spend most of their time designing, implementing, reviewing, and verifying the product rather than servicing the control plane.
