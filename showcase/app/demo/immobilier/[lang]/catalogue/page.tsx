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
    title: t.meta.catalogue_title,
    description: t.meta.catalogue_description,
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!VALID_LANGS.includes(lang as Lang)) notFound()
  return <CataloguePage lang={lang as Lang} />
}
