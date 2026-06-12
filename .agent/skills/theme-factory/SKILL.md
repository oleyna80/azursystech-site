---
name: theme-factory
description: Generate, select, and apply curated themes for showcase demo sites. Each theme maps to the DemoTheme contract (palette, typography, shape, component character). Use when creating a new demo, refreshing an existing one, or generating a theme from client description.
---

# Theme Factory — Showcase Demo Themes

Use this skill when a showcase demo site needs a theme: new demo creation, theme refresh, or generating a theme from a client's description ("I want a luxury jewelry feel").

Themes are **per-demo visual identities** applied via CSS custom properties scoped to `data-demo` attribute. They must feel like the client's own brand — never like AzurSysTech (that's the showcase shell).

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
- `.agent/skills/brand-guidelines/SKILL.md` — AzurSysTech brand (for showcase shell, NOT demo interiors)
- `AGENTS.md`

---

## Preset Theme Library

6 curated themes for the 6 approved v1 demo niches. Each is a complete `DemoTheme`.

### 1. Urgent-Trust — Plomberie

**Character:** Reliable, urgent, clean. "Call now, we fix it."

```typescript
const themeUrgentTrust: DemoTheme = {
  primary: '#1A3C5E',        // dark navy blue — trust, stability
  primaryFg: '#FFFFFF',
  accent: '#E0553F',          // emergency red-orange — urgency, CTA
  bg: '#FAF9F7',
  surface: '#FFFFFF',
  border: '#D9D5CF',
  font: { heading: 'Source Serif 4', body: 'Geist Sans' },
  radius: 'md',
  sectionSpacing: 'normal',
  buttonStyle: 'solid',
  cardStyle: 'bordered',
  imageStyle: 'natural',
}
```

**Niche rationale:** Blue builds trust for urgent home services. Red-orange accent signals 24/7 emergency. Bordered cards reinforce reliability. Natural images show real plumbers, real work.

---

### 2. Soft-Appointment — Salon Beauté

**Character:** Elegant, soft, feminine, calm. "You deserve this moment."

```typescript
const themeSoftAppointment: DemoTheme = {
  primary: '#8B6B5E',        // warm taupe/mushroom — soft elegance
  primaryFg: '#FFFFFF',
  accent: '#D4A574',          // warm gold — premium, warm highlights
  bg: '#FDF8F4',              // warm cream — soft, not sterile white
  surface: '#FFFFFF',
  border: '#E8D5C8',          // warm beige border
  font: { heading: 'Playfair Display', body: 'Geist Sans' },
  radius: 'lg',
  sectionSpacing: 'spacious',
  buttonStyle: 'outline',
  cardStyle: 'elevated',
  imageStyle: 'rounded',
}
```

**Niche rationale:** Taupe + gold = understated luxury. Playfair Display for expressive elegance. Rounded images, elevated cards, spacious layout = breathing room, premium feel. Outline buttons = soft, not aggressive.

---

### 3. Warm-Hospitality — Bistrot

**Character:** Warm, inviting, rustic-chic, appetite. "Come in, sit down, eat well."

```typescript
const themeWarmHospitality: DemoTheme = {
  primary: '#4A3222',        // dark walnut brown — warm, earthy
  primaryFg: '#FDF8F0',
  accent: '#C67C3C',          // burnt orange — appetite, warmth
  bg: '#FDF8F0',              // warm cream
  surface: '#FFFBF7',
  border: '#D9C8B5',
  font: { heading: 'Lora', body: 'Geist Sans' },
  radius: 'md',
  sectionSpacing: 'compact',
  buttonStyle: 'solid',
  cardStyle: 'bordered',
  imageStyle: 'natural',
}
```

**Niche rationale:** Walnut + burnt orange = kitchen warmth. Lora headings for editorial/menu feel. Compact spacing = cozy, filled, bustling. Natural images = real food, real place.

---

### 4. Luxury-Editorial — Bijoux Artisanaux

**Character:** Refined, exclusive, artisanal, story-driven. "Each piece has a story."

```typescript
const themeLuxuryEditorial: DemoTheme = {
  primary: '#1A1A1A',        // near-black — luxury, minimalism
  primaryFg: '#FFFFFF',
  accent: '#C9A96E',          // champagne gold — precious metal
  bg: '#FAF8F5',              // warm off-white
  surface: '#FFFFFF',
  border: '#E5E0D8',
  font: { heading: 'Playfair Display', body: 'Source Serif 4' },
  radius: 'none',
  sectionSpacing: 'spacious',
  buttonStyle: 'outline',
  cardStyle: 'flat',
  imageStyle: 'grayscale',
}
```

**Niche rationale:** Black + gold = luxury. Playfair for headings, Source Serif body = editorial, story-driven. Grayscale images with gold accent = jewelry that speaks for itself. Flat cards, no-radius = minimal, architectural.

---

### 5. Professional-Trust — Assurance

**Character:** Competent, structured, clear, reassuring. "We protect what matters."

```typescript
const themeProfessionalTrust: DemoTheme = {
  primary: '#1F3D4F',        // deep teal-blue — competence, calm
  primaryFg: '#FFFFFF',
  accent: '#2E7D6F',          // muted teal — trust, no alarm
  bg: '#F7F9FA',              // cool light gray-blue
  surface: '#FFFFFF',
  border: '#DDE3E7',
  font: { heading: 'Source Serif 4', body: 'Geist Sans' },
  radius: 'sm',
  sectionSpacing: 'normal',
  buttonStyle: 'solid',
  cardStyle: 'elevated',
  imageStyle: 'natural',
}
```

**Niche rationale:** Teal = trust without cold corporate blue. Cool background = professional distance. Small radius = structured, precise. Elevated cards = solid, dependable. No rounded images = serious, not playful.

---

### 6. Calm-Office — Cabinet Comptable

**Character:** Structured, quiet, methodical, B2B-calm. "Your numbers, in order."

```typescript
const themeCalmOffice: DemoTheme = {
  primary: '#2D3748',         // dark slate — authority, structure
  primaryFg: '#FFFFFF',
  accent: '#5A7D6B',          // sage green — calm, methodical
  bg: '#F5F6F4',              // neutral light
  surface: '#FFFFFF',
  border: '#E0E2DD',
  font: { heading: 'Source Serif 4', body: 'Geist Sans' },
  radius: 'sm',
  sectionSpacing: 'compact',
  buttonStyle: 'solid',
  cardStyle: 'flat',
  imageStyle: 'natural',
}
```

**Niche rationale:** Slate + sage = calm authority, no drama. Compact spacing = dense information, efficient. Flat cards = minimal decoration. Small radius = precise, structured. B2B audience, no fluff.

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

- **Showcase shell** (landing, nav, footer) → uses `brand-guidelines` skill (AzurSysTech brand)
- **Demo interiors** (inside `data-demo` wrapper) → uses this skill (client-facing niche themes)
- **Never mix**: demo themes must NOT leak AzurSysTech colors. The shell must NOT inherit demo themes.

---

## Handoff

- **Success condition:** theme is a complete `DemoTheme`, passes validation checklist, matches niche character
- **Next:** Scoped Coder applies theme to demo `site.ts` → Verifier checks visual isolation
- **Auto-proceed:** 🟢 YES for presets, 🟢 YES for custom (after user confirmation of generated theme)
- **Hard stop:** NO (but custom theme requires user review before apply)
- **Primary agent:** Control Tower → Scoped Coder (theme application)
