# legal-pages.md
_version: v0.1
_owner: Marketing Lead
_status: working legal baseline
_brand: AzurSysTech
_primary_language: ru
_note: final legal wording must be reviewed and completed with real business data before publication

---

## 1. Цель документа

Зафиксировать структуру юридических страниц и обязательных правовых блоков для сайта **AzurSysTech**, чтобы Tech Lead мог:

- создать страницы `/legal` и `/privacy`
- правильно встроить правовые блоки в footer и формы
- предусмотреть placeholders для реальных реквизитов
- не блокировать запуск дизайна и структуры сайта
- оставить всё готовым для последующего юридического заполнения

---

## 2. Общий принцип

### Важно
Этот документ **не заменяет юридическую проверку**.

Он нужен для того, чтобы:
- архитектура сайта была готова
- обязательные секции были предусмотрены
- тексты форм и чата не противоречили общей логике обработки данных
- Tech Lead не строил legal pages вслепую

### Rule
На этапе MVP допускаются:
- placeholders
- структура страниц
- черновые блоки
- ссылка на будущую финализацию

Но перед публичным запуском страницы должны быть заполнены реальными данными.

---

## 3. Required legal routes

### Required pages
- `/legal`
- `/privacy`

### Optional later
- `/cookies`
- `/terms`
- `/consumer-mediation`

### MVP rule
For launch, minimum required public legal pages:
- legal information page
- privacy page

---

## 4. Legal information page purpose

### Route
`/legal`

### Goal
Показать:
- кто владелец сайта
- кто управляет деятельностью
- как связаться
- кто хостит сайт
- какие есть юридические данные бизнеса
- какие данные нужно добавить позже

### Public-facing role
Это не маркетинговая страница.
Она должна быть:
- простой
- структурированной
- официальной
- без лишнего текста

---

## 5. Privacy page purpose

### Route
`/privacy`

### Goal
Объяснить:
- какие данные собираются
- зачем они собираются
- через какие каналы
- как используются данные формы и чата
- как связаться по вопросам данных
- какие права есть у пользователя

### Public-facing role
Понятная и спокойная страница, без перегруза юридическим языком там, где можно объяснить проще.

---

## 6. Legal page structure

### Recommended structure for `/legal`

1. Заголовок
2. Идентификация сайта
3. Идентификация владельца / бизнеса
4. Контактные данные
5. Хостинг
6. Интеллектуальная собственность
7. Ограничение ответственности
8. Внешние ссылки
9. Применимое право / служебный блок
10. Placeholders for missing legal fields

---

## 7. Legal page content blocks

# 7.1 Page title
**Правовая информация**

# 7.2 Website identification
### Suggested block
Сайт: **azursystech.fr**  
Бренд: **AzurSysTech**

### Fields to include
- domain
- public brand name
- site purpose

---

# 7.3 Business identity block

### Title
**Информация о владельце сайта**

### Fields (launch baseline)
- ФИО / название бизнеса: `OLEINIK DMITRII`
- Статус: `Entrepreneur individuel - micro-entrepreneur`
- SIREN / SIRET: `SIREN 940 870 140 / SIRET 940 870 140 00016`
- Adresse professionnelle: `9 AV EMMANUEL BRIDAULT, 06000 NICE`
- Email: `contact@azursystech.fr`
- Téléphone: `+33 7 80 72 09 94`

### Note for Tech Lead
Business identity and contact values above are now fixed for launch baseline.
Remaining legal work is in wording polish and final publishability review, not in placeholder replacement.

---

# 7.4 Hosting block

### Title
**Хостинг**

### Fields
- Название хостинг-провайдера: `Hetzner Online GmbH`
- Адрес хостинг-провайдера: `Industriestr. 25, 91710 Gunzenhausen, Germany`
- Контакт / сайт хостинга: `https://www.hetzner.com`

---

# 7.5 Intellectual property block

### Suggested text draft
Все тексты, структура сайта, визуальные элементы, логотип, графика и иные материалы сайта AzurSysTech защищены в рамках применимого права. Любое копирование, воспроизведение или использование материалов без предварительного разрешения запрещено, кроме случаев, прямо допускаемых законом.

