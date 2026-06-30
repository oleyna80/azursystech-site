import type { DemoSite, FinalCTAContent } from '@/lib/types'

type Props = {
  site: DemoSite
  content: FinalCTAContent
}

export function FinalCTASection({ content }: Props) {
  return (
    <section className="final-cta" id="contact">
      <p className="eyebrow">Contact</p>
      <h2>{content.title}</h2>
      <p>{content.body}</p>
      <div className="button-row button-row--center">
        {content.actions.map((action, index) => (
          <a
            className={index === 0 ? 'button button--primary' : 'button button--secondary'}
            href={action.href}
            key={action.label}
          >
            {action.label}
          </a>
        ))}
      </div>
    </section>
  )
}
