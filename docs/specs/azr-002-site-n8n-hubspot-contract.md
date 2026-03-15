# SPEC: AZR-002 Site -> n8n -> HubSpot Contract Lock

## Problem

`/contact` submit path is implemented as a safe site boundary, but final external delivery contract is still unresolved. Current route intentionally keeps a provisional boundary and returns `integration_not_ready` until external contract details are fixed.

## Goal

Lock canonical SSOT contract for `site -> n8n -> HubSpot` without undocumented assumptions, explicitly labeling unresolved items as `BLOCKER` before production adapter implementation.

## Lifecycle State

- Current state: `blocked`
- Reason: во всех 5 обязательных blocker-группах остаются критичные `BLOCKER`-поля; перевод в `ready-for-implementation` запрещен gate rule.

## Ticket Binding

- Parent ticket: `AZR-002`
- Stream task: `AZR-002-023`
- Stream type: integration-contract stream

## Scope

1. Endpoint boundary contract for `site -> n8n`
2. Auth contract
3. Payload contract and mapping path to HubSpot
4. Response contract back to site
5. Error semantics and ownership boundaries

## Out of Scope

- UI/page updates in `web/src/app/*`
- runtime/infra deployment changes
- production adapter coding
- secret provisioning in live environments
- undocumented field creation

## SSOT Sources Used

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
- boundary code:
  - `web/src/app/api/contact/submit/route.ts`
  - `web/src/lib/contact-submit.ts`
  - `web/src/app/contact/page.tsx`

## Decision Checklist — `AZR-002-023`

Ниже фиксируется только то, что подтверждено SSOT. Неутвержденные значения не угадываются и помечаются как `BLOCKER` с owner и next action.

### Final approved snapshot (control-layer)

| Group | Approved values fixed in SSOT | Still `BLOCKER` | Group state |
|---|---|---|---|
| Endpoint | none | URL/path, method, content-type, required headers, versioning | `BLOCKED` |
| Auth | secret storage rule (runtime env only) | auth/signature scheme, exact header names, minimal rotation rule | `BLOCKED` |
| Timeout / Retry / Idempotency | none | timeout, retry policy, idempotency/duplicate rule | `BLOCKED` |
| Mapping | `source = website_form`, `status = New`, allowed site payload fields and branching | target HubSpot object, full HubSpot property mapping, stage/property mapping | `BLOCKED` |
| Response contract | deterministic no-fake-success boundary rule | upstream success/permanent-failure/temporary-failure schemas | `BLOCKED` |

Итог snapshot: `AZR-002-023` остается `blocked`.

### 1) Endpoint

Status: `BLOCKED`

Value set:

- Final URL/path: `BLOCKER` (не утверждено)
- Method: `BLOCKER` (не утверждено)
- Content-Type: `BLOCKER` (не утверждено)
- Required headers: `BLOCKER` (не утверждено)
- Versioning rule: `BLOCKER` (не утверждено)

Source/approval:

- В SSOT отсутствует approved endpoint contract для live `site -> n8n`.
- В [`07_ops/launch-checklist.md`](07_ops/launch-checklist.md:24) и [`07_ops/launch-checklist.md`](07_ops/launch-checklist.md:25) зафиксировано, что HubSpot/n8n intake еще не ready.
- В [`web/src/app/api/contact/submit/route.ts`](web/src/app/api/contact/submit/route.ts:15) boundary явно помечен provisional до фиксации финального контракта.

Blockers:

| Blocker | Description | Owner | Next action |
|---|---|---|---|
| `BLOCKER-000` | final HTTP method for external `site -> n8n` call | Integration Lead | Вернуть control-layer approval с выбранным методом и rationale в stream summary 1-5 |
| `BLOCKER-001` | final live n8n endpoint URL/path | Integration Lead | Зафиксировать canonical URL/path и source of truth в этом spec |
| `BLOCKER-002` | endpoint versioning policy | Integration Lead | Утвердить версионирование webhook/API и backward-compatibility rule |
| `BLOCKER-003` | request content type for `site -> n8n` | Integration Lead | Утвердить content type и serialization contract |
| `BLOCKER-004` | required/optional header contract | Integration Lead | Вернуть обязательный список headers и optional policy |

### 2) Auth

Status: `BLOCKED`

Value set:

- Auth/signature scheme: `BLOCKER` (не утверждено)
- Exact header name(s): `BLOCKER` (не утверждено)
- Secret storage rule: `CLOSED` = секреты только в runtime env / `.env`, не в репозитории
- Minimal rotation rule: `BLOCKER` (не утверждено)

Source/approval:

- Secret storage rule подтвержден в [`AGENTS.md`](AGENTS.md:31) и [`AGENTS.md`](AGENTS.md:33).
- Auth/signature/header naming и rotation rule не имеют approved control-layer артефакта.

Blockers:

| Blocker | Description | Owner | Next action |
|---|---|---|---|
| `BLOCKER-005` | auth/signature scheme and secret header naming | Integration Lead | Зафиксировать схему auth/signature + точные header names в contract spec |
| `BLOCKER-012` | minimal secret rotation rule | Integration Lead | Утвердить минимальное правило ротации и rollback-safe порядок обновления секретов |

### 3) Timeout / Retry / Idempotency

Status: `BLOCKED`

Value set:

- Timeout: `BLOCKER` (число и единица не утверждены)
- Retry policy: `BLOCKER` (yes/no, лимиты, условия не утверждены)
- Duplicate prevention/idempotency rule: `BLOCKER` (не утверждено)

Source/approval:

- В текущем контракте timeout/retry/idempotency остаются незакрытыми gap-ами.
- В [`memory_bank/progress.md`](memory_bank/progress.md:14), [`memory_bank/progress.md`](memory_bank/progress.md:15) и [`memory_bank/progress.md`](memory_bank/progress.md:16) эти области уже зафиксированы как blocker-level.

Blockers:

| Blocker | Description | Owner | Next action |
|---|---|---|---|
| `BLOCKER-006` | timeout/retry values and behavior | Integration Lead | Вернуть конкретные timeout/retry параметры и failure-condition rule |
| `BLOCKER-011` | idempotency and duplicate-prevention rule | Integration Lead | Утвердить idempotency key/rule и duplicate handling semantics |

### 4) Mapping `site -> n8n -> HubSpot`

Status: `BLOCKED`

Value set:

- Target HubSpot object: `BLOCKER` (не утверждено)
- Full mapping of allowed fields: `BLOCKED` на этапе `n8n -> HubSpot` property mapping
- Initial status/stage/property mapping: `BLOCKER` (не утверждено)

Source/approval:

- `CLOSED` на стороне site boundary: допустимый набор полей и их валидация зафиксированы в [`web/src/lib/contact-submit.ts`](web/src/lib/contact-submit.ts:27).
- `CLOSED` launch baseline: `source = website_form` в [`web/src/lib/contact-submit.ts`](web/src/lib/contact-submit.ts:1), `status = New` в [`web/src/lib/contact-submit.ts`](web/src/lib/contact-submit.ts:2), HubSpot-only baseline в [`memory_bank/decisions.md`](memory_bank/decisions.md:306).
- `BLOCKED` для object/property/stage mapping: в SSOT нет утвержденного HubSpot object model/property map.

Allowed field set at site boundary:

- `source`
- `status`
- `name`
- `phone`
- `email`
- `city`
- `segment`
- `service_type`
- `problem_description`
- `device_count`
- `onsite_required`
- `urgency`
- `company_name`
- `business_type`
- `workstation_count`
- `business_needs`
- `business_address`
- `home_device_type`
- `device_state`
- `home_need_type`

Branching constraints at site boundary:

- `segment = tpe` -> `company_name`, `business_type`, `workstation_count`, `business_needs`, `business_address`
- `segment = particulier` -> `home_device_type`, `device_state`, `home_need_type`

Blockers:

| Blocker | Description | Owner | Next action |
|---|---|---|---|
| `BLOCKER-007` | `site -> n8n` field transform policy | Integration Lead | Зафиксировать transform rule 1:1 или explicit remap для каждого allowed field |
| `BLOCKER-008` | HubSpot object model and exact property mapping | CRM Lead | Утвердить target object и property names для полного field mapping |
| `BLOCKER-009` | initial status mapping `New -> HubSpot stage/property` | CRM Lead | Утвердить initial stage/property mapping from site status |

### 5) Response contract `n8n -> site`

Status: `BLOCKED`

Value set:

- Success schema: `BLOCKER` (не утверждено)
- Permanent failure schema: `BLOCKER` (не утверждено)
- Temporary failure schema: `BLOCKER` (не утверждено)
- Deterministic rule when site may return `success`: `CLOSED` = только при explicit upstream success, без fake success

Source/approval:

- Anti-fake-success rule подтвержден текущим boundary в [`web/src/app/api/contact/submit/route.ts`](web/src/app/api/contact/submit/route.ts:78), [`web/src/app/api/contact/submit/route.ts`](web/src/app/api/contact/submit/route.ts:64) и [`web/src/app/api/contact/submit/route.ts`](web/src/app/api/contact/submit/route.ts:71).
- Финальный upstream schema не утвержден в SSOT.

