# Project Context - AzurSysTech

## Что это за проект

AzurSysTech - локальный IT-сервис для particuliers и TPE в зоне Nice + 30 km.
Цель запуска: получить первые лиды через понятный сайт, простой contact flow и controlled launch operations.

## Текущее состояние

- Документация по слоям `00_strategy`-`07_ops` в основном заполнена и выровнена.
- Production baseline жив:
  - domain: `azursystech.fr`
  - deploy repo: `oleyna80/azursystech-site`
  - VPS app dir: `/home/dmitrii/projects/azursystech-site`
  - deploy path: `CI -> SSH -> git pull -> docker compose up -d --build`
  - health endpoint `https://azursystech.fr/health` отвечает `200`
- Launch AI mode зафиксирован как `limited_live_intake` and enforced via runtime env flags.
- Website scope closure (`AZR-003-009`), intake activation (`AZR-003-010`), legal baseline (`AZR-003-001`), GBP/readiness (`AZR-003-006`), and go / no-go review (`AZR-003-007`) are completed.
- Current live sequence now proceeds as:
  1. keep `web` as the current website/design/runtime baseline after completed `frontend_mvp -> web` transfer (`AZR-003-012`)
  2. keep backend-first SQL intake on `web` as confirmed runtime baseline (`AZR-003-014` completed)
  3. add AI widget live integration + Telegram contact notification on `web` (`AZR-003-011`, backend events path)
  4. separate deferred improvements from launch-ready baseline (`AZR-003-008`)
  5. move CRM to a later phase
- Existing site chat widget shell remains in the codebase, but live AI-agent handling is deferred until after go / no-go and stable intake operations.
- Public MVP language is fixed as Russian for the russophone audience on the Côte d'Azur.
- Intake architecture pivot is accepted: `web backend -> PostgreSQL` as primary system of record.
- `n8n` and Google Sheets are no longer primary intake baseline; they are optional secondary automation/reporting contour.
- CRM is deferred to phase 2.
- Approved MVP visual direction is `Local Professional`.
- Current operating model is `Tech Lead / Control Tower / Orchestrator` with internal subagents as the primary execution path.
- `RooCode` is retained only as a fallback external coder stream for cases the control tower explicitly chooses.
- Project-local skills may be created as needed; no active baseline depends on `.roo/skills/`.

## Текущий рабочий режим

- Роль текущего агента: `Tech Lead / Control Tower / Orchestrator`
- Основной execution path: internal subagents with stage roles `Reviewer`, `Coder`, `Verifier`
- Рабочий цикл:
  1. Control Tower формулирует stage task
  2. Internal subagent выполняет scoped work для своей роли
  3. Control Tower делает review / acceptance
  4. Follow-up corrections возвращаются через control tower к нужному subagent
- Переход к следующему stage требует explicit user confirmation; внутри stage допускается несколько internal handoff
- К пользователю обращаться только по product/ops decisions, которые нельзя безопасно вывести из SSOT.
- Параллельные stream'ы разрешены:
  - website build
  - backend / SQL intake integration
  - HubSpot CRM
- Все финальные решения stream'ов должны возвращаться в control layer этого проекта.

## Текущий фокус

1. Активный тикет: `AZR-003` (go-live readiness)
2. Предыдущий тикет `AZR-002` (website MVP implementation) — **полностью закрыт** (25/25 задач done)
3. Текущая фаза: post-intake-activation go-live preparation
4. AZR-003 blockers:
   - no open launch-critical blockers remain in control-layer tracking
   - Current execution queue:
     - AZR-003-011: AI widget + Telegram notification on `web` (todo; backend events path)
     - AZR-003-008: deferred separation (todo, depends on 011)

## Что уже сделано в implementation

- Создан `docs/plans/azr-002-implementation-map.md`
- Созданы RooCode skills:
  - `azursystech-page-implementation`
  - `azursystech-form-contract`
  - `azursystech-doc-to-ui-review`
  - `azursystech-safe-ai-runtime`
  - `azursystech-route-mvp-implementation`
  - `azursystech-visual-review`
- Принят MVP route `/contact`:
  - contact methods
  - main lead form
  - `particulier` / `tpe` branching
  - hidden honeypot field
  - public-facing copy cleaned from dev/internal wording
