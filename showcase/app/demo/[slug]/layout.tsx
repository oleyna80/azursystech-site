import { notFound } from 'next/navigation'
import { DemoFooter } from '@/demo-kit/layout/DemoFooter'
import { DemoNav } from '@/demo-kit/layout/DemoNav'
import { DemoReturnLink } from '@/demo-kit/layout/DemoReturnLink'
import { getDemoConfig } from '@/lib/demos'
import { themeToCSSVars } from '@/lib/theme'

export const dynamicParams = false

export default async function DemoLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ slug: string }>
}>) {
  const { slug } = await params
  const site = await getDemoConfig(slug)
  if (!site) notFound()

  return (
    <div
      className="demo-shell"
      data-demo={site.slug}
      data-button-style={site.theme.buttonStyle}
      data-card-style={site.theme.cardStyle}
      data-image-style={site.theme.imageStyle}
      style={themeToCSSVars(site.theme)}
    >
      <DemoNav site={site} />
      {children}
      <DemoFooter site={site} />
      {/* Full document navigation is required here because the main web app may run on another origin. */}
      <DemoReturnLink />
    </div>
  )
}
