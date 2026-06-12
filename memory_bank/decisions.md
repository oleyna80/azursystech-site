# Decisions

## ADR-001: SQL-first persistence
- **Решение**: PostgreSQL как единственный SSOT для intake/chat/brief данных. LLM никогда не пишет напрямую в БД — только через backend storage layer.
- **Дата**: ≤ 2026-04
- **Контекст**: выбор между file-based / external SaaS / SQL-first. SQL-first даёт audit trail, transactional guarantees, и единую точку truth.
- **Последствия**: все маршруты persistence проходят через `web/src/lib/intake/storage.ts`; local/test DB smoke обязателен до live apply.

## ADR-002: Registry-pull deploy model
- **Решение**: build на WSL → push immutable tag в GHCR → VPS pull. Никаких `npm ci` / `npm run build` / `docker compose build` на VPS.
- **Дата**: ≤ 2026-04
- **Контекст**: VPS CPU слишком слабый для production builds; immutable tags обеспечивают reproducibility и rollback.
- **Последствия**: отдельные GHCR PATs (WSL write:packages, VPS read:packages); `COMPOSE_PROJECT_NAME=azursystech-site` фиксирован; rollback через previous known-good tag.

## ADR-003: Admin subdomain separation
- **Решение**: `admin.azursystech.fr` как отдельный Next.js app в отдельном Docker container с profile-gated compose activation.
- **Дата**: 2026-05
- **Контекст**: AZR-004 Facebook Social Automation требует admin UI. Отдельный app снижает blast radius и позволяет независимый deploy cycle.
- **Последствия**: `Dockerfile.admin`, compose `admin` profile, nginx host routing, отдельный health endpoint; production rollout — отдельный hard stop.

## ADR-004: Meta tokens in env vars for MVP
- **Решение**: Meta API tokens хранятся в environment variables на MVP этапе. Encrypted DB storage — до расширения OAuth/token lifecycle.
- **Дата**: 2026-05
- **Контекст**: MVP не требует token rotation UI; env vars проще и безопаснее на начальном этапе.
- **Последствия**: `.env` is Owner-only; tokens не логируются; при добавлении multi-page support потребуется DB migration для token storage.

## ADR-005: WSL npm isolation — никогда не запускать npm из Windows против WSL-путей
- **Решение**: Все npm-команды (`npm ci`, `npm run build`, `npm run check:types`, `npm install`) выполняются только из WSL bash/zsh shell (через nvm). Запуск из PowerShell/CMD против `\\wsl.localhost\...` путей запрещён.
- **Дата**: 2026-05-13
- **Контекст**: Windows npm оставил WSL `node_modules/.bin/` с 1 файлом вместо 19 — `tsc` и `next` отсутствовали. Причина: Windows npm пишет в свой кэш (`AppData\Local\npm-cache`) и не может корректно создать symlinks в WSL ext4 filesystem.
- **Последствия**: Правило зафиксировано в `vps-registry-pull-deploy/SKILL.md`; при сбоях — `rm -rf node_modules && npm ci` из WSL shell; Docker build всегда в Linux-контейнере и этой проблемы не имеет.

## ADR-006: npm audit — postcss moderate advisory на Next.js 16.2.6 игнорируется
- **Решение**: Остаточный advisory `postcss < 8.5.10` после upgrade до `next@16.2.6` считается false positive и не требует действий.
- **Дата**: 2026-05-13
- **Контекст**: npm registry CVE-диапазон для Next.js (`9.3.4-canary.0 – 16.3.0-canary.5`) ещё не обновлён после выхода `16.2.6`. `audit fix --force` предлагал даунгрейд до `next@9.3.3` — явный баг advisory. `postcss` в этом проекте обрабатывает только статичный Tailwind CSS; user input в CSS не попадает.
- **Последствия**: До обновления advisory в npm registry — `npm audit` возвращает exit 1 с 2 moderate. Добавить `audit-level=high` в `.npmrc` если это блокирует CI pipeline.

