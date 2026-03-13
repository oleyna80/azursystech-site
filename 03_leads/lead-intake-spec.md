# lead-intake-spec.md
_version: v0.1
_owner: Marketing Lead
_status: draft
_brand: AzurSysTech

---

## 1. Objective

Построить простую и понятную систему приёма заявок для сайта AzurSysTech, которая:
- собирает лиды в одном месте
- подходит для малого бизнеса и частных клиентов
- работает через форму и встроенный чат
- легко интегрируется с CRM
- не перегружает пользователя длинной анкетой

### Launch priority
Сначала быстро собирать лиды и не терять их.

---

## 2. Recommended stack

### Recommended MVP stack
- Website form
- Embedded chat widget
- HubSpot Free CRM

### Why HubSpot first
- free CRM
- forms
- live chat / widget
- simple website integration
- fast launch

### Future option
If later invoicing + broader operations become critical:
- evaluate Odoo as phase 2

---

## 3. Lead sources

### Main inbound channels
- website contact form
- AI chat widget
- Facebook Page
- group posts → website
- Messenger → website / chat / form
- direct referral traffic

### Tracking requirement
Every lead should have a source tag when possible.

Examples:
- website_form
- website_chat
- facebook_page
- facebook_group
- facebook_messenger
- direct
- referral
- google_business_profile
- organic_search
- unknown_source

---

## 4. Core qualification logic

Every lead must answer, explicitly or implicitly:

1. Кто клиент?
   - частное лицо
   - бизнес / TPE

2. Что нужно?
   - dépannage
   - installation
   - réseau / Wi-Fi
   - imprimante
   - nouveau PC
   - workstation setup
   - shared folders
   - other

3. Где находится клиент?
   - city / area

4. Нужен ли выезд?
   - yes / no

5. Насколько срочно?
   - urgent / normal / planning

---

## 5. Contact form strategy

### Form goals
The form must:
- be short enough to submit
- collect enough info for first qualification
- work for both segments
- support later CRM sync

### Form design principles
- no more than necessary
- use simple public wording
- mobile-friendly
- visible CTA
- no enterprise jargon

---

## 6. Main website form fields

### Required fields
- Имя
- Телефон
- Email
- Город
- Кто вы?
  - Частный клиент
  - Бизнес / TPE
- Что нужно сделать?
- Краткое описание задачи

### Recommended optional fields
- Сколько устройств?
- Нужен ли выезд?
- Насколько срочно?
- Можно ли добавить фото/скриншот?

### Suggested public labels
- Ваше имя
- Телефон
- Email
- Город
- Вы обращаетесь как:
- Что нужно сделать?
- Опишите задачу
- Сколько устройств нужно настроить?
- Нужен выезд?
- Срочность

---

## 7. Business-specific branching

If user selects:
**Бизнес / TPE**

Show additional fields:
- Название компании (optional)
- Тип объекта:
  - офис
  - магазин
  - кабинет
  - другое
- Сколько рабочих мест?
- Нужны ли:
  - Wi-Fi
  - принтеры
  - локальная сеть
  - общие папки
  - установка новых ПК

### Reason
This helps separate:
- one-device support
- small office setup
- broader TPE lead

---

## 8. Home-user branching

If user selects:
**Частный клиент**

Optional extra fields:
- Это:
  - ПК
  - ноутбук
  - Wi-Fi
  - принтер
  - несколько устройств
- Нужна настройка или ремонт?
- Новый компьютер или существующий?

### Reason
This helps identify:
- quick dépannage
- installation job
- Wi-Fi/print job
- upsell potential

---

## 9. Form submission outcome

After submit:
- show confirmation message
- reassure user
- explain next step

### Suggested confirmation copy
Спасибо, заявка отправлена. Мы посмотрим описание задачи и свяжемся с вами для уточнения деталей.

### Optional business-specific version
Спасибо, заявка получена. Мы оценим задачу и подскажем, с чего лучше начать.

---

## 10. Embedded AI chat widget logic

### Widget purpose
Помочь клиенту, который:
- не хочет сразу заполнять форму
- не знает, как описать задачу
- хочет быстро понять, подходит ли услуга
- хочет пройти короткий guided intake

### Widget role
The chat widget is not a full autonomous sales bot.
It is a structured intake assistant.

---

## 11. AI chat core flow

### Step 1
Определить сегмент:
- Вы обращаетесь как частный клиент или бизнес?

