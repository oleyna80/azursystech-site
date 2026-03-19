# crm-pipeline.md
_version: v0.1
_owner: Marketing Lead
_status: working CRM baseline
_brand: AzurSysTech
_primary_language: ru

---

## 1. Цель документа

Зафиксировать CRM pipeline для **AzurSysTech**, чтобы:

- все лиды проходили через понятные стадии
- заявки не терялись
- было видно, кто уже обработан, а кто нет
- follow-up происходил системно
- HubSpot CRM использовался как единый launch CRM без параллельного fallback-sheet контура

---

## 2. Основной принцип pipeline

### Core rule
Каждый лид должен всегда находиться в одном понятном статусе.

### Why
Без этого очень быстро появляются:
- потерянные заявки
- забытые переписки
- лиды “между этапами”
- хаос в follow-up

### Pipeline goal
Не усложнять продажи, а дать минимальную рабочую систему:
- принять лид
- понять его качество
- получить недостающие данные
- перевести к следующему шагу
- зафиксировать результат

---

## 3. Recommended MVP pipeline

### Main stages
1. `new`
2. `need_info`
3. `qualified`
4. `contacted`
5. `waiting_reply`
6. `visit_planned`
7. `quote_sent`
8. `won`
9. `lost`
10. `follow_up_later`

---

## 4. Status definitions

# 4.1 `new`
### Meaning
Новый лид только что поступил и ещё не обработан.

### Entry sources
- website form
- chat handoff
- Facebook DM
- manual entry
- referral

### Exit condition
Лид просмотрен и по нему принято первое решение:
- хватает данных → `qualified`
- не хватает данных → `need_info`
- уже был отправлен ответ → `contacted`

### Rule
Leads should not stay in `new` longer than operationally reasonable.

---

# 4.2 `need_info`
### Meaning
Заявка есть, но данных недостаточно для нормального следующего шага.

### Typical reasons
- нет количества устройств
- неясно: бизнес или частное лицо
- непонятна задача
- нет города / зоны
- нет контактов
- нет понимания, нужен ли выезд

### Exit condition
- данные получены → `qualified`
- клиент не отвечает → `waiting_reply` or `follow_up_later`
- лид оказался нерелевантным → `lost`

---

# 4.3 `qualified`
### Meaning
Лид подходит по профилю, географии и формату, и по нему уже есть достаточно данных, чтобы двигаться дальше.

### Criteria
Обычно известно:
- сегмент
- тип задачи
- география
- примерный масштаб
- есть способ связаться

### Exit condition
- отправлен нормальный ответ / контакт → `contacted`
- согласован следующий шаг → `visit_planned`
- нужно делать более предметную оценку → `quote_sent`

---

# 4.4 `contacted`
### Meaning
На лид уже отправлен первый содержательный ответ.

### Rule
This status means:
- ты уже ответил
- клиенту понятен следующий шаг
- теперь нужно ждать реакции или двигаться дальше

### Exit condition
- клиент ответил и диалог продолжается → `qualified` or `visit_planned`
- клиент молчит → `waiting_reply`
- клиент просит оценку → `quote_sent`

---

# 4.5 `waiting_reply`
### Meaning
Следующий шаг зависит от ответа клиента.

### Typical situations
- ты задал уточняющие вопросы
- клиент пообещал прислать детали
- ждёшь адрес / количество устройств / описание
- ждёшь подтверждение актуальности

### Exit condition
- клиент ответил → возвращается в `qualified`, `contacted`, `visit_planned`, or `quote_sent`
- долго нет ответа → `follow_up_later`
- клиент отказался / пропал → `lost`

---

# 4.6 `visit_planned`
### Meaning
По заявке согласован следующий практический шаг: выезд / встреча / onsite intervention.

### Use
Этот статус нужен, когда уже не просто переписка, а есть намерение перейти к выполнению.

### Exit condition
- работа проведена и клиент состоялся → `won`
- после уточнения нужен отдельный quote → `quote_sent`
- отмена / отказ → `lost`

---

# 4.7 `quote_sent`
### Meaning
Клиенту отправлен более предметный ответ по объёму / формату / оценке.

### Note
Это не обязательно formal enterprise quote.
Для MVP это может означать:
- ты уже сформулировал предложение
- дальше клиент должен согласовать / подтвердить

### Exit condition
- клиент согласился → `visit_planned` or `won`
- клиент молчит → `waiting_reply`
- клиент отказался → `lost`

---

# 4.8 `won`
### Meaning
Лид превратился в реального клиента / интервенция состоялась / работа подтверждена.

### Important note
For MVP, `won` means:
- сделка состоялась
- работа принята к выполнению или выполнена
- клиент стал реальным кейсом

### Next action
После `won` важно:
- запросить отзыв позже
- зафиксировать услугу
- зафиксировать источник лида
- использовать как future case or repeat lead

---

# 4.9 `lost`
### Meaning
Лид не конвертировался и не требует дальнейшей активной работы.

### Typical reasons
- не подходит по профилю
- география не подходит
- клиент исчез
- задача вне scope
- клиент отказался
- нет реального интереса

### Recommendation
If possible, store short lost reason.

---

# 4.10 `follow_up_later`
### Meaning
Лид не умер, но сейчас не в активной работе.

### Typical cases
- клиент сказал “позже”
- задача запланирована
- человек пока не готов
- нет ответа после нормального follow-up, но есть шанс вернуться

### Exit condition
- наступает время follow-up → `contacted` or `waiting_reply`
- клиент активизировался → `qualified`
- лид окончательно потерян → `lost`

---

