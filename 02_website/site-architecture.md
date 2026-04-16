# site-architecture.md
_version: v0.1
_owner: Marketing Lead
_status: approved architecture baseline
_brand: AzurSysTech
_primary_language: ru
_future_languages:
  - fr
  - en

---

## 1. Цель документа

Зафиксировать архитектуру сайта **azursystech.fr** для MVP, чтобы Tech Lead мог:

- спроектировать структуру страниц
- выстроить навигацию
- подготовить сайт к локализации
- учесть форму, CRM и чат с ИИ-агентом
- сделать сайт под приоритет: **получить первые заявки**

---

## 2. Архитектурный принцип

### Основной принцип
Сайт должен быть:
- простым
- понятным
- быстрым
- ориентированным на лиды
- локальным по восприятию
- пригодным для дальнейшего роста

### Что не делаем в MVP
- сложный каталог услуг на 30 страниц
- тяжёлый блог
- перегруженную “корпоративную” структуру
- сложный личный кабинет
- глубокую SEO-архитектуру с первого дня

### Что делаем в MVP
- чёткая главная
- понятные услуги
- отдельный акцент на малый бизнес
- форма заявки
- место под AI chat widget
- базовые юридические страницы
- архитектура, готовая к локализации

---

## 3. MVP sitemap

### Required pages
1. `/` — Главная
2. `/services` — Услуги
3. `/business` — Для малого бизнеса
4. `/home` — Для частных клиентов
5. `/pricing` — Цены
6. `/faq` — Частые вопросы
7. `/contact` — Контакты / заявка
8. `/legal` — Правовая информация
9. `/privacy` — Политика конфиденциальности

### Recommended pages for phase 1.5
10. `/about` — О проекте / кто стоит за AzurSysTech
11. `/thank-you` — Страница после отправки заявки
12. `/chat-intake` — optional fallback page for chat handoff, if widget needs support

### Recommended pages for phase 2
13. `/services/new-pc-setup`
14. `/services/wifi-printer`
15. `/services/tpe-setup`
16. `/services/onsite-support`
17. localized routes later

---

## 4. Navigation structure

### Primary nav
- Главная
- Услуги
- Для бизнеса
- Для дома
- Цены
- FAQ
- Контакты

### Secondary / footer nav
- О нас
- Политика конфиденциальности
- Правовая информация
- Контакты

### CTA in header
Primary CTA:
- **Оставить заявку**

Secondary CTA:
- **Открыть чат**
- **WhatsApp**

---

## 5. Information hierarchy

### Priority order for visitor understanding
1. кто вы и чем помогаете
2. что основной акцент — малый бизнес
3. что вы также помогаете частным клиентам
4. где работаете
5. как связаться
6. сколько это стоит “от”
7. почему вам можно доверять

### Business priority rule
На всех ключевых точках сайта блоки для бизнеса должны быть видны раньше, чем блоки для частных клиентов.

---

## 6. Homepage architecture

### Route
`/`

### Goal
Быстро объяснить оффер и дать несколько путей конверсии.

### Homepage blocks
1. Header
2. Hero
3. Business-first offer block
4. Services overview
5. Why AzurSysTech
6. How it works
7. Home users block
8. Prices from
9. FAQ preview
10. Contact section
11. Embedded AI chat entry point
12. Footer

### Above-the-fold requirements
Must show:
- кто вы
- кому помогаете
- география
- минимум 2 CTA
- business relevance

### CTA placement
- hero
- business section
- services section
- pricing section
- contact section
- sticky mobile CTA optional

---

## 7. Services page architecture

### Route
`/services`

### Goal
Дать полный, но не перегруженный обзор услуг.

### Structure
1. Intro
2. Services for business
3. Services for home users
4. Packaged offers
5. How to contact
6. FAQ mini-block
7. CTA section

### Services grouping
#### Group A — Business
- рабочие места
- Wi-Fi / локальная сеть
- принтеры
- общие папки
- выездная IT-помощь
- базовая настройка IT-среды

