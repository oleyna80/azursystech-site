# Progress Log - AzurSysTech

## 2026-03-20: AZR-003-010 Live Activation Completed — site -> n8n -> Google Sheets

### Done

- Live intake path `site -> n8n -> Google Sheets` activated on current shared host:
  - `https://n8n.hardwarelab.org/webhook/azursystech/contact-submit`
- Google Sheets target fixed and connected:
  - `spreadsheetId = 1xS9sF74ICi1DxU1AvPLu0O4FUAuGZ_ia4WSLlMdZGhU`
  - `tabName = intake_leads`
- Shared auth token rotated, production env updated on `n8n` and site runtime, services restarted.
- Live verification completed with 3 direct webhook tests:
  - valid request -> `200 accepted`
  - bad auth -> `401 rejected`
  - duplicate `X-Idempotency-Key` -> `200 accepted` with duplicate-ignore behavior
- Execution evidence confirmed that duplicate flow does not execute `Google Sheets Append Row`.

### Outcome

- `B1`: closed
- `B2`: closed
- `B3`: closed
- `B4`: closed
- `B5`: closed

### Notes

- `AZR-003-010` is treated as done in control-layer tracking.
- Public `/contact` smoke test remains recommended before `AZR-003-007`, but it is not held as a blocker for closing the integration stream.
- Новых архитектурных/процессных решений не принято; `memory_bank/decisions.md` без изменений.

## 2026-03-19: AZR-003-010 SSOT Re-check Pass (control-layer)

### Done

- Выполнена повторная SSOT-проверка для `AZR-003-010` в рамках control-layer pass.
- Обнаружено и исправлено 2 drift-пункта:
  1. `memory_bank/context.md` строка 52: статус `AZR-003-010` исправлен с `todo` на `in_progress` (соответствие с `azr-003-tasklist.md` и последней записью в `progress.md`).
  2. `docs/specs/azr-003-010-site-n8n-google-sheets.md` секция 3: уточнена формулировка для array-полей (`business_needs`, `home_device_type`, `home_need_type`) — добавлено явное разделение между wire-форматом (JSON array) и Google Sheets column encoding (JSON string или comma-separated).

### No Drift Found

- `web/src/app/api/contact/submit/route.ts` — полностью соответствует spec секции 1: env vars, webhook path, headers (`Authorization`, `X-Contract-Version`, `X-Idempotency-Key`), timeout 10s, response schema, fallback behavior.
- `web/src/lib/contact-submit.ts` — payload fields и enums соответствуют spec секции 3 mapping table и transport contract sections 4 ADR-016.
- `tasklist`, `go-live spec`, `decisions.md` — все согласованы между собой по launch sequence и статусам тикетов.

### Notes

- Новых архитектурных/процессных решений не принято; `memory_bank/decisions.md` без изменений.

---

## 2026-03-19: AZR-003-010 Integration Step — Launch Intake Path `site -> n8n -> Google Sheets` (contract + blockers + dry-run)

### Done

- Выполнена SSOT-проверка для `AZR-003-010` в рамках launch scope:
  - `AGENTS.md`
  - `memory_bank/context.md`
  - `memory_bank/progress.md`
  - `memory_bank/decisions.md`
  - `docs/tasklist/azr-003-tasklist.md`
  - `docs/specs/azr-003-go-live-readiness.md`
  - `docs/specs/azr-002-site-n8n-hubspot-contract.md`
  - `web/src/app/api/contact/submit/route.ts`
  - `web/src/lib/contact-submit.ts`
  - `docs/deployment/github-vps.md`
  - `.env.vps.example`
- Зафиксирован отдельный integration artifact:
  - `docs/specs/azr-003-010-site-n8n-google-sheets.md`
  - включает:
    - локальный readiness snapshot site boundary
    - точные требования для `n8n -> Google Sheets`
    - явный mapping `validated payload -> sheet columns`
    - blocker register (`B1-B5`) с owner + next action
    - проверяемый test path (local dry-run + controlled test lead + e2e AC)
    - rollback rule через `AZURSYSTECH_CONTACT_SUBMIT_ENABLED=false`
- Обновлен task artifact:
  - `docs/tasklist/azr-003-tasklist.md`
  - `AZR-003-010` переведен в `in_progress` с delivery notes и явными blockers.

### Doc-to-UI self-check (submit boundary)

- Critical: none
- High: none
- Medium: none
- Low: none

Residual untested/live-risk areas:
- реальная n8n response-schema совместимость (`accepted|temporary_failure|rejected`) не подтверждена в живом workflow;
- 24h idempotency dedupe на стороне n8n не подтвержден test evidence;
- live Google Sheets target provisioning и write credential в n8n остаются внешними зависимостями.

### Validation

- `cd /home/dmitrii/azursystech/web && npm run check:types` - pass
- `cd /home/dmitrii/azursystech/web && npm run build` - pass
- Local dry-run for `/api/contact/submit`:
  - valid payload with unconfigured integration -> `503 integration_not_ready` (pass)
  - honeypot payload -> `200 spam_detected` (pass)
  - enabled integration with unreachable upstream -> `502 submit_failed` (pass)

### Notes

- Scope строго integration-only (`AZR-003-010`), без UI redesign и без CRM/HubSpot enablement.
- Новых архитектурных/процессных решений не принято; `memory_bank/decisions.md` без изменений.

## 2026-03-19: AZR-003-009 Website Closure Pass (About + SEO Service Pages + Legal/Privacy Readiness)

### Done

- Реализован trust/founder route:
  - `web/src/app/about/page.tsx`
- Реализованы 4 Phase 1.5 service routes по `06_seo/service-pages-plan.md`:
  - `web/src/app/services/new-pc-setup/page.tsx`
  - `web/src/app/services/wifi-printer/page.tsx`
  - `web/src/app/services/tpe-setup/page.tsx`
  - `web/src/app/services/onsite-support/page.tsx`
- Добавлен shared шаблон для service landing pages:
  - `web/src/components/service-landing-page.tsx`
- Обновлен `web/src/app/services/page.tsx` с internal links на новые service routes.
- Выполнен safe-readiness pass по legal/privacy без изменения legal identity facts:
  - `web/src/app/legal/page.tsx`
  - `web/src/app/privacy/page.tsx`
  - data-вынесение в `web/src/lib/legal-content.ts` для future real-data injection readiness.
- Обновлен task artifact:
  - `docs/tasklist/azr-003-tasklist.md` — `AZR-003-009` переведен в `done`.

### Validation

- `cd /home/dmitrii/azursystech/web && npm run build` - pass
- В build output подтверждены routes:
  - `/about`
  - `/services/new-pc-setup`
  - `/services/wifi-printer`
  - `/services/tpe-setup`
  - `/services/onsite-support`
  - `/legal`
  - `/privacy`

### Notes

- Scope строго ограничен website layer (`AZR-003-009`), без drift в n8n/Sheets/Telegram/AI runtime/CRM implementation.
- Launch contact model и `/contact` submit flow не изменялись.
- Новых архитектурных/процессных решений не вводилось; `memory_bank/decisions.md` без изменений.

## 2026-03-19: Launch Path Simplified — Website First, Google Sheets via n8n, CRM Deferred

### Done

- По founder/product decision launch sequence был пересобран в более простой порядок:
  - website closure first
  - `site -> n8n -> Google Sheets`
  - AI widget live integration + Telegram notification later
  - CRM moved to phase 2
- Обновлены control-layer документы:
  - `memory_bank/context.md`
  - `memory_bank/decisions.md`
  - `07_ops/task-board.md`
  - `07_ops/launch-checklist.md`
  - `07_ops/kpi-framework.md`
  - `docs/specs/azr-003-go-live-readiness.md`
  - `docs/specs/azr-002-site-n8n-hubspot-contract.md`
  - `docs/tasklist/azr-003-tasklist.md`
- Historical HubSpot mapping retained only as future CRM reference.

### Notes

- Транспортный baseline `site -> n8n` сохранен.
- Full CRM rollout intentionally moved out of current launch scope.

## 2026-03-15: AZR-002-025 HubSpot MVP Property Mapping Locked in SSOT

### Done

- Received CRM stream mapping proposal and performed control-layer review against SSOT.
- Identified and corrected 5 drift points in CRM stream proposal:
  - `service_type` values: replaced CRM-invented values with 9 values from `contact-submit.ts`
  - `urgency` values: replaced `low/medium/high` with `urgent/standard/planning`
  - `lead_source` values: replaced `site_web/telephone/...` with canonical 10 values from `lead-taxonomy.md`
  - `device_count` type: corrected from Number to Dropdown select (string enum)
  - `onsite_required` type: corrected from Checkbox to Dropdown select (3-option enum)
- Locked full mapping in [`docs/specs/azr-002-site-n8n-hubspot-contract.md`](docs/specs/azr-002-site-n8n-hubspot-contract.md) section 7:
  - Contact: 5 standard fields, no custom properties
  - Deal: `dealstage` + 7 custom properties with exact internal names and types
  - Note: structured text format for segment-specific overflow fields
- Recorded decision as ADR-017 in [`memory_bank/decisions.md`](memory_bank/decisions.md).
- Added and closed task `AZR-002-025` in [`docs/tasklist/azr-002-tasklist.md`](docs/tasklist/azr-002-tasklist.md).

### Next

- CRM agent: verify/create exact properties in HubSpot with locked internal names.
- VPS/n8n stream: build workflow against locked mapping + transport contract.

## 2026-03-15: AZR-002-024 Site Runtime Adapter Implemented for Approved v1 Contract

