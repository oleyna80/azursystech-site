---
artifact_type: architecture_review
status: in_progress
scope: docs-only
not_work_block: true
reviewed_freeze_revision: v0.1
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

## Preliminary review result

Freeze v0.1 is directionally coherent but is **not ready to mark frozen**.

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

Produce freeze v0.2 incorporating CR-001 through CR-012, synchronize supporting documents, then perform a second consistency pass.
