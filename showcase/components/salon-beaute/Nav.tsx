'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import styles from './nav.module.css'

const nav = [
  { label: 'Accueil', href: '/demo/salon-beaute' },
  { label: 'Services', href: '/demo/salon-beaute/services' },
  { label: 'À propos', href: '/demo/salon-beaute/about' },
  { label: 'Contact', href: '/demo/salon-beaute/contact' },
]

export function SalonBeauteNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const close = (event: KeyboardEvent) => event.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [open])

  const isActive = (href: string) => href === '/demo/salon-beaute' ? pathname === href : pathname.startsWith(href)

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link className={styles.brand} href="/demo/salon-beaute">
          <Scissors />
          <span><strong>Salon Beauté</strong><small>Votre beauté, notre passion</small></span>
        </Link>
        <nav className={styles.desktopNav} aria-label="Navigation principale">
          {nav.map((item) => <Link aria-current={isActive(item.href) ? 'page' : undefined} className={styles.navLink} href={item.href} key={item.href}>{item.label}</Link>)}
        </nav>
        <div className={styles.actions}>
          <a className={styles.phone} href="tel:+33123456789"><Phone /> +33 1 23 45 67 89</a>
          <Link className={styles.cta} href="/demo/salon-beaute/contact#formulaire">Prendre rendez-vous</Link>
        </div>
        <button aria-controls="salon-mobile-menu" aria-expanded={open} aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'} className={styles.menuButton} onClick={() => setOpen((value) => !value)} type="button">
          <span /><span /><span />
        </button>
      </div>
      {open && <button aria-label="Fermer le menu" className={styles.overlay} onClick={() => setOpen(false)} type="button" />}
      <aside aria-hidden={!open} className={styles.drawer} data-open={open} id="salon-mobile-menu">
        <div className={styles.drawerTop}><span>Menu</span><button aria-label="Fermer le menu" onClick={() => setOpen(false)} type="button">×</button></div>
        <nav aria-label="Navigation mobile">
          {nav.map((item) => <Link aria-current={isActive(item.href) ? 'page' : undefined} href={item.href} key={item.href} onClick={() => setOpen(false)}>{item.label}</Link>)}
        </nav>
        <a className={styles.drawerPhone} href="tel:+33123456789"><Phone /> +33 1 23 45 67 89</a>
        <Link className={styles.drawerCta} href="/demo/salon-beaute/contact#formulaire" onClick={() => setOpen(false)}>Prendre rendez-vous</Link>
      </aside>
    </header>
  )
}

function Scissors() {
  return <svg aria-hidden="true" className={styles.mark} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><path d="m20 4-12 12m5-5 7 9" /></svg>
}

function Phone() {
  return <svg aria-hidden="true" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M22 16.9v3a2 2 0 0 1-2.2 2C10.4 20.8 3.2 13.6 2.1 4.2A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7A2 2 0 0 1 22 16.9Z" /></svg>
}
