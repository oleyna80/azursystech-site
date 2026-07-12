import Link from 'next/link'
import styles from './footer.module.css'

const basePath = '/demo/salon-beaute'

export function SalonBeauteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <div className={styles.brandTitle}><Scissors /><strong>Salon Beauté</strong></div>
          <p>Une expertise attentive pour révéler votre beauté naturelle, au cœur de Paris.</p>
          <div className={styles.social} aria-label="Nous contacter sur les réseaux sociaux">
            <Link aria-label="Instagram" href={`${basePath}/contact`}>ig</Link>
            <Link aria-label="Facebook" href={`${basePath}/contact`}>f</Link>
            <Link aria-label="WhatsApp" href={`${basePath}/contact`}>wa</Link>
          </div>
        </div>
        <div className={styles.column}>
          <strong>Nos soins</strong>
          <Link href={`${basePath}/services`}>Coiffure</Link><Link href={`${basePath}/services`}>Coloration</Link>
          <Link href={`${basePath}/services`}>Soins du visage</Link><Link href={`${basePath}/services`}>Manucure & pédicure</Link>
        </div>
        <div className={styles.column}>
          <strong>Le salon</strong>
          <Link href={`${basePath}/about`}>À propos</Link><Link href={`${basePath}/contact`}>Nous trouver</Link>
          <Link href={`${basePath}/contact#formulaire`}>Prendre rendez-vous</Link>
        </div>
        <div className={styles.column}>
          <strong>Contact</strong>
          <span>10 Rue de la Beauté<br />75001 Paris</span>
          <a href="tel:+33123456789">+33 1 23 45 67 89</a>
          <a href="mailto:contact@salonbeaute.fr">contact@salonbeaute.fr</a>
          <span>Lun - Sam · 9h00 - 20h00</span>
        </div>
      </div>
      <div className={styles.bottom}>
        <span>© 2024 Salon Beauté</span>
        <span>Beauté · Soin · Bien-être</span>
      </div>
    </footer>
  )
}

function Scissors() {
  return <svg aria-hidden="true" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><path d="m20 4-12 12m5-5 7 9" /></svg>
}
