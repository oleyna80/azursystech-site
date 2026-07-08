'use client'

import Link from 'next/link'
import { products } from './data'
import tokenStyles from './tokens.module.css'
import styles from './home.module.css'

export function HomePage() {
  const featured = products.filter((p) => p.featured)

  return (
    <div className={`${tokenStyles.root} ${styles.page}`}>
      {/* Header */}
      <header className={styles.header}>
        <div className={tokenStyles.container}>
          <Link href="/demo/bijoux-artisanaux" className={styles.logoLink}>
            <svg className={styles.logoMark} viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="1.5" />
              <path d="M24 8 L28 24 L24 32 L20 24 Z" fill="currentColor" opacity="0.8" />
            </svg>
            <div className={styles.logoText}>
              <div className={styles.logoName}>Atelier Liora</div>
              <div className={styles.logoSub}>Bijoux</div>
            </div>
          </Link>

          <nav className={styles.nav}>
            <Link href="/demo/bijoux-artisanaux/catalogue">Catalogue</Link>
            <Link href="/demo/bijoux-artisanaux/custom-order">Pièce personnalisée</Link>
            <Link href="/demo/bijoux-artisanaux#contact">Contact</Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className={styles.hero}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.05fr 0.95fr', gap: '48px', alignItems: 'center', maxWidth: 'var(--bx-max-w-content)', margin: '0 auto', padding: '0 var(--bx-container-padding)' }}>
          <div>
            <p className={styles.eyebrow}>Atelier Liora</p>
            <h1>Bijoux artisanaux</h1>
            <p>
              Chaque pièce est façonnée à la main avec soin, en utilisant des matériaux choisis pour leur qualité et leur beauté.
            </p>
            <Link href="/demo/bijoux-artisanaux/catalogue" className={styles.btnPrimary}>
              Découvrir la collection
            </Link>
          </div>
          <div className={styles.heroImage}>
            <img
              src="/demo/bijoux-artisanaux/hero.jpg"
              alt="Atelier Liora"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* Story */}
      <section className={styles.story}>
        <div style={{ maxWidth: 'var(--bx-max-w-content)', margin: '0 auto', padding: '80px var(--bx-container-padding)' }}>
          <div className={styles.storyGrid}>
            <div className={styles.storyImage}>
              <img
                src="/demo/bijoux-artisanaux/story.jpg"
                alt="Savoir-faire"
                loading="lazy"
              />
            </div>
            <div className={styles.storyContent}>
              <p className={styles.eyebrow}>Savoir-faire</p>
              <h2>L&apos;histoire de chaque pièce</h2>
              <p>
                Depuis sa création, Atelier Liora crée des bijoux intemporels. Chaque pièce raconte une histoire de passion,
                de technique et de respect pour les matériaux naturels.
              </p>
              <blockquote className={styles.quote}>
                Des bijoux qui durent, créés pour traverser les générations.
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className={styles.featured}>
        <div style={{ maxWidth: 'var(--bx-max-w-content)', margin: '0 auto', padding: '80px var(--bx-container-padding)' }}>
          <h2>Pièces en vedette</h2>
          <div className={styles.productGrid}>
            {featured.map((product) => (
              <Link
                key={product.id}
                href={`/demo/bijoux-artisanaux/product/${product.slug}`}
                className={styles.productCard}
              >
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.name}
                    className={styles.productImage}
                    loading="lazy"
                  />
                )}
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <div className={styles.productMeta}>
                  <span className={styles.price}>{product.priceLabel}</span>
                  <span className={styles.status}>{product.status}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <div style={{ maxWidth: 'var(--bx-max-w-content)', margin: '0 auto', padding: '80px var(--bx-container-padding)', textAlign: 'center' }}>
          <h2>Vous ne trouvez pas ce que vous cherchez?</h2>
          <p>Contactez-nous pour une création personnalisée</p>
          <Link href="/demo/bijoux-artisanaux/custom-order" className={styles.btnSecondary}>
            Commander une pièce personnalisée
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div style={{ maxWidth: 'var(--bx-max-w-content)', margin: '0 auto', padding: '48px var(--bx-container-padding) 24px' }}>
          <div className={styles.footerContent}>
            <div className={styles.footerCol}>
              <h4>Atelier Liora</h4>
              <p>Bijoux artisanaux façonnés à la main.</p>
            </div>
            <div className={styles.footerCol}>
              <h4>Navigation</h4>
              <nav className={styles.footerNav}>
                <Link href="/demo/bijoux-artisanaux/catalogue">Catalogue</Link>
                <Link href="/demo/bijoux-artisanaux/custom-order">Personnalisée</Link>
                <Link href="/demo/bijoux-artisanaux#contact">Contact</Link>
              </nav>
            </div>
          </div>
          <div className={styles.footerBottom}>
            <p>&copy; 2024 Atelier Liora. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
