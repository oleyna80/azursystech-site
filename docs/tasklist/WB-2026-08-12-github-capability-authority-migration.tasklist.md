# Tasklist — WB-2026-08-12 GitHub Capability Authority Migration

Status: IMPLEMENTING
Baseline H0: `441b134d71f781d2d0fcc48d3a8da86875835a9c`
Implementation branch: `agent/github-capability-authority-migration`

## Phase 0 — Preserve baseline

- [x] Confirm exact local H0.
- [x] Preserve canonical dirty/staged user state without reset/clean.
- [x] Publish exact H0 to `baseline/azursystech-441b134d`, not `main`.
- [x] Create implementation branch from exact H0.
- [x] Mark prior showcase signed authorization as superseded/non-reusable.

## Phase 1 — Port schema v3 authority model

- [x] Map AzurSysTech generated control-plane preimages to framework pre-migration template.
- [x] Replace active/default Work Block schema v2 with schema v3 `github_capability`.
- [x] Retire signed authorization from normal path; keep historical records as audit only.
- [x] Port provider-neutral consequential-operation guard.
- [x] Port Codex write-set/move/Bash/staged-commit guard.
- [x] Port Codex lifecycle/doctor/write-gate semantics.
- [x] Port Claude Work Block + assurance hooks/settings.
- [x] Reconcile OpenCode Coder local commit / feature push posture without losing AzurSysTech-specific paths.
- [x] Reconcile installation/evaluation validators.
- [x] Reconcile AzurSysTech `AGENTS.md` so legacy commit/push Hard Stop text does not contradict schema v3.
- [x] Remove project-adaptation drift inherited from framework-oriented wording.

## Phase 2 — Consequential capability boundary

- [x] Keep direct default-branch, force, remote-delete, broad/mirror/prune, destructive, live infra/data, credential, irreversible publish, and client mutations outside normal local agent authority.
- [x] Record that project-local hooks are defense in depth, not the primary production security boundary.
- [x] Verify project changes do not introduce production/VPS/DB/secrets into normal agent context.
- [x] Record that GitHub Free/private does not provide technical protected-main enforcement for this repository.

## Phase 3 — Deployment workflow

- [x] Confirm production deploy remains manual `workflow_dispatch`.
- [x] Verify immutable SHA/image binding remains intact.
- [x] Verify `include_admin=false` remains default.
- [x] Verify no source push/merge path implicitly deploys production.
- [x] Harden Docker Publish admin default to `publish_admin=false`.

## Phase 4 — Selected repository publication mode

- [x] Owner selected **GitHub Free + private repository + Owner-controlled push**.
- [x] Owner rejected GitHub Pro as unnecessary for current work volume.
- [x] Owner rejected temporary `private -> public -> private` visibility switching.
- [x] Record residual limitation honestly: private `main` remains technically unprotected on GitHub Free.
- [x] Define operational rule: normal agent development stops before `git push`; Owner controls feature-branch publication and merge.
- [x] Add canonical durable decision/process record under `docs/engineering-memory/github-free-owner-controlled-flow.md`.
- [x] Add canonical project workflow `.agent/workflows/owner-controlled-github-flow.md`.
- [x] Integrate that workflow into the project Git orchestration skill for `.agent`, `.claude`, and `.opencode` surfaces.
- [x] Verify the documented handoff contains branch, exact HEAD SHA, scope summary, deterministic checks, intended remote ref, and explicit no-production statement.
- [x] Verify the process explicitly says it is not protected-branch enforcement and does not claim credential isolation that is not present.

## Phase 5 — Critic correction pass

- [x] Run Critic on head `0275227a5d56760d73c191dcf187771c3177de5d`.
- [x] Record Critic verdict `RECONSIDER` and blocking findings C1-C3 in PR #12.
- [x] Reconcile `AGENTS.md` so current private/Free mode always stops before remote source publication.
- [x] Reconcile `.agent/hooks/hard_stop_policy.py` so every `git push` is denied in the normal agent channel.
- [x] Reconcile `.opencode/agents/coder.md` and `opencode.json` so OpenCode cannot approve/prompt its way through `git push`.
- [x] Reconcile `scripts/test-github-capability-control-plane.py` so executable contracts require feature-push denial and OpenCode `git push* == deny`.
- [ ] Confirm final deterministic CI/Control Plane Contracts pass on the exact corrected head.
- [ ] Re-run Critic on that exact green head.

## Assurance

- [x] Core deterministic Control Plane Contracts fixtures passed before the Critic correction pass.
- [x] Main application CI passed before the Critic correction pass.
- [ ] Final deterministic Control Plane Contracts pass after correction.
- [ ] Final main application CI pass after correction.
- [ ] Critic final verdict `APPROVE`/`SUPPLEMENT` with no unresolved blocker.
- [ ] Reviewer final verdict.
- [ ] Verifier final verdict with honest GitHub Free/process-boundary classification.
- [ ] Closeout report records canonical local checkout unchanged and production untouched.

## Final gate

- [ ] `AZURSYSTECH GITHUB CAPABILITY AUTHORITY MIGRATION VERIFIED`.
- [ ] Resume `WB-2026-08-12-showcase-production-multizone` under schema v3.

## Accepted residual risk

The Owner accepts that a private repository on GitHub Free does not provide the same technical `main` protection as the public framework ruleset or a paid private-repository protection mode. For the current low-volume project, publication and merge are intentionally retained as manual Owner-controlled steps.

This residual risk must remain explicit in assurance evidence. Project-local hooks and the Owner-controlled-push workflow are operational guardrails; they must not be described as equivalent to GitHub protected-branch enforcement.
