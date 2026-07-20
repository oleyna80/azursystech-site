import Image from 'next/image'
import Link from 'next/link'
import type { Lang } from './types'
import { agents, ui } from './data'
import tk from './tokens.module.css'
import styles from './agency.module.css'

type AgencePageProps = { lang: Lang }

export function AgencePage({ lang }: AgencePageProps) {
  const t = ui[lang]
  const base = `/demo/immobilier/${lang}`

  const approach = lang === 'fr'
    ? [
        {
          title: 'Écoute',
          body: "Nous commençons par comprendre ce qu'un lieu doit vous procurer — pas uniquement ce qu'il doit mesurer ou coûter.",
        },
        {
          title: 'Sélection',
          body: "Chaque bien de notre sélection est visité et jugé avant d'être proposé. Nous ne publions pas de listes sans discernement.",
        },
        {
          title: 'Accompagnement',
          body: "De la première visite à la remise des clés, vous avez un interlocuteur unique qui connaît votre recherche.",
        },
      ]
    : [
        {
          title: 'Listening',
          body: 'We start by understanding what a place should feel like — not just what it should measure or cost.',
        },
        {
          title: 'Selection',
          body: "Every property in our selection is visited and assessed before being presented. We don't publish lists indiscriminately.",
        },
        {
          title: 'Guidance',
          body: 'From the first visit to handover, you have a single point of contact who knows your search.',
        },
      ]

  return (
    <div>
      {/* Hero */}
      <section className={styles.hero} aria-labelledby="agency-heading">
        <div className={`${tk.container} ${styles.heroInner}`}>
          <div className={styles.heroText}>
            <p className={styles.heroLabel}>Atelier Rivage</p>
            <h1 id="agency-heading" className={styles.heroTitle}>{t.agency.title}</h1>
            <p className={styles.heroSub}>{t.agency.subtitle}</p>
          </div>
          <div className={styles.heroImage} aria-hidden="true">
            <Image
              src="/demo/immobilier/agence.jpg"
              alt={lang === 'fr' ? "L'agence Atelier Rivage" : 'The Atelier Rivage agency'}
              fill
              sizes="(max-width: 768px) 100vw, 45vw"
              className={styles.heroImg}
              priority
            />
          </div>
        </div>
      </section>

      {/* Approach */}
      <section className={styles.approachSection} aria-labelledby="approach-heading">
        <div className={tk.container}>
          <h2 id="approach-heading" className={styles.sectionTitle}>{t.agency.approach_title}</h2>
          <div className={styles.approachGrid}>
            {approach.map((item, i) => (
              <div key={i} className={styles.approachItem}>
                <span className={styles.approachNum} aria-hidden="true">0{i + 1}</span>
                <h3 className={styles.approachTitle}>{item.title}</h3>
                <p className={styles.approachBody}>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className={styles.team} aria-labelledby="team-heading">
        <div className={tk.container}>
          <h2 id="team-heading" className={styles.sectionTitle}>
            {lang === 'fr' ? "L'équipe" : 'The team'}
          </h2>
          <div className={styles.agentGrid}>
            {agents.map((agent) => (
              <article key={agent.id} className={styles.agentCard}>
                <div className={styles.agentImage}>
                  <Image
                    src={agent.image}
                    alt={agent.name}
                    fill
                    sizes="(max-width: 768px) 60vw, 25vw"
                    className={styles.agentImg}
                  />
                </div>
                <div className={styles.agentContent}>
                  <h3 className={styles.agentName}>{agent.name}</h3>
                  <p className={styles.agentRole}>{agent.role[lang]}</p>
                  <p className={styles.agentBio}>{agent.bio[lang]}</p>
                  <div className={styles.agentLinks}>
                    <span className={styles.agentContactText}>{agent.phone}</span>
                    <span className={styles.agentContactText}>{agent.email}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta} aria-labelledby="cta-heading">
        <div className={tk.container}>
          <h2 id="cta-heading" className={styles.ctaTitle}>
            {lang === 'fr' ? 'Commençons ensemble.' : "Let's start together."}
          </h2>
          <Link href={`${base}/contact`} className={styles.ctaBtn}>
            {t.nav.contact}
          </Link>
        </div>
      </section>
    </div>
  )
}
