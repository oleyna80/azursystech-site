# ai-automation-brief-schema.md
_version: v0.1
_owner: Marketing Lead
_status: draft
_brand: AzurSysTech
_primary_language: ru
_doc_type: lead_schema + discovery_brief_schema

---

## 1. Цель документа

Зафиксировать единую схему brief-формы для страницы `/brief`, чтобы:

- клиент мог оставить структурированный запрос на AI-автоматизацию
- форма собирала достаточно данных для первого discovery
- AI-ассистент понимал, как помогать с каждым полем
- backend и CRM могли получать единый payload
- qualification происходила по понятной логике

---

## 2. Роль brief-а

### What this brief is
Это **краткий discovery brief** для первого обсуждения задачи по AI-автоматизации.

### What this brief is NOT
Это не:
- полноценное техническое задание
- не детальный solution design
- не финальный scope document
- не обязательство по цене, срокам или внедрению

### Main purpose
Понять:
- какой бизнес-процесс клиент хочет улучшить
- где у него сейчас bottleneck
- подходит ли задача для пилота / discovery / AI-agent use case
- какой следующий шаг разумен

---

## 3. Основной принцип

### Core rule
Форма должна быть:
- понятной
- не слишком длинной
- полезной для qualification
- пригодной для AI-assisted completion
- пригодной для CRM / backend handoff

### Form design rule
Собирать только ту информацию, которая действительно помогает:
- понять задачу
- оценить fit
- выбрать следующий шаг

---

## 4. High-level block structure

### Block A
О компании / бизнесе

### Block B
О задаче и цели автоматизации

### Block C
О текущем процессе

### Block D
О системах, каналах и ограничениях

### Block E
О запуске, приоритетах и контакте

---

## 5. Field naming convention

### Recommendation
Each field should have:
- `field_key`
- `label_ru`
- `field_type`
- `required`
- `help_purpose`
- `example_answer`
- `ai_assistant_guidance`
- `qualification_impact`

### Field key style
Use stable snake_case keys, for example:
- `company_name`
- `business_type`
- `main_problem`
- `current_channels`

---

## 6. Block A — О компании / бизнесе

### Field A1
#### field_key
`company_name`

#### label_ru
Название компании / проекта

#### field_type
text

#### required
yes

#### help_purpose
Понять, с кем мы работаем и как называть клиента дальше.

#### example_answer
AzurSysTech / LocalFix / Studio Nova

#### ai_assistant_guidance
Помоги клиенту указать название бизнеса, бренда или проекта, под которым ведётся работа.

#### qualification_impact
Low for technical fit, high for CRM clarity.

---

### Field A2
#### field_key
`website_url`

#### label_ru
Сайт компании

#### field_type
url

#### required
no

#### help_purpose
Дать контекст по бизнесу, услугам и digital presence.

#### example_answer
https://example.com

#### ai_assistant_guidance
Если сайта нет, можно оставить пустым или указать основной публичный профиль/страницу.

#### qualification_impact
Medium.

---

### Field A3
#### field_key
`business_type`

#### label_ru
Тип бизнеса

#### field_type
select + optional_other

#### required
yes

#### suggested_options
- локальная сервисная компания
- small office / cabinet
- e-commerce
- retail / магазин
- agency / studio
- consultant / expert business
- другое

#### help_purpose
Сегментация и выбор релевантных use cases.

#### example_answer
локальная сервисная компания

#### ai_assistant_guidance
Помоги выбрать наиболее близкий тип бизнеса, не уходя в сложные классификации.

#### qualification_impact
High.

---

### Field A4
#### field_key
`target_market`

#### label_ru
Основной рынок / география

#### field_type
text or multi-select

#### required
no

#### suggested_examples
- Франция
- ЕС
- США
- Канада
- Австралия
- локальный рынок
- международный рынок

#### help_purpose
Понять масштаб и языковую/канальную сложность.

#### ai_assistant_guidance
Помоги кратко указать страны или рынок, на который работает бизнес.

#### qualification_impact
Medium.

---

### Field A5
#### field_key
`team_size`

#### label_ru
Размер команды

#### field_type
select

#### required
no

#### suggested_options
- 1
- 2–5
- 6–10
- 11–25
- 25+

#### help_purpose
Оценка операционной зрелости и масштаба процесса.

#### ai_assistant_guidance
Если клиент не знает точный размер, достаточно приблизительного диапазона.

#### qualification_impact
Medium.

---

