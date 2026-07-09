import { notFound } from 'next/navigation'
import { ProductPage } from '@/components/bijoux-artisanaux/ProductPage'
import { getProduct } from '@/components/bijoux-artisanaux/data'

export async function generateStaticParams() {
  const { products } = await import('@/components/bijoux-artisanaux/data')
  return products.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = getProduct(slug)
  if (!product) return {}
  return {
    title: `${product.name} | Atelier Liora`,
    description: product.description,
  }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = getProduct(slug)
  if (!product) notFound()
  return <ProductPage product={product} />
}
