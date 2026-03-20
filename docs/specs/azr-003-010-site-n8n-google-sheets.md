# SPEC: AZR-003-010 — Site → n8n → Google Sheets Integration Contract

## Status

`blocked`

Gate rule: этот тикет не может перейти в `ready-for-implementation`, пока хотя бы одна из 5 blocker-групп (B1–B5) имеет статус `BLOCKED`.

---

## Ticket Binding

- Parent: `AZR-003`
- Stream: `AZR-003-010`
- Type: integration-contract + runtime-handoff
- Stream scope: launch intake path `site → n8n → Google Sheets`

---

## Problem

Сайт возвращает `integration_not_ready (503)` для всех submit-запросов, потому что:

- `isFinalIntegrationContractReady()` в `web/src/app/api/contact/submit/route.ts` возвращает `false` (hardcoded provisional boundary).
- В production `.env` и `docker-compose.vps.yml` отсутствуют env-переменные для внешнего transport: `AZURSYSTECH_CONTACT_SUBMIT_BASE_URL`, `AZURSYSTECH_CONTACT_SUBMIT_TOKEN`.
- Spec для Google Sheets target (`sheet ID`, tab name, write credential в n8n) не закреплён ни в одном SSOT-документе.
- n8n workflow для этого пути не верифицирован.

---

## Goal

Зафиксировать точный контракт для `site → n8n → Google Sheets` и вернуть control-layer статус по blocker-группам B1–B5.

---

## Approved Transport Contract (site-side)

Следующие значения подтверждены кодом и являются **CLOSED**:

| Parameter | Value | Source |
|---|---|---|
| Path | `/webhook/azursystech/contact-submit` | approved contract |
| Method | `POST` | approved contract |
| Content-Type | `application/json` | approved contract |
| Auth header | `Authorization: Bearer <token>` | approved contract |
| Version header | `X-Contract-Version: 1` | approved contract |
| Idempotency header | `X-Idempotency-Key: <uuid-v4>` | approved contract |

---

## Approved Payload Schema (site-side)

Поля выходящего payload зафиксированы в `web/src/lib/contact-submit.ts`. Все значения **CLOSED** на стороне сайта.

### Core fields (always present)

| Field | Type | Notes |
|---|---|---|
| `source` | `"website_form"` | hardcoded constant |
| `status` | `"New"` | hardcoded constant |
| `name` | `string` | required |
| `phone` | `string` | required, phone-like shape |
| `city` | `string` | required |
| `segment` | `"particulier" \| "tpe"` | required, enum |
| `service_type` | enum (9 values) | required |
| `problem_description` | `string` | required, 15–1500 chars |

### Optional core fields

| Field | Type |
|---|---|
| `email` | `string` (valid email format) |
| `device_count` | `"1" \| "2-3" \| "4-10" \| "10+"` |
| `onsite_required` | `"yes" \| "no" \| "not_sure"` |
| `urgency` | `"urgent" \| "standard" \| "planning"` |

### TPE segment fields (only if `segment = tpe`)

| Field | Type |
|---|---|
| `company_name` | `string` |
| `business_type` | `"office" \| "shop" \| "cabinet" \| "coworking" \| "other"` |
| `workstation_count` | `"1" \| "2-3" \| "4-10" \| "10+"` |
| `business_needs` | `Array<"wifi" \| "printers" \| "local_network" \| "shared_folders" \| "new_workstations" \| "onsite_support">` |
| `business_address` | `string` |

### Particulier segment fields (only if `segment = particulier`)

| Field | Type |
|---|---|
| `home_device_type` | `Array<"desktop_pc" \| "laptop" \| "wifi" \| "printer" \| "multiple_devices">` |
| `device_state` | `"new" \| "existing" \| "not_applicable"` |
| `home_need_type` | `Array<"repair" \| "setup" \| "migration" \| "speedup" \| "installation">` |

---

## Approved Response Schema (site-side)

Следующие поведения подтверждены `web/src/app/api/contact/submit/route.ts` и являются **CLOSED** на стороне сайта:

| HTTP status | `status` field | Trigger |
|---|---|---|
| `200` | `"success"` | upstream вернул явный success |
| `503` | `"integration_not_ready"` | integration boundary не готова (env не настроен) |
| `502` | `"submit_failed"` | upstream вернул ошибку |
| `400` | `"validation_error"` | server-side validation failed |
| `200` | `"spam_detected"` | honeypot triggered |

Правило no-fake-success: сайт возвращает `success` только при явном upstream success, без fallback или оптимистичного success. **CLOSED.**

---

## Blocker Group Analysis — B1–B5

### B1: Live `AZURSYSTECH_CONTACT_SUBMIT_BASE_URL`

Status: **`BLOCKED`**

Findings:
- Env var `AZURSYSTECH_CONTACT_SUBMIT_BASE_URL` отсутствует в production `.env` (проверено на VPS `/home/dmitrii/projects/azursystech-site/.env`).
- `docker-compose.vps.yml` не передаёт эту переменную в контейнер.
- `route.ts` не читает никакую env-переменную для внешнего URL; `isFinalIntegrationContractReady()` возвращает `false` hardcoded.
- Реальный live n8n webhook URL не зафиксирован ни в одном SSOT-артефакте.

