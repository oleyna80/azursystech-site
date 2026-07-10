import Image from 'next/image'
import type { PlumbingServiceItem, QuoteFormField, StatItem } from '@/lib/types'
import { plomberieContent } from './data'
import { PlomberieNav } from './Nav'
import { PlomberieFooter } from './Footer'
import styles from './home.module.css'
import iconStyles from './icons.module.css'

export function PlomberieHomePage() {
  const content = plomberieContent
  const phoneHref = 'tel:+33123456789'

  return (
    <>
      <PlomberieNav />
      <div className={styles.page} id="top">
      {/* Hero */}
      <section className={styles.hero} aria-labelledby="pl-hero-title">
        <div className={styles.heroMedia} aria-hidden="true">
          <Image
            alt={content.hero.image.alt}
            className={styles.heroImage}
            height={content.hero.image.height}
            priority
            src={content.hero.image.src}
            width={content.hero.image.width}
          />
        </div>
        <div className={styles.container}>
          <div className={styles.heroGrid}>
            <div className={styles.heroCopy}>
              <span className={styles.badge}>{content.hero.badge}</span>
              <h1 id="pl-hero-title">
                {content.hero.title}
                <span>{content.hero.highlightedLine}</span>
              </h1>
              <p>{content.hero.subtitle}</p>
              <div className={styles.actions} aria-label="Actions principales">
                <a className={`${styles.button} ${styles.buttonPrimary}`} href={content.hero.primaryCta.href}>
                  {content.hero.primaryCta.label}
                  <Icon name="arrow" />
                </a>
                <a className={`${styles.button} ${styles.buttonGhost}`} href={content.hero.secondaryCta.href}>
                  <Icon name="phone" />
                  {content.hero.secondaryCta.label}
                </a>
              </div>
              <ul className={styles.trustList} aria-label="Garanties">
                {content.hero.trustBullets.map((item) => (
                  <li key={item}>
                    <Icon name="check" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <QuoteForm content={content.hero.form} variant="hero" s={styles} />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className={styles.statsTight} aria-label="Chiffres clés">
        <div className={styles.container}>
          <div className={styles.stats}>
            {content.stats.map((item) => (
              <StatCard item={item} key={item.label} styles={styles} />
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className={styles.section} id="services" aria-labelledby="pl-services-title">
        <div className={styles.container}>
          <SectionHeader
            highlightedWord={content.services.highlightedWord}
            subtitle={content.services.subtitle}
            title={content.services.title}
            titleId="pl-services-title"
            styles={styles}
          />
          <div className={styles.services}>
            {content.services.items.map((item) => (
              <ServiceCard item={item} key={item.title} styles={styles} />
            ))}
          </div>
        </div>
      </section>

      {/* Why */}
      <section className={`${styles.section} ${styles.splitBand}`} id="about" aria-labelledby="pl-why-title">
        <div className={styles.container}>
          <div className={styles.split}>
            <div className={styles.why}>
              <h2 id="pl-why-title">
                {content.why.title} <span>{content.why.highlightedWord}</span> ?
              </h2>
              <ul>
                {content.why.points.map((point) => (
                  <li key={point}>
                    <Icon name="check" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.whyVisual}>
              <Image
                alt={content.why.image.alt}
                height={content.why.image.height}
                src={content.why.image.src}
                width={content.why.image.width}
              />
              <div className={styles.whyBadge}>
                <strong>{content.why.badgeTitle}</strong>
                <span>{content.why.badgeText}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency */}
      <section className={`${styles.section} ${styles.emergency}`} id="request" aria-labelledby="pl-emergency-title">
        <div className={styles.container}>
          <div className={styles.emergencyInner}>
            <div>
              <span>{content.emergency.label}</span>
              <h2 id="pl-emergency-title">{content.emergency.title}</h2>
              <p>{content.emergency.body}</p>
            </div>
            <div className={styles.emergencyActions}>
              <a className={styles.phoneCard} href={content.emergency.phoneHref}>
                <Icon name="phone" />
                {content.emergency.phone}
              </a>
              <a className={`${styles.button} ${styles.buttonLight}`} href={content.emergency.primaryCta.href}>
                {content.emergency.primaryCta.label}
              </a>
              <a className={`${styles.button} ${styles.buttonBlueOutline}`} href={content.emergency.secondaryCta.href}>
                {content.emergency.secondaryCta.label}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Area */}
      <section className={`${styles.section} ${styles.duo}`} id="zone" aria-labelledby="pl-area-title">
        <div className={styles.container}>
          <div className={styles.duoGrid}>
            <div>
              <h2 id="pl-area-title">{content.area.title}</h2>
              <p>{content.area.body}</p>
              <div className={styles.map} role="img" aria-label={content.area.mapLabel}>
                <div className={styles.mapRing} />
                <div className={styles.mapPin}>
                  <Icon name="pin" />
                  Paris
                </div>
                <span className={styles.mapLabel}>Nanterre</span>
                <span className={styles.mapLabel}>Saint-Denis</span>
                <span className={styles.mapLabel}>Créteil</span>
              </div>
            </div>
            <div className={styles.zoneList} aria-label="Communes et secteurs couverts">
              {content.area.zones.map((zone) => (
                <span key={zone}>{zone}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className={styles.section} id="avis" aria-labelledby="pl-reviews-title">
        <div className={styles.container}>
          <SectionHeader
            highlightedWord={content.reviews.highlightedWord}
            subtitle={content.reviews.subtitle}
            title={content.reviews.title}
            titleId="pl-reviews-title"
            styles={styles}
          />
          <div className={styles.reviews}>
            {content.reviews.items.map((review) => (
              <article className={styles.review} key={review.name}>
                <div className={styles.reviewTop}>
                  <span className={styles.google}>G</span>
                  <div>
                    <strong>{review.name}</strong>
                    <span>{review.location}</span>
                  </div>
                </div>
                <div className={styles.stars} aria-label="Note 5 sur 5">
                  ★★★★★
                </div>
                <p>“{review.text}”</p>
                <small>{review.date}</small>
              </article>
            ))}
          </div>
          <a className={styles.inlineLink} href={content.reviews.cta.href}>
            {content.reviews.cta.label}
            <Icon name="arrow" />
          </a>
        </div>
      </section>

      {/* Contact */}
      <section className={`${styles.section} ${styles.contact}`} id="contact" aria-labelledby="pl-contact-title">
        <div className={styles.container}>
          <div className={styles.contactGrid}>
            <div className={styles.contactCopy}>
              <h2 id="pl-contact-title">{content.contact.title}</h2>
              <p>{content.contact.body}</p>
              <div className={styles.contactInfo}>
                {content.contact.info.map((item) => {
                  const value = (
                    <>
                      <Icon name={item.icon} />
                      <span>
                        <small>{item.label}</small>
                        <strong>{item.value}</strong>
                      </span>
                    </>
                  )

                  return item.href ? (
                    <a href={item.href} key={item.label}>
                      {value}
                    </a>
                  ) : (
                    <div key={item.label}>{value}</div>
                  )
                })}
              </div>
            </div>
            <QuoteForm content={content.contact.form} variant="contact" s={styles} />
          </div>
        </div>
      </section>

      {/* Mobile CTA */}
      <div className={styles.mobileCta}>
        <a href={phoneHref}>
          <Icon name="phone" />
          Appeler
        </a>
        <a href="#contact">Devis gratuit</a>
      </div>
      </div>
      <PlomberieFooter />
    </>
  )
}

function SectionHeader({
  highlightedWord,
  subtitle,
  title,
  titleId,
  styles: s,
}: {
  highlightedWord: string
  subtitle: string
  title: string
  titleId: string
  styles: { [key: string]: string }
}) {
  return (
    <div className={s.sectionHeader}>
      <h2 id={titleId}>
        {title} <span>{highlightedWord}</span>
      </h2>
      <p>{subtitle}</p>
    </div>
  )
}

function QuoteForm({
  content,
  variant,
  s,
}: {
  content: { title: string; highlightedWord?: string; fields: QuoteFormField[]; submitLabel: string }
  variant: 'hero' | 'contact'
  s: { [key: string]: string }
}) {
  const formClass = variant === 'hero' ? s.formHero : s.formContact
  return (
    <form className={`${s.form} ${formClass}`}>
      <h2>
        {content.title}
        {content.highlightedWord ? <span>{content.highlightedWord}</span> : null}
      </h2>
      <div className={s.formGrid}>
        {content.fields.map((field: QuoteFormField) => (
          <FormField field={field} key={field.label} s={s} />
        ))}
      </div>
      <button type="button">
        {content.submitLabel}
        <Icon name="send" />
      </button>
    </form>
  )
}

function FormField({ field, s }: { field: QuoteFormField; s: { [key: string]: string } }) {
  const id = `field-${field.label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
  const isWide = field.type === 'textarea' || field.type === 'select'

  return (
    <label className={isWide ? `${s.formField} ${s.formFieldWide}` : s.formField} htmlFor={id}>
      <span>
        {field.label}
        {field.required ? ' *' : ''}
      </span>
      {field.type === 'select' ? (
        <select id={id} required={field.required}>
          <option value="">{field.placeholder ?? 'Sélectionnez une option'}</option>
          {field.options?.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      ) : field.type === 'textarea' ? (
        <textarea id={id} placeholder={field.placeholder} required={field.required} rows={5} />
      ) : (
        <input id={id} placeholder={field.placeholder} required={field.required} type={field.type} />
      )}
    </label>
  )
}

function StatCard({ item, styles: s }: { item: StatItem; styles: { [key: string]: string } }) {
  return (
    <article className={s.stat}>
      <Icon name={item.icon} />
      <div>
        <strong>{item.value}</strong>
        <span>{item.label}</span>
        {item.note ? <small>{item.note}</small> : null}
      </div>
    </article>
  )
}

function ServiceCard({ item, styles: s }: { item: PlumbingServiceItem; styles: { [key: string]: string } }) {
  return (
    <article className={s.service}>
      <Icon name={item.icon} />
      <h3>{item.title}</h3>
      <p>{item.description}</p>
      <a href={item.cta.href}>
        {item.cta.label}
        <Icon name="arrow" />
      </a>
    </article>
  )
}

function Icon({ name }: { name: string }) {
  const common = {
    'aria-hidden': true,
    className: iconStyles.icon,
    fill: 'none',
    stroke: 'currentColor',
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    strokeWidth: 2,
    viewBox: '0 0 24 24',
  }

  switch (name) {
    case 'phone':
      return (
        <svg {...common}>
          <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7A2 2 0 0 1 22 16.9Z" />
        </svg>
      )
    case 'check':
      return (
        <svg {...common}>
          <path d="m20 6-11 11-5-5" />
          <circle cx="12" cy="12" r="10" />
        </svg>
      )
    case 'arrow':
      return (
        <svg {...common}>
          <path d="M5 12h14" />
          <path d="m13 5 7 7-7 7" />
        </svg>
      )
    case 'send':
      return (
        <svg {...common}>
          <path d="m22 2-7 20-4-9-9-4Z" />
          <path d="M22 2 11 13" />
        </svg>
      )
    case 'pin':
      return (
        <svg {...common}>
          <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      )
    case 'mail':
      return (
        <svg {...common}>
          <rect height="16" rx="2" width="20" x="2" y="4" />
          <path d="m22 7-10 6L2 7" />
        </svg>
      )
    case 'clock':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
      )
    case 'bolt':
      return (
        <svg {...common}>
          <path d="m13 2-9 13h8l-1 7 9-13h-8Z" />
        </svg>
      )
    case 'users':
      return (
        <svg {...common}>
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.9" />
          <path d="M16 3.1a4 4 0 0 1 0 7.8" />
        </svg>
      )
    case 'award':
      return (
        <svg {...common}>
          <circle cx="12" cy="8" r="6" />
          <path d="M15.5 13.2 17 22l-5-3-5 3 1.5-8.8" />
        </svg>
      )
    case 'pipe':
      return (
        <svg {...common}>
          <path d="M4 5h8v5h4a4 4 0 0 1 4 4v5" />
          <path d="M4 10h8" />
          <path d="M17 19h6" />
        </svg>
      )
    case 'wrench':
      return (
        <svg {...common}>
          <path d="M14.7 6.3a4 4 0 0 0-5 5L3 18v3h3l6.7-6.7a4 4 0 0 0 5-5l-2.4 2.4-3-3Z" />
        </svg>
      )
    case 'gear':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.9 2.9l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.6V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.9-2.9l.1-.1A1.7 1.7 0 0 0 4.6 15 1.7 1.7 0 0 0 3 14H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.9-2.9l.1.1A1.7 1.7 0 0 0 9 4.6 1.7 1.7 0 0 0 10 3V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.9 2.9l-.1.1a1.7 1.7 0 0 0-.3 1.8 1.7 1.7 0 0 0 1.6 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" />
        </svg>
      )
    case 'home':
      return (
        <svg {...common}>
          <path d="m3 11 9-8 9 8" />
          <path d="M5 10v11h14V10" />
          <path d="M9 21v-6h6v6" />
        </svg>
      )
    case 'flame':
      return (
        <svg {...common}>
          <path d="M8.5 14.5A4.5 4.5 0 0 0 12 22a7 7 0 0 0 7-7c0-4-3-7-7-13-.5 3-2.5 4.5-4 6.2a6.8 6.8 0 0 0 .5 6.3Z" />
        </svg>
      )
    case 'shield':
      return (
        <svg {...common}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      )
    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="10" />
        </svg>
      )
  }
}