## ADR-007: Outbound message lifecycle before runtime wiring
- **Решение**: Для MVP не переделывать AZR-008 срочно: `intake_channel_decisions` остаётся audit/decision/draft evidence. Перед runtime wiring добавить явную outbound-message модель в общей истории сообщений.
- **Дата**: 2026-05-17
- **Контекст**: Telegram, будущий WhatsApp и website chat должны иметь нормальную историю переписки: client inbound → assistant draft outbound → manager approved → queued → sent/failed → client inbound reply. Decision row не должен становиться SSOT истории переписки.
- **Последствия**: Предпочтительная модель — развивать `intake_channel_messages` как unified timeline для inbound/outbound. Минимальные поля следующего implementation block: `conversation_id`, `direction`, `channel`, `body`, `author_type`, `status`, `provider_message_id`, `created_at`, `approved_at`, `sent_at`. Runtime wiring блокируется до появления outbound draft persistence.

## ADR-008: Telegram webhook receive gate is separate from registration and sending
- **Решение**: Production Telegram webhook route uses a dedicated receive gate `TELEGRAM_WEBHOOK_RECEIVE_ENABLED` plus secret-header verification. `TELEGRAM_WEBHOOK_REGISTRATION_ENABLED` remains only for one-time registration operations, and `TELEGRAM_LIVE_SENDS_ENABLED` remains only for outbound sends.
- **Дата**: 2026-05-18
- **Контекст**: Inbound webhook receiving, webhook registration, and outbound message sending have different risk profiles. Reusing the registration or sending flags for the route would either leave registration authority enabled too long or couple safe inbound persistence to unsafe outbound sends.
- **Последствия**: The live route must return `404` while receive is disabled or the webhook secret is missing. The canonical webhook secret env remains `TELEGRAM_WEBHOOK_SECRET`; do not introduce `TELEGRAM_WEBHOOK_SECRET_TOKEN` unless a separate config migration renames the existing variable. The route must not require `TELEGRAM_BOT_TOKEN` and must never call `setWebhook`, `deleteWebhook`, or `sendMessage`.

## ADR-009: Objective Subagent-Required triggers for local SDLC
- **Решение**: Work Blocks are classified as `Subagent-Required` by objective triggers instead of vague "medium/large" wording. Matching Work Block approval explicitly authorizes scoped read-only Reviewer, Verifier, or Analyst subagents inside the approved scope; write-capable Coder subagents still require an approved write-set.
- **Дата**: 2026-05-21
- **Контекст**: A prior session showed that "medium/large Work Block" is too subjective and lets the Orchestrator keep review/verification in the main context. The local SDLC now uses trigger criteria: 2+ domains, 4+ files, production/runtime/security/deploy/DB/provider impact, external audit/review input, independent verification, 3+ directories, or commit/push/release/deploy/live readiness.
- **Последствия**: Stage 0 must classify topology as `Subagent-Required`, `Subagent-Optional`, or `Control-Tower-Only`. For `Subagent-Required`, the Orchestrator must dispatch scoped subagents or record one allowed skip reason: `trivial`, `blocked`, `hard-stop`, or `user-disabled`.

## ADR-010: External audit and SSOT sync evidence rules
- **Решение**: External audit/reviewer output is evidence, not authority. Before asking Claude Code, DeepSeek, Qwen, or another tool for a non-trivial audit, create a task file with objective, scope, read set, forbidden side effects, file-change permission, and required output format. Workflow SSOT docs are synchronized through Git by default; ignored SSOT updates require an explicit privacy/security/machine-state reason and direct evidence checks because `git status` and `git diff` may be empty.
- **Дата**: 2026-05-22
- **Контекст**: Code-audit Phase 1 showed that external review is useful, but acceptance still depends on local triage, scoped implementation, local verification, CI, and live gate evidence. The Ubuntu/WSL workstation split changed the operating requirement: workflow docs, tasklists, memory bank, and agent instructions must synchronize across machines unless they contain secrets, private transcript content, local runtime logs, caches, or machine-specific state.
- **Последствия**: Stage 0 must triage external reports as `confirmed`, `partially confirmed`, `stale/resolved`, `rejected`, or `needs-more-proof` before implementation. Stage 3 must verify workflow-doc sync status with direct `rg`/`sed` inspection plus `git check-ignore -v`; closeout must state which SSOT files are tracked/synchronized and why any remaining ignored SSOT file stays local-only.