## 7. Block B — О задаче и цели автоматизации

### Field B1
#### field_key
`main_goal`

#### label_ru
Что вы хотите автоматизировать в первую очередь?

#### field_type
textarea

#### required
yes

#### help_purpose
Это главное поле brief-а. Оно фиксирует стартовый процесс.

#### example_answer
Хочу автоматизировать первичную обработку заявок с сайта и из WhatsApp.

#### ai_assistant_guidance
Помоги клиенту назвать **один главный процесс**, а не весь список хотелок.

#### qualification_impact
Very high.

---

### Field B2
#### field_key
`main_problem`

#### label_ru
Какая проблема сейчас ощущается сильнее всего?

#### field_type
textarea

#### required
yes

#### help_purpose
Понять pain point и реальную причину интереса к автоматизации.

#### example_answer
Заявки приходят из разных каналов, часть теряется, а сотрудники тратят много времени на одинаковые уточнения.

#### ai_assistant_guidance
Помоги клиенту описать проблему через потери времени, хаос, задержки, пропущенные заявки или повторяющиеся действия.

#### qualification_impact
Very high.

---

### Field B3
#### field_key
`desired_result`

#### label_ru
Какой результат вы хотите получить на выходе?

#### field_type
textarea

#### required
yes

#### help_purpose
Понять ожидаемый outcome без ухода в инструментальный язык.

#### example_answer
Чтобы обращения автоматически собирались в одну структуру, квалифицировались и передавались дальше уже с кратким summary.

#### ai_assistant_guidance
Помоги описывать результат через бизнес-эффект, а не через стек.

#### qualification_impact
Very high.

---

### Field B4
#### field_key
`priority_use_case`

#### label_ru
Какой сценарий для вас сейчас самый важный?

#### field_type
select

#### required
yes

#### suggested_options
- обработка заявок с сайта
- intake из чата / мессенджеров
- первичная qualification
- клиентская поддержка по типовым вопросам
- маршрутизация обращений
- follow-up и напоминания
- шаблонный документооборот
- другое

#### help_purpose
Помогает сразу привязать лид к use case cluster.

#### ai_assistant_guidance
Если клиент назвал несколько вещей, помоги выбрать главный первый сценарий.

#### qualification_impact
High.

---

### Field B5
#### field_key
`why_now`

#### label_ru
Почему вы хотите заняться этим сейчас?

#### field_type
textarea

#### required
no

#### help_purpose
Понять urgency, business timing и зрелость запроса.

#### example_answer
Количество обращений выросло, и ручная обработка уже тормозит продажи.

#### ai_assistant_guidance
Помоги ответить через причину: рост обращений, хаос, потеря времени, масштабирование, перегрузка команды.

#### qualification_impact
Medium to high.

---

## 8. Block C — О текущем процессе

### Field C1
#### field_key
`current_process_description`

#### label_ru
Как этот процесс выглядит сейчас?

#### field_type
textarea

#### required
yes

#### help_purpose
Без этого невозможно понять, что именно нужно менять.

#### example_answer
Клиент оставляет заявку на сайте или пишет в WhatsApp, потом один сотрудник вручную отвечает, уточняет детали и переносит всё в таблицу.

#### ai_assistant_guidance
Попроси описать процесс простыми шагами: откуда приходит запрос, кто отвечает, куда попадают данные, что происходит дальше.

#### qualification_impact
Very high.

---

### Field C2
#### field_key
`current_channels`

#### label_ru
Через какие каналы сейчас приходят заявки и обращения?

#### field_type
multi-select + optional_other

#### required
yes

#### suggested_options
- сайт / форма
- чат на сайте
- WhatsApp
- Facebook / Instagram
- email
- телефон
- маркетплейс
- CRM
- другое

#### help_purpose
Понять multi-channel complexity.

#### ai_assistant_guidance
Помоги выбрать все реальные каналы, но не фантазировать про будущие.

#### qualification_impact
High.

---

### Field C3
#### field_key
`current_owner_of_process`

#### label_ru
Кто сейчас обрабатывает этот процесс?

#### field_type
text / select

#### required
no

#### suggested_examples
- владелец бизнеса
- менеджер
- администратор
- отдел продаж
- support
- несколько человек

#### help_purpose
Понять human workflow и место handoff.

#### ai_assistant_guidance
Помоги коротко описать, кто сейчас “держит” процесс.

#### qualification_impact
Medium.

---

### Field C4
#### field_key
`main_bottleneck`

