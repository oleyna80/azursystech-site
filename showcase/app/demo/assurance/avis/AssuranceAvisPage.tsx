import Link from 'next/link'

import buttonStyles from '@/components/assurance/buttons.module.css'
import { StarOutlineIcon } from '@/components/assurance/Icons'
import tokenStyles from '@/components/assurance/tokens.module.css'

import { AssuranceInfoShell } from '../_components/AssuranceInfoShell'
import styles from './page.module.css'

const STATS = [
  { value: '4,9', suffix: '/5', label: 'Note moyenne' },
  { value: '500', suffix: '+', label: 'Clients accompagnés' },
  { value: '98', suffix: '%', label: 'Clients satisfaits' },
]

const TESTIMONIALS = [
  {
    initials: 'ML',
    rating: 5,
    quote:
      "Paul a pris le temps d'analyser tous mes contrats existants et m'a permis d'économiser plus de 300 € par an sur mon assurance auto. Disponible et vraiment professionnel.",
    name: 'Marie-Laure D.',
    meta: 'Assurance auto · Paris 15ème',
  },
  {
    initials: 'TC',
    rating: 5,
    quote:
      "Suite à un dégât des eaux, Paul a été d'une aide précieuse pour la déclaration et le suivi du sinistre. Règlement obtenu en moins de 3 semaines. Je recommande vivement.",
    name: 'Thomas C.',
    meta: 'Multirisque habitation · Lyon',
  },
  {
    initials: 'SR',
    rating: 5,
    quote:
      "En tant qu'indépendante, je cherchais une RC pro adaptée à mon activité. Paul m'a trouvé une couverture complète à un tarif compétitif. Très satisfaite du service.",
    name: 'Sophie R.',
    meta: 'RC professionnelle · Bordeaux',
  },
  {
    initials: 'FP',
    rating: 5,
    quote:
      "Grâce aux conseils de Paul, j'ai pu changer mon assurance emprunteur et économiser 8 000 € sur la durée de mon prêt. Une démarche simple grâce à son accompagnement.",
    name: 'François P.',
    meta: 'Assurance emprunteur · Nantes',
  },
  {
    initials: 'AM',
    rating: 5,
    quote:
      "J'ai contacté Paul pour assurer notre appartement en location. Réponse rapide, contrat clair, prime compétitive. Un professionnel de confiance que je recommande sans hésiter.",
    name: 'Amélie M.',
    meta: 'Habitation locataire · Marseille',
  },
  {
    initials: 'LB',
    rating: 4,
    quote:
      "Paul nous a aidés à trouver une mutuelle familiale qui couvre bien nos enfants. Il a comparé plusieurs offres et nous a expliqué chaque différence. Très pédagogue.",
    name: 'Laurent B.',
    meta: 'Complémentaire santé · Toulouse',
  },
]

export function AssuranceAvisPage() {
  return (
    <AssuranceInfoShell
      route="avis-page"
      tag="Témoignages"
      title="Avis de mes clients"
      subtitle="Ce que mes clients disent de mon accompagnement. Leur confiance est ma plus grande fierté."
    >
      <section className={styles.reviewsSection}>
        <div className={tokenStyles.container}>
          <div className={styles.statsGrid}>
            {STATS.map((stat) => (
              <div className={styles.statCard} key={stat.label}>
                <strong>
                  {stat.value}
                  <span>{stat.suffix}</span>
                </strong>
                {stat.label === 'Note moyenne' && (
                  <div className={styles.statStars} aria-hidden="true">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <StarOutlineIcon key={index} />
                    ))}
                  </div>
                )}
                <p>{stat.label}</p>
              </div>
            ))}
          </div>

          <div className={styles.testimonialsGrid}>
            {TESTIMONIALS.map((testimonial) => (
              <article className={styles.testimonialCard} key={testimonial.name}>
                <div className={styles.stars} aria-label={`${testimonial.rating} étoiles sur 5`}>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <StarOutlineIcon key={index} className={index < testimonial.rating ? styles.starActive : styles.starMuted} />
                  ))}
                </div>
                <p>« {testimonial.quote} »</p>
                <footer>
                  <span className={styles.avatar}>{testimonial.initials}</span>
                  <span>
                    <strong>{testimonial.name}</strong>
                    <small>{testimonial.meta}</small>
                  </span>
                </footer>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className={`${tokenStyles.container} ${styles.ctaInner}`}>
          <h2>Rejoignez nos clients satisfaits</h2>
          <p>Demandez votre devis gratuit et sans engagement dès aujourd&apos;hui.</p>
          <Link className={`${buttonStyles.btn} ${buttonStyles.primary} ${buttonStyles.lg}`} href="/demo/assurance/devis">
            Demander un devis
          </Link>
        </div>
      </section>
    </AssuranceInfoShell>
  )
}
