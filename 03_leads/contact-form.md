Ниже — практичное архитектурное решение под ваш кейс: **frontend отправляет `multipart/form-data`, backend принимает и нормализует, а `n8n` получает уже чистый JSON-событие**. Это самый устойчивый вариант с точки зрения контракта, безопасности и дальнейшего развития.

## Цель

Сделать так, чтобы:

* фронт мог продолжать отправлять `multipart/form-data`;
* backend был **единственной точкой входа**;
* `n8n` не зависел от структуры формы и фронтенд-деталей;
* можно было безопасно добавлять антиспам, валидацию, логирование, CRM, email, Telegram и AI-обработку.

---

## Рекомендуемый принцип

**Не подключать фронт напрямую к webhook n8n.**
Лучше строить цепочку так:

`Frontend form -> Backend API -> Validation/Normalization -> Queue or direct dispatch -> n8n webhook/internal endpoint`

Почему так:

1. `multipart/form-data` — это транспортный формат браузерной формы, а не хороший долгоживущий интеграционный контракт. MDN прямо описывает `FormData` как механизм передачи пар ключ/значение в формате `multipart/form-data`. ([MDN Web Docs][1])
2. В `n8n` webhook действительно умеет принимать запросы и возвращать ответ разными способами, но для интеграционной стабильности лучше давать ему уже нормализованный payload, а не «сырой» браузерный multipart. `n8n` webhook рассчитан на запуск workflow по входящему HTTP-вызову, а response можно строить через сам Webhook node или `Respond to Webhook`. ([n8n Docs][2])
3. Backend позволяет скрыть внутренний URL `n8n`, добавить auth/signature, rate limit, honeypot, idempotency и аудит.

---

## Рекомендуемая архитектура

### 1) Frontend

Форма отправляет `multipart/form-data` на ваш backend endpoint, например:

`POST /api/contact/submit`

Фронт ничего не знает про `n8n`.

Что фронт делает:

* собирает `FormData`
* отправляет на backend
* показывает пользователю только статус: успех / ошибка / повторить

Что фронт **не должен** делать:

* не обращаться к webhook `n8n` напрямую
* не хранить секреты
* не знать внутреннюю логику маршрутизации

---

### 2) Backend как anti-corruption layer

Backend — это адаптер между нестабильной формой и стабильной автоматизацией.

Он делает 6 вещей:

#### A. Приём multipart

Например, через:

* FastAPI + `python-multipart`
* Express/NestJS + `multer`/`busboy`

#### B. Парсинг и нормализация

Из формы получается внутренний DTO, например:

```json
{
  "source": "website_contact_form",
  "submitted_at": "2026-04-13T15:40:00Z",
  "request_id": "req_01H...",
  "contact": {
    "name": "John Doe",
    "phone": "+33...",
    "email": "john@example.com",
    "city": "Nice"
  },
  "lead": {
    "segment": "tpe",
    "service_type": "maintenance",
    "problem_description": "POS ne fonctionne plus",
    "device_count": 3,
    "urgency": "high",
    "onsite_required": true
  },
  "company": {
    "company_name": "Boulangerie X",
    "business_type": "retail",
    "workstation_count": 4,
    "business_address": "Nice"
  },
  "meta": {
    "locale": "fr",
    "page_url": "https://...",
    "ip": "masked-or-hashed",
    "user_agent": "...",
    "consent": true
  }
}
```

#### C. Валидация

Нужно разделить:

* **transport validation**: multipart распарсился корректно;
* **schema validation**: обязательные поля есть, типы верны;
* **business validation**: например, при `segment=tpe` поле `company_name` должно быть заполнено.

#### D. Anti-spam / security

Минимум:

* honeypot field `website`
* rate limit по IP
* server-side validation
* ограничение размера body
* CORS только для вашего домена
* optional captcha/cloudflare turnstile
* sanitation текстовых полей

#### E. Логирование и запись

До отправки в `n8n` полезно сохранить заявку в БД со статусом:

* `received`
* `validated`
* `dispatched_to_n8n`
* `processed`
* `failed`

#### F. Отправка в n8n

Backend отправляет уже **JSON** на внутренний webhook `n8n`, а не пересылает multipart как есть.

---

## Лучший паттерн интеграции с n8n

Есть два рабочих варианта.

### Вариант A. Синхронный

`Backend -> n8n webhook -> immediate response`

Подходит, если workflow быстрый:

* сохранить лид
* отправить email
* уведомить Telegram
* создать запись в Airtable/Notion/CRM

