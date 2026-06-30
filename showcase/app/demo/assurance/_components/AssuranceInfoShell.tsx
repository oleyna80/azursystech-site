'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'
import { useState } from 'react'

import buttonStyles from '@/components/assurance/buttons.module.css'
import {
  ChevronDownIcon,
  ClockIcon,
  LogoIcon,
  MailIcon,
  MapPinIcon,
  MenuIcon,
  PhoneIcon,
  XIcon,
} from '@/components/assurance/Icons'
import { PRODUCTS, productHref } from '@/components/assurance/products'
import tokenStyles from '@/components/assurance/tokens.module.css'

import styles from './AssuranceInfoShell.module.css'

type AssuranceInfoShellProps = {
  route: string
  tag: string
  title: string
  subtitle: string
  children: ReactNode
}

const NAV_LINKS = [
  { href: '/demo/assurance', label: 'Accueil' },
  { href: '/demo/assurance/a-propos', label: 'Qui Suis-Je' },
  { href: '/demo/assurance/avis', label: 'Avis' },
  { href: '/demo/assurance/faq', label: 'FAQ' },
  { href: '/demo/assurance/contact', label: 'Contact' },
]

export function AssuranceInfoShell({ route, tag, title, subtitle, children }: AssuranceInfoShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <main className={`${tokenStyles.root} ${styles.page}`} data-assurance-route={route}>
      <header className={styles.header}>
        <div className={`${tokenStyles.container} ${styles.headerInner}`}>
          <Link className={styles.logo} href="/demo/assurance" aria-label="Retour a l accueil assurance">
            <LogoIcon />
            <span>
              <strong>Paul Clément</strong>
              <small>Agent d&apos;Assurance</small>
            </span>
          </Link>

          <nav className={styles.desktopNav} aria-label="Navigation principale">
            <Link href="/demo/assurance">Accueil</Link>
            <div className={styles.navDropdown}>
              <button type="button" className={styles.navDropdownButton}>
                Nos Assurances
                <ChevronDownIcon />
              </button>
              <div className={styles.dropdownMenu}>
                {PRODUCTS.map((product) => (
                  <Link key={product.slug} href={productHref(product.slug)}>
                    {product.label}
                  </Link>
                ))}
              </div>
            </div>
            {NAV_LINKS.slice(1).map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </nav>

          <div className={styles.headerActions}>
            <a className={styles.phoneLink} href="tel:+33123456789">
              <PhoneIcon />
              <span>01 23 45 67 89</span>
            </a>
            <Link className={`${buttonStyles.btn} ${buttonStyles.primary} ${buttonStyles.sm}`} href="/demo/assurance/devis">
              Devis gratuit
            </Link>
          </div>

          <button
            type="button"
            className={styles.menuButton}
            aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((current) => !current)}
          >
            {mobileMenuOpen ? <XIcon /> : <MenuIcon />}
          </button>
        </div>

        <div
          className={`${styles.mobileMenu} ${mobileMenuOpen ? styles.mobileMenuOpen : ''}`}
          aria-hidden={!mobileMenuOpen}
        >
          <div className={`${tokenStyles.container} ${styles.mobileMenuInner}`}>
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)}>
                {link.label}
              </Link>
            ))}
            <details>
              <summary>Nos Assurances</summary>
              {PRODUCTS.map((product) => (
                <Link key={product.slug} href={productHref(product.slug)} onClick={() => setMobileMenuOpen(false)}>
                  {product.label}
                </Link>
              ))}
            </details>
            <Link href="/demo/assurance/devis" onClick={() => setMobileMenuOpen(false)}>
              Devis gratuit
            </Link>
            <a href="tel:+33123456789" onClick={() => setMobileMenuOpen(false)}>
              01 23 45 67 89
            </a>
          </div>
        </div>
      </header>

      <section className={styles.hero}>
        <div className={`${tokenStyles.container} ${styles.heroInner}`}>
          <span className={styles.kicker}>{tag}</span>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
      </section>

      {children}

      <footer className={styles.footer}>
        <div className={`${tokenStyles.container} ${styles.footerGrid}`}>
          <div className={styles.footerBrand}>
            <LogoIcon />
            <h2>Paul Clément</h2>
            <p>Agent d&apos;assurance indépendant à votre écoute pour protéger ce qui compte.</p>
          </div>
          <div>
            <h3>Assurances</h3>
            {PRODUCTS.slice(0, 5).map((product) => (
              <Link key={product.slug} href={productHref(product.slug)}>
                {product.label}
              </Link>
            ))}
          </div>
          <div>
            <h3>A propos</h3>
            <Link href="/demo/assurance/a-propos">Qui suis-je</Link>
            <Link href="/demo/assurance/avis">Avis clients</Link>
            <Link href="/demo/assurance/faq">FAQ</Link>
            <Link href="/demo/assurance/contact">Contact</Link>
          </div>
          <div>
            <h3>Contact</h3>
            <p>
              <MapPinIcon />
              123 Avenue des Champs, 75008 Paris
            </p>
            <p>
              <PhoneIcon />
              01 23 45 67 89
            </p>
            <p>
              <MailIcon />
              contact@paul-clement.fr
            </p>
            <p>
              <ClockIcon />
              Lun-Ven : 9h-18h
            </p>
          </div>
        </div>
        <div className={`${tokenStyles.container} ${styles.footerBottom}`}>
          <span>© 2026 Paul Clément Assurances. Demo portfolio.</span>
          <nav className={styles.legalLinks} aria-label="Informations legales">
            <Link href="/demo/assurance/mentions-legales">Mentions légales</Link>
            <Link href="/demo/assurance/mentions-legales#confidentialite">Confidentialité</Link>
            <Link href="/demo/assurance/mentions-legales#cookies">Cookies</Link>
          </nav>
          <Link href="/demo/assurance">Retour au site</Link>
        </div>
      </footer>

      <a className={styles.mobileCall} href="tel:+33123456789" aria-label="Appeler Paul Clement">
        <PhoneIcon />
      </a>
      <Link className={styles.returnLink} href="/demo/assurance">
        Retour au site
      </Link>
    </main>
  )
}
