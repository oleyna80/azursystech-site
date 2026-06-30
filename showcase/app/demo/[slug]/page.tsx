import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { DemoPageRenderer } from '@/demo-kit/renderer/DemoPageRenderer'
import { getDemo, getDemoSlugs } from '@/lib/demos'
import { buildDemoMetadata } from '@/lib/metadata'

type Props = {
  params: Promise<{ slug: string }>
}

export const dynamicParams = false

export function generateStaticParams() {
  return getDemoSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const demo = await getDemo(slug)
  if (!demo) return {}
  const page = demo.site.pages.find((candidate) => candidate.slug === '')
  return buildDemoMetadata(demo.site, page)
}

export default async function DemoIndexPage({ params }: Props) {
  const { slug } = await params
  const demo = await getDemo(slug)
  if (!demo) notFound()

  const page = demo.site.pages.find((candidate) => candidate.slug === '')
  if (!page) notFound()

  return <DemoPageRenderer content={demo.content} page={page} site={demo.site} />
}
