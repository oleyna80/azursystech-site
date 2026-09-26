---
artifact_type: architecture_decision
status: proposed
revision: v0.4
scope: docs-only
not_work_block: true
---

# SDLC Architecture Freeze v0.4

## Purpose

This document resolves the open design questions from the SDLC revision audit and defines the proposed target architecture to be implemented through separate bounded Work Blocks.

It does not authorize implementation.

The architecture becomes frozen only after Owner approval of this document. Until then, this branch remains an architecture/design SSOT.

## 1. Canonical lifecycle

The target happy path is:

```text
DEFINED
→ OPEN
→ FROZEN
→ ASSURED
→ CANDIDATE_STAGED
→ CANDIDATE_COMMITTED
→ TERMINAL_PREPARED
→ CLOSED_SUCCESS
→ TERMINAL_COMMITTED
→ PUBLISHED
→ PUBLISHED_VERIFIED
```

`IMPLEMENTING` is not a separate lifecycle state. It is represented by `OPEN + source_write_gate=READY`.

The lifecycle engine owns state transitions. Git operations implement already-authorized transitions but do not define lifecycle semantics.

## 2. State dimensions

The control plane explicitly distinguishes:

1. worktree state;
2. Git index state;
3. local/published history state;
4. lifecycle/assurance state.

A transition may mutate one dimension without invalidating the others.

In particular:

> Index mutation is not source mutation.

## 3. Candidate identity and freeze

Freeze creates one exact immutable source-candidate identity.

The authoritative identity is `source_candidate_id`.

For the current architecture it is a deterministic `content-sha256:<digest>` over a canonical source-candidate manifest.

The manifest binds:

- exact `base_commit`;
- sorted effective changed source paths relative to that base;
- for each changed path: repository-relative path, present/deleted state, Git mode when present, and exact blob content identity;
- deterministic, unambiguous serialization/framing.

Rename detection is not authoritative; rename semantics may be represented as delete + add.

`candidate_commit_sha` is durable package/provenance identity and is **not** a competing source-candidate identity. `terminal_commit_sha` is the terminal history boundary.

Reviewer and Verifier bind `source_candidate_id`. Terminal publication binds both the same `source_candidate_id` and the exact `candidate_commit_sha`.

After freeze:

- source bytes are immutable;
- source write authority is blocked;
- candidate assurance binds to the exact frozen identity;
- index-only materialization of those exact bytes remains allowed;
- exact publication authority may become available after assurance without reopening source writes.

`source_mutable` and `candidate_publishable` are independent properties.

## 4. Git transaction layer

Introduce a runtime-neutral Git Transaction Layer used by lifecycle transitions.

It owns deterministic worktree/index/history postconditions, including:

- `MATERIALIZE_CANDIDATE_PACKAGE`;
- `REBUILD_CANDIDATE_INDEX`;
- `RECOVER_FOR_REWORK`;
- `RECOVER_CANDIDATE_PACKAGE`;
- terminal projection materialization.

The public lifecycle command identifies the intended transition. The underlying Git command is an implementation detail.

Runtime adapters must not contain separate Git recovery semantics.

## 5. Canonical index states

### OPEN

Index state is not authoritative for candidate validity.

Source work proceeds in worktree under the write-set.

### FROZEN / ASSURED

The worktree source projection must match `source_candidate_id`.

The index may be empty or stale until candidate-package materialization.

No candidate commit is allowed until required candidate assurance and candidate-bound evidence are finalized.

### CANDIDATE_STAGED

`MATERIALIZE_CANDIDATE_PACKAGE` creates one exact staged package:

- staged source subset exactly matches `source_candidate_id`;
- staged candidate-evidence subset exactly matches the finalized candidate evidence set;
- no terminal-only path is staged;
- no extra/forbidden path is staged.

This is the only valid precondition for candidate commit.

### CANDIDATE_COMMITTED

Candidate source and required candidate evidence are durable in history.

### TERMINAL_PREPARED

The candidate commit already exists.

All terminal projection files except the canonical inactive lifecycle-state delta are generated, validated, and staged while the WB is still active.

