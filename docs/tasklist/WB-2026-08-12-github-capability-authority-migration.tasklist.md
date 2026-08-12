# Tasklist — WB-2026-08-12 GitHub Capability Authority Migration

Status: READY_FOR_OWNER_MERGE
Baseline H0: `441b134d71f781d2d0fcc48d3a8da86875835a9c`
Implementation branch: `agent/github-capability-authority-migration`
PR: #12

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
- [x] Reconcile OpenCode Coder local commit / feature-push posture without losing AzurSysTech-specific paths.
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

- [x] Owner selected **GitHub Free + private repository + Owner-controlled push/merge**.
- [x] Owner rejected GitHub Pro as unnecessary for current work volume.
- [x] Owner rejected temporary `private -> public -> private` visibility switching.
- [x] Record residual limitation honestly: private `main` remains technically unprotected on GitHub Free.
- [x] Define operational rule: normal agent development stops before every `git push`; Owner controls feature-branch publication and merge.
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
- [x] Reconcile `.codex/write-gate.md` so its human-readable contract matches Owner-controlled publication.
- [x] Exact corrected implementation head `60def93d9ca18e0326861406f229b6fe6e587ba3`: Control Plane Contracts run 31 success; CI run 125 success.
- [x] Re-run Critic on exact green implementation head: `APPROVE` (PR comment `5273172490`).

## Phase 6 — Reviewer / Verifier

- [x] Reviewer pass on frozen implementation head: `READY` (PR comment `5273211102`).
- [x] Verifier pass against accepted Issue #11 criteria: `READY` (PR comment `5273216221`).
- [x] Confirm no unresolved PR review threads at assurance time.
- [x] Record accepted residual risk and inspection gaps without claiming protected-main enforcement.

## Phase 7 — Closeout synchronization

- [x] Create `docs/reports/WB-2026-08-12-github-capability-authority-migration-closeout.md`.
- [x] Reconcile active GitHub Issue #11 to the selected Owner-controlled publication model without changing the PR implementation head.
- [x] Closeout-report candidate head `6ad737a0e1351ed6adc042af7469f87dd41659ac`: Control Plane Contracts run 32 success; CI run 126 success.
- [x] Final tasklist sync is coordination-only; PR may be marked Ready for Review only if deterministic checks on the resulting exact head are green.
- [x] Production/VPS/DB/secrets remained untouched by this Work Block.
- [x] Canonical local dirty/staged user state was not reset/cleaned/discarded by this migration path.

## Assurance summary

- [x] Critic final verdict: `APPROVE`.
- [x] Reviewer final verdict: `READY`.
- [x] Verifier final verdict: `READY`.
- [x] Implementation exact-head deterministic checks: green.
- [x] Coordination closeout projection checks: green.
- [x] Closeout report recorded.

## Final gate

- [x] `AZURSYSTECH GITHUB CAPABILITY AUTHORITY MIGRATION VERIFIED` — verified candidate; integration into `main` remains an explicit Owner merge action.
- [ ] Owner merges PR #12.
- [ ] After merge, close Issue #11 and resume `WB-2026-08-12-showcase-production-multizone` under schema v3.

## Accepted residual risk

The Owner accepts that a private repository on GitHub Free does not provide the same technical `main` protection as the public framework ruleset or a paid private-repository protection mode. For the current low-volume project, publication and merge are intentionally retained as manual Owner-controlled steps.

This residual risk is explicit in assurance evidence. Project-local hooks and the Owner-controlled-push workflow are operational guardrails; they are not equivalent to GitHub protected-branch enforcement.

## Non-blocking maintenance note

`.codex/scripts/lifecycle.py` currently defaults the Critic isolation label to `same_context`, while `AGENTS.md` names the comparable tier `same-session-degraded`. Normalize the terminology in a future control-plane maintenance pass; it does not alter current authority or the verified acceptance behavior.
