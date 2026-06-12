---
name: brand-guidelines
description: Apply AzurSysTech brand colors, typography, and voice to any artifact — showcase demos, docs, presentations, OG images, landing pages. Single source of truth for brand identity.
---

# Brand Guidelines — AzurSysTech

Use this skill whenever an artifact (demo site, doc, presentation, landing page, OG image) needs to feel like AzurSysTech, not a generic template. This is the **single source of truth** for brand identity.

## Brand Source Files

- `01_brand/brand-pack.md` — full strategy, voice, positioning (canonical)
- `web/src/app/globals.css` — current CSS tokens
- `web/src/i18n.js` — brand copy in fr/ru/en
- `web/src/lib/legal-content.ts` — legal entity, contacts

---

## 1. Color Palette

### Core Tokens

| Token | Hex | Tailwind v4 | Role |
|---|---|---|---|
| `base` | `#F6F1E8` | `bg-[var(--color-base)]` | Warm light page background |
| `surface` | `#FFFDFC` | `bg-[var(--color-surface)]` | Cards, elevated surfaces |
| `graphite` | `#1F2A37` | `text-[var(--color-graphite)]` | Primary text, headings, ink |
| `accent-teal` | `#1F6F78` | `text-[var(--color-accent-teal)]` | Primary accent, links, icons |
| `accent-terra` | `#C96F4A` | `text-[var(--color-accent-terra)]` | Secondary accent, CTA buttons, hover states |
| `border` | `#D8D0C4` | `border-[var(--color-border)]` | Borders, dividers, muted lines |

### Application Rules

- **Backgrounds:** `base` for pages, `surface` for cards/sections. Never pure white `#fff`.
- **Text:** `graphite` for headings and body. Never pure black `#000`.
- **Primary accent:** `teal` for links, icons, primary buttons, active states.
- **Secondary accent:** `terra` for CTA buttons, important highlights, hover transitions.
- **Borders:** `#D8D0C4` for all dividers and card borders. Never harsh `#ccc` or `#e5e5e5`.
- **Contrast check:** `graphite` on `base` = adequate. `base` on `graphite` = adequate. White text on `teal`/`terra` = adequate.

### Tailwind v4 Integration

```css
/* In globals.css or equivalent */
@import "tailwindcss";

@theme inline {
  --color-base: #F6F1E8;
  --color-surface: #FFFDFC;
  --color-graphite: #1F2A37;
  --color-accent-teal: #1F6F78;
  --color-accent-terra: #C96F4A;
  --color-border: #D8D0C4;
}
```

### Do NOT

- Add new accent colors without updating this skill
- Use `slate-*`, `gray-*`, `zinc-*`, `neutral-*` Tailwind grays — use `graphite` or `border` instead
- Use `blue-*` or `orange-*` — use `teal` or `terra`
- Introduce gradients with colors outside this palette
- Use opacity tricks on brand colors for "variation" — the palette is the palette

---

## 2. Typography

### Current (web/)

| Role | Font | Source |
|---|---|---|
| Body | Geist Sans | `next/font/google` — `var(--font-geist-sans)` |
| Mono | Geist Mono | `next/font/google` — `var(--font-geist-mono)` |
| Fallback | Arial, Helvetica, sans-serif | — |

### Brand Direction (from brand-pack)

- **Headings:** "expressive but restrained serif" — not yet implemented
- **Body:** "neutral readable sans-serif" — Geist Sans ✓

### When to Follow Brand Direction vs Current

- **Existing `web/` app:** keep Geist Sans (consistency). Do not change fonts without a migration plan.
- **New `showcase/` app:** implement brand direction — serif headings + Geist Sans body.
- **Presentations/docs:** use font direction that matches the artifact's audience.

### Recommended Serif for Showcase Headings

| Option | Character | Load |
|---|---|---|
| **Source Serif 4** | Warm, readable, open-source | `next/font/google` |
| **Lora** | Softer, editorial | `next/font/google` |
| **Playfair Display** | More expressive, luxury | `next/font/google` |

**Default for showcase:** Source Serif 4 — warm, practical, local feel. Matches "informatique de proximité" positioning.

### Font Application

- Headings (h1-h3, 20px+): serif font, `graphite` color
- Body text, labels, nav: Geist Sans, `graphite` color
- Mono: only for code, technical data, phone numbers
- Font loading: always via `next/font/google` with `display: 'swap'`

---

## 3. Voice & Copy

### Principles

- **Simple** — short sentences, no jargon
- **Direct** — say what you do, for whom, where
- **Reassuring** — "on s'en occupe" energy, not "we are the best"
- **Practical** — client outcomes, not technical specs
- **Local** — Nice, Alpes-Maritimes, Côte d'Azur framing
- **Human** — founder identity when appropriate, not corporate "we"

### Primary Tagline

> L'informatique simple, près de chez vous

### Avoid

- AI buzzwords ("propulsé par l'IA", "intelligence artificielle")
- Startup language ("disruptif", "scalable", "next-gen")
- Overpromising ("solution ultime", "le meilleur")
- Corporate French with impersonal tone
- Technical front-page language (leave specs for service pages)

### Service Naming

Use these labels when naming services:
- Dépannage informatique
- Installation PC
- Configuration Wi-Fi
- Configuration imprimante
- Réseau local
- Assistance informatique sur site
- Mise en service poste de travail
- Solutions informatiques pour TPE

### Multilingual

Site supports `fr`, `ru`, `en`. Default to French. Copy in `web/src/i18n.js` is canonical for translations.

---

## 4. Visual Character

### What "AzurSysTech" Looks Like

- Clean, not sterile
- Local, not amateur
- Practical, not flashy
- Modern but simple
- Warm background + dark ink + restrained teal + terracotta warmth

### Image Direction

- Minimal service-oriented imagery (workstation, Wi-Fi, printer, laptop)
- Local Mediterranean vibe through color and layout, not stock-photo clutter
- `next/image` with WebP/AVIF, explicit width/height, lazy loading
- Hero images: `priority`, max 800 KB

### What to NEVER Do

- Cyberpunk / hacker aesthetics
- Noisy generic startup gradients
- Cold corporate blue-gray
- Stock photos of call center agents or server racks
- AI-generated abstract blobs

---

## 5. Logo

### Current (no file)

Logo is rendered inline in `site-header.tsx`:
- Small SVG hexagon icon (24×24) in a teal circle
- "AzurSysTech" text in white, `font-extrabold`

### When a Logo File is Needed

- Favicon, OG images, external embeds → generate from this spec
- Do NOT create a logo file that contradicts the inline version

---

## 6. Application to Showcase Demo Themes

When creating or reviewing demo themes for `showcase/`, use this brand as the **default fallback**, not the identity:

- Demo themes are **client-facing niche designs** (plomberie, salon, bistrot, etc.)
- They must NOT feel like AzurSysTech — they must feel like the client's own brand
- The AzurSysTech brand appears only in the **showcase shell** (landing page, nav, footer)
- Inside `data-demo` wrapper — zero AzurSysTech brand leakage

---

## Handoff

- **Success condition:** artifact uses only colors from this palette, fonts match direction, copy follows voice principles, no generic AI aesthetic
- **Next:** return to Control Tower
- **Auto-proceed:** 🟢 YES
- **Hard stop:** NO
- **Primary agent:** Control Tower / Scoped Coder
