# follow-up-sequences.md
_version: v0.1
_owner: Marketing Lead
_status: working ops baseline
_brand: AzurSysTech
_primary_language: ru

---

## 1. Цель документа

Подготовить последовательности follow-up для **AzurSysTech**, чтобы:

- не терять лиды после первого контакта
- системно возвращаться к “тихим” обращениям
- не выглядеть навязчиво
- отличать бизнес-лиды от частных
- использовать follow-up как аккуратный инструмент конверсии

---

## 2. Основной принцип follow-up

### Follow-up philosophy
Follow-up нужен не для давления, а для того, чтобы:
- напомнить о себе
- вернуть клиента в диалог
- помочь ему продолжить по задаче
- не дать заявке потеряться

### Brand tone
Follow-up от AzurSysTech должен быть:
- коротким
- спокойным
- вежливым
- без агрессивных продаж
- без ощущения “дожима”

---

## 3. Core follow-up rules

### Rule 1
Do not follow up too early and too often.

### Rule 2
Each follow-up should have a clear purpose:
- напомнить
- уточнить
- закрыть loop
- реактивировать интерес

### Rule 3
If client clearly said “неинтересно”, stop active follow-up.

### Rule 4
Business and home-user follow-up can differ slightly in tone.

### Rule 5
If client is still potentially relevant but not ready, move to `follow_up_later`.

---

## 4. Main follow-up scenarios

### Scenario A
No reply after first meaningful response

### Scenario B
Need more information, but client disappeared

### Scenario C
Quote / estimate sent, no answer

### Scenario D
Client said “later”

### Scenario E
After completed work — request review

---

## 5. Timing logic (MVP)

### Recommended baseline timing
This is an operational recommendation, not a rigid rule.

#### No reply after first message
- follow-up 1: after a reasonable short delay
- follow-up 2: later if still relevant
- then move to `follow_up_later` or `lost`

#### Quote / estimate no reply
- one reminder
- one soft last reminder
- then close or park

#### “Later”
- set reminder date
- return later with simple reactivation

### Important note
In MVP, timing can be managed manually.

---

## 6. Sequence A — no reply after first response

# Follow-up A1 — soft reminder
Здравствуйте. Возвращаюсь к вашему обращению.

Если задача всё ещё актуальна, можете просто ответить на это сообщение или коротко прислать недостающие детали — и мы продолжим по следующему шагу.

**AzurSysTech**

### Use when
- ты уже ответил
- клиент молчит
- задача ещё выглядит живой

---

# Follow-up A2 — second soft reminder
Здравствуйте. Напоминаю о вашем обращении в **AzurSysTech**.

Если помощь ещё нужна, можно просто ответить на это сообщение и коротко уточнить, актуальна ли задача сейчас.

**AzurSysTech**

### Use when
- после первого follow-up тишина
- ты не хочешь давить
- но хочешь закрыть цикл аккуратно

---

# Follow-up A3 — closing the loop
Здравствуйте. Пока закрою обращение как неактивное, чтобы не беспокоить лишний раз.

Если задача снова станет актуальной, можно просто написать сюда, и мы продолжим.

**AzurSysTech**

### Use when
- уже был follow-up
- клиент не отвечает
- пора перевести лид в `follow_up_later` or `lost`

---

## 7. Sequence B — missing info follow-up

# Follow-up B1 — missing details reminder
Здравствуйте. Чтобы продолжить по вашей задаче, мне не хватает нескольких деталей:

- что именно нужно сделать
- сколько устройств
- где вы находитесь
- нужен ли выезд

Можно ответить коротко, этого будет достаточно.

**AzurSysTech**

### Use when
- лид интересный
- но информации недостаточно
- клиент пропал после первого уточнения

---

# Follow-up B2 — lighter version
Здравствуйте. Если задача ещё актуальна, пришлите, пожалуйста, недостающие детали в 2–3 строках, и я смогу лучше понять следующий шаг.

**AzurSysTech**

### Use when
- не хочется повторять длинный список
- нужен мягкий возврат в диалог

---

## 8. Sequence C — business lead follow-up

# Follow-up C1 — business reminder
Здравствуйте. Возвращаюсь к вашей задаче.

Если вопрос по рабочим местам / Wi-Fi / принтерам / локальной сети ещё актуален, можете коротко прислать недостающие детали, и мы продолжим по следующему шагу.

**AzurSysTech**

### Use when
- TPE lead
- после первой квалификации наступила тишина

---

# Follow-up C2 — business project reactivation
Здравствуйте. Напоминаю о вашем обращении по IT-настройке для бизнеса.

Если задача остаётся актуальной, можно продолжить с текущего этапа — достаточно коротко подтвердить, что вы хотите двигаться дальше.

**AzurSysTech**

### Use when
- лид уже был внятно квалифицирован
- ты не хочешь снова задавать весь набор вопросов

---

# Follow-up C3 — business closing loop
Здравствуйте. Пока зафиксирую ваш запрос как отложенный, чтобы не беспокоить лишний раз.

Если задача по рабочим местам, Wi-Fi, принтерам или другой IT-настройке снова станет актуальной, просто напишите.

**AzurSysTech**

---

## 9. Sequence D — quote / estimate reminder

