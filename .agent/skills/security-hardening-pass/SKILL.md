---
name: security-hardening-pass
description: Выполнение scoped security-фиксов в web-runtime (chat/contact/storage/config) с минимальным риском регрессий и обязательной проверкой совместимости с текущим deploy-контуром.
---

# Skill: Security Hardening Pass

## Triggers
- "устрани security findings"
- "сделай hardening"
- "закрой P0/P1"

## Objective
Реализовать подтвержденные hardening-фиксы в узком scope, сохранив стабильность production runtime.

## Workflow
1. Зафиксировать scope правок по файлам до начала edits.
2. Внести P0/P1 изменения с backward-compatible default behavior.
3. Избегать архитектурных поворотов без отдельного решения (Redis migration, encryption-at-rest, etc.).
4. Прогнать минимум:
   - `npm run check:types`
   - `npm run build`
   - `npm audit --omit=dev --json`
5. Сформировать остаточные риски и deferred backlog.

## Constraints
- Не ломать текущий reverse-proxy/TLS termination flow.
- Не включать strict policies, которые могут блокировать no-Origin/internal traffic, без explicit решения.
- Любые env-зависимые ужесточения делать через feature/env flags с безопасным default.

## Output
- Changed files
- AC status
- Commands run + pass/fail
- Residual risks + deferred items
