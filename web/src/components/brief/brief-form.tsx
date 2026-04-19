"use client";

import { useMemo, useState, type FormEvent } from "react";

import { BriefAssistant } from "@/components/brief/brief-assistant";
import type {
  BriefAssistantFieldKey,
  BriefAssistantInteraction,
} from "@/lib/brief-assistant";
import { BRIEF_ASSISTANT_ALL_FIELDS } from "@/lib/brief-assistant";
import {
  BRIEF_STEPS,
  createInitialBriefValues,
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

function isStringFieldKey(
  value: BriefFormValues[keyof BriefFormValues] | undefined,
): value is string {
  return typeof value === "string";
}

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

function findStepIndexForField(fieldKey: keyof BriefFormValues) {
  return BRIEF_STEPS.findIndex((step) => step.fields.some((field) => field.key === fieldKey));
}

function toAssistantFieldKey(fieldKey: keyof BriefFormValues): BriefAssistantFieldKey | null {
  if ((BRIEF_ASSISTANT_ALL_FIELDS as readonly string[]).includes(fieldKey)) {
    return fieldKey as BriefAssistantFieldKey;
  }

  switch (fieldKey) {
    case "business_type_other":
      return "business_type";
    case "priority_use_case_other":
      return "priority_use_case";
    case "current_channels_other":
      return "current_channels";
    case "human_approval_required_notes":
      return "human_approval_required";
    default:
      return null;
  }
}

function defaultStepFocus(stepIndex: number) {
  const step = BRIEF_STEPS[stepIndex];
  return (
    toAssistantFieldKey(step?.fields.find((field) => field.assistantTrigger)?.key ?? step?.fields[0]?.key ?? null) ??
    null
  );
}

export function BriefForm() {
  const [values, setValues] = useState<BriefFormValues>(() => createInitialBriefValues());
  const [currentStep, setCurrentStep] = useState(0);
  const [fieldErrors, setFieldErrors] = useState<BriefErrorMap>({});
  const [submitMessage, setSubmitMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [assistantInteractionCount, setAssistantInteractionCount] = useState(0);
  const [activeFieldKey, setActiveFieldKey] = useState<BriefAssistantFieldKey | null>(
    defaultStepFocus(0),
  );

  const currentStepDefinition = BRIEF_STEPS[currentStep];

  const activeFieldDefinition = useMemo(
    () =>
      BRIEF_STEPS.flatMap((step) => step.fields).find((field) => field.key === activeFieldKey) ??
      currentStepDefinition.fields.find((field) => field.assistantTrigger) ??
      currentStepDefinition.fields[0],
    [activeFieldKey, currentStepDefinition],
  );

  const activeFieldValue = activeFieldDefinition
    ? values[activeFieldDefinition.key]
    : undefined;
  const assistantStepTitle =
    BRIEF_STEPS.find((step) => step.fields.some((field) => field.key === activeFieldKey))?.title ??
    currentStepDefinition.title;

  const aiAssistUsed = assistantInteractionCount > 0;

  function setErrorMap(issues: BriefValidationIssue[]) {
    setFieldErrors(issuesToErrorMap(issues));
  }

  function focusIssue(issues: BriefValidationIssue[]) {
    const firstField = firstIssueField(issues);
    if (!firstField) {
      return;
    }

    const stepIndex = findStepIndexForField(firstField);
    if (stepIndex >= 0 && stepIndex !== currentStep) {
      setCurrentStep(stepIndex);
    }

    const assistantFieldKey = toAssistantFieldKey(firstField);
    if (assistantFieldKey) {
      setActiveFieldKey(assistantFieldKey);
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

  function handleAssistantInteraction(event: BriefAssistantInteraction) {
    setAssistantInteractionCount((count) => count + 1);

    if (event.type === "field_selected") {
      setActiveFieldKey(event.fieldKey);
    }
  }

  function validateStep(stepIndex: number, nextValues: BriefFormValues) {
    const result = validateBriefStep(nextValues, stepIndex);

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
          ai_assist_used: aiAssistUsed,
          assistant_interaction_count: assistantInteractionCount,
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
        setSubmitMessage("Не удалось отправить бриф. Проверьте соединение и попробуйте ещё раз.");
        return;
      }

      setSubmitMessage("Не удалось отправить бриф. Проверьте соединение и попробуйте ещё раз.");
    } catch {
      setSubmitMessage("Не удалось отправить бриф. Проверьте соединение и попробуйте ещё раз.");
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

    if (currentStep < BRIEF_STEPS.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      setActiveFieldKey(defaultStepFocus(nextStep));
      setSubmitMessage("");
      setFieldErrors({});
      return;
    }

    const finalResult = validateBriefValues(stepValues);
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
    setActiveFieldKey(defaultStepFocus(nextStep));
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
    setAssistantInteractionCount(0);
    setActiveFieldKey(defaultStepFocus(0));
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(300px,0.95fr)] lg:items-start">
      <div className="space-y-4">
        <BriefProgress steps={BRIEF_STEPS} currentStep={currentStep} />

        {submitSuccess ? (
          <section className="rounded-lg border border-[#D8D0C4] bg-white p-5 sm:p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#1F6F78]">
              Бриф получен
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-[#1F2A37]">Спасибо, заявка принята</h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-[#5C6670]">
              Мы посмотрим бриф вручную и вернёмся со следующим шагом. Это не означает
              автоматическое принятие проекта, гарантию цены, сроков или результата.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md bg-[#1F6F78] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#18565D]"
                onClick={resetBrief}
              >
                Заполнить ещё один бриф
              </button>
              <a
                href="/contact"
                className="inline-flex items-center justify-center rounded-md border border-[#D8D0C4] bg-white px-4 py-3 text-sm font-semibold text-[#1F2A37]"
              >
                Перейти к контакту
              </a>
            </div>
          </section>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="rounded-lg border border-[#D8D0C4] bg-white p-5 shadow-[0_12px_36px_rgba(31,42,55,0.06)] sm:p-6"
          >
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1F6F78]">
                {String(currentStep + 1).padStart(2, "0")} / 05
              </p>
              <h2 className="text-2xl font-semibold text-[#1F2A37]">{currentStepDefinition.title}</h2>
              <p className="max-w-2xl text-sm leading-6 text-[#5C6670]">
                {currentStepDefinition.shortDescription}
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
                    onValueChange={updateField}
                    onListToggle={toggleListValue}
                    onFocusField={(key) => {
                      setActiveFieldKey(toAssistantFieldKey(key));
                    }}
                  />
                );
              })}
            </div>

            <div className="mt-6 flex flex-col gap-3 border-t border-[#E6DDD2] pt-5 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md border border-[#D8D0C4] bg-white px-4 py-3 text-sm font-semibold text-[#1F2A37] disabled:opacity-50"
                onClick={handleBack}
                disabled={currentStep === 0 || isSubmitting}
              >
                Назад
              </button>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <p className="text-sm leading-6 text-[#5C6670] sm:max-w-sm">
                  {currentStep < BRIEF_STEPS.length - 1
                    ? "После заполнения шага можно перейти дальше, не теряя уже введённые ответы."
                    : "Перед отправкой проверьте контактные данные и границы автоматизации."}
                </p>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-md bg-[#1F6F78] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#18565D] disabled:cursor-not-allowed disabled:opacity-70"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? "Отправляем..."
                    : currentStep < BRIEF_STEPS.length - 1
                      ? "Продолжить"
                      : "Отправить бриф"}
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
              Мы используем бриф только для первичной проверки. Цену, сроки и принятие проекта
              можно обсуждать только после ручной проверки.
            </p>
          </form>
        )}
      </div>

      {!submitSuccess ? (
        <aside className="lg:block">
          <BriefAssistant
            activeFieldKey={activeFieldKey}
            activeStepTitle={assistantStepTitle}
            fieldValue={isStringFieldKey(activeFieldValue) ? activeFieldValue : undefined}
            onInteraction={handleAssistantInteraction}
            defaultOpen={false}
            className="mt-0"
          />
        </aside>
      ) : null}
    </div>
  );
}