Deterministic success boundary rule (approved):

- Site boundary может вернуть `success` только если upstream branch явно вернул success-result, без fallback/optimistic success.
- Если upstream не готов или завершился ошибкой, site boundary обязан вернуть non-success status (`integration_not_ready` или `submit_failed`) и fallback message.

Blockers:

| Blocker | Description | Owner | Next action |
|---|---|---|---|
| `BLOCKER-010` | n8n success response schema for site consumption | Integration Lead | Утвердить success/failure schema contract и deterministic mapping rule в site boundary |

## Gate rule

`AZR-002-023` НЕ может перейти в `ready-for-implementation`, пока хотя бы одна из 5 decision groups имеет статус `BLOCKED`.

Текущее состояние gate: `blocked`.

## Final closure decision snapshot (control-layer)

Дата фиксации: `2026-03-15`

- `AZR-002-023` формально закрыт как control-layer closure pass c итогом `blocked`.
- `ready-for-implementation`: `DENIED`.
- Причина отказа: в каждой из 5 групп есть как минимум один критичный `BLOCKER`, требующий explicit approval от Integration Lead и/или CRM Lead.

Group-by-group result:

1. Endpoint - `BLOCKED`
2. Auth - `BLOCKED`
3. Timeout / Retry / Idempotency - `BLOCKED`
4. Mapping - `BLOCKED`
5. Response contract - `BLOCKED`

No-silent-assumptions declaration:

- Не добавлены неподтвержденные URL, header names, auth/signature scheme, timeout/retry/idempotency числа, HubSpot object/property names или upstream response schema.
- Все незакрытые зоны сохранены как `BLOCKER` без implicit допущений.

## Closure revalidation pass (control-layer)

Дата фиксации: `2026-03-15`

- Revalidation trigger: control-layer closure rerun for `AZR-002-023` with explicit confirmation that no new approved values were provided by Integration Lead / CRM Lead.
- SSOT basis: unchanged, only approved values from current repository artifacts.
- Result: all five mandatory groups remain `BLOCKED`; no `BLOCKER` moved to approved state.
- Gate decision: `ready-for-implementation` = `DENIED`.
- Ticket state after revalidation: `blocked`.

Group-by-group revalidation result:

1. Endpoint - `BLOCKED`
2. Auth - `BLOCKED`
3. Timeout / Retry / Idempotency - `BLOCKED`
4. Mapping - `BLOCKED`
5. Response contract - `BLOCKED`

No-silent-assumptions revalidation:

- No endpoint URL/path, method, content-type, headers, versioning rule were invented.
- No auth scheme/header names/rotation rule were invented.
- No timeout/retry/idempotency values were invented.
- No HubSpot object/property/stage mapping values were invented.
- No upstream response schemas were invented.

## Hard-constraints compliance check

- HubSpot-only baseline: `PASS` (см. [`memory_bank/decisions.md`](memory_bank/decisions.md:306)).
- Preserve `source = website_form`: `PASS` (см. [`web/src/lib/contact-submit.ts`](web/src/lib/contact-submit.ts:1)).
- No fake success: `PASS` (см. [`web/src/app/api/contact/submit/route.ts`](web/src/app/api/contact/submit/route.ts:64)).
- No autonomous outbound implications: `PASS` (см. [`memory_bank/decisions.md`](memory_bank/decisions.md:175)).
- No invention outside approved control-layer values: `PASS` (все неутвержденные поля оставлены как `BLOCKER`).

## Compatibility Check

Совместимость итогового состояния контракта с текущим site boundary подтверждена:

1. [`web/src/lib/contact-submit.ts`](web/src/lib/contact-submit.ts:109)
   - валидация и сбор только допустимых полей
   - `source = website_form`
   - `status = New`
2. [`web/src/app/api/contact/submit/route.ts`](web/src/app/api/contact/submit/route.ts:33)
   - no fake success
   - redirect-safe semantics через `success` only
   - honest fallback statuses `integration_not_ready` и `submit_failed`

Следовательно, контракт остается launch-safe и полностью совместим с текущим provisional boundary, при этом формально остается `blocked` до закрытия blocker-групп.

## Acceptance Criteria for this closure pass

- Все 5 decision groups явно заполнены как `CLOSED` или `BLOCKED`
- Для каждого `BLOCKER` указан owner и next action
- Нет скрытых или молчаливых допущений
- `ready-for-implementation` не выставлен при наличии `BLOCKED`
- Совместимость с текущим site boundary подтверждена
