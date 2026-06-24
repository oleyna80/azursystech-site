# TASKLIST: AZR-004 Facebook / Social Automation

## Metadata

- Status: Phase 1 implementation in progress
- Spec: `docs/specs/AZR-004-facebook-social-automation.md`
- Plan: `docs/plans/AZR-004-facebook-social-automation-implementation-plan.md`
- Phase 1 plan: `docs/plans/AZR-004-admin-phase-1-auth-sql-plan.md`
- Phase 1 task package: `docs/plans/AZR-004-admin-phase-1-implementation-task-package.md`
- MVP only: yes
- n8n in MVP: optional scheduler trigger only; not source of truth
- Current MVP surface: `admin.azursystech.fr`
- Admin placement: `admin/` inside this repository, deployed as a separate app/container/subdomain
- MVP auth: app-level owner password/session auth from the start
- Phase 1 moderation queue: deferred until Messenger/public comments need review workflow
- Deployment pattern: WSL-built GHCR image, VPS `docker compose pull`, `admin` compose profile, nginx host routing for `admin.azursystech.fr`

## Documentation Tasks

- [x] Define architecture placement and module boundaries.
- [x] Define MVP flows.
- [x] Separate future scope from MVP.
- [x] Draft minimal data model.
- [x] Draft API routes.
- [x] Define integration interfaces.
- [x] Define security and compliance guardrails.
- [x] Define acceptance criteria.
- [x] Record 2026-05-11 decisions: env Meta tokens for MVP, `draft -> scheduled -> publishing -> published / failed`, Telegram alerts, n8n trigger-only role.
- [x] Record 2026-05-11 Phase 1 decisions: `admin/` in current repo, app-level owner auth, `moderation_queue` deferred.
- [x] Prepare Phase 1 implementation task package for `admin/` scaffold, owner auth, and SQL schema.

## Implementation Tasks

- [x] Decide admin project placement: `admin/` inside current repo.
- [x] Review and approve Phase 1 implementation task package before Coder stage.
- [x] Create admin scaffold under `admin/`.
- [x] Add owner-only admin auth gate.
- [x] Review and align social SQL schema for the admin project before implementation.
- [ ] Discover existing backend, DB, intake, notification, and Sheets helpers.
- [ ] Decide Messenger storage reuse vs new Messenger tables.
- [x] Add social database migrations.
- [x] Add social repositories.
- [x] Add social domain types and statuses.
- [ ] Add post draft generation use case.
- [x] Add post scheduling use case for Phase 1 admin route contract.
- [x] Add dry-run publish-due use case for protected scheduler route contract.
- [x] Add Meta webhook verification.
- [ ] Add Meta webhook receiver.
- [x] Add Meta signature validation.
- [ ] Add Meta Page publishing client method.
- [ ] Add Messenger send client method.
- [ ] Wire LLM draft generation.
- [ ] Wire Messenger classification/reply draft.
- [ ] Wire intake-core lead upsert for `facebook_messenger`.
- [ ] Wire Telegram alerts for `published` and `failed`.
- [x] Add protected internal scheduler endpoint for optional n8n trigger.
- [ ] Wire Sheets mirror or documented stub.
- [x] Add route-level auth/internal scheduler protection for the new admin routes.
- [x] Add local admin deploy wiring: `Dockerfile.admin`, admin `/health`, registry build script, admin deploy script, compose profile, nginx host routing, and VPS env template.
- [ ] Add idempotency for webhook events.
- [ ] Add idempotency for scheduled publishing.

## Verification Tasks

- [x] Run `git diff --check`.
- [x] Run `cd admin && npm run check:types` after dependency/package-lock gate.
- [x] Run `cd admin && npm run lint` after dependency/package-lock gate.
- [x] Run `cd admin && npm run check:ci` after security patch/deploy wiring gate.
- [x] Run `cd web && npm run check:types` or current equivalent.
- [x] Verify migrations apply in local/test DB.
- [x] Test admin auth gate locally.
- [x] Test admin Docker image build locally.
- [x] Test admin `/health` in local container.
- [x] Test nginx config syntax for admin host routing.
- [x] Test compose config with and without `COMPOSE_PROFILES=admin`.
- [ ] Test webhook challenge verification.
- [ ] Test webhook signature fixture.
- [ ] Test post status transitions.
- [ ] Test publish-due idempotency.
- [ ] Test scheduler trigger auth rejects invalid/missing secret.
- [ ] Test Messenger low-risk auto-reply policy.
- [ ] Test Messenger risky escalation policy.
- [x] Verify no secrets are present in repo diff.
- [x] Verify no n8n-owned business logic or state was introduced.

## Delivery Notes

- 2026-05-11: AZR-004 admin foundation source verification passed for Tasks 1-5. No live DB schema apply, deploy, Meta Graph publishing, Telegram runtime wiring, n8n runtime wiring, commit, or push was performed.
- 2026-05-11: `admin/package-lock.json`, `admin/node_modules/`, `.next/`, and `tsconfig.tsbuildinfo` were already present as untracked artifacts before this closeout; package-lock generation/install was not performed in this stage.
- 2026-05-11: AZR-004 admin foundation committed as `247f65b`, then admin security patch committed as `31252f6`. Next.js high/critical advisories cleared by upgrading admin `next` and `eslint-config-next` to `16.2.6`; residual moderate `postcss` advisory remains deferred because the forced audit fix is not acceptable.
- 2026-05-12: AZR-004 admin deploy wiring committed as `dc95746` after local verification. No Docker push, VPS deploy, live DB apply, production `.env` update, Meta runtime wiring, Telegram runtime wiring, or n8n runtime wiring was performed for this deploy wiring gate.

## Acceptance Criteria Tracking

- [x] AC1: Module boundaries documented.
- [x] AC2: MVP flows documented.
- [x] AC3: Future scope separated.
- [x] AC4: Minimal data model documented.
- [x] AC5: API routes documented.
- [x] AC6: Integration interfaces documented.
- [x] AC7: Security/compliance guardrails documented.
- [x] AC8: No n8n requirement for MVP.
- [x] AC9: No SaaS/multi-tenant complexity.
- [x] AC10: Implementation can start from plan/tasklist.
- [x] AC11: n8n, if used, is limited to protected scheduler trigger.
- [x] AC12: Meta tokens remain in env for MVP and are not committed.
