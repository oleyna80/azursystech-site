# WB-01 — Trusted Autonomous Execution: Implementation Plan R4

Status: **PLANNING / INDEPENDENT CRITIC PENDING** (no source implementation authorization)  
Date: 2026-10-14  
Repository: `oleyna80/azursystech-site`  
Verified planning baseline: `02c62acb5618002bde1b73b41dfb0a3a5e36d761`  
Review scope: delta-only closure of **CRITIC-R3-001** (Controller-compatible binding) and **CRITIC-R3-002** (commit-object crash window). R3 decisions D1–D4 and R2 dispositions are preserved.

## 1. Objective and governing sources

Restore the existing Controller v1 autonomous engineering path using the smallest safe changes. Do **not** create a second controller, admission registry, lifecycle, orchestrator, general Git command proxy or unrestricted permissions. Read `AGENTS.md`, `docs/engineering-memory/sdlc-existing-architecture-map.md`, `governance/authority.md`, the SDLC Simplification v1 state/event and autonomous-orchestration contracts, the prior P0 Architecture Critic Revision 2, and the R1–R3 Critic findings.

Preserve: `INACTIVE → DEFINE → EXECUTE → ASSURE → INACTIVE`, atomic trusted admission, immutable WorkBlockBinding, exact committed candidate, independent Critic/Reviewer/Verifier, durable bounded REWORK, verified non-force publication of the exact subject branch and Owner-exclusive merge/deployment decisions.

**Authority separation:** an architecture READY permits approved bounded source development only; it neither installs protected components nor authorizes host account/ACL/sandbox/secret changes, production activation, merge or deployment.

## 2. Frozen Controller-compatible WorkBlockBinding (CRITIC-R3-001)

The proposed **26 distinct repository paths** consist of 25 implementation paths and one planning path. This does not mean 26 `implementation_write_set` entries.

### Identity and fields

- `work_block_id`: `WB-2026-10-14-sdlc-wb01-trusted-autonomy`
- `initiative_ref`: `docs/changes/sdlc-wb01-trusted-autonomous-execution`
- `planning_paths`: **exactly** `docs/changes/sdlc-wb01-trusted-autonomous-execution/plan.md`
- `coordination_scope`: **exactly** `docs/changes/sdlc-wb01-trusted-autonomous-execution/plan.md`; no directory-wide wildcard or unrelated report paths
- `implementation_write_set`: **exactly** the 25 sorted paths in §2.1; no directory wildcard
- `default_branch`: `main`
- `deployment_target`: `null`
- `deployment_is_production`: `false`
- `max_rework_cycles`: `8` (explicit fixed limit, aligned with current runner default)
- `repository`: `oleyna80/azursystech-site`
- `trigger_class`: `manual-owner`
- `authority_profile_id`: `human-governed`; revision must come from the trusted policy resolver
- `base_ref`: `main`; `base_commit` resolved/pinned from the approved trusted baseline at actual prepare, never selected by the Agent
- `subject_branch`: proposed `feat/sdlc-wb01-trusted-autonomy-20261014`, pinned by trusted admission when created
- `admission_id`: created/pinned by the trusted prepare, **not** supplied as fictitious active state

The fields not stored in the WorkBlockBinding itself are pinned in its matching immutable admission record, not copied into a second authority state. No profile elevation.

Validation invariants under `.agent/controllers/v1/state.py`:

- Every planning path is inside the derived initiative planning surface.
- Every planning path is covered by `coordination_scope`.
- No planning path is covered by `implementation_write_set`.
- `implementation_write_set` and `coordination_scope` do not overlap.
- All 25 implementation paths and the one coordination path are exact, sorted, unique, repo-relative POSIX paths.

### 2.1 Implementation write-set (25 exact paths)

- `.agent/controllers/v1/cli.py`
- `.agent/controllers/v1/git_adapter.py`
- `.agent/controllers/v1/gitfacts.py`
- `.agent/controllers/v1/hook.py`
- `.agent/controllers/v1/installation.py`
- `.agent/controllers/v1/policy.py`
- `.agent/controllers/v1/tests/test_bootstrap_helper.py`
- `.agent/controllers/v1/tests/test_cli.py`
- `.agent/controllers/v1/tests/test_e2e_transactions.py`
- `.agent/controllers/v1/tests/test_git_adapter.py`
- `.agent/controllers/v1/tests/test_policy.py`
- `.agent/controllers/v1/tests/test_runtime_bridge.py`
- `.agent/orchestration/runner.py`
- `.agent/orchestration/tests/test_runner.py`
- `.agent/orchestration/tests/test_trusted_assurance.py`
- `.agent/orchestration/tests/test_trusted_commit.py`
- `.agent/orchestration/tests/test_trusted_ops.py`
- `.agent/orchestration/trusted_assurance.py`
- `.agent/orchestration/trusted_commit.py`
- `.agent/orchestration/trusted_ops.py`
- `.claude/settings.json`
- `.codex/hooks.json`
- `scripts/sdlc-v1-bootstrap.py`
- `scripts/sdlc-v1-bridge.py`
- `scripts/sdlc-v1-ops.py`

