# SDLC v1 P0 — Independent Critic: Trusted Owner Bootstrap Recovery

**Verdict: REWORK**  
**Review date:** 2026-10-14  
**Repository:** `oleyna80/azursystech-site`  
**Trusted implementation baseline:** `49e976aefc29402b2e1578efbe64768dd5c30b41` (`main`)  
**Reviewed input:** Owner Bootstrap Recovery proposed contract, supplied with the review assignment  
**Review mode:** GitHub source read-only; no workstation, registry, hook execution, Controller operation, admission, worktree creation or tests.

**Report storage:** Documentation-only commit on existing branch `infra/sdlc-deployment-artifact-isolation-2026-10-13`, at Owner's explicit instruction. The report does not change the frozen baseline main or implement any bootstrap feature.

## 1. Executive decision

The proposed `prepare` / `open` separation is directionally sound and reuses the correct components. Existing dispatcher admission is policy-bound; the SQLite registry offers atomic admission and Work Block binding insertion; Controller `open_with_resolver()` initializes DEFINE / Critic PENDING; and branch creation can be performed without switching the persistent `main` checkout.

However, two HIGH trust-boundary issues prevent an architecture READY:

1. The Owner-only invocation and code/registry integrity mechanism is not concretely selected or proven for the actual workstation. Same-user filesystem and command access cannot be made Owner-only using ordinary CLI flags or chmod on a user-writable checkout.
2. Existing direct Controller entry points can bypass the proposed launcher's exact Work Block binding check. In particular, `trusted-open` accepts caller-supplied scopes and does not compare them to `registry.resolve_work_block()`; the standalone controller CLI also accepts `critic ready` as an operation without checking external independent Critic evidence.

A further MEDIUM mismatch exists between the claimed exact pre-WB planning scope and the broader existing `docs/changes/**` pre-WB admission policy.

**Do not start implementation or create the proposed Work Block until these contracts are corrected and separately approved.**

## 2. Verified source facts — PASS

All code locations below refer to `49e976aefc29402b2e1578efbe64768dd5c30b41`.