Плюсы:

* проще
* меньше компонентов

Минусы:

* backend ждёт `n8n`
* если `n8n` тормозит, страдает UX
* сложнее ретраи

### Вариант B. Асинхронный — рекомендую

`Backend -> DB/Queue -> worker/dispatcher -> n8n`

Поток:

1. backend принял форму;
2. сохранил заявку;
3. сразу ответил фронту `202 Accepted` или `200 OK`;
4. фоновый dispatch отправил событие в `n8n`;
5. статус обновился.

Плюсы:

* форма отвечает быстро;
* `n8n` можно временно отключить, а заявки не потеряются;
* удобно делать retry/dead-letter;
* лучше для production.

Для вас это предпочтительнее.

---

## Что именно должно идти в n8n

В `n8n` должен уходить **не form payload**, а **domain event**.

Например:

```json
{
  "event_type": "lead.submitted",
  "event_version": 1,
  "request_id": "req_01HXYZ",
  "submitted_at": "2026-04-13T15:40:00Z",
  "lead_id": "lead_12345",
  "source": "website_contact_form",
  "payload": {
    "segment": "tpe",
    "contact": {
      "name": "John Doe",
      "phone": "+33...",
      "email": "john@example.com",
      "city": "Nice"
    },
    "service": {
      "service_type": "maintenance",
      "problem_description": "POS ne fonctionne plus",
      "device_count": 3,
      "urgency": "high",
      "onsite_required": true
    },
    "company": {
      "company_name": "Boulangerie X",
      "business_type": "retail",
      "workstation_count": 4,
      "business_address": "Nice"
    }
  }
}
```

Это важно, потому что тогда:

* фронт можно менять без ломки `n8n`;
* можно сделать `event_version`;
* можно подключать не только `n8n`, но и CRM/ERP/AI-agent.

---

## Контракт слоёв

### Внешний контракт frontend -> backend

Разрешаем `multipart/form-data`.

Пример допустимых полей:

* `segment`
* `name`
* `phone`
* `email`
* `city`
* `service_type`
* `problem_description`
* `device_count`
* `urgency`
* `onsite_required`
* `company_name`
* `business_type`
* `workstation_count`
* `business_address`
* `website` как honeypot

### Внутренний контракт backend -> n8n

Только JSON, версия обязательна:

* `event_type`
* `event_version`
* `request_id`
* `submitted_at`
* `source`
* `payload`

---

## Предлагаемая схема компонентов

### Минимальная production-схема

* **Frontend**: Next.js / React form
* **Backend API**: FastAPI или NestJS
* **DB**: PostgreSQL
* **Queue**: Redis + worker / RabbitMQ / built-in job queue
* **Automation**: n8n
* **Reverse proxy**: Nginx / Traefik / Caddy

### Логический поток

1. Пользователь отправляет форму.
2. Backend принимает multipart.
3. Backend валидирует и нормализует.
4. Backend создаёт `lead` в БД.
5. Backend ставит job в очередь.
6. Worker отправляет JSON в `n8n`.
7. `n8n` делает:

   * email
   * Telegram
   * CRM
   * Sheets/DB sync
   * AI classification
8. `n8n` при необходимости вызывает обратно backend или обновляет статус через API.

---

## Почему backend должен оставаться owner-слоем

Потому что именно backend должен владеть:

* схемой данных;
* idempotency;
* правилами валидации;
* anti-spam;
* observability;
* статусами заявок;
* правом переиграть workflow без участия фронта.

`n8n` хорошо использовать как **оркестратор**, но не как главный системный слой данных.

---

## Ответ пользователю формы

Рекомендую не ждать полного выполнения `n8n`.

### Ответ backend фронту:

```json
{
  "ok": true,
  "message": "Votre demande a bien été envoyée.",
  "request_id": "req_01HXYZ"
}
```

### HTTP статус:

* `200 OK` — если всё сразу сохранено
  или
* `202 Accepted` — если отправили в асинхронную обработку

---

## Безопасность

Критичные меры:

1. **Не светить публичный webhook n8n** наружу.
2. Backend -> n8n делать по:

   * internal network
   * secret header
   * HMAC signature
   * IP allowlist, если возможно
3. Хранить raw payload отдельно от normalized payload.
4. Ввести idempotency key:

   * например hash от `(email|phone|timestamp bucket|problem_description)`
   * чтобы не плодить дубли при повторной отправке
5. Ограничить размер `multipart` body.
6. Проверять MIME/type, если потом появятся файлы.

