import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import type { Lang } from '@/components/immobilier/types'
import { listings, getListing, ui } from '@/components/immobilier/data'
import { PropertyPage } from '@/components/immobilier/PropertyPage'

const VALID_LANGS: Lang[] = ['fr', 'en']

export function generateStaticParams() {
  return listings.map((l) => ({ slug: l.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}): Promise<Metadata> {
  const { lang, slug } = await params
  if (!VALID_LANGS.includes(lang as Lang)) return {}
  const listing = getListing(slug)
  if (!listing) return {}
  const t = ui[lang as Lang]
  return {
    title: `${listing.title[lang as Lang]} — Atelier Rivage`,
    description: listing.description[lang as Lang].slice(0, 160),
    alternates: {
      languages: {
        fr: `/demo/immobilier/fr/bien/${slug}`,
        en: `/demo/immobilier/en/bien/${slug}`,
      },
    },
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}) {
  const { lang, slug } = await params
  if (!VALID_LANGS.includes(lang as Lang)) notFound()
  const listing = getListing(slug)
  if (!listing) notFound()
  return <PropertyPage lang={lang as Lang} slug={slug} />
}