Required to close:
1. Зафиксировать реальный n8n webhook URL вида `https://<n8n-host>/webhook/azursystech/contact-submit`.
2. Добавить в VPS `.env`: `AZURSYSTECH_CONTACT_SUBMIT_BASE_URL=<live url>`.
3. Добавить в `docker-compose.vps.yml` pass-through этой переменной.
4. Обновить `route.ts` для чтения этой переменной.

> **NOTE:** nohup n8n host и webhook URL не должны быть угаданы. Owner: Tech Lead / Founder (VPS access).

---

### B2: Production `AZURSYSTECH_CONTACT_SUBMIT_TOKEN` + rotation handoff

Status: **`BLOCKED`**

Findings:
- Env var `AZURSYSTECH_CONTACT_SUBMIT_TOKEN` отсутствует в production `.env` (проверено на VPS).
- `docker-compose.vps.yml` не передаёт эту переменную.
- `route.ts` не читает auth token и не отправляет `Authorization: Bearer` header.
- n8n workflow ожидаемая auth config (требует ли Bearer token validation) не верифицирована.

Required to close:
1. Сгенерировать production Bearer token (минимум 32 байта, crypto random).
2. Добавить `AZURSYSTECH_CONTACT_SUBMIT_TOKEN=<token>` в VPS `.env` (не в репозиторий).
3. Добавить pass-through в `docker-compose.vps.yml`.
4. Настроить в n8n webhook: Credential = Header Auth, Header Name = `Authorization`, Value = `Bearer <same-token>`.
5. Зафиксировать минимальное правило ротации (rotation handoff): при ротации сначала обновить n8n, затем `.env` на VPS, затем перезапустить контейнер.

> **NOTE:** Реальный token не должен попасть в git-репозиторий. Rotation SOP — часть этого blocker.

---

### B3: Google Sheets target details (sheet ID, tab name, write credential in n8n)

Status: **`BLOCKED`**

Findings:
- Google Sheets `spreadsheetId` нигде не зафиксирован в SSOT.
- Tab name (sheet tab / worksheet name) нигде не задан.
- Google Sheets write credential (Service Account JSON или OAuth2 token) в n8n не верифицированы.
- Нет подтверждения что n8n instance имеет активную Google Sheets connection с необходимыми scopes.

Required to close:
1. Создать или определить target Google Spreadsheet и зафиксировать `spreadsheetId`.
2. Зафиксировать точное имя tab (worksheet) для записи лидов.
3. Настроить Service Account с ролью `Editor` на таблицу + добавить Google Sheets credential в n8n.
4. Зафиксировать точный column mapping (см. ниже).

**Proposed column mapping** (для утверждения):

| Google Sheets Column | Payload Field | Notes |
|---|---|---|
| A: Timestamp | (n8n generated) | `{{ $now }}` |
| B: Name | `name` | |
| C: Phone | `phone` | |
| D: Email | `email` | optional |
| E: City | `city` | |
| F: Segment | `segment` | `particulier` / `tpe` |
| G: Service Type | `service_type` | |
| H: Problem | `problem_description` | |
| I: Urgency | `urgency` | optional |
| J: Onsite | `onsite_required` | optional |
| K: Devices | `device_count` | optional |
| L: Company | `company_name` | TPE only |
| M: Business Type | `business_type` | TPE only |
| N: Workstations | `workstation_count` | TPE only |
| O: Business Needs | `business_needs` (join) | TPE only, comma-joined |
| P: Business Address | `business_address` | TPE only |
| Q: Home Device Type | `home_device_type` (join) | Particulier only |
| R: Device State | `device_state` | Particulier only |
| S: Home Need Type | `home_need_type` (join) | Particulier only |
| T: Source | `source` | always `website_form` |
| U: Status | `status` | always `New` |
| V: Idempotency Key | from header `X-Idempotency-Key` | for dedupe |

> **NOTE:** этот mapping предложен, не утверждён. Owner для утверждения: Founder.

---

### B4: Response-schema compliance proof in real/controlled workflow

Status: **`PARTIALLY CLOSED` / n8n side `BLOCKED`**

Site-side compliance:

| Code path | HTTP | Status field | Verified |
|---|---|---|---|
| upstream success | 200 | `success` | ✅ code verified (`route.ts:78`) |
| integration not ready | 503 | `integration_not_ready` | ✅ code verified (`route.ts:64`) |
| submit failed | 502 | `submit_failed` | ✅ code verified (`route.ts:71`) |
| validation error | 400 | `validation_error` | ✅ code verified (`route.ts:55`) |
| spam detected | 200 | `spam_detected` | ✅ code verified (`route.ts:48`) |

n8n-side required response schema (не верифицировано):

n8n workflow должен возвращать один из следующих ответов:

