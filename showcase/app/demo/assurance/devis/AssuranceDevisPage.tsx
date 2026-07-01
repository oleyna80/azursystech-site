'use client'

import Link from 'next/link'
import type { ChangeEvent, FormEvent } from 'react'
import { useState } from 'react'

import buttonStyles from '@/components/assurance/buttons.module.css'
import {
  ArrowIcon,
  CheckIcon,
  ChevronDownIcon,
  ClockIcon,
  LogoIcon,
  MailIcon,
  MapPinIcon,
  MenuIcon,
  PhoneIcon,
  ShieldIcon,
  XIcon,
} from '@/components/assurance/Icons'
import { PRODUCTS, productHref } from '@/components/assurance/products'
import tokenStyles from '@/components/assurance/tokens.module.css'

import styles from './page.module.css'

type FormValues = {
  prenom: string
  nom: string
  email: string
  telephone: string
  assurance: string
  message: string
  rgpd: boolean
}

type FieldName = keyof FormValues
type FormErrors = Partial<Record<FieldName, string>>

const INITIAL_VALUES: FormValues = {
  prenom: '',
  nom: '',
  email: '',
  telephone: '',
  assurance: '',
  message: '',
  rgpd: false,
}

const INSURANCE_OPTIONS = [
  { value: 'auto', label: 'Assurance Auto' },
  { value: 'habitation', label: 'Multirisque Habitation (MRH)' },
  { value: 'sante', label: 'Sante / Mutuelle' },
  { value: 'rc', label: 'Responsabilite Civile' },
  { value: 'emprunteur', label: 'Assurance Emprunteur' },
  { value: 'prevoyance', label: 'Prevoyance & Assurance Vie' },
  { value: 'scolaire', label: 'Assurance Scolaire' },
  { value: 'entreprise', label: 'Assurance Entreprise' },
  { value: 'autre', label: 'Autre / Plusieurs assurances' },
]

const NAV_LINKS = [
  { href: '/demo/assurance', label: 'Accueil' },
  { href: '/demo/assurance/a-propos', label: 'Qui Suis-Je' },
  { href: '/demo/assurance#avis', label: 'Avis' },
  { href: '/demo/assurance/faq', label: 'FAQ' },
  { href: '/demo/assurance/contact', label: 'Contact' },
]

const STEPS = [
  {
    title: 'Remplissez le formulaire',
    body: '2 minutes suffisent pour decrire votre besoin.',
  },
  {
    title: 'Je vous rappelle',
    body: 'Retour personnel sous 24h ouvrees.',
  },
  {
    title: 'Devis personnalise',
    body: 'Gratuit, clair et sans engagement.',
  },
]

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {}
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const phonePattern = /^[\d\s+\-().]{6,20}$/

  if (!values.prenom.trim()) {
    errors.prenom = 'Indiquez votre prenom.'
  }

  if (!values.nom.trim()) {
    errors.nom = 'Indiquez votre nom.'
  }

  if (!values.email.trim()) {
    errors.email = 'Indiquez votre email.'
  } else if (!emailPattern.test(values.email.trim())) {
    errors.email = 'Indiquez un email valide.'
  }

  if (values.telephone.trim() && !phonePattern.test(values.telephone.trim())) {
    errors.telephone = 'Indiquez un telephone valide.'
  }

  if (!values.assurance) {
    errors.assurance = 'Selectionnez un type d assurance.'
  }

  if (!values.rgpd) {
    errors.rgpd = 'Confirmez votre accord pour etre recontacte.'
  }

  return errors
}

function errorProps(name: FieldName, errors: FormErrors) {
  return {
    'aria-invalid': Boolean(errors[name]) || undefined,
    'aria-describedby': errors[name] ? `${name}-error` : undefined,
  }
}

