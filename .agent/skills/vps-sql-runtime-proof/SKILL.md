---
name: vps-sql-runtime-proof
description: Gate-проверка SQL-first runtime на VPS с формальным PASS/FAIL.
---

# Skill: VPS SQL Runtime Proof

## Triggers
- "runtime proof"
- "проверь SQL на VPS"
- "gate A/B/C/D/E"
- "подтверди sql_primary"

## Objective
Подтвердить рабочий контур `SQL-first` без изменения кода:
- env contract
- schema apply
- controlled submit
- persistence evidence (`intake_leads` + `intake_lead_events`)

## Workflow
1. Preflight:
   - `docker compose -f docker-compose.vps.yml ps`
   - `/health` check
2. Env contract:
   - `INTAKE_STORAGE_MODE`
   - `DATABASE_URL`
   - `AZURSYSTECH_CONTACT_SUBMIT_ENABLED`
3. Schema:
   - apply `web/sql/001_intake_schema.sql`
   - check `intake_*` tables
4. Functional submit:
   - POST `/api/contact/submit` with unique marker
   - capture HTTP code + response body
5. Persistence:
   - find lead by marker in `intake_leads`
   - confirm events in `intake_lead_events`
6. Verdict:
   - Gate A/B/C/D/E with PASS/FAIL and fail command if any

## Constraints
- Без code changes.
- Секреты не выводить в отчет.
- Если `psql` отсутствует на хосте, использовать `postgres:16-alpine` как client container.

## Output
- Verdict: `PASS` / `FAIL`
- Evidence pack:
  1. What was done
  2. Decisions made
  3. Files / settings changed
  4. Open blockers
  5. Next recommended action