- Site-side submit adapter для `/contact` реализован; исторический downstream path `site -> n8n -> Google Sheets` зафиксирован как previous baseline
- Website scope closure (`AZR-003-009`) выполнен:
  - `/about` trust/founder page completed
  - 4 service landing pages completed: `/services/new-pc-setup`, `/services/wifi-printer`, `/services/tpe-setup`, `/services/onsite-support`
  - legal/privacy readiness pass completed for real-data injection preparation
- Intake activation (`AZR-003-010`) выполнена:
  - live webhook `https://n8n.hardwarelab.org/webhook/azursystech/contact-submit` active
  - Google Sheets sink connected (`intake_leads`)
  - auth / duplicate / append behavior verified by live tests
- Зафиксирован visual baseline для frontend:
  - warm light background
  - dark slate text
  - restrained teal primary accent
  - terracotta secondary accent
  - calm `Local Professional` layout direction
- Исторический `frontend_mvp` использовался как дизайн/template sandbox:
  - business-first landing flow
  - automation module direction
  - Russian copy simplification
  - mobile/header and TPE form simplification
- `frontend_mvp` больше не является активным baseline:
  - дизайн и релевантные наработки перенесены в `web`
  - дальнейшая website product/UI/runtime работа ведется в `web`
  - production/runtime/deploy path остается `web`
- В рамках `AZR-003-012` выполнен и принят baseline-pass `A/A` на стороне `web`:
  - canonical chat cleanup (`chat-widget-shell` как единственный активный shell)
  - dual payload intake для `/api/contact/submit` (`FormData` + `JSON`)
  - `n8n` env compatibility layer (`N8N_WEBHOOK_*` + legacy fallback) с required headers
  - визуальные токены из `frontend_mvp` перенесены в Tailwind v4 `@theme` слой `web/src/app/globals.css`
- В рамках `AZR-003-012` выполнен contact contract parity/sync pass (stages 27-35):
  - contact UI flow в `web` приведен к текущему `frontend_mvp` business-first контру
  - server-side validate/normalize очищены от неактуальных UI-полей; legacy fields оставлены как `null` compatibility layer
  - `wifi -> reseau_local` закреплен как legacy-normalization rule на server-side
  - `code vs docs` drift закрыт в `forms-spec`, `lead-intake-spec`, `azr-003-010-site-n8n-google-sheets`
- Новый публичный телефон `+33 7 80 72 09 94` синхронизирован в рабочих frontend/runtime контурах и актуальных SSOT/docs.
- Обновлен legal/privacy контур в `web`:
  - `/privacy` синхронизирован с `02_website/privacy.md`, добавлен краткий блок про cookies/consent
  - `/legal` синхронизирован с `02_website/mentions_légales.md`
  - добавлена новая русская страница `/terms` (общие условия оказания услуг), ссылка в footer
- В `web` добавлен SQL intake foundation:
  - schema `web/sql/001_intake_schema.sql`
  - storage adapter `web/src/lib/intake-storage.ts`
  - `INTAKE_STORAGE_MODE` (`legacy` / `dual` / `sql_primary`)
  - `contact-submit` route обновлен под SQL write + integration event logging
- AZR-003-014 runtime proof выполнен на VPS:
  - self-hosted PostgreSQL поднят в docker compose с внутренней сетью
  - SQL schema применена, таблицы intake-контуров подтверждены
  - controlled submit дал успешный ответ и подтвердил запись в `intake_leads` + `intake_lead_events`
  - backup/restore runbook и smoke-restore проверены
  - текущий intake runtime baseline подтвержден как `SQL-first`

## Ближайшие шаги

1. AZR-003 go-live:
   - launch blockers and formal `GO` decision are closed in control-layer tracking
2. Next execution:
   - backend notification/export path (Telegram/email/Sheets export policy)
   - live AI widget integration on `web` against backend-first intake
3. CRM phase 2:
   - evaluate HubSpot or another CRM only after launch intake is stable

## Важные операционные факты

- Не возвращаться к GHCR path как к launch baseline без отдельного решения.
- Не ослаблять AI runtime policy:
  - no autonomous outbound sending
  - no pricing commitments
  - no scheduling promises
- `azursystech-site` placeholder history сохранена в branch `placeholder-backup`.

**Last update:** 2026-04-14
