'use client'

import type { ReactNode } from 'react'
import { useState } from 'react'
import Link from 'next/link'
import { LogoMark } from './LogoMark'
import tokenStyles from './tokens.module.css'
import styles from './home.module.css'

type SiteShellProps = {
  children: ReactNode
}

const navLinks = [
  { href: '/demo/bijoux-artisanaux', label: 'Accueil' },
  { href: '/demo/bijoux-artisanaux/catalogue', label: 'Catalogue' },
  { href: '/demo/bijoux-artisanaux/custom-order', label: 'Sur mesure' },
  { href: '/demo/bijoux-artisanaux#histoire', label: 'Notre histoire' },
]

export function SiteShell({ children }: SiteShellProps) {
  const [menuOpen, setMenuOpen] = useState(false)

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
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </nav>

          <Link href="/demo/bijoux-artisanaux/custom-order" className={styles.navCta}>
            Créer sur mesure
          </Link>

          <button
            type="button"
            className={styles.menuToggle}
            aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className={`${styles.menuToggleBar} ${menuOpen ? styles.menuToggleBarTop : ''}`} />
            <span className={`${styles.menuToggleBar} ${menuOpen ? styles.menuToggleBarMid : ''}`} />
            <span className={`${styles.menuToggleBar} ${menuOpen ? styles.menuToggleBarBottom : ''}`} />
          </button>
        </div>

        {menuOpen && (
          <nav className={styles.mobileNav} aria-label="Menu mobile">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>
                {link.label}
              </Link>
            ))}
            <Link
              href="/demo/bijoux-artisanaux/custom-order"
              className={styles.mobileNavCta}
              onClick={() => setMenuOpen(false)}
            >
              Créer sur mesure
            </Link>
          </nav>
        )}
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
