# brief-form-spec.md
_version: v0.1
_owner: Marketing Lead
_status: draft
_brand: AzurSysTech
_primary_language: ru
_route: /brief
_doc_type: form_spec

---

## 1. Цель документа

Описать страницу `/brief` и brief-форму для запроса на AI-автоматизацию, чтобы:

- кодер понимал, что именно нужно реализовать
- форма собирала структурированный discovery brief
- UX был достаточно простым для клиента
- AI-ассистент мог помогать с заполнением
- submit payload был пригоден для CRM / backend / Google Sheets

---

## 2. Роль страницы `/brief`

### What this page is
Это страница для **краткого брифа на AI-автоматизацию**.

### What this page is NOT
Это не:
- полноценное техническое задание
- не instant quote form
- не консультация в реальном времени
- не страница с жёстким пресейлом

### Main job
Помочь клиенту:
- описать один главный процесс
- зафиксировать проблему
- дать контекст по текущему workflow
- обозначить ограничения
- оставить контакт для следующего шага

---

## 3. Главная конверсионная задача

### Primary conversion goal
Получить достаточно качественный brief для следующего шага:
- discovery call
- audit
- pilot discussion
- request for more information

### Secondary goals
- помочь клиенту лучше сформулировать задачу
- повысить качество входящих лидов
- снизить долю слишком расплывчатых обращений
- подготовить данные для human review

---

## 4. Источники истины

Эта форма должна соответствовать:

- `03_leads/ai-automation-brief-schema.md`
- `02_website/ai-automation-page.md`
- `02_website/ai-automation-page-copy.md`
- `03_leads/lead-intake-spec.md`
- `05_ai/brief-assistant-spec.md` (после создания)

Если возникает конфликт между UI-решением и schema-логикой, schema выигрывает.

---

## 5. Общий UX-подход

### Form style
Форма должна быть:
- деловой
- понятной
- не пугающей
- пошаговой
- пригодной для mobile
- удобной без чата
- лучше с чатом

### UX principle
Пользователь не должен видеть “40 полей сразу”.

### Recommended mode
Multi-step form with progress:
- Step 1: business context
- Step 2: main problem and goal
- Step 3: current workflow
- Step 4: constraints and control
- Step 5: launch and contact

### Additional mode
В desktop можно показывать:
- форму слева/по центру
- AI-ассистента справа или в sticky help widget

На mobile:
- форма основная
- AI-ассистент как collapsible helper or separate chat button

---

## 6. Required page structure

### Section A — Hero / intro
Короткий intro-block над формой.

#### Goal
Объяснить:
- зачем нужен этот brief
- что это не полное ТЗ
- что можно начать с одного процесса

#### Suggested copy direction
Заполните краткий бриф, чтобы описать задачу по AI-автоматизации. Это поможет быстрее понять, какой процесс имеет смысл автоматизировать первым и какой следующий шаг будет разумным.

#### Intro bullets
- Это не полное техническое задание
- Достаточно одного главного процесса
- Если нужно, AI-ассистент поможет заполнить форму

---

### Section B — Brief form
Основной multi-step form component.

---

### Section C — AI assistant helper area
Помогающий блок:
- встроенный чат
или
- contextual help panel
или
- assistant trigger button

AI-ассистент не заменяет форму, а помогает её заполнить.

---

### Section D — Short trust / next-step note
Короткий блок после формы:
- что будет после отправки
- что brief не означает автоматического коммерческого обещания
- кто и как свяжется

---

## 7. Form step structure

## Step 1 — О компании / бизнесе

### Goal
Собрать базовый business context.

### Fields
- `company_name`
- `website_url`
- `business_type`
- `target_market`
- `team_size`

### UX note
Шаг должен быть быстрым и не перегруженным.

---

## Step 2 — О задаче и цели автоматизации

### Goal
Понять главный use case.

### Fields
- `main_goal`
- `main_problem`
- `desired_result`
- `priority_use_case`
- `why_now`

### UX note
Это ключевой шаг.
Полям `main_goal`, `main_problem`, `desired_result` нужно дать хорошие helper texts.

