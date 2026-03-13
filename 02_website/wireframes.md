# wireframes.md
_version: v0.1
_owner: Marketing Lead
_status: draft
_brand: AzurSysTech
_primary_language: ru

---

## 1. Цель документа

Описать wireframes для MVP-сайта **AzurSysTech**, чтобы Tech Lead мог:

- быстро собрать структуру экранов
- правильно расположить CTA
- учесть приоритет малого бизнеса
- встроить форму и AI chat widget
- сделать mobile-first layout
- не перегрузить интерфейс

---

## 2. Общие UX-принципы

### Основной принцип
Интерфейс должен помогать быстро понять:

- что делает AzurSysTech
- кому помогает
- где работает
- как оставить заявку

### Приоритет восприятия
1. Малый бизнес / TPE
2. Основные услуги
3. Простота связи
4. Частные клиенты
5. Цены от
6. FAQ / доверие

### UI-стиль
- простой
- чистый
- спокойный
- современный
- без “enterprise dashboard” ощущения
- без перегруженных карточек и сложных анимаций

### Layout rule
На каждом ключевом экране должен быть минимум один явный CTA.

---

## 3. Breakpoints and layout priorities

### Mobile-first rule
Сначала проектируем мобильную версию.

### Suggested breakpoints
- mobile: 320–767
- tablet: 768–1023
- desktop: 1024+

### Mobile UX priorities
- короткие секции
- CTA выше
- форма не слишком длинная
- чат не перекрывает основное содержимое
- sticky CTA optional

---

## 4. Global layout frame

### Header
Contains:
- logo / brand name
- navigation
- primary CTA button

### Main content
Page-specific sections.

### Footer
Contains:
- short brand line
- links
- area served
- legal links
- contact CTA

---

## 5. Header wireframe

### Desktop header
```text
[Logo AzurSysTech]   [Главная] [Услуги] [Для бизнеса] [Для дома] [Цены] [FAQ] [Контакты]   [Оставить заявку]
```

### Mobile header

```text
[Logo]                                  [Menu]
```

Expanded mobile menu:

```text
- Главная
- Услуги
- Для бизнеса
- Для дома
- Цены
- FAQ
- Контакты
[Оставить заявку]
[Открыть чат]
```

### Header rules

* CTA always visible on desktop
* on mobile CTA should be accessible inside menu
* header should remain light and not too tall
* sticky header recommended if performance remains good

---

## 6. Homepage wireframe

### Homepage layout overview

```text
1. Header
2. Hero
3. Business-first value block
4. Services overview
5. Why AzurSysTech
6. How it works
7. Home users block
8. Pricing from
9. FAQ preview
10. Contact block with form
11. Chat support block / widget access
12. Footer
```

---

## 7. Homepage — section-by-section wireframe

# 7.1 Hero section

### Desktop wireframe

```text
------------------------------------------------------------
| Headline: IT-поддержка и настройка инфраструктуры        |
| для малого бизнеса в Ницце и рядом                       |
|                                                          |
| Subtitle: рабочие станции, Wi-Fi, сеть, принтеры,       |
| базовая IT-среда. Также помощь частным клиентам.         |
|                                                          |
| [Оставить заявку] [Обсудить задачу] [WhatsApp*]          |
|                                                          |
| Small note: Nice + 30 km                                 |
|                                                          |
|                  [visual / illustration]                 |
------------------------------------------------------------
```

### Mobile wireframe

```text
--------------------------------
| Headline                     |
| Subtitle                     |
| [Оставить заявку]            |
| [Открыть чат]                |
| Nice + 30 km                 |
| [visual]                     |
--------------------------------
```

### Hero rules

* business audience must recognize relevance immediately
* CTA visible without scroll
* WhatsApp button should be visible at launch
* chat CTA should complement WhatsApp, not replace it by default

---

# 7.2 Business-first value block

### Purpose

Сразу после hero подтвердить, что сайт ориентирован на малый бизнес.

### Desktop wireframe

```text
------------------------------------------------------------
| Заголовок: Помогаем малому бизнесу быстро наладить IT    |
|                                                          |
| [icon] Рабочие места     [icon] Wi-Fi и сеть            |
| [icon] Принтеры          [icon] Общие папки             |
| [icon] Выезд на место    [icon] Базовая IT-среда        |
|                                                          |
| Text block: для офиса, магазина, кабинета, TPE          |
|                                                          |
| [Оставить заявку для бизнеса] [Получить оценку]         |
------------------------------------------------------------
```

### Mobile wireframe

```text
--------------------------------
| Заголовок                    |
| короткий intro               |
| [card] Рабочие места         |
| [card] Wi-Fi и сеть          |
| [card] Принтеры              |
| [card] Общие папки           |
| [CTA] Заявка для бизнеса     |
--------------------------------
```

