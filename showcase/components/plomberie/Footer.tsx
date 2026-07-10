import styles from './footer.module.css'

export function PlomberieFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <strong>Plomberie Pro</strong>
          <span>Intervention rapide et travail de qualité pour tous vos besoins en plomberie et chauffage.</span>
          <div className={styles.social} aria-label="Réseaux sociaux">
            <a href="#contact">f</a>
            <a href="#contact">ig</a>
            <a href="#contact">wa</a>
          </div>
        </div>
        <div className={styles.column}>
          <strong>Services</strong>
          <a href="#services">Dépannage Urgent</a>
          <a href="#services">Réparation</a>
          <a href="#services">Installation</a>
          <a href="#services">Rénovation</a>
          <a href="#services">Chauffage</a>
          <a href="#services">Maintenance</a>
        </div>
        <div className={styles.column}>
          <strong>Liens Rapides</strong>
          <a href="#about">À propos</a>
          <a href="#zone">Zone d&apos;intervention</a>
          <a href="#avis">Avis clients</a>
          <a href="#contact">Contact</a>
        </div>
        <div className={styles.column}>
          <strong>Contact</strong>
          <a href="tel:+33123456789">01 23 45 67 89</a>
          <a href="mailto:contact@plomberie-pro.fr">contact@plomberie-pro.fr</a>
          <a href="#zone">Paris et Île-de-France</a>
          <a href="#request">24/7 - Urgences</a>
        </div>
        <div className={`${styles.column} ${styles.cert}`}>
          <strong>Certification</strong>
          <span>Artisan plombier certifié</span>
          <span>Assurance décennale</span>
          <span>Garantie travaux</span>
        </div>
      </div>
      <div className={styles.bottom}>
        <span>© 2024 Plomberie Pro - Tous droits réservés</span>
        <div>
          <a href="#contact">Mentions légales</a>
          <a href="#contact">Politique de confidentialité</a>
        </div>
      </div>
    </footer>
  )
}
