import Link from 'next/link'

import buttonStyles from '@/components/assurance/buttons.module.css'
import { ArrowIcon, CheckIcon } from '@/components/assurance/Icons'
import { PRODUCTS, productHref } from '@/components/assurance/products'

import { AssuranceInfoShell } from '../_components/AssuranceInfoShell'
import styles from './page.module.css'

export function AssuranceProductsIndexPage() {
  return (
    <AssuranceInfoShell
      route="assurance-products-index"
      tag="Nos assurances"
      title="Des protections claires pour chaque situation"
      subtitle="Auto, habitation, santé, emprunteur ou entreprise : retrouvez les garanties essentielles avant de demander un devis demo."
    >
      <section className={styles.introSection}>
        <div className={styles.introGrid}>
          <div>
            <span className={styles.eyebrow}>Catalogue Assurance</span>
            <h2>Choisissez le bon point de départ.</h2>
          </div>
          <p>
            Cette page regroupe les huit familles d&apos;assurance du site source. Chaque fiche détaille les
            garanties principales et renvoie vers le formulaire demo, sans envoi externe ni fournisseur réel.
          </p>
        </div>
      </section>

      <section className={styles.productsSection} aria-label="Types d'assurance">
        <div className={styles.productsGrid}>
          {PRODUCTS.map((product) => {
            const Icon = product.icon
            return (
              <Link className={styles.productTile} href={productHref(product.slug)} key={product.slug}>
                <span className={styles.iconWrap} aria-hidden="true">
                  <Icon />
                </span>
                <span className={styles.tileCopy}>
                  <span className={styles.tileTag}>{product.tag}</span>
                  <strong>{product.label}</strong>
                  <span>{product.desc}</span>
                </span>
                <ArrowIcon className={styles.tileArrow} />
              </Link>
            )
          })}
        </div>
      </section>

      <section className={styles.methodSection}>
        <div className={styles.methodContent}>
          <span className={styles.eyebrow}>Méthode</span>
          <h2>Comparer sans complexifier.</h2>
          <p>
            Le contenu reprend la structure du site assurance original : besoin, garanties incluses, partenaires et
            demande de devis. La version portfolio reste volontairement locale et démonstrative.
          </p>
          <ul>
            <li>
              <CheckIcon />
              <span>Une fiche par besoin d&apos;assurance.</span>
            </li>
            <li>
              <CheckIcon />
              <span>Garanties lisibles avant toute prise de contact.</span>
            </li>
            <li>
              <CheckIcon />
              <span>Formulaire demo sans action externe.</span>
            </li>
          </ul>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className={styles.ctaInner}>
          <div>
            <span className={styles.eyebrow}>Devis gratuit</span>
            <h2>Vous avez déjà identifié votre besoin ?</h2>
            <p>Le formulaire demo permet de simuler une demande sans quitter le showcase.</p>
          </div>
          <Link className={`${buttonStyles.btn} ${buttonStyles.primary} ${buttonStyles.lg}`} href="/demo/assurance/devis">
            Demander un devis
            <ArrowIcon />
          </Link>
        </div>
      </section>
    </AssuranceInfoShell>
  )
}
