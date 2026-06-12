---
name: project-estimation
description: Классификация сложности и оценка effort для новых проектов/задач. Используется в Stage 0 (Plan & Discover) для формирования estimate.
user-invocable: true
allowed-tools:
  - Read
  - Bash(git *)
  - Bash(ls *)
  - Bash(find *)
  - Bash(grep *)
  - Bash(cat *)
  - Bash(rg *)
  - Bash(jq *)
---

# Skill: Project Estimation

## Triggers
- "оцени проект", "сколько займет", "estimate"
- начало планирования нового проекта или крупной задачи
- Stage 0 · Plan & Discover — автоматически при scope > 3 файлов

## Objective
Классифицировать проект по сложности, оценить effort в агентских сессиях и Owner-часах,
выявить risk factors, и дать итоговый estimate.

## Workflow

### Step 1: Scope Analysis

Определить write-set проекта:
- Количество файлов
- Типы изменений: new route, schema change, UI, API, config, docs
- Зависимости: DB migrations, external APIs, deploy changes
- Интеграции: сколько систем затронуто (web, admin, VPS, DB, AI)

### Step 2: Complexity Classification

| Tier | Критерии | Типичные проекты |
|---|---|---|
| **Micro** | ≤3 файла, нет route/schema/API | typo fix, README, config, copy change |
| **Small** | 4-8 файлов, 1 система, нет новых schema | landing page, UI component, SEO, form tweak |
| **Medium** | 8-20 файлов, 2-3 системы, есть schema/API | schema-bound route, API + UI, admin feature |
| **Large** | 20+ файлов, 3+ систем, DB migration + deploy | full feature stack (intake, persistence, admin, deploy) |

### Step 3: Effort Estimation

Baseline estimates (adjustable по мере накопления benchmarks):

| Tier | Agent Sessions | Owner Review | Calendar Time | Verification Tier |
|---|---|---|---|---|
| **Micro** | 1 | 15-30 min | same day | Lite |
| **Small** | 2-3 | 1-3 hrs | 1-2 days | Standard |
| **Medium** | 4-8 | 4-8 hrs | 3-5 days | Full |
| **Large** | 8-15 | 1-3 days | 1-3 weeks | Full |

> "Agent Session" = одна полная сессия Codex/Claude/Gemini с планированием,
> implementation, и verification. Примерно 30-60 min wall clock.

### Step 4: Risk Factor Multipliers

Проверить и применить множители:

| Risk Factor | Multiplier | Когда применять |
|---|---|---|
| **Unknown tech** | ×1.5 | Технология/API не использовались раньше |
| **Unclear requirements** | ×1.5-2.0 | Клиент не знает что хочет, нет spec |
| **External dependencies** | ×1.3 | Ждём ответ от API provider, 3rd party |
| **Production data risk** | ×1.3 | DB migration с данными, zero-downtime |
| **First project of type** | ×1.5 | Нет бенчмарка для такого типа задач |
| **Multi-agent coordination** | ×1.2 | >3 параллельных agent tasks |

**Формула**: `Adjusted Estimate = Base Estimate × max(Risk Multipliers)`

Не суммировать, а брать максимальный — иначе оценка inflates нереалистично.

### Step 5: Estimate Output

Сформировать estimate в формате:

```markdown
## Project Estimate

**Project**: [name]
**Complexity Tier**: [Micro/Small/Medium/Large]
**Verification Tier**: [Lite/Standard/Full]

### Scope
- Files: [count] ([new]/[modify])
- Systems: [list: web, admin, VPS, DB, AI]
- Key changes: [brief list]

### Effort
- Agent sessions: [range]
- Owner review: [range]
- Calendar time: [range]

### Risk Factors
- [factor]: ×[multiplier] — [reason]
- Adjusted estimate: [range after multiplier]

### Confidence
- [High/Medium/Low] — [reason]

### Upwork Pricing Guidance
- Hourly: [Owner hours] × rate
- Fixed: [calendar time]-based, add 20% buffer
- Milestone split: [suggested milestones]
```

## Benchmarks (Update After Each Project)

Записывать фактические данные после завершения проекта:

```markdown
| Date | Project | Tier | Estimated | Actual | Delta | Notes |
|---|---|---|---|---|---|---|
| YYYY-MM-DD | [name] | [tier] | [sessions] | [sessions] | [+/-] | [learnings] |
```

Хранить в `docs/reference/estimation-benchmarks.md`.
Со временем benchmarks заменяют baseline estimates из Step 3.

## Guardrails

- Не давать точную цену без spec. Давать range.
- Если confidence = Low — рекомендовать платный discovery first.
- Не занижать estimate чтобы "выглядеть конкурентоспособно". Честная оценка → меньше stress.
- На Upwork: фиксированная цена = estimate × 1.2 (buffer). Hourly = без buffer.

## Handoff
- **Success condition**: estimate с tier, effort, risks, confidence сформирован.
- **Next**: Plan & Discover продолжается с учётом estimate.
- **Auto-proceed**: 🟢 YES
- **Hard stop**: NO
