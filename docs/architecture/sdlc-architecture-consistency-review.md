---
artifact_type: architecture_review
status: ready_for_owner_freeze_decision
scope: docs-only
not_work_block: true
reviewed_freeze_revision: v0.6
---

# SDLC Architecture Consistency Review

## Purpose

Check the proposed SDLC Architecture Freeze v0.1 against the transition, recovery, assurance/evidence, authority, schema/contract, E2E, and remediation documents.

This is a design consistency review. It does not authorize implementation.

## Review method

For each architectural decision, check:

1. lifecycle state consistency;
2. transaction reachability;
3. assurance/evidence binding consistency;
4. authority ownership;
5. schema/parser ownership;
6. E2E testability;
7. implementation dependency order.

## Findings

### CR-001 — Optional assurance timing conflicts with the transition model

Severity: MATERIAL.

Freeze v0.1 says optional evaluation/drift do not block candidate commit and only need explicit disposition before successful closeout.

The transition model currently places optional assurance dispositions inside:

`FROZEN → ASSURED → CANDIDATE_STAGED`

and states that optional assurance is resolved as an ASSURED postcondition.

These contracts disagree.

Resolution:

- `ASSURED` means required candidate assurance only;
- optional evaluation/drift may remain PENDING through candidate commit unless explicitly promoted to required candidate assurance;
- all optional assurance must be explicitly resolved before `CLOSED_SUCCESS`.

### CR-002 — STOPPED successor semantics are resolved in freeze but still open elsewhere

Severity: DOCUMENTATION_CONSISTENCY.

Freeze v0.1 allows successor WB after a valid STOPPED terminal boundary under explicit cleanliness/non-carry-over conditions.

The transition model still lists successor-after-STOPPED as an open question.

Resolution:

Synchronize the transition model and E2E recovery contract with the freeze decision.

### CR-003 — Frozen candidate identity is not algorithmically defined

Severity: MATERIAL.

Freeze v0.1 repeatedly requires one exact immutable source-candidate identity but does not define the canonical identity algorithm.

This leaves room for competing identities such as:

- content SHA;
- Git tree SHA;
- candidate commit SHA.

The candidate commit also contains evidence/contract artifacts, so its commit/tree identity cannot be silently treated as identical to the frozen source projection.

Resolution:

Define exactly one authoritative `source_candidate_id` over the frozen source projection.

Recommended architecture:

- deterministic digest over canonical ordered tuples of repository-relative source path + exact blob bytes;
- current compatible representation may remain `content-sha256:<digest>`;
- candidate commit SHA is provenance/package identity, not a competing source-candidate identity;
- terminal commit SHA is terminal-history identity only.

A future Git-tree-based source projection is allowed only through an explicit architecture amendment.

### CR-004 — Terminal repair is too broad for candidate-bound evidence

Severity: MATERIAL.

Freeze v0.1 allows terminal/evidence repair after `CANDIDATE_COMMITTED` while preserving the candidate commit.

But candidate-bound Critic/Reviewer/Verifier/test evidence is explicitly required to be inside the candidate commit.

Such committed evidence cannot be repaired later while also claiming the candidate package remains unchanged.

Resolution:

- `TERMINAL_REPAIR` may modify only terminal-only coordination/process evidence;
- candidate-bound evidence must be fully schema/binding-valid before candidate commit;
- if a candidate-bound evidence defect is discovered after an unpublished candidate commit, use a separate `RECOVER_CANDIDATE_PACKAGE` transition:
  - preserve source candidate identity and substantive assurance verdicts when still valid;
  - return to the pre-candidate package state;
  - repair candidate evidence;
  - create a replacement candidate commit;
  - do not replay source assurance unless substantive evidence/binding changed.

### CR-005 — TERMINAL_PREPARED index postcondition is underspecified

Severity: MATERIAL.

The architecture says terminal projection is prepared before closeout, but it does not state exactly what is staged before `CLOSED_SUCCESS`.

Without an exact index postcondition, the old WB-037 deadlock can reappear.

Resolution:

At `TERMINAL_PREPARED`:

- candidate commit already exists;
- all terminal projection files except the canonical inactive lifecycle-state delta are fully generated, validated, and staged;
- index contains only permitted terminal projection paths;
- worktree copies of those paths equal staged bytes;
- no source path is staged.

Then `CLOSED_SUCCESS` changes authoritative lifecycle state to canonical inactive, and the Git Transaction Layer stages only that inactive-state delta before terminal commit.

### CR-006 — PUBLISHED and CI-ready semantics are ambiguous

Severity: MATERIAL.

The happy path ends at `PUBLISHED`, while freeze v0.1 says CI/published conformance runs after push.

This can make `PUBLISHED` mean either "remote ref updated" or "remote history independently verified".

