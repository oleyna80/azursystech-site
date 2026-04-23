import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { LOCALE_COOKIE_KEY } from "@/i18n";
import {
  buildBriefSubmissionPayload,
  resolveBriefLocale,
  type BriefLocale,
  type BriefSubmitApiResult,
  type BriefSubmitRequestBody,
  validateBriefValues,
} from "@/lib/brief-submit";

function jsonResult(statusCode: number, result: BriefSubmitApiResult) {
  return NextResponse.json(result, { status: statusCode });
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function toSafeBoolean(value: unknown): boolean {
  return typeof value === "boolean" ? value : false;
}

function toSafeNonNegativeInteger(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, Math.trunc(value));
}

function getRouteCopy(locale: BriefLocale) {
  if (locale === "fr") {
    return {
      unreadable: "Impossible de lire les données du brief. Vérifiez le formulaire et réessayez.",
      invalidJson: "Format JSON incorrect",
      invalidBrief: "Vérifiez les données du brief puis réessayez.",
      missingBrief: "Les données du brief sont absentes",
      requiredFields: "Vérifiez les champs obligatoires puis réessayez l’envoi.",
      success: "Le brief a bien été reçu. Les données sont prêtes pour une revue manuelle.",
    };
  }

  return {
    unreadable: "Не удалось прочитать данные брифа. Проверьте заполнение и попробуйте ещё раз.",
    invalidJson: "Некорректный формат JSON",
    invalidBrief: "Проверьте данные брифа и попробуйте ещё раз.",
    missingBrief: "Отсутствуют данные брифа",
    requiredFields: "Проверьте обязательные поля и попробуйте отправить бриф снова.",
    success: "Бриф получен. Данные готовы для ручной проверки.",
  };
}

export async function POST(request: Request) {
  let body: BriefSubmitRequestBody;
  const cookieStore = await cookies();
  const locale = resolveBriefLocale(
    typeof request.headers.get("x-azursystech-locale") === "string"
      ? request.headers.get("x-azursystech-locale")
      : (cookieStore.get(LOCALE_COOKIE_KEY)?.value ?? null),
  );
  const copy = getRouteCopy(locale);

  try {
    body = (await request.json()) as BriefSubmitRequestBody;
  } catch {
    return jsonResult(400, {
      success: false,
      message: copy.unreadable,
      issues: [{ field: "form", message: copy.invalidJson }],
    });
  }

  const bodyLocale = resolveBriefLocale(typeof body.locale === "string" ? body.locale : locale);
  const localizedCopy = getRouteCopy(bodyLocale);

  if (!isPlainObject(body) || !isPlainObject(body.values)) {
    return jsonResult(400, {
      success: false,
      message: localizedCopy.invalidBrief,
      issues: [{ field: "values", message: localizedCopy.missingBrief }],
    });
  }

  const validated = validateBriefValues(body.values, bodyLocale);
  if (validated.kind === "validation_error") {
    return jsonResult(400, {
      success: false,
      message: localizedCopy.requiredFields,
      issues: validated.issues,
    });
  }

  const payload = buildBriefSubmissionPayload(validated.values, {
    ai_assist_used: toSafeBoolean(body.ai_assist_used),
    assistant_interaction_count: toSafeNonNegativeInteger(body.assistant_interaction_count),
    created_at: new Date().toISOString(),
  }, bodyLocale);

  return jsonResult(200, {
    success: true,
    message: localizedCopy.success,
    payload,
    handoff: payload.crm_handoff,
  });
}