### Done

- Started implementation of the site-side runtime adapter in [`web/src/app/api/contact/submit/route.ts`](web/src/app/api/contact/submit/route.ts):
- Implemented the site-side runtime adapter in [`web/src/app/api/contact/submit/route.ts`](web/src/app/api/contact/submit/route.ts):
  - reads runtime env flags for contact submit integration
  - prepares outbound `POST` JSON request for the approved webhook path
  - sends `Authorization`, `X-Contract-Version`, and `X-Idempotency-Key`
  - keeps `integration_not_ready` when runtime env is not configured
  - treats only upstream `200 {"status":"accepted","request_id":"..."}` as success
- Added required env names to:
  - [`.env.vps.example`](.env.vps.example)
  - [`docs/deployment/github-vps.md`](docs/deployment/github-vps.md)
- Added runtime implementation task in [`docs/tasklist/azr-002-tasklist.md`](docs/tasklist/azr-002-tasklist.md):
  - `AZR-002-024` closed as `done`
- Validation passed:
  - `npm run check:types`
  - `npm run build`

### Next

- Hand the env contract and approved webhook settings to the VPS/n8n stream for configuration against the fixed adapter.

## 2026-03-15: AZR-002-023 Transport Contract Approved as v1 Baseline

### Done

- Approved exact `v1` transport contract for `site -> n8n` in:
  - [`docs/specs/azr-002-site-n8n-hubspot-contract.md`](docs/specs/azr-002-site-n8n-hubspot-contract.md)
- Locked exact values for:
  - endpoint path `/webhook/azursystech/contact-submit`
  - method `POST`
  - `Content-Type: application/json`
  - `Authorization: Bearer <token>`
  - `X-Contract-Version: 1`
  - `X-Idempotency-Key: <uuid-v4>`
  - timeout `10s`
  - retry `0` from website transport layer
  - idempotency dedupe window `24h`
  - response schemas for `accepted`, `temporary_failure`, and `rejected`
  - exposure mode `proxy-protected`
  - exact logging/redaction and no-secret error-payload rules
- Updated [`docs/tasklist/azr-002-tasklist.md`](docs/tasklist/azr-002-tasklist.md):
  - `AZR-002-023` moved from `blocked` to `done` as a transport-baseline approval pass.
- Updated [`web/src/app/api/contact/submit/route.ts`](web/src/app/api/contact/submit/route.ts):
  - comment now reflects that SSOT contract is fixed, while runtime adapter/config is still disabled.

### Notes

- This pass approves transport only, not live enablement.
- HubSpot object/property mapping, pipeline/stage IDs, and secret provisioning remain follow-up items.

## 2026-03-15: AZR-002-023 VPS/n8n Handoff Package Prepared

### Done

- Подготовлен узкий handoff-пакет для VPS/n8n stream:
  - [`docs/reports/AZR-002-023-integrationlead-to-vps-n8n.md`](docs/reports/AZR-002-023-integrationlead-to-vps-n8n.md)
- В handoff зафиксированы:
  - точный scope только для transport boundary `site -> n8n`
  - запрет на production deploy changes и live workflow enablement
  - список exact values, которые VPS/n8n agent обязан вернуть или оставить как `BLOCKER`
  - canonical 5-point return format для control tower

### Notes

- Полный HubSpot property mapping оставлен вне scope этого handoff.
- [`memory_bank/decisions.md`](memory_bank/decisions.md) без изменений.

## 2026-03-15: AZR-002-023 Control-layer Closure Revalidation Applied — Status remains BLOCKED

### Status

- `AZR-002-023` повторно проверен в control-layer closure режиме.
- По явному подтверждению control layer, новых approved значений от Integration Lead / CRM Lead не поступало.
- По gate rule тикет сохранен в состоянии `blocked`; `ready-for-implementation` повторно отклонен.

### What was done

- Обновлен [`docs/specs/azr-002-site-n8n-hubspot-contract.md`](docs/specs/azr-002-site-n8n-hubspot-contract.md):
  - добавлен блок `Closure revalidation pass (control-layer)`;
  - зафиксирован revalidation-триггер и отсутствие новых approved значений;
  - зафиксировано, что все 5 обязательных групп остаются `BLOCKED`;
  - повторно зафиксирована no-silent-assumptions политика по endpoint/auth/retry/mapping/response.
- Обновлен [`docs/tasklist/azr-002-tasklist.md`](docs/tasklist/azr-002-tasklist.md):
  - добавлена запись `Gate rule revalidation (2026-03-15)` для `AZR-002-023`;
  - повторно зафиксировано `ready-for-implementation denied` и сохранение статуса `blocked`.

### Compatibility check

- Совместимость с текущей boundary-реализацией подтверждена повторно:
  - [`web/src/app/api/contact/submit/route.ts`](web/src/app/api/contact/submit/route.ts:33)
  - [`web/src/lib/contact-submit.ts`](web/src/lib/contact-submit.ts:109)
- Критичные launch-safe ограничения не нарушены:
  - HubSpot-only baseline
  - `source = website_form`
  - no fake success
  - no autonomous outbound implications

### Notes

- Новых архитектурных/процессных решений в этом pass не принято.
- [`memory_bank/decisions.md`](memory_bank/decisions.md) без изменений.

## 2026-03-15: AZR-002-023 Final Closure Pass Applied — Gate Enforced, Ticket Remains BLOCKED

### Status

- `AZR-002-023` intentionally remains `blocked` after final control-layer closure pass.
- `ready-for-implementation` explicitly denied by gate rule because all 5 mandatory decision groups still contain critical `BLOCKER` values.
- Closure performed without undocumented assumptions and without fake contract completion.

### What was done

- Updated [`docs/specs/azr-002-site-n8n-hubspot-contract.md`](docs/specs/azr-002-site-n8n-hubspot-contract.md):
  - lifecycle reason tightened to explicit critical `BLOCKER` condition across all groups;
  - added `Final closure decision snapshot` with date, gate decision, and group-by-group `BLOCKED` result;
  - added explicit no-silent-assumptions declaration for endpoint/auth/retry/mapping/response areas.
- Updated [`docs/tasklist/azr-002-tasklist.md`](docs/tasklist/azr-002-tasklist.md):
  - added gate rule check note for 2026-03-15 final closure;
  - explicitly recorded closure outcome as `blocked` with no undocumented assumptions;
  - kept next action bound to gate rule and non-`BLOCKER` requirement for all 5 groups.

### Compatibility check

- Compatibility with current site boundary reconfirmed and unchanged:
  - [`web/src/app/api/contact/submit/route.ts`](web/src/app/api/contact/submit/route.ts:33)
  - [`web/src/lib/contact-submit.ts`](web/src/lib/contact-submit.ts:109)
- Launch-safe constraints remain intact:
  - HubSpot-only baseline
  - `source = website_form`
  - no fake success
  - no autonomous outbound implications

### Notes

- New architecture/process decision was not introduced in this pass.
- [`memory_bank/decisions.md`](memory_bank/decisions.md) unchanged.

## 2026-03-15: AZR-002-023 Control-layer blocker groups revalidated and fixed as formal gate snapshot (still BLOCKED)

### Status

- `AZR-002-023` remains `blocked` after control-layer closure pass.
- Contract lifecycle is explicitly kept out of `ready-for-implementation` because mandatory approved values are still missing across all 5 blocker-groups.
- Gate rule remains enforced without hidden assumptions.

### What was done

- Updated [`docs/specs/azr-002-site-n8n-hubspot-contract.md`](docs/specs/azr-002-site-n8n-hubspot-contract.md) to lock a stricter control-layer snapshot:
  - added final approved snapshot table for all 5 groups;
  - clarified group-by-group state `CLOSED` vs `BLOCKER`;
  - added deterministic boundary rule for when site may return `success`;
  - added hard-constraints compliance check block.
- Updated [`docs/tasklist/azr-002-tasklist.md`](docs/tasklist/azr-002-tasklist.md) for `AZR-002-023`:
  - blocker reason rewritten in 5-group structure;
  - next action aligned to explicit gate enforcement and non-`BLOCKER` requirement for all groups.

### Locked vs unresolved (control-layer)

- Locked and preserved:
  - HubSpot-only launch baseline;
  - `source = website_form`;
  - deterministic no-fake-success boundary rule;
  - no autonomous outbound implications.
- Still unresolved `BLOCKER` areas:
  - Endpoint: final URL/path, method, content-type, required headers, versioning;
  - Auth: signature/auth scheme, exact header names, minimal rotation rule;
  - Timeout/Retry/Idempotency: timeout values, retry behavior, duplicate-prevention rule;
  - Mapping: target HubSpot object, exact property mapping, initial stage/property mapping;
  - Response contract: upstream success/permanent-failure/temporary-failure schemas.

### Compatibility check

- Confirmed compatible with current site boundary:
  - [`web/src/lib/contact-submit.ts`](web/src/lib/contact-submit.ts:109)
  - [`web/src/app/api/contact/submit/route.ts`](web/src/app/api/contact/submit/route.ts:33)
- Launch-safe behavior remains unchanged: no fake success and explicit fallback statuses.

### Notes

- New architectural/process decision was not introduced in this pass.
- [`memory_bank/decisions.md`](memory_bank/decisions.md) unchanged.

## 2026-03-15: AZR-002-023 Blocker Closure Pass Completed — Decision Checklist Formalized (Still BLOCKED)

### Status

