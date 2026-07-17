import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import type { Lang } from '@/components/immobilier/types'
import { ui } from '@/components/immobilier/data'
import { CataloguePage } from '@/components/immobilier/CataloguePage'

const VALID_LANGS: Lang[] = ['fr', 'en']

export function generateStaticParams() {
  return VALID_LANGS.map((lang) => ({ lang }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  if (!VALID_LANGS.includes(lang as Lang)) return {}
  const t = ui[lang as Lang]
  return {
    title: t.meta.rent_title,
    description: t.meta.rent_description,
  }
}

const intros: Record<Lang, { heading: string; body: string }> = {
  fr: {
    heading: 'Biens à louer',
    body: "Des maisons et appartements à louer sur la Riviera, sélectionnés pour leur qualité et leur cadre. Locations annuelles et saisonnières dans des adresses d'exception.",
  },
  en: {
    heading: 'Properties to rent',
    body: "Houses and apartments to rent on the Riviera, chosen for their quality and setting. Annual and seasonal rentals in exceptional locations.",
  },
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!VALID_LANGS.includes(lang as Lang)) notFound()
  return <CataloguePage lang={lang as Lang} initialFilter="location" intro={intros[lang as Lang]} />
}
