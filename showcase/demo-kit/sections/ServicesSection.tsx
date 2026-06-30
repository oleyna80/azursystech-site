import type { DemoSite, ServicesContent } from '@/lib/types'

type Props = {
  site: DemoSite
  content: ServicesContent
}

export function ServicesSection({ content }: Props) {
  return (
    <section className="demo-section" id="services">
      <div className="section-heading section-heading--split">
        <div>
          <p className="eyebrow">Services</p>
          <h2>{content.title}</h2>
        </div>
        <p>{content.intro}</p>
      </div>
      <div className="service-grid">
        {content.items.map((item) => (
          <article className="service-item" key={item.title}>
            <span aria-hidden="true" className="service-item__icon">
              {iconFor(item.icon)}
            </span>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </article>
        ))}
      </div>
      <a className="text-link" href={content.cta.href}>
        {content.cta.label}
      </a>
    </section>
  )
}

function iconFor(icon: string) {
  switch (icon) {
    case 'water':
      return '≈'
    case 'drain':
      return '↧'
    case 'tools':
      return '+'
    case 'search':
      return '⌕'
    default:
      return '•'
  }
}
