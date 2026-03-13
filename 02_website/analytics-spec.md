# analytics-spec.md
_version: v0.1
_owner: Marketing Lead
_status: draft
_brand: AzurSysTech
_primary_language: ru

---

## 1. Цель документа

Зафиксировать аналитику для MVP-сайта **AzurSysTech**, чтобы Tech Lead мог:

- отслеживать источники заявок
- понимать, какие CTA работают
- видеть, откуда приходят лиды
- измерять конверсию формы и чата
- не перегрузить проект сложной аналитикой на старте

---

## 2. Основной принцип аналитики

### MVP principle
На старте аналитика должна отвечать на простые бизнес-вопросы:

- откуда пришёл человек
- нажал ли он на CTA
- открыл ли форму
- отправил ли заявку
- начал ли чат
- дошёл ли чат до передачи контакта
- какая страница даёт лучший отклик

### What we do NOT need in MVP
- сложные attribution models
- enterprise BI
- десятки кастомных событий без пользы
- перегруженные дашборды
- избыточный трекинг каждого скролла

### What we DO need
- понятные события
- простая воронка
- source attribution
- tracking form + chat + CTA

---

## 3. Business questions analytics must answer

### Core questions
1. Какие каналы приводят посетителей?
2. Какие страницы чаще приводят к заявке?
3. Какие CTA нажимают чаще всего?
4. Сколько людей отправляют форму?
5. Сколько людей начинают чат?
6. Сколько людей доходят до передачи контакта через чат?
7. Бизнес-лиды приходят чаще или частные?
8. С какого канала приходят более качественные заявки?

---

## 4. Recommended MVP stack

### Recommended analytics stack
- **Google Analytics 4**
- optional lightweight event layer via GTM later
- CRM-side lead data from **HubSpot**
- fallback manual review in Google Sheets if needed

### Recommendation
Start with:
- GA4 page tracking
- key CTA click events
- form submit event
- chat open / chat handoff events

This is enough for first traction.

---

## 5. Tracking levels

### Level 1 — Traffic
- page views
- sessions
- source / medium
- landing pages

### Level 2 — Engagement
- CTA clicks
- contact page views
- pricing page views
- business page views
- FAQ page views

### Level 3 — Conversion
- form submission
- chat open
- chat handoff submit
- contact click
- WhatsApp click

### Level 4 — Lead quality
From CRM:
- segment
- source
- service type
- lead status
- qualified / not qualified

---

## 6. Required tracked pages

### Priority pages
- `/`
- `/business`
- `/services`
- `/pricing`
- `/faq`
- `/contact`

### Secondary pages
- `/home`
- `/thank-you`
- `/legal`
- `/privacy`
- `/about` (phase 1.5)
- `/chat-intake` (optional fallback)

### Why these matter
They represent the core conversion path.

---

## 7. Core events list

### Event group A — CTA clicks
Track all major CTA clicks.

#### Events
- `cta_click_hero_primary`
- `cta_click_hero_secondary`
- `cta_click_business_block`
- `cta_click_services_block`
- `cta_click_pricing_block`
- `cta_click_contact_block`
- `cta_click_footer`

### Event group B — form behavior
- `form_view_main`
- `form_start_main`
- `form_submit_main`
- `form_error_main`

### Event group C — chat behavior
- `chat_open`
- `chat_start`
- `chat_step_completed`
- `chat_handoff_view`
- `chat_handoff_submit`

### Event group D — contact method clicks
- `click_phone`
- `click_whatsapp`
- `click_email`
- `click_map` (optional later)

### Event group E — page engagement
- `view_business_page`
- `view_services_page`
- `view_pricing_page`
- `view_contact_page`
- `view_faq_page`

---

## 8. Event naming rules

### Naming style
Use:
- lowercase
- underscore-separated
- clear business meaning
- no random one-off names

### Good examples
- `form_submit_main`
- `chat_open`
- `cta_click_business_block`

### Avoid
- `button1`
- `click_red_btn`
- `test_event_new`
- vague or visual-only names

---

## 9. CTA tracking spec

### Homepage hero
Track:
- primary CTA click
- secondary CTA click
- chat CTA click if present

### Business-first block
Track:
- business CTA click
- estimate CTA click if present

### Services block
Track:
- click to services page
- click from service cards if cards are clickable

### Pricing block
Track:
- estimate CTA click

### Contact section
Track:
- form view
- form submit
- chat open
- phone / WhatsApp clicks

---

## 10. Form tracking spec

### Main events
#### `form_view_main`
Fire when form becomes visible in viewport or page section is clearly loaded.

#### `form_start_main`
Fire when user interacts with first field.

#### `form_submit_main`
Fire on successful submission.

#### `form_error_main`
Fire when validation prevents submission.

### Recommended form parameters
- `page_path`
- `segment_selected` if available
- `service_type_selected` if available
- `source_page`
- `language`

### Important note
Do not send personal data into analytics events.

---

## 11. Chat tracking spec

### Required chat events
#### `chat_open`
When widget is opened.

#### `chat_start`
When user sends first interaction or starts guided flow.

#### `chat_step_completed`
Optional; can count progress milestones.

#### `chat_handoff_view`
When contact capture step is shown.

#### `chat_handoff_submit`
When user submits contact info after chat.

### Recommended chat parameters
- `page_path`
- `segment_guess` if available
- `service_type_guess` if available
- `language`

### Important note
No raw personal message content should be sent to analytics.

---

## 12. Source attribution logic

### Primary goal
Understand where leads come from.

### Expected source buckets
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