Existing files: 18; proposed new files: 7 (three `trusted_*.py` modules, three corresponding `test_trusted_*.py` tests and `scripts/sdlc-v1-ops.py`). The count of unique implementation paths is 25. The only planning/coordination path makes the full set **26**.

**No tracked Critic/Reviewer/Verifier report files are requested in this Work Block.** Independent evidence and authenticated receipts are stored in protected external evidence storage under the approved trust boundary. If further coordination paths are genuinely required, revise the plan and obtain another Critic before expanding scope. No modifications to `.agent/policies/**`, `web/`, `admin/`, `showcase/`, ISO source/branch, deployment workflows or protected installed runtime during source development.

## 3. Accepted D1 — Narrow trusted Git commit operation

Use an Agent-linked worktree with the shared Git common directory **protected from direct Agent writes**. A narrow protected Controller operation accepts only a manifest of approved create/replace/delete paths with content bytes/mode, expected parent SHA, message, admission identity and idempotency operation ID; no arbitrary shell/Git command API.

Authorization is the intersection of authenticated OS peer identity, installed capability ceiling, active admission, immutable binding, correct worktree/subject, lifecycle phase, exact path scopes and expected parent. A Unix-domain socket may transport requests; peer authentication alone does not grant authority. Trusted code lives in the protected installed release, not the mutable checkout.

**Snapshot → validate → commit:**

1. Under the trusted operation lock, validate request identity, scope, ref, current phase and expected parent; reject unsupported types, links, unsafe paths and out-of-scope rename/deletion.
2. Persist durable operation intent and complete immutable service-owned manifest/content snapshot **before** Git object or ref mutation. Record canonical request digest. Agent writers cannot modify that snapshot.
3. Write blobs without Git filters from the frozen bytes; initialize a private protected index from the expected parent tree; apply only validated manifest entries; produce the candidate tree.
4. Run protected equivalents of the mandatory current pre-commit and commit-message Controller policy, including trailer, exact path checks, per-commit history rules and no unintended content outside scope. Do **not** run Agent-controlled hooks, filters, Git config, credential helpers or executable build scripts under Control UID.
5. Create an ordinary one-parent Git commit object using sanitized fixed Git plumbing; record its SHA durably **before** changing a ref.
6. Atomically compare-and-swap **only** `refs/heads/<admitted subject_branch>` from the exact expected parent to the new SHA via Git `update-ref` old-OID precondition. Read back and verify parent/tree/ref.
7. Durably record completion, then reconcile the worktree/index without resetting or deleting Agent files. Ref success with dirty worktree remains preserved, not falsely reported as clean.

The source snapshot, not mutable Agent index/files, is the commit input. The worktree/index is only reconciled after the trusted ref result is known. Unsupported Git objects/features fail closed.

### 3.1 Crash recovery correction (CRITIC-R3-002)

**Selected option: tolerate a discarded unreachable commit object** if a crash occurs after `commit-tree` creates an object but before the SHA is durably journaled. We do **not** assume an unknown object can be recovered or replayed with the same SHA.

Journaled state is conceptual `PREPARED → OBJECT_CREATED → REF_UPDATED → COMPLETE`, with recorded SHA only when durably known. Critical rules:

- Before creating **any** Git object, durably persist operation ID, immutable request digest, expected parent, authorized identity and immutable snapshot. Same operation ID with different digest is DENY.
- **Crash before durable SHA**: upon restart verify the authorized subject ref still equals the expected parent, snapshot/intents are unchanged, and there is no contradictory operation. It is safe to create a **new** one-parent commit object (possibly with different identity timestamps and SHA) from the same snapshot/tree/parent/message. Any earlier unrecorded object remains unreachable and is not treated as an executed commit.
- Record the new SHA with durable journal synchronization **before CAS**. Crash after SHA persistence but before CAS reuses the recorded SHA, conditional on the ref still matching expected parent.
- Crash after CAS but before `REF_UPDATED` or `COMPLETE` journal: the recorded SHA is available; verify actual ref equals that SHA, check parent/tree and complete idempotently, without creating a second commit.
- A ref pointing anywhere other than the recorded SHA or expected parent, a mismatched request digest/snapshot, an untrusted operation collision or uncertain durable ordering yields **STOP_AND_PRESERVE**, never reset/rebase/force.
- A failed CAS with unexpected ref never retries by rebasing silently.
- No operation may report a completed commit merely because an unrecorded dangling object exists.

