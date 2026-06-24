# Demo Templates Strategy

Status: draft strategy  
Source context: `08_showcase/shablons.md`, `02_website/demo-templates-plan.md`, `02_website/templates/*.md`  
Scope: AzurSysTech website demo/showcase planning  
Last reviewed: 2026-05-31

## Purpose

The demo templates are not just six visually different website mockups. They are a product-positioning tool for AzurSysTech.

Their job is to show six different business scenarios where a website becomes a working business instrument:

- capturing a request;
- guiding a visitor to the right action;
- qualifying an inquiry;
- collecting initial information through a form or chat;
- preparing a summary for the business owner or specialist;
- becoming expandable with AI assistant and intake automation.

Core idea:

> AzurSysTech builds websites around how a business actually works: requests, bookings, reservations, catalogs, lead qualification, client intake, and first-contact automation.

## Demo Block Positioning

The demo block must answer the client's practical question:

> If I have a similar business, what exactly will this website do for me?

Each template must therefore show both:

- visual direction;
- business function.

Use careful language. The demos should not imply that every template is a complete ready-made SaaS product.

Allowed positioning:

- can be extended;
- can be adapted;
- can be connected;
- can support a process;
- can be linked to a form, CRM, Telegram, WhatsApp, email, or internal workflow.

Avoid:

- fully automated out of the box;
- replaces the administrator or specialist;
- guarantees leads, sales, timings, or prices;
- provides professional advice without human review.

## Why Six Templates

The six-template set covers different models of small and professional business:

1. local service;
2. booking-based service;
3. restaurant / cafe;
4. mini-catalog / e-commerce light;
5. B2B lead generation;
6. professional service / client intake.

This prevents the showcase from becoming six same-looking landing pages with different colors. It demonstrates different ways a website can support business operations.

## Template Set

| Template | Site Type | Main Business Function |
| --- | --- | --- |
| Plomberie Pro | Local service landing | Urgent request, visit qualification, service area |
| Salon Beaute | Booking site | Service selection and booking request |
| Le Bistrot | Menu, reservation, order site | Menu, table reservation, common questions |
| Bijoux Artisanaux | Mini-catalog / e-commerce light | Product catalog, inquiry, custom request |
| Agent d'Assurance | B2B lead generation site | Lead qualification and consultation request |
| Cabinet Comptable | Professional service + client intake | Client intake, document checklist, specialist handoff |

## 1. Plomberie Pro

Type: local service landing.

Target client: plumber, electrician, repair technician, local field-service company.

Business goal: quickly convert a visitor into a clear service request.

What the site demonstrates:

- strong first screen;
- service list;
- service area;
- urgent request;
- trust block;
- FAQ;
- contact / WhatsApp / phone CTA.

Automation angle: urgent request and visit qualification.

The assistant or form can:

- identify the problem type;
- classify urgency;
- help prepare a short request;
- ask for a photo through an approved form/channel if appropriate;
- prepare a summary for the technician.

Human responsibility remains:

- price;
- appointment confirmation;
- technical diagnosis;
- final service decision.

Recommended demo format: one-page landing.

## 2. Salon Beaute

Type: booking site.

Target client: beauty salon, specialist, wellness office, small appointment-based service.

Business goal: present services and move the visitor toward a booking request.

What the site demonstrates:

- services;
- prices from;
- specialist/team;
- gallery;
- booking CTA;
- booking form;
- WhatsApp or reminder flow as a future module.

Automation angle: service selection and booking request preparation.

The assistant or form can:

- help choose a service category;
- ask for a preferred date/time;
- gather booking preferences;
- prepare a request for the administrator;
- later connect to calendar logic.

Human responsibility remains:

- final slot confirmation;
- schedule changes;
- service result;
- special cases and pricing where diagnosis is required.

Recommended demo format: one-page in v1, optionally extended with a `/booking` page.

## 3. Le Bistrot

Type: menu, reservation, and order site.

Target client: cafe, restaurant, bistro, food service, small local venue.

