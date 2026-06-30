// ── Visual theme ──────────────────────────────────────────────

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

// ── Shared primitives ─────────────────────────────────────────

export type PreviewImage = {
  src: string
  alt: string
  width: number
  height: number
}

export type NavItem = {
  label: string
  href: string
}

export type LinkItem = {
  label: string
  href: string
}

export type FooterColumn = {
  title: string
  links: LinkItem[]
}

export type DemoFooterContent = {
  description: string
  columns: FooterColumn[]
  certification?: {
    title: string
    items: string[]
  }
  copyright: string
  legalLinks: LinkItem[]
}

export type SectionType =
  | 'hero'
  | 'services'
  | 'urgentRequest'
  | 'process'
  | 'serviceArea'
  | 'trust'
  | 'automation'
  | 'faq'
  | 'finalCta'
  | 'plumbingLanding'
  | 'salonBeauty'

export type SectionConfig = {
  type: SectionType
  contentKey: string
}

export type DemoPage = {
  slug: string
  label: string
  title: string
  description: string
  sections: SectionConfig[]
}

// ── Content types (one per section) ───────────────────────────

export type HeroContent = {
  eyebrow: string
  headline: string
  subline: string
  primaryCta: LinkItem
  secondaryCta: LinkItem
  image: PreviewImage
  trustBullets: string[]
}

export type ServiceItem = {
  icon: string
  title: string
  description: string
}

export type ServicesContent = {
  title: string
  intro: string
  cta: LinkItem
  items: ServiceItem[]
}

export type UrgentRequestContent = {
  title: string
  body: string
  cta: LinkItem
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

export type AutomationSummaryItem = {
  label: string
  value: string
}

export type AutomationContent = {
  title: string
  body: string
  cta: LinkItem
  flow: string[]
  summary: AutomationSummaryItem[]
}

export type FAQItem = {
  question: string
  answer: string
}

export type FAQContent = {
  title: string
  items: FAQItem[]
}

export type FinalCTAContent = {
  title: string
  body: string
  actions: LinkItem[]
}

export type QuoteFormField = {
  label: string
  type: 'text' | 'tel' | 'email' | 'select' | 'textarea'
  placeholder?: string
  options?: string[]
  required?: boolean
}

export type QuoteFormContent = {
  title: string
  highlightedWord?: string
  fields: QuoteFormField[]
  submitLabel: string
}

export type StatItem = {
  value: string
  label: string
  note?: string
  icon: string
}

export type PlumbingServiceItem = {
  icon: string
  title: string
  description: string
  cta: LinkItem
}

export type PlumbingReview = {
  name: string
  location: string
  text: string
  date: string
}

export type ContactInfoItem = {
  icon: string
  label: string
  value: string
  href?: string
}

export type PlumbingLandingContent = {
  hero: {
    badge: string
    title: string
    highlightedLine: string
    subtitle: string
    primaryCta: LinkItem
    secondaryCta: LinkItem
    trustBullets: string[]
    image: PreviewImage
    form: QuoteFormContent
  }
  stats: StatItem[]
  services: {
    title: string
    highlightedWord: string
    subtitle: string
    items: PlumbingServiceItem[]
  }
  why: {
    title: string
    highlightedWord: string
    points: string[]
    image: PreviewImage
    badgeTitle: string
    badgeText: string
  }
  emergency: {
    label: string
    title: string
    body: string
    phone: string
    phoneHref: string
    primaryCta: LinkItem
    secondaryCta: LinkItem
  }
  area: {
    title: string
    body: string
    zones: string[]
    mapLabel: string
  }
  reviews: {
    title: string
    highlightedWord: string
    subtitle: string
    cta: LinkItem
    items: PlumbingReview[]
  }
  contact: {
    title: string
    body: string
    info: ContactInfoItem[]
    form: QuoteFormContent
  }
}

export type SalonBeautyService = {
  icon: string
  title: string
  description: string
  price: string
  image: PreviewImage
}

export type SalonBeautyValue = {
  icon: string
  label: string
}

export type SalonBeautyStat = {
  value: string
  label: string
}

export type SalonBeautyGalleryItem = {
  title: string
  image: PreviewImage
}

export type SalonBeautyContactItem = {
  icon: string
  label: string
  value: string
  href?: string
}

export type SalonBeautyContent = {
  hero: {
    eyebrow: string
    title: string
    subtitle: string
    primaryCta: LinkItem
    secondaryCta: LinkItem
    image: PreviewImage
  }
  values: SalonBeautyValue[]
  booking: {
    title: string
    body: string
    cta: LinkItem
    image: PreviewImage
  }
  popularServices: SalonBeautyService[]
  servicesPage: {
    eyebrow: string
    title: string
    subtitle: string
    image: PreviewImage
    services: SalonBeautyService[]
    adviceTitle: string
    adviceBody: string
    adviceCta: LinkItem
    adviceImage: PreviewImage
  }
  about: {
    title: string
    intro: string
    image: PreviewImage
    values: SalonBeautyValue[]
    philosophyTitle: string
    philosophyText: string[]
    philosophyImage: PreviewImage
    stats: SalonBeautyStat[]
    galleryTitle: string
    gallery: SalonBeautyGalleryItem[]
  }
  area: {
    title: string
    body: string
    zones: string[]
  }
  reviews: {
    title: string
    items: Array<{ name: string; text: string; detail: string }>
  }
  contact: {
    title: string
    subtitle: string
    image: PreviewImage
    info: SalonBeautyContactItem[]
    form: QuoteFormContent
    note: string
  }
  satisfaction: {
    title: string
    body: string
    cta: LinkItem
    image: PreviewImage
  }
}

// ── DemoContent — all section data keys ───────────────────────

export type DemoContent = {
  hero: HeroContent
  services: ServicesContent
  request: UrgentRequestContent
  process: ProcessContent
  area: ServiceAreaContent
  trust: TrustContent
  automation: AutomationContent
  faq: FAQContent
  final: FinalCTAContent
  plumbingLanding?: PlumbingLandingContent
  salonBeauty?: SalonBeautyContent
}

// ── DemoSite — top-level demo descriptor ──────────────────────

export type DemoSite = {
  slug: string
  title: string
  category: string
  description: string
  previewImage: PreviewImage
  badge?: string
  niche: string
  subtitle?: string
  phone?: string
  phoneHref?: string
  headerCta?: LinkItem
  footer?: DemoFooterContent
  nav: NavItem[]
  pages: DemoPage[]
  theme: DemoTheme
}
