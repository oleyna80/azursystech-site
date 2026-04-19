"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import {
  BRIEF_ASSISTANT_CRITICAL_FIELDS,
  getBriefAssistantGuidance,
  getBriefAssistantFieldLabel,
  type BriefAssistantFieldKey,
  type BriefAssistantInteraction,
} from "@/lib/brief-assistant";

type BriefAssistantProps = {
  activeFieldKey?: BriefAssistantFieldKey | null;
  activeStepTitle?: string;
  fieldValue?: string;
  onInteraction?: (event: BriefAssistantInteraction) => void;
  className?: string;
  defaultOpen?: boolean;
};

function emitInteraction(
  onInteraction: BriefAssistantProps["onInteraction"],
  event: BriefAssistantInteraction,
) {
  if (onInteraction) {
    onInteraction(event);
  }
}

function FieldPill({
  fieldKey,
  isActive,
  onClick,
}: {
  fieldKey: BriefAssistantFieldKey;
  isActive: boolean;
  onClick: (fieldKey: BriefAssistantFieldKey) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onClick(fieldKey)}
      className={`rounded-md border px-3 py-2 text-left text-xs font-medium transition-colors ${
        isActive
          ? "border-[#1F6F78] bg-[#EDF7F7] text-[#1F6F78]"
          : "border-[#D8D0C4] bg-[#FFFDFC] text-[#1F2A37] hover:bg-[#F6F1E8]"
      }`}
    >
      {getBriefAssistantFieldLabel(fieldKey)}
    </button>
  );
}

export function BriefAssistant({
  activeFieldKey,
  activeStepTitle,
  fieldValue,
  onInteraction,
  className = "",
  defaultOpen = true,
}: BriefAssistantProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [localFieldKey, setLocalFieldKey] = useState<BriefAssistantFieldKey>(
    activeFieldKey ?? BRIEF_ASSISTANT_CRITICAL_FIELDS[0],
  );
  const previousOpenState = useRef(isOpen);
  const previousActiveFieldKey = useRef<BriefAssistantFieldKey | null | undefined>(activeFieldKey);

  useEffect(() => {
    if (previousOpenState.current === isOpen) {
      return;
    }

    if (isOpen) {
      emitInteraction(onInteraction, {
        type: "panel_opened",
        fieldKey: activeFieldKey ?? localFieldKey,
        stepTitle: activeStepTitle,
      });
    } else {
      emitInteraction(onInteraction, {
        type: "panel_closed",
        fieldKey: activeFieldKey ?? localFieldKey,
        stepTitle: activeStepTitle,
      });
    }
    previousOpenState.current = isOpen;
  }, [activeFieldKey, activeStepTitle, isOpen, localFieldKey, onInteraction]);

  useEffect(() => {
    if (previousActiveFieldKey.current === activeFieldKey || !activeFieldKey) {
      previousActiveFieldKey.current = activeFieldKey;
      return;
    }

    emitInteraction(onInteraction, {
      type: "field_selected",
      fieldKey: activeFieldKey,
      source: "external",
    });
    previousActiveFieldKey.current = activeFieldKey;
  }, [activeFieldKey, onInteraction]);

  const currentFieldKey = activeFieldKey ?? localFieldKey;
  const guidance = useMemo(
    () =>
      getBriefAssistantGuidance({
        fieldKey: currentFieldKey,
        fieldValue,
        stepTitle: activeStepTitle,
      }),
    [activeStepTitle, currentFieldKey, fieldValue],
  );

  const isCriticalField = BRIEF_ASSISTANT_CRITICAL_FIELDS.some((fieldKey) => fieldKey === currentFieldKey);

  const handleFieldSelect = (nextFieldKey: BriefAssistantFieldKey) => {
    setLocalFieldKey(nextFieldKey);
    emitInteraction(onInteraction, {
      type: "field_selected",
      fieldKey: nextFieldKey,
      source: "chip",
    });
  };

  return (
    <aside className={`w-full ${className}`}>
      <div className="rounded-lg border border-[#D8D0C4] bg-[#FFFDFC] shadow-sm lg:sticky lg:top-24">
        <div className="border-b border-[#D8D0C4] bg-[#F6F1E8] px-4 py-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1F6F78]">
                Помощник по brief
              </p>
              <h2 className="mt-1 text-base font-semibold text-[#1F2A37]">
                {activeStepTitle ?? "Подсказка по полю"}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen((prev) => !prev)}
              className="rounded-md border border-[#D8D0C4] bg-[#FFFDFC] px-2.5 py-1.5 text-xs font-semibold text-[#1F2A37] lg:hidden"
              aria-expanded={isOpen}
            >
              {isOpen ? "Свернуть" : "Открыть"}
            </button>
          </div>
        </div>

        <div className={`${isOpen ? "block" : "hidden"} lg:block`}>
          <div className="space-y-4 p-4">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#1F6F78]">
                {guidance.title}
              </p>
              <p className="text-sm font-semibold text-[#1F2A37]">
                {guidance.fieldLabel}
              </p>
              <p className="text-sm leading-6 text-[#1F2A37]/90">{guidance.stepHint}</p>
            </div>

            <p className="rounded-md border border-[#D8D0C4] bg-[#F9F6F1] p-3 text-sm leading-6 text-[#1F2A37]">
              {guidance.explanation}
            </p>

            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#1F6F78]">
                Как ответить
              </p>
              <ul className="space-y-2 text-sm leading-6 text-[#1F2A37]/90">
                {guidance.answerStructure.map((item) => (
                  <li key={item} className="rounded-md border border-[#D8D0C4] px-3 py-2">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#1F6F78]">
                Пример ответа
              </p>
              <p className="rounded-md border border-[#D8D0C4] bg-[#FFFDFC] p-3 text-sm leading-6 text-[#1F2A37]">
                {guidance.draftExample}
              </p>
            </div>

            {guidance.shortFollowUp ? (
              <div className="rounded-md border border-[#D8D0C4] bg-[#EDF7F7] px-3 py-2 text-sm leading-6 text-[#1F2A37]">
                {guidance.shortFollowUp}
              </div>
            ) : null}

            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#1F6F78]">
                Границы
              </p>
              <ul className="space-y-2 text-sm leading-6 text-[#1F2A37]/90">
                {guidance.guardrails.map((item) => (
                  <li key={item} className="rounded-md border border-[#D8D0C4] bg-[#FFFDFC] px-3 py-2">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#1F6F78]">
                Быстрый выбор
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {BRIEF_ASSISTANT_CRITICAL_FIELDS.map((fieldKey) => (
                  <FieldPill
                    key={fieldKey}
                    fieldKey={fieldKey}
                    isActive={fieldKey === currentFieldKey}
                    onClick={handleFieldSelect}
                  />
                ))}
              </div>
            </div>

            <div className="rounded-md border border-[#D8D0C4] bg-[#FFFDFC] px-3 py-2 text-sm leading-6 text-[#1F2A37]">
              {isCriticalField
                ? "Это ключевое поле для qualification. Лучше ответить коротко, но конкретно."
                : "Это вспомогательное поле. Достаточно короткого и понятного ответа без лишней детализации."}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
