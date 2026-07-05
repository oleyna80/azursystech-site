# Sprint Retro — SDLC compliance, subagent usage, skills audit

Date: 2026-07-05
Scope: WB-2026-07-05-portfolio, WB-2026-07-05-critic-gate-fixes, WB-2026-07-05-sdlc-layer-commit (one session)

## 1. SDLC compliance scorecard

| Stage | portfolio (standard) | critic-gate-fixes (lite) | sdlc-layer-commit (lite) |
|---|---|---|---|
| Plan & Discover | ✅ Explore + Plan agents, Owner questions, approved plan | ✅ designed in retro discussion | ✅ inventory inline |
| Skill Routing Gate | ❌ **not performed** | ❌ not performed | ❌ not performed |
| Critic (Stage 0.5) | ✅ critic → SUPPLEMENT, report | ✅ SKIPPED w/ Owner approval, logged | ✅ SKIPPED w/ Owner approval, logged |
| GPT critic | ✅ attempted → DEGRADED (Codex quota), honest per contract | n/a | n/a |
| Implementation | ❌ **Control Tower wrote all 14 files itself** (SDLC default: scoped-coder for 4+ files / production / security-adjacent CSP) | ⚠️ inline (1 file — quick-fix path, justified) | ✅ inline (git curation is orchestrator work) |
| Verification | ⚠️ **inline by Control Tower**, not verifier agent — implementer verified own work; evidence itself was strong (build, 85 tests, smoke, CSP, Playwright) | ⚠️ inline payload tests (adequate for lite) | ✅ secret scan + inventory, report |
| SSOT Sync | ✅ log, reports; FILE_REGISTRY/PROJECT_MAP not touched (borderline: no new top-level dirs) | ✅ | ✅ |

**Verdict:** процессные гейты (critic, лог, отчёты, honest DEGRADED) соблюдены хорошо; исполнение — нет: Control Tower сам реализовал и сам верифицировал крупный WB, Skill Routing Gate пропущен во всех трёх WB.

## 2. Subagent usage stats (session)

| Agent | Runs | Model | Value |
|---|---|---|---|
| Explore | 2 | inherit / haiku | codebase recon, skills inventory — high value, cheap |
| Plan | 1 | inherit | implementation plan — high value |
| critic | 1 | sonnet-4-6 (pinned) | caught sitemap.test.ts + forced mobile-menu check → found real prod bug |
| gpt-critic | 1 | GPT via Codex | zero value (quota) but honest DEGRADED |
| scoped-coder | **0** | — | 14 files written in orchestrator window |
| verifier | **0** | — | build/tests/smoke/Playwright in orchestrator window |

Context hot-spots that should have been in subagent windows: ~15 full file reads, 14 file writes, build/test logs, **6 screenshots (images — heaviest context items)**, Playwright snapshots.

## 3. Recommendations — orchestrator context hygiene

1. **Rule: после одобрения плана Control Tower не пишет код.** scoped-coder (sonnet) реализует write-set; verifier (sonnet) верифицирует; оркестратор — только маршрутизация, гейты, консолидация, Owner-коммуникация.
2. **Браузерные смоуки и скриншоты — только внутри verifier**; в оркестратор возвращается вердикт + пути к файлам, не изображения.
3. **Model routing:** Explore/инвентаризация → haiku; scoped-coder / verifier / reviewer / critic → sonnet; solution-architect → opus только для действительно сложной архитектуры. Обновить пины в `.claude/agents/*.md` (сейчас sonnet-4-6 / opus-4-8 — прошлое поколение; актуально: claude-sonnet-5, claude-haiku-4-5, claude-opus-4-8+).
4. **Skill Routing Gate провалился, потому что ростер перегружен** (39 маппингов, 37 скиллов): проверка стала дорогой → её пропускают. Сокращение скиллов — главный фикс самого гейта.

## 4. Skills consolidation proposal (37 → ~13)

| Cluster | Now | Proposal | Net |
|---|---|---|---|
| Design (impeccable 1.9M, taste, emil-design-eng, theme-factory, frontend-design, brutalist, minimalist, redesign) | 8 | `impeccable` (keep, vendor) + `design-direction` (merge остальных 7; стили brutalist/minimalist → reference-файлы внутри) | −6 |
| Discovery (architecture-discovery, technical-discovery, graphify-code-map) | 3 | `discovery` | −2 |
| Planning aids (project-estimation, task-decomposition) | 2 | fold в промпт solution-architect (он их уже декларирует) | −2 |
| Security (audit-triage, hardening-pass, verification-gate) | 3 | `security-pass` с режимами triage / harden / verify | −2 |
| Agent-wrappers (critic-review, reviewer, verifier, scoped-coder) | 4 | удалить — дублируют контракты `.claude/agents/*.md` | −4 |
| Memory/ops (orchestrator-log, context-snapshot, memory-bank-manager, ssot-sync-closeout) | 4 | `memory-ops` | −3 |
| Git safety (merge-protocol, scoped-commit-guard, shell-context-guard) | 3 | `git-safety` | −2 |
| Heavy vendor utils (skill-creator 280K, mcp-builder 156K) | 2 | архив/deferred — generic, переустанавливаемы | −2 |
| Misc (output-skill, handoff-live-smoke, agent-operations-review, codex-verification) | 4 | fold: output→AGENTS.md правило, handoff+codex-verification→`security-pass`/verifier, agent-operations-review→`memory-ops` | −4 |
| Keep as is | systematic-debugging, webapp-testing, subagent-mission-brief | — | 0 |

Итог: **~13 скиллов**, ростер сжимается до одной страницы, Skill Routing Gate становится реально проходимым за 30 секунд. `.opencode/skills/` зеркалится после консолидации (уже gitignored, отдельный curation WB).

## 5. Decision asks (Owner)

1. Утвердить правило «оркестратор не пишет код после плана» → внести в AGENTS.md.
2. Утвердить model routing + обновление пинов моделей в `.claude/agents/`.
3. Утвердить консолидацию скиллов 37→13 (отдельный curation WB).
4. Решить судьбу gpt-critic/gpt-verifier при исчерпанной квоте Codex: оставить DEGRADED-путь (текущее) или временно перевести триггеры в OFF до восстановления квоты.