### MVP attribution method
Use:
- GA source / medium when available
- UTM tags on links from Facebook and group posts
- CRM source property on lead entry

### Mapping note
If GA source and CRM source differ, CRM source is the lead-level source of truth.

### Recommended UTM examples
#### Facebook Page
`?utm_source=facebook&utm_medium=social&utm_campaign=page_post_[topic]`

#### Facebook Group
`?utm_source=facebook&utm_medium=group&utm_campaign=group_post_[topic]`

#### Messenger
`?utm_source=facebook&utm_medium=messenger&utm_campaign=dm_followup_[topic]`

---

## 13. CRM + analytics relationship

### Analytics is for
- traffic behavior
- CTA performance
- form/chat conversion

### CRM is for
- actual lead records
- qualification
- sales status
- source quality
- segment / service type
- follow-up

### Rule
Do not try to force CRM and analytics into the same role.
They complement each other.

---

## 14. Recommended CRM fields relevant for analytics review

### Useful CRM properties
- lead source
- first landing page
- segment
- service type
- urgency
- city
- lead status
- qualified yes/no
- won/lost

### Why
This allows later manual analysis:
- which source brings better leads
- whether business or home users convert better
- which offers are working

---

## 15. MVP funnel definition

### Funnel A — Form path
```text
Landing page view
  → CTA click
  → form view
  → form start
  → form submit
```

### Funnel B — Chat path

```text
Landing page view
  → chat open
  → chat start
  → handoff view
  → handoff submit
```

### Funnel C — Business intent path

```text
Landing page
  → business page
  → CTA click
  → form submit or chat handoff
```

---

## 16. KPI framework for analytics

### Acquisition KPIs

* sessions
* users
* source / medium
* landing pages
* traffic from Facebook
* traffic from direct/referral

### Engagement KPIs

* CTA click rate
* visits to business page
* visits to contact page
* FAQ views
* pricing page views

### Conversion KPIs

* form submit rate
* chat start rate
* chat handoff completion rate
* landing page to lead rate

### Lead quality KPIs

From CRM:

* % business leads
* % home-user leads
* qualified lead rate
* won lead rate by source

---

## 17. Dashboard recommendations

### MVP dashboard should answer

* how many visitors came
* where they came from
* which page they landed on
* how many clicked CTA
* how many submitted form
* how many used chat

### Recommended minimal dashboard blocks

1. Traffic overview
2. Top landing pages
3. CTA clicks
4. Form submissions
5. Chat conversions
6. Source breakdown

### Rule

Simple > comprehensive

---

## 18. Suggested GA4 custom events priority

### Priority 1 — must have

* `form_submit_main`
* `chat_open`
* `chat_handoff_submit`
* `cta_click_hero_primary`
* `cta_click_business_block`

### Priority 2 — should have

* `form_start_main`
* `cta_click_pricing_block`
* `view_business_page`
* `view_contact_page`

### Priority 3 — optional later

* granular service-card clicks
* FAQ expand tracking
* scroll-depth for specific pages

---

## 19. Privacy and compliance notes

### Important principle

Do not send personal data to analytics.

### Must not send

* phone number
* email
* free-text problem description
* exact address
* personal message body

### Can send

* event name
* page path
* source
* segment type as anonymous category
* service category as anonymous category

### Legal note

Analytics implementation should align with privacy page and cookie/banner logic if applicable.

---

## 20. Recommended implementation order

### Step 1

Install GA4 baseline tracking

### Step 2

Track major page views and CTA clicks

### Step 3

Track main form events

### Step 4

Track chat widget events

### Step 5

Add UTM discipline for Facebook and group links

### Step 6

Review CRM source properties

---

## 21. QA checklist for Tech Lead

### Verify

* page views recorded correctly
* CTA clicks fire once
* form submit event fires only on success
* no duplicate event firing
* chat open/start/handoff events work
* UTM parameters persist where needed
* no personal data leaks into events

### Test pages

* homepage
* business page
* contact page
* pricing page

---

## 22. Suggested event table

| Event name                 | Trigger                 |    Required | Notes                |
| -------------------------- | ----------------------- | ----------: | -------------------- |
| `cta_click_hero_primary`   | main hero CTA click     |         yes | homepage core CTA    |
| `cta_click_business_block` | business section CTA    |         yes | key B2B signal       |
| `form_view_main`           | form visible or loaded  |         yes | conversion step      |
| `form_start_main`          | first field interaction |         yes | friction insight     |
| `form_submit_main`         | successful form submit  |         yes | core conversion      |
| `form_error_main`          | validation error        | recommended | useful for UX fixes  |
| `chat_open`                | widget opened           |         yes | chat entry           |
| `chat_start`               | first chat interaction  | recommended | higher intent        |
| `chat_handoff_view`        | contact capture shown   | recommended | funnel step          |
| `chat_handoff_submit`      | contact handoff success |         yes | core chat conversion |
| `click_phone`              | phone CTA click         |         yes | launch contact CTA   |
| `click_whatsapp`           | WhatsApp click          |         yes | launch contact CTA   |

---

## 23. Success criteria for MVP analytics

Analytics implementation is valid if:

* we can identify top traffic sources
* we can see which pages lead to submissions
* we can compare form vs chat conversions
* we can measure business-page performance
* we can review lead quality with CRM data
* events are simple and reliable

---

## 24. Next file to create

After this file, next artifact should be:

`legal-pages.md`

It must define:

* mentions légales structure
* privacy page structure
* form data notice
* chat data notice
* business identity placeholders
* contact/legal footer requirements
