# approval-workflow.md
_version: v0.1
_owner: Marketing Lead
_status: approved policy baseline
_brand: AzurSysTech
_primary_language: ru

---

## 1. Цель документа

Зафиксировать workflow согласования для AI-систем AzurSysTech, чтобы:

- ИИ помогал ускорять работу, но не принимал рискованные решения сам
- контент, ответы и лиды проходили через понятный human-in-the-loop процесс
- не было ложных обещаний клиентам
- AI-система не публиковала и не отправляла ничего критичного без контроля
- Tech Lead мог построить безопасную архитектуру автоматизации

---

## 2. Основной принцип

### Core principle
Для AzurSysTech AI работает в режиме:

**AI-assisted, human-approved**

а не:
- fully autonomous sales
- fully autonomous publishing
- fully autonomous quoting
- fully autonomous client support

### Why this matters
Проект находится на раннем этапе, и сейчас важнее:
- не ошибаться
- не терять доверие
- не обещать лишнего
- не публиковать “кривой” контент
- не давать клиенту неверный ответ

---

## 3. Approval philosophy

### AI may
- готовить черновики
- классифицировать лиды
- суммировать обращения
- помогать с контентом
- предлагать варианты ответов
- готовить follow-up drafts
- собирать intake через чат

### AI must not act alone on
- публикации от имени бренда
- отправку клиентских ответов с коммерческими последствиями
- точные цены / quote commitments
- обещания по срокам
- юридически значимые формулировки
- чувствительные ответы при конфликте / негативе

---

## 4. Approval model

### Three-level approval model

#### Level 1 — Safe automation
Можно выполнять автоматически без ручного подтверждения.

#### Level 2 — Draft + human review
AI создаёт черновик, человек утверждает перед отправкой/публикацией.

#### Level 3 — Human-only final decision
AI может помочь структурировать, но решение и формулировка должны быть полностью под контролем человека.

---

## 5. Level 1 — Safe automation

### Allowed without manual approval
- классификация лида по сегменту
- присвоение source tag
- присвоение urgency guess
- AI summary обращения
- routing в CRM
- генерация внутренних заметок
- подготовка content ideas list
- генерация short internal checklists
- напоминания о follow-up
- сбор данных через чат до этапа handoff

### Examples
- новый лид автоматически получает status `new`
- AI формирует summary из формы
- chat widget задаёт 5–7 intake вопросов
- система ставит source = `website_chat`

### Rule
Если действие не видно клиенту и не меняет коммерческие ожидания, оно обычно подходит под Level 1.

---

## 6. Level 2 — Draft + human review

### Requires approval before public use
- Facebook posts
- group post drafts
- comment reply drafts
- DM reply drafts
- website copy changes
- FAQ additions
- follow-up messages
- business lead response drafts
- home-user reply drafts
- review request drafts
- pinned post updates

### Why
Это уже клиентская или публичная коммуникация.
Даже если AI сделал хороший черновик, нужен контроль:
- тона
- обещаний
- точности
- уместности

### Rule
Nothing public-facing should auto-send in MVP.

---

## 7. Level 3 — Human-only final decision

### Must remain under direct founder control
- финальная оценка стоимости
- quote / estimate with commercial meaning
- обещания выезда
- обещания сроков
- сложные business discussions
- ответы на негатив / конфликт
- юридические тексты final version
- решение “берём / не берём” сложный кейс
- ответы на нестандартные технические запросы
- любые коммуникации, где ошибка может подорвать доверие

### AI role here
AI may:
- сделать summary
- предложить draft
- структурировать ответ
- выделить риски
- предложить escalation

But human must decide and approve final wording.

---

## 8. Approval matrix by content type

| Item | AI draft allowed | Auto-publish/send allowed | Human approval required |
|---|---:|---:|---:|
| Lead summary | yes | yes | no |
| Lead tagging | yes | yes | no |
| CRM note creation | yes | yes | no |
| Facebook post draft | yes | no | yes |
| Group post draft | yes | no | yes |
| Comment reply draft | yes | no | yes |
| DM reply draft | yes | no | yes |
| Follow-up draft | yes | no | yes |
| FAQ draft | yes | no | yes |
| Website text update | yes | no | yes |
| Quote / estimate wording | yes | no | yes |
| Exact price promise | limited | no | yes |
| Legal text final wording | limited | no | yes |
| Conflict response | limited | no | yes |

---

## 9. Founder approval responsibilities

### Founder must approve
- all outgoing public messaging
- all direct client replies with commercial implications
- all Facebook posts before publication
- all group posts before posting
- all pricing-related replies
- all final copy changes to site
- all legal page final wording
- all “edge case” client situations

