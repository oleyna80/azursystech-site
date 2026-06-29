import Link from 'next/link'

import buttonStyles from '@/components/assurance/buttons.module.css'
import { ArrowIcon, CheckIcon, PhoneIcon } from '@/components/assurance/Icons'
import type { Product } from '@/components/assurance/products'
import { PRODUCTS, productHref } from '@/components/assurance/products'

import { AssuranceInfoShell } from '../../_components/AssuranceInfoShell'
import styles from './page.module.css'

type AssuranceProductPageProps = {
  product: Product
}

export function AssuranceProductPage({ product }: AssuranceProductPageProps) {
  const Icon = product.icon
  const relatedProducts = PRODUCTS.filter((candidate) => candidate.slug !== product.slug).slice(0, 3)

  return (
    <AssuranceInfoShell
      route="assurance-product-detail"
      tag={product.tag}
      title={product.label}
      subtitle={product.subtitle}
    >
      <section className={styles.productSection} data-assurance-product={product.slug}>
        <div className={styles.productLayout}>
          <article className={styles.contentColumn}>
            <span className={styles.eyebrow}>Ce que couvre cette assurance</span>
            <h2>Les garanties à vérifier avant de signer.</h2>
            <div className={styles.introCopy}>
              {product.intro.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <div className={styles.guaranteeBlock}>
              <h3>Garanties incluses</h3>
              <div className={styles.guaranteeGrid}>
                {product.guarantees.map((guarantee) => (
                  <div className={styles.guaranteeItem} key={guarantee}>
                    <span className={styles.checkWrap} aria-hidden="true">
                      <CheckIcon />
                    </span>
                    <span>{guarantee}</span>
                  </div>
                ))}
              </div>
            </div>
          </article>

          <aside className={styles.sidebar} aria-label="Demande de devis">
            <div className={styles.quoteCard}>
              <span className={styles.quoteIcon} aria-hidden="true">
                <Icon />
              </span>
              <h2>Demandez votre devis</h2>
              <p>Gratuit, sans engagement, réponse sous 24h.</p>
              <Link className={`${buttonStyles.btn} ${buttonStyles.primary}`} href={`/demo/assurance/devis?type=${product.slug}`}>
                Obtenir un devis
              </Link>
              <a className={`${buttonStyles.btn} ${buttonStyles.outlineWhite}`} href="tel:+33123456789">
                <PhoneIcon />
                01 23 45 67 89
              </a>
            </div>

            <div className={styles.partnerCard}>
              <h3>Compagnies partenaires</h3>
              <div className={styles.partnerList}>
                <span>AXA</span>
                <span>Allianz</span>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className={styles.relatedSection}>
        <div className={styles.relatedInner}>
          <div className={styles.relatedHeader}>
            <span className={styles.eyebrow}>Autres protections</span>
            <h2>Comparer avec d&apos;autres besoins.</h2>
          </div>
          <div className={styles.relatedGrid}>
            {relatedProducts.map((candidate) => (
              <Link className={styles.relatedLink} href={productHref(candidate.slug)} key={candidate.slug}>
                <span>
                  <strong>{candidate.label}</strong>
                  <small>{candidate.desc}</small>
                </span>
                <ArrowIcon />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.finalCta}>
        <div className={styles.finalCtaInner}>
          <div>
            <span className={styles.eyebrow}>Protégez-vous dès aujourd&apos;hui</span>
            <h2>Un devis clair avant tout engagement.</h2>
            <p>
              Cette page est un modèle demo : elle montre le parcours utilisateur, mais ne déclenche aucun backend ni
              envoi vers un assureur.
            </p>
          </div>
          <Link className={`${buttonStyles.btn} ${buttonStyles.primary} ${buttonStyles.lg}`} href="/demo/assurance/devis">
            Devis gratuit
            <ArrowIcon />
          </Link>
        </div>
      </section>
    </AssuranceInfoShell>
  )
}
