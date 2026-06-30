'use client'

import type { ChangeEvent, FormEvent } from 'react'
import { useState } from 'react'
import Link from 'next/link'

import buttonStyles from '@/components/assurance/buttons.module.css'
import {
  ArrowIcon,
  CheckIcon,
  ClockIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
} from '@/components/assurance/Icons'
import tokenStyles from '@/components/assurance/tokens.module.css'

import { AssuranceInfoShell } from '../_components/AssuranceInfoShell'
import styles from './page.module.css'

type FormValues = {
  prenom: string
  nom: string
  email: string
  sujet: string
  message: string
}

type FieldName = keyof FormValues
type FormErrors = Partial<Record<FieldName, string>>

const INITIAL_VALUES: FormValues = {
  prenom: '',
  nom: '',
  email: '',
  sujet: '',
  message: '',
}

const SUBJECT_OPTIONS = [
  { value: 'devis', label: 'Demande de devis' },
  { value: 'sinistre', label: 'Declaration de sinistre' },
  { value: 'contrat', label: 'Question sur mon contrat' },
  { value: 'resiliation', label: 'Resiliation' },
  { value: 'autre', label: 'Autre question' },
]

const CONTACT_DETAILS = [
  {
    icon: MapPinIcon,
    title: 'Adresse',
    lines: ['12 rue de la Paix', '75001 Paris, France'],
  },
  {
    icon: PhoneIcon,
    title: 'Telephone',
    lines: ['01 23 45 67 89'],
    href: 'tel:+33123456789',
  },
  {
    icon: MailIcon,
    title: 'Email',
    lines: ['contact@paulclement-assurance.fr'],
  },
  {
    icon: ClockIcon,
    title: 'Horaires',
    lines: ['Lundi - Vendredi : 9h00 - 18h00', 'Samedi : sur rendez-vous'],
  },
]

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {}
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!values.prenom.trim()) {
    errors.prenom = 'Indiquez votre prenom.'
  }

  if (!values.nom.trim()) {
    errors.nom = 'Indiquez votre nom.'
  }

  if (!values.email.trim()) {
    errors.email = 'Indiquez votre email.'
  } else if (!emailPattern.test(values.email.trim())) {
    errors.email = 'Utilisez un format email valide.'
  }

  if (!values.sujet) {
    errors.sujet = 'Choisissez un sujet.'
  }

  if (!values.message.trim()) {
    errors.message = 'Ajoutez votre message.'
  } else if (values.message.trim().length < 10) {
    errors.message = 'Votre message doit contenir au moins 10 caracteres.'
  }

  return errors
}

function errorProps(field: FieldName, errors: FormErrors) {
  const error = errors[field]

  return {
    'aria-invalid': Boolean(error),
    'aria-describedby': error ? `${field}-error` : undefined,
  }
}