## ADR-011: Security verification baseline for Agentic SDLC
- **Решение**: Security-sensitive Work Blocks require explicit Stage 0 security triage and, when relevant, a STRIDE-lite threat-model note. Tier Full and security verification now include a code-level security checklist, CSP/security-header verification, OWASP Top 10 mapping, sanitized error/logging checks, admin CSRF-to-CSP dependency checks, and staged-diff secret-scan expectations before commit.
- **Дата**: 2026-05-22
- **Контекст**: `security_report.md` correctly identified SDLC process blind spots, but its headline CSP blocker was stale on current `main`: both web and admin already define production CSP headers. The durable fix is to make security verification mandatory so future agents check these controls instead of relying on tribal knowledge or external reports.
- **Последствия**: Security reports are still evidence, not authority; CSP/header findings must be verified against `web/next.config.ts` and `admin/next.config.ts`. New dependencies, CI secret-scanning jobs, SAST tools, runtime header proof, and incident-response docs remain separate approval-gated Work Blocks.

## ADR-012: Runtime proof, subagent fallback, and security tooling baseline
- **Решение**: SDLC now separates source/config security proof from runtime proof, formalizes `Subagent-Required` blocked fallback behavior, and makes local security tooling baseline checks explicit. Runtime proof has a matrix for public web, admin, API/webhook routes, and deploy/runtime logs. If proof is blocked, the result is `blocked` with a follow-up gate, not `pass`. If subagents are unavailable because of tool/thread/usage/model/sandbox limits, Control Tower runs an inline fallback review, labels it `review-degraded:inline-fallback`, and queues re-review before commit/push for security/runtime/high-blast-radius work.
- **Дата**: 2026-05-23
- **Контекст**: The previous session added `scripts/secret-scan.sh`, confirmed public web CSP/security headers at runtime, found `admin.azursystech.fr` DNS unresolved, and hit a final subagent review usage limit. The process gap was not implementation correctness; it was missing formal behavior for unavailable subagents and for blocked runtime proof.
- **Последствия**: Security-sensitive staged sets should run `scripts/secret-scan.sh staged`; security Work Blocks and release/deploy readiness should run `scripts/secret-scan.sh tracked`; Node app security checks use `npm audit --omit=dev --audit-level=high`; changed mutation endpoints must prove bounded parsing/body-size limits. Blocked admin runtime proof remains a separate follow-up until DNS/deploy routing is available.

## ADR-014: Unified Stage 0 Routing Preflight as single write gate
- **Решение**: Stage 0 Routing Preflight replaces standalone Skill Routing Gate as the single write gate before any Edit/Write-capable action. Skills, subagent topology, side-effect class, DB action mode, and Hard Stops are nested fields of one preflight output, not separate gates. CLAUDE.md BLOCKING section has exactly one preflight block (12 lines), mirroring AGENTS.md nested structure.
- **Дата**: 2026-05-25
- **Контекст**: Sprint analysis showed Skill Routing Gate and Stage 0 Routing Preflight were separate BLOCKING blocks in CLAUDE.md, causing structural duplication. Agents treated them as two separate gates. The real SDLC contract (AGENTS.md) had them correctly nested, but CLAUDE.md flattened them. Root cause: CLAUDE.md was fixed in a prior session but the two blocks weren't merged.
- **Последствия**: One preflight output per non-trivial Work Block. Trivial quick fixes state skip reason. Hard Stop skills still require explicit Owner approval. AGENTS.md remains canonical for detailed field definitions.


