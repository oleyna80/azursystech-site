# Agent Roster (azursystech)

Роли и skills для разработки маркетинг+ops+AI-контуров.

## Roles (operational)

| Role | Platform/Mode | Primary Responsibility | SLA (first response) |
| --- | --- | --- | --- |
| Tech Lead | Codex | Архитектура, Spec/Plan, приоритеты, review | P0: 15m, P1: 2h, P2: 24h |
| Coder | RooCode/Code | Реализация задач в узком scope | P0: 30m, P1: 4h, P2: 24h |
| Integration Lead | Codex | Координация VPS/n8n integration stream | P0: 30m, P1: 4h, P2: 24h |
| CRM Lead | Codex | Координация HubSpot CRM stream | P0: 30m, P1: 4h, P2: 24h |
| Content Strategist | Codex/RooCode Ask | Копирайт, tone-of-voice, контентные структуры | P0: 30m, P1: 4h, P2: 24h |
| Lead Ops | Codex | Процессы intake/reply/escalation | P0: 10m, P1: 1h, P2: 8h |
| Reviewer | Codex или RooCode Debug | Проверка AC, риски, регрессии | P0: 30m, P1: 4h, P2: 24h |

## Role Charters

### Tech Lead
- Zone: архитектура, scope control, приоритизация, итоговое решение по trade-offs.
- Input: user request, `AGENTS.md`, `memory_bank/*`, `docs/specs/*`, `docs/plans/*`.
- Output: spec/plan/tasklist, handoff в реализацию, review verdict.
- SLA note: для P0 handoff в течение 15 минут.

### Coder
- Zone: реализация только в рамках согласованного scope.
- Input: ticket + AC + handoff от Tech Lead.
- Output: изменения файлов, локальная валидация, отчет по AC.
- SLA note: для P0 старт реализации в течение 30 минут.

### Integration Lead
- Zone: VPS runtime, n8n, webhook contracts, integration sequencing.
- Input: integration goals, deploy constraints, reports от VPS/n8n stream.
- Output: следующий integration step, blockers, accepted integration decisions.
- SLA note: P1 synthesis в течение 4 часов.

### CRM Lead
- Zone: HubSpot pipeline, properties, private app readiness, CRM object model.
- Input: project taxonomy, CRM requirements, reports from HubSpot stream.
- Output: accepted CRM setup decisions, field mapping, blockers.
- SLA note: P1 synthesis в течение 4 часов.

### Content Strategist
- Zone: тексты, CTA, тональность, структура контента.
- Input: brand + positioning + offer stack + канал публикации.
- Output: готовый draft и замечания по рискам messaging.
- SLA note: P1 draft в течение 4 часов.

### Lead Ops
- Zone: lead intake, triage, response flow, approval/escalation.
- Input: входящие лиды, CRM/funnel требования, правила эскалации.
- Output: классификация лида, first reply draft, next action.
- SLA note: P0 реакция на лид до 10 минут.

### Reviewer
- Zone: AC verification, регрессии, риски перед релизом/публикацией.
- Input: diff, tasklist, validation output.
- Output: APPROVED / NEEDS_CHANGES / BLOCKED с причинами.
- SLA note: P1 review в течение 4 часов.

## Skills

| Skill | File | Trigger |
| --- | --- | --- |
| Technical Discovery | `.agent/skills/technical-discovery.md` | "исследуй", "проанализируй" |
| Task Decomposition | `.agent/skills/task-decomposition.md` | "разбей на задачи", "tasklist" |
| Copy Review | `.agent/skills/copy-review.md` | "проверь копирайт", "tone review" |
| Lead Response Ops | `.agent/skills/lead-response-ops.md` | "ответ лидy", "lead routing" |
| Local SEO Ops | `.agent/skills/local-seo-ops.md` | "local seo", "gbp" |
| AI Runtime Ops | `.agent/skills/ai-runtime-ops.md` | "агент runtime", "prompts", "registry" |
| Memory Bank Manager | `.agent/skills/memory-bank-manager.md` | "update memory bank" |

## Core Workflow

- `workflows/sdd-protocol.md` - цикл Spec -> Plan -> Task -> Code -> Close.
- Handoff protocol: `docs/reports/AGENT_HANDOFF_TEMPLATE.md`.

## Parallel Stream Model

- `Tech Lead` acts as control tower.
- Parallel streams allowed:
  - `Website Build Stream`: Tech Lead -> Coder -> Reviewer
  - `VPS / n8n Stream`: Tech Lead or Integration Lead -> VPS/n8n agent
  - `HubSpot CRM Stream`: Tech Lead or CRM Lead -> HubSpot agent
- Stream outputs must return to control tower before SSOT is considered updated.
- Streams should not directly redefine:
  - priorities
  - active ticket
  - canonical taxonomy
  - deployment model
  - launch policy

## Handoff Matrix

| From | To | Trigger | Mandatory artifacts |
| --- | --- | --- | --- |
| Tech Lead | Coder | Spec/Plan approved, task ready | ticket, AC, file scope, constraints |
| Coder | Reviewer | Implementation complete | changed files, validation commands, residual risks |
| Reviewer | Tech Lead | NEEDS_CHANGES or BLOCKED | issue list by severity |
| Tech Lead | Integration Lead | integration stream activation | objective, constraints, current infra state |
| Integration Lead | Tech Lead | integration milestone reached | decision summary, settings touched, blockers |
| Tech Lead | CRM Lead | CRM stream activation | CRM objective, taxonomy references, constraints |
| CRM Lead | Tech Lead | CRM milestone reached | pipeline/properties summary, blockers, next step |
| Content Strategist | Reviewer | Content draft complete | draft text, source references, tone checks |
| Lead Ops | Tech Lead | Escalation or policy ambiguity | lead summary, escalation reason, urgency |
