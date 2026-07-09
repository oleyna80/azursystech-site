import Image from 'next/image'

import type {
  DemoSite,
  PreviewImage,
  QuoteFormContent,
  QuoteFormField,
  SalonBeautyContactItem,
  SalonBeautyContent,
  SalonBeautyService,
  SalonBeautyValue,
} from '@/lib/types'

type Props = {
  content: SalonBeautyContent
  pageSlug: string
  site: DemoSite
}

export function SalonBeautySection({ content, pageSlug, site }: Props) {
  const page = pageSlug || 'home'

  return (
    <div className="salon-page" id="top">
      {page === 'services' ? (
        <ServicesExperience content={content} />
      ) : page === 'about' ? (
        <AboutExperience content={content} />
      ) : page === 'contact' ? (
        <ContactExperience content={content} />
      ) : (
        <HomeExperience content={content} />
      )}

      <div className="salon-mobile-cta">
        <a href={site.headerCta?.href ?? '/demo/salon-beaute/contact'}>
          <Icon name="calendar" />
          Rendez-vous
        </a>
      </div>

      <SalonStyles />
    </div>
  )
}

function HomeExperience({ content }: { content: SalonBeautyContent }) {
  return (
    <>
      <section className="salon-hero" aria-labelledby="salon-hero-title">
        <div className="salon-hero__backdrop" aria-hidden="true" />
        <div className="salon-hero__overlay" aria-hidden="true" />
        <div className="salon-hero__fade" aria-hidden="true" />
        <div className="salon-container salon-hero__content">
          <div className="salon-hero__copy">
            <span className="salon-eyebrow">{content.hero.eyebrow}</span>
            <h1 id="salon-hero-title">{content.hero.title}</h1>
            <p>{content.hero.subtitle}</p>
            <div className="salon-actions" aria-label="Actions principales">
              <a className="salon-button salon-button--primary" href={content.hero.primaryCta.href}>
                <Icon name="calendar" />
                {content.hero.primaryCta.label}
              </a>
              <a className="salon-button salon-button--outline" href={content.hero.secondaryCta.href}>
                {content.hero.secondaryCta.label}
                <Icon name="arrow" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="salon-values-band" aria-label="Points forts">
        <div className="salon-container salon-values">
          {content.values.map((value) => (
            <ValueItem item={value} key={value.label} />
          ))}
        </div>
      </section>

      <SalonDivider />

      <section className="salon-container salon-booking" aria-labelledby="salon-booking-title">
        <div className="salon-booking__copy">
          <h2 id="salon-booking-title">{content.booking.title}</h2>
          <p>{content.booking.body}</p>
          <a className="salon-button salon-button--primary" href={content.booking.cta.href}>
            <Icon name="calendar" />
            {content.booking.cta.label}
          </a>
        </div>
        <SalonVisual image={content.booking.image} label={content.booking.image.alt} variant="booking" />
      </section>

      <SalonDivider />

      <section className="salon-section" aria-labelledby="salon-popular-title">
        <div className="salon-container">
          <SectionHeading
            eyebrow="Nos prestations"
            title="Nos soins populaires"
            titleId="salon-popular-title"
            action={{ label: 'Voir tous nos soins', href: '/demo/salon-beaute/services' }}
          />
          <div className="salon-popular-grid">
            {content.popularServices.map((service) => (
              <ServiceTile service={service} key={service.title} />
            ))}
          </div>
        </div>
      </section>

      <SalonDivider />

      <section className="salon-container salon-satisfaction" aria-labelledby="salon-satisfaction-title">
        <div>
          <h2 id="salon-satisfaction-title">{content.satisfaction.title}</h2>
          <p>{content.satisfaction.body}</p>
          <a className="salon-button salon-button--primary" href={content.satisfaction.cta.href}>
            {content.satisfaction.cta.label}
            <Icon name="arrow" />
          </a>
        </div>
        <SalonVisual image={content.satisfaction.image} label={content.satisfaction.image.alt} variant="lounge" />
      </section>
    </>
  )
}

function ServicesExperience({ content }: { content: SalonBeautyContent }) {
  return (
    <>
      <section className="salon-services-page" id="services" aria-labelledby="salon-services-title">
        <div className="salon-container salon-page-hero">
          <div>
            <span className="salon-eyebrow">{content.servicesPage.eyebrow}</span>
            <h2 id="salon-services-title">{content.servicesPage.title}</h2>
            <p>{content.servicesPage.subtitle}</p>
          </div>
          <SalonVisual image={content.servicesPage.image} label={content.servicesPage.image.alt} variant="services" />
        </div>
        <div className="salon-container salon-service-list">
          {content.servicesPage.services.map((service) => (
            <ServiceRow bookingHref={content.servicesPage.adviceCta.href} service={service} key={service.title} />
          ))}
        </div>
        <div className="salon-container salon-advice">
          <div>
            <h3>{content.servicesPage.adviceTitle}</h3>
            <p>{content.servicesPage.adviceBody}</p>
            <a className="salon-button salon-button--primary" href={content.servicesPage.adviceCta.href}>
              {content.servicesPage.adviceCta.label}
              <Icon name="arrow" />
            </a>
          </div>
          <SalonVisual image={content.servicesPage.adviceImage} label={content.servicesPage.adviceImage.alt} variant="products" />
        </div>
      </section>
    </>
  )
}