Resolution:

Keep lifecycle terminal history separate from external publication verification:

- `TERMINAL_COMMITTED` — local repository state;
- `PUBLISHED` — exact remote subject-branch ref updated by non-force push;
- `PUBLISHED_VERIFIED` — CI/published conformance READY for that exact remote SHA.

`READY_FOR_GITHUB_ARCHITECTURE_REVIEW` requires `PUBLISHED_VERIFIED`, not merely `PUBLISHED`.

### CR-007 — Remediation sequence does not match dependency order

Severity: MATERIAL.

Current remediation plan places:

1. Git transaction;
2. terminal transaction;
3. assurance/evidence;
4. schema unification;
5. hook simplification;
6. E2E harness.

But:

- assurance finalization depends on shared schemas;
- terminal/published conformance depends on shared parsing;
- waiting until the end for the E2E harness repeats the pattern that produced WB-037 surprises.

Resolution:

Use an incremental diagnostic-first sequence:

0. **E2E Baseline Harness** — fixture infrastructure + current expected blockers, no enforcement redesign.
1. **Contract Reader Foundation** — minimal schemas/parity for fields already used by enforcement.
2. **Git Transaction & Index Recovery**.
3. **Terminal Transaction & Closeout Ordering**.
4. **Assurance & Evidence Contract Cleanup**.
5. **Hook Responsibility Simplification**.
6. **E2E Green / Final Schema Migration / Conformance Hardening**.

The harness is extended after each implementation WB and turns expected blockers into passing scenarios.

### CR-008 — Supporting documents retain questions already resolved by freeze v0.1

Severity: DOCUMENTATION_CONSISTENCY.

Transition, assurance, authority, schema, and E2E documents still contain open questions whose answers are now present in freeze v0.1.

Resolution:

After v0.2 corrections, mark each resolved question as resolved or move it to a "Resolved by Architecture Freeze" section.

### CR-009 — Contract change materiality needs deterministic classification

Severity: MATERIAL.

Freeze v0.1 distinguishes enforcement-relevant versus non-semantic contract mutation, but does not state who decides the class.

If an agent can label its own contract change "non-semantic", the invalidation rule is weak.

Resolution:

- schema/architecture defines an explicit allowlist of non-semantic fields;
- changes to any other contract field default to enforcement-relevant;
- prose/body-only edits are non-semantic only where the artifact contract explicitly declares the body non-authoritative;
- runtime agent does not self-classify arbitrary changes.

### CR-010 — STOPPED unfinished-work preservation is not durable enough

Severity: MATERIAL.

Freeze v0.1 says unfinished work may remain on the stopped branch or as non-authoritative recovery material, but uncommitted worktree state is not a durable branch property.

Resolution:

A STOPPED terminal boundary must leave the canonical branch history clean.

Unfinished source may be preserved only through an explicit non-authoritative recovery mechanism, for example:

- separate recovery ref;
- generated patch/bundle artifact;
- dedicated local recovery worktree explicitly outside successor authority.

The successor must never inherit uncommitted/staged source implicitly.

The exact recovery storage mechanism may be implementation-defined, but the canonical STOPPED branch must not depend on dirty worktree state.

### CR-011 — Source candidate identity and candidate package identity must be explicitly separated

Severity: MATERIAL.

Candidate commit contains source plus candidate evidence. Therefore candidate commit SHA is not the same object as the frozen source projection.

Resolution:

Use terminology:

- `source_candidate_id` — authoritative frozen source identity;
- `candidate_commit_sha` — durable package/provenance commit containing source + candidate evidence;
- `terminal_commit_sha` — terminal-history boundary.

Reviewer/Verifier bind `source_candidate_id`.

Terminal projection binds both `source_candidate_id` and exact `candidate_commit_sha`.

### CR-012 — Architecture freeze needs a compatibility rule during staged migration

Severity: MATERIAL.

The target architecture introduces new states, schemas, capabilities, and generated manifests, but implementation will be split across several Work Blocks.

A partially migrated control plane can otherwise have new lifecycle semantics with old hooks/parsers or vice versa.

Resolution:

Each remediation WB must declare:

- old behavior still supported;
- new behavior introduced;
- feature/capability activation point;
- compatibility tests;
- rollback boundary.

New enforcement becomes authoritative only when its required producer + consumer + E2E path are present together.

Do not activate a new state/transition merely because one layer has implemented it.



### CR-013 — CANDIDATE_STAGED does not yet define the full candidate package

Severity: MATERIAL.

The freeze says the candidate commit contains both source and candidate-bound evidence, while `CANDIDATE_STAGED` currently specifies only the staged source projection.

This leaves an implicit second staging path for Critic/Reviewer/Verifier/test evidence and risks recreating the source-versus-coordination staging conflicts seen in WB-037.

