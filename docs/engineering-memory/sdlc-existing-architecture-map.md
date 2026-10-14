# Existing AzurSysTech SDLC — Architecture and Decision Navigation

**Last source review:** 2026-10-14  
**Scope:** `oleyna80/azursystech-site`, `oleyna80/agentic-sdlc-framework`, `oleyna80/azursystech-ai-native-sdlc`  
**Status:** Navigation and historical research only; **not** a governance policy, admission, Work Block, or permission grant.

## Why this file exists

Agent session context and cached memory are not reliable durable project authority. Before proposing or implementing new SDLC orchestration, Git handling, security gates, user separation, or permission workflows, inspect the **already accepted** contracts and prior implementation history below. First demonstrate the actual missing behavior; do not recreate a component merely because a new session does not remember it.

Read this document together with root `AGENTS.md`. If it conflicts with the current Owner instruction, accepted `governance/`, immutable trusted admission/Controller state, or accepted architecture, those higher-authority sources prevail. Follow the hierarchy in `AGENTS.md §3`.

## Canonical documents in this repository

| Concern | Read first |
| --- | --- |
| Current agent entrypoint and authority precedence | `AGENTS.md`; `governance/authority.md` |
| Permitted side effects and enforcement placement | `governance/enforcement.md`; `governance/lifecycle.md` |
| Accepted simplified SDLC and autonomous progression | `docs/architecture/sdlc-simplification-v1.md`; `docs/architecture/sdlc-simplification-v1-autonomous-orchestration.md` |
| Exact state, events, scopes and gate contracts | `docs/architecture/sdlc-simplification-v1-state-event-contract.md`; `docs/architecture/sdlc-simplification-v1-enforcement-matrix.md` |
| Implementation and migration intent | `docs/architecture/sdlc-simplification-v1-implementation-design.md`; `docs/architecture/sdlc-simplification-v1-implementation-plan.md` |
| Installed production components (verify actual behavior) | `.agent/controllers/v1/`; `.agent/orchestration/`; `scripts/sdlc-v1-bridge.py`; `scripts/sdlc-v1-bootstrap.py` |
| Trusted trigger/profile policy | `.agent/policies/admission-rules.json`; `.agent/policies/autonomy-profiles.json` |
| Subject publication vs Owner integration | `.agent/workflows/owner-controlled-github-flow.md`; `docs/architecture/execution-surface-routing.md` |
| Design economy and process observations | `docs/engineering-memory/engineering-decision-principles.md`; `docs/engineering-memory/process-feedback-registry.yml` |

Do not treat older tracked `.agent/active-work-block.json` (schema v3), legacy write-gate files, retired scripts, or historical closeout reports as live Controller v1 authority. Do not interpret a *target design* as evidence that it is installed.

## Prior accepted decisions — do not redesign by default

1. **Autonomous engineering is an existing requirement**, not a new initiative. Under approved Work Block and trusted admission, ordinary planning, scoped edits, tests, local staging/commits, independent assurance dispatch, bounded REWORK and corrective loops proceed without routine Owner micro-approval. The baseline `human-governed` profile stops for consequential integration/deployment decisions, not ordinary development. Sources: `AGENTS.md §§5–6`, `governance/authority.md`, and the autonomous orchestration contract.
2. **Exact subject-branch publication was separately designed and assured.** The authorized normal non-force push of the *assured exact subject ref* is distinct from force/default/protected-branch pushes, merge, credentials, and deployment. Inspect current policy and actual implementation before adding a per-push approval mechanism. Sources: `docs/specs/WB-2026-09-08-autonomous-work-block-execution.md`, `docs/plans/WB-2026-09-08-autonomous-work-block-execution.md`, and `.agent/workflows/owner-controlled-github-flow.md`. Current Owner instructions can narrow this for a particular task.
3. **Controller v1 is the active intended control plane** after the WB-006 cutover. Its lifecycle is `INACTIVE → DEFINE → EXECUTE → ASSURE → INACTIVE`; admission/profile/base/branch and WorkBlockBinding are authoritative external/Git-private facts. Required Critic READY precedes implementation; Reviewer and Verifier target an exact committed candidate. No second lifecycle or duplicate authority registry should be introduced without demonstrated necessity. Sources: `AGENTS.md`, state/event contract, installed code.
4. **Independent roles and risk-appropriate isolation are already designed.** Coder does not approve its own Critic/Reviewer/Verifier gate; ordinary in-scope findings prompt autonomous rework. Parallel write-sets require exclusive ownership or isolation. Source: autonomous orchestration contract and `governance/authority.md`.
5. **OS/platform security and process hooks are different layers.** Local Git/Claude/Codex hooks are cooperative guards, not sufficient isolation for secrets, production credentials, or privileged operations. Enforce consequential capabilities through external controls; prefer existing Linux, GitHub and runtime mechanisms before writing custom proxies. Sources: `governance/enforcement.md` and accepted engineering decision principles.
6. **Workspaces/cleanup have substantial prior history.** A separate full-history clone was used for the bounded WB-006 cutover rehearsal; that alone does *not* establish “one clone per normal Work Block.” Prior worktree cleanup audits require proof of ownership, exact identity and preservation of untracked content before deletion. Sources: `docs/changes/sdlc-simplification-v1-wb006/plan.md`, `docs/reports/closeout/WB-2026-08-29-repository-closeout-cleanup.md`, and `docs/reports/WB-2026-09-04-lifecycle-branch-cleanup.md`.
7. **Evolve, do not replace.** The independent course repository accepted `decisions/001-evolve-existing-sdlc-v3.md`: extend existing Work Blocks, gates, artifacts and skills incrementally; avoid a parallel framework, duplicated authority and enterprise-style approval bureaucracy.

