# PLAN: AZR-002 Implementation Map

## Objective

Translate the existing documentation set into a concrete build map:
- which markdown files feed which routes;
- which sections belong to each page;
- which reusable components are required for MVP implementation.

This document is implementation-facing. It is not a new strategy document.

## Current Build Gap

Current `web/` runtime has only:
- `/`
- `/health`

Missing from implementation:
- route structure from `02_website/site-architecture.md`
- page composition from `02_website/wireframes.md`
- content mapping from `01_brand/*`
- form and lead-flow integration from `02_website/forms-spec.md` and `03_leads/*`

## MVP Route Map

### Phase 1 Routes

| Route | Priority | Purpose | Main source docs |
|---|---|---|---|
| `/` | P0 | Primary conversion page | `01_brand/homepage-copy.md`, `01_brand/faq.md`, `02_website/site-architecture.md`, `02_website/wireframes.md`, `00_strategy/positioning.md`, `01_brand/brand-pack.md` |
| `/services` | P0 | Service overview, business-first | `02_website/site-architecture.md`, `06_seo/service-pages-plan.md`, `00_strategy/offer-stack.md` |
| `/business` | P0 | TPE conversion page | `02_website/site-architecture.md`, `00_strategy/positioning.md`, `00_strategy/offer-stack.md`, `04_facebook/facebook-strategy.md` |
| `/home` | P1 | Home-user conversion page | `02_website/site-architecture.md`, `00_strategy/positioning.md`, `00_strategy/offer-stack.md` |
| `/pricing` | P1 | Entry pricing and pricing logic | `00_strategy/offer-stack.md`, `00_strategy/pricing-framework.md`, `02_website/site-architecture.md` |
| `/faq` | P1 | Full FAQ page | `01_brand/faq.md` |
| `/contact` | P0 | Main lead capture page | `02_website/forms-spec.md`, `03_leads/lead-intake-spec.md`, `02_website/site-architecture.md` |
| `/legal` | P0 | Legal information | `02_website/legal-pages.md` |
| `/privacy` | P0 | Privacy policy | `02_website/legal-pages.md` |
| `/thank-you` | P1 | Post-submit handoff page | `02_website/site-architecture.md`, `02_website/forms-spec.md`, `03_leads/follow-up-sequences.md` |

### Phase 1.5 / Deferred Routes

| Route | Priority | Purpose | Main source docs |
|---|---|---|---|
| `/about` | P2 | Trust / founder page | `01_brand/brand-pack.md`, `02_website/site-architecture.md` |
| `/chat-intake` | P2 | fallback handoff route for chat | `05_ai/lead-agent-spec.md`, `02_website/site-architecture.md` |
| `/services/new-pc-setup` | P2 | SEO/service landing | `06_seo/service-pages-plan.md` |
| `/services/wifi-printer` | P2 | SEO/service landing | `06_seo/service-pages-plan.md` |
| `/services/tpe-setup` | P2 | SEO/service landing | `06_seo/service-pages-plan.md` |
| `/services/onsite-support` | P2 | SEO/service landing | `06_seo/service-pages-plan.md` |

## Page-to-Section Map

### `/`

Sections:
1. header
2. hero
3. business-first value block
4. services overview
5. why AzurSysTech
6. how it works
7. home users block
8. prices from
9. FAQ preview
10. contact form block
11. chat entry block
12. footer

Primary source docs:
- `01_brand/homepage-copy.md`
- `01_brand/faq.md`
- `02_website/wireframes.md`
- `02_website/site-architecture.md`

### `/services`

Sections:
1. page hero
2. business services group
3. home services group
4. packaged offers
5. CTA / contact block
6. FAQ mini-block

Primary source docs:
- `00_strategy/offer-stack.md`
- `02_website/site-architecture.md`
- `06_seo/service-pages-plan.md`

### `/business`

Sections:
1. business hero
2. typical business problems
3. what AzurSysTech sets up
4. use cases
5. offer blocks
6. how we work
7. contact / form CTA
8. business FAQ

Primary source docs:
- `00_strategy/positioning.md`
- `00_strategy/offer-stack.md`
- `02_website/site-architecture.md`

### `/home`

