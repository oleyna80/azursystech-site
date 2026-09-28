# Critic Report — SDLC Simplification v1

**Date:** 2026-09-28  
**Role:** Independent pre-implementation Critic  
**Target branch:** `docs/sdlc-simplification-v1`  
**Proposal:** `docs/architecture/sdlc-simplification-v1.md` at `771476b1bd737cde5a2bb765d99c7b5cbc2a4531`  
**Critic brief:** `docs/architecture/sdlc-simplification-v1-critic-brief.md` at `d29b7924f60546cd48729160de2300e58e532a68`  
**Baseline:** `main` at `703dcd05c0aa561d10571b4e1c652302769c1b06`  
**Verdict:** `SUPPLEMENT`

## Executive assessment

The proposal is directionally correct and materially simpler than the current control plane.

Its strongest decisions should be preserved:

- project memory belongs in repository artifacts and Git, not chat history;
- one canonical development flow should replace lifecycle machinery that exists mainly to manage itself;
- an independent Critic of the Orchestrator is mandatory before source-code implementation;
- Coder, Reviewer, and Verifier remain distinct logical functions;
- final assurance is bound to a concrete source candidate;
- CI stays primarily deterministic;
- Owner authority remains separate for merge, release, deploy, production/live data, credentials, destructive actions, and protected/default branch mutation.

The current repository confirms that simplification is justified. The existing lifecycle has accumulated mandatory Define-quality evidence, native topology/capability bindings, prepare/finalize assurance transitions, terminal inactive-state publication rules, release-state reconciliation, process-feedback ceremony, and runtime command parsing. Several mechanisms protect valid concerns, but their implementation cost is now larger than the failure modes they prevent for ordinary Work Blocks.

No redesign from first principles is required. The proposal should be supplemented in four places before an implementation Work Block is opened.

## Must

### M1 — Make the Critic position and reviewed package unambiguous

The proposal currently describes three slightly different chains:

- the top-level canonical flow omits the Critic;
- the role section says the Critic reviews `Intent / Spec / Plan`;
- the artifact handoff table places “Pre-code review” before “Implementation planning”.

That ambiguity is material because the mandatory Critic exists specifically to challenge the Orchestrator before the Coder begins.

**Required clarification**

Use one canonical invariant:

```text
Idea
  -> Intent
  -> Spec
  -> Plan
  -> Tasklist when separately useful
  -> Critic
  -> Implementation
```

The Critic reviews the complete implementation-ready package that exists at that point. A separate Tasklist is optional; when present, the Critic should see it if it can change scope, write-set, sequencing, architecture, acceptance coverage, or verification.

A purely mechanical task decomposition created after Critic review does not require another Critic pass. A material change to Intent, Spec, Plan, acceptance criteria, architecture, authority boundary, or write-set returns to the Critic before coding resumes.

This adds no new control. It removes an ordering ambiguity from the proposed mandatory control.

### M2 — Keep one minimal pre-code source-write gate for the mandatory Critic

Section 4 correctly proposes reducing hooks to meaningful boundaries, but its strict-enforcement list does not explicitly include the pre-code Critic invariant.

That invariant should remain mechanically enforced with a minimal rule:

> source implementation writes are not admitted until the independent Critic result is resolved as ready.

A raw Critic disposition of `SUPPLEMENT` is not automatically equivalent to “ready” when unresolved Must findings remain. The Orchestrator may mark the Critic gate ready only after blocking findings are resolved in the authoritative artifacts.

**Concrete failure mode prevented:** the Orchestrator or Coder begins implementation before the required independent design challenge.

**Why Git/CI are insufficient:** Git and CI can inspect the resulting repository state, but they cannot reliably establish after the fact that the Critic occurred before implementation started.

**Operational cost:** one boolean/status check before source mutation. No topology graph, shell interpreter, execution-ID ceremony, or additional lifecycle stage is required.

### M3 — Define one repository entrypoint for recovering the active Work Block

The proposed bootstrap rule tells a fresh agent to read Intent, Spec, Plan, Tasklist, Git state, and candidate state. The proposed minimum Work Block state, however, identifies only the specification directly.

