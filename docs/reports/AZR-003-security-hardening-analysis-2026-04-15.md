# AZR-003 Security Hardening Analysis (2026-04-15)

## Scope

Анализ выполнен по итогам проверки и исправлений после внешнего security-аудита (Qwen) для `web`-приложения.

Основной охват:
- `web/src/app/api/chat/route.ts`
- `web/src/app/api/contact/submit/route.ts`
- `web/src/ChatWidget.jsx`
- `web/src/app/health/route.ts`
- `web/next.config.ts`
- `web/src/middleware.ts`
- `web/src/lib/intake-storage.ts`
- `web/package.json` / `web/package-lock.json`
- `.env.vps.example`

## What Was Done

1. Проведена независимая валидация findings из внешнего отчета по фактическому коду.
2. Внесен P0/P1 hardening-pass без архитектурного разворота и без риска поломки текущего SQL-first runtime.
3. Выполнена отдельная verifier-проверка после правок.
4. Обновлены SSOT-артефакты (`memory_bank/progress.md`, `docs/tasklist/azr-003-tasklist.md`).

## Findings Status Matrix

| # | Finding | Final status | Notes |
| --- | --- | --- | --- |
| 1 | In-memory rate limit (chat) | partially fixed | Добавлены cleanup/bounds, но storage всё еще in-memory |
| 2 | No chat input length limit | fixed | Ограничение длины + client-side cap |
| 3 | Prompt injection defense absent | partially fixed | Добавлен pattern-based guard, не полноценный policy engine |
| 4 | No CORS/origin validation | fixed (pragmatic) | Добавлен API middleware c allowlist и safe no-Origin pass-through |
| 5 | No Next-level security headers | fixed | Добавлены app-level security headers в `next.config.ts` |
| 6 | Webhook URL validation missing | fixed | Протокол/host validation для integration base URL |
| 7 | DB SSL not enforced | partially fixed | Добавлен `DATABASE_SSL_MODE`; default оставлен `disable` для совместимости |
| 8 | SQL injection via event_type | not confirmed | Параметризованные queries; отдельный whitelist опционален |
| 9 | Error information leakage | fixed | Упрощены наружные ошибки и логи в runtime-критичных местах |
| 10 | No body size guard | partially fixed | Guard по `content-length` добавлен |
| 11 | Unsanitized chat rendering | fixed | Санитизация/trim/length cap на render path |
| 12 | Honeypot-only anti-spam | partially fixed | Добавлен contact rate limit, но in-memory |
| 13 | Vulnerable dependencies | partially fixed | `next` upgraded to `16.2.3`, prod audit clean; dev tree еще содержит advisories |
| 14 | No app-level HTTPS enforcement | deferred | Осознанно не включено во избежание proxy redirect loops |
| 15 | PII plaintext at rest | deferred | Требует отдельного product/ops решения по retention/encryption |
| 16 | Public health disclosure | partially fixed | В production endpoint возвращает только `{status:"ok"}` |
| 17 | No chat persistence/audit trail | deferred | Таблицы есть, интеграция в flow еще не реализована |

## Decisions Made

- Принят подход "safe incremental hardening": закрывать подтвержденные риски без влияния на текущий deploy/runtime контур.
- Не внедрять в этом проходе потенциально ломающие изменения:
  - forced Postgres TLS по умолчанию;
  - global strict CORS, который блокирует no-Origin/internal flows;
  - app-level HTTPS redirect за reverse proxy.
- Добавлен контролируемый путь к усилению DB TLS через `DATABASE_SSL_MODE`.

## Files / Settings Changed

Ключевые runtime изменения:
- `web/src/app/api/chat/route.ts`
- `web/src/app/api/contact/submit/route.ts`
- `web/src/ChatWidget.jsx`
- `web/src/app/health/route.ts`
- `web/next.config.ts`
- `web/src/middleware.ts`
- `web/src/lib/intake-storage.ts`
- `web/package.json`, `web/package-lock.json`
- `.env.vps.example`

SSOT/operational updates:
- `memory_bank/progress.md`
- `docs/tasklist/azr-003-tasklist.md`

## Validation Artifacts

- `cd web && npm audit --omit=dev --json` -> pass (0 prod vulnerabilities)
- `cd web && npm run check:types` -> pass
- `cd web && npm run build` -> pass

Note:
- `npm run check:ci` по-прежнему падает на pre-existing lint issues в unrelated файлах (`web/src/components/chat-widget.tsx`, `web/src/components/shell/site-header.tsx`).
- Next.js показывает warning, что `middleware` convention deprecated в пользу `proxy`.

## Open Blockers

- Нет жесткого distributed rate-limit backend (Redis/DB) для chat/contact.
- Не включен production DB TLS mode (`DATABASE_SSL_MODE` оставлен совместимым по default).
- PII governance (retention/encryption/access model) не закрыт.
- Не реализован chat audit trail в `intake_conversations*` таблицы.

## Next Recommended Action

1. Включить `DATABASE_SSL_MODE=require` (или `verify-full`) в production после проверки cert-path.
2. Перенести rate-limit state в Redis/DB для multi-instance устойчивости.
3. Перевести `middleware.ts` на `proxy.ts` по новой рекомендации Next.
4. Отдельным тикетом закрыть PII policy (retention + encryption scope).
5. Добавить CI gate на security (`npm audit --omit=dev`) и policy для dev advisories.
