# content-engine-spec.md
_version: v0.1
_owner: Marketing Lead
_status: working runtime spec
_brand: AzurSysTech
_primary_language: ru

---

## 1. Цель документа

Описать AI content engine для **AzurSysTech**, чтобы Tech Lead мог реализовать систему, которая:

- помогает регулярно выпускать контент без перегруза
- поддерживает Facebook Page и группы
- позже может поддерживать сайт и Google Business Profile
- не публикует ничего автоматически без одобрения
- переиспользует одну идею в несколько форматов

---

## 2. Основной принцип

### Core principle
AI content engine для AzurSysTech — это не “автогенератор ради количества”, а:

- помощник по упаковке идей
- ускоритель черновиков
- система repurposing
- редакторский конвейер с human approval

### Main rule
Контент должен рождаться из:
- реальных услуг
- типовых проблем клиентов
- локального контекста
- практических кейсов
- часто задаваемых вопросов

А не из:
- абстрактных IT-тем
- слишком общих “полезных статей”
- нерелевантных трендов
- AI-стиля ради AI-стиля

---

## 3. Роль content engine в системе

### What the engine should do
- превращать темы в черновики постов
- адаптировать один сюжет под разные форматы
- делать короткие версии для групп
- делать FAQ-style версии
- делать CTA-ready версии
- поддерживать регулярность без ручного написания всего с нуля

### What the engine should NOT do
- публиковать без одобрения
- писать слишком “умно”
- выглядеть как контент-машина без живого бизнеса
- генерировать long-form SEO контент в MVP без запроса
- выдумывать кейсы или обещания

---

## 4. Content engine scope for MVP

### Included in MVP
- Facebook Page posts
- short group-post drafts
- short service blurbs
- FAQ-style mini posts
- trust/local presence posts
- educational light posts
- business use-case posts

### Not included in MVP by default
- long blog articles
- video scripts
- email campaigns
- advanced SEO article clusters
- ad variants at scale
- multilingual auto-publishing

---

## 5. Input sources for content engine

### Primary content inputs
1. `offer-stack.md`
2. `homepage-copy.md`
3. `facebook-page-copy.md`
4. `faq.md`
5. `ads-copy.md`
6. `target-audience.md`
7. real-world founder notes
8. future customer questions
9. future case notes from interventions

### Why important
Контент должен рождаться из уже утверждённого positioning и offer stack, а не из случайных prompt inputs.

---

## 6. Content idea sources

### Content can start from:
- услуга
- проблема
- сегмент
- FAQ
- кейс
- локальный контекст
- сезонная ситуация
- повторяющийся вопрос
- pain point from DM/chat/form

### Example idea seeds
- новый ПК для бизнеса
- Wi-Fi нестабилен
- в маленьком офисе нет IT
- принтер не подключается
- медленный компьютер
- домашний рабочий уголок
- 2–3 рабочих места в кабинете

---

## 7. Supported content types

### Type A — Service post
Пост о конкретной услуге.

### Type B — Pain-based post
Пост, начинающийся с типовой боли клиента.

### Type C — Business use-case post
Сценарий для TPE / малого офиса / кабинета / магазина.

### Type D — Educational light post
Очень простое объяснение полезной темы.

### Type E — FAQ-style post
Один вопрос и короткий ответ.

### Type F — Local trust post
Где работаем, как проходит заявка, кому помогаем, что удобно.

### Type G — Repurposed short group post
Короткая адаптация большого поста для групп.

---

## 8. Content engine outputs

### Required outputs for MVP
- full Facebook post draft
- short Facebook post draft
- group-safe short post
- FAQ-style version
- 1-line service blurb
- CTA variants
- optional pinned post update draft

### Output packaging
For each content item, engine should ideally output:
- title / hook
- main body
- CTA
- optional short version
- optional group version

---

## 9. Content generation workflow

### Workflow
```text
Input topic
  → identify segment
  → choose content type
  → build angle
  → generate draft
  → shorten / simplify
  → add CTA
  → optional repurpose variants
  → human review
  → publish manually
```

### Rule

No direct autopublish in MVP.

---

## 10. Topic → angle mapping

### If topic = service

Angle:

* what it solves
* for whom
* practical outcome

### If topic = pain point

Angle:

* recognizable situation
* why it matters
* how AzurSysTech helps
* CTA

### If topic = business scenario

Angle:

* office/cabinet/shop use case
* small scale relevance
* practical setup
* no-corporate tone

### If topic = FAQ

Angle:

* one frequent question
* simple answer
* no over-explanation

---

## 11. Segment-aware content logic

### For TPE / small business

Content should emphasize:

* workstations
* Wi-Fi
* printers
* local network
* small office setup
* no in-house IT
* practical onsite help

### For home users

Content should emphasize:

* new PC
* slow computer
* home Wi-Fi
* printer
* simple setup
* home-office practicality

### Rule

Engine must know which segment is primary for each post.

---

## 12. Tone and style rules

### Tone

* practical
* local
* calm
* clear
* not flashy
* not overly technical

### Style rules