The index contains only permitted terminal projection paths, no source path is staged, and staged terminal bytes equal their worktree copies.

### CLOSED_SUCCESS

Lifecycle state becomes canonical inactive only after the terminal projection is already prepared.

The Git Transaction Layer may then stage only the canonical inactive lifecycle-state delta required for the terminal commit.

No new source or ordinary evidence generation is allowed after this point.

## 6. Recovery

### Source rework

If source bytes must change:

```text
FROZEN/ASSURED
→ REWORK
→ OPEN
→ new source
→ new freeze
→ fresh candidate assurance
```

### Stale candidate index

If source bytes and candidate assurance remain identical but the index is stale:

```text
ASSURED + stale index
→ REBUILD_CANDIDATE_INDEX
→ CANDIDATE_STAGED
```

`REBUILD_CANDIDATE_INDEX` rebuilds the complete source + candidate-evidence package from canonical bindings.

It changes only index state and invalidates no source assurance.

### Unpublished candidate recovery

A named lifecycle capability `RECOVER_FOR_REWORK` replaces ad-hoc dependence on `git reset --soft`.

Preconditions include:

- exact local candidate identity;
- proof it is not published in known remote refs;
- exact approved predecessor;
- required Owner authority when the recovery is exceptional.

Canonical postcondition:

- HEAD at approved predecessor;
- candidate bytes preserved in worktree;
- index reset to predecessor tree / clean canonical index;
- lifecycle OPEN/READY;
- old candidate assurance invalid.

### Terminal repair

If candidate source is unchanged and only **terminal-only** coordination/process evidence is defective:

```text
CANDIDATE_COMMITTED
→ TERMINAL_REPAIR
→ TERMINAL_PREPARED
```

The candidate commit and source assurance remain valid.

`TERMINAL_REPAIR` may not rewrite candidate-bound Critic/Reviewer/Verifier/test evidence already contained in the candidate commit.

### Candidate package evidence repair

If a candidate-bound evidence defect is discovered after an unpublished candidate commit:

```text
CANDIDATE_COMMITTED
→ RECOVER_CANDIDATE_PACKAGE
→ candidate package preparation
→ replacement candidate commit
```

The transition preserves `source_candidate_id` and substantive assurance verdicts only when their exact bindings and meaning remain valid. It repairs/revalidates candidate evidence and creates a replacement `candidate_commit_sha`.

A substantive assurance or source change uses normal REWORK instead.

## 7. STOPPED / reporting-only semantics

A failed or intentionally abandoned WB may end in explicit `STOPPED`.

`STOPPED`:

- records blocker/reason;
- never claims successful assurance;
- receives its own durable terminal boundary;
- does not count as successful completion.

A successor WB may start after a valid STOPPED terminal boundary only when:

- the canonical stopped branch has no unresolved staged source/index state;
- unfinished source work is not silently carried into the successor;
- any unfinished source worth preserving is stored through an explicit **non-authoritative recovery mechanism** outside successor authority, such as a separate recovery ref, generated patch/bundle, or dedicated recovery worktree;
- the successor declares the STOPPED terminal commit as its trusted predecessor when using the same history line.

Dirty worktree state is never treated as durable STOPPED evidence.

This keeps the repository transactionally clean without pretending the stopped WB succeeded.

## 8. Mutation classes and invalidation

### SOURCE

Changes candidate bytes.

Invalidates:

- freeze;
- candidate-bound Critic disposition;
- Reviewer;
- Verifier;
- candidate-bound test evidence.

### CONTRACT — enforcement-relevant

Changes requirements, acceptance criteria, authority, write-set, branch/base binding, or other fields used to judge the candidate.

Requires:

- fresh Define Critic;
- fresh candidate assurance if the candidate was already frozen/assured.

### CONTRACT — non-semantic

Only fields explicitly classified by the artifact schema/architecture as non-enforcement metadata/editorial fields may use contract/evidence repair without full assurance replay.

An implementation agent may not self-classify an arbitrary change as non-semantic.

