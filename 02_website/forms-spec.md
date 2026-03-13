# forms-spec.md
_version: v0.1
_owner: Marketing Lead
_status: draft
_brand: AzurSysTech
_language: ru

---

## 1. Цель документа

Зафиксировать точную спецификацию форм для сайта **AzurSysTech**, чтобы Tech Lead мог реализовать:

- основную форму заявки
- ветвление для **малого бизнеса / TPE**
- ветвление для **частных клиентов**
- маппинг данных в CRM
- совместимость с будущей локализацией
- связку с AI chat widget

---

## 2. Общая стратегия форм

### Основной принцип
Форма должна быть:

- короткой
- понятной
- мобильной
- пригодной для малого бизнеса и частных клиентов
- достаточно подробной для первой квалификации
- не перегруженной техническими полями

### Цель формы
Не собрать полное ТЗ, а:

- понять, кто клиент
- понять тип задачи
- понять масштаб
- понять географию
- получить контакт
- передать лид в CRM

---

## 3. Список форм в MVP

### Form A — Main homepage lead form
Главная универсальная форма для:
- TPE
- частных клиентов

### Form B — Short contact form
Короткая форма для повторных CTA-блоков, если потребуется.

### Form C — AI chat handoff form
Мини-форма после диалога с AI-агентом для передачи контактов и summary.

### MVP recommendation
На первом этапе достаточно:
- **Form A**
- **Form C**

Form B можно добавить позже при необходимости.

---

## 4. Main homepage lead form structure

### Form name
`main_lead_form`

### Public title
**Оставить заявку**

### Public intro
Коротко опишите задачу, и мы свяжемся с вами для уточнения деталей.

---

## 5. Main form fields

### Field 1
**Имя**
- key: `name`
- type: text
- required: yes
- placeholder: `Ваше имя`

### Field 2
**Телефон**
- key: `phone`
- type: tel
- required: yes
- placeholder: `Телефон для связи`

### Field 3
**Email**
- key: `email`
- type: email
- required: no
- placeholder: `Email`

### Field 4
**Город**
- key: `city`
- type: text or select
- required: yes
- placeholder: `Например: Nice`

### Field 5
**Вы обращаетесь как**
- key: `segment`
- type: radio or select
- required: yes
- options:
  - `particulier` — Частный клиент
  - `tpe` — Бизнес / TPE

### Field 6
**Что нужно сделать**
- key: `service_type`
- type: select
- required: yes
- options:
  - `depannage_pc` — Ремонт / диагностика ПК
  - `installation_pc` — Настройка нового ПК
  - `wifi` — Настройка Wi-Fi
  - `imprimante` — Настройка принтера
  - `reseau_local` — Локальная сеть
  - `partage_fichiers` — Общие папки / доступ к файлам
  - `poste_travail` — Рабочее место / несколько устройств
  - `petite_infra_tpe` — Настройка IT-среды для малого бизнеса
  - `autre` — Другое

### Field 7
**Краткое описание задачи**
- key: `problem_description`
- type: textarea
- required: yes
- placeholder: `Коротко опишите, что нужно сделать или какая проблема возникла`

### Field 8
**Сколько устройств**
- key: `device_count`
- type: select
- required: no
- options:
  - `1`
  - `2-3`
  - `4-10`
  - `10+`

### Field 9
**Нужен выезд**
- key: `onsite_required`
- type: radio
- required: no
- options:
  - `yes` — Да
  - `no` — Нет
  - `not_sure` — Не знаю

### Field 10
**Срочность**
- key: `urgency`
- type: select
- required: no
- options:
  - `urgent` — Срочно
  - `standard` — Обычный запрос
  - `planning` — Можно запланировать

---

## 6. Conditional branching logic

### If `segment = tpe`
Show additional business block.

### If `segment = particulier`
Show optional home-user clarification block.

---

## 7. TPE additional fields

### Business block title
**Информация для бизнеса**

### Field B1
**Название компании**
- key: `company_name`
- type: text
- required: no

### Field B2
**Тип объекта**
- key: `business_type`
- type: select
- required: no
- options:
  - `office` — Офис
  - `shop` — Магазин
  - `cabinet` — Кабинет
  - `coworking` — Рабочее пространство
  - `other` — Другое

### Field B3
**Сколько рабочих мест**
- key: `workstation_count`
- type: select
- required: no
- options:
  - `1`
  - `2-3`
  - `4-10`
  - `10+`

### Field B4
**Что из этого нужно**
- key: `business_needs`
- type: checkbox group
- required: no
- options:
  - `wifi` — Wi-Fi
  - `printers` — Принтеры
  - `local_network` — Локальная сеть
  - `shared_folders` — Общие папки
  - `new_workstations` — Новые рабочие места
  - `onsite_support` — Выездная помощь

### Field B5
**Адрес объекта**
- key: `business_address`
- type: text
- required: no

---

## 8. Particulier additional fields

### Home-user block title
**Информация по задаче**

### Field P1
**Что нужно настроить**
- key: `home_device_type`
- type: checkbox group
- required: no
- options:
  - `desktop_pc` — Стационарный компьютер
  - `laptop` — Ноутбук
  - `wifi` — Wi-Fi
  - `printer` — Принтер
  - `multiple_devices` — Несколько устройств

### Field P2
**Это новый компьютер или существующий**
- key: `device_state`
- type: radio
- required: no
- options:
  - `new` — Новый
  - `existing` — Уже используемый
  - `not_applicable` — Не относится