Resolution:

Define `CANDIDATE_STAGED` as one full candidate package state:

- staged source subset exactly matches `source_candidate_id`;
- staged candidate-evidence subset exactly matches the finalized candidate evidence set;
- no terminal-only path is staged;
- no extra/forbidden path is staged.

Rename the normal transition to `MATERIALIZE_CANDIDATE_PACKAGE`.

The stale-index repair becomes `REBUILD_CANDIDATE_INDEX` and rebuilds the complete package from canonical source + candidate-evidence bindings without changing worktree source or assurance.

### CR-014 — source_candidate_id needs base/mode/deletion-aware canonical framing

Severity: MATERIAL.

A digest over only path + blob bytes is insufficiently specified:

- concatenation can be ambiguous without framing;
- executable/symlink mode changes are semantically relevant;
- deletions need representation;
- the same source diff applied to different base commits is not necessarily the same candidate.

Resolution:

Define `source_candidate_id` over a canonical manifest containing:

- exact `base_commit`;
- sorted effective changed source paths;
- for each path: repository-relative path, present/deleted state, Git mode when present, and exact blob digest/content identity;
- unambiguous deterministic serialization.

Rename detection is not authoritative; a rename may be represented as delete + add.

The external string representation remains `content-sha256:<digest>`.



### CR-015 — Candidate commit omits original Define Critic durability

Severity: MATERIAL.

Candidate-bound Critic disposition references the original Define Critic report, but freeze v0.3 candidate-package contents list only the disposition, Reviewer, Verifier, and test evidence.

If the Define Critic report is not already durable in history, the candidate package can reference non-durable evidence.

Resolution:

Candidate package must include the exact Define Critic evidence referenced by the candidate-bound disposition, plus the enforcement-relevant contract artifacts it reviewed.

### CR-016 — Generic EVIDENCE_REPAIR needs phase boundaries

Severity: MATERIAL.

The transition model still describes generic `EVIDENCE_REPAIR` without saying whether it may mutate candidate-bound evidence after `CANDIDATE_COMMITTED`.

That would conflict with candidate-package immutability.

Resolution:

- before candidate commit, evidence-only repair may repair candidate-bound evidence and re-finalize that evidence;
- after candidate commit, candidate-bound evidence repair uses `RECOVER_CANDIDATE_PACKAGE`;
- after candidate commit, ordinary `EVIDENCE_REPAIR` / `TERMINAL_REPAIR` is limited to terminal-only evidence.

### CR-017 — Push authority document is missing the local conformance dry-run prerequisite

Severity: DOCUMENTATION_CONSISTENCY.

Freeze v0.3 requires local published-conformance dry run before exact subject-branch push.

The authority/control document still lists autonomous push based on branch/HEAD/non-force/history/assurance without this prerequisite.

Resolution:

Add exact local conformance READY for terminal history to CP-08 and subject-branch publication requirements.

### CR-018 — Canonical delivery path should end in PUBLISHED_VERIFIED

Severity: DOCUMENTATION_CONSISTENCY.

Freeze/transition text distinguishes `PUBLISHED` from `PUBLISHED_VERIFIED`, but the headline happy path still ends at `PUBLISHED`.

Resolution:

Use:

```text
... → TERMINAL_COMMITTED → PUBLISHED → PUBLISHED_VERIFIED
```

Architecture-review readiness requires the latter.

### CR-019 — Optional assurance artifacts need an explicit durable location

Severity: MATERIAL.

Optional evaluation/drift may be performed after candidate commit, but freeze v0.3 terminal contents do not explicitly state where their reports/dispositions become durable.

Resolution:

Optional assurance not promoted to candidate assurance is terminal evidence:

- its report/disposition is included in terminal commit when executed/skipped after candidate commit;
- closeout manifest references the exact optional evidence/disposition;
- promoted optional assurance moves into the candidate package instead.

### CR-020 — Remediation phase descriptions lag the new split rollout

Severity: DOCUMENTATION_CONSISTENCY.

The implementation order now introduces an E2E baseline harness first and splits schema work into foundation + final migration, but Phase F/Phase H text still reads as if each is a single later Work Block.

Resolution:

Synchronize the phase descriptions with the diagnostic-first split.



### CR-021 — Candidate package must include a durable lifecycle-state snapshot

Severity: MATERIAL.

Terminal/published conformance needs to prove that the candidate commit was produced from an active frozen/assured WB with exact candidate bindings.

Freeze v0.4 lists source/contract/assurance evidence but does not explicitly include the candidate-phase authoritative lifecycle-state projection.

Without that snapshot, the terminal parent may not contain the authoritative candidate state needed for historical conformance.

Resolution:

Candidate package includes the authoritative candidate lifecycle-state snapshot showing at least:

- WB/branch/base/contract binding;
- frozen `source_candidate_id`;
- required candidate assurance READY/resolved;
- optional assurance may still be PENDING;
- source write gate blocked;
- candidate publication state appropriate for local commit.

The terminal commit later replaces this with canonical inactive state.

### CR-022 — STOPPED terminal commit parent/content rules are underspecified

Severity: MATERIAL.

Freeze v0.4 defines STOPPED as a durable terminal boundary but does not define its Git history shape when the WB stops before candidate commit.

Resolution:

A STOPPED terminal commit:

- may be created from any active lifecycle phase through the reporting-only stop transition;
- has the current branch HEAD as parent;
- contains only stop/coordination evidence plus canonical inactive/STOPPED projection;
- contains no uncommitted source candidate bytes;
- leaves index clean after commit;
- records whether a candidate commit existed before stop.

Unfinished source is preserved only outside canonical successor history through explicit non-authoritative recovery material.



### CR-023 — Define Critic binding needs a stable contract projection

Severity: MATERIAL.

The process distinguishes enforcement-relevant contract changes from progress/status edits, but the architecture does not yet define a stable identity for the contract that Define Critic approves.

Binding Critic to whole mutable plan/tasklist bytes recreates the WB-037 pattern where progress synchronization can force a new Critic even though requirements/authority did not change.

Resolution:

Introduce `contract_projection_id`.

It binds the enforcement-relevant Define contract:

- full normative specification content;
- source/coordination authority;
- acceptance criteria;
- normative plan/task definitions;
- branch/base and other admission semantics.

Schema-declared progress/status/evidence fields are excluded from the projection.

Until structured plan/task schemas exist, unknown plan/task changes default to contract-relevant.

Define Critic and candidate-bound Critic disposition bind `contract_projection_id`, while exact file digests remain provenance.

### CR-024 — Finalized evidence must be immutable; repair must supersede

Severity: MATERIAL.

The architecture allows EVIDENCE_REPAIR but does not clearly distinguish draft correction from modification of finalized evidence.

Completed assurance evidence is supposed to be durable and immutable.

Resolution:

- draft evidence may be corrected by its owner before finalization;
- finalized evidence is never edited in place;
- evidence repair after finalization creates a new version/artifact with explicit `supersedes` linkage;
- lifecycle binding moves to the new valid evidence only through a supported transition;
- historical evidence remains preserved;
- if the old evidence is already inside an unpublished candidate commit, use `RECOVER_CANDIDATE_PACKAGE` before creating the replacement candidate package.



## Final consistency pass — v0.6

Result: **READY_FOR_OWNER_FREEZE_DECISION**

All CR-001 through CR-024 findings have been incorporated into Architecture Freeze v0.6 and synchronized into the supporting transition, assurance/evidence, authority/control, schema/contract, E2E, and remediation documents.

Final cross-checks confirm:

- no remaining `Open questions` sections in the architecture support documents;
- no stale `MATERIALIZE_FROZEN_CANDIDATE` or `REBUILD_FROZEN_INDEX` terminology;
- optional assurance timing is consistent: candidate commit is allowed with non-promoted optional assurance PENDING; successful closeout is not;
- candidate package staging includes exact source + finalized candidate-bound evidence;
- candidate package contains a durable candidate lifecycle-state snapshot;
- terminal preparation is complete and staged before successful closeout except for the canonical inactive-state delta;
- terminal repair cannot mutate candidate-bound evidence;
- post-finalization evidence repair uses immutable superseding artifacts;
- STOPPED has a durable clean terminal-history contract and cannot leak unfinished source into a successor;
- `source_candidate_id`, `candidate_commit_sha`, and `terminal_commit_sha` have distinct non-competing meanings;
- Define assurance binds `contract_projection_id`, allowing schema-declared progress/status updates without accidental Critic invalidation;
- `PUBLISHED` and `PUBLISHED_VERIFIED` are distinct; architecture-review readiness requires the latter;
- autonomous subject-branch push requires exact local published-conformance dry-run READY;
- remediation order is diagnostic-first and includes staged migration compatibility;
- the E2E harness begins before remediation and is extended after each implementation Work Block.

No material internal contradiction is currently identified.

This review does **not** mark the architecture frozen. Freeze status remains an Owner decision.

## Preliminary review result

Historical note: freeze v0.5 required CR-023/CR-024. Those findings are resolved in v0.6.

No architectural reset is required.

The findings are bounded clarifications of:

- identity;
- optional-assurance timing;
- candidate versus terminal evidence repair;
- exact terminal staging;
- publication verification;
- STOPPED durability;
- migration ordering/compatibility.

Recommended next step:

Completed: freeze v0.6 incorporates CR-001 through CR-024 and passed the final consistency pass.
