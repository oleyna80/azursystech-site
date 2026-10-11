# WB-007 — Plan / Spec для Architecture Critic

Статус: OWNER APPROVED IMPLEMENTATION SCOPE; planning-path amendment ожидает focused independent delta-only Critic.
Revision 2 + Owner planning-path amendment: Architecture Critic READY — B1/B2 CLOSED согласно Owner implementation instruction; требования и 19 implementation paths неизменны.
Дата: 2026-10-09. Repository: oleyna80/azursystech-site.
Baseline: `be9723c17a27393d01a9769c68ae710529acad94`.
Baseline tree: `17ba9de3d511a42e5767b35078f2f49e4c804a47`.
Предлагаемая ветка: `feat/sdlc-wb007-native-runtime-alignment` (не создана).

## 1. Цель и проверенные исходные факты

Стабилизировать установленный Controller v1 перед первым write-capable pilot: исправить native Codex wire protocol и убрать конкурирующие legacy authority references. Решения policy, admission, lifecycle и публикации остаются прежними.

Read-only inspection установки `/home/azur/Projects/WSL/azursystech-sdlc-v1` подтвердил exact baseline HEAD и чистый status. Inspection не менял installed registry, hooks или checkout. Новые native тесты и regression suites в ходе подготовки этого плана не запускались.