export function AssuranceDevisPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [values, setValues] = useState<FormValues>(INITIAL_VALUES)
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitted, setSubmitted] = useState(false)

  function handleFieldChange(
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) {
    const field = event.target.name as FieldName
    const nextValue =
      event.target instanceof HTMLInputElement && event.target.type === 'checkbox'
        ? event.target.checked
        : event.target.value

    setValues((current) => ({
      ...current,
      [field]: nextValue,
    }))

    if (errors[field]) {
      setErrors((current) => {
        const next = { ...current }
        delete next[field]
        return next
      })
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validate(values)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length === 0) {
      setSubmitted(true)
    }
  }

  function resetForm() {
    setValues(INITIAL_VALUES)
    setErrors({})
    setSubmitted(false)
  }

  return (
    <main className={`${tokenStyles.root} ${styles.page}`} data-assurance-route="devis-page">
      <header className={styles.header}>
        <div className={`${tokenStyles.container} ${styles.headerInner}`}>
          <Link className={styles.logo} href="/demo/assurance" aria-label="Retour a l accueil assurance">
            <LogoIcon />
            <span>
              <strong>Paul Clément</strong>
              <small>Agent d&apos;Assurance</small>
            </span>
          </Link>

          <nav className={styles.desktopNav} aria-label="Navigation principale">
            {NAV_LINKS.slice(0, 1).map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
            <div className={styles.navDropdown}>
              <button type="button" className={styles.navDropdownButton}>
                Nos Assurances
                <ChevronDownIcon />
              </button>
              <div className={styles.dropdownMenu}>
                {PRODUCTS.map((product) => (
                  <Link key={product.slug} href={productHref(product.slug)}>
                    {product.label}
                  </Link>
                ))}
              </div>
            </div>
            {NAV_LINKS.slice(1).map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </nav>

          <div className={styles.headerActions}>
            <a className={styles.phoneLink} href="tel:+33123456789">
              <PhoneIcon />
              <span>01 23 45 67 89</span>
            </a>
            <Link className={`${buttonStyles.btn} ${buttonStyles.primary} ${buttonStyles.sm}`} href="/demo/assurance/devis">
              Devis gratuit
            </Link>
          </div>

          <button
            type="button"
            className={styles.menuButton}
            aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((current) => !current)}
          >
            {mobileMenuOpen ? <XIcon /> : <MenuIcon />}
          </button>
        </div>

        <div
          className={`${styles.mobileMenu} ${mobileMenuOpen ? styles.mobileMenuOpen : ''}`}
          aria-hidden={!mobileMenuOpen}
        >
          <div className={`${tokenStyles.container} ${styles.mobileMenuInner}`}>
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)}>
                {link.label}
              </Link>
            ))}
            <details>
              <summary>Nos Assurances</summary>
              {PRODUCTS.map((product) => (
                <Link key={product.slug} href={productHref(product.slug)} onClick={() => setMobileMenuOpen(false)}>
                  {product.label}
                </Link>
              ))}
            </details>
            <a href="tel:+33123456789" onClick={() => setMobileMenuOpen(false)}>
              01 23 45 67 89
            </a>
          </div>
        </div>
      </header>

      <section className={styles.hero}>
        <div className={`${tokenStyles.container} ${styles.heroInner}`}>
          <div className={styles.heroContent}>
            <span className={styles.kicker}>Devis gratuit</span>
            <h1>Demandez votre devis</h1>
            <p>
              Remplissez le formulaire ci-dessous. Je vous reponds personnellement sous 24h
              ouvrees avec une proposition adaptee a votre situation.
            </p>
          </div>
          <div className={styles.heroAside} aria-label="Garanties de contact">
            <div>
              <ShieldIcon />
              <span>Conseil independant</span>
            </div>
            <div>
              <ClockIcon />
              <span>Reponse sous 24h</span>
            </div>
            <div>
              <CheckIcon />
              <span>Sans engagement</span>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.requestSection}>
        <div className={`${tokenStyles.container} ${styles.requestLayout}`}>
          <section className={styles.formPanel} aria-labelledby="devis-form-title">
            {submitted ? (
              <div className={styles.successPanel} role="status" aria-live="polite">
                <div className={styles.successIcon}>
                  <CheckIcon />
                </div>
                <h2>Demande envoyee !</h2>
                <p>
                  Merci pour votre message. Dans cette demo, aucun email n&apos;est transmis a un
                  service externe. Le parcours confirme simplement l&apos;etat de succes local.
                </p>
                <button
                  type="button"
                  className={`${buttonStyles.btn} ${buttonStyles.primary}`}
                  onClick={resetForm}
                >
                  Envoyer une autre demande
                </button>
              </div>
            ) : (
              <>
                <div className={styles.formHeading}>
                  <p>Votre demande</p>
                  <h2 id="devis-form-title">Informations de contact</h2>
                </div>

                {Object.keys(errors).length > 0 ? (
                  <p className={styles.errorBanner} role="alert">
                    Veuillez corriger les champs signales.
                  </p>
                ) : null}

                <form className={styles.formStack} noValidate onSubmit={handleSubmit}>
                  <div className={styles.formGrid}>
                    <label className={styles.field}>
                      <span>Prenom *</span>
                      <input
                        type="text"
                        name="prenom"
                        autoComplete="given-name"
                        placeholder="Jean"
                        value={values.prenom}
                        onChange={handleFieldChange}
                        {...errorProps('prenom', errors)}
                      />
                      {errors.prenom ? (
                        <small id="prenom-error" className={styles.fieldError}>
                          {errors.prenom}
                        </small>
                      ) : null}
                    </label>

                    <label className={styles.field}>
                      <span>Nom *</span>
                      <input
                        type="text"
                        name="nom"
                        autoComplete="family-name"
                        placeholder="Dupont"
                        value={values.nom}
                        onChange={handleFieldChange}
                        {...errorProps('nom', errors)}
                      />
                      {errors.nom ? (
                        <small id="nom-error" className={styles.fieldError}>
                          {errors.nom}
                        </small>
                      ) : null}
                    </label>
                  </div>

                  <div className={styles.formGrid}>
                    <label className={styles.field}>
                      <span>Email *</span>
                      <input
                        type="email"
                        name="email"
                        autoComplete="email"
                        placeholder="jean.dupont@email.fr"
                        value={values.email}
                        onChange={handleFieldChange}
                        {...errorProps('email', errors)}
                      />
                      {errors.email ? (
                        <small id="email-error" className={styles.fieldError}>
                          {errors.email}
                        </small>
                      ) : null}
                    </label>

                    <label className={styles.field}>
                      <span>Telephone</span>
                      <input
                        type="tel"
                        name="telephone"
                        autoComplete="tel"
                        placeholder="06 12 34 56 78"
                        value={values.telephone}
                        onChange={handleFieldChange}
                        {...errorProps('telephone', errors)}
                      />
                      {errors.telephone ? (
                        <small id="telephone-error" className={styles.fieldError}>
                          {errors.telephone}
                        </small>
                      ) : null}
                    </label>
                  </div>

                  <label className={styles.field}>
                    <span>Type d&apos;assurance *</span>
                    <select
                      name="assurance"
                      value={values.assurance}
                      onChange={handleFieldChange}
                      {...errorProps('assurance', errors)}
                    >
                      <option value="">Selectionnez un type...</option>
                      {INSURANCE_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {errors.assurance ? (
                      <small id="assurance-error" className={styles.fieldError}>
                        {errors.assurance}
                      </small>
                    ) : null}
                  </label>

                  <label className={styles.field}>
                    <span>Votre besoin</span>
                    <textarea
                      name="message"
                      rows={5}
                      placeholder="Decrivez brievement votre situation ou vos besoins..."
                      value={values.message}
                      onChange={handleFieldChange}
                    />
                  </label>

                  <label className={styles.checkboxField}>
                    <input
                      type="checkbox"
                      name="rgpd"
                      checked={values.rgpd}
                      onChange={handleFieldChange}
                      {...errorProps('rgpd', errors)}
                    />
                    <span>
                      J&apos;accepte que mes informations soient utilisees pour me recontacter dans
                      le cadre de ma demande de devis.
                    </span>
                  </label>
                  {errors.rgpd ? (
                    <small id="rgpd-error" className={styles.fieldError}>
                      {errors.rgpd}
                    </small>
                  ) : null}

                  <button type="submit" className={`${buttonStyles.btn} ${buttonStyles.primary} ${styles.submitButton}`}>
                    Envoyer ma demande
                    <ArrowIcon />
                  </button>
                  <p className={styles.formNote}>Devis gratuit · Sans engagement · Reponse sous 24h</p>
                </form>
              </>
            )}
          </section>

          <aside className={styles.sideColumn} aria-label="Informations pratiques">
            <section className={styles.processCard}>
              <h2>Comment ca marche ?</h2>
              <ol>
                {STEPS.map((step, index) => (
                  <li key={step.title}>
                    <span>{index + 1}</span>
                    <div>
                      <h3>{step.title}</h3>
                      <p>{step.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            <section className={styles.callCard}>
              <h3>Preferez-vous appeler ?</h3>
              <p>Un echange direct permet de cadrer rapidement votre situation.</p>
              <a className={`${buttonStyles.btn} ${buttonStyles.primary}`} href="tel:+33123456789">
                <PhoneIcon />
                01 23 45 67 89
              </a>
              <small>Lun-Ven : 9h-18h</small>
            </section>
          </aside>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={`${tokenStyles.container} ${styles.footerGrid}`}>
          <div className={styles.footerBrand}>
            <LogoIcon />
            <h2>Paul Clement</h2>
            <p>
              Agent d&apos;assurance independant a votre ecoute pour proteger ce qui compte.
            </p>
          </div>
          <div>
            <h3>Assurances</h3>
            {PRODUCTS.slice(0, 5).map((product) => (
              <Link key={product.slug} href={productHref(product.slug)}>
                {product.label}
              </Link>
            ))}
          </div>
          <div>
            <h3>A propos</h3>
            <Link href="/demo/assurance#qui-suis-je">Qui suis-je</Link>
            <Link href="/demo/assurance#avis">Avis clients</Link>
            <Link href="/demo/assurance/faq">FAQ</Link>
            <Link href="/demo/assurance/contact">Contact</Link>
          </div>
          <div>
            <h3>Contact</h3>
            <p>
              <MapPinIcon />
              123 Avenue des Champs, 75008 Paris
            </p>
            <p>
              <PhoneIcon />
              01 23 45 67 89
            </p>
            <p>
              <MailIcon />
              contact@paul-clement.fr
            </p>
            <p>
              <ClockIcon />
              Lun-Ven : 9h-18h
            </p>
          </div>
        </div>
        <div className={`${tokenStyles.container} ${styles.footerBottom}`}>
          <span>© 2026 Paul Clement Assurances. Demo portfolio.</span>
          <Link href="/demo/assurance">Retour au site</Link>
        </div>
      </footer>

      <a className={styles.mobileCall} href="tel:+33123456789" aria-label="Appeler Paul Clement">
        <PhoneIcon />
      </a>
      <Link className={styles.returnLink} href="/demo/assurance">
        ← Retour au site
      </Link>
    </main>
  )
}
