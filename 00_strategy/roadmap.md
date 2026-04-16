# Roadmap: AzurSysTech (SSOT-aligned)
_version: v1.0_
_owner: Tech Lead / Control Tower_
_execution model: stage-gated orchestration with internal subagents (`Reviewer` -> `Coder` -> `Verifier`)_
_last sync: 2026-04-16_

---

## 1. Цель и рамки

Собрать и стабилизировать рабочий локальный lead engine для AzurSysTech на базе текущего production baseline:

- сайт и runtime baseline: `web` (Next.js);
- intake baseline: backend-first SQL (`web -> PostgreSQL`);
- `n8n` + Google Sheets: optional secondary automation/export contour;
- CRM: deferred to phase 2.

Business positioning в launch-контуре: business-first (TPE/малый бизнес) с fallback intake для non-business запросов.

---

## 2. Текущий baseline

### 2.1 Runtime и intake

- Current deploy/runtime target: `web`.
- Primary intake path: `/api/contact/submit` in `web` with SQL-first persistence.
- System of record: PostgreSQL (`intake_leads`, `intake_lead_events`, `intake_conversations`, `intake_conversation_messages`).
- `n8n`/Sheets не являются обязательным launch intake path; используются как secondary contour при необходимости.

### 2.2 Операционная модель выполнения

- Control layer: `Tech Lead / Control Tower`.
- Execution path: internal subagents.
- Обязательный stage gate: переход к следующему stage только после explicit approval.
- Любой AI output считается draft до explicit approval.

---

## 3. Статус AZR-003 (на текущий момент)

### 3.1 Completed launch-critical path

- `AZR-003-001` - done
- `AZR-003-006` - done
- `AZR-003-007` - done
- `AZR-003-010` - done (historical launch activation path)
- `AZR-003-012` - done
- `AZR-003-014` - done (SQL-first runtime proof confirmed on VPS)

### 3.2 Open queue (execution order)

1. `AZR-003-013` - `todo` (contact/phone consistency sync across current `web` baseline and docs)
2. `AZR-003-011` - `todo` (AI widget live integration + Telegram notification on `web`, backend events path)
3. `AZR-003-008` - `todo` (deferred improvements separation; depends on `AZR-003-011`)

---

## 4. Phased roadmap (practical)

### Phase 0 - Stabilized launch baseline (completed)

Acceptance:

- `web` закреплен как unambiguous runtime baseline.
- SQL-first intake работает и подтвержден runtime-proof.
- Legal/privacy/terms и business-first copy baseline синхронизированы.

Status: completed.

### Phase 1 - Post-launch execution (in progress)

Scope:

- закрыть `AZR-003-013`;
- выполнить `AZR-003-011`;
- после этого закрыть `AZR-003-008`.

Acceptance:

- контактные данные консистентны в `web` и текущих docs;
- AI widget/Telegram интегрированы без нарушения launch AI policy;
- deferred backlog отделен от launch-critical queue.

Status: in progress.

### Phase 2 - CRM and extended automation (deferred)

Scope:

- CRM onboarding (HubSpot or alternative) после стабилизации intake и AI widget path;
- расширение automation/reporting поверх SQL baseline (включая optional n8n/Sheets scenarios).

Acceptance:

- CRM не блокирует primary intake path;
- SQL baseline остается source of truth;
- интеграции не нарушают stage-gated operating model.

Status: deferred.

---

## 5. Constraints и non-goals

- Не переключать deploy/runtime target с `web` без отдельного решения control layer.
- Не возвращать `n8n`/Sheets в статус mandatory primary intake.
- Не смешивать launch-critical и deferred scope в одном execution pass.
- Не ослаблять AI runtime policy (no autonomous outbound, no pricing/scheduling commitments).