## 5. Recommended status movement logic

### Typical path A — clean form lead
```text
new → qualified → contacted → visit_planned → won
````

### Typical path B — incomplete lead

```text
new → need_info → contacted → waiting_reply → qualified → visit_planned → won
```

### Typical path C — weak lead

```text
new → need_info → waiting_reply → lost
```

### Typical path D — business project-like lead

```text
new → qualified → contacted → quote_sent → visit_planned → won
```

---

## 6. Status ownership logic

### Who updates statuses?

At MVP stage:

* mainly founder manually
* some automatic updates possible via form/chat
* Tech Lead may automate initial assignment

### Automation suggestions

#### Auto-set to `new`

* on website form submit
* on chat handoff submit

#### Auto-set to `need_info`

Possible if mandatory qualification details are missing.

#### Everything else

Usually founder-reviewed.

---

## 7. Minimum required CRM fields per lead

Each lead should ideally include:

* name
* phone
* email (if available)
* city
* segment
* service type
* source
* urgency
* current status
* notes
* follow-up needed yes/no

### Optional but useful

* quality
* priority
* device count
* company name
* business type

---

## 8. Recommended pipeline views

### View 1 — All active leads

Statuses:

* new
* need_info
* qualified
* contacted
* waiting_reply
* visit_planned
* quote_sent

### View 2 — Business leads

Filter:

* `lead_segment = lead_tpe`

### View 3 — Home-user leads

Filter:

* `lead_segment = lead_particulier`

### View 4 — Follow-up needed

Filter:

* `waiting_reply`
* `follow_up_later`

### View 5 — Won leads

Filter:

* `won`

### Why useful

Позволяет быстро видеть:

* что срочно
* что требует follow-up
* какие каналы работают

---

## 9. Operational handling rules

### Rule 1

Every new lead must be reviewed and assigned a meaningful status.

### Rule 2

Do not leave leads indefinitely in `new`.

### Rule 3

If you asked a question and now depend on the client, use `waiting_reply`.

### Rule 4

If data is missing from the start, use `need_info`.

### Rule 5

If the lead is good and understandable, use `qualified`.

### Rule 6

Use `lost` explicitly instead of keeping dead leads active forever.

### Rule 7

Use `follow_up_later` when there is real future potential.

---

## 10. What counts as qualified

A lead is usually `qualified` if:

* it fits AzurSysTech scope
* the city/area is acceptable
* the task is understandable enough
* the segment is clear
* there is a way to contact the person

### For business leads

Qualification is stronger if:

* number of workstations is known
* object type is known
* core need is clear

### For home leads

Qualification is stronger if:

* device type is known
* task type is known
* city is known

---

## 11. Suggested lost reasons

### Optional lost reason taxonomy

* `out_of_scope`
* `outside_service_area`
* `no_reply`
* `price_mismatch`
* `client_cancelled`
* `duplicate`
* `weak_lead`
* `other`

### Why helpful

Позже можно понять:

* почему лиды не конвертируются
* где оффер не совпадает с рынком
* где слишком много слабых лидов

---

## 12. Suggested won reasons / categories

### Optional win tagging

* `won_home_setup`
* `won_tpe_setup`
* `won_wifi`
* `won_imprimante`
* `won_poste_travail`
* `won_depannage_pc`

### Why

Это поможет увидеть, какие услуги реально продаются первыми.

---

## 13. Follow-up trigger logic

### Trigger A

Lead in `waiting_reply` too long → send follow-up.

### Trigger B

Lead in `follow_up_later` reached target date → reactivate.

### Trigger C

Lead in `quote_sent` with no answer → reminder.

### Trigger D

Lead in `won` → later ask for review / referral.

### Note

Detailed message flows are described in `follow-up-sequences.md`.

---

## 14. CRM board recommendation

### Kanban-style columns

* New
* Need info
* Qualified
* Contacted
* Waiting reply
* Visit planned
* Quote sent
* Won
* Lost
* Follow-up later

### Why good for MVP

Very visual, easy to understand, low friction.

---

## 15. CRM implementation note

For launch baseline:
- HubSpot is the primary CRM
- statuses in HubSpot must use the same stage names as this document
- no parallel Google Sheets workflow should be treated as standard operating path

### Rule

If a temporary manual export is ever needed, it should mirror HubSpot fields and stages instead of introducing a second operational system.

---

## 16. Pipeline metrics to review later

### Useful metrics

* number of leads per status
* time from `new` to `contacted`
* qualified rate
* won rate
* lost rate
* response lag
* source → won conversion
* segment → won conversion

### Why

This gives operational clarity without needing complex BI.

---

## 17. Practical examples

### Example 1 — clear home lead

New laptop setup request in Nice with phone number.

```text
new → qualified → contacted → visit_planned → won
```

### Example 2 — incomplete business lead

“Need help with office setup” but no details.

```text
new → need_info → contacted → waiting_reply
```

### Example 3 — weak Facebook comment

Comment without DM or contact.

```text
new → need_info → lost
```

### Example 4 — promising TPE lead

3 workstations + printer + Wi-Fi, wants estimate.

```text
new → qualified → contacted → quote_sent → visit_planned → won
```

---

## 18. Acceptance criteria

CRM pipeline is valid if:

* every lead can be assigned a clear status
* statuses reflect real-world progress
* business and home leads can move through same core system
* follow-up moments are visible
* dead leads are not mixed with active ones
* MVP implementation stays simple

---

## Current status

Downstream sequencing is now managed through `docs/specs`, `docs/plans`, `docs/tasklist`, and `memory_bank/*`.