Business goal: show menu, atmosphere, opening hours, and help visitors submit a reservation or inquiry.

What the site demonstrates:

- venue atmosphere;
- popular dishes;
- menu preview;
- reservation request;
- opening hours;
- address/map;
- FAQ for allergens, groups, events.

Automation angle: reservation, menu questions, and common inquiries.

The assistant or form can:

- collect reservation requests;
- ask for date, time, guest count, and contact;
- route menu questions separately from reservation requests;
- answer safe common questions;
- prepare a summary for staff.

Human responsibility remains:

- table availability;
- reservation confirmation;
- menu accuracy;
- allergen-sensitive answers requiring staff review.

Recommended demo format: 2-3 page mini-site:

- `/` for atmosphere, hero, popular dishes, reservation CTA;
- `/menu` for menu;
- `/reservation` for reservation request.

## 4. Bijoux Artisanaux

Type: mini-catalog / e-commerce light.

Target client: handmade brand, jewelry maker, artisan shop, small product business.

Business goal: show products and convert interest into an inquiry, order request, or custom-order request without heavy e-commerce in v1.

What the site demonstrates:

- brand story;
- collections;
- catalog;
- product cards;
- availability inquiry;
- custom request;
- Instagram / WhatsApp as optional integrations.

Automation angle: product selection and inquiry.

The assistant or form can:

- help select by style, budget, or occasion;
- prepare a product inquiry;
- gather custom-order parameters;
- ask about size, material, color, and preferences;
- prepare a summary for the maker/seller.

Human responsibility remains:

- stock confirmation;
- final price;
- production timeline;
- payment;
- delivery;
- custom feasibility.

Recommended demo format: mini-catalog:

- `/` for brand, collections, featured products;
- `/catalogue` for catalog;
- `/product/[slug]` for product page;
- `/custom-order` for individual request.

## 5. Agent d'Assurance

Type: B2B lead generation site.

Target client: insurance agent, consultant, broker, independent B2B specialist.

Business goal: collect a qualified consultation request, not just a vague message.

What the site demonstrates:

- service directions;
- client segments;
- trust-building content;
- FAQ;
- qualification form;
- consultation CTA.

Automation angle: lead qualification.

The assistant or form can:

- identify client type;
- identify service direction;
- collect current situation and urgency;
- distinguish private vs business request;
- prepare a summary for the specialist;
- suggest the next review step.

Human responsibility remains:

- professional advice;
- legal, financial, or insurance conclusions;
- pricing and terms;
- accepting the client;
- commercial offer.

Recommended demo format: multi-page lead-generation site:

- `/` for positioning and CTA;
- `/services` for service directions;
- `/brief` or `/devis` for qualification;
- `/faq` for common questions.

## 6. Cabinet Comptable

Type: professional service + client intake.

Target client: accountant, lawyer, consultant, administrative office, professional cabinet.

Business goal: explain services, collect structured initial context, and prepare the client for the next step.

What the site demonstrates:

- service structure;
- working process;
- intake form;
- document checklist;
- FAQ;
- consultation request;
- AI assistant / brief helper as a future module.

Automation angle: client intake and documents.

The assistant or form can:

- identify request type;
- gather basic context;
- prepare a document checklist;
- separate simple vs complex requests;
- prepare a summary for the specialist;
- hand the request into a working process.

Human responsibility remains:

- professional assessment;
- legal, tax, or accounting advice;
- official documents;
- commercial terms;
- sensitive document handling;
- client acceptance.

Recommended demo format: professional intake mini-site:

- `/` for cabinet overview and main services;
- `/services` for services;
- `/intake` for client intake;
- `/documents` for document checklist;
- `/faq` for common questions.

## Card Labels And Badges

Each demo card should show both the niche and the solution type.

French labels:

- `Landing service local`
- `Site avec reservation`
- `Menu & commande`
- `Catalogue / e-commerce light`
- `Lead generation B2B`
- `Client intake / cabinet pro`