### Tone note
This should remain formal and concise.

---

# 7.6 Liability block

### Suggested text draft
AzurSysTech стремится предоставлять актуальную и точную информацию на сайте. Однако информация размещается в ознакомительных целях и может обновляться. Владелец сайта не несёт ответственности за прямые или косвенные последствия использования информации сайта без дополнительного подтверждения, если иное не предусмотрено законом.

### Important note
Do not overcomplicate this paragraph.

---

# 7.7 External links block

### Suggested text draft
Сайт может содержать ссылки на внешние ресурсы. AzurSysTech не несёт ответственности за содержание внешних сайтов, доступных по этим ссылкам.

---

# 7.8 Applicable law / site use block

### Suggested block
Сайт регулируется применимым правом Франции. Использование сайта означает согласие пользователя с действующей структурой правовой информации и политикой конфиденциальности.

### Note
This block should remain concise and publishable.

---

## 8. Privacy page structure

### Recommended structure for `/privacy`

1. Заголовок
2. Краткое объяснение
3. Какие данные собираются
4. Через какие каналы данные собираются
5. Зачем данные собираются
6. Правовое основание / operational basis
7. Как данные используются
8. Срок хранения
9. Передача третьим сторонам / tools
10. Права пользователя
11. Контакт по вопросам данных
12. Cookies / analytics note
13. AI chat note
14. Form submission note

---

## 9. Privacy page content blocks

# 9.1 Page title
**Политика конфиденциальности**

# 9.2 Short intro
### Suggested text
AzurSysTech уважает конфиденциальность пользователей сайта. Эта страница объясняет, какие данные могут собираться через сайт, форму заявки и чат, а также как эти данные используются для связи по вашему запросу и организации работы сервиса.

---

# 9.3 What data is collected

### Title
**Какие данные могут собираться**

### Suggested list
Через сайт могут собираться:
- имя
- телефон
- email
- город
- тип обращения (частный клиент / бизнес)
- описание задачи
- количество устройств
- данные, которые пользователь сам сообщает через форму или чат

### Note
No unnecessary categories should be listed.

---

# 9.4 Collection channels

### Title
**Через какие каналы собираются данные**

### Suggested list
Данные могут поступать через:
- форму на сайте
- чат-помощник
- будущие контактные кнопки (например, телефон / WhatsApp)
- технические инструменты аналитики сайта
- CRM / систему учёта заявок

---

# 9.5 Why data is collected

### Title
**Для чего собираются данные**

### Suggested list
Данные используются для:
- ответа на заявку
- уточнения задачи
- организации выезда
- подготовки дальнейшего контакта
- ведения заявок и истории общения
- улучшения качества обработки обращений

### Rule
Keep purpose tied to service delivery and communication.

---

# 9.6 Legal/operational basis

### Title
**Основание обработки**

### Suggested text
Данные обрабатываются в объёме, необходимом для ответа на запрос пользователя, организации связи, ведения заявки и выполнения услуг AzurSysTech, в пределах, допустимых применимым правом.

---

# 9.7 Use of submitted data

### Title
**Как используются данные**

### Suggested text
Данные из формы и чата используются для первичной квалификации обращения, связи с пользователем, оценки формата работ и ведения заявки в рабочей системе AzurSysTech.

---

# 9.8 Storage / retention

### Title
**Срок хранения данных**

### Suggested text
Данные хранятся столько, сколько это необходимо для обработки обращения, дальнейшей коммуникации, выполнения услуг и соблюдения применимых требований по хранению информации.

---

# 9.9 Third-party tools block

### Title
**Используемые инструменты**

### Suggested text
Для обработки заявок и анализа работы сайта могут использоваться сторонние инструменты, например:
- CRM
- аналитика сайта
- формы
- чат-модуль

### Current expected tools
- HubSpot CRM
- Google Analytics 4
- chat widget if enabled in production

### Important note
Final list should match actual production tools only.

---

# 9.10 User rights block

### Title
**Ваши права**