### Step 2
Определить тип задачи:
- Что именно нужно сделать?

### Step 3
Уточнить масштаб:
- Сколько устройств / рабочих мест?

### Step 4
Определить локацию:
- Где вы находитесь?

### Step 5
Определить формат:
- Нужен выезд?

### Step 6
Уточнить срочность:
- Это срочно или можно планировать?

### Step 7
Собрать контакты:
- Имя
- телефон
- email

### Step 8
Сделать финальный summary:
- сегмент
- тип работ
- масштаб
- срочность
- следующий шаг

---

## 12. AI chat rules

### The assistant may
- задавать короткие вопросы
- помогать структурировать задачу
- объяснять, что нужна заявка
- собирать данные для CRM
- направлять на форму или передавать summary

### The assistant must NOT
- обещать точную цену
- обещать срок выезда
- давать жёсткие технические гарантии
- спорить с клиентом
- вести длинную техническую консультацию вместо intake

---

## 13. Lead taxonomy

Each lead should receive at least:
- segment tag
- service type tag
- urgency tag
- source tag

### Segment tags
- lead_particulier
- lead_tpe

### Service tags
- depannage_pc
- installation_pc
- wifi
- imprimante
- reseau_local
- partage_fichiers
- poste_travail
- petite_infra_tpe
- autre

### Urgency tags
- urgent
- standard
- planning

### Intent tags
- diagnostic
- installation
- setup
- support
- project

---

## 14. CRM recommendation

### Recommended MVP CRM
**HubSpot Free**

### Why
- free CRM
- contact capture
- forms
- live chat
- easy integration to site
- enough for first leads

### CRM role in MVP
HubSpot stores:
- contact
- message
- source
- lead status
- notes
- follow-up state

### Important note
At launch, the CRM is for lead management, not for full company operations.

---

## 15. Invoicing note

### Current recommendation
Do not let invoicing complexity block the launch.

### Recommended approach
Phase 1:
- use CRM for leads
- keep billing separate if needed

Phase 2:
- evaluate:
  - Odoo
  - another invoicing layer
  - migration path if volume grows

### Reason
Lead generation must start before full business back-office is optimized.

---

## 16. Google Sheets fallback

If CRM integration is delayed, use:
- Google Sheets as temporary lead table

### Minimum columns
- date
- name
- phone
- email
- city
- segment
- service type
- source
- urgency
- status
- notes

### Rule
Google Sheets is fallback only, not preferred final MVP if HubSpot launches quickly.

---

## 17. Lead pipeline statuses

### Recommended statuses
- New
- Need info
- Qualified
- Contacted
- Waiting reply
- Visit planned
- Quote sent
- Won
- Lost
- Follow-up later

### Rule
Every lead must always have a status.

---

## 18. Notification logic

When a lead arrives:
- create CRM contact
- create or update lead record
- notify founder
- include summary
- include source
- include urgency
- include recommended next step

### Recommended founder notification content
- имя
- сегмент
- краткое описание
- source
- urgency
- suggested action

---

## 19. Recommended next-step suggestions

### If home dépannage
Suggested next step:
- call or message confirmation

### If Wi-Fi / printer
Suggested next step:
- clarify equipment and location

### If TPE small setup
Suggested next step:
- request a short structured brief
- possibly arrange call/visit

### If unclear lead
Suggested next step:
- ask 2–3 missing questions

---

## 20. UX rules for intake

### Must-have UX rules
- short form first
- chat optional
- mobile friendly
- not too many required fields
- no technical complexity in wording
- reassure user after submit
- visible trust around contact

### Contact block requirement
Homepage must support:
- phone placeholder
- WhatsApp placeholder
- form
- AI chat widget

---

## 21. Acceptance criteria

Lead intake system is valid if:
- user can submit in under 2 minutes
- business and home leads are distinguished
- every lead gets basic tags
- leads are stored in CRM or fallback sheet
- chat supports qualification
- founder receives usable summaries
- no false pricing or deadline promises are made by AI

---

## 22. Recommended implementation order

### Step 1
Simple website form

### Step 2
CRM integration

### Step 3
Embedded chat widget

### Step 4
Lead tagging / routing

### Step 5
Template replies

---

## 23. Next file to create

After this file, next artifact should be:

`forms-spec.md`

It must define:
- exact field list
- form variants
- validation rules
- business branching logic
- CRM mapping
- success messages