Markdown body edits are non-semantic only where the artifact contract explicitly states that the body is non-authoritative.

Unknown contract changes default to enforcement-relevant.

### EVIDENCE

Formatting/metadata repair with unchanged substantive verdict/binding.

Invalidates only the affected evidence artifact/validation.

### INDEX

Materializes already-approved bytes.

Invalidates no assurance.

## 9. Assurance model

### Define Critic

Contract assurance before implementation.

### Candidate-bound Critic disposition

Separate artifact binding the resolved Define Critic decision to one exact frozen candidate.

### Reviewer

Independent semantic review of the exact frozen candidate.

### Verifier

Independent reproduction/verification of the same exact frozen candidate.

### Optional evaluation/drift

`ASSURED` means required candidate assurance is complete for the exact frozen source candidate.

Optional assurance must be explicitly resolved before successful closeout.

Default policy:

- optional evaluation/drift may remain PENDING through `CANDIDATE_STAGED` and `CANDIDATE_COMMITTED`;
- optional evaluation/drift do **not** block candidate commit;
- they **do** block successful closeout while PENDING;
- a WB specification may explicitly promote one to required candidate assurance, in which case it becomes part of `ASSURED` and candidate-commit prerequisites.

### Assurance freshness

Dispatch capability freshness is checked before a new role dispatch.

Completed valid evidence does not expire merely due to time.

Any new freeze invalidates candidate-bound assurance even if the resulting source digest happens to equal an earlier freeze, unless a future explicit reuse policy is separately designed and approved.

## 10. Candidate evidence versus terminal evidence

### Candidate commit contains

- exact source candidate corresponding to `source_candidate_id`;
- current enforcement-relevant contract artifacts needed to judge that candidate;
- exact Define Critic evidence referenced by the candidate-bound disposition;
- candidate-bound Critic disposition;
- Reviewer report;
- Verifier report;
- required candidate-bound test evidence;
- any optional assurance explicitly promoted to required candidate assurance;
- other artifacts explicitly declared candidate assurance.

All candidate-bound evidence must be schema/binding-valid before candidate commit. After commit it is immutable within that candidate package; repairs use `RECOVER_CANDIDATE_PACKAGE` rather than `TERMINAL_REPAIR`.

### Terminal commit contains

- final plan/tasklist completion projection;
- release-state / project-map / registry terminal projection where applicable;
- standalone Process Feedback disposition/record;
- optional evaluation/drift reports or explicit SKIPPED dispositions that were not promoted to candidate assurance;
- generated closeout/terminal manifest;
- canonical inactive lifecycle state.

Process Feedback and non-promoted optional assurance are terminal evidence and do not block candidate commit by default.

The closeout manifest references the exact optional assurance evidence/dispositions used for successful closeout.

## 11. Process Feedback

Process Feedback becomes a standalone process/terminal evidence contract.

Reviewer/Verifier may contribute observations, but their source-assurance verdict does not depend on a hidden Process Feedback section in their narrative report.

If Reviewer-specific process input is needed, it is captured as:

- structured Process Feedback metadata; or
- a separately validated immutable appendix.

## 12. Closeout manifest

Closeout becomes a generated derived manifest owned by Lifecycle Engine.

It references canonical current bindings instead of manually duplicating stale narrative facts.

It contains at least:

- Work Block;
- contract revision;
- candidate commit;
- frozen identity;
- Critic disposition reference;
- Reviewer reference/verdict;
- Verifier reference/verdict;
- optional dispositions;
- required test evidence references;
- Process Feedback reference/disposition;
- closeout mode;
- STOPPED reason when applicable.

No ordinary evidence generation is allowed after `CLOSED_SUCCESS`.

## 13. Canonical contract reader

Implement one runtime-neutral Contract Reader shared by:

- lifecycle;
- shared runtime policy;
- Git hooks;
- standalone validators;
- published-object conformance;
- E2E harness.

Validation layers:

```text
syntax
→ strict schema/type
→ binding
→ transition semantics
```