- Stream status remains: `blocked`.
- `docs/specs/azr-002-site-n8n-hubspot-contract.md` updated from generic blocker snapshot to explicit 5-group Decision Checklist required by control layer.
- `ready-for-implementation` was not granted, because unresolved mandatory values remain across endpoint/auth/retry-mapping/response groups.

### What was locked vs blocked

- Locked and preserved:
  - HubSpot-only launch baseline
  - `source = website_form`
  - no-fake-success boundary rule
  - safe provisional compatibility with current submit boundary
- Still `BLOCKER` (formalized with owner + next action):
  - endpoint final URL/method/content-type/headers/versioning
  - auth/signature/header naming + minimal rotation rule
  - timeout/retry/idempotency
  - `site -> n8n -> HubSpot` object/property/stage mapping
  - upstream `n8n -> site` response schemas and deterministic success criterion details

### Artifacts updated

- `docs/specs/azr-002-site-n8n-hubspot-contract.md`
- `docs/tasklist/azr-002-tasklist.md`

### Compatibility check

- Confirmed compatible with current site boundary:
  - [`web/src/lib/contact-submit.ts`](web/src/lib/contact-submit.ts:109)
  - [`web/src/app/api/contact/submit/route.ts`](web/src/app/api/contact/submit/route.ts:33)
- Contract remains launch-safe without introducing undocumented integration assumptions.

### Notes

- New architecture/process decision was not introduced in this pass.
- `memory_bank/decisions.md` unchanged.

## 2026-03-15: AZR-002-023 Integration Contract Stream Marked BLOCKED — site -> n8n -> HubSpot

### Status

- Stream status: `blocked`.
- Артефакт `docs/specs/azr-002-site-n8n-hubspot-contract.md` подтвержден как provisional baseline и blocker register.
- Финальный контракт `site -> n8n -> HubSpot` не зафиксирован как implementation-ready.

### Blocker-level gaps

- final live endpoint details
- auth/signature contract
- timeout/retry/idempotency policy
- final `site -> n8n -> HubSpot` property mapping
- success-response schema for site boundary

### Guardrail

- `production-adapter` stream НЕ должен стартовать до закрытия всех blocker-level gaps и перевода контракта в `ready-for-implementation`.

### Validation

- Выполнена SSOT-сверка против:
  - `AGENTS.md`
  - `memory_bank/context.md`
  - `memory_bank/decisions.md`
  - `memory_bank/progress.md`
  - `02_website/forms-spec.md`
  - `03_leads/lead-intake-spec.md`
  - `03_leads/lead-taxonomy.md`
  - `03_leads/crm-pipeline.md`
  - `07_ops/task-board.md`
  - `07_ops/launch-checklist.md`
  - `web/src/app/api/contact/submit/route.ts`
  - `web/src/lib/contact-submit.ts`
  - `web/src/app/contact/page.tsx`

### Notes

- Scope строго контрактный: без UI/page правок и без runtime/infra изменений.
- Новых архитектурных решений не вводилось; `memory_bank/decisions.md` не изменялся.

## 2026-03-15: AZR-002 Integration Contract Stream Bound To Current Ticket

### Done

- Новый integration-contract stream не выделялся в отдельный ticket family и не переносился в `AZR-003`.
- Контрактный stream явно привязан к текущему `AZR-002` как следующий SSOT шаг после accepted safe submit boundary.
- Добавлен отдельный spec artifact:
  - `docs/specs/azr-002-site-n8n-hubspot-contract.md`
- В текущий `docs/tasklist/azr-002-tasklist.md` добавлена отдельная задача:
  - `AZR-002-023: Lock final integration contract for site -> n8n -> HubSpot`

### Notes

- Это только SSOT/task structuring step.
- Реализация production adapter, live endpoint config и end-to-end delivery не входили в этот шаг.
- Новых архитектурных/процессных решений не вводилось; `memory_bank/decisions.md` не изменялся.

## 2026-03-15: AZR-002-022 Follow-up Fix — External-Contract Drift in Contact Submit Boundary

### Done

- Выполнен узкий follow-up фикс в [`web/src/app/api/contact/submit/route.ts`](web/src/app/api/contact/submit/route.ts:1):
  - удалены hard-coded допущения внешнего контракта (`AZURSYSTECH_CONTACT_SUBMIT_URL`, `AZURSYSTECH_CONTACT_SUBMIT_TOKEN`, `Authorization: Bearer ...`);
  - сохранен server-side validation + payload assembly path через [`validateAndBuildContactPayload()`](web/src/lib/contact-submit.ts:109);
  - оставлена нейтральная provisional integration boundary без invent финального webhook/auth/property контракта до фиксации в SSOT;
  - при неготовом внешнем контракте API честно возвращает `integration_not_ready` с fallback message.
- Подтверждено, что redirect в [`/thank-you`](web/src/app/thank-you/page.tsx:1) остается только при `success` в [`handleSubmit()`](web/src/app/contact/page.tsx:37).
- Подтверждено, что fallback UX в [`/contact`](web/src/app/contact/page.tsx:1) сохраняется для `integration_not_ready` / `submit_failed` / `spam_detected`.

### Validation

- `cd /home/dmitrii/azursystech/web && npm run build` - pass
- Минимальная локальная проверка submit-path без live внешнего контракта:
  - POST в [`/api/contact/submit`](web/src/app/api/contact/submit/route.ts:33) с валидным payload;
  - результат: `HTTP 503` + `{"status":"integration_not_ready", ...}`.

### Notes

- Scope ограничен только drift follow-up (`needs_changes`) без broad rewrite.
- [`web/src/lib/contact-submit.ts`](web/src/lib/contact-submit.ts:1) не менялся: form contract и payload поля сохранены.
- Analytics/runtime/autonomous логика не добавлялась.
- Новых архитектурных/процессных решений не вводилось; [`memory_bank/decisions.md`](memory_bank/decisions.md:1) не изменялся.

## 2026-03-15: AZR-002-021 Safe Site-side Submit Path for `/contact`

### Done

- Убран fake-submit stub и внедрён реальный site-side submit flow для формы на [`/contact`](web/src/app/contact/page.tsx):
  - клиент отправляет [`FormData`](web/src/app/contact/page.tsx:45) в API-слой [`/api/contact/submit`](web/src/app/api/contact/submit/route.ts:1)
  - переход на [`/thank-you`](web/src/app/thank-you/page.tsx:1) происходит только при реальном статусе `success`
  - при `validation_error`, `integration_not_ready`, `submit_failed`, `spam_detected` показывается честное сообщение без fake-success
- Добавлен server-side submit handling в [`web/src/app/api/contact/submit/route.ts`](web/src/app/api/contact/submit/route.ts:1):
  - чтение данных формы
  - server-side валидация контракта
  - honeypot anti-spam branch
  - explicit integration boundary (без выдумывания внешнего endpoint contract)
- Добавлен контрактный сбор payload в [`web/src/lib/contact-submit.ts`](web/src/lib/contact-submit.ts:1):
  - сохранены только документированные поля формы
  - сохранены сегменты `particulier` / `tpe`
  - сохранены baseline-поля `source = website_form` и default `status = New`
  - условные блоки TPE/Home включаются в payload только по релевантному сегменту

### Doc-to-UI Review Findings (azursystech-doc-to-ui-review)

- Critical: none
- High: none
- Medium: none
- Low: none

Residual risks / untested areas:
- live интеграция `site -> n8n -> HubSpot` остаётся неготовой, потому что в SSOT не зафиксирован финальный webhook/auth/property contract;
- текущая реализация корректно возвращает `integration_not_ready` и честный fallback вместо фиктивной доставки.

### Validation

- `cd /home/dmitrii/azursystech/web && npm run build` - pass
- Минимальная локальная проверка безопасного поведения без live внешней доставки (локально поднят `next start` на `:3100`, затем POST в API):
  - validation branch: `400 validation_error` (обязательные поля)
  - unconfigured boundary: `503 integration_not_ready`
  - honeypot branch: `200 spam_detected`

### Notes

- Scope ограничен `AZR-002-021`: submit-path для [`/contact`](web/src/app/contact/page.tsx) + server-side boundary + обязательные task/progress updates.
- Analytics wiring, full chat integration, final HubSpot property contract и внешняя orchestration-схема не добавлялись.
- Новых архитектурных/процессных решений не вводилось; [`memory_bank/decisions.md`](memory_bank/decisions.md) не изменялся.

## 2026-03-15: AZR-002-020 Thank-you Route Implemented

### Done

- Реализован route `/thank-you` как безопасная post-submit handoff page:
  - добавлен [`web/src/app/thank-you/page.tsx`](web/src/app/thank-you/page.tsx)
- Структура страницы выровнена с implementation-map и user scope:
  - confirmation hero / success message
  - короткий блок «что дальше»
  - fallback contact methods block
  - безопасная optional note для срочного кейса (без обещаний времени)
  - CTA block на ключевые маршруты
- Явно сохранены fallback-каналы в UI:
  - [`/contact`](web/src/app/contact/page.tsx)
  - phone `+33 7 49 70 54 65`
  - WhatsApp `+33 7 49 70 54 65`
  - email `contact@azursystech.fr`
- Публичный copy сделан Russian-first, calm/reassuring/practical, без:
  - AI-autonomy wording
  - обещаний цены
  - обещаний сроков выезда
  - internal/dev wording
- Обновлен task artifact:
  - [`docs/tasklist/azr-002-tasklist.md`](docs/tasklist/azr-002-tasklist.md) добавлена и закрыта задача `AZR-002-020`.

### Doc-to-UI Review Findings (azursystech-doc-to-ui-review)

