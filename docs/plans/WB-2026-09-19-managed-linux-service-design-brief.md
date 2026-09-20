# Design brief — Managed Linux Service Landing Page

## Status

UI/UX direction only. This document does not authorize application implementation, source edits, navigation changes, sitemap changes, or deployment.

The implementation agent must use this brief together with:

- `AGENTS.md`;
- `PROJECT_MAP.md`;
- `PRODUCT.md`;
- `docs/specs/WB-2026-09-19-managed-linux-service-landing.md`.

The content specification remains authoritative for wording, commercial scope, prices, SEO requirements, structured data, and acceptance criteria. This brief defines presentation, hierarchy, interaction, responsiveness, and reuse expectations.

## UX objective

The page must help a visitor answer, with minimal effort:

1. What service is being offered?
2. Is it relevant to my type of business or project?
3. What does it cost?
4. What is included in each plan?
5. What is not included?
6. Which Linux environments are supported?
7. Who keeps control of the server?
8. What do I do next?

The page should feel like a practical infrastructure service from a competent specialist, not:

- a generic SaaS pricing template;
- an enterprise managed-services portal;
- a hosting reseller;
- a cybersecurity company making broad guarantees;
- a visually noisy DevOps landing page.

## Existing design system first

Before creating or changing page components, inspect the current AzurSysTech production website and record a short UI inventory.

The inventory must identify:

- existing page/container width patterns;
- typography and heading hierarchy;
- spacing scale;
- buttons and CTA variants;
- cards/panels already in use;
- section backgrounds and separators;
- border radius and shadow conventions;
- icon library and existing infrastructure-related icons;
- responsive breakpoints;
- existing FAQ/accordion patterns;
- any reusable pricing/comparison pattern;
- any reusable step/process pattern.

Implementation should reuse those patterns wherever they are sufficient.

Do not introduce:

- a second component library;
- a second icon set;
- a new typography system;
- a new color system;
- a new animation framework;
- a parallel page-layout abstraction solely for this landing page.

A new component is justified only when the existing project has no suitable primitive.

## Page-level visual hierarchy

The page should use a restrained commercial rhythm:

1. compact hero;
2. factual service summary;
3. concrete service scope;
4. pricing/plans;
5. audience fit;
6. supported environments;
7. operating process;
8. client control / trust;
9. exclusions;
10. FAQ;
11. final CTA.

Pricing should appear early. Do not place a long brand/story section before the plans.

Essential commercial content must remain understandable if styling is removed.

## 1. Hero

### Purpose

Establish service category, audience, starting price, supported stack and next action immediately.

### Layout

Prefer a compact hero rather than a full-viewport or oversized marketing hero.

Desktop may use:

- one primary text column;
- an optional restrained secondary visual/supporting panel only if an existing site pattern makes this natural.

Mobile should collapse to a single logical text flow.

### Required visible elements

- eyebrow;
- single H1;
- lead sentence;
- short supporting paragraph;
- primary CTA: `Request a server audit`;
- secondary CTA: `Compare plans`;
- technology/support line.

### Constraints

- no hero carousel;
- no video background;
- no animated terminal simulation;
- no decorative dashboard screenshot unless a real product dashboard exists;
- no oversized gradients or infrastructure illustration that dominates the copy;
- no claims such as "zero downtime", "fully secure", or "24/7 support".

The H1 and lead must be visible without interaction.

## 2. Service at a glance

### Purpose

Provide machine-readable and human-scannable facts immediately after the hero.

### Presentation

Use a compact grid or definition-list-like visual pattern.

Desktop target: 3 columns × 2 rows or another equally compact existing pattern.

Mobile: simple stacked or 2-column flow depending on current responsive primitives.

Each fact should expose both label and value as real text.

Required facts:

- starting price;
- supported platforms;
- core stack;
- service type;
- 24/7 human SLA boundary;
- infrastructure ownership.

### Constraints

- no tooltip-only definitions;
- no icons without visible labels;
- no horizontal scrolling;
- do not convert this block into six oversized decorative cards.

## 3. What we manage

### Purpose

Explain concrete operational scope before asking the visitor to compare plans.

### Presentation

Use a short intro plus a clear list/grid of infrastructure responsibilities.

Potential grouping, only if it improves scanability:

- Availability & resources
- Security & system
- Web stack
- Backups & database services

Do not invent additional services to fill a grid.

The infrastructure-vs-application scope sentence must be visually noticeable but not styled as an alarming warning.

## 4. Linux VPS management plans

### Purpose

This is the primary commercial decision surface.

### Desktop

