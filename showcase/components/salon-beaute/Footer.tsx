import styles from './footer.module.css'

export function SalonBeauteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <strong>Salon de Beauté</strong>
          <span>Votre beauté, notre passion.</span>
          <div className={styles.social} aria-label="Réseaux sociaux">
            <a href="#contact">f</a>
            <a href="#contact">ig</a>
            <a href="#contact">wa</a>
          </div>
        </div>
        <div className={styles.column}>
          <strong>Services</strong>
          <a href="/demo/salon-beaute/services">Coiffure</a>
          <a href="/demo/salon-beaute/services">Coloration</a>
          <a href="/demo/salon-beaute/services">Soins du visage</a>
          <a href="/demo/salon-beaute/services">Manucure</a>
          <a href="/demo/salon-beaute/services">Épilation</a>
        </div>
        <div className={styles.column}>
          <strong>Liens rapides</strong>
          <a href="/demo/salon-beaute/about">À propos</a>
          <a href="/demo/salon-beaute/contact">Contact</a>
        </div>
        <div className={styles.column}>
          <strong>Contact</strong>
          <a href="tel:+33123456789">+33 1 23 45 67 89</a>
          <a href="/demo/salon-beaute/contact">10 Rue de la Beauté, 75001 Paris</a>
          <a href="/demo/salon-beaute/contact">Lun - Sam : 9h00 - 20h00</a>
        </div>
      </div>
      <div className={styles.bottom}>
        <span>© 2026 Salon de Beauté. Tous droits réservés.</span>
        <div>
          <a href="/demo/salon-beaute/contact">Mentions légales</a>
          <a href="/demo/salon-beaute/contact">Politique de confidentialité</a>
        </div>
      </div>
    </footer>
  )
}