- Critical: none
- High: none
- Medium: none
- Low: none

### Visual Review Findings (azursystech-visual-review)

- High: none
- Medium: none
- Low: none

### Validation

- `cd /home/dmitrii/azursystech/web && npm run build` - pass
- В build output присутствует route `/thank-you`.

### Notes

- Scope ограничен только реализацией [`web/src/app/thank-you/page.tsx`](web/src/app/thank-you/page.tsx) и обязательными task/progress updates.
- Backend/runtime/integration/analytics не изменялись.
- Новых архитектурных/процессных решений не вводилось; [`memory_bank/decisions.md`](memory_bank/decisions.md) не изменялся.

## 2026-03-14: AZR-002-019 Post-review Micro-fixes Closed

### Done

- Закрыт узкий fix-pass после visual consistency review без broad rewrite.
- В `web/src/app/page.tsx` убран internal/dev wording в user-facing заголовке short-form блока:
  - `Короткая заявка (launch)` -> `Короткая заявка`.
- В `web/src/app/home/page.tsx` убран route-path token из FAQ:
  - `... отдельная страница /business` -> `... отдельный раздел «Для бизнеса»`.
- В `web/src/app/home/page.tsx` выровнен container rhythm по общему baseline:
  - `max-w-5xl` -> `max-w-6xl`.

### Validation

- `cd /home/dmitrii/azursystech/web && npm run build` - pass

### Notes

- Scope ограничен только 3 согласованными правками + обязательные task/progress updates.
- Структура секций, conversion logic, safe-launch chat contract, backend/runtime/analytics не изменялись.
- Новых архитектурных/процессных решений не вводилось; `memory_bank/decisions.md` не изменялся.

## 2026-03-14: AZR-002-018 Focused Visual Consistency Pass (Local Professional)

### Done

- Выполнен focused visual consistency pass в заданном scope:
  - shared shell
  - `/`
  - `/services`
  - `/business`
  - `/home`
  - `/pricing`
  - `/faq`
  - `/contact`
  - chat widget shell
- Визуальный контур выровнен под baseline `Local Professional`:
  - теплый фон / surface / border в палитре ADR-015
  - единая иерархия заголовков (serif для section heading)
  - единая иерархия CTA (teal primary, restrained secondary, terracotta WhatsApp)
  - более ровный card/container rhythm между страницами.
- Shell consistency доведена точечно:
  - updated `web/src/components/shell/site-header.tsx`
  - updated `web/src/components/shell/site-footer.tsx`
  - footer heading `Legal` -> `Правовое` для публичного RU-интерфейса.
- Homepage и contact route приведены к общему визуальному контракту без изменения content/route contracts:
  - updated `web/src/app/page.tsx`
  - updated `web/src/app/contact/page.tsx`.
- Chat widget оставлен launch-safe и secondary, дополнительно снижена навязчивость overlay:
  - compact minimized trigger
  - softer shadow
  - немного выше позиционирование на `/contact`, чтобы снизить риск конфликта с нижними CTA.

### Doc-to-UI Review Findings (azursystech-doc-to-ui-review)

- Critical: none
- High: none
- Medium: none
- Low:
  - В рамках этого pass остались визуально более «старые» legal/privacy страницы, но они вне текущего scope пользователя.

### Validation

- `cd /home/dmitrii/azursystech/web && npm run build` - pass

### Notes

- Scope intentionally limited to visual consistency only; без backend/runtime/integration/analytics работ.
- Route contracts и conversion logic не расширялись.
- `memory_bank/decisions.md` не изменялся (новых architectural/process decisions не добавлялось).

## 2026-03-14: AZR-002-015 MVP Chat Widget Shell Implemented

### Done

- Implemented reusable sitewide chat widget shell in [`web/src/components/chat-widget-shell.tsx`](web/src/components/chat-widget-shell.tsx).
- Mounted widget through shared app layout in [`web/src/app/layout.tsx`](web/src/app/layout.tsx).
- Added required MVP shell states inside widget UI:
  - minimized
  - opened
  - qualification/intake intro
  - contact handoff entry
  - safe fallback / next-step messaging
- Kept launch-safe constraints explicit in public copy:
  - intake-only role
  - no autonomous outbound behavior
  - no pricing/time commitments
  - no fake runtime behavior
- Preserved clear fallback paths in-widget and unchanged across site:
  - `/contact`
  - phone
  - WhatsApp
  - email
- Added legal/privacy processing note in widget handoff stage with links to [`/legal`](web/src/app/legal/page.tsx) and [`/privacy`](web/src/app/privacy/page.tsx).
- Applied non-intrusive placement for mobile/desktop and excluded widget from legal/privacy routes to avoid overlay on legal reading pages.
- Ran self-check using `azursystech-doc-to-ui-review` guidance:
  - no Critical / High / Medium doc-to-UI drift findings remained after final copy/UX adjustments.

### Validation

- `cd /home/dmitrii/azursystech/web && npm run build` - pass

### Notes

- Scope limited to `AZR-002-015` only.
- No backend logic, analytics wiring, or AI runtime behavior added.
- No new architectural/process decision introduced; [`memory_bank/decisions.md`](memory_bank/decisions.md) not changed.

## 2026-03-14: MVP Visual Direction Confirmed

### Done

- Approved the MVP visual direction as `Local Professional`.
- Added implementation-facing visual contract:
  - `docs/plans/azr-002-visual-direction.md`
- Updated brand baseline in `01_brand/brand-pack.md` with:
  - approved palette
  - typography direction
  - image/no-go guidance
- Recorded the design decision in `memory_bank/decisions.md` as `ADR-015`.
- Updated `memory_bank/context.md` and `docs/tasklist/azr-002-tasklist.md` so the next frontend stream can work against a stable visual baseline.

### Next

- Keep `/services`, `/business`, `/home`, and any visual cleanup passes aligned with the approved `Local Professional` design contract.

## 2026-03-14: Chat Widget Added to AZR-002 Implementation Queue

### Done

- Added explicit MVP task for chat widget implementation:
  - `AZR-002-015: Implement MVP chat widget shell and safe launch entry`
- Fixed the chat/AI assistant as an explicit part of the launch contact model:
  - secondary conversion layer
  - intake-only
  - must not replace `/contact`, phone, WhatsApp, or email
- Current continuity context updated so future sessions do not lose the chat scope.

### Next

- Keep the chat widget as a separate implementation stream after core route work, with launch-safe copy and future `site -> n8n -> HubSpot` compatibility.

## 2026-03-12: AI Runtime Scaffold

### Done

- Добавлен CLI runtime: `scripts/ai_agents.py`.
- Добавлены агенты и реестр: `05_ai/agents/registry.json`.
- Добавлены prompt templates и example payloads.
- Добавлены run artifacts pipeline + approval note generation.
- Заполнены документы в `05_ai/*`.

### Validation

- `python3 -m py_compile scripts/ai_agents.py` - pass
- `./scripts/ai_agents.py list` - pass
- `./scripts/ai_agents.py run ... --dry-run` - pass

## 2026-03-12: Agent Ops Bootstrap

### Done

- Добавлен `AGENTS.md` для проекта.
- Добавлена структура `.agent/`:
  - roles (`ROSTER.md`)
  - workflow (`workflows/sdd-protocol.md`)
  - rules (`rules/*`)
  - skills (`skills/*`)
- Инициализирован `memory_bank/`.
- Добавлены templates в `docs/specs|plans|tasklist|reports|sdd_templates`.

### Next

- Определить первый активный тикет для content/leads и перейти в execution.

## 2026-03-12: AZR-001 Handoff Package Created

### Done

- Зафиксирован активный рабочий контур для `AZR-001`:
  - `docs/specs/AZR-001-facebook-page-copy.md`
  - `docs/plans/AZR-001-facebook-page-copy-plan.md`
  - `docs/tasklist/AZR-001.tasklist.md`
  - `docs/reports/AZR-001-techlead-to-coder.md`
- Подготовлен реальный handoff `Tech Lead -> Coder` с SLA и AC.

### Next

- Выполнить перепись `01_brand/facebook-page-copy.md` в FR-first формате.
- Передать на review через handoff `Coder -> Reviewer`.

## 2026-03-12: Website Infra Bootstrap (VPS Chain)

### Done

- Добавлен production-ready web runtime в `web/`:
  - `next.config.ts` с `output: "standalone"`
  - `src/app/health/route.ts` (`GET /health`)
  - базовая стартовая страница и metadata
- Добавлен infra-контур в корне проекта:
  - `Dockerfile`
  - `docker-compose.yml`
  - `docker-compose.vps.yml`
  - `nginx.proxy.conf`
  - `.env.vps.example`
  - `deploy.sh`
  - `scripts/backup-env.sh`
- Добавлены GitHub workflows:
  - `.github/workflows/ci.yml`
  - `.github/workflows/docker-publish.yml`
  - `.github/workflows/deploy-vps.yml`
  - `.github/workflows/uptime-monitor.yml`
- Добавлены runbooks:
  - `docs/deployment/github-vps.md`
  - `docs/deployment/backup-restore-runbook.md`
- Удален случайно созданный вложенный git-репозиторий `web/.git`.

### Next

- Прописать реальные значения secrets/vars в GitHub.
- Скопировать runtime файлы на VPS и выполнить first deploy immutable tag `sha-*`.

## 2026-03-13: Facebook Group Outreach Spec Hardening

### Done

