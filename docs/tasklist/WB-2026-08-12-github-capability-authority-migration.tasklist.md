# Tasklist — WB-2026-08-12 GitHub Capability Authority Migration

Status: EXTERNAL_BOUNDARY_BLOCKED
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

## Phase 2 — External capability boundary

- [x] Keep direct default-branch, force, remote-delete, broad/mirror/prune, destructive, live infra/data, credential, irreversible publish, and client mutations outside normal local agent authority.
- [x] Record that project-local hooks are defense in depth, not the primary security boundary.
- [x] Verify project changes do not introduce production/VPS/DB/secrets into normal agent context.
- [!] External boundary remains incomplete while private `main` is unprotected and the agent runtime may be able to use the Owner's same-user GitHub credential.

## Phase 3 — Deployment workflow

- [x] Confirm production deploy remains manual `workflow_dispatch`.
- [x] Verify immutable SHA/image binding remains intact.
- [x] Verify `include_admin=false` remains default.
- [x] Verify no source push/merge path implicitly deploys production.
- [x] Harden Docker Publish admin default to `publish_admin=false`.

## Phase 4 — GitHub credential / repository mode

- [x] Confirm private repository cannot enable rulesets on current Free plan.
- [x] Define preferred protected-main mode.
- [x] Define Free fallback correctly: no agent-accessible repository-write credential, including Owner SSH/PAT/credential-helper access.
- [ ] Satisfy one external security boundary:
  - [ ] **Preferred:** enable protected `main` on GitHub and then use a least-privilege agent credential with Actions READ only; or
  - [ ] **Fallback:** run the agent in a technically isolated context that cannot access the Owner's repository-write credentials.
- [ ] Negative-test direct protected-main update / unavailable repository write from the normal agent channel.
- [ ] Negative-test deployment workflow dispatch/rerun/cancel from the normal agent channel.

## Assurance

- [x] Core deterministic Control Plane Contracts fixtures pass on implementation head before final evidence edits.
- [x] Main application CI (web/admin/showcase quality) passes on implementation head before final evidence edits.
- [ ] Critic final verdict: blocked pending external capability boundary.
- [ ] Reviewer final verdict.
- [ ] Verifier final verdict with honest hosting/credential classification.
- [ ] Closeout report records canonical local checkout unchanged and production untouched.

## Final gate

- [ ] `AZURSYSTECH GITHUB CAPABILITY AUTHORITY MIGRATION VERIFIED`.
- [ ] Resume `WB-2026-08-12-showcase-production-multizone` under schema v3.

## Current blocker

The code/control-plane migration is substantially complete and CI-green, but the
security goal is not yet closed. Because `azursystech-site` is private and `main`
is currently unprotected, a same-user agent that can reuse the Owner's GitHub SSH
key, PAT, `gh` login, or credential helper would still have repository write
capability. Project-local hooks cannot be used as the primary boundary for this
case.
