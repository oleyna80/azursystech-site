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
import {
  getRateLimitKey,
  isAllowedMutationOrigin,
  readJsonWithLimit,
} from "@/lib/api-security";
import { isRateLimitedPersistent } from "@/lib/request-rate-limit";
import { buildBriefFormIdempotencyKey } from "@/lib/intake/briefs";
import {
  IntakeBriefPersistenceUnavailableError,
  saveIntakeBrief,
} from "@/lib/intake/brief-persistence";
import { IntakeBriefConversationNotFoundError } from "@/lib/intake/briefs";

const MAX_REQUEST_BODY_BYTES = 200_000;
const BRIEF_RATE_LIMIT_WINDOW_MS = 60_000;
const BRIEF_RATE_LIMIT_MAX = 5;
const BRIEF_RATE_LIMIT_MAX_KEYS = 10_000;

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
      tooLarge: "La demande est trop volumineuse. Raccourcissez le brief et réessayez.",
      rateLimited: "Trop d’envois à la suite. Attendez une minute puis réessayez.",
      forbidden: "La demande a été refusée. Rechargez la page puis réessayez.",
      invalidConversation: "Impossible de relier ce brief à la conversation indiquée.",
      persistenceUnavailable:
        "Impossible d’enregistrer le brief pour le moment. Réessayez dans quelques instants.",
      success: "Le brief a bien été reçu. Les données sont prêtes pour une revue manuelle.",
    };
  }

  return {
    unreadable: "Не удалось прочитать данные брифа. Проверьте заполнение и попробуйте ещё раз.",
    invalidJson: "Некорректный формат JSON",
    invalidBrief: "Проверьте данные брифа и попробуйте ещё раз.",
    missingBrief: "Отсутствуют данные брифа",
    requiredFields: "Проверьте обязательные поля и попробуйте отправить бриф снова.",
    tooLarge: "Слишком большой запрос. Сократите бриф и попробуйте снова.",
    rateLimited: "Слишком много отправок подряд. Пожалуйста, подождите минуту и попробуйте снова.",
    forbidden: "Запрос отклонен. Обновите страницу и попробуйте снова.",
    invalidConversation: "Не удалось связать бриф с указанной беседой.",
    persistenceUnavailable:
      "Не удалось сохранить бриф прямо сейчас. Пожалуйста, попробуйте ещё раз чуть позже.",
    success: "Бриф получен. Данные готовы для ручной проверки.",
  };
}

function toOptionalNonEmptyString(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const locale = resolveBriefLocale(
    typeof request.headers.get("x-azursystech-locale") === "string"
      ? request.headers.get("x-azursystech-locale")
      : (cookieStore.get(LOCALE_COOKIE_KEY)?.value ?? null),
  );
  const copy = getRouteCopy(locale);

  if (!isAllowedMutationOrigin(request)) {
    return jsonResult(403, {
      success: false,
      message: copy.forbidden,
      issues: [{ field: "form", message: copy.forbidden }],
    });
  }

  const isRateLimited = await isRateLimitedPersistent({
    scope: "brief_submit",
    key: getRateLimitKey(request),
    maxRequests: BRIEF_RATE_LIMIT_MAX,
    windowMs: BRIEF_RATE_LIMIT_WINDOW_MS,
    maxMemoryKeys: BRIEF_RATE_LIMIT_MAX_KEYS,
  });
  if (isRateLimited) {
    return jsonResult(429, {
      success: false,
      message: copy.rateLimited,
      issues: [{ field: "form", message: copy.rateLimited }],
    });
  }

  const parsedBody = await readJsonWithLimit<BriefSubmitRequestBody>(request, MAX_REQUEST_BODY_BYTES);
  if (!parsedBody.ok) {
    const isTooLarge = parsedBody.reason === "too_large";
    return jsonResult(isTooLarge ? 413 : 400, {
      success: false,
      message: isTooLarge ? copy.tooLarge : copy.unreadable,
      issues: [{ field: "form", message: isTooLarge ? copy.tooLarge : copy.invalidJson }],
    });
  }
  const body = parsedBody.value;

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

  const now = new Date();
  const conversationId =
    toOptionalNonEmptyString(body.conversationId) ??
    toOptionalNonEmptyString(body.conversation_id);
  const payload = buildBriefSubmissionPayload(
    validated.values,
    {
      ai_assist_used: toSafeBoolean(body.ai_assist_used),
      assistant_interaction_count: toSafeNonNegativeInteger(body.assistant_interaction_count),
      created_at: now.toISOString(),
    },
    bodyLocale,
  );

  try {
    const persistence = await saveIntakeBrief({
      idempotencyKey: buildBriefFormIdempotencyKey({
        values: validated.values,
        locale: bodyLocale,
        ...(conversationId ? { conversationId } : {}),
        now,
      }),
      source: "brief_form",
      status: "submitted",
      locale: bodyLocale,
      payload,
      handoff: payload.crm_handoff,
      ...(conversationId ? { conversationId } : {}),
      summary: payload.crm_handoff.summary,
      metadata: {
        completeness: "form_validated",
        idempotency_source: "backend_derived",
      },
      submittedAtUtc: payload.created_at,
    });

    if (persistence.status === "failed_open_dual") {
      return jsonResult(503, {
        success: false,
        message: localizedCopy.persistenceUnavailable,
        issues: [{ field: "form", message: localizedCopy.persistenceUnavailable }],
      });
    }
  } catch (error) {
    if (error instanceof IntakeBriefConversationNotFoundError) {
      return jsonResult(400, {
        success: false,
        message: localizedCopy.invalidConversation,
        issues: [{ field: "conversationId", message: localizedCopy.invalidConversation }],
      });
    }

    if (error instanceof IntakeBriefPersistenceUnavailableError) {
      return jsonResult(503, {
        success: false,
        message: localizedCopy.persistenceUnavailable,
        issues: [{ field: "form", message: localizedCopy.persistenceUnavailable }],
      });
    }

    throw error;
  }

  return jsonResult(200, {
    success: true,
    message: localizedCopy.success,
    payload,
    handoff: payload.crm_handoff,
  });
}
