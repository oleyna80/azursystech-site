# prompt-library-content.md
_version: v0.1
_owner: Marketing Lead
_status: working prompt baseline
_brand: AzurSysTech
_primary_language: ru

---

## 1. Цель документа

Собрать библиотеку промтов для AI content engine **AzurSysTech**, чтобы:

- быстро генерировать черновики контента
- сохранять единый tone of voice
- не писать каждый prompt с нуля
- поддерживать Facebook, группы и короткие маркетинговые форматы
- упростить работу founder’а и Tech Lead

---

## 2. Основной принцип

### Prompt library philosophy
Промты должны быть:
- короткими
- прикладными
- повторно используемыми
- привязанными к реальным форматам контента
- основанными на уже утверждённой стратегии

### Core rule
Нельзя использовать “пустые” промты типа:
- “напиши хороший пост”
- “сделай крутой продающий текст”
- “создай супер engaging content”

Потому что они дают:
- слишком общий результат
- не тот tone
- лишнюю “AI-пышность”
- слабую связку с оффером AzurSysTech

---

## 3. Foundation context for all prompts

### Every content prompt should implicitly or explicitly know
- brand: **AzurSysTech**
- positioning: **informatique de proximité**
- geography: **Nice + 30 km**
- target segments:
  - малый бизнес / TPE
  - частные клиенты
- launch priority:
  - получить первые заявки
- tone:
  - спокойный
  - практичный
  - локальный
  - понятный
- avoid:
  - heavy jargon
  - corporate buzzwords
  - AI-sounding fluff
  - false promises

---

## 4. Master content system prompt

### Master prompt
Ты пишешь контент для бренда **AzurSysTech**.

Контекст бренда:
- локальная IT-помощь в Nice + 30 km
- работа с малым бизнесом / TPE и частными клиентами
- основной фокус на практические задачи:
  - рабочие места
  - Wi-Fi
  - локальная сеть
  - принтеры
  - новый ПК
  - выездная IT-помощь
- стиль:
  - коротко
  - спокойно
  - по делу
  - без “продающего шума”
  - без перегруженного техножаргона

Правила:
- не обещай точную цену
- не обещай сроки
- не придумывай кейсы, отзывы или факты
- не используй corporate / startup buzzwords
- пиши так, чтобы пост был понятен за несколько секунд
- у каждого текста должен быть один простой CTA
- любой результат считается draft до human approval

---

## 5. Prompt template structure

### Recommended reusable prompt shape
Each content prompt should specify:

1. задача
2. сегмент
3. формат
4. тема
5. ключевой угол
6. tone constraints
7. CTA
8. forbidden elements

### Example structure
- Task: create a Facebook post
- Segment: TPE
- Topic: small office Wi-Fi + printers
- Angle: practical local help
- CTA: write in DM or leave request
- Avoid: jargon, promises, long paragraphs

---

## 6. Prompt: Facebook Page service post

### Prompt
Используя контекст бренда AzurSysTech, напиши короткий Facebook-пост на русском языке.

Параметры:
- формат: Facebook Page post
- сегмент: [указать: TPE / home users]
- тема: [указать]
- цель: объяснить услугу простым языком
- стиль: спокойный, локальный, практичный
- длина: короткий или средний пост
- структура:
  1. понятный заход
  2. что за услуга / проблема
  3. кому подходит
  4. простой CTA

Ограничения:
- не использовать техножаргон без необходимости
- не обещать точную цену и сроки
- не писать слишком рекламно
- не использовать “инновационные решения” и похожие фразы

---

## 7. Prompt: Pain-based Facebook post

### Prompt
Напиши пост для Facebook Page бренда AzurSysTech.

Параметры:
- сегмент: [TPE / частные клиенты]
- pain point: [например: плохой Wi-Fi, не подключается принтер, новый ПК не готов к работе]
- задача: сделать пост по модели “узнаваемая проблема → спокойное объяснение → как помогает AzurSysTech → CTA”
- стиль: простой, прикладной, без перегруза
- длина: до среднего

Ограничения:
- не делай длинных технических объяснений
- не превращай текст в статью
- не обещай “быстро и гарантированно”
- CTA должен быть один и простой

---

## 8. Prompt: Business use-case post

### Prompt
Напиши пост для Facebook Page бренда AzurSysTech под малый бизнес / TPE.