export function AssuranceContactPage() {
  const [values, setValues] = useState<FormValues>(INITIAL_VALUES)
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitted, setSubmitted] = useState(false)

  function handleFieldChange(
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = event.target
    const fieldName = name as FieldName

    setValues((currentValues) => ({
      ...currentValues,
      [fieldName]: value,
    }))

    setErrors((currentErrors) => {
      if (!currentErrors[fieldName]) {
        return currentErrors
      }

      const nextErrors = { ...currentErrors }
      delete nextErrors[fieldName]
      return nextErrors
    })

    if (submitted) {
      setSubmitted(false)
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nextErrors = validate(values)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      setSubmitted(false)
      return
    }

    setSubmitted(true)
  }

  function resetForm() {
    setValues(INITIAL_VALUES)
    setErrors({})
    setSubmitted(false)
  }

  return (
    <AssuranceInfoShell
      route="contact-page"
      tag="Contact"
      title="Contactez-moi"
      subtitle="Je suis disponible du lundi au vendredi de 9h a 18h. N'hesitez pas a me laisser un message."
    >
      <section className={styles.contactSection}>
        <div className={`${tokenStyles.container} ${styles.contactLayout}`}>
          <aside className={styles.infoColumn} aria-label="Informations de contact">
            <section className={styles.infoPanel}>
              <p className={styles.sectionEyebrow}>Informations de contact</p>
              <h2>Un point de contact direct pour vos questions d&apos;assurance</h2>
              <p className={styles.infoIntro}>
                Retrouvez les coordonnees principales de l&apos;agence et les horaires
                d&apos;ouverture pour organiser un echange.
              </p>

              <div className={styles.detailList}>
                {CONTACT_DETAILS.map((detail) => {
                  const Icon = detail.icon
                  const content = (
                    <>
                      <span className={styles.detailTitle}>{detail.title}</span>
                      {detail.lines.map((line) => (
                        <span key={line} className={styles.detailLine}>
                          {line}
                        </span>
                      ))}
                    </>
                  )

                  return (
                    <div className={styles.detailItem} key={detail.title}>
                      <span className={styles.detailIcon} aria-hidden="true">
                        <Icon />
                      </span>
                      {detail.href ? (
                        <a className={styles.detailBody} href={detail.href}>
                          {content}
                        </a>
                      ) : (
                        <span className={styles.detailBody}>{content}</span>
                      )}
                    </div>
                  )
                })}
              </div>
            </section>

            <section className={styles.locationPanel} aria-label="Localisation">
              <div className={styles.mapFrame}>
                <span className={styles.mapPin} aria-hidden="true">
                  <MapPinIcon />
                </span>
                <div className={styles.mapGrid} aria-hidden="true" />
                <div className={styles.mapLabel}>
                  <strong>Paris 1er</strong>
                  <span>12 rue de la Paix</span>
                </div>
              </div>
              <div className={styles.locationCopy}>
                <h3>Accueil sur rendez-vous</h3>
                <p>
                  La carte interactive du site source est remplacee ici par un
                  panneau statique pour conserver un demo autonome.
                </p>
              </div>
            </section>
          </aside>

          <section className={styles.formPanel} aria-labelledby="contact-form-title">
            {submitted ? (
              <div className={styles.successPanel} role="status" aria-live="polite">
                <span className={styles.successIcon} aria-hidden="true">
                  <CheckIcon />
                </span>
                <p className={styles.sectionEyebrow}>Mode demo</p>
                <h2 id="contact-form-title">Message pret</h2>
                <p>
                  Aucun email n&apos;a ete envoye. Cette page confirme seulement le
                  parcours local du formulaire dans le portfolio.
                </p>
                <dl className={styles.summaryList}>
                  <div>
                    <dt>Nom</dt>
                    <dd>
                      {values.prenom} {values.nom}
                    </dd>
                  </div>
                  <div>
                    <dt>Sujet</dt>
                    <dd>
                      {
                        SUBJECT_OPTIONS.find((option) => option.value === values.sujet)
                          ?.label
                      }
                    </dd>
                  </div>
                </dl>
                <button
                  className={`${buttonStyles.btn} ${buttonStyles.primary}`}
                  type="button"
                  onClick={resetForm}
                >
                  Remplir un autre message
                  <ArrowIcon />
                </button>
              </div>
            ) : (
              <>
                <div className={styles.formHeading}>
                  <p className={styles.sectionEyebrow}>Envoyer un message</p>
                  <h2 id="contact-form-title">Expliquez votre besoin</h2>
                  <p>
                    Formulaire de demonstration : aucun message n&apos;est transmis a
                    un service externe depuis cette page.
                  </p>
                </div>

                {Object.keys(errors).length > 0 ? (
                  <div className={styles.errorBanner} role="alert">
                    Verifiez les champs signales avant de continuer.
                  </div>
                ) : null}

                <form
                  className={styles.formStack}
                  data-demo-form="contact"
                  onSubmit={handleSubmit}
                  noValidate
                >
                  <div className={styles.formGrid}>
                    <label className={styles.field} htmlFor="prenom">
                      <span>Prenom</span>
                      <input
                        id="prenom"
                        name="prenom"
                        type="text"
                        value={values.prenom}
                        onChange={handleFieldChange}
                        autoComplete="given-name"
                        {...errorProps('prenom', errors)}
                      />
                      {errors.prenom ? (
                        <span className={styles.fieldError} id="prenom-error">
                          {errors.prenom}
                        </span>
                      ) : null}
                    </label>

                    <label className={styles.field} htmlFor="nom">
                      <span>Nom</span>
                      <input
                        id="nom"
                        name="nom"
                        type="text"
                        value={values.nom}
                        onChange={handleFieldChange}
                        autoComplete="family-name"
                        {...errorProps('nom', errors)}
                      />
                      {errors.nom ? (
                        <span className={styles.fieldError} id="nom-error">
                          {errors.nom}
                        </span>
                      ) : null}
                    </label>
                  </div>

                  <label className={styles.field} htmlFor="email">
                    <span>Email</span>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={values.email}
                      onChange={handleFieldChange}
                      autoComplete="email"
                      {...errorProps('email', errors)}
                    />
                    {errors.email ? (
                      <span className={styles.fieldError} id="email-error">
                        {errors.email}
                      </span>
                    ) : null}
                  </label>

                  <label className={styles.field} htmlFor="sujet">
                    <span>Sujet</span>
                    <select
                      id="sujet"
                      name="sujet"
                      value={values.sujet}
                      onChange={handleFieldChange}
                      {...errorProps('sujet', errors)}
                    >
                      <option value="">Choisir un sujet</option>
                      {SUBJECT_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {errors.sujet ? (
                      <span className={styles.fieldError} id="sujet-error">
                        {errors.sujet}
                      </span>
                    ) : null}
                  </label>

                  <label className={styles.field} htmlFor="message">
                    <span>Message</span>
                    <textarea
                      id="message"
                      name="message"
                      rows={6}
                      value={values.message}
                      onChange={handleFieldChange}
                      {...errorProps('message', errors)}
                    />
                    {errors.message ? (
                      <span className={styles.fieldError} id="message-error">
                        {errors.message}
                      </span>
                    ) : null}
                  </label>

                  <div className={styles.submitRow}>
                    <button
                      className={`${buttonStyles.btn} ${buttonStyles.primary} ${styles.submitButton}`}
                      type="submit"
                      aria-label="Envoyer le message"
                    >
                      Envoyer
                    </button>
                    <p className={styles.formNote}>
                      Demo local : la validation reste dans le navigateur.
                    </p>
                  </div>
                </form>
              </>
            )}
          </section>
        </div>
      </section>

      <section className={styles.ctaBand}>
        <div className={`${tokenStyles.container} ${styles.ctaLayout}`}>
          <div>
            <p className={styles.sectionEyebrow}>Besoin d&apos;un tarif</p>
            <h2>Demander un devis personnalise</h2>
          </div>
          <div className={styles.ctaActions}>
            <Link
              className={`${buttonStyles.btn} ${buttonStyles.primary}`}
              href="/demo/assurance/devis"
            >
              Acceder au devis
              <ArrowIcon />
            </Link>
            <a className={`${buttonStyles.btn} ${buttonStyles.outlineWhite}`} href="tel:+33123456789">
              Appeler l&apos;agence
              <PhoneIcon />
            </a>
          </div>
        </div>
      </section>
    </AssuranceInfoShell>
  )
}