#### Group B — Home
- настройка ПК
- новый компьютер
- Wi-Fi
- принтер
- диагностика
- оптимизация / апгрейд

### UX rule
Business services go first.

---

## 8. Business page architecture

### Route
`/business`

### Goal
Сделать отдельную strong page под малый бизнес и TPE.

### Audience
- TPE
- petites entreprises
- shops
- cabinets
- freelancers with office setup
- small teams

### Structure
1. Hero for business
2. Typical business problems
3. What AzurSysTech can set up
4. Use cases
5. Offer blocks
6. “How we work”
7. CTA form / contact
8. FAQ for business

### Messaging rule
This page should feel:
- practical
- local
- simple
- non-corporate
- useful for small organizations

### Suggested goal
This page can become one of the main conversion pages.

---

## 9. Home users page architecture

### Route
`/home`

### Goal
Собрать бытовые и home-office задачи в отдельную понятную страницу.

### Structure
1. Hero
2. Typical home user cases
3. Main services
4. Pricing from
5. How to request help
6. FAQ for home users
7. CTA

### Rule
This page must be simpler and more reassuring than the business page.

---

## 10. Pricing page architecture

### Route
`/pricing`

### Goal
Показать ориентиры “от”, не обещая фиксированную стоимость для всех случаев.

### Structure
1. Intro
2. Pricing cards for home users
3. Pricing cards for business
4. Packages
5. What affects price
6. CTA for estimate

### Pricing display style
Use:
- “от”
- “по запросу”
- “зависит от объёма задачи”
- “после краткого описания”

### Rule
Avoid giant pricing table with edge cases.

---

## 11. FAQ page architecture

### Route
`/faq`

### Goal
Снять сомнения и помочь пользователю перейти к заявке.

### Structure
1. Intro
2. General questions
3. Pricing and process
4. Business FAQ
5. Home users FAQ
6. Contact CTA

### Rule
Make FAQ scannable with accordion or anchor navigation.

---

## 12. Contact page architecture

### Route
`/contact`

### Goal
Дать максимально понятный способ оставить заявку.

### Structure
1. Intro
2. Contact options
3. Main lead form
4. Service area
5. Chat helper block
6. FAQ mini-block

### Contact methods
- phone: `+33 7 80 72 09 94`
- WhatsApp: `+33 7 80 72 09 94`
- main lead form
- embedded AI chat widget

### Important note
Phone and WhatsApp are available at launch and should be reflected in the contact layer without placeholder fallback.

---

## 13. Legal page architecture

### Route
`/legal`

### Content
- site owner details
- business identity
- SIREN / legal data when ready
- hosting details
- contact details
- consumer mediation info when applicable

### Note
Content to be finalized later, but route/page must exist in MVP.

---

## 14. Privacy page architecture

### Route
`/privacy`

### Content
- what data is collected
- why it is collected
- how form/chat data is used
- contact rights
- retention logic
- cookie/analytics note if used

### Note
Must align with forms and chat collection.

---

## 15. Footer architecture

### Footer must include
- short brand description
- service area
- navigation links
- legal links
- contact CTA
- phone / WhatsApp contact actions in launch contact layer

### Suggested footer text
AzurSysTech — локальная IT-помощь для малого бизнеса и частных клиентов в Ницце и рядом.

---

## 16. Header architecture

### Header must include
- logo / brand
- primary nav
- main CTA button

### On mobile
- compact nav
- visible CTA
- chat access should remain easy

### Sticky header
Recommended if kept lightweight.

---

## 17. Chat widget architecture

### Chat type
Embedded widget

### Chat placement rules
- visible on homepage
- visible on business page
- visible on contact page
- visible on services page
- optionally minimized by default

### Widget role
- guided intake
- qualification
- route to contact capture
- prepare lead summary

### Widget must NOT
- dominate page visually
- block content aggressively
- feel spammy or intrusive

---

## 18. Form architecture

### Main form placement
- homepage contact block
- dedicated contact page
- optional business page CTA block