В документации `n8n` есть поддержка webhook auth и управление ответом webhook, что хорошо, но наружный доступ всё равно лучше закрывать backend-слоем. ([n8n Docs][3])

---

## Ошибки и отказоустойчивость

Нужно явно разделить 3 типа ошибок:

### 1. Ошибка формы

Неверные поля, пустой email, неверный телефон.
Ответ: `400`

### 2. Ошибка backend

Не удалось сохранить в БД.
Ответ: `500`

### 3. Ошибка n8n

Форма уже принята, но automation не сработала.
Ответ пользователю всё равно успешный, а дальше:

* retry
* alert админу
* статус `dispatch_failed`

Это ключевой момент: **проблемы n8n не должны ломать отправку формы пользователю**.

---

## Что бы я рекомендовал конкретно вам

С учётом вашего подхода `сайт + автоматизация + AI-agent`:

### Базовый стек

* **Frontend**: текущий React/Next frontend
* **Backend**: FastAPI
* **Validation**: Pydantic schema
* **DB**: PostgreSQL
* **Queue**: Redis + RQ/Celery/Arq
* **Automation**: n8n
* **AI/дальше**: отдельный worker или n8n HTTP call в AI-service

### Почему так

* FastAPI удобно принимает и валидирует формы;
* Pydantic хорошо подходит для нормализации нестабильного form-input;
* PostgreSQL даст нормальную основу под заявки, CRM-lite и будущих агентов;
* `n8n` останется automation-layer, а не core-system.

---

## Практическое ТЗ по слоям

### Backend endpoint

`POST /api/contact/submit`

Принимает:

* `multipart/form-data`

Делает:

* parse
* validate
* normalize
* save `lead`
* enqueue event
* return success

### Internal event dispatcher

`dispatch_lead_submitted(lead_id)`

Делает:

* load normalized lead
* build event JSON
* POST to internal n8n webhook

### n8n workflow

Trigger:

* Webhook node

Flow:

* validate signature/header
* classify lead
* notify Telegram/email
* create CRM record / Google Sheet row / Notion page
* optional AI summary
* callback/update status

---

## Что не рекомендую

Не рекомендую:

* фронт -> `n8n` напрямую;
* передавать multipart внутрь `n8n` как основной контракт;
* использовать Google Sheets как первичное хранилище лидов;
* хранить бизнес-логику маршрутизации только в `n8n`;
* делать `n8n` единственным местом, где существует заявка.

---

## Итоговое решение

Оптимальная архитектура:

**1. Frontend** отправляет `multipart/form-data` на **backend**.
**2. Backend** принимает, валидирует, антиспамит, нормализует и сохраняет заявку.
**3. Backend** публикует нормализованное событие в очередь или напрямую в `n8n`.
**4. n8n** получает только стабильный JSON-контракт и выполняет автоматизацию.
**5. Пользователь получает быстрый ответ независимо от состояния `n8n`.**

Это решение даёт:

* стабильность;
* безопасность;
* расширяемость;
* удобство для будущих AI-агентов и документационных процессов.

Следующий полезный шаг: я могу сразу подготовить для тебя **полное архитектурное ТЗ** в формате для AI-кодера: `Objective / Scope / Constraints / API contract / Event schema / n8n workflow contract / Acceptance criteria`.

[1]: https://developer.mozilla.org/en-US/docs/Web/API/FormData?utm_source=chatgpt.com "FormData - Web APIs | MDN"
[2]: https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/?utm_source=chatgpt.com "Webhook node documentation"
[3]: https://docs.n8n.io/integrations/builtin/credentials/webhook/?utm_source=chatgpt.com "Webhook credentials"




вторая часть:

Отлично. Контекст уже достаточный, чтобы перейти от “сбора фактов” к архитектурному решению.

Мой вывод сразу:

**Для твоего проекта сейчас правильнее не делать n8n главным intake-слоем.**
У тебя уже есть backend в Next.js API routes. Значит оптимальная схема на этом этапе:

**каналы → Next.js API → операционная БД → n8n → Google Sheets / Telegram / вторичные интеграции**

А не:

**каналы → n8n → Sheets**

Почему:

* у тебя уже есть серверная точка входа
* там проще держать валидацию, нормализацию, anti-spam, idempotency
* n8n лучше оставить как orchestration layer
* Google Sheets не подходит как основной store, если потом это будут использовать ассистенты, документация, статусы заявок и история контактов

### Что у тебя уже хорошо