A fresh session therefore still needs naming conventions or repository archaeology to discover the exact approved artifact set.

Use the existing Work Block concept as a **manifest/index**, not as a second source of truth. It should link the current approved package:

- Intent;
- Spec and revision;
- Plan;
- Tasklist when separate;
- subject branch and base;
- approved write-set;
- current stage;
- source candidate SHA when created;
- Critic / Reviewer / Verifier report references;
- closeout report when created.

The manifest should point to normative artifacts rather than duplicate their content.

This is not a new governance layer. It is the minimum navigation needed to satisfy the stated requirement that a fresh agent recover work from the repository without chat history.

### M4 — Separate the assured source candidate from post-assurance closeout metadata

The proposal correctly says Reviewer and Verifier evidence belongs to an exact candidate and that unrelated report-only changes should not invalidate assurance. The operational rule is not yet explicit enough.

The simplified model should distinguish:

- **source candidate SHA** — the implementation revision reviewed and verified;
- **later report/coordination commits** — permitted only when they do not change the implementation write-set or behavior.

Any change inside the implementation write-set after assurance invalidates candidate-specific Reviewer/Verifier evidence and requires a new candidate. Report-only/coordination changes do not.

A minimal deterministic check can use the existing write-set and Git diff to prove that no implementation path changed after the source candidate.

**Concrete failure mode prevented:** an unreviewed source change is added after assurance while the branch is still described as verified.

**Why Git alone is insufficient:** Git contains the evidence, but without a simple comparison rule nothing requires the final branch state to preserve the assured source candidate.

**Operational cost:** one Git diff check against the known candidate and write-set. This should replace, not preserve, the current terminal-child ancestry and canonical-inactive publication machinery.

## Should

### S1 — Do not equate every conceptual stage with a separate file

The conceptual responsibilities are useful:

- Intent = what / why / constraints;
- Spec = normative behavior, design/contracts, acceptance criteria, non-goals;
- Plan = implementation strategy and sequencing;
- Tasklist = executable decomposition.

However, mandatory separate files for all four on every Work Block would recreate process overhead.

Recommended default:

- non-trivial product/architecture work: separate Intent + Spec;
- Plan and Tasklist may be one artifact unless separate decomposition materially helps execution, parallel ownership, or recovery;
- small Controlled/Quick-Fix work may capture intent and acceptance directly in the Work Block/Spec.

The invariant should be durable information, not a fixed file count.

### S2 — Fold ordinary Define-quality checks into the mandatory Critic

The current Managed/Assured flow requires a requirements-quality review, traceability evidence, and pre-execution consistency analysis before the Critic.

Those concerns substantially overlap the proposed Critic responsibility:

- missing requirements;
- contradictions;
- untestable acceptance criteria;
- scope drift;
- incorrect assumptions;
- plan/design mismatch.

For ordinary Work Blocks, remove the mandatory `define_quality` aggregate gate and let the Critic perform this challenge directly.

Stable `REQ-*` / `AC-*` / `TASK-*` traceability should remain available when the specification is large enough that structural coverage automation adds value, or when the domain is high-risk. It should not be mandatory merely because a Work Block is “Managed”.

### S3 — Reduce topology/capability evidence to the independence actually required

The current control plane binds execution IDs, context IDs, runtime tuples, recovery roots, capability probes, and prepare/finalize transitions for native Critic/Reviewer/Verifier execution.

The proposal should keep the **independence requirement** but remove universal topology ceremony.

For an ordinary non-trivial Work Block it is sufficient that the durable report records:

- logical role;
- exact subject revision;
- whether the function ran independently from the author/coder;
- report result.

Stronger session/worktree/OS isolation evidence is justified only by a concrete high-risk domain, sensitive boundary, distributed execution, or a requirement to prove independence beyond normal cooperative process controls.

The current governance itself acknowledges that project-local topology declarations are not a security boundary. Therefore, full topology binding should not remain a default promotion gate.

### S4 — Replace release-state and inactive-state machinery with Git/PR truth plus one active-work marker

The current repository contains substantial complexity around:

- canonical inactive state;
- active versus terminal candidate publication predicates;
- immediate-child ancestry requirements;
- release-state projections into `FILE_REGISTRY.yml` and `PROJECT_MAP.md`;
- parsers that reject mutable GitHub-state wording;
- closeout synchronization rules.

For ordinary product Work Blocks, Git already records commits and ancestry, GitHub owns PR/merge state, CI owns check results, and the Work Block/report artifacts own project intent and assurance.

Recommended target:

- one active/inactive Work Block marker;
- one subject branch;
- one source candidate SHA;
- one closeout report;
- GitHub remains authoritative for PR/merge state;
- no second terminal publication state machine.

Keep special release metadata only where a real release/migration process genuinely consumes it.

### S5 — Keep hook enforcement narrow and event-native

Keep hard enforcement for:

- source writes outside the approved write-set;
- source writes before the mandatory Critic is ready;
- force/history-rewriting operations;
- protected/default branch mutation;
- merge/release/deploy without Owner authority;
- secrets/credentials;
- destructive operations;
- production/live infrastructure and live-data mutation.

For ordinary local engineering commands, prefer allow-by-default read-only behavior.

Where possible, use the native event rather than shell-string interpretation:

- Git hooks/ref metadata for commit/push invariants;
- runtime tool guards for file writes and dangerous tools;
- external GitHub/credential/environment controls for consequential boundaries.

Do not retain a broad shell classifier merely to understand harmless command composition.

### S6 — Make Process Feedback event-driven

The current Work Block template requires eight explicit Process Feedback dimensions and `NONE — checked` semantics at every closeout.

That is documentation ceremony when no systemic friction occurred.

Recommended replacement:

- closeout records a process/engineering-memory item only when a concrete reusable lesson, recurring failure mode, or meaningful friction was observed;
- otherwise no process-feedback artifact is required.

Engineering memory should remain durable and useful, not become a mandatory checklist archive.

### S7 — Keep evaluation and drift as triggered specializations, not default lifecycle stages

Evaluation is valuable for non-deterministic outputs, agent behavior, or consequential automation. Drift analysis is valuable when architecture/spec/documentation synchronization is genuinely at risk.

Neither needs to become a permanent stage or permanent agent role in the simplified default flow.

Reviewer/Verifier plus deterministic CI are sufficient for normal work; evaluation, drift audit, threat modeling, and stronger isolation remain risk-triggered extensions.

## Might

- Preserve the current governance-profile names temporarily during migration even if their internals are simplified. Renaming profiles and simplifying the lifecycle at the same time increases migration surface without immediate value.
- For very small deterministic repairs, allow Reviewer + Verifier to be one independent combined-assurance pass. Do not weaken the mandatory pre-code Critic for non-trivial design work.

## KEEP / SIMPLIFY / REMOVE-REPLACE

### KEEP

- repository artifacts and Git as durable project memory;
- mandatory independent pre-code Critic;
- exact approved write-set;
- one writer per overlapping write-set;
- material design/scope changes return to planning + Critic;
- source-candidate-bound Reviewer and Verifier;
- deterministic tests/build/lint/type/security checks;
- Owner-controlled merge/release/deploy;
- protected/default branch, force-push, credential, destructive, production/live-data boundaries;
- architecture decisions and engineering memory when they carry durable value.

### SIMPLIFY

- Work Block -> manifest/index plus minimal execution state;
- Critic/Reviewer/Verifier bindings -> role + subject revision + report, ordinary case;
- hooks -> real authority/write boundaries only;
- requirements quality -> Critic responsibility by default;
- traceability -> risk/scale triggered;
- evaluation/drift -> triggered specialization;
- closeout -> factual result, residual risk, follow-up, useful knowledge only.

### REMOVE / REPLACE

For ordinary Work Blocks, remove or replace:

