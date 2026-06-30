import type { DemoSite, FAQContent } from '@/lib/types'

type Props = {
  site: DemoSite
  content: FAQContent
}

export function FAQSection({ content }: Props) {
  return (
    <section className="demo-section faq-section" id="faq">
      <div className="section-heading">
        <p className="eyebrow">FAQ</p>
        <h2>{content.title}</h2>
      </div>
      <div className="faq-list">
        {content.items.map((item) => (
          <details key={item.question}>
            <summary>{item.question}</summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  )
}
