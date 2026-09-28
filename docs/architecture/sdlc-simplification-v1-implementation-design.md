# SDLC Simplification v1 — Implementation Design Direction

Status: accepted implementation direction; detailed design in progress  
Basis: approved high-level SDLC Simplification v1 baseline  
Technical foundation: existing inert `.agent/controllers/v1/`

## 1. Core implementation decision

The existing inert `controller v1` is the technical foundation for the new production SDLC control plane.

The current live legacy control plane is not the target architecture. It remains temporarily useful for:

- preserving current repository operation until cutover;
- identifying proven invariants that must survive simplification;
- enforcing the existing process while the replacement remains inert.

Implementation should not progressively repair the legacy `.codex/scripts/lifecycle.py` into the target system unless a bounded compatibility fix is required for the migration itself.

The target is:

> controller v1 minus runtime/evidence ceremony and persistent assurance archive, plus the accepted SDLC Simplification v1 identity and boundary semantics.

## 2. Invariants to preserve from existing control planes

The replacement must preserve:

- one active Work Block per worktree;
- exact subject branch identity;
- base commit identity;
- fail-closed malformed or ambiguous state;
- implementation write boundary;
- separate narrow coordination write authority;
- mandatory Critic gate before source execution;
- Critic approval bound to the exact authoritative planning subject revision;
- Reviewer and Verifier approval bound to the exact source candidate;
- invalidation after authoritative planning-subject or implementation changes;
- one writer per overlapping implementation scope;
- Reviewer/Verifier rework;
- reporting-only/cancelled safe closeout where useful;
- Owner Hard Stops;
- exact non-force subject-branch publication may be autonomous only after required assurance;
- merge/release/deploy remain Owner-controlled.

## 3. Runtime evidence is not authority

The replacement must remove authority dependence on runtime internals such as:

- execution IDs;
- context/session IDs;
- runtime/model identity;
- native subagent topology proof;
- capability probes and TTL;
- adapter/runtime provenance;
- report paths;
- pre/post repository snapshots used as role-provenance proof.

Critic, Reviewer, and Verifier may still produce temporary local reports for working evidence. Those reports are not committed and are not lifecycle authority.

If local transient evidence is lost, the relevant check is rerun.

## 4. Target authority record

The target active Work Block state should remain close to:

```text
work_block_id
initiative_ref

subject_branch
base_commit

planning_subject_revision

implementation_write_set
coordination_scope

stage

critic_status
critic_subject_revision

source_candidate_sha

reviewer_status
reviewer_candidate_sha

verifier_status
verifier_candidate_sha

closeout_status
```

Schema/version metadata may be added where technically required.

The exact persisted shape remains implementation-design work, but extra fields require a concrete invariant they protect.

## 5. Scope and invalidation semantics

`implementation_write_set` and `coordination_scope` define write authority.

They do not define assurance validity.

The authoritative planning subject includes, as applicable:

- Intent;
- Spec;
- Plan;
- material Work Block definition/decomposition;
- acceptance criteria;
- architecture constraints.

A material change to that subject invalidates the Critic gate.

A change to implementation paths after source-candidate assurance invalidates Reviewer/Verifier assurance.

Harmless coordination changes such as Orchestrator log, closeout records, engineering-memory notes, or deployment notes do not invalidate source assurance when they change neither the authoritative planning subject nor implementation paths.

## 6. Candidate identity

The target should prefer a committed Git commit SHA as `source_candidate_sha`.

Reviewer and Verifier inspect that exact commit.

Later coordination-only commits may occur after assurance without changing the identity of the assured source candidate.

The desired external trace is:

```text
source_candidate_sha -> merged/released_sha -> deployed_sha
```

No custom content hashing or second candidate-identity system should be retained unless implementation analysis proves Git commit identity insufficient.

## 7. Runtime state is active state, not historical archive

The controller state exists to coordinate active execution.

It should not retain an ever-growing archive of completed Critic/Reviewer/Verifier evidence or closed Work Blocks.

