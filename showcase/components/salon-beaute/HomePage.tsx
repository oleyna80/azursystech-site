'use client'

import Image from 'next/image'
import Link from 'next/link'
import { salonBeauteContent } from './data'
import { SalonBeauteNav } from './Nav'
import { SalonBeauteFooter } from './Footer'
import styles from './home.module.css'

const valueDescriptions: Record<string, string> = {
  'Professionnels expérimentés': "Plus de 7 ans d'expertise beauté",
  'Produits de qualité': 'Sélectionnés pour votre peau',
  'Ambiance relaxante': 'Un espace pensé pour votre bien-être',
  'Prise de rendez-vous facile': 'En ligne, en quelques secondes',
}

export function SalonBeauteHome() {
  const content = salonBeauteContent

  return (
    <>
      <SalonBeauteNav />
      <div className={styles.page} id="top">
      {/* Hero */}
      <section className={styles.hero} aria-labelledby="sb-hero-title">
        <Image
          alt={content.hero.image.alt}
          className={styles.heroImage}
          fill
          priority
          sizes="100vw"
          src={content.hero.image.src}
          style={{ objectFit: 'cover' }}
        />
        <div className={styles.heroOverlay} />
        <div className={styles.container}>
          <div className={styles.heroCopy}>
            <span className={styles.eyebrow}>{content.hero.eyebrow}</span>
            <h1 id="sb-hero-title">{content.hero.title}</h1>
            <p>{content.hero.subtitle}</p>
            <div className={styles.actions} aria-label="Actions principales">
              <Link className={`${styles.button} ${styles.buttonPrimary}`} href={content.hero.primaryCta.href}>
                <Icon name="calendar" />
                {content.hero.primaryCta.label}
              </Link>
              <Link className={`${styles.button} ${styles.buttonOutline}`} href={content.hero.secondaryCta.href}>
                {content.hero.secondaryCta.label}
                <Icon name="arrow" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Values Band */}
      <section className={styles.valuesBand} aria-label="Points forts">
        <div className={styles.container}>
          <div className={styles.values}>
            {content.values.map((value) => (
              <div key={value.label} className={styles.valueItem}>
                <Icon name={value.icon} />
                <span>{value.label}</span>
                <small>{valueDescriptions[value.label]}</small>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <hr className={styles.divider} />

      {/* Booking Section */}
      <section className={`${styles.section} ${styles.bookingSection}`}>
        <div className={styles.container}>
          <div className={styles.bookingGrid}>
            <div className={styles.bookingCopy}>
              <h2>{content.booking.title}</h2>
              <p>{content.booking.body}</p>
              <Link className={`${styles.button} ${styles.buttonPrimary}`} href={content.booking.cta.href}>
                <Icon name="calendar" />
                {content.booking.cta.label}
              </Link>
            </div>
            <div className={styles.bookingImage}>
              <Image
                alt={content.booking.image.alt}
                height={content.booking.image.height}
                src={content.booking.image.src}
                width={content.booking.image.width}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <hr className={styles.divider} />

      {/* Popular Services */}
      <section className={styles.section} aria-labelledby="sb-popular-title">
        <div className={styles.container}>
          <span className={styles.sectionEyebrow}>Nos prestations</span>
          <h2 id="sb-popular-title" className={styles.sectionTitle}>Nos soins populaires</h2>
          <p style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <Link href="/demo/salon-beaute/services" className={styles.inlineLink}>
              Voir tous nos soins
              <Icon name="arrow" />
            </Link>
          </p>
          <div className={styles.servicesGrid}>
            {content.popularServices.map((service) => (
              <div key={service.title} className={styles.serviceCard}>
                <div className={styles.serviceImage}>
                  <Image
                    alt={service.image.alt}
                    height={service.image.height}
                    src={service.image.src}
                    width={service.image.width}
                  />
                </div>
                <h3>{service.title}</h3>
                <p className={styles.price}>
                  À partir de <strong>{service.price.replace(/^à partir de\s+/i, '')}</strong>
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Satisfaction CTA */}
      <section className={styles.satisfactionSection}>
        <Image
          alt={content.satisfaction.image.alt}
          className={styles.satisfactionBg}
          fill
          sizes="100vw"
          src={content.satisfaction.image.src}
          style={{ objectFit: 'cover' }}
        />
        <div className={styles.satisfactionOverlay} />
        <div className={styles.container}>
          <div className={styles.satisfactionContent}>
            <h2>{content.satisfaction.title}</h2>
            <p>{content.satisfaction.body}</p>
            <Link className={`${styles.button} ${styles.buttonLight}`} href={content.satisfaction.cta.href}>
              {content.satisfaction.cta.label}
            </Link>
          </div>
        </div>
      </section>

      {/* Mobile CTA */}
      <div className={styles.mobileCta}>
        <Link href="/demo/salon-beaute/contact#formulaire">
          <Icon name="calendar" />
          Rendez-vous
        </Link>
      </div>
      </div>
      <SalonBeauteFooter />
    </>
  )
}

export function SalonBeauteServices() {
  const content = salonBeauteContent

  return (
    <>
      <SalonBeauteNav />
      <div className={styles.page}>
      {/* Header */}
      <section className={styles.servicesHeader} aria-labelledby="sb-services-title">
        <Image
          alt={content.servicesPage.image.alt}
          className={styles.headerImage}
          fill
          priority
          sizes="100vw"
          src={content.servicesPage.image.src}
          style={{ objectFit: 'cover' }}
        />
        <div className={styles.headerOverlay} />
        <div className={styles.container}>
          <div className={styles.headerContent}>
            <span className={styles.eyebrow}>{content.servicesPage.eyebrow}</span>
            <h1 id="sb-services-title">{content.servicesPage.title}</h1>
            <p>{content.servicesPage.subtitle}</p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.fullServicesGrid}>
            {content.servicesPage.services.map((service) => (
              <article key={service.title} className={styles.serviceCardFull}>
                <div className={styles.serviceImage}>
                  <Image
                    alt={service.image.alt}
                    height={service.image.height}
                    src={service.image.src}
                    width={service.image.width}
                  />
                </div>
                <div className={styles.serviceInfo}>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                  <div className={styles.serviceBooking}>
                    <span className={styles.price}>{service.price}</span>
                    <Link
                      className={`${styles.button} ${styles.buttonPrimary}`}
                      href="/demo/salon-beaute/contact#formulaire"
                    >
                      Réserver
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Advice Section */}
      <section className={styles.adviceSection}>
        <div className={styles.container}>
          <div className={styles.adviceGrid}>
            <div className={styles.adviceCopy}>
              <h2>{content.servicesPage.adviceTitle}</h2>
              <p>{content.servicesPage.adviceBody}</p>
              <Link className={`${styles.button} ${styles.buttonPrimary}`} href={content.servicesPage.adviceCta.href}>
                {content.servicesPage.adviceCta.label}
              </Link>
            </div>
            <div className={styles.adviceImage}>
              <Image
                alt={content.servicesPage.adviceImage.alt}
                height={content.servicesPage.adviceImage.height}
                src={content.servicesPage.adviceImage.src}
                width={content.servicesPage.adviceImage.width}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mobile CTA */}
      <div className={styles.mobileCta}>
        <Link href="/demo/salon-beaute/contact#formulaire">
          <Icon name="calendar" />
          Rendez-vous
        </Link>
      </div>
      </div>
      <SalonBeauteFooter />
    </>
  )
}

export function SalonBeauteAbout() {
  const content = salonBeauteContent

  return (
    <>
      <SalonBeauteNav />
      <div className={styles.page}>
      {/* Header */}
      <section className={styles.aboutHeader} aria-labelledby="sb-about-title">
        <div className={styles.container}>
          <div className={styles.aboutHeaderContent}>
            <h1 id="sb-about-title">{content.about.title}</h1>
            <p>{content.about.intro}</p>
          </div>
        </div>
      </section>

      {/* About Image */}
      <section className={styles.aboutImageSection}>
        <Image
          alt={content.about.image.alt}
          height={content.about.image.height}
          src={content.about.image.src}
          width={content.about.image.width}
          style={{ width: '100%', height: 'auto' }}
        />
      </section>

      {/* Values Grid */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.valuesGrid}>
            {content.about.values.map((value) => (
              <div key={value.label} className={styles.valueItemLarge}>
                <Icon name={value.icon} />
                <span>{value.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className={styles.philosophySection}>
        <div className={styles.container}>
          <div className={styles.philosophyGrid}>
            <div className={styles.philosophyCopy}>
              <h2>{content.about.philosophyTitle}</h2>
              {content.about.philosophyText.map((text, idx) => (
                <p key={idx}>{text}</p>
              ))}
            </div>
            <Image
              alt={content.about.philosophyImage.alt}
              height={content.about.philosophyImage.height}
              src={content.about.philosophyImage.src}
              width={content.about.philosophyImage.width}
            />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className={styles.statsSection}>
        <div className={styles.container}>
          <div className={styles.statsGrid}>
            {content.about.stats.map((stat) => (
              <div key={stat.label} className={styles.statItem}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className={styles.gallerySection}>
        <div className={styles.container}>
          <h2>{content.about.galleryTitle}</h2>
          <div className={styles.gallery}>
            {content.about.gallery.map((item) => (
              <div key={item.title} className={styles.galleryItem}>
                <Image
                  alt={item.image.alt}
                  height={item.image.height}
                  src={item.image.src}
                  width={item.image.width}
                />
                <h3>{item.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className={styles.reviewsSection}>
        <div className={styles.container}>
          <span className={styles.sectionEyebrow}>Avis clients</span>
          <h2>{content.reviews.title}</h2>
          <div className={styles.reviewsGrid}>
            {content.reviews.items.map((review) => (
              <div key={review.name} className={styles.reviewItem}>
                <div className={styles.stars} aria-label="Note 5 sur 5">
                  ★★★★★
                </div>
                <p className={styles.reviewText}>“{review.text}”</p>
                <div className={styles.reviewAuthor}>
                  <strong>{review.name}</strong>
                  <span>{review.detail}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile CTA */}
      <div className={styles.mobileCta}>
        <Link href="/demo/salon-beaute/contact#formulaire">
          <Icon name="calendar" />
          Rendez-vous
        </Link>
      </div>
      </div>
      <SalonBeauteFooter />
    </>
  )
}

export function SalonBeauteContact() {
  const content = salonBeauteContent

  return (
    <>
      <SalonBeauteNav />
      <div className={styles.page}>
      {/* Header */}
      <section className={styles.contactHeader} aria-labelledby="sb-contact-title">
        <Image
          alt={content.contact.image.alt}
          className={styles.contactHeaderImage}
          fill
          priority
          sizes="100vw"
          src={content.contact.image.src}
          style={{ objectFit: 'cover' }}
        />
        <div className={styles.contactHeaderOverlay} />
        <div className={styles.container}>
          <div className={styles.contactHeaderContent}>
            <h1 id="sb-contact-title">{content.contact.title}</h1>
            <p>{content.contact.subtitle}</p>
          </div>
        </div>
      </section>

      {/* Info & Form */}
      <section className={styles.contactSection}>
        <div className={styles.container}>
          <div className={styles.contactGrid}>
            <div className={styles.contactInfo}>
              <h2>Nos coordonnées</h2>
              {content.contact.info.map((item) => {
                const value = (
                  <div key={item.label} className={styles.infoItem}>
                    <Icon name={item.icon} />
                    <div>
                      <small>{item.label}</small>
                      <strong>{item.value}</strong>
                    </div>
                  </div>
                )
                return item.href ? (
                  <Link href={item.href} key={item.label} className={styles.infoLink}>
                    {value}
                  </Link>
                ) : (
                  value
                )
              })}
            </div>

            <form className={styles.contactForm} id="formulaire">
              <h2>{content.contact.form.title}</h2>
              <p className={styles.formIntro}>
                Remplissez le formulaire ci-contre et nous vous répondrons dans les plus brefs délais.
              </p>
              <div className={styles.formGrid}>
                {content.contact.form.fields.map((field) => (
                  <label
                    key={field.label}
                    className={field.type === 'textarea' ? styles.formFieldWide : styles.formField}
                  >
                    <span>{field.label}</span>
                    {field.type === 'textarea' ? (
                      <textarea placeholder={field.placeholder} required={field.required} rows={5} />
                    ) : field.type === 'select' ? (
                      <select required={field.required}>
                        <option value="">{field.placeholder ?? 'Sélectionnez...'}</option>
                        {field.options?.map((opt) => (
                          <option key={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : (
                      <input placeholder={field.placeholder} required={field.required} type={field.type} />
                    )}
                  </label>
                ))}
              </div>
              <button type="button" className={`${styles.button} ${styles.buttonPrimary}`}>
                {content.contact.form.submitLabel}
              </button>
              <p className={styles.formNote}>{content.contact.note}</p>
            </form>
          </div>
        </div>
      </section>

      {/* Mobile CTA */}
      <div className={styles.mobileCta}>
        <a href="#formulaire">
          <Icon name="calendar" />
          Rendez-vous
        </a>
      </div>
      </div>
      <SalonBeauteFooter />
    </>
  )
}

function Icon({ name }: { name: string }) {
  const cls = 'w-6 h-6 inline-block'

  switch (name) {
    case 'calendar':
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M8 7V3m8 4V3m-9 8h14M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
        </svg>
      )
    case 'arrow':
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
        </svg>
      )
    case 'expert':
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M12 14l9-5-9-5-9 5m0 0l9 5m-9-5v10l9 5m0-10l9-5m-9 5v10l-9-5" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
        </svg>
      )
    case 'leaf':
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M14 4l-8 8m0 0l-2 5m2-5l5-2" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
        </svg>
      )
    case 'lotus':
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M12 15a3 3 0 100-6 3 3 0 000 6z M12 2a10 10 0 110 20 10 10 0 010-20z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
        </svg>
      )
    case 'chat':
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
        </svg>
      )
    case 'pin':
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
        </svg>
      )
    case 'phone':
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M3 5a2 2 0 012-2h3.28a1 1 0 00.948.684l1.498 4.493a1 1 0 00-.502 1.21l-2.257 4.514a7 7 0 004.947 4.947l4.514-2.257a1 1 0 001.21.502l4.493 1.498a1 1 0 00.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
        </svg>
      )
    case 'mail':
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
        </svg>
      )
    case 'clock':
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
        </svg>
      )
    case 'social':
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
        </svg>
      )
    default:
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
        </svg>
      )
  }
}