# Follow-up D1 — soft quote reminder
Здравствуйте. Возвращаюсь к вашему запросу.

Ранее я направил ориентир / следующий шаг по вашей задаче. Если вопрос ещё актуален, можно продолжить по этой заявке.

**AzurSysTech**

### Use when
- ты уже дал предметный ответ
- ждёшь реакции
- нужно мягко напомнить

---

# Follow-up D2 — quote clarification reminder
Здравствуйте. Если вы всё ещё рассматриваете этот запрос, можно продолжить по вашей задаче. Если нужно, также можно уточнить отдельные детали перед следующим шагом.

**AzurSysTech**

### Use when
- клиент, возможно, завис на этапе решения
- нужен мягкий возврат, а не давление

---

# Follow-up D3 — final soft close
Здравствуйте. Пока закрою этот запрос как неактивный, чтобы не беспокоить лишний раз.

Если вы захотите вернуться к нему позже, просто напишите — и мы продолжим с текущего этапа.

**AzurSysTech**

---

## 10. Sequence E — “later” leads

# Follow-up E1 — scheduled later reactivation
Здравствуйте. Возвращаюсь к вашей задаче, которую вы хотели обсудить позже.

Если вопрос сейчас стал актуален, можно продолжить и перейти к следующему шагу.

**AzurSysTech**

### Use when
- клиент сам сказал “позже”
- лид stored in `follow_up_later`

---

# Follow-up E2 — business later reactivation
Здравствуйте. Напоминаю о вашей задаче по IT-настройке / рабочим местам / Wi-Fi.

Если сейчас уже можно вернуться к этому вопросу, напишите, и продолжим.

**AzurSysTech**

---

# Follow-up E3 — home-user later reactivation
Здравствуйте. Напоминаю о вашей задаче по компьютеру / Wi-Fi / принтеру.

Если помощь всё ещё нужна, можно просто ответить на это сообщение.

**AzurSysTech**

---

## 11. Sequence F — post-service review request

# Follow-up F1 — review request
Здравствуйте. Спасибо за обращение в **AzurSysTech**.

Если вам всё подошло, будет очень полезно, если позже вы сможете оставить короткий отзыв. Это помогает развивать локальный сервис и вызывать больше доверия у новых клиентов.

**AzurSysTech**

### Use when
- работа уже выполнена
- клиент доволен
- есть смысл просить отзыв

---

# Follow-up F2 — simpler review version
Здравствуйте. Спасибо за обращение.

Если вам было полезно, позже можно будет оставить короткий отзыв — это очень помогает развитию AzurSysTech.

**AzurSysTech**

---

## 12. Sequence G — repeat / upsell style follow-up

# Follow-up G1 — business repeat support
Здравствуйте. Если у вас снова появятся задачи по рабочим местам, Wi-Fi, принтерам или базовой IT-среде, можно обращаться повторно — такие вопросы удобно решать по мере появления.

**AzurSysTech**

### Use when
- после выполненной задачи для бизнеса
- мягкий намёк на future repeat work

---

# Follow-up G2 — home-user repeat support
Здравствуйте. Если позже понадобится помощь с компьютером, Wi-Fi, принтером или новым устройством, можно обращаться снова.

**AzurSysTech**

---

## 13. Follow-up by segment

### Business leads
Prefer:
- slightly more structured language
- references to “рабочие места / Wi-Fi / принтеры / локальная сеть”
- emphasis on practical next step

### Home leads
Prefer:
- simpler language
- mention device/problem directly
- reassuring, low-pressure tone

---

## 14. Follow-up by channel

### Website leads
Can be slightly more structured, because intent is already stronger.

### Facebook / Messenger leads
Keep shorter and more conversational.

### Chat leads
Reference that summary was already received if useful.

### Manual referrals
Can be warmer and more direct.

---

## 15. Suggested operational cadence model

### For active leads
- first meaningful reply
- one reminder if needed
- second reminder if still relevant
- park or close

### For “later” leads
- reactivate when appropriate
- if no answer, park again or close

### For won leads
- later ask for review
- optionally mention repeat support

### Rule
Do not create a long automated nurture funnel at MVP stage.

---

## 16. Recommended CRM triggers

### Trigger 1
Status = `waiting_reply` → candidate for follow-up

### Trigger 2
Status = `quote_sent` and no update → reminder candidate

### Trigger 3
Status = `follow_up_later` and reminder date reached → reactivate

### Trigger 4
Status = `won` → review request later

### Rule
Even if fully automated later, keep human approval where possible in MVP.

---

## 17. Anti-spam rules

### Do not
- send repeated follow-ups with no change in wording
- send too many reminders
- pressure the client
- imply urgency that does not exist
- sound annoyed

### Always
- leave the door open
- make replying easy
- keep message compact
- preserve trust

---

## 18. Acceptance criteria

Follow-up sequences are valid if:
- they cover main real-world scenarios
- they work for both business and home leads
- they remain polite and non-pushy
- they can be used manually or later automated
- they fit AzurSysTech’s practical and calm brand voice

---

## 19. Next step after this file

After this file, block `03_leads` should be operationally complete for MVP.
Recommended next block:
- `04_facebook` completion
- then `05_ai`
````
