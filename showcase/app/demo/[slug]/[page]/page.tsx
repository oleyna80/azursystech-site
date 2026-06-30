import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { DemoPageRenderer } from '@/demo-kit/renderer/DemoPageRenderer'
import { getAllDemoPages, getDemo } from '@/lib/demos'
import { buildDemoMetadata } from '@/lib/metadata'

type Props = {
  params: Promise<{ slug: string; page: string }>
}

export const dynamicParams = false

export function generateStaticParams() {
  return getAllDemoPages()
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, page: pageSlug } = await params
  const demo = await getDemo(slug)
  if (!demo) return {}

  const page = demo.site.pages.find((candidate) => candidate.slug === pageSlug)
  return buildDemoMetadata(demo.site, page)
}

export default async function DemoSubPage({ params }: Props) {
  const { slug, page: pageSlug } = await params
  const demo = await getDemo(slug)
  if (!demo) notFound()

  const page = demo.site.pages.find((candidate) => candidate.slug === pageSlug)
  if (!page) notFound()

  return <DemoPageRenderer content={demo.content} page={page} site={demo.site} />
}
