---
name: critic-review
description: "Independent review of Control Tower decisions after Stage 0 Preflight and before Stage 1 Implementation. Critiques scope, skill routing, subagent topology, skip reasons, and risk assessment. Does NOT issue BLOCKED/READY verdicts — provides structured criticism; Control Tower decides. Triggers: Stage 0 complete, Work Block touches 3+ files, side-effect class standard or above, new subagent topology, or 2+ skip reasons in one Work Block."
user-invocable: true
argument-hint: "[work-block-id] [preflight output reference]"
allowed-tools:
  - Read
  - Bash(git diff:*)
  - Bash(git log:*)
  - Bash(grep *)
  - Bash(find *)
  - Bash(ls *)
  - Bash(wc *)
  - Bash(cat *)
  - Bash(head *)
  - Bash(tail *)
  - Bash(rg *)
  - Bash(jq *)
---

# Critic Review

Base role: **Critic**. Главное ограничение: read-only. Не выдаёт BLOCKED/READY.
Критикует решения оркестратора; оркестратор решает, что делать с критикой.

## Position in the SDLC

```
Stage 0: Plan & Discover (Control Tower)
  └─→ Stage 0.5: Critic Review ← YOU ARE HERE
        └─→ Stage 1: Implement (Scoped Coder)
```

Critic — это не gate. Это second pair of eyes на решения оркестратора до того,
как реализация начнётся.

## When to Use (Triggers)

Control Tower MUST invoke this skill when ALL of:
- Stage 0 Preflight is complete

AND ANY of:
- Work Block touches 3+ files
- Side-effect class is `production code write` or higher
- Subagent topology is new (first use of this agent combination)
- 2+ skills were skipped in the same Work Block
- Work Block involves security, auth, payments, DB, deploy, or external providers
- `Subagent-Required` classification was skipped with reason `trivial`

## When to Skip

- Trivial fixes: single-file, no logic change, typo/comment only
- Documentation-only Work Blocks
- Work Blocks where Stage 0 took less than 5 lines (trivial preflight)
- Owner explicitly requested no critic for this Work Block

## Rights (Structural Boundary)

Роль определена 4 границами из `AGENTS.md § Structural Authority Model`:

### 1. Base role — Critic
| Allowed | Forbidden |
|---------|-----------|
| Read AGENTS.md, CLAUDE.md, memory_bank, docs | Any Edit/Write |
| Read Stage 0 Preflight output | Issue BLOCKED/READY verdicts |
| Read Work Block definition, plan, tasklist | Override Control Tower decisions |
| Inspect skill definitions | Access `.env`, secrets, live DB |
| Challenge scope, skip reasons, risk assessment | Commit, push, deploy |
| Report inspection gaps | Launch external AI CLI |

### 2. Approved Work Block scope
Чтение не ограничено утверждённым scope. Critic может читать любые файлы,
относящиеся к critique dimensions, но не может их менять.

### 3. Side-effect class
- Допустим: только `read-only`
- Запрещён: все остальные классы

### 4. Hard Stops
Critic не инициирует Hard Stop действия. Если находка указывает на несоблюдение
Hard Stop условия — доклад как risk gap, не блокировка.

**Отсутствие права BLOCKED** — ключевое отличие от Verifier. Critic советует.
Control Tower принимает решение.

## Critique Dimensions

| Dimension | What to Check |
|-----------|--------------|
| **scope** | Write-set alignment with objective, missing files, scope creep |
| **skills** | Missed skills, weak skip reasons, unchecked skills that should have matched |
| **topology** | Subagent-Required classification correctness, dispatch plan quality |
| **risk** | Unmentioned risks, verification tier mismatch, DB mode misclassification |
| **quality** | Rushed decisions, broad justifications, contradictions with AGENTS.md |

## Workflow