**Required fault injection:** force process termination (a) immediately after `commit-tree` returns but before SHA journal; (b) after SHA journal before CAS; (c) immediately after successful CAS before completion journal. In (a), demonstrate that only **one new commit is reachable on the subject ref** after retry, even if orphan objects differ in SHA. In (b)/(c), prove exact recorded-SHA idempotency. Repeat with wrong parent/ref and mismatched operation digest.

## 4. Accepted D2 — Trusted bootstrap and recovery

Two-phase prepare/open reuses `TrustedDispatcher.admit_with_work_block()`, `SQLiteAdmissionRegistry` and Controller v1; no duplicate admission service.

**Owner-authorized prepare order:**

1. Authenticate Owner request; verify repository, exact requested binding and allowed source/policy baseline.
2. Acquire trusted installation-wide operation lock.
3. Durably record operation ID, immutable digest, proposed admission ID and intended exact branch/workspace **before first Git mutation**.
4. Invoke existing Dispatcher atomic admission+WorkBlockBinding. Existing `admission.py` is responsible for initial subject branch creation/verification; the wrapper must not pre-create a second branch.
5. Verify SQLite admission and immutable binding; create or reattach the exact linked worktree; read back all identities, base, ref and common Git dir; record prepare completion.

Recovery: with durable intent, reconcile (no branch/no admission), exact-base branch/no admission, admission/no worktree, or matching existing worktree deterministically. An unexpected ahead/divergent branch, mismatched admission/digest, changed policy/base, unknown workspace ownership or ambiguous crash must STOP_AND_PRESERVE; never adopt/reset/delete implicitly.

After exact committed planning, protected `open` rereads registry binding (not caller scopes), validates the entire admitted-base→planning history, exact planning content and branch/clean state, then opens DEFINE with Critic PENDING.

### Initial implementation staging exception (NOT live Controller admission)

Until the protected bootstrap is implemented and activated, the first implementation cannot pretend it exists.

Proposed once-only **Owner-created** independent full-history inert development clone:

- `/var/tmp/azursystech-wb01-inert-dev-20261014`
- branch `feat/sdlc-wb01-trusted-autonomy-20261014` within that isolated development clone only
- its own Git common directory, isolated HOME and **no production registry, Controller authority or Owner credentials**.

Before Owner creates it, verify trusted source SHA and safe path creation: refuse preexisting destination, symlinks, incorrect owner/permissions and nonempty/unknown content; secure ancestors and create a private owner-controlled directory without following links. Do not equate the historical path label `WSL` with actual OS identity. This staging path is a proposal **not yet installed or authorized for creation**. If unavailable, BLOCKED — OWNER SETUP REQUIRED. Local inert staging is not a bypass of any existing production admission and does not prove autonomous host activation.

**R4 planning publication:** this documentation-only Git branch/commit, if created, is an architecture-review artifact, **not** an admission-backed subject branch or a valid Controller Critic transition. At eventual trusted prepare, the approved plan must be committed anew to the exact admitted subject history and Critic bound to that planning SHA. Do not adopt a pre-ahead subject branch in violation of admission logic.

## 5. Accepted D3 — Independent assurance provenance

Keep the current OrchestrationRunner/RoleExecutor integration but move authoritative acceptance to the protected execution path:

1. Trusted controller schedules separate Critic/Reviewer/Verifier runs bound to an exact planning or candidate SHA; creates execution/attempt IDs from protected state, not Agent input.
2. Trusted launcher starts a read-only, isolated role process and receives its result through the launcher's private inherited pipe or equivalent protected process-bound channel, not an Agent-accessible `submit READY` endpoint.
3. Verify actual process identity, reviewed immutable snapshot, role outcome/evidence, current admission/binding/lifecycle and unchanged exact SHA; persist protected receipt and evidence digest.
4. A protected transition revalidates receipt and state immediately before calling existing Controller state-machine mutation. Correlate receipt consumption/state transition under serialized durable recovery; reject forgery/replay and direct Agent `cli.critic ready`, reviewer/verifier or state edits.

Logical role labels alone do not establish independence. If a shared Agent UID permits Coder interference with assurance processes, add the minimum proven OS isolation before activation; do not claim it is secure without negative tests. A third principal is optional only when equivalent independence is *demonstrated*, not assumed.

## 6. Accepted D4 — Installed/runtime boundary

Owner/control principal: `azur`; restricted Agent: `azursystech-agent`. Trusted executable/import release is planned under `/opt/azursystech-sdlc-v1/<approved-release>/`, protected from Agent writes and separate from the registered Git installation/common Git dir, SQLite registry, protected operation journal/receipts and mutable task worktrees.