### Rules

* keep this section above generic services
* use simple icons
* do not overload with long paragraphs

---

# 7.3 Services overview

### Structure

2 subgroups:

* business
* home users

### Desktop wireframe

```text
------------------------------------------------------------
| Заголовок: Услуги AzurSysTech                            |
|                                                          |
|   Для бизнеса                |   Для частных клиентов    |
| ---------------------------- | ------------------------- |
| [card] Рабочие места         | [card] Ремонт ПК         |
| [card] Wi-Fi / сеть          | [card] Новый компьютер   |
| [card] Принтеры              | [card] Домашний Wi-Fi    |
| [card] Выездная помощь       | [card] Принтер           |
|                                                          |
| [Смотреть все услуги]                                 |
------------------------------------------------------------
```

### Mobile wireframe

```text
--------------------------------
| Услуги AzurSysTech           |
| Для бизнеса                  |
| [card] Рабочие места         |
| [card] Wi-Fi / сеть          |
| [card] Принтеры              |
| [card] Выездная помощь       |
|                              |
| Для дома                     |
| [card] Ремонт ПК             |
| [card] Новый компьютер       |
| [card] Wi-Fi                 |
| [card] Принтер               |
| [Смотреть все услуги]        |
--------------------------------
```

### Rules

* business group first
* max 4 cards per group on homepage
* use separate services page for full details

---

# 7.4 Why AzurSysTech

### Desktop wireframe

```text
------------------------------------------------------------
| Почему AzurSysTech                                       |
|                                                          |
| [icon] Выезд по Nice + 30 km                            |
| [icon] Для бизнеса и частных клиентов                   |
| [icon] ПК, сеть, Wi-Fi, принтеры, рабочие места         |
| [icon] Понятный подход без лишней сложности             |
| [icon] Можно начать с одной задачи                      |
------------------------------------------------------------
```

### Mobile wireframe

```text
--------------------------------
| Почему AzurSysTech           |
| [icon + short text]          |
| [icon + short text]          |
| [icon + short text]          |
| [icon + short text]          |
--------------------------------
```

### Rule

Use trust bullets, not long prose.

---

# 7.5 How it works

### Desktop wireframe

```text
------------------------------------------------------------
| Как проходит работа                                      |
|                                                          |
| 1. Заявка  →  2. Уточнение  →  3. Оценка формата        |
| 4. Выезд / работа  →  5. Понятный результат             |
------------------------------------------------------------
```

### Mobile wireframe

```text
--------------------------------
| Как проходит работа          |
| 1. Оставляете заявку         |
| 2. Уточняем задачу           |
| 3. Понимаем формат           |
| 4. Выполняем работу          |
| 5. Даём понятный результат   |
--------------------------------
```

### Rule

Use simple numbered steps.

---

# 7.6 Home users block

### Purpose

Показать, что сайт не только для бизнеса.

### Desktop wireframe

```text
------------------------------------------------------------
| Помогаем и частным клиентам                              |
|                                                          |
| [card] Новый ПК        [card] Медленный компьютер       |
| [card] Домашний Wi-Fi  [card] Принтер / настройка       |
|                                                          |
| [Оставить заявку для дома]                              |
------------------------------------------------------------
```

### Mobile wireframe

```text
--------------------------------
| Частным клиентам             |
| [card] Новый ПК              |
| [card] Медленный компьютер   |
| [card] Wi-Fi                 |
| [card] Принтер               |
| [CTA] Заявка для дома        |
--------------------------------
```

---

# 7.7 Pricing from section

### Desktop wireframe

```text
------------------------------------------------------------
| Цены от                                                  |
|                                                          |
| [card] Выездная помощь        50 €                      |
| [card] Новый ПК               80 €                      |
| [card] Wi-Fi / принтер        70 €                      |
| [card] Рабочее место          90 €                      |
|                                                          |
| note: точная стоимость зависит от задачи                |
| [Запросить оценку]                                       |
------------------------------------------------------------
```

### Mobile wireframe

```text
--------------------------------
| Цены от                      |
| [card] Выездная помощь 50 €  |
| [card] Новый ПК 80 €         |
| [card] Wi-Fi / принтер 70 €  |
| [card] Рабочее место 90 €    |
| [Запросить оценку]           |
--------------------------------
```

### Rule

Cards should be simple; no huge pricing tables on homepage.

---

# 7.8 FAQ preview

### Desktop wireframe

