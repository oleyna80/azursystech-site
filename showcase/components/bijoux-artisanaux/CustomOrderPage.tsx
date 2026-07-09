'use client'

import type { ReactNode } from 'react'
import { useState } from 'react'
import { SiteShell } from './SiteShell'
import tokenStyles from './tokens.module.css'
import styles from './customorder.module.css'

type CustomProjectPayload = {
  jewelType: string
  occasion: string
  metal: string
  stone: string
  style: string
  budget: string
  deadline: string
  size: string
  inspiration: string
  name: string
  contact: string
}

type FormField = keyof CustomProjectPayload

const copy = {
  eyebrow: 'Création sur mesure',
  title: 'Préparer votre bijou avec l’atelier',
  intro:
    'Un parcours en cinq étapes pour transmettre votre intention, vos préférences et vos contraintes avec clarté.',
  steps: ['Type de bijou', 'Occasion', 'Style & matériaux', 'Budget, délai & taille', 'Résumé & contact'],
  jewelQuestion: 'Quel type de bijou souhaitez-vous créer ?',
  occasionQuestion: 'Pour quelle occasion ?',
  metal: 'Métal souhaité',
  style: 'Style préféré',
  stone: 'Pierre ou couleur souhaitée',
  stoneCustom: 'Ou préciser une autre pierre/couleur',
  stonePlaceholder: 'Ex. perle, grenat, bleu nuit',
  budget: 'Budget approximatif',
  deadline: 'Date souhaitée',
  deadlinePlaceholder: 'Ex. fin septembre',
  size: 'Taille si connue',
  inspiration: 'Note d’inspiration',
  summaryTitle: 'Récapitulatif de votre projet',
  preferences: 'Préférences',
  name: 'Nom complet',
  contact: 'Email ou WhatsApp',
  noCommitment:
    'Cette demande est sans engagement. Dans une version client, l’atelier recevrait ce récapitulatif pour affiner le projet avec vous.',
  submit: 'Envoyer ma demande',
  sending: 'Préparation...',
  back: 'Retour',
  continue: 'Continuer',
  unspecified: 'À préciser',
  successTitle: 'Votre projet sur mesure est prêt à être étudié.',
  successBody:
    'Démo uniquement : aucun message réel n’a été envoyé. Le parcours montre comment l’atelier recueille une demande claire avant de recontacter le client.',
  anotherRequest: 'Préparer une autre demande',
  jewelTypes: ['Bague', 'Collier', 'Bracelet', 'Boucles d’oreilles', 'Création unique'],
  occasions: ['Fiançailles', 'Mariage', 'Cadeau', 'Pour moi', 'Autre célébration'],
  metals: ['Or jaune 18k', 'Or blanc 18k', 'Or rose 18k', 'Argent 925'],
  styles: ['Délicat', 'Organique', 'Minimaliste', 'Texturé'],
  stones: ['Sans pierre', 'Perle', 'Nacre', 'Grenat', 'Quartz rose', 'Émeraude', 'Bleu nuit', 'À définir'],
  budgets: ['Moins de 150 €', '150 € - 300 €', '300 € - 500 €', 'Sur demande'],
}

const initialForm: CustomProjectPayload = {
  jewelType: '',
  occasion: '',
  metal: '',
  stone: '',
  style: '',
  budget: '',
  deadline: '',
  size: '',
  inspiration: '',
  name: '',
  contact: '',
}

const requiredByStep: FormField[][] = [
  ['jewelType'],
  ['occasion'],
  ['metal', 'style'],
  ['budget', 'deadline'],
  ['name', 'contact'],
]