#### label_ru
Где сейчас самый узкий участок процесса?

#### field_type
textarea

#### required
yes

#### help_purpose
Найти лучший участок для пилотной автоматизации.

#### example_answer
На этапе первого ответа и сбора информации: нужно вручную задавать одни и те же вопросы.

#### ai_assistant_guidance
Помоги выбрать **один основной bottleneck**.

#### qualification_impact
Very high.

---

## 9. Block D — О системах, данных и ограничениях

### Field D1
#### field_key
`current_tools`

#### label_ru
Какие системы или инструменты уже используются сейчас?

#### field_type
textarea or tag input

#### required
no

#### examples
- сайт
- CRM
- Google Sheets
- email
- WhatsApp
- внутренняя таблица
- helpdesk
- ERP
- no structured tool yet

#### help_purpose
Понять integration surface without making tools the center of the page.

#### ai_assistant_guidance
Если клиент не хочет перечислять стек подробно, достаточно базового уровня: сайт, таблицы, CRM, мессенджеры и т.д.

#### qualification_impact
Medium.

---

### Field D2
#### field_key
`human_approval_required`

#### label_ru
На каких этапах обязательно нужен контроль человека?

#### field_type
multi-select + textarea

#### required
yes

#### suggested_options
- первый ответ
- qualification
- передача в работу
- цена / коммерческое предложение
- сроки / запись
- документы
- финальный ответ клиенту
- не уверен

#### help_purpose
Это критичное поле для безопасного AI design.

#### ai_assistant_guidance
Помоги клиенту подумать, где automation допустима, а где нужен human-in-the-loop.

#### qualification_impact
Very high.

---

### Field D3
#### field_key
`sensitive_data_or_constraints`

#### label_ru
Есть ли чувствительные данные, ограничения или особенности, которые нужно учитывать?

#### field_type
textarea

#### required
no

#### examples
- персональные данные
- медицинские данные
- финансовая информация
- внутренние документы
- ограничения по стране
- ограничения по хранению данных

#### help_purpose
Раннее выявление risk/compliance concerns.

#### ai_assistant_guidance
Если клиент не уверен, можно дать короткий пример: личные данные клиентов, платежные данные, внутренние документы и т.д.

#### qualification_impact
High.

---

### Field D4
#### field_key
`what_must_not_happen`

#### label_ru
Чего точно не должно происходить в такой автоматизации?

#### field_type
textarea

#### required
yes

#### examples
- агент не должен сам обещать цену
- нельзя отправлять сообщения без проверки
- нельзя менять данные в CRM без подтверждения
- нельзя отвечать на сложные обращения без человека

#### help_purpose
Фиксирует boundaries and risk controls.

#### ai_assistant_guidance
Помоги сформулировать запреты и опасения клиента простыми словами.

#### qualification_impact
Very high.

---

## 10. Block E — Формат запуска, приоритет и контакт

### Field E1
#### field_key
`preferred_start_mode`

#### label_ru
С чего вы хотите начать?

#### field_type
select

#### required
yes

#### suggested_options
- аудит и разбор процесса
- пилот на одном процессе
- AI-агент для обработки заявок
- AI-агент для клиентских обращений
- автоматизация документооборота по шаблону
- пока нужен только discovery call
- не уверен

#### help_purpose
Помогает сразу перевести лид в правильный next step.

#### ai_assistant_guidance
Если клиент не знает, safest choice — аудит / пилот / discovery.

#### qualification_impact
High.

---

### Field E2
#### field_key
`timeline_priority`

#### label_ru
Насколько срочно вы хотите начать?

#### field_type
select

#### required
no

#### suggested_options
- как можно скорее
- в ближайшие 2–4 недели
- в ближайшие 1–3 месяца
- просто изучаю варианты

#### help_purpose
Timeline qualification.

#### ai_assistant_guidance
Помоги выбрать реальный горизонт, без давления.

#### qualification_impact
Medium.

---

### Field E3
#### field_key
`budget_range`

#### label_ru
Есть ли ориентир по бюджету?

#### field_type
select or text

#### required
no

#### suggested_options
- пока без бюджета
- нужен сначала аудит
- до 1 000 €
- 1 000–3 000 €
- 3 000–10 000 €
- 10 000 €+
- предпочитаю обсудить

#### help_purpose
Optional commercial qualification.

#### ai_assistant_guidance
Не давить. Поле опционально. Если клиент не хочет отвечать — это нормально.

