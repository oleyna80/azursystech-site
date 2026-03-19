# lead-taxonomy.md
_version: v0.1
_owner: Marketing Lead
_status: approved taxonomy baseline
_brand: AzurSysTech
_primary_language: ru

---

## 1. Цель документа

Зафиксировать единую таксономию лидов для **AzurSysTech**, чтобы:

- форма, AI-чат и CRM использовали одинаковые категории
- заявки можно было быстро сортировать
- было понятно, какие лиды относятся к бизнесу, а какие к частным клиентам
- follow-up и ответы можно было строить по типу лида
- позже можно было анализировать, какие услуги реально приносят заявки

---

## 2. Основной принцип

### Taxonomy principle
Каждый лид должен быть описан не “как придётся”, а через несколько понятных признаков:

1. **Сегмент**
2. **Тип услуги**
3. **Масштаб**
4. **Срочность**
5. **Источник**
6. **Статус**
7. **Потенциал / приоритет**

### Goal
Любую входящую заявку должно быть легко отнести к понятной категории за 10–20 секунд.

---

## 3. Core taxonomy layers

### Layer A — Segment
Кто клиент:
- частный клиент
- бизнес / TPE

### Layer B — Service type
Что нужно:
- ремонт
- настройка
- Wi-Fi
- принтер
- рабочее место
- локальная сеть
- и т.д.

### Layer C — Scale
Насколько большая задача:
- 1 устройство
- 2–3 устройства
- 4–10 устройств
- маленькая среда / mini-environment

### Layer D — Urgency
Насколько срочно:
- urgent
- standard
- planning

### Layer E — Source
Откуда пришёл лид:
- сайт
- чат
- Facebook
- группа
- и т.д.

### Layer F — Status
На каком этапе лид:
- new
- contacted
- qualified
- etc.

---

## 4. Segment taxonomy

### Segment codes
- `lead_particulier`
- `lead_tpe`

### Public meaning
#### `lead_particulier`
Частный клиент, домашний пользователь, home-office пользователь.

#### `lead_tpe`
Малый бизнес, кабинет, магазин, небольшой офис, petite structure.

### Rule
Сегмент должен определяться:
- формой
- AI-чатом
- вручную, если заявка пришла через Facebook/Messenger

---

## 5. Service taxonomy

### Core service tags

#### Home / general service tags
- `depannage_pc`
- `installation_pc`
- `wifi`
- `imprimante`
- `migration_donnees`
- `optimisation_pc`
- `upgrade_pc`
- `logiciels_installation`

#### Business / infrastructure service tags
- `poste_travail`
- `petite_infra_tpe`
- `reseau_local`
- `partage_fichiers`
- `wifi_tpe`
- `imprimante_reseau`
- `onsite_support`

#### Catch-all
- `autre`

### Rule
У лида должен быть:
- минимум 1 service tag
- максимум 2–3 основных service tags в MVP, чтобы не усложнять CRM

---

## 6. Suggested service grouping

### Group A — dépannage / repair-like
- `depannage_pc`
- `optimisation_pc`
- `upgrade_pc`

### Group B — setup / installation
- `installation_pc`
- `logiciels_installation`
- `migration_donnees`

### Group C — connectivity / network
- `wifi`
- `wifi_tpe`
- `reseau_local`
- `partage_fichiers`

### Group D — devices / peripherals
- `imprimante`
- `imprimante_reseau`

### Group E — business environment
- `poste_travail`
- `petite_infra_tpe`
- `onsite_support`

### Why grouping matters
Позже это поможет:
- фильтровать лиды
- анализировать спрос
- строить пакеты услуг
- делать релевантные ответы

---

## 7. Scale taxonomy

### Scale tags
- `scale_1_device`
- `scale_2_3_devices`
- `scale_4_10_devices`
- `scale_10_plus`
- `scale_small_environment`
- `scale_unknown`

### Interpretation
#### `scale_1_device`
Одна точка задачи: один ПК, один принтер, один ноутбук.

#### `scale_2_3_devices`
Небольшой домашний или микро-бизнес кейс.

#### `scale_4_10_devices`
Малый бизнес, несколько рабочих мест.

#### `scale_10_plus`
Редко для MVP, но предусмотреть полезно.

#### `scale_small_environment`
Среда из нескольких компонентов:
- Wi-Fi
- принтер
- рабочие станции
- shared folders  
Даже если точное число устройств пока неизвестно.

### Rule
Если количество устройств неясно, но видно, что задача больше одной точки, ставить:
- `scale_small_environment`

---

## 8. Urgency taxonomy

### Urgency tags
- `urgent`
- `standard`
- `planning`
- `unknown_urgency`

### Definitions
#### `urgent`
Клиенту нужно быстрое вмешательство, есть блокирующая проблема.

#### `standard`
Обычный запрос без жёсткой срочности.

#### `planning`
Задача не срочная; клиент планирует, сравнивает, готовит запуск.

#### `unknown_urgency`
Срочность не указана.

### Usage
Urgency влияет на:
- приоритет ответа
- follow-up logic
- expected conversion speed

---

## 9. Source taxonomy

### Source tags
- `website_form`
- `website_chat`
- `facebook_page`
- `facebook_group`
- `facebook_messenger`
- `direct`
- `referral`
- `google_business_profile`
- `organic_search`
- `unknown_source`

### Rule
Каждый лид должен иметь source tag.
Даже если источник неясен, использовать:
- `unknown_source`

### Practical note
При ручном добавлении лида в CRM источник должен выставляться вручную.