## External repository references (context, not local authority)

- [Agentic SDLC Framework](https://github.com/oleyna80/agentic-sdlc-framework): `AGENTS.md`, `README.md`, `docs/engineering-memory/engineering-decision-principles.md`, `docs/plans/wb-core-003f-github-native-authority-model.md`, `docs/plans/wb-core-003h-self-hosting-authority-reconciliation.md`. The framework already treats normal reversible edits, local commits, ordinary subject pushes and PR work as agent-capable under applicable boundaries.
- [AzurSysTech AI-Native SDLC notes](https://github.com/oleyna80/azursystech-ai-native-sdlc): `decisions/001-evolve-existing-sdlc-v3.md`, `notes/07-parallel-sessions-and-subagents.md`, `notes/08-give-claude-a-feedback-loop.md`, `notes/10-ai-in-the-pr-review-loop.md`, `notes/11-hooks-as-approval-gates.md`, `notes/12-ci-cd-integration-and-deployment.md`. Course comparison/lessons are inputs to decisions, **not** a replacement operating framework.

## Known October 2026 recovery gap — distinguish intent from implementation

As of the 2026-10-14 investigations on `main` `49e976aefc29402b2e1578efbe64768dd5c30b41`:

- The installed dispatcher has `admit_with_work_block()`, atomic admission/Work Block binding, and Controller trusted-open; a verified **Owner-facing bootstrap entrypoint** was not found. `OrchestrationRunner.run()` also switches the passed checkout, incompatible with a read-only permanent `main` checkout if used there.
- Independent Critic found three production-boundary gaps: Owner execution isolation, `trusted-open` / direct Critic READY not enforcing protected immutable authority, and overly broad admitted pre-WB `docs/changes/**` planning writes.
- [P0 Architecture Revision 2 Critic](https://github.com/oleyna80/azursystech-site/blob/230a8faed522339b0a7a59c7253acbfe8c857c59/docs/reports/2026-10-14-sdlc-v1-p0-owner-bootstrap-recovery-critic-r2.md) returned **READY for architecture only**, *not* installation, security-test success or permission to create admission. Owner approved the architecture with an additional requirement for **autonomous agent local commits**; the implementation mechanism (e.g. existing-worktree compatibility versus isolated clone) needs reconciliation against original contracts, not automatic installation of a new Commit Gateway.
- The workstation is **native Ubuntu 26.04.1**. `/home/azur/Projects/WSL/` is a historical path name, not a WSL runtime. Earlier local inspection found Codex running as `azur`, with writable trusted Git/Controller/registry paths; the intended restricted Agent principal was not installed/verified.
- Existing ISO artifact-isolation source/reviews on `infra/sdlc-deployment-artifact-isolation-2026-10-13` are preserved evidence. ISO-003 publisher architecture remains deferred; the immediate ISO-RS corrections were paused pending trusted bootstrap recovery.

These are **dated findings**, not a substitute for fresh read-only preflight. Never infer that an architecture Critic READY makes the installation secure or operational.

## Required pre-design check for future SDLC agents

Before proposing a new service, registry, permission gate, Git clone/worktree convention or security wrapper:

1. Identify the current request, trusted admission, approved scope and applicable source hierarchy.
2. Read the canonical documents **for the actual subsystem**, then locate preceding specs, Work Blocks, Critic/Reviewer/Verifier and closeout evidence. Use `PROJECT_MAP.md` and repository search; do not reread every file by default.
3. Inspect the **installed code and real runtime behavior**; classify each capability as `ALREADY IMPLEMENTED`, `DESIGNED BUT NOT IMPLEMENTED`, `BROKEN/INCOMPLETE` or `NEW REQUIREMENT`.
4. Propose the **smallest demonstrable correction** to a broken/incomplete contract; avoid parallel control planes, duplicated gates, generic commit gateways or a fresh clone strategy without a measured reason.
5. Confirm that the change does not expand Owner/Agent authority. Keep local commits and internal rework autonomous where admitted; preserve exact Owner Hard Stops. Distinguish ordinary runtime sandbox prompts from Controller denials before altering either.
6. Follow the authorized Work Block/branch/workspace path. Do not mutate stable `main`, existing ISO evidence, authority registry, permissions or production systems merely because this navigation file exists.

**Rule of interpretation:** This page is an index and historical finding record. Current `AGENTS.md`, `governance/`, trusted admission/state, accepted architecture and explicit Owner instructions govern actual behavior.
