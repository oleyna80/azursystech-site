import type { Metadata } from 'next'
import type { DemoPage, DemoSite } from './types'

const baseTitle = 'AzurSysTech Showcase'

export function buildDemoMetadata(site: DemoSite, page?: DemoPage): Metadata {
  const title = page?.slug
    ? `${page.title} — ${site.title}`
    : site.title
  const description = page?.description ?? site.description
  const path = page?.slug ? `/demo/${site.slug}/${page.slug}` : `/demo/${site.slug}`

  return {
    title: `${title} | ${baseTitle}`,
    description,
    openGraph: {
      title,
      description,
      images: [site.previewImage.src],
    },
    alternates: {
      canonical: path,
    },
  }
}
