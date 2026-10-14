# SDLC v1 P0 — Independent Architecture Critic, Revision 2

**Verdict: READY — architecture only**  
**Review date:** 2026-10-14  
**Repository:** `oleyna80/azursystech-site`  
**Exact trusted implementation baseline:** `49e976aefc29402b2e1578efbe64768dd5c30b41` (`main`)  
**Preceding Critic:** [Revision 1 — REWORK](./2026-10-14-sdlc-v1-p0-owner-bootstrap-recovery-critic.md), report commit `b33f79041a705466915e7bb213f95dc2fc0f4a62`  
**Input:** Supplied `SDLC v1 P0 — Independent Architecture Critic, Revision 2` proposal.  
**Review method:** Independent GitHub read-only source inspection against the exact baseline; local Ubuntu inspection data is **provided by the proposal** and not independently attested in this review.

**Report publication exception:** The Owner explicitly requested a separate report file on the existing branch. This documentation-only commit does not authorize changes to Controller, local users, permissions, registry, installation, Git worktrees, or the source baseline.

## 1. Decision and limits

Revision 2 resolves the three prior findings **at the architecture-contract level** by selecting a distinct, restricted Agent UNIX principal, isolating trusted code and mutable authority state, requiring immutable registry binding for every production open/rebind, adding an Owner-only independent Critic approval gate, and restricting pre-Work-Block planning to the exact binding.

**Critic READY means this architecture may be presented to Owner for explicit approval and a bounded implementation plan.** It does not prove these protections are installed, does not authorize creating `azursystech-agent`, does not authorize local permission changes, and does not permit admission, Work Block opening, EXECUTE, ISO-RS implementation, publication, merge, or deployment.

A production activation must fail closed until actual negative tests under distinct Linux credentials pass. No new HIGH/MEDIUM architecture blocker was established by the GitHub comparison; important integration requirements below remain mandatory implementation/activation gates.

## 2. Disposition of previous findings

### P0-BS-001 — HIGH: Owner authority boundary — RESOLVED (design only)

Revision 2 selects Owner identity `azur` and a dedicated Agent identity `azursystech-agent`. It explicitly excludes `sudo`, `docker`, `lxd`, administrative polkit privileges, relevant Linux capabilities, Owner keyrings/agents/credentials, writable Git metadata, Controller state, registry, trusted runtime code, install configuration and privileged IPC from the Agent. It requires the trusted production executable and imports to come from a root-owned, non-Agent-writable installation and real OS-principal negative testing.

This answers the earlier missing principal/trust-boundary contract. Ubuntu is **native**, not WSL; the path component `WSL` is historical.

**Critical qualification:** The supplied local observations say current Codex processes run as `azur` (UID/EUID 1000), and `azur` is a member of `sudo`, `docker`, `lxd` and `adm`. The proposed separation therefore does **not yet exist**. The exact sudoers policy, Claude Code UID, helper privileges, inherited environment, protected IPC and all effective file/parent-directory permissions must be measured on the host, not inferred from the GitHub repository.

**Minimal mandatory activation condition:** Both Codex and Claude Code, including child processes/tool executors and any shared session daemons, actually run only as the restricted Agent identity, with no lateral path to Owner credentials, Docker socket, LXD, sudo or protected files. Permission-only self-checks executed by `azur` do not establish this.

### P0-BS-002 — HIGH: Trusted-open / Critic READY bypass — RESOLVED (required implementation contract)

Revision 2 requires all production open/rebind paths to resolve `registry.resolve_work_block(admission_id)` and derive or compare every authority-bearing field against the immutable WorkBlockBinding; it also requires a protected Owner-only `approve-critic` receipt tied to exact planning SHA, independent Critic evidence, binding digest, policy revision and authenticated Owner authorization. The Agent cannot write Controller state or invoke privileged production transitions.

Existing source still shows the bypasses, so **design closure is not source-code closure**:

