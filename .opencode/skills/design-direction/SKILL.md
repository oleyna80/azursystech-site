---
name: design-direction
description: Consolidated UI/UX design skill merging taste (landing pages), Emil's polish, theme presets, frontend quality, brutalism, minimalism, and redesign strategies. Use for visual direction, style selection, component polish, typography, color, motion, or design audits.
user-invocable: true
allowed-tools:
  - Read
  - Bash(git *)
  - Bash(ls *)
  - Bash(find *)
  - Bash(grep *)
  - Bash(cat *)
  - Bash(rg *)
  - Bash(jq *)
  - Bash(node .agent/skills/design-direction/scripts/*)
---

# design-direction: Consolidated UI/UX & Aesthetic Engineering

> Merged skill combining taste-skill (landing pages, design reads), emil-design-eng (animation & polish), theme-factory (presets), frontend-design (high-quality distinctive UIs), brutalist-skill (Swiss typography, industrial), minimalist-skill (editorial, clean), and redesign-skill (audit & upgrade).
>
> Pilot routing: Design Analyst uses this skill to choose the design-skill stack
> and produce a Design Brief before Scoped Coder implements non-trivial
> frontend/showcase work.

---

## Trigger Table — When to Use This Skill

| Design Brief | Task Type | Aesthetic Direction | Reference File | Primary Approach |
|---|---|---|---|---|
| **Landing pages, portfolios, hero sections** | Greenfield build | SaaS, agency, premium consumer, editorial | `reference/taste.md` | Design read → 3 dials (variance/motion/density) → system map |
| **Redesign existing UI** | Upgrade & polish | Preserve or overhaul | `reference/redesign.md` | Audit → modernization levers → targeted evolution |
| **Brutalist aesthetic** | Greenfield or redesign | Industrial, Swiss typography, terminal UIs | `reference/brutalist.md` | Rigid grids, extreme type scale, monospace, hazard red accent |
| **Minimalist aesthetic** | Greenfield or redesign | Editorial, clean, warm monochrome | `reference/minimalist.md` | High-contrast sans, muted pastels, flat bento, generous whitespace |
| **Premium UI polish** | Micro-interactions, animations | Any | `reference/emil.md` | Animation decision framework, spring physics, easing curves, component feel |
| **Component taste review** | Code review & refactor | Any | `reference/emil.md` | Animation checklist (frequency, purpose, easing, duration) |
| **Theme selection or generation** | Showcase demo themes | Niche-specific (Plomberie, Salon, etc.) | `reference/theme-factory.md` | Preset presets or custom generation from niche description |
| **High-end distinctive UIs** | Greenfield build | Bold & intentional direction | `reference/frontend-design.md` | Choose tone (minimalist, maximalist, retro, etc.) → execute with precision |
| **Design audit / findings triage** | Pre-implementation analysis | Any | `reference/taste.md` section 14 | Pre-Flight Check script + 60+ item checklist |
| **Typography & brand cohesion** | Redesign, polish | Any | `reference/taste.md` section 4.1 | Font choice (no Inter/serif defaults), pairing, tracking, emphasis discipline |
| **Color palette calibration** | Redesign, polish | Any | `reference/taste.md` section 4.2 | Ban defaults (lila purple, beige+brass for premium) → palette rotation |
| **Layout & composition** | Redesign, polish | Any | `reference/taste.md` section 4.3–4.7 | Anti-center bias, diversity, hero discipline, whitespace rhythm |

---

## Quick Reference — Choose Your Path

**If the brief says:**

- *"Build a landing page that feels premium / playful / editorial"* → Use taste-skill (Section 0–14 of `reference/taste.md`)
- *"Make this button feel better, fix the animation"* → Use Emil's animation framework (`reference/emil.md`)
- *"Pick a theme for this demo"* → Use theme presets (`reference/theme-factory.md`)
- *"This site needs a complete visual overhaul"* → Use redesign protocol (`reference/redesign.md`)
- *"Everything should feel brutalist / minimalist"* → Use style preset (`reference/brutalist.md` or `reference/minimalist.md`)
- *"Generate a distinctive, high-end UI"* → Use frontend-design (`reference/frontend-design.md`)

---

## Core Rules (All Aesthetics)

### 0. Design Analyst Routing Contract
For non-trivial design work, source-design porting, or broad visual redesign,
Control Tower may dispatch a read-only Design Analyst before coding.

The Design Analyst must produce or propose a Design Brief using
`docs/templates/design-brief-template.md` and must choose:
- source fidelity mode: exact-port, inspired-adaptation, redesign, or
  greenfield;
- one base design skill/reference;
- at most one style/taste skill;
- at most one component/system skill;
- at most one motion/source-tool skill;
- rejected skills and collision guards;
- visual QA gates for Review and Verification.

The Design Analyst does not edit source files. Scoped Coder implements only
after the design direction and approved write-set are clear.

### 1. Design Read First (Taste Skill)
Before touching code or proposing aesthetics, state the design read in one line:

> "Reading this as: \<page kind> for \<audience>, with a \<vibe> language, leaning toward \<design system>."

Examples:
- *"Reading this as: B2B SaaS landing for technical buyers, Linear-style minimalist, leaning toward Tailwind + Geist + restrained motion."*
- *"Reading this as: solo designer portfolio for hiring managers, editorial/kinetic, leaning toward native CSS + scroll animation + custom type."*

### 2. Set the Three Dials (Taste Skill)
Every layout and motion decision is gated by:
- **DESIGN_VARIANCE** (1=symmetrical, 10=asymmetric chaos)
- **MOTION_INTENSITY** (1=static, 10=cinematic)
- **VISUAL_DENSITY** (1=art gallery, 10=cockpit)

Baseline: `8 / 6 / 4`. Override conversationally based on design read.

### 3. Pick ONE Design System or Aesthetic
Section 2.A (taste) lists real systems (Fluent, Carbon, Radix, shadcn/ui, Tailwind). Section 2.B maps aesthetics to honest implementation (glassmorphism, brutalism, editorial, etc.).

Do NOT invent custom CSS to replace an official system. Do NOT mix systems in one project.

### 4. Forbidden Patterns (Critical)
- **Serif default:** Serif banned as default font. Use only when brand explicitly names it OR aesthetic family is genuinely editorial/luxury/heritage.
- **Lila/AI Purple gradient:** No automatic purple glow, neon, or generic AI gradient.
- **Premium-consumer palette defaults:** No warm beige+brass+espresso. Rotate palettes.
- **Eyebrow overuse:** Max 1 eyebrow per 3 sections. Most sections need no eyebrow.
- **Centered hero:** Only for editorial/manifesto. Else force asymmetry, split-screen, or left-aligned.
- **Three equal feature cards:** Most generic AI layout. Use asymmetric grid, zig-zag, scroll, or masonry.
- **Em-dash:** Completely banned from text (no kinetic em-dashes, no dashes-as-bullets).
- **Generic names/clichés:** No "John Doe", "Acme Corp", "Elevate", "Seamless", "Unleash".
- **Duplicate CTAs:** One intent per page = one label (no "Get Started" + "Start Free").
- **Div-based fake screenshots:** Use real images, generated images, or placeholder slots. Never fake UI with divs.
- **Hero overflow:** Hero fits initial viewport. No scroll required to find CTA.
- **Card without elevation:** Cards exist ONLY when elevation communicates hierarchy.
- **Animations on keyboard actions:** Keyboard shortcuts must be instant. Never animate them.
- **Scale(0) entry animations:** Start from scale(0.95) + opacity 0. Nothing materializes from zero.
- **Unconstrained content width:** Always use max-width container (~1200–1440px).

### 5. Component States Are Mandatory
- **Loading:** Skeletal loaders, not spinners.
- **Empty:** Beautifully composed entry states.
- **Error:** Inline, clear, no generic "Oops!".
- **Hover/Active/Focus:** Every interactive element has visible feedback.

### 6. Accessibility (Non-Negotiable)
- **Button contrast:** WCAG AA min (4.5:1 for text, 3:1 for large 18px+).
- **Form contrast:** All labels, inputs, errors pass WCAG AA.
- **Focus visible:** Every interactive element has a visible focus ring.
- **prefers-reduced-motion:** All motion collapses to static under this media query.
- **Dark mode:** Design for both light and dark unless brief explicitly forbids it.

### 7. Motion Must Be Motivated
Before adding any animation, ask: *"What does this communicate?"*

Valid answers: hierarchy, storytelling, feedback, state transition.

Invalid: "it looked cool".

### 8. Performance
- Animate ONLY `transform` and `opacity`. Never `top`, `left`, `width`, `height`.
- Use `will-change: transform` sparingly.
- CLS < 0.1, INP < 200ms, LCP < 2.5s.

---

## Reference Files

All consolidated content from merged skills is organized into reference files inside this directory. Load as needed:

- [`reference/taste.md`](reference/taste.md) — taste-skill: design reads, 3 dials, system map, typography, color, layout discipline, data patterns, image strategy, Pre-Flight Check
- [`reference/emil.md`](reference/emil.md) — emil-design-eng: animation decision framework, easing curves, spring physics, component principles, Sonner patterns, review checklist
- [`reference/theme-factory.md`](reference/theme-factory.md) — theme-factory: DemoTheme contract, preset library, custom generation, validation checklist
- [`reference/frontend-design.md`](reference/frontend-design.md) — frontend-design: design thinking, aesthetics guidelines, relationship to other skills
- [`reference/brutalist.md`](reference/brutalist.md) — brutalist-skill: Swiss typography, tactical telemetry, typographic architecture, color system, layout engineering, UI symbology
- [`reference/minimalist.md`](reference/minimalist.md) — minimalist-skill: premium utilitarian minimalism, negative constraints, typographic hierarchy, warm monochrome palette, component specs, motion subtlety
- [`reference/redesign.md`](reference/redesign.md) — redesign-skill: audit protocol, modernization levers, fix priority, comprehensive design audit checklist

---

## Workflows by Task Type

### A. Greenfield Landing Page or Portfolio

1. **Read the brief.** Infer design read.
2. **Ask one clarifying question** (if ambiguous). Else proceed.
3. **Set the three dials.** Use `reference/taste.md` Section 1 inference table.
4. **Pick a design system.** See `reference/taste.md` Section 2.
5. **Apply architecture & conventions** from `reference/taste.md` Section 3.
6. **Apply design engineering directives.** Section 4: typography, color, layout, interactivity, images, content density.
7. **Context-aware proactivity.** Section 5: motion, animations, marquees, GSAP patterns.
8. **Performance & accessibility guardrails.** Section 6.
9. **Run the pre-flight review.** Use `reference/taste.md` Section 14 and any local review helper your workspace already provides. Do not depend on a checked-in detector script.
10. **Manual checklist.** `reference/taste.md` Section 14.

### B. Redesign Existing Website/App

1. **Detect mode:** greenfield, redesign-preserve, or redesign-overhaul. If ambiguous, ask once.
2. **Audit before touching.** `reference/redesign.md` Section 11.B: document current state.
3. **Apply modernization levers** in priority order (typography first, then spacing, colors, motion, hero, full block). Section 11.D.
4. **Use targeted evolution.** Don't rewrite everything unless the site is unsalvageable.
5. **Run design audit.** `reference/redesign.md` "Design Audit" section covers typography, color, layout, interactivity, content, components, icons, code quality.
6. **Follow fix priority.** Section 11.E (fix priority).

### C. Microinteraction / Animation Review & Polish

1. **Ask the Emil framework questions:** Should this animate? What's the purpose? What easing? How fast?
2. **Apply animation checklist.** `reference/emil.md` Review Checklist.
3. **Test reduced motion.** Ensure all animations honor `prefers-reduced-motion`.
4. **Test at real speed and slow motion.** Use DevTools or video playback at 0.25x.

### D. Choose Theme for Demo

1. **Present 6 presets** from `reference/theme-factory.md`.
2. **User picks or describes** what they want.
3. **If preset:** apply it directly.
4. **If custom:** generate per `reference/theme-factory.md` "Custom Theme Generation Rules".
5. **Validate** against checklist.
6. **Get confirmation** before applying to code.

### E. Brutalist or Minimalist Redesign

1. **Read `reference/brutalist.md` or `reference/minimalist.md`** to internalize the aesthetic.
2. **Pick the visual archetype** (Swiss Industrial Print or Tactical Telemetry for brutalism; Editorial for minimalism).
3. **Apply typographic architecture.** Macro and micro typography per the reference.
4. **Set color system.** One palette, used consistently.
5. **Layout & spatial engineering.** Follow the grid, compartmentalization, density rules.
6. **Add texture & effects.** Halftone, CRT scanlines, mechanical noise for brutalism; subtle gradients, grain, movement for minimalism.

### F. Distinctive High-End UI (Frontend Design)

1. **Choose an extreme tone.** Brutally minimal? Maximalist chaos? Retro-futuristic? Luxury refined?
2. **Commit to direction.** Execute with intentionality, not defaults.
3. **Pick beautiful, unique fonts.** Avoid Inter, Roboto, Arial, system fonts.
4. **Use cohesive color.** Dominant colors with sharp accents.
5. **Compose with intention.** Unexpected layouts, asymmetry, diagonal flow, depth.
6. **Add motion and surfaces.** Gradients, noise, geometric patterns, layered transparency.

---

## Approval & Handoff

- **Design read & dials:** no approval needed. Declare, proceed.
- **Preset theme:** ask for approval before applying (custom themes only).
- **Redesign scope:** ask for clarification if ambiguous (preserve vs overhaul).
- **Major style changes:** post code review (optional for small tweaks, mandatory for comprehensive redesigns).

**Success condition:** interface has clear intentional aesthetic, avoids all forbidden patterns, passes Pre-Flight Check, looks distinctive (not AI slop).

**Auto-proceed:** YES after design read and dials are set. Code flows directly.

**Hard stop:** NO (design direction is iterative).

**Primary agent:** Design Analyst (routing/brief); Scoped Coder (implementation); Control Tower (pre-flight decisions).

---

## When to Use Each Reference File

| Situation | Load |
|---|---|
| Landing page, portfolio, or SaaS marketing site | `taste.md` (all sections) |
| Existing site needs polish, animation review, or button feel | `emil.md` |
| Demo showcase needs theme | `theme-factory.md` |
| Building a completely distinctive UI | `frontend-design.md` |
| Brutalist or industrial direction needed | `brutalist.md` |
| Clean, editorial, minimalist direction needed | `minimalist.md` |
| Existing site needs comprehensive redesign audit | `redesign.md` (Design Audit section) |
| Pre-Flight review before shipping | `taste.md` Section 14 + manual checklist |

---

## Manual Review

Use `reference/taste.md` Section 14 as the authoritative checklist before shipping.

If your workspace exposes a local review helper, treat it as optional and manual-only. This skill no longer claims a checked-in detector or theme validator command.