---

## Step 3 — О текущем процессе

### Goal
Понять, как всё устроено сейчас.

### Fields
- `current_process_description`
- `current_channels`
- `current_owner_of_process`
- `main_bottleneck`

### UX note
Желательно дать короткий prompt:
“Опишите процесс простыми шагами: откуда приходит обращение, кто отвечает, что происходит дальше.”

---

## Step 4 — Системы, ограничения и human control

### Goal
Понять boundaries и safe implementation constraints.

### Fields
- `current_tools`
- `human_approval_required`
- `sensitive_data_or_constraints`
- `what_must_not_happen`

### UX note
Это очень важный шаг для trust и правильной qualification.

---

## Step 5 — Запуск и контакт

### Goal
Понять preferred next step и получить контакт.

### Fields
- `preferred_start_mode`
- `timeline_priority`
- `budget_range`
- `contact_name`
- `contact_email`
- `contact_phone_or_whatsapp`
- `preferred_contact_method`

### UX note
`budget_range` should stay optional and non-aggressive.

---

## 8. Field behavior requirements

### General rules
- required fields clearly marked
- helper text below complex fields
- inline validation
- preserve entered data when moving between steps
- allow back/next navigation
- no data loss on refresh if draft-save exists later

### Textarea fields
For complex textareas:
- show guiding placeholder
- ideally show “good answer” framing, not just empty field

### Multi-select fields
Use clean chip or checkbox UI.
Do not overcomplicate.

### Select + other
If user picks `другое`, show follow-up free-text field.

---

## 9. Required field list

### Required fields
- `company_name`
- `business_type`
- `main_goal`
- `main_problem`
- `desired_result`
- `priority_use_case`
- `current_process_description`
- `current_channels`
- `main_bottleneck`
- `human_approval_required`
- `what_must_not_happen`
- `preferred_start_mode`
- `contact_name`
- `contact_email`

### Optional fields
- `website_url`
- `target_market`
- `team_size`
- `why_now`
- `current_owner_of_process`
- `current_tools`
- `sensitive_data_or_constraints`
- `timeline_priority`
- `budget_range`
- `contact_phone_or_whatsapp`
- `preferred_contact_method`

---

## 10. Helper text guidelines

### For every complex field, include one of:
- short explanation
- example answer
- optional “AI assistant can help” note

### Good helper style
Short, practical, not verbose.

### Example
For `main_goal`:
“Опишите один главный процесс, который вы хотите автоматизировать первым.”

### Example
For `main_problem`:
“Опишите, где сейчас теряются время, заявки или управляемость.”

### Example
For `what_must_not_happen`:
“Например: агент не должен сам обещать цену, сроки или отправлять сообщения без проверки.”

---

## 11. AI assistant integration requirements

### Main assistant role
AI-ассистент помогает:
- понять, что означает поле
- сформулировать короткий ответ
- выбрать главный use case
- сократить слишком расплывчатый ответ
- задать 1–2 уточняющих вопроса

### Assistant must not
- заполнять форму без участия пользователя
- обещать решение
- обещать цену
- обещать сроки
- предлагать окончательную архитектуру
- превращать brief в длинную консультацию

### UI relationship
Assistant should be optional but visible.

### Recommended implementations
#### Desktop
- sticky help panel
or
- chat helper sidebar

#### Mobile
- expandable helper
or
- floating assistant trigger

---

## 12. AI assistant trigger points

Assistant help should be especially available on these fields:
- `main_goal`
- `main_problem`
- `desired_result`
- `current_process_description`
- `main_bottleneck`
- `human_approval_required`
- `what_must_not_happen`

### Suggested microcopy
“Нужна помощь с формулировкой? AI-ассистент поможет оформить ответ.”

---

## 13. Validation requirements

### Basic validation
- required fields cannot be empty
- email must be valid
- URL fields should validate softly
- textareas should have reasonable min/max boundaries if needed
- multi-select must require at least one choice where applicable

### Soft validation
If answer is too short in critical fields, show suggestion like:
“Лучше добавить 1–2 предложения, чтобы мы точнее поняли задачу.”

