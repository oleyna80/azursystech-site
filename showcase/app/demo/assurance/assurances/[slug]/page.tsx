import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { getProduct, PRODUCTS } from '@/components/assurance/products'

import { AssuranceProductPage } from './AssuranceProductPage'

type Props = {
  params: Promise<{ slug: string }>
}

export const dynamicParams = false

export function generateStaticParams() {
  return PRODUCTS.map((product) => ({ slug: product.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = getProduct(slug)

  if (!product) return {}

  return {
    title: `${product.label} | Paul Clement Assurance Demo`,
    description: product.subtitle,
  }
}

export default async function Page({ params }: Props) {
  const { slug } = await params
  const product = getProduct(slug)

  if (!product) notFound()

  return <AssuranceProductPage product={product} />
}
