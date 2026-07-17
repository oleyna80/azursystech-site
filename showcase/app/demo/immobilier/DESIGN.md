# Atelier Rivage — Design direction

Status: visual source of truth for the OpenDesign prototype. Implementation is
not yet approved by this document alone.

## Product frame

Atelier Rivage is a bilingual French Riviera real-estate agency demo. It should
feel like a trusted, attentive selection of homes for a visitor choosing a
place on the coast, not like a CRM or a high-volume property portal.

The public demo supports French and English equally. The future workflow for
automating listing publication is intentionally excluded and will be described
in a separate article.

## Design read

Reading this as: an editorial, image-led public agency site for a discerning
French Riviera buyer or tenant, with an architectural Mediterranean language
and low-noise, task-focused interactions.

Design dials:

- variance: 7/10 — asymmetric but calm
- motion: 4/10 — restrained, purposeful reveals and feedback only
- density: 4/10 — curated information with space for photographs

## Brand system

The wordmark is **Atelier Rivage**. It may use a small abstract horizon or
coastline motif, but not a house, key, roofline, or generic property icon.

Use a deep ink/blue-green as the dominant structural colour, a cool off-white
as the page ground, mineral grey-blue for secondary planes, and a controlled
terracotta accent. Avoid warm beige, brass, gold, purple glow, gradient text,
and ornamental luxury cues.

Use at most two type families: an expressive display face for the wordmark and
major headings, plus a neutral readable sans-serif for body copy, labels, and
facts. The interface must remain readable in both French and English.

## Page hierarchy

### Home

An initial-viewport hero uses one strong local architectural photograph,
left-aligned title and concise promise, and distinct routes to properties for
sale and rent. The remainder introduces selected properties, the agency's
method, a named agent, and a contact close. Do not use a generic row of equal
feature cards.

### Catalogue

Filters are compact and clear. Results use large editorial image rows or a
sparse grid, with price, place, floor area, rooms, and sale/rent status readable
at a glance. An empty-filter state guides the visitor back to the catalogue
without generic error language.

### Property detail

Start with a real gallery. On desktop, pair the story and property facts with a
stable contact panel containing price and named agent. On mobile, preserve the
order: image, price, key facts, then the contact action. Include related
properties and an understated locality illustration or map-like asset.

### Buy, rent, agency, and contact

Buy and rent are catalogue variants with their own introduction, not duplicate
home pages. The agency page is photographic and concise. Contact is a local
demo form with labels, clear validation, and accessible success feedback; it
never sends or persists data.

## Content model

Show six local listings: three sales and three rentals. Properties should make
the locations feel concrete: Nice, Antibes, Cannes, Valbonne, Mougins, and
Villefranche-sur-Mer. Every public string, state, status, image alt text, and
metadata item has French and English copy.

## Interaction and accessibility

- Navigation and language controls have clear accessible names and visible
  keyboard focus.
- Gallery supports keyboard controls and Escape.
- Filters have an explicit reset and an intentional empty state.
- Form submission is intercepted locally; its errors and success are announced
  accessibly.
- Motion communicates hierarchy or feedback, uses only safe visual properties,
  and is disabled or simplified under `prefers-reduced-motion`.
- Maintain WCAG AA contrast and touch-friendly controls.

## Asset direction

Use original local bitmap assets only. Required imagery is a hero, six property
images, an agency or agent image, and one quiet locality/map-like visual. Keep
the light, palette, and location consistent across the set; never replace these
with decorative CSS panels or remote image links.

## Non-goals

No external data source, API, database, Telegram, Hermes, CRM, authentication,
real publication workflow, remote form delivery, analytics, or deployment.
