# OpenDesign handoff — Atelier Rivage

## Stage 0 preflight

- Work Block type: visual design prototype and handoff
- Side-effect class: local documentation now; bounded local template creation
  later by the Owner-authorized OpenDesign Coder
- DB action mode: none
- Skills routing: checked=design-direction, impeccable/craft, frontend-skill,
  active Work Block gates; matched=design-direction, impeccable/craft,
  frontend-skill; used=all three; skipped=Playwright because browser
  verification belongs to the later Verifier stage
- Subagent topology: Product, Architecture, and Design Analysts plus Critic
  completed read-only discovery; one OpenDesign Coder may create the template
  only in the approved paths; an independent Verifier follows later
- Hard Stops: none in this stage; no deploy, commit, push, external messaging,
  secrets, or data writes
- Write gate: READY for this handoff, `DESIGN.md`, the Owner-authorized
  OpenDesign template, and one Scoped Coder's non-destructive acceptance repair
  within the exact paths below. Application integration and destructive cleanup
  remain blocked pending visual handoff approval and explicit deletion approval.

## Assignment

Create an editable visual template for the bilingual public real-estate demo
**Atelier Rivage**. The working product is a calm Mediterranean agency
showcase, not a listing marketplace, CRM, or luxury-beige template.

The template may be created directly in the target demo folders after this
brief is accepted. It is a design-prototype handoff, not permission to
integrate backend behavior, external services, or publish anything.

## Required read set

- `AGENTS.md`
- `showcase/package.json`
- `showcase/app/demo/bijoux-artisanaux/` for the current Next.js route pattern
- `showcase/app/demo/immobilier/DESIGN.md`

## Approved design scope

Design and, if needed for the editable OpenDesign template, create files only
under these new paths:

- `showcase/app/demo/immobilier/**`
- `showcase/components/immobilier/**`
- `showcase/public/demo/immobilier/**`

Build the following public experience in French and English:

1. Home: image-led hero, selected properties, agency approach, agent/contact
   close.
2. Property catalogue with sale/rent filtering and a composed empty state.
3. Property detail with gallery, facts, description, agent contact panel, and
   related properties.
4. Buy and rent entry pages that are distinct catalogue presets, not duplicate
   landing pages.
5. Agency page and contact page.

The intended public URL family is `/demo/immobilier/fr/...` and
`/demo/immobilier/en/...`. The root `/demo/immobilier` should lead visitors to
French. This describes the information architecture only; it does not grant
permission to change routes outside the approved target path.

## Visual contract

- Brand name: **Atelier Rivage**.
- Mood: precise, composed Mediterranean architecture and evening coastal
  light; trustworthy editorial portfolio rather than a high-volume portal.
- Palette: deep ink or blue-green, cool off-white, mineral grey-blue, and one
  restrained terracotta accent for primary actions and statuses.
- Reject: warm beige and brass luxury tropes, gold, gradients, generic
  three-card feature rows, house-logo clichés, dashboard-like density, and
  generic AI copy.
- Typography: a distinctive display face for the wordmark and large headings;
  one highly legible sans-serif for interface and bilingual copy. Do not add
  Inter, Outfit, Plus Jakarta Sans, or a third font family.
- Composition: the hero must fit the initial viewport and show a clear primary
  action. Use image-led, asymmetric composition and generous deliberate space.
  The catalogue should read as a curated property sequence, not as a dense
  commodity grid.

## Content and interaction boundaries

- Use six realistic local listings: three for sale and three for rent, across
  Nice, Antibes, Cannes, Valbonne, Mougins, and Villefranche-sur-Mer.
- Translate navigation, filters, statuses, labels, form feedback, metadata,
  and image alt text fully for French and English.
- Filters, gallery, menu, language switcher, and form feedback are local UI
  interactions. The contact or viewing form must prevent native submission and
  show local validation/success feedback only.
- Support keyboard navigation, visible focus, Escape in the gallery, reduced
  motion, and a mobile composition that keeps image, price, and key facts
  first.
- Use only original local assets. Do not use external image URLs or remote
  embeds.

## Explicitly out of scope

- Existing `showcase/app/demo/comptabilite/**`
- `web/**` integration, portfolio routes, sitemap, root layout, global config,
  dependencies, and generated build output
- API, database, authentication, Telegram, Hermes, CRM, real messages, real
  listing publication, analytics, deployment, commit, and push
- The future article about automating listing publication

## Expected handoff

Return the editable template plus a short inventory of created files, local
assets, target routes, unresolved visual decisions, and checks run. Do not
commit or push. If a required change falls outside the approved paths, stop and
report it instead of widening the scope.