### Suggested text
Пользователь может запросить уточнение по своим данным, а также обратиться по вопросам, связанным с обработкой персональной информации, через контактные данные, указанные на сайте.

### Placeholder note
Detailed rights wording may be expanded later.

---

# 9.11 Contact for data/privacy questions

### Title
**Контакт по вопросам данных**

### Fields
- Email: `contact@azursystech.fr`
- Additional contact if needed: `WhatsApp: +33 7 80 72 09 94`

---

# 9.12 Analytics / cookies note

### Title
**Аналитика сайта**

### Suggested text
Сайт может использовать инструменты аналитики для понимания того, какие страницы посещают пользователи и какие действия совершаются на сайте. Такие данные используются в агрегированном виде для улучшения структуры сайта и качества сервиса.

### Rule
Do not mention tools not actually installed.

---

# 9.13 AI chat note

### Title
**Чат-помощник**

### Suggested text
Если пользователь взаимодействует с чат-помощником, переданная информация может использоваться для подготовки краткого описания обращения и последующей связи по заявке. Чат не является самостоятельным механизмом заключения сделки и не даёт окончательных ценовых или юридических обещаний.

### Important product note
This text should align with real chat behavior.

---

# 9.14 Forms note

### Title
**Формы заявки**

### Suggested text
При отправке формы пользователь передаёт только те данные, которые необходимы для связи, первичной оценки задачи и организации дальнейшего взаимодействия.

---

## 10. Footer legal requirements

### Footer must contain links to
- `/legal`
- `/privacy`

### Footer optional later
- `/cookies`
- consumer mediation page if needed

### Footer microcopy
Suggested footer legal line:
**Используя сайт, вы можете ознакомиться с правовой информацией и политикой конфиденциальности.**

---

## 11. Form legal notice

### Placement
Near submit button on main form.

### Suggested MVP wording
**Отправляя заявку, вы соглашаетесь с обработкой данных для связи по вашему запросу.**

### Optional extended wording
**Отправляя заявку, вы соглашаетесь с обработкой указанных данных для связи по вашему обращению и организации дальнейшего взаимодействия.**

### Rule
Short notice on form, detailed explanation on privacy page.

---

## 12. Chat legal notice

### Placement
Inside or near chat widget entry / handoff step.

### Suggested wording
**Информация, переданная через чат, используется для подготовки и обработки вашего обращения.**

### Handoff step wording
**Оставляя контакты после чата, вы соглашаетесь на обработку данных для связи по вашему запросу.**

---

## 13. Contact page legal note

### Suggested short block
Отправляя данные через форму или чат, вы передаёте информацию только для обработки вашего обращения и обратной связи.

---

## 14. Placeholder checklist before launch

Before public launch, these fields must be completed:

### Business identity
- full legal name
- business status
- SIREN / SIRET
- business address
- contact email
- phone number

### Technical/legal
- hosting provider name
- hosting provider address
- actual analytics tools
- actual CRM tools
- actual chat tool

### Privacy
- final retention wording
- actual contact for data questions
- final wording aligned to deployed tools

---

## 15. Implementation notes for Tech Lead

### Must do
- create `/legal` and `/privacy`
- expose links in footer
- support placeholders
- make legal content easy to edit
- ensure form notice and chat notice are visible
- keep pages lightweight and readable

### Avoid
- baking legal text into hardcoded component internals
- scattering legal text across many files without structure
- publishing empty fields without visible placeholder handling

---

## 16. UX rules for legal pages

### Legal pages should be
- clean
- text-focused
- readable
- narrow width
- with clear headings
- with enough spacing between sections

### Avoid
- dense wall-of-text layout
- too many columns
- small font
- cluttered card UI

---

## 17. Acceptance criteria

Legal pages setup is valid if:
- `/legal` and `/privacy` exist
- footer links to them
- form notice exists
- chat notice exists
- placeholders for business identity are prepared
- final content can be updated without rebuilding architecture
- pages are readable and not visually overloaded

---

## Current status

Downstream sequencing is now managed through `docs/specs`, `docs/plans`, `docs/tasklist`, and `memory_bank/*`.
