# escalation-rules.md
_version: v0.1
_owner: Marketing Lead
_status: approved policy baseline
_brand: AzurSysTech
_primary_language: ru

---

## 1. Цель документа

Зафиксировать правила эскалации для AI-систем **AzurSysTech**, чтобы:

- AI понимал, когда нельзя отвечать или действовать самостоятельно
- рискованные ситуации сразу передавались founder'у
- не возникало ложных обещаний клиентам
- Tech Lead мог реализовать безопасную логику маршрутизации
- бизнес и частные клиенты обрабатывались по-разному там, где это важно

---

## 2. Основной принцип

### Core principle
Если есть риск:
- неверного обещания,
- коммерческой ошибки,
- ущерба доверию,
- юридической неточности,
- конфликтной ситуации,

то AI **не должен закрывать вопрос сам**.

### Escalation rule
В любой неоднозначной или чувствительной ситуации AI должен:
1. зафиксировать summary
2. пометить риск
3. передать founder'у
4. не отправлять финальный ответ автоматически

---

## 3. Что такое escalation в AzurSysTech

### Definition
Escalation = передача ситуации на ручную обработку founder'у, потому что:

- нужен человеческий judgement
- нужен коммерческий выбор
- нужна техническая ответственность
- есть риск потери лида или репутации
- AI не должен делать окончательный вывод

### Output of escalation
AI должен не просто “остановиться”, а передать:
- summary ситуации
- proposed category
- why escalated
- what is missing
- suggested next human action

---

## 4. Escalation model

### Three escalation levels

#### Level 1 — Soft escalation
AI может сделать черновик, но обязательно нужен review.

#### Level 2 — Strong escalation
AI может только структурировать ситуацию и предложить варианты, но не должен формировать окончательный клиентский ответ.

#### Level 3 — Immediate handoff
AI должен прекратить самостоятельную обработку и сразу передать founder'у без попытки “решить самому”.

---

## 5. Escalation categories

### Category A — Pricing / quote risk
Все ситуации, где клиент хочет:
- точную цену
- quote
- estimate
- коммерческое подтверждение
- “сколько будет стоить весь проект?”

### Category B — Scheduling / availability risk
Все ситуации, где клиент хочет:
- подтверждение выезда
- дату / время
- срок исполнения
- “можете завтра?”
- “за сколько это сделаете?”

### Category C — Scope ambiguity
Ситуации, где непонятно:
- объём работ
- сколько устройств
- бизнес это или дом
- одна задача это или целая среда
- входит ли это в scope AzurSysTech

### Category D — Conflict / complaint
Ситуации:
- недовольство
- претензия
- спор
- публичный негатив
- эмоционально заряженный клиент

### Category E — Legal / privacy / responsibility
Ситуации:
- вопросы по обработке данных
- спор про ответственность
- потерю данных
- гарантию
- обязательства
- юридические формулировки

### Category F — High-complexity business lead
Ситуации, где лид похож уже не на “простую TPE-настройку”, а на:
- более широкий инфраструктурный проект
- многокомпонентную среду
- нестандартную бизнес-задачу
- extended scope beyond MVP

### Category G — Technical uncertainty
Ситуации, где AI не уверен:
- что проблема относится к типовым услугам
- что ответ будет безопасным
- что вывод корректен без доп. контекста

---

## 6. Level 1 — Soft escalation

### Use when
- ответ можно подготовить как draft
- risk is moderate
- нужен просто контроль тона / обещаний / точности

### Typical cases
- обычный DM reply для бизнеса
- пост для Facebook
- follow-up draft
- FAQ expansion
- ответ с мягкой ценовой рамкой без commit

### AI may do
- summary
- draft
- highlight uncertain parts

### Human must do
- approve
- edit if needed
- send/publish manually

---

## 7. Level 2 — Strong escalation

### Use when
- нужна коммерческая или техническая оценка
- клиент уже ожидает конкретики
- ошибка может сформировать неверные ожидания

