export type Lang = 'fr' | 'en'

export type ListingStatus = 'vente' | 'location'

export type Listing = {
  id: string
  slug: string
  status: ListingStatus
  city: string
  address: { fr: string; en: string }
  title: { fr: string; en: string }
  description: { fr: string; en: string }
  price: string
  priceLabel: { fr: string; en: string }
  area: number
  rooms: number
  bedrooms: number
  floor: number | null
  images: string[]
  features: { fr: string[]; en: string[] }
  agentId: string
  featured: boolean
}

export type Agent = {
  id: string
  name: string
  role: { fr: string; en: string }
  bio: { fr: string; en: string }
  phone: string
  email: string
  image: string
}

export type UI = {
  nav: {
    wordmark: string
    home: string
    catalogue: string
    buy: string
    rent: string
    agency: string
    contact: string
  }
  hero: {
    tagline: string
    cta_buy: string
    cta_rent: string
  }
  catalogue: {
    title: string
    filter_all: string
    filter_sale: string
    filter_rent: string
    empty_title: string
    empty_body: string
    reset: string
    rooms_label: string
    area_label: string
    per_month: string
  }
  detail: {
    rooms: string
    bedrooms: string
    area: string
    floor: string
    ground_floor: string
    features: string
    description: string
    contact_agent: string
    related: string
    gallery_open: string
    gallery_close: string
    gallery_prev: string
    gallery_next: string
    image_of: string
    gallery_photos: string
    gallery_photo: string
  }
  agency: {
    title: string
    subtitle: string
    approach_title: string
  }
  contact: {
    title: string
    subtitle: string
    demo_notice_title: string
    demo_notice_body: string
    name_label: string
    name_placeholder: string
    email_label: string
    email_placeholder: string
    phone_label: string
    phone_placeholder: string
    message_label: string
    message_placeholder: string
    submit: string
    success_title: string
    success_body: string
    error_required: string
    error_email: string
  }
  footer: {
    tagline: string
    nav_title: string
    contact_title: string
    copyright: string
  }
  status: {
    vente: string
    location: string
  }
  meta: {
    home_title: string
    home_description: string
    catalogue_title: string
    catalogue_description: string
    buy_title: string
    buy_description: string
    rent_title: string
    rent_description: string
    agency_title: string
    agency_description: string
    contact_title: string
    contact_description: string
  }
}
