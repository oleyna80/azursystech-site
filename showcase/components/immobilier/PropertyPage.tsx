import Image from 'next/image'
import Link from 'next/link'
import type { Lang } from './types'
import { getListing, getAgent, getRelated, ui } from './data'
import { Gallery } from './Gallery'
import { ContactForm } from './ContactForm'
import { PropertyCard } from './PropertyCard'
import tk from './tokens.module.css'
import styles from './property.module.css'

type PropertyPageProps = {
  lang: Lang
  slug: string
}

export function PropertyPage({ lang, slug }: PropertyPageProps) {
  const t = ui[lang]
  const base = `/demo/immobilier/${lang}`
  const listing = getListing(slug)

  // notFound is called in the route page — this is a safety net
  if (!listing) return null

  const agent = getAgent(listing.agentId)
  const related = getRelated(listing)

  const floorLabel =
    listing.floor === null
      ? null
      : listing.floor === 0
      ? t.detail.ground_floor
      : `${listing.floor}${lang === 'fr' ? 'e' : 'th'} ${t.detail.floor}`

  return (
    <div>
      {/* Breadcrumb */}
      <nav className={styles.breadcrumb} aria-label={lang === 'fr' ? "Fil d'Ariane" : 'Breadcrumb'}>
        <div className={tk.container}>
          <Link href={`${base}/catalogue`} className={styles.breadLink}>
            ← {t.nav.catalogue}
          </Link>
        </div>
      </nav>

      <div className={`${tk.container} ${styles.layout}`}>
        {/* Main column */}
        <div className={styles.main}>
          {/* Gallery */}
          <Gallery images={listing.images} title={listing.title[lang]} t={t.detail} />

          {/* Property meta */}
          <header className={styles.propHead}>
            <div>
              <p className={styles.propCity}>{listing.city}</p>
              <h1 className={styles.propTitle}>{listing.title[lang]}</h1>
            </div>
            <span className={`${styles.badge} ${listing.status === 'vente' ? styles.badgeSale : styles.badgeRent}`}>
              {t.status[listing.status]}
            </span>
          </header>

          {/* Facts bar */}
          <dl className={styles.facts}>
            <div className={styles.fact}>
              <dt className={styles.factLabel}>{t.detail.rooms}</dt>
              <dd className={styles.factValue}>{listing.rooms}</dd>
            </div>
            <div className={styles.fact}>
              <dt className={styles.factLabel}>{t.detail.bedrooms}</dt>
              <dd className={styles.factValue}>{listing.bedrooms}</dd>
            </div>
            <div className={styles.fact}>
              <dt className={styles.factLabel}>{t.detail.area}</dt>
              <dd className={styles.factValue}>{listing.area} m²</dd>
            </div>
            {floorLabel && (
              <div className={styles.fact}>
                <dt className={styles.factLabel}>{t.detail.floor}</dt>
                <dd className={styles.factValue}>{floorLabel}</dd>
              </div>
            )}
          </dl>

          {/* Description */}
          <section aria-labelledby="desc-heading">
            <h2 id="desc-heading" className={styles.sectionTitle}>{t.detail.description}</h2>
            <p className={styles.description}>{listing.description[lang]}</p>
          </section>

          {/* Features */}
          <section aria-labelledby="feat-heading" className={styles.featuresSection}>
            <h2 id="feat-heading" className={styles.sectionTitle}>{t.detail.features}</h2>
            <ul className={styles.features}>
              {listing.features[lang].map((f) => (
                <li key={f} className={styles.feature}>
                  <span className={styles.featureDot} aria-hidden="true">·</span>
                  {f}
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Contact panel */}
        <aside className={styles.panel} aria-label={lang === 'fr' ? 'Panneau contact' : 'Contact panel'}>
          <div className={styles.panelSticky}>
            <div className={styles.panelPrice}>
              <span className={styles.panelPriceLabel}>
                {lang === 'fr' ? 'Prix' : 'Price'}
              </span>
              {listing.priceLabel[lang]}
            </div>

            {agent && (
              <div className={styles.panelAgent}>
                <p className={styles.panelAgentName}>{agent.name}</p>
                <p className={styles.panelAgentRole}>{agent.role[lang]}</p>
                <p className={styles.panelContactText}>{agent.phone}</p>
              </div>
            )}

            <ContactForm lang={lang} listingTitle={listing.title[lang]} compact />
          </div>
        </aside>
      </div>

      {/* Locality */}
      <div className={styles.locality}>
        <div className={tk.container}>
          <div className={styles.localityImage} aria-hidden="true">
            <Image
              src="/demo/immobilier/locality.jpg"
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 1240px"
              className={styles.localityImg}
            />
          </div>
          <p className={styles.localityCaption} aria-hidden="true">
            {listing.city} — {lang === 'fr' ? 'Côte d\u2019Azur' : 'Côte d\u2019Azur'}
          </p>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className={styles.related} aria-labelledby="related-heading">
          <div className={tk.container}>
            <h2 id="related-heading" className={styles.relatedTitle}>{t.detail.related}</h2>
            <div className={styles.relatedGrid}>
              {related.map((l) => (
                <PropertyCard key={l.id} listing={l} lang={lang} base={base} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