- mandatory `define_quality` aggregate evidence;
- universal native topology/capability promotion gates;
- `prepare-reviewer` / `finalize-reviewer` / `prepare-verifier` / `finalize-verifier` lifecycle ceremony where a candidate-bound report is sufficient;
- dual active/terminal candidate publication predicates;
- canonical inactive-child ancestry requirements;
- release-state reconciliation of ordinary Work Blocks through `FILE_REGISTRY.yml` and `PROJECT_MAP.md`;
- mandatory eight-dimension Process Feedback closeout;
- broad shell-command interpretation for harmless local/read-only commands;
- reports that only restate deterministic Git/CI evidence without adding a judgment, acceptance mapping, residual risk, or durable decision.

## Proposed target cycle

Smallest canonical non-trivial cycle after these supplements:

```text
Idea
  -> Intent
  -> Spec
  -> Plan (+ Tasklist when separately useful)
  -> independent Critic
  -> Implementation
  -> source candidate SHA
  -> Reviewer
  -> Verifier
  -> Closeout
  -> Owner merge decision
  -> Deploy/release through existing external authority
  -> Feedback only when a durable lesson exists
```

Operational state can remain:

```text
PLANNING -> IMPLEMENTING -> CANDIDATE -> VERIFIED -> CLOSED
```

where `VERIFIED` means all required candidate assurance is ready, not merely that tests ran.

For a small deterministic change, artifacts may be collapsed, but the repository must still contain enough durable information to explain objective, scope, acceptance, implementation state, and evidence.

## Acceptance-criteria quality for the future implementation Work Block

The proposal is intentionally not an implementation specification, so it should not grow a large acceptance matrix now. The implementation Work Block should nevertheless prove at least these outcomes:

1. A fresh agent can recover the current non-trivial Work Block and approved artifacts from repository state without chat history.
2. Source implementation cannot begin before the independent Critic gate is ready.
3. The Critic receives the implementation-ready Orchestrator package and unresolved Must findings block coding.
4. Reviewer/Verifier evidence is bound to the exact source candidate; a later implementation-path change invalidates that evidence.
5. Report-only closeout changes do not unnecessarily invalidate source assurance.
6. Ordinary read-only/local engineering operations are not blocked by lifecycle ceremony.
7. Default/protected branch mutation, force push, merge, release, deploy, credentials, destructive actions, production/live infrastructure, and live-data mutation remain externally or deterministically blocked without the required authority.
8. The default Work Block no longer requires ordinary Define-quality/topology/release-state ceremony unless a documented risk trigger requires stronger assurance.
9. Existing product CI and the remaining control-plane contract tests pass after the migration.

## Additional-control justification

This report adds no new lifecycle role or permanent stage.

It recommends retaining only two mechanically enforced controls beyond normal Git/CI evidence:

1. **pre-code Critic write gate** — because timing of independent critique cannot be reconstructed reliably from final Git/CI state;
2. **post-assurance source-diff check** — because Git contains candidate history but does not by itself prevent unreviewed source changes after assurance.

Both controls reuse existing Work Block/candidate/write-set data and replace more complex current machinery.

## Inspection notes

Reviewed current repository contracts and implementation surfaces including:

- `AGENTS.md`;
- `docs/session-bootstrap.md`;
- `governance/lifecycle.md`;
- `governance/authority.md`;
- `governance/enforcement.md`;
- `governance/artifacts.md`;
- `governance/define-quality.md`;
- `governance/release-state.md`;
- `.agent/workflows/sdd-protocol.md`;
- `.agent/active-work-block.default.json`;
- `docs/templates/work-block-template.md`;
- `.claude/hooks/work_block_gate.py`;
- `.claude/hooks/assurance_gate.py`;
- `.github/workflows/control-plane-contracts.yml`;
- `.github/workflows/release-state-contract.yml`.

No GitHub Actions workflow run or combined commit status is currently attached to the documentation-only branch head `d29b7924f60546cd48729160de2300e58e532a68`; that does not affect this design verdict.

## Final recommendation

`SUPPLEMENT`.

Keep the architecture and simplification direction. Resolve M1-M4 in the proposal or in the immediately derived implementation specification before opening source-code implementation.

Do not add another review layer to resolve these findings. The existing Orchestrator should update the durable design artifacts, then the mandatory independent Critic should confirm that the Must findings are closed before the Coder receives write authority.