### Do not over-block
Validation should improve quality, not frustrate the user.

---

## 14. Save / submit behavior

### Submit action
On submit, the system should send:
- raw field values
- route/source metadata
- timestamp
- optional ai_assist_used flag
- optional derived summary
- optional qualification fields if backend derives them

### Recommended source tag
`brief_form`

### Recommended route metadata
`/brief`

### Submission success message
The user should see a calm, practical confirmation, for example:
“Спасибо. Мы получили ваш brief. Следующий шаг — review и контакт по указанному каналу, если задача подходит по формату.”

### Important note
Do not imply:
- accepted project
- guaranteed audit
- guaranteed callback timing unless confirmed operationally

---

## 15. Backend payload recommendation

### Payload should contain
- all visible form fields
- `source`
- `route`
- `created_at`
- `ai_assist_used`
- `locale`
- optional `assistant_summary`
- optional `derived_fit_level`
- optional `recommended_next_step`

### Optional future fields
- `session_id`
- `draft_id`
- `assistant_interaction_count`

---

## 16. CRM / sheet / ops handoff requirements

### Minimum handoff object
System should produce:
- business type
- main goal
- main problem
- desired result
- current process
- main bottleneck
- control constraints
- contact block
- suggested next step

### This handoff should be readable in under 30 seconds.

---

## 17. CTA logic around the form

### Above the form
- short explanation
- calm promise
- “AI-ассистент поможет заполнить”

### Below the form
- what happens next
- no overpromising
- optional alternative CTA:
  - WhatsApp
  - discuss directly

### Recommended secondary CTA
If the form feels too long for some users:
- “Предпочитаете обсудить задачу напрямую? Напишите в WhatsApp.”

---

## 18. Mobile-first requirements

### Mobile must support
- short step headers
- readable helper text
- comfortable textareas
- easy next/back navigation
- assistant that does not block the form
- submit button always easy to reach

### Avoid on mobile
- two-column complexity
- long dense explanations
- persistent panels that cover inputs

---

## 19. Accessibility / clarity requirements

### Must have
- labels always visible
- not placeholder-only fields
- clear required indicators
- logical focus order
- visible error states
- visible progress state
- button labels that are explicit

### Nice to have later
- autosave draft
- collapse/expand examples
- smart summaries before final submit

---

## 20. Visual / design direction

### The page should feel
- structured
- expert
- practical
- less “salesy” than homepage
- still on-brand with AzurSysTech
- high trust, medium depth

### Use UI cues like
- stepper
- grouped fields
- section cards
- clean helper notes
- gentle progress indicators

### Avoid
- giant wall of form fields
- too much decorative illustration
- startup-style “magic AI” visuals
- anything that makes the form feel like a gimmick

---

## 21. Recommended layout

### Desktop
Option A:
- main form center-left
- assistant/helper right column

Option B:
- full-width step form
- assistant as sticky expandable helper

### Mobile
- single-column
- assistant collapsed by default
- helper opened on demand

---

## 22. Suggested page-level blocks

### Hero / intro
Title:
**Краткий бриф на AI-автоматизацию**

### Supporting copy
Опишите задачу и текущий процесс. Это поможет понять, какой сценарий имеет смысл автоматизировать первым и какой следующий шаг будет разумным.

### Progress stepper
Required.

### Form container
Required.

### AI helper container
Required.

### Confirmation / next-step note
Required.

---

## 23. Security / privacy notes

### Page should remind user not to paste excessive sensitive data unnecessarily.

### Suggested microcopy
“Не указывайте лишние чувствительные данные, если они не нужны для первичного понимания задачи.”

### Important
This is especially relevant for:
- customer data
- financial data
- internal documents
- medical/legal sensitive data

---

## 24. Success criteria

Form spec is valid if:
- it is implementable by coder without ambiguity
- it matches the schema document
- it supports AI assistant help
- it is not too heavy for users
- it improves lead quality
- it preserves trust and clarity
- submit behavior supports backend/CRM handoff