export function CustomOrderPage() {
  const [step, setStep] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<FormField, string>>>({})
  const [form, setForm] = useState<CustomProjectPayload>(initialForm)

  function updateField(key: FormField, value: string) {
    setForm((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: '' }))
  }

  function validateStep(currentStep = step) {
    const nextErrors: Partial<Record<FormField, string>> = {}

    for (const key of requiredByStep[currentStep]) {
      if (!form[key].trim()) {
        nextErrors[key] = 'Ce champ est obligatoire'
      }
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  function next() {
    if (validateStep()) {
      setStep((current) => Math.min(current + 1, copy.steps.length - 1))
    }
  }

  function reset() {
    setForm(initialForm)
    setErrors({})
    setStep(0)
    setSubmitted(false)
  }

  function submit() {
    if (!validateStep(copy.steps.length - 1)) return

    setSubmitting(true)

    // Showcase-only submit: no API call and no outbound message.
    window.setTimeout(() => {
      setSubmitting(false)
      setSubmitted(true)
    }, 500)
  }

  return (
    <SiteShell>
      <main className={styles.page}>
        <section className={tokenStyles.container}>
          <div className={styles.hero}>
            <span className={styles.eyebrow}>{copy.eyebrow}</span>
            <h1>{copy.title}</h1>
            <p>{copy.intro}</p>
          </div>

          {submitted ? (
            <section className={styles.successPanel} aria-live="polite">
              <div className={styles.successIcon}>✓</div>
              <h2>{copy.successTitle}</h2>
              <p>{copy.successBody}</p>
              <button type="button" className={styles.primaryButton} onClick={reset}>
                {copy.anotherRequest}
              </button>
            </section>
          ) : (
            <section className={styles.wizard} aria-label="Questionnaire de création sur mesure">
              <div className={styles.stepList} aria-label="Progression">
                {copy.steps.map((label, index) => (
                  <button
                    key={label}
                    type="button"
                    className={`${styles.stepPill} ${index === step ? styles.stepPillActive : ''}`}
                    aria-current={index === step ? 'step' : undefined}
                    data-demo-step
                    onClick={() => {
                      if (index <= step) setStep(index)
                    }}
                  >
                    <span>{index + 1}</span>
                    {label}
                  </button>
                ))}
              </div>

              <div className={styles.stepBody}>
                {step === 0 ? (
                  <OptionStep
                    title={copy.jewelQuestion}
                    options={copy.jewelTypes}
                    value={form.jewelType}
                    error={errors.jewelType}
                    onSelect={(value) => updateField('jewelType', value)}
                  />
                ) : null}

                {step === 1 ? (
                  <OptionStep
                    title={copy.occasionQuestion}
                    options={copy.occasions}
                    value={form.occasion}
                    error={errors.occasion}
                    onSelect={(value) => updateField('occasion', value)}
                  />
                ) : null}

                {step === 2 ? (
                  <div className={styles.stack}>
                    <OptionStep
                      title={copy.metal}
                      options={copy.metals}
                      value={form.metal}
                      error={errors.metal}
                      onSelect={(value) => updateField('metal', value)}
                    />
                    <OptionStep
                      title={copy.style}
                      options={copy.styles}
                      value={form.style}
                      error={errors.style}
                      onSelect={(value) => updateField('style', value)}
                    />
                    <StoneChoice value={form.stone} onSelect={(value) => updateField('stone', value)} />
                  </div>
                ) : null}

                {step === 3 ? (
                  <div className={styles.stack}>
                    <OptionStep
                      title={copy.budget}
                      options={copy.budgets}
                      value={form.budget}
                      error={errors.budget}
                      onSelect={(value) => updateField('budget', value)}
                    />
                    <Field label={copy.deadline} error={errors.deadline}>
                      <input
                        value={form.deadline}
                        placeholder={copy.deadlinePlaceholder}
                        onChange={(event) => updateField('deadline', event.target.value)}
                      />
                    </Field>
                    <Field label={copy.size}>
                      <input value={form.size} onChange={(event) => updateField('size', event.target.value)} />
                    </Field>
                    <Field label={copy.inspiration}>
                      <textarea value={form.inspiration} onChange={(event) => updateField('inspiration', event.target.value)} />
                    </Field>
                  </div>
                ) : null}

                {step === 4 ? (
                  <div className={styles.summaryLayout}>
                    <div className={styles.summaryCard}>
                      <h2>{copy.summaryTitle}</h2>
                      <dl>
                        <Summary label={copy.steps[0]} value={form.jewelType} />
                        <Summary label={copy.steps[1]} value={form.occasion} />
                        <Summary label={copy.preferences} value={[form.metal, form.style, form.stone].filter(Boolean).join(', ')} />
                        <Summary label={copy.budget} value={form.budget} />
                        <Summary label={copy.deadline} value={form.deadline} />
                        <Summary label={copy.size} value={form.size} />
                        <Summary label={copy.inspiration} value={form.inspiration} />
                      </dl>
                    </div>
                    <div className={styles.contactFields}>
                      <Field label={copy.name} error={errors.name}>
                        <input value={form.name} onChange={(event) => updateField('name', event.target.value)} />
                      </Field>
                      <Field label={copy.contact} error={errors.contact}>
                        <input value={form.contact} onChange={(event) => updateField('contact', event.target.value)} />
                      </Field>
                      <p>{copy.noCommitment}</p>
                    </div>
                  </div>
                ) : null}
              </div>

              <div className={styles.actions}>
                <button
                  type="button"
                  className={styles.secondaryButton}
                  disabled={step === 0}
                  onClick={() => setStep((current) => Math.max(current - 1, 0))}
                >
                  {copy.back}
                </button>
                {step < copy.steps.length - 1 ? (
                  <button type="button" className={styles.primaryButton} onClick={next}>
                    {copy.continue}
                  </button>
                ) : (
                  <button type="button" className={styles.primaryButton} onClick={submit} disabled={submitting}>
                    {submitting ? copy.sending : copy.submit}
                  </button>
                )}
              </div>
            </section>
          )}
        </section>
      </main>
    </SiteShell>
  )
}

function OptionStep({
  title,
  options,
  value,
  error,
  onSelect,
}: {
  title: string
  options: string[]
  value: string
  error?: string
  onSelect: (value: string) => void
}) {
  return (
    <div>
      <h2 className={styles.stepTitle}>{title}</h2>
      <div className={styles.optionGrid}>
        {options.map((option) => (
          <button
            key={option}
            type="button"
            className={`${styles.optionButton} ${value === option ? styles.optionButtonActive : ''}`}
            data-demo-option
            onClick={() => onSelect(option)}
          >
            {option}
          </button>
        ))}
      </div>
      {error ? <p className={styles.error}>{error}</p> : null}
    </div>
  )
}

function StoneChoice({ value, onSelect }: { value: string; onSelect: (value: string) => void }) {
  const customValue = copy.stones.includes(value) ? '' : value

  return (
    <div>
      <h2 className={styles.stepTitle}>{copy.stone}</h2>
      <div className={styles.chipGrid}>
        {copy.stones.map((stone) => (
          <button
            key={stone}
            type="button"
            className={`${styles.chipButton} ${value === stone ? styles.chipButtonActive : ''}`}
            onClick={() => onSelect(stone)}
          >
            {stone}
          </button>
        ))}
      </div>
      <Field label={copy.stoneCustom}>
        <input value={customValue} placeholder={copy.stonePlaceholder} onChange={(event) => onSelect(event.target.value)} />
      </Field>
    </div>
  )
}

function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <label className={styles.field}>
      <span>{label}</span>
      {children}
      {error ? <span className={styles.error}>{error}</span> : null}
    </label>
  )
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt>{label}</dt>
      <dd>{value || copy.unspecified}</dd>
    </div>
  )
}
