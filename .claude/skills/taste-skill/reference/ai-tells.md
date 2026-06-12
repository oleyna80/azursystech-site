# AI Tells — Forbidden Patterns

Avoid these signatures unless the brief explicitly asks for them. This is the complete catalog from Section 9 of the main SKILL.md.

## 9.A Visual & CSS
- **NO neon / outer glows** by default. Use inner borders or subtle tinted shadows.
- **NO pure black (`#000000`).** Off-black, zinc-950, or charcoal.
- **NO oversaturated accents.** Desaturate to blend with neutrals.
- **NO excessive gradient text** for large headers.
- **NO custom mouse cursors.** Outdated, accessibility-hostile, perf-hostile.

## 9.B Typography
- **AVOID Inter as default.** See Section 4.1. Override path exists.
- **NO oversized H1s** that just scream. Control hierarchy with weight + color, not raw scale.
- **Serif constraints:** Serif for editorial / luxury / publication. Not for dashboards.

## 9.C Layout & Spacing
- **Mathematically perfect** padding and margins. No floating elements with awkward gaps.
- **NO 3-column equal feature cards.** Use 2-column zig-zag, asymmetric grid, scroll-pinned, or horizontal-scroll alternative.

## 9.D Content & Data ("Jane Doe" Effect)
- **NO generic names.** "John Doe", "Sarah Chan", "Jack Su" → use creative, realistic, locale-appropriate names.
- **NO generic avatars.** No SVG "egg" or Lucide user icons → use believable photo placeholders or specific styling.
- **NO fake-perfect numbers.** Avoid `99.99%`, `50%`, `1234567`. Use organic, messy data (`47.2%`, `+1 (312) 847-1928`).
- **NO startup-slop brand names.** "Acme", "Nexus", "SmartFlow", "Cloudly" → invent contextual, premium names that sound real.
- **NO filler verbs.** "Elevate", "Seamless", "Unleash", "Next-Gen", "Revolutionize" → concrete verbs only.

## 9.E External Resources & Components
- **NO hand-rolled SVG icons.** Use Phosphor / HugeIcons / Radix / Tabler. Lucide on explicit request only.
- **Hand-rolled decorative SVGs strongly discouraged** as default.
- **NO div-based fake screenshots.** Never build a fake product UI out of `<div>` rectangles.
- **NO broken Unsplash links.** Use `https://picsum.photos/seed/{descriptive-string}/{w}/{h}`.
- **shadcn/ui customization:** Allowed, but NEVER in default state.

## 9.F Production-Test Tells (banned outright)

### Hero & top-of-page
- **NO version labels in the hero.** `V0.6`, `v2.0`, `BETA`, `INVITE-ONLY PREVIEW`, `EARLY ACCESS`, `ALPHA` — banned as default eyebrows.
- **NO "Brand · No. 01"-style sub-eyebrows.** "Marrow · No. 01 · The 6-quart" type micro-meta lines. Skip them.

### Section numbering & micro-labels
- **NO section-number eyebrows.** `00 / INDEX`, `001 · Capabilities`, `002 · Featured commission`, `06 · how it works`.
- **NO `01 / 4`-style pagination on images or bento tiles.**
- **NO `Scroll · 001 Capabilities`-style scroll cues.**
- **NO "Index of Work, 2018 - 2026"-style range labels** as eyebrows.

### Separators & dots
- **The middle-dot (`·`) is rationed.** Maximum 1 per line in metadata strips.
- **NO decorative colored status dots on every list/nav/badge.**

### Em-dashes & typography flourishes
- **NO em-dash (`—`) as a design element OR anywhere else.** See Section 9.G for the complete ban.
- **NO `<br>`-broken-and-italicized headlines** as a default "design move."
- **NO vertical rotated text** ("INDEX OF WORK, 2018 - 2026" rotated 90°).
- **NO crosshair / hairline grid lines as decoration.**

### Fake product previews
- **NO div-based fake product UI in the hero** (fake task list, fake terminal, fake dashboard built from styled divs).
- **NO fake version footers** ("v0.6.2-rc.1", "last sync 4s ago · main") inside fake screenshots.

### Marketing-copy Tells
- **NO "Quietly in use at" / "Quietly trusted by"** social-proof headers.
- **NO "From the field" / "Field notes" / "Currently on the bench" / "On our desks" / "Loose plates" style poetic labels.**
- **NO "We respect the French ones"-style** mock-humble industry-references.
- **NO weather / locale strips** ("LIS 14:23 · 18°C") in headers/footers.
- **NO micro-meta-sentences under eyebrows.**
- **NO generic step labels.** "Stage 1 / Stage 2 / Stage 3", "Step 1 / Step 2 / Step 3", "Phase 01 / Phase 02 / Phase 03".

### Pills, labels and version stamps
- **NO pills/labels/tags overlaid on images.** No `<span>` overlays on photos.
- **NO photo-credit captions as decoration.** `Field study no. 12 · Ines Caetano`, `Plate 03 · House archive`.
- **NO version footers on marketing pages.** `v1.4.2`, `Build 0048`.
- **NO "Reservation 412 of 800"-style live-stock counters** as decoration.

### Decoration text strips
- **NO decoration text strip at hero bottom.** `BRAND. MOTION. SPATIAL.`, `TYPE / FORM / MOTION`, `DESIGN · BUILD · SHIP`.
- **NO floating top-right sub-text in section headings.**

### Lists, dividers and scoring
- **NO `border-t` + `border-b` on every row of a long list / spec table.**
- **NO scoring/progress bars with filled background tracks** as comparison visuals.

### Locale, time, scroll cues
- **Locale / city-name / time / weather strips are banned for 99% of briefs.**
- **Scroll cues are banned.** `Scroll`, `↓ scroll`, `Scroll to explore`.
- **ZERO decorative status dots by default.**

## 9.G EM-DASH BAN (the single most-violated Tell)

**Em-dash (`—`) is COMPLETELY banned.** It is the LLM's signature stylistic crutch.

- **Banned in headlines.** Use a period or a comma.
- **Banned in eyebrows / labels / pills / button text / image captions / nav items.**
- **Banned in body copy.** Restructure the sentence.
- **Banned in quote attribution.** Use a normal hyphen with spaces (` - `).
- **Banned in en-dash form too (`–`) when used as a separator.**

The ONLY permitted dash characters on the page are:
- Regular hyphen `-` (for compound words, ranges, line dividers in markup)
- Minus sign in math (`-5°C`)

If your output contains a single `—` or `–` anywhere visible to the user, the output fails the Pre-Flight Check and must be rewritten.
