import type { DemoSite } from '@/lib/types'

type Props = {
  site: DemoSite
}

export function DemoNav({ site }: Props) {
  const isSalonBeauty = site.slug === 'salon-beaute'

  return (
    <header className="demo-nav">
      <a className="demo-nav__brand" href="#top">
        <span className="demo-nav__mark" aria-hidden="true">
          {isSalonBeauty ? (
            <svg fill="none" viewBox="0 0 44 44">
              <path d="M22 3c7 6 7 14 0 19-7-5-7-13 0-19Z" stroke="currentColor" strokeWidth="2.2" />
              <path d="M22 41c-7-6-7-14 0-19 7 5 7 13 0 19Z" stroke="currentColor" strokeWidth="2.2" />
              <path d="M3 22c6-7 14-7 19 0-5 7-13 7-19 0Z" stroke="currentColor" strokeWidth="2.2" />
              <path d="M41 22c-6 7-14 7-19 0 5-7 13-7 19 0Z" stroke="currentColor" strokeWidth="2.2" />
            </svg>
          ) : (
            <svg fill="none" viewBox="0 0 36 44">
              <path d="M18 2C11 11 4 19 4 29a14 14 0 0 0 28 0C32 19 25 11 18 2Z" stroke="currentColor" strokeWidth="3" />
              <path d="M22 33a5 5 0 0 1-8 0" stroke="currentColor" strokeLinecap="round" strokeWidth="3" />
            </svg>
          )}
        </span>
        <span>
          <strong>{site.title}</strong>
          {site.subtitle ? <small>{site.subtitle}</small> : null}
        </span>
      </a>
      <nav aria-label="Demo navigation">
        {site.nav.map((item) => (
          <a href={item.href} key={item.href}>
            {item.label}
          </a>
        ))}
      </nav>
      <div className="demo-nav__actions">
        {site.phone ? (
          <a className="demo-nav__phone" href={site.phoneHref ?? `tel:${site.phone.replace(/\s+/g, '')}`}>
            <svg aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7A2 2 0 0 1 22 16.9Z" />
            </svg>
            {site.phone}
          </a>
        ) : null}
        <a className="demo-nav__cta" href={site.headerCta?.href ?? '#contact'}>
          {site.headerCta?.label ?? 'Contact'}
        </a>
      </div>
    </header>
  )
}