* short paragraphs
* readable flow
* one clear idea per post
* one CTA per post
* no jargon overload
* no startup-style hype
* no “AI-sounding” verbosity

### Avoid

* “digital transformation”
* “innovative platform”
* “cutting-edge solutions”
* overly corporate tone
* overly geeky explanations

---

## 13. Content quality rules

### Every generated draft should:

* be understandable quickly
* mention a real problem or real service
* feel relevant to Nice + 30 km context
* support business-first positioning when relevant
* contain a simple CTA
* sound like a local specialist, not an agency machine

### Draft should not:

* invent customer stories as facts
* promise exact results
* promise timelines
* mention services outside confirmed scope
* sound too broad or generic

---

## 14. Required metadata for each generated draft

### Recommended internal metadata

* `content_topic`
* `content_type`
* `primary_segment`
* `secondary_segment` (optional)
* `channel`
* `cta_type`
* `review_status`
* `source_seed`

### Why useful

This helps:

* organize content
* repurpose later
* debug AI outputs
* build a library of approved patterns

---

## 15. Repurposing logic

### One strong idea should become:

* 1 main page post
* 1 short group-safe version
* 1 FAQ-style variation
* 1–2 short blurbs
* 1 short DM/comment-support line if useful

### Example

Topic:
**Новый ПК**

Repurpose into:

* full page post
* short group post
* FAQ: “Вы настраиваете новый компьютер?”
* ad blurb
* CTA line for future use

### Why

Repurposing gives more output with less decision fatigue.

---

## 16. Content production modes

### Mode 1 — Manual trigger

Founder or operator selects:

* topic
* audience
* content type

Then engine drafts.

### Mode 2 — Batch planning

Engine produces:

* 4–8 draft ideas for next month
* grouped by pillar / segment

### Mode 3 — Repurpose mode

Engine takes approved full post and outputs:

* short post
* group post
* FAQ version
* blurb

### Recommended MVP mode

Start with:

* Mode 1
* and simple Mode 3

---

## 17. Human review path

### Required review before publish

Every output must pass:

1. relevance check
2. tone check
3. promise/risk check
4. CTA check

### Reviewer should check

* does this sound local?
* is the service clear?
* is the segment obvious?
* is the CTA simple?
* does it sound too long / too AI?
* is anything overpromised?

### Workflow state

* `draft_generated`
* `needs_review`
* `approved`
* `published`
* `needs_rewrite`

---

## 18. Content calendar integration

### Content engine should support

* weekly topic selection
* monthly batch idea generation
* content pillar balancing
* business/home balance
* tracking of already-used themes

### Minimum useful planning outputs

* week
* theme
* segment
* format
* CTA
* status

### Example calendar fields

* date_week
* content_topic
* content_type
* segment
* channel
* status
* notes

---

## 19. Suggested content generation prompts structure

### Prompt inputs should include

* target segment
* topic
* content type
* desired CTA
* tone constraints
* forbidden language
* local context
* approved service scope

### Prompt must reference

* AzurSysTech positioning
* business-first strategy
* Nice + 30 km geography
* simple practical tone

### Prompt must avoid

* open-ended “write a great post”
* unguided generation without constraints
* no segment info
* no CTA info

---

## 20. Risk controls

### Must block or rewrite if draft:

* sounds too generic
* sounds too corporate
* sounds too salesy
* uses heavy technical jargon
* includes unsupported offers
* implies guaranteed result
* implies fixed pricing or timing
* invents testimonials or case studies

### Escalate if needed

If draft touches:

* legal issues
* pricing commitments
* complaints
* guarantees
* out-of-scope business complexity

Follow `approval-workflow.md` and `escalation-rules.md`.

---

## 21. Content engine success metrics

### Useful metrics

* number of usable drafts generated
* approval rate
* rewrite rate
* time saved vs manual writing
* post engagement
* posts leading to messages or site visits
* which topic categories lead to best responses

### Main KPI at MVP

Not volume.
Main KPI = **approved useful content that supports lead generation**.

---

## 22. Logging and auditability

### Recommended logging fields

* generation date
* topic
* type
* segment
* prompt version
* draft output
* review result
* final edited version
* publish date
* notes

### Why

Позже это поможет:

* улучшать prompts
* видеть лучшие patterns
* строить reusable prompt library
* fine-tune workflow

---

## 23. Implementation guidance for Tech Lead

### Must support

* topic input
* segment selection
* content type selection
* CTA selection
* multi-output generation
* review state
* repurpose mode

### Nice to have later

* draft queue
* content calendar integration
* “generate 3 variants”
* best-performing topic memory
* multilingual output mode later

### MVP recommendation

Keep architecture modular and simple.

---

## 24. Acceptance criteria

Content engine spec is valid if:

* it supports AzurSysTech’s actual channels
* it can generate practical drafts, not fluff
* it supports business-first positioning
* it includes repurposing logic
* it requires human review before publishing
* Tech Lead can build it without ambiguity

---

## Current status

Downstream sequencing is now managed through `docs/specs`, `docs/plans`, `docs/tasklist`, and `memory_bank/*`.