```text
------------------------------------------------------------
| Частые вопросы                                           |
|                                                          |
| [accordion] Вы работаете только по Ницце?               |
| [accordion] Вы помогаете только бизнесу?                |
| [accordion] Можно ли сначала просто описать задачу?     |
| [accordion] Вы настраиваете Wi-Fi и принтеры?           |
|                                                          |
| [Смотреть все вопросы]                                  |
------------------------------------------------------------
```

### Mobile wireframe

Same structure, full width accordions.

---

# 7.9 Contact block + form

### Purpose

Main conversion zone.

### Desktop wireframe

```text
------------------------------------------------------------
| Связаться с AzurSysTech                                  |
|                                                          |
| Left column:                    | Right column:          |
| - phone: +33 7 49 70 54 65      | [Form title]           |
| - WhatsApp: +33 7 49 70 54 65   | Имя                    |
| - short contact intro           | Телефон                |
| - service area                  | Email                  |
|                                 | Город                  |
|                                 | Кто вы?                |
|                                 | Что нужно сделать?     |
|                                 | Описание задачи        |
|                                 | [Отправить заявку]     |
------------------------------------------------------------
```

### Mobile wireframe

```text
--------------------------------
| Связаться с AzurSysTech       |
| [+33 7 49 70 54 65]           |
| [WhatsApp: +33 7 49 70 54 65] |
| [short intro]                 |
| [form starts]                 |
| Имя                           |
| Телефон                       |
| Email                         |
| Город                         |
| Кто вы?                       |
| Что нужно сделать?            |
| Описание                      |
| [Отправить заявку]            |
--------------------------------
```

### Rules

* form should appear before footer
* no excessive fields visible initially
* branching should happen inside form after segment choice
* strong CTA and reassuring copy

---

# 7.10 Chat support block

### Option A — Dedicated small section above footer

```text
------------------------------------------------------------
| Не знаете, как описать задачу?                           |
| Напишите в чат — помощник задаст несколько вопросов.     |
| [Открыть чат]                                            |
------------------------------------------------------------
```

### Option B — Widget only

No dedicated full section, but widget visible sitewide.

### Recommendation

Use both:

* a short block near contact section
* widget globally available

### Rule

Widget should feel helpful, not pushy.

---

## 8. Business page wireframe

### Route

`/business`

### Goal

Conversion page for TPE / small business.

### Section flow

```text
1. Header
2. Business hero
3. Typical problems
4. What we set up
5. Use cases
6. Offer cards
7. How we work
8. Business FAQ
9. Contact CTA / form
10. Footer
```

### Desktop wireframe summary

```text
------------------------------------------------------------
| Hero: IT-помощь для малого бизнеса                       |
| Subtitle + CTA                                           |
------------------------------------------------------------
| Typical problems grid                                    |
------------------------------------------------------------
| What AzurSysTech can set up                              |
| workstations | wifi | printers | local network           |
------------------------------------------------------------
| Use cases: office / cabinet / shop                       |
------------------------------------------------------------
| Offer cards                                              |
------------------------------------------------------------
| How it works                                             |
------------------------------------------------------------
| Business FAQ                                             |
------------------------------------------------------------
| CTA + form                                               |
------------------------------------------------------------
```

### Mobile rules

* keep cards stacked
* CTA after hero and after offer section
* FAQ accordion
* compact form

---

## 9. Home users page wireframe

### Route

`/home`

### Goal

Simple reassuring page for private clients.

### Section flow

```text
1. Header
2. Hero
3. Typical home problems
4. Services
5. Pricing from
6. FAQ
7. Contact CTA
8. Footer
```

### UX rule

This page should feel lighter and more direct than business page.

---

## 10. Services page wireframe

### Route

`/services`

### Goal

Overview page with all main services.

### Structure

```text
1. Intro
2. Business services
3. Home services
4. Package offers
5. CTA
```

### Wireframe

```text
------------------------------------------------------------
| Intro                                                    |
------------------------------------------------------------
| Для бизнеса                                              |
| [cards]                                                  |
------------------------------------------------------------
| Для дома                                                 |
| [cards]                                                  |
------------------------------------------------------------
| Пакеты / предложения                                     |
------------------------------------------------------------
| CTA to contact                                           |
------------------------------------------------------------
```

---

## 11. Pricing page wireframe

### Route

`/pricing`

### Structure

```text
1. Intro
2. Home pricing cards
3. Business pricing cards
4. Packages
5. Notes on price conditions
6. CTA
```

### Rule

Keep “от” pricing visually clean.

---

## 12. FAQ page wireframe

### Route

`/faq`

### Structure

```text
1. Intro
2. General FAQ
3. Business FAQ
4. Home FAQ
5. Pricing/process FAQ
6. CTA
```

### Suggested desktop layout

Single-column accordion preferred for simplicity.

---

## 13. Contact page wireframe

### Route

