'use client'

import { useState } from 'react'
import type { Lang, ListingStatus } from './types'
import { listings, ui } from './data'
import { PropertyCard } from './PropertyCard'
import tk from './tokens.module.css'
import styles from './catalogue.module.css'

type CatalogueIntro = {
  heading: string
  body: string
}

type CataloguePageProps = {
  lang: Lang
  initialFilter?: ListingStatus | 'all'
  intro?: CatalogueIntro
}

export function CataloguePage({ lang, initialFilter = 'all', intro }: CataloguePageProps) {
  const t = ui[lang]
  const base = `/demo/immobilier/${lang}`
  const [filter, setFilter] = useState<ListingStatus | 'all'>(initialFilter)

  const filtered =
    filter === 'all' ? listings : listings.filter((l) => l.status === filter)

  return (
    <div className={styles.page}>
      <div className={tk.container}>

        {/* Variant intro (Buy / Rent pages only) */}
        {intro && (
          <div className={styles.intro}>
            <h1 className={styles.introHeading}>{intro.heading}</h1>
            <p className={styles.introBody}>{intro.body}</p>
          </div>
        )}

        {/* Page header */}
        <div className={styles.header}>
          {!intro && <h1 className={styles.title}>{t.catalogue.title}</h1>}
          {intro && <h2 className={styles.title}>{t.catalogue.title}</h2>}

          {/* Filters */}
          <div className={styles.filters} role="group" aria-label={lang === 'fr' ? 'Filtrer les biens' : 'Filter properties'}>
            {(['all', 'vente', 'location'] as const).map((f) => (
              <button
                key={f}
                type="button"
                className={`${styles.filter} ${filter === f ? styles.filterActive : ''}`}
                onClick={() => setFilter(f)}
                aria-pressed={filter === f}
              >
                {f === 'all'
                  ? t.catalogue.filter_all
                  : f === 'vente'
                  ? t.catalogue.filter_sale
                  : t.catalogue.filter_rent}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {filtered.length === 0 ? (
          <div className={styles.empty} role="status">
            <h2 className={styles.emptyTitle}>{t.catalogue.empty_title}</h2>
            <p className={styles.emptyBody}>{t.catalogue.empty_body}</p>
            <button
              type="button"
              className={styles.emptyReset}
              onClick={() => setFilter('all')}
            >
              {t.catalogue.reset}
            </button>
          </div>
        ) : (
          <ul className={styles.grid} aria-live="polite" aria-label={t.catalogue.title}>
            {filtered.map((listing) => (
              <li key={listing.id}>
                <PropertyCard listing={listing} lang={lang} base={base} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
