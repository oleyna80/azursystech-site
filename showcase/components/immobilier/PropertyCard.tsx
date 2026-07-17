import Image from 'next/image'
import Link from 'next/link'
import type { Lang, Listing } from './types'
import { ui } from './data'
import styles from './card.module.css'

type PropertyCardProps = {
  listing: Listing
  lang: Lang
  base: string
  variant?: 'featured'
}

export function PropertyCard({ listing, lang, base, variant }: PropertyCardProps) {
  const t = ui[lang]

  return (
    <article className={`${styles.card}${variant === 'featured' ? ` ${styles.cardFeatured}` : ''}`}>
      <Link
        href={`${base}/bien/${listing.slug}`}
        className={styles.cardLink}
        aria-label={listing.title[lang]}
      >
        <div className={styles.cardImage}>
          <Image
            src={listing.images[0]}
            alt={`${listing.title[lang]} — ${listing.city}`}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className={styles.cardImg}
          />
          <span className={`${styles.badge} ${listing.status === 'vente' ? styles.badgeSale : styles.badgeRent}`}>
            {t.status[listing.status]}
          </span>
        </div>

        <div className={styles.cardBody}>
          <p className={styles.cardCity}>{listing.city}</p>
          <h3 className={styles.cardTitle}>{listing.title[lang]}</h3>

          <div className={styles.cardFacts}>
            <span>{listing.rooms} {t.catalogue.rooms_label}</span>
            <span aria-hidden="true">·</span>
            <span>{listing.area} {t.catalogue.area_label}</span>
          </div>

          <p className={styles.cardPrice}>{listing.priceLabel[lang]}</p>
        </div>
      </Link>
    </article>
  )
}