`/contact`

### Goal

Dedicated lead capture page.

### Layout

```text
------------------------------------------------------------
| Hero / intro                                             |
------------------------------------------------------------
| Contact options                                          |
| phone | WhatsApp | service area                          |
------------------------------------------------------------
| Main form                                                |
------------------------------------------------------------
| Chat helper block                                        |
------------------------------------------------------------
| Mini FAQ                                                 |
------------------------------------------------------------
```

### Rule

This page is conversion-focused, so keep distractions minimal.

### 13.1 Legal page (`/legal`)

#### Goal

Понятно отдать обязательную правовую информацию без превращения страницы в сложный юридический портал.

#### Layout

```text
------------------------------------------------------------
| Legal info intro                                          |
------------------------------------------------------------
| Company / owner identity block                            |
| Address / contacts                                        |
| Registration / legal references (if applicable)           |
------------------------------------------------------------
| Service scope disclaimer                                  |
------------------------------------------------------------
| Link to privacy policy                                    |
------------------------------------------------------------
```

#### Rule

Simple legal readability first. No marketing overload.

### 13.2 Privacy page (`/privacy`)

#### Goal

Объяснить, какие данные собираются через форму/чат и как они используются.

#### Layout

```text
------------------------------------------------------------
| Privacy intro                                              |
------------------------------------------------------------
| What data we collect (form + chat)                        |
| Why we collect it                                          |
| How long it is retained                                    |
| User rights / contact for data requests                    |
------------------------------------------------------------
| Links to contact and legal pages                           |
------------------------------------------------------------
```

#### Rule

Clear language, structured sections, no legal jargon overload.

### 13.3 Phase 1.5 pages placeholders

Routes from architecture:

- `/about`
- `/thank-you`
- `/chat-intake` (optional fallback)

Wireframe notes:

- `/about`: short founder/service trust page with CTA to contact.
- `/thank-you`: post-submit confirmation + next-step message + return CTA.
- `/chat-intake`: fallback intake page mirroring widget flow if embed fails.

---

## 14. Footer wireframe

### Desktop

```text
------------------------------------------------------------
| AzurSysTech                                              |
| Локальная IT-помощь для бизнеса и дома                   |
| Nice + 30 km                                             |
|                                                          |
| Links: Главная | Услуги | Для бизнеса | Для дома         |
| Цены | FAQ | Контакты | Privacy | Legal                 |
------------------------------------------------------------
```

### Mobile

Stacked footer, concise.

---

## 15. CTA placement map

### Homepage CTA map

* Hero: 2–3 CTA
* Business block: 1–2 CTA
* Services section: 1 CTA
* Pricing section: 1 CTA
* Contact section: form submit + chat entry
* Footer: 1 CTA link

### Business page CTA map

* Hero CTA
* Offer block CTA
* Bottom form CTA

### Home page CTA map

* Hero CTA
* Service CTA
* Contact CTA

---

## 16. Form behavior wireframe notes

### Initial visible fields

* Имя
* Телефон
* Email
* Город
* Кто вы?
* Что нужно сделать?
* Описание задачи

### On segment select = business

Show TPE fields.

### On segment select = home

Show home-user fields.

### UX note

Keep dynamic blocks visually grouped and lightweight.

---

## 17. Chat widget behavior notes

### Widget states

1. minimized
2. opened
3. qualification flow
4. contact handoff
5. success

### Placement

* bottom right on desktop
* bottom right or bottom center on mobile if not intrusive

### Mobile caution

Ensure widget does not block submit button or nav.

---

## 18. Mobile priority wireframes

### Mobile priority order on homepage

1. Hero
2. Business-first block
3. CTA
4. Core services
5. Contact CTA
6. Home users
7. Prices
8. FAQ
9. Form
10. Footer

### Mobile simplification rules

* fewer words per block
* shorter headings
* stacked cards
* no side-by-side text/image dependence
* essential CTA only

---

## 19. Visual system notes for Tech Lead

### Suggested components

* hero block
* service card
* trust bullet block
* CTA block
* pricing card
* FAQ accordion
* lead form
* chat teaser block

### Visual constraints

* soft spacing
* readable text
* simple iconography
* no dashboard-like boxes everywhere
* avoid over-decoration

---

## 20. Wireframe acceptance criteria

Wireframes are valid if:

* homepage clearly prioritizes small business
* private clients still see relevance
* lead capture is obvious
* form and chat fit naturally
* mobile layout remains simple
* there is no structural ambiguity for implementation

---

## 21. Recommended next file to create

After this file, next artifact should be:

`analytics-spec.md`

It must define:

* events
* CTA tracking
* form tracking
* chat tracking
* source attribution
* funnel metrics
