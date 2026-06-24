import type { DemoSite, UrgentRequestContent } from '@/lib/types'

type Props = {
  site: DemoSite
  content: UrgentRequestContent
}

export function UrgentRequestSection({ content }: Props) {
  return (
    <section className="urgent-section" id="request">
      <div className="urgent-copy">
        <p className="eyebrow">Urgent intake</p>
        <h2>{content.title}</h2>
        <p>{content.body}</p>
        <a className="button button--primary" href={content.cta.href}>
          {content.cta.label}
        </a>
      </div>
      <div className="request-panel" aria-label="Request form preview">
        <div className="request-panel__header">
          <span>Срочная заявка</span>
          <strong>standard / urgent</strong>
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