* есть единый backend entrypoint
* есть явный контракт формы
* есть разделение `source/channel`
* есть `status=New`
* уже заложен `idempotency`
* есть handoff из чата в intake

Это хорошая база.

### Главная архитектурная проблема сейчас

Сейчас по факту intake заканчивается в **Google Sheets через n8n**.
Это нормально как временный MVP, но плохо как основа системы, потому что:

* нет канонической сущности лида
* нет нормального статуса обработки
* нет удобной связи между lead и сообщениями
* WhatsApp и чат потом начнут плодить дубли
* Telegram-сводка станет просто уведомлением без нормального back-reference в систему

### Рекомендация по MVP

Сделай **PostgreSQL** как основной store уже сейчас.

Для AzurSysTech это лучший путь, потому что:

* потом можно подключить CRM-логику без миграции с Sheets
* n8n сможет читать/дополнять данные, но не владеть ими
* AI-ассистенты смогут работать с нормальными сущностями
* можно хранить lead, messages, events, status history

### Минимальная целевая модель

На MVP тебе достаточно 4 сущностей:

**1. leads**
главная карточка заявки

* id
* created_at
* source
* segment
* name
* phone
* email
* city
* service_type
* problem_description
* urgency
* onsite_required
* company_name
* business_type
* workstation_count
* business_address
* status
* raw_payload
* normalized_payload
* dedupe_key

**2. conversations**
если заявка пришла из чата/WhatsApp

* id
* lead_id
* channel
* started_at
* summary
* last_message_at

**3. messages**

* id
* conversation_id
* role
* message_text
* created_at

**4. lead_events**
для аудита и автоматизаций

* id
* lead_id
* event_type
* event_payload
* created_at

### Как делить ответственность

**Backend должен делать:**

* принимать данные из формы/чата/WhatsApp
* валидировать
* нормализовать
* присваивать `source`
* считать `dedupe_key`
* писать в БД
* создавать `lead_event`
* вызывать n8n уже после успешной записи

**n8n должен делать:**

* отправка в Telegram
* запись/зеркало в Google Sheets
* дополнительные уведомления
* простые маршруты по правилам
* возможно enrichment, но не первичную валидацию

### Google Sheets

Оставляй, но только как:

* журнал для ручного просмотра
* простая витрина для администратора
* временный экспорт

Не используй как:

* system of record
* источник для статусов
* место, где AI-агент принимает решения

### Telegram

Telegram лучше строить не как “просто текстовое уведомление”, а как уведомление с системным ID лида.

Минимум в сообщении:

* lead_id
* source
* client type
* name
* phone
* city
* service_type
* urgency
* short summary
* status

Позже можно добавить кнопки:

* `В работу`
* `Перезвонить`
* `Спам`
* `Закрыто`

Но это уже phase 2.

### По чат-ассистенту

Сейчас у тебя chat handoff идет в `/api/contact/submit`. Это нормально для MVP.
Но лучше логически разделить:

* `/api/chat` — диалог
* `/api/contact/submit` — финальная заявка
* позже можно добавить `/api/intake/chat-handoff`

Чтобы не смешивать conversational data и final lead payload.

### По WhatsApp

Когда подключишь WhatsApp, не веди его напрямую в n8n.
Делай так же:

**WhatsApp provider webhook → backend endpoint → DB → n8n**

Иначе будет разная логика intake для сайта и WhatsApp.

### Что делать прямо сейчас

Мой совет по порядку:

**Шаг 1.** Зафиксировать архитектурное правило:

* backend = intake owner
* DB = source of truth
* n8n = orchestration
* Sheets = mirror

**Шаг 2.** Утвердить минимальную схему БД

**Шаг 3.** Обновить контракт `/api/contact/submit` так, чтобы он писал в БД до вызова n8n

**Шаг 4.** Сделать Telegram flow от события в БД / backend event

**Шаг 5.** Подключать WhatsApp только после этого

### Чёткая рекомендация

Для AzurSysTech сейчас лучший вариант:

* **Next.js API оставить**
* **добавить PostgreSQL**
* **n8n перевести в роль automation layer**
* **Google Sheets оставить как вторичную витрину**
* **form + chat сначала довести до стабильной единой intake-модели**
* **WhatsApp подключать после появления БД и статусов**

Следующий логичный шаг: я могу подготовить тебе **архитектурное ТЗ MVP intake-системы** в формате для агента-кодера:

* objective
* scope
* entities
* API contracts
* backend responsibilities
* n8n responsibilities
* DB schema draft
* status model
* acceptance criteria

Именно это сейчас будет самым полезным.
