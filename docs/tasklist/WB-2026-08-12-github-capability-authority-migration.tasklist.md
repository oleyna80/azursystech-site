# Tasklist — WB-2026-08-12 GitHub Capability Authority Migration

Status: IN_PROGRESS
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
- [ ] Replace active/default Work Block schema v2 with schema v3 `github_capability`.
- [ ] Retire signed authorization from normal path; keep historical records as audit only.
- [ ] Port provider-neutral consequential-operation guard.
- [ ] Port Codex write-set/move/Bash/staged-commit guard.
- [ ] Port Codex lifecycle/doctor/write-gate semantics.
- [ ] Port Claude Work Block + assurance hooks/settings.
- [ ] Reconcile OpenCode Coder local commit / feature push posture without losing AzurSysTech-specific paths.
- [ ] Reconcile installation/evaluation validators.
- [ ] Reconcile AzurSysTech `AGENTS.md` so legacy commit/push Hard Stop text does not contradict schema v3.

## Phase 2 — External capability boundary

- [ ] Keep direct default-branch, force, remote-delete, broad/mirror/prune, destructive, live infra/data, credential, irreversible publish, and client mutations outside normal agent authority.
- [x] Record that project-local hooks are defense in depth, not the primary security boundary.
- [ ] Verify no production/VPS/DB/secrets are introduced into normal agent context.

## Phase 3 — Deployment workflow

- [x] Confirm production deploy is manual `workflow_dispatch` on baseline.
- [ ] Verify immutable SHA/image binding remains intact after migration diff.
- [ ] Verify `include_admin=false` remains default.
- [ ] Verify no source push/merge path implicitly deploys production.

## Phase 4 — GitHub credential / repository mode

- [x] Confirm private repository cannot enable rulesets on current Free plan.
- [x] Define Free fallback: no agent repository Contents-write credential.
- [ ] Owner decision/setup: enable GitHub Pro protection or retain Free fallback.
- [ ] If Pro: protect `main`, require PR/checks, deny force/deletion.
- [ ] If Pro: create least-privilege agent credential with Actions READ only.
- [ ] Negative-test direct protected-main update and deployment workflow dispatch with agent credential.
- [ ] If Free: verify no separate agent Contents-write credential is configured.

## Assurance

- [ ] Core deterministic fixtures/checks pass.
- [ ] Critic: APPROVE with no unresolved BLOCKER/HIGH.
- [ ] Reviewer: READY.
- [ ] Verifier: READY with honest hosting-mode classification.
- [ ] Closeout report records canonical local checkout unchanged and production untouched.

## Final gate

- [ ] `AZURSYSTECH GITHUB CAPABILITY AUTHORITY MIGRATION VERIFIED`.
- [ ] Resume `WB-2026-08-12-showcase-production-multizone` under schema v3.