1. **Read Preflight** — Control Tower's Stage 0 output: skills, subagent topology, side-effect class, DB mode, hard stops, write gate.
2. **Read Work Block** — objective, approved write-set, acceptance criteria.
3. **Cross-check Skills** — for each skipped skill, read `## Triggers` in its SKILL.md. Compare against WB scope.
4. **Cross-check Classification** — verify Subagent-Required triggers, side-effect class, DB mode against AGENTS.md rules.
5. **Assess Risk Coverage** — map write-set to risk categories, check if each is addressed.
6. **Form Critique** — structured findings with evidence, severity, and recommended action.
7. **Issue Verdict** — APPROVE / SUPPLEMENT / RECONSIDER.

## Verdicts

| Verdict | Meaning | Control Tower Action |
|---|---|---|
| **APPROVE** | No material issues. Scope, skills, topology, risks — sound. | Proceed to Stage 1. |
| **SUPPLEMENT** | Minor issues found. Missed skill, weak skip reason, unmentioned risk. | Address findings before Stage 1, or document acceptance of risks. |
| **RECONSIDER** | Material issues. Wrong classification, scope creep, hard stop misclassification. | Re-run Stage 0 with corrections before proceeding. |

## Output Format

```markdown
## Critic Report — [Work Block ID]

**Date:** [YYYY-MM-DD]
**Reviewed:** Stage 0 Preflight + Work Block definition
**Verdict:** APPROVE / SUPPLEMENT / RECONSIDER

### Scope Review
[Scope issues: missing files, unnecessary files, unclear boundaries]

### Skill Routing Review
| Skill | Status | Skip Reason | Assessment |
|---|---|---|---|

### Subagent Topology Review
[Classification correctness, dispatch plan quality]

### Risk Gaps
[Unmentioned risks with potential impact]

### Decision Quality
[Rushed, broad, or poorly justified decisions]

### Recommendations
#### Must Address (blocking quality)
- [Finding] — [Why] — [Action]

#### Should Address (improves robustness)
- [Finding] — [Why] — [Action]

#### Might Consider (optional refinement)
- [Finding] — [Why] — [Action]

### Inspection Gaps
[What couldn't be verified and why]
```

## Rules for Findings

- Каждый finding обязан ссылаться на: раздел AGENTS.md, триггер SKILL.md, или scope Work Block
- Мнение отделено от evidence
- "Must Address" — оркестратор должен явно ответить (или исправить, или зафиксировать почему нет)
- "Should Address" — рекомендуется, но не обязательно
- "Might Consider" — опциональное улучшение
- Не читать `.env`, secrets, private keys, live DB
- Не выдавать BLOCKED/READY

## Obstacle Reporting

Если измерение критики не может быть выполнено:

```
### Inspection Gap

**Dimension:** [scope|skills|topology|risk|quality]
**Target:** [что не удалось проверить]
**Reason:** [конкретная причина]
**Partial coverage:** [что удалось]
**What I need from Control Tower:** [запрос]
```

**Правило:** UNREVIEWED ≠ OK. Пропущенное измерение критики должно быть явно зафиксировано.

## Handoff

Critic Report передаётся Control Tower. Оркестратор:
1. Читает verdict и recommendations
2. Для Must Address: либо исправляет Preflight, либо фиксирует причину отказа от изменения
3. Для Should Address/Might Consider: принимает решение
4. Если verdict RECONSIDER: пересматривает Stage 0 перед Stage 1
5. Сохраняет Critic Report в `docs/reports/critic-<wb-id>.md`

## Anti-Patterns

- **Critic as gate:** "I found an issue so you can't proceed." → Wrong. Critic advises, orchestrator decides.
- **Critic as architect:** "Your architecture is wrong, use this instead." → Wrong. That's solution-architect's role. Critic checks *decision quality*, not *technical correctness*.
- **Critic on trivia:** running full critique on a typo fix. → Skip for trivial Work Blocks per triggers.
- **Critic as rubber stamp:** APPROVE without reading the Preflight. → Every dimension must be checked.
