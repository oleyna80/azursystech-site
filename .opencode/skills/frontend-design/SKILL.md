---
name: frontend-design
description: Create distinctive, production-grade frontend interfaces with high design quality. Use when building web components, pages, artifacts, posters, or applications. Generates creative, polished code that avoids generic AI aesthetics.
source: https://github.com/anthropics/skills — Apache 2.0
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
---

# Frontend Design

Create **distinctive, production-grade frontend interfaces** with high design quality. Use this skill when building web components, pages, artifacts, posters, or applications. Generate creative, polished code that avoids generic "AI slop" aesthetics.

## Design Thinking

Before writing ANY code, understand context and commit to a **bold aesthetic direction**:

**Purpose** — What problem does this interface solve? Who uses it?

**Tone** — Pick an extreme:
- Brutally minimal
- Maximalist chaos
- Retro-futuristic
- Organic/natural
- Luxury/refined
- Playful/toy-like
- Editorial/magazine
- Brutalist/raw
- Art deco/geometric
- Soft/pastel
- Industrial/utilitarian

**Constraints** — Technical requirements (framework, performance, accessibility).

**Differentiation** — What makes this **unforgettable**?

> CRITICAL: Choose a clear conceptual direction and execute with precision. Bold maximalism and refined minimalism both work — the key is **intentionality**, not intensity.

## Frontend Aesthetics Guidelines

### Typography
- Choose **beautiful, unique, interesting fonts**. Avoid Arial, Inter, Roboto, system fonts.
- Pair a **distinctive display font** with a **refined readable body font**.
- Use `next/font/google` for Next.js projects with `display: 'swap'`.

### Color & Theme
- Cohesive aesthetic using **CSS variables**.
- **Dominant colors with sharp accents** outperform timid, evenly-distributed palettes.
- Dark mode? Light mode? Pick one intentionally.

### Motion
- **CSS-only** animations preferred for simple effects.
- Use **Motion** library for React/Next.js when needed.
- One well-orchestrated **page load with staggered reveals** beats scattered micro-interactions.
- Scroll-triggered reveals, hover surprises, focus-ring animations.

### Spatial Composition
- **Unexpected layouts** — asymmetry, overlap, diagonal flow, grid-breaking elements.
- Generous whitespace OR controlled density — not the lukewarm middle.

### Backgrounds & Visual Details
Gradient meshes, noise textures, geometric patterns, layered transparencies, dramatic shadows, decorative borders, custom cursors, grain overlays.

## 🚫 NEVER Use

- Overused font families: Inter, Roboto, Arial, system fonts
- Clichéd color schemes (especially purple gradients on white backgrounds)
- Predictable cookie-cutter layouts
- Generic AI aesthetic lacking context-specific character

> Vary between light and dark themes, different fonts, different aesthetics. **NEVER converge** on common choices (Space Grotesk, Teal/Oranage) across generations.

---

## Relationship to Other Skills

- **`theme-factory`** — provides 6 curated niche-specific presets; use as starting point for client demo sites
- **`brand-guidelines`** — {{PROJECT_NAME}} brand for showcase shell (NOT demo interiors)
- **This skill** — the design process and quality bar for ALL frontend work

---

## Handoff

- **Success condition:** interface has a clear, intentional aesthetic direction, avoids all "NEVER use" patterns, and looks distinctive — not like a generic AI output
- **Auto-proceed:** 🟢 YES (code generation starts after design direction is chosen)
- **Hard stop:** NO — but user review of design direction is recommended before large multi-page work
- **Primary agent:** Scoped Coder
