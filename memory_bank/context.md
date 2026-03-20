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
- Launch AI mode зафиксирован как `limited_live_intake` и enforced через runtime env flags.
- Website scope closure (`AZR-003-009`) and intake activation (`AZR-003-010`) are completed; live launch sequence now proceeds as:
  1. close founder-side launch blockers (`AZR-003-001`, `AZR-003-006`)
  2. prepare `AZR-003-007` go / no-go review
  3. add AI widget live integration + Telegram contact notification
  4. move CRM to a later phase
- Existing site chat widget shell remains in the codebase, but live AI-agent handling is deferred until after go / no-go and stable intake operations.
- Public MVP language is fixed as Russian for the russophone audience on the Côte d'Azur.
- Launch intake sink is Google Sheets via `n8n`; CRM is deferred to phase 2.
- Approved MVP visual direction is `Local Professional`.
- Для RooCode добавлены локальные skills в `.roo/skills/`.

## Текущий рабочий режим

- Роль текущего агента: `Tech Lead`
- Основной код пишет `RooCode`
- Рабочий цикл:
  1. Tech Lead формулирует task
  2. RooCode реализует
  3. Tech Lead делает review
  4. Follow-up corrections возвращаются RooCode
- К пользователю обращаться только по product/ops decisions, которые нельзя безопасно вывести из SSOT.
- Параллельные stream'ы разрешены:
  - website build
  - VPS / n8n integration
  - HubSpot CRM
- Все финальные решения stream'ов должны возвращаться в control layer этого проекта.

## Текущий фокус

1. Активный тикет: `AZR-003` (go-live readiness)
2. Предыдущий тикет `AZR-002` (website MVP implementation) — **полностью закрыт** (25/25 задач done)
3. Текущая фаза: post-intake-activation go-live preparation
4. AZR-003 blockers:
   - AZR-003-001: legal identity data (in_progress, founder)
   - AZR-003-006: GBP/review readiness (todo, founder)
   - AZR-003-007: go/no-go review (todo, depends on 001+006)
   - Later sequencing / post-launch queue (not current launch blockers):
     - AZR-003-011: AI widget + Telegram notification (todo, after 007)
     - AZR-003-008: deferred separation (todo, depends on 007+011)

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
- Site-side submit adapter для `/contact` уже реализован и live downstream path `site -> n8n -> Google Sheets` активирован
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

## Ближайшие шаги

1. AZR-003 go-live:
   - ждать founder по AZR-003-001 (legal) и AZR-003-006 (GBP)
   - после закрытия — go/no-go review (AZR-003-007)
2. После go / no-go:
   - live AI widget integration
   - Telegram notification for new contact/intake events
3. CRM phase 2:
   - evaluate HubSpot or another CRM only after launch intake is stable

## Важные операционные факты

- Не возвращаться к GHCR path как к launch baseline без отдельного решения.
- Не ослаблять AI runtime policy:
  - no autonomous outbound sending
  - no pricing commitments
  - no scheduling promises
- `azursystech-site` placeholder history сохранена в branch `placeholder-backup`.

**Last update:** 2026-03-20
