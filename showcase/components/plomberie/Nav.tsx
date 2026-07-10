import Link from 'next/link'
import styles from './nav.module.css'

export function PlomberieNav() {
  const nav = [
    { label: 'Accueil', href: '#top' },
    { label: 'Services', href: '#services' },
    { label: 'À propos', href: '#about' },
    { label: "Zone d'intervention", href: '#zone' },
    { label: 'Avis', href: '#avis' },
    { label: 'Contact', href: '#contact' },
  ]

  return (
    <header className={styles.nav}>
      <Link className={styles.brand} href="/demo/plomberie">
        <span className={styles.mark} aria-hidden="true">
          <svg fill="none" viewBox="0 0 36 44">
            <path d="M18 2C11 11 4 19 4 29a14 14 0 0 0 28 0C32 19 25 11 18 2Z" stroke="currentColor" strokeWidth="3" />
            <path d="M22 33a5 5 0 0 1-8 0" stroke="currentColor" strokeLinecap="round" strokeWidth="3" />
          </svg>
        </span>
        <span>
          <strong>Plomberie Pro</strong>
          <small>Votre plombier de confiance</small>
        </span>
      </Link>
      <nav className={styles.navMenu} aria-label="Demo navigation">
        {nav.map((item) => (
          <a href={item.href} key={item.href} className={styles.navLink}>
            {item.label}
          </a>
        ))}
      </nav>
      <div className={styles.actions}>
        <a className={styles.phone} href="tel:+33123456789">
          <svg aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7A2 2 0 0 1 22 16.9Z" />
          </svg>
          01 23 45 67 89
        </a>
        <a className={styles.cta} href="#contact">
          Devis Gratuit
        </a>
      </div>
    </header>
  )
}
