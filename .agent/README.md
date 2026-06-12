# .agent/ — Agent Layer

> Navigation guide for the AzurSysTech agent system.

---

## Quick Start

1. Read [`AGENTS.md`](../AGENTS.md) (root) — operating contract, autonomy policy, hard stops.
2. Read `.agent/workflows/sdd-protocol.md` — stage flow, verification tiers, quick-fix rules.
3. Read `.agent/ROSTER.md` — agent/mode and skill routing.
4. Read `memory_bank/context.md` — current focus and next gate.
5. Read `memory_bank/progress.md` — rolling status log.
6. Read `memory_bank/decisions.md` — ADRs and durable decisions.
7. Pick the right skill from the index below.

For live task status, use `docs/tasklist/<ticket>.tasklist.md`. Treat
`docs/plans/*` as plan/reference docs and `docs/reports/*` as historical evidence
unless the active tasklist explicitly confirms their status.

---

## Context Hygiene

Use `.codexignore` for Codex-specific indexing/noisy-read exclusions and
`.agentsignore` as the vendor-neutral advisory list for external reviewers.
These files reduce context noise; they do not replace the required SSOT read set
above and are not a security boundary.

---

## Directory Structure

```
.agent/
├── README.md              ← you are here
├── ROSTER.md              ← agent/mode registry
├── skills/                ← skill library (54 skills)
│   ├── task-decomposition/
│   ├── reviewer/
│   ├── scoped-coder/
│   ├── verifier/
│   ├── intake-agent-foundation/
│   ├── azursystech-contract-verifier/
│   ├── ssot-sync-closeout/
│   ├── vps-registry-pull-deploy/
│   └── ...
└── workflows/
    └── sdd-protocol.md    ← stage flow and transition rules
```

---

## Skill Index

| Skill | When to use |
|---|---|
| `project-estimation` | Оценка сложности, effort, risks для нового проекта |
| `task-decomposition` | Разбить цель на атомарные задачи с AC |
| `subagent-mission-brief` | Сформировать scoped mission brief для read-only/write-capable subagent |
| `agent-operations-review` | Optional sanitized review of approval friction, tooling blockers, and outcomes |
| `technical-discovery` | Исследовать структуру проекта перед реализацией |
| `architecture-discovery` | Optional pre-SDD architecture research and brief |
| `reviewer` | Read-only multi-dimension review with evidence and advisory findings |
| `scoped-coder` | Implementation inside an approved write-set, with handoff evidence |
| `verifier` | Tiered verification gate with READY/BLOCKED verdict and check evidence |
| `intake-agent-foundation` | Работа с AI intake persistence, `/api/chat`, `/api/brief` |
| `azursystech-contract-verifier` | Hard review: schema/UI/API/SSOT после implementation |
| `azursystech-schema-route` | Новые маршруты с schema-bound validation |
| `ssot-sync-closeout` | Обновить memory_bank и tasklist после стейджа |
| `memory-bank-manager` | Поддержание `memory_bank/` актуальным |
| `scoped-commit-guard` | Commit только по whitelist файлов в dirty worktree |
| `systematic-debugging` | 4-phase root cause debugging перед фиксами |
| `shell-context-guard` | PowerShell vs bash диагностика |
| `graphify-code-map` | Optional local no-LLM code-map helper for broad code slices |
| `security-audit-triage` | Валидация security findings, remediation backlog |
| `security-hardening-pass` | Применение P0/P1 security фиксов |
| `security-verification-gate` | Финальная проверка security изменений |
| `vps-registry-pull-deploy` | Production deploy через GHCR image |
| `vps-deploy-recovery` | Восстановление VPS runtime/compose state |
| `vps-db-tunnel-ops` | SSH-туннель к production DB |
| `vps-repo-sync` | Синхронизация VPS git checkout |
| `vps-ghcr-credential-rotation` | Ротация GHCR credentials |
| `vps-security-runtime-proof` | Проверка VPS security runtime |
| `vps-sql-runtime-proof` | Проверка SQL runtime на VPS |
| `contact-drift-audit` | Аудит дрейфа контактных данных |
| `copy-review` | Review brand copy и контента |
| `index-exclusions-manager` | Управление SEO индексацией |
| `local-seo-ops` | Local SEO операции |
| `lead-response-ops` | Обработка лидов и ответы |
| `nextjs-seo-build-verifier` | Проверить SEO/JSON-LD/canonical/hreflang в compiled Next.js output |
| `npm-audit-wsl` | Триаж npm audit в WSL с учетом известных Next.js/PostCSS advisory |
| `social-automation-ops` | Facebook/social automation |
| `ai-runtime-ops` | Реестр агентов, промпты, runtime |
| `telegram-webhook-gate` | Telegram webhook receive/registration/send gates |
| `wsl-browser-preflight` | Проверить WSL/browser/dev-server prerequisites перед browser verification |
| `theme-factory` | Generate, select, and apply curated themes for showcase demo sites |
| `brand-guidelines` | Apply AzurSysTech brand colors, typography, and voice to any artifact |
| `frontend-design` | Create distinctive, production-grade frontend interfaces — avoids generic AI aesthetics |
| `emil-design-eng` | UI polish, animation decisions, and invisible details — on-demand per task |
| `impeccable` | 23 design commands + 7 reference files + CLI anti-pattern detector (`.claude/skills`) |
| `taste-skill` | Anti-slop: brief inference, 3 param dials (variance/motion/density), 10+ presets |
| `minimalist-skill` | Clean editorial UI: warm monochrome, flat bento grids, muted pastels |
| `soft-skill` | High-end agency look: premium fonts, spacing, shadows — blocks cheap AI defaults |
| `brutalist-skill` | Swiss typography + industrial: rigid grids, extreme type scale, analog degradation |
| `redesign-skill` | Audit & upgrade existing websites to premium quality |
| `output-skill` | Force complete unabridged output — no placeholders, clean token-limit splits |
| `imagegen-frontend-web` | Generate section-level design reference images (1 per section) |
| `image-to-code-skill` | Convert design reference images to production code |

---

## Autonomy Reminder

See `AGENTS.md` → Autonomy Policy.
Skills auto-proceed to the next stage unless a Hard Stop condition is met.
Standard pipeline: 4 stages. Quick-fix pipeline: implement → inline sync → done.
Verification tiers: Lite / Standard / Full — assigned in Plan stage.