Параметры:
- формат: business use-case post
- тема: [например: 2–3 рабочих места, Wi-Fi для кабинета, настройка маленького офиса]
- задача: показать знакомый сценарий для малого бизнеса и объяснить, как AzurSysTech помогает без лишней сложности
- tone: не корпоративный, а спокойный и practical
- длина: короткий или средний
- CTA: мягкий, не агрессивный

Ограничения:
- не писать как для enterprise
- не использовать buzzwords
- не обещать full project delivery без уточнения
- не перегружать текст деталями

---

## 9. Prompt: Home-user post

### Prompt
Напиши Facebook-пост для AzurSysTech для частных клиентов.

Параметры:
- тема: [новый ПК / медленный компьютер / Wi-Fi / принтер / ноутбук]
- задача: показать, что с такой задачей можно спокойно обратиться и не нужно разбираться в технике самому
- тон: доброжелательный, спокойный, простой
- структура:
  1. знакомая ситуация
  2. что обычно мешает
  3. как помогает AzurSysTech
  4. CTA

Ограничения:
- без сложных терминов
- без “умных” технических абзацев
- не звучать как реклама дешёвого мастера
- не обещать фиксированную цену

---

## 10. Prompt: FAQ-style post

### Prompt
Напиши короткий FAQ-style пост для AzurSysTech.

Параметры:
- вопрос: [указать]
- задача: дать спокойный, ясный ответ и мягко перевести к следующему шагу
- длина: короткий
- стиль: понятно, без перегруза

Ограничения:
- не делать длинную экспертную лекцию
- не перегружать юридическими или техническими деталями
- использовать один CTA

---

## 11. Prompt: Local trust / presence post

### Prompt
Напиши короткий пост для AzurSysTech, который усиливает локальное доверие.

Параметры:
- тема: [где работает AzurSysTech / как проходит заявка / почему удобно сначала написать / для кого подходит]
- цель: показать локальность, простоту контакта и практичность сервиса
- tone: спокойный, надёжный, local-first
- длина: короткая

Ограничения:
- без “громких” обещаний
- без AI-жаргона
- без корпоративного тона

---

## 12. Prompt: Group-safe post

### Prompt
Напиши мягкий короткий пост для Facebook-группы от имени AzurSysTech.

Параметры:
- аудитория: [локальная группа / expat group / business group / neighborhood group]
- тема: [указать]
- задача: написать мягко, без ощущения спама, чтобы пост выглядел уместно для группы
- стиль: локально, спокойно, без навязчивой рекламы
- длина: короткая

Ограничения:
- не писать слишком “продажно”
- не использовать слишком много CTA
- не перегружать ссылками
- не копировать tone page post word-for-word

---

## 13. Prompt: Short ad blurb

### Prompt
Создай очень короткий текст для AzurSysTech в формате service blurb / short ad line.

Параметры:
- сегмент: [TPE / home / mixed]
- тема: [указать]
- длина: 1–3 строки
- цель: быстро объяснить услугу
- география: Nice + 30 km

Ограничения:
- максимум одна идея
- без сложных оборотов
- без лишних обещаний
- должно звучать естественно

---

## 14. Prompt: CTA variants

### Prompt
Сгенерируй 10 коротких CTA-фраз для бренда AzurSysTech.

Параметры:
- сегмент: [TPE / home / mixed]
- контекст: [пост / сайт / группа / DM]
- tone: спокойный, простой, не агрессивный
- цель: побудить написать сообщение, оставить заявку или перейти к следующему шагу

Ограничения:
- не использовать крикливый sales tone
- не писать “купите сейчас”
- CTA должны быть короткими и естественными

---

## 15. Prompt: Repurpose full post into group version

### Prompt
Возьми готовый пост AzurSysTech и адаптируй его в более мягкую короткую версию для Facebook-группы.

Задача:
- сохранить основную идею
- убрать излишнюю “брендовость”
- сократить текст
- сделать его более уместным для группы
- оставить один мягкий CTA

Ограничения:
- не делать текст слишком рекламным
- не использовать длинные абзацы
- не добавлять новые обещания

---

## 16. Prompt: Repurpose post into FAQ

### Prompt
Возьми тему AzurSysTech и преврати её в FAQ-style мини-пост.

Параметры:
- тема: [указать]
- вопрос должен быть похож на реальный вопрос клиента
- ответ должен быть коротким, спокойным и прикладным
- в конце один простой CTA

Ограничения:
- не уходить в длинное объяснение
- не перегружать техническими деталями

---

## 17. Prompt: Repurpose into 3 variants