Russian labels:

- `Лендинг для локальной услуги`
- `Сайт с онлайн-записью`
- `Сайт с меню и заказом`
- `Мини-каталог / легкий e-commerce`
- `B2B-сайт для сбора лидов`
- `Сайт кабинета с intake-формой`

Automation badges:

- `Chat + formulaire` / `Чат + форма`
- `Qualification` / `Квалификация заявки`
- `Reservation` / `Онлайн-запись`
- `Demande urgente` / `Срочная заявка`
- `Catalogue assiste` / `Подбор товара`
- `Intake client` / `Клиентский intake`

## Suggested Demo Section Copy

French/RU implementation can adapt this message:

> Каждый demo-шаблон показывает не только внешний вид сайта, но и бизнес-сценарий: заявка, запись, бронь, каталог, квалификация лида или клиентский intake. Такой сайт можно начать как простую страницу и затем расширять формами, чат-помощником и автоматизацией.

## Implementation Phases

### Phase 1: Preview + Homepage

For each template:

- card on the main site;
- one demo homepage;
- clear primary CTA;
- automation angle section;
- mobile-first layout.

This is enough to explain the direction without overbuilding.

### Phase 2: Internal Pages For Complex Demos

Add internal pages gradually:

- Le Bistrot: `/menu`, `/reservation`;
- Bijoux Artisanaux: `/catalogue`, `/product/[slug]`, `/custom-order`;
- Agent d'Assurance: `/services`, `/brief` or `/devis`, `/faq`;
- Cabinet Comptable: `/services`, `/intake`, `/documents`, `/faq`.

### Phase 3: AI / Intake Modules

After base demos exist, show optional automation:

- chat assistant;
- request form;
- brief helper;
- owner summary;
- CRM, Telegram, WhatsApp, or email integration.

This automation should be framed as an extension, not as a built-in function of every template.

## Quality Rules

Each demo must:

- have a distinct business scenario, not just a color theme;
- answer "what does this website do for the business?";
- have one primary CTA;
- show at least 3-5 key sections;
- be mobile-first;
- avoid fake promises about prices, timelines, guarantees, or automation out of the box;
- stay connected to AzurSysTech's product strategy.

## Recommended Work Order

1. Keep this strategy as the tracked planning source.
2. Use the ignored `02_website/templates/*.md` files as working briefs.
3. Start with `Plomberie Pro` because it is the clearest local-service use case.
4. Move from simple to complex:
   - `Salon Beaute`;
   - `Le Bistrot`;
   - `Bijoux Artisanaux`;
   - `Agent d'Assurance`;
   - `Cabinet Comptable`.

Reason: moving from one-page to multi-page and intake-heavy demos gives better scope control and component reuse.

## Current Context From Ignored Working Docs

`02_website/demo-templates-plan.md` already defines the same six-template strategy in draft form.

The six template briefs are present:

- `02_website/templates/plomberie-pro.md`
- `02_website/templates/salon-beaute.md`
- `02_website/templates/le-bistrot.md`
- `02_website/templates/bijoux-artisanaux.md`
- `02_website/templates/agent-assurance.md`
- `02_website/templates/cabinet-comptable.md`

Important alignment notes:

- `Bijoux Artisanaux`, `Agent d'Assurance`, and `Cabinet Comptable` are already framed as multi-page demos.
- `Le Bistrot` should likely become a 2-3 page mini-site.
- `Plomberie Pro` is suitable as a one-page landing.
- `Salon Beaute` can start as one-page and later gain a booking page.
- `site-architecture.md` and `analytics-spec.md` now reference `/#services`, not a separate `/services` page.

## Key Takeaway

The six demo templates are a showcase of AzurSysTech's product thinking.

They should prove that AzurSysTech can build websites that:

- look professional;
- fit the business type;
- guide a visitor toward a useful action;
- can be extended with forms, chat assistants, and intake automation;
- help business owners receive clearer and more structured inquiries.