```json
// 200 - accepted
{ "status": "accepted" }

// 503 - temporary failure (retriable)
{ "status": "temporary_failure", "message": "..." }

// 400 - rejected (invalid payload)
{ "status": "rejected", "reason": "invalid_payload" }

// 401 - rejected (auth failed)
{ "status": "rejected", "reason": "auth_failed" }

// 422 - rejected (unprocessable)
{ "status": "rejected", "reason": "unprocessable" }
```

Required to close B4 fully:
1. Создать / верифицировать n8n workflow с явными response nodes для каждого из кодов выше.
2. Запустить controlled test: POST с валидным payload → n8n → Google Sheets row записана → n8n вернул 200 `accepted` → сайт вернул `success`.
3. Запустить controlled test с невалидным auth → n8n вернул 401 → сайт вернул `submit_failed`.

---

### B5: Idempotency dedupe proof for 24h window

Status: **`BLOCKED`**

Findings:
- `route.ts` не генерирует и не отправляет `X-Idempotency-Key` header.
- n8n workflow config для dedupe по этому ключу не верифицирован.
- 24h dedupe window не реализована в известных частях системы.

Required to close:
1. В `route.ts` (или site-side HTTP call) генерировать `X-Idempotency-Key: <uuid-v4>` per-request.
2. В n8n workflow сохранять idempotency key в Google Sheets (column V) или дополнительном хранилище.
3. В n8n реализовать dedupe-проверку: перед записью проверять, не существует ли строка с тем же key за последние 24h.
4. При дублирующем запросе n8n должен вернуть `200 accepted` (идемпотентный ответ) без создания новой строки.

> **NOTE:** простая реализация — lookup в том же Google Sheet по column V за 24h. Если sheet большой, лучше отдельный dedupe tab или Supabase/Redis. Scope выбора — за Founder/Tech Lead.

---

## Blocker Summary Table

| Blocker | Group | Status | Owner | Blocking factor |
|---|---|---|---|---|
| B1 | Live BASE_URL | **BLOCKED** | Tech Lead | n8n webhook URL not known/set |
| B2 | Production TOKEN + rotation | **BLOCKED** | Tech Lead | token not generated/set in env |
| B3 | Google Sheets target | **BLOCKED** | Founder + Tech Lead | sheet ID / tab / credential not set |
| B4 (site) | Response schema compliance | **CLOSED (site-side)** | — | code verified |
| B4 (n8n) | Response schema compliance | **BLOCKED** | Tech Lead | n8n workflow not verified |
| B5 | Idempotency dedupe 24h | **BLOCKED** | Tech Lead | not implemented on any layer |

---

## Hard Constraints (must not be violated)

- `AZURSYSTECH_CONTACT_SUBMIT_ENABLED=false` (or equivalent `isFinalIntegrationContractReady() = false`) must remain the rollback-safe default until all B1–B3 are closed.
- No fake success: запрещено изменять no-fake-success boundary.
- Secrets not in repo: `AZURSYSTECH_CONTACT_SUBMIT_TOKEN`, sheet credentials не должны попадать в git.
- No HubSpot scope: этот тикет относится исключительно к Google Sheets пути; HubSpot/CRM интеграция — отдельный scope.

---

## Acceptance Criteria

- AC1: B1 закрыт — live URL задан в VPS `.env` и прочитан кодом.
- AC2: B2 закрыт — production token задан в VPS `.env`, n8n настроен, rotation SOP документирован.
- AC3: B3 закрыт — sheet ID, tab name и write credential зафиксированы и настроены в n8n.
- AC4: B4 закрыт полностью — n8n workflow верифицирован, controlled test пройден, все response codes подтверждены.
- AC5: B5 закрыт — idempotency key генерируется и передаётся, dedupe проверяется в n8n, 24h proof выполнен.
- AC6: rollback-safe default (`AZURSYSTECH_CONTACT_SUBMIT_ENABLED=false` / `isFinalIntegrationContractReady() = false`) сохранён и работоспособен до тестирования.

---

## Next Recommended Actions

1. **Tech Lead / Founder (VPS):** Активировать или подтвердить реальный n8n webhook URL → закрыть B1.
2. **Tech Lead:** Сгенерировать production token → добавить в VPS `.env` → настроить n8n webhook Header Auth → задокументировать rotation SOP → закрыть B2.
3. **Founder:** Создать target Google Sheet, определить tab name → поделиться Service Account → настроить Google Sheets credential в n8n → утвердить column mapping → закрыть B3.
4. **Tech Lead:** Собрать n8n workflow с полным response schema (accepted / temporary_failure / rejected) → выполнить controlled test → закрыть B4.
5. **Tech Lead:** Добавить генерацию `X-Idempotency-Key` в site-side call → реализовать dedupe в n8n workflow → провести 24h proof → закрыть B5.
6. После закрытия всех B1–B5: снять provisional boundary, включить `isFinalIntegrationContractReady() = true` (или env-driven флаг), выполнить production smoke test.

---

## Last updated

`2026-03-19` — initial spec creation, control-layer blocker pass по B1–B5.
