import type { DemoSite, TrustContent } from '@/lib/types'

type Props = {
  site: DemoSite
  content: TrustContent
}

export function TrustSection({ content }: Props) {
  return (
    <section className="demo-section trust-section">
      <div className="section-heading section-heading--split">
        <div>
          <p className="eyebrow">Trust</p>
          <h2>{content.title}</h2>
        </div>
      </div>
      <div className="trust-grid">
        {content.points.map((point) => (
          <div className="trust-point" key={point}>
            <span aria-hidden="true">✓</span>
            <p>{point}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
