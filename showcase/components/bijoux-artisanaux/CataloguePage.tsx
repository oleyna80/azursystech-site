'use client'

import { useState } from 'react'
import Link from 'next/link'
import { products, collections, statusLabels } from './data'
import { SiteShell } from './SiteShell'
import tokenStyles from './tokens.module.css'
import styles from './catalogue.module.css'
import type { ProductCategory } from './types'

const categoryFilters = collections.filter(
  (col): col is (typeof collections)[number] & { category: ProductCategory } => col.category !== null,
)

export function CataloguePage() {
  const [activeCategory, setActiveCategory] = useState<ProductCategory | null>(null)

  const filtered = activeCategory ? products.filter((p) => p.category === activeCategory) : products

  return (
    <SiteShell>
      <div className={tokenStyles.container}>
        <div className={styles.header}>
          <p className={styles.eyebrow}>Le catalogue</p>
          <h1>Explorer les pièces de l’atelier</h1>
          <p className={styles.intro}>
            Un mini-catalogue calme et sélectif pour découvrir les collections, les matières et les pièces disponibles sur demande.
          </p>
        </div>

        <div className={styles.filtersSection}>
          <h2>Catégories</h2>
          <div className={styles.filterButtons}>
            <button
              className={`${styles.filterBtn} ${!activeCategory ? styles.active : ''}`}
              onClick={() => setActiveCategory(null)}
            >
              Toutes
            </button>
            {categoryFilters.map((col) => (
              <button
                key={col.id}
                className={`${styles.filterBtn} ${activeCategory === col.category ? styles.active : ''}`}
                onClick={() => setActiveCategory(col.category)}
              >
                {col.label}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.productGrid}>
          {filtered.map((product) => (
            <Link
              key={product.id}
              href={`/demo/bijoux-artisanaux/product/${product.slug}`}
              className={styles.productCard}
            >
              {product.image && (
                <div className={styles.imageWrapper}>
                  <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                  />
                </div>
              )}
              <div className={styles.content}>
                <h3>{product.name}</h3>
                <p className={styles.collection}>{product.collection}</p>
                <p className={styles.price}>{product.priceLabel}</p>
                <span className={`${styles.statusBadge} ${styles[product.status]}`}>
                  {statusLabels[product.status]}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </SiteShell>
  )
}
