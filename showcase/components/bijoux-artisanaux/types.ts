export type ProductStatus = 'available' | 'made_to_order' | 'sold_out' | 'preorder'

export type ProductCategory = 'bagues' | 'colliers' | 'boucles-oreilles' | 'bracelets'

export type Product = {
  id: string
  slug: string
  name: string
  collection: string
  category: ProductCategory
  style: string
  budget: string
  occasion: string[]
  priceLabel: string
  materials: string[]
  status: ProductStatus
  description: string
  tags: string[]
  options: {
    sizes?: string[]
    materials?: string[]
  }
  details: {
    materials: string
    size: string
    care: string
  }
  image?: string
  featured?: boolean
  palette: string
}

export type Collection = {
  id: string
  label: string
  category: ProductCategory | null
  description: string
}

export type InquiryFormData = {
  name: string
  email: string
  phone: string
  message: string
  productId?: string
}

export type CustomOrderFormData = {
  name: string
  email: string
  phone: string
  description: string
  budget: string
  timeline: string
}