Only the first three are Contract Reader responsibilities. Transition semantics remain with lifecycle/shared policy.

## 14. Artifact serialization

### Mutable authoritative lifecycle state

Use JSON.

Reason:

- strict machine types;
- deterministic serialization;
- no need for human narrative;
- easier atomic validation/write semantics.

### Durable human-readable governance/evidence artifacts

Use constrained YAML frontmatter + Markdown body.

Rules:

- frontmatter contains all machine-authoritative metadata;
- Markdown body is human narrative and is not parsed for control decisions;
- machine requirements must never depend on regex matches in prose;
- no machine-authoritative JSON sidecar is introduced by default.

### Generated terminal manifest

Use the same constrained frontmatter + Markdown format so it remains human-readable while machine metadata stays structured.

## 15. Schema evolution

Each machine-authoritative artifact has `schema_version` distinct from business/WB revision.

New writes use the current schema.

Historical published artifacts remain readable through explicit versioned/legacy readers.

Legacy support is read-only and isolated; new artifacts are never emitted in legacy formats.

Unsupported future schema versions fail closed.

## 16. Canonical implementation form for Contract Reader

Current implementation target:

- shared Python module;
- one YAML implementation/library rather than hand-written per-consumer parsers;
- strict validators returning typed Python objects;
- canonical JSON-compatible representation for parity tests.

Do not introduce a new schema framework dependency unless the implementation WB demonstrates it is materially simpler than the existing dependency set.

The architecture requires shared behavior, not a specific validation library.

## 17. Tasklist / traceability contract

Machine-readable task metadata must be structurally distinguishable from prose.

The validator must parse declared task records only.

Ordinary prose containing strings such as `TASK-` must not become machine authority.

Initial remediation should schema-define only fields used by enforcement/traceability rather than redesign all planning Markdown.

## 18. Hook responsibilities

### Runtime hooks

- normalize runtime events;
- invoke shared policy;
- fail closed on malformed/ambiguous events;
- do not implement a second lifecycle or parser.

### Git hooks

Own Git-observable invariants:

- staged tree;
- commit metadata;
- parent/history relationship;
- exact push ref;
- force/non-force status.

### Lifecycle Engine

Owns legal transition ordering and authoritative state.

### Git Transaction Layer

Owns deterministic Git materialization for an authorized transition.

### CI / published conformance

Independently checks the published result using the same Contract Reader/core predicates.

## 19. Runtime/worktree binding

Repository/worktree authority is bound explicitly at runtime session bootstrap.

Command-local `cd` never changes authority.

Handoff to a different worktree requires:

- a new correctly bound runtime session; or
- a future explicit rebind capability only if the runtime can prove the new binding safely.

## 20. Owner authority

Routine bounded engineering remains autonomous.

Owner-controlled boundaries remain:

- material scope/architecture expansion;
- exceptional recovery not represented by lifecycle;
- governance override;
- merge;
- deploy/release;
- force push;
- protected/default branch mutation outside explicit repository policy;
- secrets/credentials;
- destructive/live production operations.

Production/live infrastructure mutation remains Owner-controlled by default.

Non-production/test infrastructure may be autonomous only inside an explicit bounded WB contract.

## 21. Subject-branch publication

Exact subject-branch publication may be autonomous after:

1. terminal commit passes local Git-native validation;
2. local published-conformance dry run passes on the exact history;
3. exact non-force push target is the subject branch.

After push, CI/published conformance runs independently.

The canonical delivery path ends only after published verification.

Publication status is explicit:

- `PUBLISHED` — exact remote subject-branch ref now points to the expected terminal SHA;
- `PUBLISHED_VERIFIED` — CI/published conformance is READY for that exact remote SHA.

`READY_FOR_GITHUB_ARCHITECTURE_REVIEW` requires `PUBLISHED_VERIFIED`.

Merge and deploy remain separate Owner decisions.

## 22. External platform controls

The architecture does not assume every repository/account tier exposes identical GitHub protection features.

Where available, use remote branch protection, environment approvals, credential separation, and repository permissions as the real authority boundary.

