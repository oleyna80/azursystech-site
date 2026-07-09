'use client'

import Link from 'next/link'
import { products } from './data'
import { SiteShell } from './SiteShell'
import styles from './home.module.css'

const statusLabels = {
  available: 'Disponible',
  made_to_order: 'Sur commande',
  sold_out: 'Épuisé',
  preorder: 'Précommande',
} as const

export function HomePage() {
  const featured = products.filter((p) => p.featured)

  return (
    <SiteShell>
      <section className={styles.hero}>
        <div className={styles.heroGrid}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>Atelier Liora</p>
            <h1>Bijoux artisanaux faits main</h1>
            <p>
              Des pièces délicates façonnées avec passion dans notre studio. Une élégance intime pour célébrer vos instants précieux.
            </p>
            <div className={styles.heroActions}>
              <Link href="/demo/bijoux-artisanaux/catalogue" className={styles.btnPrimary}>
                Découvrir les collections
              </Link>
              <Link href="/demo/bijoux-artisanaux/custom-order" className={styles.btnSecondary}>
                Créer un bijou sur mesure
              </Link>
            </div>
          </div>
          <div className={styles.heroImage}>
            <img
              src="/demo/bijoux-artisanaux/hero.jpg"
              alt="Atelier Liora — bijoux artisanaux"
              loading="lazy"
            />
            <div className={styles.heroOverlay} />
            <div className={styles.heroRingOne} />
            <div className={styles.heroRingTwo} />
            <p className={styles.heroNote}>Pièces uniques ou petites séries, pensées pour durer.</p>
          </div>
        </div>
      </section>

      <section className={styles.story} id="histoire">
        <div className={styles.sectionShell}>
          <div className={styles.storyGrid}>
            <div className={styles.storyImage}>
              <img
                src="/demo/bijoux-artisanaux/story.jpg"
                alt="Savoir-faire"
                loading="lazy"
              />
              <div className={styles.storyBadge}>Savoir-faire</div>
            </div>
            <div className={styles.storyContent}>
              <p className={styles.eyebrow}>Notre essence</p>
              <h2>Le toucher avant tout</h2>
              <p>
                Chaque bijou qui quitte notre atelier raconte une histoire de matière. Les traces subtiles du travail manuel rendent
                chaque bague, collier ou bracelet profondément unique.
              </p>
              <p>
                Atelier Liora est un espace de création intime où le métal précieux rencontre l&apos;émotion, avec des matériaux choisis
                pour traverser le temps.
              </p>
              <blockquote className={styles.quote}>
                Chaque création naît d&apos;un dialogue entre le métal précieux et l&apos;outil.
                <span>— Liora, artisane joaillière</span>
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.featured}>
        <div className={styles.sectionShell}>
          <div className={styles.sectionHeader}>
            <div>
              <p className={styles.eyebrow}>Collections phares</p>
              <h2>Des créations à découvrir</h2>
            </div>
            <Link href="/demo/bijoux-artisanaux/catalogue" className={styles.btnSecondary}>
              Voir le catalogue
            </Link>
          </div>
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
                  <span className={styles.status}>{statusLabels[product.status]}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.cta}>
        <div className={styles.sectionShell}>
          <p className={styles.eyebrow}>Création sur mesure</p>
          <h2>Confiez-nous votre vision comme une lettre à l&apos;atelier.</h2>
          <p>
            Choisissez un type de bijou, une intention, des matières et quelques détails. L&apos;artisane vous répondra avec une
            proposition personnalisée.
          </p>
          <Link href="/demo/bijoux-artisanaux/custom-order" className={styles.btnLight}>
            Préparer ma demande
          </Link>
        </div>
      </section>

    </SiteShell>
  )
}