Do not execute privileged operations through `scripts/sdlc-v1-bridge.py` or Python imports selected from an Agent-writable worktree. Codex/Claude hooks may act as thin, untrusted request-forwarding adapters; they do not create authority. Protected installed code enforces all bindings and hard stops.

Creating Linux users, modifying host ACLs, installing privileged services, changing credentials/global runtime/network settings and production cutover require separate Owner approval. Both clients and every shell child must pass real identity, secret isolation, privileged socket and outbound-network negative tests before unrestricted autonomous operation.

## 7. Accepted D5 — Assurance order, publication and limits

Sequence: `authorized prepare → planning commit → trusted open → independent Critic READY → implementation/tests/commits → clean exact source candidate SHA → Reviewer READY → Verifier READY → verified trusted non-force subject-branch push → handoff`.

Permitted coordination-only post-candidate commits cannot change assured source paths or planning. Existing protected publish must verify remote/default/protection, credential scope and exact remote tip, and record provenance before INACTIVE. Unknown permissions/credentials cause BLOCKED. No ordinary Owner micro-approval for valid subject push; **merge and deploy always require explicit Owner approval**.

Draft PR automation/CI handoff is WB-02. Automatic destructive workspace cleanup is WB-03. No automatic Owner merge/deploy.

## 8. Source implementation and test ownership

The 25 exact `implementation_write_set` paths in §2.1 are frozen. Existing code is adjusted only to close the verified P0 gaps; new modules have narrowly assigned responsibilities:

- `.agent/orchestration/trusted_ops.py` + `scripts/sdlc-v1-ops.py`: protected authenticated operations channel, prepare/open, lock/journal recovery, trusted installed entrypoint.
- `.agent/orchestration/trusted_commit.py`: snapshot/index, canonical validations, commit object/ref CAS, crash recovery.
- `.agent/orchestration/trusted_assurance.py`: independent role launch, private result capture, protected receipt admission and READY transitions.
- Existing `cli.py`, `policy.py`, `gitfacts.py`, `git_adapter.py`, `hook.py`, `installation.py`, `runner.py`, bridge/bootstrap scripts and native settings: minimal contract wiring only.
- The 10 exact test files listed above: deterministic unit/integration, negative, fault-injection and E2E coverage. Use disposable fixtures; host-level tests only after separate activation authorization.

**Hard exclusions:** no `.agent/policies/**`, `registry.py` schema change, `dispatcher.py`, `admission.py`, `state.py`, application roots, ISO branch/source, deployment workflows, production host settings or secrets. If source evidence proves an excluded path mandatory, stop and request revised scope/Critic; do not silently expand.

## 9. Required verification and stop criteria

1. Schema-v2 binding passes Controller exact-path, overlap and derived-planning checks with 25 implementation paths and one planning/coordination path.
2. Exact planning and implementation paths enforced at pre-open/precommit; forged wider scopes, symlinks, staged unauthorized paths and change-then-revert history rejected.
3. Three commit-crash windows from §3.1 injected and replayed; no duplicate **reachable** subject commit, no overwritten unrelated ref and no false success.
4. Trusted prepare journal predates any branch mutation. Existing Dispatcher admission/registry uniqueness maintained under retry, concurrency and partial failure.
5. Coder cannot manufacture a protected assurance receipt or transition Critic/Reviewer/Verifier READY; each READY matches exact admitted planning/candidate SHA.
6. Agent cannot mutate controller modules/registry/Git common metadata or read Owner secrets/privileged sockets. Real OS tests mandatory before activation; fixture tests alone are insufficient.
7. Clean candidate frozen before Reviewer/Verifier; in-scope rework increments durable budget and revalidates new SHA.
8. Verified exact non-force subject publication only when safe; default/protected/force push, merge and deployment denied.
9. Persistent `main` checkout, historical ISO branch and all unrelated tracked/untracked user data preserved.
10. No routine Owner prompts in a fully **activated and verified** sandbox, without escalating process permissions.

Unverified prerequisites must return **BLOCKED/STOP_AND_PRESERVE**, not fabricated authority or readiness.

## 10. Critic disposition requested

**Delta-only** review of:

- `CRITIC-R3-001`: Controller-compatible exact immutable binding and all fixed fields in §2.
- `CRITIC-R3-002`: orphan-object/retry semantics and fault injection in §3.1.
- Planning artifact identity/SHA and confirmation that previous D1–D4 decisions were not reopened.

Return **READY (implementation-plan architecture only)** or minimal **REWORK**. No source implementation, production admission, privilege changes, deployment, merge or live activation is authorized by committing this plan.
