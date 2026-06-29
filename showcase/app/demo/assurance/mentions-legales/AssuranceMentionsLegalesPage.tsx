import type { ReactNode } from 'react'

import tokenStyles from '@/components/assurance/tokens.module.css'

import { AssuranceInfoShell } from '../_components/AssuranceInfoShell'
import styles from './page.module.css'

type LegalSection = {
  id?: string
  title: string
  body: ReactNode
}

const LEGAL_SECTIONS: LegalSection[] = [
  {
    title: '1. Éditeur du site',
    body: (
      <>
        <p>Le présent site est édité par :</p>
        <p>
          <strong>Paul Clément</strong>
          <br />
          Agent d&apos;assurance indépendant
          <br />
          12 rue de la Paix, 75001 Paris, France
          <br />
          Téléphone : 01 23 45 67 89
          <br />
          E-mail : contact@paulclement-assurance.fr
          <br />
          ORIAS n° : 00 000 000 (registre consultable sur{' '}
          <a href="https://www.orias.fr" target="_blank" rel="noopener noreferrer">
            www.orias.fr
          </a>
          )
        </p>
      </>
    ),
  },
  {
    title: '2. Hébergement',
    body: (
      <p>
        Le site est hébergé par un prestataire tiers. Les coordonnées de
        l&apos;hébergeur seront précisées lors de la mise en ligne définitive du site.
      </p>
    ),
  },
  {
    title: '3. Activité réglementée',
    body: (
      <>
        <p>
          Paul Clément exerce l&apos;activité d&apos;intermédiaire en assurance régie par
          les articles L. 511-1 et suivants du Code des assurances. Il est enregistré
          à l&apos;ORIAS (Organisme pour le Registre des Intermédiaires en Assurance)
          sous le numéro 00 000 000, consultable sur{' '}
          <a href="https://www.orias.fr" target="_blank" rel="noopener noreferrer">
            www.orias.fr
          </a>
          .
        </p>
        <p>
          Paul Clément est soumis au contrôle de l&apos;ACPR (Autorité de Contrôle
          Prudentiel et de Résolution), 4 Place de Budapest, CS 92459, 75436 Paris
          Cedex 09.
        </p>
      </>
    ),
  },
  {
    id: 'confidentialite',
    title: '4. Politique de confidentialité',
    body: (
      <>
        <p>
          Les données personnelles collectées via les formulaires du présent site
          (nom, prénom, e-mail, téléphone, message) sont utilisées exclusivement
          pour répondre à vos demandes de devis ou de contact.
        </p>
        <p>
          Ces données sont traitées conformément au Règlement (UE) 2016/679
          (RGPD) et à la loi Informatique et Libertés. Elles ne sont pas transmises
          à des tiers sans votre consentement et sont conservées pendant une durée
          maximale de 3 ans.
        </p>
        <p>
          Vous disposez d&apos;un droit d&apos;accès, de rectification, d&apos;effacement,
          de portabilité et d&apos;opposition sur vos données. Pour exercer ces droits,
          contactez :{' '}
          <a href="mailto:contact@paulclement-assurance.fr">
            contact@paulclement-assurance.fr
          </a>
          .
        </p>
        <p>
          En cas de réclamation, vous pouvez contacter la CNIL :{' '}
          <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">
            www.cnil.fr
          </a>
          .
        </p>
      </>
    ),
  },
  {
    id: 'cookies',
    title: '5. Gestion des cookies',
    body: (
      <>
        <p>
          Ce site utilise des cookies techniques strictement nécessaires à son
          fonctionnement (préférence d&apos;acceptation des cookies). Aucun cookie
          analytique ou publicitaire n&apos;est déposé sans votre consentement.
        </p>
        <p>
          Vous pouvez à tout moment modifier vos préférences via le bandeau de
          consentement ou en vidant le stockage local de votre navigateur.
        </p>
      </>
    ),
  },
  {
    title: '6. Propriété intellectuelle',
    body: (
      <p>
        L&apos;ensemble du contenu de ce site (textes, logos, images, structure) est
        protégé par le droit d&apos;auteur. Toute reproduction, même partielle, est
        interdite sans autorisation écrite préalable de Paul Clément.
      </p>
    ),
  },
  {
    title: '7. Limitation de responsabilité',
    body: (
      <p>
        Les informations contenues sur ce site sont fournies à titre indicatif.
        Elles ne constituent pas un conseil personnalisé et ne sauraient se
        substituer à un entretien avec un professionnel. Paul Clément ne saurait
        être tenu responsable d&apos;éventuelles erreurs, omissions ou résultats
        obtenus en utilisant ces informations.
      </p>
    ),
  },
  {
    title: '8. Médiation des assurances',
    body: (
      <p>
        En cas de litige non résolu, vous pouvez recourir gratuitement au Médiateur
        de l&apos;Assurance :
        <br />
        La Médiation de l&apos;Assurance - TSA 50110 - 75441 Paris Cedex 09
        <br />
        Site :{' '}
        <a
          href="https://www.mediation-assurance.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          www.mediation-assurance.org
        </a>
      </p>
    ),
  },
]

export function AssuranceMentionsLegalesPage() {
  return (
    <AssuranceInfoShell
      route="mentions-legales-page"
      tag="Légal"
      title="Mentions Légales"
      subtitle="Informations légales, politique de confidentialité et gestion des cookies."
    >
      <section className={styles.legalSection}>
        <div className={`${tokenStyles.container} ${styles.legalLayout}`}>
          <aside className={styles.summary} aria-label="Sommaire des mentions légales">
            <p className={styles.summaryEyebrow}>Sommaire</p>
            <a href="#confidentialite">Politique de confidentialité</a>
            <a href="#cookies">Gestion des cookies</a>
            <a href="mailto:contact@paulclement-assurance.fr">Contact données personnelles</a>
          </aside>

          <div className={styles.legalContent}>
            {LEGAL_SECTIONS.map((section) => (
              <section
                className={styles.legalBlock}
                id={section.id}
                key={section.title}
                aria-labelledby={section.id ? `${section.id}-title` : undefined}
              >
                <h2 id={section.id ? `${section.id}-title` : undefined}>{section.title}</h2>
                {section.body}
              </section>
            ))}

            <p className={styles.updatedAt}>Dernière mise à jour : juin 2025</p>
          </div>
        </div>
      </section>
    </AssuranceInfoShell>
  )
}
