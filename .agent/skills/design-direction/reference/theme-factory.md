---
name: theme-factory
description: "Need to style a showcase demo for its business niche? Use this for all theme work: choosing the right preset, generating a custom theme from client description, updating colors/fonts/shape on existing demos, or validating a DemoTheme's WCAG contrast and contract compliance. Handles per-demo palette, typography, radii, spacing, and component style — separate from the showcase shell's branding."
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
  - Bash(node .claude/skills/theme-factory/scripts/*)
---

# Theme Factory — Showcase Demo Themes

Use this skill when a showcase demo site needs a theme: new demo creation, theme refresh, or generating a theme from a client's description ("I want a luxury jewelry feel").

Themes are **per-demo visual identities** applied via CSS custom properties scoped to `data-demo` attribute. They must feel like the client's own brand — never like {{PROJECT_NAME}} (that's the showcase shell).

## Contract

Every theme must conform to `DemoTheme` from `showcase/lib/types.ts`:

```typescript
type DemoTheme = {
  primary: string       // main brand color (buttons, links, icons)
  primaryFg: string     // text color on primary background
  accent: string        // secondary accent (highlights, badges)
  bg: string            // page background
  surface: string       // card/section background
  border: string        // dividers, card borders
  font: {
    heading: string     // approved font token (not arbitrary Google Font)
    body: string        // body font token
  }
  radius: 'none' | 'sm' | 'md' | 'lg' | 'full'
  sectionSpacing: 'compact' | 'normal' | 'spacious'
  buttonStyle: 'solid' | 'outline' | 'ghost'
  cardStyle: 'flat' | 'elevated' | 'bordered'
  imageStyle: 'natural' | 'rounded' | 'grayscale' | 'duotone'
}
```

## Read First

- `showcase/lib/types.ts` — DemoTheme, DemoSite, DemoContent types
- `showcase/lib/theme.ts` — themeToCSSVars() helper
- `.agent/skills/brand-guidelines/SKILL.md` — {{PROJECT_NAME}} brand (for showcase shell, NOT demo interiors)
- `AGENTS.md`

---

## Preset Theme Library

> **Reference:** [`reference/preset-themes.md`](reference/preset-themes.md) — 6 curated `DemoTheme` objects for the approved v1 demo niches: Urgent-Trust (Plomberie), Soft-Appointment (Salon), Warm-Hospitality (Bistrot), Luxury-Editorial (Bijoux), Professional-Trust (Assurance), Calm-Office (Cabinet Comptable). Each includes character description, complete TypeScript theme object, and niche rationale. Load when presenting themes or applying a preset.

---

## Theme Selection Workflow

1. **Present the 6 presets** — show theme name, character, and primary/accent colors. Do NOT modify `showcase/` files yet.
2. **Ask which theme** — user picks one or describes what they want.
3. **If preset matches** → apply it.
4. **If custom needed** → generate a new theme from user description:
   - Give it a descriptive name
   - Choose all `DemoTheme` fields matching the client's niche
   - Show the complete theme for review
   - Wait for explicit confirmation
   - Apply after approval

## Custom Theme Generation Rules

When generating a theme from a client description:

1. **Primary color:** match the niche's psychological need (trust, warmth, luxury, urgency, calm)
2. **Accent:** must contrast with primary, used sparingly for CTAs and highlights
3. **Font.heading:** pick from `Source Serif 4`, `Playfair Display`, `Lora` — match the character (editorial → Playfair, practical → Source Serif, warm → Lora)
4. **Font.body:** always `Geist Sans` for readability (do NOT introduce new body fonts without Owner approval)
5. **Radius:** `none` for architectural/minimal, `sm` for professional, `md` for general, `lg` for soft/beauty, `full` for playful
6. **SectionSpacing:** `compact` for dense/hospitality, `normal` for most, `spacious` for luxury/editorial
7. **ButtonStyle:** `solid` for direct/service, `outline` for premium/editorial, `ghost` for minimal
8. **CardStyle:** `flat` for minimal/B2B, `elevated` for premium/trust, `bordered` for service/reliable
9. **ImageStyle:** `natural` for most, `rounded` for soft/beauty, `grayscale` for luxury/editorial, `duotone` for bold/modern
10. **WCAG contrast:** primary on bg must be readable. primaryFg on primary must be readable. If in doubt, test with white/black text.

## Theme Validation Checklist

> **Script:** `node .claude/skills/theme-factory/scripts/validate.mjs [--json] [theme.json]` — automated DemoTheme contract validator. Checks all required fields, WCAG AA contrast ratios (primaryFg/primary, primary/bg), approved heading fonts, body font = Geist Sans, enum values, hex format, pure white bg warning. Exit code 1 = invalid. Pipe theme JSON via stdin or pass file path.

Before accepting any theme (preset or custom):

- [ ] All 10 `DemoTheme` fields are filled
- [ ] `primaryFg` is readable on `primary` (white or near-white)
- [ ] `bg` ≠ pure white `#FFFFFF` (use off-white unless the niche demands sterile/clinical)
- [ ] `border` is a muted variant of `bg`, not `#ccc`
- [ ] `font.heading` is from the approved set: `Source Serif 4`, `Playfair Display`, `Lora`
- [ ] `font.body` = `Geist Sans`
- [ ] Theme conveys a distinct character, not just "different colors on the same template"
- [ ] Theme fits the client's niche psychologically

---

## Relationship to Brand Guidelines

- **Showcase shell** (landing, nav, footer) → uses `brand-guidelines` skill ({{PROJECT_NAME}} brand)
- **Demo interiors** (inside `data-demo` wrapper) → uses this skill (client-facing niche themes)
- **Never mix**: demo themes must NOT leak {{PROJECT_NAME}} colors. The shell must NOT inherit demo themes.

---

## Handoff

- **Success condition:** theme is a complete `DemoTheme`, passes validation checklist, matches niche character
- **Next:** Scoped Coder applies theme to demo `site.ts` → Verifier checks visual isolation
- **Auto-proceed:** 🟢 YES for presets, 🟢 YES for custom (after user confirmation of generated theme)
- **Hard stop:** NO (but custom theme requires user review before apply)
- **Primary agent:** Control Tower → Scoped Coder (theme application)