---

## 10. Contact readiness taxonomy

### Contact readiness tags
- `ready_to_contact`
- `needs_more_info`
- `waiting_contact_details`
- `not_contactable_yet`

### Meaning
#### `ready_to_contact`
Есть контакты и достаточно данных для первого нормального ответа.

#### `needs_more_info`
Контакты есть, но задача описана слишком слабо.

#### `waiting_contact_details`
Проблема понятна, но контакты не собраны полностью.

#### `not_contactable_yet`
Лид пока не готов к работе (например, только комментарий без DM).

### Why useful
Помогает отделить:
- реальные лиды
- сырые обращения
- полу-лиды из комментариев

---

## 11. Lead quality taxonomy

### Quality tags
- `high_fit`
- `medium_fit`
- `low_fit`
- `unknown_fit`

### Definitions
#### `high_fit`
Лид хорошо совпадает с офферами AzurSysTech:
- география подходит
- задача понятная
- сегмент релевантный
- выездной формат возможен

#### `medium_fit`
Есть потенциал, но часть данных ещё неясна.

#### `low_fit`
Плохо совпадает по географии, задаче или формату.

#### `unknown_fit`
Недостаточно информации.

### Rule
Quality tag can be set manually after first review.

---

## 12. Priority taxonomy

### Priority tags
- `priority_high`
- `priority_medium`
- `priority_low`

### Suggested logic
#### High
- TPE lead
- понятная задача
- подходит по географии
- срочный или близкий к сделке

#### Medium
- обычный home-user lead
- понятная задача
- стандартный запрос

#### Low
- очень неполная заявка
- задача с низкой вероятностью конверсии
- out-of-scope / weak fit

---

## 13. Status taxonomy (overview)

### Suggested CRM statuses
- `new`
- `need_info`
- `qualified`
- `contacted`
- `waiting_reply`
- `visit_planned`
- `quote_sent`
- `won`
- `lost`
- `follow_up_later`

### Note
Detailed operational use is defined in `crm-pipeline.md`.

---

## 14. Recommended minimum lead schema

Each lead in CRM should ideally have:

- `segment`
- `service_type_primary`
- `service_type_secondary` (optional)
- `scale`
- `urgency`
- `source`
- `status`
- `quality`
- `priority`
- `city`
- `onsite_required`
- `notes`

This is enough for MVP.

---

## 15. Example lead classification

### Example 1 — Home user / new PC
Client bought a new laptop, needs setup and printer connection in Nice.

#### Tags
- `lead_particulier`
- `installation_pc`
- `imprimante`
- `scale_1_device`
- `standard`
- `website_form`
- `ready_to_contact`
- `high_fit`
- `priority_medium`

---

### Example 2 — Small office / 3 workstations
Small office needs Wi-Fi, printer and 3 workstations configured.

#### Tags
- `lead_tpe`
- `poste_travail`
- `wifi_tpe`
- `imprimante_reseau`
- `scale_2_3_devices`
- `standard`
- `facebook_group`
- `ready_to_contact`
- `high_fit`
- `priority_high`

---

### Example 3 — Weak inquiry
Comment says only “how much?” with no details.

#### Tags
- `unknown_source` or `facebook_page`
- `autre`
- `scale_unknown`
- `unknown_urgency`
- `not_contactable_yet`
- `unknown_fit`
- `priority_low`

---

## 16. Form → taxonomy mapping

### From form:
- `segment` → segment tag
- `service_type` → service tag
- `device_count` / workstation count → scale tag
- `urgency` → urgency tag
- form source → `website_form`

### From chat:
- inferred segment → segment tag
- inferred service type → service tag
- inferred scale → scale tag
- source → `website_chat`

### From Facebook:
Usually manual or semi-manual classification.

---

## 17. AI chat → taxonomy mapping

### The AI assistant should help infer:
- segment
- service category
- urgency
- approximate scale
- readiness for handoff

### AI should NOT invent certainty
If data is insufficient, it should use:
- `unknown_fit`
- `scale_unknown`
- `unknown_urgency`

### Rule
When unsure, the taxonomy should stay conservative.

---

## 18. CRM property recommendations

### Recommended CRM custom properties
- `lead_segment`
- `lead_service_primary`
- `lead_service_secondary`
- `lead_scale`
- `lead_urgency`
- `lead_source`
- `lead_quality`
- `lead_priority`
- `lead_contact_readiness`

### Why
This creates a clean operational and analytical layer.

---

## 19. Reporting usefulness

This taxonomy will later help answer:
- business or home users convert better?
- which services bring the most inquiries?
- which source brings the best leads?
- are Wi-Fi / printers / workstations the strongest entry points?
- which leads deserve faster follow-up?

---

## 20. Taxonomy rules to keep it usable

### Rule 1
Do not create too many categories too early.

### Rule 2
Prefer stable tags over ad hoc labels.

### Rule 3
Every lead must have at least:
- segment
- primary service
- source
- status

### Rule 4
If uncertain, use `unknown_*` rather than guessing.

### Rule 5
One lead can have multiple service dimensions, but one primary service should always be chosen.

---

## 21. Acceptance criteria

Lead taxonomy is valid if:
- every incoming lead can be categorized quickly
- business and home-user leads are clearly separated
- service categories match real AzurSysTech offers
- source and urgency are trackable
- CRM can use the taxonomy without becoming too complex

---

## Current status

Downstream sequencing is now managed through `docs/specs`, `docs/plans`, `docs/tasklist`, and `memory_bank/*`.
