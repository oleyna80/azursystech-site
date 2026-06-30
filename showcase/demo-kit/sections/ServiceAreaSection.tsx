import type { DemoSite, ServiceAreaContent } from '@/lib/types'

type Props = {
  site: DemoSite
  content: ServiceAreaContent
}

export function ServiceAreaSection({ content, site }: Props) {
  return (
    <section className="area-section">
      <div>
        <p className="eyebrow">{content.badge}</p>
        <h2>{content.title}</h2>
        <p>{content.body}</p>
        <div className="area-tags">
          {content.areas.map((area) => (
            <span key={area}>{area}</span>
          ))}
        </div>
      </div>
      <div className="map-visual" aria-label="Service area visual">
        <span className="map-visual__ring map-visual__ring--one" />
        <span className="map-visual__ring map-visual__ring--two" />
        <span className="map-visual__pin">{site.title}</span>
      </div>
    </section>
  )
}
