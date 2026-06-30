import Image from 'next/image'
import Link from 'next/link'

import buttonStyles from '@/components/assurance/buttons.module.css'
import { ArrowIcon, ClockIcon, ShieldIcon, StarOutlineIcon } from '@/components/assurance/Icons'
import tokenStyles from '@/components/assurance/tokens.module.css'

import { AssuranceInfoShell } from '../_components/AssuranceInfoShell'
import styles from './page.module.css'

const ENGAGEMENTS = [
  {
    icon: ShieldIcon,
    title: 'Transparence totale',
    body: "Je vous explique chaque clause, chaque exclusion, chaque franchise. Pas de mauvaises surprises lors d'un sinistre.",
  },
  {
    icon: ClockIcon,
    title: 'Disponibilité',
    body: "Je réponds à vos appels et messages dans les 24h. En cas de sinistre urgent, je m'engage à vous répondre le jour même.",
  },
  {
    icon: StarOutlineIcon,
    title: 'Excellence',
    body: 'Formation continue, veille réglementaire, note client de 4,9/5. Je maintiens mes compétences au niveau des meilleures pratiques du marché.',
  },
]

export function AssuranceAProposPage() {
  return (
    <AssuranceInfoShell
      route="a-propos-page"
      tag="À propos"
      title="Paul Clément"
      subtitle="Agent d'assurance indépendant, enregistré à l'ORIAS — à votre service depuis plus de 15 ans."
    >
      <section className={styles.storySection}>
        <div className={`${tokenStyles.container} ${styles.storyGrid}`}>
          <div className={styles.agentMedia}>
            <Image
              src="/demo/assurance/paul-clement.jpg"
              alt="Paul Clément, conseiller en assurance"
              fill
              sizes="(max-width: 900px) 100vw, 42vw"
              className={styles.agentImage}
            />
            <div className={styles.oriasBadge}>
              <span>ORIAS</span>
              n° 00 000 000
            </div>
          </div>

          <div className={styles.storyContent}>
            <span className={styles.eyebrow}>Mon parcours</span>
            <h2>Un engagement personnel pour chaque client</h2>
            <p>
              Après une formation en droit des assurances et plus de 15 ans d&apos;expérience dans le secteur,
              j&apos;ai choisi l&apos;indépendance pour vous offrir un service véritablement centré sur vos intérêts.
            </p>
            <p>
              Contrairement aux agents liés à une seule compagnie, je collabore avec AXA et Allianz pour vous
              proposer les meilleures offres, adaptées à votre situation réelle — pas à un produit standardisé.
            </p>
            <p>
              Mon rôle ne s&apos;arrête pas à la signature du contrat. Je vous accompagne dans toutes vos démarches :
              révisions annuelles, déclarations de sinistres, résiliations, et conseils au fil du temps.
            </p>
            <Link className={`${buttonStyles.btn} ${buttonStyles.primary} ${buttonStyles.lg}`} href="/demo/assurance/devis">
              Demander un devis gratuit
              <ArrowIcon />
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.engagementSection}>
        <div className={tokenStyles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.eyebrow}>Mes engagements</span>
            <h2>Ce à quoi vous pouvez vous attendre</h2>
          </div>

          <div className={styles.engagementGrid}>
            {ENGAGEMENTS.map((item) => {
              const Icon = item.icon
              return (
                <article className={styles.engagementCard} key={item.title}>
                  <span className={styles.cardIcon}>
                    <Icon />
                  </span>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className={`${tokenStyles.container} ${styles.ctaInner}`}>
          <h2>Parlons de votre situation</h2>
          <p>Un entretien gratuit et sans engagement pour faire le point sur vos besoins.</p>
          <div className={styles.ctaActions}>
            <Link className={`${buttonStyles.btn} ${buttonStyles.primary} ${buttonStyles.lg}`} href="/demo/assurance/devis">
              Demander un devis
            </Link>
            <Link className={`${buttonStyles.btn} ${buttonStyles.outlineWhite} ${buttonStyles.lg}`} href="/demo/assurance/contact">
              Prendre contact
            </Link>
          </div>
        </div>
      </section>
    </AssuranceInfoShell>
  )
}
