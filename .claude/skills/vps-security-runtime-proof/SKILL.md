---
name: vps-security-runtime-proof
description: "Формальная gate-проверка security-hardening на VPS: persistent limiter, DB SSL mode, webhook allowlist, contact e2e и SQL-evidence."
user-invocable: true
allowed-tools:
  - Read
  - Bash
---

# Skill: VPS Security Runtime Proof

## Triggers
- "проверь security runtime на VPS"
- "подтверди persistent limiter"
- "post-hardening proof"
- "закрой security verification stage"

## Objective
Подтвердить, что security-фиксы реально работают в production runtime, а не только в коде.

## Workflow
1. Preflight:
   - `docker compose -f docker-compose.vps.yml ps`
   - `curl -sSI https://azursystech.fr/health | head -n 1`
2. Env/runtime contract:
   - проверить в `app`: `NODE_ENV`, `DATABASE_SSL_MODE`, `AZURSYSTECH_CONTACT_SUBMIT_ALLOWED_HOSTS`.
3. DB SSL probe from app:
   - выполнить in-container Node/pg probe и зафиксировать `DB_SSL_REQUIRE_PROBE_OK`.
4. Persistent limiter proof:
   - выбрать фиксированный test IP;
   - выполнить 6 запросов `/api/chat` (ожидаемо `400 x5`, затем `429`);
   - `restart app`;
   - 7-й запрос с тем же IP должен остаться `429`.
5. Contact e2e proof:
   - отправить submit с уникальным email marker;
   - проверить SQL-события: `lead.submitted`, `integration.accepted`.
6. Limiter storage evidence:
   - snapshot `api_rate_limits` по scope (`chat`, `contact_submit`).
7. Вердикт по gate:
   - `PASS` только если шаги 3-6 подтверждены;
   - иначе `FAIL` с первым failing step и командой.

## Constraints
- Без code changes в этом skill (Verifier-only).
- Использовать только синтетические тестовые данные.
- Не удалять тестовые leads без отдельного решения (audit trail).

## Output
- Gate verdict: `PASS` / `FAIL`.
- Evidence:
  1. What was done
  2. Decisions made
  3. Files / settings changed
  4. Open blockers
  5. Next recommended action

## Handoff
- **Success condition**: все проверки пройдены или open blockers задокументированы.
- **Next**: Control Tower (security report to Owner)
- **Auto-proceed**: 🟢 YES на staging/test; 🔴 NEVER на production
- **Hard stop**: 🔴 YES на production — skill пишет test-данные через API и выполняет SQL queries; требует Owner approval перед запуском на production VPS.