### Prompt
На основе одной темы для AzurSysTech создай 3 формата:

1. Facebook Page post
2. Short group post
3. One-line service blurb

Параметры:
- тема: [указать]
- сегмент: [TPE / home / mixed]
- tone: local, practical, calm
- CTA: simple

Ограничения:
- все варианты должны быть связаны одной идеей
- не дублировать дословно один и тот же текст
- не использовать перегруженный стиль

---

## 18. Prompt: Monthly idea batch

### Prompt
Сгенерируй 12 идей контента для AzurSysTech на месяц.

Требования:
- 6 идей для малого бизнеса / TPE
- 4 идеи для частных клиентов
- 2 идеи смешанного типа
- каждая идея должна быть привязана к реальной услуге или реальной проблеме
- укажи:
  - тему
  - сегмент
  - формат
  - короткий угол подачи
  - suggested CTA

Ограничения:
- не использовать абстрактные IT-темы
- не делать идеи слишком общими
- все идеи должны быть пригодны для Facebook launch phase

---

## 19. Prompt: Rewrite too-AI-sounding draft

### Prompt
Перепиши этот черновик для бренда AzurSysTech так, чтобы он звучал:
- проще
- короче
- спокойнее
- локальнее
- менее “AI-generated”

Сохрани:
- основную идею
- сегмент
- CTA

Убери:
- избыточную “красивость”
- общие слова без смысла
- длинные абзацы
- corporate tone
- перегруженные формулировки

---

## 20. Prompt: Simplify technical draft

### Prompt
Упрости этот текст для аудитории AzurSysTech.

Требования:
- сделать его понятным для малого бизнеса или частного клиента
- оставить только practical смысл
- убрать ненужный техножаргон
- не потерять главную пользу
- сохранить один понятный CTA

---

## 21. Prompt: Business-first rewrite

### Prompt
Перепиши этот текст для бренда AzurSysTech так, чтобы он лучше подходил для малого бизнеса / TPE.

Требования:
- сильнее подчеркнуть рабочие места, Wi-Fi, принтеры, локальную сеть, базовую IT-среду
- не звучать как enterprise consultant
- сохранить local practical tone
- оставить простой CTA

---

## 22. Prompt: Home-user rewrite

### Prompt
Перепиши этот текст для AzurSysTech так, чтобы он лучше подходил частным клиентам.

Требования:
- сделать формулировки проще
- усилить бытовую узнаваемость
- не звучать слишком “делово”
- сохранить practical tone
- закончить простым CTA

---

## 23. Tone guardrail prompt

### Prompt
Перед тем как финализировать текст для AzurSysTech, проверь его по этим правилам:

- звучит ли он спокойно и понятно?
- нет ли лишнего техножаргона?
- нет ли ложных обещаний по цене и срокам?
- нет ли corporate / startup buzzwords?
- понятна ли тема за несколько секунд?
- есть ли один простой CTA?
- выглядит ли текст как контент локального специалиста, а не контент-машины?

Если есть проблемы, перепиши текст в более подходящем стиле.

---

## 24. Forbidden language list for prompts

### In prompts, forbid language like:
- инновационные решения
- цифровая трансформация
- cutting-edge
- best-in-class
- enterprise-grade
- лидер рынка
- высокоэффективная экосистема
- интеллектуальная платформа
- революционный подход

### Why
These phrases damage brand fit for AzurSysTech.

---

## 25. Prompt metadata recommendation

### Each prompt execution should ideally include metadata
- prompt_name
- segment
- content_type
- topic
- CTA_type
- output_length
- review_status
- prompt_version

### Why
This helps:
- compare results
- debug prompts
- improve content workflow later

---

## 26. Recommended prompt library organization

### Suggested categories
- base system prompts
- post generation prompts
- repurposing prompts
- rewrite prompts
- CTA prompts
- monthly planning prompts
- tone / safety prompts

### File structure later
Could be stored as:
- markdown reference
- JSON prompt configs
- structured prompt templates in code
- admin prompt registry

---

## 27. Acceptance criteria

Prompt library for content is valid if:
- it covers main AzurSysTech content formats
- prompts are reusable
- prompts support business-first positioning
- prompts include repurposing logic
- prompts include tone guardrails
- Tech Lead can implement them as prompt templates without ambiguity

---

## Current status

Downstream sequencing is now managed through `docs/specs`, `docs/plans`, `docs/tasklist`, and `memory_bank/*`.
