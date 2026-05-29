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
  niche: string
  theme: DemoTheme
  content: DemoContent
}

/** Content contract for a demo site. */
export interface DemoContent {
  businessName: string
  tagline: string
  hero: {
    heading: string
    subheading: string
    cta: string
  }
  sections: DemoSiteSection[]
  contact: {
    phone: string
    address: string
  }
}

export interface DemoSiteSection {
  id: string
  type: 'hero' | 'services' | 'about' | 'gallery' | 'testimonials' | 'contact' | 'cta'
  heading?: string
  body?: string
  items?: DemoSiteItem[]
}

export interface DemoSiteItem {
  title: string
  description?: string
  icon?: string
  image?: string
}