### Recommended reuse model
One main reusable form component with:
- conditional branching
- CRM integration
- localization support

---

## 19. Content model architecture

### Content types needed
- page content
- service blocks
- FAQ items
- trust blocks
- CTA blocks
- pricing entries
- contact texts
- legal content

### Architecture rule
Content should be separated from layout as much as possible to support:
- localization
- future edits
- reuse across pages

---

## 20. Localization readiness

### Launch language
Russian

### Future languages
- French
- English
- German (optional later)

### Routing recommendation
Use localization-ready architecture from day one.

Recommended future model:
- `/ru/...`
- `/fr/...`
- `/en/...`

For MVP:
- public site launches in Russian for the russophone audience on the Côte d'Azur
- French and English are planned as phase 2 public languages
- German is optional phase 3 only if there is real demand
- route structure and content system must support later language expansion

### Tech requirement
- no hardcoded text deep inside components
- externalized content keys or structured content files
- forms, CTA, FAQ, legal text must be translatable

---

## 21. SEO architecture (MVP level)

### Initial SEO focus
- brand discoverability
- local service relevance
- clean page titles
- good structure
- future-ready service pages

### MVP priority pages for discoverability
- homepage
- business page
- services page
- contact page

### Phase 2 SEO opportunities
- pages for Wi-Fi / printers / new PC / TPE setup
- French localized pages
- local service pages

---

## 22. URL strategy

### MVP routes
- `/`
- `/services`
- `/business`
- `/home`
- `/pricing`
- `/faq`
- `/contact`
- `/legal`
- `/privacy`

### Future service URLs
- `/services/new-pc-setup`
- `/services/wifi-printer`
- `/services/tpe-setup`
- `/services/onsite-support`

### URL rule
Use short, readable, scalable slugs.

---

## 23. Page template system

### Templates recommended
1. Homepage template
2. Standard content page template
3. Service page template
4. FAQ template
5. Contact/lead page template
6. Legal template

### Benefit
Keeps implementation clean and scalable.

---

## 24. Conversion architecture

### Main conversion points
- header CTA
- hero CTA
- business section CTA
- pricing CTA
- contact form
- AI chat widget
- footer CTA

### Conversion paths
#### Path A
Homepage → form → CRM

#### Path B
Homepage → chat → handoff → CRM

#### Path C
Facebook → homepage/contact → form/chat → CRM

#### Path D
Business page → form → CRM

### Rule
Never rely on only one conversion path.

---

## 25. Analytics architecture (MVP)

### Must track
- page views
- CTA clicks
- form submits
- chat starts
- chat handoffs
- lead source if possible

### Event examples
- `cta_click_hero`
- `cta_click_business`
- `form_submit_main`
- `chat_open`
- `chat_handoff_submit`

---

## 26. Performance and UX rules

### Site must be
- mobile-first
- fast
- lightweight
- readable
- not visually overloaded

### Avoid
- too many animations
- heavy sliders
- over-complicated hero
- giant walls of text

### UX priority
Fast comprehension > visual complexity

---

## 27. Recommended build priority

### Phase 1
- homepage
- contact page
- services page
- business page
- legal/privacy pages
- form
- chat placeholder/widget area

### Phase 2
- FAQ page
- pricing page
- home users page
- about page

### Phase 3
- service-specific pages
- localization
- richer SEO content

---

## 28. Acceptance criteria

Site architecture is valid if:
- main offer is understandable in under 10 seconds
- business audience sees itself first
- home users are also clearly supported
- contact paths are visible and repeated
- architecture supports Russian now and FR/EN later
- chat and form fit naturally into the site
- legal/privacy pages exist in MVP

---

## 29. Suggested next implementation order for Tech Lead

1. create page shell structure
2. build reusable layout
3. implement homepage
4. implement main form
5. implement contact page
6. add chat widget area
7. implement business page
8. add services/pricing/faq pages
9. add localization-ready content system

---

## Current status

Downstream sequencing is now managed through `docs/specs`, `docs/plans`, `docs/tasklist`, and `memory_bank/*`.
