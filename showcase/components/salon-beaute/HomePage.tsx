'use client'

import Image from 'next/image'
import Link from 'next/link'
import { FormEvent, useMemo, useState } from 'react'
import { salonBeauteContent } from './data'
import { SalonBeauteNav } from './Nav'
import { SalonBeauteFooter } from './Footer'
import styles from './home.module.css'

const basePath = '/demo/salon-beaute'

const valueDescriptions: Record<string, string> = {
  'Professionnels expérimentés': "Plus de 7 ans d'expertise beauté",
  'Produits de qualité': 'Sélectionnés avec exigence',
  'Ambiance relaxante': 'Un espace dédié à votre bien-être',
  'Prise de rendez-vous facile': 'En ligne, en quelques instants',
}

export function SalonBeauteHome() {
  const content = salonBeauteContent

  return (
    <PageShell>
      <section className={styles.hero} aria-labelledby="sb-hero-title">
        <Image alt={content.hero.image.alt} fill priority sizes="100vw" src={content.hero.image.src} />
        <div className={styles.heroShade} />
        <div className={styles.container}>
          <div className={styles.heroCopy}>
            <span className={styles.eyebrow}>{content.hero.eyebrow}</span>
            <h1 id="sb-hero-title">{content.hero.title}</h1>
            <p>{content.hero.subtitle}</p>
            <div className={styles.actions}>
              <Link className={`${styles.button} ${styles.buttonPrimary}`} href={content.hero.primaryCta.href}>
                <Icon name="calendar" /> {content.hero.primaryCta.label}
              </Link>
              <Link className={styles.textLink} href={content.hero.secondaryCta.href}>
                {content.hero.secondaryCta.label} <Icon name="arrow" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <ValuesBand values={content.values} descriptions />

      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.bookingPanel}>
            <div className={styles.bookingCopy}>
              <span className={styles.sectionEyebrow}>Un instant rien que pour vous</span>
              <h2>{content.booking.title}</h2>
              <p>{content.booking.body}</p>
              <Link className={`${styles.button} ${styles.buttonPrimary}`} href={content.booking.cta.href}>
                <Icon name="calendar" /> {content.booking.cta.label}
              </Link>
            </div>
            <div className={styles.bookingImage}>
              <Image alt={content.booking.image.alt} fill sizes="(max-width: 800px) 100vw, 55vw" src={content.booking.image.src} />
            </div>
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.servicesPreview}`} aria-labelledby="sb-popular-title">
        <div className={styles.container}>
          <div className={styles.sectionHeading}>
            <div>
              <span className={styles.sectionEyebrow}>Nos prestations</span>
              <h2 id="sb-popular-title">Nos services populaires</h2>
            </div>
            <Link className={styles.inlineLink} href={`${basePath}/services`}>
              Voir tous nos soins <Icon name="arrow" />
            </Link>
          </div>
          <div className={styles.servicesGrid}>
            {content.popularServices.map((service) => (
              <article key={service.title} className={styles.serviceTile}>
                <div className={styles.serviceTileImage}>
                  <Image alt={service.image.alt} fill sizes="(max-width: 700px) 100vw, 25vw" src={service.image.src} />
                </div>
                <h3>{service.title}</h3>
                <p>{service.price}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.satisfactionSection}>
        <div className={styles.satisfactionCopy}>
          <span className={styles.sectionEyebrow}>Une attention sincère</span>
          <h2>{content.satisfaction.title}</h2>
          <p>{content.satisfaction.body}</p>
          <Link className={`${styles.button} ${styles.buttonPrimary}`} href={content.satisfaction.cta.href}>
            {content.satisfaction.cta.label} <Icon name="arrow" />
          </Link>
        </div>
        <div className={styles.satisfactionImage}>
          <Image alt={content.satisfaction.image.alt} fill sizes="(max-width: 800px) 100vw, 50vw" src={content.satisfaction.image.src} />
        </div>
      </section>
    </PageShell>
  )
}

const serviceCategories = ['Tous les soins', 'Cheveux', 'Visage & corps', 'Mains & pieds'] as const

function getServiceCategory(title: string) {
  if (title === 'Coiffure' || title === 'Coloration') return 'Cheveux'
  if (title === 'Manucure & Pédicure') return 'Mains & pieds'
  return 'Visage & corps'
}

export function SalonBeauteServices() {
  const content = salonBeauteContent
  const [category, setCategory] = useState<(typeof serviceCategories)[number]>('Tous les soins')
  const services = useMemo(
    () => content.servicesPage.services.filter((service) => category === 'Tous les soins' || getServiceCategory(service.title) === category),
    [category, content.servicesPage.services],
  )

  return (
    <PageShell>
      <section className={styles.splitHeader} aria-labelledby="sb-services-title">
        <div className={styles.splitHeaderCopy}>
          <span className={styles.eyebrow}>{content.servicesPage.eyebrow}</span>
          <h1 id="sb-services-title">{content.servicesPage.title}</h1>
          <p>{content.servicesPage.subtitle}</p>
        </div>
        <div className={styles.splitHeaderImage}>
          <Image alt={content.servicesPage.image.alt} fill priority sizes="(max-width: 800px) 100vw, 50vw" src={content.servicesPage.image.src} />
        </div>
      </section>

      <section className={`${styles.section} ${styles.serviceListSection}`}>
        <div className={styles.container}>
          <div className={styles.filters} aria-label="Filtrer les soins">
            {serviceCategories.map((item) => (
              <button key={item} aria-pressed={category === item} onClick={() => setCategory(item)} type="button">
                {item}
              </button>
            ))}
          </div>
          <div className={styles.serviceList} aria-live="polite">
            {services.map((service) => (
              <article className={styles.serviceRow} key={service.title}>
                <div className={styles.serviceRowImage}>
                  <Image alt={service.image.alt} fill sizes="(max-width: 700px) 100vw, 240px" src={service.image.src} />
                </div>
                <span className={styles.serviceIcon}><Icon name={service.icon} /></span>
                <div className={styles.serviceInfo}>
                  <h2>{service.title}</h2>
                  <p>{service.description}</p>
                </div>
                <div className={styles.serviceAction}>
                  <strong>{service.price}</strong>
                  <Link href={`${basePath}/contact#formulaire`}>Réserver <Icon name="arrow" /></Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.adviceSection}>
        <div className={styles.adviceImage}>
          <Image alt={content.servicesPage.adviceImage.alt} fill sizes="(max-width: 800px) 100vw, 50vw" src={content.servicesPage.adviceImage.src} />
        </div>
        <div className={styles.adviceCopy}>
          <span className={styles.sectionEyebrow}>Votre rituel sur mesure</span>
          <h2>{content.servicesPage.adviceTitle}</h2>
          <p>{content.servicesPage.adviceBody}</p>
          <Link className={`${styles.button} ${styles.buttonPrimary}`} href={content.servicesPage.adviceCta.href}>
            {content.servicesPage.adviceCta.label}
          </Link>
        </div>
      </section>
    </PageShell>
  )
}

