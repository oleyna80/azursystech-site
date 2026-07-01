'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import {
  ArrowIcon,
  CheckIcon,
  ChevronDownIcon,
  LogoIcon,
  MenuIcon,
  PhoneIcon,
  ShieldIcon,
  ShieldLargeIcon,
  StarOutlineIcon,
  UsersIcon,
  XIcon,
} from '@/components/assurance/Icons'
import { PRODUCTS, productHref } from '@/components/assurance/products'
import { Reveal } from '@/components/assurance/Reveal'
import buttonStyles from '@/components/assurance/buttons.module.css'
import tokenStyles from '@/components/assurance/tokens.module.css'
import styles from './page.module.css'

const HERO_TRUST_ITEMS = [
  { icon: ShieldIcon, label: 'ORIAS certifie', detail: 'n° 00 000 000' },
  { icon: UsersIcon, label: '+500 clients', detail: 'satisfaits' },
  { icon: StarOutlineIcon, label: '4,9 / 5', detail: 'note moyenne' },
]
const PARTNERS = ['AXA', 'Allianz', 'Generali', 'MAIF', 'SwissLife']
const STATS = [
  { value: '2 500+', label: 'clients accompagnes' },
  { value: '15 ans', label: "d'experience" },
  { value: '98%', label: 'taux de satisfaction' },
  { value: '24h', label: 'delai de reponse' },
]
const TESTIMONIALS = [
  {
    quote:
      "Paul a su trouver une assurance habitation parfaitement adaptee a ma situation. Tres professionnel et a l'ecoute.",
    author: 'Marie D.',
    role: 'Cliente habitation',
  },
  {
    quote:
      "Enfin un courtier qui explique clairement les garanties. J'ai economise sur mon assurance auto sans perdre en couverture.",
    author: 'Thomas L.',
    role: 'Client auto',
  },
  {
    quote:
      "Accompagnement impeccable pour notre assurance emprunteur. Rapide, efficace et tres humain.",
    author: 'Sophie & Marc',
    role: 'Clients emprunteur',
  },
]

