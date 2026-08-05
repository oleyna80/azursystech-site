import Image from 'next/image'
import Link from 'next/link'
import type { Lang } from './types'
import { listings, agents, ui } from './data'
import { PropertyCard } from './PropertyCard'
import { HeroMedia } from './HeroMedia'
import tk from './tokens.module.css'
import styles from './home.module.css'

type HomePageProps = { lang: Lang }

export function HomePage({ lang }: HomePageProps) {
  const t = ui[lang]
  const base = `/demo/immobilier/${lang}`
  const featured = listings.filter((l) => l.featured)
  const agent = agents[0]

  return (
    <div>
      {/* ── Hero ── */}
      <section className={styles.hero} aria-labelledby="hero-heading">
        <HeroMedia />
        <div className={`${tk.container} ${styles.heroInner}`}>
          <div className={styles.heroContent}>
            <p className={styles.heroPre}>Atelier Rivage</p>
            <h1 id="hero-heading" className={styles.heroHeading}>
              {lang === 'fr'
                ? 'La Riviera, choisie avec soin.'
                : 'The Riviera, chosen with care.'}
            </h1>
            <p className={styles.heroTagline}>{t.hero.tagline}</p>
            <div className={styles.heroCtas}>
              <Link href={`${base}/vente`} className={styles.ctaPrimary}>
                {t.hero.cta_buy}
              </Link>
              <Link href={`${base}/location`} className={styles.ctaSecondary}>
                {t.hero.cta_rent}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Selected properties ── */}
      <section className={styles.featured} aria-labelledby="featured-heading">
        <div className={tk.container}>
          <div className={styles.sectionHead}>
            <h2 id="featured-heading" className={styles.sectionTitle}>
              {lang === 'fr' ? 'Une sélection' : 'A selection'}
            </h2>
            <Link href={`${base}/catalogue`} className={styles.sectionLink}>
              {t.nav.catalogue} →
            </Link>
          </div>
          <div className={styles.featuredGrid}>
            {/* Lead card — large left column */}
            {featured[0] && (
              <div className={styles.featuredMain}>
                <PropertyCard
                  listing={featured[0]}
                  lang={lang}
                  base={base}
                  variant="featured"
                />
              </div>
            )}
            {/* Secondary cards — stacked right column */}
            {featured.slice(1).length > 0 && (
              <div className={styles.featuredSide}>
                {featured.slice(1).map((listing) => (
                  <PropertyCard
                    key={listing.id}
                    listing={listing}
                    lang={lang}
                    base={base}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>


      {/* ── Agency approach ── */}
      <section className={styles.approach} aria-labelledby="approach-heading">
        <div className={`${tk.container} ${styles.approachInner}`}>
          <div className={styles.approachText}>
            <p className={styles.approachLabel}>
              {lang === 'fr' ? 'Notre approche' : 'Our approach'}
            </p>
            <h2 id="approach-heading" className={styles.approachHeading}>
              {lang === 'fr'
                ? 'Une recherche patiente, pas une transaction rapide.'
                : 'Patient search, not a quick transaction.'}
            </h2>
            <p className={styles.approachBody}>
              {lang === 'fr'
                ? "Atelier Rivage sélectionne chaque bien en tenant compte du lieu, de la lumière et de la durabilité de l'accord entre un espace et une personne. Nous travaillons avec un nombre limité d'acheteurs et de vendeurs à la fois."
                : "Atelier Rivage selects every property taking into account the place, the light, and the lasting fit between a space and a person. We work with a limited number of buyers and sellers at a time."}
            </p>
            <Link href={`${base}/agence`} className={styles.approachLink}>
              {t.nav.agency} →
            </Link>
          </div>
          <div className={styles.approachImage} aria-hidden="true">
            <Image
              src="/demo/immobilier/locality.jpg"
              alt={lang === 'fr' ? 'Vue côtière, Riviera' : 'Coastal view, Riviera'}
              fill
              sizes="(max-width: 768px) 100vw, 45vw"
              className={styles.approachImg}
            />
          </div>
        </div>
      </section>

      {/* ── Agent close ── */}
      <section className={styles.agentClose} aria-labelledby="agent-close-heading">
        <div className={`${tk.container} ${styles.agentInner}`}>
          <div className={styles.agentImage}>
            <Image
              src={agent.image}
              alt={agent.name}
              fill
              sizes="(max-width: 768px) 60vw, 20vw"
              className={styles.agentImg}
            />
          </div>
          <div className={styles.agentContent}>
            <p className={styles.approachLabel}>
              {lang === 'fr' ? 'Votre interlocutrice' : 'Your contact'}
            </p>
            <h2 id="agent-close-heading" className={styles.agentName}>{agent.name}</h2>
            <p className={styles.agentRole}>{agent.role[lang]}</p>
            <p className={styles.agentBio}>{agent.bio[lang]}</p>
            <Link href={`${base}/contact`} className={styles.ctaPrimary}>
              {t.nav.contact}
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