- Обновлен `04_facebook/groups-outreach-list.md`:
  - добавлены секции `SSOT tracking location`, `Field schema for tracking sheet`, `Concrete first 10 groups`, `Source mapping table`, `UTM convention`;
  - удалены конфликтующие source tags вида `facebook_group_*` из source-слоя, оставлены только как classification tags.
- Обновлен `03_leads/lead-intake-spec.md`:
  - `messenger` заменен на `facebook_messenger`;
  - source list расширен до SSOT-набора.
- Обновлен `02_website/analytics-spec.md`:
  - source buckets синхронизированы с `03_leads/lead-taxonomy.md`;
  - UTM examples выровнены с протоколом `[topic]`.

### Validation

- Выполнен repo-wide grep по source-tagам и конфликтным legacy-тегам.
- Конфликтующие теги `facebook_group_local|...` в source-контексте удалены.

## 2026-03-13: Approval Workflow Doc Fixes

### Done

- Исправлена Markdown-разметка в `05_ai/approval-workflow.md`:
  - починен сломанный code fence в секции workflow;
  - удален лишний завершающий fence в конце файла.
- Убрано расхождение с `AGENTS.md` по логированию:
  - в MVP note зафиксированы structured run artifacts в `05_ai/runs/` вместо internal markdown log.

### Validation

- Проверены все code fences через `rg`.
- Проверен хвост документа и секция `Auditability and logging`.

## 2026-03-13: Escalation Rules + Lead Agent Contract Alignment

### Done

- Исправлена Markdown-разметка в `05_ai/escalation-rules.md`:
  - починен code fence в секции escalation output example;
  - удален лишний завершающий fence в конце файла.
- Выровнен контракт escalation note:
  - `lead_segment` заменен на `lead_type` в соответствии с `05_ai/lead-agent-spec.md`.
- Расширен output contract в `05_ai/lead-agent-spec.md`:
  - добавлены `escalation_level`, `escalation_category`, `risk_reason`, `suggested_human_action`;
  - зафиксировано правило `null` для неэскалированных кейсов.

### Validation

- Проверены все code fences через `rg`.
- Перепроверены секции output contract и escalation example на совпадение полей.

## 2026-03-13: Content Engine Spec Doc Fixes

### Done

- Исправлена Markdown-разметка в `05_ai/content-engine-spec.md`:
  - починен code fence в секции content generation workflow.
- Обновлена секция `Next file to create`:
  - удалена устаревшая ссылка на уже существующий `lead-agent-spec.md`;
  - next step приведен к текущему состоянию блока `05_ai`.

### Validation

- Проверены code fences через `rg`.
- Проверен хвост документа и секция `Next file to create`.

## 2026-03-13: Lead Agent Spec Fixes and Prompt Alignment

### Done

- Исправлена Markdown-разметка в `05_ai/lead-agent-spec.md`:
  - удален лишний открывающий fence в начале файла;
  - починен code fence в CRM handoff example;
  - удалены лишние fences в конце файла.
- Уточнен контракт слоев данных в `05_ai/lead-agent-spec.md`:
  - разделены runtime fields и CRM handoff fields;
  - добавлено явное mapping rule `lead_type -> lead_segment`;
  - запрещены несуществующие `unknown_*` теги вне taxonomy.
- Выровнен prompt contract в `05_ai/prompts/lead_router_system.md`:
  - добавлены `escalation_level`, `escalation_category`, `risk_reason`, `suggested_human_action`;
  - зафиксировано правило `null` для неэскалированных кейсов.

### Validation

- Проверены code fences через `rg`.
- Перепроверены секции taxonomy mapping, CRM handoff example и output format в prompt template.

## 2026-03-13: Content Prompt Library Sanity Fix

### Done

- Обновлен `05_ai/prompt-library-content.md`:
  - в master prompt добавлено явное правило `draft until human approval`;
  - секция `Next file to create` приведена к текущему состоянию блока `05_ai` и больше не ссылается на уже существующий `prompt-library-support.md`.

### Validation

- Проверен хвост документа.
- Проверено наличие approval guardrail и отсутствие stale next-step ссылки.

## 2026-03-13: Support Prompt Library Contract Alignment

### Done

- Обновлен `05_ai/prompt-library-support.md`:
  - в master support prompt добавлено правило `draft until human approval`;
  - выходы support prompts выровнены с `05_ai/lead-agent-spec.md` и `05_ai/escalation-rules.md`;
  - `needs_escalation` заменен на `escalation_required`;
  - `recommended_human_action` заменен на `suggested_human_action`;
  - `fit_level` заменен на taxonomy-aligned `lead_quality`;
  - `later` в follow-up stages заменен на `follow_up_later`;
  - founder handoff package расширен escalation fields.

### Validation

- Проверен хвост документа.
- Выполнен grep по ключевым contract fields и status names.

## 2026-03-13: AI Runtime Contract Enforcement

### Done

- Обновлен `scripts/ai_agents.py`:
  - добавлен structured output parser/validator для schema-bound agents;
  - `lead_router` теперь может сохранять `parsed_output` в run artifact;
  - escalation status теперь берется из model-declared field `escalation_required`, а keyword fallback используется только для агентов без structured schema;
  - добавлена cross-field validation для escalation details.
- Обновлен `05_ai/agents/registry.json`:
  - добавлена `structured_output` schema для `lead_router`;
  - расширены `context_files` для `lead_router` и `content_writer` актуальными `05_ai` specs;
  - runtime-context теперь ближе к реальным contracts.
- Обновлен `05_ai/examples/lead_router_input.json`:
  - `source` заменен на SSOT-aligned `facebook_messenger`.
- Обновлен `05_ai/README.md`:
  - runtime behavior синхронизирован с новой structured validation logic.

### Validation

- `python3 -m py_compile scripts/ai_agents.py` - pass
- `./scripts/ai_agents.py run --agent lead_router --input-file 05_ai/examples/lead_router_input.json --dry-run` - pass
- `./scripts/ai_agents.py run --agent content_writer --input-file 05_ai/examples/content_writer_input.json --dry-run` - pass
- parser smoke test for valid and invalid `lead_router` structured output - pass

## 2026-03-13: DeepSeek Provider Switch for AI Runtime

### Done

- Обновлен `scripts/ai_agents.py`:
  - runtime переведен с OpenAI Responses API на DeepSeek Chat Completions API;
  - `OPENAI_API_KEY` заменен на `DEEPSEEK_API_KEY`;
  - `OPENAI_BASE_URL` заменен на `DEEPSEEK_BASE_URL`;
  - default model заменена на `deepseek-chat`;
  - extraction logic адаптирована под `choices[].message.content`.
- Обновлен `05_ai/agents/registry.json`:
  - default model для `lead_router` и `content_writer` заменена на `deepseek-chat`.
- Обновлены runtime docs:
  - `README.md`
  - `05_ai/README.md`
  - `AGENTS.md`
  - `.env.vps.example`

### Validation

- `python3 -m py_compile scripts/ai_agents.py` - pass
- `./scripts/ai_agents.py run --agent lead_router --input-file 05_ai/examples/lead_router_input.json --dry-run` - pass
- `./scripts/ai_agents.py run --agent content_writer --input-file 05_ai/examples/content_writer_input.json --dry-run` - pass

## 2026-03-13: Reviews System Doc Repair

### Done

- Исправлен `06_seo/reviews-system.md`:
  - удален лишний открывающий code fence в начале файла;
  - починен code fence в секции `Review request workflow`;
  - удалены лишние пустые fences в конце файла.
- Добавлен operational contract в секцию tracking:
  - зафиксирован SSOT для review tracking (`CRM` after `won`, `Google Sheet` as fallback);
  - добавлен mapping review statuses к CRM/follow-up действиям;
  - добавлено правило немедленного обновления статуса после review touchpoint.
- Обновлен устаревший `Next file to create`:
  - вместо уже существующего `service-pages-plan.md` указан новый логичный следующий артефакт `local-citations-plan.md`.

### Validation

- `rg -n '^```|^````' 06_seo/reviews-system.md` - pass
- проверен хвост файла и секция tracking/status mapping - pass

## 2026-03-13: Deploy Baseline Simplified to Build on VPS

### Done

- Обновлен `docker-compose.vps.yml`:
  - `app` теперь собирается из локального `Dockerfile` на VPS;
  - runtime больше не требует `IMAGE_REPO` и `IMAGE_TAG`.
- Обновлен `.github/workflows/deploy-vps.yml`:
  - trigger переведен на успешный `CI`, а не на `Docker Publish`;
  - deploy выполняет `git pull --ff-only origin main` на VPS;
  - runtime поднимается через `docker compose up -d --build --remove-orphans`.
- Обновлен `.github/workflows/docker-publish.yml`:
  - automatic trigger removed;
  - GHCR publish path оставлен только как manual fallback.
- Обновлен runbook `docs/deployment/github-vps.md` под source-based deploy без `GHCR_*`.
- Зафиксировано архитектурное решение `ADR-009`.

### Validation

- `docker compose -f docker-compose.vps.yml config` - pass
- workflow YAML checked via local readback - pass

## 2026-03-13: Next.js Container Healthcheck Fix

### Done

- Обновлен `Dockerfile`:
  - runtime теперь явно задает `HOSTNAME=0.0.0.0` для standalone Next.js.
- Обновлен `docker-compose.vps.yml`:
  - app environment дополнен `HOSTNAME=0.0.0.0`;
  - healthcheck больше не бьет в `127.0.0.1`, а использует фактический container IP.
- Обновлен `docker-compose.yml` для локального parity.
- Обновлены `.env.vps.example` и `docs/deployment/github-vps.md`.

