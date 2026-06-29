'use client'

import Link from 'next/link'
import { useState } from 'react'

import buttonStyles from '@/components/assurance/buttons.module.css'

import { AssuranceInfoShell } from '../_components/AssuranceInfoShell'
import styles from './page.module.css'

const FAQ_ITEMS = [
  {
    question: 'Quelle est la différence entre un agent général et un courtier ?',
    answer:
      "Un agent général représente une ou plusieurs compagnies d'assurance spécifiques, tandis qu'un courtier est indépendant de tout assureur et peut comparer le marché entier. Paul Clément travaille en tant qu'agent indépendant, collaborant avec AXA et Allianz pour vous offrir le meilleur choix.",
  },
  {
    question: "Comment résilier mon contrat d'assurance ?",
    answer:
      "Depuis la loi Hamon (2014) et la loi Chatel, vous pouvez résilier la plupart des contrats d'assurance à tout moment après 1 an, sans frais ni pénalités. Pour les assurances auto et habitation, votre nouvel assureur peut même prendre en charge les démarches à votre place. Je vous accompagne dans toutes vos résiliations.",
  },
  {
    question: 'Que faire en cas de sinistre ?',
    answer:
      "Appelez-moi immédiatement — c'est le premier réflexe à avoir. Je vous guide étape par étape : déclaration sous 5 jours ouvrés (2 jours pour un vol), constitution du dossier, suivi avec l'expert. Mon accompagnement est inclus dans votre contrat, sans frais supplémentaires.",
  },
  {
    question: "Puis-je changer d'assurance emprunteur en cours de crédit ?",
    answer:
      "Oui ! Depuis la loi Lemoine (juin 2022), vous pouvez changer d'assurance emprunteur à tout moment, sans attendre la date anniversaire. C'est une opportunité significative d'économies : jusqu'à 15 000 € sur la durée d'un crédit. Contactez-moi pour une simulation gratuite.",
  },
  {
    question: "Qu'est-ce que la franchise dans un contrat d'assurance ?",
    answer:
      "La franchise est la somme qui reste à votre charge lors d'un sinistre. Par exemple, avec une franchise de 300 €, si votre sinistre est évalué à 1 000 €, l'assureur rembourse 700 €. Augmenter la franchise réduit votre prime, mais augmente votre reste à charge. Nous choisissons ensemble le bon équilibre.",
  },
  {
    question: 'Mon assurance habitation couvre-t-elle mes objets de valeur ?',
    answer:
      "Les contrats MRH standard couvrent les objets de valeur jusqu'à un certain plafond (bijoux, appareils électroniques, etc.). Pour les objets de grande valeur, il est recommandé d'ajouter une garantie objets de valeur avec déclaration et estimation. Je vous aide à évaluer vos besoins précis.",
  },
  {
    question: "L'assurance scolaire est-elle obligatoire ?",
    answer:
      "L'assurance scolaire n'est pas légalement obligatoire pour les activités scolaires obligatoires, mais elle est fortement recommandée et souvent exigée pour les activités extrascolaires (sorties, voyages, sports). Elle couvre votre enfant comme victime ET comme responsable d'un accident. Les tarifs sont très accessibles.",
  },
  {
    question: 'Combien de temps faut-il pour obtenir un devis ?',
    answer:
      'Après réception de votre demande, je vous rappelle sous 24h ouvrées. Selon la complexité de votre dossier, le devis personnalisé est généralement disponible dans les 48h. Pour des assurances simples (auto, habitation), je peux souvent vous donner une estimation dès le premier appel.',
  },
]

export function AssuranceFaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <AssuranceInfoShell
      route="faq-page"
      tag="FAQ"
      title="Questions fréquentes"
      subtitle="Toutes les réponses aux questions que vous vous posez sur l'assurance."
    >
      <section className={styles.faqSection}>
        <div className={styles.faqWrap}>
          <div className={styles.faqList}>
            {FAQ_ITEMS.map((item, index) => {
              const isOpen = openIndex === index
              return (
                <article className={styles.faqItem} key={item.question}>
                  <button
                    type="button"
                    className={styles.faqQuestion}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${index}`}
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                  >
                    <span>{item.question}</span>
                    <span className={styles.faqIcon} aria-hidden="true" data-open={isOpen}>
                      +
                    </span>
                  </button>
                  <div id={`faq-answer-${index}`} className={styles.faqAnswer} data-open={isOpen}>
                    <p>{item.answer}</p>
                  </div>
                </article>
              )
            })}
          </div>

          <div className={styles.contactPrompt}>
            <p>Vous ne trouvez pas la réponse à votre question ?</p>
            <Link className={`${buttonStyles.btn} ${buttonStyles.primary} ${buttonStyles.lg}`} href="/demo/assurance/contact">
              Me contacter directement
            </Link>
          </div>
        </div>
      </section>
    </AssuranceInfoShell>
  )
}