export function SalonBeauteAbout() {
  const content = salonBeauteContent

  return (
    <PageShell>
      <section className={styles.aboutIntro} aria-labelledby="sb-about-title">
        <div className={styles.aboutIntroCopy}>
          <span className={styles.eyebrow}>Notre histoire</span>
          <h1 id="sb-about-title">{content.about.title}</h1>
          <p>{content.about.intro}</p>
        </div>
        <div className={styles.aboutIntroImage}>
          <Image alt={content.about.image.alt} fill priority sizes="(max-width: 800px) 100vw, 50vw" src={content.about.image.src} />
        </div>
      </section>

      <ValuesBand values={content.about.values} />

      <section className={`${styles.section} ${styles.philosophySection}`}>
        <div className={`${styles.container} ${styles.philosophyGrid}`}>
          <div className={styles.philosophyImage}>
            <Image alt={content.about.philosophyImage.alt} fill sizes="(max-width: 800px) 100vw, 50vw" src={content.about.philosophyImage.src} />
          </div>
          <div className={styles.philosophyCopy}>
            <span className={styles.sectionEyebrow}>Beauté naturelle</span>
            <h2>{content.about.philosophyTitle}</h2>
            {content.about.philosophyText.map((text) => <p key={text}>{text}</p>)}
          </div>
        </div>
      </section>

      <section className={styles.statsSection} aria-label="Salon Beauté en chiffres">
        <div className={`${styles.container} ${styles.statsGrid}`}>
          {content.about.stats.map((stat) => (
            <div className={styles.statItem} key={stat.label}>
              <strong>{stat.value}</strong><span>{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className={`${styles.section} ${styles.gallerySection}`}>
        <div className={styles.container}>
          <div className={styles.galleryHeading}>
            <span className={styles.sectionEyebrow}>Découvrez le salon</span>
            <h2>{content.about.galleryTitle}</h2>
          </div>
          <div className={styles.gallery}>
            {content.about.gallery.map((item) => (
              <div className={styles.galleryItem} key={item.title}>
                <Image alt={item.image.alt} fill sizes="(max-width: 700px) 50vw, 25vw" src={item.image.src} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  )
}

export function SalonBeauteContact() {
  const content = salonBeauteContent
  const [sent, setSent] = useState(false)

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSent(true)
  }

  return (
    <PageShell>
      <section className={styles.contactHero} aria-labelledby="sb-contact-title">
        <div className={styles.contactHeroCopy}>
          <span className={styles.eyebrow}>Nous sommes à votre écoute</span>
          <h1 id="sb-contact-title">{content.contact.title}</h1>
          <p>{content.contact.subtitle}</p>
        </div>
        <div className={styles.contactHeroImage}>
          <Image alt={content.contact.image.alt} fill priority sizes="(max-width: 800px) 100vw, 50vw" src={content.contact.image.src} />
        </div>
      </section>

      <section className={`${styles.section} ${styles.contactSection}`}>
        <div className={styles.container}>
          <div className={styles.locationPanel}>
            <div className={styles.contactInfo}>
              <span className={styles.sectionEyebrow}>Paris 1er</span>
              <h2>Retrouvez-nous</h2>
              {content.contact.info.slice(0, 4).map((item) => {
                const details = <><Icon name={item.icon} /><span><small>{item.label}</small><strong>{item.value}</strong></span></>
                return item.href ? <a className={styles.infoItem} href={item.href} key={item.label}>{details}</a> : <div className={styles.infoItem} key={item.label}>{details}</div>
              })}
            </div>
            <div className={styles.map} aria-label="Plan stylisé du quartier du salon" role="img">
              <svg viewBox="0 0 760 430" aria-hidden="true">
                <path d="M-20 110 220 30l180 75 380-45M20 370l210-150 185 80 365-175M80-20l75 470M340-20l25 470M620-20l-45 470" />
                <path className={styles.mapRiver} d="M-30 260c180-90 280 100 450 20s210-155 380-70" />
                <circle cx="415" cy="215" r="20" />
                <path className={styles.mapPin} d="M415 245c-28-38-42-57-42-78a42 42 0 1 1 84 0c0 21-14 40-42 78Z" />
                <circle className={styles.mapPinCenter} cx="415" cy="167" r="12" />
              </svg>
              <span>Salon Beauté</span>
            </div>
          </div>

          <div className={styles.formPanel} id="formulaire">
            <div className={styles.formDecor}>
              <Image alt="Produits et accessoires de beauté aux tons poudrés" fill sizes="(max-width: 800px) 100vw, 40vw" src="/demo/salon-beaute/contact_form_decor.jpg" />
            </div>
            <div className={styles.formWrap}>
              {sent ? (
                <div className={styles.success} role="status">
                  <span><Icon name="check" /></span>
                  <h2>Message envoyé</h2>
                  <p>Merci. Notre équipe vous répondra rapidement pour confirmer la suite.</p>
                  <button className={styles.textButton} onClick={() => setSent(false)} type="button">Envoyer un autre message</button>
                </div>
              ) : (
                <form className={styles.contactForm} onSubmit={submit}>
                  <span className={styles.sectionEyebrow}>Écrivez-nous</span>
                  <h2>{content.contact.form.title}</h2>
                  <div className={styles.formGrid}>
                    {content.contact.form.fields.map((field) => (
                      <label className={field.type === 'textarea' ? styles.formFieldWide : styles.formField} key={field.label}>
                        <span>{field.label}</span>
                        {field.type === 'textarea' ? (
                          <textarea name={field.label} placeholder={field.placeholder} required={field.required} rows={4} />
                        ) : field.type === 'select' ? (
                          <select defaultValue="" name={field.label} required={field.required}>
                            <option disabled value="">{field.placeholder ?? 'Sélectionnez...'}</option>
                            {field.options?.map((option) => <option key={option}>{option}</option>)}
                          </select>
                        ) : (
                          <input name={field.label} placeholder={field.placeholder} required={field.required} type={field.type} />
                        )}
                      </label>
                    ))}
                  </div>
                  <button className={`${styles.button} ${styles.buttonPrimary}`} type="submit">{content.contact.form.submitLabel}</button>
                  <p className={styles.formNote}>{content.contact.note}</p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  )
}

function PageShell({ children }: { children: React.ReactNode }) {
  return <><SalonBeauteNav /><main className={styles.page} id="contenu">{children}</main><SalonBeauteFooter /></>
}

function ValuesBand({ values, descriptions = false }: { values: Array<{ icon: string; label: string }>; descriptions?: boolean }) {
  return (
    <section className={styles.valuesBand} aria-label="Nos engagements">
      <div className={`${styles.container} ${styles.values}`}>
        {values.map((value) => (
          <div className={styles.valueItem} key={value.label}>
            <Icon name={value.icon} />
            <span><strong>{value.label}</strong>{descriptions && <small>{valueDescriptions[value.label]}</small>}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

function Icon({ name }: { name: string }) {
  const paths: Record<string, React.ReactNode> = {
    calendar: <><rect height="16" rx="2" width="18" x="3" y="5" /><path d="M8 3v4m8-4v4M3 10h18" /></>,
    arrow: <path d="M5 12h14m-6-7 7 7-7 7" />,
    expert: <><path d="m12 3 8 4-8 4-8-4 8-4Z" /><path d="M6 9v6c3 3 9 3 12 0V9" /></>,
    leaf: <><path d="M20 4C10 4 4 9 4 18c7 0 13-5 16-14Z" /><path d="M4 20c3-6 7-9 12-12" /></>,
    lotus: <path d="M12 20c-5 0-9-3-9-8 3 0 5 1 7 3-1-5 2-9 2-9s3 4 2 9c2-2 4-3 7-3 0 5-4 8-9 8Z" />,
    chat: <path d="M21 12a8 8 0 0 1-9 8 10 10 0 0 1-4-.8L3 21l1.5-4A8 8 0 1 1 21 12Z" />,
    pin: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
    phone: <path d="M22 16.9v3a2 2 0 0 1-2.2 2C10.4 20.8 3.2 13.6 2.1 4.2A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7A2 2 0 0 1 22 16.9Z" />,
    mail: <><rect height="16" rx="2" width="20" x="2" y="4" /><path d="m3 6 9 7 9-7" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    scissors: <><circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><path d="m20 4-12 12m5-5 7 9" /></>,
    brush: <path d="m14 4 6 6-9 9-7 1 1-7 9-9Zm-8 9 5 5" />,
    polish: <><path d="M8 3h8v5H8zM7 8h10l2 13H5L7 8Z" /><path d="M10 3v5" /></>,
  }
  return <svg aria-hidden="true" className={styles.icon} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" viewBox="0 0 24 24">{paths[name] ?? <circle cx="12" cy="12" r="9" />}</svg>
}
