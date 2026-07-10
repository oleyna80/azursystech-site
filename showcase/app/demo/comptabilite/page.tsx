'use client'

import Link from 'next/link'

export default function Page() {
  return (
    <main style={styles.main}>
      <section style={styles.hero}>
        <div style={styles.container}>
          <h1 style={styles.title}>Cabinet Comptable</h1>
          <p style={styles.eyebrow}>Démonstration en cours de développement</p>
          <p style={styles.subtitle}>
            Ce modèle de site pour cabinet comptable sera bientôt disponible. Il présentera les services de gestion comptable, audit, conseils fiscaux et
            accompagnement des entreprises.
          </p>
          <div style={styles.actions}>
            <Link href="/" style={styles.buttonPrimary as React.CSSProperties}>
              Retour au site principal
            </Link>
            <Link href="/demo/salon-beaute" style={styles.buttonSecondary as React.CSSProperties}>
              Voir d&apos;autres démos
            </Link>
          </div>
        </div>
      </section>

      <section style={styles.features}>
        <div style={styles.container}>
          <h2 style={styles.featureTitle}>À venir dans cette démo</h2>
          <div style={styles.featureGrid}>
            <div style={styles.featureCard}>
              <span style={styles.featureIcon}>📊</span>
              <h3>Gestion comptable</h3>
              <p>Tenue de compte, bilan, compte de résultat et déclarations</p>
            </div>
            <div style={styles.featureCard}>
              <span style={styles.featureIcon}>🔍</span>
              <h3>Audit et contrôle</h3>
              <p>Audit légal, révision et certification des comptes</p>
            </div>
            <div style={styles.featureCard}>
              <span style={styles.featureIcon}>📋</span>
              <h3>Conseils fiscaux</h3>
              <p>Optimisation fiscale, fiscalité internationale et déclarations</p>
            </div>
            <div style={styles.featureCard}>
              <span style={styles.featureIcon}>💼</span>
              <h3>Accompagnement</h3>
              <p>Création d&apos;entreprise, restructuration et diagnostic</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

const styles = {
  main: {
    minHeight: '100vh',
    background: '#f5f5f5',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  } as React.CSSProperties,
  hero: {
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    color: 'white',
    padding: '6rem 0',
    textAlign: 'center' as const,
  } as React.CSSProperties,
  container: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '0 1.5rem',
  } as React.CSSProperties,
  title: {
    fontSize: '3rem',
    fontWeight: 700,
    marginBottom: '0.5rem',
  } as React.CSSProperties,
  eyebrow: {
    fontSize: '1rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    opacity: 0.8,
    marginBottom: '1.5rem',
  } as React.CSSProperties,
  subtitle: {
    fontSize: '1.25rem',
    lineHeight: 1.6,
    opacity: 0.95,
    maxWidth: '600px',
    margin: '0 auto 2rem',
  } as React.CSSProperties,
  actions: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    flexWrap: 'wrap' as const,
  } as React.CSSProperties,
  buttonPrimary: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '0.875rem 1.75rem',
    background: '#0D9488',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    fontWeight: 600,
    fontSize: '1rem',
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
  } as React.CSSProperties,
  buttonSecondary: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '0.875rem 1.75rem',
    background: 'transparent',
    color: 'white',
    border: '2px solid white',
    borderRadius: '0.5rem',
    fontWeight: 600,
    fontSize: '1rem',
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
  } as React.CSSProperties,
  features: {
    padding: '4rem 0',
    background: 'white',
  } as React.CSSProperties,
  featureTitle: {
    fontSize: '2rem',
    fontWeight: 700,
    textAlign: 'center' as const,
    color: '#1a1a2e',
    marginBottom: '3rem',
  } as React.CSSProperties,
  featureGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '2rem',
  } as React.CSSProperties,
  featureCard: {
    padding: '2rem',
    textAlign: 'center' as const,
    borderRadius: '0.5rem',
    border: '1px solid #e0e0e0',
    background: '#f9f9f9',
  } as React.CSSProperties,
  featureIcon: {
    fontSize: '2.5rem',
    display: 'block',
    marginBottom: '1rem',
  } as React.CSSProperties,
}