В `adapters.runtime_response()` Claude и Codex получают одинаковый `permissionDecision: allow/deny`. Bridge consequential также выдаёт общую форму без выбора runtime. Актуальная документация Codex описывает nonblocking context через `additionalContext`, а `allow` — в сочетании с `updatedInput` для изменения входа. Поэтому предлагается отдельная Codex serialization без tool rewrite. Источник: [официальная документация Codex hooks](https://learn.chatgpt.com/docs/hooks).

Предоставленные smoke reports не являются полным native gate: Codex report не доказывает загрузку/исполнение hooks; Claude report показывает DENY, но не admitted ALLOW. Вывод Claude о tracked schema-v3 BLOCKED как текущей maintenance authority противоречит выбранному v1 contract. Новый gate должен доказать обе стороны независимо.

## 2. Требования и критерии

| ID | Требование | Acceptance evidence |
| --- | --- | --- |
| R1 | Codex принимает ALLOW, DENY и обработанные failure responses без protocol errors; решение controller не меняется | Direct serializer + subprocess bridge regressions и реальные native Codex события; unchanged input и отсутствие выполнения при DENY |
| R2 | Активные инструкции однозначно выбирают Controller v1 | Read-only audit root/runtime entry chain; независимый Reviewer подтверждает отсутствие конкурирующих действующих gates |
| R3 | Tracked schema-v3 state и исторические write-gates не создают authority | Явная legacy маркировка; документация читает внешнее admission и Git-private schema-v2 state; tracked legacy blobs не меняются |
| R4 | Native Codex и Claude проверены с реальной admission/state authority и эффективной plugin composition | Новые сессии в disposable installations; positive/negative matrix, actual hook trace, snapshots и B2-STOP-01..04 |
| R5 | Assurance проверяет actual WB-007 checkout, сохраняя frozen WB-005/WB-006 evidence | Два независимых CI-трека, provenance, строгая failure propagation и negative fixture B1-CI-01..05; exact source gates отдельно от synthetic merge checkout |

R1 не разрешает обход native permissions или автоматическое предоставление approval. Все ALLOW остаются subject to нормальным ограничениям клиента. Unsupported tool/runtime, missing trusted facts и authority mismatch не получают новые разрешения.

## 3. Минимальные решения реализации

1. В `runtime_response()` разделить только выходную форму: Codex ALLOW → `hookSpecificOutput` с `hookEventName: PreToolUse` и `additionalContext` с причиной, без `permissionDecision`, `updatedInput` и tool rewrite. Codex DENY → supported deny JSON с причиной. Claude сохраняет существующую allow/deny форму.
2. Bridge consequential принимает `--runtime {claude,codex}`, default `claude`. Codex Bash hook передаёт `--runtime codex`; Claude command остаётся неизменной. Runtime selector влияет только на serialization, не на repository/admission/policy authority.
3. Runtime no-admission и обработанные runtime exceptions используют совместимый DENY response. Consequential handled failure сохраняет blocking exit 2 + stderr; stdout не содержит повреждённый/частичный JSON. stdout содержит только протокольный результат; диагностика идёт в stderr.
4. Не менять `Decision`, policy, state schema, lifecycle transitions, trusted configuration resolution, Git path authority, publication или consequential command eligibility. `hook.py` не включён в write-set: выбранная context-only форма позволяет сохранить его print/exit handling.
5. Обновить только действующие authority passages/links перечисленных документов. Зафиксировать: trusted external admission + Git-private per-worktree Controller v1 schema v2; missing/corrupt state не означает INACTIVE; legacy tracked state не даёт разрешение/запрет. Pre-WB planning сохраняет существующий admitted путь без необходимости fabricate controller state. Critic READY, exact candidate Reviewer/Verifier и Owner integration authority описываются по действующему v1 contract.

## 4. CI applicability — решение, требующее согласования

Действующий `Control Plane Contracts` запускает только `python scripts/verify-sdlc-replacement.py` на текущем HEAD. Frozen validator принимает точные семь preimage/postimage `(mode, blob)` пар. После необходимого изменения `.codex/hooks.json` WB-007 HEAD уже не совпадёт с exact WB-006 wiring; изменение workflow также меняет вторую manifest live path.

### 4.1. B1-CI-01 — запуск и два verification tracks

В уже предложенном `.github/workflows/control-plane-contracts.yml` удалить PR/push `paths`/`paths-ignore` filters. Сохранить push branch `main`, pull_request и workflow_dispatch, full-history checkout, contents:read, текущую Python линию и имя обязательного check/job. Любое изменение PR или push в main должно запускать оба трека, включая все 19 implementation paths и оба будущих planning paths. Не заменять filters условиями steps/jobs, пропускающими current-candidate assurance. Acceptance: проверить фактический workflow trigger и отсутствие path-based skips для каждого из 19 путей.

**Historical frozen assurance:** отдельный disposable full-history clone, detached exact WB-006 baseline `be9723c17a27393d01a9769c68ae710529acad94`, tree `17ba9de3d511a42e5767b35078f2f49e4c804a47`. Выполнить неизменённый canonical command с exact frozen WB-005 source `e167b6ffbe01f3977ca2b738d8c12a17a4004110`. Его PASS относится только к историческому baseline. Artifacts, validator, manifest, bindings и `wiring_mode()` остаются неизменными; baseline нельзя выбирать из payload, PR-controlled override или текущего HEAD.

**Current-candidate assurance:** на actual CI checkout выполнить все три discovery suites из §7 с ResourceWarning как error, compile/import и новые native bridge/adapter integration regressions. Проверить все 19 paths: executable paths через suites/config-command probes, instruction paths через authority/reference audit, wiring/workflow через командные и структурные assertions. Проверить неизменность четырёх frozen artifacts и остальных пяти live-wiring `(mode, blob)` относительно baseline. Native client sessions и exact WB-007 source verification остаются отдельными обязательными gates: historical PASS или synthetic merge PASS их не заменяет.

### 4.2. B1-CI-02/03 — provenance и failure propagation

Для каждого трека сохранить event/run identity, exact PR source head SHA, exact event base SHA, фактический checkout SHA и `HEAD^{tree}`, команды, exit codes и outcome. Для исторического трека отдельно записать frozen source и tested historical baseline/tree; для current трека — actual tested checkout/tree. При pull_request явно маркировать synthetic merge checkout и его родителей; нельзя выдавать его SHA за PR source head. Для push/dispatch явно обозначить, какие PR fields неприменимы, и записать event/ref SHA. Не подменять event base изменившимся позже remote tip. Несоответствие доступных checkout/event/parent identities — STOP, не permissive fallback.

Overall workflow PASS требует успешности обоих треков и всех current-candidate checks. Никаких `continue-on-error`, `|| true`, маскирующих exit codes, подавления failing suites/warnings или fallback на исторический PASS. Если применяется pipe/tee, сохранить failure через pipefail; итоговая агрегация не должна давать PASS при failed/skipped обязательном треке. Provenance должна оставаться доступной и при failure; evidence collection не превращает ошибку проверки в успех.

### 4.3. B1-CI-04 — воспроизводимый negative fixture

После approval, в disposable current-candidate clone выполнить **тот же порядок и shell-команды CI**, включая настоящий historical canonical на неизменённом historical clone. Сначала положительный контроль: оба трека PASS. Затем только в disposable current clone временно добавить детерминированный failing unittest в уже предложенный `test_runtime_bridge.py`; обычный controller discovery должен действительно обнаружить и выполнить его. Не добавлять новый tracked implementation path, не менять frozen baseline, artifacts или production installation.

Negative run должен доказать: historical command exit 0/PASS; current discovery reaches injected test and exits nonzero; общий CI command sequence/обязательный job exits nonzero и workflow не считается PASS. Сохранить текст temporary fixture, исходные и mutated tree/diff identities, exact commands, failing test и exit codes. Проверить failure propagation фактического workflow, а не отдельно написанного substitute runner или заранее заданных mock statuses. Если job structure имеет несколько jobs, проверить также failure итогового обязательного check. Temporary mutation не публиковать и не использовать как WB-007 source candidate.

### 4.4. B1-CI-05 — immutable compatibility

Зафиксировать exact blob/mode comparisons для frozen artifacts, bindings, validator и `wiring_mode()`-owning source. Два допустимых live-path delta — `.codex/hooks.json` и workflow — получают current-candidate assurance и никогда не объявляются историческими WB-006 postimages. Список остальных пяти live paths проверяется по frozen manifest. Отсутствие path filters и negative fixture проверяются в существующем proposed test scope; дополнительный implementation path не разрешён.

Не менять frozen patch, manifest, corpus, checklist, binding, runner или `wiring_mode()`. Не использовать `--skip-rehearsal` как способ скрыть wiring mismatch. Не отключать warnings или failing suites. Architecture Critic и Owner должны явно принять эту applicability amendment до утверждения write-set. Если изменение CI не принимается, требуется пересмотр плана до реализации; нельзя оставить заведомо failing CI или молча расширить scope.

## 5. Exact proposed implementation write-set

Всего 19 путей: 3 production/config, 2 test, 13 instruction/entry, 1 CI. Большой перечень документации означает узкие authority passages, а не переписывание 13 документов. Любой новый путь или изменение другого раздела требует revise scope.

| # | Путь | Requirement | Допустимый delta |
| --- | --- | --- | --- |
| 1 | `.agent/controllers/v1/adapters.py` | R1 | Runtime-specific response serialization only; Decision and policy evaluation unchanged. |
| 2 | `scripts/sdlc-v1-bridge.py` | R1 | Explicit runtime for consequential response; use compatible serializer for normal and handled failure paths. |
| 3 | `.codex/hooks.json` | R1 | Append --runtime codex to consequential command only; matchers and permissions unchanged. |
| 4 | `.agent/controllers/v1/tests/test_adapters_hook.py` | R1 | Validate distinct native wire formats and identical underlying controller decisions. |
| 5 | `.agent/controllers/v1/tests/test_runtime_bridge.py` | R1,R4,R5 | New actual bridge subprocess, config-command and authority-boundary regressions in disposable repositories. |
| 6 | `AGENTS.md` | R2,R3 | Root authority entry and active-state references only. |
| 7 | `.codex/AGENTS.md` | R2,R3 | Codex authority, lifecycle and independent assurance references only. |
| 8 | `.codex/instructions.md` | R2,R3 | Remove active dependency on legacy schema-v3 gate/topology ceremony. |
| 9 | `.codex/critic.md` | R2 | Align Critic role with v1 DEFINE binding; preserve role boundaries. |
| 10 | `.codex/write-gate.md` | R2,R3 | Mark historical gate non-authoritative; point to v1 authority. |
| 11 | `CLAUDE.md` | R2,R3 | SDLC authority section only; no unrelated Claude instructions rewrite. |
| 12 | `docs/session-bootstrap.md` | R2,R3 | Session entry/state lookup and legacy-state precedence only. |
| 13 | `PROJECT_MAP.md` | R2,R3 | Correct authority/state navigation entries only. |
| 14 | `governance/authority.md` | R2,R3 | Correct active authority references; preserve Owner powers and human-governed profile. |
| 15 | `.agent/workflows/sdd-protocol.md` | R2,R3 | Narrow v1 precedence/legacy applicability notice; retain historical procedure content. |
| 16 | `.agent/ROSTER.md` | R2 | Authority/admission vocabulary only; retain roster, roles and skills. |
| 17 | `runtimes/codex/README.md` | R2,R3 | Correct installed hook/authority entry references only. |
| 18 | `runtimes/claude-code/README.md` | R2,R3 | Correct installed hook/authority entry references only. |
| 19 | `.github/workflows/control-plane-contracts.yml` | R5 | Proposed CI applicability amendment: frozen-baseline canonical plus current-candidate regressions; requires explicit Critic/Owner scope acceptance. |

Owner-approved planning paths:
- `docs/changes/WB-007-native-runtime-compatibility/plan.md`
- `docs/changes/WB-007-native-runtime-compatibility/spec.md`

Таким образом, approved candidate write-set: 21 путь с planning; implementation — 19. Сейчас этих repo planning файлов не создавалось.

Отдельные future coordination paths: `docs/reports/sdlc-wb007-architecture-critic.md`, `docs/reports/sdlc-wb007-reviewer.md`, `docs/reports/sdlc-wb007-verifier.md`, `docs/reports/sdlc-wb007-closeout.md`. Наличие report файла не создаёт controller binding. Final Reviewer/Verifier/closeout records привязываются к exact source candidate и публикуются только по отдельно разрешённому lifecycle.

## 6. Exclusions / сохранение состояния

Не менять controller lifecycle/архитектуру, autonomy, provider/remote/registry trust, Owner permissions, frozen assurance artifacts или legacy tracked state. Не менять `.claude/settings.json`, Git hooks, bootstrap, global agent configs/plugins или SSH credentials. Не исправлять WB-037 и не использовать его worktree для WB-007. Не использовать installed registry `/home/azur/.local/state/azursystech-sdlc-v1/authority.sqlite3` для fixture/admission. Не выполнять direct hotfix установленного main, merge, deploy или activation.

Работа реализации и native проверки — отдельный full-history clone с `--no-hardlinks`, distinct common dir, isolated HOME/Git config и отдельным внешним disposable registry. Installed checkout и его authority остаются read-only. Admission/state создаются реальными WB-0/WB-1 interfaces с trusted pinned policy/base/branch, не ручной записью state и не bootstrap bypass. Human-governed profile сохраняется. No network publication: любые Git transaction fixtures используют local bare origin.

## 7. Execution / test plan после approval

T1 (R1): adapter/bridge serialization + Codex consequential command + protocol regressions.
T2 (R2/R3): bounded instruction/reference alignment, legacy-state non-authority audit.
T3 (R4): native Codex/Claude sessions и authority matrix в isolated clones.
T4 (R5): CI amendment, regression/compile/import, exact scope/frozen identity validation.
T5: freeze exact source candidate; independent Reviewer и Verifier; coordination-only closeout только после gates и отдельной публикационной authority.

Native matrix:
- safe Bash ALLOW: hook реально исполнен, command не переписана, native permission policy не ослаблена;
- consequential Bash DENY: безопасный marker probe, отсутствие исполнения подтверждено;
- structured write без admission / после terminalization / с mismatched admission: DENY, target и authority неизменны;
- active admitted pre-WB planning: ALLOW; DEFINE implementation: DENY;
- реальный planning commit → open_with_resolver → Critic READY → EXECUTE: admitted implementation ALLOW; protected/out-of-scope target DENY;
- malformed input, missing cwd/trusted config, corrupt private controller state: обработанный failure блокирует инструмент поддерживаемым протоколом;
- nested cwd/linked worktree своего installation: валидное authority binding; отдельный admitted foreign repository: DENY;
- Claude: unchanged native ALLOW/DENY/failure semantics через фактически установленную command.

Для каждого native случая сохранить actual client version, session root, exact candidate, selected hook command, фактический hook trace, stdout/stderr/exit code, controller decision и before/after file/state snapshots. Installed config existence и успешный direct bridge subprocess не считаются native hook evidence. Версия из PATH не заменяет версию работающей сессии. Запрещены global memory writes и тестовые записи вне disposable approved paths.

Процесс kill/timeout, hook not loaded и uncaught interpreter failure нельзя считать DENY по умолчанию: protocol ошибки могут продолжить tool. Если они препятствуют acceptance, STOP и report; не расширять architecture/failure model без нового согласования. Native smoke не даёт полномочий на deployment/publication.

### 7.1. B2 — эффективный Codex plugin Stop hook

**B2-STOP-01 — read-only composition inventory.** Перед native acceptance установить эффективную composition именно actual Claude Code client/session: версию клиента, project/session root, enabled plugins, `openai-codex/codex` version `1.0.6`, фактически выбранный plugin root и source hashes, Stop command, execution timeout и связанные review settings. Разобрать применимые client/project/managed/plugin configuration layers и overrides. Записать effective `stopReviewGate`, источник значения и применимую precedence. Значение по умолчанию в source и наличие cached plugin не доказывают effective value или загрузку hook. Зафиксировать review invocation, условия ALLOW/BLOCK, обработку malformed/empty/error/timeout results и поведение native клиента; ожидания source отличаются от runtime evidence. Не выводить secrets.

**B2-STOP-02 — isolated native composition.** В disposable installation воспроизвести установленную composition с тем же plugin version и релевантными effective settings, отдельными HOME/client data/plugin state и registry. Не менять/отключать глобально установленный plugin. Получить native Claude события нормального completion, admitted ALLOW, unauthorized DENY, Stop review ALLOW, Stop review BLOCK и plugin error (включая malformed review result/timeout handling). Если фактическая composition выключает review gate, проверить этот режим и отдельно изолированный enabled режим для BLOCK/error acceptance; явно маркировать различие, не выдавать test override за production setting. Контролируемая подача review outcomes допустима только в isolated plugin fixture, с документированием injected boundary; native hook dispatch/client handling и Controller decisions не подменять mocks. Source inspection/direct hook invocation не заменяют native evidence. Записать exact hook invocation, stdout/stderr/exit, client outcome, completion/block behavior и отсутствие tool side effect при DENY.

**B2-STOP-03 — authority non-interference.** Снять до/после каждого Stop события snapshots trusted config, admission records, external registry authority facts и Git-private controller bytes/state. Сравнивать именно Stop stage, отдельно от допустимых lifecycle transitions тестового Work Block. Require: plugin не пишет trusted admission/controller state, не создаёт/заменяет Critic/Reviewer/Verifier bindings и не переводит lifecycle; cached reviews, plugin task/session data и tracked schema-v3 state не дают current authority. Проверить это также при Stop BLOCK/error. Plugin остаётся client-level restriction: Controller ALLOW не отменяет client restriction, plugin ALLOW не отменяет Controller DENY или mandatory binding.

**B2-STOP-04 — completion/recovery.** Stop BLOCK допускается как наблюдаемое клиентское ограничение, но acceptance должен показать безопасное достижение completion после удовлетворения review и bounded handling ошибок, без изменения глобального plugin, Controller state или обхода mandatory gates. Зафиксировать configured timeout, внешнюю границу теста и ожидаемый recovery; не запускать бесконечные review loops. Error/timeout нельзя считать fail-closed без native evidence. Если effective composition, runtime error handling или completion recovery не установлены/не воспроизводимы, результат UNVERIFIED и STOP до native acceptance/write-capable pilot. Исправление plugin или изменение глобального behavior выходит за текущий write-set и требует нового согласования.

B2 не добавляет implementation paths: inventory/native evidence собираются вне зарегистрированных worktrees; допустимые test assertions находятся в уже предложенных test paths. Native execution разрешается только последующим approved scope, не этим planning draft.

Перед изменениями на baseline disposable clone:
```bash
python -W error::ResourceWarning scripts/verify-sdlc-replacement.py --replacement-candidate e167b6ffbe01f3977ca2b738d8c12a17a4004110
```

На exact WB-007 candidate независимо:
```bash
python -W error::ResourceWarning -m unittest discover -s .agent/controllers/v1/tests -t .agent/controllers -v
python -W error::ResourceWarning -m unittest discover -s .agent/orchestration/tests -t .agent -v
python -W error::ResourceWarning -m unittest discover -s .agent/assurance/wb5/tests -t .agent -v
python -m compileall -q .agent/controllers/v1 .agent/orchestration .agent/assurance/wb5 scripts/sdlc-v1-bridge.py
```

Production import validation: перечислить и импортировать все production modules, сохранив baseline inventory 32 и учтя реальный delta. Python 3.14.4 если доступна; записать фактическую версию. Baseline inventory 127 + 81 + 17 = 225, candidate должен включать весь inventory плюс новые regressions; exact counts/0 failures/0 errors/0 unexpected skips и warnings обязательны. Использовать isolated Git env, включая удаление GIT_CONFIG_PARAMETERS и injected COUNT/KEY/VALUE; никаких signing/env fixture failures.

Дополнительно: `git diff --check` для WB-007 delta, exact HEAD/base, clean index/worktree/untracked, path/mode containment и frozen artifact identity. Старый canonical на изменённом текущем wiring ожидаемо reject; historical PASS нельзя выдавать за canonical PASS нового HEAD.

## 8. STOP conditions и review brief

STOP до реализации: нет approved exact scope; независимый Critic не принял B1/B2 correction/serialization/CI applicability; нет безопасной изоляции; для успешного теста требуется изменение installed authority или WB-037. Во время исполнения STOP: потребовался новый путь/authority policy, необъяснимый native protocol failure, нет реально наблюдаемого positive/negative hook, неподтверждённая client compatibility, regression failure или неподтверждённая candidate identity. Дополнительно: CI не покрывает любой обязательный путь; source/merge checkout provenance неоднозначна; negative fixture не приводит к overall FAIL; frozen identity изменена; effective plugin composition UNVERIFIED; plugin меняет authority, подменяет binding или completion остаётся заблокированным без безопасного recovery. UNVERIFIED нельзя заменить PASS предположением о default setting.

Delta-only Architecture Critic re-review request: read-only проверить только Owner-approved substitution двух planning paths на `docs/changes/WB-007-native-runtime-compatibility/plan.md` и `spec.md`, initiative_ref и coordination_scope из manifest. Подтвердить pre-WB planning policy, derived planning containment и inclusion обоих planning paths плюс четырёх report paths в coordination. Сравнить 19 implementation paths с предыдущим manifest: они неизменны. B1/B2 CLOSED не переоткрывать без нового evidence. READY здесь означает достаточность planning delta для normal admission/lifecycle, а не выполненный runtime acceptance. Не создавать admission/state, не менять source/hooks/registry/GitHub. Вернуть READY или конкретный REWORK.

Skills checked/used: openai-docs (native protocol), requirements-quality-review (measurable spec), spec-consistency-analysis (traceability). `.agent/ROSTER.md` inspected. Git safety / scoped coding / independent native Critic, Reviewer, Verifier нужны на соответствующих последующих этапах; frontend/deploy/provider skills к этому planning scope не применяются.

## 9. B1/B2 correction traceability

| Finding / requirement | Revised specification | Required closure evidence after approval |
| --- | --- | --- |
| B1: incomplete CI trigger coverage | B1-CI-01, §4.1 | No PR/push path filters; all 19 implementation paths covered |
| B1: historical/current assurance conflation | B1-CI-01/02, §4.1–4.2 | Two real tracks; distinct frozen, PR source, event base, checkout and tested-tree identities |
| B1: failure masking / missing negative proof | B1-CI-03/04, §4.2–4.3 | Historical PASS + actual current-suite FAIL => overall FAIL; exact workflow propagation |
| B1: frozen compatibility | B1-CI-05, §4.4 | Unchanged frozen artifacts/validator/bindings/wiring_mode; five unchanged live paths |
| B2: assumed plugin defaults / missing composition | B2-STOP-01, §7.1 | Actual client effective settings, version 1.0.6, Stop invocation and timeout evidence |
| B2: missing native Stop compatibility | B2-STOP-02/04, §7.1 | Native ALLOW/DENY/completion/BLOCK/error outcomes; bounded recovery or UNVERIFIED + STOP |
| B2: plugin vs controller authority | B2-STOP-03, §7.1 | Before/after authority snapshots; no mutation/binding substitution/v3 promotion |

Author self-check: Owner подтвердил implementation authorization и accepted B1/B2 closures. Эта поправка меняет только planning placement и metadata; requirements R1–R5, CI и plugin STOP conditions остаются обязательными. Delta Critic verdict ещё не присвоен. Runtime acceptance предстоит выполнить в isolated clone через trusted admission/lifecycle.

## 10. Owner planning-path amendment

Initiative: `docs/changes/WB-007-native-runtime-compatibility`.
Authorized planning paths: `docs/changes/WB-007-native-runtime-compatibility/plan.md` и `docs/changes/WB-007-native-runtime-compatibility/spec.md`.
Coordination scope содержит эти два planning paths и ровно четыре report paths из §5 и manifest. Obsolete proposed paths отозваны Owner и не входят в authorized scope. Все 19 implementation paths остаются неизменными. Проверка pre-WB policy и derived initiative containment выполняется до записи planning files; trusted admission, committed planning, DEFINE и независимый Critic READY обязательны до EXECUTE. Поправка не разрешает merge, push, deploy или production mutation.


## Exact admitted write-set

```json
{
  "status": "OWNER_APPROVED_IMPLEMENTATION_SCOPE_PENDING_PLANNING_DELTA_CRITIC",
  "baseline_sha": "be9723c17a27393d01a9769c68ae710529acad94",
  "implementation_paths": [
    {
      "path": ".agent/controllers/v1/adapters.py",
      "requirements": [
        "R1"
      ],
      "scope": "Runtime-specific response serialization only; Decision and policy evaluation unchanged."
    },
    {
      "path": "scripts/sdlc-v1-bridge.py",
      "requirements": [
        "R1"
      ],
      "scope": "Explicit runtime for consequential response; use compatible serializer for normal and handled failure paths."
    },
    {
      "path": ".codex/hooks.json",
      "requirements": [
        "R1"
      ],
      "scope": "Append --runtime codex to consequential command only; matchers and permissions unchanged."
    },
    {
      "path": ".agent/controllers/v1/tests/test_adapters_hook.py",
      "requirements": [
        "R1"
      ],
      "scope": "Validate distinct native wire formats and identical underlying controller decisions."
    },
    {
      "path": ".agent/controllers/v1/tests/test_runtime_bridge.py",
      "requirements": [
        "R1",
        "R4",
        "R5"
      ],
      "scope": "New actual bridge subprocess, config-command and authority-boundary regressions in disposable repositories."
    },
    {
      "path": "AGENTS.md",
      "requirements": [
        "R2",
        "R3"
      ],
      "scope": "Root authority entry and active-state references only."
    },
    {
      "path": ".codex/AGENTS.md",
      "requirements": [
        "R2",
        "R3"
      ],
      "scope": "Codex authority, lifecycle and independent assurance references only."
    },
    {
      "path": ".codex/instructions.md",
      "requirements": [
        "R2",
        "R3"
      ],
      "scope": "Remove active dependency on legacy schema-v3 gate/topology ceremony."
    },
    {
      "path": ".codex/critic.md",
      "requirements": [
        "R2"
      ],
      "scope": "Align Critic role with v1 DEFINE binding; preserve role boundaries."
    },
    {
      "path": ".codex/write-gate.md",
      "requirements": [
        "R2",
        "R3"
      ],
      "scope": "Mark historical gate non-authoritative; point to v1 authority."
    },
    {
      "path": "CLAUDE.md",
      "requirements": [
        "R2",
        "R3"
      ],
      "scope": "SDLC authority section only; no unrelated Claude instructions rewrite."
    },
    {
      "path": "docs/session-bootstrap.md",
      "requirements": [
        "R2",
        "R3"
      ],
      "scope": "Session entry/state lookup and legacy-state precedence only."
    },
    {
      "path": "PROJECT_MAP.md",
      "requirements": [
        "R2",
        "R3"
      ],
      "scope": "Correct authority/state navigation entries only."
    },
    {
      "path": "governance/authority.md",
      "requirements": [
        "R2",
        "R3"
      ],
      "scope": "Correct active authority references; preserve Owner powers and human-governed profile."
    },
    {
      "path": ".agent/workflows/sdd-protocol.md",
      "requirements": [
        "R2",
        "R3"
      ],
      "scope": "Narrow v1 precedence/legacy applicability notice; retain historical procedure content."
    },
    {
      "path": ".agent/ROSTER.md",
      "requirements": [
        "R2"
      ],
      "scope": "Authority/admission vocabulary only; retain roster, roles and skills."
    },
    {
      "path": "runtimes/codex/README.md",
      "requirements": [
        "R2",
        "R3"
      ],
      "scope": "Correct installed hook/authority entry references only."
    },
    {
      "path": "runtimes/claude-code/README.md",
      "requirements": [
        "R2",
        "R3"
      ],
      "scope": "Correct installed hook/authority entry references only."
    },
    {
      "path": ".github/workflows/control-plane-contracts.yml",
      "requirements": [
        "R5"
      ],
      "scope": "Proposed CI applicability amendment: frozen-baseline canonical plus current-candidate regressions; requires explicit Critic/Owner scope acceptance."
    }
  ],
  "future_planning_paths": [
    "docs/changes/WB-007-native-runtime-compatibility/plan.md",
    "docs/changes/WB-007-native-runtime-compatibility/spec.md"
  ],
  "future_coordination_paths": [
    "docs/reports/sdlc-wb007-architecture-critic.md",
    "docs/reports/sdlc-wb007-reviewer.md",
    "docs/reports/sdlc-wb007-verifier.md",
    "docs/reports/sdlc-wb007-closeout.md"
  ],
  "initiative_ref": "docs/changes/WB-007-native-runtime-compatibility",
  "coordination_scope": [
    "docs/changes/WB-007-native-runtime-compatibility/plan.md",
    "docs/changes/WB-007-native-runtime-compatibility/spec.md",
    "docs/reports/sdlc-wb007-architecture-critic.md",
    "docs/reports/sdlc-wb007-reviewer.md",
    "docs/reports/sdlc-wb007-verifier.md",
    "docs/reports/sdlc-wb007-closeout.md"
  ],
  "planning_amendment": "Owner approved exact planning-path substitution; implementation paths and B1/B2 closures unchanged."
}
```
