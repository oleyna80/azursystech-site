"use client";

import { useId, useState } from "react";

import { getBriefInlineHelpGuidance } from "@/lib/brief-assistant";
import type { BriefFieldDefinition, BriefFormValues } from "@/lib/brief-submit";

type BriefFieldProps = {
  field: BriefFieldDefinition;
  value: string;
  listValue?: string[];
  otherValue?: string;
  error?: string;
  otherError?: string;
  onValueChange: (key: keyof BriefFormValues, value: string) => void;
  onListToggle: (key: keyof BriefFormValues, optionValue: string) => void;
};

const controlBase =
  "w-full rounded-2xl border border-[#D8D0C4] bg-white px-3 py-3 text-sm text-[#1F2A37] outline-none transition placeholder:text-[#7C8894] focus:border-[#1F6F78] focus:ring-2 focus:ring-[#1F6F78]/15";

function inputTypeForField(type: BriefFieldDefinition["type"]) {
  if (type === "email" || type === "url") {
    return type;
  }

  return "text";
}

export function BriefField({
  field,
  value,
  listValue = [],
  otherValue = "",
  error,
  otherError,
  onValueChange,
  onListToggle,
}: BriefFieldProps) {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const helpId = useId();
  const isSelect = field.type === "select";
  const isMultiSelect = field.type === "multi_select";
  const showOtherInput =
    Boolean(field.allowOther && field.otherFieldKey) &&
    ((isSelect && value === "other") || (isMultiSelect && listValue.includes("other")));
  const inlineHelp = getBriefInlineHelpGuidance({
    fieldKey: String(field.key),
    fieldValue: value,
  });
  const hasInlineHelp = Boolean(inlineHelp);
  const describedBy = [
    isHelpOpen && inlineHelp ? helpId : undefined,
    error ? `${String(field.key)}-error` : undefined,
  ]
    .filter(Boolean)
    .join(" ") || undefined;

  return (
    <div className="space-y-2" data-field-key={String(field.key)}>
      <div className="flex items-start justify-between gap-3">
        <label
          htmlFor={String(field.key)}
          className="flex min-w-0 items-center gap-1 text-sm font-medium text-[#1F2A37]"
        >
          <span>{field.label}</span>
          {field.required ? <span className="text-[#C96F4A]">*</span> : null}
        </label>
        {hasInlineHelp ? (
          <button
            type="button"
            className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#B8D9DB] bg-[#EDF7F7] text-xs font-bold text-[#1F6F78] transition-colors hover:bg-[#DCEFF0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F6F78]/30"
            aria-expanded={isHelpOpen}
            aria-controls={helpId}
            aria-label={`Показать подсказку: ${field.label}`}
            onClick={() => setIsHelpOpen((previous) => !previous)}
          >
            ?
          </button>
        ) : null}
      </div>

      {field.helperText ? <p className="text-sm leading-6 text-[#5C6670]">{field.helperText}</p> : null}

      {isHelpOpen && inlineHelp ? (
        <div
          id={helpId}
          className="rounded-2xl border border-[#B8D9DB] bg-[#EDF7F7] p-3 text-sm leading-6 text-[#1F2A37]"
        >
          <p className="font-semibold">{inlineHelp.fieldLabel}</p>
          <p className="mt-1 text-[#1F2A37]/85">{inlineHelp.explanation}</p>
          {inlineHelp.answerStructure.length ? (
            <ul className="mt-2 list-disc space-y-1 pl-4 text-[#1F2A37]/85">
              {inlineHelp.answerStructure.slice(0, 3).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
          {inlineHelp.draftExample ? (
            <p className="mt-2 text-xs leading-5 text-[#53616E]">
              Пример: {inlineHelp.draftExample}
            </p>
          ) : null}
        </div>
      ) : null}

      {field.type === "textarea" ? (
        <textarea
          id={String(field.key)}
          name={String(field.key)}
          value={value}
          placeholder={field.placeholder}
          rows={5}
          className={[
            controlBase,
            "min-h-32 resize-y",
            error ? "border-[#B42318] focus:border-[#B42318] focus:ring-[#B42318]/15" : "",
          ].join(" ")}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          onChange={(event) => onValueChange(field.key, event.target.value)}
        />
      ) : null}

      {field.type !== "textarea" && isSelect ? (
        <select
          id={String(field.key)}
          name={String(field.key)}
          value={value}
          className={[
            controlBase,
            error ? "border-[#B42318] focus:border-[#B42318] focus:ring-[#B42318]/15" : "",
          ].join(" ")}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          onChange={(event) => onValueChange(field.key, event.target.value)}
        >
          <option value="">Выберите вариант</option>
          {field.options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : null}

      {field.type !== "textarea" && !isSelect && !isMultiSelect ? (
        <input
          id={String(field.key)}
          name={String(field.key)}
          type={inputTypeForField(field.type)}
          value={value}
          placeholder={field.placeholder}
          className={[
            controlBase,
            error ? "border-[#B42318] focus:border-[#B42318] focus:ring-[#B42318]/15" : "",
          ].join(" ")}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          onChange={(event) => onValueChange(field.key, event.target.value)}
        />
      ) : null}

      {isMultiSelect ? (
        <div className="grid gap-2 sm:grid-cols-2">
          {field.options?.map((option) => {
            const checked = listValue.includes(option.value);

            return (
              <label
                key={option.value}
                className={[
                  "flex min-h-11 items-center gap-3 rounded-2xl border px-3 py-2.5 text-sm transition-colors",
                  checked ? "border-[#1F6F78] bg-[#EAF4F4]" : "border-[#D8D0C4] bg-white",
                ].join(" ")}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  className="h-4 w-4 accent-[#1F6F78]"
                  onChange={() => onListToggle(field.key, option.value)}
                />
                <span className="text-[#1F2A37]">{option.label}</span>
              </label>
            );
          })}
        </div>
      ) : null}

      {showOtherInput && field.otherFieldKey ? (
        <div className="space-y-2">
          <label
            htmlFor={String(field.otherFieldKey)}
            className="text-sm font-medium text-[#1F2A37]"
          >
            Уточните вариант
          </label>
          <input
            id={String(field.otherFieldKey)}
            name={String(field.otherFieldKey)}
            type="text"
            value={otherValue}
            placeholder={field.otherPlaceholder ?? "Уточните свой вариант"}
            className={[
              controlBase,
              otherError ? "border-[#B42318] focus:border-[#B42318] focus:ring-[#B42318]/15" : "",
            ].join(" ")}
            aria-invalid={Boolean(otherError)}
            aria-describedby={otherError ? `${String(field.otherFieldKey)}-error` : undefined}
            onChange={(event) => onValueChange(field.otherFieldKey as keyof BriefFormValues, event.target.value)}
          />
        </div>
      ) : null}

      {error ? (
        <p id={`${String(field.key)}-error`} className="text-sm leading-6 text-[#B42318]" role="alert">
          {error}
        </p>
      ) : null}

      {otherError ? (
        <p
          id={`${String(field.otherFieldKey)}-error`}
          className="text-sm leading-6 text-[#B42318]"
          role="alert"
        >
          {otherError}
        </p>
      ) : null}

      {field.example ? (
        <p className="text-xs leading-5 text-[#7C8894]">
          Пример: <span className="text-[#53616E]">{field.example}</span>
        </p>
      ) : null}
    </div>
  );
}
