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

## 13. Legacy failure regression requirements

The branch `audit/sdlc-revision` is a required regression source for the replacement policy.

The new controller does not inherit that branch's full architecture. It must, however, prove that the concrete blocking and deadlock cases recorded there cannot recur.

### Transition reachability

Every normal state must have a legal next transition for every supported outcome.

The policy must not create a state where individually reasonable guards make the intended next step unreachable.

Regression coverage must include:

- unresolved optional/negative assurance without impossible closeout;
- Reviewer/Verifier rework;
- reporting-only/cancelled termination;
- candidate creation, assurance, closeout, and subject-branch publication.

### Candidate and Git transaction ordering

A source candidate is a committed Git revision before Reviewer/Verifier assurance begins.

This removes the old freeze/index deadlock class where source became immutable before the candidate could be durably staged/committed.

The controller must not require post-assurance source staging or index reconstruction merely to publish the already-assured candidate.

### Effective Git paths, not command arguments

Authorization and candidate checks use Git-observed changed/staged/committed paths.

Directory or shorthand command arguments are not trusted as the effective path selection.

A candidate must fail validation if the actual changed path set escapes the approved implementation/coordination boundaries.

### Coordination authority is explicit

Durable coordination writes must have a bounded `coordination_scope`.

The controller must not require ad-hoc Work Block amendments merely to write legitimate Orchestrator-log, closeout, or engineering-memory records.

Write authority remains separate from planning-subject invalidation.

### Base and Work Block identity are immutable while active

Opening an already active Work Block must fail.

`base_commit`, Work Block identity, initiative identity, subject branch, and admitted scopes may not be silently replaced by a later HEAD.

A material redefinition requires an explicit transition back to DEFINE and a new planning-subject revision; identity fields that define the Work Block itself remain stable.

### Session termination is not lifecycle closeout

Stop/session hooks may report unresolved work but must never require lifecycle mutation merely to let an agent session terminate.

They must not pressure an agent to fabricate `reporting-only`, READY assurance, or any other authority state.

Runtime re-entrant stop behavior must terminate safely without mutating lifecycle state.

### Worktree/session binding must allow deliberate handoff

The active pointer is per-worktree.

A stale runtime session binding must not make a deliberately selected valid worktree permanently unusable.

Repository/worktree handoff must be explicit and verifiable rather than inferred from command-local `cd`.

### Runtime adapters are thin and root-stable

Runtime-specific adapters must:

- resolve controller entrypoints from the repository/project root, not mutable shell cwd;
- normalize structured events only;
- call one shared policy evaluator;
- not duplicate lifecycle policy;
- not assume a runtime can modify its own adapter.

Equivalent normalized Claude/Codex events must receive equivalent policy decisions.

### Do not build a shell interpreter

The audit recorded repeated bypasses and false positives from hand-written shell tokenization, including:

- newlines;
- quoted/escaped separators;
- grouping and subshells;
- comments;
- command substitution;
- empty quoted words;
- command-position variable expansion;
- hard-stop examples appearing only as inert prompt/text arguments;
- Git option forms;
- revision arguments misclassified as paths;
- benign redirects such as `/dev/null`.

The replacement must not use a lightweight bespoke shell parser as a security boundary.

Preferred enforcement is:

1. structured tool/path events for ordinary writes;
2. deterministic Git postcondition/path checks for candidate formation;
3. narrow exact handling for known consequential operations such as subject-branch push;
4. external/Owner/platform enforcement for true Hard Stops;
5. fail closed only where a consequential operation is actually ambiguous, rather than treating arbitrary shell text as executable intent.

### Recovery and control-plane repair

Owner-authorized repair must not require fabricating normal lifecycle approval.

If an exceptional repair/cutover transaction is needed, represent it explicitly as an Owner-controlled exceptional path with exact scope and postconditions.

The new production controller should minimize the need for a standing Maintenance Mode; self-modification remains separated from normal execution by the Owner-controlled cutover model.

### Runtime state must not conflict with Git-native commitability

A canonical controller transition must produce a state that normal Git commit/push policy can represent.

No valid controller state may become uncommittable solely because another local validator uses a different definition of canonical state.

One shared state/schema reader should back controller, hook, and Git-native checks.

### E2E reachability tests are mandatory

Component unit tests are insufficient.

The replacement must include synthetic end-to-end transactions covering at least:

- normal planning/Critic/implementation/candidate/Reviewer/Verifier/closeout;
- Reviewer rework;
- Verifier evidence-only retry with unchanged candidate;
- material planning-subject revision;
- coordination-only post-assurance commit;
- exact autonomous non-force subject-branch push;
- Owner-controlled merge boundary;
- per-worktree handoff;
- agent stop/restart with pending assurance;
- malformed/ambiguous state fail-closed;
- out-of-scope actual Git path rejection.

The E2E harness must assert transition reachability, not only isolated deny rules.

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
