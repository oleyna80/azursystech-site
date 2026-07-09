'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import tokenStyles from './tokens.module.css'
import styles from './customorder.module.css'

export function CustomOrderPage() {
  const router = useRouter()
  const [step, setStep] = useState<'form' | 'success'>('form')
  const [pending, setPending] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setPending(true)

    // Demo-only feedback; no message is sent from this showcase form.
    setTimeout(() => {
      setPending(false)
      setStep('success')

      setTimeout(() => {
        router.push('/demo/bijoux-artisanaux/merci')
      }, 2000)
    }, 800)
  }

  return (
    <div className={`${tokenStyles.root} ${styles.page}`}>
      <div className={tokenStyles.container}>
        <Link href="/demo/bijoux-artisanaux" className={styles.backLink}>
          ← Retour
        </Link>

        <div className={styles.formWrapper}>
          {step === 'form' ? (
            <>
              <h1>Pièce personnalisée</h1>
              <p>Décrivez votre vision et nous créerons quelque chose d&apos;unique pour vous.</p>

              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.field}>
                  <label htmlFor="name">Nom *</label>
                  <input type="text" id="name" name="name" required />
                </div>

                <div className={styles.field}>
                  <label htmlFor="email">Email *</label>
                  <input type="email" id="email" name="email" required />
                </div>

                <div className={styles.field}>
                  <label htmlFor="phone">Téléphone *</label>
                  <input type="tel" id="phone" name="phone" required />
                </div>

                <div className={styles.field}>
                  <label htmlFor="description">Description de la pièce *</label>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    placeholder="Décrivez votre projet..."
                    required
                  ></textarea>
                </div>

                <div className={styles.field}>
                  <label htmlFor="budget">Budget estimé *</label>
                  <input
                    type="text"
                    id="budget"
                    name="budget"
                    placeholder="Ex: 500€ - 1000€"
                    required
                  />
                </div>

                <div className={styles.field}>
                  <label htmlFor="timeline">Délai souhaité *</label>
                  <select id="timeline" name="timeline" required>
                    <option value="">Sélectionner</option>
                    <option value="2-4-weeks">2-4 semaines</option>
                    <option value="1-2-months">1-2 mois</option>
                    <option value="2-3-months">2-3 mois</option>
                    <option value="flexible">Flexible</option>
                  </select>
                </div>

                <button type="submit" className={styles.submitBtn} disabled={pending}>
                  {pending ? 'En cours...' : 'Envoyer la demande'}
                </button>
              </form>
            </>
          ) : (
            <div className={styles.success}>
              <div className={styles.successIcon}>✓</div>
              <h2>Merci !</h2>
              <p>Votre demande de démonstration est prête. Aucun message réel n&apos;est envoyé depuis ce formulaire.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
