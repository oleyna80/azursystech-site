'use client'

import { useState } from 'react'
import Link from 'next/link'
import { products, collections } from './data'
import tokenStyles from './tokens.module.css'
import styles from './catalogue.module.css'

export function CataloguePage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const filtered = activeCategory ? products.filter((p) => p.category === activeCategory) : products

  return (
    <div className={`${tokenStyles.root} ${styles.page}`}>
      <div className={tokenStyles.container}>
        <div className={styles.header}>
          <Link href="/demo/bijoux-artisanaux">← Retour</Link>
          <h1>Catalogue</h1>
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
            {collections.slice(1).map((col) => (
              <button
                key={col.id}
                className={`${styles.filterBtn} ${activeCategory === col.category ? styles.active : ''}`}
                onClick={() => setActiveCategory(col.category as string)}
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
                  {product.status === 'available' && 'Disponible'}
                  {product.status === 'made_to_order' && 'Sur commande'}
                  {product.status === 'sold_out' && 'Épuisé'}
                  {product.status === 'preorder' && 'Précommande'}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
