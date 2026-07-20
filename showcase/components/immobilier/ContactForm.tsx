'use client'

import { useState } from 'react'
import type { Lang } from './types'
import { ui } from './data'
import styles from './contact.module.css'

type ContactFormProps = {
  lang: Lang
  listingTitle?: string
  compact?: boolean
}

type FormErrors = {
  name?: string
  email?: string
  message?: string
}

export function ContactForm({ lang, listingTitle, compact = false }: ContactFormProps) {
  const t = ui[lang].contact

  const [fields, setFields] = useState({
    name: '',
    email: '',
    phone: '',
    message: listingTitle ? (lang === 'fr' ? `Je souhaite en savoir plus sur : ${listingTitle}` : `I would like more information about: ${listingTitle}`) : '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitted, setSubmitted] = useState(false)

  function validate(): FormErrors {
    const errs: FormErrors = {}
    if (!fields.name.trim()) errs.name = t.error_required
    if (!fields.email.trim()) errs.email = t.error_required
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) errs.email = t.error_email
    if (!fields.message.trim()) errs.message = t.error_required
    return errs
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      // Move focus to first error field
      const firstErrorId = `rv-field-${Object.keys(errs)[0]}`
      document.getElementById(firstErrorId)?.focus()
      return
    }
    setErrors({})
    setSubmitted(true)
  }

  function handleChange(field: keyof typeof fields) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFields((prev) => ({ ...prev, [field]: e.target.value }))
      if (errors[field as keyof FormErrors]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }))
      }
    }
  }

  if (submitted) {
    return (
      <div
        className={styles.success}
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" className={styles.successIcon}>
          <circle cx="12" cy="12" r="11" stroke="var(--rv-color-success)" strokeWidth="1.5"/>
          <path d="M7 12.5l3.5 3.5 6.5-7" stroke="var(--rv-color-success)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <p className={styles.successTitle}>{t.success_title}</p>
        <p className={styles.successBody}>{t.success_body}</p>
      </div>
    )
  }

  return (
    <form
      className={`${styles.form} ${compact ? styles.compact : ''}`}
      onSubmit={handleSubmit}
      noValidate
      aria-label={compact
        ? (lang === 'fr' ? 'Formulaire de contact' : 'Contact form')
        : t.title}
    >
      <div className={styles.demoNotice}>
        <p className={styles.demoNoticeTitle}>{t.demo_notice_title}</p>
        <p className={styles.demoNoticeBody}>{t.demo_notice_body}</p>
      </div>

      {/* Name */}
      <div className={styles.field}>
        <label htmlFor="rv-field-name" className={styles.label}>
          {t.name_label}
        </label>
        <input
          id="rv-field-name"
          type="text"
          className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
          placeholder={t.name_placeholder}
          value={fields.name}
          onChange={handleChange('name')}
          aria-required="true"
          aria-describedby={errors.name ? 'rv-err-name' : undefined}
          autoComplete="name"
        />
        {errors.name && (
          <p id="rv-err-name" className={styles.error} role="alert">{errors.name}</p>
        )}
      </div>

      {/* Email */}
      <div className={styles.field}>
        <label htmlFor="rv-field-email" className={styles.label}>
          {t.email_label}
        </label>
        <input
          id="rv-field-email"
          type="email"
          className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
          placeholder={t.email_placeholder}
          value={fields.email}
          onChange={handleChange('email')}
          aria-required="true"
          aria-describedby={errors.email ? 'rv-err-email' : undefined}
          autoComplete="email"
        />
        {errors.email && (
          <p id="rv-err-email" className={styles.error} role="alert">{errors.email}</p>
        )}
      </div>

      {/* Phone — optional, hidden in compact mode */}
      {!compact && (
        <div className={styles.field}>
          <label htmlFor="rv-field-phone" className={styles.label}>
            {t.phone_label}
          </label>
          <input
            id="rv-field-phone"
            type="tel"
            className={styles.input}
            placeholder={t.phone_placeholder}
            value={fields.phone}
            onChange={handleChange('phone')}
            autoComplete="tel"
          />
        </div>
      )}

      {/* Message */}
      <div className={styles.field}>
        <label htmlFor="rv-field-message" className={styles.label}>
          {t.message_label}
        </label>
        <textarea
          id="rv-field-message"
          className={`${styles.textarea} ${errors.message ? styles.inputError : ''}`}
          placeholder={t.message_placeholder}
          value={fields.message}
          onChange={handleChange('message')}
          rows={compact ? 3 : 5}
          aria-required="true"
          aria-describedby={errors.message ? 'rv-err-message' : undefined}
        />
        {errors.message && (
          <p id="rv-err-message" className={styles.error} role="alert">{errors.message}</p>
        )}
      </div>

      <button type="submit" className={styles.submit}>
        {t.submit}
      </button>
    </form>
  )
}
