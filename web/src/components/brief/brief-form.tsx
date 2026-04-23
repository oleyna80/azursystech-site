"use client";

import { useState, type FormEvent } from "react";

import {
  createInitialBriefValues,
  getBriefSteps,
  type BriefLocale,
  type BriefFormValues,
  type BriefValidationIssue,
  validateBriefStep,
  validateBriefValues,
} from "@/lib/brief-submit";

import { BriefField } from "./brief-field";
import { BriefProgress } from "./brief-progress";

type BriefErrorMap = Partial<Record<keyof BriefFormValues, string>>;

type BriefSubmitResponse =
  | { success: true; message: string }
  | { success: false; message: string; issues?: BriefValidationIssue[] };

function issuesToErrorMap(issues: BriefValidationIssue[]) {
  return issues.reduce<BriefErrorMap>((accumulator, issue) => {
    if (issue.field) {
      accumulator[issue.field as keyof BriefFormValues] = issue.message;
    }

    return accumulator;
  }, {});
}

function firstIssueField(
  issues: BriefValidationIssue[],
): keyof BriefFormValues | null {
  const first = issues.find((issue) => issue.field);
  if (!first?.field) {
    return null;
  }

  return first.field as keyof BriefFormValues;
}

const FORM_COPY = {
  fr: {
    successEyebrow: "Brief reçu",
    successTitle: "Merci, le brief a été envoyé",
    successIntro:
      "Nous allons relire le brief manuellement et revenir vers vous avec le prochain pas. Cela ne signifie pas une acceptation automatique du projet, ni une garantie de prix, de délais ou de résultat.",
    resetButton: "Remplir un autre brief",
    directButton: "Contacter directement",
    tip:
      "Si une question n’est pas claire, cliquez sur le symbole ? à côté du champ. L’aide permet de formuler une réponse courte sans détail excessif.",
    backButton: "Retour",
    nextStepHint:
      "Une fois l’étape remplie, vous pouvez continuer sans perdre les réponses déjà saisies.",
    finalStepHint: "Avant l’envoi, vérifiez les coordonnées et les limites de l’automatisation.",
    submitting: "Envoi en cours...",
    continue: "Continuer",
    submit: "Envoyer le brief",
    footerNote:
      "Le brief sert uniquement à une première revue. Le prix, les délais et l’acceptation du projet ne peuvent être discutés qu’après une revue manuelle.",
    submitErrors: {
      generic: "Impossible d’envoyer le brief. Vérifiez la connexion et réessayez.",
    },
  },
  ru: {
    successEyebrow: "Бриф получен",
    successTitle: "Спасибо, бриф отправлен",
    successIntro:
      "Мы посмотрим бриф вручную и вернёмся со следующим шагом. Это не означает автоматическое принятие проекта, гарантию цены, сроков или результата.",
    resetButton: "Заполнить ещё один бриф",
    directButton: "Связаться напрямую",
    tip:
      "Если вопрос непонятен, нажмите ? рядом с полем. Подсказка поможет сформулировать короткий ответ без лишней детализации.",
    backButton: "Назад",
    nextStepHint: "После заполнения шага можно перейти дальше, не теряя уже введённые ответы.",
    finalStepHint: "Перед отправкой проверьте контактные данные и границы автоматизации.",
    submitting: "Отправляем...",
    continue: "Продолжить",
    submit: "Отправить бриф",
    footerNote:
      "Мы используем бриф только для первичной проверки. Цену, сроки и принятие проекта можно обсуждать только после ручной проверки.",
    submitErrors: {
      generic: "Не удалось отправить бриф. Проверьте соединение и попробуйте ещё раз.",
    },
  },
} as const;

function findStepIndexForField(
  fieldKey: keyof BriefFormValues,
  steps: ReturnType<typeof getBriefSteps>,
) {
  return steps.findIndex((step) => step.fields.some((field) => field.key === fieldKey));
}