### Typical cases
- “сколько будет стоить?”
- “можно ли сделать 5 рабочих мест + сеть + принтеры?”
- “какие сроки?”
- “входит ли в цену …?”
- “можете ли вы сделать это и это вместе?”

### AI may do
- summarize request
- identify likely service cluster
- list missing data
- prepare structured internal note

### AI must not do
- давать точный quote
- подтверждать цену
- подтверждать срок
- обещать взяться

---

## 8. Level 3 — Immediate handoff

### Use when
- есть негатив
- есть спор
- есть претензия
- вопрос юридически чувствителен
- вопрос касается ответственности за ущерб / данные
- клиент требует обязательств
- задача выглядит вне основного scope
- есть сильная неоднозначность

### Typical cases
- “После вашей настройки у нас пропали данные”
- “Кто отвечает, если что-то не заработает?”
- “Мне срочно нужен выезд сегодня, подтверждайте”
- “Нам нужен полноценный сервер / база / сложная сеть, возьмётесь?”
- “Это нарушение закона / privacy?”
- angry public comment

### AI must do
- stop autonomous path
- produce escalation summary
- mark severity
- route to founder

### AI must not do
- спорить
- оправдываться
- обещать компенсацию
- брать ответственность
- давать правовые ответы
- давать жёсткое yes/no по сложному scope

---

## 9. Escalation triggers by topic

# 9.1 Pricing triggers
Escalate if message includes:
- “точная цена”
- “итоговая стоимость”
- “сделайте расчёт”
- “сколько будет стоить весь объём”
- “подтвердите цену”
- “скидка / special condition”

### Recommended level
- usually Level 2
- Level 3 if conflict around price

---

# 9.2 Scheduling triggers
Escalate if message includes:
- “когда сможете приехать”
- “подтвердите время”
- “завтра / сегодня / срочно”
- “точный срок”
- “обязуетесь ли вы сделать к…”

### Recommended level
- usually Level 2
- Level 3 if customer is pressuring for hard commitment

---

# 9.3 Scope triggers
Escalate if:
- multiple service areas are mixed
- unclear environment size
- signs of advanced business infrastructure
- request may exceed MVP offer stack
- customer asks “сделаете всё под ключ?” without context

### Recommended level
- Level 2 or 3 depending on ambiguity

---

# 9.4 Complaint triggers
Escalate if:
- client sounds angry
- there is blame
- there is public reputational risk
- client claims poor service / damage
- client threatens bad review / escalation

### Recommended level
- always Level 3

---

# 9.5 Legal / privacy triggers
Escalate if:
- user asks about retention / deletion / privacy rights in a concrete case
- asks about legal liability
- asks about guarantees / responsibilities
- asks about invoices, legal status, mediation in a sensitive way
- asks something beyond prepared approved wording

### Recommended level
- usually Level 3

---

## 10. Escalation triggers by channel

# Website form
### Escalate if
- business lead looks large / ambiguous
- customer requests exact estimate in description
- task seems outside normal scope
- there are legal/complaint elements in free text

### Default
Forms are usually safe for Level 1 processing, unless one of the above appears.

---

# Website chat
### Escalate if
- user asks for exact price
- user asks for guaranteed time/date
- user asks legal/privacy question
- user becomes upset or argumentative
- request complexity exceeds normal intake logic

### Rule
Chat should hand off instead of improvising.

---

# Facebook comments
### Escalate if
- public complaint
- aggressive public challenge
- pricing argument in public
- business request too complex for comments

### Rule
In comments, escalation often means:
- short calming public reply
- move to DM
- founder handles next step

---

# DMs / Messenger
### Escalate if
- client wants commitments
- asks exact price or exact date
- request looks complex
- customer is upset
- customer asks for non-standard technical scope

### Rule
DM can be used for clarification, but escalation happens before commitment.

---

## 11. Business vs home-user escalation differences

