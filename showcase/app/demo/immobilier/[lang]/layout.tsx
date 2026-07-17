import { notFound } from 'next/navigation'
import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import type { Metadata } from 'next'
import type { Lang } from '@/components/immobilier/types'
import { ui } from '@/components/immobilier/data'
import { SiteShell } from '@/components/immobilier/SiteShell'
import { DemoReturnLink } from '@/demo-kit/layout/DemoReturnLink'

const VALID_LANGS: Lang[] = ['fr', 'en']

/* ── Fonts ──────────────────────────────────────────────────
   Display: Cormorant Garamond — expressive serif for wordmark
   and headings. Distinctly non-generic.
   Body: DM Sans — neutral, legible in both French and English.
   No Inter, no Outfit, no Plus Jakarta Sans, no third family.
────────────────────────────────────────────────────────────── */
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--rv-font-display',
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--rv-font-body',
  weight: ['400', '500', '600'],
  display: 'swap',
})

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
    title: t.meta.home_title,
    description: t.meta.home_description,
    alternates: {
      languages: {
        fr: '/demo/immobilier/fr',
        en: '/demo/immobilier/en',
      },
    },
  }
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!VALID_LANGS.includes(lang as Lang)) notFound()

  return (
    <div className={`${cormorant.variable} ${dmSans.variable}`} lang={lang}>
      <SiteShell lang={lang as Lang}>{children}</SiteShell>
      <DemoReturnLink />
    </div>
  )
}