export function BriefForm({ locale }: { locale: BriefLocale }) {
  const steps = getBriefSteps(locale);
  const copy = FORM_COPY[locale];
  const [values, setValues] = useState<BriefFormValues>(() => createInitialBriefValues());
  const [currentStep, setCurrentStep] = useState(0);
  const [fieldErrors, setFieldErrors] = useState<BriefErrorMap>({});
  const [submitMessage, setSubmitMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const currentStepDefinition = steps[currentStep];

  function setErrorMap(issues: BriefValidationIssue[]) {
    setFieldErrors(issuesToErrorMap(issues));
  }

  function focusIssue(issues: BriefValidationIssue[]) {
    const firstField = firstIssueField(issues);
    if (!firstField) {
      return;
    }

    const stepIndex = findStepIndexForField(firstField, steps);
    if (stepIndex >= 0 && stepIndex !== currentStep) {
      setCurrentStep(stepIndex);
    }

    window.setTimeout(() => {
      const element = document.querySelector(`[data-field-key="${String(firstField)}"]`);
      if (element instanceof HTMLElement) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 0);
  }

  function updateField(key: keyof BriefFormValues, nextValue: string) {
    setValues((previous) => ({ ...previous, [key]: nextValue }));
    setFieldErrors((previous) => {
      const nextErrors = { ...previous };
      delete nextErrors[key];
      return nextErrors;
    });
  }

  function toggleListValue(key: keyof BriefFormValues, optionValue: string) {
    setValues((previous) => {
      const current = Array.isArray(previous[key]) ? previous[key] : [];
      const next = current.includes(optionValue)
        ? current.filter((item) => item !== optionValue)
        : [...current, optionValue];

      return { ...previous, [key]: next } as BriefFormValues;
    });

    setFieldErrors((previous) => {
      const nextErrors = { ...previous };
      delete nextErrors[key];
      return nextErrors;
    });
  }

  function validateStep(stepIndex: number, nextValues: BriefFormValues) {
    const result = validateBriefStep(nextValues, stepIndex, locale);

    if (result.kind === "validation_error") {
      setErrorMap(result.issues);
      focusIssue(result.issues);
      return null;
    }

    setValues(result.values);
    return result.values;
  }

  async function submitBrief(nextValues: BriefFormValues) {
    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      const response = await fetch("/api/brief/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          values: nextValues,
          locale,
          ai_assist_used: false,
          assistant_interaction_count: 0,
        }),
      });

      let result: BriefSubmitResponse | null = null;

      try {
        result = (await response.json()) as BriefSubmitResponse;
      } catch {
        result = null;
      }

      if (result?.success) {
        setSubmitSuccess(true);
        setSubmitMessage(result.message);
        return;
      }

      if (result && !result.success) {
        setSubmitMessage(result.message);
        if (result.issues?.length) {
          const errorMap = issuesToErrorMap(result.issues);
          setFieldErrors(errorMap);
          focusIssue(result.issues);
        }
        return;
      }

      if (!response.ok) {
        setSubmitMessage(copy.submitErrors.generic);
        return;
      }

      setSubmitMessage(copy.submitErrors.generic);
    } catch {
      setSubmitMessage(copy.submitErrors.generic);
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting || submitSuccess) {
      return;
    }

    const stepValues = validateStep(currentStep, values);
    if (!stepValues) {
      return;
    }

    if (currentStep < steps.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      setSubmitMessage("");
      setFieldErrors({});
      return;
    }

    const finalResult = validateBriefValues(stepValues, locale);
    if (finalResult.kind === "validation_error") {
      setErrorMap(finalResult.issues);
      focusIssue(finalResult.issues);
      return;
    }

    setValues(finalResult.values);
    void submitBrief(finalResult.values);
  }

  function handleBack() {
    if (currentStep === 0 || isSubmitting) {
      return;
    }

    const nextStep = currentStep - 1;
    setCurrentStep(nextStep);
    setFieldErrors({});
    setSubmitMessage("");
  }

  function resetBrief() {
    setValues(createInitialBriefValues());
    setCurrentStep(0);
    setFieldErrors({});
    setSubmitMessage("");
    setIsSubmitting(false);
    setSubmitSuccess(false);
  }

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <div className="space-y-4">
        <BriefProgress steps={steps} currentStep={currentStep} locale={locale} />

        {submitSuccess ? (
          <section className="rounded-[1.75rem] border border-[#D8D0C4] bg-[#FFFDF8] p-5 shadow-[0_18px_55px_rgba(23,35,49,0.08)] sm:p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#1F6F78]">
              {copy.successEyebrow}
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-[#1F2A37]">{copy.successTitle}</h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-[#5C6670]">
              {copy.successIntro}
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-full bg-[#1F6F78] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#18565D]"
                onClick={resetBrief}
              >
                {copy.resetButton}
              </button>
              <a
                href="/#contact"
                className="inline-flex items-center justify-center rounded-full border border-[#D8D0C4] bg-white px-5 py-3 text-sm font-semibold text-[#1F2A37] transition-colors hover:bg-[#F6F1E8]"
              >
                {copy.directButton}
              </a>
            </div>
          </section>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="rounded-[1.75rem] border border-[#D8D0C4] bg-[#FFFDF8] p-5 shadow-[0_18px_55px_rgba(23,35,49,0.08)] sm:p-6"
          >
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1F6F78]">
                {String(currentStep + 1).padStart(2, "0")} / 05
              </p>
              <h2 className="text-2xl font-semibold text-[#1F2A37]">{currentStepDefinition.title}</h2>
              <p className="max-w-2xl text-sm leading-6 text-[#5C6670]">
                {currentStepDefinition.shortDescription}
              </p>
              <p className="max-w-2xl rounded-2xl border border-[#D8D0C4] bg-white/70 px-3 py-2 text-sm leading-6 text-[#5C6670]">
                {copy.tip.split("?").length > 1 ? (
                  <>
                    {copy.tip.split("?")[0]}
                    <span className="font-semibold text-[#1F6F78]">?</span>
                    {copy.tip.slice(copy.tip.indexOf("?") + 1)}
                  </>
                ) : (
                  copy.tip
                )}
              </p>
            </div>

            <div className="mt-6 grid gap-5">
              {currentStepDefinition.fields.map((field) => {
                const currentValue = values[field.key];
                const otherFieldKey = field.otherFieldKey as keyof BriefFormValues | undefined;
                const otherFieldValue = otherFieldKey ? values[otherFieldKey] : undefined;

                return (
                  <BriefField
                    key={String(field.key)}
                    field={field}
                    value={typeof currentValue === "string" ? currentValue : ""}
                    listValue={Array.isArray(currentValue) ? (currentValue as string[]) : undefined}
                    otherValue={typeof otherFieldValue === "string" ? otherFieldValue : ""}
                    error={fieldErrors[field.key]}
                    otherError={otherFieldKey ? fieldErrors[otherFieldKey] : undefined}
                    locale={locale}
                    onValueChange={updateField}
                    onListToggle={toggleListValue}
                  />
                );
              })}
            </div>

            <div className="mt-6 flex flex-col gap-3 border-t border-[#E6DDD2] pt-5 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-full border border-[#D8D0C4] bg-white px-5 py-3 text-sm font-semibold text-[#1F2A37] transition-colors hover:bg-[#F6F1E8] disabled:opacity-50"
                onClick={handleBack}
                disabled={currentStep === 0 || isSubmitting}
              >
                {copy.backButton}
              </button>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <p className="text-sm leading-6 text-[#5C6670] sm:max-w-sm">
                  {currentStep < steps.length - 1 ? copy.nextStepHint : copy.finalStepHint}
                </p>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-full bg-[#1F6F78] px-6 py-3 text-sm font-semibold text-white shadow-[0_14px_34px_rgba(31,111,120,0.22)] transition-colors hover:bg-[#18565D] disabled:cursor-not-allowed disabled:opacity-70"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? copy.submitting
                    : currentStep < steps.length - 1
                      ? copy.continue
                      : copy.submit}
                </button>
              </div>
            </div>

            {submitMessage ? (
              <p
                className={[
                  "mt-4 text-sm leading-6",
                  submitSuccess ? "text-[#15585F]" : "text-[#B42318]",
                ].join(" ")}
                role="status"
                aria-live="polite"
              >
                {submitMessage}
              </p>
            ) : null}

            <p className="mt-4 text-sm leading-6 text-[#5C6670]">
              {copy.footerNote}
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
