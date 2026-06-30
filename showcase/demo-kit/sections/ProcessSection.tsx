import type { DemoSite, ProcessContent } from '@/lib/types'

type Props = {
  site: DemoSite
  content: ProcessContent
}

export function ProcessSection({ content }: Props) {
  return (
    <section className="demo-section process-section">
      <div className="section-heading">
        <p className="eyebrow">Process</p>
        <h2>{content.title}</h2>
      </div>
      <ol className="process-list">
        {content.steps.map((step, index) => (
          <li key={step}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <strong>{step}</strong>
          </li>
        ))}
      </ol>
      <p className="human-note">{content.humanControlNote}</p>
    </section>
  )
}
