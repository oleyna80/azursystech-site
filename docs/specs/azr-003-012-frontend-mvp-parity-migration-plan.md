# SPEC: AZR-003-012 frontend_mvp Parity/Migration Planning

## Current Outcome (2026-04-13)

`AZR-003-012` is closed for baseline-selection purposes.

- Current website/design/runtime/deploy baseline: `web`
- `frontend_mvp`: historical/reference only
- Relevant design and implementation work from `frontend_mvp` has been transferred into `web`
- Next launch-critical implementation target: `AZR-003-011` on `web`

The planning content below is retained as historical rationale for the parity/migration step.

## Problem

`frontend_mvp` принят как текущий template baseline для website build stream, но production/runtime baseline пока остается на `web`.
Без bridge-плана есть риск baseline drift перед `AZR-003-011` (AI widget + Telegram notification).

## Goal

Зафиксировать один clear migration path между `frontend_mvp` и `web` для launch-critical зон:
- contact flow
- chat boundary
- legal/privacy routes
- header/footer/nav и core CTA paths

Без:
- deploy/infra switch
- изменения CRM/integration contracts в этом шаге

## Decision

Выбран путь: **incremental parity** (не single-cutover).

Причина:
- drift затрагивает не только UI, но и runtime contracts;
- поэтапное выравнивание снижает риск регрессий в launch-critical paths;
- проще верифицировать каждый шаг отдельно.

## In Scope

1. Gap register между `frontend_mvp` и `web` по launch-critical зонам.
2. Фиксация migration path (`incremental parity`).
3. Readiness gate перед запуском `AZR-003-011`.

## Out of Scope

- Переключение production deploy baseline с `web` на `frontend_mvp`.
- Изменения VPS/n8n/Telegram/CRM инфраструктуры.
- Полный route-level parity для всех legacy страниц как обязательное условие этого шага.

## Gap Register (Launch-Critical)

| Gap ID | Zone | `web` baseline | `frontend_mvp` state | Severity | Blocks AZR-003-011 |
|---|---|---|---|---|---|
| G1 | Contact submit endpoint | `POST /api/contact/submit` + validated transport flow | `POST /api/contact` with local JSON submit | High | Yes |
| G2 | Anti-spam field | honeypot field `website` in canonical form contract | honeypot field `honeypot` | High | Yes |
| G3 | Chat boundary | route-aware shell model in `web` | active `/api/chat` fetch expectation | High | Yes |
| G4 | Legal route slugs | `/privacy` + `/legal` | `/privacy-policy` + `/legal-info` | High | Yes |
| G5 | Core CTA path semantics | route-based CTA (`/contact`, etc.) | anchor-based CTA (`#contact`, etc.) | Medium | Yes |
| G6 | Header/footer nav model | route hub model | landing-anchor model | Medium | No (phase-2 polish) |
| G7 | Route surface breadth | multi-page surface in `web` | single-landing + legal views | Medium | No (if launch-critical contracts are aligned) |

## Incremental Parity Plan

### Phase A (Contract Parity First, mandatory)

1. Align contact submit boundary:
- unify submit endpoint contract against canonical `web` path/shape
- keep launch-safe fallback behavior unchanged

2. Align anti-spam contract:
- normalize honeypot field name to the canonical contract

3. Align legal route baseline:
- canonicalize legal/privacy slugs (`/privacy`, `/legal`) or add explicit aliases with canonical behavior

4. Align chat runtime assumption:
- choose one runtime model (shell-only vs live backend route) and lock it in chosen baseline

### Phase B (Shell/Navigation Parity, targeted)

1. Ensure header/footer/core CTA paths are baseline-consistent for launch.
2. Preserve stable public contacts (`phone`, `WhatsApp`, `email`) and legal visibility.

### Phase C (Go/No-Go for AZR-003-011)

Execute `AZR-003-011` only when readiness gate below is fully green.

## Readiness Gate Before `AZR-003-011`

`AZR-003-011` can start only when all checks pass:

1. Contact flow gate:
- endpoint and payload contract are canonicalized on selected baseline
- submit fallback behavior is verified (no fake success)

2. Spam gate:
- honeypot field and validation semantics are aligned to canonical contract

3. Chat gate:
- one runtime model is explicitly selected and verified on selected baseline

4. Legal gate:
- legal/privacy route behavior is canonicalized and publicly reachable

5. Navigation/CTA gate:
- primary CTA path to contact remains reliable and user-visible

6. Validation gate:
- `npm run build` passes on selected baseline
- smoke-check for contact + legal + chat boundary is documented

## Acceptance Criteria (for AZR-003-012)

- AC1: explicit gap register exists for launch-critical zones between `frontend_mvp` and `web`.
- AC2: one migration strategy is fixed (`incremental parity`).
- AC3: readiness gate is defined for when `AZR-003-011` can be executed without baseline drift.

## Risks

- If contract parity is skipped, `AZR-003-011` may be implemented against a non-canonical boundary and create launch regressions.
- If legal route canonicalization is skipped, public/legal consistency may degrade after baseline alignment.
- If chat model is not fixed early, integration work can split between incompatible assumptions.