#### qualification_impact
Medium.

---

### Field E4
#### field_key
`contact_name`

#### label_ru
Имя

#### field_type
text

#### required
yes

#### help_purpose
Контакт для дальнейшего обсуждения.

#### ai_assistant_guidance
Нужно имя человека, с которым можно продолжить обсуждение.

#### qualification_impact
Operationally high.

---

### Field E5
#### field_key
`contact_email`

#### label_ru
Email

#### field_type
email

#### required
yes

#### help_purpose
Главный канал для follow-up.

#### ai_assistant_guidance
Проверять, что это рабочий email.

#### qualification_impact
Operationally high.

---

### Field E6
#### field_key
`contact_phone_or_whatsapp`

#### label_ru
Телефон / WhatsApp

#### field_type
text

#### required
no

#### help_purpose
Быстрый канал связи.

#### ai_assistant_guidance
Можно указать один номер, если он удобен и для звонка, и для WhatsApp.

#### qualification_impact
Medium to high.

---

### Field E7
#### field_key
`preferred_contact_method`

#### label_ru
Как с вами удобнее связаться?

#### field_type
select

#### required
no

#### suggested_options
- email
- WhatsApp
- телефон
- созвон / meeting
- не важно

#### help_purpose
Improves next-step handling.

#### ai_assistant_guidance
Помоги выбрать один предпочтительный канал.

#### qualification_impact
Operationally medium.

---

## 11. Derived internal fields

These fields are not necessarily shown to the client directly, but should be derived by system / AI / backend after submission.

### Derived D1
`brief_fit_level`
- high
- medium
- low
- unknown

### Derived D2
`brief_primary_use_case`
- lead_intake
- qualification
- support
- routing
- document_workflow
- ecom_workflow
- discovery_other

### Derived D3
`brief_complexity_level`
- simple_pilot
- medium_workflow
- complex_multi_system
- unclear

### Derived D4
`brief_risk_flags`
Examples:
- pricing_sensitive
- legal_sensitive
- data_sensitive
- high_human_control_required
- integration_unclear

### Derived D5
`recommended_next_step`
- discovery_call
- audit
- pilot_discussion
- request_more_info
- out_of_scope_review

---

## 12. Submission payload recommendation

### Minimum payload should include
- all visible field values
- derived summary
- derived fit/use_case/complexity
- source = `brief_form`
- route = `/brief`
- timestamp
- optional ai_assist_used = true/false

### Summary block recommendation
System should create a short structured summary:
- business type
- main goal
- main problem
- current workflow
- first use case
- human approval needs
- key constraints
- recommended next step

---

## 13. AI assistant relationship to schema

### AI assistant must use this schema to:
- explain what each field means
- help user formulate concise answers
- ask clarifying questions only when needed
- avoid overcomplicating the brief
- keep the user focused on one main process
- detect where human control is required

### AI assistant must not:
- write a full solution architecture
- promise outcomes
- propose prices
- commit to integrations
- turn the brief into a long consulting session

---

## 14. Validation logic recommendations

### Required fields
- company_name
- business_type
- main_goal
- main_problem
- desired_result
- priority_use_case
- current_process_description
- current_channels
- main_bottleneck
- human_approval_required
- what_must_not_happen
- preferred_start_mode
- contact_name
- contact_email

### Optional but useful
- website_url
- target_market
- team_size
- why_now
- current_owner_of_process
- current_tools
- sensitive_data_or_constraints
- timeline_priority
- budget_range
- contact_phone_or_whatsapp
- preferred_contact_method

---

## 15. UX recommendation for form length

### Rule
Do not show everything as one giant wall.

### Suggested grouping
- Step 1: business context
- Step 2: main problem and goal
- Step 3: current workflow
- Step 4: constraints and control
- Step 5: launch mode and contact

### Note
This is a brief, not a full specification.

---

## 16. Qualification logic summary

### A strong brief usually has:
- one clear main process
- one clear pain point
- one understandable desired result
- a basic description of the current workflow
- clear statement of where human approval is needed
- a realistic first step

### A weak brief usually has:
- vague “want AI in business”
- too many goals at once
- no clear current process
- no idea where the bottleneck is
- no boundaries
- no usable contact path

---

## 17. Acceptance criteria

Schema is valid if:
- it supports a useful first discovery brief
- it is specific enough for qualification
- it is not too heavy for a website form
- AI assistant can use it consistently
- backend / CRM can map it later
- the brief stays practical and business-focused