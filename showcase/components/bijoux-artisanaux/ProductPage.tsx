'use client'

import { useState } from 'react'
import Link from 'next/link'
import { getProduct } from './data'
import { InquiryDrawer } from './InquiryDrawer'
import tokenStyles from './tokens.module.css'
import styles from './product.module.css'

export function ProductPage({ slug }: { slug: string }) {
  const [inquiryOpen, setInquiryOpen] = useState(false)
  const product = getProduct(slug)

  if (!product) {
    return (
      <div className={`${tokenStyles.root} ${styles.page}`}>
        <div className={tokenStyles.container}>
          <Link href="/demo/bijoux-artisanaux/catalogue">← Retour au catalogue</Link>
          <h1>Produit non trouvé</h1>
        </div>
      </div>
    )
  }

  return (
    <div className={`${tokenStyles.root} ${styles.page}`}>
      <div className={tokenStyles.container}>
        <Link href="/demo/bijoux-artisanaux/catalogue" className={styles.backLink}>
          ← Catalogue
        </Link>

        <div className={styles.productContainer}>
          <div className={styles.imageSection}>
            {product.image && (
              <img src={product.image} alt={product.name} className={styles.mainImage} loading="lazy" />
            )}
          </div>

          <div className={styles.detailsSection}>
            <span className={styles.collection}>{product.collection}</span>
            <h1>{product.name}</h1>

            <p className={styles.description}>{product.description}</p>

            <div className={styles.meta}>
              <div>
                <label>Style :</label>
                <span>{product.style}</span>
              </div>
              <div>
                <label>Matériaux :</label>
                <span>{product.materials.join(', ')}</span>
              </div>
              <div>
                <label>Prix :</label>
                <span>{product.priceLabel}</span>
              </div>
            </div>

            <div className={styles.statusSection}>
              <span className={`${styles.statusBadge} ${styles[product.status]}`}>
                {product.status === 'available' && 'Disponible'}
                {product.status === 'made_to_order' && 'Sur commande'}
                {product.status === 'sold_out' && 'Épuisé'}
                {product.status === 'preorder' && 'Précommande'}
              </span>
              <span className={styles.price}>{product.priceLabel}</span>
            </div>

            {product.tags.length > 0 && (
              <div className={styles.tags}>
                {product.tags.map((tag) => (
                  <span key={tag} className={styles.tag}>
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className={styles.details}>
              <h3>Détails</h3>
              <dl>
                <dt>Matériaux</dt>
                <dd>{product.details.materials}</dd>
                <dt>Taille</dt>
                <dd>{product.details.size}</dd>
                <dt>Entretien</dt>
                <dd>{product.details.care}</dd>
              </dl>
            </div>

            {product.options.sizes || product.options.materials ? (
              <div className={styles.options}>
                <h3>Options</h3>
                {product.options.sizes && (
                  <div>
                    <label>Tailles disponibles :</label>
                    <div className={styles.optionsList}>
                      {product.options.sizes.map((size) => (
                        <button key={size} className={styles.optionBtn}>
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {product.options.materials && (
                  <div>
                    <label>Matériaux :</label>
                    <div className={styles.optionsList}>
                      {product.options.materials.map((material) => (
                        <button key={material} className={styles.optionBtn}>
                          {material}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : null}

            <button
              onClick={() => setInquiryOpen(true)}
              className={styles.ctaBtn}
            >
              Intéressé ? Demander plus d&apos;infos
            </button>

            <InquiryDrawer
              product={product}
              isOpen={inquiryOpen}
              onClose={() => setInquiryOpen(false)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