Durable historical knowledge belongs in Git documentation and concise Orchestrator records.

After closeout, active authority should return to a minimal inactive state.

## 8. Write enforcement

Structured write tools should be checked directly against:

- `implementation_write_set`;
- `coordination_scope`.

The controller should not become a general shell interpreter.

Shell handling should remain narrow:

- protect explicit Hard Stops;
- treat ambiguous consequential operations fail-closed;
- handle exact subject-branch push separately;
- use deterministic Git changed-path validation before candidate creation/assurance.

Candidate creation must fail when changed implementation paths fall outside the approved implementation boundary.

## 9. Quick-Fix

The old Quick-Fix authority bypass is removed.

Small deterministic work may use a documentation fast path with fewer or combined planning artifacts, but source execution still requires the mandatory Critic gate for the current planning subject.

## 10. Self-modification and cutover

The replacement controller remains inert while being developed and assured.

It must not become live and then rewrite its own authority/control surface during the same migration.

Cutover is a separate Owner-controlled action after:

- implementation is complete;
- focused deterministic tests pass;
- independent Reviewer is READY;
- independent Verifier is READY;
- legacy/new boundary behavior is explicitly checked.

Only then should live Codex/Claude hooks be redirected to the new controller and obsolete legacy control-plane entrypoints be retired.

## 11. Initial controller-v1 delta

### KEEP, with only small compatibility changes where needed

- `__init__.py` — package boundary, no-side-effect import.
- `errors.py` — fail-closed exception taxonomy.
- `canonical.py` — deterministic state serialization.
- atomic-persistence concepts from `storage.py`.
- one canonical policy-evaluation concept.
- one thin hook entrypoint concept.

### MODIFY

- `state.py` — replace current evidence-heavy active schema with the accepted minimal control record; add `implementation_write_set`, `coordination_scope`, planning-subject binding, exact candidate SHA binding, and simplified closeout.
- `storage.py` — retain validated atomic persistence and bounded recovery, but remove persistent closeout/evidence archive behavior and align state location with per-worktree active state.
- `policy.py` — implement the new two-scope boundary, narrow Hard Stops, exact subject-branch publication, and minimal stage/gate checks.
- `adapters.py` — keep runtime normalization but reduce shell parsing; structured tool events should carry most ordinary write enforcement.
- `hook.py` — remain a thin runtime wrapper over shared policy.
- `cli.py` — reduce lifecycle verbs and remove capability/dispatch/evidence ceremony.
- `tests/**` — rewrite around the accepted invariants and migration/cutover behavior.

### REMOVE OR REPLACE

- current `evidence.py` role-dispatch/capability/session/report-provenance machinery;
- capability TTL and capability-probe state;
- dispatch records;
- runtime/session/isolation authority proof;
- persistent completed role evidence in controller state;
- report-path authority.

If a small gate helper is useful after removal, it should represent only subject/candidate status binding, not runtime provenance.

## 12. Legacy cutover principle

Legacy components are retired only after equivalent required invariants are proven in the replacement.

Likely retirement targets include:

- `.codex/scripts/lifecycle.py`;
- duplicated Codex/Claude write-gate implementations;
- legacy assurance prepare/finalize paths;
- topology/capability proof machinery;
- report-path-based authority;
- release-state projections that only mirror lifecycle state;
- FILE_REGISTRY/PROJECT_MAP lifecycle synchronization;
- old Quick-Fix bypass.

Hard Stops and any narrow repository-level safety boundary must be mapped explicitly before deletion.

## Next design step

Produce a concrete target-state contract and transition model for the simplified controller before changing code.

That design should define:

1. exact state schema;
2. exact lifecycle transitions and invalidation rules;
3. exact write-policy decisions;
4. exact candidate creation and assurance binding;
5. exact per-worktree active-state location;
6. exact temporary-report location/lifecycle;
7. legacy-to-new cutover sequence;
8. deterministic acceptance tests.