# Business leads
### Escalate earlier when
- there are multiple workstations
- there is network + printers + shared folders + rollout
- there is any sign of broader office environment
- there is expectation of project-like setup
- client asks for “everything” in one request

### Why
Business mistakes are more expensive:
- commercially
- operationally
- reputationally

### Tendency
Be conservative: escalate sooner.

---

# Home-user leads
### Escalate when
- exact quote requested beyond simple case
- conflict / blame
- data loss / guarantee concern
- unusual complexity
- unclear technical risk
- demand for immediate hard commitment

### Tendency
More can stay in Level 1–2, but conflict and guarantee questions go straight higher.

---

## 12. “Do not answer directly” scenarios

AI must not answer directly in these scenarios:

### Scenario 1
Client asks:
“Сколько точно будет стоить весь проект?”

### Scenario 2
Client asks:
“Можете подтвердить, что приедете завтра в 10?”

### Scenario 3
Client says:
“После вашей работы что-то сломалось / пропали данные”

### Scenario 4
Client asks:
“Вы гарантируете, что это всё будет работать?”

### Scenario 5
Business lead asks:
“Нам нужно настроить офис / сеть / сервер / всё под ключ, возьмётесь?”

### Scenario 6
User asks legal/privacy question not covered by approved text.

### Scenario 7
Public negative comment escalates emotionally.

---

## 13. Escalation output format

When escalating, AI should generate a structured internal note:

### Suggested structure
- `escalation_level`
- `escalation_category`
- `channel`
- `lead_type`
- `summary`
- `risk_reason`
- `missing_information`
- `suggested_human_action`

### Example
```text
escalation_level: 2
escalation_category: pricing_risk
channel: facebook_messenger
lead_type: tpe
summary: small office asks for 3 workstations + wifi + printer setup
risk_reason: exact price requested without enough scope detail
missing_information: address, workstation count confirmation, existing setup state
suggested_human_action: review and send structured clarification reply
```

---

## 14. Escalation severity hints

### Severity low

* minor uncertainty
* wording needs human polish
* low reputational risk

### Severity medium

* commercial misunderstanding likely
* scope unclear
* business lead with moderate complexity

### Severity high

* conflict
* legal/privacy risk
* promise/commitment pressure
* blame/responsibility issue
* reputational risk

### Mapping

* low → Level 1
* medium → Level 2
* high → Level 3

---

## 15. Escalation response strategy

### After escalation

Human should choose one of:

* approve AI draft
* rewrite manually
* ask for more info
* move discussion to another channel
* decline politely
* postpone

### Important

Escalation is not failure.
It is a safety mechanism.

---

## 16. Escalation + approval interaction

### Rule

Escalation and approval are related but different.

#### Approval

Needed for many outward-facing drafts by default.

#### Escalation

Needed when the case is risky, sensitive, ambiguous, or above AI authority.

### Practical logic

* many items need approval
* only some need escalation
* all escalated items also need human approval
* not all approved items are escalated

---

## 17. Implementation guidance for Tech Lead

### Must support

* keyword / intent-based escalation triggers
* manual escalation option
* structured escalation note
* queue or log of escalated items
* founder visibility

### Nice to have later

* risk score
* escalation dashboard
* auto-priority ranking
* escalation reason analytics

### MVP rule

Even a simple internal note + status flag is enough at first.

---

## 18. Fallback rule for uncertainty

### Default fallback

If AI is uncertain whether it should answer directly:

* do not answer fully
* ask at most a neutral clarification
* or escalate

### Safer principle

When in doubt, escalate.

---

## 19. Acceptance criteria

Escalation rules are valid if:

* risky topics are clearly identified
* business leads are escalated earlier when needed
* conflict/legal/pricing commitment cases cannot slip through
* Tech Lead can implement routing without ambiguity
* founder remains in control of high-risk decisions

---

## Current status

Downstream sequencing is now managed through `docs/specs`, `docs/plans`, `docs/tasklist`, and `memory_bank/*`.
