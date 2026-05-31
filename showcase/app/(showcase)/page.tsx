import Link from 'next/link'
import { demoSlots } from '@/lib/demos'

const EYEBROW = 'AzurSysTech demo library'
const TITLE = 'Шесть демо-сайтов для разных ниш и сценариев'
const SUBTITLE =
  'Каждый шаблон показывает подход к заявке, записи, каталогу или автоматизации первичного обращения — не просто дизайн, а рабочая логика.'

export default function ShowcaseLandingPage() {
  return (
    <main className="showcase-landing">
      {/* Hero */}
      <section className="showcase-hero">
        <div className="showcase-hero__content">
          <p className="eyebrow">{EYEBROW}</p>
          <h1>{TITLE}</h1>
          <p>{SUBTITLE}</p>
        </div>
      </section>

      {/* Demo grid */}
      <section className="demo-grid-section" aria-labelledby="demo-grid-title">
        <div className="section-heading">
          <p className="eyebrow">Шаблоны v1</p>
          <h2 id="demo-grid-title">Выберите нишу, чтобы увидеть демо</h2>
        </div>

        <div className="demo-preview-grid">
          {demoSlots.map((slot) => (
            <DemoCard key={slot.slug} slot={slot} />
          ))}
        </div>
      </section>
    </main>
  )
}

function DemoCard({ slot }: { slot: (typeof demoSlots)[number] }) {
  const isActive = slot.status === 'active' && slot.href
  const card = (
    <article
      className={`demo-preview-card ${isActive ? 'demo-preview-card--active' : 'demo-preview-card--planned'}`}
    >
      {/* Browser chrome */}
      <div className={`demo-preview-card__chrome bg-gradient-to-br ${slot.gradient}`}>
        {/* Window controls */}
        <div className="demo-preview-card__chrome-bar">
          <span className="demo-preview-card__chrome-dot" />
          <span className="demo-preview-card__chrome-dot" />
          <span className="demo-preview-card__chrome-dot" />
          <span className="demo-preview-card__chrome-url">{slot.slug}.fr</span>
        </div>

        {/* Large abbreviation */}
        <span className="demo-preview-card__abbr">{slot.abbr}</span>

        {/* Status badges */}
        {slot.status === 'planned' && (
          <span className="demo-preview-card__badge">bientôt</span>
        )}
        {slot.status === 'active' && (
          <span className="demo-preview-card__badge demo-preview-card__badge--live">live</span>
        )}
      </div>

      {/* Card body */}
      <div className="demo-preview-card__body">
        <p className="demo-preview-card__category">{slot.category}</p>
        <h3 className="demo-preview-card__title">{slot.title}</h3>
        <p className="demo-preview-card__desc">{slot.description}</p>

        <div className="demo-preview-card__footer">
          <span className="demo-preview-card__pattern">{slot.pattern}</span>
          {isActive ? (
            <span className="demo-preview-card__cta">
              Voir le site
              <svg viewBox="0 0 24 24" className="demo-preview-card__cta-icon" aria-hidden="true">
                <path fill="currentColor" d="M5 11h11.2l-4.6-4.6L13 5l7 7-7 7-1.4-1.4 4.6-4.6H5v-2z" />
              </svg>
            </span>
          ) : (
            <span className="demo-preview-card__planned-label">en préparation</span>
          )}
        </div>
      </div>
    </article>
  )

  if (isActive) {
    return (
      <Link href={slot.href!} className="demo-preview-card-link">
        {card}
      </Link>
    )
  }

  return card
}