Where unavailable, local controls remain defense in depth and Owner-controlled operations must not be delegated merely because a local hook allows them.

## 23. Runtime-neutral recovery exposure

Lifecycle exposes named typed operations, not arbitrary approved shell strings.

Example conceptual operations:

- `materialize_candidate_package`;
- `rebuild_candidate_index`;
- `recover_for_rework`;
- `recover_candidate_package`;
- `prepare_terminal`;
- `repair_terminal_evidence`.

Lifecycle calls the shared Git Transaction Layer internally.

A standalone low-level transaction CLI, if implemented for diagnostics/tests, is not normal agent authority.

## 24. Minimal normalized runtime event

Shared policy needs only the facts required to decide authority:

- runtime/adapter identity;
- session/context identity when available;
- bound repository/worktree root;
- requested operation/tool class;
- normalized command/arguments where applicable;
- explicit target paths/ref targets when available;
- current lifecycle/WB identity loaded from authoritative state.

Runtime-specific extra fields are provenance, not policy.

## 25. E2E harness

Mandatory deterministic harness uses:

- temporary Git repository/worktree;
- local bare repository as simulated remote;
- real Git hooks/push behavior where practical;
- deterministic fixture assurance roles/reports;
- shared Contract Reader;
- published-object conformance against remote fixture refs.

The core CI harness does not depend on live Codex/Claude agent sessions.

Runtime adapter parity is tested separately with fixture events for each adapter.

Real Reviewer/Verifier model quality and independence remain operational assurance concerns, not deterministic lifecycle-test concerns.

## 26. E2E required gates

For governance/control-plane changes, CI must eventually require at minimum:

- canonical happy path;
- stale candidate-index recovery;
- source rework after Reviewer finding;
- evidence-only repair;
- terminal repair;
- reporting-only STOPPED;
- parser/schema consumer parity;
- transition reachability;
- negative force/wrong-branch/stale-assurance/extra-path cases.

Historical schema compatibility belongs to a separate compatibility/conformance suite, not every happy-path E2E run.

## 27. Architecture implementation rule

Do not implement the revision as one large Work Block.

Each implementation WB:

- addresses one coherent architectural concern;
- has bounded source/write authority;
- includes positive and negative regressions;
- updates this audit branch with new systemic findings;
- does not opportunistically repair unrelated findings;
- stops for new architecture/authority decisions.

## 28. Proposed implementation sequence

Use a diagnostic-first sequence so integration failures are visible before enforcement changes accumulate:

0. **SDLC E2E Baseline Harness** — fixture infrastructure and current expected blockers; no governance redesign.
1. **Contract Reader Foundation** — minimal strict schemas/path grammar/parity for fields already used by enforcement.
2. **Git Transaction & Index Recovery**.
3. **Terminal Transaction & Closeout Ordering**.
4. **Assurance & Evidence Contract Cleanup**.
5. **Hook Responsibility Simplification**.
6. **E2E Green + Final Schema Migration + Conformance Hardening**.

The harness is extended after every implementation WB. Expected blockers are converted into passing scenarios as their owning remediation lands.

A WB may be split further if its write-set or acceptance surface becomes too broad.

## 29. Staged migration compatibility

Because the revision is implemented across multiple Work Blocks, partial migration must remain coherent.

Every remediation WB must declare:

- old behavior still supported;
- new behavior introduced;
- producer and consumer versions involved;
- activation point for the new state/capability/schema;
- compatibility tests;
- rollback boundary.

A new state, transition, schema, or enforcement rule becomes authoritative only when the required producer, consumer, validation path, and E2E scenario are present together.

Do not activate a new control merely because one layer has implemented it.

## 30. Freeze acceptance criteria

This architecture can be marked `frozen` when the Owner confirms:

- lifecycle states and recovery semantics;
- evidence split;
- mutation/invalidation rules;
- schema/serialization decisions;
- authority boundaries;
- E2E strategy;
- implementation sequence.

After freeze, changes to these architectural decisions require an explicit architecture amendment rather than incidental discovery inside an implementation WB.
