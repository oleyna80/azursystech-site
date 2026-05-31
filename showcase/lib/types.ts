/** Visual theme applied to demo sites via CSS custom properties scoped to [data-demo]. */
export type DemoTheme = {
  primary: string
  primaryFg: string
  accent: string
  bg: string
  surface: string
  border: string
  font: {
    heading: string
    body: string
  }
  radius: 'none' | 'sm' | 'md' | 'lg' | 'full'
  sectionSpacing: 'compact' | 'normal' | 'spacious'
  buttonStyle: 'solid' | 'outline' | 'ghost'
  cardStyle: 'flat' | 'elevated' | 'bordered'
  imageStyle: 'natural' | 'rounded' | 'grayscale' | 'duotone'
}

/** A demo site entry in the showcase. */
export interface DemoSite {
  slug: string
  title: string
  category: string
  description: string
  previewImage: ImageAsset
  badge?: 'new' | 'popular'
  nav: NavItem[]
  pages: DemoPage[]
  niche: string
  theme: DemoTheme
}

export type DemoSlot = {
  slug: string
  title: string
  category: string
  pattern: string
  description: string
  href?: string
  status: 'active' | 'planned'
  gradient: string
  abbr: string
}

export type NavItem = {
  label: string
  href: string
}

export type DemoPage = {
  slug: string
  label: string
  title: string
  description: string
  sections: SectionConfig[]
}

export type SectionConfig = {
  type:
    | 'hero'
    | 'services'
    | 'urgentRequest'
    | 'process'
    | 'serviceArea'
    | 'trust'
    | 'automation'
    | 'faq'
    | 'finalCta'
  contentKey: string
}

export type ImageAsset = {
  src: string
  alt: string
  width: number
  height: number
}

export type LinkAction = {
  label: string
  href: string
}

export type HeroContent = {
  eyebrow: string
  headline: string
  subline: string
  primaryCta: LinkAction
  secondaryCta: LinkAction
  image: ImageAsset
  trustBullets: string[]
}

export type ServicesContent = {
  title: string
  intro: string
  cta: LinkAction
  items: Array<{
    title: string
    description: string
    icon: string
  }>
}

export type UrgentRequestContent = {
  title: string
  body: string
  cta: LinkAction
  fields: string[]
  note: string
}

export type ProcessContent = {
  title: string
  steps: string[]
  humanControlNote: string
}

export type ServiceAreaContent = {
  title: string
  body: string
  areas: string[]
  badge: string
}

export type TrustContent = {
  title: string
  points: string[]
}

export type AutomationContent = {
  title: string
  body: string
  cta: LinkAction
  flow: string[]
  summary: Array<{ label: string; value: string }>
}

export type FAQContent = {
  title: string
  items: Array<{ question: string; answer: string }>
}

export type FinalCTAContent = {
  title: string
  body: string
  actions: LinkAction[]
}

export type DemoSectionContent =
  | HeroContent
  | ServicesContent
  | UrgentRequestContent
  | ProcessContent
  | ServiceAreaContent
  | TrustContent
  | AutomationContent
  | FAQContent
  | FinalCTAContent

export type DemoContent = Record<string, DemoSectionContent>
