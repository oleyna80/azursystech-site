'use client'

import type { ReactNode } from 'react'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { Lang } from './types'
import { ui } from './data'
import tk from './tokens.module.css'
import styles from './shell.module.css'

type SiteShellProps = {
  children: ReactNode
  lang: Lang
}

/**
 * Build an alternate-language URL for the current path.
 * /demo/immobilier/fr/catalogue → /demo/immobilier/en/catalogue
 */
function buildLangHref(pathname: string, target: Lang): string {
  const base = '/demo/immobilier'
  const after = pathname.slice(base.length) // e.g. /fr/catalogue
  const parts = after.split('/').filter(Boolean) // ['fr', 'catalogue']
  parts[0] = target
  return `${base}/${parts.join('/')}`
}

export function SiteShell({ children, lang }: SiteShellProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  const t = ui[lang]
  const other: Lang = lang === 'fr' ? 'en' : 'fr'
  const langHref = buildLangHref(pathname, other)

  const base = `/demo/immobilier/${lang}`

  const navItems = [
    { href: base, label: t.nav.home },
    { href: `${base}/catalogue`, label: t.nav.catalogue },
    { href: `${base}/vente`, label: t.nav.buy },
    { href: `${base}/location`, label: t.nav.rent },
    { href: `${base}/agence`, label: t.nav.agency },
    { href: `${base}/contact`, label: t.nav.contact },
  ]

  return (
    <div className={`${tk.root} ${styles.page}`}>
      <header className={styles.header}>
        <div className={`${tk.container} ${styles.headerInner}`}>
          {/* Wordmark */}
          <Link href={base} className={styles.wordmark} aria-label={t.nav.wordmark}>
            <svg
              aria-hidden="true"
              className={styles.wordmarkIcon}
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
            >
              {/* Abstract horizon/coastline motif */}
              <path
                d="M2 20 Q8 12 14 16 Q20 20 26 10"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                fill="none"
              />
              <line x1="2" y1="22" x2="26" y2="22" stroke="currentColor" strokeWidth="0.75" />
            </svg>
            <span className={styles.wordmarkText}>Atelier Rivage</span>
          </Link>

          {/* Desktop nav */}
          <nav className={styles.nav} aria-label={lang === 'fr' ? 'Navigation principale' : 'Main navigation'}>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={styles.navLink}
                aria-current={item.href === base ? (pathname === base ? 'page' : undefined) : (pathname === item.href || pathname.startsWith(item.href + '/') ? 'page' : undefined)}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right controls */}
          <div className={styles.controls}>
            {/* Language switcher */}
            <Link
              href={langHref}
              className={styles.langSwitch}
              hrefLang={other}
              aria-label={lang === 'fr' ? 'Switch to English' : 'Passer en français'}
            >
              {other.toUpperCase()}
            </Link>

            {/* Contact CTA */}
            <Link href={`${base}/contact`} className={styles.ctaBtn}>
              {t.nav.contact}
            </Link>

            {/* Mobile hamburger */}
            <button
              type="button"
              className={styles.burger}
              aria-label={menuOpen
                ? (lang === 'fr' ? 'Fermer le menu' : 'Close menu')
                : (lang === 'fr' ? 'Ouvrir le menu' : 'Open menu')}
              aria-expanded={menuOpen}
              aria-controls="rv-mobile-nav"
              onClick={() => setMenuOpen((o) => !o)}
            >
              <span className={`${styles.burgerBar} ${menuOpen ? styles.barTop : ''}`} />
              <span className={`${styles.burgerBar} ${menuOpen ? styles.barMid : ''}`} />
              <span className={`${styles.burgerBar} ${menuOpen ? styles.barBot : ''}`} />
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {menuOpen && (
          <nav id="rv-mobile-nav" className={styles.mobileNav} aria-label={lang === 'fr' ? 'Menu mobile' : 'Mobile menu'}>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={styles.mobileNavLink}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href={langHref}
              className={styles.mobileNavLink}
              hrefLang={other}
              onClick={() => setMenuOpen(false)}
            >
              {lang === 'fr' ? 'English' : 'Français'}
            </Link>
          </nav>
        )}
      </header>

      <main id="main-content">{children}</main>

      <footer className={styles.footer}>
        <div className={`${tk.container} ${styles.footerInner}`}>
          <div className={styles.footerBrand}>
            <Link href={base} className={styles.footerWordmark}>
              Atelier Rivage
            </Link>
            <p className={styles.footerTagline}>{t.footer.tagline}</p>
          </div>

          <div className={styles.footerLinks}>
            <p className={styles.footerLinksTitle}>{t.footer.nav_title}</p>
            <nav>
              {navItems.slice(1).map((item) => (
                <Link key={item.href} href={item.href} className={styles.footerLink}>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className={styles.footerContact}>
            <p className={styles.footerLinksTitle}>{t.footer.contact_title}</p>
            <address className={styles.footerAddress}>
              <p>06 — Côte d'Azur</p>
              <p className={styles.footerContactText}>+33 4 93 00 00 01</p>
              <p className={styles.footerContactText}>contact@atelier-rivage.fr</p>
            </address>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <div className={tk.container}>
            <p>{t.footer.copyright}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
