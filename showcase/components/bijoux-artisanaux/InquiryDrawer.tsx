'use client'

import { useEffect, useRef, useState } from 'react'
import type { Product } from './types'
import styles from './inquiry.module.css'

interface InquiryDrawerProps {
  product: Product
  isOpen: boolean
  onClose: () => void
}

export function InquiryDrawer({ product, isOpen, onClose }: InquiryDrawerProps) {
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [timeframe, setTimeframe] = useState('')
  const [pending, setPending] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const timersRef = useRef<number[]>([])

  const clearTimers = () => {
    timersRef.current.forEach((id) => window.clearTimeout(id))
    timersRef.current = []
  }

  useEffect(() => clearTimers, [])

  // The component stays mounted while closed (returns null), so stale timers
  // from an interrupted submit would fire onClose on a re-opened drawer.
  const handleClose = () => {
    clearTimers()
    setPending(false)
    setSuccess(false)
    onClose()
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!name.trim()) newErrors.name = 'Nom requis'
    if (!contact.trim()) newErrors.contact = 'Email ou téléphone requis'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact) && !/^\+?[0-9\s().-]{8,}$/.test(contact)) {
      newErrors.contact = 'Email ou téléphone invalide'
    }
    if (!timeframe) newErrors.timeframe = 'Sélectionnez une période'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setPending(true)

    // Simulate API call
    timersRef.current.push(
      window.setTimeout(() => {
        setPending(false)
        setSuccess(true)
        timersRef.current.push(
          window.setTimeout(() => {
            setSuccess(false)
            setName('')
            setContact('')
            setTimeframe('')
            onClose()
          }, 1500),
        )
      }, 800),
    )
  }

  if (!isOpen) return null

  return (
    <div className={styles.backdrop} onClick={handleClose}>
      <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Informations sur {product.name}</h2>
          <button className={styles.close} onClick={handleClose} aria-label="Fermer">
            ✕
          </button>
        </div>

        {!success ? (
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.productInfo}>
              <p className={styles.productName}>{product.name}</p>
              <p className={styles.productCollection}>{product.collection}</p>
            </div>

            <div className={styles.field}>
              <label htmlFor="name">Nom *</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Votre nom"
                className={errors.name ? styles.error : ''}
              />
              {errors.name && <span className={styles.errorMsg}>{errors.name}</span>}
            </div>

            <div className={styles.field}>
              <label htmlFor="contact">Email ou téléphone *</label>
              <input
                type="text"
                id="contact"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="contact@exemple.com ou +33..."
                className={errors.contact ? styles.error : ''}
              />
              {errors.contact && <span className={styles.errorMsg}>{errors.contact}</span>}
            </div>

            <div className={styles.field}>
              <label htmlFor="timeframe">Quand avez-vous besoin de cette pièce? *</label>
              <select
                id="timeframe"
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className={errors.timeframe ? styles.error : ''}
              >
                <option value="">Sélectionnez une période</option>
                <option value="2-4-weeks">2-4 semaines</option>
                <option value="1-2-months">1-2 mois</option>
                <option value="2-3-months">2-3 mois</option>
                <option value="flexible">Flexible</option>
              </select>
              {errors.timeframe && <span className={styles.errorMsg}>{errors.timeframe}</span>}
            </div>

            <button type="submit" className={styles.submitBtn} disabled={pending}>
              {pending ? 'En cours...' : 'Envoyer'}
            </button>
          </form>
        ) : (
          <div className={styles.success}>
            <div className={styles.successIcon}>✓</div>
            <p>Merci ! Nous vous contacterons dans les 48 h.</p>
          </div>
        )}
      </div>
    </div>
  )
}