- [`scripts/sdlc-v1-bridge.py` L199–219](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/scripts/sdlc-v1-bridge.py#L199-L219) forwards caller-supplied scope fields without checking the immutable binding.
- [`.agent/controllers/v1/cli.py` L41–90](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/.agent/controllers/v1/cli.py#L41-L90) resolves only the admission for `open_with_resolver`.
- [`.agent/controllers/v1/cli.py` L312–355](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/.agent/controllers/v1/cli.py#L312-L355) exposes `critic`, `revise-bind` and related transitions directly; [`state.py` L273–282](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/.agent/controllers/v1/state.py#L273-L282) transitions READY to EXECUTE.
- [`registry.py` L597–635](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/.agent/orchestration/registry.py#L597-L635) already supports immutable WorkBlockBinding retrieval without a registry schema change.

**Mandatory:** Privileged state files must not be writable by the Agent even through direct Python imports, standalone CLI execution, hooks or alternative Git configuration. All production callers must use the same protected binding/approval checks. Pure testable state-machine functions need not be rewritten; prevent untrusted production access to their persistence authority. Rebinding must not expand the original immutable scope.

Independent Critic authorization cannot be a string, file path or digest arbitrarily supplied by the development agent: Owner must verify the actual Critic provenance and immutable evidence at the cited planning revision. Approvals must be exact-use, replay-safe and durable.

### P0-BS-003 — MEDIUM: Broad pre-WB planning — RESOLVED (required implementation contract)

Revision 2 requires evaluation based on the admitted immutable exact planning path `docs/changes/iso-rs-001-004/plan.md`, not just the old directory prefix. It explicitly requires DENY for `docs/changes/other-initiative/plan.md` and OS-level write constraints.

The existing [`.agent/controllers/v1/policy.py` L17–34 and L65–74](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/.agent/controllers/v1/policy.py#L65-L74) still authorizes arbitrary admitted `docs/changes/**` changes before an active Work Block.

**Mandatory:** Enforce the exact binding both for runtime write checks and Owner's pre-commit/commit acceptance; require history inspection before `open`, not just a clean final diff. Account for symlinks, hardlinks and editors' atomic-save behavior without granting broad writable parent directories. Negative tests must include a mixed allowed/forbidden file set.

## 3. New source-level integration observations — implementation-critical, not new architecture blockers

### INT-R2-001 — Trusted release root versus Git repository root

The current [bridge L13–45](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/scripts/sdlc-v1-bridge.py#L13-L45) derives `ROOT` from `__file__`, imports modules from `ROOT/.agent` and then resolves `_installation_root()` as a Git worktree. [`hook.py` L19–28](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/.agent/controllers/v1/hook.py#L19-L28) assumes the installed and target roots belong to the same Git common directory.

A protected code release in `/opt/azursystech-sdlc-v1/<approved-release>/` is not inherently a Git worktree. Therefore a literal relocation or copy of the existing bridge can fail, or tempt an unsafe fallback to worktree imports.

**Implementation contract:** Separate **trusted executable/import release root** from **canonical registered Git installation/common-Git-directory root**. Bind and validate both through Owner-controlled configuration; check exact repository identity and revision. Execute verified installed code, never subject-worktree-controlled imports or a Python search path supplied by the Agent. This is a bounded bridge/installation adapter correction, not a new orchestration framework.

### INT-R2-002 — Owner Git commits must use protected hooks and sanitized execution

[`.githooks/pre-commit`](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/.githooks/pre-commit) and [`.githooks/commit-msg`](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/.githooks/commit-msg) invoke `python3 "$root/scripts/sdlc-v1-bridge.py"`; [`scripts/sdlc-v1-bootstrap.py` L43–69](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/scripts/sdlc-v1-bootstrap.py#L43-L69) installs `core.hooksPath=.githooks`. That configuration does not by itself invoke the new root-owned runtime.

**Implementation contract:** The Owner commit path must execute trusted hooks/bridge and verified imports, refuse modified executable paths and untrusted `PYTHONPATH`/environment overrides, and perform authorized path and staged-content checks before a Git commit. The Agent must not be able to replace hooks, Git config, scripts/imports, filesystem ancestors or the index. Do not run agent-edited application/build/test code under Owner's privileged host identity; isolate such execution separately.

### INT-R2-003 — Git edit/commit model and temporary-file handling

Owner-operated `git add/commit` is a reasonable **temporary P0/MVP trade-off**. It imposes manual checkpoints but avoids handing the Agent unrestricted metadata/write capability or building a privileged Git gateway prematurely. The project can revisit autonomous commit mediation after the OS trust boundary is proven.

An Agent cannot necessarily perform common editor atomic-save/rename operations when only the target file is writable; broad write access to a parent directory would allow additional names. Before activation, select a narrow editing strategy (e.g., checked and safely promoted file replacement, or a purpose-built constrained writable staging area) that preserves exact Work Block path authorization, prevents symlink/hardlink escape and does not create a general Owner command-execution interface.

### INT-R2-004 — Locking and durability

An installation-wide lock covering **all trusted lifecycle mutations** is a defensible requirement; a bootstrap-only lock is not enough. The lock does not replace atomic SQLite operations, Git ref/worktree identity checks or Controller state compare-and-swap. Use durable intent, an immutable operation ID/digest and stop-and-preserve on uncertain completion. Reopen, revise, Critic approval, branch/worktree attachment and state changes must not race unnoticed.

The [dispatcher/admission code](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/.agent/orchestration/admission.py#L120-L165) creates/verifies the subject branch before persisting admission. The [registry](https://github.com/oleyna80/azursystech-site/blob/49e976aefc29402b2e1578efbe64768dd5c30b41/.agent/orchestration/registry.py#L490-L560) atomically stores admission+binding, but Git, SQLite, state and filesystem cannot be one transaction. Keep the revision's idempotent recovery and no-forced-cleanup rules.

## 4. Minimum P0 implementation scope

Necessary:

1. Privilege separation: create/operate `azursystech-agent` as a restricted principal; protect the Owner-controlled Git metadata, Controller state, registry, config, journal, locks and trusted runtime, all including filesystem ancestors.
2. Thin protected Owner `prepare` / `open` / `approve-critic` / `status` / `recovery` entrypoint, reusing existing dispatcher, admission, registry and Controller semantics.
3. Minimal bridge/CLI/policy/hook/storage integration ensuring trusted imports, registry-bound scopes, Owner-only state transitions, exact pre-WB planning, authenticated Critic evidence and trusted commit hooks.
4. Git/worktree canonical identity, locking, durable intent/idempotent recovery and strict fail-closed decisions.
5. Unit/integration/fault-injection plus **real OS-identity negative tests**, with documentation of Owner/Agent runbooks.

Defer: new persistent orchestration service, unrestricted privileged Git gateway, autonomous agent commits, new registry schema unless proven unavoidable, rewriting the pure state machine, changing dispatcher profile policy, publication/deployment redesign, and unrelated Agent/ISO application work.

## 5. Owner decisions still required

The Owner must separately authorize:

- Creation/migration to restricted `azursystech-agent` and whether both Codex and Claude Code will run exclusively under that UID.
- Protected runtime installation/release ownership and secure Git hook/bridge integration.
- Local user/group, file/ACL, credentials, socket, registry, Git ownership/config and policy updates.
- Temporary **Owner-performed Git staging/commit** process and the bounded Agent edit/staging strategy.
- Approved identity of the restricted ISO Work Block, exact rework limit and coordination/report scopes.
- A specific Critic evidence provenance verification and approval-receipt procedure.
- Later admission/worktree creation, Critic activation, candidate publication, PR, merge and deployment through their distinct gates.

Do not repurpose `azursystech-verifier` for ordinary development-agent execution without a separate decision.

## 6. Verification required before operational activation

**Host/identity:** Record actual UID/EUID/groups/capabilities for Codex, Claude and every spawned shell; no agent access to sudo/docker/lxd, polkit, Owner user sockets, SSH/GitHub/VPS credentials, installed modules, Git common directory, index, Controller state, registry, journal or locks. Test attempted access and denial under `azursystech-agent` itself, not only with mock identities.

**Authority bypass:** Attempt direct `trusted-open` with forged scopes and valid admission; direct `cli critic ready`, `revise-bind`, direct Python import/persistent state writes, forged or replayed Critic receipt, and wrong/current planning SHA. All must fail before mutation. A valid Owner approval must advance only the authorized work block and exact planning revision.

**Planning/hook and Git:** Authorized planning file edit with chosen atomic-save strategy and Owner commit succeeds with trusted hooks. Other initiative paths, mixed staged files, symlink/hardlink tricks, changed Git configuration, mutable imports, alternate origin/base and default branch writes fail. Inspect full commit history since admitted base, not only HEAD diff.

**Recovery:** Inject failures at journal persistence, Git ref creation, admission+binding insert, worktree attach, planning commit, opening, approval and permission transition. Repeated identical operation is idempotent, changed request conflicts, terminal admission stays terminal, and uncertain durability STOP AND PRESERVE. Competing trusted lifecycle operations share a lock or detect stale state and fail closed.

**Preservation:** Before/after comparison proves the original persistent `main` HEAD/index/untracked contents unchanged, the existing ISO branch/history unchanged except a separately authorized documentation-only report commit, and no unapproved branch/worktree/admission/registry mutation.

All active security guarantees remain **UNVERIFIED** until actual implementation and these tests.

## 7. ISO-RS identity and scope consistency

The revised proposed subject branch `fix/iso-rs-001-004-2026-10-14` and worktree `/home/azur/Projects/WSL/worktrees/azursystech-iso-rs-001-004` are *proposals*, not existing created resources. `WSL` in the path does not imply a WSL operating environment. The work block ID `WB-2026-10-14-iso-rs-001-004` matches the Controller grammar.

The only permitted ISO implementation source files, **after** a separately authorized future EXECUTE, are:

- `.dockerignore`
- `.github/workflows/deployment-artifact-isolation.yml`
- `scripts/verify-runtime-artifact-isolation.py`

The frozen original ISO code candidate remains `d38347704753b49b849f4d78928e615e23ff44ef`. The reduced-scope review remains linked to `24255b7b3d76a748dbc4b6a763cfe95b518ff917`, and the original bootstrap Critic report was committed as `b33f79041a705466915e7bb213f95dc2fc0f4a62`. No original branch-wide merge/cherry-pick, Controller bypass or deployment authority is implied.

## 8. Final verdict

**READY — Revision 2 architecture for explicit Owner review and bounded implementation planning only.**

- P0-BS-001 — **RESOLVED, design**; actual two-principal boundary uninstalled/unverified.
- P0-BS-002 — **RESOLVED, design**; exact immutable binding and protected Critic approval must still be implemented in every production path.
- P0-BS-003 — **RESOLVED, design**; pre-WB policy, hooks and OS write containment must still be corrected and tested.
- New blocking architecture findings: **none**. Integration requirements INT-R2-001 through INT-R2-004 are mandatory before operational activation.

**No source implementation, local privilege change, bootstrap, new Work Block, Controller state transition, tests, publication, merge, or deployment was performed by this review.**