function AboutExperience({ content }: { content: SalonBeautyContent }) {
  return (
    <>
      <section className="salon-section" id="about" aria-labelledby="salon-about-title">
        <div className="salon-container salon-about-hero">
          <div>
            <h2 id="salon-about-title">{content.about.title}</h2>
            <span className="salon-flourish" aria-hidden="true" />
            <p>{content.about.intro}</p>
          </div>
          <SalonVisual image={content.about.image} label={content.about.image.alt} variant="about" />
        </div>
        <div className="salon-container salon-values salon-values--about" aria-label="Valeurs du salon">
          {content.about.values.map((value) => (
            <ValueItem item={value} key={value.label} />
          ))}
        </div>
        <div className="salon-container salon-philosophy">
          <div>
            <h3>{content.about.philosophyTitle}</h3>
            {content.about.philosophyText.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <SalonVisual image={content.about.philosophyImage} label={content.about.philosophyImage.alt} variant="products" />
        </div>
        <div className="salon-container salon-stats" aria-label="Chiffres du salon">
          {content.about.stats.map((stat) => (
            <div className="salon-stat" key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
        <div className="salon-container salon-gallery" aria-labelledby="salon-gallery-title">
          <h3 id="salon-gallery-title">{content.about.galleryTitle}</h3>
          <div>
            {content.about.gallery.map((item, index) => (
              <figure key={item.title}>
                <SalonVisual
                  compact
                  image={item.image}
                  label={item.image.alt}
                  variant={galleryVisualVariants[index] ?? 'gallery-salon'}
                />
                <figcaption>{item.title}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="salon-section salon-reviews" id="avis" aria-labelledby="salon-reviews-title">
        <div className="salon-container">
          <SectionHeading eyebrow="Avis clients" title={content.reviews.title} titleId="salon-reviews-title" />
          <div className="salon-review-grid">
            {content.reviews.items.map((review) => (
              <article key={review.name}>
                <div className="salon-stars" aria-label="Note 5 sur 5">
                  ★★★★★
                </div>
                <p>“{review.text}”</p>
                <strong>{review.name}</strong>
                <span>{review.detail}</span>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

function ContactExperience({ content }: { content: SalonBeautyContent }) {
  return (
    <>
      <section className="salon-contact" id="contact" aria-labelledby="salon-contact-title">
        <div className="salon-container salon-page-hero salon-contact-hero">
          <div>
            <span className="salon-flourish" aria-hidden="true" />
            <h2 id="salon-contact-title">{content.contact.title}</h2>
            <p>{content.contact.subtitle}</p>
          </div>
          <SalonVisual image={content.contact.image} label={content.contact.image.alt} variant="contact" />
        </div>
        <div className="salon-container salon-contact-card">
          <div className="salon-contact-info">
            <h3>Nos coordonnées</h3>
            {content.contact.info.map((item) => (
              <ContactItem item={item} key={item.label} />
            ))}
          </div>
          <div className="salon-map" role="img" aria-label="Carte stylisée du salon à Paris">
            <span />
          </div>
        </div>
        <div className="salon-container salon-message" id="formulaire">
          <div className="salon-message__intro">
            <h3>{content.contact.form.title}</h3>
            <p>Remplissez le formulaire ci-contre et nous vous répondrons dans les plus brefs délais.</p>
            <SalonVisual compact image={content.servicesPage.adviceImage} label={content.servicesPage.adviceImage.alt} variant="products" />
          </div>
          <SalonForm content={content.contact.form} note={content.contact.note} />
        </div>
      </section>
    </>
  )
}

type SalonVisualVariant =
  | 'hero'
  | 'booking'
  | 'services'
  | 'about'
  | 'products'
  | 'lounge'
  | 'contact'
  | 'gallery-salon'
  | 'gallery-products'
  | 'gallery-treatment'
  | 'gallery-lounge'
  | 'service-coiffure'
  | 'service-coloration'
  | 'service-soins-du-visage'
  | 'service-manucure-pedicure'
  | 'service-epilation'

const galleryVisualVariants: SalonVisualVariant[] = [
  'gallery-salon',
  'gallery-products',
  'gallery-treatment',
  'gallery-lounge',
]

const valueDescriptions: Record<string, string> = {
  'Professionnels expérimentés': "Plus de 7 ans d'expertise beauté",
  'Produits de qualité': 'Sélectionnés pour votre peau',
  'Ambiance relaxante': 'Un espace pensé pour votre bien-être',
  'Prise de rendez-vous facile': 'En ligne, en quelques secondes',
}

function SalonVisual({
  compact = false,
  image,
  label,
  variant,
}: {
  compact?: boolean
  image?: PreviewImage
  label: string
  variant: SalonVisualVariant
}) {
  const imageUrl = image?.src.trim()
  const isRoomVisual = roomVisualVariants.has(variant)
  const isStillLifeVisual = stillLifeVisualVariants.has(variant)
  const photoSrc = imageUrl || null
  const hasPhoto = Boolean(photoSrc)
  const showRoomFallback = !hasPhoto && isRoomVisual
  const showStillLifeFallback = !hasPhoto && isStillLifeVisual

  return (
    <div
      aria-label={label}
      className={`${compact ? 'salon-visual salon-visual--compact' : 'salon-visual'} salon-visual--${variant} ${
        hasPhoto ? 'salon-visual--photo' : 'salon-visual--placeholder'
      } ${showRoomFallback ? 'salon-visual--room' : ''} ${showStillLifeFallback ? 'salon-visual--still-life' : ''}`}
      role="img"
    >
      {photoSrc ? (
        <Image
          alt=""
          aria-hidden="true"
          className="salon-visual__image"
          fill
          priority={variant === 'hero'}
          sizes={compact ? '(max-width: 860px) 100vw, 320px' : '(max-width: 860px) 100vw, 50vw'}
          src={photoSrc}
        />
      ) : null}
      {showRoomFallback ? <SalonRoomVisual variant={variant} /> : null}
      {showStillLifeFallback ? <SalonStillLifeVisual variant={variant} /> : null}
      {!hasPhoto && !showRoomFallback && !showStillLifeFallback ? (
        <span className="salon-visual__caption">Salon Beauté</span>
      ) : null}
    </div>
  )
}

const roomVisualVariants = new Set<SalonVisualVariant>([
  'booking',
  'about',
  'lounge',
  'gallery-salon',
  'gallery-treatment',
  'gallery-lounge',
])

const stillLifeVisualVariants = new Set<SalonVisualVariant>([
  'products',
  'contact',
  'gallery-products',
  'service-epilation',
])

function SalonRoomVisual({ variant }: { variant: SalonVisualVariant }) {
  return (
    <div aria-hidden="true" className={`salon-room salon-room--${variant}`}>
      <span className="salon-room__light salon-room__light--left" />
      <span className="salon-room__light salon-room__light--right" />
      <span className="salon-room__mirror salon-room__mirror--one" />
      <span className="salon-room__mirror salon-room__mirror--two" />
      <span className="salon-room__counter" />
      <span className="salon-room__chair salon-room__chair--one" />
      <span className="salon-room__chair salon-room__chair--two" />
      <span className="salon-room__plant salon-room__plant--one" />
      <span className="salon-room__plant salon-room__plant--two" />
      <span className="salon-room__shelf" />
      <span className="salon-room__bottles" />
    </div>
  )
}

function SalonStillLifeVisual({ variant }: { variant: SalonVisualVariant }) {
  return (
    <div aria-hidden="true" className={`salon-still-life salon-still-life--${variant}`}>
      <span className="salon-still-life__shadow" />
      <span className="salon-still-life__book" />
      <span className="salon-still-life__vase" />
      <span className="salon-still-life__stems" />
      <span className="salon-still-life__bottle salon-still-life__bottle--tall" />
      <span className="salon-still-life__bottle salon-still-life__bottle--small" />
      <span className="salon-still-life__candle" />
      <span className="salon-still-life__jar" />
      <span className="salon-still-life__towel" />
      {variant === 'contact' ? <span className="salon-still-life__frame" /> : null}
    </div>
  )
}

function serviceVisualVariant(title: string): SalonVisualVariant {
  const normalized = title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

  if (normalized.includes('coloration')) return 'service-coloration'
  if (normalized.includes('visage')) return 'service-soins-du-visage'
  if (normalized.includes('manucure')) return 'service-manucure-pedicure'
  if (normalized.includes('epilation')) return 'service-epilation'
  return 'service-coiffure'
}

function SectionHeading({
  action,
  eyebrow,
  title,
  titleId,
}: {
  action?: { label: string; href: string }
  eyebrow: string
  title: string
  titleId: string
}) {
  return (
    <div className="salon-section-heading">
      <div>
        <span>{eyebrow}</span>
        <h2 id={titleId}>{title}</h2>
      </div>
      {action ? (
        <a href={action.href}>
          {action.label}
          <Icon name="arrow" />
        </a>
      ) : null}
    </div>
  )
}

function SalonDivider() {
  return (
    <div className="salon-divider" aria-hidden="true">
      <span className="salon-divider__rule" />
    </div>
  )
}

function ValueItem({ item }: { item: SalonBeautyValue }) {
  const description = valueDescriptions[item.label]

  return (
    <div className="salon-value">
      <Icon name={item.icon} />
      <div>
        <strong>{item.label}</strong>
        {description ? <span>{description}</span> : null}
      </div>
    </div>
  )
}

function ServiceTile({ service }: { service: SalonBeautyService }) {
  return (
    <article className="salon-service-tile">
      <SalonVisual compact image={service.image} label={service.image.alt} variant={serviceVisualVariant(service.title)} />
      <div className="salon-service-tile__body">
        <h3>{service.title}</h3>
        <p>
          À partir de <strong>{service.price.replace(/^à partir de\s+/i, '')}</strong>
        </p>
      </div>
    </article>
  )
}

function ServiceRow({ bookingHref, service }: { bookingHref: string; service: SalonBeautyService }) {
  return (
    <article className="salon-service-row">
      <SalonVisual compact image={service.image} label={service.image.alt} variant={serviceVisualVariant(service.title)} />
      <div className="salon-service-row__icon">
        <Icon name={service.icon} />
      </div>
      <div className="salon-service-row__copy">
        <h3>{service.title}</h3>
        <p>{service.description}</p>
      </div>
      <div className="salon-service-row__booking">
        <span>{service.price}</span>
        <a className="salon-button salon-button--primary" href={bookingHref}>
          Réserver
        </a>
      </div>
    </article>
  )
}

function ContactItem({ item }: { item: SalonBeautyContactItem }) {
  const content = (
    <>
      <Icon name={item.icon} />
      <span>
        <strong>{item.label}</strong>
        {item.value.split('\n').map((line) => (
          <small key={line}>{line}</small>
        ))}
      </span>
    </>
  )

  return item.href ? <a href={item.href}>{content}</a> : <div>{content}</div>
}

function SalonForm({ content, note }: { content: QuoteFormContent; note: string }) {
  return (
    <form className="salon-form">
      <div className="salon-form__grid">
        {content.fields.map((field) => (
          <FormField field={field} key={field.label} />
        ))}
      </div>
      <button type="button">
        {content.submitLabel}
        <Icon name="send" />
      </button>
      <p>
        <Icon name="lock" />
        {note}
      </p>
    </form>
  )
}

function FormField({ field }: { field: QuoteFormField }) {
  const id = `salon-${field.label
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')}`
  const wide = field.type === 'textarea'

  return (
    <label className={wide ? 'salon-form__field salon-form__field--wide' : 'salon-form__field'} htmlFor={id}>
      <span>{field.label}</span>
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

function Icon({ name }: { name: string }) {
  const common = {
    'aria-hidden': true,
    className: 'salon-icon',
    fill: 'none',
    stroke: 'currentColor',
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    strokeWidth: 1.8,
    viewBox: '0 0 24 24',
  }

  switch (name) {
    case 'calendar':
      return (
        <svg {...common}>
          <path d="M7 2v4M17 2v4M3 9h18M5 5h14a2 2 0 0 1 2 2v15H3V7a2 2 0 0 1 2-2Z" />
          <path d="M8 13h.1M12 13h.1M16 13h.1M8 17h.1M12 17h.1M16 17h.1" />
        </svg>
      )
    case 'arrow':
      return (
        <svg {...common}>
          <path d="M5 12h14" />
          <path d="m13 5 7 7-7 7" />
        </svg>
      )
    case 'expert':
      return (
        <svg {...common}>
          <circle cx="12" cy="7" r="4" />
          <path d="M4 22a8 8 0 0 1 16 0" />
        </svg>
      )
    case 'leaf':
      return (
        <svg {...common}>
          <path d="M20 4C10 4 5 9 5 19c10 0 15-5 15-15Z" />
          <path d="M5 19 16 8" />
        </svg>
      )
    case 'lotus':
      return (
        <svg {...common}>
          <path d="M12 20c-4-3-6-6-6-10 3 0 5 2 6 5 1-3 3-5 6-5 0 4-2 7-6 10Z" />
          <path d="M12 15C9 12 8 8 12 3c4 5 3 9 0 12Z" />
        </svg>
      )
    case 'scissors':
      return (
        <svg {...common}>
          <circle cx="6" cy="7" r="3" />
          <circle cx="6" cy="17" r="3" />
          <path d="M8.5 8.5 20 20M8.5 15.5 20 4" />
        </svg>
      )
    case 'brush':
      return (
        <svg {...common}>
          <path d="m14 4 6 6-9 9H5v-6Z" />
          <path d="M4 20h7" />
        </svg>
      )
    case 'polish':
      return (
        <svg {...common}>
          <path d="M9 2h6v5H9zM8 7h8l1 15H7Z" />
        </svg>
      )
    case 'chat':
      return (
        <svg {...common}>
          <path d="M21 12a8 8 0 0 1-8 8H7l-4 3 1.3-5A8 8 0 1 1 21 12Z" />
        </svg>
      )
    case 'pin':
      return (
        <svg {...common}>
          <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      )
    case 'phone':
      return (
        <svg {...common}>
          <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7A2 2 0 0 1 22 16.9Z" />
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
    case 'social':
      return (
        <svg {...common}>
          <circle cx="7" cy="7" r="3" />
          <circle cx="17" cy="7" r="3" />
          <circle cx="7" cy="17" r="3" />
          <circle cx="17" cy="17" r="3" />
        </svg>
      )
    case 'send':
      return (
        <svg {...common}>
          <path d="m22 2-7 20-4-9-9-4Z" />
          <path d="M22 2 11 13" />
        </svg>
      )
    case 'lock':
      return (
        <svg {...common}>
          <rect height="11" rx="2" width="14" x="5" y="11" />
          <path d="M8 11V8a4 4 0 0 1 8 0v3" />
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

function SalonStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:wght@400;500;600;700&display=swap');

      [data-demo='salon-beaute'] {
        --salon-display: 'Playfair Display', Didot, Georgia, serif;
        --salon-body: Inter, 'Segoe UI', system-ui, sans-serif;
        background: #f8f0ea;
        color: #1a1a1a;
        font-family: var(--salon-body);
        /* overflow-x: hidden removed — breaks position: sticky on .demo-nav */
      }

      [data-demo='salon-beaute'] .demo-nav {
        background: transparent;
        backdrop-filter: none;
        -webkit-backdrop-filter: none;
        border-bottom: 1px solid transparent;
        box-shadow: none;
        left: 0;
        min-height: 72px;
        padding: 0 clamp(1.25rem, 5vw, 4rem);
        position: absolute;
        right: 0;
        top: 0;
        z-index: 30;
      }

      [data-demo='salon-beaute'] .demo-nav__mark {
        color: #8b2535;
      }

      [data-demo='salon-beaute'] .demo-nav__brand strong {
        color: #1a1a1a;
        font-family: var(--salon-display);
        font-size: 1.55rem;
        letter-spacing: 0;
      }

      [data-demo='salon-beaute'] .demo-footer__brand strong {
        color: #ffffff;
        font-family: var(--salon-display);
        font-size: 1.55rem;
      }

      [data-demo='salon-beaute'] .demo-nav__brand small {
        color: #6b6460;
      }

      [data-demo='salon-beaute'] .demo-nav nav a {
        color: #1a1a1a;
        font-weight: 500;
      }

      [data-demo='salon-beaute'] .demo-nav nav a:hover {
        color: #8b2535;
      }

      [data-demo='salon-beaute'] .demo-nav__phone {
        display: none;
      }

      [data-demo='salon-beaute'] .demo-nav__cta {
        background: #8b2535;
        border-radius: 999px;
        box-shadow: 0 4px 14px rgba(139, 37, 53, 0.28);
        min-height: 2.75rem;
      }

      [data-demo='salon-beaute'] .demo-footer {
        background:
          radial-gradient(circle at 0 0, rgba(154, 79, 86, 0.22), transparent 28rem),
          radial-gradient(circle at 82% 15%, rgba(232, 221, 214, 0.12), transparent 22rem),
          #1a1a1a;
        color: #ffffff;
      }

      [data-demo='salon-beaute'] .demo-footer a,
      [data-demo='salon-beaute'] .demo-footer span {
        color: rgba(255, 255, 255, 0.78);
      }

      [data-demo='salon-beaute'] .demo-footer__social a {
        border-color: rgba(255, 255, 255, 0.22);
        color: #ffffff;
      }

      [data-demo='salon-beaute'] .demo-return {
        border-color: rgba(139, 37, 53, 0.22);
        color: #8b2535;
      }

      .salon-page {
        --salon-display: 'Playfair Display', Didot, Georgia, serif;
        --salon-body: Inter, 'Segoe UI', system-ui, sans-serif;
        --salon-ink: #1a1a1a;
        --salon-muted: #6b6460;
        --salon-rose: #8b2535;
        --salon-rose-deep: #a02940;
        --salon-blush: #efd7d3;
        --salon-petal: #fff1ee;
        --salon-cream: #f8f0ea;
        --salon-sage: #8fa57c;
        --salon-sage-deep: #647553;
        --salon-gold: #c99058;
        --salon-border: #e8e8e8;
        --salon-shadow: rgba(84, 55, 51, 0.13);
        background: #f8f0ea;
        color: var(--salon-ink);
        font-family: var(--salon-body);
        max-width: 100vw;
        overflow-x: hidden;
        position: relative;
        width: 100%;
      }

      .salon-page *,
      .salon-page *::before,
      .salon-page *::after {
        box-sizing: border-box;
      }

      .salon-container {
        margin-inline: auto;
        max-width: min(1220px, 100vw);
        padding-inline: clamp(1.1rem, 4vw, 2.4rem);
        width: 100%;
      }

      .salon-hero {
        min-height: auto;
        overflow: hidden;
        padding: clamp(2.2rem, 5vw, 4rem) 0 clamp(1.1rem, 3vw, 2rem);
      }

      .salon-hero__grid,
      .salon-page-hero,
      .salon-about-hero {
        align-items: center;
        display: grid;
        gap: clamp(1.8rem, 4vw, 3.2rem);
        grid-template-columns: minmax(380px, 1.1fr) minmax(320px, 0.9fr);
        min-width: 0;
      }

      .salon-hero__copy {
        max-width: 42rem;
        min-width: 0;
      }

      .salon-eyebrow,
      .salon-section-heading span {
        color: var(--salon-rose);
        display: block;
        font-size: 0.9rem;
        font-weight: 800;
        letter-spacing: 0.02em;
        margin-bottom: 1rem;
      }

      .salon-hero h1,
      .salon-page-hero h2,
      .salon-about-hero h2,
      .salon-section-heading h2,
      .salon-booking h2,
      .salon-satisfaction h2,
      .salon-contact-info h3,
      .salon-message h3,
      .salon-philosophy h3,
      .salon-gallery h3 {
        color: var(--salon-ink);
        font-family: var(--salon-display);
        font-weight: 500;
        letter-spacing: 0;
        line-height: 1;
        margin: 0;
      }

      .salon-hero h1 {
        font-size: clamp(3rem, 4.5vw, 4.4rem);
        line-height: 1.04;
        max-width: 19ch;
        text-wrap: balance;
      }

      .salon-hero p,
      .salon-page-hero p,
      .salon-about-hero p,
      .salon-booking p,
      .salon-satisfaction p,
      .salon-message p,
      .salon-philosophy p {
        color: var(--salon-muted);
        font-size: clamp(1rem, 1.5vw, 1.15rem);
        line-height: 1.8;
        overflow-wrap: break-word;
      }

      .salon-hero__media {
        align-self: center;
        border-radius: 20px;
        max-height: clamp(24rem, 38vw, 34rem); /* cap height so it doesn't overflow buttons */
        overflow: hidden;
        position: relative;
        width: 100%;
      }

      .salon-hero__media .salon-visual,
      .salon-booking > .salon-visual,
      .salon-satisfaction > .salon-visual,
      .salon-page-hero > .salon-visual,
      .salon-about-hero > .salon-visual,
      .salon-philosophy > .salon-visual,
      .salon-advice > .salon-visual,
      .salon-message__intro .salon-visual {
        height: 100%;
        width: 100%;
      }

      .salon-visual {
        aspect-ratio: 1.56;
        background:
          radial-gradient(circle at 18% 18%, #fffdfb, transparent 18rem),
          linear-gradient(135deg, #fffaf7 0%, #f1e2dd 58%, #d8b8ad 100%);
        background-position: center;
        background-size: cover;
        border: 1px solid rgba(232, 221, 214, 0.88);
        border-radius: 24px;
        box-shadow:
          inset 0 0 0 1px rgba(255, 255, 255, 0.46),
          0 24px 64px rgba(84, 55, 51, 0.14);
        min-height: 17rem;
        overflow: hidden;
        position: relative;
        transform: translateZ(0);
        transition:
          box-shadow 180ms ease,
          transform 180ms ease;
      }

      .salon-visual__image {
        display: block;
        filter: sepia(0.08) saturate(1.2) contrast(0.98) brightness(1.06);
        height: 100%;
        inset: 0;
        object-fit: cover;
        object-position: center;
        position: absolute;
        transform: scale(1.01);
        width: 100%;
      }

      .salon-visual::before {
        background:
          radial-gradient(circle at 22% 18%, rgba(255, 255, 255, 0.52), transparent 20rem),
          linear-gradient(90deg, rgba(250, 247, 244, 0.12), transparent 44%),
          linear-gradient(0deg, rgba(31, 31, 31, 0.16), transparent 34%);
        content: '';
        inset: 0;
        pointer-events: none;
        position: absolute;
      }

      .salon-visual::after {
        background:
          linear-gradient(135deg, rgba(255, 255, 255, 0.38), transparent 28%),
          linear-gradient(180deg, transparent 62%, rgba(154, 79, 86, 0.08));
        border-radius: inherit;
        content: '';
        inset: 0;
        pointer-events: none;
        position: absolute;
      }

      .salon-visual--photo:hover {
        box-shadow:
          inset 0 0 0 1px rgba(255, 255, 255, 0.54),
          0 30px 72px rgba(84, 55, 51, 0.18);
        transform: translateY(-2px);
      }

      .salon-visual--placeholder {
        align-items: end;
        display: grid;
        justify-items: start;
      }

      .salon-visual--placeholder::before {
        background:
          radial-gradient(circle at 72% 22%, rgba(255, 255, 255, 0.62), transparent 15rem),
          linear-gradient(135deg, rgba(154, 79, 86, 0.08), transparent 38%),
          linear-gradient(180deg, transparent, rgba(31, 31, 31, 0.07));
      }

      .salon-visual__caption {
        background: rgba(255, 255, 255, 0.78);
        border: 1px solid rgba(232, 221, 214, 0.9);
        border-radius: 999px;
        bottom: 1.1rem;
        color: var(--salon-rose);
        font-size: 0.82rem;
        font-weight: 800;
        left: 1.1rem;
        padding: 0.45rem 0.75rem;
        z-index: 2;
      }

      .salon-visual--room,
      .salon-visual--still-life {
        background:
          radial-gradient(circle at 22% 18%, rgba(255, 255, 255, 0.88), transparent 16rem),
          linear-gradient(135deg, #fffaf7 0%, #f2dfd7 58%, #dfbfb5 100%);
      }

      .salon-room,
      .salon-still-life {
        inset: 0;
        overflow: hidden;
        position: absolute;
        z-index: 1;
      }

      .salon-room {
        background:
          radial-gradient(ellipse at 48% 20%, rgba(255, 255, 255, 0.9), transparent 25rem),
          linear-gradient(90deg, rgba(255, 255, 255, 0.82), rgba(250, 231, 224, 0.42) 54%, rgba(218, 175, 158, 0.42)),
          linear-gradient(180deg, #fffaf7 0 60%, #ebd8cf 60% 100%);
      }

      .salon-room::before {
        background:
          linear-gradient(90deg, rgba(255, 255, 255, 0.62), transparent 46%),
          repeating-linear-gradient(90deg, rgba(184, 142, 119, 0.22) 0 1px, transparent 1px 4.6rem),
          linear-gradient(180deg, rgba(232, 202, 187, 0.18), rgba(177, 132, 107, 0.28));
        bottom: 0;
        content: '';
        height: 31%;
        left: 0;
        position: absolute;
        right: 0;
        transform: skewX(-8deg) scaleX(1.2);
        transform-origin: left bottom;
      }

      .salon-room::after {
        background:
          radial-gradient(circle at 22% 25%, rgba(255, 255, 255, 0.62), transparent 13rem),
          radial-gradient(circle at 92% 12%, rgba(255, 244, 229, 0.62), transparent 12rem);
        content: '';
        inset: 0;
        position: absolute;
      }

      .salon-room > span,
      .salon-still-life > span {
        display: block;
        position: absolute;
      }

      .salon-room__mirror {
        background:
          radial-gradient(ellipse at 50% 25%, rgba(255, 255, 255, 0.82), transparent 38%),
          linear-gradient(145deg, rgba(255, 255, 255, 0.72), rgba(241, 218, 206, 0.32));
        border: 5px solid rgba(189, 137, 88, 0.82);
        border-radius: 999px 999px 42% 42%;
        box-shadow:
          inset 0 0 0 5px rgba(255, 248, 243, 0.92),
          0 20px 38px rgba(111, 70, 50, 0.16);
        height: 55%;
        top: 12%;
        width: 15%;
        z-index: 3;
      }

      .salon-room__mirror--one {
        left: 35%;
      }

      .salon-room__mirror--two {
        left: 56%;
      }

      .salon-room__counter {
        background:
          linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(243, 224, 213, 0.94)),
          linear-gradient(90deg, transparent 0 24%, rgba(213, 185, 169, 0.55) 24% 25%, transparent 25% 49%, rgba(213, 185, 169, 0.55) 49% 50%, transparent 50% 74%, rgba(213, 185, 169, 0.55) 74% 75%, transparent 75%);
        border: 1px solid rgba(218, 197, 184, 0.9);
        border-radius: 14px 14px 8px 8px;
        bottom: 25%;
        box-shadow: 0 22px 40px rgba(115, 74, 55, 0.15);
        height: 18%;
        left: 24%;
        width: 58%;
        z-index: 4;
      }

      .salon-room__chair {
        background:
          radial-gradient(ellipse at 50% 15%, rgba(255, 255, 255, 0.3), transparent 45%),
          linear-gradient(180deg, #e6c0ad, #c99b83);
        border-radius: 44% 44% 24px 24px;
        bottom: 8%;
        box-shadow:
          0 34px 0 -22px rgba(133, 86, 62, 0.55),
          0 28px 30px rgba(98, 61, 48, 0.18);
        height: 25%;
        width: 15%;
        z-index: 5;
      }

      .salon-room__chair::after {
        background: rgba(92, 72, 64, 0.6);
        content: '';
        height: 38%;
        left: 50%;
        position: absolute;
        top: 75%;
        transform: translateX(-50%);
        width: 3px;
      }

      .salon-room__chair--one {
        left: 35%;
      }

      .salon-room__chair--two {
        left: 58%;
      }

      .salon-room__plant {
        background:
          radial-gradient(ellipse at 22% 28%, #8fa57c 0 18%, transparent 19%),
          radial-gradient(ellipse at 68% 22%, #6f835f 0 17%, transparent 18%),
          radial-gradient(ellipse at 42% 58%, #9caf86 0 18%, transparent 19%),
          linear-gradient(90deg, transparent 38%, #6f5c43 39% 43%, transparent 44%);
        height: 36%;
        width: 10%;
        z-index: 5;
      }

      .salon-room__plant::after {
        background: linear-gradient(180deg, #f1dfd3, #c99b83);
        border-radius: 0 0 18px 18px;
        bottom: 0;
        content: '';
        height: 22%;
        left: 25%;
        position: absolute;
        width: 50%;
      }

      .salon-room__plant--one {
        bottom: 14%;
        left: 7%;
      }

      .salon-room__plant--two {
        bottom: 16%;
        right: 8%;
        transform: scale(0.82);
      }

      .salon-room__shelf {
        background:
          linear-gradient(90deg, rgba(171, 119, 76, 0.42), transparent 7% 93%, rgba(171, 119, 76, 0.42)),
          repeating-linear-gradient(180deg, rgba(171, 119, 76, 0.48) 0 2px, transparent 2px 2.2rem);
        border-radius: 12px;
        height: 42%;
        right: 5%;
        top: 18%;
        width: 12%;
        z-index: 3;
      }

      .salon-room__bottles {
        background:
          linear-gradient(180deg, #d09d79, #f4ded1) 13% 78% / 7% 22% no-repeat,
          linear-gradient(180deg, #8b2535, #f3d3c4) 28% 75% / 8% 28% no-repeat,
          linear-gradient(180deg, #8fa57c, #f3d3c4) 48% 79% / 7% 21% no-repeat,
          linear-gradient(180deg, #c99058, #f4ded1) 67% 75% / 8% 29% no-repeat;
        bottom: 35%;
        height: 18%;
        left: 44%;
        width: 22%;
        z-index: 6;
      }

      .salon-room__light {
        background: linear-gradient(180deg, rgba(102, 73, 56, 0.42), rgba(102, 73, 56, 0.42)) center top / 2px 54% no-repeat;
        height: 26%;
        top: 0;
        width: 6%;
        z-index: 6;
      }

      .salon-room__light::after {
        background: radial-gradient(circle, rgba(255, 237, 198, 0.95), rgba(221, 160, 94, 0.38) 64%, transparent 68%);
        border-radius: 999px;
        bottom: 16%;
        content: '';
        height: 2rem;
        left: 50%;
        position: absolute;
        transform: translateX(-50%);
        width: 2rem;
      }

      .salon-room__light--left {
        left: 48%;
      }

      .salon-room__light--right {
        left: 69%;
      }

      .salon-room--lounge .salon-room__chair--one,
      .salon-room--gallery-lounge .salon-room__chair--one {
        left: 29%;
        transform: scale(1.18);
      }

      .salon-room--lounge .salon-room__chair--two,
      .salon-room--gallery-lounge .salon-room__chair--two {
        left: 50%;
        transform: scale(1.18);
      }

      .salon-room--gallery-treatment {
        transform: scale(1.24) translateX(-11%);
      }

      .salon-room--gallery-lounge {
        transform: scale(1.18) translateX(9%);
      }

      .salon-still-life {
        background:
          radial-gradient(circle at 22% 20%, rgba(255, 255, 255, 0.82), transparent 14rem),
          linear-gradient(110deg, #fffaf7 0 36%, #f8e8e3 36% 100%);
      }

      .salon-still-life::before {
        background:
          linear-gradient(90deg, rgba(255, 255, 255, 0.72), transparent 55%),
          radial-gradient(ellipse at 72% 72%, rgba(149, 92, 73, 0.16), transparent 18rem);
        content: '';
        inset: 0;
        position: absolute;
      }

      .salon-still-life__shadow {
        background: radial-gradient(ellipse, rgba(116, 78, 61, 0.18), transparent 68%);
        bottom: 13%;
        height: 14%;
        left: 22%;
        width: 62%;
      }

      .salon-still-life__book {
        background: linear-gradient(105deg, #fdf9f5, #ead4c8);
        border-radius: 7px;
        bottom: 18%;
        box-shadow: 0 16px 26px rgba(114, 75, 56, 0.12);
        height: 12%;
        left: 30%;
        transform: skewX(-9deg);
        width: 44%;
      }

      .salon-still-life__vase {
        background:
          repeating-linear-gradient(90deg, rgba(174, 127, 95, 0.18) 0 2px, transparent 2px 10px),
          linear-gradient(180deg, #fff9f3, #dcc1ae);
        border-radius: 46% 46% 38% 38%;
        bottom: 23%;
        box-shadow: inset 0 0 0 1px rgba(160, 119, 91, 0.18), 0 18px 34px rgba(114, 75, 56, 0.16);
        height: 34%;
        left: 26%;
        width: 16%;
      }

      .salon-still-life__vase::before {
        background: linear-gradient(180deg, #f5dfcf, #d7ae96);
        border-radius: 999px;
        content: '';
        height: 13%;
        left: 32%;
        position: absolute;
        top: -4%;
        width: 36%;
      }

      .salon-still-life__stems {
        background:
          radial-gradient(circle at 10% 10%, #c28b72 0 3px, transparent 4px),
          radial-gradient(circle at 40% 0%, #d2a187 0 3px, transparent 4px),
          radial-gradient(circle at 72% 16%, #bd8269 0 3px, transparent 4px),
          linear-gradient(68deg, transparent 47%, #9f775f 48% 49%, transparent 50%),
          linear-gradient(92deg, transparent 47%, #9f775f 48% 49%, transparent 50%),
          linear-gradient(122deg, transparent 47%, #9f775f 48% 49%, transparent 50%);
        bottom: 50%;
        height: 36%;
        left: 23%;
        width: 27%;
      }

      .salon-still-life__bottle {
        background: linear-gradient(180deg, #fff8f1, #d9a990);
        border-radius: 8px 8px 5px 5px;
        bottom: 26%;
        box-shadow: inset 0 0 0 1px rgba(159, 83, 104, 0.12), 0 14px 24px rgba(114, 75, 56, 0.14);
        width: 7%;
      }

      .salon-still-life__bottle::before {
        background: #39302d;
        border-radius: 4px 4px 1px 1px;
        content: '';
        height: 13%;
        left: 31%;
        position: absolute;
        top: -12%;
        width: 38%;
      }

      .salon-still-life__bottle--tall {
        height: 34%;
        left: 52%;
      }

      .salon-still-life__bottle--small {
        height: 25%;
        left: 62%;
        transform: scaleX(0.9);
      }

      .salon-still-life__candle {
        background: linear-gradient(180deg, #fffdfb, #edd9ca);
        border-radius: 12px 12px 6px 6px;
        bottom: 25%;
        height: 20%;
        left: 74%;
        width: 9%;
      }

      .salon-still-life__candle::before {
        background: radial-gradient(circle, rgba(255, 224, 151, 0.95), rgba(206, 128, 72, 0.36) 58%, transparent 62%);
        border-radius: 999px;
        content: '';
        height: 28%;
        left: 32%;
        position: absolute;
        top: -16%;
        width: 36%;
      }

      .salon-still-life__jar {
        background: linear-gradient(180deg, #fffdfb, #e4bd9d);
        border-radius: 999px 999px 18px 18px;
        bottom: 22%;
        height: 16%;
        left: 44%;
        width: 9%;
      }

      .salon-still-life__towel {
        background:
          repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.38) 0 3px, transparent 3px 12px),
          linear-gradient(180deg, #fff8f1, #ead0bf);
        border-radius: 999px;
        bottom: 18%;
        height: 10%;
        right: 12%;
        width: 18%;
      }

      .salon-still-life__frame {
        background:
          linear-gradient(180deg, rgba(255, 250, 246, 0.82), rgba(245, 224, 210, 0.82)),
          linear-gradient(135deg, transparent 47%, rgba(154, 79, 86, 0.34) 48% 51%, transparent 52%);
        border: 10px solid rgba(203, 161, 112, 0.55);
        border-radius: 6px;
        height: 38%;
        right: 9%;
        top: 20%;
        transform: rotate(2deg);
        width: 18%;
      }

      .salon-still-life--contact .salon-still-life__vase {
        left: 23%;
      }

      .salon-still-life--contact .salon-still-life__stems {
        left: 20%;
      }

      .salon-still-life--contact .salon-still-life__bottle--tall {
        left: 48%;
      }

      .salon-still-life--contact .salon-still-life__bottle--small {
        left: 57%;
      }

      .salon-still-life--gallery-products {
        transform: scale(1.12) translateX(-4%);
      }

      .salon-visual--compact {
        aspect-ratio: 1.35;
        border-radius: 16px;
        min-height: 10rem;
      }

      .salon-visual--hero {
        background-position: center;
        border-radius: 24px;
        min-height: clamp(28rem, 42vw, 38rem);
      }

      .salon-visual--hero .salon-visual__image {
        filter: sepia(0.14) saturate(1.28) contrast(0.98) brightness(1.07);
        object-position: center;
      }

      .salon-visual--booking {
        background-position: center;
      }

      .salon-visual--services {
        background-position: center;
      }

      .salon-visual--about {
        background-position: center;
      }

      .salon-actions {
        display: flex;
        flex-wrap: nowrap;
        gap: 1rem;
        margin-top: 2rem;
      }

      .salon-button {
        align-items: center;
        border-radius: 999px;
        display: inline-flex;
        font-size: 0.9375rem;
        font-weight: 500;
        gap: 0.55rem;
        justify-content: center;
        letter-spacing: 0.01em;
        min-height: 3.375rem;
        padding: 0 2rem;
        white-space: nowrap;
        transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      }

      .salon-button:hover {
        transform: translateY(-2px);
      }

      .salon-booking__copy .salon-button,
      .salon-satisfaction > div .salon-button,
      .salon-advice > div .salon-button {
        margin-top: 2rem;
      }

      .salon-button--primary {
        background: var(--salon-rose);
        box-shadow: 0 4px 20px rgba(139, 37, 53, 0.34);
        color: #ffffff;
      }

      .salon-button--primary:hover {
        background: var(--salon-rose-deep);
        box-shadow: 0 12px 32px rgba(139, 37, 53, 0.42);
      }

      .salon-button--outline {
        background: transparent;
        backdrop-filter: none;
        border: 1.5px solid rgba(26, 26, 26, 0.45);
        color: #1a1a1a;
      }

      .salon-button--outline:hover {
        background: rgba(139, 37, 53, 0.08);
        border-color: var(--salon-rose);
        box-shadow: none;
        color: var(--salon-rose);
      }

      .salon-icon {
        flex: 0 0 auto;
        height: 1.15rem;
        width: 1.15rem;
      }

      .salon-values {
        background:
          radial-gradient(circle at 16% 0, rgba(247, 216, 210, 0.6), transparent 14rem),
          rgba(255, 255, 255, 0.72);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        border: 1px solid rgba(232, 221, 214, 0.7);
        border-radius: 20px;
        box-shadow:
          0 8px 32px rgba(84, 55, 51, 0.08),
          inset 0 1px 0 rgba(255, 255, 255, 0.8);
        display: grid;
        gap: 1rem;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        margin-bottom: clamp(1.5rem, 4vw, 2.4rem);
        padding-block: 1.5rem;
      }

      .salon-value {
        align-items: center;
        color: var(--salon-ink);
        display: grid;
        gap: 0.65rem;
        justify-items: center;
        min-height: 5.8rem;
        padding: 0 1rem;
        text-align: center;
        transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      }

      .salon-value:hover {
        transform: translateY(-3px);
      }

      .salon-value + .salon-value {
        border-left: 1px solid rgba(232, 221, 214, 0.6);
      }

      .salon-value svg {
        color: var(--salon-rose);
        height: 2.2rem;
        width: 2.2rem;
        transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      }

      .salon-value:hover svg {
        transform: scale(1.15);
      }

      .salon-value strong {
        font-size: 0.95rem;
        line-height: 1.35;
      }

      .salon-values-band {
        background: #f8f0ea;
        border-bottom: 1px solid rgba(139, 37, 53, 0.1);
        border-top: 1px solid rgba(139, 37, 53, 0.1);
      }

      .salon-values-band .salon-values {
        background: transparent;
        backdrop-filter: none;
        border: 0;
        border-radius: 0;
        box-shadow: none;
        gap: 0;
        margin-bottom: 0;
        max-width: 1280px;
        padding: 0 64px;
      }

      .salon-values-band .salon-value {
        display: flex;
        flex-direction: column;
        gap: 12px;
        min-height: auto;
        padding: 32px 24px;
      }

      .salon-values-band .salon-value + .salon-value {
        border-left: 0;
      }

      .salon-values-band .salon-value:not(:last-child) {
        border-right: 1px solid #e8e8e8;
      }

      .salon-values-band .salon-value svg {
        height: 24px;
        width: 24px;
      }

      .salon-values-band .salon-value strong {
        display: block;
        font-size: 0.875rem;
        font-weight: 600;
        line-height: 1.3;
        margin-bottom: 4px;
      }

      .salon-values-band .salon-value span {
        color: #6b6460;
        display: block;
        font-size: 0.75rem;
        line-height: 1.35;
      }

      .salon-divider {
        background: #f8f0ea;
        padding: 28px 64px 0;
      }

      .salon-divider__rule {
        background: rgba(139, 37, 53, 0.12);
        height: 1px;
        margin: 0 auto;
        max-width: 1280px;
      }

      .salon-booking,
      .salon-satisfaction,
      .salon-advice,
      .salon-contact-card,
      .salon-message,
      .salon-philosophy {
        background:
          linear-gradient(135deg, rgba(255, 255, 255, 0.96), rgba(255, 248, 245, 0.92)),
          #ffffff;
        border: 1px solid var(--salon-border);
        border-radius: 12px;
        box-shadow: 0 18px 54px var(--salon-shadow);
        overflow: hidden;
      }

      .salon-booking,
      .salon-satisfaction,
      .salon-advice,
      .salon-message,
      .salon-philosophy {
        display: grid;
        grid-template-columns: minmax(310px, 0.52fr) minmax(320px, 1fr);
      }

      .salon-booking__copy,
      .salon-satisfaction > div,
      .salon-advice > div,
      .salon-message__intro,
      .salon-philosophy > div {
        padding: clamp(1.6rem, 4vw, 3.5rem);
      }

      .salon-booking h2,
      .salon-satisfaction h2 {
        font-size: clamp(2rem, 3.3vw, 3rem);
      }

      .salon-section,
      .salon-services-page,
      .salon-contact {
        padding: clamp(3.4rem, 7vw, 6.5rem) 0;
      }

      .salon-section-heading {
        align-items: end;
        display: flex;
        gap: 1.5rem;
        justify-content: space-between;
        margin-bottom: 1.6rem;
      }

      .salon-section-heading h2,
      .salon-page-hero h2,
      .salon-about-hero h2 {
        font-size: clamp(2.35rem, 4.2vw, 3.8rem);
      }

      .salon-section-heading a {
        align-items: center;
        color: var(--salon-rose);
        display: inline-flex;
        font-weight: 800;
        gap: 0.45rem;
        min-height: 2.75rem;
        white-space: nowrap;
      }

      .salon-popular-grid {
        display: grid;
        gap: 1.2rem;
        grid-template-columns: repeat(4, minmax(0, 1fr));
      }

      .salon-service-tile {
        background: rgba(255, 255, 255, 0.96);
        border: 1px solid var(--salon-border);
        border-radius: 16px;
        box-shadow: 0 14px 32px rgba(119, 57, 76, 0.06);
        overflow: hidden;
        transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
      }

      .salon-service-tile:hover {
        box-shadow: 0 28px 56px rgba(119, 57, 76, 0.16);
        transform: translateY(-5px);
        border-color: rgba(154, 79, 86, 0.3);
      }

      .salon-service-row:hover {
        box-shadow: 0 22px 48px rgba(119, 57, 76, 0.15);
        transform: translateY(-2px);
      }

      .salon-service-tile > .salon-visual {
        aspect-ratio: 1.3;
        overflow: hidden;
        width: 100%;
      }

      .salon-service-tile > .salon-visual .salon-visual__image {
        transition: transform 0.55s cubic-bezier(0.16, 1, 0.3, 1);
      }

      .salon-service-tile:hover > .salon-visual .salon-visual__image {
        transform: scale(1.08);
      }

      .salon-service-tile__body {
        padding: 1.15rem 1.35rem 1.35rem;
      }

      .salon-service-tile h3,
      .salon-service-row h3,
      .salon-advice h3 {
        color: var(--salon-ink);
        font-family: var(--salon-display);
        font-size: 1.5rem;
        font-weight: 500;
        margin: 0 0 0.5rem;
      }

      .salon-service-tile p,
      .salon-service-row p {
        color: var(--salon-muted);
        margin: 0;
      }

      .salon-service-tile strong,
      .salon-service-row__booking strong {
        color: var(--salon-rose);
      }

      .salon-satisfaction {
        margin-bottom: 0;
      }

      .salon-page-hero {
        margin-bottom: 2rem;
      }

      .salon-page-hero > .salon-visual,
      .salon-about-hero > .salon-visual {
        border-radius: 12px;
        max-height: 25rem;
      }

      .salon-service-list {
        display: grid;
        gap: 1rem;
      }

      .salon-service-row {
        align-items: center;
        background: rgba(255, 255, 255, 0.96);
        border: 1px solid var(--salon-border);
        border-radius: 12px;
        box-shadow: 0 14px 36px rgba(119, 57, 76, 0.08);
        display: grid;
        gap: clamp(1rem, 3vw, 2rem);
        grid-template-columns: minmax(180px, 0.35fr) auto minmax(0, 1fr) minmax(180px, 0.26fr);
        min-height: 11rem;
        overflow: hidden;
        transition:
          box-shadow 160ms ease,
          transform 160ms ease;
      }

      .salon-service-row > .salon-visual {
        height: 100%;
        width: 100%;
      }

      .salon-service-row__icon {
        align-items: center;
        background: linear-gradient(135deg, var(--salon-petal), #f8e8de);
        border-radius: 999px;
        color: var(--salon-rose);
        display: inline-flex;
        height: 4.3rem;
        justify-content: center;
        width: 4.3rem;
      }

      .salon-service-row__icon svg {
        height: 2rem;
        width: 2rem;
      }

      .salon-service-row__booking {
        align-items: center;
        border-left: 1px solid var(--salon-border);
        display: grid;
        gap: 1rem;
        justify-items: center;
        padding: 1rem 1.4rem 1rem 0;
      }

      .salon-service-row__booking span {
        color: var(--salon-muted);
      }

      .salon-advice {
        background:
          radial-gradient(circle at 78% 20%, rgba(143, 165, 124, 0.16), transparent 15rem),
          linear-gradient(90deg, #f8f0ea, #e8e8e8);
        margin-top: 1.6rem;
      }

      .salon-about-hero {
        margin-bottom: 1.6rem;
      }

      .salon-flourish {
        align-items: center;
        color: var(--salon-rose);
        display: inline-flex;
        height: 1.5rem;
        margin-bottom: 1.1rem;
        width: 5.5rem;
      }

      .salon-flourish::before,
      .salon-flourish::after {
        background: currentColor;
        content: '';
        height: 1px;
        width: 2.2rem;
      }

      .salon-flourish::after {
        margin-left: 0.8rem;
      }

      .salon-values--about {
        margin-bottom: 1.6rem;
      }

      .salon-philosophy {
        grid-template-columns: minmax(0, 0.9fr) minmax(300px, 1.1fr);
        margin-bottom: 1.6rem;
      }

      .salon-philosophy h3,
      .salon-gallery h3 {
        font-size: clamp(2.1rem, 4vw, 3.2rem);
      }

      .salon-stats {
        background:
          radial-gradient(circle at 50% 0, rgba(247, 216, 210, 0.5), transparent 16rem),
          rgba(255, 255, 255, 0.68);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        border: 1px solid rgba(232, 221, 214, 0.6);
        border-radius: 20px;
        box-shadow:
          0 8px 32px rgba(84, 55, 51, 0.07),
          inset 0 1px 0 rgba(255, 255, 255, 0.9);
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        margin-bottom: 2rem;
        padding-block: 2rem;
      }

      .salon-stat {
        display: grid;
        gap: 0.45rem;
        justify-items: center;
        padding: 0 1rem;
        text-align: center;
        transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      }

      .salon-stat:hover {
        transform: translateY(-3px);
      }

      .salon-stat + .salon-stat {
        border-left: 1px solid rgba(232, 221, 214, 0.6);
      }

      .salon-stat strong {
        color: var(--salon-rose);
        font-family: var(--salon-display);
        font-size: clamp(2.5rem, 4vw, 3.6rem);
        font-weight: 500;
      }

      .salon-stat span {
        color: var(--salon-muted);
        line-height: 1.4;
      }

      .salon-gallery {
        text-align: center;
      }

      .salon-gallery > div {
        display: grid;
        gap: 1.1rem;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        margin-top: 1.4rem;
      }

      .salon-gallery figure {
        margin: 0;
        overflow: hidden;
        position: relative;
        border-radius: 14px;
        transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
      }

      .salon-gallery figure:hover {
        transform: translateY(-4px);
        box-shadow: 0 24px 52px rgba(84, 55, 51, 0.2);
      }

      .salon-gallery .salon-visual {
        aspect-ratio: 1.25;
        border-radius: 14px;
        width: 100%;
        overflow: hidden;
      }

      .salon-gallery .salon-visual .salon-visual__image {
        transition: transform 0.55s cubic-bezier(0.16, 1, 0.3, 1);
      }

      .salon-gallery figure:hover .salon-visual .salon-visual__image {
        transform: scale(1.1);
      }

      .salon-gallery figcaption {
        background: rgba(31, 31, 31, 0.62);
        backdrop-filter: blur(6px);
        border-radius: 999px;
        bottom: 0.7rem;
        color: #fff;
        font-size: 0.78rem;
        font-weight: 800;
        left: 0.7rem;
        padding: 0.35rem 0.7rem;
        position: absolute;
        transition: opacity 0.25s ease;
      }

      .salon-reviews {
        padding-top: clamp(2.4rem, 6vw, 4.5rem);
      }

      .salon-review-grid {
        display: grid;
        gap: 1.2rem;
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }

      .salon-review-grid article {
        background: rgba(255, 255, 255, 0.8);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border: 1px solid rgba(232, 221, 214, 0.7);
        border-radius: 18px;
        box-shadow:
          0 10px 32px rgba(84, 55, 51, 0.07),
          inset 0 1px 0 rgba(255, 255, 255, 0.9);
        padding: 1.6rem 1.5rem 1.5rem;
        position: relative;
        transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        overflow: hidden;
      }

      .salon-review-grid article::before {
        content: '“';
        position: absolute;
        top: -0.5rem;
        left: 1.1rem;
        font-family: var(--salon-display);
        font-size: 6rem;
        color: var(--salon-blush);
        line-height: 1;
        pointer-events: none;
        user-select: none;
        z-index: 0;
      }

      .salon-review-grid article > * {
        position: relative;
        z-index: 1;
      }

      .salon-review-grid article:hover {
        box-shadow: 0 20px 48px rgba(84, 55, 51, 0.13);
        transform: translateY(-4px);
        border-color: rgba(154, 79, 86, 0.3);
      }

      .salon-review-grid p {
        color: var(--salon-muted);
        font-style: italic;
        line-height: 1.7;
        margin-bottom: 1rem;
      }

      .salon-review-grid strong,
      .salon-review-grid span {
        display: block;
      }

      .salon-review-grid span {
        color: var(--salon-rose);
        font-size: 0.9rem;
        margin-top: 0.2rem;
      }

      .salon-stars {
        color: var(--salon-gold);
        letter-spacing: 0.08em;
        margin-bottom: 0.8rem;
        display: block;
      }

      .salon-contact {
        padding-bottom: clamp(2.5rem, 6vw, 4.5rem);
      }

      .salon-contact-hero {
        margin-bottom: 1.6rem;
      }

      .salon-contact-card {
        display: grid;
        gap: 1.5rem;
        grid-template-columns: minmax(280px, 0.46fr) minmax(0, 1fr);
        margin-bottom: 1.6rem;
        padding: clamp(1rem, 3vw, 1.4rem);
      }

      .salon-contact-info {
        border-right: 1px solid var(--salon-border);
        padding: clamp(1rem, 3vw, 1.5rem);
      }

      .salon-contact-info h3,
      .salon-message h3 {
        font-size: clamp(1.9rem, 3vw, 2.6rem);
        margin-bottom: 1.4rem;
      }

      .salon-contact-info a,
      .salon-contact-info > div {
        align-items: flex-start;
        display: flex;
        gap: 1rem;
        padding: 1rem 0;
      }

      .salon-contact-info a + a,
      .salon-contact-info a + div,
      .salon-contact-info div + a,
      .salon-contact-info div + div {
        border-top: 1px solid var(--salon-border);
      }

      .salon-contact-info svg {
        background: linear-gradient(135deg, var(--salon-petal), #f8e8de);
        border-radius: 999px;
        color: var(--salon-rose);
        height: 3rem;
        padding: 0.8rem;
        width: 3rem;
      }

      .salon-contact-info strong,
      .salon-contact-info small {
        display: block;
      }

      .salon-contact-info strong {
        color: var(--salon-rose);
        margin-bottom: 0.25rem;
      }

      .salon-contact-info small {
        color: var(--salon-ink);
        font-size: 0.95rem;
        line-height: 1.5;
      }

      .salon-map {
        background:
          linear-gradient(35deg, transparent 0 48%, rgba(159, 83, 104, 0.14) 49% 52%, transparent 53%),
          linear-gradient(145deg, transparent 0 45%, rgba(109, 164, 183, 0.28) 46% 50%, transparent 51%),
          repeating-linear-gradient(32deg, rgba(159, 83, 104, 0.09) 0 1px, transparent 1px 3rem),
          repeating-linear-gradient(122deg, rgba(143, 165, 124, 0.1) 0 1px, transparent 1px 2.4rem),
          #fbf4ee;
        border-radius: 10px;
        min-height: 25rem;
        position: relative;
      }

      .salon-map span {
        background: var(--salon-rose);
        border-radius: 999px 999px 999px 0;
        height: 3.4rem;
        left: 55%;
        position: absolute;
        top: 45%;
        transform: rotate(-45deg);
        width: 3.4rem;
      }

      .salon-map span::after {
        background: #fff;
        border-radius: 999px;
        content: '';
        height: 0.85rem;
        left: 50%;
        position: absolute;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 0.85rem;
      }

      .salon-message {
        grid-template-columns: minmax(280px, 0.42fr) minmax(0, 1fr);
      }

      .salon-message__intro {
        background:
          radial-gradient(circle at 16% 18%, rgba(247, 216, 210, 0.7), transparent 14rem),
          linear-gradient(135deg, #fffdfb, #fbefec);
      }

      .salon-message__intro .salon-visual {
        border-radius: 10px;
        margin-top: 1.2rem;
        max-height: 16rem;
      }

      .salon-form {
        padding: clamp(1.2rem, 3vw, 1.8rem);
      }

      .salon-form__grid {
        display: grid;
        gap: 1rem;
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .salon-form__field {
        display: grid;
        gap: 0.45rem;
      }

      .salon-form__field--wide {
        grid-column: 1 / -1;
      }

      .salon-form__field span {
        color: var(--salon-ink);
        font-size: 0.9rem;
        font-weight: 700;
      }

      .salon-form input,
      .salon-form select,
      .salon-form textarea {
        background: #fff;
        border: 1px solid #e8d7d1;
        border-radius: 8px;
        color: var(--salon-ink);
        min-height: 3rem;
        padding: 0.85rem 1rem;
        width: 100%;
      }

      .salon-form textarea {
        min-height: 8rem;
        resize: vertical;
      }

      .salon-form button {
        align-items: center;
        background: var(--salon-rose);
        border: 0;
        border-radius: 999px;
        color: #fff;
        cursor: pointer;
        display: inline-flex;
        font-weight: 800;
        gap: 0.55rem;
        justify-content: center;
        margin-top: 2rem;
        min-height: 3.35rem;
        width: 100%;
      }

      .salon-form > p {
        align-items: center;
        color: #756469;
        display: flex;
        font-size: 0.9rem;
        gap: 0.55rem;
        justify-content: center;
        margin: 1rem 0 0;
        text-align: center;
      }

      .salon-mobile-cta {
        display: none;
      }

      [data-demo='salon-beaute'] .demo-nav {
        backdrop-filter: none;
        -webkit-backdrop-filter: none;
        background: transparent;
        border-bottom: 1px solid transparent;
        box-shadow: none;
        left: 0;
        min-height: 72px;
        padding: 0 clamp(1.25rem, 5vw, 4rem);
        position: absolute;
        right: 0;
        top: 0;
        z-index: 30;
      }

      [data-demo='salon-beaute'] .demo-nav__brand {
        gap: 0.8rem;
      }

      [data-demo='salon-beaute'] .demo-nav__mark {
        height: 2.25rem;
        width: 2.25rem;
      }

      [data-demo='salon-beaute'] .demo-nav__brand strong {
        font-size: 1.25rem;
        font-weight: 600;
        line-height: 1.1;
      }

      [data-demo='salon-beaute'] .demo-nav__brand small {
        color: #201f1f;
        font-size: 0.6875rem;
        line-height: 1;
      }

      [data-demo='salon-beaute'] .demo-nav nav {
        gap: clamp(1.1rem, 2.7vw, 2.3rem);
      }

      [data-demo='salon-beaute'] .demo-nav nav a {
        border-bottom: 1px solid transparent;
        color: #1a1a1a;
        font-size: 0.875rem;
        font-weight: 500;
        line-height: 1.2;
        padding-bottom: 0.25rem;
      }

      [data-demo='salon-beaute'] .demo-nav nav a:hover {
        border-color: #8b2535;
        color: #8b2535;
      }

      [data-demo='salon-beaute'] .demo-nav__cta {
        background: #8b2535;
        border-radius: 999px;
        gap: 0.55rem;
        min-height: 2.75rem;
        padding-inline: 1.375rem;
      }

      [data-demo='salon-beaute'] .demo-nav__cta::before {
        background:
          linear-gradient(currentColor, currentColor) 50% 37% / 56% 1.5px no-repeat,
          linear-gradient(currentColor, currentColor) 33% 17% / 1.5px 24% no-repeat,
          linear-gradient(currentColor, currentColor) 67% 17% / 1.5px 24% no-repeat;
        border: 1.7px solid currentColor;
        border-radius: 3px;
        content: '';
        height: 1.05rem;
        width: 1.05rem;
      }

      .salon-page {
        background: #f8f0ea;
      }

      .salon-container {
        max-width: 1280px;
        padding-inline: 64px;
      }

      .salon-hero {
        background: #ede8e3;
        margin-top: 0;
        min-height: 700px;
        overflow: hidden;
        padding: 0;
        position: relative;
      }

      .salon-hero__backdrop {
        background: url('/demo/salon-beaute/hero_bg.jpg') center 22% / cover no-repeat;
        inset: 0;
        position: absolute;
        z-index: 0;
      }

      .salon-hero__overlay {
        background: linear-gradient(
          to right,
          rgba(248, 240, 234, 0.55) 0%,
          rgba(248, 240, 234, 0.25) 40%,
          rgba(248, 240, 234, 0) 65%
        );
        inset: 0;
        position: absolute;
        z-index: 1;
      }

      .salon-hero__fade {
        background: linear-gradient(to bottom, transparent 0%, #f8f0ea 100%);
        bottom: 0;
        height: 200px;
        left: 0;
        pointer-events: none;
        position: absolute;
        right: 0;
        z-index: 3;
      }

      .salon-hero__content {
        margin: 0 auto;
        max-width: 1280px;
        padding: 168px 64px 80px;
        position: relative;
        z-index: 2;
      }

      .salon-hero__copy {
        max-width: 580px;
      }

      .salon-eyebrow,
      .salon-section-heading span {
        color: #8b2535;
        font-size: 0.75rem;
        font-weight: 600;
        letter-spacing: 0.12em;
        text-transform: uppercase;
      }

      .salon-eyebrow {
        align-items: center;
        display: flex;
        gap: 10px;
        margin-bottom: 20px;
      }

      .salon-eyebrow::before {
        background: #8b2535;
        content: '';
        display: inline-block;
        flex: 0 0 auto;
        height: 1px;
        width: 28px;
      }

      .salon-hero h1 {
        font-size: 3.875rem;
        font-weight: 600;
        line-height: 1.06;
        margin-bottom: 24px;
        max-width: 580px;
      }

      .salon-hero p,
      .salon-page-hero p,
      .salon-about-hero p {
        color: #131212;
        font-size: 1.0625rem;
        line-height: 1.65;
        max-width: 420px;
      }

      .salon-hero__media,
      .salon-visual--hero {
        display: none;
      }

      .salon-visual {
        border-color: rgba(232, 221, 214, 0.78);
        box-shadow: 0 18px 46px rgba(84, 55, 51, 0.09);
      }

      .salon-visual::before {
        background:
          radial-gradient(circle at 18% 14%, rgba(255, 255, 255, 0.45), transparent 17rem),
          linear-gradient(90deg, rgba(250, 247, 244, 0.1), transparent 44%),
          linear-gradient(0deg, rgba(31, 31, 31, 0.08), transparent 45%);
      }

      .salon-visual::after {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), transparent 33%);
      }

      .salon-visual--hero,
      .salon-page-hero > .salon-visual,
      .salon-contact-hero > .salon-visual {
        border: 0;
        box-shadow: none;
      }

      .salon-visual--hero::before,
      .salon-page-hero > .salon-visual::before,
      .salon-contact-hero > .salon-visual::before {
        background:
          linear-gradient(90deg, rgba(250, 247, 244, 0.58), rgba(250, 247, 244, 0.08) 34%, transparent 62%),
          radial-gradient(circle at 18% 28%, rgba(255, 255, 255, 0.4), transparent 15rem);
      }

      .salon-visual--hero .salon-visual__image {
        filter: sepia(0.18) saturate(1.18) contrast(0.98) brightness(1.1);
        object-position: 58% 42%;
      }

      .salon-visual--booking .salon-visual__image,
      .salon-visual--about .salon-visual__image,
      .salon-visual--lounge .salon-visual__image,
      .salon-visual--gallery-salon .salon-visual__image {
        object-position: 50% 52%;
      }

      .salon-visual--services .salon-visual__image {
        object-position: 58% 46%;
      }

      .salon-visual--products .salon-visual__image,
      .salon-visual--contact .salon-visual__image,
      .salon-visual--gallery-products .salon-visual__image {
        object-position: 55% 48%;
      }

      .salon-visual--service-coiffure .salon-visual__image {
        object-position: 47% 42%;
      }

      .salon-visual--service-coloration .salon-visual__image {
        object-position: 54% 45%;
      }

      .salon-visual--service-soins-du-visage .salon-visual__image {
        object-position: 58% 42%;
      }

      .salon-visual--service-manucure-pedicure .salon-visual__image {
        object-position: 50% 54%;
      }

      .salon-visual--service-epilation .salon-visual__image {
        object-position: 55% 48%;
      }

      .salon-visual--gallery-treatment .salon-visual__image {
        object-position: 69% 54%;
        transform: scale(1.14);
      }

      .salon-visual--gallery-lounge .salon-visual__image {
        object-position: 32% 56%;
        transform: scale(1.1);
      }

      .salon-values {
        border-radius: 16px;
        box-shadow: 0 14px 42px rgba(84, 55, 51, 0.08);
        margin-bottom: clamp(1.6rem, 4vw, 2.65rem);
        padding-block: 1.55rem;
      }

      .salon-value {
        min-height: 6.15rem;
      }

      .salon-value svg {
        height: 2.45rem;
        width: 2.45rem;
      }

      .salon-booking {
        background: #f5ede3;
        border: 0;
        border-radius: 20px;
        box-shadow: 0 4px 32px rgba(0, 0, 0, 0.07);
        grid-template-columns: minmax(320px, 1fr) minmax(480px, 1.4fr);
        min-height: 380px;
        padding: 0;
      }

      .salon-booking__copy {
        background: transparent;
        padding: 56px 48px;
        position: relative;
        z-index: 2;
      }

      .salon-booking h2,
      .salon-satisfaction h2 {
        font-size: 2.375rem;
        font-weight: 600;
        line-height: 1.15;
      }

      .salon-booking p,
      .salon-satisfaction p {
        color: #6b6460;
        font-size: 0.9375rem;
        line-height: 1.65;
      }

      .salon-hero h1 + p,
      .salon-page-hero h2 + p,
      .salon-booking h2 + p,
      .salon-satisfaction h2 + p,
      .salon-advice h3 + p,
      .salon-message h3 + p,
      .salon-philosophy h3 + p {
        margin-top: 1.5rem;
      }

      .salon-booking > .salon-visual,
      .salon-satisfaction > .salon-visual,
      .salon-advice > .salon-visual,
      .salon-philosophy > .salon-visual,
      .salon-message__intro .salon-visual {
        border: 0;
        border-radius: 0;
        box-shadow: none;
      }

      .salon-section {
        padding: 58px 0 40px;
      }

      .salon-services-page,
      .salon-contact {
        padding: clamp(6.25rem, 9vw, 7.5rem) 0 clamp(2.4rem, 5vw, 4rem);
      }

      .salon-section#about {
        padding-top: clamp(6.25rem, 9vw, 7.5rem);
      }

      .salon-section-heading {
        margin-bottom: 48px;
      }

      .salon-section-heading > div {
        margin-inline: 0;
        text-align: left;
      }

      .salon-section-heading h2,
      .salon-page-hero h2,
      .salon-about-hero h2 {
        font-size: clamp(2.15rem, 4vw, 3.25rem);
      }

      .salon-popular-grid {
        gap: 28px;
      }

      .salon-service-tile {
        background: transparent;
        border: 0;
        border-radius: 0;
        box-shadow: none;
      }

      .salon-service-tile:hover {
        border-color: transparent;
        box-shadow: none;
        transform: none;
      }

      .salon-service-tile > .salon-visual {
        aspect-ratio: auto;
        border-radius: 0;
        height: 240px;
      }

      .salon-service-tile h3,
      .salon-service-row h3,
      .salon-advice h3 {
        font-size: 1.125rem;
      }

      .salon-service-tile__body {
        padding: 18px 0 0;
      }

      .salon-service-tile p {
        color: var(--salon-rose);
        font-size: 0.875rem;
        font-weight: 600;
      }

      .salon-service-tile strong {
        font-size: 0.875rem;
      }

      .salon-satisfaction {
        background: transparent;
        border: 0;
        box-shadow: none;
        gap: 80px;
        grid-template-columns: minmax(320px, 1fr) minmax(420px, 1fr);
        margin-bottom: 0;
        padding: 40px 64px 80px;
      }

      .salon-satisfaction > div {
        padding: 0;
      }

      .salon-satisfaction > .salon-visual {
        border-radius: 20px;
        height: 320px;
        min-height: 320px;
      }

      .salon-page-hero {
        gap: clamp(2rem, 5vw, 5rem);
        grid-template-columns: minmax(330px, 0.8fr) minmax(500px, 1.2fr);
        margin-bottom: 2.1rem;
      }

      .salon-page-hero > .salon-visual,
      .salon-about-hero > .salon-visual {
        border-radius: 16px;
        max-height: 26rem;
        min-height: 22rem;
      }

      .salon-service-row {
        border-radius: 16px;
        box-shadow: 0 12px 30px rgba(84, 55, 51, 0.08);
        grid-template-columns: minmax(230px, 0.32fr) 5.6rem minmax(0, 1fr) minmax(175px, 0.22fr);
        min-height: 11.8rem;
      }

      .salon-service-row > .salon-visual {
        border-radius: 0;
        min-height: 11.8rem;
      }

      .salon-service-row__icon {
        height: 4.6rem;
        width: 4.6rem;
      }

      .salon-advice {
        background:
          radial-gradient(circle at 86% 24%, rgba(201, 144, 88, 0.22), transparent 16rem),
          linear-gradient(90deg, #fff2ef, #ead0c6);
        border-radius: 16px;
        grid-template-columns: minmax(340px, 0.62fr) minmax(330px, 0.9fr);
        min-height: 13rem;
      }

      .salon-about-hero {
        gap: clamp(2.3rem, 5vw, 5.2rem);
        grid-template-columns: minmax(350px, 0.86fr) minmax(430px, 1.14fr);
      }

      .salon-philosophy {
        border-radius: 16px;
        grid-template-columns: minmax(320px, 0.92fr) minmax(420px, 1.08fr);
      }

      .salon-stats {
        border-radius: 16px;
        box-shadow: 0 12px 30px rgba(84, 55, 51, 0.07);
        padding-block: 1.95rem;
      }

      .salon-gallery figcaption {
        display: none;
      }

      .salon-gallery .salon-visual {
        aspect-ratio: 1.28;
        border: 0;
        border-radius: 12px;
        box-shadow: 0 10px 22px rgba(84, 55, 51, 0.08);
      }

      .salon-reviews {
        padding-top: clamp(1.6rem, 4vw, 3rem);
      }

      .salon-contact-hero {
        grid-template-columns: minmax(350px, 0.82fr) minmax(480px, 1.18fr);
        margin-bottom: 1.7rem;
      }

      .salon-contact-card,
      .salon-message {
        border-radius: 16px;
        box-shadow: 0 12px 34px rgba(84, 55, 51, 0.08);
      }

      .salon-map {
        background:
          linear-gradient(42deg, transparent 0 47%, rgba(109, 164, 183, 0.34) 48% 52%, transparent 53%),
          linear-gradient(142deg, transparent 0 43%, rgba(154, 79, 86, 0.11) 44% 46%, transparent 47%),
          repeating-linear-gradient(32deg, rgba(211, 197, 187, 0.8) 0 1px, transparent 1px 2.1rem),
          repeating-linear-gradient(122deg, rgba(211, 197, 187, 0.68) 0 1px, transparent 1px 2.35rem),
          linear-gradient(135deg, #fff8f3, #f3eee8);
        min-height: 26rem;
      }

      .salon-form input,
      .salon-form select,
      .salon-form textarea {
        border-color: #ded0c8;
      }

      [data-demo='salon-beaute'] .demo-footer {
        background: #1a1a1a;
        padding: 60px 64px 32px;
      }

      [data-demo='salon-beaute'] .demo-footer__inner {
        align-items: start;
        gap: 48px;
        grid-template-columns: 2fr 1fr 1fr 1.2fr;
        margin: 0 auto;
        max-width: 1280px;
      }

      [data-demo='salon-beaute'] .demo-footer__brand strong::before {
        color: #8b2535;
        content: '✂';
        display: inline-block;
        font-family: Georgia, serif;
        font-size: 1.25rem;
        font-weight: 400;
        margin-right: 0.6rem;
        transform: translateY(0.04rem);
      }

      [data-demo='salon-beaute'] .demo-footer__brand strong {
        color: #ffffff;
        font-family: var(--salon-display);
        font-size: 0.9375rem;
        font-weight: 600;
      }

      [data-demo='salon-beaute'] .demo-footer__brand span,
      [data-demo='salon-beaute'] .demo-footer__brand p,
      [data-demo='salon-beaute'] .demo-footer__column a,
      [data-demo='salon-beaute'] .demo-footer__column span,
      [data-demo='salon-beaute'] .demo-footer__bottom {
        color: #777777;
      }

      [data-demo='salon-beaute'] .demo-footer__column strong {
        color: #ffffff;
        font-size: 0.6875rem;
        letter-spacing: 0.14em;
        text-transform: uppercase;
      }

      [data-demo='salon-beaute'] .demo-footer__social a {
        background: transparent;
        border: 0;
        box-shadow: none;
        color: #777777;
        height: auto;
        padding: 0;
        width: auto;
      }

      @media (prefers-reduced-motion: reduce) {
        .salon-button,
        .salon-service-tile,
        .salon-service-row,
        .salon-visual {
          transition: none;
        }

        .salon-button:hover,
        .salon-service-tile:hover,
        .salon-service-row:hover,
        .salon-visual--photo:hover {
          transform: none;
        }
      }

      @media (max-width: 1120px) {
        [data-demo='salon-beaute'] .demo-nav {
          align-items: flex-start;
          display: grid;
          gap: 0.9rem;
          grid-template-columns: 1fr auto;
          min-height: auto;
        }

        [data-demo='salon-beaute'] .demo-nav nav {
          grid-column: 1 / -1;
          overflow-x: auto;
          padding-bottom: 0.35rem;
        }

        .salon-popular-grid,
        .salon-gallery > div {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .salon-service-row {
          grid-template-columns: 13rem auto minmax(0, 1fr);
        }

        .salon-service-row__booking {
          border-left: 0;
          grid-column: 2 / -1;
          justify-items: start;
          padding: 0 1.2rem 1.2rem 0;
        }
      }

      @media (max-width: 860px) {
        .salon-hero {
          min-height: 520px;
          padding: 0;
        }

        .salon-hero__content {
          padding: 128px 28px 64px;
        }

        .salon-hero__grid,
        .salon-page-hero,
        .salon-about-hero,
        .salon-booking,
        .salon-satisfaction,
        .salon-advice,
        .salon-philosophy,
        .salon-contact-card,
        .salon-message {
          grid-template-columns: 1fr;
        }

        .salon-hero__grid > *,
        .salon-page-hero > *,
        .salon-about-hero > *,
        .salon-booking > *,
        .salon-satisfaction > *,
        .salon-advice > *,
        .salon-philosophy > *,
        .salon-contact-card > *,
        .salon-message > * {
          min-width: 0;
        }

        .salon-hero__media {
          min-height: 20rem;
        }

        .salon-values,
        .salon-stats,
        .salon-review-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .salon-value + .salon-value,
        .salon-stat + .salon-stat {
          border-left: 0;
        }

        .salon-service-row {
          grid-template-columns: 1fr;
        }

        .salon-service-row > .salon-visual {
          aspect-ratio: 1.8;
        }

        .salon-service-row__icon,
        .salon-service-row__copy,
        .salon-service-row__booking {
          margin-inline: 1.2rem;
        }

        .salon-service-row__booking {
          grid-column: auto;
          padding: 0 0 1.2rem;
        }

        .salon-contact-info {
          border-right: 0;
          border-bottom: 1px solid var(--salon-border);
        }

        .salon-map {
          min-height: 19rem;
        }

        .salon-values-band .salon-values {
          padding-inline: 28px;
        }
      }

      @media (max-width: 620px) {
        .salon-page {
          max-width: 100vw;
          width: 100%;
        }

        [data-demo='salon-beaute'] .demo-nav {
          padding: 0.85rem 1rem;
        }

        [data-demo='salon-beaute'] .demo-nav__brand {
          min-width: 0;
        }

        [data-demo='salon-beaute'] .demo-nav__brand strong {
          font-size: 1.05rem;
        }

        [data-demo='salon-beaute'] .demo-nav__brand small {
          font-size: 0.7rem;
        }

        [data-demo='salon-beaute'] .demo-nav__cta {
          font-size: 0.82rem;
          min-height: 2.75rem;
          padding: 0 0.85rem;
        }

        [data-demo='salon-beaute'] .demo-return {
          border-radius: 999px;
          bottom: 4.35rem;
          min-height: 2.65rem;
          padding: 0;
          right: 0.85rem;
          width: 2.65rem;
        }

        [data-demo='salon-beaute'] .demo-return span {
          display: none;
        }

        .salon-container {
          max-width: 100vw;
          overflow: hidden;
          padding-inline: 1rem;
        }

        .salon-divider {
          padding: 24px 20px 0;
        }

        .salon-booking,
        .salon-satisfaction {
          padding-inline: 0;
        }

        .salon-satisfaction {
          gap: 28px;
          padding-bottom: 48px;
        }

        [data-demo='salon-beaute'] .demo-footer {
          padding: 42px 20px 28px;
        }

        .salon-hero h1 {
          font-size: clamp(2.2rem, 9vw, 2.85rem);
          max-width: 15ch;
        }

        .salon-hero p {
          font-size: 0.98rem;
          max-width: 31ch;
        }

        .salon-hero__content {
          padding: 110px 20px 48px;
        }

        .salon-page-hero h2,
        .salon-about-hero h2,
        .salon-section-heading h2,
        .salon-booking h2,
        .salon-satisfaction h2,
        .salon-philosophy h3,
        .salon-gallery h3 {
          font-size: clamp(2.3rem, 10vw, 2.95rem);
          max-width: 100%;
        }

        .salon-contact-info h3,
        .salon-message h3 {
          font-size: clamp(2rem, 8vw, 2.35rem);
          max-width: 100%;
          overflow-wrap: break-word;
        }

        .salon-page-hero h2,
        .salon-about-hero h2 {
          max-width: 8ch;
        }

        .salon-page-hero p,
        .salon-about-hero p,
        .salon-booking p,
        .salon-satisfaction p,
        .salon-message p,
        .salon-philosophy p {
          font-size: 0.98rem;
          line-height: 1.65;
          max-width: 30ch;
        }

        .salon-hero h1 + p,
        .salon-page-hero h2 + p,
        .salon-booking h2 + p,
        .salon-satisfaction h2 + p,
        .salon-advice h3 + p,
        .salon-message h3 + p,
        .salon-philosophy h3 + p {
          margin-top: 1.25rem;
        }

        .salon-page-hero > .salon-visual,
        .salon-about-hero > .salon-visual,
        .salon-booking > .salon-visual,
        .salon-satisfaction > .salon-visual,
        .salon-philosophy > .salon-visual,
        .salon-advice > .salon-visual,
        .salon-message__intro .salon-visual {
          max-width: 22.5rem;
          width: 100%;
        }

        .salon-hero__media,
        .salon-visual--hero {
          min-height: 18rem;
        }

        .salon-actions,
        .salon-section-heading {
          align-items: stretch;
          flex-direction: column;
        }

        .salon-actions {
          flex-wrap: wrap;
          padding-right: 1rem;
        }

        .salon-button {
          white-space: normal;
          width: auto;
        }

        .salon-actions .salon-button {
          margin-right: 1rem;
        }

        .salon-values,
        .salon-stats,
        .salon-popular-grid,
        .salon-gallery > div,
        .salon-review-grid,
        .salon-form__grid {
          grid-template-columns: 1fr;
        }

        .salon-values-band .salon-values {
          padding-inline: 0;
        }

        .salon-values-band .salon-value {
          padding: 24px 20px;
        }

        .salon-values-band .salon-value:not(:last-child) {
          border-bottom: 1px solid #e8e8e8;
          border-right: 0;
        }

        .salon-booking__copy,
        .salon-satisfaction > div,
        .salon-advice > div,
        .salon-message__intro,
        .salon-philosophy > div {
          padding: 1.4rem;
        }

        .salon-mobile-cta {
          bottom: 0.7rem;
          display: block;
          left: 0.8rem;
          position: fixed;
          right: 0.8rem;
          z-index: 44;
        }

        .salon-mobile-cta a {
          align-items: center;
          background: var(--salon-rose);
          border-radius: 999px;
          box-shadow: 0 16px 34px rgba(139, 37, 53, 0.24);
          color: #ffffff;
          display: flex;
          font-weight: 800;
          gap: 0.55rem;
          justify-content: center;
          min-height: 3.1rem;
        }
      }

      @media (max-width: 430px) {
        .salon-hero__grid,
        .salon-page-hero,
        .salon-about-hero,
        .salon-booking,
        .salon-satisfaction,
        .salon-advice,
        .salon-philosophy,
        .salon-contact-card,
        .salon-message {
          justify-items: start;
        }

        .salon-page-hero h2,
        .salon-about-hero h2 {
          font-size: 2.45rem;
          text-wrap: wrap;
        }

        .salon-page-hero p,
        .salon-about-hero p,
        .salon-hero p {
          max-width: 30ch;
        }

        .salon-page-hero > .salon-visual,
        .salon-about-hero > .salon-visual,
        .salon-booking > .salon-visual,
        .salon-satisfaction > .salon-visual,
        .salon-philosophy > .salon-visual,
        .salon-advice > .salon-visual,
        .salon-message__intro .salon-visual {
          width: min(100%, 22.5rem);
        }
      }
    `}</style>
  )
}
