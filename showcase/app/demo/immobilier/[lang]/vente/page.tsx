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
    title: t.meta.buy_title,
    description: t.meta.buy_description,
  }
}

const intros: Record<Lang, { heading: string; body: string }> = {
  fr: {
    heading: 'Biens à vendre',
    body: "Une sélection rigoureuse de propriétés à l'achat sur la Côte d'Azur — appartements, villas et bastides dans les adresses les plus recherchées de la Riviera.",
  },
  en: {
    heading: 'Properties for sale',
    body: "A carefully curated selection of properties for purchase on the Côte d'Azur — apartments, villas and bastides in the most sought-after addresses on the Riviera.",
  },
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!VALID_LANGS.includes(lang as Lang)) notFound()
  return <CataloguePage lang={lang as Lang} initialFilter="vente" intro={intros[lang as Lang]} />
}