- **Решение**: Before any non-trivial, Hard Stop, ops, DB, deploy, security, runtime, multi-domain, or subagent-delegated Work Block, Control Tower must perform Skill Routing Gate. The gate inspects `.agent/ROSTER.md`, reads only matching `.agent/skills/*/SKILL.md` files, and reports `Skills checked`, `Skills matched`, `Skills used`, and `Skills skipped and why`.

## ADR-015: Positioning pivot — от IT support к web systems + AI automation
- **Решение**: AzurSysTech меняет позиционирование. Новая формула: `IT foundation + web systems + AI automation for small business`. Техподдержка остаётся как supporting offer (доверительный вход), но не является identity бренда.
- **Дата**: 2026-05-30
- **Контекст**: Текущее позиционирование (dépannage / IT support) ограничивает маржу, не соответствует реальным компетенциям и не позволяет расти. `/ai-automation` и `/brief` уже реализованы, но не акцентированы. Реальных кейсов по автоматизации нет — будут созданы демо-проекты для портфолио.
- **Принятые решения**: (1) Новый слоган: «Votre business automatisé, prêt à recevoir des clients». (2) Два новых оффера: Offer E (AI Intake + Lead Automation, от 800 €) и Offer F (Website + Automation Bundle, от 600 €). (3) Сегменты: TPE + бизнес с потребностью в автоматизации = primary; particuliers = secondary. (4) Homepage hero: automation первым, dépannage последним. (5) `/brief` — основной conversion-путь (подтверждён работающим).
- **Изменённые документы**: `mission.md` v1.0, `positioning.md` v0.2, `offer-stack.md` v0.2, `roadmap.md` v1.2, `pivot-decision.md` (новый).
- **Последствия**: Фаза 0 документов завершена. Следующий приоритет: Фаза 1 (copy/контент сайта), затем Фаза 2 (production code — отдельный Work Block + Scoped Coder). AZR-010 продолжается параллельно. Ни один агент не должен возвращаться к IT-депаннажу как primary brand identity.
- **Дата**: 2026-05-25
- **Контекст**: Gate C.1 live DB `005` was executed safely, but Control Tower skipped the matching project-local `vps-db-tunnel-ops` skill and re-derived the workflow from memory plus script inspection. This showed that converting operational experience into skills is not enough unless Stage 0 requires proof that matching skills were checked and used.
- **Последствия**: If the runtime Skill tool exposes a matching project-local skill, invoke it. If it does not, state `Project-local skill used: <name>`, read the local `SKILL.md`, and follow its workflow manually. A matching skill may be skipped only with a recorded reason: `not relevant after inspection`, `blocked`, or `superseded by stricter gate`. Hard Stop skills still require explicit Owner approval before production, credential, deploy, live DB, destructive, or client-facing actions.

## ADR-016: Anchor-based navigation replaces /services/* pages

- **Решение**: Все страницы `/services/*` удалены. Навигация переведена на якорные ссылки внутри главной страницы (`/#automation`, `/#websites`, `/#services`). Единственная выделенная страница автоматизации — `/fr/ai-automation` и `/ru/ai-automation`.
- **Дата**: 2026-05-31
- **Контекст**: Страницы `/services/automation` и `/services/websites` были созданы в Фазе 1 как сырые заглушки — дублировали информацию с главной, без дизайна. IT-support страницы (new-pc-setup, onsite-support, tpe-setup, wifi-printer) также удалены — не соответствуют новому позиционированию. Принято решение не плодить отдельные страницы под каждый сервис, а использовать single-page дизайн с якорной навигацией.
- **Принятые решения**: (1) Главная страница — основной destination для всех сервисов через якоря. (2) `/ai-automation` остаётся отдельной детальной страницей. (3) Showcase-секция получила `id="websites"`. (4) Footer и header используют одинаковый паттерн якорных ссылок с locale-префиксом.
- **Последствия**: -1354 строк кода, 15 файлов изменено. Sitemap сокращён на 7 записей. Все ссылки верифицированы (0 битых). Следующий шаг: commit → push → deploy. Будущие страницы сервисов должны создаваться только при наличии уникального контента, которого нет на главной.
