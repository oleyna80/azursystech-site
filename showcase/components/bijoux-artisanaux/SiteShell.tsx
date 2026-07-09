import type { ReactNode } from 'react'
import Link from 'next/link'
import { LogoMark } from './LogoMark'
import tokenStyles from './tokens.module.css'
import styles from './home.module.css'

type SiteShellProps = {
  children: ReactNode
}

export function SiteShell({ children }: SiteShellProps) {
  return (
    <div className={`${tokenStyles.root} ${styles.page}`}>
      <header className={styles.header}>
        <div className={tokenStyles.container}>
          <Link href="/demo/bijoux-artisanaux" className={styles.logoLink}>
            <LogoMark className={styles.logoMark} curveId="showcase-bijoux-header" />
            <div className={styles.logoText}>
              <div className={styles.logoName}>Atelier Liora</div>
              <div className={styles.logoSub}>Bijoux artisanaux</div>
            </div>
          </Link>

          <nav className={styles.nav}>
            <Link href="/demo/bijoux-artisanaux">Accueil</Link>
            <Link href="/demo/bijoux-artisanaux/catalogue">Catalogue</Link>
            <Link href="/demo/bijoux-artisanaux/custom-order">Sur mesure</Link>
            <Link href="/demo/bijoux-artisanaux#histoire">Notre histoire</Link>
          </nav>

          <Link href="/demo/bijoux-artisanaux/custom-order" className={styles.navCta}>
            Créer sur mesure
          </Link>
        </div>
      </header>

      {children}

      <footer className={styles.footer}>
        <div className={styles.footerShell}>
          <div className={styles.footerContent}>
            <div className={styles.footerCol}>
              <LogoMark className={styles.footerLogo} curveId="showcase-bijoux-footer" />
              <h4>Atelier Liora</h4>
              <p>Bijoux artisanaux faits main, pièces uniques ou petites séries, façonnées avec patience dans un atelier intime.</p>
            </div>
            <div className={styles.footerCol}>
              <h4>Navigation</h4>
              <nav className={styles.footerNav}>
                <Link href="/demo/bijoux-artisanaux">Accueil</Link>
                <Link href="/demo/bijoux-artisanaux/catalogue">Catalogue</Link>
                <Link href="/demo/bijoux-artisanaux/custom-order">Création sur mesure</Link>
                <Link href="/demo/bijoux-artisanaux#histoire">Notre histoire</Link>
              </nav>
            </div>
          </div>
          <div className={styles.footerBottom}>
            <p>&copy; 2026 Atelier Liora. Façonné à la main avec passion.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