### Validation

- локальный `docker run` smoke test showed `/health` = `200`
- container listen socket inspected: app was binding to container IP, not loopback

## 2026-03-13: Deploy Assumptions Doc Alignment

### Done

- Обновлен `docs/deployment/github-vps.md`:
  - verify command для `azursystech-app` выровнен с фактическим healthcheck behavior;
  - явно добавлена launch SSL / edge path схема: `Cloudflare -> Nginx Proxy Manager -> azursystech-web`.

### Validation

- live checks already confirmed `https://azursystech.fr/health` = `200`

## 2026-03-13: AZR-002 Website Implementation Map Added

### Done

- Добавлен `docs/plans/azr-002-implementation-map.md`.
- Зафиксированы:
  - MVP route map;
  - page-to-section mapping;
  - component inventory;
  - component-to-doc mapping;
  - recommended build order.

### Validation

- implementation map cross-checked against:
  - `02_website/site-architecture.md`
  - `02_website/wireframes.md`
  - `02_website/forms-spec.md`
  - `docs/specs/azr-002-implementation-handoff.md`

## 2026-03-13: RooCode Skills Added

### Done

- Добавлены рабочие skills в `.roo/skills/`:
  - `azursystech-page-implementation`
  - `azursystech-form-contract`
  - `azursystech-doc-to-ui-review`
  - `azursystech-safe-ai-runtime`
- Для page/form skills добавлены reference files с route map, component map и field contract.
- Skills ориентированы на пару `Tech Lead -> RooCode` и на предотвращение drift между docs и implementation.

### Validation

- checked skill folder structure under `.roo/skills`
- reread all created `SKILL.md` files after patch

## 2026-03-13: Safe Launch AI Policy Added to Runtime Config

### Done

- Обновлен `scripts/ai_agents.py`:
  - добавлена загрузка и валидация runtime policy из env;
  - launch mode и safety flags теперь попадают в prompt payload;
  - runtime policy сохраняется в run artifacts.
- Обновлен `05_ai/prompts/lead_router_system.md`:
  - добавлены explicit runtime guardrails для `limited_live_intake`.
- Обновлены:
  - `.env.vps.example`
  - `docs/deployment/github-vps.md`
  - `05_ai/README.md`
- Зафиксировано архитектурное решение `ADR-010`.

### Validation

- runtime policy defaults reviewed against AZR-003 launch rules

## 2026-03-13: Reviews System Tail Formatting Fix

### Done

- Повторно проверен `06_seo/reviews-system.md`.
- Исправлены только форматные ошибки в хвосте файла:
  - `## 330` -> `## 30`
  - имя следующего файла оформлено как inline code
  - пункты под `It must define:` возвращены в markdown list

### Validation

- проверен хвост файла через `tail` и `nl`

## 2026-03-13: Management Docs Refresh

### Done

- Обновлены stale управляющие документы:
  - `docs/implementation-readiness.md`
  - `docs/content-status.md`
  - `07_ops/task-board.md`
  - `docs/backlog.md`
  - `docs/.active_ticket`
  - `docs/decisions-log.md`
  - `docs/project-notes.md`
- Зафиксирован переход проекта из bootstrap в `implementation phase`.
- Активный тикет переключен на `AZR-002`.
- В management layer зафиксированы реальные launch blockers:
  - legal/business placeholders
  - phone / WhatsApp / contact flow
  - deploy secrets / `.env`
  - решение по AI live-run на старте

### Validation

- выполнен project audit по `.md` inventory
- проверены stale readiness/status/task pointers
- подтвержден рабочий статус AI CLI через `python3 -m py_compile` и `./scripts/ai_agents.py list`

## 2026-03-13: AZR-002 Implementation Handoff Package

### Done

- Добавлен handoff package для `AZR-002`:
  - `docs/specs/azr-002-implementation-handoff.md`
  - `docs/plans/azr-002-build-plan.md`
  - `docs/tasklist/azr-002-tasklist.md`
- В `AZR-002` зафиксированы:
  - locked MVP baseline
  - source-of-truth rule set
  - first implementation queue
  - out-of-scope boundaries
  - launch blockers
  - open decisions
- Build plan разложен по фазам:
  - website shell + core pages
  - form + CRM/Sheets
  - chat widget + AI intake
  - Facebook/GBP linkage
  - deploy + runtime hardening

### Validation

- handoff package сверён с существующим форматом `AZR-001`
- tasklist создан с owner / priority / dependency / acceptance criteria / status

## 2026-03-13: AZR-003 Go-Live Readiness Package

### Done

- Добавлен go-live package для `AZR-003`:
  - `docs/specs/azr-003-go-live-readiness.md`
  - `docs/plans/azr-003-go-live-plan.md`
  - `docs/tasklist/azr-003-tasklist.md`
- В `AZR-003` жестко разделены:
  - launch blockers
  - `cannot launch until`
  - post-launch deferred items
- Пакет разложен по этапам:
  - legal readiness
  - contact readiness
  - deployment readiness
  - AI runtime readiness
  - GBP / review / local presence readiness
  - go / no-go review

### Validation

- структура пакета выровнена с `AZR-002`
- tasklist создан с owner per blocker, priority, dependency, AC, status

## 2026-03-13: AZR-003 Priority and Launch Defaults Alignment

### Done

- В `AZR-003` зафиксирован recommended execution order:
  - legal baseline
  - contact baseline
  - deploy baseline
  - AI baseline decision
- Добавлены recommended launch defaults:
  - `form + site chat only`, если phone / WhatsApp еще не готовы
  - AI launch mode по умолчанию ограничен `intake + summary + handoff`
  - без autonomous outbound sending
  - без pricing commitments
  - без scheduling promises
- Обновлен `AZR-003` tasklist под фактическую первую очередь исполнения.

### Validation

- spec / plan / tasklist повторно сверены на непротиворечивость порядка и launch-mode guardrails

## 2026-03-13: AZR-003 Legal Baseline Partially Filled

### Done

- В `02_website/legal-pages.md` подставлены подтвержденные owner/business fields:
  - `OLEINIK DMITRII`
  - `Entrepreneur individuel - micro-entrepreneur`
  - `SIREN 940 870 140`
  - `SIRET 940 870 140 00016`
  - `9 AV EMMANUEL BRIDAULT, 06000 NICE`
- В `docs/tasklist/azr-003-tasklist.md` задача `AZR-003-001` переведена в `in_progress`.

### Still open

- public contact email
- public phone decision/value
- hosting provider data
- contact/privacy contact fields

### Validation

- legal identity block reread after patch

## 2026-03-13: AZR-003 Hosting Baseline Filled

### Done

- В `02_website/legal-pages.md` заполнен hosting block:
  - `Hetzner Online GmbH`
  - `Industriestr. 25, 91710 Gunzenhausen, Germany`
  - `https://www.hetzner.com`
- В `docs/tasklist/azr-003-tasklist.md` задача `AZR-003-002` переведена в `done`.

### Still open

- public contact email
- public phone decision/value
- public WhatsApp decision/value
- privacy contact fields

### Validation

- hosting block reread after patch

## 2026-03-13: AZR-003 Public Contact Email Filled

### Done

- В `02_website/legal-pages.md` подставлен `contact@azursystech.fr`:
  - в business identity block
  - в privacy/data contact block

### Still open

- public phone decision/value
- public WhatsApp decision/value
- `Additional contact if needed`

### Validation

- email fields reread after patch

## 2026-03-13: AZR-003 Phone and WhatsApp Baseline Filled

### Done

- В launch-critical docs подставлен public phone / WhatsApp baseline:
  - `+33 7 49 70 54 65`
- Обновлены:
  - `02_website/legal-pages.md`
  - `02_website/site-architecture.md`
  - `02_website/forms-spec.md`
  - `02_website/wireframes.md`
  - `01_brand/homepage-copy.md`
  - `01_brand/faq.md`
  - `06_seo/gbp-setup-checklist.md`
- В `docs/tasklist/azr-003-tasklist.md` задача `AZR-003-003` переведена в `in_progress`.

### Still open

- подтвердить, что WhatsApp использует тот же номер и публично доступен для launch
- deploy baseline
- AI launch mode decision

### Validation

- reread critical contact snippets after patch
- removed remaining stale contact-placeholder note in `02_website/site-architecture.md`

## 2026-03-13: AZR-003 Contact and AI Launch Decisions Confirmed

### Done

- Confirmed launch decisions:
  - WhatsApp public on the same number `+33 7 49 70 54 65`
  - AI launch mode = `limited live intake`
- Updated `AZR-003` package to reflect confirmed decisions instead of open assumptions.
- Closed tasks:
  - `AZR-003-003`
  - `AZR-003-005`
- Synchronized launch-facing docs:
  - `04_facebook/facebook-strategy.md`
  - `02_website/site-architecture.md`
  - `02_website/analytics-spec.md`
- Added ADR-008 to `memory_bank/decisions.md`.

### Validation

- reread `AZR-003` spec / plan / tasklist after patch
- grep pass on stale `WhatsApp later` / `future WhatsApp click` markers

## 2026-03-13: AZR-003 Deploy Baseline Hardening

### Done

- Переключен `docs/.active_ticket` на `AZR-003`.
- В `.env.vps.example` убран реальный AI key и заменен на placeholder.
- В `docker-compose.vps.yml` добавлен runtime passthrough для:
  - `DEEPSEEK_API_KEY`
  - `DEEPSEEK_BASE_URL`
  - `ALLOWED_ORIGINS`
