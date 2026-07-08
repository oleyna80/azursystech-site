'use client'

import Link from 'next/link'
import tokenStyles from './tokens.module.css'
import styles from './thankyou.module.css'

export function ThankYouPage() {
  return (
    <div className={`${tokenStyles.root} ${styles.page}`}>
      <div className={tokenStyles.container}>
        <div className={styles.content}>
          <div className={styles.icon}>✓</div>
          <h1>Merci!</h1>
          <p>Votre demande de piece personnalisee a ete envoyee avec succes.</p>
          <p className={styles.subtitle}>
            Nos artisans examineront votre projet et vous recontacteront dans les 48 heures.
          </p>

          <div className={styles.actions}>
            <Link href="/demo/bijoux-artisanaux" className={styles.btnPrimary}>
              Retour à l&apos;accueil
            </Link>
            <Link href="/demo/bijoux-artisanaux/catalogue" className={styles.btnSecondary}>
              Voir le catalogue
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