- [`.agent/orchestration/dispatcher.py` L61–96, L139–192](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/.agent/orchestration/dispatcher.py#L139-L192): `TrustedDispatcher` restricts triggers, resolves a policy revision itself, and delegates `admit_with_work_block()` to an atomic registry writer.
- [`.agent/orchestration/admission.py` L120–165, L238–253](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/.agent/orchestration/admission.py#L120-L165): policy is loaded at the resolved revision; `base_ref` resolves to a commit; subject branch is created/verified before the registry insert.
- [`.agent/orchestration/registry.py` L490–560](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/.agent/orchestration/registry.py#L490-L560): admission and Work Block binding persist in one SQLite transaction. `WorkBlockBinding` includes `deployment_is_production` and `max_rework_cycles` in addition to the request's scopes.
- [`.agent/policies/admission-rules.json`](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/.agent/policies/admission-rules.json): `manual-owner` uses the `human-governed` profile and `base_ref: main`.
- [`.agent/controllers/v1/cli.py` L41–90](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/.agent/controllers/v1/cli.py#L41-L90), [`state.py` L231–282](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/.agent/controllers/v1/state.py#L231-L282): `open_with_resolver()` binds current planning HEAD and produces DEFINE / Critic PENDING; Critic READY is a separate transition.
- [`scripts/sdlc-v1-bootstrap.py` L43–89](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/scripts/sdlc-v1-bootstrap.py#L43-L89): supports installation/check only; no admission command.
- [`.agent/controllers/v1/installation.py` L46–101](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/.agent/controllers/v1/installation.py#L46-L101): validates regular-file configuration, restrictive mode and external registry location; these checks do **not** independently establish protection from an agent running under the same filesystem authority.

**Not independently verifiable through GitHub:** The local registry's claimed empty state, actual OS user/process permissions, protected installation digest, Owner authentication channel, worktree inventory, current hooks installation, untracked main files, and any operational authority separation.

## 3. Blocking findings — severity ordered

### P0-BS-001 — HIGH: Owner execution boundary is unspecified and not verified

**Evidence:** Proposed contract ``3 and 7; `scripts/sdlc-v1-bootstrap.py` L74–89; `installation.py` L46–101.

The proposed launcher is described as Owner-controlled and external to the agent. The contract does not select the actual enforceable boundary (different OS identity, protected service with authenticated IPC, or another explicitly protected Owner-only execution surface), identify who owns and can modify the imported Python modules, or establish that an agent's shell cannot invoke/replace it or write its registry.

Merely requiring an Owner label, a command-line confirmation, a hash checked by attacker-writable code, or a `0600` config file owned by the same UNIX identity as the agent is not an enforceable Owner boundary.

**Minimum architecture correction:**

1. Select the concrete Owner-controlled execution channel and principal that the development agent cannot impersonate.
2. State which principal owns launcher, imported modules, installation configuration, policy source, operation intent/locks and registry; specify permission and code-integrity checks performed before any mutable registry construction or Git operation.
3. Verify the agent's effective read/write/execute capabilities under the actual WSL/workstation account(s), including direct Python imports and Git config/hook manipulation.
4. Require an unauthorized end-to-end attempt to fail with no Git, filesystem or registry mutation before calling the architecture operational.

If the same agent-accessible identity can invoke the protected operation or edit trusted inputs, **STOP/REWORK**. Do not add a broad new orchestration service.

### P0-BS-002 — HIGH: Direct trusted-open and Critic CLI bypass the new launcher

**Evidence:**

- [`scripts/sdlc-v1-bridge.py` L199–219](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/scripts/sdlc-v1-bridge.py#L199-L219) validates active admission and repository, then passes `work_block_id`, `initiative_ref`, `planning_paths`, `implementation_write_set`, and `coordination_scope` directly from caller-provided JSON.
- [`scripts/sdlc-v1-bridge.py` L277–299](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/scripts/sdlc-v1-bridge.py#L277-L299) exposes this as `trusted-open --payload`.
- [`.agent/controllers/v1/cli.py` L41–90](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/.agent/controllers/v1/cli.py#L41-L90) resolves the admission but does not resolve/compare its immutable `WorkBlockBinding`.
- [`.agent/controllers/v1/cli.py` L312–355](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/.agent/controllers/v1/cli.py#L312-L355) exposes `critic` with caller-supplied outcome; [`state.py` L273–282](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/.agent/controllers/v1/state.py#L273-L282) moves DEFINE to EXECUTE for READY.

**Impact:** Once a valid admission exists, a caller capable of invoking existing public entry points and writing Controller state could open a Work Block using scopes different from the immutable registry binding, and then request a local READY transition without independently authenticated Critic authorization. The proposed Owner launcher alone does not remove those alternative authority paths.

**Minimum architecture correction:**

1. Make all production `open` paths validate `registry.resolve_work_block(admission_id)` against the exact proposed Work Block and scope parameters; take authoritative values from that immutable record.
2. Specify a trusted Critic-result admission/transition boundary: an agent-accessible standalone `critic ready` call must not substitute for independent Critic evidence. Use the minimal restricted dispatch/OS protection or a narrowly bounded existing entrypoint repair; do not change lifecycle semantics.
3. Prove direct bridge/CLI calls cannot bypass the protected launcher or move state to EXECUTE with forged approval.
4. Add source-level and live isolation negative tests for mismatched binding and direct CLI bypass.

A limited correction to bridge/wiring or authority enforcement may therefore be unavoidable; the proposed default prohibition on modifying existing Controller entrypoints cannot override a demonstrated bypass.

### P0-BS-003 — MEDIUM: Pre-WB planning authority is broader than the proposed planning path

**Evidence:** Proposed ``4, 5 and Phase B; [`.agent/controllers/v1/policy.py` L17–34, L65–74](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/.agent/controllers/v1/policy.py#L65-L74).

With admission and no active state, existing policy permits **any** path below `docs/changes/**`. It does not consult the immutable Work Block binding's exact planning path `docs/changes/iso-rs-001-004/plan.md` or coordination scope. The contract currently says only approved planning paths are permitted prior to open.

**Minimum correction:** Either make pre-WB write/commit checks bind to the admitted `WorkBlockBinding` planning surface through a minimal existing adapter/policy change, or explicitly narrow the guarantee to “broader pre-WB writes are possible but the trusted open rejects any extraneous planning/history paths” and document the residual pre-open mutation risk. Because the request requires constrained pre-WB planning, the former is preferred. Include a negative test attempting a `docs/changes/other-initiative/plan.md` write before open.

## 4. Accepted/reusable architecture

- **Two-phase prepare/open:** Appropriate. An admission followed by committed planning and later `open_with_resolver()` resolves the bootstrap chicken-and-egg sequence without starting EXECUTE in the launcher.
- **Atomic admission/binding:** Supported by `put_admission_with_work_block()`. This does not make Git branch/worktree mutation atomic; the separate durable-intent/recovery contract is necessary and proportionate.
- **No mutation of persistent main checkout:** The existing admission creates a branch ref with `git branch`; it does not checkout that branch in the persistent worktree. Any planned worktree command must use the approved new workspace path and preserve untracked files.
- **Identity proposal:** `WB-2026-10-14-iso-rs-001-004` satisfies the Controller work-block ID grammar. The proposed implementation write-set comprises only `.dockerignore`, the isolation workflow and inspector. `deployment_target=null` is appropriate; `deployment_is_production=false`, `default_branch=main` and `max_rework_cycles` must be resolved/validated from trusted approved configuration.
- **Old branch preservation:** `infra/sdlc-deployment-artifact-isolation-2026-10-13` and reviewed code SHA `d38347704753b49b849f4d78928e615e23ff44ef` must not be implicitly merged or cherry-picked. Only the three authorized source files may later be transferred after valid EXECUTE. This review report itself is stored on that existing branch under the explicit separate Owner instruction.
- **Locking:** A trusted installation-wide bootstrap lock can serialize two bootstrap requests. It does not lock out unrelated Controller actions; recheck current registry records, branch/worktree inventory and authority state at each mutation boundary, using exact-identity and compare-and-stop semantics. If the trusted lock and state checks cannot prevent a conflicting mutation, fail closed.
- **Idempotency/recovery:** Immutable operation ID and request hash, committed durable intent, read-back, and explicit STOP AND PRESERVE on ambiguous cases are sound design criteria. Never automatically delete a possibly reused branch or worktree.
- **Reuse first:** Neither `sdlc-v1-bootstrap.py` (install/check) nor `sdlc-v1-bridge.py` (existing trusted-open) currently supplies the missing Owner authentication boundary. A thin protected entrypoint is reasonable after its authority mechanism and competing entrypoints are specified.

## 5. Required negative/fault-injection tests

All tests use disposable Git repositories/worktrees and isolated SQLite registries, not the real Owner installation.

1. Agent shell attempts to invoke/rewrite launcher, module import path, policy ref, config, registry or owner-operation intent — denied before mutation.
2. Caller supplies fake Owner flag, environment, payload, alternate repository/remote/registry, profile or policy revision — denied.
3. Agent invokes `trusted-open` directly with a valid admission but a different `implementation_write_set`, `coordination_scope`, planning path or Work Block ID — denied without Controller state mutation.
4. Agent invokes standalone `critic ready` without authenticated independent Critic evidence — denied; no EXECUTE state transition.
5. Pre-WB write/commit outside the exact authorized initiative planning surface, including another `docs/changes/` initiative — denied (or explicitly flagged if a narrower assurance cannot be supported).
6. Wrong expected base SHA, moved trusted `main`, unsuitable/protected subject ref, reused old ahead-of-base ISO branch, invalid path, nonempty/symlink worktree destination — denied without destructive cleanup.
7. Duplicate same-operation requests return the same verified admission/worktree; changed request payload conflicts; concurrent requests cannot create two authoritative bindings.
8. Fault after branch creation, atomic registry commit, worktree attach and planning commit — recover exact identity or STOP AND PRESERVE without creating a second admission.
9. Concurrent authorized lifecycle/Git operations racing prepare/open — detected and rejected or safely revalidated.
10. No implementation before independently authorized EXECUTE; failed or skipped Critic does not authorize implementation.
11. Before/after tests verify original main HEAD/index/untracked files unchanged, old ISO source branch/history intact, no unexpected registry rows and no forced cleanup.

Mocks alone are insufficient to establish OS execution separation. That requires a real isolated permissions/identity test with the proposed Owner/agent principals.

## 6. Outstanding operational unknowns

The connected GitHub repository cannot show the current workstation OS authority, executable/module permissions, registry contents, actual installed `core.hooksPath`, local worktree listing or trust of the remote-tracking policy ref. The input's claims about the installed registry being empty and the persistent checkout being `main` are not independently verified by source reading.

No launcher has been created. No authorization path or negative-test evidence has been established in this review.

## 7. Minimum changes before a new architecture review

1. Select and document the concrete non-impersonable Owner invocation/installation boundary, including effective users, protected imports, policy/config and external SQLite state.
2. Close the existing `trusted-open` immutable-binding bypass and define how independent Critic READY is admitted without relying on agent-accessible CLI input.
3. Resolve the pre-WB exact planning-scope mismatch, including a clear negative-test expectation.
4. Preserve the existing two-phase dispatcher/registry/Controller integration and STOP AND PRESERVE recovery model; no broad new orchestrator.

**Owner approval required:** Selected OS/service/credential authority boundary; any bounded edits to existing bridge/CLI/hook policy, new launcher/test/documentation files, local installation changes, and eventual admission/worktree creation. Any future merge, subject publication or deployment remains separately gated.

## 8. Final verdict

**REWORK — Trusted Owner Bootstrap Recovery architecture.**

This verdict is grounded in the supplied plan and exact baseline implementation. It does **not** mean the proposed Work Block is rejected on business grounds. It means the stated Owner-only authority and immutable Work Block scope cannot yet be guaranteed by the proposed launcher alone.

**No bootstrap, admission, Work Block binding, worktree, Controller state or implementation operation has been performed in this review.**