- В `docs/deployment/github-vps.md` уточнены:
  - обязательные VPS `.env` runtime values
  - warning про секреты в tracked files
  - verification step for runtime env visibility
- В `docs/tasklist/azr-003-tasklist.md` задача `AZR-003-004` переведена в `in_progress`.

### Risks

- DeepSeek key previously stored in `.env.vps.example` should be rotated.

### Validation

- deploy baseline files reread after patch

## 2026-03-14: Deploy Cutover Confirmed Live

### Done

- Локальный рабочий repo был перепривязан на `git@github.com:oleyna80/azursystech-site.git`.
- Placeholder history сохранена в branch `placeholder-backup`.
- `main` в `azursystech-site` заменен реальным проектом.
- Исправлен production deploy path:
  - `Deploy to VPS` использует build-on-VPS, а не GHCR baseline;
  - `Deploy to VPS` проходит успешно;
  - `azursystech.fr` и `/health` отвечают `200`.
- Исправлен container healthcheck drift для Next.js runtime:
  - `HOSTNAME=0.0.0.0`
  - healthcheck идет по container IP, а не по `127.0.0.1`.
- Уточнен runbook `docs/deployment/github-vps.md`:
  - verify commands приведены к реальному runtime behavior;
  - SSL edge path явно зафиксирован как `Cloudflare -> NPM -> azursystech-web`.

### Validation

- GitHub Actions:
  - `CI` - pass
  - `Deploy to VPS` - pass
- Public checks:
  - `curl -I https://azursystech.fr` - `200`
  - `curl -s https://azursystech.fr/health` - `200`

## 2026-03-14: RooCode Delivery Workflow Activated

### Done

- Зафиксирован рабочий delivery mode:
  - current agent = Tech Lead
  - RooCode = coder
  - Tech Lead only tasks/review/follow-up, not primary implementation
- В `.roo/skills/` созданы рабочие skills:
  - `azursystech-page-implementation`
  - `azursystech-form-contract`
  - `azursystech-doc-to-ui-review`
  - `azursystech-safe-ai-runtime`
- Подготовлен implementation-facing artifact:
  - `docs/plans/azr-002-implementation-map.md`

### Validation

- skills directory reread after creation
- implementation map reread against `02_website/*`

## 2026-03-14: Contact Page Implemented and Accepted

### Done

- RooCode реализовал route `/contact` в `web/src/app/contact/page.tsx`.
- По результатам review были исправлены:
  - hidden honeypot anti-spam field;
  - public copy drift с internal/dev wording.
- Итоговый `/contact` принят:
  - sections соответствуют implementation map;
  - contacts соответствуют launch SSOT;
  - form contract и `particulier` / `tpe` branching сохранены;
  - submit flow остается honest stub без fake backend behavior.

### Validation

- file-level review against:
  - `02_website/forms-spec.md`
  - `03_leads/lead-intake-spec.md`
  - `docs/plans/azr-002-implementation-map.md`
- `npm run build` reported as pass by RooCode

### Risks

- Local independent build validation was not rerun by Tech Lead in this environment due WSL resolving to Windows `npm` path.

## 2026-03-14: AZR-002-009 Homepage/Shell Follow-up Closed

### Done

- Closed review gaps for `AZR-002-009` within homepage/shell scope.
- Updated shared shell components:
  - `web/src/components/shell/site-header.tsx`
  - `web/src/components/shell/site-footer.tsx`
- Header now includes full MVP primary nav links:
  - `/`, `/services`, `/business`, `/home`, `/pricing`, `/faq`, `/contact`
- Header CTA layer aligned with launch contract:
  - primary: `Оставить заявку`
  - secondary entries: WhatsApp + chat entry
- Footer aligned to MVP contract:
  - short brand line
  - links
  - area served
  - legal links `/legal` and `/privacy`
  - contact CTA
- Updated homepage `web/src/app/page.tsx`:
  - hero now explicitly shows who/for whom/where, business relevance, and multiple CTAs;
  - launch-visible dedicated WhatsApp CTA added in hero;
  - chat CTA/entry added in hero and dedicated chat entry block;
  - contact form block added as honest launch-compatible stub (UI-only, no backend flow).
- Kept `/contact` route behavior untouched for form submit logic (honest stub remains in place).
- Updated task artifact:
  - `docs/tasklist/azr-002-tasklist.md` -> `AZR-002-009` marked `done`.

### Validation

- `cd /home/dmitrii/azursystech/web && npm run build` - pass

### Notes

- No new architecture/process decision introduced; `memory_bank/decisions.md` not changed.
- Route stubs were not required for build in this follow-up scope.

## 2026-03-14: Continuity Sync for Next Session

### Done

- `memory_bank/context.md` rewritten to current execution state.
- Active ticket returned to `AZR-002` because current work has moved from launch-baseline hardening back to website implementation.
- `AZR-002` tasklist updated to reflect:
  - planning/handoff tasks completed;
  - `/contact` execution completed;
  - `app shell + homepage skeleton` queued next.
- `AZR-003` tasklist updated to reflect deploy baseline as done and to keep remaining blockers visible but secondary.

### Validation

- reread `memory_bank/context.md`
- reread `docs/.active_ticket`
- reread `docs/tasklist/azr-002-tasklist.md`
- reread `docs/tasklist/azr-003-tasklist.md`

## 2026-03-14: Multi-Agent Operating Model Standardized

### Done

- `AGENTS.md` расширен явной multi-agent operating model:
  - control tower
  - allowed parallel streams
  - reporting contract between streams
  - ownership rule for SSOT changes
- `.agent/ROSTER.md` расширен:
  - added `Integration Lead`
  - added `CRM Lead`
  - parallel stream model and handoff matrix updated
- `docs/reports/AGENT_HANDOFF_TEMPLATE.md` расширен кратким stream summary block.
- Added `ADR-012` to fix parallel-stream execution as accepted operating model.
- 5-point unified return format explicitly fixed as canonical for all parallel chats:
  - `What was done`
  - `Decisions made`
  - `Files / settings changed`
  - `Open blockers`
  - `Next recommended action`

### Validation

- reread `AGENTS.md`
- reread `.agent/ROSTER.md`
- reread `docs/reports/AGENT_HANDOFF_TEMPLATE.md`
- reread `memory_bank/context.md`

## 2026-03-14: Documentation Cleanup Batch for 00-07

### Done

- Updated `07_ops/task-board.md` to current execution state:
  - `AZR-002` website MVP build now reflected as the active work
  - stale contact/deploy blockers removed from daily execution lane
- Updated `07_ops/launch-checklist.md`:
  - marked already-true launch prerequisites as done
  - added current launch-critical checklist items for HubSpot and `n8n`
- Removed stale placeholder wording from live-resolved docs:
  - `02_website/legal-pages.md`
  - `03_leads/lead-intake-spec.md`
- Removed legacy `Next file to create` tails across `00_strategy`-`06_seo` and `05_ai` docs where sequencing is now handled by task artifacts and memory bank.

### Validation

- reread `07_ops/task-board.md`
- reread `07_ops/launch-checklist.md`
- reread updated placeholder sections in `02_website/legal-pages.md` and `03_leads/lead-intake-spec.md`
- grep pass for `Next file to create` in `00_strategy`-`07_ops`

## 2026-03-14: Language, CRM, Legal, and KPI Alignment Pass

### Done

- Fixed public language direction for MVP:
  - Russian-first public site for the russophone audience on the Côte d'Azur
  - French and English planned as phase 2
  - German optional later
- Removed Google Sheets fallback as primary launch path:
  - `03_leads/*`
  - `02_website/forms-spec.md`
  - `02_website/analytics-spec.md`
  - `05_ai/approval-workflow.md`
  - `05_ai/lead-agent-spec.md`
- Improved legal wording in `02_website/legal-pages.md`:
  - aligned expected tools with HubSpot CRM + actual launch stack direction
- Upgraded `07_ops/kpi-framework.md` from generic list to implementation-aware KPI model linked to:
  - site analytics
  - HubSpot pipeline
  - GBP / reviews

### Validation

- reread `02_website/site-architecture.md`
- reread `06_seo/local-seo-plan.md`
- reread `02_website/legal-pages.md`
- reread `03_leads/crm-pipeline.md`
- reread `03_leads/lead-intake-spec.md`
- reread `02_website/forms-spec.md`
- reread `07_ops/kpi-framework.md`

## 2026-03-14: AZR-002-010 Legal and Privacy Routes Implemented

### Done

- Реализован route `/legal`:
  - `web/src/app/legal/page.tsx`
  - секции выровнены с `02_website/legal-pages.md` (идентификация сайта, данные владельца, контакты, публикация, хостинг, IP, ответственность, внешние ссылки, применимое право).
- Реализован route `/privacy`:
  - `web/src/app/privacy/page.tsx`
  - секции выровнены с `02_website/legal-pages.md` (какие данные, каналы, цели, основание, использование, хранение, инструменты, права, контакт, аналитика, чат, формы).
- Совместимость shell links подтверждена:
  - `web/src/components/shell/site-footer.tsx` уже содержит `/legal` и `/privacy`; после добавления routes ссылки стали валидными.
- Обновлен task artifact:
  - `docs/tasklist/azr-002-tasklist.md` добавлена и закрыта задача `AZR-002-010`.

### Validation

- `cd /home/dmitrii/azursystech/web && npm run build` - pass
- В build output присутствуют routes:
  - `/legal`
  - `/privacy`

### Notes

