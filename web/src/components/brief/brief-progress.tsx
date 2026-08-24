import type { BriefLocale, BriefStepDefinition } from "@/lib/brief-submit";

type BriefProgressProps = {
  steps: BriefStepDefinition[];
  currentStep: number;
  locale: BriefLocale;
};

export function BriefProgress({ steps, currentStep, locale }: BriefProgressProps) {
  const completion = Math.round(((currentStep + 1) / steps.length) * 100);

  return (
    <div className="rounded-[1.5rem] border border-[#D8D0C4] bg-[#FBF8F2] p-4 shadow-[0_14px_38px_rgba(23,35,49,0.05)]">
      <div className="flex items-center justify-between gap-3 text-xs font-medium text-[#5C6670]">
        <span>
          {locale === "fr"
            ? `Étape ${currentStep + 1} sur ${steps.length}`
            : locale === "en"
              ? `Step ${currentStep + 1} of ${steps.length}`
              : `Шаг ${currentStep + 1} из ${steps.length}`}
        </span>
        <span>{completion}%</span>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-5">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isDone = index < currentStep;

          return (
            <div
              key={step.id}
              className={[
                "rounded-2xl border px-3 py-2 text-left text-xs leading-5 transition-colors",
                isActive
                  ? "border-[#1F6F78] bg-[#1F6F78] text-white"
                  : isDone
                    ? "border-[#A6C7CB] bg-[#EAF4F4] text-[#15585F]"
                    : "border-[#D8D0C4] bg-white text-[#5C6670]",
              ].join(" ")}
            >
              <div className="font-semibold">{String(index + 1).padStart(2, "0")}</div>
              <div>{step.title}</div>
            </div>
          );
        })}
      </div>

      <div className="mt-3 h-1.5 overflow-hidden rounded-md bg-[#E6DDD2]">
        <div
          className="h-full rounded-md bg-[#1F6F78] transition-all"
          style={{ width: `${completion}%` }}
        />
      </div>
    </div>
  );
}