### Field P3
**Что именно нужно**
- key: `home_need_type`
- type: checkbox group
- required: no
- options:
  - `repair` — Диагностика / ремонт
  - `setup` — Настройка
  - `migration` — Перенос данных
  - `speedup` — Ускорение работы
  - `installation` — Установка системы / программ

---

## 9. Form layout recommendations

### Desktop layout
- 2 columns for short fields
- 1 column for textarea and conditional blocks

### Mobile layout
- single column
- large tap targets
- short labels
- sticky submit button optional

### UX rule
Conditional blocks should appear smoothly and clearly after segment selection.

---

## 10. Validation rules

### Required validation
- `name` must not be empty
- `phone` must not be empty
- `city` must not be empty
- `segment` must be selected
- `service_type` must be selected
- `problem_description` must not be empty

### Email validation
If email provided:
- valid email format required

### Phone validation
- allow international / French formats
- allow spaces
- allow `+`
- do not over-restrict format

### Textarea validation
- minimum length recommended: 15 characters
- maximum length: reasonable UX limit, e.g. 1500 characters

### Anti-spam
- honeypot field
- server-side validation
- optional rate limiting

---

## 11. Form success state

### Success title
**Заявка отправлена**

### Success message
Спасибо. Мы получили вашу заявку и свяжемся с вами для уточнения деталей.

### Optional secondary line
Если задача срочная, можно дополнительно связаться через WhatsApp: `+33 7 49 70 54 65`.

### Important note
Phone and WhatsApp are available for launch and should be supported as visible contact options.

---

## 12. Error state copy

### Generic error message
Не удалось отправить заявку. Попробуйте ещё раз или свяжитесь с нами позже.

### Field-level error style
Short and clear.

Examples:
- Укажите имя
- Укажите телефон
- Выберите тип обращения
- Коротко опишите задачу

---

## 13. CRM mapping

### Recommended CRM
**HubSpot Free**

### Main mapping rules
Each form submission should create or update:

- Contact
- Lead / note / conversation context
- Source
- Segment
- Service type
- Urgency
- Description

### Suggested field mapping
- `name` → contact name
- `phone` → contact phone
- `email` → contact email
- `city` → custom property
- `segment` → custom property
- `service_type` → custom property
- `problem_description` → lead note / description
- `device_count` → custom property
- `onsite_required` → custom property
- `urgency` → custom property
- business/home conditional fields → custom properties

### Required source tag
For homepage form:
- `source = website_form`

---

## 14. Fallback Google Sheets mapping

If CRM is not live yet, send form submissions to Google Sheets.

### Suggested columns
- timestamp
- name
- phone
- email
- city
- segment
- service_type
- problem_description
- device_count
- onsite_required
- urgency
- source
- company_name
- business_type
- workstation_count
- business_needs
- home_device_type
- device_state
- home_need_type
- status
- notes

### Default values
- `source = website_form`
- `status = New`

---

## 15. AI chat handoff form

### Form name
`chat_handoff_form`

### Purpose
If the user starts in chat, at the end the system should collect contact details and save the AI-generated summary.

### Required fields
- Имя
- Телефон
- Email (optional)

### Hidden / system fields
- `chat_summary`
- `chat_segment`
- `chat_service_type`
- `chat_urgency`
- `chat_location`
- `source = website_chat`

### Public CTA
**Отправить и продолжить**

### Confirmation copy
Спасибо. Мы получили ваш запрос и его краткое описание.

---

## 16. AI chat → form logic

### Recommended handoff
After 4–7 short qualifying questions, the widget should say:

**Готово. Я собрал основную информацию. Оставьте контактные данные, и мы продолжим уже с вашей задачей.**

### Required chat output
- summary of need
- segment guess
- service category
- urgency guess
- location
- next suggested human step

---

## 17. Multi-language readiness

### Current language
Russian only for MVP launch.

### Future languages
- French
- English

### Implementation rule
All labels and messages must be externalized and localization-ready.

### Tech requirement
Do not hardcode text deeply inside components.
Use translatable content structure.

---

## 18. Accessibility and UX notes

### Basic accessibility
- labels linked to fields
- visible focus states
- sufficient contrast
- inline error messaging
- mobile-friendly field sizes

### UX notes
- keep form visually short
- use progressive disclosure for extra fields
- avoid showing TPE-specific fields to home users immediately
- make submit button visible without confusion

---

## 19. Privacy / legal note

### Required principle
Form should collect only data needed for:
- qualification
- response
- scheduling

### UI note
Legal/privacy note should be visible near submit button.

Suggested placeholder:
**Отправляя заявку, вы соглашаетесь с обработкой данных для связи по вашему запросу.**

Detailed final wording to be defined in legal pages.

---

## 20. Suggested implementation order

### Step 1
Build main form structure

### Step 2
Add conditional branching

### Step 3
Connect CRM or Google Sheets fallback

### Step 4
Build AI chat handoff

### Step 5
Add validation and success/error states

---

## 21. Acceptance criteria

The forms implementation is valid if:
- user can submit main form in under 2 minutes
- segment branching works
- TPE fields appear only when relevant
- home-user fields appear only when relevant
- all required fields validate correctly
- submission is saved to CRM or fallback sheet
- AI chat can hand off to contact capture
- system is ready for future localization

---

## 22. Next file to create

After this file, next artifact should be:

`facebook-page-copy.md`

It must define:
- page bio
- pinned post
- about section
- service summary
- first 10 Facebook posts
