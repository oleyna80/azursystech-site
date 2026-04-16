---
name: security-audit-triage
description: Быстрая валидация внешнего security-ревью по реальному коду с классификацией confirmed/partial/not confirmed и приоритизацией безопасного remediation scope.
---

# Skill: Security Audit Triage

## Triggers
- "проверь security аудит"
- "валидация отчета"
- "подтверди findings"

## Objective
Отделить подтвержденные риски от гипотез и подготовить реалистичный backlog фиксов без over-engineering.

## Workflow
1. Собрать attack surface и точки входа (API, storage, proxy, deps).
2. Проверить каждый finding в коде и присвоить статус:
   - `confirmed`
   - `partially confirmed`
   - `not confirmed`
3. Пересчитать severity с учетом текущего runtime контекста проекта.
4. Сформировать минимальный safe remediation set (P0/P1) и deferred set (P2).
5. Зафиксировать результат в report + ссылками на файлы.

## Constraints
- Reviewer-mode: read-only до explicit подтверждения на implementation.
- Не копировать severity из внешнего отчета без проверки.
- Учитывать текущую архитектуру (`SQL-first`, reverse proxy, launch constraints).

## Output
- Findings matrix (`status`, `adjusted severity`, `evidence`)
- P0/P1 remediation scope
- Explicit list of risky changes that can break runtime