export function AssuranceHomePage() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [cookieVisible, setCookieVisible] = useState(true)

  return (
    <main className={`${tokenStyles.root} ${styles.page}`} data-assurance-route="static-homepage">
      <header className={styles.header}>
        <div className={`${tokenStyles.container} ${styles.headerInner}`}>
          <Link href="/demo/assurance" className={styles.logoLink} aria-label="Paul Clement, agent d'assurance">
            <span className={styles.logoMark}>
              <LogoIcon className={styles.logoIcon} />
            </span>
            <span>
              <span className={styles.logoName}>Paul Clément</span>
              <span className={styles.logoSub}>Agent d&apos;Assurance</span>
            </span>
          </Link>

          <nav className={styles.desktopNav} aria-label="Navigation principale">
            <Link href="/demo/assurance" className={styles.navLink}>
              Accueil
            </Link>
            <div className={styles.navItem}>
              <Link href="/demo/assurance#assurances" className={`${styles.navLink} ${styles.navWithIcon}`}>
                Nos Assurances
                <ChevronDownIcon className={styles.navIcon} />
              </Link>
              <div className={styles.navDropdown} role="menu" aria-label="Nos assurances">
                {PRODUCTS.map((product) => {
                  const Icon = product.icon
                  return (
                    <Link key={product.slug} href={productHref(product.slug)} className={styles.navDropdownLink} role="menuitem">
                      <Icon className={styles.navDropdownIcon} />
                      <span>{product.label}</span>
                    </Link>
                  )
                })}
              </div>
            </div>
            <Link href="/demo/assurance/a-propos" className={styles.navLink}>
              Qui Suis-Je
            </Link>
            <Link href="/demo/assurance/avis" className={styles.navLink}>
              Avis
            </Link>
            <Link href="/demo/assurance/faq" className={styles.navLink}>
              FAQ
            </Link>
            <Link href="/demo/assurance/contact" className={styles.navLink}>
              Contact
            </Link>
          </nav>

          <div className={styles.headerActions}>
            <a href="tel:+33123456789" className={styles.phoneLink}>
              <PhoneIcon className={styles.phoneIcon} />
              <span>01 23 45 67 89</span>
            </a>
            <Link href="/demo/assurance/devis" className={`${buttonStyles.btn} ${buttonStyles.primary} ${buttonStyles.sm}`}>
              Demander un devis
            </Link>
            <button
              type="button"
              className={styles.mobileToggle}
              aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((value) => !value)}
            >
              {mobileOpen ? <XIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        <nav className={styles.mobileNav} aria-label="Navigation mobile" data-open={mobileOpen}>
          <Link href="/demo/assurance" onClick={() => setMobileOpen(false)}>
            Accueil
          </Link>
          <span className={styles.mobileNavSection}>Nos Assurances</span>
          {PRODUCTS.map((product) => (
            <Link key={product.slug} href={productHref(product.slug)} onClick={() => setMobileOpen(false)}>
              {product.label}
            </Link>
          ))}
          <Link href="/demo/assurance#assurances" onClick={() => setMobileOpen(false)}>
            Toutes les assurances
          </Link>
          <Link href="/demo/assurance/a-propos" onClick={() => setMobileOpen(false)}>
            Qui Suis-Je
          </Link>
          <Link href="/demo/assurance/avis" onClick={() => setMobileOpen(false)}>
            Avis
          </Link>
          <Link href="/demo/assurance/faq" onClick={() => setMobileOpen(false)}>
            FAQ
          </Link>
          <Link href="/demo/assurance/contact" onClick={() => setMobileOpen(false)}>
            Contact
          </Link>
          <Link href="/demo/assurance/devis" className={styles.mobileNavCta} onClick={() => setMobileOpen(false)}>
            Demander un devis
          </Link>
        </nav>
      </header>

      <section id="accueil" className={styles.hero}>
        <Image src="/demo/assurance/paris-hero.jpg" alt="" fill priority className={styles.heroImage} sizes="100vw" />
        <div className={styles.heroOverlay} />
        <div className={styles.heroShield} aria-hidden="true">
          <ShieldLargeIcon />
        </div>
        <div className={`${tokenStyles.container} ${styles.heroContent}`}>
          <div className={styles.heroText}>
            <p className={styles.heroBadge}>Agent d&apos;assurance indépendant</p>
            <h1>
              Votre assurance,
              <br />
              votre <em>tranquillité</em>
            </h1>
            <p className={styles.heroLead}>
              Paul Clément vous accompagne dans le choix de vos assurances avec des solutions personnalisées, transparentes et adaptées à vos besoins.
            </p>
            <div className={styles.heroButtons}>
              <Link href="/demo/assurance/devis" className={`${buttonStyles.btn} ${buttonStyles.primary} ${buttonStyles.lg}`}>
                Demander un devis gratuit
                <ArrowIcon />
              </Link>
              <Link href="/demo/assurance#assurances" className={`${buttonStyles.btn} ${buttonStyles.outlineWhite} ${buttonStyles.lg}`}>
                Nos assurances
              </Link>
            </div>
            <ul className={styles.heroTrust} aria-label="Preuves de confiance">
              {HERO_TRUST_ITEMS.map((item) => {
                const Icon = item.icon
                return (
                  <li key={item.label} className={styles.heroTrustItem}>
                    <Icon className={styles.heroTrustIcon} />
                    <span className={styles.heroTrustText}>
                      <strong>{item.label}</strong>
                      <span>{item.detail}</span>
                    </span>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </section>

      <section id="assurances" className={styles.productsSection}>
        <div className={tokenStyles.container}>
          <Reveal>
            <div className={styles.sectionHeader}>
              <span className={styles.eyebrow}>Nos solutions</span>
              <h2>Une assurance adaptee a chaque moment de vie</h2>
              <p>Du foyer a l&apos;entreprise, nous comparons les garanties utiles et evitons les doublons.</p>
            </div>
          </Reveal>

          <div className={styles.productsGrid}>
            {PRODUCTS.map((product, index) => {
              const Icon = product.icon
              return (
                <Reveal key={product.slug} delay={((index % 4) + 1) as 1 | 2 | 3 | 4}>
                  <Link href={productHref(product.slug)} id={product.slug} className={styles.productCard}>
                    <span className={styles.productIconWrap}>
                      <Icon className={styles.productIcon} />
                    </span>
                    <span className={styles.productLabel}>{product.label}</span>
                    <span className={styles.productDesc}>{product.desc}</span>
                    <span className={styles.productCta}>
                      En savoir plus
                      <ArrowIcon />
                    </span>
                  </Link>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      <section className={styles.partnersSection} aria-label="Partenaires assureurs">
        <div className={tokenStyles.container}>
          <p>Ils nous font confiance</p>
          <div className={styles.partnersGrid}>
            {PARTNERS.map((partner) => (
              <span key={partner}>{partner}</span>
            ))}
          </div>
        </div>
      </section>

      <section id="pourquoi" className={styles.whySection}>
        <div className={`${tokenStyles.container} ${styles.whyGrid}`}>
          <Reveal>
            <div className={styles.whyMedia}>
              <Image src="/demo/assurance/paul-clement.jpg" alt="Paul Clement, conseiller en assurance" fill sizes="(max-width: 900px) 100vw, 44vw" className={styles.whyImage} />
              <div className={styles.experienceBadge}>
                <strong>15+</strong>
                <span>ans d&apos;experience</span>
              </div>
            </div>
          </Reveal>
          <Reveal delay={2}>
            <div className={styles.whyContent}>
              <span className={styles.eyebrow}>Pourquoi choisir Paul Clement</span>
              <h2>Un conseiller unique pour des decisions plus claires</h2>
              <p>
                Nous analysons votre situation, comparons les offres du marche et restons disponibles quand votre vie ou votre activite evolue.
              </p>
              <div className={styles.benefitsGrid}>
                {[
                  ['Independance', 'Conseil oriente client, pas compagnie.'],
                  ['Transparence', 'Garanties, exclusions et couts expliques simplement.'],
                  ['Reactivite', 'Accompagnement rapide en cas de changement ou sinistre.'],
                  ['Sur mesure', 'Contrats adaptes a vos vrais risques.'],
                ].map(([title, desc]) => (
                  <div key={title} className={styles.benefitItem}>
                    <CheckIcon />
                    <div>
                      <h3>{title}</h3>
                      <p>{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className={styles.statsSection}>
        <div className={`${tokenStyles.container} ${styles.statsGrid}`}>
          {STATS.map((stat) => (
            <Reveal key={stat.label}>
              <div className={styles.statCard}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className={styles.testimonialsSection}>
        <div className={tokenStyles.container}>
          <Reveal>
            <div className={styles.sectionHeader}>
              <span className={styles.eyebrow}>Temoignages</span>
              <h2>Des clients qui avancent avec confiance</h2>
            </div>
          </Reveal>
          <div className={styles.testimonialsGrid}>
            {TESTIMONIALS.map((testimonial, index) => (
              <Reveal key={testimonial.author} delay={((index % 3) + 1) as 1 | 2 | 3}>
                <article className={styles.testimonialCard}>
                  <div className={styles.stars} aria-hidden="true">
                    {Array.from({ length: 5 }).map((_, starIndex) => (
                      <StarOutlineIcon key={starIndex} className={styles.starIcon} />
                    ))}
                  </div>
                  <p>{`"${testimonial.quote}"`}</p>
                  <footer>
                    <strong>{testimonial.author}</strong>
                    <span>{testimonial.role}</span>
                  </footer>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="devis" className={styles.ctaSection}>
        <div className={`${tokenStyles.container} ${styles.ctaBox}`}>
          <div>
            <span className={styles.eyebrow}>Devis gratuit</span>
            <h2>Pret a comparer vos assurances ?</h2>
            <p>Un premier echange suffit pour identifier les garanties utiles et les economies possibles.</p>
          </div>
          <div className={styles.ctaActions}>
            <a href="tel:+33123456789" className={`${buttonStyles.btn} ${buttonStyles.primary}`}>
              <PhoneIcon />
              01 23 45 67 89
            </a>
            <Link href="/demo/assurance/contact" className={`${buttonStyles.btn} ${buttonStyles.outlineWhite}`}>
              Demander un rappel
            </Link>
          </div>
        </div>
      </section>

      <footer id="contact" className={styles.footer}>
        <div className={`${tokenStyles.container} ${styles.footerGrid}`}>
          <div>
            <Link href="/demo/assurance#accueil" className={styles.footerLogo}>
              <ShieldIcon />
              Paul Clement Assurances
            </Link>
            <p>Conseil et courtage en assurances pour particuliers, independants et entreprises a Paris.</p>
          </div>
          <div>
            <h3>Contact</h3>
            <a href="tel:+33123456789">01 23 45 67 89</a>
            <a href="mailto:contact@paul-clement-assurances.fr">contact@paul-clement-assurances.fr</a>
            <span>12 avenue de l&apos;Opera, 75002 Paris</span>
          </div>
          <div>
            <h3>Demo</h3>
            <Link href="/demo/plomberie">Voir Plomberie</Link>
            <Link href="/">Retour showcase</Link>
          </div>
        </div>
      </footer>

      <a href="tel:+33123456789" className={styles.mobileCall} aria-label="Appeler Paul Clement Assurances">
        <PhoneIcon />
      </a>

      {cookieVisible && (
        <div className={styles.cookieBanner} role="region" aria-label="Information cookies">
          <p>Cette demo utilise une banniere de cookies statique pour reproduire le site source.</p>
          <button type="button" onClick={() => setCookieVisible(false)}>
            OK
          </button>
        </div>
      )}

      <Link href="/" className={styles.returnLink}>
        <ArrowIcon />
        Retour au showcase
      </Link>
    </main>
  )
}
