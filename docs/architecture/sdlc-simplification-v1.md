# SDLC Simplification v1 — Proposal

Status: proposal for Critic review  
Scope: AzurSysTech Agentic SDLC  
Intent: simplify the current SDLC without losing useful engineering control.

## Core principle

Project memory lives in repository documentation and Git, not in chat sessions.

Every major stage must end with a durable artifact that the next executor can read without requiring prior conversation context.

Canonical flow:

**Idea → Intent → Spec → Plan → Tasklist → Implementation → Candidate → Review/Verification → Closeout → Merge/Deploy → Feedback**

The control plane should support this flow, not become a separate complex system that agents must constantly manage.

## 1. One canonical development pipeline

Adopt one default lifecycle:

1. Idea
2. Intent
3. Requirements + Design / Spec
4. Implementation Plan
5. Executable Tasklist
6. Implementation
7. Candidate commit
8. Review + Verification
9. Closeout
10. Merge / Release / Deploy
11. Post-deploy feedback

Do not add extra stages unless they solve a concrete recurring problem.

## 2. Documentation is the project memory

Durable project knowledge should be stored in Git.

Suggested responsibility by artifact family:

- `docs/intents/**` — problem, goal, business reason, constraints.
- `docs/specs/**` — normative requirements, design, interfaces, acceptance criteria, out-of-scope.
- `docs/plans/**` — implementation strategy and sequencing.
- `docs/tasklist/**` — executable decomposition for coding agents.
- `docs/reports/**` — factual review, verification, closeout and deployment evidence.
- `docs/architecture/**` — long-lived architecture and ADR-like decisions.
- `docs/engineering-memory/**` — durable systemic lessons and process feedback.

Chat history is not authoritative project memory.

A new agent session should be able to recover the work context from the repository.

## 3. Simplify the Work Block lifecycle

A Work Block should track only data that materially helps execution and assurance.

Minimum useful state:

- Work Block ID;
- specification path/revision;
- subject branch;
- base commit;
- approved write-set;
- current stage;
- candidate commit;
- Critic status for pre-code design;
- Reviewer status;
- Verifier status;
- closeout status.

Avoid lifecycle states that exist mainly to manage the control plane itself.

Target conceptual state machine:

**PLANNING → IMPLEMENTING → CANDIDATE → VERIFIED → CLOSED**

GitHub/CI then handles:

**PR → MERGED → DEPLOYED**

## 4. Simplify hooks and authority enforcement

Hooks should protect real authority boundaries, not attempt to understand every shell expression.

Keep strict enforcement for:

- writes outside the approved Work Block scope;
- force push;
- merge/release/deploy without authority;
- credentials and secrets;
- production/live infrastructure or data;
- destructive external operations;
- protected/default branch mutation.

Reduce control-plane friction for harmless local engineering operations.

Do not require hooks to become a complete shell interpreter.

Prefer clear authority checks and conservative restricted grammar where command interpretation is actually necessary.

## 5. Keep clear agent roles

The default logical roles are:

### Architect / Orchestrator

Owns the transition from idea to executable plan.

Produces or maintains:
- Intent;
- Spec;
- Plan;
- Tasklist;
- coordination state.

The Orchestrator must not be the sole judge of its own design.

### Critic — mandatory before code

The Critic is a required independent role before implementation begins.

Its purpose is to review the Orchestrator's Intent / Spec / Plan before source code is written.

The Critic should challenge:

- missing requirements;
- contradictions;
- architecture mistakes;
- scope drift;
- untestable acceptance criteria;
- unnecessary complexity;
- missed security/operational constraints;
- incorrect assumptions;
- implementation plans that do not satisfy the design.

The Critic is retained because early independent review prevents a large class of expensive implementation errors.

A material Critic objection returns the work to planning/design.

Implementation starts only after the pre-code package is considered ready.

### Coder

Implements from repository artifacts:

**Spec → Plan → Tasklist**

The Coder may decide local implementation details but must not silently change architecture, scope, public contracts or acceptance criteria.

Material design problems return to the Orchestrator/Critic loop.

### Reviewer

Reviews the exact candidate commit for:

- correctness;
- architecture conformity;
- regressions;
- scope adherence;
- maintainability.

### Verifier

Checks the exact candidate against acceptance criteria and deterministic evidence:

- tests;
- expected behavior;
- required integration checks;
- relevant CI/evaluation evidence.

Do not create extra permanent agent roles unless a recurring engineering need justifies them.

## 6. Bind final assurance to a candidate commit

After implementation, create a concrete candidate SHA.

Then perform:

**candidate SHA → Reviewer → Verifier → Closeout**

Reviewer and Verifier evidence belongs to that exact candidate.

If source behavior changes after assurance, the relevant assurance must be rerun.

Avoid over-invalidating assurance for unrelated index-only, report-only or ambient-file changes.

The candidate commit is the primary identity of the thing being reviewed.

## 7. Keep CI deterministic

CI should primarily execute deterministic checks such as:

- unit/integration tests;
- lint;
- type checking;
- build;
- security/static checks;
- inexpensive contract/traceability checks;
- essential control-plane invariants.

AI review should normally happen at the Work Block candidate / PR level rather than becoming a mandatory opaque step in every CI execution.

CI remains evidence, not project memory.

## 8. Keep post-deploy learning lightweight

After completion, retain only useful durable knowledge:

- closeout report;
- architecture decision when architecture changed;
- engineering/process feedback when a systemic problem was discovered;
- deployment evidence when operationally useful;
- a new Intent/Work Block for unfinished or follow-up work.

Do not create permanent governance findings for every local inconvenience or one-off hook false positive.

## Artifact handoff model

Each executor should primarily consume the artifact produced by the preceding stage.

| Stage | Primary artifact | Primary executor |
|---|---|---|
| Idea | raw input / request | Owner |
| Intent | `docs/intents/**` | Owner + Orchestrator |
| Requirements + Design | `docs/specs/**` | Orchestrator |
| Pre-code review | Critic report | Critic |
| Implementation planning | `docs/plans/**` | Orchestrator |
| Task decomposition | `docs/tasklist/**` | Orchestrator |
| Implementation | code + tests + commits | Coder |
| Candidate | exact Git SHA | Orchestrator |
| Code review | Reviewer report | Reviewer |
| Verification | Verifier report | Verifier |
| Closeout | Closeout report | Orchestrator |
| Merge / deploy | Git/CI/release evidence | Owner + automation |
| Learning | architecture / engineering-memory artifact | Orchestrator + Owner |

## Executor bootstrap rule

A fresh agent should be able to start with:

1. read repository agent instructions;
2. identify the current Work Block;
3. read Intent/Spec;
4. read Plan;
5. read Tasklist;
6. inspect current Git/candidate state;
7. continue from repository evidence.

It should not need previous chat history to reconstruct project intent.

## Proposed simplification targets in the current SDLC

Review whether the current implementation can be reduced in these areas:

- complex Maintenance Mode behavior;
- excessive shell-command classification;
- capability/topology evidence for ordinary Work Blocks;
- multiple inactive-state variants;
- transition-specific commit rules with little business meaning;
- duplicated Claude/Codex parsing logic;
- local read-only operations being blocked by hooks;
- mandatory reports that duplicate deterministic Git/test evidence;
- lifecycle transitions that do not represent a meaningful engineering state change.

This proposal does not require deleting all of these mechanisms blindly.

The implementation Work Block should remove or simplify them only where they are not necessary for the target model or a real authority boundary.

## Non-goals

This proposal is not:

- an instruction to weaken production/security boundaries;
- an instruction to remove Critic/Reviewer/Verifier;
- an implementation plan yet;
- authorization to rewrite the current control plane immediately;
- authorization to merge/deploy anything.

The first step is independent Critic review of this proposal.

## Desired outcome

AzurSysTech SDLC should remain agent-friendly and auditable while being simple enough that:

- project context is recovered from Git;
- agents know which artifact to read and which artifact to produce;
- the Orchestrator is independently challenged before coding;
- coding agents spend their time implementing rather than negotiating the control plane;
- final assurance is tied to a concrete candidate;
- Owner authority remains clear at consequential boundaries.