- Публичные контакты сохранены по SSOT: `contact@azursystech.fr`, `+33 7 49 70 54 65`.
- Контракт `/contact` не менялся.
- Новых архитектурных/процессных решений не вводилось; `memory_bank/decisions.md` не изменялся.

## 2026-03-14: AZR-002-011 Services Route Implemented

### Done

- Реализован route `/services`:
  - `web/src/app/services/page.tsx`
  - страница выстроена business-first по SSOT.
- Добавлены секции route:
  - intro / page hero
  - services for business
  - services for home users
  - packaged offers
  - contact / CTA block
  - FAQ mini-block
- Pricing presentation выровнена с approved framing:
  - `от`
  - `по запросу`
  - стоимость зависит от объема задачи
- Все CTA ведут на `/contact`.
- Обновлен task artifact:
  - `docs/tasklist/azr-002-tasklist.md` добавлена и закрыта задача `AZR-002-011`.

### Validation

- `cd /home/dmitrii/azursystech/web && npm run build` - pass

### Notes

- Public copy kept Russian-first and business-first.
- Existing routes `/`, `/contact`, `/legal`, `/privacy` were not changed.
- No new architecture/process decision introduced; `memory_bank/decisions.md` not changed.

## 2026-03-14: AZR-002-012 Business Route Implemented

### Done

- Реализован route `/business`:
  - `web/src/app/business/page.tsx`
  - страница выстроена как TPE-first conversion page в требуемом порядке секций.
- Добавлены секции route:
  - business hero
  - typical business problems
  - what AzurSysTech can set up
  - use cases
  - offer blocks
  - how we work
  - contact / CTA block
  - business FAQ mini-block
- Подчеркнут practical-support scope по SSOT:
  - `postes de travail`
  - `Wi-Fi`
  - `réseau local`
  - `imprimantes`
  - `dossiers partagés`
  - `intervention sur site`
- Все ключевые CTA направлены на `/contact`.
- Обновлен task artifact:
  - `docs/tasklist/azr-002-tasklist.md` добавлена и закрыта задача `AZR-002-012`.
- Выполнен self-check через skill `azursystech-doc-to-ui-review`:
  - критичных/высоких/средних drift-факторов не выявлено.

### Validation

- `cd /home/dmitrii/azursystech/web && npm run build` - pass
- В build output присутствует route `/business`.

### Notes

- Scope ограничен только реализацией `/business` и обязательными task/memory updates.
- Новых архитектурных/процессных решений не вводилось; `memory_bank/decisions.md` не изменялся.

## 2026-03-14: AZR-002-012 Business Route Review Follow-up Closed

### Done

- По review был закрыт copy drift в `web/src/app/business/page.tsx`.
- Public-facing labels и описания переведены в Russian-first форму:
  - `postes de travail` -> `рабочие места`
  - `réseau local` -> `локальная сеть`
  - `imprimantes` -> `принтеры`
  - `dossiers partagés` -> `общие папки`
  - `intervention sur site` -> `выезд на место`
- Из public UI также убран marketing/internal wording в заголовке offer block.
- Структура route, CTA contract и pricing framing сохранены без изменений.

### Validation

- `cd /home/dmitrii/azursystech/web && npm run build` - pass

### Notes

- Follow-up был чисто copy-level и не менял route structure или architecture decisions.

## 2026-03-14: AZR-002-013 Home Route Implemented

### Done

- Реализован route `/home`:
  - `web/src/app/home/page.tsx`
  - структура выровнена с implementation map для home-user page:
    - hero
    - typical home-user problems
    - main services
    - prices from
    - how to request help
    - FAQ for home users
    - CTA block
- Подача страницы сделана заметно проще и спокойнее относительно `/business`:
  - без business-first/TPE framing
  - с упором на particuliers/home users
  - с не-техническим и reassuring тоном
- Сервисный scope сохранен строго в MVP-документах:
  - диагностика ПК
  - новый компьютер
  - Wi‑Fi
  - принтер
  - установка программ
  - оптимизация / апгрейд
  - простой перенос данных
- Pricing framing в публичном copy сохранен в контракте:
  - `от`
  - `зависит от объёма задачи`
- Все ключевые CTA на странице `/home` ведут на `/contact`.
- Обновлен task artifact:
  - `docs/tasklist/azr-002-tasklist.md` добавлена и закрыта задача `AZR-002-013`.
- Выполнен self-check по skill `azursystech-doc-to-ui-review`:
  - критичных/высоких/средних drift-факторов не выявлено.

### Validation

- `cd /home/dmitrii/azursystech/web && npm run build` - pass
- В build output присутствует route `/home`.

### Notes

- Scope ограничен реализацией `/home` и обязательными task/memory updates.
- Новых архитектурных/процессных решений не вводилось; `memory_bank/decisions.md` не изменялся.

## 2026-03-14: AZR-002-016 Pricing Route Implemented

### Done

- Реализован route `/pricing`:
  - `web/src/app/pricing/page.tsx`
  - страница оформлена как trust-oriented pricing entry page, а не как фиксированный прайс-каталог.
- Добавлены обязательные секции pricing route:
  - pricing hero
  - how pricing works
  - business pricing entry (до home-блока)
  - home-user pricing entry
  - what affects final cost
  - what is included / not included
  - how to request an estimate
  - final CTA block
- Pricing framing выровнен с SSOT и ограничен формулами:
  - `от`
  - `по запросу`
  - `зависит от объёма задачи`
- Все CTA на `/pricing` направлены на `/contact`.
- Visual direction для страницы выровнен с ADR-015 `Local Professional`:
  - теплый светлый фон/поверхности
  - restrained teal primary accent
  - terracotta secondary accent
  - dark slate text
  - serif-заголовки в сдержанной подаче
  - спокойная мобильная плотность
- Обновлен task artifact:
  - `docs/tasklist/azr-002-tasklist.md` добавлена и закрыта задача `AZR-002-016`.
- Выполнен self-check по skill `azursystech-doc-to-ui-review`:
  - критичных/высоких/средних drift-факторов не выявлено.

### Validation

- `cd /home/dmitrii/azursystech/web && npm run build` - pass
- В build output присутствует route `/pricing`.

### Notes

- Scope ограничен реализацией `/pricing` и обязательными task/memory updates.
- Новых архитектурных/процессных решений не вводилось; `memory_bank/decisions.md` не изменялся.

## 2026-03-14: RooCode Skills Expanded For Visual MVP Work

### Done

- В `.roo/skills/` добавлены два новых skills для текущего website stream:
  - `azursystech-route-mvp-implementation`
  - `azursystech-visual-review`
- `azursystech-route-mvp-implementation` формализует route-level workflow для MVP страниц:
  - SSOT read order
  - route extraction
  - CTA/pricing/legal constraints
  - visual baseline check
  - mandatory artifact updates
  - required build validation
- `azursystech-visual-review` формализует review против `ADR-015` и `docs/plans/azr-002-visual-direction.md`:
  - visual-system drift
  - CTA visibility
  - section density
  - mobile readability
  - avoidance of cold corporate / generic startup styling
- `memory_bank/context.md` обновлен, чтобы новый RooCode baseline был отражен в project context.

### Validation

- `find .roo/skills -maxdepth 2 -type f | sort` - pass

### Notes

- Изменения ограничены skill-layer и memory updates.
- Новых архитектурных или продуктовых решений не вводилось; `memory_bank/decisions.md` не изменялся.

## 2026-03-14: AZR-002-017 FAQ Route Implemented

### Done

- Реализован route `/faq`:
  - `web/src/app/faq/page.tsx`
  - страница оформлена как полный FAQ-маршрут MVP с required structure:
    - page intro
    - grouped FAQ list
    - final CTA block
- FAQ сгруппирован в спокойные, сканируемые блоки на основе approved source `01_brand/faq.md`:
  - общие вопросы
  - цены и формат работы
  - вопросы бизнеса / TPE
  - вопросы частных клиентов
  - первый контакт и чат
- Публичный copy сохранен Russian-first, launch-safe, без internal/dev wording и без route-path ссылок в тексте.
- Не добавлены новые/выдуманные FAQ и не добавлены новые обещания по цене, срокам, выезду или гарантиям.
- Все CTA на `/faq` направлены на `/contact`.
- Совместимость с текущим shell подтверждена:
  - header/footer уже содержат ссылку на `/faq`
  - существующие routes `/`, `/services`, `/business`, `/home`, `/pricing`, `/contact`, `/legal`, `/privacy` не изменялись.
- Обновлен task artifact:
  - `docs/tasklist/azr-002-tasklist.md` добавлена и закрыта задача `AZR-002-017`.

### Validation

- pending: `cd /home/dmitrii/azursystech/web && npm run build`

### Notes

- Новых архитектурных/процессных решений не вводилось; `memory_bank/decisions.md` не изменялся.

## 2026-03-15: AZR-002 Complete, transitioning to AZR-003

### Done

- Performed full documentation review of the `AZR-002` scope.
- Confirmed that all 25 implementation tasks in `AZR-002-tasklist.md` are closed.
- Closed `AZR-002` ticket and set `AZR-003` as the active ticket pointer.
- Updated SSOT to reflect the phase change:
  - `07_ops/task-board.md`
  - `docs/backlog.md`
  - `memory_bank/context.md`
- Separated blocked `AZR-003` go-live tasks (legal, GBP) from queued Phase 1.5 frontend improvements (`/about`, SEO landing pages).

### Next

- Prepare implementation handoff prompt for RooCode: `/about` page (Phase 1.5).
- Prepare implementation handoff prompt for RooCode: SEO landing pages (Phase 1.5).
