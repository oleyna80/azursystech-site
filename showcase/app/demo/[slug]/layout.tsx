import { notFound } from 'next/navigation'
import { DemoFooter } from '@/demo-kit/layout/DemoFooter'
import { DemoNav } from '@/demo-kit/layout/DemoNav'
import { getDemoConfig } from '@/lib/demos'
import { themeToCSSVars } from '@/lib/theme'

export const dynamicParams = false

const getReturnHref = () => {
  const baseUrl =
    process.env.NEXT_PUBLIC_WEB_BASE_URL ??
    (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '')

  return `${baseUrl}/fr#websites`
}

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
      <a className="demo-return" href={getReturnHref()} aria-label="Retour au site principal">
        <svg aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M19 12H5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="m12 19-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="demo-return__full">Retour au site</span>
        <span className="demo-return__short">Retour</span>
      </a>
    </div>
  )
}