Use three aligned plan cards/columns:

1. Monitor — €29
2. Care — €69
3. Managed — €129

Cards must share the same information order:

1. plan name;
2. price;
3. short "best for" description;
4. included features;
5. administration allowance;
6. relevant scope note.

### Mobile

Stack the three plans vertically in the same order.

Do not use:

- horizontal pricing carousel;
- swipe-only navigation;
- tabs hiding two plans;
- modal comparison;
- hover-only detail.

### Visual emphasis

Care may receive **slight** visual emphasis as the middle/general-purpose maintenance tier if this fits the existing design language.

Allowed examples:

- slightly stronger border;
- subtle background contrast;
- small neutral label such as `Routine maintenance`.

Do not use unsupported claims such as:

- `Most popular`;
- `Best seller`;
- `#1 choice`.

All three plans remain equally readable.

### Pricing readability

The price and unit must be visually coupled:

`€69 / server / month`

Avoid making `/ server / month` so small or low-contrast that it becomes effectively hidden.

The included hands-on time is a major scope boundary and must remain visible.

### Pricing notes

Place common pricing notes directly after the cards. Do not hide them in the footer or FAQ.

## 5. Who this service is for

### Purpose

Help visitors self-qualify and strengthen long-tail semantic relevance.

### Presentation

Use four concise persona blocks:

- Small businesses
- Freelance developers
- Web agencies
- Small SaaS teams

These may be compact cards or text columns if an existing component supports them.

Avoid stock-photo personas and generic illustrations.

The section should stay lightweight; it must not visually compete with pricing.

## 6. Supported Linux environments

### Purpose

Make technical fit and boundaries easy to evaluate.

### Presentation

Use two clearly differentiated groups:

**Standard support**

and

**Requires separate review**

A two-column desktop comparison is preferred if it fits existing components.

On mobile, stack Standard support first.

### Tone

`Requires separate review` is a qualification path, not a rejection state.

Do not style it as an error/danger panel unless the existing design system provides no better neutral distinction.

### Database scope

The public PostgreSQL/MySQL summary should be concise.

Do not expose the entire internal DBA boundary as a huge technical matrix unless needed for clarity. The FAQ/exclusions can carry secondary detail.

## 7. How Linux server management works

### Purpose

Show a predictable operating process.

### Presentation

Five steps:

1. Server audit
2. Onboarding
3. Monitoring
4. Maintenance
5. Reporting and escalation

Desktop can use a horizontal step sequence only if it remains readable at ordinary laptop widths.

Otherwise use a vertical sequence.

Mobile should use a simple vertical flow.

Avoid complex animated timelines.

Each step needs:

- visible number or sequence marker;
- H3;
- one short explanatory paragraph.

## 8. You keep control of your infrastructure

### Purpose

Address trust, ownership and lock-in concerns.

### Presentation

This can be a restrained trust panel or normal content section.

The mandatory ownership statement should have clear visual prominence:

`The client keeps ownership and appropriate administrative control of the server.`

Supporting points should remain concrete:

- hosting account ownership;
- admin/root access;
- no mandatory hosting migration;
- no proprietary lock-in;
- documented material changes.

Avoid generic trust badges that are not backed by real certifications.

## 9. What the monthly plans do not include

### Purpose

Prevent scope ambiguity before contact.

### Presentation

Treat this as normal commercial information, not legal fine print.

Use a readable list with a short intro.

It may use a muted contrasting background or panel, but:

- do not reduce font size;
- do not lower contrast;
- do not hide it in an accordion;
- do not place it only in Terms.

The 24/7 human-response SLA boundary must be explicit.

## 10. FAQ

### Purpose

Handle secondary objections and repeat important scope facts in question/answer form.

### Interaction

An accordion is acceptable here because the essential facts already exist elsewhere on the page.

Requirements:

- keyboard accessible;
- visible focus state;
- semantic buttons/headings;
- usable with JavaScript disabled if the existing implementation supports progressive enhancement;
- FAQ answers must exist in rendered HTML and remain consistent with structured data.

If the site has no suitable accessible FAQ component, a simple always-open list is preferable to introducing a complex accordion dependency.

## 11. Final CTA

### Purpose

Convert a qualified visitor into the existing contact/intake flow.

### Content

H2:

`Request a Linux server audit`

Primary CTA:

`Request a server audit`

The final CTA should explain what information to provide:

- VPS provider;
- Linux distribution;
- main services;
- what should be monitored or maintained.

Do not create a new form/backend flow in this Work Block.

## Responsive behavior

### Mobile-first requirements

