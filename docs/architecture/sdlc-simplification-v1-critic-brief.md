# Critic Brief — SDLC Simplification v1

Status: review requested  
Target branch: `docs/sdlc-simplification-v1`  
Primary artifact: `docs/architecture/sdlc-simplification-v1.md`

## Role

Act as an independent pre-implementation Critic.

Do not redesign the SDLC from scratch and do not implement changes.

Your task is to challenge the proposal before any control-plane code is changed.

## Review objective

Determine whether the proposed simplified SDLC is:

- internally coherent;
- materially simpler than the current process;
- sufficient to preserve useful project memory in Git;
- safe at real authority boundaries;
- practical for Claude Code / Codex style agentic development;
- free of unnecessary governance machinery;
- clear about artifact ownership and handoff between executors.

The proposal deliberately prioritizes simplicity over maximum control.

Do not recommend additional controls unless they address a concrete failure mode with meaningful cost or risk.

## Mandatory design constraint

The pre-code Critic role is non-negotiable.

The intended chain includes:

**Idea → Intent → Spec → Critic → Plan/Tasklist → Implementation**

or, where Plan is prepared before the Critic review:

**Idea → Intent → Spec + Plan → Critic → Tasklist/Implementation**

The important invariant is:

**an independent Critic must challenge the Orchestrator's design before source-code implementation begins.**

Do not propose removing this role merely to simplify the workflow.

## Questions to answer

1. Is the canonical artifact chain understandable and sufficient for a fresh agent to continue work without chat history?
2. Are Intent, Spec, Plan and Tasklist responsibilities distinct enough, or is there unnecessary duplication?
3. Is the mandatory pre-code Critic positioned correctly?
4. Are Coder, Reviewer and Verifier responsibilities separated clearly enough?
5. Can the Work Block state be reduced to the proposed minimum without losing important recovery or audit information?
6. Which current lifecycle states/transitions are truly necessary, and which are control-plane bureaucracy?
7. Can hooks realistically be reduced to real authority boundaries without creating obvious security gaps?
8. Is candidate-SHA-bound Reviewer/Verifier assurance sufficient for normal Work Blocks?
9. When, if ever, should stronger topology/capability evidence still be required?
10. Which existing reports could be removed because Git/CI already provides equivalent deterministic evidence?
11. Does the proposal preserve Owner control over merge/release/deploy and other consequential actions?
12. Does any proposed simplification accidentally weaken credentials, production, destructive-action, or protected-branch controls?
13. Is the proposed project-memory model complete enough?
14. Are there places where the proposal is still over-engineered?
15. Are there places where simplification went too far?

## Compare against current repository

Read the current governance/control-plane documentation and implementation as necessary.

Identify current mechanisms that fall into three groups:

### KEEP

Mechanisms that directly protect a meaningful authority boundary or preserve important project knowledge.

### SIMPLIFY

Mechanisms whose purpose is valid but implementation is more complex than necessary.

### REMOVE / REPLACE

Mechanisms whose operational cost exceeds their current value or whose evidence is duplicated elsewhere.

Do not produce a large inventory for its own sake. Focus on high-impact changes.

## Required output

Create a Critic report with:

### Verdict

One of:

- `APPROVE`
- `SUPPLEMENT`
- `RECONSIDER`

### Must

Only issues that would make the simplified SDLC unsafe, internally contradictory, or unable to recover project context.

### Should

Important improvements that materially simplify or clarify the model.

### Might

Optional improvements. Keep this section short.

### Proposed target cycle

Restate the smallest SDLC cycle you believe should become canonical after incorporating your findings.

For every proposed additional control, explain:

- concrete failure mode prevented;
- why Git/CI/existing artifacts are insufficient;
- operational cost added.

If that justification is weak, do not add the control.

## Scope restrictions

Do not:

- modify source code;
- modify hooks;
- modify lifecycle state;
- modify current WB-040/WB-041 worktrees;
- create a new implementation Work Block;
- expand the proposal into a full implementation specification;
- add complexity solely because it is theoretically safer.

This is a design Critic pass only.

## Success criterion

The final recommendation should produce a development process that is easy to explain as:

**idea → durable artifact → independent check where valuable → next executor**

while keeping strong controls only where consequential authority or durable project correctness actually requires them.
