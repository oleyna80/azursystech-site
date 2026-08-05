# Preset Theme Library — 6 Curated Demo Themes

Complete `DemoTheme` objects for the 6 approved v1 demo niches. From main SKILL.md.

## 1. Urgent-Trust — Plomberie

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

## 2. Soft-Appointment — Salon Beauté

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

## 3. Warm-Hospitality — Bistrot

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

## 4. Luxury-Editorial — Bijoux Artisanaux

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

## 5. Professional-Trust — Assurance

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

## 6. Calm-Office — Cabinet Comptable

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
