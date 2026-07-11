import styles from "./footer.module.css";

export function PlomberieFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <strong>Plomberie Pro</strong>
          <span>
            Atelier hydraulique pour les urgences, réparations et projets à
            Paris et en petite couronne.
          </span>
        </div>
        <div className={styles.links}>
          <a href="#services">Services</a>
          <a href="#about">Méthode</a>
          <a href="#zone">Secteurs</a>
          <a href="#contact">Demander un devis</a>
        </div>
        <div className={styles.contact}>
          <a href="tel:+33123456789">01 23 45 67 89</a>
          <a href="mailto:contact@plomberie-pro.fr">contact@plomberie-pro.fr</a>
          <span>Urgences 24 h/24, 7 j/7</span>
        </div>
      </div>
      <div className={styles.bottom}>
        <span>© 2024 Plomberie Pro. Tous droits réservés.</span>
        <a href="#contact">Mentions légales</a>
      </div>
    </footer>
  );
}