Sections:
1. home-user hero
2. typical problems
3. main services
4. prices from
5. request help flow
6. FAQ
7. CTA

Primary source docs:
- `00_strategy/positioning.md`
- `00_strategy/offer-stack.md`
- `02_website/site-architecture.md`

### `/pricing`

Sections:
1. intro
2. entry pricing blocks
3. pricing logic / "a partir de"
4. business quote note
5. CTA block

Primary source docs:
- `00_strategy/offer-stack.md`
- `00_strategy/pricing-framework.md`

### `/faq`

Sections:
1. page intro
2. grouped FAQ list
3. CTA block

Primary source docs:
- `01_brand/faq.md`

### `/contact`

Sections:
1. contact hero
2. contact methods
3. main lead form
4. WhatsApp / phone quick actions
5. service area note
6. trust / response expectation note

Primary source docs:
- `02_website/forms-spec.md`
- `03_leads/lead-intake-spec.md`
- `03_leads/response-templates.md`

### `/legal` and `/privacy`

Sections:
1. legal identity
2. hosting data
3. publication responsibility
4. privacy/data processing
5. contact for data requests

Primary source docs:
- `02_website/legal-pages.md`

## Reusable Component Inventory

### Layout

- `SiteHeader`
- `MobileNav`
- `SiteFooter`
- `PageHero`
- `SectionShell`
- `CTAButtons`

### Conversion / content

- `BusinessValueGrid`
- `ServicesSplitGrid`
- `TrustReasons`
- `HowItWorks`
- `PriceCards`
- `FaqList`
- `ContactStrip`
- `ChatEntryCard`

### Lead capture

- `MainLeadForm`
- `SegmentSwitcher`
- `BusinessFields`
- `HomeFields`
- `ContactMethods`
- `ThankYouState`

### Legal / utility

- `LegalBlock`
- `PrivacyBlock`
- `Breadcrumbs` (optional for Phase 1)

## Data / Form Contract Map

### Form implementation source

Canonical sources:
- `02_website/forms-spec.md`
- `03_leads/lead-intake-spec.md`
- `03_leads/lead-taxonomy.md`
- `02_website/analytics-spec.md`

### Required submission payload areas

- contact identity
- segment
- service type
- problem description
- urgency
- location
- optional business block
- optional home-user block
- source tagging

### Post-submit states

- success -> `/thank-you`
- handoff format aligned with `03_leads/*`
- analytics events aligned with `02_website/analytics-spec.md`

## Component-to-Doc Mapping

| Component | Main docs |
|---|---|
| `SiteHeader` | `02_website/site-architecture.md`, `02_website/wireframes.md` |
| `PageHero` | `01_brand/homepage-copy.md`, `00_strategy/positioning.md` |
| `ServicesSplitGrid` | `00_strategy/offer-stack.md`, `02_website/site-architecture.md` |
| `FaqList` | `01_brand/faq.md` |
| `MainLeadForm` | `02_website/forms-spec.md`, `03_leads/lead-intake-spec.md` |
| `ContactMethods` | `02_website/site-architecture.md`, `02_website/legal-pages.md`, `06_seo/gbp-setup-checklist.md` |
| `ChatEntryCard` | `05_ai/lead-agent-spec.md`, `05_ai/approval-workflow.md` |
| `LegalBlock` | `02_website/legal-pages.md` |

## Recommended Build Order

1. App shell
- layout
- header
- footer
- nav

2. Homepage
- hero
- business-first sections
- services overview
- FAQ preview
- contact CTA

3. Contact / form flow
- main form
- validation
- thank-you page

4. Legal pages
- `/legal`
- `/privacy`

5. Supporting conversion pages
- `/services`
- `/business`
- `/home`
- `/pricing`
- `/faq`

6. Chat entry placeholder
- visible CTA and handoff entry
- no autonomous outbound behavior

## Explicit Non-Goals for This Map

- no visual design system expansion beyond MVP shell
- no advanced CMS
- no advanced AI orchestration
- no autonomous outbound messaging
- no SEO long-tail page production in phase 1

## Definition of Ready for Coding

- route list is fixed for phase 1
- source docs per route are explicit
- reusable component list is explicit
- form contract has a single source path
- Tech Lead can split implementation into concrete frontend tasks without reopening strategy
