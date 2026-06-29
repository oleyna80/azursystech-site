import type { AutomationContent, DemoSite } from '@/lib/types'

type Props = {
  site: DemoSite
  content: AutomationContent
}

export function AutomationSection({ content }: Props) {
  return (
    <section className="automation-section" id="automation">
      <div className="automation-copy">
        <p className="eyebrow">Qualification</p>
        <h2>{content.title}</h2>
        <p>{content.body}</p>
        <a className="button button--primary" href={content.cta.href}>
          {content.cta.label}
        </a>
      </div>
      <div className="automation-panel">
        <div className="flow-list">
          {content.flow.map((step) => (
            <div className="flow-row" key={step}>
              <span>✓</span>
              <strong>{step}</strong>
            </div>
          ))}
        </div>
        <div className="summary-box">
          <span>Résumé</span>
          {content.summary.map((item) => (
            <p key={item.label}>
              <strong>{item.label}:</strong> {item.value}
            </p>
          ))}
        </div>
      </div>
    </section>
  )
}