- preserve the same content order as desktop;
- no horizontal scrolling for pricing or tables;
- pricing cards stack in Monitor → Care → Managed order;
- buttons remain comfortably tappable;
- long technical terms wrap safely;
- no essential information depends on hover;
- section spacing should remain compact enough that the page does not feel excessively long;
- maintain readable line length and body size.

### Desktop requirements

- keep readable content width;
- use whitespace to separate sections rather than excessive decorative containers;
- align pricing cards consistently;
- do not stretch prose across very wide screens.

## Accessibility

Target practical WCAG AA behavior consistent with `PRODUCT.md`.

Required:

- exactly one H1;
- logical H2/H3 order;
- sufficient text/background contrast;
- keyboard-accessible CTA and FAQ interactions;
- visible focus states;
- meaningful link/button labels;
- no color-only distinction between included/excluded/support states;
- icons, if used, should be decorative when redundant or have appropriate accessible names when meaningful;
- respect reduced-motion preferences;
- avoid non-essential motion.

## SEO / AI-readability UI constraints

Presentation must not undermine the content specification.

Essential facts must be ordinary rendered text, including:

- plan names;
- exact prices;
- per-server/per-month unit;
- administration allowances;
- supported distributions;
- 24/7 human-response SLA exclusion;
- infrastructure ownership;
- application-development exclusion.

Do not place essential text only in:

- images;
- SVG paths without text equivalents;
- client-only widgets;
- tooltips;
- hover states;
- carousels;
- collapsed panels;
- CSS-generated content.

Cards should use semantic `article` elements where appropriate.

Use lists for real lists.

Use buttons only for actions and links for navigation.

## Visual tone

The page should feel:

- technical but approachable;
- restrained;
- operational;
- trustworthy;
- clear rather than flashy.

Prefer:

- existing AzurSysTech neutral surfaces;
- existing brand accent;
- subtle borders;
- clear typography;
- small, meaningful infrastructure icons where already supported.

Avoid:

- neon DevOps aesthetics;
- terminal-green-on-black theming;
- excessive code-style typography;
- glowing server illustrations;
- generic cloud-network stock art;
- gratuitous gradients;
- large decorative metric cards;
- "enterprise dashboard" styling for a service that does not expose a dashboard.

## Implementation autonomy

Codex may decide, within the existing design system:

- exact grid classes;
- exact spacing tokens;
- which existing card/container/button primitives to reuse;
- whether the glance section is a grid or definition-list presentation;
- whether the process is horizontal on wide screens or vertical everywhere;
- whether small existing icons improve scanability.

Codex must not independently change:

- commercial copy;
- prices;
- service scope;
- supported/excluded environments;
- route strategy;
- SEO metadata strategy;
- structured-data claims;
- global design system;
- navigation architecture;
- contact backend.

Any such change returns to the Owner/Define stage.

## Pre-implementation UI inventory output

Before implementation, Codex should report a concise inventory in this form:

```text
Reusable:
- container/layout:
- typography:
- buttons:
- cards/panels:
- FAQ:
- icons:
- process/steps:
- responsive patterns:

Missing:
- components that actually need to be created:

Proposed page composition:
- section -> existing/new component mapping
```

This inventory is analysis, not a request for a separate design approval unless it reveals a material conflict with the specification.

## Design acceptance criteria

- UX-001: The page uses the existing AzurSysTech visual language rather than a parallel design system.
- UX-002: Hero is compact and exposes service, audience, starting price and CTA without interaction.
- UX-003: Service-at-a-glance facts are visible as normal text.
- UX-004: Pricing appears high on the page and all three plans are simultaneously readable on desktop.
- UX-005: Mobile pricing uses stacked cards, not horizontal scrolling or a carousel.
- UX-006: Plan price, unit and administration allowance are visually explicit.
- UX-007: No unsupported popularity/best-value claim is used to emphasize a tier.
- UX-008: Supported environments and requires-separate-review environments are clearly distinguishable without color-only meaning.
- UX-009: Exclusions are visible commercial content, not hidden fine print.
- UX-010: Essential content is not hidden behind hover, carousel, modal or client-only interaction.
- UX-011: FAQ interaction, if used, is accessible and preserves rendered question/answer content.
- UX-012: The desktop and mobile content order is semantically consistent.
- UX-013: One H1 and a valid H2/H3 hierarchy are preserved.
- UX-014: Existing buttons, spacing, typography, colors and icon set are reused wherever sufficient.
- UX-015: No new component/design library or animation framework is introduced for this page.
- UX-016: Final CTA reuses the existing contact/intake path.