### Founder may delegate later
После накопления опыта можно позже ослабить approval на части контента, но не на старте.

---

## 10. Suggested operational workflow

### Workflow A — Content
```text
Topic selected
  → AI drafts post
  → human edits/reviews
  → approve
  → publish
```

### Workflow B — Lead reply

```text id="o0m4p2"
Lead arrives
  → AI summary + tags
  → AI drafts reply
  → human reviews
  → human sends
```

### Workflow C — Chat intake

```text id="o64sbb"
User opens chat
  → AI asks intake questions
  → AI creates summary
  → user provides contact
  → lead enters CRM
  → human reviews next reply
```

### Workflow D — Follow-up

```text id="r8xtbg"
Lead in waiting_reply
  → system suggests follow-up
  → AI drafts
  → human approves
  → send
```

---

## 11. Approval states model

### Recommended content/communication states

* `draft_generated`
* `needs_review`
* `approved`
* `sent`
* `published`
* `rejected`
* `needs_rewrite`

### Why useful

Позволяет Tech Lead построить понятный workflow, даже если сначала это будет просто в docs/Sheets/CRM notes.

---

## 12. Minimum approval steps for MVP

### For public content

1. AI draft
2. founder review
3. founder approve
4. manual publish

### For direct client messaging

1. AI summary
2. AI draft reply
3. founder review
4. founder send manually

### For internal automation

1. system action
2. optional founder visibility in CRM/log

---

## 13. What qualifies as “safe enough to auto-run”

### Safe auto-run checklist

Action is usually safe if:

* it is internal only
* it does not go to the client directly
* it does not create a promise
* it does not change pricing expectations
* it does not publish publicly
* it is reversible or low-risk

### If any doubt

Move it to `draft + approval`.

---

## 14. High-risk content categories

### Always high-risk

* pricing language
* delivery timing
* scope promises
* legal / privacy commitments
* negative public replies
* custom technical advice without context
* business setup promises
* responses involving security / data loss / blame

### Rule

High-risk = human must review.

---

## 15. Approval triggers

### Automatic trigger to require human approval

* message contains pricing
* message contains “can do by X date”
* message addresses complaint / frustration
* business lead has more than simple setup scope
* request looks outside typical offer stack
* message edits legal/privacy text
* post is going to public channel

---

## 16. Rejection / rewrite logic

### Human may reject draft if:

* too verbose
* too technical
* too salesy
* too vague
* sounds robotic
* promises too much
* wrong tone for business/home user
* misses CTA
* not aligned with AzurSysTech positioning

### After rejection

Status:

* `needs_rewrite`
  or
* manual rewrite by founder

---

## 17. Auditability and logging

### Recommendation

For important AI outputs, system should log:

* input type
* generated draft
* approval decision
* final sent/published version
* timestamp
* human approver

### Why

Позже это поможет:

* улучшать prompts
* видеть типовые ошибки
* обучать процесс
* сохранять контроль

### MVP note

At first, this can be simple:

* structured run artifact in `05_ai/runs/`
* CRM note
* Google Sheet
* or admin panel later

---

## 18. Approval by channel

### Website

* static copy: human approval required
* form success/error copy: human approval required
* legal/privacy: human final approval mandatory

### Facebook Page

* all posts: human approval
* pinned post: human approval
* comments: draft optional, human sends
* DMs: draft optional, human sends

### Chat widget

* intake flow may be auto-run
* handoff copy should be pre-approved
* no autonomous pricing or promises

### CRM / internal notes

* auto allowed

---

## 19. Approval by business function

### Marketing

AI can draft heavily, but human approves publication.

### Lead intake

AI can classify and summarize automatically.

### Sales/contact

AI can assist, but human owns external send.

### Legal/compliance

AI may help draft, but human owns all final language.

### Operations

AI may help remind and structure, but not commit.

---

## 20. Suggested MVP implementation rules for Tech Lead

### Must implement

* clear separation between internal AI actions and outward-facing actions
* approval gate before publish/send
* visible draft status
* easy review interface or simple manual handoff path
* no auto-send by default for public/client messages

### Nice to have later

* approve/reject buttons
* draft revision history
* approval queue
* auto-routing by risk level

---

## 21. Human-in-the-loop defaults

### Default mode

If no explicit rule exists:

* generate draft
* require human approval

### Why

Safer for MVP and early brand stage.

---

## 22. Acceptance criteria

Approval workflow is valid if:

* AI can help without over-controlling the business
* public/client-facing outputs cannot slip out without review
* internal automation remains fast
* riskier outputs are clearly gated
* Tech Lead can implement approval logic without ambiguity

---

## Current status

Downstream sequencing is now managed through `docs/specs`, `docs/plans`, `docs/tasklist`, and `memory_bank/*`.
