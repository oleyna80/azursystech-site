import Link from 'next/link'
import styles from './nav.module.css'

export function SalonBeauteNav() {
  const nav = [
    { label: 'Accueil', href: '/demo/salon-beaute' },
    { label: 'Services', href: '/demo/salon-beaute/services' },
    { label: 'À propos', href: '/demo/salon-beaute/about' },
    { label: 'Contact', href: '/demo/salon-beaute/contact' },
  ]

  return (
    <header className={styles.nav}>
      <Link className={styles.brand} href="/demo/salon-beaute">
        <span className={styles.mark} aria-hidden="true">
          <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <circle cx="6" cy="6" r="3" />
            <circle cx="6" cy="18" r="3" />
            <line x1="20" x2="8.12" y1="4" y2="15.88" />
            <line x1="14.47" x2="20" y1="14.48" y2="20" />
            <line x1="8.12" x2="12" y1="8.12" y2="12" />
          </svg>
        </span>
        <span>
          <strong>Salon de Beauté</strong>
          <small>Votre beauté, notre passion</small>
        </span>
      </Link>
      <nav className={styles.navMenu} aria-label="Demo navigation">
        {nav.map((item) => (
          <Link href={item.href} key={item.href} className={styles.navLink}>
            {item.label}
          </Link>
        ))}
      </nav>
      <div className={styles.actions}>
        <a className={styles.phone} href="tel:+33123456789">
          <svg aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7A2 2 0 0 1 22 16.9Z" />
          </svg>
          +33 1 23 45 67 89
        </a>
        <Link className={styles.cta} href="/demo/salon-beaute/contact#formulaire">
          Prendre rendez-vous
        </Link>
      </div>
    </header>
  )
}
