import type { DemoSite, UrgentRequestContent } from '@/lib/types'

type Props = {
  site: DemoSite
  content: UrgentRequestContent
}

export function UrgentRequestSection({ site, content }: Props) {
  return (
    <section className="urgent-section" id="request">
      <div className="urgent-copy">
        <p className="eyebrow">Demande prioritaire</p>
        <h2>{content.title}</h2>
        <p>{content.body}</p>
        <a className="button button--primary" href={content.cta.href}>
          {content.cta.label}
        </a>
      </div>
      <div className="request-panel" aria-label={`Apercu de demande ${site.title}`}>
        <div className="request-panel__header">
          <span>Demande client</span>
          <strong>standard / prioritaire</strong>
        </div>
        <div className="request-fields">
          {content.fields.map((field) => (
            <div className="request-field" key={field}>
              <span>{field}</span>
            </div>
          ))}
        </div>
        <p>{content.note}</p>
      </div>
    </section>
  )
}
